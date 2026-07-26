import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cloud, CloudOff, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

interface CloudSyncIndicatorProps {
  className?: string;
}

export default function CloudSyncIndicator({ className = '' }: CloudSyncIndicatorProps) {
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'error' | 'offline'>('synced');
  const [lastSync, setLastSync] = useState<Date | null>(new Date());

  useEffect(() => {
    // Check online status
    const handleOnline = () => {
      setSyncStatus('synced');
      setLastSync(new Date());
    };

    const handleOffline = () => {
      setSyncStatus('offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Simulate sync every 30 seconds
    const syncInterval = setInterval(() => {
      if (navigator.onLine) {
        setSyncStatus('syncing');
        setTimeout(() => {
          setSyncStatus('synced');
          setLastSync(new Date());
        }, 1000);
      }
    }, 30000);

    // Initial status check
    if (!navigator.onLine) {
      setSyncStatus('offline');
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(syncInterval);
    };
  }, []);

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
    </motion.div>
  );
}
