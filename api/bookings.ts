import { connectToDatabase } from '../src/lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const { method } = req;

  try {
    const { db } = await connectToDatabase();
    const bookingsCollection = db.collection('bookings');

    switch (method) {
      case 'GET':
        // Get all bookings or filter
        const { status, guestId, listingId } = req.query;
        let filter = {};
        
        if (status) filter = { status };
        if (guestId) filter = { guestId };
        if (listingId) filter = { listingId };

        const bookings = await bookingsCollection
          .find(filter)
          .sort({ createdAt: -1 })
          .toArray();
        
        res.status(200).json({ success: true, data: bookings });
        break;

      case 'POST':
        // Create new booking
        const bookingData = req.body;

        if (!bookingData.listingId || !bookingData.guestId || !bookingData.checkIn || !bookingData.checkOut) {
          return res.status(400).json({ 
            success: false, 
            message: 'Missing required fields: listingId, guestId, checkIn, checkOut' 
          });
        }

        const newBooking = {
          ...bookingData,
          status: bookingData.status || 'pending',
          services: bookingData.services || [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const result = await bookingsCollection.insertOne(newBooking);
        
        res.status(201).json({ 
          success: true, 
          data: { ...newBooking, _id: result.insertedId }
        });
        break;

      case 'PUT':
        // Update booking
        const { id, ...updateData } = req.body;

        if (!id) {
          return res.status(400).json({ 
            success: false, 
            message: 'Booking ID is required' 
          });
        }

        const updateResult = await bookingsCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { ...updateData, updatedAt: new Date().toISOString() } }
        );

        if (updateResult.matchedCount === 0) {
          return res.status(404).json({ 
            success: false, 
            message: 'Booking not found' 
          });
        }

        res.status(200).json({ 
          success: true, 
          message: 'Booking updated successfully' 
        });
        break;

      case 'PATCH':
        // Update booking status
        const { id: patchId, status } = req.body;

        if (!patchId || !status) {
          return res.status(400).json({ 
            success: false, 
            message: 'Booking ID and status are required' 
          });
        }

        const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
        if (!validStatuses.includes(status)) {
          return res.status(400).json({ 
            success: false, 
            message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
          });
        }

        const patchResult = await bookingsCollection.updateOne(
          { _id: new ObjectId(patchId) },
          { $set: { status, updatedAt: new Date().toISOString() } }
        );

        if (patchResult.matchedCount === 0) {
          return res.status(404).json({ 
            success: false, 
            message: 'Booking not found' 
          });
        }

        res.status(200).json({ 
          success: true, 
          message: `Booking ${status} successfully` 
        });
        break;

      case 'DELETE':
        // Delete booking
        const { id: deleteId } = req.body;

        if (!deleteId) {
          return res.status(400).json({ 
            success: false, 
            message: 'Booking ID is required' 
          });
        }

        const deleteResult = await bookingsCollection.deleteOne({ _id: new ObjectId(deleteId) });

        if (deleteResult.deletedCount === 0) {
          return res.status(404).json({ 
            success: false, 
            message: 'Booking not found' 
          });
        }

        res.status(200).json({ 
          success: true, 
          message: 'Booking deleted successfully' 
        });
        break;

      default:
        res.status(405).json({ 
          success: false, 
          message: `Method ${method} not allowed` 
        });
    }
  } catch (error) {
    console.error('Bookings API error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
}
