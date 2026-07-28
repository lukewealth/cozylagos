import { connectToDatabase } from '../../src/lib/mongodb';
import { authenticateRequest, validateRequestBody, addSecurityHeaders, logAudit, checkRateLimit, logSecurityEvent } from '../../src/lib/middleware';
import { sanitizeInput, generateReference, tokenizeCard, validateCardNumber, validateExpiry, validateCVV, detectFraud } from '../../src/lib/security';
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
    const path = req.url || '';

    // Blocked Dates endpoints
    if (path.includes('/blocked-dates')) {
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

          const start = new Date(startDate);
          const end = new Date(endDate);
          if (start > end) {
            return res.status(400).json({ success: false, message: 'Start date must be before end date' });
          }

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
    }

    // Checkout endpoint
    if (path.includes('/checkout')) {
      if (method !== 'POST') {
        return res.status(405).json({ success: false, message: `Method ${method} not allowed` });
      }

      const checkoutRateCheck = checkRateLimit(req, 30, 60000);
      if (!checkoutRateCheck.allowed) {
        logSecurityEvent({
          type: 'RATE_LIMIT_EXCEEDED',
          severity: 'high',
          details: { endpoint: '/api/operations/checkout', ip: req.headers?.['x-forwarded-for'] },
        });
        return res.status(429).json({ success: false, message: 'Too many requests' });
      }

      const auth = authenticateRequest(req);
      if (!auth.authenticated) {
        return res.status(401).json({ success: false, message: auth.error });
      }

      const validation = validateRequestBody(req.body, {
        items: { type: 'array', required: true },
        paymentMethod: { type: 'string', required: true },
      });
      if (!validation.valid) {
        return res.status(400).json({ success: false, message: validation.errors.join(', ') });
      }

      const { items, paymentMethod, cardData, billingAddress } = req.body;

      if (paymentMethod === 'card' && cardData) {
        if (!validateCardNumber(cardData.number)) {
          return res.status(400).json({ success: false, message: 'Invalid card number' });
        }
        if (!validateExpiry(cardData.expiry)) {
          return res.status(400).json({ success: false, message: 'Invalid card expiry' });
        }
        if (!validateCVV(cardData.cvv)) {
          return res.status(400).json({ success: false, message: 'Invalid CVV' });
        }
      }

      let subtotal = 0;
      let serviceTotal = 0;
      let experienceTotal = 0;
      const processedItems = [];

      for (const item of items) {
        if (item.type === 'listing') {
          const listingsCollection = db.collection('listings');
          const listing = await listingsCollection.findOne({ _id: new ObjectId(item.id) });
          
          if (!listing) {
            return res.status(404).json({ success: false, message: `Listing ${item.id} not found` });
          }

          const blockedDatesCollection = db.collection('blockedDates');
          const blockedDate = await blockedDatesCollection.findOne({
            listingId: item.id,
            $or: [
              { startDate: { $lte: item.checkOut }, endDate: { $gte: item.checkIn } },
              { startDate: { $lte: item.checkIn }, endDate: { $gte: item.checkOut } }
            ]
          });

          if (blockedDate) {
            return res.status(409).json({ 
              success: false, 
              message: `Dates blocked for ${listing.title}`
            });
          }

          const checkInDate = new Date(item.checkIn);
          const checkOutDate = new Date(item.checkOut);
          const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
          const basePrice = listing.nightlyRate * Math.max(1, nights);
          const cleaningFee = listing.cleaningFee || 0;
          const itemTotal = basePrice + cleaningFee;

          subtotal += itemTotal;
          processedItems.push({
            ...item,
            listingTitle: listing.title,
            providerId: listing.ownerId,
            nights,
            basePrice,
            cleaningFee,
            total: itemTotal,
          });
        } else if (item.type === 'service') {
          const servicesCollection = db.collection('services');
          const service = await servicesCollection.findOne({ _id: new ObjectId(item.id) });
          
          if (!service) {
            return res.status(404).json({ success: false, message: `Service ${item.id} not found` });
          }

          const itemTotal = service.price * (item.quantity || 1);
          serviceTotal += itemTotal;
          processedItems.push({
            ...item,
            serviceTitle: service.title,
            providerId: service.providerId,
            total: itemTotal,
          });
        } else if (item.type === 'experience') {
          const experiencesCollection = db.collection('experiences');
          const experience = await experiencesCollection.findOne({ _id: new ObjectId(item.id) });
          
          if (!experience) {
            return res.status(404).json({ success: false, message: `Experience ${item.id} not found` });
          }

          const itemTotal = experience.price * (item.guestsCount || 1);
          experienceTotal += itemTotal;
          processedItems.push({
            ...item,
            experienceTitle: experience.title,
            providerId: experience.providerId,
            total: itemTotal,
          });
        }
      }

      const grandTotal = subtotal + serviceTotal + experienceTotal;
      const platformFee = Math.round(grandTotal * 0.15);
      const tax = Math.round(grandTotal * 0.075);
      const finalTotal = grandTotal + platformFee + tax;

      const fraudCheck = detectFraud({
        amount: finalTotal,
        ip: req.headers?.['x-forwarded-for'] || 'unknown',
        userAgent: req.headers?.['user-agent'] || '',
        email: auth.user.email || '',
        cardToken: cardData ? tokenizeCard(cardData.number, cardData.expiry, cardData.cvv).token : '',
        timestamp: Date.now(),
      });

      if (fraudCheck.riskScore > 70) {
        logSecurityEvent({
          type: 'FRAUD_DETECTED',
          severity: 'high',
          details: { 
            riskScore: fraudCheck.riskScore, 
            flags: fraudCheck.flags,
            userId: auth.user.userId 
          },
          userId: auth.user.userId,
        });
        return res.status(403).json({ 
          success: false, 
          message: 'Transaction flagged for review' 
        });
      }

      let cardToken = null;
      if (cardData) {
        const tokenized = tokenizeCard(cardData.number, cardData.expiry, cardData.cvv);
        cardToken = tokenized.token;
      }

      const reference = generateReference('CL');
      const bookingId = `booking-${Date.now()}`;

      const bookingsCollection = db.collection('bookings');
      const createdBookings = [];

      for (const item of processedItems.filter(i => i.type === 'listing')) {
        const booking = {
          id: `booking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          listingId: item.id,
          listingTitle: item.listingTitle,
          guestId: auth.user.userId,
          guestName: sanitizeInput(auth.user.name || 'Guest'),
          guestEmail: auth.user.email || '',
          checkIn: item.checkIn,
          checkOut: item.checkOut,
          guestsCount: item.guestsCount || 1,
          nights: item.nights,
          totalAmount: item.total,
          status: 'pending',
          services: item.services || [],
          serviceIds: item.serviceIds || [],
          providerId: item.providerId,
          providerAssignmentStatus: 'unassigned',
          reference,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const result = await bookingsCollection.insertOne(booking);
        createdBookings.push({ ...booking, _id: result.insertedId });
      }

      const transactionsCollection = db.collection('transactions');
      const transaction = {
        id: `tx-${Date.now()}`,
        bookingId,
        userId: auth.user.userId,
        amount: finalTotal,
        type: 'booking_revenue',
        status: 'pending',
        description: `Checkout for ${processedItems.length} items`,
        reference,
        cardToken,
        cardLast4: cardData?.number?.slice(-4),
        cardBrand: cardData ? tokenizeCard(cardData.number, cardData.expiry, cardData.cvv).brand : null,
        billingAddress: billingAddress ? sanitizeInput(JSON.stringify(billingAddress)) : null,
        subtotal,
        serviceTotal,
        experienceTotal,
        platformFee,
        tax,
        finalTotal,
        items: processedItems,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await transactionsCollection.insertOne(transaction);

      const notificationsCollection = db.collection('notifications');
      
      const providerIds = [...new Set(processedItems.map(i => i.providerId).filter(Boolean))];
      for (const providerId of providerIds) {
        await notificationsCollection.insertOne({
          id: `notif-${Date.now()}-${providerId}`,
          userId: providerId,
          title: 'New Booking Received',
          message: `You have received a new booking. Reference: ${reference}`,
          type: 'booking',
          targetRole: 'service_provider',
          read: false,
          bookingId,
          sentAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        });
      }

      await notificationsCollection.insertOne({
        id: `notif-admin-${Date.now()}`,
        userId: 'admin',
        title: 'New Checkout Completed',
        message: `New checkout completed. Reference: ${reference}, Total: ₦${finalTotal.toLocaleString()}`,
        type: 'booking',
        targetRole: 'admin',
        read: false,
        bookingId,
        sentAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      });

      logAudit('CHECKOUT_COMPLETED', auth.user.userId, { 
        bookingId,
        reference,
        totalAmount: finalTotal,
        itemCount: processedItems.length,
        fraudScore: fraudCheck.riskScore,
      });

      logSecurityEvent({
        type: 'PAYMENT_PROCESSED',
        severity: 'medium',
        details: {
          userId: auth.user.userId,
          amount: finalTotal,
          reference,
          bookingId,
        },
        userId: auth.user.userId,
      });

      return res.status(201).json({ 
        success: true, 
        data: {
          bookingId,
          reference,
          bookings: createdBookings,
          transaction,
          summary: {
            subtotal,
            serviceTotal,
            experienceTotal,
            platformFee,
            tax,
            finalTotal,
          },
          fraudCheck: {
            riskScore: fraudCheck.riskScore,
            flags: fraudCheck.flags,
          }
        },
        message: 'Checkout completed successfully'
      });
    }

    return res.status(404).json({ success: false, message: 'Endpoint not found' });
  } catch (error: any) {
    console.error('Operations API error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
