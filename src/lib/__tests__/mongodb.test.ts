import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock MongoDB client
class MockMongoClient {
  connect = vi.fn().mockResolvedValue(undefined);
  db = vi.fn().mockReturnValue({
    collection: vi.fn().mockReturnValue({
      find: vi.fn().mockReturnValue({
        toArray: vi.fn().mockResolvedValue([]),
      }),
      findOne: vi.fn().mockResolvedValue(null),
      insertOne: vi.fn().mockResolvedValue({ insertedId: '123' }),
      updateOne: vi.fn().mockResolvedValue({ modifiedCount: 1 }),
      deleteOne: vi.fn().mockResolvedValue({ deletedCount: 1 }),
      countDocuments: vi.fn().mockResolvedValue(0),
      createIndex: vi.fn().mockResolvedValue(undefined),
    }),
    command: vi.fn().mockResolvedValue({ ok: 1 }),
  });
}

vi.mock('mongodb', () => ({
  MongoClient: MockMongoClient,
  ObjectId: vi.fn().mockImplementation((id) => ({ toHexString: () => id })),
}));

describe('MongoDB Connection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset module cache to clear cached connection
    vi.resetModules();
  });

  it('should connect to MongoDB', async () => {
    const { connectToDatabase } = await import('../mongodb');
    const { client, db } = await connectToDatabase();
    
    expect(client).toBeDefined();
    expect(db).toBeDefined();
  });

  it('should cache connection', async () => {
    const { connectToDatabase } = await import('../mongodb');
    
    const first = await connectToDatabase();
    const second = await connectToDatabase();
    
    expect(first.client).toBe(second.client);
    expect(first.db).toBe(second.db);
  });

  it('should get client', async () => {
    const { getClient } = await import('../mongodb');
    const client = await getClient();
    
    expect(client).toBeDefined();
  });

  it('should get database', async () => {
    const { getDb } = await import('../mongodb');
    const db = await getDb();
    
    expect(db).toBeDefined();
  });

  it('should access collections', async () => {
    const { collections } = await import('../mongodb');
    
    const users = await collections.users();
    const listings = await collections.listings();
    const bookings = await collections.bookings();
    const transactions = await collections.transactions();
    
    expect(users).toBeDefined();
    expect(listings).toBeDefined();
    expect(bookings).toBeDefined();
    expect(transactions).toBeDefined();
  });
});
