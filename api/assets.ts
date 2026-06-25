import { connectToDatabase } from '../src/lib/mongodb';

export default async function handler(req: any, res: any) {
  const { method } = req;

  try {
    const { db } = await connectToDatabase();
    const assetsCollection = db.collection('assets');

    switch (method) {
      case 'GET': {
        const { category, status, assignedTo } = req.query;
        let filter: any = {};
        if (category) filter.category = category;
        if (status) filter.status = status;
        if (assignedTo) filter.assignedTo = assignedTo;

        const assets = await assetsCollection.find(filter).sort({ createdAt: -1 }).toArray();
        res.status(200).json({ success: true, data: assets });
        break;
      }

      case 'POST': {
        const assetData = req.body;
        if (!assetData.name || !assetData.assetCode) {
          return res.status(400).json({ success: false, message: 'Missing required fields: name, assetCode' });
        }

        const existing = await assetsCollection.findOne({ assetCode: assetData.assetCode });
        if (existing) {
          return res.status(409).json({ success: false, message: 'Asset with this code already exists' });
        }

        const newAsset = {
          ...assetData,
          status: assetData.status || 'available',
          tags: assetData.tags || [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const result = await assetsCollection.insertOne(newAsset);
        res.status(201).json({ success: true, data: { ...newAsset, _id: result.insertedId } });
        break;
      }

      case 'PUT': {
        const { id, ...updateData } = req.body;
        if (!id) {
          return res.status(400).json({ success: false, message: 'Asset ID is required' });
        }

        const updateResult = await assetsCollection.updateOne(
          { _id: id as any },
          { $set: { ...updateData, updatedAt: new Date().toISOString() } }
        );

        if (updateResult.matchedCount === 0) {
          return res.status(404).json({ success: false, message: 'Asset not found' });
        }

        res.status(200).json({ success: true, message: 'Asset updated successfully' });
        break;
      }

      case 'PATCH': {
        const { id, status, assignedTo } = req.body;
        if (!id) {
          return res.status(400).json({ success: false, message: 'Asset ID is required' });
        }

        const updateFields: any = { updatedAt: new Date().toISOString() };
        if (status) updateFields.status = status;
        if (assignedTo !== undefined) updateFields.assignedTo = assignedTo;

        const updateResult = await assetsCollection.updateOne(
          { _id: id as any },
          { $set: updateFields }
        );

        if (updateResult.matchedCount === 0) {
          return res.status(404).json({ success: false, message: 'Asset not found' });
        }

        res.status(200).json({ success: true, message: 'Asset updated successfully' });
        break;
      }

      case 'DELETE': {
        const { id: deleteId } = req.body;
        if (!deleteId) {
          return res.status(400).json({ success: false, message: 'Asset ID is required' });
        }

        const deleteResult = await assetsCollection.deleteOne({ _id: deleteId as any });
        if (deleteResult.deletedCount === 0) {
          return res.status(404).json({ success: false, message: 'Asset not found' });
        }

        res.status(200).json({ success: true, message: 'Asset deleted successfully' });
        break;
      }

      default:
        res.status(405).json({ success: false, message: `Method ${method} not allowed` });
    }
  } catch (error: any) {
    console.error('Assets API error:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
}
