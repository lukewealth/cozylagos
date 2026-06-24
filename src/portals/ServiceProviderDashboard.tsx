import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard, Calendar, Users, Package, ConciergeBell, HelpCircle,
  LogOut, Plus, Search, Bell, Settings, Filter, Grid3X3, ChevronLeft,
  ChevronRight, Star, MapPin, Clock, ArrowRight, GripVertical,
  CheckCircle, XCircle, MoreHorizontal, Eye, Edit3, TrendingUp, DollarSign,
  Utensils, Car, Camera, ShieldCheck, Key, Tablet, Radio, Zap, AlertTriangle,
  UserCheck, CircleDot, CalendarDays, Download, Upload, MapPin as MapPinIcon,
  Sparkles, Briefcase, Heart, Award, UserCircle, ChevronDown, X
} from 'lucide-react';
import { useAuth } from '../auth';
import { useDatabase } from '../hooks/useDatabase';

type ProviderSection = 'overview' | 'schedule' | 'roster' | 'inventory' | 'concierge';

const NAV_ITEMS: { id: ProviderSection; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'schedule', label: 'Schedule', icon: Calendar },
  { id: 'roster', label: 'Roster', icon: Users },
  { id: 'inventory', label: 'Inventory', icon: Package },
  { id: 'concierge', label: 'Concierge Hub', icon: ConciergeBell },
];

const MOCK_STAFF = [
  { id: 's1', name: 'Captain Chidi Okoro', role: 'driver' as const, status: 'on_duty' as const, initials: 'CO', certifications: ['MCA MASTER 3000GT', 'VIP PROTOCOL'], specializations: ['Maritime', 'VIP Transport'], rating: 4.8, availabilityFrom: '22:00', currentAssignment: 'Yacht Leila', tenureYears: 6 },
  { id: 's2', name: 'Chef Tunde Balogun', role: 'chef' as const, status: 'available' as const, initials: 'TB', certifications: ['Culinary Arts', 'Food Safety'], specializations: ['Afro-Fusion', 'Michelin Strategy'], rating: 4.9, availabilityFrom: 'Now', currentAssignment: undefined, tenureYears: 8 },
  { id: 's3', name: 'Amara Nwosu', role: 'concierge' as const, status: 'off_duty' as const, initials: 'AN', certifications: ['Hospitality Mgmt'], specializations: ['Multilingual', 'Event Planning', 'Conflict Resolution'], rating: 4.7, availabilityFrom: 'Tomorrow', currentAssignment: undefined, tenureYears: 8 },
  { id: 's4', name: 'Kola Adeyemi', role: 'driver' as const, status: 'on_duty' as const, initials: 'KA', certifications: ['Defensive Driving'], specializations: ['SUV', 'Sedan'], rating: 4.6, availabilityFrom: '18:00', currentAssignment: 'Fleet-77X', tenureYears: 4 },
  { id: 's5', name: 'Chef Emeka Nwankwo', role: 'chef' as const, status: 'on_duty' as const, initials: 'EN', certifications: ['Pastry Arts'], specializations: ['Continental', 'Private Dining'], rating: 4.8, availabilityFrom: '20:00', currentAssignment: 'Ikoyi Penthouse', tenureYears: 5 },
  { id: 's6', name: 'Samuel Okonkwo', role: 'security' as const, status: 'on_duty' as const, initials: 'SO', certifications: ['Security Ops', 'First Aid'], specializations: ['VIP Protection', 'Surveillance'], rating: 4.5, availabilityFrom: '23:00', currentAssignment: 'VIP Wing 3', tenureYears: 7 },
];

const MOCK_REQUESTS = [
  { id: 'r1', title: 'Yacht Arrival Reception', category: 'Concierge Experience', location: 'Victoria Island Marina', time: '14:30 Today', skills: ['Protocol', 'VIP Handling'], priority: 'urgent' as const, assignedCount: 1, requiredCount: 2 },
  { id: 'r2', title: 'Private Villa 7 Dinner', category: 'Culinary', location: 'Banana Island', time: '19:00 Today', skills: ['Sous-Chef', 'Fine-Dining'], priority: 'high' as const, assignedCount: 0, requiredCount: 1, guestName: 'Amb. Alakija' },
  { id: 'r3', title: 'Airport VIP Transfer', category: 'Logistics', location: 'Lagos Int. Terminal 2', time: 'Tomorrow 08:00', skills: ['Chauffeur', 'Protocol'], priority: 'normal' as const, assignedCount: 0, requiredCount: 1 },
];

