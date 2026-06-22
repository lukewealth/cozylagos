import React from 'react';
import { Users, Home, Calendar, ShieldAlert, Settings, Search, MoreVertical, CheckCircle, XCircle } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="flex-grow w-full max-w-[1440px] mx-auto px-6 md:px-12 xl:px-20 py-12 animate-fade-in-up text-left space-y-12">
      <header className="border-b border-charcoal/5 pb-6 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 text-gold-dark font-bold text-[10px] tracking-[0.25em] uppercase mb-1">
            <span>System Management</span>
          </div>
          <h1 className="font-serif text-3.5xl md:text-5xl font-bold text-charcoal leading-none">
            Admin Portal
          </h1>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" />
            <input 
              type="text" 
              placeholder="Search users, listings..." 
              className="pl-9 pr-4 py-2 bg-white border border-charcoal/10 rounded-full text-xs focus:outline-none focus:ring-1 focus:ring-gold w-64"
            />
          </div>
          <button className="p-2 bg-white border border-charcoal/10 rounded-full"><Settings className="w-4 h-4 text-charcoal/60" /></button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Users', value: '1,420', icon: Users },
          { label: 'Active Listings', value: '84', icon: Home },
          { label: 'Bookings Today', value: '24', icon: Calendar },
          { label: 'System Flags', value: '2', icon: ShieldAlert, color: 'text-red-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-charcoal/5 shadow-sm">
            <stat.icon className={`w-6 h-6 mb-4 ${stat.color || 'text-gold-dark'}`} />
            <p className="text-[10px] font-bold tracking-widest text-charcoal/40 uppercase">{stat.label}</p>
            <p className="text-2xl font-serif font-bold text-charcoal mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* User Management */}
        <section className="lg:col-span-2 bg-white border border-charcoal/5 rounded-3xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-charcoal/5 flex justify-between items-center">
            <h3 className="font-serif text-lg font-bold text-charcoal">User Moderation</h3>
            <button className="text-xs font-bold text-gold-dark uppercase tracking-widest">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] uppercase tracking-widest text-charcoal/40 bg-parchment/30">
                  <th className="px-6 py-3 font-bold">User</th>
                  <th className="px-6 py-3 font-bold">Role</th>
                  <th className="px-6 py-3 font-bold">Status</th>
                  <th className="px-6 py-3 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {[
                  { name: 'Emeka Anene', email: 'emeka@cozy.ng', role: 'Host', status: 'Verified' },
                  { name: 'Alexander Sterling', email: 'alex@sterling.com', role: 'Guest', status: 'Verified' },
                  { name: 'Sarah Jenkins', email: 'sjenkins@media.co', role: 'Provider', status: 'Pending Review' },
                  { name: 'Unknown User', email: 'spam@bot.net', role: 'Guest', status: 'Flagged' },
                ].map((user, i) => (
                  <tr key={i} className="border-b border-charcoal/5 hover:bg-parchment/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gold/10" />
                        <div>
                          <p className="font-bold text-charcoal">{user.name}</p>
                          <p className="text-[10px] text-charcoal/40">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-charcoal/60">{user.role}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        user.status === 'Verified' ? 'bg-green-100 text-green-700' : 
                        user.status === 'Flagged' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg"><CheckCircle className="w-4 h-4" /></button>
                        <button className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><XCircle className="w-4 h-4" /></button>
                        <button className="p-1.5 text-charcoal/40 hover:bg-charcoal/5 rounded-lg"><MoreVertical className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* System Audit Logs */}
        <section className="bg-white border border-charcoal/5 rounded-3xl p-6 shadow-sm">
          <h3 className="font-serif text-lg font-bold text-charcoal mb-6">Audit Trail</h3>
          <div className="space-y-6">
            {[
              { msg: 'New user registered: alex@sterling.com', time: '2m ago', type: 'info' },
              { msg: 'Listing ID #L-923 flagged for content', time: '15m ago', type: 'warning' },
              { msg: 'Admin login: super_admin', time: '1h ago', type: 'success' },
              { msg: 'Transaction CL-TX8924 processed', time: '3h ago', type: 'info' },
            ].map((log, i) => (
              <div key={i} className="flex gap-4 text-left">
                <div className={`w-1 h-8 rounded-full ${
                  log.type === 'warning' ? 'bg-red-400' : 
                  log.type === 'success' ? 'bg-green-400' : 'bg-gold-400'
                }`} />
                <div>
                  <p className="text-xs font-medium text-charcoal">{log.msg}</p>
                  <p className="text-[10px] text-charcoal/40 mt-0.5">{log.time}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
