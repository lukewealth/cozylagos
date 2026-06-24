import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Utensils, Car, Camera, ShieldCheck, TrendingUp, Package, Star, Clock,
  Calendar, Users, DollarSign, CheckCircle, XCircle, Plus, Filter,
  Grid3X3, List, MapPin, Phone, Mail, Award, Zap, Target, Compass,
  Settings, Bell, Search, ChevronRight, ChevronLeft, AlertCircle,
  Briefcase, Wrench, Truck, Shield, Heart, Sparkles, Crown, Gem
} from 'lucide-react';
import { useDatabase } from '../hooks/useDatabase';
import api from '../services/api';
import { useAuth } from '../auth';

type ProviderSection = 'dashboard' | 'schedule' | 'roster' | 'inventory' | 'requests';

interface StaffMember {
  id: string;
  name: string;
  role: string;
  status: 'on-duty' | 'available' | 'off-duty';
  avatar?: string;
  rating?: number;
  specialization?: string[];
  availability?: string;
}

interface ServiceRequest {
  id: string;
  title: string;
  category: string;
  location: string;
  time: string;
  guest?: string;
  priority: 'urgent' | 'normal' | 'low';
  status: 'unassigned' | 'assigned' | 'in-progress' | 'completed';
  assignedTo?: string;
}

