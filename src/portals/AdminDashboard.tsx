import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Users, Home, Calendar, ShieldAlert, Settings, Search, MoreVertical,
  CheckCircle, XCircle, Map as MapIcon, List, Eye, Edit3, Trash2, Power,
  Clock, AlertCircle, DollarSign, TrendingUp, Bell, Filter, ChevronDown,
  MessageCircle, Phone, Mail, RefreshCw
} from 'lucide-react';
import { Listing } from '../types';
import { useDatabase } from '../hooks/useDatabase';
import api from '../services/api';

interface AdminDashboardProps {
  listings: Listing[];
  onToggleStatus: (id: string) => void;
  onDeleteListing: (id: string) => void;
}

interface BookingRequest {
  id: string;
  listingId: string;
  listingTitle: string;
  guestName: string;
  guestEmail: string;
  checkIn: string;
  checkOut: string;
  guestsCount: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  services?: string[];
}

export default function AdminDashboard({ listings, onToggleStatus, onDeleteListing }: AdminDashboardProps) {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState<'listings' | 'bookings' | 'analytics'>('listings');
  const [selectedBooking, setSelectedBooking] = useState<BookingRequest | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmNotes, setConfirmNotes] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  const { data: bookings, addRecord: updateBooking } = useDatabase('bookings');

  const pendingBookings = (bookings as any[]).filter(
    (b: any) => b.status === 'pending' || b.status === 'Pending'
  );

  const confirmedBookings = (bookings as any[]).filter(
    (b: any) => b.status === 'confirmed' || b.status === 'Confirmed'
  );

  const filteredListings = listings.filter(l =>
    l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConfirmBooking = async (booking: BookingRequest) => {
    try {
      await api.bookings.confirm(booking.id);
    } catch (e) {
      console.log('API not available, updating locally');
    }
    updateBooking({ ...booking, status: 'confirmed', updatedAt: new Date().toISOString() } as any);
    setShowConfirmModal(false);
    setConfirmNotes('');
    setSelectedBooking(null);
  };

  const handleRejectBooking = async (booking: BookingRequest) => {
    try {
      await api.bookings.updateStatus(booking.id, 'cancelled');
    } catch (e) {
      console.log('API not available, updating locally');
    }
    updateBooking({ ...booking, status: 'cancelled', updatedAt: new Date().toISOString() } as any);
    setShowRejectModal(false);
    setRejectReason('');
    setSelectedBooking(null);
  };

  const handleWhatsAppNotify = (booking: BookingRequest) => {
    const message = `Hi ${booking.guestName}, your booking for ${booking.listingTitle} (${booking.checkIn} to ${booking.checkOut}) has been confirmed! Total: ₦${booking.totalAmount.toLocaleString()}. Welcome to Cozy Lagos!`;
    const whatsappUrl = `https://wa.me/2348064305782?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const totalRevenue = confirmedBookings.reduce((sum: number, b: any) => sum + (b.totalAmount || 0), 0);

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
          { label: 'Pending Bookings', value: pendingBookings.length.toString(), icon: Clock, color: pendingBookings.length > 0 ? 'text-amber-500' : 'text-gold-dark' },
          { label: 'Total Revenue', value: `₦${(totalRevenue / 1000000).toFixed(1)}M`, icon: DollarSign, color: 'text-green-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-charcoal/5 shadow-sm">
            <stat.icon className={`w-6 h-6 mb-4 ${stat.color || 'text-gold-dark'}`} />
            <p className="text-[10px] font-bold tracking-widest text-charcoal/40 uppercase">{stat.label}</p>
            <p className="text-2xl font-serif font-bold text-charcoal mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 border-b border-charcoal/5">
        {[
          { id: 'bookings' as const, label: 'Booking Requests', count: pendingBookings.length, icon: Clock },
          { id: 'listings' as const, label: 'Residences', count: listings.length, icon: Home },
          { id: 'analytics' as const, label: 'Analytics', icon: TrendingUp },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
              activeSection === tab.id
                ? 'text-gold-dark border-gold'
                : 'text-charcoal/40 hover:text-charcoal/60 border-transparent'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded-full text-[9px]">{tab.count}</span>
            )}
          </button>
        ))}
      </div>

      {activeSection === 'bookings' && (
        <section className="space-y-6">
          {pendingBookings.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <p className="text-sm text-amber-800">
                <strong>{pendingBookings.length}</strong> booking{pendingBookings.length !== 1 ? 's' : ''} awaiting your confirmation
              </p>
            </div>
          )}

          <div className="bg-white border border-charcoal/5 rounded-3xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-charcoal/5 flex justify-between items-center bg-parchment/30">
              <h3 className="font-serif text-lg font-bold text-charcoal">Booking Requests</h3>
              <div className="flex gap-2">
                <button className="text-[10px] font-bold text-gold-dark uppercase tracking-widest px-3 py-1.5 bg-white border border-gold/20 rounded-lg hover:bg-gold/5 flex items-center gap-1">
                  <RefreshCw className="w-3 h-3" />
                  Refresh
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[10px] uppercase tracking-widest text-charcoal/40 bg-white">
                    <th className="px-6 py-4 font-bold">Guest</th>
                    <th className="px-6 py-4 font-bold">Property</th>
                    <th className="px-6 py-4 font-bold">Dates</th>
                    <th className="px-6 py-4 font-bold">Amount</th>
                    <th className="px-6 py-4 font-bold">Status</th>
                    <th className="px-6 py-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {(bookings as any[]).slice(0, 20).map((booking: any) => (
                    <tr key={booking.id} className="border-b border-charcoal/5 hover:bg-parchment/30 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-bold text-charcoal">{booking.guestName}</p>
                          <p className="text-[10px] text-charcoal/40">{booking.guestEmail}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-charcoal/60">{booking.listingTitle}</td>
                      <td className="px-6 py-4">
                        <div className="text-xs">
                          <p className="text-charcoal/60">{booking.checkIn}</p>
                          <p className="text-charcoal/40 text-[10px]">to {booking.checkOut}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-gold-dark">₦{(booking.totalAmount || 0).toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
                          booking.status === 'confirmed' || booking.status === 'Confirmed'
                            ? 'bg-green-100 text-green-700'
                            : booking.status === 'cancelled' || booking.status === 'Cancelled'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {(booking.status === 'pending' || booking.status === 'Pending') && (
                            <>
                              <button
                                onClick={() => { setSelectedBooking(booking); setShowConfirmModal(true); }}
                                className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Confirm"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => { setSelectedBooking(booking); setShowRejectModal(true); }}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Reject"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleWhatsAppNotify(booking)}
                                className="p-1.5 text-[#25D366] hover:bg-green-50 rounded-lg transition-colors"
                                title="WhatsApp"
                              >
                                <MessageCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          <button className="p-1.5 text-charcoal/40 hover:bg-charcoal/5 rounded-lg transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {(bookings as any[]).length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-charcoal/40 italic text-sm">
                        No booking requests yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {activeSection === 'listings' && (
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
      )}

      {activeSection === 'analytics' && (
        <section className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-charcoal/5 shadow-sm">
              <TrendingUp className="w-6 h-6 text-green-600 mb-4" />
              <p className="text-[10px] font-bold tracking-widest text-charcoal/40 uppercase">Monthly Revenue</p>
              <p className="text-2xl font-serif font-bold text-charcoal mt-1">₦{(totalRevenue / 1000000).toFixed(1)}M</p>
              <p className="text-xs text-green-600 mt-1">+12% from last month</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-charcoal/5 shadow-sm">
              <Calendar className="w-6 h-6 text-gold-dark mb-4" />
              <p className="text-[10px] font-bold tracking-widest text-charcoal/40 uppercase">Bookings This Month</p>
              <p className="text-2xl font-serif font-bold text-charcoal mt-1">{confirmedBookings.length}</p>
              <p className="text-xs text-charcoal/40 mt-1">{pendingBookings.length} pending</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-charcoal/5 shadow-sm">
              <Users className="w-6 h-6 text-blue-600 mb-4" />
              <p className="text-[10px] font-bold tracking-widest text-charcoal/40 uppercase">Active Guests</p>
              <p className="text-2xl font-serif font-bold text-charcoal mt-1">48</p>
              <p className="text-xs text-blue-600 mt-1">+8 new this week</p>
            </div>
          </div>
        </section>
      )}

      {showConfirmModal && selectedBooking && (
        <div className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-parchment rounded-2xl p-6 max-w-md w-full shadow-2xl"
          >
            <h3 className="font-serif text-xl font-bold text-charcoal mb-4">Confirm Booking</h3>
            <div className="bg-white rounded-xl p-4 mb-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-charcoal/60">Guest</span>
                <span className="font-bold">{selectedBooking.guestName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal/60">Property</span>
                <span className="font-bold">{selectedBooking.listingTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal/60">Amount</span>
                <span className="font-bold text-gold-dark">₦{selectedBooking.totalAmount.toLocaleString()}</span>
              </div>
            </div>
            <textarea
              placeholder="Add confirmation notes (optional)..."
              value={confirmNotes}
              onChange={(e) => setConfirmNotes(e.target.value)}
              className="w-full p-3 bg-white border border-charcoal/10 rounded-xl text-sm mb-4 focus:outline-none focus:ring-1 focus:ring-gold"
              rows={3}
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setShowConfirmModal(false); setConfirmNotes(''); }}
                className="flex-1 py-3 text-charcoal/60 font-bold text-xs uppercase tracking-widest hover:text-charcoal transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleConfirmBooking(selectedBooking)}
                className="flex-[2] py-3 bg-green-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-green-700 transition-all"
              >
                Confirm Booking
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {showRejectModal && selectedBooking && (
        <div className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-parchment rounded-2xl p-6 max-w-md w-full shadow-2xl"
          >
            <h3 className="font-serif text-xl font-bold text-charcoal mb-4">Reject Booking</h3>
            <div className="bg-white rounded-xl p-4 mb-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-charcoal/60">Guest</span>
                <span className="font-bold">{selectedBooking.guestName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal/60">Property</span>
                <span className="font-bold">{selectedBooking.listingTitle}</span>
              </div>
            </div>
            <textarea
              placeholder="Reason for rejection (required)..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full p-3 bg-white border border-charcoal/10 rounded-xl text-sm mb-4 focus:outline-none focus:ring-1 focus:ring-gold"
              rows={3}
              required
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setShowRejectModal(false); setRejectReason(''); }}
                className="flex-1 py-3 text-charcoal/60 font-bold text-xs uppercase tracking-widest hover:text-charcoal transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRejectBooking(selectedBooking)}
                disabled={!rejectReason.trim()}
                className="flex-[2] py-3 bg-red-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-red-700 transition-all disabled:opacity-50"
              >
                Reject Booking
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
