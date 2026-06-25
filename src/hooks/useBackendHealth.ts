import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

type ConnectionStatus = 'checking' | 'connected' | 'fallback' | 'disconnected';

interface HealthState {
  status: ConnectionStatus;
  lastChecked: Date | null;
  message: string;
  retryCount: number;
}

export function useBackendHealth(checkIntervalMs: number = 60000) {
  const [health, setHealth] = useState<HealthState>({
    status: 'checking',
    lastChecked: null,
    message: 'Checking connection...',
    retryCount: 0,
  });

  const checkHealth = useCallback(async () => {
    setHealth(prev => ({ ...prev, status: 'checking', message: 'Checking connection...' }));

    try {
      const result = await api.health.check();
      if (result.success && result.data?.status === 'ok') {
        setHealth({
          status: 'connected',
          lastChecked: new Date(),
          message: 'Cloud database connected',
          retryCount: 0,
        });
        return true;
      }
    } catch {
      // API not available
    }

    try {
      const db = await import('../db').then(m => m.dbGetAll('listings'));
      if (db.length >= 0) {
        setHealth({
          status: 'fallback',
          lastChecked: new Date(),
          message: 'Using local database (IndexedDB fallback)',
          retryCount: health.retryCount + 1,
        });
        return true;
      }
    } catch {
      // IndexedDB also failed
    }

    setHealth({
      status: 'disconnected',
      lastChecked: new Date(),
      message: 'No database connection available',
      retryCount: health.retryCount + 1,
    });
    return false;
  }, [health.retryCount]);

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, checkIntervalMs);
    return () => clearInterval(interval);
  }, [checkIntervalMs]);

  return { ...health, checkHealth };
}

export function useApiWithFallback<T>(
  apiCall: () => Promise<any>,
  localStoreName: string,
  options?: { enabled?: boolean }
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<'api' | 'local'>('local');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (options?.enabled === false) {
      setLoading(false);
      return;
    }

    try {
      const result = await apiCall();
      if (result.success && result.data) {
        setData(result.data);
        setSource('api');
        try {
          const { dbPut, notifyListeners } = await import('../db');
          for (const item of result.data) {
            await dbPut(localStoreName as any, item);
          }
          notifyListeners(localStoreName);
        } catch {
          // Local sync failed silently
        }
        setLoading(false);
        return;
      }
    } catch {
      // API failed, try local
    }

    try {
      const { dbGetAll } = await import('../db');
      const localData = await dbGetAll(localStoreName as any);
      setData(localData as T[]);
      setSource('local');
    } catch (e) {
      setError('Failed to load data from any source');
    }

    setLoading(false);
  }, [apiCall, localStoreName, options?.enabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, source, refresh: fetchData };
}
