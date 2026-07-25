import React from 'react';
import { motion } from 'motion/react';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface AdminTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export default function AdminTabs({
  tabs,
  activeTab,
  onTabChange,
  className = ''
}: AdminTabsProps) {
  return (
    <div className={`flex gap-2 border-b border-charcoal/10 ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <motion.button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
            className={`
              relative px-4 py-2.5 font-bold text-xs uppercase tracking-wider
              transition-colors flex items-center gap-2
              ${isActive ? 'text-gold-dark' : 'text-charcoal/40 hover:text-charcoal/60'}
            `}
          >
            {tab.icon}
            {tab.label}
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
