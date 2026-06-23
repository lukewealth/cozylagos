import { useState, useEffect } from 'react';
import { useDatabase } from './useDatabase';
import { cacheSet, cacheGet } from '../db';
import { Listing } from '../types';

export function useCachedListings() {
  const { data: dbListings, loading: dbLoading, refresh: refreshDb } = useDatabase('listings');
  const [data, setData] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      // 1. Try to get from cache
      const cachedData = await cacheGet<Listing[]>('listings_cache');
      if (cachedData) {
        setData(cachedData);
        setLoading(false);
        // We still want to fetch in background to update cache if DB changed
      }

      // 2. Get from DB (which might have been seeded)
      if (dbListings.length > 0) {
        setData(dbListings as Listing[]);
        await cacheSet('listings_cache', dbListings as Listing[], 3600000); // 1 hour cache
      } else if (cachedData) {
        // If DB is empty but we have cache, use cache
        setData(cachedData);
      }

      setLoading(false);
    };

    loadData();
  }, [dbListings]);

  return { data, loading, refresh: refreshDb };
}
