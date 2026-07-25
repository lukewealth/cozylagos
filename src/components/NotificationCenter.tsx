import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bell, Plus, Search, Send, Users, User, Shield, X, Check, Mail,
  MessageSquare, Calendar, DollarSign, Package
} from 'lucide-react';
import { useAuth } from '../auth';
import { useDatabase } from '../hooks/useDatabase';
import api from '../services/api';
import { ToastContainer, showToast } from './ui/Toast';

interface Notification {
  _id: string;
  title: string;
  message: string;
  userId: string;
  type: string;
  targetRole: string;
  read: boolean;
  sentBy: string;
  sentAt: string;
  createdAt: string;
}

export default function NotificationCenter() {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showSendNotification, setShowSendNotification] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      const res = await api.crm.getNotifications();
      if (res.success) {
        setNotifications(res.data || []);
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
    setIsLoading(false);
  };

  const handleSendNotification = async (data: any) => {
    try {
      const res = await api.crm.sendNotification(data);
      if (res.success) {
        setNotifications([res.data, ...notifications]);
        setShowSendNotification(false);
        showToast({ type: 'success', title: 'Notification Sent', message: 'Notification sent successfully' });
      }
    } catch (error) {
      showToast({ type: 'error', title: 'Error', message: 'Failed to send notification' });
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.crm.updateNotification(id, { read: true });
      setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleDeleteNotification = async (id: string) => {
    try {
      await api.crm.deleteNotification(id);
      setNotifications(notifications.filter(n => n._id !== id));
      showToast({ type: 'success', title: 'Deleted', message: 'Notification deleted' });
    } catch (error) {
      showToast({ type: 'error', title: 'Error', message: 'Failed to delete notification' });
    }
  };

  const filteredNotifications = notifications.filter(n =>
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="flex-grow bg-parchment">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 xl:px-20 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal">
              Notifications <span className="italic font-light text-gold-dark">Center</span>
            </h1>
            <p className="text-sm text-charcoal/60 mt-1">
              {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
            </p>
          </div>
          {currentUser?.role === 'admin' || currentUser?.role === 'super_admin' ? (
            <button
              onClick={() => setShowSendNotification(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gold text-charcoal font-bold text-sm rounded-xl hover:bg-gold-dark hover:text-parchment transition-colors shadow-lg"
            >
              <Send className="w-4 h-4" />
              <span>Send Notification</span>
            </button>
          ) : null}
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-charcoal/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 border-4 border-gold/20 border-t-gold rounded-full animate-spin mx-auto mb-4" />
            <p className="text-charcoal/60">Loading notifications...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-16">
            <Bell className="w-16 h-16 text-charcoal/20 mx-auto mb-4" />
            <p className="text-lg font-semibold text-charcoal mb-2">No notifications</p>
            <p className="text-sm text-charcoal/50">You're all caught up!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <div
                key={notification._id}
                className={`bg-white rounded-2xl p-5 border border-charcoal/5 shadow-sm hover:shadow-md transition-all ${
                  !notification.read ? 'border-l-4 border-l-gold' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-serif text-lg font-bold text-charcoal mb-1">{notification.title}</h3>
                    <p className="text-sm text-charcoal/70">{notification.message}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkAsRead(notification._id)}
                        className="p-2 bg-gold/10 text-gold-dark rounded-lg hover:bg-gold/20 transition-colors"
                        title="Mark as read"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    {(currentUser?.role === 'admin' || currentUser?.role === 'super_admin') && (
                      <button
                        onClick={() => handleDeleteNotification(notification._id)}
                        className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
                        title="Delete"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-charcoal/50">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(notification.sentAt).toLocaleString()}
                  </span>
                  {notification.targetRole !== 'all' && (
                    <span className="bg-charcoal/5 px-2 py-0.5 rounded">
                      {notification.targetRole}
                    </span>
                  )}
                  {notification.type && (
                    <span className="bg-gold/10 text-gold-dark px-2 py-0.5 rounded">
                      {notification.type}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showSendNotification && (
          <SendNotificationModal
            onClose={() => setShowSendNotification(false)}
            onSend={handleSendNotification}
          />
        )}
      </AnimatePresence>

      <ToastContainer />
    </div>
  );
}

function SendNotificationModal({ onClose, onSend }: {
  onClose: () => void;
  onSend: (data: any) => void;
}) {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    targetRole: 'all',
    type: 'announcement',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSend(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm" />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-parchment rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-parchment border-b border-charcoal/10 px-6 py-4 flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-charcoal">Send Notification</h2>
          <button onClick={onClose} className="p-2 hover:bg-charcoal/5 rounded-lg transition-colors">
            <X className="w-5 h-5 text-charcoal/60" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-1.5 block">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-1.5 block">Message</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 bg-white border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-1.5 block">Target Audience</label>
              <select
                value={formData.targetRole}
                onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
              >
                <option value="all">All Users</option>
                <option value="user">Guests</option>
                <option value="service_provider">Service Providers</option>
                <option value="admin">Admins</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-1.5 block">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
              >
                <option value="announcement">Announcement</option>
                <option value="booking">Booking Update</option>
                <option value="promotion">Promotion</option>
                <option value="alert">Alert</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-3 bg-charcoal/5 text-charcoal font-bold text-sm rounded-xl hover:bg-charcoal/10 transition-colors">
              Cancel
            </button>
            <button type="submit" className="flex-1 py-3 bg-gold text-charcoal font-bold text-sm rounded-xl hover:bg-gold-dark hover:text-parchment transition-colors flex items-center justify-center gap-2">
              <Send className="w-4 h-4" />
              Send Notification
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
