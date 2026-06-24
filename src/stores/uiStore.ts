import { create } from 'zustand';

export type ActiveTab =
  | 'home'
  | 'explorer'
  | 'explore-lagos'
  | 'bundles'
  | 'signature-experiences'
  | 'yacht-experience'
  | 'vip-services'
  | 'business-lagos'
  | 'events'
  | 'favorites'
  | 'guest-dashboard'
  | 'user-dashboard'
  | 'service-dashboard'
  | 'admin-dashboard'
  | 'super-admin-dashboard'
  | 'overview'
  | 'listings'
  | 'calendar'
  | 'payouts'
  | 'wizard'
  | 'concierge-hub'
  | 'smart-recommendations'
  | 'listing-detail';

interface UIState {
  activeTab: ActiveTab;
  searchDestination: string;
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  isMobileMenuOpen: boolean;
  isSidebarCollapsed: boolean;

  setActiveTab: (tab: ActiveTab) => void;
  setSearchDestination: (destination: string) => void;
  setCartOpen: (open: boolean) => void;
  setCheckoutOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
  activeTab: 'home',
  searchDestination: '',
  isCartOpen: false,
  isCheckoutOpen: false,
  isMobileMenuOpen: false,
  isSidebarCollapsed: false,

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSearchDestination: (destination) => set({ searchDestination: destination }),
  setCartOpen: (open) => set({ isCartOpen: open }),
  setCheckoutOpen: (open) => set({ isCheckoutOpen: open }),
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
}));
