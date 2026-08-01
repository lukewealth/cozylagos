import React, { createContext, useContext, useState, useEffect } from 'react';
import { Listing } from '../types';

export interface CartItem {
  listing: Listing;
  guestsCount: number;
  checkIn: string;
  checkOut: string;
}

export interface ServiceCartItem {
  id: string;
  title: string;
  category: string;
  price: number;
  quantity: number;
  providerName?: string;
  image?: string;
  date?: string;
}

export interface ExperienceCartItem {
  id: string;
  title: string;
  category: string;
  price: number;
  guestsCount: number;
  date: string;
  vendorName?: string;
  image?: string;
  duration?: string;
}

export interface BundleCartItem {
  id: string;
  title: string;
  tierLabel: string;
  price: number;
  nights: number;
  duration: string;
  image?: string;
  checkIn?: string;
  checkOut?: string;
  guestsCount: number;
}

interface CartContextType {
  cart: CartItem[];
  serviceCart: ServiceCartItem[];
  experienceCart: ExperienceCartItem[];
  bundleCart: BundleCartItem[];
  addToCart: (listing: Listing, guestsCount?: number, checkIn?: string, checkOut?: string) => void;
  removeFromCart: (listingId: string, checkIn: string, checkOut: string) => void;
  addServiceToCart: (service: Omit<ServiceCartItem, 'quantity'>) => void;
  removeServiceFromCart: (serviceId: string) => void;
  updateServiceQuantity: (serviceId: string, quantity: number) => void;
  addExperienceToCart: (experience: ExperienceCartItem) => void;
  removeExperienceFromCart: (experienceId: string, date: string) => void;
  addBundleToCart: (bundle: BundleCartItem) => void;
  removeBundleFromCart: (bundleId: string) => void;
  clearCart: () => void;
  clearServiceCart: () => void;
  clearExperienceCart: () => void;
  clearBundleCart: () => void;
  getTotalAmount: () => number;
  getServiceTotal: () => number;
  getExperienceTotal: () => number;
  getBundleTotal: () => number;
  getGrandTotal: () => number;
  getTotalItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [serviceCart, setServiceCart] = useState<ServiceCartItem[]>([]);
  const [experienceCart, setExperienceCart] = useState<ExperienceCartItem[]>([]);
  const [bundleCart, setBundleCart] = useState<BundleCartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('cozy_lagos_cart');
    const savedServiceCart = localStorage.getItem('cozy_lagos_service_cart');
    const savedExperienceCart = localStorage.getItem('cozy_lagos_experience_cart');
    const savedBundleCart = localStorage.getItem('cozy_lagos_bundle_cart');
    if (savedCart) {
      try { setCart(JSON.parse(savedCart)); } catch (e) { console.error('Failed to parse cart', e); }
    }
    if (savedServiceCart) {
      try { setServiceCart(JSON.parse(savedServiceCart)); } catch (e) { console.error('Failed to parse service cart', e); }
    }
    if (savedExperienceCart) {
      try { setExperienceCart(JSON.parse(savedExperienceCart)); } catch (e) { console.error('Failed to parse experience cart', e); }
    }
    if (savedBundleCart) {
      try { setBundleCart(JSON.parse(savedBundleCart)); } catch (e) { console.error('Failed to parse bundle cart', e); }
    }
  }, []);

  useEffect(() => { localStorage.setItem('cozy_lagos_cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('cozy_lagos_service_cart', JSON.stringify(serviceCart)); }, [serviceCart]);
  useEffect(() => { localStorage.setItem('cozy_lagos_experience_cart', JSON.stringify(experienceCart)); }, [experienceCart]);
  useEffect(() => { localStorage.setItem('cozy_lagos_bundle_cart', JSON.stringify(bundleCart)); }, [bundleCart]);

  const addToCart = (listing: Listing, guestsCount = 1, checkIn = new Date().toISOString().split('T')[0], checkOut = new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]) => {
    setCart((prev) => {
      const exists = prev.some(ci => ci.listing.id === listing.id && ci.checkIn === checkIn && ci.checkOut === checkOut);
      if (exists) return prev;
      return [...prev, { listing, guestsCount, checkIn, checkOut }];
    });
  };

  const removeFromCart = (listingId: string, checkIn: string, checkOut: string) => {
    setCart((prev) => prev.filter(ci => !(ci.listing.id === listingId && ci.checkIn === checkIn && ci.checkOut === checkOut)));
  };

  const addServiceToCart = (service: Omit<ServiceCartItem, 'quantity'>) => {
    setServiceCart((prev) => {
      const exists = prev.find(s => s.id === service.id);
      if (exists) {
        return prev.map(s => s.id === service.id ? { ...s, quantity: s.quantity + 1 } : s);
      }
      return [...prev, { ...service, quantity: 1 }];
    });
  };

  const removeServiceFromCart = (serviceId: string) => {
    setServiceCart((prev) => prev.filter(s => s.id !== serviceId));
  };

  const updateServiceQuantity = (serviceId: string, quantity: number) => {
    if (quantity <= 0) {
      removeServiceFromCart(serviceId);
      return;
    }
    setServiceCart((prev) => prev.map(s => s.id === serviceId ? { ...s, quantity } : s));
  };

  const addExperienceToCart = (experience: ExperienceCartItem) => {
    setExperienceCart((prev) => {
      const exists = prev.find(e => e.id === experience.id && e.date === experience.date);
      if (exists) return prev;
      return [...prev, experience];
    });
  };

  const removeExperienceFromCart = (experienceId: string, date: string) => {
    setExperienceCart((prev) => prev.filter(e => !(e.id === experienceId && e.date === date)));
  };

  const addBundleToCart = (bundle: BundleCartItem) => {
    setBundleCart((prev) => {
      const exists = prev.find(b => b.id === bundle.id);
      if (exists) return prev;
      return [...prev, bundle];
    });
  };

  const removeBundleFromCart = (bundleId: string) => {
    setBundleCart((prev) => prev.filter(b => b.id !== bundleId));
  };

  const clearCart = () => setCart([]);
  const clearServiceCart = () => setServiceCart([]);
  const clearExperienceCart = () => setExperienceCart([]);
  const clearBundleCart = () => setBundleCart([]);

  const getTotalAmount = () => {
    return cart.reduce((sum, item) => {
      const checkInDate = new Date(item.checkIn);
      const checkOutDate = new Date(item.checkOut);
      const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
      const base = item.listing.nightlyRate * Math.max(1, nights);
      const cleaning = item.listing.cleaningFee || 0;
      return sum + base + cleaning;
    }, 0);
  };

  const getServiceTotal = () => {
    return serviceCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getExperienceTotal = () => {
    return experienceCart.reduce((sum, item) => sum + (item.price * item.guestsCount), 0);
  };

  const getBundleTotal = () => {
    return bundleCart.reduce((sum, item) => sum + item.price, 0);
  };

  const getGrandTotal = () => {
    return getTotalAmount() + getServiceTotal() + getExperienceTotal() + getBundleTotal();
  };

  const getTotalItemCount = () => {
    return cart.length + serviceCart.reduce((sum, item) => sum + item.quantity, 0) + experienceCart.length + bundleCart.length;
  };

  return (
    <CartContext.Provider value={{
      cart, serviceCart, experienceCart, bundleCart,
      addToCart, removeFromCart,
      addServiceToCart, removeServiceFromCart, updateServiceQuantity,
      addExperienceToCart, removeExperienceFromCart,
      addBundleToCart, removeBundleFromCart,
      clearCart, clearServiceCart, clearExperienceCart, clearBundleCart,
      getTotalAmount, getServiceTotal, getExperienceTotal, getBundleTotal, getGrandTotal, getTotalItemCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
