import { connectToDatabase } from '../../src/lib/mongodb';
import { authenticateRequest, authorizeRole, addSecurityHeaders, logAudit, checkRateLimit } from '../../src/lib/middleware';
import { sanitizeInput, generateReference } from '../../src/lib/security';
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
    const ticketsCollection = db.collection('tickets');

    switch (method) {
      case 'GET': {
        const auth = authenticateRequest(req);
        if (!auth.authenticated) {
          return res.status(401).json({ success: false, message: auth.error });
        }

        const { status, userId, bookingId } = req.query;
        let filter: any = {};
        if (status) filter.status = status;
        if (userId) filter.userId = userId;
        if (bookingId) filter.bookingId = bookingId;

        if (!authorizeRole('admin', auth.user.role)) {
          filter.userId = auth.user.userId;
        }

        const tickets = await ticketsCollection
          .find(filter)
          .sort({ createdAt: -1 })
          .limit(100)
          .toArray();

        return res.status(200).json({ success: true, data: tickets });
      }

      case 'POST': {
        const auth = authenticateRequest(req);
        if (!auth.authenticated) {
          return res.status(401).json({ success: false, message: auth.error });
        }

        const { title, description, bookingId, category, priority, userId } = req.body;
        if (!title || !description) {
          return res.status(400).json({ success: false, message: 'Title and description are required' });
        }

        let ticketUserId = userId || auth.user.userId;

        if (bookingId) {
          const bookingsCollection = db.collection('bookings');
          const booking = await bookingsCollection.findOne({ _id: new ObjectId(bookingId) });
          if (booking) {
            ticketUserId = booking.guestId || auth.user.userId;
          }
        }

        const ticket = {
          ticketId: generateReference('TKT'),
          title: sanitizeInput(title),
          description: sanitizeInput(description),
          bookingId: bookingId || null,
          category: category || 'general',
          priority: priority || 'medium',
          status: 'open',
          userId: ticketUserId,
          assignedTo: null,
          responses: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: auth.user.userId,
        };

        await ticketsCollection.insertOne(ticket);
        logAudit('TICKET_CREATED', auth.user.userId, { ticketId: ticket.ticketId });

        return res.status(201).json({ success: true, data: ticket });
      }

      case 'PATCH': {
        const auth = authenticateRequest(req);
        if (!auth.authenticated) {
          return res.status(401).json({ success: false, message: auth.error });
        }

        const { id, status, response, assignedTo } = req.body;
        if (!id) {
          return res.status(400).json({ success: false, message: 'Ticket ID is required' });
        }

        const updateFields: any = { updatedAt: new Date().toISOString() };
        if (status) updateFields.status = status;
        if (assignedTo) updateFields.assignedTo = assignedTo;
        if (response) {
          updateFields.$push = {
            responses: {
              text: sanitizeInput(response.text),
              author: auth.user.userId,
              authorName: auth.user.name || 'Support',
              createdAt: new Date().toISOString(),
            },
          };
        }

        await ticketsCollection.updateOne(
          { _id: new ObjectId(id) },
          updateFields.$push
            ? { $set: updateFields, $push: updateFields.$push }
            : { $set: updateFields }
        );

        logAudit('TICKET_UPDATED', auth.user.userId, { ticketId: id, status });

        return res.status(200).json({ success: true, message: 'Ticket updated' });
      }

      case 'DELETE': {
        const auth = authenticateRequest(req);
        if (!auth.authenticated) {
          return res.status(401).json({ success: false, message: auth.error });
        }

        if (!authorizeRole('admin', auth.user.role)) {
          return res.status(403).json({ success: false, message: 'Admin access required' });
        }

        const { id } = req.body;
        if (!id) {
          return res.status(400).json({ success: false, message: 'Ticket ID is required' });
        }

        await ticketsCollection.deleteOne({ _id: new ObjectId(id) });
        logAudit('TICKET_DELETED', auth.user.userId, { ticketId: id });

        return res.status(200).json({ success: true, message: 'Ticket deleted' });
      }

      default:
        return res.status(405).json({ success: false, message: `Method ${method} not allowed` });
    }
  } catch (error: any) {
    console.error('CRM Tickets API error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
