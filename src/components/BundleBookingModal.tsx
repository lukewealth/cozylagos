import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Calendar, Users, MapPin, CreditCard, Send, Package } from 'lucide-react';
import { ServiceBundle, BundleTier } from '../data';
import { useAuth } from '../auth';
import { useDatabase } from '../hooks/useDatabase';
import api from '../services/api';

interface BundleBookingModalProps {
  bundle: ServiceBundle;
  selectedTier: BundleTier;
  tierIndex: number;
  onClose: () => void;
}

export default function BundleBookingModal({ bundle, selectedTier, tierIndex, onClose }: BundleBookingModalProps) {
  const { currentUser } = useAuth();
  const { addRecord } = useDatabase('bookings');

  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    guestsCount: 2,
    specialRequests: '',
    guestName: currentUser?.name || '',
    guestEmail: currentUser?.email || '',
    guestPhone: '',
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);

  const tierLabel = selectedTier.nights === 3 ? 'Economy' : selectedTier.nights === 7 ? 'Standard' : 'Premium';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const bookingData = {
        id: `bundle-${Date.now()}`,
        listingId: bundle.id,
        listingTitle: `${bundle.title} - ${tierLabel} Package`,
        guestId: currentUser?.id || 'guest',
        guestName: formData.guestName,
        guestEmail: formData.guestEmail,
        guestPhone: formData.guestPhone,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        guestsCount: formData.guestsCount,
        status: 'pending',
        totalAmount: selectedTier.price,
        services: bundle.activities.map(a => a.name),
        specialRequests: formData.specialRequests,
        packageType: 'bundle',
        bundleTier: tierLabel,
        bundleComponents: selectedTier.components,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Save to local database
      addRecord(bookingData as any);

      // Send to API
      try {
        await api.bookings.create(bookingData);
      } catch (error) {
        console.error('API booking failed, saved locally:', error);
      }

      setBookingComplete(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Booking failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (bookingComplete) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      >
        <div className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm" />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative bg-parchment rounded-3xl p-8 max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-charcoal mb-2">Booking Submitted!</h2>
          <p className="text-sm text-charcoal/60 mb-4">
            Your {tierLabel} package for {bundle.title} has been sent to our admin team.
          </p>
          <p className="text-xs text-charcoal/50">
            They will review and confirm your booking shortly.
          </p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center"
    >
      <div className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative bg-parchment w-full sm:max-w-2xl sm:rounded-3xl rounded-t-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="relative h-32 overflow-hidden shrink-0">
          <img
            src={bundle.image}
            alt={bundle.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-2 mb-1">
              <Package className="w-4 h-4 text-gold" />
              <span className="text-gold text-[9px] font-bold tracking-[0.3em] uppercase">
                {tierLabel} Package
              </span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-parchment">{bundle.title}</h2>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* Package Summary */}
          <div className="bg-white rounded-xl p-4 mb-6 border border-charcoal/5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-charcoal/60 uppercase tracking-wider">Package Summary</span>
              <span className="text-lg font-bold text-gold-dark">₦{selectedTier.price.toLocaleString()}</span>
            </div>
            <div className="space-y-2 text-xs text-charcoal/70">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" />
                <span>{selectedTier.nights} Nights / {selectedTier.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5" />
                <span>{selectedTier.components.length} curated experiences</span>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-1.5">Check-in Date</label>
                <input
                  type="date"
                  required
                  value={formData.checkIn}
                  onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-1.5">Check-out Date</label>
                <input
                  type="date"
                  required
                  value={formData.checkOut}
                  onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-1.5">Number of Guests</label>
              <input
                type="number"
                required
                min="1"
                max="10"
                value={formData.guestsCount}
                onChange={(e) => setFormData({ ...formData, guestsCount: parseInt(e.target.value) })}
                className="w-full px-3 py-2 bg-white border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-1.5">Full Name</label>
              <input
                type="text"
                required
                value={formData.guestName}
                onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-1.5">Email</label>
              <input
                type="email"
                required
                value={formData.guestEmail}
                onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-1.5">Phone (Optional)</label>
              <input
                type="tel"
                value={formData.guestPhone}
                onChange={(e) => setFormData({ ...formData, guestPhone: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
                placeholder="+234..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-1.5">Special Requests (Optional)</label>
              <textarea
                value={formData.specialRequests}
                onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 bg-white border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 resize-none"
                placeholder="Any special requirements or preferences..."
              />
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-charcoal/5 bg-white/50 shrink-0">
          <button
            onClick={handleSubmit}
            disabled={isProcessing}
            className="w-full py-3.5 bg-charcoal text-parchment hover:bg-gold-dark font-bold text-xs tracking-widest uppercase rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-parchment/30 border-t-parchment rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Booking Request</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
