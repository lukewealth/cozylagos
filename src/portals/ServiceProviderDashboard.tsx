import React from 'react';
import { Utensils, Car, Camera, ShieldCheck, TrendingUp, Package, Star, Clock } from 'lucide-react';

export default function ServiceProviderDashboard() {
  return (
    <div className="flex-grow w-full max-w-[1440px] mx-auto px-6 md:px-12 xl:px-20 py-12 animate-fade-in-up text-left space-y-12">
      <header className="border-b border-charcoal/5 pb-6">
        <div className="flex items-center gap-2 text-gold-dark font-bold text-[10px] tracking-[0.25em] uppercase mb-1">
          <span>Vendor Workspace</span>
        </div>
        <h1 className="font-serif text-3.5xl md:text-5xl font-bold text-charcoal leading-none">
          Vendor Dashboard
        </h1>
        <p className="text-sm text-charcoal-light mt-2 max-w-xl">
          Manage your service offerings, bookings, and earnings.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Earnings', value: '₦1,250,000', icon: TrendingUp },
          { label: 'Active Bookings', value: '12', icon: Clock },
          { label: 'Service Rating', value: '4.9', icon: Star },
          { label: 'New Requests', value: '3', icon: Package },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-charcoal/5 shadow-sm">
            <stat.icon className="w-6 h-6 text-gold-dark mb-4" />
            <p className="text-[10px] font-bold tracking-widest text-charcoal/40 uppercase">{stat.label}</p>
            <p className="text-2xl font-serif font-bold text-charcoal mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Service Catalog Management */}
        <section className="bg-white border border-charcoal/5 rounded-3xl p-6 md:p-8 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-serif text-xl font-bold text-charcoal">Your Services</h3>
            <button className="text-xs font-bold text-gold-dark uppercase tracking-widest hover:text-gold-dark/80 transition-colors">+ Add Service</button>
          </div>
          <div className="space-y-4">
            {[
              { name: 'Private Chef (Gourmet Fusion)', category: 'Chef', price: '₦30,000/day', status: 'Active' },
              { name: 'Executive Chauffeur', category: 'Driver', price: '₦120,000/day', status: 'Active' },
              { name: 'Event Photography', category: 'Photographer', price: '₦250,000/session', status: 'Paused' },
            ].map((service, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-parchment/30 rounded-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                    <Utensils className="w-5 h-5 text-charcoal/60" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-charcoal">{service.name}</h4>
                    <p className="text-[10px] text-charcoal/50 uppercase tracking-wider">{service.category} &bull; {service.price}</p>
                  </div>
                </div>
                <span className={`text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full ${
                  service.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                }`}>
                  {service.status}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Service Bookings */}
        <section className="bg-white border border-charcoal/5 rounded-3xl p-6 md:p-8 shadow-sm">
          <h3 className="font-serif text-xl font-bold text-charcoal mb-6">Recent Bookings</h3>
          <div className="space-y-4">
             {[1, 2, 3].map(i => (
               <div key={i} className="flex items-center gap-4 p-4 border-b border-charcoal/5 last:border-0">
                 <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                   <ShieldCheck className="w-5 h-5 text-gold-dark" />
                 </div>
                 <div className="flex-grow">
                   <h4 className="text-sm font-bold text-charcoal">Request from Alexander S.</h4>
                   <p className="text-xs text-charcoal-light">Private Chef Service - Oct 13</p>
                 </div>
                 <button className="px-3 py-1 bg-charcoal text-parchment rounded-full text-[9px] font-bold uppercase">Accept</button>
               </div>
             ))}
          </div>
        </section>
      </div>
    </div>
  );
}
