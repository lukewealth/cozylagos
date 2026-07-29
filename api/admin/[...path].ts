import { connectToDatabase } from '../../src/lib/mongodb';
import { authenticateRequest, authorizeRole, validateRequestBody, addSecurityHeaders, logAudit, checkRateLimit } from '../../src/lib/middleware';
import { sanitizeInput, generateReference } from '../../src/lib/security';
import { ObjectId } from 'mongodb';

const ASSET_ALLOWED_FIELDS = ['name', 'category', 'status', 'assetCode', 'image', 'assignedTo', 'lastServiceDate', 'tags', 'notes'];

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
    const assetsCollection = db.collection('assets');

    switch (method) {
      case 'GET': {
        const path = req.url || '';

        if (path.includes('/health')) {
          try {
            await db.command({ ping: 1 });
            return res.status(200).json({
              status: 'ok',
              message: 'MongoDB connection successful',
              timestamp: new Date().toISOString(),
            });
          } catch (error: any) {
            return res.status(500).json({
              status: 'error',
              message: 'MongoDB connection failed',
              error: error.message,
            });
          }
        }

        const auth = authenticateRequest(req);
        if (!auth.authenticated) {
          return res.status(401).json({ success: false, message: auth.error });
        }

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

        if (path.includes('/assets')) {
          if (!authorizeRole('admin', auth.user.role)) {
            return res.status(403).json({ success: false, message: 'Admin access required' });
          }

          const { category, status, assignedTo, search } = req.query;
          let filter: any = {};
          if (category) filter.category = category;
          if (status) filter.status = status;
          if (assignedTo) filter.assignedTo = assignedTo;
          if (search) {
            filter.$or = [
              { name: { $regex: search, $options: 'i' } },
              { assetCode: { $regex: search, $options: 'i' } },
            ];
          }

          const assets = await assetsCollection.find(filter).sort({ createdAt: -1 }).toArray();
          return res.status(200).json({ success: true, data: assets, count: assets.length });
        }

        if (path.includes('/withdrawals')) {
          if (!authorizeRole('admin', auth.user.role)) {
            return res.status(403).json({ success: false, message: 'Admin access required' });
          }

          const withdrawalsCollection = db.collection('withdrawals');
          const { status, providerId } = req.query;
          let filter: any = {};

          if (status) filter.status = status;
          if (providerId) filter.providerId = providerId;

          const withdrawals = await withdrawalsCollection
            .find(filter)
            .sort({ createdAt: -1 })
            .toArray();

          return res.status(200).json({ success: true, data: withdrawals });
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

        if (path.includes('/assets')) {
          if (!authorizeRole('admin', auth.user.role)) {
            return res.status(403).json({ success: false, message: 'Admin access required' });
          }

          const { method: assetMethod } = req;

          if (req.method === 'PUT' || req.method === 'PATCH') {
            const { id, ...updateData } = req.body;
            if (!id) {
              return res.status(400).json({ success: false, message: 'Asset ID is required' });
            }

            const sanitized: any = { updatedAt: new Date().toISOString() };

            if (req.method === 'PUT') {
              for (const field of ASSET_ALLOWED_FIELDS) {
                if (updateData[field] !== undefined) {
                  sanitized[field] = typeof updateData[field] === 'string' ? sanitizeInput(updateData[field]) : updateData[field];
                }
              }
            } else {
              if (updateData.status) sanitized.status = updateData.status;
              if (updateData.assignedTo !== undefined) sanitized.assignedTo = updateData.assignedTo;
            }

            const updateResult = await assetsCollection.updateOne(
              { _id: new ObjectId(id) },
              { $set: sanitized }
            );

            if (updateResult.matchedCount === 0) {
              return res.status(404).json({ success: false, message: 'Asset not found' });
            }

            logAudit('ASSET_UPDATED', auth.user.userId, { assetId: id });
            return res.status(200).json({ success: true, message: 'Asset updated successfully' });
          }

          if (req.method === 'DELETE') {
            const { id: deleteId } = req.body;
            if (!deleteId) {
              return res.status(400).json({ success: false, message: 'Asset ID is required' });
            }

            const deleteResult = await assetsCollection.deleteOne({ _id: new ObjectId(deleteId) });
            if (deleteResult.deletedCount === 0) {
              return res.status(404).json({ success: false, message: 'Asset not found' });
            }

            logAudit('ASSET_DELETED', auth.user.userId, { assetId: deleteId });
            return res.status(200).json({ success: true, message: 'Asset deleted successfully' });
          }

          const validation = validateRequestBody(req.body, {
            name: { type: 'string', required: true, min: 2, max: 200 },
            assetCode: { type: 'string', required: true, min: 2 },
          });
          if (!validation.valid) {
            return res.status(400).json({ success: false, message: validation.errors.join(', ') });
          }

          const assetData = req.body;
          const sanitizedCode = sanitizeInput(assetData.assetCode);

          const existing = await assetsCollection.findOne({ assetCode: sanitizedCode });
          if (existing) {
            return res.status(409).json({ success: false, message: 'Asset with this code already exists' });
          }

          const newAsset = {
            ...assetData,
            name: sanitizeInput(assetData.name),
            assetCode: sanitizedCode,
            status: assetData.status || 'available',
            tags: assetData.tags || [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          const result = await assetsCollection.insertOne(newAsset);
          logAudit('ASSET_CREATED', auth.user.userId, { assetId: result.insertedId.toString(), assetCode: sanitizedCode });

          return res.status(201).json({ success: true, data: { ...newAsset, _id: result.insertedId } });
        }

        return res.status(404).json({ success: false, message: 'Admin endpoint not found' });
      }

      case 'PATCH': {
        const auth = authenticateRequest(req);
        if (!auth.authenticated) {
          return res.status(401).json({ success: false, message: auth.error });
        }
        if (!authorizeRole('admin', auth.user.role)) {
          return res.status(403).json({ success: false, message: 'Admin access required' });
        }

        const path = req.url || '';

        if (path.includes('/withdrawals')) {
          const withdrawalsCollection = db.collection('withdrawals');
          const { id, status, adminNotes, rejectionReason } = req.body;
          if (!id) {
            return res.status(400).json({ success: false, message: 'Withdrawal ID is required' });
          }

          const updateFields: any = {
            updatedAt: new Date().toISOString(),
            reviewedBy: auth.user.userId,
            reviewedAt: new Date().toISOString()
          };

          if (status) updateFields.status = status;
          if (adminNotes) updateFields.adminNotes = sanitizeInput(adminNotes);
          if (rejectionReason) updateFields.rejectionReason = sanitizeInput(rejectionReason);

          if (status === 'completed') {
            updateFields.completedAt = new Date().toISOString();

            // Create a transaction record for the withdrawal
            const withdrawal = await withdrawalsCollection.findOne({ _id: new ObjectId(id) });
            if (withdrawal) {
              await transactionsCollection.insertOne({
                reference: generateReference('TX'),
                userId: withdrawal.providerId,
                type: 'withdrawal',
                amount: -withdrawal.amount,
                status: 'processed',
                description: `Withdrawal ${withdrawal.reference} processed`,
                withdrawalId: id,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              });
            }
          }

          const result = await withdrawalsCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updateFields }
          );

          if (result.matchedCount === 0) {
            return res.status(404).json({ success: false, message: 'Withdrawal not found' });
          }

          logAudit('WITHDRAWAL_UPDATED', auth.user.userId, {
            withdrawalId: id,
            status
          });

          return res.status(200).json({ success: true, message: 'Withdrawal updated successfully' });
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