const MOCK_SCHEDULE_ENTRIES = [
  { id: 'sc1', staffName: 'Kola A.', role: 'DRIVER (SUV)', blocks: [{ title: 'Arrival Pick-up: Flight LOS-422', start: 6, width: 10, type: 'active' as const }, { title: 'Dinner Transfer (Victoria Island)', start: 26, width: 8, type: 'active' as const }] },
  { id: 'sc2', staffName: 'Chef Emeka', role: 'PRIVATE CHEF', blocks: [{ title: 'Private Lunch Catering - Ikoyi Penthouse', start: 16, width: 16, type: 'active' as const }] },
  { id: 'sc3', staffName: 'Samuel O.', role: 'SECURITY', blocks: [{ title: 'Escort Rotation: VIP Wing 3', start: 8, width: 48, type: 'pending' as const, hasConflict: true, conflictTitle: 'Double Booking' }] },
];

const MOCK_TIME_OFF = [
  { id: 'to1', staffName: 'Femi B.', initials: 'FB', type: 'SICK LEAVE', reason: 'Medical follow-up for dental surgery next Tuesday...', timeAgo: '2H AGO' },
  { id: 'to2', staffName: 'Joy O.', initials: 'JO', type: 'ANNUAL LEAVE', reason: 'Family travel for the holiday season (Dec 22 - Jan 2)...', timeAgo: '5H AGO' },
];

const MOCK_ASSETS = [
  { id: 'a1', name: 'Range Rover Autobiography', category: 'fleet' as const, status: 'available' as const, code: 'FLEET-77X', tags: ['V8 Engine', 'Armored G2'], lastService: '12 days ago', assignedTo: 'Unassigned' },
  { id: 'a2', name: "Executive Chef's Kit", category: 'culinary' as const, status: 'in_use' as const, code: 'KITCH-KIT4', tags: ['Damascus Steel'], lastService: 'In Active Rotation', assignedTo: 'Chef Adebayo' },
  { id: 'a3', name: 'SAT-Comms Hub G3', category: 'comms_security' as const, status: 'service_required' as const, code: 'SEC-COM09', tags: ['Battery Failure'], lastService: 'Critical Update Pending', assignedTo: 'Team Sierra' },
  { id: 'a4', name: 'VIP Concierge Fob', category: 'access' as const, status: 'available' as const, code: 'ACCESS-VIP', tags: ['Biometric', 'Global Access'], lastService: 'Ready for Departure', assignedTo: 'Available' },
  { id: 'a5', name: 'Orchestrator Pro Tablet', category: 'tech' as const, status: 'in_use' as const, code: 'TECH-TAB12', tags: ['Full Admin'], lastService: 'Active Ping', assignedTo: 'Operations Lead' },
];

const MOCK_STAFF_ASSET_LINKS = [
  { id: 'sal1', staffName: 'Emeka Okafor', assetCode: 'FLEET-909 (Black Sedan)', mission: 'VIP Airport Transfer: Senator K.', checkoutTime: '08:45 AM Today', status: 'active' as const },
  { id: 'sal2', staffName: 'Zainab Bello', assetCode: 'COMMS-H22 (Radios)', mission: 'Lagos Yacht Club Gala Coord.', checkoutTime: '10:12 AM Today', status: 'on_site' as const },
  { id: 'sal3', staffName: 'Chef Victor', assetCode: 'KITCH-PRO1 (Sous-Vide Kit)', mission: 'Penthouse Private Dinner (6 pax)', checkoutTime: 'Yesterday, 18:30', status: 'returned' as const },
];

