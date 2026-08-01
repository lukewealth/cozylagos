import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

interface TooltipProps {
  content: string;
  title?: string;
  position?: TooltipPosition;
  children: React.ReactNode;
  delay?: number;
  maxWidth?: string;
  showArrow?: boolean;
  className?: string;
}

export default function Tooltip({
  content,
  title,
  position = 'top',
  children,
  delay = 300,
  maxWidth = '280px',
  showArrow = true,
  className = '',
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      
      let top = 0;
      let left = 0;

      switch (position) {
        case 'top':
          top = triggerRect.top - tooltipRect.height - 12;
          left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
          break;
        case 'bottom':
          top = triggerRect.bottom + 12;
          left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
          break;
        case 'left':
          top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
          left = triggerRect.left - tooltipRect.width - 12;
          break;
        case 'right':
          top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
          left = triggerRect.right + 12;
          break;
      }

      // Keep tooltip within viewport
      const padding = 16;
      if (left < padding) left = padding;
      if (left + tooltipRect.width > window.innerWidth - padding) {
        left = window.innerWidth - tooltipRect.width - padding;
      }
      if (top < padding) top = padding;
      if (top + tooltipRect.height > window.innerHeight - padding) {
        top = window.innerHeight - tooltipRect.height - padding;
      }

      setCoords({ top, left });
    }
  }, [isVisible, position]);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const getArrowStyle = (): React.CSSProperties => {
    const arrowSize = 8;
    switch (position) {
      case 'top':
        return {
          bottom: -arrowSize,
          left: '50%',
          transform: 'translateX(-50%) rotate(45deg)',
          borderRight: `${arrowSize}px solid rgba(28, 28, 30, 0.95)`,
          borderBottom: `${arrowSize}px solid rgba(28, 28, 30, 0.95)`,
        };
      case 'bottom':
        return {
          top: -arrowSize,
          left: '50%',
          transform: 'translateX(-50%) rotate(45deg)',
          borderLeft: `${arrowSize}px solid rgba(28, 28, 30, 0.95)`,
          borderTop: `${arrowSize}px solid rgba(28, 28, 30, 0.95)`,
        };
      case 'left':
        return {
          right: -arrowSize,
          top: '50%',
          transform: 'translateY(-50%) rotate(45deg)',
          borderRight: `${arrowSize}px solid rgba(28, 28, 30, 0.95)`,
          borderTop: `${arrowSize}px solid rgba(28, 28, 30, 0.95)`,
        };
      case 'right':
        return {
          left: -arrowSize,
          top: '50%',
          transform: 'translateY(-50%) rotate(45deg)',
          borderLeft: `${arrowSize}px solid rgba(28, 28, 30, 0.95)`,
          borderBottom: `${arrowSize}px solid rgba(28, 28, 30, 0.95)`,
        };
    }
  };

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`inline-block ${className}`}
      >
        {children}
      </div>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={tooltipRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
            style={{
              position: 'fixed',
              top: coords.top,
              left: coords.left,
              maxWidth,
              zIndex: 9999,
              pointerEvents: 'none',
            }}
            role="tooltip"
          >
            <div className="relative bg-[#1c1c1e]/95 backdrop-blur-xl rounded-xl shadow-2xl px-4 py-3 border border-white/10">
              {title && (
                <h4 className="text-white/90 text-sm font-semibold mb-1 tracking-tight">
                  {title}
                </h4>
              )}
              <p className="text-white/70 text-xs leading-relaxed">
                {content}
              </p>
              {showArrow && (
                <div
                  style={getArrowStyle()}
                  className="absolute w-0 h-0"
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Feature highlight component for onboarding
interface FeatureHighlightProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  targetRef?: React.RefObject<HTMLElement>;
  position?: TooltipPosition;
  isVisible: boolean;
  onDismiss: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  stepNumber?: number;
  totalSteps?: number;
  showSkip?: boolean;
  onSkip?: () => void;
}

export function FeatureHighlight({
  title,
  description,
  icon,
  targetRef,
  position = 'bottom',
  isVisible,
  onDismiss,
  onNext,
  onPrev,
  stepNumber = 1,
  totalSteps = 1,
  showSkip = true,
  onSkip,
}: FeatureHighlightProps) {
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && targetRef?.current && cardRef.current) {
      const targetRect = targetRef.current.getBoundingClientRect();
      const cardRect = cardRef.current.getBoundingClientRect();
      
      let top = 0;
      let left = 0;

      switch (position) {
        case 'top':
          top = targetRect.top - cardRect.height - 20;
          left = targetRect.left + (targetRect.width - cardRect.width) / 2;
          break;
        case 'bottom':
          top = targetRect.bottom + 20;
          left = targetRect.left + (targetRect.width - cardRect.width) / 2;
          break;
        case 'left':
          top = targetRect.top + (targetRect.height - cardRect.height) / 2;
          left = targetRect.left - cardRect.width - 20;
          break;
        case 'right':
          top = targetRect.top + (targetRect.height - cardRect.height) / 2;
          left = targetRect.right + 20;
          break;
      }

      // Keep within viewport
      const padding = 24;
      if (left < padding) left = padding;
      if (left + cardRect.width > window.innerWidth - padding) {
        left = window.innerWidth - cardRect.width - padding;
      }
      if (top < padding) top = padding;
      if (top + cardRect.height > window.innerHeight - padding) {
        top = window.innerHeight - cardRect.height - padding;
      }

      setCoords({ top, left });
    }
  }, [isVisible, position, targetRef]);

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]"
        onClick={onDismiss}
      />

      {/* Highlight card */}
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        style={{
          position: 'fixed',
          top: coords.top,
          left: coords.left,
          zIndex: 9999,
        }}
        className="w-[320px] bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header with gradient */}
        <div className="bg-gradient-to-br from-charcoal via-charcoal to-charcoal/90 px-5 py-4">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center text-gold">
                {icon}
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-white font-semibold text-sm tracking-tight">
                {title}
              </h3>
              <p className="text-white/50 text-xs mt-0.5">
                Step {stepNumber} of {totalSteps}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-5 py-4">
          <p className="text-charcoal/70 text-sm leading-relaxed">
            {description}
          </p>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-parchment/50 border-t border-charcoal/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {onPrev && stepNumber > 1 && (
              <button
                onClick={onPrev}
                className="px-3 py-1.5 text-xs font-medium text-charcoal/60 hover:text-charcoal transition-colors"
              >
                Back
              </button>
            )}
            {showSkip && onSkip && (
              <button
                onClick={onSkip}
                className="px-3 py-1.5 text-xs font-medium text-charcoal/40 hover:text-charcoal/60 transition-colors"
              >
                Skip
              </button>
            )}
          </div>
          <button
            onClick={onNext || onDismiss}
            className="px-4 py-1.5 bg-charcoal text-parchment text-xs font-semibold rounded-lg hover:bg-gold-dark transition-colors"
          >
            {stepNumber === totalSteps ? 'Done' : 'Next'}
          </button>
        </div>

        {/* Arrow */}
        <div
          style={{
            position: 'absolute',
            width: 0,
            height: 0,
            ...(position === 'bottom' ? { top: -8, left: '50%', transform: 'translateX(-50%)' } : {}),
            ...(position === 'top' ? { bottom: -8, left: '50%', transform: 'translateX(-50%)' } : {}),
            ...(position === 'left' ? { right: -8, top: '50%', transform: 'translateY(-50%)' } : {}),
            ...(position === 'right' ? { left: -8, top: '50%', transform: 'translateY(-50%)' } : {}),
            borderLeft: position === 'bottom' || position === 'top' ? '8px solid transparent' : undefined,
            borderRight: position === 'bottom' || position === 'top' ? '8px solid transparent' : undefined,
            borderTop: position === 'left' || position === 'right' ? '8px solid transparent' : undefined,
            borderBottom: position === 'left' || position === 'right' ? '8px solid transparent' : undefined,
            ...(position === 'bottom' ? { borderBottom: '8px solid #1c1c1e' } : {}),
            ...(position === 'top' ? { borderTop: '8px solid #1c1c1e' } : {}),
            ...(position === 'left' ? { borderLeft: '8px solid #1c1c1e' } : {}),
            ...(position === 'right' ? { borderRight: '8px solid #1c1c1e' } : {}),
          }}
        />
      </motion.div>
    </>
  );
}
