import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldAlert, Users, Database, Globe, Key, Settings, Lock, Copy, Check, Eye, EyeOff,
  RefreshCw, UserPlus, Edit3, Trash2, Search, Filter, ChevronDown, AlertCircle,
  CheckCircle, XCircle, Clock, TrendingUp, Activity, Zap, Server, Wifi, Shield,
  Mail, Phone, Calendar, Star, Award, BadgeCheck, MoreVertical, Download, Upload
} from 'lucide-react';
import { useDatabase } from '../hooks/useDatabase';
import { useAuth } from '../auth';
import Tooltip from '../components/ui/Tooltip';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import CollapsibleSidebar from '../components/ui/CollapsibleSidebar';
import { getAllUsers, DEMO_CREDENTIALS } from '../utils/credentials';

interface UserDisplay {
  id: string;
  role: string;
  email: string;
  name: string;
  status: 'active' | 'inactive' | 'pending';
  lastLogin?: string;
  loyaltyPoints?: number;
  phone?: string;
}

export default function SuperAdminDashboard() {
  const { currentUser } = useAuth();
  const { data: dbUsers } = useDatabase('users');
  
  const [activeSection, setActiveSection] = useState<'overview' | 'users' | 'infrastructure'>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Get users without passwords
  const users: UserDisplay[] = getAllUsers().map(u => ({
    ...u,
    status: 'active' as const
  }));

  const handleCopyEmail = (email: string, id: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(id);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role: string) => {
    const badges = {
      user: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Guest User' },
      admin: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Admin' },
      super_admin: { bg: 'bg-red-100', text: 'text-red-700', label: 'Super Admin' },
      guest: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Guest' },
      service_provider: { bg: 'bg-green-100', text: 'text-green-700', label: 'Provider' },
    };
    return badges[role as keyof typeof badges] || badges.user;
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" text="Loading Super Admin Console..." fullScreen />;
  }

  return (
    <div className="flex min-h-screen bg-parchment">
      <CollapsibleSidebar
        activeTab="super-admin-dashboard"
        setActiveTab={setActiveSection as any}
        userRole="super_admin"
      />

      <main className="flex-1 ml-[280px] transition-all duration-300">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 xl:px-20 py-12">
          {/* Header */}
          <header className="border-b border-charcoal/5 pb-6 mb-12">
            <div className="flex justify-between items-end">
              <div>
                <div className="flex items-center gap-2 text-red-600 font-bold text-[10px] tracking-[0.25em] uppercase mb-1">
                  <Shield className="w-3 h-3" />
                  <span>Root Access Level</span>
                </div>
                <h1 className="font-serif text-3.5xl md:text-5xl font-bold text-charcoal leading-none">
                  Super Admin Console
                </h1>
                <p className="text-sm text-charcoal-light mt-2">
                  Full system control and user management
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Tooltip content="Encrypted Session" description="All data is secure">
                  <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-full text-xs font-bold border border-red-100">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Encrypted</span>
                  </div>
                </Tooltip>
              </div>
            </div>
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {[
              { label: 'Total Users', value: DEMO_CREDENTIALS.length, icon: Users, color: 'text-blue-600', change: '+2 this week' },
              { label: 'Active Sessions', value: '3', icon: Activity, color: 'text-green-600', change: 'Live now' },
              { label: 'System Uptime', value: '99.98%', icon: Server, color: 'text-primary', change: 'Last 30 days' },
              { label: 'Pending Actions', value: '2', icon: Clock, color: 'text-amber-600', change: 'Requires attention' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 rounded-3xl border border-charcoal/5 shadow-sm hover:shadow-lg transition-all"
              >
                <stat.icon className={`w-6 h-6 ${stat.color} mb-4`} />
                <p className="text-[10px] font-bold tracking-widest text-charcoal/40 uppercase">{stat.label}</p>
                <p className="text-2xl font-serif font-bold text-charcoal mt-1">{stat.value}</p>
                <p className="text-xs text-charcoal/60 mt-1">{stat.change}</p>
              </motion.div>
            ))}
          </div>

          {/* User Credentials Management */}
          <section className="bg-white border border-charcoal/5 rounded-3xl p-8 shadow-sm mb-12">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="font-serif text-2xl font-bold text-charcoal">User Credentials & Access</h3>
                <p className="text-sm text-charcoal-light mt-1">Manage login credentials for all user roles</p>
              </div>
              <div className="flex gap-3">
                <Tooltip content="Export Users" description="Download CSV">
                  <button className="p-3 border border-charcoal/10 hover:border-charcoal rounded-xl transition-colors">
                    <Download className="w-4 h-4 text-charcoal/60" />
                  </button>
                </Tooltip>
                <Tooltip content="Import Users" description="Upload CSV">
                  <button className="p-3 border border-charcoal/10 hover:border-charcoal rounded-xl transition-colors">
                    <Upload className="w-4 h-4 text-charcoal/60" />
                  </button>
                </Tooltip>
                <Tooltip content="Add New User" description="Create account">
                  <button className="flex items-center gap-2 px-4 py-3 bg-primary text-on-primary rounded-xl font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity">
                    <UserPlus className="w-4 h-4" />
                    Add User
                  </button>
                </Tooltip>
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-parchment border border-charcoal/10 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="relative">
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="appearance-none px-4 py-2.5 pr-10 bg-parchment border border-charcoal/10 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                >
                  <option value="all">All Roles</option>
                  <option value="user">Guest Users</option>
                  <option value="admin">Admins</option>
                  <option value="super_admin">Super Admins</option>
                  <option value="service_provider">Providers</option>
                  <option value="guest">Guests</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40 pointer-events-none" />
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-charcoal/10">
                    <th className="text-left py-4 px-4 text-[10px] font-bold tracking-widest text-charcoal/40 uppercase">User</th>
                    <th className="text-left py-4 px-4 text-[10px] font-bold tracking-widest text-charcoal/40 uppercase">Role</th>
                    <th className="text-left py-4 px-4 text-[10px] font-bold tracking-widest text-charcoal/40 uppercase">Email</th>
                    <th className="text-left py-4 px-4 text-[10px] font-bold tracking-widest text-charcoal/40 uppercase">Status</th>
                    <th className="text-left py-4 px-4 text-[10px] font-bold tracking-widest text-charcoal/40 uppercase">Last Login</th>
                    <th className="text-right py-4 px-4 text-[10px] font-bold tracking-widest text-charcoal/40 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, i) => {
                    const roleBadge = getRoleBadge(user.role);
                    return (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="border-b border-charcoal/5 hover:bg-parchment/50 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-sm font-bold text-primary">
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <p className="font-bold text-charcoal text-sm">{user.name}</p>
                              <p className="text-[10px] text-charcoal/40">{user.loyaltyPoints?.toLocaleString()} pts</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${roleBadge.bg} ${roleBadge.text}`}>
                            {roleBadge.label}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-charcoal font-mono">{user.email}</span>
                            <Tooltip content={copiedEmail === user.id ? 'Copied!' : 'Copy Email'}>
                              <button
                                onClick={() => handleCopyEmail(user.email, user.id)}
                                className="p-1 hover:bg-charcoal/5 rounded transition-colors"
                              >
                                {copiedEmail === user.id ? (
                                  <Check className="w-3.5 h-3.5 text-green-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5 text-charcoal/40" />
                                )}
                              </button>
                            </Tooltip>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`flex items-center gap-1.5 text-xs font-bold ${
                            user.status === 'active' ? 'text-green-600' : user.status === 'inactive' ? 'text-charcoal/40' : 'text-amber-600'
                          }`}>
                            <span className={`w-2 h-2 rounded-full ${
                              user.status === 'active' ? 'bg-green-500' : user.status === 'inactive' ? 'bg-charcoal/20' : 'bg-amber-500'
                            }`} />
                            {user.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-xs text-charcoal/60">
                            {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Tooltip content="Edit User">
                              <button className="p-2 hover:bg-charcoal/5 rounded-lg transition-colors">
                                <Edit3 className="w-4 h-4 text-charcoal/60" />
                              </button>
                            </Tooltip>
                            <Tooltip content="Reset Password">
                              <button className="p-2 hover:bg-charcoal/5 rounded-lg transition-colors">
                                <Key className="w-4 h-4 text-charcoal/60" />
                              </button>
                            </Tooltip>
                            <Tooltip content="More Actions">
                              <button className="p-2 hover:bg-charcoal/5 rounded-lg transition-colors">
                                <MoreVertical className="w-4 h-4 text-charcoal/60" />
                              </button>
                            </Tooltip>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* System Health */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <section className="lg:col-span-2 bg-white border border-charcoal/5 rounded-3xl p-8 shadow-sm">
              <h3 className="font-serif text-xl font-bold text-charcoal mb-8">Global Infrastructure Health</h3>
              <div className="space-y-8">
                {[
                  { name: 'Database Synchronization', status: 'Operational', load: '12%', color: 'text-green-500' },
                  { name: 'Real-time Concierge Engine', status: 'Operational', load: '45%', color: 'text-green-500' },
                  { name: 'Payment Gateway (Stripe/Flutterwave)', status: 'High Latency', load: '88%', color: 'text-orange-500' },
                  { name: 'Edge CDN (Lagos/London)', status: 'Operational', load: '5%', color: 'text-green-500' },
                ].map((item, i) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex justify-between text-sm">
                      <span className="font-bold text-charcoal">{item.name}</span>
                      <span className={`font-bold ${item.color}`}>{item.status}</span>
                    </div>
                    <div className="w-full h-2 bg-charcoal/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: item.load }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        className={`h-full ${item.color.replace('text-', 'bg-')}`}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] font-mono text-charcoal/40 uppercase">
                      <span>Load</span>
                      <span>{item.load}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            <section className="bg-charcoal text-parchment rounded-3xl p-8 shadow-xl">
              <h3 className="font-serif text-xl font-bold text-white mb-6">Critical Controls</h3>
              <div className="space-y-4">
                <Tooltip content="Emergency Lockout" description="Disable all access" position="left">
                  <button className="w-full p-4 bg-red-600/20 border border-red-600/40 text-red-500 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2">
                    <ShieldAlert className="w-4 h-4" />
                    Emergency Lockout
                  </button>
                </Tooltip>
                <Tooltip content="Clear Cache" description="Flush all cached data" position="left">
                  <button className="w-full p-4 bg-white/5 border border-white/10 text-parchment rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                    <Database className="w-4 h-4" />
                    Flush Cache
                  </button>
                </Tooltip>
                <Tooltip content="Maintenance Mode" description="Take system offline" position="left">
                  <button className="w-full p-4 bg-white/5 border border-white/10 text-parchment rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                    <Globe className="w-4 h-4" />
                    Maintenance Mode
                  </button>
                </Tooltip>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
