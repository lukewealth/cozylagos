import { dbGetAll, dbPut, dbDelete, notifyListeners, DBSchema } from '../db';

export async function purgeDemoData(): Promise<void> {
  console.log('Starting database purge...');

  // Get all stores
  const stores: (keyof DBSchema)[] = ['users', 'bookings', 'transactions', 'services', 'experiences', 'notifications'];

  for (const store of stores) {
    try {
      const records = await dbGetAll(store);
      
      // Filter out demo/test data
      const realRecords = records.filter((record: any) => {
        // Keep records with real user IDs (not demo IDs)
        if (record.userId && record.userId.includes('demo')) return false;
        if (record.guestId && record.guestId.includes('demo')) return false;
        if (record.id && record.id.includes('demo')) return false;
        
        // Keep records created after a certain date (after demo phase)
        const cutoffDate = new Date('2024-01-01');
        if (record.createdAt && new Date(record.createdAt) < cutoffDate) return false;
        
        return true;
      });

      console.log(`Store ${store}: ${records.length} total, ${realRecords.length} real records`);

      // Clear store
      for (const record of records) {
        if ('id' in record) {
          await dbDelete(store, record.id);
        }
      }

      // Re-add only real records
      for (const record of realRecords) {
        await dbPut(store, record);
      }

      notifyListeners(store);
    } catch (error) {
      console.error(`Error purging ${store}:`, error);
    }
  }

  console.log('Database purge complete');
}

export async function flushSystem(): Promise<void> {
  console.log('Flushing system cache...');

  // Clear localStorage cache
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith('cozy_lagos_')) {
      localStorage.removeItem(key);
    }
  });

  // Clear IndexedDB cache
  const cacheStores: (keyof DBSchema)[] = ['cache'];
  for (const store of cacheStores) {
    try {
      const records = await dbGetAll(store);
      for (const record of records) {
        if ('id' in record) {
          await dbDelete(store, record.id);
        }
      }
      notifyListeners(store);
    } catch (error) {
      console.error(`Error flushing ${store}:`, error);
    }
  }

  console.log('System flush complete');
}

export async function flushTransactions(): Promise<void> {
  console.log('Flushing transactions...');

  try {
    const transactions = await dbGetAll('transactions');
    
    // Remove all pending/old transactions
    for (const tx of transactions) {
      const t = tx as any;
      if (t.status === 'pending' || t.status === 'Pending') {
        await dbDelete('transactions', t.id);
      }
    }

    notifyListeners('transactions');
    console.log('Transactions flushed');
  } catch (error) {
    console.error('Error flushing transactions:', error);
  }
}

export async function flushBookings(): Promise<void> {
  console.log('Flushing old bookings...');

  try {
    const bookings = await dbGetAll('bookings');
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Remove old cancelled/completed bookings
    for (const booking of bookings) {
      const b = booking as any;
      const createdAt = new Date(b.createdAt);
      
      if (createdAt < thirtyDaysAgo && (b.status === 'cancelled' || b.status === 'completed')) {
        await dbDelete('bookings', b.id);
      }
    }

    notifyListeners('bookings');
    console.log('Old bookings flushed');
  } catch (error) {
    console.error('Error flushing bookings:', error);
  }
}

export async function syncRealData(): Promise<void> {
  console.log('Syncing real data...');

  // Get all bookings and ensure they have real user IDs
  const bookings = await dbGetAll('bookings');
  for (const booking of bookings) {
    const b = booking as any;
    if (!b.guestId || b.guestId.includes('demo')) {
      // Mark as pending review
      await dbPut('bookings', { ...b, status: 'pending' });
    }
  }

  // Get all transactions and ensure they have real user IDs
  const transactions = await dbGetAll('transactions');
  for (const tx of transactions) {
    const t = tx as any;
    if (!t.userId || t.userId.includes('demo')) {
      // Mark as pending review
      await dbPut('transactions', { ...t, status: 'pending' });
    }
  }

  notifyListeners('bookings');
  notifyListeners('transactions');

  console.log('Real data sync complete');
}

