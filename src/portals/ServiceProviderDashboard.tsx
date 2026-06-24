import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard, Calendar, Users, Package, ConciergeBell,
  Search, Bell, Settings, Grid3X3,
  CheckCircle, XCircle, MoreHorizontal, Eye, Edit3, TrendingUp, DollarSign,
  Utensils, Car, Camera, ShieldCheck, Key, Radio, Zap, AlertTriangle,
  UserCheck, CalendarDays, Download,
  Sparkles, Briefcase, Award, UserCircle, ChevronDown, X, Menu,
  Clock, Star, MapPin, ArrowRight, Filter, DollarSign as DollarIcon,
  BarChart3, PieChart, Activity, ChevronRight
} from 'lucide-react';
import { useAuth } from '../auth';
import { useDatabase } from '../hooks/useDatabase';
import CollapsibleSidebar from '../components/ui/CollapsibleSidebar';
import Tooltip from '../components/ui/Tooltip';

type ProviderSection = 'overview' | 'service-dashboard' | 'listings' | 'my-services' | 'schedule' | 'calendar' | 'earnings' | 'inventory' | 'booking-requests';

const MOCK_STAFF = [
  { id: 's1', name: 'Captain Chidi Okoro', role: 'driver', status: 'on_duty', initials: 'CO', certifications: ['MCA MASTER 3000GT', 'VIP PROTOCOL'], specializations: ['Maritime', 'VIP Transport'], rating: 4.8, availabilityFrom: '22:00', currentAssignment: 'Yacht Leila', tenureYears: 6 },
  { id: 's2', name: 'Chef Tunde Balogun', role: 'chef', status: 'available', initials: 'TB', certifications: ['Culinary Arts', 'Food Safety'], specializations: ['Afro-Fusion', 'Michelin Strategy'], rating: 4.9, availabilityFrom: 'Now', currentAssignment: undefined, tenureYears: 8 },
  { id: 's3', name: 'Amara Nwosu', role: 'concierge', status: 'off_duty', initials: 'AN', certifications: ['Hospitality Mgmt'], specializations: ['Multilingual', 'Event Planning'], rating: 4.7, availabilityFrom: 'Tomorrow', currentAssignment: undefined, tenureYears: 8 },
  { id: 's4', name: 'Adebayo Security', role: 'security', status: 'on_duty', initials: 'AS', certifications: ['Armed Escort', 'CCTV Ops'], specializations: ['VIP Protection', 'Asset Security'], rating: 4.6, availabilityFrom: 'Now', currentAssignment: 'Banana Island Villa', tenureYears: 4 },
];

const MOCK_MY_SERVICES = [
  { id: 'ms1', title: 'VIP Airport Pickup', category: 'Transport', bookings: 24, rating: 4.9, revenue: 4320000, status: 'active', icon: Car },
  { id: 'ms2', title: 'Private Chef Experience', category: 'Culinary', bookings: 18, rating: 4.8, revenue: 2700000, status: 'active', icon: Utensils },
  { id: 'ms3', title: 'Security Escort', category: 'Security', bookings: 12, rating: 4.7, revenue: 1800000, status: 'active', icon: ShieldCheck },
  { id: 'ms4', title: 'Photography Session', category: 'Media', bookings: 8, rating: 4.9, revenue: 960000, status: 'paused', icon: Camera },
];

