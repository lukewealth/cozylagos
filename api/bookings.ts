import { connectToDatabase } from '../src/lib/mongodb';

export default async function handler(req: any, res: any) {
  const { method } = req;

  try {
    const { db } = await connectToDatabase();
    const bookingsCollection = db.collection('bookings');

    switch (method) {
      case 'GET': {
        const { status, guestId, listingId, providerId } = req.query;
        let filter: any = {};
        if (status) filter.status = status;
        if (guestId) filter.guestId = guestId;
        if (listingId) filter.listingId = listingId;
        if (providerId) filter.providerId = providerId;

        const bookings = await bookingsCollection.find(filter).sort({ createdAt: -1 }).toArray();
        res.status(200).json({ success: true, data: bookings });
        break;
      }

      case 'POST': {
        const bookingData = req.body;
        if (!bookingData.listingId || !bookingData.guestId || !bookingData.guestName) {
          return res.status(400).json({ success: false, message: 'Missing required fields: listingId, guestId, guestName' });
        }

        const totalAmount = bookingData.totalAmount || 0;
        const platformCut = Math.round(totalAmount * 0.15);
        const providerCut = totalAmount - platformCut;

        const newBooking = {
          ...bookingData,
          status: bookingData.status || 'pending',
          services: bookingData.services || [],
          providerAssignmentStatus: 'unassigned',
          paymentLedger: {
            id: `ledger-${Date.now()}`,
            bookingId: `booking-${Date.now()}`,
            reference: `CL-${Date.now().toString(36).toUpperCase()}`,
            guestName: bookingData.guestName,
            guestEmail: bookingData.guestEmail || '',
            date: new Date().toISOString(),
            lineItems: bookingData.lineItems || [],
            subtotal: totalAmount,
            serviceFee: bookingData.serviceFee || 0,
            tax: bookingData.tax || 0,
            totalAmount,
            platformCut,
            providerCut,
            paymentMethod: bookingData.paymentMethod || 'card',
            paymentStatus: 'pending',
            cartItemCount: bookingData.cartItemCount || 1,
            servicesCount: (bookingData.services || []).length,
            experiencesCount: 0,
            createdAt: new Date().toISOString(),
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const result = await bookingsCollection.insertOne(newBooking);
        res.status(201).json({ success: true, data: { ...newBooking, _id: result.insertedId } });
        break;
      }

      case 'PATCH': {
        const { id, status, providerId, providerName, providerAssignmentStatus, notes, reason } = req.body;
        if (!id) {
          return res.status(400).json({ success: false, message: 'Booking ID is required' });
        }

        const updateFields: any = { updatedAt: new Date().toISOString() };
        if (status) updateFields.status = status;
        if (providerId) updateFields.providerId = providerId;
        if (providerName) updateFields.providerName = providerName;
        if (providerAssignmentStatus) updateFields.providerAssignmentStatus = providerAssignmentStatus;
        if (notes) updateFields.confirmationNotes = notes;
        if (reason) updateFields.rejectionReason = reason;

        if (status === 'confirmed') {
          updateFields.confirmedAt = new Date().toISOString();
          if (updateFields.paymentLedger) {
            updateFields['paymentLedger.paymentStatus'] = 'processed';
          }
        }

        const updateResult = await bookingsCollection.updateOne(
          { _id: id as any },
          { $set: updateFields }
        );

        if (updateResult.matchedCount === 0) {
          return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        res.status(200).json({ success: true, message: 'Booking updated successfully' });
        break;
      }

      case 'DELETE': {
        const { id: deleteId } = req.body;
        if (!deleteId) {
          return res.status(400).json({ success: false, message: 'Booking ID is required' });
        }

        const deleteResult = await bookingsCollection.deleteOne({ _id: deleteId as any });
        if (deleteResult.deletedCount === 0) {
          return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        res.status(200).json({ success: true, message: 'Booking deleted successfully' });
        break;
      }

      default:
        res.status(405).json({ success: false, message: `Method ${method} not allowed` });
    }
  } catch (error: any) {
    console.error('Bookings API error:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
}
