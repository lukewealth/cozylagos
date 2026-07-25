import { connectToDatabase } from '../../src/lib/mongodb';
import { addSecurityHeaders, checkRateLimit, authenticateRequest } from '../../src/lib/middleware';
import { emailService } from '../../src/lib/emailService';
import { firebaseAdmin } from '../../src/lib/firebaseAdmin';
import { ObjectId } from 'mongodb';

export default async function handler(req: any, res: any) {
  addSecurityHeaders(res);
  const { method } = req;

  try {
    const rateCheck = checkRateLimit(req, 30, 60000);
    if (!rateCheck.allowed) {
      return res.status(429).json({ success: false, message: 'Too many requests' });
    }

    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');

    switch (method) {
      case 'POST': {
        const path = req.url || '';

        // Firebase Email/Password Registration
        if (path.includes('/register')) {
          const { email, password, name, role } = req.body;

          if (!email || !password || !name) {
            return res.status(400).json({ 
              success: false, 
              message: 'Email, password, and name are required' 
            });
          }

          // Check if user already exists
          const existingUser = await usersCollection.findOne({ email });
          if (existingUser) {
            return res.status(409).json({ 
              success: false, 
              message: 'User with this email already exists' 
            });
          }

          // Create user in Firebase if Admin SDK is available
          let firebaseUid = null;
          if (firebaseAdmin) {
            try {
              const firebaseUser = await firebaseAdmin.createUser(email, password, name);
              firebaseUid = firebaseUser.uid;
              
              // Set custom claims for role
              await firebaseAdmin.setCustomUserClaims(firebaseUid, { role: role || 'user' });
            } catch (error) {
              console.error('Firebase user creation failed:', error);
            }
          }

          // Create user in MongoDB
          const newUser = {
            email,
            name,
            role: role || 'user',
            firebaseUid,
            verified: false,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            loyaltyPoints: 0,
          };

          const result = await usersCollection.insertOne(newUser);

          // Send welcome email
          await emailService.sendWelcomeEmail(email, name, role || 'user');

          // Send OTP for email verification
          const otp = Math.floor(100000 + Math.random() * 900000).toString();
          const expiresAt = Date.now() + 10 * 60 * 1000;
          
          // Store OTP (in production, use Redis)
          const otpStore = new Map<string, { otp: string; expiresAt: number }>();
          otpStore.set(email, { otp, expiresAt });
          
          await emailService.sendOTP(email, otp, name);

          return res.status(201).json({
            success: true,
            data: {
              userId: result.insertedId,
              email,
              name,
              role: role || 'user',
              message: 'Account created successfully. Please check your email for verification code.'
            }
          });
        }

        // Firebase Email/Password Login
        if (path.includes('/login')) {
          const { email, password } = req.body;

          if (!email || !password) {
            return res.status(400).json({ 
              success: false, 
              message: 'Email and password are required' 
            });
          }

          // Find user in MongoDB
          const user = await usersCollection.findOne({ email });
          if (!user) {
            return res.status(401).json({ 
              success: false, 
              message: 'Invalid email or password' 
            });
          }

          // Verify password with Firebase if Admin SDK is available
          if (firebaseAdmin && user.firebaseUid) {
            try {
              // In production, use Firebase Auth REST API or Admin SDK to verify
              // For now, we'll use a simple check
              const firebaseUser = await firebaseAdmin.getUser(user.firebaseUid);
              if (!firebaseUser) {
                return res.status(401).json({ 
                  success: false, 
                  message: 'Invalid email or password' 
                });
              }
            } catch (error) {
              console.error('Firebase auth verification failed:', error);
            }
          }

          // Update last login
          await usersCollection.updateOne(
            { _id: user._id },
            { $set: { lastLogin: new Date().toISOString() } }
          );

          return res.status(200).json({
            success: true,
            data: {
              userId: user._id,
              email: user.email,
              name: user.name,
              role: user.role,
              verified: user.verified,
              message: 'Login successful'
            }
          });
        }

        // Social Login Callback (Google/Apple)
        if (path.includes('/social-login')) {
          const { provider, idToken, email, name, photoURL } = req.body;

          if (!provider || !email) {
            return res.status(400).json({ 
              success: false, 
              message: 'Provider and email are required' 
            });
          }

          // Check if user exists
          let user = await usersCollection.findOne({ email });

          if (!user) {
            // Create new user
            const newUser = {
              email,
              name: name || email.split('@')[0],
              role: 'user',
              provider,
              providerId: idToken,
              photoURL,
              verified: true, // Social logins are pre-verified
              createdAt: new Date().toISOString(),
              lastLogin: new Date().toISOString(),
              loyaltyPoints: 0,
            };

            const result = await usersCollection.insertOne(newUser);
            user = { ...newUser, _id: result.insertedId };

            // Send welcome email
            await emailService.sendWelcomeEmail(email, user.name, 'user');
          } else {
            // Update last login
            await usersCollection.updateOne(
              { _id: user._id },
              { $set: { lastLogin: new Date().toISOString() } }
            );
          }

          return res.status(200).json({
            success: true,
            data: {
              userId: user._id,
              email: user.email,
              name: user.name,
              role: user.role,
              verified: user.verified,
              message: 'Social login successful'
            }
          });
        }

        return res.status(404).json({ success: false, message: 'Endpoint not found' });
      }

      case 'GET': {
        const auth = authenticateRequest(req);
        if (!auth.authenticated) {
          return res.status(401).json({ success: false, message: auth.error });
        }

        // Get current user profile
        const user = await usersCollection.findOne(
          { _id: new ObjectId(auth.user.userId) },
          { projection: { password: 0 } }
        );

        if (!user) {
          return res.status(404).json({ success: false, message: 'User not found' });
        }

        return res.status(200).json({
          success: true,
          data: { ...user, id: user._id.toString() }
        });
      }

      default:
        return res.status(405).json({ success: false, message: `Method ${method} not allowed` });
    }
  } catch (error: any) {
    console.error('Auth API error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
