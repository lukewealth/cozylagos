import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

let addToastGlobal: ((toast: Omit<ToastItem, 'id'>) => void) | null = null;

export function showToast(toast: Omit<ToastItem, 'id'>) {
  if (addToastGlobal) addToastGlobal(toast);
}

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="w-5 h-5 text-green-600" />,
  error: <XCircle className="w-5 h-5 text-red-600" />,
  warning: <AlertTriangle className="w-5 h-5 text-amber-600" />,
  info: <Info className="w-5 h-5 text-primary" />,
};

const borderColors: Record<ToastType, string> = {
  success: 'border-l-green-600',
  error: 'border-l-red-600',
  warning: 'border-l-amber-600',
  info: 'border-l-primary',
};

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((toast: Omit<ToastItem, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setToasts(prev => [...prev, { ...toast, id }]);
  }, []);

  useEffect(() => {
    addToastGlobal = addToast;
    return () => { addToastGlobal = null; };
  }, [addToast]);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  useEffect(() => {
    if (toasts.length === 0) return;
    const latest = toasts[toasts.length - 1];
    const duration = latest.duration || 4000;
    const timer = setTimeout(() => removeToast(latest.id), duration);
    return () => clearTimeout(timer);
  }, [toasts]);

  return (
    <div className="fixed top-4 right-4 z-[200] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`pointer-events-auto bg-parchment rounded-xl shadow-2xl border border-outline-variant/10 border-l-4 ${borderColors[toast.type]} p-4 flex items-start gap-3`}
          >
            <div className="shrink-0 mt-0.5">{icons[toast.type]}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-on-surface">{toast.title}</p>
              {toast.message && <p className="text-xs text-secondary mt-0.5">{toast.message}</p>}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 p-0.5 rounded hover:bg-surface-container transition-colors"
            >
              <X className="w-3.5 h-3.5 text-secondary" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
