import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  UserCheck, Clock, MapPin, Phone, Mail, Calendar, Key, Car,
  Shield, AlertCircle, CheckCircle, XCircle, Search, Filter,
  RefreshCw, Eye, MessageCircle, Plane, Timer, Bell
} from 'lucide-react';
import { useDatabase } from '../hooks/useDatabase';
import { useAuth } from '../auth';
import Tooltip from './ui/Tooltip';
import UniversalModal from './ui/UniversalModal';

interface CheckInRequest {
  id: string;
  bookingId: string;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  listingTitle: string;
  unitCode?: string;
  checkInDate: string;
  checkOutDate: string;
  guestsCount: number;
  status: 'pending' | 'approved' | 'denied' | 'checked_in' | 'en_route';
  tier?: 'vip' | 'platinum' | 'gold' | 'standard';
  specialRequests?: string;
  eta?: string;
  createdAt: string;
  providerId?: string;
}

interface AdminCheckInViewProps {
  onNotify?: (message: string) => void;
}

export default function AdminCheckInView({ onNotify }: AdminCheckInViewProps) {
  const { currentUser } = useAuth();
  const { data: bookings } = useDatabase('bookings');
  const { data: listings } = useDatabase('listings');
  const [checkIns, setCheckIns] = useState<CheckInRequest[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'checked_in'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCheckIn, setSelectedCheckIn] = useState<CheckInRequest | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastSync, setLastSync] = useState<Date>(new Date());

  useEffect(() => {
    loadCheckIns();
    const interval = setInterval(() => {
      loadCheckIns();
      setLastSync(new Date());
    }, 30000); // Auto-refresh every 30 seconds
    return () => clearInterval(interval);
  }, [bookings, listings]);

  const loadCheckIns = () => {
    // Get today's and upcoming check-ins from bookings
    const today = new Date();
    const upcomingBookings = (bookings as any[]).filter((b: any) => {
      const checkInDate = new Date(b.checkIn);
      const daysUntil = Math.ceil((checkInDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return daysUntil >= 0 && daysUntil <= 7 && (b.status === 'confirmed' || b.status === 'Confirmed');
    });

    const mappedCheckIns: CheckInRequest[] = upcomingBookings.map((b: any) => {
      const listing = (listings as any[]).find((l: any) => l.id === b.listingId);
      const checkInDate = new Date(b.checkIn);
      const daysUntil = Math.ceil((checkInDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      return {
        id: `checkin-${b.id}`,
        bookingId: b.id,
        guestName: b.guestName || 'Guest',
        guestEmail: b.guestEmail || '',
        guestPhone: b.guestPhone,
        listingTitle: b.listingTitle || listing?.title || 'Property',
        unitCode: listing?.unitCode || `UNIT-${b.id.slice(-4).toUpperCase()}`,
        checkInDate: b.checkIn,
        checkOutDate: b.checkOut,
        guestsCount: b.guestsCount || 1,
        status: b.checkInStatus || (daysUntil === 0 ? 'pending' : 'approved'),
        tier: b.guestTier || 'standard',
        specialRequests: b.specialRequests,
        eta: daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `In ${daysUntil} days`,
        createdAt: b.createdAt || new Date().toISOString(),
        providerId: b.providerId,
      };
    });

    setCheckIns(mappedCheckIns);
  };

  const handleApprove = async (checkIn: CheckInRequest) => {
    setIsProcessing(true);
    try {
      // Update booking status
      const booking = (bookings as any[]).find((b: any) => b.id === checkIn.bookingId);
      if (booking) {
        await fetch('/api/operations/bookings', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: checkIn.bookingId,
            checkInStatus: 'approved',
            updatedAt: new Date().toISOString(),
          }),
        });
      }
      
      onNotify?.(`Check-in approved for ${checkIn.guestName}`);
      loadCheckIns();
    } catch (error) {
      console.error('Failed to approve check-in:', error);
      onNotify?.('Failed to approve check-in');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCheckIn = async (checkIn: CheckInRequest) => {
    setIsProcessing(true);
    try {
      // Update booking to checked_in
      await fetch('/api/operations/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: checkIn.bookingId,
          checkInStatus: 'checked_in',
          actualCheckIn: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
      });

      // Create notification for provider
      if (checkIn.providerId) {
        await fetch('/api/operations/notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: checkIn.providerId,
            title: 'Guest Checked In',
            message: `${checkIn.guestName} has checked into ${checkIn.listingTitle}`,
            type: 'check_in',
            targetRole: 'service_provider',
            bookingId: checkIn.bookingId,
          }),
        });
      }

      onNotify?.(`${checkIn.guestName} checked in successfully`);
      loadCheckIns();
    } catch (error) {
      console.error('Failed to check in guest:', error);
      onNotify?.('Failed to check in guest');
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredCheckIns = checkIns.filter(ci => {
    const matchesFilter = filter === 'all' || ci.status === filter;
    const matchesSearch = !searchQuery || 
      ci.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ci.listingTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ci.unitCode?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: checkIns.length,
    pending: checkIns.filter(ci => ci.status === 'pending').length,
    today: checkIns.filter(ci => ci.eta === 'Today').length,
    checkedIn: checkIns.filter(ci => ci.status === 'checked_in').length,
  };

  const getTierColor = (tier?: string) => {
    switch (tier) {
      case 'vip': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'platinum': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'gold': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'approved': return 'bg-blue-100 text-blue-700';
      case 'checked_in': return 'bg-green-100 text-green-700';
      case 'en_route': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-charcoal">Check-In Management</h2>
          <p className="text-sm text-charcoal/60 mt-1">
            Monitor and manage guest arrivals • Last synced: {lastSync.toLocaleTimeString()}
          </p>
        </div>
        <Tooltip content="Refresh check-in data from database" title="Sync Data" position="left">
          <button
            onClick={() => { loadCheckIns(); setLastSync(new Date()); }}
            className="flex items-center gap-2 px-4 py-2 bg-charcoal text-parchment rounded-xl text-sm font-semibold hover:bg-gold-dark transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Sync Now
          </button>
        </Tooltip>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-charcoal/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-charcoal">{stats.total}</p>
              <p className="text-xs text-charcoal/60">Total Check-Ins</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-charcoal/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-charcoal">{stats.pending}</p>
              <p className="text-xs text-charcoal/60">Pending</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-charcoal/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-charcoal">{stats.today}</p>
              <p className="text-xs text-charcoal/60">Today</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-charcoal/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-charcoal">{stats.checkedIn}</p>
              <p className="text-xs text-charcoal/60">Checked In</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40" />
          <input
            type="text"
            placeholder="Search by guest name, property, or unit..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-charcoal/10 rounded-xl text-sm focus:outline-none focus:border-gold"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'pending', 'approved', 'checked_in'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                filter === f
                  ? 'bg-charcoal text-parchment'
                  : 'bg-white text-charcoal/60 hover:bg-charcoal/5'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1).replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Check-In List */}
      <div className="space-y-3">
        {filteredCheckIns.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-charcoal/5">
            <UserCheck className="w-12 h-12 text-charcoal/20 mx-auto mb-4" />
            <p className="text-charcoal/60">No check-ins found</p>
          </div>
        ) : (
          filteredCheckIns.map((checkIn) => (
            <motion.div
              key={checkIn.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-5 border border-charcoal/5 hover:border-gold/20 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Guest Info */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center">
                    <span className="text-sm font-bold text-gold-dark">
                      {checkIn.guestName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-charcoal truncate">{checkIn.guestName}</h3>
                      {checkIn.tier && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getTierColor(checkIn.tier)}`}>
                          {checkIn.tier}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-charcoal/60 truncate">{checkIn.listingTitle}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-charcoal/50">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(checkIn.checkInDate).toLocaleDateString()}
                      </span>
                      {checkIn.unitCode && (
                        <span className="flex items-center gap-1">
                          <Key className="w-3 h-3" />
                          {checkIn.unitCode}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(checkIn.status)}`}>
                    {checkIn.status === 'checked_in' ? 'Checked In' : checkIn.status === 'en_route' ? 'En Route' : checkIn.status}
                  </span>
                  
                  {checkIn.eta && (
                    <span className="text-xs text-charcoal/50 flex items-center gap-1">
                      <Timer className="w-3 h-3" />
                      {checkIn.eta}
                    </span>
                  )}

                  <div className="flex gap-2">
                    <Tooltip content="View details" position="top">
                      <button
                        onClick={() => { setSelectedCheckIn(checkIn); setShowDetailModal(true); }}
                        className="p-2 hover:bg-charcoal/5 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4 text-charcoal/60" />
                      </button>
                    </Tooltip>

                    {checkIn.status === 'pending' && (
                      <>
                        <Tooltip content="Approve check-in" position="top">
                          <button
                            onClick={() => handleApprove(checkIn)}
                            disabled={isProcessing}
                            className="p-2 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                          >
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </button>
                        </Tooltip>
                      </>
                    )}

                    {checkIn.status === 'approved' && checkIn.eta === 'Today' && (
                      <Tooltip content="Mark as checked in" position="top">
                        <button
                          onClick={() => handleCheckIn(checkIn)}
                          disabled={isProcessing}
                          className="p-2 hover:bg-emerald-50 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <UserCheck className="w-4 h-4 text-emerald-600" />
                        </button>
                      </Tooltip>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Detail Modal */}
      <UniversalModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Check-In Details"
        size="md"
        variant="centered"
      >
        {selectedCheckIn && (
          <div className="space-y-6">
            {/* Guest Info */}
            <div className="bg-parchment/50 rounded-2xl p-5">
              <h3 className="font-semibold text-charcoal mb-4">Guest Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <UserCheck className="w-5 h-5 text-charcoal/40" />
                  <div>
                    <p className="text-sm font-medium text-charcoal">{selectedCheckIn.guestName}</p>
                    <p className="text-xs text-charcoal/60">{selectedCheckIn.guestEmail}</p>
                  </div>
                </div>
                {selectedCheckIn.guestPhone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-charcoal/40" />
                    <p className="text-sm text-charcoal">{selectedCheckIn.guestPhone}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Booking Info */}
            <div className="bg-parchment/50 rounded-2xl p-5">
              <h3 className="font-semibold text-charcoal mb-4">Booking Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-charcoal/60">Property</span>
                  <span className="text-sm font-medium text-charcoal">{selectedCheckIn.listingTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-charcoal/60">Unit</span>
                  <span className="text-sm font-medium text-charcoal">{selectedCheckIn.unitCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-charcoal/60">Check-In</span>
                  <span className="text-sm font-medium text-charcoal">
                    {new Date(selectedCheckIn.checkInDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-charcoal/60">Check-Out</span>
                  <span className="text-sm font-medium text-charcoal">
                    {new Date(selectedCheckIn.checkOutDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-charcoal/60">Guests</span>
                  <span className="text-sm font-medium text-charcoal">{selectedCheckIn.guestsCount}</span>
                </div>
              </div>
            </div>

            {/* Special Requests */}
            {selectedCheckIn.specialRequests && (
              <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200">
                <h3 className="font-semibold text-charcoal mb-2 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-amber-600" />
                  Special Requests
                </h3>
                <p className="text-sm text-charcoal/70">{selectedCheckIn.specialRequests}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              {selectedCheckIn.status === 'pending' && (
                <button
                  onClick={() => { handleApprove(selectedCheckIn); setShowDetailModal(false); }}
                  disabled={isProcessing}
                  className="flex-1 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  Approve Check-In
                </button>
              )}
              {selectedCheckIn.status === 'approved' && selectedCheckIn.eta === 'Today' && (
                <button
                  onClick={() => { handleCheckIn(selectedCheckIn); setShowDetailModal(false); }}
                  disabled={isProcessing}
                  className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50"
                >
                  Complete Check-In
                </button>
              )}
              <button
                onClick={() => setShowDetailModal(false)}
                className="flex-1 py-3 border border-charcoal/20 text-charcoal rounded-xl font-semibold hover:bg-charcoal/5 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </UniversalModal>
    </div>
  );
}
