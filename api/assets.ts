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
        const { providerId, type, listingId, serviceId } = req.query;
        let filter: any = {};

        if (providerId) filter.providerId = providerId;
        if (type) filter.type = type;
        if (listingId) filter.listingId = listingId;
        if (serviceId) filter.serviceId = serviceId;

        const assets = await assetsCollection.find(filter).sort({ createdAt: -1 }).toArray();
        return res.status(200).json({ success: true, data: assets, count: assets.length });
      }

      case 'POST': {
        const auth = authenticateRequest(req);
        if (!auth.authenticated) {
          return res.status(401).json({ success: false, message: auth.error });
        }

        const validation = validateRequestBody(req.body, {
          name: { type: 'string', required: true },
          type: { type: 'string', required: true },
          url: { type: 'string', required: true },
        });
        if (!validation.valid) {
          return res.status(400).json({ success: false, message: validation.errors.join(', ') });
        }

        const { name, type, url, listingId, serviceId, metadata } = req.body;

        const newAsset = {
          name: sanitizeInput(name),
          type: sanitizeInput(type),
          url: sanitizeInput(url),
          providerId: auth.user.userId,
          listingId: listingId || null,
          serviceId: serviceId || null,
          metadata: metadata || {},
          size: req.body.size || 0,
          mimeType: req.body.mimeType || 'image/jpeg',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const result = await assetsCollection.insertOne(newAsset);
        logAudit('ASSET_CREATED', auth.user.userId, { 
          assetId: result.insertedId.toString(),
          type,
          name 
        });

        return res.status(201).json({ 
          success: true, 
          data: { ...newAsset, _id: result.insertedId },
          message: 'Asset uploaded successfully'
        });
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
        const allowedFields = ['name', 'type', 'url', 'metadata', 'listingId', 'serviceId'];
        
        for (const field of allowedFields) {
          if (updateData[field] !== undefined) {
            sanitized[field] = typeof updateData[field] === 'string' 
              ? sanitizeInput(updateData[field]) 
              : updateData[field];
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

      case 'DELETE': {
        const auth = authenticateRequest(req);
        if (!auth.authenticated) {
          return res.status(401).json({ success: false, message: auth.error });
        }

        const { id } = req.body;
        if (!id) {
          return res.status(400).json({ success: false, message: 'Asset ID is required' });
        }

        const deleteResult = await assetsCollection.deleteOne({ _id: new ObjectId(id) });
        if (deleteResult.deletedCount === 0) {
          return res.status(404).json({ success: false, message: 'Asset not found' });
        }

        logAudit('ASSET_DELETED', auth.user.userId, { assetId: id });
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
