import { connectToDatabase } from '../src/lib/mongodb';
import { addSecurityHeaders } from '../src/lib/middleware';

export default async function handler(req: any, res: any) {
  addSecurityHeaders(res);

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { db } = await connectToDatabase();
    await db.command({ ping: 1 });
    
    return res.status(200).json({
      success: true,
      status: 'healthy',
      database: 'connected',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      status: 'error',
      database: 'disconnected',
      message: 'Health check failed',
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}
