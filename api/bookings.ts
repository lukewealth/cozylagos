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
    const bookingsCollection = db.collection('bookings');

    switch (method) {
      case 'GET': {
        const auth = authenticateRequest(req);
        if (!auth.authenticated) {
          return res.status(401).json({ success: false, message: auth.error });
        }

        const { status, guestId, listingId, providerId } = req.query;
        let filter: any = {};
        if (status) filter.status = status;
        if (guestId) filter.guestId = guestId;
        if (listingId) filter.listingId = listingId;
        if (providerId) filter.providerId = providerId;

        const bookings = await bookingsCollection.find(filter).sort({ createdAt: -1 }).toArray();
        return res.status(200).json({ success: true, data: bookings, count: bookings.length });
      }

      case 'POST': {
        const auth = authenticateRequest(req);
        if (!auth.authenticated) {
          return res.status(401).json({ success: false, message: auth.error });
        }

        const validation = validateRequestBody(req.body, {
          listingId: { type: 'string', required: true },
          guestId: { type: 'string', required: true },
          guestName: { type: 'string', required: true, min: 2 },
        });
        if (!validation.valid) {
          return res.status(400).json({ success: false, message: validation.errors.join(', ') });
        }

        const bookingData = req.body;
        const totalAmount = bookingData.totalAmount || 0;
        const platformCut = Math.round(totalAmount * 0.15);
        const providerCut = totalAmount - platformCut;
        const reference = generateReference('CL');

        const newBooking = {
          ...bookingData,
          guestName: sanitizeInput(bookingData.guestName),
          status: bookingData.status || 'pending',
          services: bookingData.services || [],
          providerAssignmentStatus: 'unassigned',
          paymentLedger: {
            id: `ledger-${Date.now()}`,
            bookingId: `booking-${Date.now()}`,
            reference,
            guestName: sanitizeInput(bookingData.guestName),
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
        logAudit('BOOKING_CREATED', auth.user.userId, { bookingId: result.insertedId.toString(), totalAmount });

        return res.status(201).json({ success: true, data: { ...newBooking, _id: result.insertedId } });
      }

      case 'PATCH': {
        const auth = authenticateRequest(req);
        if (!auth.authenticated) {
          return res.status(401).json({ success: false, message: auth.error });
        }

        const { id, status, providerId, providerName, providerAssignmentStatus, notes, reason } = req.body;
        if (!id) {
          return res.status(400).json({ success: false, message: 'Booking ID is required' });
        }

        const updateFields: any = { updatedAt: new Date().toISOString() };
        if (status) updateFields.status = status;
        if (providerId) updateFields.providerId = providerId;
        if (providerName) updateFields.providerName = sanitizeInput(providerName);
        if (providerAssignmentStatus) updateFields.providerAssignmentStatus = providerAssignmentStatus;
        if (notes) updateFields.confirmationNotes = sanitizeInput(notes);
        if (reason) updateFields.rejectionReason = sanitizeInput(reason);

        if (status === 'confirmed') {
          updateFields.confirmedAt = new Date().toISOString();
          updateFields['paymentLedger.paymentStatus'] = 'processed';
        }

        const updateResult = await bookingsCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updateFields }
        );

        if (updateResult.matchedCount === 0) {
          return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        logAudit('BOOKING_UPDATED', auth.user.userId, { bookingId: id, status });
        return res.status(200).json({ success: true, message: 'Booking updated successfully' });
      }

      case 'DELETE': {
        const auth = authenticateRequest(req);
        if (!auth.authenticated) {
          return res.status(401).json({ success: false, message: auth.error });
        }

        const { id: deleteId } = req.body;
        if (!deleteId) {
          return res.status(400).json({ success: false, message: 'Booking ID is required' });
        }

        const deleteResult = await bookingsCollection.deleteOne({ _id: new ObjectId(deleteId) });
        if (deleteResult.deletedCount === 0) {
          return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        logAudit('BOOKING_DELETED', auth.user.userId, { bookingId: deleteId });
        return res.status(200).json({ success: true, message: 'Booking deleted successfully' });
      }

      default:
        return res.status(405).json({ success: false, message: `Method ${method} not allowed` });
    }
  } catch (error: any) {
    console.error('Bookings API error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
