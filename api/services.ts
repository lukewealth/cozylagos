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
    const servicesCollection = db.collection('services');

    switch (method) {
      case 'GET': {
        const { providerId, category, isActive, search } = req.query;
        let filter: any = {};
        if (providerId) filter.providerId = providerId;
        if (category) filter.category = category;
        if (isActive !== undefined) filter.isActive = isActive === 'true';
        if (search) {
          filter.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
          ];
        }

        const services = await servicesCollection.find(filter).sort({ createdAt: -1 }).toArray();
        return res.status(200).json({ success: true, data: services, count: services.length });
      }

      case 'POST': {
        const auth = authenticateRequest(req);
        if (!auth.authenticated) {
          return res.status(401).json({ success: false, message: auth.error });
        }

        const validation = validateRequestBody(req.body, {
          title: { type: 'string', required: true, min: 2, max: 200 },
          providerId: { type: 'string', required: true },
        });
        if (!validation.valid) {
          return res.status(400).json({ success: false, message: validation.errors.join(', ') });
        }

        const serviceData = req.body;
        const newService = {
          ...serviceData,
          title: sanitizeInput(serviceData.title),
          description: serviceData.description ? sanitizeInput(serviceData.description) : '',
          isActive: serviceData.isActive ?? true,
          verified: false,
          rating: 0,
          reviewsCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const result = await servicesCollection.insertOne(newService);
        logAudit('SERVICE_CREATED', auth.user.userId, { serviceId: result.insertedId.toString() });

        return res.status(201).json({ success: true, data: { ...newService, _id: result.insertedId } });
      }

      case 'PUT': {
        const auth = authenticateRequest(req);
        if (!auth.authenticated) {
          return res.status(401).json({ success: false, message: auth.error });
        }

        const { id, ...updateData } = req.body;
        if (!id) {
          return res.status(400).json({ success: false, message: 'Service ID is required' });
        }

        const sanitized: any = { updatedAt: new Date().toISOString() };
        const allowedFields = ['title', 'description', 'category', 'price', 'priceUnit', 'image', 'rating', 'isActive', 'verified', 'location', 'amenities', 'duration'];
        
        for (const field of allowedFields) {
          if (updateData[field] !== undefined) {
            sanitized[field] = typeof updateData[field] === 'string' ? sanitizeInput(updateData[field]) : updateData[field];
          }
        }

        const updateResult = await servicesCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: sanitized }
        );

        if (updateResult.matchedCount === 0) {
          return res.status(404).json({ success: false, message: 'Service not found' });
        }

        logAudit('SERVICE_UPDATED', auth.user.userId, { serviceId: id });
        return res.status(200).json({ success: true, message: 'Service updated successfully' });
      }

      case 'DELETE': {
        const auth = authenticateRequest(req);
        if (!auth.authenticated) {
          return res.status(401).json({ success: false, message: auth.error });
        }

        const { id: deleteId } = req.body;
        if (!deleteId) {
          return res.status(400).json({ success: false, message: 'Service ID is required' });
        }

        const deleteResult = await servicesCollection.deleteOne({ _id: new ObjectId(deleteId) });
        if (deleteResult.deletedCount === 0) {
          return res.status(404).json({ success: false, message: 'Service not found' });
        }

        logAudit('SERVICE_DELETED', auth.user.userId, { serviceId: deleteId });
        return res.status(200).json({ success: true, message: 'Service deleted successfully' });
      }

      default:
        return res.status(405).json({ success: false, message: `Method ${method} not allowed` });
    }
  } catch (error: any) {
    console.error('Services API error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
