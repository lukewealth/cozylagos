import React from 'react';
import { motion } from 'motion/react';
import { Search, X } from 'lucide-react';

interface AdminSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function AdminSearch({
  value,
  onChange,
  placeholder = 'Search...',
  className = ''
}: AdminSearchProps) {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40" />
      <motion.input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        whileFocus={{ scale: 1.01 }}
        className="w-full pl-10 pr-10 py-2.5 border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all"
      />
      {value && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-charcoal/5 rounded transition-colors"
        >
          <X className="w-4 h-4 text-charcoal/40" />
        </motion.button>
      )}
    </div>
  );
}
