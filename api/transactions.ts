import { connectToDatabase } from '../src/lib/mongodb';
import { authenticateRequest, validateRequestBody, addSecurityHeaders, logAudit, checkRateLimit, detectSecurityThreat, logSecurityEvent } from '../src/lib/middleware';
import { sanitizeInput, encryptSensitiveData, decryptSensitiveData, generateReference } from '../src/lib/security';
import { ObjectId } from 'mongodb';

export default async function handler(req: any, res: any) {
  addSecurityHeaders(res);
  const { method } = req;

  try {
    // Rate limiting
    const rateCheck = checkRateLimit(req, 100, 60000);
    if (!rateCheck.allowed) {
      logSecurityEvent({
        type: 'RATE_LIMIT_EXCEEDED',
        severity: 'medium',
        details: { endpoint: req.url, ip: req.headers?.['x-forwarded-for'] },
      });
      return res.status(429).json({ success: false, message: 'Too many requests' });
    }

    // Threat detection
    const threatCheck = detectSecurityThreat(req);
    if (threatCheck.isThreat) {
      logSecurityEvent({
        type: threatCheck.threatType || 'SECURITY_THREAT',
        severity: threatCheck.severity || 'high',
        details: { endpoint: req.url, ip: req.headers?.['x-forwarded-for'] },
      });
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const { db } = await connectToDatabase();
    const transactionsCollection = db.collection('transactions');

    switch (method) {
      case 'GET': {
        const auth = authenticateRequest(req);
        if (!auth.authenticated) {
          return res.status(401).json({ success: false, message: auth.error });
        }

        const { userId, type, status, startDate, endDate } = req.query;
        let filter: any = {};
        if (userId) filter.userId = userId;
        if (type) filter.type = type;
        if (status) filter.status = status;
        if (startDate || endDate) {
          filter.createdAt = {};
          if (startDate) filter.createdAt.$gte = startDate;
          if (endDate) filter.createdAt.$lte = endDate;
        }

        if (auth.user.role !== 'admin' && auth.user.role !== 'super_admin') {
          filter.userId = auth.user.userId;
        }

        const transactions = await transactionsCollection.find(filter).sort({ createdAt: -1 }).toArray();

        // Decrypt sensitive fields for authorized users
        const decryptedTransactions = transactions.map((tx: any) => {
          if (tx.encrypted) {
            const sensitiveFields = ['cardNumber', 'cvv', 'bankAccount'];
            const decrypted = decryptSensitiveData(tx, sensitiveFields);
            
            // Only return sensitive data to admins or the transaction owner
            if (auth.user.role !== 'admin' && auth.user.role !== 'super_admin' && tx.userId !== auth.user.userId) {
              // Remove sensitive fields for non-owners
              const { cardNumber, cvv, bankAccount, ...safeData } = decrypted;
              return safeData;
            }
            
            return decrypted;
          }
          return tx;
        });

        const summary = {
          total: decryptedTransactions.length,
          totalAmount: decryptedTransactions.reduce((sum: number, t: any) => sum + (t.amount || 0), 0),
          pending: decryptedTransactions.filter((t: any) => t.status === 'pending').reduce((sum: number, t: any) => sum + (t.amount || 0), 0),
          processed: decryptedTransactions.filter((t: any) => t.status === 'processed').reduce((sum: number, t: any) => sum + (t.amount || 0), 0),
          byType: decryptedTransactions.reduce((acc: any, t: any) => {
            acc[t.type] = (acc[t.type] || 0) + (t.amount || 0);
            return acc;
          }, {}),
        };

        logAudit('DATA_ACCESS', auth.user.userId, { 
          endpoint: '/api/transactions', 
          method: 'GET',
          count: decryptedTransactions.length,
        });

        return res.status(200).json({ success: true, data: decryptedTransactions, summary });
      }

      case 'POST': {
        const auth = authenticateRequest(req);
        if (!auth.authenticated) {
          logAudit('AUTH_FAILURE', 'unknown', { endpoint: '/api/transactions', method: 'POST' });
          return res.status(401).json({ success: false, message: auth.error });
        }

        const validation = validateRequestBody(req.body, {
          amount: { type: 'number', required: true, min: 0 },
          userId: { type: 'string', required: true },
        });
        if (!validation.valid) {
          return res.status(400).json({ success: false, message: validation.errors.join(', ') });
        }

        const txData = req.body;
        
        // Encrypt sensitive fields before storing
        const sensitiveFields = ['cardNumber', 'cvv', 'bankAccount'];
        const encryptedTxData = encryptSensitiveData(txData, sensitiveFields);
        
        const newTx = {
          ...encryptedTxData,
          reference: txData.reference || generateReference('TX'),
          status: txData.status || 'pending',
          date: txData.date || new Date().toISOString(),
          description: txData.description ? sanitizeInput(txData.description) : '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          encrypted: true,
        };

        const result = await transactionsCollection.insertOne(newTx);
        
        logAudit('TRANSACTION_CREATED', auth.user.userId, { 
          transactionId: result.insertedId.toString(), 
          amount: txData.amount,
          reference: newTx.reference,
          encrypted: true,
        });

        logSecurityEvent({
          type: 'PAYMENT_PROCESSING',
          severity: 'medium',
          details: {
            userId: auth.user.userId,
            amount: txData.amount,
            transactionId: result.insertedId.toString(),
          },
          userId: auth.user.userId,
        });

        // Return data without sensitive encrypted fields
        const { cardNumber, cvv, bankAccount, ...safeTxData } = newTx;
        return res.status(201).json({ success: true, data: { ...safeTxData, _id: result.insertedId } });
      }

      case 'PATCH': {
        const auth = authenticateRequest(req);
        if (!auth.authenticated) {
          return res.status(401).json({ success: false, message: auth.error });
        }

        const { id, status, description } = req.body;
        if (!id) {
          return res.status(400).json({ success: false, message: 'Transaction ID is required' });
        }

        const updateFields: any = { updatedAt: new Date().toISOString() };
        if (status) updateFields.status = status;
        if (description) updateFields.description = sanitizeInput(description);

        const updateResult = await transactionsCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updateFields }
        );

        if (updateResult.matchedCount === 0) {
          return res.status(404).json({ success: false, message: 'Transaction not found' });
        }

        logAudit('TRANSACTION_UPDATED', auth.user.userId, { transactionId: id, status });
        return res.status(200).json({ success: true, message: 'Transaction updated successfully' });
      }

      case 'DELETE': {
        const auth = authenticateRequest(req);
        if (!auth.authenticated) {
          return res.status(401).json({ success: false, message: auth.error });
        }

        const { id: deleteId } = req.body;
        if (!deleteId) {
          return res.status(400).json({ success: false, message: 'Transaction ID is required' });
        }

        const deleteResult = await transactionsCollection.deleteOne({ _id: new ObjectId(deleteId) });
        if (deleteResult.deletedCount === 0) {
          return res.status(404).json({ success: false, message: 'Transaction not found' });
        }

        logAudit('TRANSACTION_DELETED', auth.user.userId, { transactionId: deleteId });
        return res.status(200).json({ success: true, message: 'Transaction deleted successfully' });
      }

      case 'PUT': {
        const auth = authenticateRequest(req);
        if (!auth.authenticated) {
          return res.status(401).json({ success: false, message: auth.error });
        }

        const { action } = req.body;
        
        // Flush transactions - archive old and start fresh
        if (action === 'flush') {
          const { providerId, flushBefore } = req.body;
          
          if (!providerId) {
            return res.status(400).json({ success: false, message: 'Provider ID is required' });
          }

          // Only allow SPs to flush their own transactions, or admins to flush any
          if (auth.user.role !== 'admin' && auth.user.role !== 'super_admin' && auth.user.userId !== providerId) {
            return res.status(403).json({ success: false, message: 'Unauthorized to flush these transactions' });
          }

          const flushDate = flushBefore ? new Date(flushBefore) : new Date();
          
          // Archive old transactions
          const archiveResult = await transactionsCollection.updateMany(
            { 
              userId: providerId,
              createdAt: { $lt: flushDate.toISOString() },
              archived: { $ne: true }
            },
            { 
              $set: { 
                archived: true, 
                archivedAt: new Date().toISOString(),
                archivedBy: auth.user.userId
              } 
            }
          );

          logAudit('TRANSACTIONS_FLUSHED', auth.user.userId, { 
            providerId,
            flushDate: flushDate.toISOString(),
            archivedCount: archiveResult.modifiedCount
          });

          return res.status(200).json({ 
            success: true, 
            message: 'Transactions flushed successfully',
            data: {
              archivedCount: archiveResult.modifiedCount,
              flushDate: flushDate.toISOString()
            }
          });
        }

        return res.status(400).json({ success: false, message: 'Invalid action' });
      }

      default:
        return res.status(405).json({ success: false, message: `Method ${method} not allowed` });
    }
  } catch (error: any) {
    console.error('Transactions API error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
