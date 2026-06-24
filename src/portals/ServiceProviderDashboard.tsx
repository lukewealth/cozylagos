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

type ProviderSection = 'overview' | 'service-dashboard' | 'my-services' | 'schedule' | 'calendar' | 'staffing' | 'arrivals' | 'analytics' | 'earnings' | 'inventory';

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
            <span className="font-serif text-headline-sm font-bold tracking-tight text-primary hidden md:block">My Dashboard</span>
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
                    <h1 className="font-serif text-headline-lg text-on-surface mb-2">Staff Orchestration</h1>
                    <p className="text-secondary font-body-lg max-w-2xl">Manage personnel deployments and synchronize service requests.</p>
                  </div>
                  <div className="glass-card px-6 py-3 rounded-xl flex items-center gap-4">
                    <div className="text-right border-r border-outline-variant/30 pr-4">
                      <div className="text-[10px] text-outline font-label-caps">ON-DUTY</div>
                      <div className="text-xl font-bold text-primary">{onDutyCount}/{MOCK_STAFF.length}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-outline font-label-caps">UNASSIGNED</div>
                      <div className="text-xl font-bold text-error">{unassignedBookings.length}</div>
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

            {activeSection === 'staffing' && (
              <motion.div key="staffing" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                <header className="mb-8">
                  <h1 className="font-serif text-headline-lg text-on-surface">Staffing</h1>
                  <p className="text-secondary font-body-lg mt-2">Manage team availability and assignments</p>
                </header>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {[
                    { label: 'On Duty', value: MOCK_STAFF.filter(s => s.status === 'on_duty').length, color: 'text-green-600' },
                    { label: 'Available', value: MOCK_STAFF.filter(s => s.status === 'available').length, color: 'text-primary' },
                    { label: 'Off Duty', value: MOCK_STAFF.filter(s => s.status === 'off_duty').length, color: 'text-error' },
                  ].map((stat) => (
                    <div key={stat.label} className="glass-card p-6 rounded-2xl luxury-shadow">
                      <p className="text-[10px] font-bold tracking-widest text-secondary uppercase">{stat.label}</p>
                      <p className={`text-3xl font-serif font-bold mt-1 ${stat.color}`}>{stat.value}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-3xl overflow-hidden luxury-shadow">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-surface-container-low border-b border-outline-variant/10">
                          <th className="px-6 py-4 text-label-caps text-secondary font-bold">Staff</th>
                          <th className="px-6 py-4 text-label-caps text-secondary font-bold">Role</th>
                          <th className="px-6 py-4 text-label-caps text-secondary font-bold">Status</th>
                          <th className="px-6 py-4 text-label-caps text-secondary font-bold">Rating</th>
                          <th className="px-6 py-4 text-label-caps text-secondary font-bold">Assignment</th>
                          <th className="px-6 py-4 text-label-caps text-secondary font-bold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/10">
                        {MOCK_STAFF.map((staff) => {
                          const badge = getStatusBadge(staff.status);
                          return (
                            <tr key={staff.id} className="hover:bg-surface-container-low/50 transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm">{staff.initials}</div>
                                  <div>
                                    <p className="font-bold text-on-surface text-sm">{staff.name}</p>
                                    <p className="text-[10px] text-secondary">{staff.certifications[0]}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 capitalize text-on-surface-variant text-sm">{staff.role}</td>
                              <td className="px-6 py-4">
                                <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${badge.bg} ${badge.text}`}>{badge.label}</span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-1">
                                  <Star className="w-3 h-3 text-primary fill-current" />
                                  <span className="text-sm font-bold">{staff.rating}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-on-surface-variant">{staff.currentAssignment || '—'}</td>
                              <td className="px-6 py-4 text-right">
                                <button className="px-3 py-1.5 border border-primary text-primary rounded-lg text-[10px] font-bold uppercase hover:bg-primary hover:text-on-primary transition-all">
                                  {staff.status === 'available' ? 'Assign' : 'Edit'}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === 'arrivals' && (
              <motion.div key="arrivals" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                <header className="mb-8">
                  <h1 className="font-serif text-headline-lg text-on-surface">Arrivals</h1>
                  <p className="text-secondary font-body-lg mt-2">Monitor guest arrivals and check-in status</p>
                </header>
                <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-3xl overflow-hidden luxury-shadow">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-surface-container-low border-b border-outline-variant/10">
                          <th className="px-6 py-4 text-label-caps text-secondary font-bold">Guest</th>
                          <th className="px-6 py-4 text-label-caps text-secondary font-bold">Property</th>
                          <th className="px-6 py-4 text-label-caps text-secondary font-bold">Check-in</th>
                          <th className="px-6 py-4 text-label-caps text-secondary font-bold">Services</th>
                          <th className="px-6 py-4 text-label-caps text-secondary font-bold">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/10">
                        {activeBookings.slice(0, 10).map((booking: any, idx: number) => (
                          <tr key={booking.id || idx} className="hover:bg-surface-container-low/50 transition-colors">
                            <td className="px-6 py-4">
                              <p className="font-bold text-on-surface text-sm">{booking.guestName}</p>
                              <p className="text-[10px] text-secondary">{booking.guestEmail}</p>
                            </td>
                            <td className="px-6 py-4 text-sm text-on-surface-variant">{booking.listingTitle}</td>
                            <td className="px-6 py-4 text-sm text-on-surface-variant">{booking.checkIn}</td>
                            <td className="px-6 py-4">
                              <div className="flex flex-wrap gap-1">
                                {(booking.services || []).slice(0, 3).map((s: string, i: number) => (
                                  <span key={i} className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[9px] font-bold">{s}</span>
                                ))}
                                {(!booking.services || booking.services.length === 0) && <span className="text-xs text-secondary">—</span>}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
                                booking.status === 'confirmed' || booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                              }`}>{booking.status}</span>
                            </td>
                          </tr>
                        ))}
                        {activeBookings.length === 0 && (
                          <tr><td colSpan={5} className="px-6 py-12 text-center text-secondary italic text-sm">No arrivals scheduled.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === 'analytics' && (
              <motion.div key="analytics" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                <header className="mb-8">
                  <h1 className="font-serif text-headline-lg text-on-surface">Analytics</h1>
                  <p className="text-secondary font-body-lg mt-2">Performance insights and trends</p>
                </header>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {[
                    { label: 'Total Revenue', value: `₦${(totalEarnings / 1000000).toFixed(1)}M`, icon: DollarSign, color: 'text-green-600' },
                    { label: 'Bookings Completed', value: activeBookings.filter((b: any) => b.status === 'Confirmed').length.toString(), icon: CheckCircle, color: 'text-primary' },
                    { label: 'Avg. Service Rating', value: '4.9', icon: Star, color: 'text-primary' },
                    { label: 'Staff Utilization', value: `${Math.round((onDutyCount / MOCK_STAFF.length) * 100)}%`, icon: Users, color: 'text-primary' },
                  ].map((stat, i) => (
                    <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                      className="glass-card p-6 rounded-3xl border border-outline-variant/10 luxury-shadow">
                      <stat.icon className={`w-6 h-6 ${stat.color} mb-4`} />
                      <p className="text-[10px] font-bold tracking-widest text-secondary uppercase">{stat.label}</p>
                      <p className="text-2xl font-serif font-bold text-on-surface mt-1">{stat.value}</p>
                    </motion.div>
                  ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="glass-card p-6 rounded-3xl luxury-shadow">
                    <h3 className="font-serif text-headline-sm text-on-surface mb-6">Revenue by Service</h3>
                    <div className="space-y-4">
                      {MOCK_MY_SERVICES.map(s => (
                        <div key={s.id}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-on-surface font-medium">{s.title}</span>
                            <span className="text-secondary">₦{(s.revenue / 1000).toFixed(0)}K</span>
                          </div>
                          <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${(s.revenue / Math.max(...MOCK_MY_SERVICES.map(x => x.revenue))) * 100}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="glass-card p-6 rounded-3xl luxury-shadow">
                    <h3 className="font-serif text-headline-sm text-on-surface mb-6">Booking Trends</h3>
                    <div className="space-y-4">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
                        const val = [3, 5, 4, 7, 6, 8, 4][i];
                        return (
                          <div key={day} className="flex items-center gap-3">
                            <span className="text-xs text-secondary w-8">{day}</span>
                            <div className="flex-1 h-6 bg-surface-container rounded overflow-hidden">
                              <div className="h-full bg-primary/70 rounded flex items-center px-2" style={{ width: `${val * 12}%` }}>
                                <span className="text-[9px] font-bold text-on-primary">{val}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
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
                <header className="mb-8">
                  <h1 className="font-serif text-headline-lg text-on-surface">Inventory & Equipment</h1>
                  <p className="text-secondary font-body-lg mt-2">Track assets and equipment allocation</p>
                </header>
                <div className="glass-card p-12 rounded-3xl luxury-shadow text-center">
                  <Package className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="font-serif text-headline-sm text-on-surface mb-2">Inventory Module</h3>
                  <p className="text-body-md text-secondary max-w-md">Asset management and equipment tracking is being enhanced.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
