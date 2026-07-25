import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface AdminEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export default function AdminEmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = ''
}: AdminEmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center py-16 px-4 ${className}`}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="w-20 h-20 bg-charcoal/5 rounded-full flex items-center justify-center mb-6"
      >
        <Icon className="w-10 h-10 text-charcoal/20" />
      </motion.div>
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="font-serif text-xl font-bold text-charcoal mb-2"
      >
        {title}
      </motion.h3>
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-charcoal/60 text-center max-w-md mb-6"
        >
          {description}
        </motion.p>
      )}
      {action && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={action.onClick}
          className="px-6 py-2.5 bg-gold text-charcoal font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-gold-dark transition-colors"
        >
          {action.label}
        </motion.button>
      )}
    </motion.div>
  );
}
