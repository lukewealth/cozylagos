import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cloud, CloudOff, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { syncNow, onSyncStatusChange, getSyncStatus, SyncStatus } from '../../lib/syncEngine';

interface CloudSyncIndicatorProps {
  className?: string;
  showRefresh?: boolean;
}

export default function CloudSyncIndicator({ className = '', showRefresh = true }: CloudSyncIndicatorProps) {
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'error' | 'offline'>('synced');
  const [lastSync, setLastSync] = useState<Date | null>(new Date());
  const [isManualSyncing, setIsManualSyncing] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setSyncStatus('synced');
      setLastSync(new Date());
    };

    const handleOffline = () => {
      setSyncStatus('offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const unsubscribe = onSyncStatusChange((status: SyncStatus) => {
      if (status === 'syncing') {
        setSyncStatus('syncing');
      } else if (status === 'idle') {
        setSyncStatus('synced');
        setLastSync(new Date());
        setIsManualSyncing(false);
      } else if (status === 'error') {
        setSyncStatus('error');
        setIsManualSyncing(false);
      } else if (status === 'offline') {
        setSyncStatus('offline');
      }
    });

    const currentStatus = getSyncStatus();
    if (currentStatus === 'offline' || !navigator.onLine) {
      setSyncStatus('offline');
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      unsubscribe();
    };
  }, []);

  const handleManualSync = async () => {
    if (isManualSyncing || syncStatus === 'offline') return;
    setIsManualSyncing(true);
    setSyncStatus('syncing');
    try {
      await syncNow('bidirectional');
      setSyncStatus('synced');
      setLastSync(new Date());
    } catch (error) {
      setSyncStatus('error');
    }
    setIsManualSyncing(false);
  };

  const getStatusIcon = () => {
    switch (syncStatus) {
      case 'synced':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'syncing':
        return <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'offline':
        return <CloudOff className="w-4 h-4 text-charcoal/40" />;
    }
  };

  const getStatusText = () => {
    switch (syncStatus) {
      case 'synced':
        return 'Synced';
      case 'syncing':
        return 'Syncing...';
      case 'error':
        return 'Sync Error';
      case 'offline':
        return 'Offline';
    }
  };

  const getStatusColor = () => {
    switch (syncStatus) {
      case 'synced':
        return 'text-green-600';
      case 'syncing':
        return 'text-blue-600';
      case 'error':
        return 'text-red-600';
      case 'offline':
        return 'text-charcoal/40';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center gap-2 text-xs ${getStatusColor()} ${className}`}
    >
      {getStatusIcon()}
      <span className="font-medium">{getStatusText()}</span>
      {lastSync && syncStatus === 'synced' && (
        <span className="text-charcoal/40">
          {lastSync.toLocaleTimeString()}
        </span>
      )}
      {showRefresh && syncStatus !== 'offline' && (
        <button
          onClick={handleManualSync}
          disabled={isManualSyncing}
          className="p-1 rounded hover:bg-charcoal/5 transition-colors disabled:opacity-50"
          title="Sync now"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isManualSyncing ? 'animate-spin' : ''}`} />
        </button>
      )}
    </motion.div>
  );
}
