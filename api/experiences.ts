import { connectToDatabase } from '../src/lib/mongodb';
import { authenticateRequest, validateRequestBody, addSecurityHeaders, logAudit, checkRateLimit } from '../src/lib/middleware';
import { sanitizeInput, generateReference } from '../src/lib/security';
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
    const experiencesCollection = db.collection('experiences');

    switch (method) {
      case 'GET': {
        const { category, vendorId, isActive, search } = req.query;
        let filter: any = {};
        if (category) filter.category = category;
        if (vendorId) filter.vendorId = vendorId;
        if (isActive !== undefined) filter.isActive = isActive === 'true';
        if (search) {
          filter.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { location: { $regex: search, $options: 'i' } },
          ];
        }

        const experiences = await experiencesCollection.find(filter).sort({ rating: -1, createdAt: -1 }).toArray();
        return res.status(200).json({ success: true, data: experiences });
      }

      case 'POST': {
        const auth = authenticateRequest(req);
        if (!auth.authenticated) {
          return res.status(401).json({ success: false, message: auth.error });
        }

        const validation = validateRequestBody(req.body, {
          title: { type: 'string', required: true, min: 2, max: 200 },
          vendorId: { type: 'string', required: true },
          category: { type: 'string', required: true },
        });
        if (!validation.valid) {
          return res.status(400).json({ success: false, message: validation.errors.join(', ') });
        }

        const expData = req.body;
        const newExperience = {
          ...expData,
          title: sanitizeInput(expData.title),
          description: sanitizeInput(expData.description || ''),
          isActive: expData.isActive ?? true,
          verified: false,
          rating: expData.rating || 0,
          reviewsCount: 0,
          images: expData.images || [],
          includes: expData.includes || [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const result = await experiencesCollection.insertOne(newExperience);
        logAudit('EXPERIENCE_CREATED', auth.user.userId, { experienceId: result.insertedId.toString() });

        return res.status(201).json({ success: true, data: { ...newExperience, _id: result.insertedId } });
      }

      case 'PUT': {
        const auth = authenticateRequest(req);
        if (!auth.authenticated) {
          return res.status(401).json({ success: false, message: auth.error });
        }

        const { id, ...updateData } = req.body;
        if (!id) {
          return res.status(400).json({ success: false, message: 'Experience ID is required' });
        }

        const sanitized: any = { updatedAt: new Date().toISOString() };
        if (updateData.title) sanitized.title = sanitizeInput(updateData.title);
        if (updateData.description) sanitized.description = sanitizeInput(updateData.description);
        if (updateData.price !== undefined) sanitized.price = updateData.price;
        if (updateData.duration) sanitized.duration = sanitizeInput(updateData.duration);
        if (updateData.images) sanitized.images = updateData.images;
        if (updateData.includes) sanitized.includes = updateData.includes;
        if (updateData.isActive !== undefined) sanitized.isActive = updateData.isActive;
        if (updateData.maxGuests) sanitized.maxGuests = updateData.maxGuests;

        const updateResult = await experiencesCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: sanitized }
        );

        if (updateResult.matchedCount === 0) {
          return res.status(404).json({ success: false, message: 'Experience not found' });
        }

        logAudit('EXPERIENCE_UPDATED', auth.user.userId, { experienceId: id });
        return res.status(200).json({ success: true, message: 'Experience updated successfully' });
      }

      case 'DELETE': {
        const auth = authenticateRequest(req);
        if (!auth.authenticated) {
          return res.status(401).json({ success: false, message: auth.error });
        }

        const { id } = req.body;
        if (!id) {
          return res.status(400).json({ success: false, message: 'Experience ID is required' });
        }

        const deleteResult = await experiencesCollection.deleteOne({ _id: new ObjectId(id) });
        if (deleteResult.deletedCount === 0) {
          return res.status(404).json({ success: false, message: 'Experience not found' });
        }

        logAudit('EXPERIENCE_DELETED', auth.user.userId, { experienceId: id });
        return res.status(200).json({ success: true, message: 'Experience deleted successfully' });
      }

      default:
        return res.status(405).json({ success: false, message: `Method ${method} not allowed` });
    }
  } catch (error: any) {
    console.error('Experiences API error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
