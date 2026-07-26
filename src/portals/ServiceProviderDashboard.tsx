import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard, Calendar, Users, Package, Search, Bell,
  CheckCircle, XCircle, Eye, Edit3, TrendingUp, DollarSign,
  Utensils, Car, Camera, ShieldCheck, Key, Radio, Zap,
  UserCheck, CalendarDays, Download,
  Sparkles, Briefcase, Award, UserCircle, ChevronDown, X, Menu,
  Clock, Star, MapPin, ArrowRight, Filter,
  BarChart3, PieChart, Activity, ChevronRight, Plus, Globe, Wifi, WifiOff,
  RefreshCw, HelpCircle, LogOut, Settings, MoreVertical, Phone, Mail,
  Check, AlertCircle, Send, FileText, MessageSquare, Grid3X3
} from 'lucide-react';
import { useAuth } from '../auth';
import { useDatabase } from '../hooks/useDatabase';
import { useBackendHealth } from '../hooks/useBackendHealth';
import { useSyncIndicator } from '../hooks/useSyncIndicator';
import { syncCreate, syncUpdate, syncDelete } from '../lib/syncEngine';
import CollapsibleSidebar from '../components/ui/CollapsibleSidebar';
import Tooltip from '../components/ui/Tooltip';
import SyncIndicator from '../components/ui/SyncIndicator';
import ListingWizardView from '../components/ListingWizardView';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import EditModal, { EditField } from '../components/ui/EditModal';
import StaffAssignModal from '../components/ui/StaffAssignModal';
import AssetCreateModal from '../components/ui/AssetCreateModal';
import ServiceCreateModal from '../components/ui/ServiceCreateModal';
import HelpSupportModal from '../components/ui/HelpSupportModal';
import { ToastContainer, showToast } from '../components/ui/Toast';
import api from '../services/api';
import StaffManagement from '../components/StaffManagement';
import TransactionDownload from '../components/TransactionDownload';
import { Listing } from '../types';
import SPTaskManagement from '../components/SPTaskManagement';
import { generateId } from '../db';

type ProviderSection = 'overview' | 'service-dashboard' | 'listings' | 'my-services' | 'schedule' | 'calendar' | 'earnings' | 'inventory' | 'booking-requests' | 'wizard' | 'tasks' | 'staff' | 'transactions';

interface StaffMember {
  id: string;
  name: string;
  role: string;
  status: 'on_duty' | 'available' | 'off_duty';
  initials: string;
  certifications: string[];
  specializations: string[];
  rating: number;
  availabilityFrom: string;
  currentAssignment?: string;
  tenureYears: number;
}

interface ServiceItem {
  id: string;
  title: string;
  category: string;
  bookings: number;
  rating: number;
  revenue: number;
  status: 'active' | 'paused' | 'draft';
  icon: React.ElementType;
  description?: string;
  price?: number;
  priceUnit?: string;
  image?: string;
  providerId?: string;
}

