import React, { useState } from 'react';
import { Check, Calendar, Users, Package, ShoppingCart, ArrowRight } from 'lucide-react';
import UniversalModal from './ui/UniversalModal';
import { ServiceBundle, BundleTier } from '../data';
import { useCart } from '../context/CartContext';
import { useToast } from './Toast';

interface BundleBookingModalProps {
  bundle: ServiceBundle;
  selectedTier: BundleTier;
  tierIndex: number;
  onClose: () => void;
  onCheckout?: () => void;
}

export default function BundleBookingModal({ bundle, selectedTier, tierIndex, onClose, onCheckout }: BundleBookingModalProps) {
  const { addBundleToCart } = useCart();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    guestsCount: 2,
  });

  const [added, setAdded] = useState(false);

  const tierLabel = selectedTier.nights === 3 ? 'Economy' : selectedTier.nights === 7 ? 'Standard' : 'Premium';

  const handleAddToCart = (e: React.FormEvent) => {
    e.preventDefault();

    addBundleToCart({
      id: `${bundle.id}-${tierLabel}`,
      title: bundle.title,
      tierLabel,
      price: selectedTier.price,
      nights: selectedTier.nights,
      duration: selectedTier.duration,
      image: bundle.image,
      checkIn: formData.checkIn || undefined,
      checkOut: formData.checkOut || undefined,
      guestsCount: formData.guestsCount,
    });

    setAdded(true);
    addToast({ type: 'success', title: 'Bundle Added!', message: `${bundle.title} (${tierLabel}) added to your cart.` });
  };

  const handleGoToCheckout = () => {
    onClose();
    onCheckout?.();
  };

  if (added) {
    return (
      <UniversalModal isOpen={true} onClose={onClose} title="Added to Cart" size="md" variant="centered">
        <div className="py-4 text-center space-y-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-charcoal mb-2">Bundle Added to Cart!</h2>
            <p className="text-sm text-charcoal/60">
              {bundle.title} ({tierLabel}) has been added to your cart.
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-charcoal/5 text-left space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-charcoal/60">Package</span>
              <span className="font-bold text-charcoal">{tierLabel}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-charcoal/60">Duration</span>
              <span className="font-bold text-charcoal">{selectedTier.duration}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-charcoal/60">Guests</span>
              <span className="font-bold text-charcoal">{formData.guestsCount}</span>
            </div>
            <div className="border-t border-charcoal/10 pt-2 flex justify-between items-baseline">
              <span className="text-charcoal/60 text-sm">Total</span>
              <span className="font-serif text-xl font-bold text-gold-dark">&#8358;{selectedTier.price.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3.5 border border-charcoal/20 text-charcoal hover:bg-charcoal/5 rounded-xl font-bold text-xs uppercase tracking-widest transition-colors"
            >
              Continue Browsing
            </button>
            <button
              onClick={handleGoToCheckout}
              className="flex-[2] py-3.5 bg-charcoal text-parchment hover:bg-gold-dark rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </UniversalModal>
    );
  }

  return (
    <UniversalModal isOpen={true} onClose={onClose} title="Book Bundle" size="lg" variant="centered">
      <div className="relative h-32 overflow-hidden shrink-0 -mx-4 sm:-mx-6">
        <img
          src={bundle.image}
          alt={bundle.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-transparent" />
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

      <div className="space-y-4">
        <div className="bg-white rounded-xl p-4 mb-6 border border-charcoal/5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-charcoal/60 uppercase tracking-wider">Package Summary</span>
            <span className="text-lg font-bold text-gold-dark">&#8358;{selectedTier.price.toLocaleString()}</span>
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

        <form onSubmit={handleAddToCart} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-1.5">Check-in Date</label>
              <input
                type="date"
                value={formData.checkIn}
                onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-1.5">Check-out Date</label>
              <input
                type="date"
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
              max="20"
              value={formData.guestsCount}
              onChange={(e) => setFormData({ ...formData, guestsCount: parseInt(e.target.value) })}
              className="w-full px-3 py-2 bg-white border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
            />
          </div>
        </form>
      </div>

      <div className="-mx-4 sm:-mx-6 -mb-6 mt-6 p-4 sm:p-6 border-t border-charcoal/5 bg-white/50 shrink-0">
        <button
          onClick={handleAddToCart as any}
          className="w-full py-3.5 bg-charcoal text-parchment hover:bg-gold-dark font-bold text-xs tracking-widest uppercase rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Add to Cart</span>
          <ArrowRight className="w-4 h-4" />
        </button>
        <p className="text-[10px] text-charcoal/40 text-center mt-3">
          You can review and complete checkout from your cart. Guest checkout available.
        </p>
      </div>
    </UniversalModal>
  );
}
