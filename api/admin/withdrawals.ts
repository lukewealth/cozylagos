import { connectToDatabase } from '../../src/lib/mongodb';
import { authenticateRequest, authorizeRole, validateRequestBody, addSecurityHeaders, logAudit, checkRateLimit } from '../../src/lib/middleware';
import { sanitizeInput, generateReference } from '../../src/lib/security';
import { ObjectId } from 'mongodb';

export default async function handler(req: any, res: any) {
  addSecurityHeaders(res);
  const { method } = req;

  try {
    const rateCheck = checkRateLimit(req, 60, 60000);
    if (!rateCheck.allowed) {
      return res.status(429).json({ success: false, message: 'Too many requests' });
    }

    const { db } = await connectToDatabase();
    const withdrawalsCollection = db.collection('withdrawals');
    const transactionsCollection = db.collection('transactions');

    switch (method) {
      case 'GET': {
        const auth = authenticateRequest(req);
        if (!auth.authenticated) {
          return res.status(401).json({ success: false, message: auth.error });
        }

        const { status, providerId } = req.query;
        let filter: any = {};

        if (status) filter.status = status;
        if (providerId) filter.providerId = providerId;

        // Non-admin users can only see their own withdrawals
        if (auth.user.role !== 'admin' && auth.user.role !== 'super_admin') {
          filter.providerId = auth.user.userId;
        }

        const withdrawals = await withdrawalsCollection
          .find(filter)
          .sort({ createdAt: -1 })
          .toArray();

        return res.status(200).json({ success: true, data: withdrawals });
      }

      case 'POST': {
        const auth = authenticateRequest(req);
        if (!auth.authenticated) {
          return res.status(401).json({ success: false, message: auth.error });
        }

        const validation = validateRequestBody(req.body, {
          amount: { type: 'number', required: true, min: 1000 },
          method: { type: 'string', required: true },
        });
        if (!validation.valid) {
          return res.status(400).json({ success: false, message: validation.errors.join(', ') });
        }

        const { amount, method, bankDetails, notes } = req.body;

        // Check available balance
        const providerTransactions = await transactionsCollection
          .find({
            userId: auth.user.userId,
            type: 'payout',
            status: 'processed'
          })
          .toArray();

        const totalEarned = providerTransactions.reduce((sum: number, t: any) => sum + (t.amount || 0), 0);

        // Check pending withdrawals
        const pendingWithdrawals = await withdrawalsCollection
          .find({
            providerId: auth.user.userId,
            status: { $in: ['pending', 'processing'] }
          })
          .toArray();

        const totalPending = pendingWithdrawals.reduce((sum: number, w: any) => sum + (w.amount || 0), 0);
        const availableBalance = totalEarned - totalPending;

        if (amount > availableBalance) {
          return res.status(400).json({
            success: false,
            message: 'Insufficient balance',
            availableBalance
          });
        }

        const withdrawal = {
          reference: generateReference('WTH'),
          providerId: auth.user.userId,
          providerName: auth.user.name || 'Service Provider',
          providerEmail: auth.user.email,
          amount: parseFloat(amount),
          method,
          bankDetails: bankDetails ? sanitizeInput(JSON.stringify(bankDetails)) : null,
          notes: notes ? sanitizeInput(notes) : '',
          status: 'pending',
          requestedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const result = await withdrawalsCollection.insertOne(withdrawal);

        logAudit('WITHDRAWAL_REQUESTED', auth.user.userId, {
          withdrawalId: result.insertedId.toString(),
          amount: withdrawal.amount,
          method: withdrawal.method
        });

        return res.status(201).json({
          success: true,
          data: { ...withdrawal, _id: result.insertedId },
          message: 'Withdrawal request submitted successfully'
        });
      }

      case 'PATCH': {
        const auth = authenticateRequest(req);
        if (!auth.authenticated) {
          return res.status(401).json({ success: false, message: auth.error });
        }

        if (!authorizeRole('admin', auth.user.role)) {
          return res.status(403).json({ success: false, message: 'Admin access required' });
        }

        const { id, status, adminNotes, rejectionReason } = req.body;
        if (!id) {
          return res.status(400).json({ success: false, message: 'Withdrawal ID is required' });
        }

        const updateFields: any = {
          updatedAt: new Date().toISOString(),
          reviewedBy: auth.user.userId,
          reviewedAt: new Date().toISOString()
        };

        if (status) updateFields.status = status;
        if (adminNotes) updateFields.adminNotes = sanitizeInput(adminNotes);
        if (rejectionReason) updateFields.rejectionReason = sanitizeInput(rejectionReason);

        if (status === 'completed') {
          updateFields.completedAt = new Date().toISOString();

          // Create a transaction record for the withdrawal
          const withdrawal = await withdrawalsCollection.findOne({ _id: new ObjectId(id) });
          if (withdrawal) {
            await transactionsCollection.insertOne({
              reference: generateReference('TX'),
              userId: withdrawal.providerId,
              type: 'withdrawal',
              amount: -withdrawal.amount,
              status: 'processed',
              description: `Withdrawal ${withdrawal.reference} processed`,
              withdrawalId: id,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
          }
        }

        const result = await withdrawalsCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updateFields }
        );

        if (result.matchedCount === 0) {
          return res.status(404).json({ success: false, message: 'Withdrawal not found' });
        }

        logAudit('WITHDRAWAL_UPDATED', auth.user.userId, {
          withdrawalId: id,
          status
        });

        return res.status(200).json({ success: true, message: 'Withdrawal updated successfully' });
      }

      default:
        return res.status(405).json({ success: false, message: `Method ${method} not allowed` });
    }
  } catch (error: any) {
    console.error('Withdrawals API error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
