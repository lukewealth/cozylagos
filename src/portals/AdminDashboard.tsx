import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users, Home, Calendar, ShieldAlert, Settings, Search, MoreVertical,
  CheckCircle, XCircle, Map as MapIcon, List, Eye, Edit3, Trash2, Power,
  Clock, AlertCircle, DollarSign, TrendingUp, Bell, Filter, ChevronDown,
  MessageCircle, Phone, Mail, RefreshCw, Plane, Lock, Timer, Shield,
  Key, Car, Sparkles, Activity, Download, Radio, Cloud, Moon, Sun,
  LayoutDashboard, ClipboardList, UserCheck, ConciergeBell, BarChart3,
  ChevronRight, Plus, ArrowUpRight, Wifi, Zap, UserCircle, Menu, X, WifiOff,
  FileText, Send, Utensils, Anchor
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
import AdminEventsView from '../components/AdminEventsView';
import AdminTaskManagement from '../components/AdminTaskManagement';
import StaffManagement from '../components/StaffManagement';
import NotificationManagement from '../components/NotificationManagement';
import TransactionDownload from '../components/TransactionDownload';
import AdminWithdrawalManagement from '../components/AdminWithdrawalManagement';
import UserManagement from '../components/UserManagement';
import PropertyManagement from '../components/PropertyManagement';
import AdminSupportManagement from '../components/AdminSupportManagement';
import CRMView from '../components/CRMView';
import HelpSupportModal from '../components/ui/HelpSupportModal';
import UniversalModal from '../components/ui/UniversalModal';
import DashboardErrorBoundary from '../components/ui/DashboardErrorBoundary';
import { AdminStatCard, AdminCard, AdminButton, AdminBadge, CloudSyncIndicator } from '../components/ui';
import { purgeDemoData, flushSystem, syncRealData, getSystemStats } from '../utils/databasePurge';

