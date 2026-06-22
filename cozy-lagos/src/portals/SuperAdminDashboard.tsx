import React from 'react';
import { ShieldAlert, Users, Database, Globe, Key, Settings, Lock } from 'lucide-react';

export default function SuperAdminDashboard() {
  return (
    <div className="flex-grow w-full max-w-[1440px] mx-auto px-6 md:px-12 xl:px-20 py-12 animate-fade-in-up text-left space-y-12">
      <header className="border-b border-charcoal/5 pb-6 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 text-red-600 font-bold text-[10px] tracking-[0.25em] uppercase mb-1">
            <span>Root Access Level</span>
          </div>
          <h1 className="font-serif text-3.5xl md:text-5xl font-bold text-charcoal leading-none">
            Super Admin Console
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-full text-xs font-bold border border-red-100">
            <Lock className="w-3.5 h-3.5" />
            <span>Encrypted Session</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* System Health Overview */}
        <section className="lg:col-span-2 bg-white border border-charcoal/5 rounded-3xl p-8 shadow-sm">
          <h3 className="font-serif text-xl font-bold text-charcoal mb-8">Global Infrastructure Health</h3>
          <div className="space-y-8">
            {[
              { name: 'Database Synchronization', status: 'Operational', load: '12%', color: 'text-green-500' },
              { name: 'Real-time Concierge Engine', status: 'Operational', load: '45%', color: 'text-green-500' },
              { name: 'Payment Gateway (Stripe/Flutterwave)', status: 'High Latency', load: '88%', color: 'text-orange-500' },
              { name: 'Edge CDN (Lagos/London)', status: 'Operational', load: '5%', color: 'text-green-500' },
            ].map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-charcoal">{item.name}</span>
                  <span className={`font-bold ${item.color}`}>{item.status}</span>
                </div>
                <div className="w-full h-2 bg-charcoal/5 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color.replace('text-', 'bg-')} transition-all duration-1000`} style={{ width: item.load }} />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-charcoal/40 uppercase">
                  <span>Load</span>
                  <span>{item.load}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Critical Control Panel */}
        <section className="bg-charcoal text-parchment rounded-3xl p-8 shadow-xl">
          <h3 className="font-serif text-xl font-bold text-white mb-6">Critical Controls</h3>
          <div className="space-y-4">
            <button className="w-full p-4 bg-red-600/20 border border-red-600/40 text-red-500 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2">
              <ShieldAlert className="w-4 h-4" />
              Emergency Platform Lockout
            </button>
            <button className="w-full p-4 bg-white/5 border border-white/10 text-parchment rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2">
              <Database className="w-4 h-4" />
              Flush Global Cache
            </button>
            <button className="w-full p-4 bg-white/5 border border-white/10 text-parchment rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2">
              <Globe className="w-4 h-4" />
              Maintenance Mode
            </button>
            <button className="w-full p-4 bg-white/5 border border-white/10 text-parchment rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2">
              <Users className="w-4 h-4" />
              Manage Admins
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
