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
    const staffCollection = db.collection('staff');
    const assetsCollection = db.collection('assets');
    const servicesCollection = db.collection('services');

    switch (method) {
      case 'GET': {
        const auth = authenticateRequest(req);
        if (!auth.authenticated) {
          return res.status(401).json({ success: false, message: auth.error });
        }

        const path = req.url || '';
        const { providerId, category, status } = req.query;

        if (path.includes('/staff')) {
          let filter: any = {};
          if (providerId) filter.providerId = providerId;
          if (status) filter.status = status;

          const staff = await staffCollection.find(filter).sort({ name: 1 }).toArray();
          return res.status(200).json({ success: true, data: staff });
        }

        if (path.includes('/assets')) {
          let filter: any = {};
          if (category) filter.category = category;
          if (status) filter.status = status;

          const assets = await assetsCollection.find(filter).sort({ createdAt: -1 }).toArray();
          return res.status(200).json({ success: true, data: assets });
        }

        if (path.includes('/services')) {
          let filter: any = {};
          if (providerId) filter.providerId = providerId;
          if (category) filter.category = category;

          const services = await servicesCollection.find(filter).sort({ createdAt: -1 }).toArray();
          return res.status(200).json({ success: true, data: services });
        }

        return res.status(404).json({ success: false, message: 'Endpoint not found' });
      }

      case 'POST': {
        const auth = authenticateRequest(req);
        if (!auth.authenticated) {
          return res.status(401).json({ success: false, message: auth.error });
        }

        const path = req.url || '';

        if (path.includes('/staff')) {
          const validation = validateRequestBody(req.body, {
            name: { type: 'string', required: true },
            role: { type: 'string', required: true },
          });
          if (!validation.valid) {
            return res.status(400).json({ success: false, message: validation.errors.join(', ') });
          }

          const staffData = req.body;
          const newStaff = {
            ...staffData,
            name: sanitizeInput(staffData.name),
            status: staffData.status || 'available',
            certifications: staffData.certifications || [],
            specializations: staffData.specializations || [],
            rating: 0,
            tenureYears: 0,
            providerId: auth.user.userId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          const result = await staffCollection.insertOne(newStaff);
          logAudit('STAFF_CREATED', auth.user.userId, { staffId: result.insertedId.toString() });

          return res.status(201).json({ success: true, data: { ...newStaff, _id: result.insertedId } });
        }

        if (path.includes('/assets')) {
          const validation = validateRequestBody(req.body, {
            name: { type: 'string', required: true },
            assetCode: { type: 'string', required: true },
          });
          if (!validation.valid) {
            return res.status(400).json({ success: false, message: validation.errors.join(', ') });
          }

          const assetData = req.body;
          const assetCode = sanitizeInput(assetData.assetCode);

          const existing = await assetsCollection.findOne({ assetCode });
          if (existing) {
            return res.status(409).json({ success: false, message: 'Asset code already exists' });
          }

          const newAsset = {
            ...assetData,
            name: sanitizeInput(assetData.name),
            assetCode,
            status: assetData.status || 'available',
            tags: assetData.tags || [],
            providerId: auth.user.userId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          const result = await assetsCollection.insertOne(newAsset);
          logAudit('ASSET_CREATED', auth.user.userId, { assetId: result.insertedId.toString() });

          return res.status(201).json({ success: true, data: { ...newAsset, _id: result.insertedId } });
        }

        if (path.includes('/services')) {
          const validation = validateRequestBody(req.body, {
            title: { type: 'string', required: true },
            category: { type: 'string', required: true },
          });
          if (!validation.valid) {
            return res.status(400).json({ success: false, message: validation.errors.join(', ') });
          }

          const serviceData = req.body;
          const newService = {
            ...serviceData,
            title: sanitizeInput(serviceData.title),
            description: serviceData.description ? sanitizeInput(serviceData.description) : '',
            category: serviceData.category,
            price: serviceData.price || 0,
            priceUnit: serviceData.priceUnit || 'per_session',
            location: serviceData.location || '',
            image: serviceData.image || '',
            images: serviceData.images || [],
            amenities: serviceData.amenities || [],
            providerId: auth.user.userId,
            providerName: auth.user.name || 'Service Provider',
            verified: false,
            available: true,
            rating: 0,
            reviewsCount: 0,
            staffAssigned: serviceData.staffAssigned || [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          const result = await servicesCollection.insertOne(newService);
          logAudit('SERVICE_CREATED', auth.user.userId, { serviceId: result.insertedId.toString() });

          return res.status(201).json({ success: true, data: { ...newService, _id: result.insertedId } });
        }

        return res.status(404).json({ success: false, message: 'Endpoint not found' });
      }

      case 'PUT': {
        const auth = authenticateRequest(req);
        if (!auth.authenticated) {
          return res.status(401).json({ success: false, message: auth.error });
        }

        const path = req.url || '';
        const { id, ...updateData } = req.body;

        if (!id) {
          return res.status(400).json({ success: false, message: 'ID is required' });
        }

        const sanitized: any = { updatedAt: new Date().toISOString() };
        for (const [key, value] of Object.entries(updateData)) {
          if (typeof value === 'string') {
            sanitized[key] = sanitizeInput(value);
          } else {
            sanitized[key] = value;
          }
        }

        if (path.includes('/staff')) {
          const result = await staffCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: sanitized }
          );
          if (result.matchedCount === 0) {
            return res.status(404).json({ success: false, message: 'Staff not found' });
          }
          logAudit('STAFF_UPDATED', auth.user.userId, { staffId: id });
          return res.status(200).json({ success: true, message: 'Staff updated' });
        }

        if (path.includes('/assets')) {
          const result = await assetsCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: sanitized }
          );
          if (result.matchedCount === 0) {
            return res.status(404).json({ success: false, message: 'Asset not found' });
          }
          logAudit('ASSET_UPDATED', auth.user.userId, { assetId: id });
          return res.status(200).json({ success: true, message: 'Asset updated' });
        }

        if (path.includes('/services')) {
          const result = await servicesCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: sanitized }
          );
          if (result.matchedCount === 0) {
            return res.status(404).json({ success: false, message: 'Service not found' });
          }
          logAudit('SERVICE_UPDATED', auth.user.userId, { serviceId: id });
          return res.status(200).json({ success: true, message: 'Service updated' });
        }

        return res.status(404).json({ success: false, message: 'Endpoint not found' });
      }

      case 'DELETE': {
        const auth = authenticateRequest(req);
        if (!auth.authenticated) {
          return res.status(401).json({ success: false, message: auth.error });
        }

        const path = req.url || '';
        const { id } = req.body;

        if (!id) {
          return res.status(400).json({ success: false, message: 'ID is required' });
        }

        if (path.includes('/staff')) {
          const result = await staffCollection.deleteOne({ _id: new ObjectId(id) });
          if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, message: 'Staff not found' });
          }
          logAudit('STAFF_DELETED', auth.user.userId, { staffId: id });
          return res.status(200).json({ success: true, message: 'Staff deleted' });
        }

        if (path.includes('/assets')) {
          const result = await assetsCollection.deleteOne({ _id: new ObjectId(id) });
          if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, message: 'Asset not found' });
          }
          logAudit('ASSET_DELETED', auth.user.userId, { assetId: id });
          return res.status(200).json({ success: true, message: 'Asset deleted' });
        }

        if (path.includes('/services')) {
          const result = await servicesCollection.deleteOne({ _id: new ObjectId(id) });
          if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, message: 'Service not found' });
          }
          logAudit('SERVICE_DELETED', auth.user.userId, { serviceId: id });
          return res.status(200).json({ success: true, message: 'Service deleted' });
        }

        return res.status(404).json({ success: false, message: 'Endpoint not found' });
      }

      default:
        return res.status(405).json({ success: false, message: `Method ${method} not allowed` });
    }
  } catch (error: any) {
    console.error('Provider API error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
