import React, { forwardRef } from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface AdminInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
  helperText?: string;
}

export const AdminInput = forwardRef<HTMLInputElement, AdminInputProps>(
  ({ label, error, icon: Icon, helperText, className = '', ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-wider">
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40">
              <Icon className="w-4 h-4" />
            </div>
          )}
          <motion.input
            ref={ref}
            whileFocus={{ scale: 1.01 }}
            className={`
              w-full px-4 py-2.5 border rounded-lg text-sm
              focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all
              ${Icon ? 'pl-10' : ''}
              ${error ? 'border-red-500' : 'border-charcoal/10'}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-red-500"
          >
            {error}
          </motion.p>
        )}
        {helperText && !error && (
          <p className="text-xs text-charcoal/50">{helperText}</p>
        )}
      </div>
    );
  }
);

AdminInput.displayName = 'AdminInput';
