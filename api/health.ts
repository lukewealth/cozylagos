import { connectToDatabase } from '../src/lib/mongodb';

export default async function handler(req, res) {
  try {
    const { db } = await connectToDatabase();
    
    // Test connection
    await db.command({ ping: 1 });
    
    res.status(200).json({
      status: 'ok',
      message: 'MongoDB connection successful',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'error',
      message: 'MongoDB connection failed',
      error: error.message,
    });
  }
}
