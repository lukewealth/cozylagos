import { useEffect, useRef } from 'react';
import { subscribeToDatabase } from '../db';
import api from '../services/api';

export function useCloudSync() {
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSyncRef = useRef<number>(0);

  useEffect(() => {
    const syncToCloud = async () => {
      // Debounce sync to avoid too many requests
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }

      syncTimeoutRef.current = setTimeout(async () => {
        const now = Date.now();
        if (now - lastSyncRef.current < 5000) return; // Min 5 seconds between syncs
        
        try {
          // Sync bookings
          const bookingsRaw = localStorage.getItem('cozy_lagos_bookings');
          if (bookingsRaw) {
            const bookings = JSON.parse(bookingsRaw);
            for (const booking of bookings) {
              if (!booking.synced) {
                await api.bookings.create(booking);
                booking.synced = true;
              }
            }
            localStorage.setItem('cozy_lagos_bookings', JSON.stringify(bookings));
          }

          // Sync transactions
          const transactionsRaw = localStorage.getItem('cozy_lagos_transactions');
          if (transactionsRaw) {
            const transactions = JSON.parse(transactionsRaw);
            for (const tx of transactions) {
              if (!tx.synced) {
                await api.transactions.create(tx);
                tx.synced = true;
              }
            }
            localStorage.setItem('cozy_lagos_transactions', JSON.stringify(transactions));
          }

          lastSyncRef.current = Date.now();
        } catch (error) {
          console.error('Cloud sync failed:', error);
        }
      }, 2000); // 2 second debounce
    };

    const unsubscribe = subscribeToDatabase(syncToCloud);

    return () => {
      unsubscribe();
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, []);
}
