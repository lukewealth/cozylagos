import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, ShoppingBag, Minus, Plus, Crown, Anchor, Sparkles, CheckCircle2, MessageCircle, ArrowRight } from 'lucide-react';
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
    cart, serviceCart, experienceCart,
    removeFromCart, removeServiceFromCart, updateServiceQuantity, removeExperienceFromCart,
    clearCart, clearServiceCart, clearExperienceCart,
    getTotalAmount, getServiceTotal, getExperienceTotal, getGrandTotal, getTotalItemCount
  } = useCart();
  const { isAuthenticated, currentUser } = useAuth();
  const [view, setView] = useState<CartView>('main');
  const [activeTab, setActiveTab] = useState<'stays' | 'services' | 'experiences'>('stays');

  const stayTotal = getTotalAmount();
  const serviceTotal = getServiceTotal();
  const experienceTotal = getExperienceTotal();
  const grandTotal = getGrandTotal();
  const serviceFee = Math.round(grandTotal * 0.05);
  const tax = Math.round(grandTotal * 0.075);
  const finalTotal = grandTotal + serviceFee + tax;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      setView('checkout');
      return;
    }
    setView('checkout');
  };

  const handleConfirmBooking = () => {
    setView('confirmation');
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
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-charcoal/40 backdrop-blur-sm z-[60]"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full sm:h-auto sm:bottom-0 w-full max-w-md bg-parchment z-[70] shadow-2xl flex flex-col sm:rounded-l-3xl"
          >
            <div className="p-6 border-b border-charcoal/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag className="text-gold-dark w-5 h-5" />
                <h2 className="font-serif text-2xl text-charcoal">
                  {view === 'main' ? 'Your Cart' : view === 'checkout' ? 'Checkout' : 'Confirmed'}
                </h2>
                {view === 'main' && getTotalItemCount() > 0 && (
                  <span className="px-2 py-0.5 bg-gold/15 text-gold-dark text-[10px] font-bold rounded-full">
                    {getTotalItemCount()}
                  </span>
                )}
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-charcoal/5 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-charcoal/60" />
              </button>
            </div>

            {view === 'main' && (
              <>
                <div className="flex border-b border-charcoal/5">
                  {[
                    { id: 'stays' as const, label: 'Stays', count: cart.length, icon: <ShoppingBag className="w-3.5 h-3.5" /> },
                    { id: 'services' as const, label: 'Services', count: serviceCart.length, icon: <Sparkles className="w-3.5 h-3.5" /> },
                    { id: 'experiences' as const, label: 'Experiences', count: experienceCart.length, icon: <Anchor className="w-3.5 h-3.5" /> },
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
                        onClick={() => { clearCart(); clearServiceCart(); clearExperienceCart(); }}
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
                  <div className="bg-gold/5 border border-gold/20 rounded-2xl p-5 text-center space-y-3">
                    <p className="text-sm text-charcoal/70">Please login to complete your booking</p>
                    <p className="text-[10px] text-charcoal/40">Your cart will be saved for later</p>
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
                    className="flex-[2] py-4 bg-gold text-charcoal font-bold text-xs uppercase tracking-widest rounded shadow-lg hover:bg-gold-dark hover:text-parchment transition-all"
                  >
                    Confirm Booking
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
                    Your reservation has been sent to our admin team for confirmation. You'll receive a WhatsApp message shortly.
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
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
