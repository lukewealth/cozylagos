import React from 'react';
import { motion } from 'motion/react';

interface AdminSkeletonProps {
  className?: string;
  variant?: 'text' | 'circle' | 'rect' | 'card';
  width?: string;
  height?: string;
  lines?: number;
}

export default function AdminSkeleton({
  className = '',
  variant = 'rect',
  width,
  height,
  lines = 1
}: AdminSkeletonProps) {
  const baseClasses = 'bg-gradient-to-r from-charcoal/5 via-charcoal/10 to-charcoal/5 bg-[length:200%_100%] animate-shimmer';

  if (variant === 'text') {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className={`${baseClasses} rounded ${width || 'w-full'} h-4 ${className}`}
          />
        ))}
      </div>
    );
  }

  if (variant === 'circle') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`${baseClasses} rounded-full ${width || 'w-12'} ${height || 'h-12'} ${className}`}
      />
    );
  }

  if (variant === 'card') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-white rounded-2xl border border-charcoal/5 p-6 ${className}`}
      >
        <div className="space-y-4">
          <div className={`${baseClasses} rounded-lg h-6 w-1/3`} />
          <div className={`${baseClasses} rounded h-4 w-2/3`} />
          <div className={`${baseClasses} rounded h-4 w-1/2`} />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`${baseClasses} rounded ${width || 'w-full'} ${height || 'h-32'} ${className}`}
    />
  );
}
