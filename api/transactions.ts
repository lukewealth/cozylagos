import { connectToDatabase } from '../src/lib/mongodb';
import { authenticateRequest, validateRequestBody, addSecurityHeaders, logAudit, checkRateLimit } from '../src/lib/middleware';
import { sanitizeInput } from '../src/lib/security';
import { ObjectId } from 'mongodb';

export default async function handler(req: any, res: any) {
  addSecurityHeaders(res);
  const { method } = req;

  try {
    const rateCheck = checkRateLimit(req, 100, 60000);
    if (!rateCheck.allowed) {
      return res.status(429).json({ success: false, message: 'Too many requests' });
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

        const summary = {
          total: transactions.length,
          totalAmount: transactions.reduce((sum: number, t: any) => sum + (t.amount || 0), 0),
          pending: transactions.filter((t: any) => t.status === 'pending').reduce((sum: number, t: any) => sum + (t.amount || 0), 0),
          processed: transactions.filter((t: any) => t.status === 'processed').reduce((sum: number, t: any) => sum + (t.amount || 0), 0),
          byType: transactions.reduce((acc: any, t: any) => {
            acc[t.type] = (acc[t.type] || 0) + (t.amount || 0);
            return acc;
          }, {}),
        };

        return res.status(200).json({ success: true, data: transactions, summary });
      }

      case 'POST': {
        const auth = authenticateRequest(req);
        if (!auth.authenticated) {
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
        const newTx = {
          ...txData,
          reference: txData.reference || `TX-${Date.now().toString(36).toUpperCase()}`,
          status: txData.status || 'pending',
          date: txData.date || new Date().toISOString(),
          description: txData.description ? sanitizeInput(txData.description) : '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const result = await transactionsCollection.insertOne(newTx);
        logAudit('TRANSACTION_CREATED', auth.user.userId, { transactionId: result.insertedId.toString(), amount: txData.amount });

        return res.status(201).json({ success: true, data: { ...newTx, _id: result.insertedId } });
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

      default:
        return res.status(405).json({ success: false, message: `Method ${method} not allowed` });
    }
  } catch (error: any) {
    console.error('Transactions API error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
