import React, { useState } from 'react';
import { motion } from 'motion/react';
import UniversalModal from './ui/UniversalModal';
import { Trash2, ShoppingBag, Minus, Plus, Crown, Anchor, Sparkles, CheckCircle2, MessageCircle, ArrowRight, Package, Mail } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../auth';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout?: () => void;
}

type CartView = 'main' | 'checkout' | 'confirmation';

export default function CartDrawer({ isOpen, onClose, onCheckout }: CartDrawerProps) {
  const {
    cart, serviceCart, experienceCart, bundleCart,
    removeFromCart, removeServiceFromCart, updateServiceQuantity, removeExperienceFromCart, removeBundleFromCart,
    clearCart, clearServiceCart, clearExperienceCart, clearBundleCart,
    getTotalAmount, getServiceTotal, getExperienceTotal, getBundleTotal, getGrandTotal, getTotalItemCount
  } = useCart();
  const { isAuthenticated, currentUser } = useAuth();
  const [view, setView] = useState<CartView>('main');
  const [activeTab, setActiveTab] = useState<'stays' | 'services' | 'experiences' | 'bundles'>('stays');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const stayTotal = getTotalAmount();
  const serviceTotal = getServiceTotal();
  const experienceTotal = getExperienceTotal();
  const bundleTotal = getBundleTotal();
  const grandTotal = getGrandTotal();
  const serviceFee = Math.round(grandTotal * 0.05);
  const tax = Math.round(grandTotal * 0.075);
  const finalTotal = grandTotal + serviceFee + tax;

  const handleCheckout = () => {
    setView('checkout');
  };

  const handleConfirmBooking = async () => {
    const name = isAuthenticated ? (currentUser?.name || '') : guestName;
    const email = isAuthenticated ? (currentUser?.email || '') : guestEmail;
    const phone = isAuthenticated ? (currentUser?.phone || '') : guestPhone;

    if (!name || !email) {
      return;
    }

    setIsProcessing(true);

    try {
      const bookingData = {
        listingId: cart[0]?.listing.id || bundleCart[0]?.id || 'cart-booking',
        listingTitle: cart.length > 0
          ? cart.map(c => c.listing.title).join(', ')
          : bundleCart.length > 0
            ? bundleCart.map(b => `${b.title} (${b.tierLabel})`).join(', ')
            : 'Cozy Lagos Booking',
        checkIn: cart[0]?.checkIn || bundleCart[0]?.checkIn || new Date().toISOString().split('T')[0],
        checkOut: cart[0]?.checkOut || bundleCart[0]?.checkOut || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
        totalAmount: finalTotal,
        guestName: name,
        guestEmail: email,
        guestPhone: phone,
        guestsCount: cart[0]?.guestsCount || bundleCart[0]?.guestsCount || 2,
        nightlyTotal: stayTotal,
        serviceFee,
        tax,
        grandTotal: finalTotal,
        cleaningFee: cart[0]?.listing.cleaningFee || 0,
        totalNights: cart[0] ? Math.ceil((new Date(cart[0].checkOut).getTime() - new Date(cart[0].checkIn).getTime()) / (1000 * 60 * 60 * 24)) : 0,
        services: serviceCart.map(s => s.title),
        selectedServiceIds: serviceCart.map(s => s.id),
        experiences: experienceCart.map(e => e.title),
        bundles: bundleCart.map(b => `${b.title} (${b.tierLabel})`),
      };

      try {
        await fetch('/api/email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'booking_confirmation',
            to: email,
            guestName: name,
            bookingData: {
              reference: `CL-${Date.now().toString(36).toUpperCase()}`,
              listingTitle: bookingData.listingTitle,
              checkIn: bookingData.checkIn,
              checkOut: bookingData.checkOut,
              totalAmount: finalTotal,
              services: serviceCart.map(s => s.title),
              experiences: experienceCart.map(e => e.title),
              bundles: bundleCart.map(b => `${b.title} (${b.tierLabel})`),
            },
          }),
        });
      } catch (emailError) {
        console.error('Email send failed:', emailError);
      }

      setView('confirmation');
      clearCart();
      clearServiceCart();
      clearExperienceCart();
      clearBundleCart();
    } catch (error) {
      console.error('Booking failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWhatsAppConfirm = () => {
    const lines: string[] = [];
    lines.push(`*RESERVATION REQUEST — Cozy Lagos*`);
    lines.push(``);
    if (cart.length > 0) {
      lines.push(`*— Stays —*`);
      cart.forEach(item => {
        lines.push(`• ${item.listing.title} (${item.checkIn} to ${item.checkOut})`);
      });
      lines.push(`Stay Total: ₦${stayTotal.toLocaleString()}`);
      lines.push(``);
    }
    if (serviceCart.length > 0) {
      lines.push(`*— VIP Services —*`);
      serviceCart.forEach(item => {
        lines.push(`• ${item.title} x${item.quantity} — ₦${(item.price * item.quantity).toLocaleString()}`);
      });
      lines.push(`Service Total: ₦${serviceTotal.toLocaleString()}`);
      lines.push(``);
    }
    if (experienceCart.length > 0) {
      lines.push(`*— Experiences —*`);
      experienceCart.forEach(item => {
        lines.push(`• ${item.title} (${item.date}) — ₦${(item.price * item.guestsCount).toLocaleString()}`);
      });
      lines.push(`Experience Total: ₦${experienceTotal.toLocaleString()}`);
      lines.push(``);
    }
    if (bundleCart.length > 0) {
      lines.push(`*— Bundles —*`);
      bundleCart.forEach(item => {
        lines.push(`• ${item.title} (${item.tierLabel}) — ₦${item.price.toLocaleString()}`);
      });
      lines.push(`Bundle Total: ₦${bundleTotal.toLocaleString()}`);
      lines.push(``);
    }
    lines.push(`*— Cost Breakdown —*`);
    lines.push(`Subtotal: ₦${grandTotal.toLocaleString()}`);
    lines.push(`Service Fee (5%): ₦${serviceFee.toLocaleString()}`);
    lines.push(`VAT (7.5%): ₦${tax.toLocaleString()}`);
    lines.push(``);
    lines.push(`*TOTAL: ₦${finalTotal.toLocaleString()}*`);
    lines.push(``);
    lines.push(`Please confirm availability and proceed with booking.`);

    const whatsappUrl = `https://wa.me/2348064305782?text=${encodeURIComponent(lines.join('\n'))}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleClose = () => {
    setView('main');
    onClose();
  };

  return (
    <UniversalModal
      isOpen={isOpen}
      onClose={handleClose}
      title={view === 'main' ? 'Your Cart' : view === 'checkout' ? 'Checkout' : 'Confirmed'}
      size="md"
      variant="drawer-right"
    >
            {view === 'main' && (
              <>
                <div className="flex border-b border-charcoal/5">
                  {[
                    { id: 'stays' as const, label: 'Stays', count: cart.length, icon: <ShoppingBag className="w-3.5 h-3.5" /> },
                    { id: 'services' as const, label: 'Services', count: serviceCart.length, icon: <Sparkles className="w-3.5 h-3.5" /> },
                    { id: 'experiences' as const, label: 'Experiences', count: experienceCart.length, icon: <Anchor className="w-3.5 h-3.5" /> },
                    { id: 'bundles' as const, label: 'Bundles', count: bundleCart.length, icon: <Package className="w-3.5 h-3.5" /> },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
                        activeTab === tab.id
                          ? 'text-gold-dark border-b-2 border-gold'
                          : 'text-charcoal/40 hover:text-charcoal/60'
                      }`}
                    >
                      {tab.icon}
                      {tab.label}
                      {tab.count > 0 && (
                        <span className="px-1.5 py-0.5 bg-charcoal/5 rounded-full text-[9px]">{tab.count}</span>
                      )}
                    </button>
                  ))}
                </div>

                <div className="flex-grow overflow-y-auto p-6">
                  {activeTab === 'stays' && (
                    <>
                      {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center">
                          <div className="w-20 h-20 bg-charcoal/5 rounded-full flex items-center justify-center mb-4">
                            <ShoppingBag className="w-10 h-10 text-charcoal/20" />
                          </div>
                          <p className="font-serif text-xl text-charcoal/40">No stays added</p>
                          <p className="text-sm text-charcoal/30 mt-2">Add luxury properties to get started!</p>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {cart.map((item) => (
                            <div key={`${item.listing.id}-${item.checkIn}`} className="flex gap-4 group">
                              <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 border border-charcoal/5">
                                <img src={item.listing.image} alt={item.listing.title} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-grow min-w-0">
                                <h3 className="font-bold text-charcoal truncate">{item.listing.title}</h3>
                                <p className="text-xs text-charcoal/50 mb-1">{item.listing.location}</p>
                                <p className="text-[10px] text-charcoal/40">{item.checkIn} → {item.checkOut}</p>
                                <div className="flex items-center justify-between mt-2">
                                  <span className="text-gold-dark font-bold text-sm">
                                    ₦{item.listing.nightlyRate.toLocaleString()} / night
                                  </span>
                                  <button
                                    onClick={() => removeFromCart(item.listing.id, item.checkIn, item.checkOut)}
                                    className="text-charcoal/30 hover:text-red-500 transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  {activeTab === 'services' && (
                    <>
                      {serviceCart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center">
                          <div className="w-20 h-20 bg-charcoal/5 rounded-full flex items-center justify-center mb-4">
                            <Sparkles className="w-10 h-10 text-charcoal/20" />
                          </div>
                          <p className="font-serif text-xl text-charcoal/40">No services added</p>
                          <p className="text-sm text-charcoal/30 mt-2">Browse VIP services to enhance your stay!</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {serviceCart.map((item) => (
                            <div key={item.id} className="flex gap-4 group bg-white p-3 rounded-xl border border-charcoal/5">
                              <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-gradient-to-br from-gold/20 to-gold-dark/20 flex items-center justify-center">
                                <Crown className="w-6 h-6 text-gold-dark" />
                              </div>
                              <div className="flex-grow min-w-0">
                                <h3 className="font-bold text-charcoal text-sm truncate">{item.title}</h3>
                                <p className="text-[10px] text-charcoal/50">{item.providerName}</p>
                                <div className="flex items-center justify-between mt-2">
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => updateServiceQuantity(item.id, item.quantity - 1)}
                                      className="w-6 h-6 flex items-center justify-center bg-charcoal/5 rounded-full hover:bg-charcoal/10 transition-colors"
                                    >
                                      <Minus className="w-3 h-3" />
                                    </button>
                                    <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                    <button
                                      onClick={() => updateServiceQuantity(item.id, item.quantity + 1)}
                                      className="w-6 h-6 flex items-center justify-center bg-charcoal/5 rounded-full hover:bg-charcoal/10 transition-colors"
                                    >
                                      <Plus className="w-3 h-3" />
                                    </button>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-gold-dark font-bold text-xs">
                                      ₦{(item.price * item.quantity).toLocaleString()}
                                    </span>
                                    <button
                                      onClick={() => removeServiceFromCart(item.id)}
                                      className="text-charcoal/30 hover:text-red-500 transition-colors"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  {activeTab === 'experiences' && (
                    <>
                      {experienceCart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center">
                          <div className="w-20 h-20 bg-charcoal/5 rounded-full flex items-center justify-center mb-4">
                            <Anchor className="w-10 h-10 text-charcoal/20" />
                          </div>
                          <p className="font-serif text-xl text-charcoal/40">No experiences added</p>
                          <p className="text-sm text-charcoal/30 mt-2">Discover unique Lagos experiences!</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {experienceCart.map((item) => (
                            <div key={`${item.id}-${item.date}`} className="flex gap-4 group bg-white p-3 rounded-xl border border-charcoal/5">
                              <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                                <Anchor className="w-6 h-6 text-blue-600" />
                              </div>
                              <div className="flex-grow min-w-0">
                                <h3 className="font-bold text-charcoal text-sm truncate">{item.title}</h3>
                                <p className="text-[10px] text-charcoal/50">{item.date} • {item.guestsCount} guests</p>
                                <div className="flex items-center justify-between mt-2">
                                  <span className="text-gold-dark font-bold text-xs">
                                    ₦{(item.price * item.guestsCount).toLocaleString()}
                                  </span>
                                  <button
                                    onClick={() => removeExperienceFromCart(item.id, item.date)}
                                    className="text-charcoal/30 hover:text-red-500 transition-colors"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  {activeTab === 'bundles' && (
                    <>
                      {bundleCart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center">
                          <div className="w-20 h-20 bg-charcoal/5 rounded-full flex items-center justify-center mb-4">
                            <Package className="w-10 h-10 text-charcoal/20" />
                          </div>
                          <p className="font-serif text-xl text-charcoal/40">No bundles added</p>
                          <p className="text-sm text-charcoal/30 mt-2">Browse curated experience bundles!</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {bundleCart.map((item) => (
                            <div key={item.id} className="flex gap-4 group bg-white p-3 rounded-xl border border-charcoal/5">
                              {item.image && (
                                <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                </div>
                              )}
                              <div className="flex-grow min-w-0">
                                <h3 className="font-bold text-charcoal text-sm truncate">{item.title}</h3>
                                <p className="text-[10px] text-charcoal/50">{item.tierLabel} • {item.duration}</p>
                                {item.checkIn && (
                                  <p className="text-[10px] text-charcoal/40">{item.checkIn} → {item.checkOut}</p>
                                )}
                                <div className="flex items-center justify-between mt-2">
                                  <span className="text-gold-dark font-bold text-xs">
                                    ₦{item.price.toLocaleString()}
                                  </span>
                                  <button
                                    onClick={() => removeBundleFromCart(item.id)}
                                    className="text-charcoal/30 hover:text-red-500 transition-colors"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>

                {getTotalItemCount() > 0 && (
                  <div className="p-6 border-t border-charcoal/5 bg-white/30 space-y-4">
                    <div className="space-y-2">
                      {stayTotal > 0 && (
                        <div className="flex justify-between text-xs">
                          <span className="text-charcoal/60">Stays</span>
                          <span className="font-bold text-charcoal">₦{stayTotal.toLocaleString()}</span>
                        </div>
                      )}
                      {serviceTotal > 0 && (
                        <div className="flex justify-between text-xs">
                          <span className="text-charcoal/60">VIP Services</span>
                          <span className="font-bold text-charcoal">₦{serviceTotal.toLocaleString()}</span>
                        </div>
                      )}
                      {experienceTotal > 0 && (
                        <div className="flex justify-between text-xs">
                          <span className="text-charcoal/60">Experiences</span>
                          <span className="font-bold text-charcoal">₦{experienceTotal.toLocaleString()}</span>
                        </div>
                      )}
                      {bundleTotal > 0 && (
                        <div className="flex justify-between text-xs">
                          <span className="text-charcoal/60">Bundles</span>
                          <span className="font-bold text-charcoal">₦{bundleTotal.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-xs">
                        <span className="text-charcoal/60">Service Fee (5%)</span>
                        <span className="font-bold text-charcoal">₦{serviceFee.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-charcoal/60">VAT (7.5%)</span>
                        <span className="font-bold text-charcoal">₦{tax.toLocaleString()}</span>
                      </div>
                      <div className="border-t border-charcoal/10 pt-2 flex justify-between items-baseline">
                        <span className="text-charcoal/60 uppercase tracking-widest text-xs font-bold">Total</span>
                        <span className="text-2xl font-serif font-bold text-gold-dark">
                          ₦{finalTotal.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => { clearCart(); clearServiceCart(); clearExperienceCart(); clearBundleCart(); }}
                        className="flex-1 py-4 text-charcoal/40 hover:text-red-500 font-bold text-xs uppercase tracking-widest transition-colors"
                      >
                        Clear
                      </button>
                      <button
                        onClick={handleCheckout}
                        className="flex-[2] py-4 bg-gold text-charcoal font-bold text-xs uppercase tracking-widest rounded shadow-lg hover:bg-gold-dark hover:text-parchment transition-all flex items-center justify-center gap-2"
                      >
                        Checkout
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {view === 'checkout' && (
              <div className="flex-grow overflow-y-auto p-6 space-y-6">
                <div className="bg-white border border-charcoal/5 rounded-2xl p-5 space-y-4">
                  <h3 className="font-serif text-lg font-bold text-charcoal border-b border-charcoal/5 pb-3">
                    Order Summary
                  </h3>
                  <div className="space-y-2 text-sm">
                    {cart.map(item => (
                      <div key={item.listing.id} className="flex justify-between">
                        <span className="text-charcoal/60 truncate mr-2">{item.listing.title}</span>
                        <span className="font-bold text-charcoal shrink-0">₦{item.listing.nightlyRate.toLocaleString()}/night</span>
                      </div>
                    ))}
                    {serviceCart.map(item => (
                      <div key={item.id} className="flex justify-between">
                        <span className="text-charcoal/60 truncate mr-2">{item.title} x{item.quantity}</span>
                        <span className="font-bold text-charcoal shrink-0">₦{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                    {experienceCart.map(item => (
                      <div key={item.id} className="flex justify-between">
                        <span className="text-charcoal/60 truncate mr-2">{item.title}</span>
                        <span className="font-bold text-charcoal shrink-0">₦{(item.price * item.guestsCount).toLocaleString()}</span>
                      </div>
                    ))}
                    {bundleCart.map(item => (
                      <div key={item.id} className="flex justify-between">
                        <span className="text-charcoal/60 truncate mr-2">{item.title} ({item.tierLabel})</span>
                        <span className="font-bold text-charcoal shrink-0">₦{item.price.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-charcoal/10 pt-3 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-charcoal/60">Subtotal</span>
                      <span className="font-bold">₦{grandTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-charcoal/60">Service Fee (5%)</span>
                      <span className="font-bold">₦{serviceFee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-charcoal/60">VAT (7.5%)</span>
                      <span className="font-bold">₦{tax.toLocaleString()}</span>
                    </div>
                    <div className="border-t border-charcoal/10 pt-2 flex justify-between items-baseline">
                      <span className="font-serif text-base font-bold text-charcoal">Total</span>
                      <span className="font-serif text-2xl text-gold-dark font-bold">₦{finalTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {!isAuthenticated && (
                  <div className="bg-white border border-charcoal/5 rounded-2xl p-5 space-y-4">
                    <h3 className="font-serif text-lg font-bold text-charcoal border-b border-charcoal/5 pb-3 flex items-center gap-2">
                      <Mail className="w-5 h-5 text-gold-dark" />
                      Guest Checkout
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-bold text-charcoal/60 uppercase tracking-widest mb-1.5">Full Name *</label>
                        <input
                          type="text"
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          className="w-full px-3 py-2 bg-parchment border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-charcoal/60 uppercase tracking-widest mb-1.5">Email Address *</label>
                        <input
                          type="email"
                          value={guestEmail}
                          onChange={(e) => setGuestEmail(e.target.value)}
                          className="w-full px-3 py-2 bg-parchment border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
                          placeholder="john@example.com"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-charcoal/60 uppercase tracking-widest mb-1.5">Phone Number</label>
                        <input
                          type="tel"
                          value={guestPhone}
                          onChange={(e) => setGuestPhone(e.target.value)}
                          className="w-full px-3 py-2 bg-parchment border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
                          placeholder="+234 800 000 0000"
                        />
                      </div>
                    </div>
                    <p className="text-[10px] text-charcoal/40">
                      A confirmation email will be sent to your email address.
                    </p>
                  </div>
                )}

                {isAuthenticated && (
                  <div className="bg-gold/5 border border-gold/20 rounded-2xl p-4">
                    <p className="text-xs text-charcoal/70">
                      Booking as: <strong>{currentUser?.name}</strong> ({currentUser?.email})
                    </p>
                    <p className="text-[10px] text-charcoal/50 mt-1">
                      A confirmation email will be sent to your registered email.
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setView('main')}
                    className="flex-1 py-4 text-charcoal/60 font-bold text-xs uppercase tracking-widest hover:text-charcoal transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleConfirmBooking}
                    disabled={isProcessing || (!isAuthenticated && (!guestName || !guestEmail))}
                    className="flex-[2] py-4 bg-gold text-charcoal font-bold text-xs uppercase tracking-widest rounded shadow-lg hover:bg-gold-dark hover:text-parchment transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-charcoal/30 border-t-charcoal rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Confirm Booking
                      </>
                    )}
                  </button>
                </div>

                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); handleWhatsAppConfirm(); }}
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white py-3.5 rounded-xl font-bold text-xs tracking-wider uppercase transition-all shadow-md hover:shadow-lg"
                >
                  <MessageCircle className="w-4 h-4" />
                  Confirm with Admin via WhatsApp
                </a>
              </div>
            )}

            {view === 'confirmation' && (
              <div className="flex-grow overflow-y-auto p-6 flex flex-col items-center justify-center text-center space-y-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                >
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </div>
                </motion.div>
                <div className="space-y-2">
                  <h3 className="font-serif text-2xl font-bold text-charcoal">Booking Submitted!</h3>
                  <p className="text-sm text-charcoal/60 max-w-xs">
                    Your reservation has been sent to our admin team. A confirmation email has been sent to your inbox. You'll receive a WhatsApp message shortly.
                  </p>
                </div>
                <div className="bg-white border border-charcoal/5 rounded-2xl p-5 w-full space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-charcoal/60">Total Amount</span>
                    <span className="font-bold text-gold-dark">₦{finalTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-charcoal/60">Status</span>
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Pending Admin Confirmation</span>
                  </div>
                </div>
                <button
                  onClick={handleWhatsAppConfirm}
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white py-3.5 rounded-xl font-bold text-xs tracking-wider uppercase transition-all shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  Follow Up on WhatsApp
                </button>
                <button
                  onClick={handleClose}
                  className="text-xs text-charcoal/40 hover:text-charcoal transition-colors"
                >
                  Close
                </button>
              </div>
            )}
    </UniversalModal>
  );
}
