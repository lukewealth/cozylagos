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
    const blockedDatesCollection = db.collection('blockedDates');

    switch (method) {
      case 'GET': {
        const { listingId, startDate, endDate, providerId } = req.query;
        let filter: any = {};

        if (listingId) filter.listingId = listingId;
        if (providerId) filter.providerId = providerId;
        
        if (startDate && endDate) {
          filter.$or = [
            { startDate: { $lte: endDate, $gte: startDate } },
            { endDate: { $lte: endDate, $gte: startDate } },
            { startDate: { $lte: startDate }, endDate: { $gte: endDate } }
          ];
        }

        const blockedDates = await blockedDatesCollection.find(filter).sort({ startDate: 1 }).toArray();
        return res.status(200).json({ success: true, data: blockedDates, count: blockedDates.length });
      }

      case 'POST': {
        const auth = authenticateRequest(req);
        if (!auth.authenticated) {
          return res.status(401).json({ success: false, message: auth.error });
        }

        const validation = validateRequestBody(req.body, {
          listingId: { type: 'string', required: true },
          startDate: { type: 'string', required: true },
          endDate: { type: 'string', required: true },
          reason: { type: 'string', required: false },
        });
        if (!validation.valid) {
          return res.status(400).json({ success: false, message: validation.errors.join(', ') });
        }

        const { listingId, startDate, endDate, reason } = req.body;

        // Validate date range
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (start > end) {
          return res.status(400).json({ success: false, message: 'Start date must be before end date' });
        }

        // Check for overlapping blocked dates
        const overlapping = await blockedDatesCollection.findOne({
          listingId,
          $or: [
            { startDate: { $lte: endDate }, endDate: { $gte: startDate } },
            { startDate: { $lte: startDate }, endDate: { $gte: endDate } }
          ]
        });

        if (overlapping) {
          return res.status(409).json({ 
            success: false, 
            message: 'Date range overlaps with existing blocked dates' 
          });
        }

        const newBlockedDate = {
          listingId,
          providerId: auth.user.userId,
          startDate,
          endDate,
          reason: reason ? sanitizeInput(reason) : 'Blocked by owner',
          createdAt: new Date().toISOString(),
          createdBy: auth.user.userId,
        };

        const result = await blockedDatesCollection.insertOne(newBlockedDate);
        logAudit('BLOCKED_DATE_CREATED', auth.user.userId, { 
          listingId, 
          blockedDateId: result.insertedId.toString(),
          startDate,
          endDate 
        });

        return res.status(201).json({ 
          success: true, 
          data: { ...newBlockedDate, _id: result.insertedId },
          message: 'Dates blocked successfully'
        });
      }

      case 'DELETE': {
        const auth = authenticateRequest(req);
        if (!auth.authenticated) {
          return res.status(401).json({ success: false, message: auth.error });
        }

        const { id } = req.body;
        if (!id) {
          return res.status(400).json({ success: false, message: 'Blocked date ID is required' });
        }

        const deleteResult = await blockedDatesCollection.deleteOne({ _id: new ObjectId(id) });
        if (deleteResult.deletedCount === 0) {
          return res.status(404).json({ success: false, message: 'Blocked date not found' });
        }

        logAudit('BLOCKED_DATE_DELETED', auth.user.userId, { blockedDateId: id });
        return res.status(200).json({ success: true, message: 'Blocked date removed successfully' });
      }

      default:
        return res.status(405).json({ success: false, message: `Method ${method} not allowed` });
    }
  } catch (error: any) {
    console.error('Blocked dates API error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
