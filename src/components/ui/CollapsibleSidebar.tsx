import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, LayoutDashboard, Users, Settings, BarChart3, Shield, Database, Globe, Key, Lock, Bell, LogOut, HelpCircle, X } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: 'admin' | 'super_admin' | 'service_provider';
  onLogout?: () => void;
  onHelp?: () => void;
  onCollapse?: (collapsed: boolean) => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  description: string;
}

const ADMIN_NAV: NavItem[] = [
  { id: 'admin-dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'Overview & analytics' },
  { id: 'listings', label: 'Properties', icon: Globe, description: 'Manage all listings' },
  { id: 'bookings', label: 'Bookings', icon: Bell, description: 'Booking requests' },
  { id: 'overview', label: 'Analytics', icon: BarChart3, description: 'Platform metrics' },
];

const SUPER_ADMIN_NAV: NavItem[] = [
  { id: 'super-admin-dashboard', label: 'System Control', icon: Shield, description: 'Root access panel' },
  { id: 'admin-dashboard', label: 'User Management', icon: Users, description: 'Manage all users' },
  { id: 'overview', label: 'Infrastructure', icon: Database, description: 'System health & stats' },
];

const PROVIDER_NAV: NavItem[] = [
  { id: 'service-dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'Your services overview' },
  { id: 'listings', label: 'My Properties', icon: Globe, description: 'Manage apartments' },
  { id: 'my-services', label: 'My Services', icon: Users, description: 'Manage offerings' },
  { id: 'booking-requests', label: 'Bookings', icon: Bell, description: 'Booking requests' },
  { id: 'calendar', label: 'Schedule', icon: BarChart3, description: 'Calendar & bookings' },
  { id: 'inventory', label: 'Inventory & Staff', icon: Database, description: 'Assets & assignments' },
  { id: 'earnings', label: 'Earnings', icon: Key, description: 'Financial reports' },
];

export default function CollapsibleSidebar({ activeTab, setActiveTab, userRole, onLogout, onHelp, onCollapse, isMobileOpen = false, onMobileClose }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const handleToggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    onCollapse?.(newState);
  };

  const navItems = userRole === 'super_admin' ? SUPER_ADMIN_NAV : userRole === 'admin' ? ADMIN_NAV : PROVIDER_NAV;

  const roleConfig = {
    admin: { title: 'Admin Portal', subtitle: 'Platform Management', color: 'text-primary' },
    super_admin: { title: 'Super Admin', subtitle: 'Root Access', color: 'text-error' },
    service_provider: { title: 'Provider Hub', subtitle: 'Service Management', color: 'text-primary' },
  };

  const config = roleConfig[userRole];

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  const handleHelp = () => {
    if (onHelp) {
      onHelp();
    }
  };

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[90] lg:hidden"
          onClick={onMobileClose}
        />
      )}
      <motion.aside
        initial={false}
        animate={{
          width: isMobileOpen ? 280 : isCollapsed ? 80 : 280,
          x: typeof window !== 'undefined' && window.innerWidth < 1024 && !isMobileOpen ? -280 : 0
        }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="h-screen fixed left-0 top-0 bg-surface-container-lowest border-r border-outline-variant/20 z-[100] lg:z-50 flex flex-col overflow-hidden"
      >
      {/* Header */}
      <div className="px-6 py-8 flex items-center justify-between">
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <h1 className={`font-serif text-xl font-bold ${config.color} tracking-tight`}>
                {config.title}
              </h1>
              <p className="text-label-caps text-secondary opacity-70 mt-1 uppercase tracking-widest text-[9px]">
                {config.subtitle}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex items-center gap-1">
          {isMobileOpen && onMobileClose && (
            <button
              onClick={onMobileClose}
              className="p-2 rounded-lg hover:bg-surface-container-high transition-colors text-secondary hover:text-primary lg:hidden"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={handleToggleCollapse}
            className="p-2 rounded-lg hover:bg-surface-container-high transition-colors text-secondary hover:text-primary hidden lg:block"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <div key={item.id} className="relative">
              <button
                onClick={() => {
                  setActiveTab(item.id);
                  if (isMobileOpen && onMobileClose) onMobileClose();
                }}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all relative ${
                  isActive
                    ? 'bg-primary-container/10 text-primary font-bold'
                    : 'text-secondary hover:text-primary hover:bg-surface-container-high'
                }`}
                aria-label={item.label}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <AnimatePresence mode="wait">
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="text-body-md whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute right-0 top-0 bottom-0 w-1 bg-primary rounded-l-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </button>

              {/* Tooltip */}
              <AnimatePresence>
                {isCollapsed && hoveredItem === item.id && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 bg-on-surface text-inverse-on-surface rounded-lg text-xs font-semibold whitespace-nowrap z-50 shadow-lg pointer-events-none"
                  >
                    <div className="font-bold">{item.label}</div>
                    <div className="text-[10px] opacity-70 font-normal">{item.description}</div>
                    <div className="absolute right-full top-1/2 -translate-y-1/2 w-2 h-2 bg-on-surface rotate-45" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 pb-6 space-y-2 border-t border-outline-variant/10 pt-4">
        <div className="relative">
          <button
            onClick={handleHelp}
            onMouseEnter={() => setHoveredItem('help')}
            onMouseLeave={() => setHoveredItem(null)}
            className="w-full flex items-center gap-4 px-4 py-2 rounded-lg text-secondary hover:text-primary hover:bg-surface-container-high transition-colors relative"
            aria-label="Help & Support"
          >
            <HelpCircle className="w-5 h-5 flex-shrink-0" />
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm"
                >
                  Help & Support
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          <AnimatePresence>
            {isCollapsed && hoveredItem === 'help' && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 bg-on-surface text-inverse-on-surface rounded-lg text-xs font-semibold whitespace-nowrap z-50 shadow-lg pointer-events-none"
              >
                <div className="font-bold">Help & Support</div>
                <div className="text-[10px] opacity-70 font-normal">Get assistance and documentation</div>
                <div className="absolute right-full top-1/2 -translate-y-1/2 w-2 h-2 bg-on-surface rotate-45" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="relative">
          <button
            onClick={handleLogout}
            onMouseEnter={() => setHoveredItem('logout')}
            onMouseLeave={() => setHoveredItem(null)}
            className="w-full flex items-center gap-4 px-4 py-2 rounded-lg text-secondary hover:text-error hover:bg-error/5 transition-colors relative"
            aria-label="Logout"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm"
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          <AnimatePresence>
            {isCollapsed && hoveredItem === 'logout' && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 bg-on-surface text-inverse-on-surface rounded-lg text-xs font-semibold whitespace-nowrap z-50 shadow-lg pointer-events-none"
              >
                <div className="font-bold">Logout</div>
                <div className="text-[10px] opacity-70 font-normal">Sign out of your account</div>
                <div className="absolute right-full top-1/2 -translate-y-1/2 w-2 h-2 bg-on-surface rotate-45" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
    </>
  );
}
