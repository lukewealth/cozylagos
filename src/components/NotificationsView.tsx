import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Bell, Check, CheckCheck, Calendar, DollarSign, MessageCircle, AlertCircle, Info, Trash2, Filter } from 'lucide-react';
import { useDatabase } from '../hooks/useDatabase';
import { useAuth } from '../auth';

interface Notification {
  id: string;
  type: 'booking' | 'payment' | 'message' | 'alert' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  relatedId?: string;
}

export default function NotificationsView() {
  const { currentUser } = useAuth();
  const { data: bookings } = useDatabase('bookings');
  const { data: transactions } = useDatabase('transactions');
  const [filter, setFilter] = useState<'all' | 'unread' | 'bookings' | 'payments'>('all');

  const notifications = useMemo(() => {
    const notifs: Notification[] = [];

    const userBookings = (bookings as any[]).filter(
      (b: any) => b.guestId === currentUser?.id || b.guestEmail === currentUser?.email
    );

    userBookings.forEach((booking: any) => {
      const status = booking.status?.toLowerCase();
      if (status === 'pending') {
        notifs.push({
          id: `notif-booking-${booking.id}`,
          type: 'booking',
          title: 'Booking Pending',
          message: `Your booking for ${booking.listingTitle} is pending confirmation.`,
          timestamp: booking.createdAt || new Date().toISOString(),
          read: false,
          relatedId: booking.id,
        });
      } else if (status === 'confirmed') {
        notifs.push({
          id: `notif-booking-${booking.id}`,
          type: 'booking',
          title: 'Booking Confirmed',
          message: `Your booking for ${booking.listingTitle} has been confirmed! Check-in: ${booking.checkIn}`,
          timestamp: booking.updatedAt || booking.createdAt || new Date().toISOString(),
          read: true,
          relatedId: booking.id,
        });
      } else if (status === 'cancelled') {
        notifs.push({
          id: `notif-booking-${booking.id}`,
          type: 'alert',
          title: 'Booking Cancelled',
          message: `Your booking for ${booking.listingTitle} has been cancelled.`,
          timestamp: booking.updatedAt || booking.createdAt || new Date().toISOString(),
          read: true,
          relatedId: booking.id,
        });
      }
    });

    const userTransactions = (transactions as any[]).filter(
      (t: any) => t.userId === currentUser?.id
    );

    userTransactions.forEach((tx: any) => {
      notifs.push({
        id: `notif-tx-${tx.id}`,
        type: 'payment',
        title: tx.status === 'Processed' || tx.status === 'processed' ? 'Payment Processed' : 'Payment Pending',
        message: `${tx.description || 'Transaction'} - ₦${(tx.amount || 0).toLocaleString()}`,
        timestamp: tx.createdAt || new Date().toISOString(),
        read: tx.status === 'Processed' || tx.status === 'processed',
        relatedId: tx.id,
      });
    });

    notifs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return notifs;
  }, [bookings, transactions, currentUser]);

  const filteredNotifications = useMemo(() => {
    switch (filter) {
      case 'unread': return notifications.filter(n => !n.read);
      case 'bookings': return notifications.filter(n => n.type === 'booking');
      case 'payments': return notifications.filter(n => n.type === 'payment');
      default: return notifications;
    }
  }, [notifications, filter]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'booking': return Calendar;
      case 'payment': return DollarSign;
      case 'message': return MessageCircle;
      case 'alert': return AlertCircle;
      default: return Info;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'booking': return 'bg-blue-100 text-blue-600';
      case 'payment': return 'bg-green-100 text-green-600';
      case 'message': return 'bg-purple-100 text-purple-600';
      case 'alert': return 'bg-red-100 text-red-600';
      default: return 'bg-charcoal/5 text-charcoal/60';
    }
  };

  return (
    <div className="flex-grow w-full max-w-[1440px] mx-auto px-6 md:px-12 xl:px-20 py-12 animate-fade-in-up">
      <header className="mb-8">
        <div className="flex items-center gap-2 text-gold-dark font-bold text-[10px] tracking-[0.25em] uppercase mb-1">
          <Bell className="w-4 h-4" />
          <span>Notifications</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-charcoal">
              Notification Center
            </h1>
            <p className="text-sm text-charcoal/60 mt-2">
              {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}.` : 'All caught up!'}
            </p>
          </div>
          {unreadCount > 0 && (
            <button className="flex items-center gap-2 px-4 py-2 bg-charcoal/5 hover:bg-charcoal/10 rounded-xl text-xs font-bold text-charcoal transition-colors">
              <CheckCheck className="w-4 h-4" />
              Mark All Read
            </button>
          )}
        </div>
      </header>

      <div className="flex gap-2 mb-6">
        {([
          { id: 'all', label: 'All', count: notifications.length },
          { id: 'unread', label: 'Unread', count: unreadCount },
          { id: 'bookings', label: 'Bookings', count: notifications.filter(n => n.type === 'booking').length },
          { id: 'payments', label: 'Payments', count: notifications.filter(n => n.type === 'payment').length },
        ] as const).map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              filter === f.id
                ? 'bg-charcoal text-parchment'
                : 'bg-charcoal/5 text-charcoal/60 hover:bg-charcoal/10'
            }`}
          >
            <span>{f.label}</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[9px] ${
              filter === f.id ? 'bg-parchment/20' : 'bg-charcoal/10'
            }`}>
              {f.count}
            </span>
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-charcoal/5 p-12 text-center">
            <Bell className="w-12 h-12 text-charcoal/10 mx-auto mb-4" />
            <p className="text-charcoal/40 text-sm">No notifications found.</p>
            <p className="text-charcoal/30 text-xs mt-1">
              {filter === 'unread' ? 'You\'re all caught up!' : 'Notifications will appear here.'}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notif, idx) => {
            const Icon = getIcon(notif.type);
            const color = getColor(notif.type);
            return (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.03 }}
                className={`bg-white rounded-2xl border p-5 flex items-start gap-4 transition-all hover:shadow-md ${
                  !notif.read ? 'border-gold/30 bg-gold/[0.02]' : 'border-charcoal/5'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-charcoal text-sm">{notif.title}</h4>
                      <p className="text-xs text-charcoal/60 mt-1">{notif.message}</p>
                    </div>
                    {!notif.read && (
                      <div className="w-2 h-2 rounded-full bg-gold shrink-0 mt-1.5" />
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-[10px] text-charcoal/40">
                      {new Date(notif.timestamp).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {!notif.read && (
                      <button className="text-[10px] text-gold-dark hover:text-charcoal font-bold transition-colors flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Mark Read
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
