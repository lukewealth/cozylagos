import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, removeFromCart, clearCart, getTotalAmount } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-charcoal/40 backdrop-blur-sm z-[60]"
          />

          {/* Drawer */}
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
                <h2 className="font-serif text-2xl text-charcoal">Your Cart</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-charcoal/5 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-charcoal/60" />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-charcoal/5 rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag className="w-10 h-10 text-charcoal/20" />
                  </div>
                  <p className="font-serif text-xl text-charcoal/40">Your cart is empty</p>
                  <p className="text-sm text-charcoal/30 mt-2">Add some luxury stays to get started!</p>
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
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-charcoal/5 bg-white/30">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-charcoal/60 uppercase tracking-widest text-xs font-bold">Total Amount</span>
                  <span className="text-2xl font-serif font-bold text-charcoal">
                    ₦{getTotalAmount().toLocaleString()}
                  </span>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={clearCart}
                    className="flex-1 py-4 text-charcoal/40 hover:text-red-500 font-bold text-xs uppercase tracking-widest transition-colors"
                  >
                    Clear Cart
                  </button>
                  <button 
                    className="flex-[2] py-4 bg-gold text-charcoal font-bold text-xs uppercase tracking-widest rounded shadow-lg hover:bg-gold-dark hover:text-parchment transition-all"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
