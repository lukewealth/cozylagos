import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface AdminStatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  trend?: {
    value: number;
    label: string;
    positive?: boolean;
  };
  className?: string;
}

export default function AdminStatCard({
  title,
  value,
  icon: Icon,
  iconColor = 'text-gold-dark',
  trend,
  className = ''
}: AdminStatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={`bg-white rounded-2xl border border-charcoal/5 shadow-sm p-6 transition-all duration-300 hover:shadow-xl hover:border-gold/20 ${className}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 bg-gold/10 rounded-xl ${iconColor}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`flex items-center gap-1 text-xs font-bold ${
              trend.positive === false ? 'text-red-600' : 'text-green-600'
            }`}
          >
            {trend.positive === false ? (
              <TrendingDown className="w-3 h-3" />
            ) : trend.value > 0 ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <Minus className="w-3 h-3" />
            )}
            <span>{trend.value > 0 ? '+' : ''}{trend.value}%</span>
          </motion.div>
        )}
      </div>
      <div>
        <p className="text-xs text-charcoal/60 uppercase tracking-wider font-bold mb-1">{title}</p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-charcoal"
        >
          {value}
        </motion.p>
        {trend?.label && (
          <p className="text-xs text-charcoal/50 mt-2">{trend.label}</p>
        )}
      </div>
    </motion.div>
  );
}
