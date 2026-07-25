import { connectToDatabase } from '../../src/lib/mongodb';
import { authenticateRequest, authorizeRole, validateRequestBody, addSecurityHeaders, logAudit, checkRateLimit } from '../../src/lib/middleware';
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
    const bookingsCollection = db.collection('bookings');
    const transactionsCollection = db.collection('transactions');
    const usersCollection = db.collection('users');
    const listingsCollection = db.collection('listings');

    switch (method) {
      case 'GET': {
        const auth = authenticateRequest(req);
        if (!auth.authenticated) {
          return res.status(401).json({ success: false, message: auth.error });
        }

        const path = req.url || '';

        if (path.includes('/stats')) {
          if (!authorizeRole('admin', auth.user.role)) {
            return res.status(403).json({ success: false, message: 'Admin access required' });
          }

          const [totalBookings, pendingBookings, confirmedBookings, totalUsers, totalListings, allTransactions] = await Promise.all([
            bookingsCollection.countDocuments(),
            bookingsCollection.countDocuments({ status: 'pending' }),
            bookingsCollection.countDocuments({ status: 'confirmed' }),
            usersCollection.countDocuments(),
            listingsCollection.countDocuments(),
            transactionsCollection.find({}).toArray(),
          ]);

          const totalRevenue = allTransactions.reduce((sum: number, t: any) => sum + (t.amount || 0), 0);
          const pendingRevenue = allTransactions.filter((t: any) => t.status === 'pending').reduce((sum: number, t: any) => sum + (t.amount || 0), 0);
          const processedRevenue = allTransactions.filter((t: any) => t.status === 'processed').reduce((sum: number, t: any) => sum + (t.amount || 0), 0);
          const platformCut = Math.round(processedRevenue * 0.15);
          const providerCut = processedRevenue - platformCut;

          const recentBookings = await bookingsCollection.find({}).sort({ createdAt: -1 }).limit(10).toArray();
          const recentTransactions = await transactionsCollection.find({}).sort({ createdAt: -1 }).limit(10).toArray();

          const bookingsByStatus = await bookingsCollection.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 }, total: { $sum: '$totalAmount' } } },
          ]).toArray();

          const revenueByMonth = await transactionsCollection.aggregate([
            { $group: { _id: { $substr: ['$createdAt', 0, 7] }, total: { $sum: '$amount' }, count: { $sum: 1 } } },
            { $sort: { _id: -1 } },
            { $limit: 12 },
          ]).toArray();

          return res.status(200).json({
            success: true,
            data: {
              overview: {
                totalBookings,
                pendingBookings,
                confirmedBookings,
                totalUsers,
                totalListings,
                totalRevenue,
                pendingRevenue,
                processedRevenue,
                platformCut,
                providerCut,
              },
              bookingsByStatus,
              revenueByMonth,
              recentBookings,
              recentTransactions,
            },
          });
        }

        if (path.includes('/audit')) {
          if (!authorizeRole('admin', auth.user.role)) {
            return res.status(403).json({ success: false, message: 'Admin access required' });
          }

          const { startDate, endDate, status, type } = req.query;
          let filter: any = {};

          if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = startDate;
            if (endDate) filter.createdAt.$lte = endDate;
          }
          if (status) filter.status = status;

          const bookings = await bookingsCollection.find(filter).sort({ createdAt: -1 }).toArray();

          const auditData = bookings.map((b: any) => {
            const total = b.totalAmount || 0;
            const platformCut = Math.round(total * 0.15);
            const providerCut = total - platformCut;
            return {
              id: b._id.toString(),
              reference: b.paymentLedger?.reference || b._id.toString(),
              guestName: b.guestName,
              guestEmail: b.guestEmail,
              listingTitle: b.listingTitle,
              checkIn: b.checkIn,
              checkOut: b.checkOut,
              totalAmount: total,
              platformCut,
              providerCut,
              paymentStatus: b.paymentLedger?.paymentStatus || 'pending',
              status: b.status,
              services: b.services || [],
              createdAt: b.createdAt,
            };
          });

          const summary = {
            totalTransactions: auditData.length,
            totalRevenue: auditData.reduce((sum, a) => sum + a.totalAmount, 0),
            totalPlatformCut: auditData.reduce((sum, a) => sum + a.platformCut, 0),
            totalProviderCut: auditData.reduce((sum, a) => sum + a.providerCut, 0),
            pendingPayments: auditData.filter(a => a.paymentStatus === 'pending').length,
            processedPayments: auditData.filter(a => a.paymentStatus === 'processed').length,
          };

          return res.status(200).json({ success: true, data: { auditData, summary } });
        }

        return res.status(404).json({ success: false, message: 'Admin endpoint not found' });
      }

      case 'POST': {
        const auth = authenticateRequest(req);
        if (!auth.authenticated) {
          return res.status(401).json({ success: false, message: auth.error });
        }
        if (!authorizeRole('admin', auth.user.role)) {
          return res.status(403).json({ success: false, message: 'Admin access required' });
        }

        const path = req.url || '';

        if (path.includes('/process-payout')) {
          const { bookingId, amount, method } = req.body;
          if (!bookingId || !amount) {
            return res.status(400).json({ success: false, message: 'bookingId and amount are required' });
          }

          const booking = await bookingsCollection.findOne({ _id: new ObjectId(bookingId) });
          if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
          }

          const payoutTx = {
            date: new Date().toISOString(),
            reference: generateReference('PAYOUT'),
            type: 'payout',
            amount,
            status: 'processed',
            description: `Payout for booking: ${booking.listingTitle || bookingId}`,
            userId: booking.providerId || auth.user.userId,
            bookingId,
            method: method || 'bank_transfer',
            processedBy: auth.user.userId,
            createdAt: new Date().toISOString(),
          };

          await transactionsCollection.insertOne(payoutTx);

          await bookingsCollection.updateOne(
            { _id: new ObjectId(bookingId) },
            {
              $set: {
                'paymentLedger.paymentStatus': 'processed',
                updatedAt: new Date().toISOString(),
              },
            }
          );

          logAudit('PAYOUT_PROCESSED', auth.user.userId, { bookingId, amount });

          return res.status(201).json({ success: true, data: payoutTx });
        }

        return res.status(404).json({ success: false, message: 'Admin endpoint not found' });
      }

      default:
        return res.status(405).json({ success: false, message: `Method ${method} not allowed` });
    }
  } catch (error: any) {
    console.error('Admin API error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
