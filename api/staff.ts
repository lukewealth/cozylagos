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
    const staffCollection = db.collection('staff');

    switch (method) {
      case 'GET': {
        const { role, status, providerId, search } = req.query;
        let filter: any = {};
        if (role) filter.role = role;
        if (status) filter.status = status;
        if (providerId) filter.providerId = providerId;
        if (search) {
          filter.$or = [
            { name: { $regex: search, $options: 'i' } },
            { role: { $regex: search, $options: 'i' } },
          ];
        }

        const staff = await staffCollection.find(filter).sort({ name: 1 }).toArray();
        return res.status(200).json({ success: true, data: staff, count: staff.length });
      }

      case 'POST': {
        const auth = authenticateRequest(req);
        if (!auth.authenticated) {
          return res.status(401).json({ success: false, message: auth.error });
        }

        const validation = validateRequestBody(req.body, {
          name: { type: 'string', required: true, min: 2, max: 100 },
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
          rating: staffData.rating || 0,
          tenureYears: staffData.tenureYears || 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const result = await staffCollection.insertOne(newStaff);
        logAudit('STAFF_CREATED', auth.user.userId, { staffId: result.insertedId.toString() });

        return res.status(201).json({ success: true, data: { ...newStaff, _id: result.insertedId } });
      }

      case 'PUT': {
        const auth = authenticateRequest(req);
        if (!auth.authenticated) {
          return res.status(401).json({ success: false, message: auth.error });
        }

        const { id, ...updateData } = req.body;
        if (!id) {
          return res.status(400).json({ success: false, message: 'Staff ID is required' });
        }

        const sanitized: any = { updatedAt: new Date().toISOString() };
        const allowedFields = ['name', 'role', 'status', 'email', 'phone', 'avatar', 'certifications', 'specializations', 'rating', 'tenureYears', 'currentAssignment', 'providerId'];
        
        for (const field of allowedFields) {
          if (updateData[field] !== undefined) {
            sanitized[field] = typeof updateData[field] === 'string' ? sanitizeInput(updateData[field]) : updateData[field];
          }
        }

        const updateResult = await staffCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: sanitized }
        );

        if (updateResult.matchedCount === 0) {
          return res.status(404).json({ success: false, message: 'Staff not found' });
        }

        logAudit('STAFF_UPDATED', auth.user.userId, { staffId: id });
        return res.status(200).json({ success: true, message: 'Staff updated successfully' });
      }

      case 'PATCH': {
        const auth = authenticateRequest(req);
        if (!auth.authenticated) {
          return res.status(401).json({ success: false, message: auth.error });
        }

        const { id, status, currentAssignment } = req.body;
        if (!id) {
          return res.status(400).json({ success: false, message: 'Staff ID is required' });
        }

        const updateFields: any = { updatedAt: new Date().toISOString() };
        if (status) updateFields.status = status;
        if (currentAssignment !== undefined) updateFields.currentAssignment = currentAssignment;

        const updateResult = await staffCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updateFields }
        );

        if (updateResult.matchedCount === 0) {
          return res.status(404).json({ success: false, message: 'Staff not found' });
        }

        logAudit('STAFF_PATCHED', auth.user.userId, { staffId: id, status });
        return res.status(200).json({ success: true, message: 'Staff updated successfully' });
      }

      case 'DELETE': {
        const auth = authenticateRequest(req);
        if (!auth.authenticated) {
          return res.status(401).json({ success: false, message: auth.error });
        }

        const { id: deleteId } = req.body;
        if (!deleteId) {
          return res.status(400).json({ success: false, message: 'Staff ID is required' });
        }

        const deleteResult = await staffCollection.deleteOne({ _id: new ObjectId(deleteId) });
        if (deleteResult.deletedCount === 0) {
          return res.status(404).json({ success: false, message: 'Staff not found' });
        }

        logAudit('STAFF_DELETED', auth.user.userId, { staffId: deleteId });
        return res.status(200).json({ success: true, message: 'Staff deleted successfully' });
      }

      default:
        return res.status(405).json({ success: false, message: `Method ${method} not allowed` });
    }
  } catch (error: any) {
    console.error('Staff API error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
