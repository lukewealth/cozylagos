import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ShoppingBag, Sparkles, Crown, Package, Calendar, Users, CheckCircle, MessageCircle } from 'lucide-react';
import { CartItem, ServiceCartItem, ExperienceCartItem } from '../context/CartContext';
import { useToast } from './Toast';

interface CheckoutViewProps {
  cart: CartItem[];
  serviceCart: ServiceCartItem[];
  experienceCart: ExperienceCartItem[];
  listingTotal: number;
  serviceTotal: number;
  experienceTotal: number;
  grandTotal: number;
  onBack: () => void;
  onConfirm: (bookingData: any) => void;
}

export default function CheckoutView({
  cart, serviceCart, experienceCart,
  listingTotal, serviceTotal, experienceTotal, grandTotal,
  onBack, onConfirm
}: CheckoutViewProps) {
  const [step, setStep] = useState<'review' | 'confirm'>('review');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { addToast } = useToast();

  const serviceFee = Math.round(grandTotal * 0.05);
  const tax = Math.round(grandTotal * 0.075);
  const finalTotal = grandTotal + serviceFee + tax;

  const handleConfirm = () => {
    if (!guestName || !guestEmail) {
      addToast({ type: 'error', title: 'Missing Information', message: 'Please fill in your name and email.' });
      return;
    }

    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      const bookingData = {
        listingId: cart[0]?.listing.id || 'service-booking',
        listingTitle: cart[0]?.listing.title || 'VIP Services Package',
        checkIn: cart[0]?.checkIn || new Date().toISOString().split('T')[0],
        checkOut: cart[0]?.checkOut || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
        totalAmount: finalTotal,
        guestName,
        guestEmail,
        guestPhone,
        guestsCount: cart[0]?.guestsCount || 1,
        nightlyTotal: listingTotal,
        serviceFee,
        tax,
        grandTotal: finalTotal,
        cleaningFee: cart[0]?.listing.cleaningFee || 0,
        totalNights: cart[0] ? Math.ceil((new Date(cart[0].checkOut).getTime() - new Date(cart[0].checkIn).getTime()) / (1000 * 60 * 60 * 24)) : 0,
        specialRequests,
        services: serviceCart.map(s => s.title),
        selectedServiceIds: serviceCart.map(s => s.id),
        experiences: experienceCart.map(e => e.title),
      };

      onConfirm(bookingData);
      setIsProcessing(false);
      addToast({ 
        type: 'success', 
        title: 'Booking Submitted!', 
        message: 'Admin will review and confirm via WhatsApp.' 
      });
    }, 1500);
  };

  const generateWhatsAppMessage = () => {
    const lines: string[] = [];
    lines.push('*NEW BOOKING REQUEST — Cozy Lagos*');
    lines.push('');
    lines.push(`*Guest:* ${guestName}`);
    lines.push(`*Email:* ${guestEmail}`);
    if (guestPhone) lines.push(`*Phone:* ${guestPhone}`);
    lines.push('');

    if (cart.length > 0) {
      lines.push('*— Accommodations —*');
      cart.forEach(item => {
        const nights = Math.ceil((new Date(item.checkOut).getTime() - new Date(item.checkIn).getTime()) / (1000 * 60 * 60 * 24));
        lines.push(`• ${item.listing.title} (${item.listing.location})`);
        lines.push(`  ${item.checkIn} → ${item.checkOut} (${nights} nights)`);
        lines.push(`  ₦${item.listing.nightlyRate.toLocaleString()} × ${nights} = ₦${(item.listing.nightlyRate * nights).toLocaleString()}`);
      });
      lines.push('');
    }

    if (serviceCart.length > 0) {
      lines.push('*— VIP Services —*');
      serviceCart.forEach(item => {
        lines.push(`• ${item.title} × ${item.quantity} = ₦${(item.price * item.quantity).toLocaleString()}`);
      });
      lines.push('');
    }

    if (experienceCart.length > 0) {
      lines.push('*— Experiences —*');
      experienceCart.forEach(item => {
        lines.push(`• ${item.title} (${item.date}) - ${item.guestsCount} guests = ₦${(item.price * item.guestsCount).toLocaleString()}`);
      });
      lines.push('');
    }

    lines.push('*— Bill Summary —*');
    if (listingTotal > 0) lines.push(`Accommodations: ₦${listingTotal.toLocaleString()}`);
    if (serviceTotal > 0) lines.push(`VIP Services: ₦${serviceTotal.toLocaleString()}`);
    if (experienceTotal > 0) lines.push(`Experiences: ₦${experienceTotal.toLocaleString()}`);
    lines.push(`Service Fee (5%): ₦${serviceFee.toLocaleString()}`);
    lines.push(`VAT (7.5%): ₦${tax.toLocaleString()}`);
    lines.push('');
    lines.push(`*TOTAL: ₦${finalTotal.toLocaleString()}*`);
    lines.push('');
    if (specialRequests) {
      lines.push(`*Special Requests:* ${specialRequests}`);
      lines.push('');
    }
    lines.push('Please review and confirm this booking. Thank you!');

    return encodeURIComponent(lines.join('\n'));
  };

  const whatsappUrl = `https://wa.me/2348064305782?text=${generateWhatsAppMessage()}`;

  if (step === 'confirm') {
    return (
      <div className="flex-grow bg-parchment min-h-screen flex items-center justify-center py-12 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full bg-white rounded-3xl p-8 sm:p-12 shadow-xl text-center"
        >
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal mb-3">Booking Submitted!</h1>
          <p className="text-sm text-charcoal/60 max-w-md mx-auto mb-8">
            Your booking request has been sent to our admin team. They will review and confirm via WhatsApp within 10 minutes.
          </p>

          <div className="bg-gold/5 border border-gold/20 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span className="text-xs font-bold text-charcoal">Admin Confirmation Pending</span>
            </div>
            <p className="text-[11px] text-charcoal/60">
              Click below to send your booking details directly to our admin via WhatsApp for faster confirmation.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white py-3.5 rounded-xl font-bold text-sm transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              Confirm via WhatsApp
            </a>
            <button
              onClick={onBack}
              className="flex-1 py-3.5 border border-charcoal/20 text-charcoal hover:bg-charcoal/5 rounded-xl font-bold text-sm transition-colors"
            >
              Back to Home
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-grow bg-parchment min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-charcoal/5 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 xl:px-20 py-4 flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 text-charcoal/60 hover:text-charcoal text-xs font-bold uppercase tracking-widest transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Cart</span>
          </button>
          <h1 className="font-serif text-xl sm:text-2xl font-bold text-charcoal">Checkout</h1>
          <div className="w-24" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 xl:px-20 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-7 space-y-6">
            {/* Guest Information */}
            <div className="bg-white rounded-2xl p-6 border border-charcoal/5">
              <h2 className="font-serif text-lg font-bold text-charcoal mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Guest Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-charcoal/60 uppercase tracking-widest mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full px-4 py-3 bg-parchment border border-charcoal/10 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-charcoal/60 uppercase tracking-widest mb-2">Email Address *</label>
                  <input
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-parchment border border-charcoal/10 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors"
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-charcoal/60 uppercase tracking-widest mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="w-full px-4 py-3 bg-parchment border border-charcoal/10 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors"
                    placeholder="+234 800 000 0000"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-charcoal/60 uppercase tracking-widest mb-2">Special Requests</label>
                  <textarea
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-parchment border border-charcoal/10 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors resize-none"
                    placeholder="Any special requirements or preferences..."
                  />
                </div>
              </div>
            </div>

            {/* Cart Items Review */}
            <div className="bg-white rounded-2xl p-6 border border-charcoal/5">
              <h2 className="font-serif text-lg font-bold text-charcoal mb-4 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                Booking Summary
              </h2>
              <div className="space-y-4">
                {cart.map((item) => {
                  const nights = Math.ceil((new Date(item.checkOut).getTime() - new Date(item.checkIn).getTime()) / (1000 * 60 * 60 * 24));
                  const itemTotal = (item.listing.nightlyRate * Math.max(1, nights)) + (item.listing.cleaningFee || 0);
                  return (
                    <div key={`${item.listing.id}-${item.checkIn}`} className="flex gap-4 pb-4 border-b border-charcoal/5 last:border-0">
                      <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                        <img src={item.listing.image} alt={item.listing.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-semibold text-charcoal text-sm">{item.listing.title}</h3>
                        <p className="text-[10px] text-charcoal/50">{item.listing.location}</p>
                        <div className="flex items-center gap-2 text-[10px] text-charcoal/60 mt-1">
                          <Calendar className="w-3 h-3" />
                          <span>{item.checkIn} → {item.checkOut} ({nights} nights)</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-primary">₦{itemTotal.toLocaleString()}</p>
                      </div>
                    </div>
                  );
                })}

                {serviceCart.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 pb-4 border-b border-charcoal/5 last:border-0">
                    <div className="w-10 h-10 rounded-lg bg-primary-container/15 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-semibold text-charcoal text-sm">{item.title}</h3>
                      <p className="text-[10px] text-charcoal/50">{item.category} × {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-primary">₦{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}

                {experienceCart.map((item) => (
                  <div key={`${item.id}-${item.date}`} className="flex items-center gap-3 pb-4 border-b border-charcoal/5 last:border-0">
                    <div className="w-10 h-10 rounded-lg bg-primary-container/15 flex items-center justify-center shrink-0">
                      <Crown className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-semibold text-charcoal text-sm">{item.title}</h3>
                      <p className="text-[10px] text-charcoal/50">{item.date} • {item.guestsCount} guests</p>
                    </div>
                    <p className="text-sm font-bold text-primary">₦{(item.price * item.guestsCount).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Bill Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl p-6 border border-charcoal/5 sticky top-24">
              <h2 className="font-serif text-lg font-bold text-charcoal mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                Bill Summary
              </h2>

              <div className="space-y-3 text-sm mb-6">
                {listingTotal > 0 && (
                  <div className="flex justify-between text-charcoal/70">
                    <span>Accommodations</span>
                    <span className="font-semibold">₦{listingTotal.toLocaleString()}</span>
                  </div>
                )}
                {serviceTotal > 0 && (
                  <div className="flex justify-between text-charcoal/70">
                    <span>VIP Services</span>
                    <span className="font-semibold">{serviceTotal.toLocaleString()}</span>
                  </div>
                )}
                {experienceTotal > 0 && (
                  <div className="flex justify-between text-charcoal/70">
                    <span>Experiences</span>
                    <span className="font-semibold">₦{experienceTotal.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-charcoal/70 pt-3 border-t border-charcoal/10">
                  <span>Service Fee (5%)</span>
                  <span className="font-semibold">₦{serviceFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-charcoal/70">
                  <span>VAT (7.5%)</span>
                  <span className="font-semibold">₦{tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-charcoal pt-3 border-t border-charcoal/10">
                  <span>Total</span>
                  <span className="text-primary">₦{finalTotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={() => setStep('confirm')}
                disabled={isProcessing}
                className="w-full py-4 bg-primary-container text-charcoal font-bold text-sm uppercase tracking-widest rounded-xl hover:bg-inverse-primary transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-charcoal/30 border-t-charcoal rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Confirm Booking'
                )}
              </button>

              <p className="text-[10px] text-charcoal/40 text-center mt-4">
                By confirming, you agree to our terms and conditions. Admin will verify via WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
