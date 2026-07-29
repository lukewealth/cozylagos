import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bell, X, Check, Trash2, Clock, AlertCircle, Info,
  CheckCircle, XCircle, RefreshCw, Filter
} from 'lucide-react';
import { useAuth } from '../auth';
import { useDatabase } from '../hooks/useDatabase';
import UniversalModal from './ui/UniversalModal';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'booking' | 'withdrawal';
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export default function NotificationCenter() {
  const { currentUser } = useAuth();
  const { data: notifications, updateRecord } = useDatabase('notifications');
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const userNotifications = (notifications as any[])
    .filter((n: any) => n.userId === currentUser?.id || n.targetRole === 'all')
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const filteredNotifications = userNotifications.filter((n: any) => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  const unreadCount = userNotifications.filter((n: any) => !n.read).length;

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await updateRecord(notificationId, { read: true });
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifications = userNotifications.filter((n: any) => !n.read);
      for (const notification of unreadNotifications) {
        await updateRecord(notification.id, { read: true });
      }
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const handleDelete = async (notificationId: string) => {
    try {
      // In a real app, this would call an API to delete
      console.log('Delete notification:', notificationId);
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-amber-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'booking':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'withdrawal':
        return <RefreshCw className="w-5 h-5 text-purple-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getNotificationStyle = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-amber-50 border-amber-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'booking':
        return 'bg-blue-50 border-blue-200';
      case 'withdrawal':
        return 'bg-purple-50 border-purple-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 rounded-lg hover:bg-charcoal/5 transition-colors"
      >
        <Bell className="w-5 h-5 text-charcoal" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <UniversalModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Notifications"
        size="md"
        variant="auto"
      >
        <div className="space-y-4">
          {/* Header Actions */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex gap-2">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-2 rounded-lg hover:bg-charcoal/5 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="px-3 py-1.5 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  Mark all as read
                </button>
              )}
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-3 py-1.5 border border-charcoal/10 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-gold/50"
            >
              <option value="all">All</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
          </div>

          {/* Notifications List */}
          <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="w-12 h-12 text-charcoal/20 mx-auto mb-3" />
                <p className="text-sm text-charcoal/50">No notifications</p>
              </div>
            ) : (
              filteredNotifications.map((notification: any) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`p-4 rounded-xl border ${getNotificationStyle(notification.type)} ${
                    !notification.read ? 'ring-2 ring-blue-200' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h4 className="font-bold text-sm text-charcoal mb-1">
                            {notification.title}
                          </h4>
                          <p className="text-xs text-charcoal/70 mb-2">
                            {notification.message}
                          </p>
                          <p className="text-[10px] text-charcoal/50">
                            {new Date(notification.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          {!notification.read && (
                            <button
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="p-1.5 rounded-lg hover:bg-white/50 transition-colors"
                              title="Mark as read"
                            >
                              <Check className="w-4 h-4 text-green-600" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(notification.id)}
                            className="p-1.5 rounded-lg hover:bg-white/50 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </UniversalModal>
    </>
  );
}
