import { connectToDatabase } from '../src/lib/mongodb';
import { authenticateRequest, authorizeRole, validateRequestBody, addSecurityHeaders, logAudit, checkRateLimit } from '../src/lib/middleware';
import { sanitizeInput, hashPassword, maskSensitiveData } from '../src/lib/security';
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
    const usersCollection = db.collection('users');

    switch (method) {
      case 'GET': {
        const auth = authenticateRequest(req);
        if (!auth.authenticated) {
          return res.status(401).json({ success: false, message: auth.error });
        }

        const { role, email, id } = req.query;

        if (id) {
          const user = await usersCollection.findOne(
            { _id: new ObjectId(id as string) },
            { projection: { password: 0 } }
          );
          if (!user) return res.status(404).json({ success: false, message: 'User not found' });
          return res.status(200).json({ success: true, data: { ...user, id: user._id.toString() } });
        }

        let filter: any = {};
        if (role) filter.role = role;
        if (email) filter.email = sanitizeInput(email as string).toLowerCase();

        if (!authorizeRole('admin', auth.user.role)) {
          filter = { _id: new ObjectId(auth.user.userId) };
        }

        const users = await usersCollection.find(filter, { projection: { password: 0 } }).toArray();
        const safeUsers = users.map((u: any) => ({ ...u, id: u._id.toString() }));

        return res.status(200).json({ success: true, data: safeUsers });
      }

      case 'POST': {
        const auth = authenticateRequest(req);
        if (!auth.authenticated) {
          return res.status(401).json({ success: false, message: auth.error });
        }

        const validation = validateRequestBody(req.body, {
          email: { type: 'string', required: true },
          name: { type: 'string', required: true, min: 2, max: 100 },
          password: { type: 'string', required: true, min: 8 },
          role: { type: 'string', required: true },
        });
        if (!validation.valid) {
          return res.status(400).json({ success: false, message: validation.errors.join(', ') });
        }

        if (!authorizeRole('admin', auth.user.role)) {
          return res.status(403).json({ success: false, message: 'Admin access required to create users' });
        }

        const { email: newEmail, name, password, role, phone } = req.body;
        const sanitizedEmail = sanitizeInput(newEmail).toLowerCase();

        const existingUser = await usersCollection.findOne({ email: sanitizedEmail });
        if (existingUser) {
          return res.status(409).json({ success: false, message: 'User with this email already exists' });
        }

        const hashedPassword = hashPassword(password);
        const newUser = {
          email: sanitizedEmail,
          name: sanitizeInput(name),
          password: hashedPassword,
          role,
          phone: phone ? sanitizeInput(phone) : '',
          verified: false,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          loyaltyPoints: 0,
          preferences: {},
        };

        const result = await usersCollection.insertOne(newUser);
        logAudit('USER_CREATED', auth.user.userId, { newUserId: result.insertedId.toString(), role });

        return res.status(201).json({
          success: true,
          data: { id: result.insertedId.toString(), email: sanitizedEmail, name: sanitizeInput(name), role, phone: newUser.phone, verified: false, createdAt: newUser.createdAt, loyaltyPoints: 0 },
        });
      }

      case 'PUT': {
        const auth = authenticateRequest(req);
        if (!auth.authenticated) {
          return res.status(401).json({ success: false, message: auth.error });
        }

        const { id, ...updateData } = req.body;
        if (!id) {
          return res.status(400).json({ success: false, message: 'User ID is required' });
        }

        const targetId = new ObjectId(id);
        const isSelf = auth.user.userId === id;
        const isAdmin = authorizeRole('admin', auth.user.role);

        if (!isSelf && !isAdmin) {
          return res.status(403).json({ success: false, message: 'Cannot update other users' });
        }

        const sanitized: any = { updatedAt: new Date().toISOString() };
        if (updateData.name) sanitized.name = sanitizeInput(updateData.name);
        if (updateData.phone !== undefined) sanitized.phone = sanitizeInput(updateData.phone || '');
        if (updateData.preferences) sanitized.preferences = updateData.preferences;
        if (updateData.verified !== undefined && isAdmin) sanitized.verified = updateData.verified;
        if (updateData.role && isAdmin) sanitized.role = updateData.role;
        if (updateData.loyaltyPoints !== undefined && isAdmin) sanitized.loyaltyPoints = updateData.loyaltyPoints;

        if (updateData.password && isSelf) {
          sanitized.password = hashPassword(updateData.password);
        }

        const updateResult = await usersCollection.updateOne(
          { _id: targetId },
          { $set: sanitized }
        );

        if (updateResult.matchedCount === 0) {
          return res.status(404).json({ success: false, message: 'User not found' });
        }

        logAudit('USER_UPDATED', auth.user.userId, { targetUserId: id, fields: Object.keys(sanitized) });
        return res.status(200).json({ success: true, message: 'User updated successfully' });
      }

      case 'DELETE': {
        const auth = authenticateRequest(req);
        if (!auth.authenticated) {
          return res.status(401).json({ success: false, message: auth.error });
        }
        if (!authorizeRole('admin', auth.user.role)) {
          return res.status(403).json({ success: false, message: 'Admin access required' });
        }

        const { id: deleteId } = req.body;
        if (!deleteId) {
          return res.status(400).json({ success: false, message: 'User ID is required' });
        }

        const deleteResult = await usersCollection.deleteOne({ _id: new ObjectId(deleteId) });
        if (deleteResult.deletedCount === 0) {
          return res.status(404).json({ success: false, message: 'User not found' });
        }

        logAudit('USER_DELETED', auth.user.userId, { deletedUserId: deleteId });
        return res.status(200).json({ success: true, message: 'User deleted successfully' });
      }

      default:
        return res.status(405).json({ success: false, message: `Method ${method} not allowed` });
    }
  } catch (error: any) {
    console.error('Users API error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
