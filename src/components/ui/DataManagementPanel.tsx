import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Database, RefreshCw, Trash2, Cloud, CloudOff, AlertTriangle,
  CheckCircle, Clock, Download, Upload, HardDrive, Zap
} from 'lucide-react';
import { flushSystem, flushTransactions, flushBookings, syncToCloud, purgeAllData, getSystemStats } from '../../utils/databasePurge';
import Tooltip from './Tooltip';

interface DataManagementPanelProps {
  onNotify?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export default function DataManagementPanel({ onNotify }: DataManagementPanelProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [showConfirmModal, setShowConfirmModal] = useState<string | null>(null);

  const loadStats = async () => {
    const systemStats = await getSystemStats();
    setStats(systemStats);
  };

  const handleFlushCache = async () => {
    setIsProcessing(true);
    try {
      await flushSystem();
      onNotify?.('System cache flushed successfully', 'success');
      await loadStats();
    } catch (error) {
      onNotify?.('Failed to flush cache', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFlushTransactions = async () => {
    setIsProcessing(true);
    try {
      await flushTransactions();
      onNotify?.('Pending transactions flushed', 'success');
      await loadStats();
    } catch (error) {
      onNotify?.('Failed to flush transactions', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFlushBookings = async () => {
    setIsProcessing(true);
    try {
      await flushBookings();
      onNotify?.('Old bookings flushed', 'success');
      await loadStats();
    } catch (error) {
      onNotify?.('Failed to flush bookings', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSyncToCloud = async () => {
    setIsProcessing(true);
    try {
      const success = await syncToCloud();
      if (success) {
        onNotify?.('Data synced to cloud successfully', 'success');
      } else {
        onNotify?.('Cloud sync failed', 'error');
      }
      await loadStats();
    } catch (error) {
      onNotify?.('Failed to sync to cloud', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePurgeAll = async () => {
    setIsProcessing(true);
    try {
      await purgeAllData();
      onNotify?.('All data purged successfully', 'success');
      setShowConfirmModal(null);
      await loadStats();
    } catch (error) {
      onNotify?.('Failed to purge data', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  React.useEffect(() => {
    loadStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-bold text-charcoal">Data Management</h2>
          <p className="text-sm text-charcoal/60 mt-1">
            Manage database operations, sync, and maintenance
          </p>
        </div>
        <Tooltip content="Refresh statistics" position="left">
          <button
            onClick={loadStats}
            disabled={isProcessing}
            className="p-2 hover:bg-charcoal/5 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 text-charcoal/60 ${isProcessing ? 'animate-spin' : ''}`} />
          </button>
        </Tooltip>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-4 border border-charcoal/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Database className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-charcoal">{stats.bookings.total}</p>
                <p className="text-xs text-charcoal/60">Bookings</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-charcoal/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-charcoal">{stats.transactions.total}</p>
                <p className="text-xs text-charcoal/60">Transactions</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-charcoal/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                <HardDrive className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-charcoal">{stats.users.total}</p>
                <p className="text-xs text-charcoal/60">Users</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-charcoal/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-charcoal">{stats.bookings.pending}</p>
                <p className="text-xs text-charcoal/60">Pending</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Flush Cache */}
        <div className="bg-white rounded-2xl p-5 border border-charcoal/5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
              <RefreshCw className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-charcoal mb-1">Flush System Cache</h3>
              <p className="text-sm text-charcoal/60 mb-4">
                Clear cached data and refresh from source
              </p>
              <button
                onClick={handleFlushCache}
                disabled={isProcessing}
                className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                Flush Cache
              </button>
            </div>
          </div>
        </div>

        {/* Flush Transactions */}
        <div className="bg-white rounded-2xl p-5 border border-charcoal/5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
              <Trash2 className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-charcoal mb-1">Flush Transactions</h3>
              <p className="text-sm text-charcoal/60 mb-4">
                Remove pending and old transactions
              </p>
              <button
                onClick={handleFlushTransactions}
                disabled={isProcessing}
                className="w-full py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                Flush Transactions
              </button>
            </div>
          </div>
        </div>

        {/* Flush Old Bookings */}
        <div className="bg-white rounded-2xl p-5 border border-charcoal/5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
              <Database className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-charcoal mb-1">Flush Old Bookings</h3>
              <p className="text-sm text-charcoal/60 mb-4">
                Remove completed/cancelled bookings older than 30 days
              </p>
              <button
                onClick={handleFlushBookings}
                disabled={isProcessing}
                className="w-full py-2.5 bg-purple-600 text-white rounded-xl text-sm font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                Flush Bookings
              </button>
            </div>
          </div>
        </div>

        {/* Sync to Cloud */}
        <div className="bg-white rounded-2xl p-5 border border-charcoal/5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-50 flex items-center justify-center shrink-0">
              <Cloud className="w-6 h-6 text-cyan-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-charcoal mb-1">Sync to Cloud</h3>
              <p className="text-sm text-charcoal/60 mb-4">
                Push local data to cloud database
              </p>
              <button
                onClick={handleSyncToCloud}
                disabled={isProcessing}
                className="w-full py-2.5 bg-cyan-600 text-white rounded-xl text-sm font-semibold hover:bg-cyan-700 transition-colors disabled:opacity-50"
              >
                Sync Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 rounded-2xl p-5 border border-red-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-red-900 mb-1">Danger Zone</h3>
            <p className="text-sm text-red-700 mb-4">
              These actions are irreversible. Use with caution.
            </p>
            <button
              onClick={() => setShowConfirmModal('purge')}
              disabled={isProcessing}
              className="w-full py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              Purge All Data
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal === 'purge' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-charcoal">Confirm Purge</h3>
                  <p className="text-sm text-charcoal/60">This action cannot be undone</p>
                </div>
              </div>
              <p className="text-sm text-charcoal/70 mb-6">
                This will permanently delete all data from the database including users, bookings, transactions, services, and experiences. Are you absolutely sure?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(null)}
                  className="flex-1 py-2.5 border border-charcoal/20 text-charcoal rounded-xl text-sm font-semibold hover:bg-charcoal/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePurgeAll}
                  disabled={isProcessing}
                  className="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  Purge All Data
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
