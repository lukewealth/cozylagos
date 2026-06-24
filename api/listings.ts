import { connectToDatabase } from '../src/lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const { method } = req;

  try {
    const { db } = await connectToDatabase();
    const listingsCollection = db.collection('listings');

    switch (method) {
      case 'GET':
        // Get all listings or filter
        const { location, category, isActive, ownerId } = req.query;
        let filter = {};
        
        if (location) filter = { ...filter, location };
        if (category) filter = { ...filter, category };
        if (isActive !== undefined) filter = { ...filter, isActive: isActive === 'true' };
        if (ownerId) filter = { ...filter, ownerId };

        const listings = await listingsCollection.find(filter).toArray();
        
        res.status(200).json({ success: true, data: listings });
        break;

      case 'POST':
        // Create new listing
        const listingData = req.body;

        if (!listingData.title || !listingData.ownerId) {
          return res.status(400).json({ 
            success: false, 
            message: 'Missing required fields: title, ownerId' 
          });
        }

        const newListing = {
          ...listingData,
          isActive: listingData.isActive ?? true,
          reviewsCount: 0,
          rating: 0,
          aiMatchPercent: Math.floor(Math.random() * 15) + 85, // 85-99
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const result = await listingsCollection.insertOne(newListing);
        
        res.status(201).json({ 
          success: true, 
          data: { ...newListing, _id: result.insertedId }
        });
        break;

      case 'PUT':
        // Update listing
        const { id, ...updateData } = req.body;

        if (!id) {
          return res.status(400).json({ 
            success: false, 
            message: 'Listing ID is required' 
          });
        }

        const updateResult = await listingsCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { ...updateData, updatedAt: new Date().toISOString() } }
        );

        if (updateResult.matchedCount === 0) {
          return res.status(404).json({ 
            success: false, 
            message: 'Listing not found' 
          });
        }

        res.status(200).json({ 
          success: true, 
          message: 'Listing updated successfully' 
        });
        break;

      case 'DELETE':
        // Delete listing
        const { id: deleteId } = req.body;

        if (!deleteId) {
          return res.status(400).json({ 
            success: false, 
            message: 'Listing ID is required' 
          });
        }

        const deleteResult = await listingsCollection.deleteOne({ _id: new ObjectId(deleteId) });

        if (deleteResult.deletedCount === 0) {
          return res.status(404).json({ 
            success: false, 
            message: 'Listing not found' 
          });
        }

        res.status(200).json({ 
          success: true, 
          message: 'Listing deleted successfully' 
        });
        break;

      default:
        res.status(405).json({ 
          success: false, 
          message: `Method ${method} not allowed` 
        });
    }
  } catch (error) {
    console.error('Listings API error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
}
