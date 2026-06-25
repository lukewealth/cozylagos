import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users, Home, Calendar, ShieldAlert, Settings, Search, MoreVertical,
  CheckCircle, XCircle, Map as MapIcon, List, Eye, Edit3, Trash2, Power,
  Clock, AlertCircle, DollarSign, TrendingUp, Bell, Filter, ChevronDown,
  MessageCircle, Phone, Mail, RefreshCw, Plane, Lock, Timer, Shield,
  Key, Car, Sparkles, Activity, Download, Radio, Cloud, Moon, Sun,
  LayoutDashboard, ClipboardList, UserCheck, ConciergeBell, BarChart3,
  ChevronRight, Plus, ArrowUpRight, Wifi, Zap, UserCircle, Menu, X, WifiOff
} from 'lucide-react';
import { Listing } from '../types';
import { useDatabase } from '../hooks/useDatabase';
import { useBackendHealth } from '../hooks/useBackendHealth';
import { useAuth } from '../auth';
import api from '../services/api';
import CollapsibleSidebar from '../components/ui/CollapsibleSidebar';
import Tooltip from '../components/ui/Tooltip';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import EditModal, { EditField } from '../components/ui/EditModal';
import StaffAssignModal from '../components/ui/StaffAssignModal';
import { ToastContainer, showToast } from '../components/ui/Toast';

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

