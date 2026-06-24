import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users, Home, Calendar, ShieldAlert, Settings, Search, MoreVertical,
  CheckCircle, XCircle, Map as MapIcon, List, Eye, Edit3, Trash2, Power,
  Clock, AlertCircle, DollarSign, TrendingUp, Bell, Filter, ChevronDown,
  MessageCircle, Phone, Mail, RefreshCw, Plane, Lock, Timer, Shield,
  Key, Car, Sparkles, Activity, Download, Radio, Cloud, Moon, Sun,
  LayoutDashboard, ClipboardList, UserCheck, ConciergeBell, BarChart3,
  ChevronRight, Plus, ArrowUpRight, Wifi, Zap, UserCircle
} from 'lucide-react';
import { Listing } from '../types';
import { useDatabase } from '../hooks/useDatabase';
import { useAuth } from '../auth';
import api from '../services/api';

interface AdminDashboardProps {
  listings: Listing[];
  onToggleStatus: (id: string) => void;
  onDeleteListing: (id: string) => void;
}

interface BookingRequest {
  id: string;
  listingId: string;
  listingTitle: string;
  guestName: string;
  guestEmail: string;
  checkIn: string;
  checkOut: string;
  guestsCount: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'Pending' | 'Confirmed' | 'Cancelled';
  createdAt: string;
  services?: string[];
}

type AdminSection = 'dashboard' | 'requests' | 'guests' | 'services' | 'reports' | 'listings' | 'bookings' | 'analytics';

const NAV_ITEMS: { id: AdminSection; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'requests', label: 'Requests', icon: ClipboardList },
  { id: 'guests', label: 'Guests', icon: UserCheck },
  { id: 'services', label: 'Services', icon: ConciergeBell },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
];

const MOCK_ARRIVALS = [
  { id: 'arr-1', guestName: 'Adewale Johnson', initials: 'AJ', tier: 'vip' as const, listingTitle: 'The Ikoyi Penthouse', unitCode: 'UNIT 402', status: 'en_route' as const, eta: '8 mins away' },
  { id: 'arr-2', guestName: 'Sarah Oritse', initials: 'SO', tier: 'platinum' as const, listingTitle: 'Eko Atlantic Glasshouse', unitCode: 'VILLA A-1', status: 'checked_in' as const },
  { id: 'arr-3', guestName: 'Marcus Chen', initials: 'MC', tier: 'new' as const, listingTitle: 'Victoria Island Loft', unitCode: 'STUDIO 12', status: 'awaiting_concierge' as const },
  { id: 'arr-4', guestName: 'Ngozi Eze', initials: 'NE', tier: 'gold' as const, listingTitle: 'Lekki Garden Suite', unitCode: 'SUITE 7B', status: 'en_route' as const, eta: '22 mins away' },
  { id: 'arr-5', guestName: 'James Whitfield', initials: 'JW', tier: 'vip' as const, listingTitle: 'Banana Island Villa', unitCode: 'VILLA 3', status: 'arriving' as const, eta: '2 mins away' },
];

const MOCK_SECURITY_LOGS = [
  { id: 'log-1', timestamp: '14:20', type: 'key_entry' as const, title: 'Penthouse 402', description: 'Primary Key Entry detected for Adewale Johnson', icon: Key },
  { id: 'log-2', timestamp: '14:15', type: 'service_pass' as const, title: 'Eko Glasshouse', description: 'Valet Access Granted. Plate: LAG-992-VIP', icon: Car },
  { id: 'log-3', timestamp: '13:45', type: 'auth_entry' as const, title: 'VI Loft', description: 'Housekeeping Entry Authorized via Master Key API', icon: Shield },
  { id: 'log-4', timestamp: '13:20', type: 'access_granted' as const, title: 'Lekki Suite 7B', description: 'Biometric scan verified for guest Ngozi Eze', icon: Lock },
];

