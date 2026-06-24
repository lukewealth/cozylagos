import { connectToDatabase } from '../src/lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const { method } = req;

  try {
    const { db } = await connectToDatabase();
    const transactionsCollection = db.collection('transactions');

    switch (method) {
      case 'GET':
        // Get all transactions or filter
        const { userId, type, status } = req.query;
        let filter = {};
        
        if (userId) filter = { userId };
        if (type) filter = { type };
        if (status) filter = { status };

        const transactions = await transactionsCollection
          .find(filter)
          .sort({ date: -1 })
          .toArray();
        
        res.status(200).json({ success: true, data: transactions });
        break;

      case 'POST':
        // Create new transaction
        const transactionData = req.body;

        if (!transactionData.userId || !transactionData.amount || !transactionData.type) {
          return res.status(400).json({ 
            success: false, 
            message: 'Missing required fields: userId, amount, type' 
          });
        }

        const newTransaction = {
          ...transactionData,
          reference: transactionData.reference || `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          status: transactionData.status || 'pending',
          date: transactionData.date || new Date().toISOString().split('T')[0],
          createdAt: new Date().toISOString(),
        };

        const result = await transactionsCollection.insertOne(newTransaction);
        
        res.status(201).json({ 
          success: true, 
          data: { ...newTransaction, _id: result.insertedId }
        });
        break;

      case 'PATCH':
        // Update transaction status (for payouts)
        const { id, status } = req.body;

        if (!id || !status) {
          return res.status(400).json({ 
            success: false, 
            message: 'Transaction ID and status are required' 
          });
        }

        const validStatuses = ['pending', 'processed', 'failed'];
        if (!validStatuses.includes(status)) {
          return res.status(400).json({ 
            success: false, 
            message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
          });
        }

        const updateResult = await transactionsCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { status, updatedAt: new Date().toISOString() } }
        );

        if (updateResult.matchedCount === 0) {
          return res.status(404).json({ 
            success: false, 
            message: 'Transaction not found' 
          });
        }

        res.status(200).json({ 
          success: true, 
          message: `Transaction ${status} successfully` 
        });
        break;

      default:
        res.status(405).json({ 
          success: false, 
          message: `Method ${method} not allowed` 
        });
    }
  } catch (error) {
    console.error('Transactions API error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
}
