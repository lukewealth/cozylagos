import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard, Calendar, Users, Package, ConciergeBell, HelpCircle,
  LogOut, Plus, Search, Bell, Settings, Filter, Grid3X3, ChevronLeft,
  ChevronRight, Star, MapPin, Clock, ArrowRight, GripVertical,
  CheckCircle, XCircle, MoreHorizontal, Eye, Edit3, TrendingUp, DollarSign,
  Utensils, Car, Camera, ShieldCheck, Key, Tablet, Radio, Zap, AlertTriangle,
  UserCheck, CircleDot, CalendarDays, Download, Upload, MapPin as MapPinIcon,
  Sparkles, Briefcase, Heart, Award, UserCircle, ChevronDown, X, Menu
} from 'lucide-react';
import { useAuth } from '../auth';
import { useDatabase } from '../hooks/useDatabase';
import CollapsibleSidebar from '../components/ui/CollapsibleSidebar';
import Tooltip from '../components/ui/Tooltip';

type ProviderSection = 'overview' | 'service-dashboard' | 'schedule' | 'calendar' | 'roster' | 'inventory' | 'payouts' | 'concierge';

const MOCK_STAFF = [
  { id: 's1', name: 'Captain Chidi Okoro', role: 'driver' as const, status: 'on_duty' as const, initials: 'CO', certifications: ['MCA MASTER 3000GT', 'VIP PROTOCOL'], specializations: ['Maritime', 'VIP Transport'], rating: 4.8, availabilityFrom: '22:00', currentAssignment: 'Yacht Leila', tenureYears: 6 },
  { id: 's2', name: 'Chef Tunde Balogun', role: 'chef' as const, status: 'available' as const, initials: 'TB', certifications: ['Culinary Arts', 'Food Safety'], specializations: ['Afro-Fusion', 'Michelin Strategy'], rating: 4.9, availabilityFrom: 'Now', currentAssignment: undefined, tenureYears: 8 },
  { id: 's3', name: 'Amara Nwosu', role: 'concierge' as const, status: 'off_duty' as const, initials: 'AN', certifications: ['Hospitality Mgmt'], specializations: ['Multilingual', 'Event Planning', 'Conflict Resolution'], rating: 4.7, availabilityFrom: 'Tomorrow', currentAssignment: undefined, tenureYears: 8 },
];

const MOCK_REQUESTS = [
  { id: 'r1', title: 'Yacht Arrival Reception', category: 'Concierge Experience', location: 'Victoria Island Marina', time: '14:30 Today', skills: ['Protocol', 'VIP Handling'], priority: 'urgent' as const, assignedCount: 1, requiredCount: 2 },
  { id: 'r2', title: 'Private Villa 7 Dinner', category: 'Culinary', location: 'Banana Island', time: '19:00 Today', skills: ['Sous-Chef', 'Fine-Dining'], priority: 'high' as const, assignedCount: 0, requiredCount: 1, guestName: 'Amb. Alakija' },
];

const MOCK_ASSETS = [
  { id: 'a1', name: 'Range Rover Autobiography', category: 'fleet' as const, status: 'available' as const, code: 'FLEET-77X', tags: ['V8 Engine', 'Armored G2'], lastService: '12 days ago', assignedTo: 'Unassigned' },
  { id: 'a2', name: "Executive Chef's Kit", category: 'culinary' as const, status: 'in_use' as const, code: 'KITCH-KIT4', tags: ['Damascus Steel'], lastService: 'In Active Rotation', assignedTo: 'Chef Adebayo' },
  { id: 'a3', name: 'SAT-Comms Hub G3', category: 'comms_security' as const, status: 'service_required' as const, code: 'SEC-COM09', tags: ['Battery Failure'], lastService: 'Critical Update Pending', assignedTo: 'Team Sierra' },
];

