import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectToDatabase } from '../src/lib/mongodb';
import { addSecurityHeaders, checkRateLimit } from '../src/lib/middleware';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  addSecurityHeaders(res);

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const rateCheck = checkRateLimit(req, 100, 60000);
    if (!rateCheck.allowed) {
      return res.status(429).json({ success: false, message: 'Too many requests' });
    }

    const { events, userId, sessionId, userAgent, timestamp } = req.body;

    if (!events || !Array.isArray(events) || events.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid events data' });
    }

    const { db } = await connectToDatabase();
    const analyticsCollection = db.collection('analytics');

    const analyticsDocs = events.map((event: any) => ({
      event: event.event,
      category: event.category,
      label: event.label,
      value: event.value,
      metadata: event.metadata || {},
      userId: userId || null,
      sessionId: sessionId || null,
      userAgent: userAgent || req.headers['user-agent'],
      ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      pagePath: event.pagePath || req.headers.referer || '',
      timestamp: event.timestamp || timestamp || new Date().toISOString(),
      createdAt: new Date().toISOString(),
    }));

    await analyticsCollection.insertMany(analyticsDocs);

    return res.status(200).json({ 
      success: true, 
      message: 'Analytics events recorded',
      count: analyticsDocs.length 
    });
  } catch (error: any) {
    console.error('Analytics API error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