export async function syncToCloud(): Promise<boolean> {
  console.log('Syncing to cloud...');

  try {
    // Sync bookings
    const bookings = await dbGetAll('bookings');
    const pendingBookings = (bookings as any[]).filter((b: any) => !b.syncedToCloud);

    for (const booking of pendingBookings) {
      try {
        const response = await fetch('/api/operations/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(booking),
        });

        if (response.ok) {
          await dbPut('bookings', { ...booking, syncedToCloud: true, syncedAt: new Date().toISOString() });
        }
      } catch (error) {
        console.error('Failed to sync booking:', error);
      }
    }

    // Sync transactions
    const transactions = await dbGetAll('transactions');
    const pendingTransactions = (transactions as any[]).filter((t: any) => !t.syncedToCloud);

    for (const transaction of pendingTransactions) {
      try {
        const response = await fetch('/api/operations/transactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(transaction),
        });

        if (response.ok) {
          await dbPut('transactions', { ...transaction, syncedToCloud: true, syncedAt: new Date().toISOString() });
        }
      } catch (error) {
        console.error('Failed to sync transaction:', error);
      }
    }

    notifyListeners('bookings');
    notifyListeners('transactions');

    console.log('Cloud sync complete');
    return true;
  } catch (error) {
    console.error('Cloud sync failed:', error);
    return false;
  }
}

export async function getSystemStats(): Promise<any> {
  const stats = {
    users: { total: 0, active: 0, verified: 0 },
    bookings: { total: 0, pending: 0, confirmed: 0, completed: 0 },
    transactions: { total: 0, revenue: 0, payouts: 0 },
    services: { total: 0, active: 0 },
    experiences: { total: 0, active: 0 },
    staff: { total: 0, active: 0 },
  };

  try {
    const users = await dbGetAll('users');
    stats.users.total = users.length;
    stats.users.active = users.filter((u: any) => u.status === 'active').length;
    stats.users.verified = users.filter((u: any) => u.verified).length;

    const bookings = await dbGetAll('bookings');
    stats.bookings.total = bookings.length;
    stats.bookings.pending = bookings.filter((b: any) => b.status === 'pending').length;
    stats.bookings.confirmed = bookings.filter((b: any) => b.status === 'confirmed').length;
    stats.bookings.completed = bookings.filter((b: any) => b.status === 'completed').length;

    const transactions = await dbGetAll('transactions');
    stats.transactions.total = transactions.length;
    stats.transactions.revenue = transactions
      .filter((t: any) => t.type === 'booking_revenue')
      .reduce((sum: number, t: any) => sum + t.amount, 0);
    stats.transactions.payouts = transactions
      .filter((t: any) => t.type === 'payout')
      .reduce((sum: number, t: any) => sum + Math.abs(t.amount), 0);

    const services = await dbGetAll('services');
    stats.services.total = services.length;
    stats.services.active = services.filter((s: any) => s.isActive).length;

    const experiences = await dbGetAll('experiences');
    stats.experiences.total = experiences.length;
    stats.experiences.active = experiences.filter((e: any) => e.isActive).length;
  } catch (error) {
    console.error('Error getting system stats:', error);
  }

  return stats;
}

export async function purgeAllData(): Promise<void> {
  console.log('Purging all data...');

  const stores: (keyof DBSchema)[] = ['users', 'bookings', 'transactions', 'services', 'experiences', 'notifications'];

  for (const store of stores) {
    try {
      const records = await dbGetAll(store);
      for (const record of records) {
        if ('id' in record) {
          await dbDelete(store, record.id);
        }
      }
      notifyListeners(store);
    } catch (error) {
      console.error(`Error purging ${store}:`, error);
    }
  }

  console.log('All data purged');
}
