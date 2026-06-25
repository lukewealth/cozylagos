import { connectToDatabase } from '../src/lib/mongodb';

export default async function handler(req: any, res: any) {
  const { method } = req;

  try {
    const { db } = await connectToDatabase();
    const servicesCollection = db.collection('services');

    switch (method) {
      case 'GET': {
        const { providerId, category, isActive } = req.query;
        let filter: any = {};
        if (providerId) filter.providerId = providerId;
        if (category) filter.category = category;
        if (isActive !== undefined) filter.isActive = isActive === 'true';

        const services = await servicesCollection.find(filter).sort({ createdAt: -1 }).toArray();
        res.status(200).json({ success: true, data: services });
        break;
      }

      case 'POST': {
        const serviceData = req.body;
        if (!serviceData.title || !serviceData.providerId) {
          return res.status(400).json({ success: false, message: 'Missing required fields: title, providerId' });
        }

        const newService = {
          ...serviceData,
          isActive: serviceData.isActive ?? true,
          verified: false,
          rating: 0,
          reviewsCount: 0,
          createdAt: new Date().toISOString(),
        };

        const result = await servicesCollection.insertOne(newService);
        res.status(201).json({ success: true, data: { ...newService, _id: result.insertedId } });
        break;
      }

      case 'PUT': {
        const { id, ...updateData } = req.body;
        if (!id) {
          return res.status(400).json({ success: false, message: 'Service ID is required' });
        }

        const updateResult = await servicesCollection.updateOne(
          { _id: id as any },
          { $set: { ...updateData, updatedAt: new Date().toISOString() } }
        );

        if (updateResult.matchedCount === 0) {
          return res.status(404).json({ success: false, message: 'Service not found' });
        }

        res.status(200).json({ success: true, message: 'Service updated successfully' });
        break;
      }

      case 'DELETE': {
        const { id: deleteId } = req.body;
        if (!deleteId) {
          return res.status(400).json({ success: false, message: 'Service ID is required' });
        }

        const deleteResult = await servicesCollection.deleteOne({ _id: deleteId as any });
        if (deleteResult.deletedCount === 0) {
          return res.status(404).json({ success: false, message: 'Service not found' });
        }

        res.status(200).json({ success: true, message: 'Service deleted successfully' });
        break;
      }

      default:
        res.status(405).json({ success: false, message: `Method ${method} not allowed` });
    }
  } catch (error: any) {
    console.error('Services API error:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
}
