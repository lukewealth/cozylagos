export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

const listeners = new Set<(event: string) => void>();

export function notifyListeners(event: string) {
  listeners.forEach(l => l(event));
}

export function subscribeToDatabase(callback: (event: string) => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

const DB_NAME = 'cozy_lagos_db';
const DB_VERSION = 1;

export interface DBSchema {
  users: UserRecord;
  listings: ListingRecord;
  bookings: BookingRecord;
  transactions: TransactionRecord;
  services: ServiceRecord;
  experiences: ExperienceRecord;
  chatMessages: ChatRecord;
  cache: CacheRecord;
}

export interface UserRecord {
  id: string;
  email: string;
  name: string;
  role: 'guest' | 'user' | 'admin' | 'service_provider' | 'super_admin';
  avatar?: string;
  phone?: string;
  verified: boolean;
  createdAt: string;
  lastLogin: string;
  preferences?: Record<string, any>;
  loyaltyPoints: number;
}

export interface ListingRecord {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  nightlyRate: number;
  weekendPremium: number;
  cleaningFee: number;
  securityDeposit: number;
  image: string;
  images: string[];
  amenities: string[];
  ownerId: string;
  isActive: boolean;
  reviewsCount: number;
  rating: number;
  aiMatchPercent: number;
  createdAt: string;
  updatedAt: string;
}

export interface BookingRecord {
  id: string;
  listingId: string;
  listingTitle: string;
  guestId: string;
  guestName: string;
  guestEmail: string;
  guestAvatar?: string;
  checkIn: string;
  checkOut: string;
  guestsCount: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  totalAmount: number;
  services: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TransactionRecord {
  id: string;
  date: string;
  reference: string;
  type: 'payout' | 'booking_revenue' | 'refund' | 'redemption';
  amount: number;
  status: 'pending' | 'processed';
  description: string;
  userId: string;
  createdAt: string;
}

export interface ServiceRecord {
  id: string;
  providerId: string;
  providerName: string;
  category: 'chef' | 'driver' | 'photographer' | 'wellness' | 'security';
  title: string;
  description: string;
  price: number;
  priceUnit: 'per_day' | 'per_session' | 'per_hour';
  image: string;
  rating: number;
  reviewsCount: number;
  isActive: boolean;
  verified: boolean;
  createdAt: string;
}

export interface ExperienceRecord {
  id: string;
  vendorId: string;
  vendorName: string;
  title: string;
  description: string;
  category: 'yacht' | 'tour' | 'dining' | 'wellness' | 'adventure';
  price: number;
  duration: string;
  maxGuests: number;
  images: string[];
  includes: string[];
  rating: number;
  reviewsCount: number;
  isActive: boolean;
  verified: boolean;
  createdAt: string;
}

export interface ChatRecord {
  id: string;
  userId: string;
  sender: 'user' | 'concierge' | 'host';
  text: string;
  timestamp: string;
  read: boolean;
}

export interface CacheRecord {
  key: string;
  value: any;
  expiresAt: number;
  updatedAt: number;
}

let dbInstance: IDBDatabase | null = null;

function openDB(): Promise<IDBDatabase> {
  if (dbInstance) return Promise.resolve(dbInstance);

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(dbInstance);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains('users')) {
        const userStore = db.createObjectStore('users', { keyPath: 'id' });
        userStore.createIndex('email', 'email', { unique: true });
        userStore.createIndex('role', 'role', { unique: false });
      }

      if (!db.objectStoreNames.contains('listings')) {
        const listingStore = db.createObjectStore('listings', { keyPath: 'id' });
        listingStore.createIndex('ownerId', 'ownerId', { unique: false });
        listingStore.createIndex('location', 'location', { unique: false });
        listingStore.createIndex('isActive', 'isActive', { unique: false });
      }

      if (!db.objectStoreNames.contains('bookings')) {
        const bookingStore = db.createObjectStore('bookings', { keyPath: 'id' });
        bookingStore.createIndex('guestId', 'guestId', { unique: false });
        bookingStore.createIndex('listingId', 'listingId', { unique: false });
        bookingStore.createIndex('status', 'status', { unique: false });
      }

      if (!db.objectStoreNames.contains('transactions')) {
        const txStore = db.createObjectStore('transactions', { keyPath: 'id' });
        txStore.createIndex('userId', 'userId', { unique: false });
        txStore.createIndex('type', 'type', { unique: false });
      }

      if (!db.objectStoreNames.contains('services')) {
        const serviceStore = db.createObjectStore('services', { keyPath: 'id' });
        serviceStore.createIndex('providerId', 'providerId', { unique: false });
        serviceStore.createIndex('category', 'category', { unique: false });
      }

      if (!db.objectStoreNames.contains('experiences')) {
        const expStore = db.createObjectStore('experiences', { keyPath: 'id' });
        expStore.createIndex('vendorId', 'vendorId', { unique: false });
        expStore.createIndex('category', 'category', { unique: false });
      }

      if (!db.objectStoreNames.contains('chatMessages')) {
        const chatStore = db.createObjectStore('chatMessages', { keyPath: 'id' });
        chatStore.createIndex('userId', 'userId', { unique: false });
      }

      if (!db.objectStoreNames.contains('cache')) {
        db.createObjectStore('cache', { keyPath: 'key' });
      }
    };
  });
}

