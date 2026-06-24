import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users, Home, Calendar, ShieldAlert, Settings, Search, MoreVertical,
  CheckCircle, XCircle, Map as MapIcon, List, Eye, Edit3, Trash2, Power,
  Clock, AlertCircle, DollarSign, TrendingUp, Bell, Filter, ChevronDown,
  MessageCircle, Phone, Mail, RefreshCw, Plane, Lock, Timer, Shield,
  Key, Car, Sparkles, Activity, Download, Radio, Cloud, Moon, Sun,
  LayoutDashboard, ClipboardList, UserCheck, ConciergeBell, BarChart3,
  ChevronRight, Plus, ArrowUpRight, Wifi, Zap, UserCircle, Menu, X
} from 'lucide-react';
import { Listing } from '../types';
import { useDatabase } from '../hooks/useDatabase';
import { useAuth } from '../auth';
import api from '../services/api';
import CollapsibleSidebar from '../components/ui/CollapsibleSidebar';
import Tooltip from '../components/ui/Tooltip';

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

const MOCK_ARRIVALS = [
  { id: 'arr-1', guestName: 'Adewale Johnson', initials: 'AJ', tier: 'vip' as const, listingTitle: 'The Ikoyi Penthouse', unitCode: 'UNIT 402', status: 'en_route' as const, eta: '8 mins away' },
  { id: 'arr-2', guestName: 'Sarah Oritse', initials: 'SO', tier: 'platinum' as const, listingTitle: 'Eko Atlantic Glasshouse', unitCode: 'VILLA A-1', status: 'checked_in' as const },
  { id: 'arr-3', guestName: 'Marcus Chen', initials: 'MC', tier: 'new' as const, listingTitle: 'Victoria Island Loft', unitCode: 'STUDIO 12', status: 'awaiting_concierge' as const },
];

const MOCK_SECURITY_LOGS = [
  { id: 'log-1', timestamp: '14:20', type: 'key_entry' as const, title: 'Penthouse 402', description: 'Primary Key Entry detected for Adewale Johnson', icon: Key },
  { id: 'log-2', timestamp: '14:15', type: 'service_pass' as const, title: 'Eko Glasshouse', description: 'Valet Access Granted. Plate: LAG-992-VIP', icon: Car },
];

export default function AdminDashboard({ listings, onToggleStatus, onDeleteListing }: AdminDashboardProps) {
  const { currentUser, logout } = useAuth();
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

  const handleLogout = () => {
    logout();
  };

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

  const todayStr = currentTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="flex min-h-screen bg-parchment">
      <CollapsibleSidebar
        activeTab={activeSection}
        setActiveTab={setActiveSection as any}
        userRole="admin"
        onLogout={handleLogout}
      />

      <main className="flex-1 ml-[280px] transition-all duration-300">
        <header className="h-20 px-20 w-full sticky top-0 bg-surface/80 backdrop-blur-md border-b border-outline-variant/10 z-40 flex justify-between items-center">
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
              <Tooltip content="Notifications" description="View alerts and updates">
                <button className="p-2 rounded-full hover:bg-surface-container text-secondary transition-colors relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full" />
                </button>
              </Tooltip>
              <Tooltip content={isDarkMode ? "Light Mode" : "Dark Mode"}>
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="p-2 rounded-full hover:bg-surface-container text-secondary transition-colors"
                >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              </Tooltip>
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

        <div className="px-20 pt-12 pb-20">
          <AnimatePresence mode="wait">
            {activeSection === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
                  <div>
                    <h2 className="font-serif text-headline-lg text-on-surface">Arrival Operations Center</h2>
                    <p className="text-body-lg text-secondary mt-2">Monitoring guest check-ins for {todayStr}</p>
                  </div>
                  <div className="flex gap-3">
                    <Tooltip content="Download Report" description="Export data as CSV">
                      <button className="px-6 py-3 bg-surface-container-lowest border border-outline-variant/30 rounded-lg text-body-md font-semibold text-on-surface hover:bg-surface-container-low transition-colors flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Download Report
                      </button>
                    </Tooltip>
                    <Tooltip content="Broadcast Update" description="Send notification to all users">
                      <button className="px-6 py-3 bg-primary text-on-primary rounded-lg text-body-md font-bold luxury-shadow hover:opacity-90 transition-opacity flex items-center gap-2">
                        <Radio className="w-4 h-4" />
                        Broadcast Update
                      </button>
                    </Tooltip>
                  </div>
                </div>

                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                  {[
                    { label: 'Total Arrivals Today', value: '14', sub: '7 Checked-in, 7 Pending', icon: Plane, iconColor: 'text-primary' },
                    { label: 'VIP Clearances', value: '3', sub: 'Critical Priority', icon: Shield, iconColor: 'text-error', valueColor: 'text-error' },
                    { label: 'Smart Access Status', value: 'Online', sub: 'Secure / End-to-End', icon: Lock, iconColor: 'text-primary-container' },
                    { label: 'Avg. Turnaround Time', value: '12 mins', sub: '+2% from yesterday', icon: Timer, iconColor: 'text-outline' },
                  ].map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="glass-card luxury-shadow p-6 rounded-xl border-l-4 border-primary"
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
                                    <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center font-bold">
                                      {arrival.initials}
                                    </div>
                                    <div>
                                      <p className="text-body-md font-bold text-on-surface">{arrival.guestName}</p>
                                      <p className="text-label-caps text-secondary text-[9px]">{arrival.tier.toUpperCase()}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-8 py-6">
                                  <p className="text-body-md text-on-surface">{arrival.listingTitle}</p>
                                  <p className="text-label-caps text-secondary">{arrival.unitCode}</p>
                                </td>
                                <td className="px-8 py-6">
                                  <div className="flex items-center gap-2 text-primary font-semibold">
                                    <span className="relative flex h-2 w-2">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                                    </span>
                                    {arrival.status === 'en_route' ? `En Route (${arrival.eta})` : arrival.status}
                                  </div>
                                </td>
                                <td className="px-8 py-6">
                                  <Tooltip content="Verify Access" description="Confirm guest identity">
                                    <button className="px-4 py-2 border border-primary text-primary rounded-lg text-label-caps font-bold hover:bg-primary hover:text-on-primary transition-all uppercase tracking-widest text-xs">
                                      Verify Access
                                    </button>
                                  </Tooltip>
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
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
                        {MOCK_SECURITY_LOGS.map((log) => (
                          <div key={log.id} className="flex gap-4 relative">
                            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0 z-10">
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
                    </div>
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
                                <Tooltip content="Edit Listing" description="Modify property details">
                                  <button className="p-1.5 text-secondary hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"><Edit3 className="w-4 h-4" /></button>
                                </Tooltip>
                                <Tooltip content="Delete Listing" description="Remove property permanently">
                                  <button className="p-1.5 text-secondary hover:text-error hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                                </Tooltip>
                                <Tooltip content="More Options" description="Additional actions">
                                  <button className="p-1.5 text-secondary hover:bg-surface-container rounded-lg transition-colors"><MoreVertical className="w-4 h-4" /></button>
                                </Tooltip>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
