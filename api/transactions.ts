import { connectToDatabase } from '../src/lib/mongodb';

export default async function handler(req: any, res: any) {
  const { method } = req;

  try {
    const { db } = await connectToDatabase();
    const transactionsCollection = db.collection('transactions');

    switch (method) {
      case 'GET': {
        const { userId, type, status } = req.query;
        let filter: any = {};
        if (userId) filter.userId = userId;
        if (type) filter.type = type;
        if (status) filter.status = status;

        const transactions = await transactionsCollection.find(filter).sort({ createdAt: -1 }).toArray();
        res.status(200).json({ success: true, data: transactions });
        break;
      }

      case 'POST': {
        const txData = req.body;
        if (!txData.amount || !txData.userId) {
          return res.status(400).json({ success: false, message: 'Missing required fields: amount, userId' });
        }

        const newTx = {
          ...txData,
          reference: txData.reference || `TX-${Date.now().toString(36).toUpperCase()}`,
          status: txData.status || 'pending',
          date: txData.date || new Date().toISOString(),
          createdAt: new Date().toISOString(),
        };

        const result = await transactionsCollection.insertOne(newTx);
        res.status(201).json({ success: true, data: { ...newTx, _id: result.insertedId } });
        break;
      }

      case 'PATCH': {
        const { id, status } = req.body;
        if (!id) {
          return res.status(400).json({ success: false, message: 'Transaction ID is required' });
        }

        const updateResult = await transactionsCollection.updateOne(
          { _id: id as any },
          { $set: { status, updatedAt: new Date().toISOString() } }
        );

        if (updateResult.matchedCount === 0) {
          return res.status(404).json({ success: false, message: 'Transaction not found' });
        }

        res.status(200).json({ success: true, message: 'Transaction updated successfully' });
        break;
      }

      case 'DELETE': {
        const { id: deleteId } = req.body;
        if (!deleteId) {
          return res.status(400).json({ success: false, message: 'Transaction ID is required' });
        }

        const deleteResult = await transactionsCollection.deleteOne({ _id: deleteId as any });
        if (deleteResult.deletedCount === 0) {
          return res.status(404).json({ success: false, message: 'Transaction not found' });
        }

        res.status(200).json({ success: true, message: 'Transaction deleted successfully' });
        break;
      }

      default:
        res.status(405).json({ success: false, message: `Method ${method} not allowed` });
    }
  } catch (error: any) {
    console.error('Transactions API error:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
}
