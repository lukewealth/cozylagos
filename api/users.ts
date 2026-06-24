import { connectToDatabase } from '../src/lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const { method } = req;

  try {
    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');

    switch (method) {
      case 'GET':
        // Get all users or filter by role
        const { role, email } = req.query;
        let filter = {};
        
        if (role) filter = { role };
        if (email) filter = { email };

        const users = await usersCollection.find(filter).toArray();
        
        // Remove sensitive data
        const sanitizedUsers = users.map(({ password, ...user }) => user);
        
        res.status(200).json({ success: true, data: sanitizedUsers });
        break;

      case 'POST':
        // Create new user
        const { email: newEmail, name, password, role, phone } = req.body;

        if (!newEmail || !name || !password || !role) {
          return res.status(400).json({ 
            success: false, 
            message: 'Missing required fields: email, name, password, role' 
          });
        }

        // Check if user exists
        const existingUser = await usersCollection.findOne({ email: newEmail });
        if (existingUser) {
          return res.status(409).json({ 
            success: false, 
            message: 'User with this email already exists' 
          });
        }

        const newUser = {
          email: newEmail,
          name,
          password, // In production, hash this!
          role,
          phone: phone || '',
          verified: false,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          loyaltyPoints: 0,
        };

        const result = await usersCollection.insertOne(newUser);
        
        res.status(201).json({ 
          success: true, 
          data: { ...newUser, _id: result.insertedId, password: undefined }
        });
        break;

      case 'PUT':
        // Update user
        const { id, ...updateData } = req.body;

        if (!id) {
          return res.status(400).json({ 
            success: false, 
            message: 'User ID is required' 
          });
        }

        const updateResult = await usersCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { ...updateData, updatedAt: new Date().toISOString() } }
        );

        if (updateResult.matchedCount === 0) {
          return res.status(404).json({ 
            success: false, 
            message: 'User not found' 
          });
        }

        res.status(200).json({ 
          success: true, 
          message: 'User updated successfully' 
        });
        break;

      case 'DELETE':
        // Delete user
        const { id: deleteId } = req.body;

        if (!deleteId) {
          return res.status(400).json({ 
            success: false, 
            message: 'User ID is required' 
          });
        }

        const deleteResult = await usersCollection.deleteOne({ _id: new ObjectId(deleteId) });

        if (deleteResult.deletedCount === 0) {
          return res.status(404).json({ 
            success: false, 
            message: 'User not found' 
          });
        }

        res.status(200).json({ 
          success: true, 
          message: 'User deleted successfully' 
        });
        break;

      default:
        res.status(405).json({ 
          success: false, 
          message: `Method ${method} not allowed` 
        });
    }
  } catch (error) {
    console.error('Users API error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
}