type AdminSection = 'dashboard' | 'admin-dashboard' | 'requests' | 'guests' | 'services' | 'reports' | 'listings' | 'bookings' | 'analytics' | 'overview' | 'ledger';

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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDeleteListingConfirm, setShowDeleteListingConfirm] = useState(false);
  const [showEditListingModal, setShowEditListingModal] = useState(false);
  const [showAssignStaffModal, setShowAssignStaffModal] = useState(false);
  const [selectedListingForAction, setSelectedListingForAction] = useState<Listing | null>(null);
  const [selectedBookingForAssign, setSelectedBookingForAssign] = useState<any>(null);

  const backendHealth = useBackendHealth();

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
    setIsProcessing(true);
    try { await api.bookings.confirm(booking.id); } catch { /* local fallback */ }
    updateBooking({ ...booking, status: 'confirmed', updatedAt: new Date().toISOString() } as any);
    showToast({ type: 'success', title: 'Booking Confirmed', message: `${booking.guestName}'s reservation has been confirmed` });
    setShowConfirmModal(false);
    setConfirmNotes('');
    setSelectedBooking(null);
    setIsProcessing(false);
  };

  const handleRejectBooking = async (booking: BookingRequest) => {
    setIsProcessing(true);
    try { await api.bookings.updateStatus(booking.id, 'cancelled'); } catch { /* local fallback */ }
    updateBooking({ ...booking, status: 'cancelled', updatedAt: new Date().toISOString() } as any);
    showToast({ type: 'warning', title: 'Booking Rejected', message: `${booking.guestName}'s reservation has been declined` });
    setShowRejectModal(false);
    setRejectReason('');
    setSelectedBooking(null);
    setIsProcessing(false);
  };

  const handleWhatsAppNotify = (booking: BookingRequest) => {
    const message = `Hi ${booking.guestName}, your booking for ${booking.listingTitle} (${booking.checkIn} to ${booking.checkOut}) has been confirmed! Total: ₦${booking.totalAmount.toLocaleString()}. Welcome to Cozy Lagos!`;
    window.open(`https://wa.me/2348064305782?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleDeleteListing = async () => {
    if (!selectedListingForAction) return;
    try {
      await api.listings.delete(selectedListingForAction.id).catch(() => {});
    } catch {}
    onDeleteListing(selectedListingForAction.id);
    showToast({ type: 'success', title: 'Listing Deleted', message: `${selectedListingForAction.title} has been removed` });
    setShowDeleteListingConfirm(false);
    setSelectedListingForAction(null);
  };

  const handleEditListing = async (data: any) => {
    if (!selectedListingForAction) return;
    const updated = { ...selectedListingForAction, ...data, updatedAt: new Date().toISOString() };
    try {
      await api.listings.update(updated).catch(() => {});
    } catch {}
    onToggleStatus(selectedListingForAction.id);
    showToast({ type: 'success', title: 'Listing Updated', message: `${updated.title} has been saved` });
    setShowEditListingModal(false);
    setSelectedListingForAction(null);
  };

  const handleAssignStaffToBooking = async (staffId: string) => {
    if (!selectedBookingForAssign) return;
    try {
      await api.staff.patch({ id: staffId, currentAssignment: selectedBookingForAssign.listingTitle }).catch(() => {});
      await api.bookings.updateStatus(selectedBookingForAssign.id, 'confirmed').catch(() => {});
    } catch {}
    updateBooking({ ...selectedBookingForAssign, status: 'confirmed', providerAssignmentStatus: 'assigned', updatedAt: new Date().toISOString() } as any);
    showToast({ type: 'success', title: 'Staff Assigned & Booking Confirmed', message: `Booking for ${selectedBookingForAssign.guestName} confirmed` });
    setShowAssignStaffModal(false);
    setSelectedBookingForAssign(null);
  };

  const listingEditFields: EditField[] = [
    { name: 'title', label: 'Property Title', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'nightlyRate', label: 'Nightly Rate (₦)', type: 'number', min: 0 },
    { name: 'category', label: 'Category', type: 'select', options: [
      { value: 'Penthouse', label: 'Penthouse' },
      { value: 'Luxury Villa', label: 'Luxury Villa' },
      { value: 'Executive Studio', label: 'Executive Studio' },
      { value: 'Serviced Apartment', label: 'Serviced Apartment' },
    ]},
    { name: 'location', label: 'Location', type: 'select', options: [
      { value: 'Ikoyi', label: 'Ikoyi' },
      { value: 'Victoria Island', label: 'Victoria Island' },
      { value: 'Banana Island', label: 'Banana Island' },
      { value: 'Lekki Phase 1', label: 'Lekki Phase 1' },
    ]},
    { name: 'isActive', label: 'Active Listing', type: 'toggle' },
  ];

  const MOCK_ADMIN_STAFF = [
    { id: 's1', name: 'Captain Chidi Okoro', role: 'driver', status: 'on_duty', initials: 'CO', certifications: ['MCA MASTER 3000GT'], specializations: ['Maritime', 'VIP Transport'], rating: 4.8, availabilityFrom: '22:00', currentAssignment: 'Yacht Leila', tenureYears: 6 },
    { id: 's2', name: 'Chef Tunde Balogun', role: 'chef', status: 'available', initials: 'TB', certifications: ['Culinary Arts'], specializations: ['Afro-Fusion'], rating: 4.9, availabilityFrom: 'Now', currentAssignment: undefined, tenureYears: 8 },
    { id: 's3', name: 'Amara Nwosu', role: 'concierge', status: 'available', initials: 'AN', certifications: ['Hospitality Mgmt'], specializations: ['Multilingual'], rating: 4.7, availabilityFrom: 'Now', currentAssignment: undefined, tenureYears: 8 },
    { id: 's4', name: 'Adebayo Security', role: 'security', status: 'on_duty', initials: 'AS', certifications: ['Armed Escort'], specializations: ['VIP Protection'], rating: 4.6, availabilityFrom: 'Now', currentAssignment: 'Banana Island Villa', tenureYears: 4 },
  ];

  const todayStr = currentTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="flex min-h-screen bg-parchment">
      <CollapsibleSidebar
        activeTab={activeSection}
        setActiveTab={setActiveSection as any}
        userRole="admin"
        onLogout={handleLogout}
        onCollapse={setIsSidebarCollapsed}
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />

      <main className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-[80px]' : 'lg:ml-[280px]'} ml-0 lg:ml-[80px]`}>
        <header className="h-20 px-4 lg:px-20 w-full sticky top-0 bg-surface/80 backdrop-blur-md border-b border-outline-variant/10 z-40 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Tooltip content="Open Menu" position="right">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 rounded-lg hover:bg-surface-container text-secondary transition-colors lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </button>
            </Tooltip>
            <div className="relative focus-within:ring-1 focus-within:ring-primary rounded-lg transition-all">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
              <input
                className="bg-surface-container-low border-none rounded-lg pl-10 pr-4 py-2 w-48 md:w-72 text-body-md focus:ring-0 focus:outline-none"
                placeholder="Search arrivals..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-6">
            <div className="flex gap-2 md:gap-4 items-center">
              <Tooltip content={`Backend: ${backendHealth.status}`} description={backendHealth.message}>
                <div className={`hidden md:flex items-center gap-1.5 px-2 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                  backendHealth.status === 'connected' ? 'bg-green-100 text-green-700' :
                  backendHealth.status === 'fallback' ? 'bg-amber-100 text-amber-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {backendHealth.status === 'connected' ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                  {backendHealth.status === 'connected' ? 'Cloud' : backendHealth.status === 'fallback' ? 'Local' : 'Offline'}
                </div>
              </Tooltip>
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
            <div className="h-10 w-px bg-outline-variant/30 hidden md:block" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden md:block">
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
            {(activeSection === 'dashboard' || activeSection === 'admin-dashboard') && (
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
                                  <button
                                    onClick={() => { setSelectedListingForAction(listing); setShowEditListingModal(true); }}
                                    className="p-1.5 text-secondary hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </button>
                                </Tooltip>
                                <Tooltip content="Delete Listing" description="Remove property permanently">
                                  <button
                                    onClick={() => { setSelectedListingForAction(listing); setShowDeleteListingConfirm(true); }}
                                    className="p-1.5 text-secondary hover:text-error hover:bg-red-50 rounded-lg transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </Tooltip>
                                <Tooltip content="Assign Staff" description="Assign staff to this booking">
                                  <button
                                    onClick={() => { setSelectedBookingForAssign({ listingTitle: listing.title, guestName: 'Guest', id: listing.id }); setShowAssignStaffModal(true); }}
                                    className="p-1.5 text-secondary hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                  >
                                    <UserCheck className="w-4 h-4" />
                                  </button>
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

            {activeSection === 'bookings' && (
              <motion.div
                key="bookings"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
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
                                    <Tooltip content="Confirm Booking" description="Approve this reservation">
                                      <button
                                        onClick={() => { setSelectedBooking(booking); setShowConfirmModal(true); }}
                                        className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                      >
                                        <CheckCircle className="w-4 h-4" />
                                      </button>
                                    </Tooltip>
                                    <Tooltip content="Reject Booking" description="Decline this reservation">
                                      <button
                                        onClick={() => { setSelectedBooking(booking); setShowRejectModal(true); }}
                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                      >
                                        <XCircle className="w-4 h-4" />
                                      </button>
                                    </Tooltip>
                                    <Tooltip content="WhatsApp Guest" description="Send confirmation via WhatsApp">
                                      <button
                                        onClick={() => handleWhatsAppNotify(booking)}
                                        className="p-1.5 text-[#25D366] hover:bg-green-50 rounded-lg transition-colors"
                                      >
                                        <MessageCircle className="w-4 h-4" />
                                      </button>
                                    </Tooltip>
                                  </>
                                )}
                                <Tooltip content="View Details" description="See full booking info">
                                  <button className="p-1.5 text-secondary hover:bg-surface-container rounded-lg transition-colors">
                                    <Eye className="w-4 h-4" />
                                  </button>
                                </Tooltip>
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

            {(activeSection === 'analytics' || activeSection === 'overview') && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
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

            {activeSection === 'ledger' && (
              <motion.div
                key="ledger"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <h2 className="font-serif text-headline-lg text-on-surface">Payment Ledger</h2>
                    <p className="text-body-lg text-secondary mt-2">Complete transaction history with billing metadata</p>
                  </div>
                  <Tooltip content="Download Ledger" description="Export as CSV">
                    <button className="px-5 py-2.5 bg-surface-container-lowest border border-outline-variant/30 rounded-lg text-body-md font-semibold text-on-surface hover:bg-surface-container-low transition-colors flex items-center gap-2">
                      <Download className="w-4 h-4" /> Export CSV
                    </button>
                  </Tooltip>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  {[
                    { label: 'Total Revenue', value: `₦${(totalRevenue / 1000000).toFixed(1)}M`, icon: DollarSign, color: 'text-green-600' },
                    { label: 'Pending Payments', value: pendingBookings.length.toString(), icon: Clock, color: 'text-amber-600' },
                    { label: 'Platform Cut (15%)', value: `₦${(totalRevenue * 0.15 / 1000).toFixed(0)}K`, icon: TrendingUp, color: 'text-primary' },
                    { label: 'Provider Cut (85%)', value: `₦${(totalRevenue * 0.85 / 1000).toFixed(0)}K`, icon: Users, color: 'text-primary' },
                  ].map((stat, i) => (
                    <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                      className="glass-card luxury-shadow p-6 rounded-xl border-l-4 border-primary">
                      <p className="text-label-caps text-secondary uppercase mb-2">{stat.label}</p>
                      <span className={`font-serif text-headline-md ${stat.color}`}>{stat.value}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-3xl overflow-hidden luxury-shadow">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="text-label-caps text-secondary bg-surface-container-low border-b border-outline-variant/10">
                          <th className="px-6 py-4 font-bold">Ref</th>
                          <th className="px-6 py-4 font-bold">Guest</th>
                          <th className="px-6 py-4 font-bold">Property</th>
                          <th className="px-6 py-4 font-bold">Services</th>
                          <th className="px-6 py-4 font-bold">Total</th>
                          <th className="px-6 py-4 font-bold">Platform</th>
                          <th className="px-6 py-4 font-bold">Provider</th>
                          <th className="px-6 py-4 font-bold">Status</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm divide-y divide-outline-variant/10">
                        {(bookings as any[]).slice(0, 20).map((booking: any) => {
                          const ledger = booking.paymentLedger;
                          const total = booking.totalAmount || 0;
                          const platformCut = Math.round(total * 0.15);
                          const providerCut = total - platformCut;
                          return (
                            <tr key={booking.id} className="hover:bg-surface-container-low/50 transition-colors">
                              <td className="px-6 py-4">
                                <span className="font-mono text-[10px] text-secondary">{ledger?.reference || booking.id?.slice(0, 12)}</span>
                              </td>
                              <td className="px-6 py-4">
                                <div>
                                  <p className="font-bold text-on-surface text-xs">{booking.guestName}</p>
                                  <p className="text-[10px] text-secondary">{booking.guestEmail}</p>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-on-surface-variant text-xs">{booking.listingTitle}</td>
                              <td className="px-6 py-4">
                                <div className="flex flex-wrap gap-1">
                                  {(booking.services || []).slice(0, 2).map((s: string, i: number) => (
                                    <span key={i} className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-[8px] font-bold">{s}</span>
                                  ))}
                                  {(!booking.services || booking.services.length === 0) && <span className="text-[10px] text-secondary">—</span>}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="font-bold text-primary text-xs">₦{total.toLocaleString()}</span>
                              </td>
                              <td className="px-6 py-4 text-xs text-on-surface-variant">₦{platformCut.toLocaleString()}</td>
                              <td className="px-6 py-4 text-xs text-green-600 font-semibold">₦{providerCut.toLocaleString()}</td>
                              <td className="px-6 py-4">
                                <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
                                  booking.status === 'confirmed' || booking.status === 'Confirmed'
                                    ? 'bg-green-100 text-green-700'
                                    : booking.status === 'cancelled' || booking.status === 'Cancelled'
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-amber-100 text-amber-700'
                                }`}>
                                  {ledger?.paymentStatus || booking.status}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                        {(bookings as any[]).length === 0 && (
                          <tr>
                            <td colSpan={8} className="px-6 py-12 text-center text-secondary italic text-sm">
                              No transactions recorded yet.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
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
        </div>
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
                disabled={isProcessing}
              />
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowConfirmModal(false); setConfirmNotes(''); }}
                  disabled={isProcessing}
                  className="flex-1 py-3 text-charcoal/60 font-bold text-xs uppercase tracking-widest hover:text-charcoal transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleConfirmBooking(selectedBooking)}
                  disabled={isProcessing}
                  className="flex-[2] py-3 bg-green-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-green-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Confirm Booking'
                  )}
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
                className="w-full p-3 bg-white border border-charcoal/10 rounded-xl text-sm mb-4 focus:outline-none focus:ring-1 focus:ring-error"
                rows={3}
                disabled={isProcessing}
              />
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowRejectModal(false); setRejectReason(''); }}
                  disabled={isProcessing}
                  className="flex-1 py-3 text-charcoal/60 font-bold text-xs uppercase tracking-widest hover:text-charcoal transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleRejectBooking(selectedBooking)}
                  disabled={isProcessing || !rejectReason.trim()}
                  className="flex-[2] py-3 bg-red-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-red-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Reject Booking'
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmDialog
        isOpen={showDeleteListingConfirm}
        onClose={() => { setShowDeleteListingConfirm(false); setSelectedListingForAction(null); }}
        onConfirm={handleDeleteListing}
        title="Delete Listing"
        message={`Are you sure you want to permanently delete "${selectedListingForAction?.title}"? This action cannot be undone and will remove all associated data.`}
        confirmLabel="Delete Listing"
        variant="danger"
      />

      <EditModal
        isOpen={showEditListingModal}
        onClose={() => { setShowEditListingModal(false); setSelectedListingForAction(null); }}
        onSave={handleEditListing}
        title="Edit Listing"
        fields={listingEditFields}
        initialData={selectedListingForAction ? {
          title: selectedListingForAction.title || '',
          description: selectedListingForAction.description || '',
          nightlyRate: selectedListingForAction.nightlyRate || 0,
          category: selectedListingForAction.category || 'Penthouse',
          location: selectedListingForAction.location || 'Ikoyi',
          isActive: selectedListingForAction.isActive ?? true,
        } : {}}
      />

      <StaffAssignModal
        isOpen={showAssignStaffModal}
        onClose={() => { setShowAssignStaffModal(false); setSelectedBookingForAssign(null); }}
        onAssign={handleAssignStaffToBooking}
        staff={MOCK_ADMIN_STAFF}
        bookingInfo={selectedBookingForAssign ? {
          title: selectedBookingForAssign.listingTitle || 'Property',
          guestName: selectedBookingForAssign.guestName || 'Guest',
          date: selectedBookingForAssign.checkIn || 'TBD',
        } : undefined}
      />

      <ToastContainer />
    </div>
  );
}
