import { useState, useEffect, useCallback } from 'react';
import { onSyncStatusChange, getSyncStatus, getPendingSyncCount, getLastSyncTime, syncNow, SyncStatus } from '../lib/syncEngine';

interface SyncState {
  status: SyncStatus;
  pendingCount: number;
  lastSync: Date | null;
  isOnline: boolean;
}

export function useSyncIndicator(checkIntervalMs: number = 5000) {
  const [syncState, setSyncState] = useState<SyncState>({
    status: getSyncStatus(),
    pendingCount: getPendingSyncCount(),
    lastSync: getLastSyncTime(),
    isOnline: navigator.onLine,
  });

  useEffect(() => {
    const unsubscribe = onSyncStatusChange((status) => {
      setSyncState(prev => ({
        ...prev,
        status,
        pendingCount: getPendingSyncCount(),
        lastSync: getLastSyncTime(),
      }));
    });

    const handleOnline = () => {
      setSyncState(prev => ({ ...prev, isOnline: true, status: 'idle' }));
    };

    const handleOffline = () => {
      setSyncState(prev => ({ ...prev, isOnline: false, status: 'offline' }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const interval = setInterval(() => {
      setSyncState(prev => ({
        ...prev,
        pendingCount: getPendingSyncCount(),
        lastSync: getLastSyncTime(),
      }));
    }, checkIntervalMs);

    return () => {
      unsubscribe();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, [checkIntervalMs]);

  const triggerSync = useCallback(async () => {
    setSyncState(prev => ({ ...prev, status: 'syncing' }));
    await syncNow('bidirectional');
    setSyncState(prev => ({
      ...prev,
      status: getSyncStatus(),
      pendingCount: getPendingSyncCount(),
      lastSync: getLastSyncTime(),
    }));
  }, []);

  return { ...syncState, triggerSync };
}
