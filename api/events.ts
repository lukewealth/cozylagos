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
    const eventsCollection = db.collection('events');
    const ticketsCollection = db.collection('tickets');

    switch (method) {
      case 'GET': {
        const { category, isTrending, isActive, search, date } = req.query;
        let filter: any = {};
        
        if (category) filter.category = category;
        if (isTrending !== undefined) filter.isTrending = isTrending === 'true';
        if (isActive !== undefined) filter.isActive = isActive === 'true';
        if (date) {
          filter.date = { $gte: date };
        }
        if (search) {
          filter.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { location: { $regex: search, $options: 'i' } },
          ];
        }

        const events = await eventsCollection.find(filter).sort({ isTrending: -1, date: 1, createdAt: -1 }).toArray();
        return res.status(200).json({ success: true, data: events });
      }

      case 'POST': {
        const auth = authenticateRequest(req);
        if (!auth.authenticated) {
          return res.status(401).json({ success: false, message: auth.error });
        }

        const validation = validateRequestBody(req.body, {
          title: { type: 'string', required: true, min: 2, max: 200 },
          category: { type: 'string', required: true },
          date: { type: 'string', required: true },
          location: { type: 'string', required: true },
        });
        if (!validation.valid) {
          return res.status(400).json({ success: false, message: validation.errors.join(', ') });
        }

        const eventData = req.body;
        const newEvent = {
          ...eventData,
          title: sanitizeInput(eventData.title),
          description: sanitizeInput(eventData.description || ''),
          location: sanitizeInput(eventData.location),
          isActive: eventData.isActive ?? true,
          isTrending: eventData.isTrending ?? false,
          ticketsSold: 0,
          ticketsAvailable: eventData.ticketsAvailable || 0,
          rating: eventData.rating || 0,
          reviewsCount: 0,
          images: eventData.images || [],
          highlights: eventData.highlights || [],
          tags: eventData.tags || [],
          createdBy: auth.user.userId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const result = await eventsCollection.insertOne(newEvent);
        logAudit('EVENT_CREATED', auth.user.userId, { eventId: result.insertedId.toString() });

        return res.status(201).json({ success: true, data: { ...newEvent, _id: result.insertedId } });
      }

      case 'PUT': {
        const auth = authenticateRequest(req);
        if (!auth.authenticated) {
          return res.status(401).json({ success: false, message: auth.error });
        }

        const { id, ...updateData } = req.body;
        if (!id) {
          return res.status(400).json({ success: false, message: 'Event ID is required' });
        }

        const sanitized: any = { updatedAt: new Date().toISOString() };
        if (updateData.title) sanitized.title = sanitizeInput(updateData.title);
        if (updateData.description) sanitized.description = sanitizeInput(updateData.description);
        if (updateData.location) sanitized.location = sanitizeInput(updateData.location);
        if (updateData.date) sanitized.date = updateData.date;
        if (updateData.price) sanitized.price = updateData.price;
        if (updateData.ticketsAvailable !== undefined) sanitized.ticketsAvailable = updateData.ticketsAvailable;
        if (updateData.isTrending !== undefined) sanitized.isTrending = updateData.isTrending;
        if (updateData.isActive !== undefined) sanitized.isActive = updateData.isActive;
        if (updateData.images) sanitized.images = updateData.images;
        if (updateData.highlights) sanitized.highlights = updateData.highlights;
        if (updateData.tags) sanitized.tags = updateData.tags;

        const updateResult = await eventsCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: sanitized }
        );

        if (updateResult.matchedCount === 0) {
          return res.status(404).json({ success: false, message: 'Event not found' });
        }

        logAudit('EVENT_UPDATED', auth.user.userId, { eventId: id });
        return res.status(200).json({ success: true, message: 'Event updated successfully' });
      }

      case 'DELETE': {
        const auth = authenticateRequest(req);
        if (!auth.authenticated) {
          return res.status(401).json({ success: false, message: auth.error });
        }

        const { id } = req.body;
        if (!id) {
          return res.status(400).json({ success: false, message: 'Event ID is required' });
        }

        const deleteResult = await eventsCollection.deleteOne({ _id: new ObjectId(id) });
        if (deleteResult.deletedCount === 0) {
          return res.status(404).json({ success: false, message: 'Event not found' });
        }

        logAudit('EVENT_DELETED', auth.user.userId, { eventId: id });
        return res.status(200).json({ success: true, message: 'Event deleted successfully' });
      }

      case 'PATCH': {
        const auth = authenticateRequest(req);
        if (!auth.authenticated) {
          return res.status(401).json({ success: false, message: auth.error });
        }

        const { eventId, ticketCount, userId, userName, userEmail } = req.body;
        if (!eventId || !ticketCount) {
          return res.status(400).json({ success: false, message: 'eventId and ticketCount are required' });
        }

        const event = await eventsCollection.findOne({ _id: new ObjectId(eventId) });
        if (!event) {
          return res.status(404).json({ success: false, message: 'Event not found' });
        }

        if (event.ticketsAvailable < ticketCount) {
          return res.status(400).json({ success: false, message: 'Not enough tickets available' });
        }

        const ticketReference = generateReference('TKT');
        const totalPrice = (event.pricePerTicket || 0) * ticketCount;

        const ticket = {
          eventId,
          eventTitle: event.title,
          eventDate: event.date,
          eventLocation: event.location,
          userId,
          userName,
          userEmail,
          ticketCount,
          totalPrice,
          reference: ticketReference,
          status: 'confirmed',
          createdAt: new Date().toISOString(),
        };

        await ticketsCollection.insertOne(ticket);

        await eventsCollection.updateOne(
          { _id: new ObjectId(eventId) },
          {
            $inc: { ticketsSold: ticketCount },
            $set: { ticketsAvailable: event.ticketsAvailable - ticketCount, updatedAt: new Date().toISOString() }
          }
        );

        logAudit('TICKET_PURCHASED', userId, { eventId, ticketCount, reference: ticketReference });

        return res.status(201).json({ success: true, data: ticket });
      }

      default:
        return res.status(405).json({ success: false, message: `Method ${method} not allowed` });
    }
  } catch (error: any) {
    console.error('Events API error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
