import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, Menu, Home, Search, Map, Compass, Package, Calendar,
  Bell, User, Settings, LogOut, ChevronRight, Shield, Briefcase,
  DollarSign, Users, FileText, CheckSquare, Send, Activity,
  LayoutDashboard, Globe, UserCheck
} from 'lucide-react';
import { useAuth } from '../auth';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ElementType;
  description: string;
}

interface UniversalSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

export default function UniversalSidebar({ activeTab, setActiveTab, onLogout }: UniversalSidebarProps) {
  const { currentUser, isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getNavItems = (): SidebarItem[] => {
    if (!isAuthenticated) {
      return [
        { id: 'home', label: 'Home', icon: Home, description: 'Welcome page' },
        { id: 'explorer', label: 'Stay', icon: Search, description: 'Find properties' },
        { id: 'explore-lagos', label: 'Explore', icon: Compass, description: 'Discover Lagos' },
        { id: 'vip-services', label: 'Services', icon: Briefcase, description: 'VIP services' },
        { id: 'bundles', label: 'Bundles', icon: Package, description: 'Service packages' },
        { id: 'events', label: 'Events', icon: Calendar, description: 'Upcoming events' },
      ];
    }

    if (currentUser?.role === 'user' || currentUser?.role === 'guest') {
      return [
        { id: 'home', label: 'Home', icon: Home, description: 'Welcome page' },
        { id: 'explorer', label: 'Stay', icon: Search, description: 'Find properties' },
        { id: 'explore-lagos', label: 'Explore', icon: Compass, description: 'Discover Lagos' },
        { id: 'vip-services', label: 'Services', icon: Briefcase, description: 'VIP services' },
        { id: 'bundles', label: 'Bundles', icon: Package, description: 'Service packages' },
        { id: 'events', label: 'Events', icon: Calendar, description: 'Upcoming events' },
        { id: 'user-dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'Your dashboard' },
        { id: 'favorites', label: 'Favorites', icon: User, description: 'Saved items' },
        { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Your notifications' },
        { id: 'account-settings', label: 'Settings', icon: Settings, description: 'Account settings' },
      ];
    }

    if (currentUser?.role === 'service_provider') {
      return [
        { id: 'service-dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'Overview' },
        { id: 'listings', label: 'Properties', icon: Globe, description: 'Manage properties' },
        { id: 'my-services', label: 'Services', icon: Briefcase, description: 'Your services' },
        { id: 'booking-requests', label: 'Bookings', icon: Calendar, description: 'Booking requests' },
        { id: 'tasks', label: 'Tasks', icon: CheckSquare, description: 'Task management' },
        { id: 'staff', label: 'Staff', icon: UserCheck, description: 'Manage staff' },
        { id: 'transactions', label: 'Transactions', icon: FileText, description: 'Financial reports' },
        { id: 'calendar', label: 'Schedule', icon: Calendar, description: 'Your schedule' },
        { id: 'inventory', label: 'Inventory', icon: Package, description: 'Assets & equipment' },
        { id: 'earnings', label: 'Earnings', icon: DollarSign, description: 'Financial overview' },
        { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Notifications' },
        { id: 'account-settings', label: 'Settings', icon: Settings, description: 'Settings' },
      ];
    }

    if (currentUser?.role === 'admin') {
      return [
        { id: 'admin-dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'Overview' },
        { id: 'properties', label: 'Properties', icon: Globe, description: 'All properties' },
        { id: 'bookings', label: 'Bookings', icon: Calendar, description: 'Booking management' },
        { id: 'events', label: 'Events', icon: Calendar, description: 'Event management' },
        { id: 'tasks', label: 'Tasks', icon: CheckSquare, description: 'Task management' },
        { id: 'staff', label: 'Staff', icon: UserCheck, description: 'Staff management' },
        { id: 'notifications', label: 'Notifications', icon: Send, description: 'Send notifications' },
        { id: 'transactions', label: 'Transactions', icon: FileText, description: 'Transaction reports' },
        { id: 'users', label: 'Users', icon: Users, description: 'User management' },
        { id: 'overview', label: 'Analytics', icon: Activity, description: 'Platform analytics' },
        { id: 'account-settings', label: 'Settings', icon: Settings, description: 'Settings' },
      ];
    }

    if (currentUser?.role === 'super_admin') {
      return [
        { id: 'super-admin-dashboard', label: 'System Control', icon: Shield, description: 'Root access' },
        { id: 'users', label: 'User Management', icon: Users, description: 'All users' },
        { id: 'admin-dashboard', label: 'Admin Panel', icon: LayoutDashboard, description: 'Admin operations' },
        { id: 'health', label: 'Platform Health', icon: Activity, description: 'System monitoring' },
        { id: 'overview', label: 'Infrastructure', icon: Globe, description: 'System stats' },
        { id: 'account-settings', label: 'Settings', icon: Settings, description: 'Settings' },
      ];
    }

    return [];
  };

  const navItems = getNavItems();

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
      >
        <Menu className="w-6 h-6 text-charcoal" />
      </button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-charcoal/60 backdrop-blur-sm z-[60]"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-80 bg-parchment z-[70] overflow-y-auto"
            >
              <SidebarContent
                navItems={navItems}
                activeTab={activeTab}
                onTabChange={handleTabChange}
                onClose={() => setIsMobileMenuOpen(false)}
                onLogout={onLogout}
                userName={currentUser?.name}
                userRole={currentUser?.role}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed left-0 top-20 bottom-0 w-64 bg-parchment border-r border-charcoal/10 overflow-y-auto z-40">
        <SidebarContent
          navItems={navItems}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onLogout={onLogout}
          userName={currentUser?.name}
          userRole={currentUser?.role}
        />
      </div>
    </>
  );
}

function SidebarContent({
  navItems,
  activeTab,
  onTabChange,
  onClose,
  onLogout,
  userName,
  userRole
}: {
  navItems: SidebarItem[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  onClose?: () => void;
  onLogout: () => void;
  userName?: string;
  userRole?: string;
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-charcoal/10">
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden absolute top-4 right-4 p-2 hover:bg-charcoal/5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-charcoal/60" />
          </button>
        )}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold text-gold-dark">
              {userName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-charcoal text-sm truncate">{userName || 'User'}</p>
            <p className="text-xs text-charcoal/60 capitalize">{userRole?.replace('_', ' ') || 'Guest'}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                isActive
                  ? 'bg-gold/10 text-gold-dark'
                  : 'text-charcoal/70 hover:bg-charcoal/5 hover:text-charcoal'
              }`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-gold-dark' : ''}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{item.label}</p>
                <p className="text-xs text-charcoal/50 truncate">{item.description}</p>
              </div>
              {isActive && <ChevronRight className="w-4 h-4 text-gold-dark" />}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-charcoal/10">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-red-600 hover:bg-red-50 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-bold">Logout</span>
        </button>
      </div>
    </div>
  );
}