interface AdminDashboardProps {
  listings: Listing[];
  onToggleStatus: (id: string) => void;
  onDeleteListing: (id: string) => void;
  onLogout?: () => void;
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

type AdminSection = 'dashboard' | 'admin-dashboard' | 'requests' | 'guests' | 'services' | 'reports' | 'listings' | 'bookings' | 'events' | 'tasks' | 'crm' | 'staff' | 'notifications' | 'support' | 'transactions' | 'withdrawals' | 'users' | 'properties' | 'analytics' | 'overview' | 'ledger';

const MOCK_ARRIVALS = [
  { id: 'arr-1', guestName: 'Adewale Johnson', initials: 'AJ', tier: 'vip' as const, listingTitle: 'The Ikoyi Penthouse', unitCode: 'UNIT 402', status: 'en_route' as const, eta: '8 mins away' },
  { id: 'arr-2', guestName: 'Sarah Oritse', initials: 'SO', tier: 'platinum' as const, listingTitle: 'Eko Atlantic Glasshouse', unitCode: 'VILLA A-1', status: 'checked_in' as const },
  { id: 'arr-3', guestName: 'Marcus Chen', initials: 'MC', tier: 'new' as const, listingTitle: 'Victoria Island Loft', unitCode: 'STUDIO 12', status: 'awaiting_concierge' as const },
];

const MOCK_SECURITY_LOGS = [
  { id: 'log-1', timestamp: '14:20', type: 'key_entry' as const, title: 'Penthouse 402', description: 'Primary Key Entry detected for Adewale Johnson', icon: Key },
  { id: 'log-2', timestamp: '14:15', type: 'service_pass' as const, title: 'Eko Glasshouse', description: 'Valet Access Granted. Plate: LAG-992-VIP', icon: Car },
];

export default function AdminDashboard({ listings, onToggleStatus, onDeleteListing, onLogout }: AdminDashboardProps) {
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
  const [selectedListingForAction, setSelectedListingForAction] = useState<Listing | null>(null);
  const [showAssignStaffModal, setShowAssignStaffModal] = useState(false);
  const [selectedBookingForAssign, setSelectedBookingForAssign] = useState<any>(null);
  const [showCreateTaskFromBooking, setShowCreateTaskFromBooking] = useState(false);
  const [selectedBookingForTask, setSelectedBookingForTask] = useState<any>(null);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastTarget, setBroadcastTarget] = useState<'all' | 'role' | 'selected'>('all');
  const [broadcastRole, setBroadcastRole] = useState<string>('guest');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showVerifyAccessModal, setShowVerifyAccessModal] = useState(false);
  const [selectedArrival, setSelectedArrival] = useState<any>(null);
  const [showBookingDetailModal, setShowBookingDetailModal] = useState(false);
  const [selectedBookingDetail, setSelectedBookingDetail] = useState<any>(null);

  const backendHealth = useBackendHealth();

  const { data: bookings, addRecord: updateBooking } = useDatabase('bookings');
  const { data: allUsers } = useDatabase('users');

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

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const totalRevenue = confirmedBookings.reduce((sum: number, b: any) => sum + (b.totalAmount || 0), 0);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      logout();
    }
  };

  const handleSectionChange = (section: AdminSection) => {
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const handleBroadcastUpdate = async () => {
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) {
      showToast({ type: 'error', title: 'Error', message: 'Please fill in both title and message' });
      return;
    }

    setIsProcessing(true);
    try {
      let targetRole: string = 'all';
      let userIds: string[] = [];

      if (broadcastTarget === 'role') {
        targetRole = broadcastRole;
      } else if (broadcastTarget === 'selected') {
        userIds = selectedUsers;
        targetRole = 'selected';
      }

      const notification = {
        id: `notif-${Date.now()}`,
        title: broadcastTitle,
        message: broadcastMessage,
        type: 'broadcast',
        targetRole,
        userIds,
        read: false,
        sentBy: currentUser?.id || 'admin',
        sentAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };

      await api.crm.sendNotification(notification);
      
      const targetText = broadcastTarget === 'all' ? 'all users' : 
                         broadcastTarget === 'role' ? `all ${broadcastRole}s` : 
                         `${selectedUsers.length} selected user(s)`;
      
      showToast({ type: 'success', title: 'Broadcast Sent', message: `Notification sent to ${targetText}` });
      setShowBroadcastModal(false);
      setBroadcastTitle('');
      setBroadcastMessage('');
      setBroadcastTarget('all');
      setSelectedUsers([]);
    } catch (error) {
      showToast({ type: 'error', title: 'Error', message: 'Failed to send broadcast notification' });
    }
    setIsProcessing(false);
  };

  const handleVerifyAccess = async (arrival: any) => {
    setSelectedArrival(arrival);
    setShowVerifyAccessModal(true);
  };

  const handleConfirmAccess = async () => {
    if (!selectedArrival) return;

    setIsProcessing(true);
    try {
      // Update arrival status to checked_in
      const updatedArrivals = MOCK_ARRIVALS.map(arr => 
        arr.id === selectedArrival.id 
          ? { ...arr, status: 'checked_in' as const }
          : arr
      );
      
      // In a real app, this would update the database
      showToast({ 
        type: 'success', 
        title: 'Access Verified', 
        message: `${selectedArrival.guestName} has been checked in to ${selectedArrival.listingTitle}` 
      });
      
      setShowVerifyAccessModal(false);
      setSelectedArrival(null);
    } catch (error) {
      showToast({ type: 'error', title: 'Error', message: 'Failed to verify access' });
    }
    setIsProcessing(false);
  };

  const filteredArrivals = useMemo(() => {
    if (!searchQuery.trim()) return MOCK_ARRIVALS;
    
    const query = searchQuery.toLowerCase();
    return MOCK_ARRIVALS.filter(arrival => 
      arrival.guestName.toLowerCase().includes(query) ||
      arrival.listingTitle.toLowerCase().includes(query) ||
      arrival.unitCode.toLowerCase().includes(query) ||
      arrival.status.toLowerCase().includes(query) ||
      arrival.tier.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleDeleteBooking = async (booking: BookingRequest) => {
    setIsProcessing(true);
    try {
      await api.bookings.delete(booking.id);
      updateBooking({ ...booking, status: 'deleted', updatedAt: new Date().toISOString() } as any);
      showToast({ type: 'success', title: 'Booking Deleted', message: `Booking for ${booking.guestName} has been permanently removed` });
    } catch (error) {
      showToast({ type: 'error', title: 'Error', message: 'Failed to delete booking' });
    }
    setIsProcessing(false);
  };

  const handlePurgeDatabase = async () => {
    if (!confirm('Are you sure you want to purge all demo/test data from the database? This action cannot be undone.')) {
      return;
    }

    setIsProcessing(true);
    try {
      await purgeDemoData();
      showToast({ type: 'success', title: 'Database Purged', message: 'All demo/test data has been removed' });
    } catch (error) {
      showToast({ type: 'error', title: 'Error', message: 'Failed to purge database' });
    }
    setIsProcessing(false);
  };

  const handleFlushSystem = async () => {
    if (!confirm('Are you sure you want to flush the system cache? This will clear all cached data.')) {
      return;
    }

    setIsProcessing(true);
    try {
      await flushSystem();
      showToast({ type: 'success', title: 'System Flushed', message: 'System cache has been cleared' });
    } catch (error) {
      showToast({ type: 'error', title: 'Error', message: 'Failed to flush system' });
    }
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

  const handleCreateTaskFromBooking = async (taskData: any) => {
    if (!selectedBookingForTask) return;
    const newTask = {
      ...taskData,
      id: `task-${Date.now()}`,
      bookingId: selectedBookingForTask.id,
      listingId: selectedBookingForTask.listingId,
      listingTitle: selectedBookingForTask.listingTitle,
      guestName: selectedBookingForTask.guestName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    try {
      const { dbPut } = await import('../db');
      await dbPut('tasks', newTask);
      showToast({ type: 'success', title: 'Task Created', message: `Task assigned to ${taskData.assignedToName}` });
      setShowCreateTaskFromBooking(false);
      setSelectedBookingForTask(null);
    } catch (error) {
      showToast({ type: 'error', title: 'Error', message: 'Failed to create task' });
    }
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
    <DashboardErrorBoundary>
    <div className={`flex min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-parchment'}`}>
      <CollapsibleSidebar
        activeTab={activeSection}
        setActiveTab={handleSectionChange as any}
        userRole="admin"
        onLogout={handleLogout}
        onHelp={() => setShowHelpModal(true)}
        onCollapse={setIsSidebarCollapsed}
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />

      <main className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-[80px]' : 'lg:ml-[280px]'} ml-0 lg:ml-[80px]`}>
        <header className={`h-20 px-4 lg:px-20 w-full sticky top-0 ${isDarkMode ? 'bg-gray-800/80' : 'bg-surface/80'} backdrop-blur-md border-b ${isDarkMode ? 'border-gray-700' : 'border-outline-variant/10'} z-40 flex justify-between items-center`}>
          <div className="flex items-center gap-4">
            <Tooltip content="Open Menu" position="right">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 rounded-lg hover:bg-surface-container text-secondary transition-colors lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </button>
            </Tooltip>
            <motion.div 
              className="relative rounded-lg transition-all focus-within:ring-2 focus-within:ring-primary/40"
              whileFocus={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4 transition-colors group-focus-within:text-primary" />
              <input
                className="bg-surface-container-low border-none rounded-lg pl-10 pr-4 py-2 w-36 sm:w-48 md:w-72 text-body-md focus:ring-0 focus:outline-none transition-all"
                placeholder="Search..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </motion.div>
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
              <CloudSyncIndicator />
              <Tooltip content="Notifications" description="View alerts and updates">
                <motion.button 
                  className="p-2 rounded-full hover:bg-surface-container text-secondary transition-colors relative"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95, rotate: 15 }}
                >
                  <Bell className="w-5 h-5" />
                  <motion.span 
                    className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.button>
              </Tooltip>
              <Tooltip content={isDarkMode ? "Light Mode" : "Dark Mode"}>
                <motion.button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="p-2 rounded-full hover:bg-surface-container text-secondary transition-colors"
                  whileHover={{ scale: 1.1, rotate: 180 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={isDarkMode ? 'sun' : 'moon'}
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </motion.div>
                  </AnimatePresence>
                </motion.button>
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

        <div className="px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-8 sm:pb-12">
          <AnimatePresence mode="wait">
            {(activeSection === 'dashboard' || activeSection === 'admin-dashboard') && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
                  <div>
                    <h2 className="font-serif text-base sm:text-lg md:text-xl text-on-surface">Arrival Operations Center</h2>
                    <p className="text-sm sm:text-body-lg text-secondary mt-2">Monitoring guest check-ins for {todayStr}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Tooltip content="Download Report" description="Export data as CSV">
                      <button className="px-3 sm:px-6 py-2 sm:py-3 bg-surface-container-lowest border border-outline-variant/30 rounded-lg text-[10px] sm:text-body-md font-semibold text-on-surface hover:bg-surface-container-low transition-colors flex items-center gap-1.5 sm:gap-2">
                        <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Download Report</span>
                        <span className="sm:hidden">Export</span>
                      </button>
                    </Tooltip>
                    <Tooltip content="Broadcast Update" description="Send notification to all users">
                      <button 
                        onClick={() => setShowBroadcastModal(true)}
                        className="px-3 sm:px-6 py-2 sm:py-3 bg-primary text-on-primary rounded-lg text-[10px] sm:text-body-md font-bold luxury-shadow hover:opacity-90 transition-opacity flex items-center gap-1.5 sm:gap-2"
                      >
                        <Radio className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Broadcast</span>
                        <span className="sm:hidden">Alert</span>
                      </button>
                    </Tooltip>
                    <Tooltip content="Purge Database" description="Remove all demo/test data">
                      <button 
                        onClick={handlePurgeDatabase}
                        disabled={isProcessing}
                        className="px-3 sm:px-6 py-2 sm:py-3 bg-red-600 text-white rounded-lg text-[10px] sm:text-body-md font-bold hover:bg-red-700 transition-colors flex items-center gap-1.5 sm:gap-2 disabled:opacity-50"
                      >
                        <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Purge DB</span>
                        <span className="sm:hidden">Purge</span>
                      </button>
                    </Tooltip>
                    <Tooltip content="Flush System" description="Clear system cache">
                      <button 
                        onClick={handleFlushSystem}
                        disabled={isProcessing}
                        className="px-3 sm:px-6 py-2 sm:py-3 bg-orange-600 text-white rounded-lg text-[10px] sm:text-body-md font-bold hover:bg-orange-700 transition-colors flex items-center gap-1.5 sm:gap-2 disabled:opacity-50"
                      >
                        <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Flush</span>
                        <span className="sm:hidden">Clear</span>
                      </button>
                    </Tooltip>
                  </div>
                </div>

                <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
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
                          <span className={`font-serif text-xl ${stat.valueColor || 'text-on-surface'}`}>{stat.value}</span>
                          <p className="text-body-md text-secondary mt-1">{stat.sub}</p>
                        </div>
                        <stat.icon className={`${stat.iconColor} mb-1 w-6 h-6`} />
                      </div>
                    </motion.div>
                  ))}
                </section>

                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12 lg:col-span-8">
                    <div className="bg-surface-container-lowest rounded-xl luxury-shadow overflow-hidden border border-outline-variant/10">
                      <div className="px-3 py-3 sm:px-4 sm:py-4 lg:px-8 lg:py-6 border-b border-outline-variant/10 flex justify-between items-center">
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
                            {filteredArrivals.map((arrival) => (
                              <motion.tr
                                key={arrival.id}
                                whileHover={{ backgroundColor: 'rgba(244, 243, 242, 0.5)' }}
                                className="transition-colors group"
                              >
                                <td className="px-3 py-3 sm:px-4 sm:py-4 lg:px-8 lg:py-6">
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
                                <td className="px-3 py-3 sm:px-4 sm:py-4 lg:px-8 lg:py-6">
                                  <p className="text-body-md text-on-surface">{arrival.listingTitle}</p>
                                  <p className="text-label-caps text-secondary">{arrival.unitCode}</p>
                                </td>
                                <td className="px-3 py-3 sm:px-4 sm:py-4 lg:px-8 lg:py-6">
                                  <div className="flex items-center gap-2 text-primary font-semibold">
                                    <span className="relative flex h-2 w-2">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                                    </span>
                                    {arrival.status === 'en_route' ? `En Route (${arrival.eta})` : arrival.status}
                                  </div>
                                </td>
                                <td className="px-3 py-3 sm:px-4 sm:py-4 lg:px-8 lg:py-6">
                                  <Tooltip content="Verify Access" description="Confirm guest identity">
                                    <button 
                                      onClick={() => handleVerifyAccess(arrival)}
                                      className="px-4 py-2 border border-primary text-primary rounded-lg text-label-caps font-bold hover:bg-primary hover:text-on-primary transition-all uppercase tracking-widest text-xs"
                                    >
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

                  <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
                    <div className="bg-surface-container-lowest rounded-xl luxury-shadow border border-outline-variant/10 flex flex-col">
                      <div className="px-6 py-6 border-b border-outline-variant/10 flex justify-between items-center">
                        <h3 className="font-serif text-headline-sm text-on-surface">Security Logs</h3>
                        <Shield className="w-5 h-5 text-outline" />
                      </div>
                      <div className="p-4 sm:p-6 flex flex-col gap-4 sm:gap-6 overflow-y-auto max-h-[60vh] sm:max-h-[500px]">
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
                    <h2 className="font-serif text-base sm:text-lg md:text-xl text-on-surface">Residence Management</h2>
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
                          <th className="px-3 py-3 sm:px-4 sm:py-3 lg:px-6 lg:py-4 font-bold">Residence</th>
                          <th className="px-3 py-3 sm:px-4 sm:py-3 lg:px-6 lg:py-4 font-bold">Location</th>
                          <th className="px-3 py-3 sm:px-4 sm:py-3 lg:px-6 lg:py-4 font-bold">Category</th>
                          <th className="px-3 py-3 sm:px-4 sm:py-3 lg:px-6 lg:py-4 font-bold">Status</th>
                          <th className="px-3 py-3 sm:px-4 sm:py-3 lg:px-6 lg:py-4 font-bold text-right">Actions</th>
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
                                <Tooltip content="Create Task" description="Create task for this booking">
                                  <button
                                    onClick={() => { setSelectedBookingForTask({ listingTitle: listing.title, listingId: listing.id, guestName: 'Guest', id: listing.id }); setShowCreateTaskFromBooking(true); }}
                                    className="p-1.5 text-secondary hover:text-gold-dark hover:bg-gold/10 rounded-lg transition-colors"
                                  >
                                    <ClipboardList className="w-4 h-4" />
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
                    <h2 className="font-serif text-base sm:text-lg md:text-xl text-on-surface">Booking Requests</h2>
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
                          <th className="px-3 py-3 sm:px-4 sm:py-3 lg:px-6 lg:py-4 font-bold">Guest</th>
                          <th className="px-3 py-3 sm:px-4 sm:py-3 lg:px-6 lg:py-4 font-bold">Property</th>
                          <th className="px-3 py-3 sm:px-4 sm:py-3 lg:px-6 lg:py-4 font-bold">Dates</th>
                          <th className="px-3 py-3 sm:px-4 sm:py-3 lg:px-6 lg:py-4 font-bold">Amount</th>
                          <th className="px-3 py-3 sm:px-4 sm:py-3 lg:px-6 lg:py-4 font-bold">Status</th>
                          <th className="px-3 py-3 sm:px-4 sm:py-3 lg:px-6 lg:py-4 font-bold text-right">Actions</th>
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
                                  <button 
                                    onClick={() => { setSelectedBookingDetail(booking); setShowBookingDetailModal(true); }}
                                    className="p-1.5 text-secondary hover:bg-surface-container rounded-lg transition-colors"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                </Tooltip>
                                <Tooltip content="Delete Booking" description="Permanently remove this booking">
                                  <button
                                    onClick={() => {
                                      if (confirm(`Are you sure you want to delete this booking for ${booking.guestName}? This action cannot be undone.`)) {
                                        handleDeleteBooking(booking);
                                      }
                                    }}
                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" />
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

            {activeSection === 'events' && (
              <motion.div
                key="events"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <AdminEventsView />
              </motion.div>
            )}

            {activeSection === 'tasks' && (
              <motion.div
                key="tasks"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <AdminTaskManagement />
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
                  <h2 className="font-serif text-base sm:text-lg md:text-xl text-on-surface">Platform Analytics</h2>
                  <p className="text-body-lg text-secondary mt-2">Revenue and performance insights</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-surface-container-lowest p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-outline-variant/10 luxury-shadow">
                    <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mb-3 sm:mb-4" />
                    <p className="text-label-caps text-secondary uppercase text-[10px] sm:text-xs">Monthly Revenue</p>
                    <p className="text-base sm:text-xl font-serif font-bold text-on-surface mt-1">₦{(totalRevenue / 1000000).toFixed(1)}M</p>
                    <p className="text-[10px] sm:text-xs text-green-600 mt-1">+12% from last month</p>
                  </div>
                  <div className="bg-surface-container-lowest p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-outline-variant/10 luxury-shadow">
                    <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-primary mb-3 sm:mb-4" />
                    <p className="text-label-caps text-secondary uppercase text-[10px] sm:text-xs">Bookings This Month</p>
                    <p className="text-base sm:text-xl font-serif font-bold text-on-surface mt-1">{confirmedBookings.length}</p>
                    <p className="text-[10px] sm:text-xs text-secondary mt-1">{pendingBookings.length} pending</p>
                  </div>
                  <div className="bg-surface-container-lowest p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-outline-variant/10 luxury-shadow">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mb-3 sm:mb-4" />
                    <p className="text-label-caps text-secondary uppercase text-[10px] sm:text-xs">Active Guests</p>
                    <p className="text-base sm:text-xl font-serif font-bold text-on-surface mt-1">48</p>
                    <p className="text-[10px] sm:text-xs text-blue-600 mt-1">+8 new this week</p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === 'crm' && (
              <motion.div
                key="crm"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <CRMView />
              </motion.div>
            )}

            {activeSection === 'staff' && (
              <motion.div
                key="staff"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <StaffManagement />
              </motion.div>
            )}

            {activeSection === 'notifications' && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <NotificationManagement />
              </motion.div>
            )}

            {activeSection === 'support' && (
              <motion.div
                key="support"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <AdminSupportManagement />
              </motion.div>
            )}

            {activeSection === 'transactions' && (
              <motion.div
                key="transactions"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <TransactionDownload />
              </motion.div>
            )}

            {activeSection === 'withdrawals' && (
              <motion.div
                key="withdrawals"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <AdminWithdrawalManagement />
              </motion.div>
            )}

            {activeSection === 'users' && (
              <motion.div
                key="users"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <UserManagement />
              </motion.div>
            )}

            {activeSection === 'properties' && (
              <motion.div
                key="properties"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <PropertyManagement />
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
                    <h2 className="font-serif text-base sm:text-lg md:text-xl text-on-surface">Payment Ledger</h2>
                    <p className="text-body-lg text-secondary mt-2">Complete transaction history with billing metadata</p>
                  </div>
                  <Tooltip content="Download Ledger" description="Export as CSV">
                    <button className="px-5 py-2.5 bg-surface-container-lowest border border-outline-variant/30 rounded-lg text-body-md font-semibold text-on-surface hover:bg-surface-container-low transition-colors flex items-center gap-2">
                      <Download className="w-4 h-4" /> Export CSV
                    </button>
                  </Tooltip>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                  {[
                    { label: 'Total Revenue', value: `₦${(totalRevenue / 1000000).toFixed(1)}M`, icon: DollarSign, color: 'text-green-600' },
                    { label: 'Pending', value: pendingBookings.length.toString(), icon: Clock, color: 'text-amber-600' },
                    { label: 'Platform (15%)', value: `₦${(totalRevenue * 0.15 / 1000).toFixed(0)}K`, icon: TrendingUp, color: 'text-primary' },
                    { label: 'Provider (85%)', value: `₦${(totalRevenue * 0.85 / 1000).toFixed(0)}K`, icon: Users, color: 'text-primary' },
                  ].map((stat, i) => (
                    <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                      className="glass-card luxury-shadow p-4 sm:p-6 rounded-xl border-l-4 border-primary">
                      <p className="text-label-caps text-secondary uppercase mb-2 text-[10px] sm:text-xs">{stat.label}</p>
                      <span className={`font-serif text-base sm:text-xl ${stat.color} break-all`}>{stat.value}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-3xl overflow-hidden luxury-shadow">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="text-label-caps text-secondary bg-surface-container-low border-b border-outline-variant/10">
                          <th className="px-2 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-4 font-bold text-[10px] sm:text-xs">Ref</th>
                          <th className="px-2 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-4 font-bold text-[10px] sm:text-xs hidden md:table-cell">Guest</th>
                          <th className="px-2 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-4 font-bold text-[10px] sm:text-xs hidden lg:table-cell">Property</th>
                          <th className="px-2 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-4 font-bold text-[10px] sm:text-xs hidden xl:table-cell">Services</th>
                          <th className="px-2 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-4 font-bold text-[10px] sm:text-xs">Total</th>
                          <th className="px-2 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-4 font-bold text-[10px] sm:text-xs hidden sm:table-cell">Platform</th>
                          <th className="px-2 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-4 font-bold text-[10px] sm:text-xs hidden lg:table-cell">Provider</th>
                          <th className="px-2 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-4 font-bold text-[10px] sm:text-xs">Status</th>
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
                              <td className="px-2 py-2 sm:px-4 sm:py-4 lg:px-6 lg:py-4">
                                <span className="font-mono text-[9px] sm:text-[10px] text-secondary">{ledger?.reference || booking.id?.slice(0, 12)}</span>
                              </td>
                              <td className="px-2 py-2 sm:px-4 sm:py-4 lg:px-6 lg:py-4 hidden md:table-cell">
                                <div>
                                  <p className="font-bold text-on-surface text-xs">{booking.guestName}</p>
                                  <p className="text-[10px] text-secondary">{booking.guestEmail}</p>
                                </div>
                              </td>
                              <td className="px-2 py-2 sm:px-4 sm:py-4 lg:px-6 lg:py-4 text-on-surface-variant text-xs hidden lg:table-cell">{booking.listingTitle}</td>
                              <td className="px-2 py-2 sm:px-4 sm:py-4 lg:px-6 lg:py-4 hidden xl:table-cell">
                                <div className="flex flex-wrap gap-1">
                                  {(booking.services || []).slice(0, 2).map((s: string, i: number) => (
                                    <span key={i} className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-[8px] font-bold">{s}</span>
                                  ))}
                                  {(!booking.services || booking.services.length === 0) && <span className="text-[10px] text-secondary">—</span>}
                                </div>
                              </td>
                              <td className="px-2 py-2 sm:px-4 sm:py-4 lg:px-6 lg:py-4">
                                <span className="font-bold text-primary text-xs">₦{total.toLocaleString()}</span>
                              </td>
                              <td className="px-2 py-2 sm:px-4 sm:py-4 lg:px-6 lg:py-4 text-xs text-on-surface-variant hidden sm:table-cell">₦{platformCut.toLocaleString()}</td>
                              <td className="px-2 py-2 sm:px-4 sm:py-4 lg:px-6 lg:py-4 text-xs text-green-600 font-semibold hidden lg:table-cell">₦{providerCut.toLocaleString()}</td>
                              <td className="px-2 py-2 sm:px-4 sm:py-4 lg:px-6 lg:py-4">
                                <span className={`text-[9px] sm:text-[10px] font-bold uppercase px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full ${
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
                  <h2 className="font-serif text-base sm:text-lg md:text-xl text-on-surface capitalize">{activeSection}</h2>
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

      <UniversalModal
        isOpen={showConfirmModal && !!selectedBooking}
        onClose={() => { setShowConfirmModal(false); setConfirmNotes(''); }}
        title="Confirm Booking"
        size="md"
        variant="auto"
      >
        {selectedBooking && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 space-y-2 text-sm">
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
              className="w-full p-3 bg-white border border-charcoal/10 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary"
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
          </div>
        )}
      </UniversalModal>

      <UniversalModal
        isOpen={showRejectModal && !!selectedBooking}
        onClose={() => { setShowRejectModal(false); setRejectReason(''); }}
        title="Reject Booking"
        size="md"
        variant="auto"
      >
        {selectedBooking && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 space-y-2 text-sm">
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
              className="w-full p-3 bg-white border border-charcoal/10 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-error"
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
          </div>
        )}
      </UniversalModal>

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

      <UniversalModal
        isOpen={showCreateTaskFromBooking}
        onClose={() => { setShowCreateTaskFromBooking(false); setSelectedBookingForTask(null); }}
        title="Create Task from Booking"
        size="md"
        variant="auto"
      >
        <CreateTaskFromBookingForm
          booking={selectedBookingForTask}
          staff={MOCK_ADMIN_STAFF}
          onClose={() => { setShowCreateTaskFromBooking(false); setSelectedBookingForTask(null); }}
          onSubmit={handleCreateTaskFromBooking}
        />
      </UniversalModal>

      <HelpSupportModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
      />

      <UniversalModal
        isOpen={showBroadcastModal}
        onClose={() => { setShowBroadcastModal(false); setBroadcastTitle(''); setBroadcastMessage(''); setBroadcastTarget('all'); setSelectedUsers([]); }}
        title="Broadcast Update"
        size="lg"
        variant="auto"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-2">Title</label>
            <input
              type="text"
              value={broadcastTitle}
              onChange={(e) => setBroadcastTitle(e.target.value)}
              placeholder="Enter broadcast title..."
              className="w-full px-4 py-2 bg-white border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
              disabled={isProcessing}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-2">Message</label>
            <textarea
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              placeholder="Enter broadcast message..."
              rows={4}
              className="w-full px-4 py-2 bg-white border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 resize-none"
              disabled={isProcessing}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-2">Target Audience</label>
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => setBroadcastTarget('all')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold uppercase transition-all ${
                  broadcastTarget === 'all' ? 'bg-gold text-charcoal' : 'bg-charcoal/5 text-charcoal/60 hover:bg-charcoal/10'
                }`}
              >
                All Users
              </button>
              <button
                onClick={() => setBroadcastTarget('role')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold uppercase transition-all ${
                  broadcastTarget === 'role' ? 'bg-gold text-charcoal' : 'bg-charcoal/5 text-charcoal/60 hover:bg-charcoal/10'
                }`}
              >
                By Role
              </button>
              <button
                onClick={() => setBroadcastTarget('selected')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold uppercase transition-all ${
                  broadcastTarget === 'selected' ? 'bg-gold text-charcoal' : 'bg-charcoal/5 text-charcoal/60 hover:bg-charcoal/10'
                }`}
              >
                Select Users
              </button>
            </div>

            {broadcastTarget === 'role' && (
              <select
                value={broadcastRole}
                onChange={(e) => setBroadcastRole(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                disabled={isProcessing}
              >
                <option value="guest">Guests</option>
                <option value="service_provider">Service Providers</option>
                <option value="admin">Admins</option>
              </select>
            )}

            {broadcastTarget === 'selected' && (
              <div className="max-h-48 overflow-y-auto border border-charcoal/10 rounded-lg p-2 space-y-1">
                {(allUsers as any[]).filter(u => u.role !== 'super_admin').map((user) => (
                  <label key={user.id} className="flex items-center gap-2 p-2 hover:bg-charcoal/5 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers([...selectedUsers, user.id]);
                        } else {
                          setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                        }
                      }}
                      className="rounded text-gold focus:ring-0 border-charcoal/20"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-charcoal">{user.name}</span>
                      <span className="text-xs text-charcoal/50 ml-2">({user.role})</span>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="bg-gold/5 border border-gold/10 rounded-lg p-3">
            <p className="text-xs text-charcoal/60">
              <span className="font-bold">Recipients:</span>{' '}
              {broadcastTarget === 'all' ? 'All users across the platform' :
               broadcastTarget === 'role' ? `All ${broadcastRole}s` :
               `${selectedUsers.length} selected user(s)`}
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => { setShowBroadcastModal(false); setBroadcastTitle(''); setBroadcastMessage(''); setBroadcastTarget('all'); setSelectedUsers([]); }}
              disabled={isProcessing}
              className="flex-1 py-3 border border-charcoal/10 text-charcoal font-bold text-xs uppercase rounded-lg hover:bg-charcoal/5 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleBroadcastUpdate}
              disabled={isProcessing || !broadcastTitle.trim() || !broadcastMessage.trim() || (broadcastTarget === 'selected' && selectedUsers.length === 0)}
              className="flex-[2] py-3 bg-gold text-charcoal font-bold text-xs uppercase rounded-lg hover:bg-gold-dark transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-charcoal/30 border-t-charcoal rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Radio className="w-4 h-4" />
                  Send Broadcast
                </>
              )}
            </button>
          </div>
        </div>
      </UniversalModal>

      <UniversalModal
        isOpen={showVerifyAccessModal && !!selectedArrival}
        onClose={() => setShowVerifyAccessModal(false)}
        title="Verify Guest Access"
        size="md"
        variant="auto"
      >
        {selectedArrival && (
          <div className="space-y-4">
            <div className="bg-gold/5 border border-gold/10 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center font-bold text-gold-dark">
                  {selectedArrival.initials}
                </div>
                <div>
                  <h3 className="font-bold text-charcoal">{selectedArrival.guestName}</h3>
                  <p className="text-xs text-charcoal/60">{selectedArrival.tier.toUpperCase()} Guest</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-charcoal/60">Property:</span>
                  <span className="font-bold text-charcoal">{selectedArrival.listingTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal/60">Unit:</span>
                  <span className="font-bold text-charcoal">{selectedArrival.unitCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal/60">Status:</span>
                  <span className="font-bold text-primary">{selectedArrival.status}</span>
                </div>
                {selectedArrival.eta && (
                  <div className="flex justify-between">
                    <span className="text-charcoal/60">ETA:</span>
                    <span className="font-bold text-charcoal">{selectedArrival.eta}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
              <p className="text-xs text-charcoal/60">
                <span className="font-bold">Verification Process:</span> By confirming access, you verify the guest's identity and grant them entry to the property. This action will be logged in the security system.
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setShowVerifyAccessModal(false)}
                disabled={isProcessing}
                className="flex-1 py-3 border border-charcoal/10 text-charcoal font-bold text-xs uppercase rounded-lg hover:bg-charcoal/5 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAccess}
                disabled={isProcessing}
                className="flex-[2] py-3 bg-gold text-charcoal font-bold text-xs uppercase rounded-lg hover:bg-gold-dark transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-charcoal/30 border-t-charcoal rounded-full animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Confirm Access
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </UniversalModal>

      <UniversalModal
        isOpen={showBookingDetailModal && !!selectedBookingDetail}
        onClose={() => setShowBookingDetailModal(false)}
        title="Booking Details"
        size="md"
        variant="auto"
      >
        {selectedBookingDetail && (
          <div className="space-y-4">
            <p className="text-[10px] text-charcoal/50 font-mono">{selectedBookingDetail.id?.slice(0, 16)}</p>

            <div className="bg-white rounded-xl p-4 space-y-3">
              <h3 className="text-[10px] font-bold text-charcoal/50 uppercase tracking-widest">Guest Information</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-[10px] text-charcoal/50">Name</p>
                  <p className="font-bold text-charcoal">{selectedBookingDetail.guestName}</p>
                </div>
                <div>
                  <p className="text-[10px] text-charcoal/50">Email</p>
                  <p className="font-bold text-charcoal text-xs break-all">{selectedBookingDetail.guestEmail}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 space-y-3">
              <h3 className="text-[10px] font-bold text-charcoal/50 uppercase tracking-widest">Property</h3>
              <p className="font-bold text-charcoal">{selectedBookingDetail.listingTitle}</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-[10px] text-charcoal/50">Check-in</p>
                  <p className="font-semibold text-charcoal">{selectedBookingDetail.checkIn}</p>
                </div>
                <div>
                  <p className="text-[10px] text-charcoal/50">Check-out</p>
                  <p className="font-semibold text-charcoal">{selectedBookingDetail.checkOut}</p>
                </div>
                <div>
                  <p className="text-[10px] text-charcoal/50">Guests</p>
                  <p className="font-semibold text-charcoal">{selectedBookingDetail.guestsCount}</p>
                </div>
                <div>
                  <p className="text-[10px] text-charcoal/50">Status</p>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    selectedBookingDetail.status === 'confirmed' || selectedBookingDetail.status === 'Confirmed'
                      ? 'bg-green-100 text-green-700'
                      : selectedBookingDetail.status === 'cancelled' || selectedBookingDetail.status === 'Cancelled'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {selectedBookingDetail.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 space-y-3">
              <h3 className="text-[10px] font-bold text-charcoal/50 uppercase tracking-widest">Cart Selections & Services</h3>
              {selectedBookingDetail.services && selectedBookingDetail.services.length > 0 ? (
                <div className="space-y-2">
                  {selectedBookingDetail.services.map((service: string, i: number) => {
                    const ServiceIcon = service.toLowerCase().includes('chef') || service.toLowerCase().includes('culinary') ? Utensils
                      : service.toLowerCase().includes('driver') || service.toLowerCase().includes('car') ? Car
                      : service.toLowerCase().includes('security') ? Shield
                      : service.toLowerCase().includes('yacht') || service.toLowerCase().includes('boat') ? Anchor
                      : Sparkles;
                    return (
                      <div key={i} className="flex items-center gap-3 bg-primary/5 rounded-lg p-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <ServiceIcon className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-charcoal text-sm truncate">{service}</p>
                          <p className="text-[10px] text-charcoal/50">Service Provider: Assigned</p>
                        </div>
                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-charcoal/50 italic">No additional services selected</p>
              )}
            </div>

            <div className="bg-gold/5 border border-gold/10 rounded-xl p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-charcoal/60">Total Amount</span>
                <span className="text-lg font-bold text-gold-dark">₦{(selectedBookingDetail.totalAmount || 0).toLocaleString()}</span>
              </div>
              {selectedBookingDetail.paymentLedger && (
                <div className="mt-2 pt-2 border-t border-gold/10 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-charcoal/50">Reference</span>
                    <span className="font-mono text-charcoal">{selectedBookingDetail.paymentLedger.reference}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-charcoal/50">Platform (15%)</span>
                    <span className="font-semibold text-charcoal">₦{selectedBookingDetail.paymentLedger.platformCut?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-charcoal/50">Provider (85%)</span>
                    <span className="font-semibold text-green-600">₦{selectedBookingDetail.paymentLedger.providerCut?.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {(selectedBookingDetail.status === 'pending' || selectedBookingDetail.status === 'Pending') && (
                <>
                  <button
                    onClick={() => { setShowBookingDetailModal(false); setSelectedBooking(selectedBookingDetail); setShowConfirmModal(true); }}
                    className="flex-1 min-w-[100px] sm:min-w-[120px] py-2.5 bg-green-600 text-white font-bold text-xs uppercase rounded-xl hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Confirm
                  </button>
                  <button
                    onClick={() => { setShowBookingDetailModal(false); setSelectedBooking(selectedBookingDetail); setShowRejectModal(true); }}
                    className="flex-1 min-w-[100px] sm:min-w-[120px] py-2.5 bg-red-600 text-white font-bold text-xs uppercase rounded-xl hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                </>
              )}
              <button
                onClick={() => { handleWhatsAppNotify(selectedBookingDetail); }}
                className="flex-1 min-w-[100px] sm:min-w-[120px] py-2.5 bg-[#25D366] text-white font-bold text-xs uppercase rounded-xl hover:bg-[#20bd5a] transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </button>
            </div>
          </div>
        )}
      </UniversalModal>

      <ToastContainer />
    </div>
    </DashboardErrorBoundary>
  );
}

function CreateTaskFromBookingForm({ booking, staff, onClose, onSubmit }: {
  booking: any;
  staff: any[];
  onClose: () => void;
  onSubmit: (data: any) => void;
}) {
  const [formData, setFormData] = useState({
    title: `Task for ${booking?.listingTitle || 'Booking'}`,
    description: `Task created for booking: ${booking?.listingTitle || 'N/A'}\nGuest: ${booking?.guestName || 'Guest'}`,
    assignedTo: '',
    assignedToName: '',
    priority: 'medium' as const,
    status: 'pending' as const,
    checklist: [{ id: '1', text: 'Review booking details', completed: false }],
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    tags: ['booking'],
    category: 'general',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedStaff = staff.find(s => s.id === formData.assignedTo);
    onSubmit({
      ...formData,
      assignedToName: selectedStaff?.name || 'Unassigned',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-gold/5 border border-gold/10 rounded-lg p-3 mb-4">
        <p className="text-xs text-charcoal/60">
          <span className="font-bold">Booking:</span> {booking?.listingTitle || 'N/A'}<br />
          <span className="font-bold">Guest:</span> {booking?.guestName || 'Guest'}
        </p>
      </div>

      <div>
        <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-2">Task Title</label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-2 border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="w-full px-4 py-2 border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-2">Assign To</label>
          <select
            required
            value={formData.assignedTo}
            onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
            className="w-full px-4 py-2 border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
          >
            <option value="">Select staff...</option>
            {staff.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-2">Priority</label>
          <select
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
            className="w-full px-4 py-2 border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-2">Due Date</label>
        <input
          type="date"
          required
          value={formData.dueDate}
          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          className="w-full px-4 py-2 border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
        />
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
          <CheckSquare className="w-4 h-4" />
          Create Task
        </button>
      </div>
    </form>
  );
}
