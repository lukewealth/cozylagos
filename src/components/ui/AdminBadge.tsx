import React from 'react';
import { motion } from 'motion/react';

interface AdminBadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function AdminBadge({
  children,
  variant = 'default',
  size = 'md',
  className = ''
}: AdminBadgeProps) {
  const variants = {
    default: 'bg-charcoal/5 text-charcoal/70',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-orange-100 text-orange-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700'
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm'
  };

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        font-bold uppercase tracking-wider rounded-full
        inline-flex items-center
        ${className}
      `}
    >
      {children}
    </motion.span>
  );
}