export default function ServiceProviderDashboard() {
  const [activeSection, setActiveSection] = useState<ProviderSection>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { currentUser } = useAuth();

  const { data: services } = useDatabase('services');
  const { data: bookings } = useDatabase('bookings');

  // Mock data - in production, fetch from database
  const [staff, setStaff] = useState<StaffMember[]>([
    {
      id: '1',
      name: 'Captain Chidi Okoro',
      role: 'Yacht Captain',
      status: 'on-duty',
      rating: 4.9,
      specialization: ['MCA MASTER 3000GT', 'VIP Protocol'],
      availability: 'Available from 22:00'
    },
    {
      id: '2',
      name: 'Chef Tunde Balogun',
      role: 'Executive Chef',
      status: 'available',
      rating: 4.8,
      specialization: ['Afro-Fusion', 'Michelin Strategy'],
      availability: 'Immediate'
    },
    {
      id: '3',
      name: 'Amara Nwosu',
      role: 'Head of Guest Experiences',
      status: 'off-duty',
      rating: 5.0,
      specialization: ['Multilingual', 'Event Planning', 'Conflict Resolution'],
      availability: 'Tomorrow 08:00'
    }
  ]);

  const [requests, setRequests] = useState<ServiceRequest[]>([
    {
      id: '1',
      title: 'Yacht Arrival Reception',
      category: 'Concierge Experience',
      location: 'Victoria Island Marina',
      time: '14:30 Today',
      guest: 'Mr. Adewale',
      priority: 'urgent',
      status: 'unassigned'
    },
    {
      id: '2',
      title: 'Private Villa Dinner',
      category: 'Culinary',
      location: 'Banana Island Villa 7',
      time: '19:00 Today',
      guest: 'Amb. Alakija',
      priority: 'normal',
      status: 'unassigned'
    },
    {
      id: '3',
      title: 'Airport VIP Transfer',
      category: 'Logistics',
      location: 'Lagos Int. Terminal 2',
      time: 'Tomorrow 08:00',
      priority: 'normal',
      status: 'unassigned'
    }
  ]);

  const [inventory] = useState([
    { id: '1', name: 'Range Rover Autobiography', category: 'Luxury Fleet', status: 'available', id_code: 'FLEET-77X' },
    { id: '2', name: 'Executive Chef Kit', category: 'Culinary Kits', status: 'in-use', id_code: 'KITCH-KIT4', assignedTo: 'Chef Adebayo' },
    { id: '3', name: 'SAT-Comms Hub G3', category: 'Comms & Security', status: 'service-required', id_code: 'SEC-COM09' },
    { id: '4', name: 'VIP Concierge Fob', category: 'Guest Logistics', status: 'available', id_code: 'ACCESS-VIP' },
  ]);

  const stats = [
    { label: 'Total Earnings', value: '₦1,250,000', icon: DollarSign, trend: '+15%' },
    { label: 'Active Bookings', value: '12', icon: Calendar, trend: '+3' },
    { label: 'Service Rating', value: '4.9', icon: Star, trend: '+0.1' },
    { label: 'Pending Requests', value: requests.filter(r => r.status === 'unassigned').length.toString(), icon: Package, trend: 'Urgent' },
  ];

  const handleAssignRequest = (requestId: string, staffId: string) => {
    setRequests(prev => prev.map(r =>
      r.id === requestId ? { ...r, status: 'assigned', assignedTo: staffId } : r
    ));
  };

  const handleStatusChange = (staffId: string, status: StaffMember['status']) => {
    setStaff(prev => prev.map(s =>
      s.id === staffId ? { ...s, status } : s
    ));
  };

  return (
    <div className="flex-grow w-full bg-parchment min-h-screen">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 xl:px-20 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-5 h-5 text-gold-dark" />
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-charcoal/60">
                Elite Service Provider
              </span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-charcoal leading-tight">
              Staff Orchestration
            </h1>
            <p className="text-sm text-charcoal/60 mt-2">
              Manage elite personnel deployments and synchronize service requests
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" />
              <input
                type="text"
                placeholder="Search staff or requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-white border border-charcoal/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 w-64"
              />
            </div>
            <button className="p-2.5 bg-white border border-charcoal/10 rounded-xl hover:bg-charcoal/5 transition-colors relative">
              <Bell className="w-5 h-5 text-charcoal/60" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 mb-8 overflow-x-auto pb-2"
        >
          {[
            { id: 'dashboard' as const, label: 'Dashboard', icon: TrendingUp },
            { id: 'schedule' as const, label: 'Schedule', icon: Calendar },
            { id: 'roster' as const, label: 'Roster', icon: Users },
            { id: 'inventory' as const, label: 'Inventory', icon: Package },
            { id: 'requests' as const, label: 'Requests', icon: Package, badge: requests.filter(r => r.status === 'unassigned').length },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                activeSection === tab.id
                  ? 'bg-charcoal text-parchment shadow-lg shadow-charcoal/20'
                  : 'bg-white text-charcoal/60 hover:bg-charcoal/5 border border-charcoal/10'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                  activeSection === tab.id ? 'bg-gold text-charcoal' : 'bg-amber-100 text-amber-700'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-charcoal/5 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-2.5 bg-gold/10 rounded-xl">
                  <stat.icon className="w-5 h-5 text-gold-dark" />
                </div>
                <span className="text-xs font-bold text-green-600">{stat.trend}</span>
              </div>
              <p className="text-[10px] font-bold tracking-widest text-charcoal/50 uppercase mb-1">{stat.label}</p>
              <p className="text-3xl font-serif font-bold text-charcoal">{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {activeSection === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Unassigned Requests */}
              <div className="lg:col-span-1">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-serif text-xl font-bold text-charcoal">Unassigned Requests</h3>
                  <span className="px-2 py-1 bg-red-100 text-red-700 text-[10px] font-bold rounded uppercase">
                    Urgent
                  </span>
                </div>
                <div className="space-y-4">
                  {requests.filter(r => r.status === 'unassigned').map((request, i) => (
                    <motion.div
                      key={request.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * i }}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white/80 backdrop-blur-xl p-5 rounded-2xl border-l-4 border-l-gold-dark border border-charcoal/5 shadow-lg hover:shadow-xl transition-all cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <span className="inline-block px-2 py-1 bg-gold/10 text-gold-dark text-[9px] font-bold rounded-full uppercase tracking-wider mb-2">
                            {request.category}
                          </span>
                          <h4 className="font-bold text-charcoal text-lg">{request.title}</h4>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-charcoal/60 mb-4">
                        <MapPin className="w-4 h-4" />
                        <span>{request.location} • {request.time}</span>
                      </div>
                      {request.guest && (
                        <div className="flex items-center gap-2 text-sm text-charcoal/60 mb-4">
                          <Users className="w-4 h-4" />
                          <span>Guest: {request.guest}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between pt-4 border-t border-charcoal/5">
                        <button className="text-gold-dark font-bold text-xs flex items-center gap-1 hover:gap-2 transition-all">
                          ASSIGN NOW <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Personnel Command */}
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-serif text-xl font-bold text-charcoal">Personnel Command</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-charcoal text-parchment' : 'bg-white text-charcoal/60 hover:bg-charcoal/5'}`}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-charcoal text-parchment' : 'bg-white text-charcoal/60 hover:bg-charcoal/5'}`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-4'}>
                  {staff.map((member, i) => (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * i }}
                      whileHover={{ y: -4 }}
                      className="bg-white/80 backdrop-blur-xl rounded-2xl border border-charcoal/5 shadow-lg hover:shadow-xl transition-all overflow-hidden"
                    >
                      <div className="relative h-48 bg-gradient-to-br from-charcoal/10 to-charcoal/5 flex items-center justify-center">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gold/20 to-gold-dark/20 flex items-center justify-center">
                          <span className="text-2xl font-bold text-gold-dark">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-white font-serif text-xl font-bold mb-1">{member.name}</h3>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              member.status === 'on-duty' ? 'bg-green-500 animate-pulse' :
                              member.status === 'available' ? 'bg-yellow-500' : 'bg-gray-500'
                            }`} />
                            <span className="text-white/80 text-xs font-bold uppercase tracking-wider">
                              {member.status.replace('-', ' ')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-[10px] text-charcoal/50 font-bold uppercase tracking-wider mb-2">Role</p>
                            <p className="text-xs font-bold text-charcoal">{member.role}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-charcoal/50 font-bold uppercase tracking-wider mb-2">Rating</p>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-gold text-gold" />
                              <span className="text-xs font-bold text-charcoal">{member.rating}</span>
                            </div>
                          </div>
                        </div>
                        {member.specialization && (
                          <div className="mb-4">
                            <p className="text-[10px] text-charcoal/50 font-bold uppercase tracking-wider mb-2">Specialization</p>
                            <div className="flex flex-wrap gap-1">
                              {member.specialization.map((spec, idx) => (
                                <span key={idx} className="px-2 py-1 bg-charcoal/5 rounded text-[9px] font-bold text-charcoal/70">
                                  {spec}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        <button className="w-full py-3 border border-gold-dark text-gold-dark rounded-xl font-bold text-xs hover:bg-gold-dark hover:text-parchment transition-all uppercase tracking-wider">
                          {member.status === 'on-duty' ? 'Reassign' : 'Assign Task'}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'schedule' && (
            <motion.div
              key="schedule"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white/80 backdrop-blur-xl rounded-2xl border border-charcoal/5 shadow-lg p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-serif text-xl font-bold text-charcoal">Staff Schedule</h3>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-white border border-charcoal/10 rounded-lg text-sm font-semibold hover:bg-charcoal/5 transition-colors">
                    Day
                  </button>
                  <button className="px-4 py-2 bg-charcoal text-parchment rounded-lg text-sm font-semibold">
                    Week
                  </button>
                  <button className="px-4 py-2 bg-white border border-charcoal/10 rounded-lg text-sm font-semibold hover:bg-charcoal/5 transition-colors">
                    Month
                  </button>
                </div>
              </div>
              <div className="text-center py-12 text-charcoal/40">
                <Calendar className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p className="text-sm mb-2">Gantt Timeline View</p>
                <p className="text-xs">Interactive scheduling interface coming soon</p>
              </div>
            </motion.div>
          )}

          {activeSection === 'roster' && (
            <motion.div
              key="roster"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white/80 backdrop-blur-xl rounded-2xl border border-charcoal/5 shadow-lg p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-serif text-xl font-bold text-charcoal">Monthly Roster</h3>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-white border border-charcoal/10 rounded-lg text-sm font-semibold hover:bg-charcoal/5 transition-colors">
                    Export
                  </button>
                  <button className="px-4 py-2 bg-gold text-charcoal rounded-lg text-sm font-bold hover:bg-gold-dark hover:text-parchment transition-colors">
                    Publish Roster
                  </button>
                </div>
              </div>
              <div className="text-center py-12 text-charcoal/40">
                <Users className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p className="text-sm mb-2">Roster Management</p>
                <p className="text-xs">Calendar view with time-off requests coming soon</p>
              </div>
            </motion.div>
          )}

          {activeSection === 'inventory' && (
            <motion.div
              key="inventory"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {inventory.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i }}
                    whileHover={{ y: -4 }}
                    className="bg-white/80 backdrop-blur-xl rounded-2xl border border-charcoal/5 shadow-lg hover:shadow-xl transition-all overflow-hidden"
                  >
                    <div className="h-48 bg-gradient-to-br from-charcoal/10 to-charcoal/5 flex items-center justify-center relative">
                      <Package className="w-16 h-16 text-charcoal/20" />
                      <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                        item.status === 'available' ? 'bg-green-100 text-green-700' :
                        item.status === 'in-use' ? 'bg-gold/20 text-gold-dark' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {item.status.replace('-', ' ')}
                      </span>
                      <span className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold border border-charcoal/10">
                        ID: {item.id_code}
                      </span>
                    </div>
                    <div className="p-5">
                      <h4 className="font-serif text-lg font-bold text-charcoal mb-2">{item.name}</h4>
                      <p className="text-xs text-charcoal/50 mb-4">Category: {item.category}</p>
                      {item.assignedTo && (
                        <p className="text-xs text-charcoal/60 mb-4">Assigned to: <span className="font-semibold">{item.assignedTo}</span></p>
                      )}
                      <div className="flex justify-between items-center pt-4 border-t border-charcoal/5">
                        <span className="text-[10px] text-charcoal/50">
                          {item.status === 'available' ? 'Ready for Assignment' :
                           item.status === 'in-use' ? 'In Active Rotation' :
                           'Service Required'}
                        </span>
                        <button className="text-gold-dark hover:text-charcoal transition-colors">
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeSection === 'requests' && (
            <motion.div
              key="requests"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white/80 backdrop-blur-xl rounded-2xl border border-charcoal/5 shadow-lg overflow-hidden"
            >
              <div className="p-6 border-b border-charcoal/5">
                <h3 className="font-serif text-xl font-bold text-charcoal">All Service Requests</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-charcoal/[0.02] border-b border-charcoal/5">
                    <tr>
                      <th className="px-6 py-4 text-left text-[10px] font-bold tracking-widest text-charcoal/50 uppercase">Request</th>
                      <th className="px-6 py-4 text-left text-[10px] font-bold tracking-widest text-charcoal/50 uppercase">Category</th>
                      <th className="px-6 py-4 text-left text-[10px] font-bold tracking-widest text-charcoal/50 uppercase">Location</th>
                      <th className="px-6 py-4 text-left text-[10px] font-bold tracking-widest text-charcoal/50 uppercase">Time</th>
                      <th className="px-6 py-4 text-left text-[10px] font-bold tracking-widest text-charcoal/50 uppercase">Status</th>
                      <th className="px-6 py-4 text-right text-[10px] font-bold tracking-widest text-charcoal/50 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-charcoal/5">
                    {requests.map((request, i) => (
                      <motion.tr
                        key={request.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.05 * i }}
                        className="hover:bg-charcoal/[0.02] transition-colors"
                      >
                        <td className="px-6 py-5">
                          <p className="font-bold text-charcoal text-sm">{request.title}</p>
                          {request.guest && <p className="text-[10px] text-charcoal/50">Guest: {request.guest}</p>}
                        </td>
                        <td className="px-6 py-5 text-sm text-charcoal/70">{request.category}</td>
                        <td className="px-6 py-5 text-sm text-charcoal/70">{request.location}</td>
                        <td className="px-6 py-5 text-sm text-charcoal/70">{request.time}</td>
                        <td className="px-6 py-5">
                          <span className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full ${
                            request.status === 'completed' ? 'bg-green-100 text-green-700' :
                            request.status === 'assigned' ? 'bg-blue-100 text-blue-700' :
                            request.status === 'in-progress' ? 'bg-gold/20 text-gold-dark' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {request.status}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          {request.status === 'unassigned' && (
                            <button className="px-4 py-2 bg-gold text-charcoal rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-gold-dark hover:text-parchment transition-all">
                              Assign
                            </button>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
