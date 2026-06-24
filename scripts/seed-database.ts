import { connectToDatabase } from '../src/lib/mongodb';
import { INITIAL_LISTINGS, INITIAL_BOOKINGS, INITIAL_TRANSACTIONS } from '../src/data';

async function seedDatabase() {
  console.log('🌱 Starting database seed...');

  try {
    const { db } = await connectToDatabase();

    // Seed Users
    console.log('\n📝 Seeding users...');
    const usersCollection = db.collection('users');
    const existingUsers = await usersCollection.countDocuments();
    
    if (existingUsers === 0) {
      const demoUsers = [
        {
          id: 'user-001',
          email: 'lukeokagha@gmail.com',
          name: 'Luke Okagha',
          role: 'user',
          password: 'cozy_guest_2024',
          phone: '+234 801 234 5678',
          verified: true,
          createdAt: '2024-01-15T10:00:00Z',
          lastLogin: new Date().toISOString(),
          loyaltyPoints: 12450
        },
        {
          id: 'admin-001',
          email: 'contact@tricode.pro',
          name: 'Tricode Admin',
          role: 'admin',
          password: 'cozy_admin_2024',
          phone: '+234 803 456 7890',
          verified: true,
          createdAt: '2023-12-01T09:00:00Z',
          lastLogin: new Date().toISOString(),
          loyaltyPoints: 25000
        },
        {
          id: 'superadmin-001',
          email: 'luke.o@tricode.pro',
          name: 'Luke O.',
          role: 'super_admin',
          password: 'cozy_super_2024',
          phone: '+234 800 000 0000',
          verified: true,
          createdAt: '2023-01-01T00:00:00Z',
          lastLogin: new Date().toISOString(),
          loyaltyPoints: 99999
        },
        {
          id: 'guest-001',
          email: 'guest@cozylagos.ng',
          name: 'Alexander Sterling',
          role: 'guest',
          password: 'cozy_visitor_2024',
          phone: '+234 801 234 5678',
          verified: true,
          createdAt: '2024-01-15T10:00:00Z',
          lastLogin: new Date().toISOString(),
          loyaltyPoints: 12450
        },
        {
          id: 'provider-001',
          email: 'chef@cozylagos.ng',
          name: 'Chef Adaeze',
          role: 'service_provider',
          password: 'cozy_host_2024',
          phone: '+234 804 567 8901',
          verified: true,
          createdAt: '2024-03-10T11:15:00Z',
          lastLogin: new Date().toISOString(),
          loyaltyPoints: 5600
        }
      ];

      await usersCollection.insertMany(demoUsers);
      console.log(`✅ Inserted ${demoUsers.length} users`);
    } else {
      console.log(`⏭️  Users already exist (${existingUsers} found), skipping...`);
    }

    // Seed Listings
    console.log('\n🏠 Seeding listings...');
    const listingsCollection = db.collection('listings');
    const existingListings = await listingsCollection.countDocuments();
    
    if (existingListings === 0 && INITIAL_LISTINGS.length > 0) {
      const listingsToInsert = INITIAL_LISTINGS.map(listing => ({
        ...listing,
        createdAt: listing.createdAt || new Date().toISOString(),
        updatedAt: listing.updatedAt || new Date().toISOString(),
      }));

      await listingsCollection.insertMany(listingsToInsert);
      console.log(`✅ Inserted ${listingsToInsert.length} listings`);
    } else {
      console.log(`⏭️  Listings already exist (${existingListings} found), skipping...`);
    }

    // Seed Bookings
    console.log('\n📅 Seeding bookings...');
    const bookingsCollection = db.collection('bookings');
    const existingBookings = await bookingsCollection.countDocuments();
    
    if (existingBookings === 0 && INITIAL_BOOKINGS.length > 0) {
      const bookingsToInsert = INITIAL_BOOKINGS.map(booking => ({
        ...booking,
        createdAt: booking.createdAt || new Date().toISOString(),
        updatedAt: booking.updatedAt || new Date().toISOString(),
      }));

      await bookingsCollection.insertMany(bookingsToInsert);
      console.log(`✅ Inserted ${bookingsToInsert.length} bookings`);
    } else {
      console.log(`⏭️  Bookings already exist (${existingBookings} found), skipping...`);
    }

    // Seed Transactions
    console.log('\n💰 Seeding transactions...');
    const transactionsCollection = db.collection('transactions');
    const existingTransactions = await transactionsCollection.countDocuments();
    
    if (existingTransactions === 0 && INITIAL_TRANSACTIONS.length > 0) {
      const transactionsToInsert = INITIAL_TRANSACTIONS.map(transaction => ({
        ...transaction,
        createdAt: transaction.createdAt || new Date().toISOString(),
      }));

      await transactionsCollection.insertMany(transactionsToInsert);
      console.log(`✅ Inserted ${transactionsToInsert.length} transactions`);
    } else {
      console.log(`⏭️  Transactions already exist (${existingTransactions} found), skipping...`);
    }

    // Create indexes
    console.log('\n🔍 Creating indexes...');
    await usersCollection.createIndex({ email: 1 }, { unique: true });
    await usersCollection.createIndex({ role: 1 });
    await listingsCollection.createIndex({ ownerId: 1 });
    await listingsCollection.createIndex({ location: 1 });
    await listingsCollection.createIndex({ isActive: 1 });
    await bookingsCollection.createIndex({ guestId: 1 });
    await bookingsCollection.createIndex({ listingId: 1 });
    await bookingsCollection.createIndex({ status: 1 });
    await transactionsCollection.createIndex({ userId: 1 });
    await transactionsCollection.createIndex({ type: 1 });
    console.log('✅ Indexes created');

    console.log('\n✨ Database seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Database seed failed:', error);
    process.exit(1);
  }
}

seedDatabase();
