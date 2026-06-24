import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb+srv://Vercel-Admin-atlas-sky-yacht:StwR1ECXbmmYy0YQ@atlas-sky-yacht.d5yxhii.mongodb.net/?retryWrites=true&w=majority';
const dbName = process.env.MONGODB_DB_NAME || 'cozy_lagos';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(uri, {
    maxPoolSize: 10,
    minPoolSize: 5,
    retryWrites: true,
    retryReads: true,
  });

  await client.connect();
  const db = client.db(dbName);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

export async function getClient() {
  const { client } = await connectToDatabase();
  return client;
}

export async function getDb() {
  const { db } = await connectToDatabase();
  return db;
}

// Collection helpers
export const collections = {
  users: () => getDb().then(db => db.collection('users')),
  listings: () => getDb().then(db => db.collection('listings')),
  bookings: () => getDb().then(db => db.collection('bookings')),
  transactions: () => getDb().then(db => db.collection('transactions')),
  services: () => getDb().then(db => db.collection('services')),
  experiences: () => getDb().then(db => db.collection('experiences')),
  chatMessages: () => getDb().then(db => db.collection('chatMessages')),
};
