export interface CMSDatabase {
  trendingGems: TrendingGem[];
  vipServices: VIPService[];
  staff: StaffMember[];
  exploreItems: ExploreItem[];
  announcements: Announcement[];
}

export interface TrendingGem {
  id: string;
  title: string;
  description: string;
  category: 'apartment' | 'experience' | 'service' | 'bundle';
  image: string;
  price: string;
  location: string;
  rating: number;
  isTrending: boolean;
  views: number;
  bookings: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface VIPService {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  priceUnit: string;
  location: string;
  rating: number;
  reviewsCount: number;
  image: string;
  amenities: string[];
  providerName: string;
  providerId: string;
  verified: boolean;
  available: boolean;
  duration?: string;
  staffAssigned: string[];
  createdAt: string;
  updatedAt: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  avatar: string;
  providerId: string;
  specialties: string[];
  rating: number;
  reviewsCount: number;
  available: boolean;
  createdAt: string;
}

export interface ExploreItem {
  id: string;
  title: string;
  description: string;
  location: string;
  rating: number;
  price: string;
  category: string;
  image: string;
  duration?: string;
  highlights: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'promotion';
  targetAudience: 'all' | 'admin' | 'sp' | 'users';
  createdAt: string;
  createdBy: string;
}

const DB_NAME = 'CozyLagosCMS';
const DB_VERSION = 1;

export class IndexedDBManager {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains('trendingGems')) {
          const gemStore = db.createObjectStore('trendingGems', { keyPath: 'id' });
          gemStore.createIndex('category', 'category', { unique: false });
          gemStore.createIndex('isTrending', 'isTrending', { unique: false });
          gemStore.createIndex('createdAt', 'createdAt', { unique: false });
        }

        if (!db.objectStoreNames.contains('vipServices')) {
          const serviceStore = db.createObjectStore('vipServices', { keyPath: 'id' });
          serviceStore.createIndex('category', 'category', { unique: false });
          serviceStore.createIndex('providerId', 'providerId', { unique: false });
          serviceStore.createIndex('available', 'available', { unique: false });
        }

        if (!db.objectStoreNames.contains('staff')) {
          const staffStore = db.createObjectStore('staff', { keyPath: 'id' });
          staffStore.createIndex('providerId', 'providerId', { unique: false });
          staffStore.createIndex('available', 'available', { unique: false });
        }

        if (!db.objectStoreNames.contains('exploreItems')) {
          const exploreStore = db.createObjectStore('exploreItems', { keyPath: 'id' });
          exploreStore.createIndex('category', 'category', { unique: false });
        }

        if (!db.objectStoreNames.contains('announcements')) {
          const announcementStore = db.createObjectStore('announcements', { keyPath: 'id' });
          announcementStore.createIndex('type', 'type', { unique: false });
          announcementStore.createIndex('targetAudience', 'targetAudience', { unique: false });
        }
      };
    });
  }

  async getAll<T>(storeName: string): Promise<T[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async get<T>(storeName: string, id: string): Promise<T | undefined> {
    if (!this.db) throw new Error('Database not initialized');
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(id);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async add<T>(storeName: string, item: T): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.add(item);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async update<T>(storeName: string, item: T): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(item);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async delete(storeName: string, id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async getByIndex<T>(storeName: string, indexName: string, value: any): Promise<T[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const index = store.index(indexName);
      const request = index.getAll(value);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async clear(storeName: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }
}

export const db = new IndexedDBManager();
