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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[110] flex items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-charcoal/10 p-4"
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
