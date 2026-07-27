import React from 'react';
import { motion } from 'motion/react';
import { LayoutDashboard, Bell, Calendar, Settings, Compass, Heart } from 'lucide-react';

interface BottomNavBarProps {
  role: 'service_provider' | 'user';
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSettings?: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
}

const SP_TABS: NavItem[] = [
  { id: 'service-dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'booking-requests', label: 'Bookings', icon: Bell },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const USER_TABS: NavItem[] = [
  { id: 'explore-lagos', label: 'Explore', icon: Compass },
  { id: 'user-dashboard', label: 'Bookings', icon: Bell },
  { id: 'favorites', label: 'Favorites', icon: Heart },
  { id: 'account-settings', label: 'Settings', icon: Settings },
];

export default function BottomNavBar({ role, activeTab, onTabChange, onSettings }: BottomNavBarProps) {
  const tabs = role === 'service_provider' ? SP_TABS : USER_TABS;

  const handleClick = (tab: NavItem) => {
    if (tab.id === 'settings' && onSettings) {
      onSettings();
    } else {
      onTabChange(tab.id);
    }
  };

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
    >
      <div className="backdrop-blur-xl bg-white/90 border-t border-gray-200 shadow-lg">
        <div className="flex items-center justify-around px-2 py-2 pb-[env(safe-area-inset-bottom)]">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <motion.button
                key={tab.id}
                onClick={() => handleClick(tab)}
                whileTap={{ scale: 0.9 }}
                className={`relative flex flex-col items-center justify-center gap-0.5 px-3 py-2 rounded-xl transition-colors min-w-[64px] ${
                  isActive ? 'text-primary' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="absolute inset-0 bg-primary/10 rounded-xl"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <motion.div
                  animate={{ scale: isActive ? 1.1 : 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="relative z-10"
                >
                  <Icon className="w-5 h-5" />
                </motion.div>
                <span className="text-[10px] font-medium relative z-10">{tab.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}
