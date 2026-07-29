import React, { useState, useEffect } from 'react';
import {
  Bell, Send, Search, Filter, Check, Mail, Phone, Calendar,
  MessageSquare, AlertCircle, CheckCircle, Clock, Trash2, Eye
} from 'lucide-react';
import { useDatabase } from '../hooks/useDatabase';
import { useAuth } from '../auth';
import api from '../services/api';
import { ToastContainer, showToast } from './ui/Toast';
import { AdminCard, AdminButton, AdminStatCard, AdminBadge, AdminSearch, AdminEmptyState, AdminTabs } from './ui';
import UniversalModal from './ui/UniversalModal';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error' | 'booking' | 'support';
  targetRole: 'all' | 'user' | 'service_provider' | 'admin';
  read: boolean;
  sentBy: string;
  sentAt: string;
  createdAt: string;
}

interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
  responses: TicketResponse[];
}

interface TicketResponse {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  createdAt: string;
}

export default function NotificationManagement() {
  const { currentUser } = useAuth();
  const { data: notifications, addRecord, updateRecord, removeRecord } = useDatabase('notifications');
  const [activeTab, setActiveTab] = useState<'notifications' | 'support'>('notifications');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showSendModal, setShowSendModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  const filteredNotifications = (notifications as any[]).filter(notif => {
    const matchesSearch = notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notif.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || notif.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleSendNotification = async (notifData: any) => {
    try {
      const newNotif = {
        ...notifData,
        id: `notif-${Date.now()}`,
        read: false,
        sentBy: currentUser?.id || 'admin',
        sentAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };

      await addRecord(newNotif);

      try {
        await api.crm.sendNotification(newNotif);
      } catch (error) {
        console.error('API sync failed:', error);
      }

      setShowSendModal(false);
      showToast({ type: 'success', title: 'Notification Sent', message: 'Notification has been sent to users' });
    } catch (error) {
      showToast({ type: 'error', title: 'Error', message: 'Failed to send notification' });
    }
  };

  const handleMarkAsRead = async (notifId: string) => {
    try {
      await updateRecord(notifId, { read: true });
      
      try {
        await api.crm.updateNotification(notifId, { read: true });
      } catch (error) {
        console.error('API sync failed:', error);
      }
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleDeleteNotification = async (notifId: string) => {
    try {
      await removeRecord(notifId);
      
      try {
        await api.crm.deleteNotification(notifId);
      } catch (error) {
        console.error('API sync failed:', error);
      }

      showToast({ type: 'success', title: 'Deleted', message: 'Notification has been deleted' });
    } catch (error) {
      showToast({ type: 'error', title: 'Error', message: 'Failed to delete notification' });
    }
  };

  const types = ['all', 'info', 'warning', 'success', 'error', 'booking', 'support'];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm sm:text-base md:text-lg font-serif font-bold text-charcoal">Notifications & Support</h2>
          <p className="text-xs sm:text-sm text-charcoal/60 mt-1">Manage notifications and support tickets</p>
        </div>
        <AdminButton
          variant="primary"
          icon={Send}
          onClick={() => setShowSendModal(true)}
        >
          Send Notification
        </AdminButton>
      </div>

      <AdminTabs
        tabs={[
          { id: 'notifications', label: 'Notifications' },
          { id: 'support', label: 'Support Tickets' }
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === 'notifications' && (
        <>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <AdminSearch
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search notifications..."
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
            >
              {types.map(type => (
                <option key={type} value={type}>{type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}</option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            {filteredNotifications.map((notif: any) => (
              <AdminCard
                key={notif.id}
                className={`hover:shadow-lg ${!notif.read ? 'border-l-4 border-l-gold' : ''}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-serif text-lg font-bold text-charcoal">{notif.title}</h3>
                      <AdminBadge
                        variant={
                          notif.type === 'info' ? 'info' :
                          notif.type === 'warning' ? 'warning' :
                          notif.type === 'success' ? 'success' :
                          notif.type === 'error' ? 'danger' :
                          'default'
                        }
                        size="sm"
                      >
                        {notif.type}
                      </AdminBadge>
                    </div>
                    <p className="text-sm text-charcoal/60">{notif.message}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-charcoal/50">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(notif.sentAt).toLocaleString()}
                      </span>
                      {notif.targetRole !== 'all' && (
                        <AdminBadge variant="default" size="sm">
                          {notif.targetRole}
                        </AdminBadge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    {!notif.read && (
                      <AdminButton
                        variant="ghost"
                        size="sm"
                        icon={Check}
                        onClick={() => handleMarkAsRead(notif.id)}
                      />
                    )}
                    <AdminButton
                      variant="danger"
                      size="sm"
                      icon={Trash2}
                      onClick={() => handleDeleteNotification(notif.id)}
                    />
                  </div>
                </div>
              </AdminCard>
            ))}
          </div>

          {filteredNotifications.length === 0 && (
            <AdminEmptyState
              icon={Bell}
              title="No notifications found"
              description="Send your first notification to get started"
              action={{
                label: 'Send Notification',
                onClick: () => setShowSendModal(true)
              }}
            />
          )}
        </>
      )}

      {activeTab === 'support' && (
        <div className="text-center py-16">
          <MessageSquare className="w-16 h-16 text-charcoal/20 mx-auto mb-4" />
          <p className="text-lg font-semibold text-charcoal mb-2">Support Tickets</p>
          <p className="text-sm text-charcoal/50">Support ticket management coming soon</p>
        </div>
      )}

      <UniversalModal
        isOpen={showSendModal}
        onClose={() => setShowSendModal(false)}
        title="Send Notification"
        size="md"
        variant="auto"
      >
        <SendNotificationForm
          onClose={() => setShowSendModal(false)}
          onSend={handleSendNotification}
        />
      </UniversalModal>

      <ToastContainer />
    </div>
  );
}

function SendNotificationForm({ onClose, onSend }: {
  onClose: () => void;
  onSend: (data: any) => void;
}) {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info',
    targetRole: 'all',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSend(formData);
  };

  return (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-2">Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-2">Message</label>
            <textarea
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-2">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full px-4 py-2 border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
              >
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="success">Success</option>
                <option value="error">Error</option>
                <option value="booking">Booking</option>
                <option value="support">Support</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-2">Target</label>
              <select
                value={formData.targetRole}
                onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                className="w-full px-4 py-2 border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
              >
                <option value="all">All Users</option>
                <option value="user">Guests</option>
                <option value="service_provider">Service Providers</option>
                <option value="admin">Admins</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-charcoal/10 text-charcoal font-bold text-xs uppercase rounded-lg hover:bg-charcoal/5 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gold text-charcoal font-bold text-xs uppercase rounded-lg hover:bg-gold-dark transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Send
            </button>
          </div>
        </form>
  );
}
