import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface AdminCardProps {
  title?: string;
  subtitle?: string;
  icon?: LucideIcon;
  iconColor?: string;
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

export default function AdminCard({
  title,
  subtitle,
  icon: Icon,
  iconColor = 'text-gold-dark',
  children,
  className = '',
  hoverable = false,
  onClick
}: AdminCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={hoverable ? { y: -4, scale: 1.02 } : undefined}
      onClick={onClick}
      className={`bg-white rounded-2xl border border-charcoal/5 shadow-sm transition-all duration-300 ${
        hoverable ? 'cursor-pointer hover:shadow-xl hover:border-gold/20' : ''
      } ${className}`}
    >
      {(title || Icon) && (
        <div className="p-6 border-b border-charcoal/5">
          <div className="flex items-start gap-3">
            {Icon && (
              <div className={`p-2 bg-gold/10 rounded-lg ${iconColor}`}>
                <Icon className="w-5 h-5" />
              </div>
            )}
            <div className="flex-1">
              {title && (
                <h3 className="font-serif text-lg font-bold text-charcoal">{title}</h3>
              )}
              {subtitle && (
                <p className="text-xs text-charcoal/60 mt-1">{subtitle}</p>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="p-6">{children}</div>
    </motion.div>
  );
}
