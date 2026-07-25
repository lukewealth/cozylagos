import { connectToDatabase } from '../../src/lib/mongodb';
import { authenticateRequest, authorizeRole, validateRequestBody, addSecurityHeaders, logAudit, checkRateLimit } from '../../src/lib/middleware';
import { sanitizeInput, generateReference } from '../../src/lib/security';
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
    const ticketsCollection = db.collection('tickets');
    const notificationsCollection = db.collection('notifications');
    const usersCollection = db.collection('users');

    switch (method) {
      case 'GET': {
        const auth = authenticateRequest(req);
        if (!auth.authenticated) {
          return res.status(401).json({ success: false, message: auth.error });
        }

        const path = req.url || '';
        const { status, userId, type, bookingId } = req.query;

        if (path.includes('/notifications')) {
          let filter: any = {};
          if (userId) filter.userId = userId;
          if (type) filter.type = type;

          const notifications = await notificationsCollection
            .find(filter)
            .sort({ createdAt: -1 })
            .limit(50)
            .toArray();

          return res.status(200).json({ success: true, data: notifications });
        }

        let filter: any = {};
        if (status) filter.status = status;
        if (userId) filter.userId = userId;
        if (bookingId) filter.bookingId = bookingId;

        if (!authorizeRole('admin', auth.user.role)) {
          filter.userId = auth.user.userId;
        }

        const tickets = await ticketsCollection
          .find(filter)
          .sort({ createdAt: -1 })
          .limit(100)
          .toArray();

        return res.status(200).json({ success: true, data: tickets });
      }

      case 'POST': {
        const auth = authenticateRequest(req);
        if (!auth.authenticated) {
          return res.status(401).json({ success: false, message: auth.error });
        }

        const path = req.url || '';

        if (path.includes('/notifications')) {
          const { title, message, userId, type, targetRole, sendEmail } = req.body;
          if (!title || !message) {
            return res.status(400).json({ success: false, message: 'Title and message are required' });
          }

          if (!authorizeRole('admin', auth.user.role)) {
            return res.status(403).json({ success: false, message: 'Admin access required' });
          }

          let targetUsers: any[] = [];
          
          if (userId) {
            targetUsers = [{ _id: new ObjectId(userId) }];
          } else if (targetRole && targetRole !== 'all') {
            targetUsers = await usersCollection.find({ role: targetRole }).toArray();
          } else {
            targetUsers = await usersCollection.find({}).toArray();
          }

          const notifications = targetUsers.map(user => ({
            title: sanitizeInput(title),
            message: sanitizeInput(message),
            userId: user._id.toString(),
            userEmail: user.email,
            userName: user.name,
            type: type || 'announcement',
            targetRole: targetRole || 'all',
            read: false,
            sentBy: auth.user.userId,
            sentAt: new Date().toISOString(),
            emailSent: false,
            createdAt: new Date().toISOString(),
          }));

          await notificationsCollection.insertMany(notifications);

          if (sendEmail) {
            for (const notification of notifications) {
              try {
                await sendEmailNotification(notification);
                await notificationsCollection.updateOne(
                  { _id: new ObjectId(notification._id) },
                  { $set: { emailSent: true, emailSentAt: new Date().toISOString() } }
                );
              } catch (error) {
                console.error(`Failed to send email to ${notification.userEmail}:`, error);
              }
            }
          }

          logAudit('NOTIFICATION_SENT', auth.user.userId, { 
            title, 
            targetRole, 
            recipientCount: notifications.length,
            emailSent: sendEmail || false 
          });

          return res.status(201).json({ 
            success: true, 
            data: notifications,
            count: notifications.length 
          });
        }

        const { title, description, bookingId, category, priority, userId } = req.body;
        if (!title || !description) {
          return res.status(400).json({ success: false, message: 'Title and description are required' });
        }

        let ticketUserId = userId || auth.user.userId;

        if (bookingId) {
          const bookingsCollection = db.collection('bookings');
          const booking = await bookingsCollection.findOne({ _id: new ObjectId(bookingId) });
          if (booking) {
            ticketUserId = booking.guestId || auth.user.userId;
          }
        }

        const ticket = {
          ticketId: generateReference('TKT'),
          title: sanitizeInput(title),
          description: sanitizeInput(description),
          bookingId: bookingId || null,
          category: category || 'general',
          priority: priority || 'medium',
          status: 'open',
          userId: ticketUserId,
          assignedTo: null,
          responses: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: auth.user.userId,
        };

        await ticketsCollection.insertOne(ticket);
        logAudit('TICKET_CREATED', auth.user.userId, { ticketId: ticket.ticketId });

        return res.status(201).json({ success: true, data: ticket });
      }

      case 'PATCH': {
        const auth = authenticateRequest(req);
        if (!auth.authenticated) {
          return res.status(401).json({ success: false, message: auth.error });
        }

        const path = req.url || '';
        const { id, status, response, assignedTo, read } = req.body;

        if (path.includes('/notifications')) {
          if (!id) {
            return res.status(400).json({ success: false, message: 'Notification ID is required' });
          }

          const updateFields: any = {};
          if (read !== undefined) updateFields.read = read;

          await notificationsCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { ...updateFields, updatedAt: new Date().toISOString() } }
          );

          return res.status(200).json({ success: true, message: 'Notification updated' });
        }

        if (!id) {
          return res.status(400).json({ success: false, message: 'Ticket ID is required' });
        }

        const updateFields: any = { updatedAt: new Date().toISOString() };
        if (status) updateFields.status = status;
        if (assignedTo) updateFields.assignedTo = assignedTo;
        if (response) {
          updateFields.$push = {
            responses: {
              text: sanitizeInput(response.text),
              author: auth.user.userId,
              authorName: auth.user.name || 'Support',
              createdAt: new Date().toISOString(),
            },
          };
        }

        await ticketsCollection.updateOne(
          { _id: new ObjectId(id) },
          updateFields.$push ? { $set: { ...updateFields, $push: undefined }, $push: updateFields.$push } : { $set: updateFields }
        );

        logAudit('TICKET_UPDATED', auth.user.userId, { ticketId: id, status });

        return res.status(200).json({ success: true, message: 'Ticket updated' });
      }

      case 'DELETE': {
        const auth = authenticateRequest(req);
        if (!auth.authenticated) {
          return res.status(401).json({ success: false, message: auth.error });
        }

        if (!authorizeRole('admin', auth.user.role)) {
          return res.status(403).json({ success: false, message: 'Admin access required' });
        }

        const path = req.url || '';
        const { id } = req.body;

        if (path.includes('/notifications')) {
          if (!id) {
            return res.status(400).json({ success: false, message: 'Notification ID is required' });
          }

          await notificationsCollection.deleteOne({ _id: new ObjectId(id) });
          return res.status(200).json({ success: true, message: 'Notification deleted' });
        }

        if (!id) {
          return res.status(400).json({ success: false, message: 'Ticket ID is required' });
        }

        await ticketsCollection.deleteOne({ _id: new ObjectId(id) });
        logAudit('TICKET_DELETED', auth.user.userId, { ticketId: id });

        return res.status(200).json({ success: true, message: 'Ticket deleted' });
      }

      default:
        return res.status(405).json({ success: false, message: `Method ${method} not allowed` });
    }
  } catch (error: any) {
    console.error('CRM API error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

async function sendEmailNotification(notification: any) {
  const emailData = {
    to: notification.userEmail,
    subject: notification.title,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Cozy Lagos</h1>
        </div>
        <div style="padding: 20px; background: #f9f9f9;">
          <h2 style="color: #333;">${notification.title}</h2>
          <p style="color: #666; line-height: 1.6;">${notification.message}</p>
          <div style="margin-top: 20px; padding: 15px; background: white; border-radius: 8px;">
            <p style="margin: 0; color: #999; font-size: 12px;">
              Sent at: ${new Date(notification.sentAt).toLocaleString()}
            </p>
          </div>
        </div>
        <div style="background: #333; color: white; padding: 15px; text-align: center; font-size: 12px;">
          <p style="margin: 0;">© 2024 Cozy Lagos. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  console.log('Email notification prepared for:', notification.userEmail);
  console.log('Subject:', emailData.subject);
  
  return true;
}
