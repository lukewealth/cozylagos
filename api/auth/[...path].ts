import { connectToDatabase } from '../../src/lib/mongodb';
import { hashPassword, verifyPasswordHash, signJWT, verifyJWT, validateEmail, sanitizeInput, generateReference } from '../../src/lib/security';
import { authenticateRequest, validateRequestBody, addSecurityHeaders, logAudit, checkRateLimit } from '../../src/lib/middleware';
import { ObjectId } from 'mongodb';

export default async function handler(req: any, res: any) {
  addSecurityHeaders(res);
  const { method } = req;

  try {
    const rateCheck = checkRateLimit(req, 30, 60000);
    if (!rateCheck.allowed) {
      return res.status(429).json({ success: false, message: 'Too many requests. Please try again later.' });
    }

    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');

    switch (method) {
      case 'POST': {
        const path = req.url || '';

        if (path.includes('/login')) {
          const validation = validateRequestBody(req.body, {
            email: { type: 'string', required: true },
            password: { type: 'string', required: true, min: 6 },
          });
          if (!validation.valid) {
            return res.status(400).json({ success: false, message: validation.errors.join(', ') });
          }

          const { email, password } = req.body;
          const sanitizedEmail = sanitizeInput(email).toLowerCase();

          const user = await usersCollection.findOne({ email: sanitizedEmail });
          if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
          }

          const passwordValid = verifyPasswordHash(password, user.password);
          if (!passwordValid) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
          }

          const token = signJWT({
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
            name: user.name,
          });

          await usersCollection.updateOne(
            { _id: user._id },
            { $set: { lastLogin: new Date().toISOString() } }
          );

          logAudit('USER_LOGIN', user._id.toString(), { email: user.email, role: user.role });

          const { password: _, ...safeUser } = user;
          return res.status(200).json({
            success: true,
            data: { token, user: { ...safeUser, id: user._id.toString() } },
          });
        }

        if (path.includes('/register')) {
          const validation = validateRequestBody(req.body, {
            email: { type: 'string', required: true },
            name: { type: 'string', required: true, min: 2, max: 100 },
            password: { type: 'string', required: true, min: 8, max: 128 },
            role: { type: 'string', required: true },
          });
          if (!validation.valid) {
            return res.status(400).json({ success: false, message: validation.errors.join(', ') });
          }

          const { email, name, password, role, phone } = req.body;
          const sanitizedEmail = sanitizeInput(email).toLowerCase();
          const sanitizedName = sanitizeInput(name);

          if (!validateEmail(sanitizedEmail)) {
            return res.status(400).json({ success: false, message: 'Invalid email format' });
          }

          const validRoles = ['guest', 'user', 'service_provider'];
          if (!validRoles.includes(role)) {
            return res.status(400).json({ success: false, message: 'Invalid role. Must be guest, user, or service_provider' });
          }

          const existingUser = await usersCollection.findOne({ email: sanitizedEmail });
          if (existingUser) {
            return res.status(409).json({ success: false, message: 'User with this email already exists' });
          }

          const hashedPassword = hashPassword(password);

          const newUser = {
            email: sanitizedEmail,
            name: sanitizedName,
            password: hashedPassword,
            role,
            phone: phone ? sanitizeInput(phone) : '',
            verified: false,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            loyaltyPoints: 0,
            preferences: {},
            loginHistory: [],
          };

          const result = await usersCollection.insertOne(newUser);

          const token = signJWT({
            userId: result.insertedId.toString(),
            email: sanitizedEmail,
            role,
            name: sanitizedName,
          });

          logAudit('USER_REGISTER', result.insertedId.toString(), { email: sanitizedEmail, role });

          return res.status(201).json({
            success: true,
            data: {
              token,
              user: {
                id: result.insertedId.toString(),
                email: sanitizedEmail,
                name: sanitizedName,
                role,
                phone: newUser.phone,
                verified: false,
                createdAt: newUser.createdAt,
                loyaltyPoints: 0,
              },
            },
          });
        }

        if (path.includes('/logout')) {
          const auth = authenticateRequest(req);
          if (auth.authenticated) {
            logAudit('USER_LOGOUT', auth.user.userId);
          }
          return res.status(200).json({ success: true, message: 'Logged out successfully' });
        }

        return res.status(404).json({ success: false, message: 'Auth endpoint not found' });
      }

      case 'GET': {
        const auth = authenticateRequest(req);
        if (!auth.authenticated) {
          return res.status(401).json({ success: false, message: auth.error });
        }

        const user = await usersCollection.findOne(
          { _id: new ObjectId(auth.user.userId) },
          { projection: { password: 0 } }
        );

        if (!user) {
          return res.status(404).json({ success: false, message: 'User not found' });
        }

        return res.status(200).json({
          success: true,
          data: { ...user, id: user._id.toString() },
        });
      }

      case 'PUT': {
        const auth = authenticateRequest(req);
        if (!auth.authenticated) {
          return res.status(401).json({ success: false, message: auth.error });
        }

        const { name, phone, preferences, avatar } = req.body;
        const updateFields: any = { updatedAt: new Date().toISOString() };

        if (name) updateFields.name = sanitizeInput(name);
        if (phone) updateFields.phone = sanitizeInput(phone);
        if (preferences) updateFields.preferences = preferences;
        if (avatar) updateFields.avatar = sanitizeInput(avatar);

        const result = await usersCollection.updateOne(
          { _id: new ObjectId(auth.user.userId) },
          { $set: updateFields }
        );

        if (result.matchedCount === 0) {
          return res.status(404).json({ success: false, message: 'User not found' });
        }

        logAudit('PROFILE_UPDATE', auth.user.userId, { fields: Object.keys(updateFields) });

        return res.status(200).json({ success: true, message: 'Profile updated successfully' });
      }

      case 'PATCH': {
        const auth = authenticateRequest(req);
        if (!auth.authenticated) {
          return res.status(401).json({ success: false, message: auth.error });
        }

        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
          return res.status(400).json({ success: false, message: 'Current and new passwords are required' });
        }

        if (newPassword.length < 8) {
          return res.status(400).json({ success: false, message: 'New password must be at least 8 characters' });
        }

        const user = await usersCollection.findOne({ _id: new ObjectId(auth.user.userId) });
        if (!user) {
          return res.status(404).json({ success: false, message: 'User not found' });
        }

        const currentValid = verifyPasswordHash(currentPassword, user.password);
        if (!currentValid) {
          return res.status(401).json({ success: false, message: 'Current password is incorrect' });
        }

        const newHashedPassword = hashPassword(newPassword);
        await usersCollection.updateOne(
          { _id: user._id },
          { $set: { password: newHashedPassword, updatedAt: new Date().toISOString() } }
        );

        logAudit('PASSWORD_CHANGE', auth.user.userId);

        return res.status(200).json({ success: true, message: 'Password changed successfully' });
      }

      default:
        return res.status(405).json({ success: false, message: `Method ${method} not allowed` });
    }
  } catch (error: any) {
    console.error('Auth API error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