export default function ServiceProviderDashboard() {
  const { currentUser, logout } = useAuth();
  const [activeSection, setActiveSection] = useState<ProviderSection>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { data: bookings } = useDatabase('bookings');
  const { data: transactions } = useDatabase('transactions');

  const totalEarnings = (transactions as any[]).reduce((sum: number, t: any) => sum + (t.amount || 0), 0);
  const activeBookings = (bookings as any[]).filter((b: any) => b.status === 'confirmed' || b.status === 'Confirmed');

  const filteredAssets = useMemo(() => {
    if (selectedCategory === 'all') return MOCK_ASSETS;
    return MOCK_ASSETS.filter(a => a.category === selectedCategory);
  }, [selectedCategory]);

  const onDutyCount = MOCK_STAFF.filter(s => s.status === 'on_duty').length;
  const pendingTasks = MOCK_REQUESTS.filter(r => r.priority === 'urgent' || r.priority === 'high').length;

  const handleLogout = () => {
    logout();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'on_duty': return { bg: 'bg-green-100', text: 'text-green-700', label: 'ON-DUTY' };
      case 'available': return { bg: 'bg-primary-container/20', text: 'text-primary', label: 'AVAILABLE' };
      case 'off_duty': return { bg: 'bg-error/10', text: 'text-error', label: 'OFF-DUTY' };
      default: return { bg: 'bg-surface-container', text: 'text-secondary', label: status.toUpperCase() };
    }
  };

  const getAssetStatusBadge = (status: string) => {
    switch (status) {
      case 'available': return { bg: 'bg-green-100', text: 'text-green-700', label: 'Available' };
      case 'in_use': return { bg: 'bg-primary-container/20', text: 'text-primary', label: 'In-Use' };
      case 'service_required': return { bg: 'bg-error-container', text: 'text-error', label: 'Service Required' };
      default: return { bg: 'bg-surface-container', text: 'text-secondary', label: status };
    }
  };

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
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 rounded-lg hover:bg-surface-container text-secondary transition-colors lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </button>
            </Tooltip>
            <span className="font-serif text-headline-sm font-bold tracking-tight text-primary hidden md:block">Elite Orchestrator</span>
            <nav className="hidden lg:flex gap-8 items-center h-full">
              {['Calendar', 'Staffing', 'Arrivals', 'Analytics'].map((item, i) => (
                <button
                  key={item}
                  className={`text-secondary hover:text-primary transition-colors font-body-md text-body-md ${i === 1 ? 'text-primary font-semibold border-b-2 border-primary h-full flex items-center' : ''}`}
                >
                  {item}
                </button>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2 md:gap-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
              <input
                className="pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-full text-sm focus:ring-1 focus:ring-primary w-48 lg:w-64 focus:outline-none"
                placeholder="Search staff or assets..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Tooltip content="Notifications" description="View alerts and updates">
              <button className="p-2 text-secondary hover:text-primary cursor-pointer transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full" />
              </button>
            </Tooltip>
            <Tooltip content="Settings" description="Configure preferences">
              <button className="p-2 text-secondary hover:text-primary cursor-pointer transition-colors hidden md:block">
                <Settings className="w-5 h-5" />
              </button>
            </Tooltip>
            <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant/30 bg-primary-container/20 flex items-center justify-center">
              <UserCircle className="w-5 h-5 text-primary" />
            </div>
          </div>
        </header>

        <div className="pt-8 pb-16 px-20 max-w-[1440px]">
          <AnimatePresence mode="wait">
            {(activeSection === 'overview' || activeSection === 'service-dashboard') && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div>
                    <h1 className="font-serif text-headline-lg text-on-surface mb-2">Staff Orchestration</h1>
                    <p className="text-secondary font-body-lg max-w-2xl">Manage elite personnel deployments and synchronize service requests for the Lagos coastal estate.</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="glass-card px-6 py-3 rounded-xl flex items-center gap-4">
                      <div className="text-right border-r border-outline-variant/30 pr-4">
                        <div className="text-[10px] text-outline font-label-caps">ON-DUTY STAFF</div>
                        <div className="text-xl font-bold text-primary">{onDutyCount} / {MOCK_STAFF.length}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-outline font-label-caps">PENDING TASKS</div>
                        <div className="text-xl font-bold text-error">{String(pendingTasks).padStart(2, '0')}</div>
                      </div>
                    </div>
                  </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {[
                    { label: 'Total Earnings', value: `₦${(totalEarnings / 1000000).toFixed(1)}M`, icon: DollarSign, color: 'text-green-600' },
                    { label: 'Active Bookings', value: activeBookings.length.toString(), icon: Clock, color: 'text-primary' },
                    { label: 'Service Rating', value: '4.9', icon: Star, color: 'text-primary' },
                    { label: 'New Requests', value: MOCK_REQUESTS.length.toString(), icon: Package, color: 'text-error' },
                  ].map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="glass-card p-6 rounded-3xl border border-outline-variant/10 luxury-shadow"
                    >
                      <stat.icon className={`w-6 h-6 ${stat.color} mb-4`} />
                      <p className="text-[10px] font-bold tracking-widest text-secondary uppercase">{stat.label}</p>
                      <p className="text-2xl font-serif font-bold text-on-surface mt-1">{stat.value}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <section className="lg:col-span-4 space-y-4">
                    <div className="flex items-center justify-between px-2 mb-2">
                      <h2 className="font-serif text-xl text-on-surface">Unassigned Requests</h2>
                      <span className="bg-error/10 text-error px-2 py-0.5 rounded text-[10px] font-bold">URGENT</span>
                    </div>
                    {MOCK_REQUESTS.map((req) => (
                      <motion.div
                        key={req.id}
                        whileHover={{ y: -2 }}
                        className="glass-card p-5 rounded-2xl border-l-4 border-l-primary hover:shadow-xl transition-all cursor-pointer group"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase mb-2 inline-block">{req.category}</span>
                            <h3 className="font-bold text-on-surface text-lg">{req.title}</h3>
                          </div>
                          <Tooltip content="Drag to assign" description="Assign staff to this request">
                            <GripVertical className="w-5 h-5 text-outline group-hover:text-primary transition-colors" />
                          </Tooltip>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-secondary mb-4">
                          <MapPin className="w-4 h-4" />
                          {req.location} - {req.time}
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-outline-variant/10">
                          <div className="flex -space-x-2">
                            <div className="w-6 h-6 rounded-full bg-surface-container-high border-2 border-white flex items-center justify-center text-[10px] text-outline font-bold">
                              {req.assignedCount}/{req.requiredCount}
                            </div>
                          </div>
                          <Tooltip content="Assign Now" description="Quick assign available staff">
                            <button className="text-primary font-bold text-xs flex items-center gap-1 hover:gap-2 transition-all">
                              ASSIGN NOW <ArrowRight className="w-3 h-3" />
                            </button>
                          </Tooltip>
                        </div>
                      </motion.div>
                    ))}
                  </section>

                  <section className="lg:col-span-8">
                    <div className="flex items-center justify-between mb-6 px-2">
                      <h2 className="font-serif text-xl text-on-surface">Personnel Command</h2>
                      <div className="flex gap-2">
                        <Tooltip content="Filter staff" description="Filter by role or status">
                          <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-primary text-on-primary' : 'bg-surface-container hover:bg-surface-container-high text-secondary'}`}
                          >
                            <Filter className="w-4 h-4" />
                          </button>
                        </Tooltip>
                        <Tooltip content="Grid view" description="Display as cards">
                          <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-primary text-on-primary' : 'bg-surface-container hover:bg-surface-container-high text-secondary'}`}
                          >
                            <Grid3X3 className="w-4 h-4" />
                          </button>
                        </Tooltip>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {MOCK_STAFF.slice(0, 4).map((staff) => {
                        const statusBadge = getStatusBadge(staff.status);
                        return (
                          <motion.div
                            key={staff.id}
                            whileHover={{ y: -4 }}
                            className="glass-card rounded-3xl overflow-hidden flex flex-col group luxury-shadow"
                          >
                            <div className="relative h-48 bg-gradient-to-br from-primary/20 via-surface-container to-surface-container-high overflow-hidden flex items-center justify-center">
                              <div className="w-20 h-20 rounded-full bg-primary-container/30 flex items-center justify-center">
                                <span className="text-2xl font-serif font-bold text-primary">{staff.initials}</span>
                              </div>
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                              <div className="absolute bottom-4 left-6">
                                <h3 className="text-white font-serif text-xl">{staff.name}</h3>
                                <div className="flex items-center gap-2">
                                  <span className={`w-2 h-2 rounded-full ${staff.status === 'on_duty' ? 'bg-primary animate-pulse' : staff.status === 'available' ? 'bg-green-400' : 'bg-secondary'}`} />
                                  <span className="text-primary-container text-[11px] font-bold uppercase tracking-widest">
                                    {staff.currentAssignment ? `ON-DUTY: ${staff.currentAssignment}` : `STATUS: ${statusBadge.label}`}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="p-6">
                              <div className="grid grid-cols-2 gap-4 mb-6">
                                <div>
                                  <p className="text-[10px] text-outline font-label-caps mb-1">CERTIFICATIONS</p>
                                  <div className="flex flex-wrap gap-1">
                                    {staff.certifications.slice(0, 2).map(cert => (
                                      <span key={cert} className="bg-surface-container-high px-2 py-0.5 rounded text-[9px] font-bold">{cert}</span>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <p className="text-[10px] text-outline font-label-caps mb-1">PERFORMANCE</p>
                                  <div className="flex items-center gap-1 text-primary">
                                    <Star className="w-3.5 h-3.5 fill-current" />
                                    <span className="text-xs font-bold">{staff.rating} / 5.0</span>
                                  </div>
                                </div>
                              </div>
                              <Tooltip content={staff.status === 'available' ? 'Assign to Task' : 'Reassign Staff'}>
                                <button className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${
                                  staff.status === 'available'
                                    ? 'bg-on-surface text-white hover:bg-primary'
                                    : 'border border-primary text-primary hover:bg-primary hover:text-on-primary'
                                }`}>
                                  {staff.status === 'available' ? `Assign to Task` : 'Reassign'}
                                </button>
                              </Tooltip>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </section>
                </div>
              </motion.div>
            )}

            {activeSection === 'inventory' && (
              <motion.div
                key="inventory"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <span className="font-label-caps text-primary mb-2 block">ASSET COORDINATION</span>
                    <h1 className="font-serif text-headline-lg text-on-surface">Inventory & Equipment</h1>
                  </div>
                </header>

                <section className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  <div className="md:col-span-3 space-y-4">
                    <div className="glass-card p-8 rounded-xl luxury-shadow">
                      <h3 className="font-label-caps text-on-surface mb-4">Categories</h3>
                      <ul className="space-y-2">
                        {[
                          { id: 'all', label: 'All Assets', count: MOCK_ASSETS.length },
                          { id: 'fleet', label: 'Luxury Fleet', count: MOCK_ASSETS.filter(a => a.category === 'fleet').length },
                          { id: 'culinary', label: 'Culinary Kits', count: MOCK_ASSETS.filter(a => a.category === 'culinary').length },
                          { id: 'comms_security', label: 'Comms & Security', count: MOCK_ASSETS.filter(a => a.category === 'comms_security').length },
                        ].map(cat => (
                          <li key={cat.id}>
                            <button
                              onClick={() => setSelectedCategory(cat.id)}
                              className={`w-full flex justify-between items-center p-3 rounded-lg text-sm transition-all ${
                                selectedCategory === cat.id
                                  ? 'bg-primary-container/10 text-primary font-semibold'
                                  : 'text-secondary hover:bg-surface-container'
                              }`}
                            >
                              <span>{cat.label}</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${selectedCategory === cat.id ? 'bg-primary text-on-primary' : 'text-outline'}`}>{cat.count}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredAssets.map((asset) => {
                      const statusBadge = getAssetStatusBadge(asset.status);
                      return (
                        <motion.div
                          key={asset.id}
                          whileHover={{ y: -4 }}
                          className="group glass-card rounded-xl overflow-hidden luxury-shadow transition-transform"
                        >
                          <div className="h-48 relative overflow-hidden bg-gradient-to-br from-surface-container to-surface-container-high flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                              {asset.category === 'fleet' && <Car className="w-8 h-8 text-primary" />}
                              {asset.category === 'culinary' && <Utensils className="w-8 h-8 text-primary" />}
                              {asset.category === 'comms_security' && <Radio className="w-8 h-8 text-primary" />}
                            </div>
                            <div className="absolute top-4 left-4">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${statusBadge.bg} ${statusBadge.text}`}>
                                {statusBadge.label}
                              </span>
                            </div>
                            <div className="absolute bottom-4 right-4 bg-parchment/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold border border-outline-variant/20">
                              ID: {asset.code}
                            </div>
                          </div>
                          <div className="p-8">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-serif text-lg text-on-surface">{asset.name}</h4>
                            </div>
                            <p className="text-xs text-secondary mb-4">Assigned to: <span className="text-on-surface font-medium">{asset.assignedTo}</span></p>
                            <div className="flex gap-2 flex-wrap">
                              {asset.tags.map(tag => (
                                <span key={tag} className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${
                                  asset.status === 'service_required' ? 'bg-error-container/30 text-error' : 'bg-surface-container text-on-surface-variant'
                                }`}>{tag}</span>
                              ))}
                            </div>
                            <div className="mt-4 pt-4 border-t border-outline-variant/10 flex justify-between items-center">
                              <span className={`text-[10px] ${asset.status === 'service_required' ? 'text-error font-medium' : 'text-secondary'}`}>
                                {asset.lastService}
                              </span>
                              <Tooltip content="More actions" description="Edit, delete, or reassign">
                                <button className="text-primary hover:scale-110 transition-all">
                                  <MoreHorizontal className="w-5 h-5" />
                                </button>
                              </Tooltip>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                    <motion.button
                      whileHover={{ y: -4 }}
                      className="group glass-card rounded-xl border-2 border-dashed border-outline-variant/40 hover:border-primary/50 transition-all flex flex-col items-center justify-center p-8 bg-transparent"
                    >
                      <Tooltip content="Add New Asset" description="Register equipment or vehicle">
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center mb-4 group-hover:bg-primary-container/20 transition-all">
                            <Plus className="text-primary w-6 h-6" />
                          </div>
                          <span className="font-label-caps text-secondary group-hover:text-primary transition-all">Register New Asset</span>
                        </div>
                      </Tooltip>
                    </motion.button>
                  </div>
                </section>
              </motion.div>
            )}

            {(activeSection === 'schedule' || activeSection === 'calendar') && (
              <motion.div
                key="schedule"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <span className="font-label-caps text-primary mb-2 block">SCHEDULE MANAGEMENT</span>
                    <h1 className="font-serif text-headline-lg text-on-surface">Calendar & Bookings</h1>
                  </div>
                  <div className="flex gap-3">
                    <Tooltip content="Download Schedule" description="Export as PDF or CSV">
                      <button className="px-5 py-2.5 bg-surface-container-lowest border border-outline-variant/30 rounded-lg text-body-md font-semibold text-on-surface hover:bg-surface-container-low transition-colors flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Export
                      </button>
                    </Tooltip>
                    <Tooltip content="New Booking" description="Create a manual booking">
                      <button className="px-5 py-2.5 bg-primary text-on-primary rounded-lg text-body-md font-bold hover:opacity-90 transition-opacity flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        New Booking
                      </button>
                    </Tooltip>
                  </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  {[
                    { label: "Today's Bookings", value: '6', icon: Calendar, color: 'text-primary' },
                    { label: 'This Week', value: '23', icon: CalendarDays, color: 'text-green-600' },
                    { label: 'Pending Confirmation', value: '4', icon: Clock, color: 'text-error' },
                    { label: 'Completion Rate', value: '94%', icon: CheckCircle, color: 'text-primary' },
                  ].map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="glass-card p-5 rounded-2xl border border-outline-variant/10 luxury-shadow"
                    >
                      <stat.icon className={`w-5 h-5 ${stat.color} mb-3`} />
                      <p className="text-[10px] font-bold tracking-widest text-secondary uppercase">{stat.label}</p>
                      <p className="text-xl font-serif font-bold text-on-surface mt-1">{stat.value}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-3xl overflow-hidden luxury-shadow">
                  <div className="px-6 py-4 border-b border-outline-variant/10 flex justify-between items-center">
                    <h3 className="font-serif text-headline-sm text-on-surface">Upcoming Bookings</h3>
                    <Tooltip content="Filter bookings" description="By date, status, or service">
                      <button className="p-2 text-secondary hover:text-primary hover:bg-surface-container rounded-lg transition-colors">
                        <Filter className="w-4 h-4" />
                      </button>
                    </Tooltip>
                  </div>
                  <div className="divide-y divide-outline-variant/10">
                    {activeBookings.slice(0, 5).map((booking: any, idx: number) => (
                      <div key={booking.id || idx} className="p-5 hover:bg-surface-container-low/50 transition-colors flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <p className="font-bold text-on-surface">{booking.guestName || 'Guest'}</p>
                            <p className="text-xs text-secondary">{booking.listingTitle || 'Property'} • {booking.checkIn || 'TBD'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
                            booking.status === 'confirmed' || booking.status === 'Confirmed'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}>
                            {booking.status}
                          </span>
                          <Tooltip content="View Details" description="See full booking info">
                            <button className="p-2 text-secondary hover:text-primary hover:bg-surface-container rounded-lg transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                          </Tooltip>
                        </div>
                      </div>
                    ))}
                    {activeBookings.length === 0 && (
                      <div className="p-12 text-center text-secondary italic text-sm">
                        No upcoming bookings.
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === 'payouts' && (
              <motion.div
                key="payouts"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <span className="font-label-caps text-primary mb-2 block">FINANCIAL OVERVIEW</span>
                    <h1 className="font-serif text-headline-lg text-on-surface">Earnings & Payouts</h1>
                  </div>
                  <div className="flex gap-3">
                    <Tooltip content="Download Statement" description="Export financial records">
                      <button className="px-5 py-2.5 bg-surface-container-lowest border border-outline-variant/30 rounded-lg text-body-md font-semibold text-on-surface hover:bg-surface-container-low transition-colors flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Statement
                      </button>
                    </Tooltip>
                    <Tooltip content="Request Payout" description="Transfer funds to your account">
                      <button className="px-5 py-2.5 bg-primary text-on-primary rounded-lg text-body-md font-bold hover:opacity-90 transition-opacity flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Request Payout
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
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="glass-card p-5 rounded-2xl border border-outline-variant/10 luxury-shadow"
                    >
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
                            <p className="font-bold text-on-surface">{tx.description || tx.type || 'Payment'}</p>
                            <p className="text-xs text-secondary">{tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : 'Recent'}</p>
                          </div>
                        </div>
                        <span className="font-bold text-green-600">+₦{(tx.amount || 0).toLocaleString()}</span>
                      </div>
                    ))}
                    {(transactions as any[]).length === 0 && (
                      <div className="p-12 text-center text-secondary italic text-sm">
                        No transactions yet.
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === 'concierge' && (
              <motion.div
                key="concierge"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <div className="mb-8">
                  <h2 className="font-serif text-headline-lg text-on-surface">Concierge Requests</h2>
                  <p className="text-body-lg text-secondary mt-2">Manage guest service requests and assignments</p>
                </div>
                <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-3xl p-12 luxury-shadow flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <ConciergeBell className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-serif text-headline-sm text-on-surface mb-2">Concierge Module</h3>
                  <p className="text-body-md text-secondary max-w-md">
                    This section is being enhanced with advanced concierge request management features. Check back soon.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
