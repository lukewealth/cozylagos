import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wifi, WifiOff, RefreshCw, Cloud, CloudOff, Check } from 'lucide-react';
import { useSyncIndicator } from '../../hooks/useSyncIndicator';
import Tooltip from '../../components/ui/Tooltip';

interface SyncIndicatorProps {
  compact?: boolean;
  showTooltip?: boolean;
}

export default function SyncIndicator({ compact = false, showTooltip = true }: SyncIndicatorProps) {
  const { status, pendingCount, lastSync, isOnline, triggerSync } = useSyncIndicator();

  const getStatusConfig = () => {
    if (!isOnline) {
      return {
        icon: CloudOff,
        color: 'text-red-500',
        bg: 'bg-red-100',
        label: 'Offline',
        description: 'No internet connection',
        pulse: false,
      };
    }

    switch (status) {
      case 'syncing':
        return {
          icon: RefreshCw,
          color: 'text-blue-500',
          bg: 'bg-blue-100',
          label: 'Syncing',
          description: 'Syncing changes with cloud...',
          pulse: true,
        };
      case 'error':
        return {
          icon: WifiOff,
          color: 'text-amber-500',
          bg: 'bg-amber-100',
          label: 'Error',
          description: 'Sync error - retrying...',
          pulse: false,
        };
      case 'idle':
        if (pendingCount > 0) {
          return {
            icon: Cloud,
            color: 'text-amber-500',
            bg: 'bg-amber-100',
            label: `${pendingCount} pending`,
            description: `${pendingCount} change(s) waiting to sync`,
            pulse: false,
          };
        }
        return {
          icon: Check,
          color: 'text-green-500',
          bg: 'bg-green-100',
          label: 'Synced',
          description: lastSync ? `Last synced: ${lastSync.toLocaleTimeString()}` : 'All changes saved',
          pulse: false,
        };
      default:
        return {
          icon: Wifi,
          color: 'text-secondary',
          bg: 'bg-surface-container',
          label: 'Ready',
          description: 'Connected to cloud',
          pulse: false,
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  const indicator = (
    <motion.button
      onClick={triggerSync}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`relative flex items-center gap-1.5 px-2 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${config.bg} ${config.color} transition-all cursor-pointer`}
    >
      <motion.div
        animate={config.pulse ? { rotate: 360 } : {}}
        transition={{ duration: 1, repeat: config.pulse ? Infinity : 0, ease: 'linear' }}
      >
        <Icon className="w-3 h-3" />
      </motion.div>
      {!compact && <span>{config.label}</span>}
      {pendingCount > 0 && !compact && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center"
        >
          {pendingCount}
        </motion.span>
      )}
    </motion.button>
  );

  if (showTooltip) {
    return (
      <Tooltip content={config.label} description={config.description} position="bottom">
        {indicator}
      </Tooltip>
    );
  }

  return indicator;
}
