import { connectToDatabase } from '../src/lib/mongodb';

export default async function handler(req: any, res: any) {
  const { method } = req;

  try {
    const { db } = await connectToDatabase();
    const staffCollection = db.collection('staff');

    switch (method) {
      case 'GET': {
        const { role, status, providerId } = req.query;
        let filter: any = {};
        if (role) filter.role = role;
        if (status) filter.status = status;
        if (providerId) filter.providerId = providerId;

        const staff = await staffCollection.find(filter).sort({ name: 1 }).toArray();
        res.status(200).json({ success: true, data: staff });
        break;
      }

      case 'POST': {
        const staffData = req.body;
        if (!staffData.name || !staffData.role) {
          return res.status(400).json({ success: false, message: 'Missing required fields: name, role' });
        }

        const newStaff = {
          ...staffData,
          status: staffData.status || 'available',
          certifications: staffData.certifications || [],
          specializations: staffData.specializations || [],
          rating: staffData.rating || 0,
          tenureYears: staffData.tenureYears || 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const result = await staffCollection.insertOne(newStaff);
        res.status(201).json({ success: true, data: { ...newStaff, _id: result.insertedId } });
        break;
      }

      case 'PUT': {
        const { id, ...updateData } = req.body;
        if (!id) {
          return res.status(400).json({ success: false, message: 'Staff ID is required' });
        }

        const updateResult = await staffCollection.updateOne(
          { _id: id as any },
          { $set: { ...updateData, updatedAt: new Date().toISOString() } }
        );

        if (updateResult.matchedCount === 0) {
          return res.status(404).json({ success: false, message: 'Staff not found' });
        }

        res.status(200).json({ success: true, message: 'Staff updated successfully' });
        break;
      }

      case 'PATCH': {
        const { id, status, currentAssignment } = req.body;
        if (!id) {
          return res.status(400).json({ success: false, message: 'Staff ID is required' });
        }

        const updateFields: any = { updatedAt: new Date().toISOString() };
        if (status) updateFields.status = status;
        if (currentAssignment !== undefined) updateFields.currentAssignment = currentAssignment;

        const updateResult = await staffCollection.updateOne(
          { _id: id as any },
          { $set: updateFields }
        );

        if (updateResult.matchedCount === 0) {
          return res.status(404).json({ success: false, message: 'Staff not found' });
        }

        res.status(200).json({ success: true, message: 'Staff updated successfully' });
        break;
      }

      case 'DELETE': {
        const { id: deleteId } = req.body;
        if (!deleteId) {
          return res.status(400).json({ success: false, message: 'Staff ID is required' });
        }

        const deleteResult = await staffCollection.deleteOne({ _id: deleteId as any });
        if (deleteResult.deletedCount === 0) {
          return res.status(404).json({ success: false, message: 'Staff not found' });
        }

        res.status(200).json({ success: true, message: 'Staff deleted successfully' });
        break;
      }

      default:
        res.status(405).json({ success: false, message: `Method ${method} not allowed` });
    }
  } catch (error: any) {
    console.error('Staff API error:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
}
