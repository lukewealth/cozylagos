import { connectToDatabase } from '../src/lib/mongodb';
import { authenticateRequest, validateRequestBody, addSecurityHeaders, logAudit, checkRateLimit, logSecurityEvent } from '../src/lib/middleware';
import { sanitizeInput, generateReference, tokenizeCard, validateCardNumber, validateExpiry, validateCVV, detectFraud } from '../src/lib/security';
import { ObjectId } from 'mongodb';

export default async function handler(req: any, res: any) {
  addSecurityHeaders(res);
  const { method } = req;

  try {
    const rateCheck = checkRateLimit(req, 30, 60000); // Stricter rate limit for checkout
    if (!rateCheck.allowed) {
      logSecurityEvent({
        type: 'RATE_LIMIT_EXCEEDED',
        severity: 'high',
        details: { endpoint: '/api/checkout', ip: req.headers?.['x-forwarded-for'] },
      });
      return res.status(429).json({ success: false, message: 'Too many requests' });
    }

    const { db } = await connectToDatabase();

    switch (method) {
      case 'POST': {
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

        // Validate payment method
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

        // Calculate totals
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

            // Check for blocked dates
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
        const tax = Math.round(grandTotal * 0.075); // 7.5% VAT
        const finalTotal = grandTotal + platformFee + tax;

        // Fraud detection
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

        // Tokenize card if provided
        let cardToken = null;
        if (cardData) {
          const tokenized = tokenizeCard(cardData.number, cardData.expiry, cardData.cvv);
          cardToken = tokenized.token;
        }

        // Create booking reference
        const reference = generateReference('CL');
        const bookingId = `booking-${Date.now()}`;

        // Create bookings for listings
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

        // Create transactions
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

        // Send notifications
        const notificationsCollection = db.collection('notifications');
        
        // Notify providers
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

        // Notify admin
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

      default:
        return res.status(405).json({ success: false, message: `Method ${method} not allowed` });
    }
  } catch (error: any) {
    console.error('Checkout API error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
