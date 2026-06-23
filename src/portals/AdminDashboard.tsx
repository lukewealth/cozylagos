import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Users, Home, Calendar, ShieldAlert, Settings, Search, MoreVertical, CheckCircle, XCircle, Map as MapIcon, List, Eye, Edit3, Trash2, Power } from 'lucide-react';
import { Listing } from '../types';

interface AdminDashboardProps {
  listings: Listing[];
  onToggleStatus: (id: string) => void;
  onDeleteListing: (id: string) => void;
}

export default function AdminDashboard({ listings, onToggleStatus, onDeleteListing }: AdminDashboardProps) {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredListings = listings.filter(l => 
    l.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    l.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-grow w-full max-w-[1440px] mx-auto px-6 md:px-12 xl:px-20 py-12 animate-fade-in-up text-left space-y-12">
      <header className="border-b border-charcoal/5 pb-6 flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <div className="flex items-center gap-2 text-gold-dark font-bold text-[10px] tracking-[0.25em] uppercase mb-1">
            <span>System Management</span>
          </div>
          <h1 className="font-serif text-3.5xl md:text-5xl font-bold text-charcoal leading-none">
            Admin Portal
          </h1>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" />
            <input 
              type="text" 
              placeholder="Search listings, users..." 
              className="w-full pl-9 pr-4 py-2 bg-white border border-charcoal/10 rounded-full text-xs focus:outline-none focus:ring-1 focus:ring-gold"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex bg-white border border-charcoal/10 rounded-full p-1">
            <button 
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-full transition-all ${viewMode === 'list' ? 'bg-charcoal text-parchment shadow-sm' : 'text-charcoal/40 hover:text-charcoal'}`}
            >
              <List className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('map')}
              className={`p-1.5 rounded-full transition-all ${viewMode === 'map' ? 'bg-charcoal text-parchment shadow-sm' : 'text-charcoal/40 hover:text-charcoal'}`}
            >
              <MapIcon className="w-4 h-4" />
            </button>
          </div>
          <button className="p-2 bg-white border border-charcoal/10 rounded-full"><Settings className="w-4 h-4 text-charcoal/60" /></button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Users', value: '1,420', icon: Users },
          { label: 'Active Listings', value: listings.length.toString(), icon: Home },
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

      {viewMode === 'list' ? (
        <section className="bg-white border border-charcoal/5 rounded-3xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-charcoal/5 flex justify-between items-center bg-parchment/30">
            <h3 className="font-serif text-lg font-bold text-charcoal">Residence Management</h3>
            <div className="flex gap-2">
              <button className="text-[10px] font-bold text-gold-dark uppercase tracking-widest px-3 py-1.5 bg-white border border-gold/20 rounded-lg hover:bg-gold/5">Add New</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] uppercase tracking-widest text-charcoal/40 bg-white">
                  <th className="px-6 py-4 font-bold">Residence</th>
                  <th className="px-6 py-4 font-bold">Location</th>
                  <th className="px-6 py-4 font-bold">Category</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredListings.map((listing) => (
                  <tr key={listing.id} className="border-b border-charcoal/5 hover:bg-parchment/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={listing.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                        <div>
                          <p className="font-bold text-charcoal">{listing.title}</p>
                          <p className="text-[10px] text-charcoal/40">₦{listing.nightlyRate.toLocaleString()} / Night</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-charcoal/60">{listing.location}</td>
                    <td className="px-6 py-4 text-charcoal/60">{listing.category}</td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => onToggleStatus(listing.id)}
                        className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full transition-colors ${
                          listing.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {listing.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-1.5 text-charcoal/40 hover:text-gold-dark hover:bg-gold/10 rounded-lg transition-colors"><Edit3 className="w-4 h-4" /></button>
                        <button className="p-1.5 text-charcoal/40 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                        <button className="p-1.5 text-charcoal/40 hover:bg-charcoal/5 rounded-lg transition-colors"><MoreVertical className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredListings.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-charcoal/40 italic text-sm">
                      No residences found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        <section className="relative w-full h-[600px] bg-charcoal/5 rounded-3xl overflow-hidden border border-charcoal/10">
          {/* Placeholder for Map Integration */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-charcoal/30 space-y-4">
            <MapIcon size={64} />
            <p className="font-serif text-xl">Map View Interface</p>
            <p className="text-sm">Interactive map loading...</p>
          </div>
          
          {/* Mock Map Markers */}
          {filteredListings.map((listing, idx) => (
            <motion.div
              key={listing.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="absolute cursor-pointer group"
              style={{ 
                top: `${20 + (idx * 15) % 60}%`, 
                left: `${20 + (idx * 25) % 60}%` 
              }}
            >
              <div className="relative">
                <div className="w-4 h-4 bg-gold-dark rounded-full ring-4 ring-white shadow-lg" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  <div className="bg-white px-3 py-2 rounded-xl shadow-xl border border-charcoal/10 whitespace-nowrap">
                    <p className="text-xs font-bold text-charcoal">{listing.title}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </section>
      )}
    </div>
  );
}
