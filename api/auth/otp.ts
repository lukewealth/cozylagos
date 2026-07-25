import { connectToDatabase } from '../../src/lib/mongodb';
import { addSecurityHeaders, checkRateLimit } from '../../src/lib/middleware';
import { emailService } from '../../src/lib/emailService';
import { firebaseAdmin } from '../../src/lib/firebaseAdmin';
import { ObjectId } from 'mongodb';

const otpStore = new Map<string, { otp: string; expiresAt: number; email: string }>();

export default async function handler(req: any, res: any) {
  addSecurityHeaders(res);
  const { method } = req;

  try {
    const rateCheck = checkRateLimit(req, 10, 60000);
    if (!rateCheck.allowed) {
      return res.status(429).json({ success: false, message: 'Too many requests. Please try again later.' });
    }

    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');

    switch (method) {
      case 'POST': {
        const path = req.url || '';

        // Send OTP
        if (path.includes('/send-otp')) {
          const { email, userName, userRole } = req.body;
          
          if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
          }

          // Generate 6-digit OTP
          const otp = Math.floor(100000 + Math.random() * 900000).toString();
          const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

          // Store OTP
          otpStore.set(email, { otp, expiresAt, email });

          // Send email via Resend
          const emailResult = await emailService.sendOTP(email, otp, userName);
          
          if (!emailResult.success) {
            return res.status(500).json({ 
              success: false, 
              message: 'Failed to send verification email' 
            });
          }

          return res.status(200).json({ 
            success: true, 
            message: 'Verification code sent to your email',
            expiresAt 
          });
        }

        // Verify OTP
        if (path.includes('/verify-otp')) {
          const { email, otp } = req.body;
          
          if (!email || !otp) {
            return res.status(400).json({ success: false, message: 'Email and OTP are required' });
          }

          const storedOTP = otpStore.get(email);
          
          if (!storedOTP) {
            return res.status(400).json({ success: false, message: 'No verification code found. Please request a new one.' });
          }

          if (Date.now() > storedOTP.expiresAt) {
            otpStore.delete(email);
            return res.status(400).json({ success: false, message: 'Verification code has expired. Please request a new one.' });
          }

          if (storedOTP.otp !== otp) {
            return res.status(400).json({ success: false, message: 'Invalid verification code' });
          }

          // OTP verified, remove from store
          otpStore.delete(email);

          // Mark user as verified in database
          await usersCollection.updateOne(
            { email },
            { $set: { verified: true, verifiedAt: new Date().toISOString() } }
          );

          // If Firebase Admin is available, verify email in Firebase
          if (firebaseAdmin) {
            try {
              const user = await firebaseAdmin.getUserByEmail(email);
              if (user && !user.emailVerified) {
                await firebaseAdmin.updateUser(user.uid, { emailVerified: true });
              }
            } catch (error) {
              console.warn('Firebase email verification skipped:', error);
            }
          }

          return res.status(200).json({ 
            success: true, 
            message: 'Email verified successfully' 
          });
        }

        // Resend OTP
        if (path.includes('/resend-otp')) {
          const { email, userName, userRole } = req.body;
          
          if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
          }

          const storedOTP = otpStore.get(email);
          
          // Check if OTP was sent recently (within 60 seconds)
          if (storedOTP && Date.now() < storedOTP.expiresAt - 9 * 60 * 1000) {
            return res.status(429).json({ 
              success: false, 
              message: 'Please wait before requesting a new code' 
            });
          }

          // Generate new OTP
          const otp = Math.floor(100000 + Math.random() * 900000).toString();
          const expiresAt = Date.now() + 10 * 60 * 1000;

          otpStore.set(email, { otp, expiresAt, email });

          const emailResult = await emailService.sendOTP(email, otp, userName);
          
          if (!emailResult.success) {
            return res.status(500).json({ 
              success: false, 
              message: 'Failed to send verification email' 
            });
          }

          return res.status(200).json({ 
            success: true, 
            message: 'New verification code sent',
            expiresAt 
          });
        }

        return res.status(404).json({ success: false, message: 'Endpoint not found' });
      }

      default:
        return res.status(405).json({ success: false, message: `Method ${method} not allowed` });
    }
  } catch (error: any) {
    console.error('OTP API error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