export default function ServiceProviderDashboard() {
  const { currentUser, logout } = useAuth();
  const [activeSection, setActiveSection] = useState<ProviderSection>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
  const [calendarMonth] = useState(new Date());

  const { data: bookings } = useDatabase('bookings');
  const { data: transactions } = useDatabase('transactions');
  const { data: listings, removeRecord: removeListing, addRecord: updateListing } = useDatabase('listings');

  const totalEarnings = (transactions as any[]).reduce((sum: number, t: any) => sum + (t.amount || 0), 0);
  const activeBookings = (bookings as any[]).filter((b: any) => b.status === 'confirmed' || b.status === 'Confirmed' || b.status === 'Pending');
  const pendingBookings = (bookings as any[]).filter((b: any) => b.status === 'Pending' || b.status === 'pending');
  const unassignedBookings = (bookings as any[]).filter((b: any) => !b.providerId || b.providerAssignmentStatus === 'unassigned');

  const filteredStaff = useMemo(() => {
    if (!searchQuery) return MOCK_STAFF;
    return MOCK_STAFF.filter(s =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const onDutyCount = MOCK_STAFF.filter(s => s.status === 'on_duty').length;

  const handleLogout = () => logout();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'on_duty': return { bg: 'bg-green-100', text: 'text-green-700', label: 'ON-DUTY' };
      case 'available': return { bg: 'bg-primary-container/20', text: 'text-primary', label: 'AVAILABLE' };
      case 'off_duty': return { bg: 'bg-error/10', text: 'text-error', label: 'OFF-DUTY' };
      default: return { bg: 'bg-surface-container', text: 'text-secondary', label: status.toUpperCase() };
    }
  };

  const handleAssignStaff = (bookingId: string, staffId: string) => {
    const staff = MOCK_STAFF.find(s => s.id === staffId);
    if (staff) {
      setSelectedStaff(null);
    }
  };

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
        setActiveTab={setActiveSection as any}
        userRole="service_provider"
        onLogout={handleLogout}
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
          <div className="flex items-center gap-2 md:gap-6">
            <Tooltip content="Notifications" description="View alerts and updates">
              <button className="p-2 text-secondary hover:text-primary cursor-pointer transition-colors relative">
                <Bell className="w-5 h-5" />
                {pendingBookings.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full" />}
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
                    <p className="text-secondary font-body-lg max-w-2xl">Manage your services, bookings, and staff.</p>
                  </div>
                  <div className="glass-card px-6 py-3 rounded-xl flex items-center gap-4">
                    <div className="text-right border-r border-outline-variant/30 pr-4">
                      <div className="text-[10px] text-outline font-label-caps">ON-DUTY</div>
                      <div className="text-xl font-bold text-primary">{onDutyCount}/{MOCK_STAFF.length}</div>
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
                    { label: 'Service Rating', value: '4.9', icon: Star, color: 'text-primary' },
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
                      {unassignedBookings.length > 0 && <span className="bg-error/10 text-error px-2 py-0.5 rounded text-[10px] font-bold">NEED ASSIGNMENT</span>}
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
                            {booking.services && <span>• {booking.services.length} services</span>}
                          </div>
                          <Tooltip content="Assign Staff" description="Assign a service provider">
                            <button
                              onClick={() => setSelectedStaff(booking.id)}
                              className="text-primary font-bold text-xs flex items-center gap-1 hover:gap-2 transition-all">
                              ASSIGN <ArrowRight className="w-3 h-3" />
                            </button>
                          </Tooltip>
                        </div>

                        <AnimatePresence>
                          {selectedStaff === booking.id && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                              className="mt-3 pt-3 border-t border-outline-variant/10 space-y-2">
                              <p className="text-[10px] font-bold text-secondary uppercase tracking-widest">Select Staff</p>
                              {MOCK_STAFF.filter(s => s.status !== 'off_duty').map(staff => (
                                <button key={staff.id} onClick={() => handleAssignStaff(booking.id, staff.id)}
                                  className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-surface-container transition-colors text-left">
                                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                                    {staff.initials}
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-xs font-bold text-on-surface">{staff.name}</p>
                                    <p className="text-[9px] text-secondary capitalize">{staff.role}</p>
                                  </div>
                                  <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full ${getStatusBadge(staff.status).bg} ${getStatusBadge(staff.status).text}`}>
                                    {getStatusBadge(staff.status).label}
                                  </span>
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredStaff.map((staff) => {
                        const statusBadge = getStatusBadge(staff.status);
                        return (
                          <motion.div key={staff.id} whileHover={{ y: -4 }}
                            className="glass-card rounded-3xl overflow-hidden flex flex-col group luxury-shadow">
                            <div className="relative h-40 bg-gradient-to-br from-primary/20 via-surface-container to-surface-container-high overflow-hidden flex items-center justify-center">
                              <div className="w-16 h-16 rounded-full bg-primary-container/30 flex items-center justify-center">
                                <span className="text-xl font-serif font-bold text-primary">{staff.initials}</span>
                              </div>
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                              <div className="absolute bottom-3 left-4">
                                <h3 className="text-white font-serif text-lg">{staff.name}</h3>
                                <div className="flex items-center gap-2">
                                  <span className={`w-2 h-2 rounded-full ${staff.status === 'on_duty' ? 'bg-primary animate-pulse' : staff.status === 'available' ? 'bg-green-400' : 'bg-secondary'}`} />
                                  <span className="text-primary-container text-[10px] font-bold uppercase tracking-widest">
                                    {staff.currentAssignment ? `ON-DUTY: ${staff.currentAssignment}` : statusBadge.label}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="p-5">
                              <div className="grid grid-cols-2 gap-3 mb-4">
                                <div>
                                  <p className="text-[10px] text-outline font-label-caps mb-1">CERTIFICATIONS</p>
                                  <div className="flex flex-wrap gap-1">
                                    {staff.certifications.slice(0, 2).map(cert => (
                                      <span key={cert} className="bg-surface-container-high px-2 py-0.5 rounded text-[9px] font-bold">{cert}</span>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <p className="text-[10px] text-outline font-label-caps mb-1">RATING</p>
                                  <div className="flex items-center gap-1 text-primary">
                                    <Star className="w-3.5 h-3.5 fill-current" />
                                    <span className="text-xs font-bold">{staff.rating} / 5.0</span>
                                  </div>
                                </div>
                              </div>
                              <button className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${
                                staff.status === 'available' ? 'bg-on-surface text-white hover:bg-primary' : 'border border-primary text-primary hover:bg-primary hover:text-on-primary'
                              }`}>
                                {staff.status === 'available' ? 'Assign to Task' : 'Reassign'}
                              </button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </section>
                </div>
              </motion.div>
            )}

            {activeSection === 'listings' && (
              <motion.div key="listings" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <h1 className="font-serif text-headline-lg text-on-surface">My Properties</h1>
                    <p className="text-secondary font-body-lg mt-2">Manage your listed properties and availability</p>
                  </div>
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
                        <p className="text-xs text-secondary mt-1">Start by adding your first property listing.</p>
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
                                onClick={() => {
                                  updateListing({ ...listing, isActive: !listing.isActive } as any);
                                }}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 ${
                                  listing.isActive
                                    ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                                }`}
                              >
                                {listing.isActive ? (
                                  <>
                                    <XCircle className="w-3.5 h-3.5" /> Deactivate
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="w-3.5 h-3.5" /> Activate
                                  </>
                                )}
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm('Are you sure you want to delete this property?')) {
                                    removeListing(listing.id);
                                  }
                                }}
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

            {activeSection === 'my-services' && (
              <motion.div key="my-services" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                <header className="mb-8">
                  <h1 className="font-serif text-headline-lg text-on-surface">My Services</h1>
                  <p className="text-secondary font-body-lg mt-2">Manage your service offerings and track performance</p>
                </header>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {[
                    { label: 'Active Services', value: MOCK_MY_SERVICES.filter(s => s.status === 'active').length, icon: Briefcase, color: 'text-primary' },
                    { label: 'Total Bookings', value: MOCK_MY_SERVICES.reduce((s, ms) => s + ms.bookings, 0), icon: Calendar, color: 'text-green-600' },
                    { label: 'Avg Rating', value: (MOCK_MY_SERVICES.reduce((s, ms) => s + ms.rating, 0) / MOCK_MY_SERVICES.length).toFixed(1), icon: Star, color: 'text-primary' },
                    { label: 'Total Revenue', value: `₦${(MOCK_MY_SERVICES.reduce((s, ms) => s + ms.revenue, 0) / 1000000).toFixed(1)}M`, icon: DollarSign, color: 'text-green-600' },
                  ].map((stat, i) => (
                    <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                      className="glass-card p-5 rounded-2xl border border-outline-variant/10 luxury-shadow">
                      <stat.icon className={`w-5 h-5 ${stat.color} mb-3`} />
                      <p className="text-[10px] font-bold tracking-widest text-secondary uppercase">{stat.label}</p>
                      <p className="text-xl font-serif font-bold text-on-surface mt-1">{stat.value}</p>
                    </motion.div>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {MOCK_MY_SERVICES.map((service) => (
                    <motion.div key={service.id} whileHover={{ y: -2 }}
                      className="glass-card p-6 rounded-2xl border border-outline-variant/10 luxury-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                            <service.icon className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-bold text-on-surface">{service.title}</h3>
                            <p className="text-xs text-secondary">{service.category}</p>
                          </div>
                        </div>
                        <span className={`text-[9px] font-bold px-2 py-1 rounded-full ${service.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                          {service.status.toUpperCase()}
                        </span>
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
                            <span className="text-lg font-bold text-on-surface">{service.rating}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] text-secondary uppercase">Revenue</p>
                          <p className="text-lg font-bold text-green-600">₦{(service.revenue / 1000).toFixed(0)}K</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
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
                      <button className="px-5 py-2.5 bg-surface-container-lowest border border-outline-variant/30 rounded-lg text-body-md font-semibold text-on-surface hover:bg-surface-container-low transition-colors flex items-center gap-2">
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
                            {booking.services && booking.services.length > 0 && (
                              <p className="text-[9px] text-primary mt-1">Services: {booking.services.join(', ')}</p>
                            )}
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
                                {booking.services && booking.services.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {booking.services.map((s: string, i: number) => (
                                      <span key={i} className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[9px] font-bold">{s}</span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <span className="font-bold text-primary text-lg">₦{(booking.totalAmount || 0).toLocaleString()}</span>
                              <div className="flex gap-2">
                                <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 transition-colors flex items-center gap-1">
                                  <CheckCircle className="w-3.5 h-3.5" /> Approve
                                </button>
                                <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition-colors flex items-center gap-1">
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
                  <button className="px-5 py-2.5 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2">
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
                      {MOCK_STAFF.map((staff) => {
                        const badge = getStatusBadge(staff.status);
                        return (
                          <div key={staff.id} className="p-5 hover:bg-surface-container-low/50 transition-colors">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm">{staff.initials}</div>
                                <div>
                                  <p className="font-bold text-on-surface text-sm">{staff.name}</p>
                                  <p className="text-[10px] text-secondary capitalize">{staff.role}</p>
                                </div>
                              </div>
                              <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${badge.bg} ${badge.text}`}>{badge.label}</span>
                            </div>
                            {staff.currentAssignment && (
                              <div className="ml-13 pl-13 border-l-2 border-primary/20">
                                <p className="text-xs text-secondary">Currently assigned to: <span className="font-semibold text-primary">{staff.currentAssignment}</span></p>
                              </div>
                            )}
                            <button className="mt-3 w-full px-3 py-1.5 border border-primary text-primary rounded-lg text-[10px] font-bold uppercase hover:bg-primary hover:text-on-primary transition-all">
                              {staff.currentAssignment ? 'Reassign' : 'Assign Task'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
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
