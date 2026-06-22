import { useState, useEffect, useCallback } from 'react';
import { dbGetAll, dbPut, dbDelete, DBSchema, notifyListeners, subscribeToDatabase } from '../db';

export function useDatabase<T extends keyof DBSchema>(storeName: T) {
  const [data, setData] = useState<DBSchema[T][]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const result = await dbGetAll(storeName);
      setData(result as DBSchema[T][]);
    } catch (error) {
      console.error(`Error fetching ${String(storeName)}:`, error);
    } finally {
      setLoading(false);
    }
  }, [storeName]);

  useEffect(() => {
    fetchData();
    const unsubscribe = subscribeToDatabase((event) => {
      if (event === storeName) {
        fetchData();
      }
    });
    return unsubscribe;
  }, [fetchData, storeName]);

  const addRecord = async (record: DBSchema[T]) => {
    await dbPut(storeName, record);
    notifyListeners(storeName);
  };

  const updateRecord = async (id: string, record: Partial<DBSchema[T]>) => {
    const current = await dbGetAll(storeName);
    const existing = current.find(item => (item as any).id === id);
    if (existing) {
      await dbPut(storeName, { ...existing, ...record } as DBSchema[T]);
      notifyListeners(storeName);
    }
  };

  const removeRecord = async (id: string) => {
    await dbDelete(storeName, id);
    notifyListeners(storeName);
  };

  return { data, loading, addRecord, updateRecord, removeRecord, refresh: fetchData };
}