export default function ServiceProviderDashboard() {
  const { currentUser, logout } = useAuth();
  const [activeSection, setActiveSection] = useState<ProviderSection>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
  const [calendarMonth] = useState(new Date());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [withdrawalMethod, setWithdrawalMethod] = useState('bank_transfer');
  const [showBookingConfirm, setShowBookingConfirm] = useState<string | null>(null);
  const [showBookingReject, setShowBookingReject] = useState<string | null>(null);
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [selectedBookingForAction, setSelectedBookingForAction] = useState<any>(null);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [myServices, setMyServices] = useState<ServiceItem[]>([]);
  const [assets, setAssets] = useState<any[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(false);
  const [isLoadingStaff, setIsLoadingStaff] = useState(false);

  const backendHealth = useBackendHealth();
  const syncState = useSyncIndicator();

  const { data: bookings, addRecord: updateBooking } = useDatabase('bookings');
  const { data: transactions } = useDatabase('transactions');
  const { data: listings, removeRecord: removeListing, addRecord: updateListing } = useDatabase('listings');
  const { data: servicesData } = useDatabase('services');

  const totalEarnings = (transactions as any[]).reduce((sum: number, t: any) => sum + (t.amount || 0), 0);
  const activeBookings = (bookings as any[]).filter((b: any) => b.status === 'confirmed' || b.status === 'Confirmed' || b.status === 'Pending');
  const pendingBookings = (bookings as any[]).filter((b: any) => b.status === 'Pending' || b.status === 'pending');
  const unassignedBookings = (bookings as any[]).filter((b: any) => !b.providerId || b.providerAssignmentStatus === 'unassigned');

  useEffect(() => {
    fetchStaff();
    fetchServices();
  }, [currentUser?.id]);

  const fetchStaff = async () => {
    setIsLoadingStaff(true);
    try {
      const result = await api.provider.getStaff({ providerId: currentUser?.id });
      if (result.success && result.data) {
        setStaff(result.data.map((s: any) => ({
          id: s._id || s.id,
          name: s.name,
          role: s.role || 'staff',
          status: s.status || 'available',
          initials: s.name?.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || 'ST',
          certifications: s.certifications || [],
          specializations: s.specializations || [],
          rating: s.rating || 0,
          availabilityFrom: s.availabilityFrom || 'Now',
          currentAssignment: s.currentAssignment,
          tenureYears: s.tenureYears || 0,
        })));
      }
    } catch (error) {
      console.error('Failed to fetch staff:', error);
    } finally {
      setIsLoadingStaff(false);
    }
  };

  const fetchServices = async () => {
    setIsLoadingServices(true);
    try {
      const result = await api.provider.getServices({ providerId: currentUser?.id });
      if (result.success && result.data) {
        setMyServices(result.data.map((s: any) => ({
          id: s._id || s.id,
          title: s.title,
          category: s.category,
          bookings: s.bookings || 0,
          rating: s.rating || 0,
          revenue: s.revenue || 0,
          status: s.available ? 'active' : 'paused',
          icon: getCategoryIcon(s.category),
          description: s.description,
          price: s.price,
          priceUnit: s.priceUnit,
          image: s.image,
          providerId: s.providerId,
        })));
      }
    } catch (error) {
      console.error('Failed to fetch services:', error);
    } finally {
      setIsLoadingServices(false);
    }
  };

  const getCategoryIcon = (category: string): React.ElementType => {
    switch (category?.toLowerCase()) {
      case 'transport': return Car;
      case 'culinary': return Utensils;
      case 'security': return ShieldCheck;
      case 'media': case 'photography': return Camera;
      case 'wellness': return Sparkles;
      case 'concierge': return Key;
      case 'marine': case 'yacht': return Radio;
      case 'aviation': return Zap;
      default: return Briefcase;
    }
  };

  const filteredStaff = useMemo(() => {
    if (!searchQuery) return staff;
    return staff.filter(s =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, staff]);

  const onDutyCount = staff.filter(s => s.status === 'on_duty').length;

  const handleLogout = () => logout();

  const handleWithdrawal = async () => {
    if (!withdrawalAmount || parseFloat(withdrawalAmount) <= 0) {
      showToast({ type: 'error', title: 'Invalid Amount', message: 'Please enter a valid withdrawal amount' });
      return;
    }

    setIsProcessing(true);
    try {
      const withdrawal = {
        id: `withdrawal-${Date.now()}`,
        amount: parseFloat(withdrawalAmount),
        method: withdrawalMethod,
        status: 'pending',
        createdAt: new Date().toISOString(),
        providerId: currentUser?.id,
      };

      // In a real app, this would call an API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showToast({ 
        type: 'success', 
        title: 'Withdrawal Requested', 
        message: `Withdrawal of ₦${parseFloat(withdrawalAmount).toLocaleString()} has been submitted for processing` 
      });
      
      setShowWithdrawalModal(false);
      setWithdrawalAmount('');
      setWithdrawalMethod('bank_transfer');
    } catch (error) {
      showToast({ type: 'error', title: 'Error', message: 'Failed to process withdrawal request' });
    }
    setIsProcessing(false);
  };

  const handleExportCalendar = () => {
    const bookings = activeBookings.map(b => ({
      guest: b.guestName || 'Guest',
      property: b.listingTitle || 'Property',
      checkIn: b.checkIn || 'TBD',
      checkOut: b.checkOut || 'TBD',
      amount: b.totalAmount || 0,
      status: b.status || 'pending'
    }));

    const csvContent = [
      'Guest,Property,Check-In,Check-Out,Amount,Status',
      ...bookings.map(b => `${b.guest},${b.property},${b.checkIn},${b.checkOut},${b.amount},${b.status}`)
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `calendar_bookings_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    showToast({ type: 'success', title: 'Exported', message: 'Calendar bookings exported successfully' });
  };

  const handleSectionChange = (section: ProviderSection) => {
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'on_duty': return { bg: 'bg-green-100', text: 'text-green-700', label: 'ON-DUTY' };
      case 'available': return { bg: 'bg-primary-container/20', text: 'text-primary', label: 'AVAILABLE' };
      case 'off_duty': return { bg: 'bg-error/10', text: 'text-error', label: 'OFF-DUTY' };
      default: return { bg: 'bg-surface-container', text: 'text-secondary', label: status.toUpperCase() };
    }
  };

  const handleAssignStaff = async (bookingId: string, staffId: string) => {
    const staffMember = staff.find(s => s.id === staffId);
    if (staffMember) {
      try {
        await api.staff.patch({ id: staffId, currentAssignment: bookingId });
        showToast({ type: 'success', title: 'Staff Assigned', message: `${staffMember.name} has been assigned` });
        setSelectedStaff(null);
        fetchStaff();
      } catch (error) {
        showToast({ type: 'error', title: 'Error', message: 'Failed to assign staff' });
      }
    }
  };

  const handlePublishListing = async (newListing: Listing) => {
    await syncCreate('listings', newListing);
    try {
      await api.listings.create(newListing);
    } catch {}
    showToast({ type: 'success', title: 'Property Published', message: `${newListing.title} is now live` });
    handleSectionChange('listings');
  };

  const handleDeleteListing = async () => {
    if (!selectedListing) return;
    await syncDelete('listings', selectedListing.id);
    try {
      await api.listings.delete(selectedListing.id);
    } catch {}
    removeListing(selectedListing.id);
    showToast({ type: 'success', title: 'Property Deleted', message: `${selectedListing.title} has been removed` });
    setShowDeleteConfirm(false);
    setSelectedListing(null);
  };

  const handleEditListing = async (data: any) => {
    if (!selectedListing) return;
    const updated = { ...selectedListing, ...data, updatedAt: new Date().toISOString() };
    await syncUpdate('listings', updated);
    try {
      await api.listings.update(updated);
    } catch {}
    updateListing(updated as any);
    showToast({ type: 'success', title: 'Property Updated', message: `${updated.title} has been saved` });
    setShowEditModal(false);
    setSelectedListing(null);
  };

  const handleToggleListingStatus = async (listing: any) => {
    const updated = { ...listing, isActive: !listing.isActive, updatedAt: new Date().toISOString() };
    await syncUpdate('listings', updated);
    try {
      await api.listings.update(updated);
    } catch {}
    updateListing(updated as any);
    showToast({ type: 'info', title: listing.isActive ? 'Property Deactivated' : 'Property Activated', message: updated.title });
  };

  const handleConfirmBooking = async (booking: any) => {
    await syncUpdate('bookings', { ...booking, status: 'confirmed', updatedAt: new Date().toISOString() });
    try {
      await api.bookings.confirm(booking.id);
    } catch {}
    updateBooking({ ...booking, status: 'confirmed', updatedAt: new Date().toISOString() } as any);
    showToast({ type: 'success', title: 'Booking Confirmed', message: `${booking.guestName}'s booking has been confirmed` });
    setShowBookingConfirm(null);
  };

  const handleRejectBooking = async (booking: any) => {
    await syncUpdate('bookings', { ...booking, status: 'cancelled', updatedAt: new Date().toISOString() });
    try {
      await api.bookings.cancel(booking.id);
    } catch {}
    updateBooking({ ...booking, status: 'cancelled', updatedAt: new Date().toISOString() } as any);
    showToast({ type: 'warning', title: 'Booking Rejected', message: `${booking.guestName}'s booking has been declined` });
    setShowBookingReject(null);
  };

  const handleAssignStaffToBooking = async (staffId: string) => {
    const staffMember = staff.find(s => s.id === staffId);
    if (!staffMember || !selectedBookingForAction) return;
    try {
      await api.staff.patch({ id: staffId, currentAssignment: selectedBookingForAction.listingTitle });
      showToast({ type: 'success', title: 'Staff Assigned', message: `${staffMember.name} assigned to ${selectedBookingForAction.listingTitle}` });
      setShowAssignModal(false);
      setSelectedBookingForAction(null);
      fetchStaff();
    } catch (error) {
      showToast({ type: 'error', title: 'Error', message: 'Failed to assign staff' });
    }
  };

  const handleCreateAsset = async (asset: any) => {
    setAssets(prev => [...prev, asset]);
    try {
      await api.provider.createAsset(asset);
    } catch {}
    showToast({ type: 'success', title: 'Asset Created', message: `${asset.name} has been added to inventory` });
    setShowAssetModal(false);
  };

  const handleCreateService = async (serviceData: any) => {
    try {
      const result = await api.provider.createService({
        ...serviceData,
        providerId: currentUser?.id,
        providerName: currentUser?.name,
      });
      if (result.success) {
        showToast({ type: 'success', title: 'Service Created', message: `${serviceData.title} has been published` });
        setShowServiceModal(false);
        fetchServices();
      }
    } catch (error) {
      showToast({ type: 'error', title: 'Error', message: 'Failed to create service' });
    }
  };

  const handleUpdateService = async (serviceData: any) => {
    try {
      const result = await api.provider.updateService(serviceData);
      if (result.success) {
        showToast({ type: 'success', title: 'Service Updated', message: `${serviceData.title} has been updated` });
        setShowServiceModal(false);
        setEditingService(null);
        fetchServices();
      }
    } catch (error) {
      showToast({ type: 'error', title: 'Error', message: 'Failed to update service' });
    }
  };

  const handleDeleteService = async (service: ServiceItem) => {
    try {
      await api.provider.deleteService(service.id);
      showToast({ type: 'success', title: 'Service Deleted', message: `${service.title} has been removed` });
      fetchServices();
    } catch (error) {
      showToast({ type: 'error', title: 'Error', message: 'Failed to delete service' });
    }
  };

  const handleToggleServiceStatus = async (service: ServiceItem) => {
    try {
      await api.provider.updateService({
        id: service.id,
        available: service.status !== 'active',
      });
      showToast({
        type: 'info',
        title: service.status === 'active' ? 'Service Paused' : 'Service Activated',
        message: service.title,
      });
      fetchServices();
    } catch (error) {
      showToast({ type: 'error', title: 'Error', message: 'Failed to update service' });
    }
  };

  const listingEditFields: EditField[] = [
    { name: 'title', label: 'Property Title', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'nightlyRate', label: 'Nightly Rate (₦)', type: 'number', min: 0 },
    { name: 'securityDeposit', label: 'Security Deposit (₦)', type: 'number', min: 0 },
    { name: 'bedrooms', label: 'Bedrooms', type: 'number', min: 0 },
    { name: 'bathrooms', label: 'Bathrooms', type: 'number', min: 0, step: 0.5 },
    { name: 'maxGuests', label: 'Max Guests', type: 'number', min: 1 },
    { name: 'isActive', label: 'Active Listing', type: 'toggle' },
  ];

  const calendarDays = useMemo(() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  }, [calendarMonth]);

  const bookedDates = useMemo(() => {
    const dates = new Set<string>();
    activeBookings.forEach((b: any) => {
      if (b.checkIn) dates.add(b.checkIn);
      if (b.checkOut) dates.add(b.checkOut);
    });
    return dates;
  }, [activeBookings]);

  return (
    <div className="flex min-h-screen bg-parchment">
      <CollapsibleSidebar
        activeTab={activeSection}
        setActiveTab={handleSectionChange as any}
        userRole="service_provider"
        onLogout={handleLogout}
        onHelp={() => setShowHelpModal(true)}
        onCollapse={setIsSidebarCollapsed}
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />

      <main className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-[80px]' : 'lg:ml-[280px]'} ml-0 lg:ml-[80px]`}>
        <header className="h-20 px-4 lg:px-20 w-full sticky top-0 bg-parchment/80 backdrop-blur-xl border-b border-outline-variant/20 shadow-sm z-40 flex justify-between items-center">
          <div className="flex items-center gap-4 lg:gap-8">
            <Tooltip content="Open Menu" position="right">
              <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 rounded-lg hover:bg-surface-container text-secondary transition-colors lg:hidden">
                <Menu className="w-5 h-5" />
              </button>
            </Tooltip>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <SyncIndicator />
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
              <button className="p-2 text-secondary hover:text-primary cursor-pointer transition-colors relative">
                <Bell className="w-5 h-5" />
                {pendingBookings.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full animate-pulse" />}
              </button>
            </Tooltip>
            <Tooltip content="Help & Support">
              <button onClick={() => setShowHelpModal(true)} className="p-2 text-secondary hover:text-primary cursor-pointer transition-colors">
                <HelpCircle className="w-5 h-5" />
              </button>
            </Tooltip>
            <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant/30 bg-primary-container/20 flex items-center justify-center">
              <UserCircle className="w-5 h-5 text-primary" />
            </div>
          </div>
        </header>

        <div className="pt-8 pb-16 px-4 lg:px-20 max-w-[1440px]">
          <AnimatePresence mode="wait">
            {(activeSection === 'overview' || activeSection === 'service-dashboard') && (
              <motion.div key="overview" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div>
                    <h1 className="font-serif text-headline-lg text-on-surface mb-2">Dashboard Overview</h1>
                    <p className="text-secondary font-body-lg">Manage your services, bookings, and staff.</p>
                  </div>
                  <div className="glass-card px-6 py-3 rounded-xl flex items-center gap-4">
                    <div className="text-right border-r border-outline-variant/30 pr-4">
                      <div className="text-[10px] text-outline font-label-caps">ON-DUTY</div>
                      <div className="text-xl font-bold text-primary">{onDutyCount}/{staff.length}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-outline font-label-caps">PENDING</div>
                      <div className="text-xl font-bold text-error">{pendingBookings.length}</div>
                    </div>
                  </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {[
                    { label: 'Total Earnings', value: `₦${(totalEarnings / 1000000).toFixed(1)}M`, icon: DollarSign, color: 'text-green-600' },
                    { label: 'Active Bookings', value: activeBookings.length.toString(), icon: Clock, color: 'text-primary' },
                    { label: 'My Services', value: myServices.filter(s => s.status === 'active').length.toString(), icon: Briefcase, color: 'text-primary' },
                    { label: 'Pending Requests', value: pendingBookings.length.toString(), icon: Package, color: 'text-error' },
                  ].map((stat, i) => (
                    <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                      className="glass-card p-6 rounded-3xl border border-outline-variant/10 luxury-shadow">
                      <stat.icon className={`w-6 h-6 ${stat.color} mb-4`} />
                      <p className="text-[10px] font-bold tracking-widest text-secondary uppercase">{stat.label}</p>
                      <p className="text-2xl font-serif font-bold text-on-surface mt-1">{stat.value}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <section className="lg:col-span-5 space-y-4">
                    <div className="flex items-center justify-between px-2 mb-2">
                      <h2 className="font-serif text-xl text-on-surface">Booking Requests</h2>
                      {unassignedBookings.length > 0 && <span className="bg-error/10 text-error px-2 py-0.5 rounded text-[10px] font-bold animate-pulse">NEED ASSIGNMENT</span>}
                    </div>
                    {unassignedBookings.length === 0 && (
                      <div className="glass-card p-8 rounded-2xl text-center">
                        <CheckCircle className="w-10 h-10 text-green-600 mx-auto mb-3" />
                        <p className="text-sm text-secondary">All bookings are assigned.</p>
                      </div>
                    )}
                    {unassignedBookings.slice(0, 5).map((booking: any) => (
                      <motion.div key={booking.id} whileHover={{ y: -2 }}
                        className="glass-card p-5 rounded-2xl border-l-4 border-l-primary hover:shadow-xl transition-all cursor-pointer group">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase mb-2 inline-block">
                              {booking.services?.length ? booking.services.join(', ') : 'Accommodation'}
                            </span>
                            <h3 className="font-bold text-on-surface text-lg">{booking.listingTitle}</h3>
                            <p className="text-xs text-secondary mt-1">{booking.guestName} • {booking.checkIn} → {booking.checkOut}</p>
                          </div>
                          <span className="font-bold text-primary text-sm">₦{(booking.totalAmount || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-outline-variant/10">
                          <div className="flex items-center gap-2 text-xs text-secondary">
                            <Users className="w-3 h-3" />
                            <span>{booking.guestsCount} guests</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Tooltip content="Confirm">
                              <button
                                onClick={() => { setSelectedBookingForAction(booking); setShowBookingConfirm(booking.id); }}
                                className="text-green-600 font-bold text-xs flex items-center gap-1 hover:gap-2 transition-all">
                                <CheckCircle className="w-3.5 h-3.5" />
                              </button>
                            </Tooltip>
                            <Tooltip content="Assign Staff">
                              <button
                                onClick={() => { setSelectedBookingForAction(booking); setShowAssignModal(true); }}
                                className="text-primary font-bold text-xs flex items-center gap-1 hover:gap-2 transition-all">
                                ASSIGN <ArrowRight className="w-3 h-3" />
                              </button>
                            </Tooltip>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </section>

                  <section className="lg:col-span-7">
                    <div className="flex items-center justify-between mb-6 px-2">
                      <h2 className="font-serif text-xl text-on-surface">Personnel Command</h2>
                      <div className="flex gap-2">
                        <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-primary text-on-primary' : 'bg-surface-container hover:bg-surface-container-high text-secondary'}`}>
                          <Filter className="w-4 h-4" />
                        </button>
                        <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-primary text-on-primary' : 'bg-surface-container hover:bg-surface-container-high text-secondary'}`}>
                          <Grid3X3 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    {isLoadingStaff ? (
                      <div className="flex items-center justify-center py-12">
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                          <RefreshCw className="w-6 h-6 text-primary" />
                        </motion.div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredStaff.map((staffMember) => {
                          const statusBadge = getStatusBadge(staffMember.status);
                          return (
                            <motion.div key={staffMember.id} whileHover={{ y: -4 }}
                              className="glass-card rounded-3xl overflow-hidden flex flex-col group luxury-shadow">
                              <div className="relative h-40 bg-gradient-to-br from-primary/20 via-surface-container to-surface-container-high overflow-hidden flex items-center justify-center">
                                <div className="w-16 h-16 rounded-full bg-primary-container/30 flex items-center justify-center">
                                  <span className="text-xl font-serif font-bold text-primary">{staffMember.initials}</span>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                <div className="absolute bottom-3 left-4">
                                  <h3 className="text-white font-serif text-lg">{staffMember.name}</h3>
                                  <div className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${staffMember.status === 'on_duty' ? 'bg-primary animate-pulse' : staffMember.status === 'available' ? 'bg-green-400' : 'bg-secondary'}`} />
                                    <span className="text-primary-container text-[10px] font-bold uppercase tracking-widest">
                                      {staffMember.currentAssignment ? `ON-DUTY: ${staffMember.currentAssignment}` : statusBadge.label}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="p-5">
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                  <div>
                                    <p className="text-[10px] text-outline font-label-caps mb-1">CERTIFICATIONS</p>
                                    <div className="flex flex-wrap gap-1">
                                      {staffMember.certifications.slice(0, 2).map(cert => (
                                        <span key={cert} className="bg-surface-container-high px-2 py-0.5 rounded text-[9px] font-bold">{cert}</span>
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-[10px] text-outline font-label-caps mb-1">RATING</p>
                                    <div className="flex items-center gap-1 text-primary">
                                      <Star className="w-3.5 h-3.5 fill-current" />
                                      <span className="text-xs font-bold">{staffMember.rating} / 5.0</span>
                                    </div>
                                  </div>
                                </div>
                                <button
                                  onClick={() => { setSelectedStaff(staffMember.id); }}
                                  className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${
                                    staffMember.status === 'available' ? 'bg-on-surface text-white hover:bg-primary' : 'border border-primary text-primary hover:bg-primary hover:text-on-primary'
                                  }`}>
                                  {staffMember.status === 'available' ? 'Assign to Task' : 'Reassign'}
                                </button>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </section>
                </div>
              </motion.div>
            )}

            {activeSection === 'my-services' && (
              <motion.div key="my-services" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <h1 className="font-serif text-headline-lg text-on-surface">My Services</h1>
                    <p className="text-secondary font-body-lg mt-2">Manage your service offerings and track performance</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setEditingService(null); setShowServiceModal(true); }}
                    className="px-5 py-2.5 bg-primary text-white font-bold text-sm rounded-xl hover:bg-primary-dark transition-colors flex items-center gap-2 shadow-lg"
                  >
                    <Plus className="w-4 h-4" />
                    Create Service
                  </motion.button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {[
                    { label: 'Active Services', value: myServices.filter(s => s.status === 'active').length, icon: Briefcase, color: 'text-primary' },
                    { label: 'Total Bookings', value: myServices.reduce((s, ms) => s + ms.bookings, 0), icon: Calendar, color: 'text-green-600' },
                    { label: 'Avg Rating', value: myServices.length > 0 ? (myServices.reduce((s, ms) => s + ms.rating, 0) / myServices.length).toFixed(1) : '0.0', icon: Star, color: 'text-primary' },
                    { label: 'Total Revenue', value: `₦${(myServices.reduce((s, ms) => s + ms.revenue, 0) / 1000000).toFixed(1)}M`, icon: DollarSign, color: 'text-green-600' },
                  ].map((stat, i) => (
                    <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                      className="glass-card p-5 rounded-2xl border border-outline-variant/10 luxury-shadow">
                      <stat.icon className={`w-5 h-5 ${stat.color} mb-3`} />
                      <p className="text-[10px] font-bold tracking-widest text-secondary uppercase">{stat.label}</p>
                      <p className="text-xl font-serif font-bold text-on-surface mt-1">{stat.value}</p>
                    </motion.div>
                  ))}
                </div>

                {isLoadingServices ? (
                  <div className="flex items-center justify-center py-12">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                      <RefreshCw className="w-6 h-6 text-primary" />
                    </motion.div>
                  </div>
                ) : myServices.length === 0 ? (
                  <div className="glass-card p-12 rounded-2xl text-center">
                    <Briefcase className="w-12 h-12 text-secondary/30 mx-auto mb-3" />
                    <p className="text-lg font-semibold text-on-surface mb-2">No services yet</p>
                    <p className="text-sm text-secondary mb-4">Create your first service to start accepting bookings</p>
                    <button
                      onClick={() => setShowServiceModal(true)}
                      className="px-5 py-2.5 bg-primary text-white font-bold text-sm rounded-xl hover:bg-primary-dark transition-colors inline-flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Create Your First Service
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {myServices.map((service) => (
                      <motion.div key={service.id} whileHover={{ y: -2 }}
                        className="glass-card p-6 rounded-2xl border border-outline-variant/10 luxury-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                              <service.icon className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-bold text-on-surface">{service.title}</h3>
                              <p className="text-xs text-secondary capitalize">{service.category}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[9px] font-bold px-2 py-1 rounded-full ${service.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                              {service.status.toUpperCase()}
                            </span>
                            <button
                              onClick={() => {
                                const dropdown = document.getElementById(`service-menu-${service.id}`);
                                if (dropdown) dropdown.classList.toggle('hidden');
                              }}
                              className="p-1 rounded hover:bg-surface-container transition-colors"
                            >
                              <MoreVertical className="w-4 h-4 text-secondary" />
                            </button>
                            <div id={`service-menu-${service.id}`} className="hidden absolute right-6 top-12 bg-white border border-outline-variant/20 rounded-lg shadow-lg py-1 z-10">
                              <button
                                onClick={() => { setEditingService(service); setShowServiceModal(true); }}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-surface-container flex items-center gap-2"
                              >
                                <Edit3 className="w-4 h-4" /> Edit
                              </button>
                              <button
                                onClick={() => handleToggleServiceStatus(service)}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-surface-container flex items-center gap-2"
                              >
                                {service.status === 'active' ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                                {service.status === 'active' ? 'Pause' : 'Activate'}
                              </button>
                              <button
                                onClick={() => handleDeleteService(service)}
                                className="w-full px-4 py-2 text-left text-sm text-error hover:bg-error/5 flex items-center gap-2"
                              >
                                <XCircle className="w-4 h-4" /> Delete
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-outline-variant/10">
                          <div>
                            <p className="text-[10px] text-secondary uppercase">Bookings</p>
                            <p className="text-lg font-bold text-on-surface">{service.bookings}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-secondary uppercase">Rating</p>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-primary fill-current" />
                              <span className="text-lg font-bold text-on-surface">{service.rating || '—'}</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-[10px] text-secondary uppercase">Revenue</p>
                            <p className="text-lg font-bold text-green-600">₦{(service.revenue / 1000).toFixed(0)}K</p>
                          </div>
                        </div>
                        {service.price && (
                          <div className="mt-4 pt-4 border-t border-outline-variant/10 flex items-center justify-between">
                            <span className="text-xs text-secondary">Price</span>
                            <span className="font-bold text-primary">₦{service.price.toLocaleString()} / {service.priceUnit || 'session'}</span>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeSection === 'listings' && (
              <motion.div key="listings" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <h1 className="font-serif text-headline-lg text-on-surface">My Properties</h1>
                    <p className="text-secondary font-body-lg mt-2">Manage your listed properties and availability</p>
                  </div>
                  <button
                    onClick={() => handleSectionChange('wizard')}
                    className="px-5 py-2.5 bg-primary text-white font-bold text-sm rounded-xl hover:bg-primary-dark transition-colors flex items-center gap-2 shadow-lg"
                  >
                    <Plus className="w-4 h-4" />
                    Add Property
                  </button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {[
                    { label: 'Total Properties', value: (listings as any[]).length, icon: Globe, color: 'text-primary' },
                    { label: 'Active Listings', value: (listings as any[]).filter((l: any) => l.isActive).length, icon: CheckCircle, color: 'text-green-600' },
                    { label: 'Inactive', value: (listings as any[]).filter((l: any) => !l.isActive).length, icon: XCircle, color: 'text-amber-600' },
                  ].map((stat, i) => (
                    <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                      className="glass-card p-5 rounded-2xl border border-outline-variant/10 luxury-shadow">
                      <stat.icon className={`w-5 h-5 ${stat.color} mb-3`} />
                      <p className="text-[10px] font-bold tracking-widest text-secondary uppercase">{stat.label}</p>
                      <p className="text-xl font-serif font-bold text-on-surface mt-1">{stat.value}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-3xl overflow-hidden luxury-shadow">
                  <div className="px-6 py-4 border-b border-outline-variant/10">
                    <h3 className="font-serif text-headline-sm text-on-surface">Property Listings</h3>
                  </div>
                  <div className="divide-y divide-outline-variant/10">
                    {(listings as any[]).length === 0 ? (
                      <div className="p-12 text-center">
                        <Globe className="w-12 h-12 text-primary/30 mx-auto mb-3" />
                        <p className="text-sm text-secondary">No properties listed yet.</p>
                        <button
                          onClick={() => handleSectionChange('wizard')}
                          className="mt-4 px-5 py-2.5 bg-primary text-white font-bold text-sm rounded-xl hover:bg-primary-dark transition-colors inline-flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Add Your First Property
                        </button>
                      </div>
                    ) : (
                      (listings as any[]).map((listing: any) => (
                        <div key={listing.id} className="p-5 hover:bg-surface-container-low/50 transition-colors">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
                                {listing.image ? (
                                  <img src={listing.image} alt={listing.title} className="w-full h-full object-cover" />
                                ) : (
                                  <Globe className="w-8 h-8 text-primary" />
                                )}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-bold text-on-surface text-lg">{listing.title}</h4>
                                <div className="flex items-center gap-2 mt-1 text-xs text-secondary">
                                  <MapPin className="w-3 h-3" />
                                  <span>{listing.location}</span>
                                  <span>•</span>
                                  <span>{listing.bedrooms} bed</span>
                                  <span>•</span>
                                  <span>{listing.bathrooms} bath</span>
                                </div>
                                <div className="flex items-center gap-3 mt-2">
                                  <span className="font-bold text-primary">₦{listing.nightlyRate?.toLocaleString()}/night</span>
                                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                    listing.isActive ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                  }`}>
                                    {listing.isActive ? 'Active' : 'Inactive'}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleToggleListingStatus(listing)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 ${
                                  listing.isActive
                                    ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                                }`}
                              >
                                {listing.isActive ? <><XCircle className="w-3.5 h-3.5" /> Deactivate</> : <><CheckCircle className="w-3.5 h-3.5" /> Activate</>}
                              </button>
                              <button
                                onClick={() => { setSelectedListing(listing); setShowEditModal(true); }}
                                className="px-4 py-2 bg-primary/10 text-primary rounded-lg text-xs font-bold hover:bg-primary/20 transition-colors flex items-center gap-1"
                              >
                                <Edit3 className="w-3.5 h-3.5" /> Edit
                              </button>
                              <button
                                onClick={() => { setSelectedListing(listing); setShowDeleteConfirm(true); }}
                                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-xs font-bold hover:bg-red-200 transition-colors flex items-center gap-1"
                              >
                                <XCircle className="w-3.5 h-3.5" /> Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === 'wizard' && (
              <motion.div key="wizard" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                <ListingWizardView
                  onPublishListing={handlePublishListing}
                  onCancel={() => handleSectionChange('listings')}
                />
              </motion.div>
            )}

            {(activeSection === 'schedule' || activeSection === 'calendar') && (
              <motion.div key="schedule" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <span className="font-label-caps text-primary mb-2 block">SCHEDULE MANAGEMENT</span>
                    <h1 className="font-serif text-headline-lg text-on-surface">Calendar & Bookings</h1>
                  </div>
                  <div className="flex gap-3">
                    <Tooltip content="Download Schedule">
                      <button 
                        onClick={handleExportCalendar}
                        className="px-5 py-2.5 bg-surface-container-lowest border border-outline-variant/30 rounded-lg text-body-md font-semibold text-on-surface hover:bg-surface-container-low transition-colors flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" /> Export
                      </button>
                    </Tooltip>
                  </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  {[
                    { label: "Today's Bookings", value: activeBookings.filter((b: any) => b.checkIn === new Date().toISOString().split('T')[0]).length || '3', icon: Calendar, color: 'text-primary' },
                    { label: 'This Week', value: activeBookings.length.toString(), icon: CalendarDays, color: 'text-green-600' },
                    { label: 'Pending', value: pendingBookings.length.toString(), icon: Clock, color: 'text-error' },
                    { label: 'Completion Rate', value: '94%', icon: CheckCircle, color: 'text-primary' },
                  ].map((stat, i) => (
                    <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                      className="glass-card p-5 rounded-2xl border border-outline-variant/10 luxury-shadow">
                      <stat.icon className={`w-5 h-5 ${stat.color} mb-3`} />
                      <p className="text-[10px] font-bold tracking-widest text-secondary uppercase">{stat.label}</p>
                      <p className="text-xl font-serif font-bold text-on-surface mt-1">{stat.value}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-3xl overflow-hidden luxury-shadow mb-8">
                  <div className="px-6 py-4 border-b border-outline-variant/10 flex justify-between items-center">
                    <h3 className="font-serif text-headline-sm text-on-surface">
                      {calendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-7 gap-1 text-center mb-2">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                        <div key={d} className="text-[10px] font-bold text-secondary uppercase py-2">{d}</div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {calendarDays.map((day, idx) => {
                        const dateStr = day ? `${calendarMonth.getFullYear()}-${String(calendarMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` : '';
                        const isBooked = bookedDates.has(dateStr);
                        const isToday = day === new Date().getDate() && calendarMonth.getMonth() === new Date().getMonth();
                        return (
                          <div key={idx} className={`aspect-square flex items-center justify-center rounded-lg text-sm transition-colors ${
                            !day ? '' :
                            isToday ? 'bg-primary text-on-primary font-bold' :
                            isBooked ? 'bg-primary/10 text-primary font-bold' :
                            'hover:bg-surface-container text-on-surface cursor-pointer'
                          }`}>
                            {day}
                            {isBooked && <div className="absolute bottom-1 w-1 h-1 rounded-full bg-primary" />}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-3xl overflow-hidden luxury-shadow">
                  <div className="px-6 py-4 border-b border-outline-variant/10">
                    <h3 className="font-serif text-headline-sm text-on-surface">Upcoming Bookings</h3>
                  </div>
                  <div className="divide-y divide-outline-variant/10">
                    {activeBookings.slice(0, 8).map((booking: any, idx: number) => (
                      <div key={booking.id || idx} className="p-5 hover:bg-surface-container-low/50 transition-colors flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <p className="font-bold text-on-surface">{booking.guestName || 'Guest'}</p>
                            <p className="text-xs text-secondary">{booking.listingTitle || 'Property'} • {booking.checkIn || 'TBD'} → {booking.checkOut}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-primary text-sm">₦{(booking.totalAmount || 0).toLocaleString()}</span>
                          <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
                            booking.status === 'confirmed' || booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    ))}
                    {activeBookings.length === 0 && (
                      <div className="p-12 text-center text-secondary italic text-sm">No upcoming bookings.</div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === 'booking-requests' && (
              <motion.div key="booking-requests" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                <header className="mb-8">
                  <h1 className="font-serif text-headline-lg text-on-surface">Booking Requests</h1>
                  <p className="text-secondary font-body-lg mt-2">Review and approve booking requests from guests</p>
                </header>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  {[
                    { label: 'Pending Approval', value: pendingBookings.length, icon: Clock, color: 'text-amber-600' },
                    { label: 'Confirmed', value: activeBookings.filter((b: any) => b.status === 'Confirmed' || b.status === 'confirmed').length, icon: CheckCircle, color: 'text-green-600' },
                    { label: 'Total Revenue', value: `₦${(totalEarnings / 1000000).toFixed(1)}M`, icon: DollarSign, color: 'text-primary' },
                    { label: 'Avg Response Time', value: '2.4h', icon: Star, color: 'text-primary' },
                  ].map((stat, i) => (
                    <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                      className="glass-card p-5 rounded-2xl border border-outline-variant/10 luxury-shadow">
                      <stat.icon className={`w-5 h-5 ${stat.color} mb-3`} />
                      <p className="text-[10px] font-bold tracking-widest text-secondary uppercase">{stat.label}</p>
                      <p className="text-xl font-serif font-bold text-on-surface mt-1">{stat.value}</p>
                    </motion.div>
                  ))}
                </div>
                <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-3xl overflow-hidden luxury-shadow">
                  <div className="px-6 py-4 border-b border-outline-variant/10">
                    <h3 className="font-serif text-headline-sm text-on-surface">Pending Requests</h3>
                  </div>
                  <div className="divide-y divide-outline-variant/10">
                    {pendingBookings.length === 0 ? (
                      <div className="p-12 text-center">
                        <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                        <p className="text-sm text-secondary">All caught up! No pending requests.</p>
                      </div>
                    ) : (
                      pendingBookings.slice(0, 10).map((booking: any) => (
                        <div key={booking.id} className="p-5 hover:bg-surface-container-low/50 transition-colors">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                <Calendar className="w-6 h-6 text-primary" />
                              </div>
                              <div>
                                <h4 className="font-bold text-on-surface">{booking.listingTitle}</h4>
                                <p className="text-xs text-secondary mt-1">{booking.guestName} • {booking.guestEmail}</p>
                                <div className="flex items-center gap-3 mt-2 text-xs text-secondary">
                                  <span>{booking.checkIn} → {booking.checkOut}</span>
                                  <span>•</span>
                                  <span>{booking.guestsCount} guests</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <span className="font-bold text-primary text-lg">₦{(booking.totalAmount || 0).toLocaleString()}</span>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => { setSelectedBookingForAction(booking); setShowBookingConfirm(booking.id); }}
                                  className="px-4 py-2 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 transition-colors flex items-center gap-1"
                                >
                                  <CheckCircle className="w-3.5 h-3.5" /> Approve
                                </button>
                                <button
                                  onClick={() => { setSelectedBookingForAction(booking); setShowBookingReject(booking.id); }}
                                  className="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition-colors flex items-center gap-1"
                                >
                                  <XCircle className="w-3.5 h-3.5" /> Decline
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === 'earnings' && (
              <motion.div key="earnings" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <span className="font-label-caps text-primary mb-2 block">FINANCIAL OVERVIEW</span>
                    <h1 className="font-serif text-headline-lg text-on-surface">Earnings & Payouts</h1>
                  </div>
                  <div className="flex gap-3">
                    <Tooltip content="Download Statement">
                      <button className="px-5 py-2.5 bg-surface-container-lowest border border-outline-variant/30 rounded-lg text-body-md font-semibold text-on-surface hover:bg-surface-container-low transition-colors flex items-center gap-2">
                        <Download className="w-4 h-4" /> Statement
                      </button>
                    </Tooltip>
                    <Tooltip content="Request Withdrawal">
                      <button 
                        onClick={() => setShowWithdrawalModal(true)}
                        className="px-5 py-2.5 bg-primary text-on-primary rounded-lg text-body-md font-bold hover:bg-primary/90 transition-colors flex items-center gap-2"
                      >
                        <DollarSign className="w-4 h-4" /> Withdraw
                      </button>
                    </Tooltip>
                  </div>
                </header>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  {[
                    { label: 'Total Earnings', value: `₦${(totalEarnings / 1000000).toFixed(1)}M`, icon: DollarSign, color: 'text-green-600' },
                    { label: 'Pending Payout', value: '₦450K', icon: Clock, color: 'text-primary' },
                    { label: 'This Month', value: '₦1.2M', icon: TrendingUp, color: 'text-primary' },
                    { label: 'Avg. Per Booking', value: '₦85K', icon: Star, color: 'text-primary' },
                  ].map((stat, i) => (
                    <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                      className="glass-card p-5 rounded-2xl border border-outline-variant/10 luxury-shadow">
                      <stat.icon className={`w-5 h-5 ${stat.color} mb-3`} />
                      <p className="text-[10px] font-bold tracking-widest text-secondary uppercase">{stat.label}</p>
                      <p className="text-xl font-serif font-bold text-on-surface mt-1">{stat.value}</p>
                    </motion.div>
                  ))}
                </div>
                <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-3xl overflow-hidden luxury-shadow">
                  <div className="px-6 py-4 border-b border-outline-variant/10">
                    <h3 className="font-serif text-headline-sm text-on-surface">Recent Transactions</h3>
                  </div>
                  <div className="divide-y divide-outline-variant/10">
                    {(transactions as any[]).slice(0, 10).map((tx: any, idx: number) => (
                      <div key={tx.id || idx} className="p-5 hover:bg-surface-container-low/50 transition-colors flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-bold text-on-surface text-sm">{tx.description || tx.type || 'Payment'}</p>
                            <p className="text-[10px] text-secondary font-mono">{tx.reference || ''} • {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : 'Recent'}</p>
                          </div>
                        </div>
                        <span className="font-bold text-green-600">+₦{(tx.amount || 0).toLocaleString()}</span>
                      </div>
                    ))}
                    {(transactions as any[]).length === 0 && (
                      <div className="p-12 text-center text-secondary italic text-sm">No transactions yet.</div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === 'inventory' && (
              <motion.div key="inventory" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <h1 className="font-serif text-headline-lg text-on-surface">Inventory & Staff</h1>
                    <p className="text-secondary font-body-lg mt-2">Manage equipment, assets, and staff assignments</p>
                  </div>
                  <button onClick={() => setShowAssetModal(true)} className="px-5 py-2.5 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2">
                    <Package className="w-4 h-4" /> Add Asset
                  </button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {[
                    { label: 'Total Assets', value: '24', icon: Package, color: 'text-primary' },
                    { label: 'In Use', value: '18', icon: CheckCircle, color: 'text-green-600' },
                    { label: 'Available', value: '6', icon: Clock, color: 'text-amber-600' },
                  ].map((stat) => (
                    <div key={stat.label} className="glass-card p-6 rounded-2xl luxury-shadow">
                      <stat.icon className={`w-6 h-6 ${stat.color} mb-3`} />
                      <p className="text-[10px] font-bold tracking-widest text-secondary uppercase">{stat.label}</p>
                      <p className={`text-3xl font-serif font-bold mt-1 ${stat.color}`}>{stat.value}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-3xl overflow-hidden luxury-shadow">
                    <div className="px-6 py-4 border-b border-outline-variant/10">
                      <h3 className="font-serif text-headline-sm text-on-surface">Equipment Inventory</h3>
                    </div>
                    <div className="divide-y divide-outline-variant/10">
                      {[
                        { name: 'Luxury Sedan - Mercedes S-Class', status: 'in_use', assignedTo: 'Captain Chidi Okoro' },
                        { name: 'Professional Camera Kit', status: 'available', assignedTo: null },
                        { name: 'Yacht - 65ft Executive Boat', status: 'in_use', assignedTo: 'Yacht Leila' },
                        { name: 'Security Equipment Set', status: 'in_use', assignedTo: 'Adebayo Security' },
                        { name: 'Chef Kitchen Tools', status: 'available', assignedTo: null },
                      ].map((item, idx) => (
                        <div key={idx} className="p-5 hover:bg-surface-container-low/50 transition-colors flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                              <Package className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-bold text-on-surface text-sm">{item.name}</p>
                              {item.assignedTo && (
                                <p className="text-[10px] text-secondary mt-1">Assigned to: {item.assignedTo}</p>
                              )}
                            </div>
                          </div>
                          <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
                            item.status === 'in_use' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {item.status === 'in_use' ? 'In Use' : 'Available'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-3xl overflow-hidden luxury-shadow">
                    <div className="px-6 py-4 border-b border-outline-variant/10">
                      <h3 className="font-serif text-headline-sm text-on-surface">Staff Assignments</h3>
                    </div>
                    <div className="divide-y divide-outline-variant/10">
                      {staff.map((staffMember) => {
                        const badge = getStatusBadge(staffMember.status);
                        return (
                          <div key={staffMember.id} className="p-5 hover:bg-surface-container-low/50 transition-colors">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm">{staffMember.initials}</div>
                                <div>
                                  <p className="font-bold text-on-surface text-sm">{staffMember.name}</p>
                                  <p className="text-[10px] text-secondary capitalize">{staffMember.role}</p>
                                </div>
                              </div>
                              <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${badge.bg} ${badge.text}`}>{badge.label}</span>
                            </div>
                            {staffMember.currentAssignment && (
                              <div className="ml-13 pl-13 border-l-2 border-primary/20">
                                <p className="text-xs text-secondary">Currently assigned to: <span className="font-semibold text-primary">{staffMember.currentAssignment}</span></p>
                              </div>
                            )}
                            <button className="mt-3 w-full px-3 py-1.5 border border-primary text-primary rounded-lg text-[10px] font-bold uppercase hover:bg-primary hover:text-on-primary transition-all">
                              {staffMember.currentAssignment ? 'Reassign' : 'Assign Task'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === 'tasks' && (
              <motion.div key="tasks" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                <SPTaskManagement providerId={currentUser?.id || 'sp-default'} />
              </motion.div>
            )}

            {activeSection === 'staff' && (
              <motion.div key="staff" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                <StaffManagement />
              </motion.div>
            )}

            {activeSection === 'transactions' && (
              <motion.div key="transactions" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                <TransactionDownload />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => { setShowDeleteConfirm(false); setSelectedListing(null); }}
        onConfirm={handleDeleteListing}
        title="Delete Property"
        message={`Are you sure you want to permanently delete "${selectedListing?.title}"? This action cannot be undone.`}
        confirmLabel="Delete Property"
        variant="danger"
      />

      <EditModal
        isOpen={showEditModal}
        onClose={() => { setShowEditModal(false); setSelectedListing(null); }}
        onSave={handleEditListing}
        title="Edit Property"
        fields={listingEditFields}
        initialData={selectedListing ? {
          title: selectedListing.title || '',
          description: selectedListing.description || '',
          nightlyRate: selectedListing.nightlyRate || 0,
          securityDeposit: selectedListing.securityDeposit || 0,
          bedrooms: selectedListing.bedrooms || 0,
          bathrooms: selectedListing.bathrooms || 0,
          maxGuests: selectedListing.maxGuests || 0,
          isActive: selectedListing.isActive ?? true,
        } : {}}
      />

      <StaffAssignModal
        isOpen={showAssignModal}
        onClose={() => { setShowAssignModal(false); setSelectedBookingForAction(null); }}
        onAssign={handleAssignStaffToBooking}
        staff={staff}
        bookingInfo={selectedBookingForAction ? {
          title: selectedBookingForAction.listingTitle || 'Booking',
          guestName: selectedBookingForAction.guestName || 'Guest',
          date: selectedBookingForAction.checkIn || 'TBD',
        } : undefined}
      />

      <AssetCreateModal
        isOpen={showAssetModal}
        onClose={() => setShowAssetModal(false)}
        onCreate={handleCreateAsset}
      />

      <ServiceCreateModal
        isOpen={showServiceModal}
        onClose={() => { setShowServiceModal(false); setEditingService(null); }}
        onSubmit={editingService ? handleUpdateService : handleCreateService}
        initialData={editingService || undefined}
        mode={editingService ? 'edit' : 'create'}
      />

      <HelpSupportModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
      />

      <ConfirmDialog
        isOpen={!!showBookingConfirm}
        onClose={() => { setShowBookingConfirm(null); setSelectedBookingForAction(null); }}
        onConfirm={() => selectedBookingForAction && handleConfirmBooking(selectedBookingForAction)}
        title="Confirm Booking"
        message={`Confirm booking for ${selectedBookingForAction?.guestName || 'guest'} - ${selectedBookingForAction?.listingTitle || 'property'}?`}
        confirmLabel="Confirm Booking"
        variant="success"
      />

      <ConfirmDialog
        isOpen={!!showBookingReject}
        onClose={() => { setShowBookingReject(null); setSelectedBookingForAction(null); }}
        onConfirm={() => selectedBookingForAction && handleRejectBooking(selectedBookingForAction)}
        title="Decline Booking"
        message={`Decline booking for ${selectedBookingForAction?.guestName || 'guest'} - ${selectedBookingForAction?.listingTitle || 'property'}?`}
        confirmLabel="Decline Booking"
        variant="danger"
      />

      <AnimatePresence>
        {showWithdrawalModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            onClick={() => setShowWithdrawalModal(false)}
          >
            <div className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md bg-parchment rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="sticky top-0 bg-parchment border-b border-charcoal/10 px-6 py-4 flex items-center justify-between">
                <h2 className="font-serif text-xl font-bold text-charcoal">Request Withdrawal</h2>
                <button onClick={() => setShowWithdrawalModal(false)} className="p-2 hover:bg-charcoal/5 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-charcoal/60" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="bg-gold/5 border border-gold/10 rounded-lg p-4">
                  <p className="text-xs text-charcoal/60">
                    <span className="font-bold">Available Balance:</span> ₦{(totalEarnings / 1000000).toFixed(1)}M
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-2">Amount (₦)</label>
                  <input
                    type="number"
                    value={withdrawalAmount}
                    onChange={(e) => setWithdrawalAmount(e.target.value)}
                    placeholder="Enter amount..."
                    className="w-full px-4 py-2 bg-white border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                    disabled={isProcessing}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-2">Withdrawal Method</label>
                  <select
                    value={withdrawalMethod}
                    onChange={(e) => setWithdrawalMethod(e.target.value)}
                    className="w-full px-4 py-2 bg-white border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                    disabled={isProcessing}
                  >
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="mobile_money">Mobile Money</option>
                    <option value="paypal">PayPal</option>
                  </select>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                  <p className="text-xs text-charcoal/60">
                    <span className="font-bold">Note:</span> Withdrawals are processed within 1-3 business days. Minimum withdrawal amount is ₦10,000.
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowWithdrawalModal(false)}
                    disabled={isProcessing}
                    className="flex-1 py-3 border border-charcoal/10 text-charcoal font-bold text-xs uppercase rounded-lg hover:bg-charcoal/5 transition-all disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleWithdrawal}
                    disabled={isProcessing || !withdrawalAmount || parseFloat(withdrawalAmount) <= 0}
                    className="flex-[2] py-3 bg-gold text-charcoal font-bold text-xs uppercase rounded-lg hover:bg-gold-dark transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-charcoal/30 border-t-charcoal rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <DollarSign className="w-4 h-4" />
                        Request Withdrawal
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ToastContainer />
    </div>
  );
}