export async function dbGet<T extends keyof DBSchema>(
  storeName: T,
  id: string
): Promise<DBSchema[T] | undefined> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const request = store.get(id);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

export async function dbGetAll<T extends keyof DBSchema>(
  storeName: T
): Promise<DBSchema[T][]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const request = store.getAll();
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

export async function dbGetByIndex<T extends keyof DBSchema>(
  storeName: T,
  indexName: string,
  value: any
): Promise<DBSchema[T][]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const index = store.index(indexName);
    const request = index.getAll(value);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

export async function dbPut<T extends keyof DBSchema>(
  storeName: T,
  record: DBSchema[T]
): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const request = store.put(record);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

export async function dbDelete<T extends keyof DBSchema>(
  storeName: T,
  id: string
): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const request = store.delete(id);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

export async function dbClear<T extends keyof DBSchema>(
  storeName: T
): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const request = store.clear();
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

export async function cacheSet(key: string, value: any, ttlMs: number = 3600000): Promise<void> {
  await dbPut('cache', {
    key,
    value,
    expiresAt: Date.now() + ttlMs,
    updatedAt: Date.now()
  });
}

export async function cacheGet<T = any>(key: string): Promise<T | null> {
  const record = await dbGet('cache', key);
  if (!record) return null;
  if (Date.now() > (record as CacheRecord).expiresAt) {
    await dbDelete('cache', key);
    return null;
  }
  return (record as CacheRecord).value;
}

export async function syncToLocalStorage(): Promise<void> {
  const stores: (keyof DBSchema)[] = ['users', 'listings', 'bookings', 'transactions', 'services', 'experiences'];
  for (const store of stores) {
    const data = await dbGetAll(store);
    localStorage.setItem(`cozy_lagos_${store}`, JSON.stringify(data));
  }
}

export async function restoreFromLocalStorage(): Promise<void> {
  const stores: (keyof DBSchema)[] = ['users', 'listings', 'bookings', 'transactions', 'services', 'experiences'];
  for (const store of stores) {
    const raw = localStorage.getItem(`cozy_lagos_${store}`);
    if (raw) {
      const data = JSON.parse(raw) as any[];
      for (const record of data) {
        await dbPut(store, record);
      }
    }
  }
}

export async function seedDatabase(initialData: {
  listings: any[],
  bookings: any[],
  transactions: any[],
  users?: any[],
  services?: any[],
  experiences?: any[],
  chatMessages?: any[]
}): Promise<void> {
  const { listings, bookings, transactions, users, services, experiences, chatMessages } = initialData;
  
  const currentListings = await dbGetAll('listings');
  if (currentListings.length === 0) {
    for (const listing of listings) {
      await dbPut('listings', {
        ...listing,
        createdAt: listing.createdAt || new Date().toISOString(),
        updatedAt: listing.updatedAt || new Date().toISOString()
      });
    }
  }

  const currentBookings = await dbGetAll('bookings');
  if (currentBookings.length === 0) {
    for (const booking of bookings) {
      await dbPut('bookings', {
        ...booking,
        guestId: booking.guestId || 'guest-1',
        services: booking.services || [],
        createdAt: booking.createdAt || new Date().toISOString(),
        updatedAt: booking.updatedAt || new Date().toISOString()
      });
    }
  }

  const currentTransactions = await dbGetAll('transactions');
  if (currentTransactions.length === 0) {
    for (const tx of transactions) {
      await dbPut('transactions', {
        ...tx,
        userId: tx.userId || 'system',
        createdAt: tx.createdAt || new Date().toISOString()
      });
    }
  }

  const currentUsers = await dbGetAll('users');
  if (currentUsers.length === 0 && users) {
    for (const user of users) {
      await dbPut('users', {
        ...user,
        createdAt: user.createdAt || new Date().toISOString(),
        lastLogin: user.lastLogin || new Date().toISOString()
      });
    }
  }

  const currentServices = await dbGetAll('services');
  if (currentServices.length === 0 && services) {
    for (const service of services) {
      await dbPut('services', service);
    }
  }

  const currentExperiences = await dbGetAll('experiences');
  if (currentExperiences.length === 0 && experiences) {
    for (const exp of experiences) {
      await dbPut('experiences', exp);
    }
  }

  const currentChatMessages = await dbGetAll('chatMessages');
  if (currentChatMessages.length === 0 && chatMessages) {
    for (const msg of chatMessages) {
      await dbPut('chatMessages', msg);
    }
  }
}