export default function ServiceProviderDashboard() {
  const { currentUser } = useAuth();
  const [activeSection, setActiveSection] = useState<ProviderSection>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [scheduleView, setScheduleView] = useState<'day' | 'week' | 'month'>('day');

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

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-error/10 text-error';
      case 'high': return 'bg-primary/10 text-primary';
      case 'normal': return 'bg-surface-container text-secondary';
      default: return 'bg-surface-container text-secondary';
    }
  };

  return (
    <div className="flex min-h-screen bg-parchment">
      <aside className="hidden xl:flex h-screen w-64 fixed left-0 top-0 border-r border-outline-variant/20 bg-surface-container-low flex-col py-6 gap-4 z-40">
        <div className="px-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-on-primary">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="font-serif text-lg text-on-surface font-bold leading-tight">Staff Portal</div>
              <div className="text-[10px] uppercase tracking-widest text-outline">Luxury Operations</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 space-y-1 px-2">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all w-full text-left ${
                activeSection === item.id
                  ? 'bg-primary-container text-on-primary-container shadow-[0_4px_20px_-5px_rgba(212,175,55,0.4)]'
                  : 'text-on-surface-variant hover:bg-secondary-container/50'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-label-caps">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="px-4">
          <button className="w-full py-4 bg-primary text-on-primary rounded-xl font-semibold shadow-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" />
            New Assignment
          </button>
        </div>
        <div className="mt-8 pt-6 border-t border-outline-variant/10 space-y-1 px-2">
          <button className="flex items-center gap-4 px-4 py-2 text-on-surface-variant/70 hover:text-on-surface transition-colors text-label-caps w-full text-left">
            <HelpCircle className="w-4 h-4" />
            Help Center
          </button>
          <button className="flex items-center gap-4 px-4 py-2 text-on-surface-variant/70 hover:text-on-surface transition-colors text-label-caps w-full text-left">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 xl:ml-64 min-h-screen">
        <header className="fixed top-0 xl:left-64 right-0 z-50 bg-parchment/80 backdrop-blur-xl border-b border-outline-variant/20 shadow-sm h-16 px-6 md:px-12 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <span className="font-serif text-headline-sm font-bold tracking-tight text-primary">Elite Orchestrator</span>
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
          <div className="flex items-center gap-6">
            <div className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
              <input
                className="pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-full text-sm focus:ring-1 focus:ring-primary w-64 focus:outline-none"
                placeholder="Search staff or assets..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="p-2 text-secondary hover:text-primary cursor-pointer transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full" />
            </button>
            <button className="p-2 text-secondary hover:text-primary cursor-pointer transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant/30 bg-primary-container/20 flex items-center justify-center">
              <UserCircle className="w-5 h-5 text-primary" />
            </div>
          </div>
        </header>

        <div className="pt-24 pb-16 px-6 md:px-12 max-w-[1440px] mx-auto">
          <AnimatePresence mode="wait">
            {activeSection === 'overview' && (
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
                            <span className={`${getPriorityBadge(req.priority)} px-2 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase mb-2 inline-block`}>{req.category}</span>
                            <h3 className="font-bold text-on-surface text-lg">{req.title}</h3>
                          </div>
                          <GripVertical className="w-5 h-5 text-outline group-hover:text-primary transition-colors" />
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
                          <button className="text-primary font-bold text-xs flex items-center gap-1 hover:gap-2 transition-all">
                            ASSIGN NOW <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </section>

                  <section className="lg:col-span-8">
                    <div className="flex items-center justify-between mb-6 px-2">
                      <h2 className="font-serif text-xl text-on-surface">Personnel Command</h2>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setViewMode('list')}
                          className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-primary text-on-primary' : 'bg-surface-container hover:bg-surface-container-high text-secondary'}`}
                        >
                          <Filter className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setViewMode('grid')}
                          className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-primary text-on-primary' : 'bg-surface-container hover:bg-surface-container-high text-secondary'}`}
                        >
                          <Grid3X3 className="w-4 h-4" />
                        </button>
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
                              <button className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${
                                staff.status === 'available'
                                  ? 'bg-on-surface text-white hover:bg-primary'
                                  : 'border border-primary text-primary hover:bg-primary hover:text-on-primary'
                              }`}>
                                {staff.status === 'available' ? `Assign to Task` : 'Reassign'}
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

            {activeSection === 'schedule' && (
              <motion.div
                key="schedule"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <h1 className="font-serif text-headline-lg text-primary mb-2">Staff Scheduling Overview</h1>
                    <p className="text-secondary font-body-lg">Optimizing Lagos luxury services for November 14, 2024</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex bg-surface-container rounded-lg p-1">
                      {(['day', 'week', 'month'] as const).map(v => (
                        <button
                          key={v}
                          onClick={() => setScheduleView(v)}
                          className={`px-4 py-2 rounded-md text-sm font-semibold capitalize transition-all ${
                            scheduleView === v ? 'bg-white shadow-sm' : 'text-secondary hover:text-primary'
                          }`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 border border-outline-variant/30 rounded-lg text-sm font-semibold hover:bg-surface-container-low transition-colors">
                      <Filter className="w-4 h-4" /> Filters
                    </button>
                  </div>
                </header>

                <section className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                  {[
                    { label: 'ACTIVE SHIFTS', value: '32', sub: '+4 vs Yesterday', subColor: 'text-primary' },
                    { label: 'PENDING ASSIGNMENTS', value: '08', sub: 'Requires Attention', subColor: 'text-error' },
                    { label: 'ARRIVAL SYNC', value: '100%', sub: 'Optimized', subColor: 'text-green-600' },
                    { label: 'STAFF AVAILABILITY', value: '14', sub: 'On Standby', subColor: 'text-secondary' },
                  ].map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`glass-card p-6 rounded-xl flex flex-col justify-between ${i === 3 ? 'bg-primary/5' : ''} ${i === 1 ? 'border-l-4 border-primary' : ''}`}
                    >
                      <span className="font-label-caps text-secondary">{stat.label}</span>
                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-headline-md font-bold text-on-surface">{stat.value}</span>
                        <span className={`${stat.subColor} text-sm font-bold`}>{stat.sub}</span>
                      </div>
                    </motion.div>
                  ))}
                </section>

                <div className="flex flex-wrap gap-4 mb-8 items-center">
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-primary text-on-primary rounded-full text-xs font-bold font-label-caps flex items-center gap-1">IKOYI <X className="w-3 h-3" /></span>
                    <span className="px-3 py-1 bg-surface-container text-secondary rounded-full text-xs font-bold font-label-caps">VICTORIA ISLAND</span>
                    <span className="px-3 py-1 bg-surface-container text-secondary rounded-full text-xs font-bold font-label-caps">LEKKI PHASE 1</span>
                  </div>
                  <div className="h-6 w-px bg-outline-variant/30" />
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-xs font-bold font-label-caps">DRIVERS</span>
                    <span className="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-xs font-bold font-label-caps">PRIVATE CHEFS</span>
                    <span className="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-xs font-bold font-label-caps">SECURITY</span>
                  </div>
                </div>

                <div className="glass-card rounded-2xl overflow-hidden border border-outline-variant/20 luxury-shadow">
                  <div className="flex items-center justify-between px-6 py-4 bg-surface-container-high/50 border-b border-outline-variant/20">
                    <h3 className="font-serif text-lg font-bold text-primary">Master Operations Timeline</h3>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-primary" />
                        <span className="text-xs font-bold font-label-caps">Active</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-secondary-container" />
                        <span className="text-xs font-bold font-label-caps">Pending</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-error" />
                        <span className="text-xs font-bold font-label-caps">Conflict</span>
                      </div>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <div className="min-w-[1200px]">
                      <div className="grid grid-cols-[200px_repeat(24,minmax(50px,1fr))] border-b border-outline-variant/10 bg-surface-container-low">
                        <div className="p-4 border-r border-outline-variant/10 font-bold font-label-caps text-secondary text-[10px]">RESOURCES</div>
                        {Array.from({ length: 24 }, (_, i) => {
                          const hour = (i + 6) % 24;
                          const isCurrent = hour === new Date().getHours();
                          return (
                            <div key={i} className={`p-2 text-center text-[10px] font-bold border-r border-outline-variant/5 ${isCurrent ? 'text-primary bg-primary/5' : 'text-secondary'}`}>
                              {String(hour).padStart(2, '0')}:00
                            </div>
                          );
                        })}
                      </div>
                      {MOCK_SCHEDULE_ENTRIES.map((entry) => (
                        <div key={entry.id} className="grid grid-cols-[200px_1fr] border-b border-outline-variant/10 group hover:bg-surface-container/30 transition-colors">
                          <div className="p-4 border-r border-outline-variant/10 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary-container/20 flex items-center justify-center text-xs font-bold text-primary">
                              {entry.staffName.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <div className="text-sm font-bold text-on-surface leading-none">{entry.staffName}</div>
                              <div className="text-[10px] font-label-caps text-secondary mt-1">{entry.role}</div>
                            </div>
                          </div>
                          <div className="relative h-16">
                            {entry.blocks.map((block, bi) => (
                              <React.Fragment key={bi}>
                                <div
                                  className={`absolute top-4 h-8 rounded-lg flex items-center px-3 border cursor-pointer hover:scale-[1.02] transition-transform ${
                                    block.hasConflict
                                      ? 'bg-error/20 border-error border-dashed'
                                      : block.type === 'active'
                                      ? 'bg-primary border-white/20 shadow-md'
                                      : 'bg-surface-container-highest border-outline-variant/30'
                                  }`}
                                  style={{ left: `${(block.start / 48) * 100}%`, width: `${(block.width / 48) * 100}%` }}
                                >
                                  <span className={`text-[10px] font-bold whitespace-nowrap overflow-hidden text-ellipsis ${block.type === 'active' ? 'text-on-primary' : 'text-secondary'}`}>
                                    {block.title}
                                  </span>
                                </div>
                                {block.hasConflict && (
                                  <div
                                    className="absolute top-4 w-4 h-8 bg-error flex items-center justify-center z-10 rounded-sm animate-pulse"
                                    style={{ left: `${((block.start + block.width / 2) / 48) * 100}%` }}
                                  >
                                    <AlertTriangle className="w-3 h-3 text-on-error" />
                                  </div>
                                )}
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <section className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 glass-card p-8 rounded-2xl">
                    <h4 className="font-serif text-lg text-primary mb-4">Pending Arrival Sync</h4>
                    <div className="space-y-4">
                      {[
                        { eta: '11:45', title: 'Private Jet: Falcon 8X (N652AL)', sub: '3 Guests - Murtala Muhammed Int\'l Airport', action: 'ASSIGN DRIVER' },
                        { eta: '14:20', title: 'Coastal Yacht Arrival (Sea Spirit)', sub: '2 Guests - VI Jetty Terminal', action: 'PENDING APPROVAL' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-white/40 rounded-xl border border-outline-variant/10">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-surface-container flex flex-col items-center justify-center border border-outline-variant/20">
                              <span className="text-[10px] font-bold text-secondary">ETA</span>
                              <span className="text-sm font-bold text-primary">{item.eta}</span>
                            </div>
                            <div>
                              <div className="text-sm font-bold text-on-surface">{item.title}</div>
                              <div className="text-xs text-secondary">{item.sub}</div>
                            </div>
                          </div>
                          <button className="px-4 py-2 bg-primary text-on-primary text-xs font-bold font-label-caps rounded-lg hover:shadow-lg transition-shadow">
                            {item.action}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="glass-card p-8 rounded-2xl bg-on-surface text-white">
                    <h4 className="font-serif text-lg text-primary-container mb-4">Conflict Resolution Center</h4>
                    <div className="space-y-6">
                      <div className="border-l-2 border-error pl-4">
                        <div className="text-sm font-bold text-error-container flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" /> Overlapping Schedule
                        </div>
                        <p className="text-xs text-surface-variant mt-1 leading-relaxed">Samuel O. is assigned to VIP Wing 3 and Private Party Escort at the same time (11:45 AM).</p>
                        <button className="mt-3 text-[10px] font-bold font-label-caps tracking-widest text-primary-container underline">REASSIGN TASK</button>
                      </div>
                      <div className="border-l-2 border-primary-container pl-4">
                        <div className="text-sm font-bold text-primary-container">Optimization Tip</div>
                        <p className="text-xs text-surface-variant mt-1 leading-relaxed">Driver Kola A. is ending his shift 2 hours early. He is currently 10 mins away from VI Jetty.</p>
                        <button className="mt-3 text-[10px] font-bold font-label-caps tracking-widest text-primary-container underline">EXTEND SHIFT</button>
                      </div>
                    </div>
                  </div>
                </section>
              </motion.div>
            )}

            {activeSection === 'roster' && (
              <motion.div
                key="roster"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                  <div>
                    <h2 className="font-serif text-headline-lg text-on-surface">Roster Management</h2>
                    <p className="text-secondary font-body-lg">Curating excellence for the Lagos Coastline</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="glass-card px-6 py-2 rounded-full border border-primary/10 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      <span className="font-label-caps text-primary">LIVE OPS: OPTIMAL</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                  <div className="glass-card p-6 rounded-xl flex flex-col justify-between">
                    <span className="font-label-caps text-secondary mb-4 uppercase tracking-widest">Total Staff</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-headline-lg font-serif text-primary leading-none">{MOCK_STAFF.length}</span>
                      <span className="text-primary/60 font-body-md">Active</span>
                    </div>
                  </div>
                  <div className="glass-card p-6 rounded-xl flex flex-col justify-between">
                    <span className="font-label-caps text-secondary mb-4 uppercase tracking-widest">Active Roles</span>
                    <div className="space-y-2">
                      {[
                        { role: 'Butler Elite', count: 2 },
                        { role: 'Concierge Hub', count: 2 },
                        { role: 'Drivers', count: 2 },
                      ].map(r => (
                        <div key={r.role} className="flex justify-between items-center text-body-md">
                          <span>{r.role}</span>
                          <span className="font-semibold text-primary">{r.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="md:col-span-2 glass-card p-6 rounded-xl overflow-hidden relative border-primary/20">
                    <div className="relative z-10 flex flex-col h-full justify-between">
                      <div className="flex justify-between">
                        <span className="font-label-caps text-error uppercase tracking-widest font-bold">Upcoming Coverage Gaps</span>
                        <AlertTriangle className="w-5 h-5 text-error" />
                      </div>
                      <div>
                        <p className="font-serif text-headline-sm text-on-surface mb-1">Victoria Island Festival</p>
                        <p className="text-secondary text-body-md">Dec 15-17 - Projected 98% Occupancy</p>
                        <div className="mt-4 flex gap-4">
                          <div className="bg-error/5 border border-error/20 px-4 py-2 rounded-lg">
                            <span className="text-error font-bold">-3</span>
                            <span className="text-error/80 text-xs ml-1 font-label-caps">Night Shift</span>
                          </div>
                          <div className="bg-error/5 border border-error/20 px-4 py-2 rounded-lg">
                            <span className="text-error font-bold">-2</span>
                            <span className="text-error/80 text-xs ml-1 font-label-caps">Butler Service</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 glass-card rounded-xl p-8">
                    <div className="flex justify-between items-center mb-8">
                      <div className="flex items-center gap-4">
                        <h3 className="font-serif text-headline-md">December 2024</h3>
                        <div className="flex border border-outline-variant/30 rounded-lg overflow-hidden">
                          <button className="p-2 hover:bg-secondary-container/30 transition-colors border-r border-outline-variant/30"><ChevronLeft className="w-4 h-4" /></button>
                          <button className="p-2 hover:bg-secondary-container/30 transition-colors"><ChevronRight className="w-4 h-4" /></button>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-4 py-2 bg-secondary-container text-on-secondary-container rounded-lg font-label-caps text-label-caps transition-all">EXPORT</button>
                        <button className="px-4 py-2 bg-primary text-on-primary rounded-lg font-label-caps text-label-caps transition-all">PUBLISH ROSTER</button>
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left min-w-[700px]">
                        <thead>
                          <tr className="border-b border-outline-variant/20">
                            <th className="py-4 font-label-caps text-secondary">STAFF MEMBER</th>
                            {['MON 11', 'TUE 12', 'WED 13', 'THU 14', 'FRI 15', 'SAT 16'].map((day, i) => (
                              <th key={day} className={`py-4 font-label-caps text-secondary text-center ${i >= 4 ? 'bg-primary/5' : ''}`}>{day}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/10">
                          {[
                            { name: 'Amara O.', role: 'Butler Elite', shifts: ['DAY', 'DAY', 'OFF', 'NIGHT', 'EVENT', 'EVENT'] },
                            { name: 'Chidi E.', role: 'Concierge Hub', shifts: ['NIGHT', 'NIGHT', 'NIGHT', 'OFF', 'NIGHT', 'GAP'] },
                            { name: 'Tayo K.', role: 'Wellness Lead', shifts: ['OFF', 'OFF', 'DAY', 'DAY', 'EVENT', 'EVENT'] },
                          ].map((staff) => (
                            <tr key={staff.name} className="group">
                              <td className="py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center border border-outline-variant/30">
                                    <span className="text-xs font-bold text-primary">{staff.name.split(' ').map(n => n[0]).join('')}</span>
                                  </div>
                                  <div>
                                    <p className="font-semibold text-on-surface">{staff.name}</p>
                                    <p className="text-xs text-secondary">{staff.role}</p>
                                  </div>
                                </div>
                              </td>
                              {staff.shifts.map((shift, i) => (
                                <td key={i} className={`py-4 text-center ${i >= 4 ? 'bg-primary/5' : ''}`}>
                                  <span className={`px-3 py-1 rounded-full text-xs font-label-caps ${
                                    shift === 'OFF' ? 'bg-outline-variant/20 text-secondary' :
                                    shift === 'EVENT' ? 'bg-primary text-on-primary' :
                                    shift === 'GAP' ? 'bg-surface-container text-error' :
                                    'bg-surface-container text-on-surface'
                                  }`}>{shift}</span>
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="glass-card rounded-xl p-6">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="font-serif text-headline-sm">Pending Leave</h3>
                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">{MOCK_TIME_OFF.length} REQUESTS</span>
                      </div>
                      <div className="space-y-4">
                        {MOCK_TIME_OFF.map(req => (
                          <div key={req.id} className="p-4 rounded-lg bg-surface-container-low border border-outline-variant/10 hover:border-primary/30 transition-all cursor-pointer group">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center font-bold text-xs">{req.initials}</div>
                                <div>
                                  <p className="text-sm font-bold">{req.staffName}</p>
                                  <p className="text-[10px] text-secondary font-label-caps">{req.type}</p>
                                </div>
                              </div>
                              <span className="text-[10px] text-secondary">{req.timeAgo}</span>
                            </div>
                            <p className="text-xs text-on-surface-variant mb-4">"{req.reason}"</p>
                            <div className="flex gap-2">
                              <button className="flex-1 py-2 text-xs font-label-caps border border-outline-variant/30 rounded-lg hover:bg-error/5 hover:text-error transition-all">DENY</button>
                              <button className="flex-1 py-2 text-xs font-label-caps bg-primary text-on-primary rounded-lg hover:brightness-110 transition-all">APPROVE</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="glass-card rounded-xl p-6 bg-on-surface text-inverse-on-surface">
                      <h3 className="font-label-caps text-primary mb-4 tracking-widest">CAPACITY STATUS</h3>
                      <div className="space-y-6">
                        {[
                          { label: 'CONCIERGE DESK', value: 92, color: 'bg-primary' },
                          { label: 'PRIVATE BUTLER', value: 65, color: 'bg-error', critical: true },
                          { label: 'VALET & LOGISTICS', value: 88, color: 'bg-primary' },
                        ].map(cap => (
                          <div key={cap.label}>
                            <div className={`flex justify-between text-xs font-label-caps mb-2 ${cap.critical ? 'text-error' : ''}`}>
                              <span>{cap.label}</span>
                              <span>{cap.value}%{cap.critical ? ' CRITICAL' : ''}</span>
                            </div>
                            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${cap.value}%` }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                                className={`h-full ${cap.color}`}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                      <button className="w-full mt-6 py-3 border border-primary/30 text-primary rounded-lg font-label-caps text-label-caps hover:bg-primary/10 transition-all">
                        HIRE CONTRACTORS
                      </button>
                    </div>
                  </div>
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
                          { id: 'tech', label: 'Tech & Devices', count: MOCK_ASSETS.filter(a => a.category === 'tech').length },
                          { id: 'access', label: 'Access Keys', count: MOCK_ASSETS.filter(a => a.category === 'access').length },
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
                    <div className="glass-card p-8 rounded-xl border-primary/20 bg-primary-container/5">
                      <h3 className="font-label-caps text-primary mb-2">Operational Alert</h3>
                      <p className="text-xs text-on-surface-variant leading-relaxed">3 vehicles are due for biometric sensor calibration by EOD tomorrow.</p>
                      <button className="mt-3 text-[10px] font-bold uppercase tracking-widest text-primary hover:underline transition-all">Schedule Service</button>
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
                              {asset.category === 'tech' && <Tablet className="w-8 h-8 text-primary" />}
                              {asset.category === 'access' && <Key className="w-8 h-8 text-primary" />}
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
                                {asset.status === 'in_use' ? (
                                  <span className="flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                    {asset.lastService}
                                  </span>
                                ) : asset.lastService}
                              </span>
                              <button className="text-primary hover:scale-110 transition-all">
                                <MoreHorizontal className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                    <motion.button
                      whileHover={{ y: -4 }}
                      className="group glass-card rounded-xl border-2 border-dashed border-outline-variant/40 hover:border-primary/50 transition-all flex flex-col items-center justify-center p-8 bg-transparent"
                    >
                      <div className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center mb-4 group-hover:bg-primary-container/20 transition-all">
                        <Plus className="text-primary w-6 h-6" />
                      </div>
                      <span className="font-label-caps text-secondary group-hover:text-primary transition-all">Register New Asset</span>
                    </motion.button>
                  </div>
                </section>

                <section className="mt-16">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="font-serif text-headline-md text-on-surface">Live Staff-Asset Linking</h2>
                    <button className="text-sm font-bold text-primary flex items-center gap-1 hover:underline">
                      View Allocation Report <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="glass-card rounded-xl luxury-shadow overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-surface-container-low border-b border-outline-variant/20">
                        <tr>
                          <th className="px-6 py-4 font-label-caps text-secondary">Staff Member</th>
                          <th className="px-6 py-4 font-label-caps text-secondary">Assigned Asset</th>
                          <th className="px-6 py-4 font-label-caps text-secondary">Mission Context</th>
                          <th className="px-6 py-4 font-label-caps text-secondary">Checkout Time</th>
                          <th className="px-6 py-4 font-label-caps text-secondary">Status</th>
                          <th className="px-6 py-4 font-label-caps text-secondary text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/10">
                        {MOCK_STAFF_ASSET_LINKS.map(link => (
                          <tr key={link.id} className="hover:bg-surface-container-lowest transition-all">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary-container/20 flex items-center justify-center border border-outline-variant/20">
                                  <span className="text-[10px] font-bold text-primary">{link.staffName.split(' ').map(n => n[0]).join('')}</span>
                                </div>
                                <span className="text-sm font-medium text-on-surface">{link.staffName}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-xs font-bold bg-primary-container/10 text-primary px-2 py-1 rounded">{link.assetCode}</span>
                            </td>
                            <td className="px-6 py-4 text-xs text-on-surface-variant">{link.mission}</td>
                            <td className="px-6 py-4 text-xs text-secondary">{link.checkoutTime}</td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                                link.status === 'active' ? 'bg-green-100 text-green-700' :
                                link.status === 'on_site' ? 'bg-primary-container/20 text-primary' :
                                'bg-surface-container text-on-surface-variant'
                              }`}>{link.status}</span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button className="text-secondary hover:text-primary transition-all">
                                <MoreHorizontal className="w-5 h-5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
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
                  <h2 className="font-serif text-headline-lg text-on-surface">Concierge Hub</h2>
                  <p className="text-secondary font-body-lg">Manage guest services and special requests</p>
                </div>
                <div className="glass-card rounded-3xl p-12 luxury-shadow flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <ConciergeBell className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-serif text-headline-sm text-on-surface mb-2">Concierge Hub</h3>
                  <p className="text-body-md text-secondary max-w-md">
                    This section is being enhanced with advanced guest service management features.
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
