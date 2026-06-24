# MongoDB Integration Guide

## Overview

Cozy Lagos now uses MongoDB Atlas for persistent data storage with Vercel serverless functions for API routes.

## Setup

### 1. Environment Variables

The following environment variables are required:

```bash
MONGODB_URI=mongodb+srv://Vercel-Admin-atlas-sky-yacht:StwR1ECXbmmYy0YQ@atlas-sky-yacht.d5yxhii.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB_NAME=cozy_lagos
```

These are already configured in `.env` for local development.

### 2. Install Dependencies

```bash
npm install
```

This will install:
- `mongodb` - MongoDB driver
- `@vercel/functions` - Vercel serverless functions

### 3. Seed the Database

To populate the database with initial data:

```bash
npm run seed
```

This will create:
- 5 demo users (guest, user, admin, super_admin, service_provider)
- 15 property listings
- Initial bookings and transactions
- Database indexes for performance

## API Routes

All API routes are located in the `/api` directory and are deployed as Vercel serverless functions.

### Health Check
```
GET /api/health
```
Tests MongoDB connection.

### Users
```
GET    /api/users          - Get all users (with optional filters)
POST   /api/users          - Create new user
PUT    /api/users          - Update user
DELETE /api/users          - Delete user
```

### Listings
```
GET    /api/listings       - Get all listings (with optional filters)
POST   /api/listings       - Create new listing
PUT    /api/listings       - Update listing
DELETE /api/listings       - Delete listing
```

### Bookings
```
GET    /api/bookings       - Get all bookings (with optional filters)
POST   /api/bookings       - Create new booking
PUT    /api/bookings       - Update booking
PATCH  /api/bookings       - Update booking status
DELETE /api/bookings       - Delete booking
```

### Transactions
```
GET    /api/transactions   - Get all transactions (with optional filters)
POST   /api/transactions   - Create new transaction
PATCH  /api/transactions   - Update transaction status
```

## Database Schema

### Collections

#### users
```javascript
{
  _id: ObjectId,
  email: String (unique),
  name: String,
  password: String, // Hash in production!
  role: String (guest|user|admin|super_admin|service_provider),
  phone: String,
  verified: Boolean,
  createdAt: String (ISO date),
  lastLogin: String (ISO date),
  loyaltyPoints: Number
}
```

#### listings
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  category: String,
  location: String,
  bedrooms: Number,
  bathrooms: Number,
  maxGuests: Number,
  nightlyRate: Number,
  weekendPremium: Number,
  cleaningFee: Number,
  securityDeposit: Number,
  image: String,
  images: [String],
  amenities: [String],
  ownerId: String,
  isActive: Boolean,
  reviewsCount: Number,
  rating: Number,
  aiMatchPercent: Number,
  createdAt: String (ISO date),
  updatedAt: String (ISO date)
}
```

#### bookings
```javascript
{
  _id: ObjectId,
  listingId: String,
  listingTitle: String,
  guestId: String,
  guestName: String,
  guestEmail: String,
  checkIn: String,
  checkOut: String,
  guestsCount: Number,
  status: String (pending|confirmed|completed|cancelled),
  totalAmount: Number,
  services: [String],
  createdAt: String (ISO date),
  updatedAt: String (ISO date)
}
```

#### transactions
```javascript
{
  _id: ObjectId,
  date: String,
  reference: String (unique),
  type: String (payout|booking_revenue|refund|redemption),
  amount: Number,
  status: String (pending|processed|failed),
  description: String,
  userId: String,
  createdAt: String (ISO date)
}
```

## Connection Pooling

The MongoDB connection uses connection pooling for optimal performance:

```javascript
const client = new MongoClient(uri, {
  maxPoolSize: 10,
  minPoolSize: 5,
  retryWrites: true,
  retryReads: true,
});
```

This ensures:
- Efficient connection reuse
- Automatic retry on transient failures
- Optimal performance under load

## Security Notes

⚠️ **IMPORTANT**: The current implementation stores passwords in plain text for demo purposes. In production:

1. Use bcrypt or argon2 to hash passwords
2. Implement JWT-based authentication
3. Add rate limiting to API routes
4. Use HTTPS for all API calls
5. Implement proper CORS policies
6. Add input validation and sanitization

## Local Development

### Running the API locally

Since this is a Vite + React app, the API routes will be available when you run:

```bash
npm run dev
```

The API will be accessible at `http://localhost:3000/api/*`

### Testing the API

You can test the API using curl:

```bash
# Health check
curl http://localhost:3000/api/health

# Get all users
curl http://localhost:3000/api/users

# Create a user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User","password":"test123","role":"user"}'
```

## Deployment to Vercel

The API routes are automatically deployed when you push to your repository. Vercel will:

1. Build the frontend (Vite)
2. Deploy API routes as serverless functions
3. Set up environment variables from your Vercel dashboard

### Vercel Environment Variables

Make sure to add these in your Vercel project settings:

```
MONGODB_URI=mongodb+srv://Vercel-Admin-atlas-sky-yacht:StwR1ECXbmmYy0YQ@atlas-sky-yacht.d5yxhii.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB_NAME=cozy_lagos
```

## Troubleshooting

### Connection Issues

If you get connection errors:

1. Check your MongoDB URI is correct
2. Verify your IP is whitelisted in MongoDB Atlas
3. Ensure your network allows MongoDB connections (port 27017)

### API Not Responding

1. Check Vercel function logs in the dashboard
2. Verify environment variables are set
3. Check for TypeScript errors with `npm run lint`

### Seed Script Fails

1. Ensure MongoDB connection is working
2. Check if collections already exist (seed is idempotent)
3. Verify you have write permissions on the database

## Next Steps

- [ ] Implement password hashing
- [ ] Add JWT authentication
- [ ] Create auth middleware
- [ ] Add rate limiting
- [ ] Implement input validation
- [ ] Add error tracking (Sentry)
- [ ] Set up monitoring (MongoDB Atlas metrics)
- [ ] Create backup strategy

## Resources

- [MongoDB Node.js Driver Docs](https://mongodb.github.io/node-mongodb-native/)
- [Vercel Functions Docs](https://vercel.com/docs/functions)
- [MongoDB Atlas Docs](https://www.mongodb.com/docs/atlas/)
