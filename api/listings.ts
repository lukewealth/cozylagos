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
    const listingsCollection = db.collection('listings');

    switch (method) {
      case 'GET': {
        const { location, category, isActive, ownerId, search, minPrice, maxPrice, bedrooms, sortBy } = req.query;
        let filter: any = {};

        if (location) filter.location = location;
        if (category) filter.category = category;
        if (isActive !== undefined) filter.isActive = isActive === 'true';
        if (ownerId) filter.ownerId = ownerId;
        if (minPrice) filter.nightlyRate = { ...filter.nightlyRate, $gte: Number(minPrice) };
        if (maxPrice) filter.nightlyRate = { ...filter.nightlyRate, $lte: Number(maxPrice) };
        if (bedrooms) filter.bedrooms = { $gte: Number(bedrooms) };
        if (search) {
          filter.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { location: { $regex: search, $options: 'i' } },
          ];
        }

        let sort: any = { createdAt: -1 };
        if (sortBy === 'price_asc') sort = { nightlyRate: 1 };
        if (sortBy === 'price_desc') sort = { nightlyRate: -1 };
        if (sortBy === 'rating') sort = { rating: -1 };
        if (sortBy === 'newest') sort = { createdAt: -1 };

        const listings = await listingsCollection.find(filter).sort(sort).toArray();
        return res.status(200).json({ success: true, data: listings, count: listings.length });
      }

      case 'POST': {
        const auth = authenticateRequest(req);
        if (!auth.authenticated) {
          return res.status(401).json({ success: false, message: auth.error });
        }

        const validation = validateRequestBody(req.body, {
          title: { type: 'string', required: true, min: 3, max: 200 },
          ownerId: { type: 'string', required: true },
        });
        if (!validation.valid) {
          return res.status(400).json({ success: false, message: validation.errors.join(', ') });
        }

        const listingData = req.body;
        const newListing = {
          ...listingData,
          title: sanitizeInput(listingData.title),
          description: listingData.description ? sanitizeInput(listingData.description) : '',
          ownerId: listingData.ownerId,
          isActive: listingData.isActive ?? true,
          reviewsCount: 0,
          rating: 0,
          aiMatchPercent: Math.floor(Math.random() * 15) + 85,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const result = await listingsCollection.insertOne(newListing);
        logAudit('LISTING_CREATED', auth.user.userId, { listingId: result.insertedId.toString() });

        return res.status(201).json({ success: true, data: { ...newListing, _id: result.insertedId } });
      }

      case 'PUT': {
        const auth = authenticateRequest(req);
        if (!auth.authenticated) {
          return res.status(401).json({ success: false, message: auth.error });
        }

        const { id, ...updateData } = req.body;
        if (!id) {
          return res.status(400).json({ success: false, message: 'Listing ID is required' });
        }

        const sanitized: any = { updatedAt: new Date().toISOString() };
        const allowedFields = ['title', 'description', 'category', 'location', 'bedrooms', 'bathrooms', 'maxGuests', 'nightlyRate', 'weekendPremium', 'cleaningFee', 'securityDeposit', 'image', 'images', 'amenities', 'isActive', 'videoUrl', 'squareFootage', 'packageDetails', 'keywords', 'lat', 'lng'];
        
        for (const field of allowedFields) {
          if (updateData[field] !== undefined) {
            if (typeof updateData[field] === 'string') {
              sanitized[field] = sanitizeInput(updateData[field]);
            } else {
              sanitized[field] = updateData[field];
            }
          }
        }

        const updateResult = await listingsCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: sanitized }
        );

        if (updateResult.matchedCount === 0) {
          return res.status(404).json({ success: false, message: 'Listing not found' });
        }

        logAudit('LISTING_UPDATED', auth.user.userId, { listingId: id });
        return res.status(200).json({ success: true, message: 'Listing updated successfully' });
      }

      case 'DELETE': {
        const auth = authenticateRequest(req);
        if (!auth.authenticated) {
          return res.status(401).json({ success: false, message: auth.error });
        }

        const { id: deleteId } = req.body;
        if (!deleteId) {
          return res.status(400).json({ success: false, message: 'Listing ID is required' });
        }

        const deleteResult = await listingsCollection.deleteOne({ _id: new ObjectId(deleteId) });
        if (deleteResult.deletedCount === 0) {
          return res.status(404).json({ success: false, message: 'Listing not found' });
        }

        logAudit('LISTING_DELETED', auth.user.userId, { listingId: deleteId });
        return res.status(200).json({ success: true, message: 'Listing deleted successfully' });
      }

      default:
        return res.status(405).json({ success: false, message: `Method ${method} not allowed` });
    }
  } catch (error: any) {
    console.error('Listings API error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