export default function AdminDashboard({ listings, onToggleStatus, onDeleteListing }: AdminDashboardProps) {
  const { currentUser } = useAuth();
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedBooking, setSelectedBooking] = useState<BookingRequest | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [confirmNotes, setConfirmNotes] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDarkMode, setIsDarkMode] = useState(false);

  const { data: bookings, addRecord: updateBooking } = useDatabase('bookings');

  const pendingBookings = (bookings as any[]).filter(
    (b: any) => b.status === 'pending' || b.status === 'Pending'
  );

  const confirmedBookings = (bookings as any[]).filter(
    (b: any) => b.status === 'confirmed' || b.status === 'Confirmed'
  );

  const filteredListings = useMemo(() => listings.filter(l =>
    l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.location.toLowerCase().includes(searchQuery.toLowerCase())
  ), [listings, searchQuery]);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const totalRevenue = confirmedBookings.reduce((sum: number, b: any) => sum + (b.totalAmount || 0), 0);

  const handleConfirmBooking = async (booking: BookingRequest) => {
    try { await api.bookings.confirm(booking.id); } catch { /* local fallback */ }
    updateBooking({ ...booking, status: 'confirmed', updatedAt: new Date().toISOString() } as any);
    setShowConfirmModal(false);
    setConfirmNotes('');
    setSelectedBooking(null);
  };

  const handleRejectBooking = async (booking: BookingRequest) => {
    try { await api.bookings.updateStatus(booking.id, 'cancelled'); } catch { /* local fallback */ }
    updateBooking({ ...booking, status: 'cancelled', updatedAt: new Date().toISOString() } as any);
    setShowRejectModal(false);
    setRejectReason('');
    setSelectedBooking(null);
  };

  const handleWhatsAppNotify = (booking: BookingRequest) => {
    const message = `Hi ${booking.guestName}, your booking for ${booking.listingTitle} (${booking.checkIn} to ${booking.checkOut}) has been confirmed! Total: ₦${booking.totalAmount.toLocaleString()}. Welcome to Cozy Lagos!`;
    window.open(`https://wa.me/2348064305782?text=${encodeURIComponent(message)}`, '_blank');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'en_route': return 'text-primary';
      case 'arriving': return 'text-primary-container';
      case 'checked_in': return 'text-secondary';
      case 'awaiting_concierge': return 'text-on-tertiary-fixed-variant';
      default: return 'text-secondary';
    }
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'vip': return 'bg-primary-container/20 text-primary';
      case 'platinum': return 'bg-outline-variant/30 text-secondary';
      case 'gold': return 'bg-primary-container/10 text-primary';
      case 'new': return 'bg-surface-container text-on-secondary-container';
      default: return 'bg-surface-container text-secondary';
    }
  };

  const getTierLabel = (tier: string) => {
    switch (tier) {
      case 'vip': return 'VIP MEMBER';
      case 'platinum': return 'PLATINUM';
      case 'gold': return 'GOLD';
      case 'new': return 'NEW GUEST';
      default: return 'GUEST';
    }
  };

  const todayStr = currentTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const timeStr = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex min-h-screen bg-parchment">
      <aside className="hidden lg:flex w-72 flex-col fixed left-0 top-0 h-screen border-r border-outline-variant/20 bg-surface-container-lowest z-50">
        <div className="px-8 py-10">
          <h1 className="font-serif text-headline-sm font-bold text-primary tracking-tight">Cozy Lagos</h1>
          <p className="text-label-caps text-secondary opacity-70 mt-1 uppercase tracking-widest">Admin Portal</p>
        </div>
        <nav className="flex-1 flex flex-col px-4 gap-2">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all relative text-left ${
                activeSection === item.id
                  ? 'text-primary bg-primary-container/10 font-bold'
                  : 'text-secondary hover:text-primary hover:bg-surface-container-high'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-body-md">{item.label}</span>
              {activeSection === item.id && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute right-0 top-0 bottom-0 w-1 bg-primary rounded-l-full"
                />
              )}
            </button>
          ))}
        </nav>
        <div className="mt-auto px-4 pb-10 flex flex-col gap-2">
          <button className="w-full bg-primary text-on-primary py-4 px-6 rounded-lg font-bold text-body-md flex items-center justify-center gap-2 mb-6 hover:opacity-90 transition-opacity luxury-shadow">
            <Plus className="w-5 h-5" />
            New Booking
          </button>
          <button className="flex items-center gap-4 px-4 py-3 rounded-lg text-secondary hover:text-primary transition-colors text-left">
            <Settings className="w-5 h-5" />
            <span className="text-body-md">Settings</span>
          </button>
          <button className="flex items-center gap-4 px-4 py-3 rounded-lg text-secondary hover:text-primary transition-colors text-left">
            <AlertCircle className="w-5 h-5" />
            <span className="text-body-md">Support</span>
          </button>
        </div>
      </aside>

      <header className="hidden lg:flex justify-between items-center h-20 pl-80 pr-20 w-full fixed top-0 bg-surface/80 backdrop-blur-md border-b border-outline-variant/10 z-40">
        <div className="flex items-center gap-4">
          <div className="relative focus-within:ring-1 focus-within:ring-primary rounded-lg transition-all">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
            <input
              className="bg-surface-container-low border-none rounded-lg pl-10 pr-4 py-2 w-72 text-body-md focus:ring-0 focus:outline-none"
              placeholder="Search arrivals..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex gap-4 items-center">
            <button className="p-2 rounded-full hover:bg-surface-container text-secondary transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full" />
            </button>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full hover:bg-surface-container text-secondary transition-colors"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
          <div className="h-10 w-px bg-outline-variant/30" />
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-body-md font-bold text-on-surface leading-none">{currentUser?.name || 'Admin'}</p>
              <p className="text-label-caps text-secondary uppercase mt-1">Concierge Elite</p>
            </div>
            <div className="w-10 h-10 rounded-full overflow-hidden border border-primary/20 bg-primary-container/20 flex items-center justify-center">
              <UserCircle className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 lg:pl-80 pt-0 lg:pt-20 pb-20 min-h-screen">
        <AnimatePresence mode="wait">
          {activeSection === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="px-6 lg:px-20 pt-8 lg:pt-12"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
                <div>
                  <h2 className="font-serif text-headline-lg text-on-surface">Arrival Operations Center</h2>
                  <p className="text-body-lg text-secondary mt-2">Monitoring guest check-ins for {todayStr}</p>
                </div>
                <div className="flex gap-3">
                  <button className="px-6 py-3 bg-surface-container-lowest border border-outline-variant/30 rounded-lg text-body-md font-semibold text-on-surface hover:bg-surface-container-low transition-colors flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Download Report
                  </button>
                  <button className="px-6 py-3 bg-primary text-on-primary rounded-lg text-body-md font-bold luxury-shadow hover:opacity-90 transition-opacity flex items-center gap-2">
                    <Radio className="w-4 h-4" />
                    Broadcast Update
                  </button>
                </div>
              </div>

              <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                {[
                  { label: 'Total Arrivals Today', value: '14', sub: '7 Checked-in, 7 Pending', icon: Plane, border: 'border-primary', iconColor: 'text-primary' },
                  { label: 'VIP Clearances', value: '3', sub: 'Critical Priority', icon: Shield, border: 'border-error', iconColor: 'text-error', valueColor: 'text-error' },
                  { label: 'Smart Access Status', value: 'Online', sub: 'Secure / End-to-End', icon: Lock, border: 'border-primary-container', iconColor: 'text-primary-container' },
                  { label: 'Avg. Turnaround Time', value: '12 mins', sub: '+2% from yesterday', icon: Timer, border: 'border-outline', iconColor: 'text-outline' },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="glass-card luxury-shadow p-6 rounded-xl border-l-4 ${stat.border}"
                    style={{ borderLeftColor: stat.border.includes('primary') ? '#735c00' : stat.border.includes('error') ? '#ba1a1a' : stat.border.includes('container') ? '#d4af37' : '#7f7663' }}
                  >
                    <p className="text-label-caps text-secondary uppercase mb-2">{stat.label}</p>
                    <div className="flex items-end justify-between">
                      <div>
                        <span className={`font-serif text-headline-md ${stat.valueColor || 'text-on-surface'}`}>{stat.value}</span>
                        <p className="text-body-md text-secondary mt-1">{stat.sub}</p>
                      </div>
                      <stat.icon className={`${stat.iconColor} mb-1 w-6 h-6`} />
                    </div>
                  </motion.div>
                ))}
              </section>

              <div className="grid grid-cols-12 gap-8">
                <div className="col-span-12 lg:col-span-8">
                  <div className="bg-surface-container-lowest rounded-xl luxury-shadow overflow-hidden border border-outline-variant/10">
                    <div className="px-8 py-6 border-b border-outline-variant/10 flex justify-between items-center">
                      <h3 className="font-serif text-headline-sm text-on-surface">Live Arrival Stream</h3>
                      <div className="flex gap-2 items-center">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                        </span>
                        <span className="px-3 py-1 bg-primary-container/10 text-primary text-label-caps rounded-full">REAL-TIME FEED</span>
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-surface-container-low border-b border-outline-variant/10">
                            <th className="px-8 py-4 text-label-caps text-secondary uppercase font-semibold">Guest</th>
                            <th className="px-8 py-4 text-label-caps text-secondary uppercase font-semibold">Property</th>
                            <th className="px-8 py-4 text-label-caps text-secondary uppercase font-semibold">Status</th>
                            <th className="px-8 py-4 text-label-caps text-secondary uppercase font-semibold">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/10">
                          {MOCK_ARRIVALS.map((arrival) => (
                            <motion.tr
                              key={arrival.id}
                              whileHover={{ backgroundColor: 'rgba(244, 243, 242, 0.5)' }}
                              className="transition-colors group"
                            >
                              <td className="px-8 py-6">
                                <div className="flex items-center gap-3">
                                  <div className={`w-10 h-10 rounded-full ${getTierBadge(arrival.tier)} flex items-center justify-center font-bold`}>
                                    {arrival.initials}
                                  </div>
                                  <div>
                                    <p className="text-body-md font-bold text-on-surface">{arrival.guestName}</p>
                                    <p className={`text-label-caps ${getTierBadge(arrival.tier)} inline-block px-2 py-0.5 rounded text-[9px]`}>{getTierLabel(arrival.tier)}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-8 py-6">
                                <p className="text-body-md text-on-surface">{arrival.listingTitle}</p>
                                <p className="text-label-caps text-secondary">{arrival.unitCode}</p>
                              </td>
                              <td className="px-8 py-6">
                                {arrival.status === 'en_route' || arrival.status === 'arriving' ? (
                                  <div className={`flex items-center gap-2 ${getStatusColor(arrival.status)} font-semibold`}>
                                    <span className="relative flex h-2 w-2">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                                    </span>
                                    {arrival.status === 'en_route' ? `En Route (${arrival.eta})` : `Arriving (${arrival.eta})`}
                                  </div>
                                ) : arrival.status === 'checked_in' ? (
                                  <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2 text-secondary">
                                      <span className="w-2 h-2 rounded-full bg-secondary" />
                                      Checked In
                                    </div>
                                    <span className="text-[10px] bg-surface-container text-on-secondary-container px-2 py-0.5 rounded-full w-fit">Key Active</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2 text-on-tertiary-fixed-variant">
                                    <Clock className="w-4 h-4" />
                                    Awaiting Concierge
                                  </div>
                                )}
                              </td>
                              <td className="px-8 py-6">
                                {arrival.status === 'en_route' || arrival.status === 'arriving' ? (
                                  <button className="px-4 py-2 border border-primary text-primary rounded-lg text-label-caps font-bold hover:bg-primary hover:text-on-primary transition-all uppercase tracking-widest text-xs">
                                    Verify Access
                                  </button>
                                ) : arrival.status === 'awaiting_concierge' ? (
                                  <button className="px-4 py-2 bg-primary-container/20 text-on-primary-container rounded-lg text-label-caps font-bold hover:bg-primary-container transition-all uppercase tracking-widest text-xs">
                                    Assign Porter
                                  </button>
                                ) : (
                                  <button className="px-4 py-2 text-secondary hover:text-primary transition-colors text-label-caps font-bold flex items-center gap-1 uppercase tracking-widest text-xs">
                                    <Eye className="w-3 h-3" />
                                    View Logs
                                  </button>
                                )}
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="p-4 bg-surface-container-low text-center">
                      <button className="text-label-caps text-primary font-bold hover:underline">VIEW ALL 14 ARRIVALS</button>
                    </div>
                  </div>
                </div>

                <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
                  <div className="bg-surface-container-lowest rounded-xl luxury-shadow border border-outline-variant/10 flex flex-col">
                    <div className="px-6 py-6 border-b border-outline-variant/10 flex justify-between items-center">
                      <h3 className="font-serif text-headline-sm text-on-surface">Security Logs</h3>
                      <Shield className="w-5 h-5 text-outline" />
                    </div>
                    <div className="p-6 flex flex-col gap-6 overflow-y-auto max-h-[500px]">
                      {MOCK_SECURITY_LOGS.map((log, idx) => (
                        <div key={log.id} className="flex gap-4 relative">
                          {idx < MOCK_SECURITY_LOGS.length - 1 && (
                            <div className="absolute left-[11px] top-8 bottom-[-24px] w-px bg-outline-variant/30" />
                          )}
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 ${
                            log.type === 'key_entry' ? 'bg-primary' :
                            log.type === 'service_pass' ? 'bg-secondary' :
                            log.type === 'access_granted' ? 'bg-primary' :
                            'bg-primary-container/30'
                          }`}>
                            <log.icon className="w-3 h-3 text-on-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="text-label-caps text-secondary mb-1">{log.timestamp} • LOG_{log.type.toUpperCase()}</p>
                            <p className="text-body-md text-on-surface">
                              <span className="font-bold">{log.title}:</span> {log.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-6 bg-surface-container-low border-t border-outline-variant/10">
                      <div className="flex items-center justify-between text-label-caps text-secondary">
                        <span>UPTIME: 99.98%</span>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-primary" />
                          SYSTEM SECURE
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="glass-card rounded-xl p-6 relative overflow-hidden h-40 flex items-center luxury-shadow">
                    <div className="relative z-10">
                      <p className="text-label-caps text-secondary uppercase">Local Atmosphere</p>
                      <h4 className="font-serif text-headline-md text-on-surface">Lagos, 31°C</h4>
                      <p className="text-body-md text-secondary">Partly Cloudy - High Humidity</p>
                    </div>
                    <Cloud className="absolute right-6 top-1/2 -translate-y-1/2 text-primary opacity-20 w-24 h-24" />
                  </div>
                </div>
              </div>

              <div className="mt-16">
                <div className="flex gap-2 border-b border-outline-variant/10 mb-6">
                  {[
                    { id: 'bookings' as const, label: 'Booking Requests', count: pendingBookings.length, icon: Clock },
                    { id: 'listings' as const, label: 'Residences', count: listings.length, icon: Home },
                    { id: 'analytics' as const, label: 'Analytics', icon: TrendingUp },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveSection(tab.id as AdminSection)}
                      className={`flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
                        activeSection === tab.id
                          ? 'text-primary border-primary'
                          : 'text-secondary hover:text-on-surface border-transparent'
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                      {tab.count !== undefined && tab.count > 0 && (
                        <span className="px-1.5 py-0.5 bg-primary/10 text-primary rounded-full text-[9px]">{tab.count}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {(activeSection === 'bookings' || activeSection === 'requests') && (
            <motion.div
              key="bookings"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="px-6 lg:px-20 pt-8 lg:pt-12"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                <div>
                  <h2 className="font-serif text-headline-lg text-on-surface">Booking Requests</h2>
                  <p className="text-body-lg text-secondary mt-2">Manage and confirm guest reservations</p>
                </div>
              </div>

              {pendingBookings.length > 0 && (
                <div className="bg-primary-container/10 border border-primary/20 rounded-2xl p-4 flex items-center gap-3 mb-6">
                  <AlertCircle className="w-5 h-5 text-primary shrink-0" />
                  <p className="text-sm text-on-surface">
                    <strong>{pendingBookings.length}</strong> booking{pendingBookings.length !== 1 ? 's' : ''} awaiting your confirmation
                  </p>
                </div>
              )}

              <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-3xl overflow-hidden luxury-shadow">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-label-caps text-secondary bg-surface-container-low border-b border-outline-variant/10">
                        <th className="px-6 py-4 font-bold">Guest</th>
                        <th className="px-6 py-4 font-bold">Property</th>
                        <th className="px-6 py-4 font-bold">Dates</th>
                        <th className="px-6 py-4 font-bold">Amount</th>
                        <th className="px-6 py-4 font-bold">Status</th>
                        <th className="px-6 py-4 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-outline-variant/10">
                      {(bookings as any[]).slice(0, 20).map((booking: any) => (
                        <tr key={booking.id} className="hover:bg-surface-container-low/50 transition-colors">
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-bold text-on-surface">{booking.guestName}</p>
                              <p className="text-[10px] text-secondary">{booking.guestEmail}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-on-surface-variant">{booking.listingTitle}</td>
                          <td className="px-6 py-4">
                            <div className="text-xs">
                              <p className="text-on-surface-variant">{booking.checkIn}</p>
                              <p className="text-secondary text-[10px]">to {booking.checkOut}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-bold text-primary">₦{(booking.totalAmount || 0).toLocaleString()}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
                              booking.status === 'confirmed' || booking.status === 'Confirmed'
                                ? 'bg-green-100 text-green-700'
                                : booking.status === 'cancelled' || booking.status === 'Cancelled'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              {(booking.status === 'pending' || booking.status === 'Pending') && (
                                <>
                                  <button
                                    onClick={() => { setSelectedBooking(booking); setShowConfirmModal(true); }}
                                    className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => { setSelectedBooking(booking); setShowRejectModal(true); }}
                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleWhatsAppNotify(booking)}
                                    className="p-1.5 text-[#25D366] hover:bg-green-50 rounded-lg transition-colors"
                                  >
                                    <MessageCircle className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                              <button className="p-1.5 text-secondary hover:bg-surface-container rounded-lg transition-colors">
                                <Eye className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {(bookings as any[]).length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-secondary italic text-sm">
                            No booking requests yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'listings' && (
            <motion.div
              key="listings"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="px-6 lg:px-20 pt-8 lg:pt-12"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                <div>
                  <h2 className="font-serif text-headline-lg text-on-surface">Residence Management</h2>
                  <p className="text-body-lg text-secondary mt-2">Manage all property listings</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1 md:w-72">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
                    <input
                      type="text"
                      placeholder="Search listings..."
                      className="w-full pl-9 pr-4 py-2 bg-surface-container-low border-none rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex bg-surface-container-low rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-primary text-on-primary shadow-sm' : 'text-secondary hover:text-primary'}`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('map')}
                      className={`p-1.5 rounded-lg transition-all ${viewMode === 'map' ? 'bg-primary text-on-primary shadow-sm' : 'text-secondary hover:text-primary'}`}
                    >
                      <MapIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-3xl overflow-hidden luxury-shadow">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-label-caps text-secondary bg-surface-container-low border-b border-outline-variant/10">
                        <th className="px-6 py-4 font-bold">Residence</th>
                        <th className="px-6 py-4 font-bold">Location</th>
                        <th className="px-6 py-4 font-bold">Category</th>
                        <th className="px-6 py-4 font-bold">Status</th>
                        <th className="px-6 py-4 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-outline-variant/10">
                      {filteredListings.map((listing) => (
                        <tr key={listing.id} className="hover:bg-surface-container-low/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img src={listing.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                              <div>
                                <p className="font-bold text-on-surface">{listing.title}</p>
                                <p className="text-[10px] text-secondary">₦{listing.nightlyRate.toLocaleString()} / Night</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-on-surface-variant">{listing.location}</td>
                          <td className="px-6 py-4 text-on-surface-variant">{listing.category}</td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => onToggleStatus(listing.id)}
                              className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full transition-colors ${
                                listing.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {listing.isActive ? 'Active' : 'Inactive'}
                            </button>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button className="p-1.5 text-secondary hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"><Edit3 className="w-4 h-4" /></button>
                              <button className="p-1.5 text-secondary hover:text-error hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                              <button className="p-1.5 text-secondary hover:bg-surface-container rounded-lg transition-colors"><MoreVertical className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredListings.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-secondary italic text-sm">
                            No residences found matching your search.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="px-6 lg:px-20 pt-8 lg:pt-12"
            >
              <div className="mb-8">
                <h2 className="font-serif text-headline-lg text-on-surface">Platform Analytics</h2>
                <p className="text-body-lg text-secondary mt-2">Revenue and performance insights</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/10 luxury-shadow">
                  <TrendingUp className="w-6 h-6 text-green-600 mb-4" />
                  <p className="text-label-caps text-secondary uppercase">Monthly Revenue</p>
                  <p className="text-headline-md font-serif font-bold text-on-surface mt-1">₦{(totalRevenue / 1000000).toFixed(1)}M</p>
                  <p className="text-xs text-green-600 mt-1">+12% from last month</p>
                </div>
                <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/10 luxury-shadow">
                  <Calendar className="w-6 h-6 text-primary mb-4" />
                  <p className="text-label-caps text-secondary uppercase">Bookings This Month</p>
                  <p className="text-headline-md font-serif font-bold text-on-surface mt-1">{confirmedBookings.length}</p>
                  <p className="text-xs text-secondary mt-1">{pendingBookings.length} pending</p>
                </div>
                <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/10 luxury-shadow">
                  <Users className="w-6 h-6 text-blue-600 mb-4" />
                  <p className="text-label-caps text-secondary uppercase">Active Guests</p>
                  <p className="text-headline-md font-serif font-bold text-on-surface mt-1">48</p>
                  <p className="text-xs text-blue-600 mt-1">+8 new this week</p>
                </div>
              </div>
            </motion.div>
          )}

          {(activeSection === 'guests' || activeSection === 'services' || activeSection === 'reports') && (
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="px-6 lg:px-20 pt-8 lg:pt-12"
            >
              <div className="mb-8">
                <h2 className="font-serif text-headline-lg text-on-surface capitalize">{activeSection}</h2>
                <p className="text-body-lg text-secondary mt-2">
                  {activeSection === 'guests' && 'Manage guest profiles and preferences'}
                  {activeSection === 'services' && 'Oversee concierge services and assignments'}
                  {activeSection === 'reports' && 'Generate and download operational reports'}
                </p>
              </div>
              <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-3xl p-12 luxury-shadow flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-serif text-headline-sm text-on-surface mb-2 capitalize">{activeSection} Module</h3>
                <p className="text-body-md text-secondary max-w-md">
                  This section is being enhanced with advanced features. Check back soon for a comprehensive {activeSection} management experience.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {showConfirmModal && selectedBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-parchment rounded-2xl p-6 max-w-md w-full shadow-2xl"
            >
              <h3 className="font-serif text-xl font-bold text-charcoal mb-4">Confirm Booking</h3>
              <div className="bg-white rounded-xl p-4 mb-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-charcoal/60">Guest</span>
                  <span className="font-bold">{selectedBooking.guestName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal/60">Property</span>
                  <span className="font-bold">{selectedBooking.listingTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal/60">Amount</span>
                  <span className="font-bold text-primary">₦{selectedBooking.totalAmount.toLocaleString()}</span>
                </div>
              </div>
              <textarea
                placeholder="Add confirmation notes (optional)..."
                value={confirmNotes}
                onChange={(e) => setConfirmNotes(e.target.value)}
                className="w-full p-3 bg-white border border-charcoal/10 rounded-xl text-sm mb-4 focus:outline-none focus:ring-1 focus:ring-primary"
                rows={3}
              />
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowConfirmModal(false); setConfirmNotes(''); }}
                  className="flex-1 py-3 text-charcoal/60 font-bold text-xs uppercase tracking-widest hover:text-charcoal transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleConfirmBooking(selectedBooking)}
                  className="flex-[2] py-3 bg-green-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-green-700 transition-all"
                >
                  Confirm Booking
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showRejectModal && selectedBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-parchment rounded-2xl p-6 max-w-md w-full shadow-2xl"
            >
              <h3 className="font-serif text-xl font-bold text-charcoal mb-4">Reject Booking</h3>
              <div className="bg-white rounded-xl p-4 mb-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-charcoal/60">Guest</span>
                  <span className="font-bold">{selectedBooking.guestName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal/60">Property</span>
                  <span className="font-bold">{selectedBooking.listingTitle}</span>
                </div>
              </div>
              <textarea
                placeholder="Reason for rejection (required)..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full p-3 bg-white border border-charcoal/10 rounded-xl text-sm mb-4 focus:outline-none focus:ring-1 focus:ring-primary"
                rows={3}
                required
              />
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowRejectModal(false); setRejectReason(''); }}
                  className="flex-1 py-3 text-charcoal/60 font-bold text-xs uppercase tracking-widest hover:text-charcoal transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleRejectBooking(selectedBooking)}
                  disabled={!rejectReason.trim()}
                  className="flex-[2] py-3 bg-red-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-red-700 transition-all disabled:opacity-50"
                >
                  Reject Booking
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
