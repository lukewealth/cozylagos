import { dbGetAll, dbPut, dbDelete, cacheSet, cacheGet, generateId, notifyListeners } from '../db';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export type SyncStatus = 'idle' | 'syncing' | 'error' | 'offline';
export type SyncDirection = 'push' | 'pull' | 'bidirectional';

interface SyncQueueItem {
  id: string;
  store: string;
  action: 'create' | 'update' | 'delete';
  data: any;
  timestamp: number;
  retryCount: number;
  maxRetries: number;
}

interface SyncResult {
  pushed: number;
  pulled: number;
  conflicts: number;
  errors: string[];
}

const SYNC_KEY = 'cozy_lagos_sync_queue';
const LAST_SYNC_KEY = 'cozy_lagos_last_sync';
const SYNC_INTERVAL = 30000;

let syncIntervalId: ReturnType<typeof setInterval> | null = null;
let isSyncing = false;
let syncStatus: SyncStatus = 'idle';
let syncListeners: Set<(status: SyncStatus) => void> = new Set();

function getToken(): string | null {
  return localStorage.getItem('cozy_lagos_auth_token');
}

async function apiRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }
  return response.json();
}

function getSyncQueue(): SyncQueueItem[] {
  try {
    const raw = localStorage.getItem(SYNC_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveSyncQueue(queue: SyncQueueItem[]): void {
  localStorage.setItem(SYNC_KEY, JSON.stringify(queue));
}

function addToSyncQueue(store: string, action: 'create' | 'update' | 'delete', data: any): void {
  const queue = getSyncQueue();
  queue.push({
    id: generateId(),
    store,
    action,
    data,
    timestamp: Date.now(),
    retryCount: 0,
    maxRetries: 3,
  });
  saveSyncQueue(queue);
}

function setSyncStatus(status: SyncStatus): void {
  syncStatus = status;
  syncListeners.forEach(listener => listener(status));
}

export function onSyncStatusChange(listener: (status: SyncStatus) => void): () => void {
  syncListeners.add(listener);
  return () => syncListeners.delete(listener);
}

export function getSyncStatus(): SyncStatus {
  return syncStatus;
}

async function pushChanges(): Promise<{ pushed: number; errors: string[] }> {
  const queue = getSyncQueue();
  if (queue.length === 0) return { pushed: 0, errors: [] };

  let pushed = 0;
  const errors: string[] = [];
  const remaining: SyncQueueItem[] = [];

  for (const item of queue) {
    try {
      const endpoint = `/${item.store}`;
      let options: RequestInit;

      switch (item.action) {
        case 'create':
          options = { method: 'POST', body: JSON.stringify(item.data) };
          break;
        case 'update':
          options = { method: 'PUT', body: JSON.stringify(item.data) };
          break;
        case 'delete':
          options = { method: 'DELETE', body: JSON.stringify({ id: item.data.id }) };
          break;
        default:
          continue;
      }

      await apiRequest(endpoint, options);
      pushed++;
    } catch (error: any) {
      if (item.retryCount < item.maxRetries) {
        remaining.push({ ...item, retryCount: item.retryCount + 1 });
      } else {
        errors.push(`Failed to sync ${item.store}/${item.action}: ${error.message}`);
      }
    }
  }

  saveSyncQueue(remaining);
  return { pushed, errors };
}

async function pullChanges(stores: string[] = ['listings', 'bookings', 'services', 'transactions']): Promise<{ pulled: number; errors: string[] }> {
  let pulled = 0;
  const errors: string[] = [];

  for (const store of stores) {
    try {
      const response = await apiRequest(`/${store}`);
      if (response.success && Array.isArray(response.data)) {
        for (const record of response.data) {
          const normalized = { ...record, id: record._id || record.id };
          await dbPut(store as any, normalized);
          pulled++;
        }
        await cacheSet(`${store}_last_pull`, { timestamp: Date.now(), count: response.data.length }, 300000);
      }
    } catch (error: any) {
      errors.push(`Failed to pull ${store}: ${error.message}`);
    }
  }

  return { pulled, errors };
}

export async function syncNow(direction: SyncDirection = 'bidirectional'): Promise<SyncResult> {
  if (isSyncing) return { pushed: 0, pulled: 0, conflicts: 0, errors: ['Sync already in progress'] };
  if (!navigator.onLine) {
    setSyncStatus('offline');
    return { pushed: 0, pulled: 0, conflicts: 0, errors: ['No internet connection'] };
  }

  isSyncing = true;
  setSyncStatus('syncing');

  const result: SyncResult = { pushed: 0, pulled: 0, conflicts: 0, errors: [] };

  try {
    if (direction === 'push' || direction === 'bidirectional') {
      const pushResult = await pushChanges();
      result.pushed = pushResult.pushed;
      result.errors.push(...pushResult.errors);
    }

    if (direction === 'pull' || direction === 'bidirectional') {
      const pullResult = await pullChanges();
      result.pulled = pullResult.pulled;
      result.errors.push(...pullResult.errors);
    }

    localStorage.setItem(LAST_SYNC_KEY, new Date().toISOString());
    notifyListeners('sync');
    setSyncStatus('idle');
  } catch (error: any) {
    result.errors.push(error.message);
    setSyncStatus('error');
  } finally {
    isSyncing = false;
  }

  return result;
}

export function startAutoSync(intervalMs: number = SYNC_INTERVAL): void {
  if (syncIntervalId) return;
  syncIntervalId = setInterval(() => {
    if (navigator.onLine && !isSyncing) {
      syncNow('bidirectional');
    }
  }, intervalMs);

  window.addEventListener('online', () => {
    setSyncStatus('idle');
    syncNow('bidirectional');
  });

  window.addEventListener('offline', () => {
    setSyncStatus('offline');
  });
}

export function stopAutoSync(): void {
  if (syncIntervalId) {
    clearInterval(syncIntervalId);
    syncIntervalId = null;
  }
}

export async function syncCreate(store: string, data: any): Promise<void> {
  await dbPut(store as any, data);
  addToSyncQueue(store, 'create', data);
  if (navigator.onLine && !isSyncing) {
    syncNow('push');
  }
}

export async function syncUpdate(store: string, data: any): Promise<void> {
  await dbPut(store as any, data);
  addToSyncQueue(store, 'update', data);
  if (navigator.onLine && !isSyncing) {
    syncNow('push');
  }
}

export async function syncDelete(store: string, id: string): Promise<void> {
  await dbDelete(store as any, id);
  addToSyncQueue(store, 'delete', { id });
  if (navigator.onLine && !isSyncing) {
    syncNow('push');
  }
}

export function getLastSyncTime(): Date | null {
  const raw = localStorage.getItem(LAST_SYNC_KEY);
  return raw ? new Date(raw) : null;
}

export function getPendingSyncCount(): number {
  return getSyncQueue().length;
}
