import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, CheckCircle, XCircle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'success' | 'info';
  icon?: React.ReactNode;
  isLoading?: boolean;
  children?: React.ReactNode;
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'warning',
  icon,
  isLoading: externalLoading,
  children,
}: ConfirmDialogProps) {
  const [internalLoading, setInternalLoading] = useState(false);
  const isProcessing = externalLoading ?? internalLoading;

  const variantStyles = {
    danger: { bg: 'bg-red-600', hover: 'hover:bg-red-700', icon: <XCircle className="w-6 h-6 text-red-600" />, border: 'border-red-600' },
    warning: { bg: 'bg-amber-600', hover: 'hover:bg-amber-700', icon: <AlertTriangle className="w-6 h-6 text-amber-600" />, border: 'border-amber-600' },
    success: { bg: 'bg-green-600', hover: 'hover:bg-green-700', icon: <CheckCircle className="w-6 h-6 text-green-600" />, border: 'border-green-600' },
    info: { bg: 'bg-primary', hover: 'hover:bg-primary-dark', icon: null, border: 'border-primary' },
  };

  const style = variantStyles[variant];

  const handleConfirm = async () => {
    setInternalLoading(true);
    try {
      await onConfirm();
    } finally {
      setInternalLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget && !isProcessing) onClose(); }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-parchment rounded-2xl p-6 max-w-md w-full shadow-2xl"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {icon || style.icon}
                <h3 className="font-serif text-xl font-bold text-charcoal">{title}</h3>
              </div>
              {!isProcessing && (
                <button onClick={onClose} className="p-1 rounded-lg hover:bg-surface-container transition-colors">
                  <X className="w-4 h-4 text-secondary" />
                </button>
              )}
            </div>

            <p className="text-sm text-secondary mb-4 leading-relaxed">{message}</p>

            {children && <div className="mb-4">{children}</div>}

            <div className="flex gap-3 pt-2">
              <button
                onClick={onClose}
                disabled={isProcessing}
                className="flex-1 py-3 text-charcoal/60 font-bold text-xs uppercase tracking-widest hover:text-charcoal transition-colors disabled:opacity-50"
              >
                {cancelLabel}
              </button>
              <button
                onClick={handleConfirm}
                disabled={isProcessing}
                className={`flex-[2] py-3 ${style.bg} text-white font-bold text-xs uppercase tracking-widest rounded-xl ${style.hover} transition-all disabled:opacity-50 flex items-center justify-center gap-2`}
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  confirmLabel
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
