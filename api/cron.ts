import { MongoClient } from 'mongodb';

const CRON_SECRET = process.env.CRON_SECRET || 'cozy_lagos_cron_secret';

function getMongoClient() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
  return new MongoClient(uri);
}

async function checkOverdueBookings(client: MongoClient) {
  const db = client.db(process.env.MONGODB_DB_NAME || 'cozy_lagos');
  const now = new Date();
  const result = await db.collection('bookings').updateMany(
    {
      status: { $in: ['confirmed', 'Confirmed'] },
      checkOut: { $lt: now.toISOString() },
    },
    {
      $set: { status: 'completed', updatedAt: now.toISOString() },
    }
  );
  return { modifiedCount: result.modifiedCount, action: 'auto_complete_overdue' };
}

async function expirePendingBookings(client: MongoClient) {
  const db = client.db(process.env.MONGODB_DB_NAME || 'cozy_lagos');
  const expiryThreshold = new Date(Date.now() - 48 * 60 * 60 * 1000);
  const result = await db.collection('bookings').updateMany(
    {
      status: { $in: ['pending', 'Pending'] },
      createdAt: { $lt: expiryThreshold.toISOString() },
    },
    {
      $set: { status: 'cancelled', cancellationReason: 'Auto-expired: pending over 48h', updatedAt: new Date().toISOString() },
    }
  );
  return { modifiedCount: result.modifiedCount, action: 'expire_stale_pending' };
}

async function syncNotificationDelivery(client: MongoClient) {
  const db = client.db(process.env.MONGODB_DB_NAME || 'cozy_lagos');
  const unreadCount = await db.collection('notifications').countDocuments({ read: false });
  return { unreadNotifications: unreadCount, action: 'sync_notifications' };
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${CRON_SECRET}` && req.headers['x-vercel-cron-secret'] !== CRON_SECRET) {
    const isVercelCron = req.headers['x-vercel-cron-secret'];
    if (!isVercelCron) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  let client: MongoClient | null = null;
  const results: Record<string, any> = {};

  try {
    client = getMongoClient();
    await client.connect();

    const [overdue, expired, notifications] = await Promise.all([
      checkOverdueBookings(client),
      expirePendingBookings(client),
      syncNotificationDelivery(client),
    ]);

    results.overdue = overdue;
    results.expired = expired;
    results.notifications = notifications;
    results.timestamp = new Date().toISOString();
    results.status = 'completed';

    return res.status(200).json(results);
  } catch (error: any) {
    console.error('Cron job failed:', error);
    return res.status(500).json({
      error: 'Cron job failed',
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  } finally {
    if (client) await client.close();
  }
}
