import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X } from 'lucide-react';

interface TermsAcceptancePopupProps {
  isOpen: boolean;
  onAccept: () => void;
  onViewMore: () => void;
}

export default function TermsAcceptancePopup({ isOpen, onAccept, onViewMore }: TermsAcceptancePopupProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 bg-white rounded-2xl shadow-2xl border border-charcoal/10 p-4 z-[110]"
        >
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <h3 className="font-serif text-sm font-bold text-charcoal mb-1">
                Terms & Privacy
              </h3>
              <p className="text-xs text-charcoal/60 leading-relaxed mb-3">
                By continuing, you agree to our Terms of Service and Privacy Policy.
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={onAccept}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gold text-charcoal text-xs font-bold rounded-lg hover:bg-gold-dark transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  Accept
                </button>
                <button
                  onClick={onViewMore}
                  className="px-3 py-1.5 text-xs font-bold text-charcoal/60 hover:text-charcoal transition-colors underline"
                >
                  View More
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
