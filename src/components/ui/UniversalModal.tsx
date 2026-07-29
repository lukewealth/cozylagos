import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type ModalVariant = 'centered' | 'bottom-sheet' | 'drawer-right' | 'drawer-left' | 'auto';

interface UniversalModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: ModalSize;
  variant?: ModalVariant;
  zIndex?: number;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  stickyHeader?: boolean;
  className?: string;
}

const SIZE_MAP: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-full',
};

const MOBILE_BREAKPOINT = 640;

export default function UniversalModal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  variant = 'auto',
  zIndex = 100,
  closeOnBackdrop = true,
  closeOnEscape = true,
  showCloseButton = true,
  stickyHeader = true,
  className = '',
}: UniversalModalProps) {
  const [isMobile, setIsMobile] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';

      requestAnimationFrame(() => {
        const focusable = modalRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable && focusable.length > 0) {
          focusable[0].focus();
        }
      });
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
      previousActiveElement.current?.focus();
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isOpen]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen || !closeOnEscape) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    },
    [isOpen, closeOnEscape, onClose]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const resolvedVariant = variant === 'auto'
    ? (isMobile ? 'bottom-sheet' : 'centered')
    : variant;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose();
    }
  };

  const titleId = title ? `modal-title-${title.replace(/\s+/g, '-').toLowerCase()}` : undefined;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center"
          style={{ zIndex }}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm"
            onClick={handleBackdropClick}
            aria-hidden="true"
          />

          {resolvedVariant === 'bottom-sheet' ? (
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className={`relative bg-parchment w-full rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${SIZE_MAP[size]} ${className}`}
              style={{ maxHeight: 'min(90vh, calc(100dvh - 2rem))' }}
            >
              <div className="sm:hidden flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 bg-charcoal/20 rounded-full" />
              </div>

              {title && (
                <div className={`flex items-center justify-between px-4 sm:px-6 border-b border-charcoal/10 ${stickyHeader ? 'sticky top-0 bg-parchment z-10' : ''}`}>
                  <h2 id={titleId} className="font-serif text-base sm:text-lg font-bold text-charcoal py-3 sm:py-4 truncate pr-8">
                    {title}
                  </h2>
                  {showCloseButton && (
                    <button
                      onClick={onClose}
                      className="p-2 hover:bg-charcoal/5 rounded-lg transition-colors absolute right-2 sm:right-4"
                      aria-label="Close modal"
                    >
                      <X className="w-5 h-5 text-charcoal/60" />
                    </button>
                  )}
                </div>
              )}

              {!title && showCloseButton && (
                <div className="flex justify-end px-4 sm:px-6 pt-2">
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-charcoal/5 rounded-lg transition-colors"
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5 text-charcoal/60" />
                  </button>
                </div>
              )}

              <div className="flex-1 overflow-y-auto overscroll-contain px-4 sm:px-6 pb-6">
                {children}
              </div>
            </motion.div>
          ) : resolvedVariant === 'drawer-right' ? (
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className={`relative bg-parchment h-full w-full sm:w-auto shadow-2xl overflow-hidden flex flex-col ${SIZE_MAP[size]} ${className}`}
            >
              {title && (
                <div className={`flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-charcoal/10 ${stickyHeader ? 'sticky top-0 bg-parchment z-10' : ''}`}>
                  <h2 id={titleId} className="font-serif text-base sm:text-lg font-bold text-charcoal truncate pr-8">
                    {title}
                  </h2>
                  {showCloseButton && (
                    <button
                      onClick={onClose}
                      className="p-2 hover:bg-charcoal/5 rounded-lg transition-colors"
                      aria-label="Close modal"
                    >
                      <X className="w-5 h-5 text-charcoal/60" />
                    </button>
                  )}
                </div>
              )}

              {!title && showCloseButton && (
                <div className="flex justify-end px-4 sm:px-6 pt-2">
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-charcoal/5 rounded-lg transition-colors"
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5 text-charcoal/60" />
                  </button>
                </div>
              )}

              <div className="flex-1 overflow-y-auto overscroll-contain px-4 sm:px-6 pb-6">
                {children}
              </div>
            </motion.div>
          ) : resolvedVariant === 'drawer-left' ? (
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, x: '-100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className={`relative bg-parchment h-full w-full sm:w-auto shadow-2xl overflow-hidden flex flex-col ${SIZE_MAP[size]} ${className}`}
            >
              {title && (
                <div className={`flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-charcoal/10 ${stickyHeader ? 'sticky top-0 bg-parchment z-10' : ''}`}>
                  <h2 id={titleId} className="font-serif text-base sm:text-lg font-bold text-charcoal truncate pr-8">
                    {title}
                  </h2>
                  {showCloseButton && (
                    <button
                      onClick={onClose}
                      className="p-2 hover:bg-charcoal/5 rounded-lg transition-colors"
                      aria-label="Close modal"
                    >
                      <X className="w-5 h-5 text-charcoal/60" />
                    </button>
                  )}
                </div>
              )}

              {!title && showCloseButton && (
                <div className="flex justify-end px-4 sm:px-6 pt-2">
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-charcoal/5 rounded-lg transition-colors"
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5 text-charcoal/60" />
                  </button>
                </div>
              )}

              <div className="flex-1 overflow-y-auto overscroll-contain px-4 sm:px-6 pb-6">
                {children}
              </div>
            </motion.div>
          ) : (
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={`relative bg-parchment w-full rounded-3xl shadow-2xl overflow-hidden flex flex-col mx-4 ${SIZE_MAP[size]} ${className}`}
              style={{ maxHeight: 'min(90vh, calc(100dvh - 2rem))' }}
            >
              {title && (
                <div className={`flex items-center justify-between px-4 sm:px-6 border-b border-charcoal/10 ${stickyHeader ? 'sticky top-0 bg-parchment z-10' : ''}`}>
                  <h2 id={titleId} className="font-serif text-base sm:text-lg font-bold text-charcoal py-3 sm:py-4 truncate pr-8">
                    {title}
                  </h2>
                  {showCloseButton && (
                    <button
                      onClick={onClose}
                      className="p-2 hover:bg-charcoal/5 rounded-lg transition-colors"
                      aria-label="Close modal"
                    >
                      <X className="w-5 h-5 text-charcoal/60" />
                    </button>
                  )}
                </div>
              )}

              {!title && showCloseButton && (
                <div className="flex justify-end px-4 sm:px-6 pt-2">
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-charcoal/5 rounded-lg transition-colors"
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5 text-charcoal/60" />
                  </button>
                </div>
              )}

              <div className="flex-1 overflow-y-auto overscroll-contain px-4 sm:px-6 pb-6">
                {children}
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
