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
    const assetsCollection = db.collection('assets');

    switch (method) {
      case 'GET': {
        const { category, status, assignedTo, search } = req.query;
        let filter: any = {};
        if (category) filter.category = category;
        if (status) filter.status = status;
        if (assignedTo) filter.assignedTo = assignedTo;
        if (search) {
          filter.$or = [
            { name: { $regex: search, $options: 'i' } },
            { assetCode: { $regex: search, $options: 'i' } },
          ];
        }

        const assets = await assetsCollection.find(filter).sort({ createdAt: -1 }).toArray();
        return res.status(200).json({ success: true, data: assets, count: assets.length });
      }

      case 'POST': {
        const auth = authenticateRequest(req);
        if (!auth.authenticated) {
          return res.status(401).json({ success: false, message: auth.error });
        }

        const validation = validateRequestBody(req.body, {
          name: { type: 'string', required: true, min: 2, max: 200 },
          assetCode: { type: 'string', required: true, min: 2 },
        });
        if (!validation.valid) {
          return res.status(400).json({ success: false, message: validation.errors.join(', ') });
        }

        const assetData = req.body;
        const sanitizedCode = sanitizeInput(assetData.assetCode);

        const existing = await assetsCollection.findOne({ assetCode: sanitizedCode });
        if (existing) {
          return res.status(409).json({ success: false, message: 'Asset with this code already exists' });
        }

        const newAsset = {
          ...assetData,
          name: sanitizeInput(assetData.name),
          assetCode: sanitizedCode,
          status: assetData.status || 'available',
          tags: assetData.tags || [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const result = await assetsCollection.insertOne(newAsset);
        logAudit('ASSET_CREATED', auth.user.userId, { assetId: result.insertedId.toString(), assetCode: sanitizedCode });

        return res.status(201).json({ success: true, data: { ...newAsset, _id: result.insertedId } });
      }

      case 'PUT': {
        const auth = authenticateRequest(req);
        if (!auth.authenticated) {
          return res.status(401).json({ success: false, message: auth.error });
        }

        const { id, ...updateData } = req.body;
        if (!id) {
          return res.status(400).json({ success: false, message: 'Asset ID is required' });
        }

        const sanitized: any = { updatedAt: new Date().toISOString() };
        const allowedFields = ['name', 'category', 'status', 'assetCode', 'image', 'assignedTo', 'lastServiceDate', 'tags', 'notes'];
        
        for (const field of allowedFields) {
          if (updateData[field] !== undefined) {
            sanitized[field] = typeof updateData[field] === 'string' ? sanitizeInput(updateData[field]) : updateData[field];
          }
        }

        const updateResult = await assetsCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: sanitized }
        );

        if (updateResult.matchedCount === 0) {
          return res.status(404).json({ success: false, message: 'Asset not found' });
        }

        logAudit('ASSET_UPDATED', auth.user.userId, { assetId: id });
        return res.status(200).json({ success: true, message: 'Asset updated successfully' });
      }

      case 'PATCH': {
        const auth = authenticateRequest(req);
        if (!auth.authenticated) {
          return res.status(401).json({ success: false, message: auth.error });
        }

        const { id, status, assignedTo } = req.body;
        if (!id) {
          return res.status(400).json({ success: false, message: 'Asset ID is required' });
        }

        const updateFields: any = { updatedAt: new Date().toISOString() };
        if (status) updateFields.status = status;
        if (assignedTo !== undefined) updateFields.assignedTo = assignedTo;

        const updateResult = await assetsCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updateFields }
        );

        if (updateResult.matchedCount === 0) {
          return res.status(404).json({ success: false, message: 'Asset not found' });
        }

        logAudit('ASSET_PATCHED', auth.user.userId, { assetId: id, status });
        return res.status(200).json({ success: true, message: 'Asset updated successfully' });
      }

      case 'DELETE': {
        const auth = authenticateRequest(req);
        if (!auth.authenticated) {
          return res.status(401).json({ success: false, message: auth.error });
        }

        const { id: deleteId } = req.body;
        if (!deleteId) {
          return res.status(400).json({ success: false, message: 'Asset ID is required' });
        }

        const deleteResult = await assetsCollection.deleteOne({ _id: new ObjectId(deleteId) });
        if (deleteResult.deletedCount === 0) {
          return res.status(404).json({ success: false, message: 'Asset not found' });
        }

        logAudit('ASSET_DELETED', auth.user.userId, { assetId: deleteId });
        return res.status(200).json({ success: true, message: 'Asset deleted successfully' });
      }

      default:
        return res.status(405).json({ success: false, message: `Method ${method} not allowed` });
    }
  } catch (error: any) {
    console.error('Assets API error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
