import React, { createContext, useContext, useState, useEffect } from 'react';
import { Listing } from '../types';

export interface CartItem {
  listing: Listing;
  guestsCount: number;
  checkIn: string;
  checkOut: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (listing: Listing, guestsCount?: number, checkIn?: string, checkOut?: string) => void;
  removeFromCart: (listingId: string, checkIn: string, checkOut: string) => void;
  clearCart: () => void;
  getTotalAmount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cozy_lagos_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart from localStorage', e);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cozy_lagos_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (listing: Listing, guestsCount = 1, checkIn = new Date().toISOString().split('T')[0], checkOut = new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]) => {
    setCart((prev) => {
      // Check if item is already in cart (same listing and dates)
      const exists = prev.some(
        (ci) => 
          ci.listing.id === listing.id && 
          ci.checkIn === checkIn && 
          ci.checkOut === checkOut
      );
      if (exists) return prev;
      return [...prev, { listing, guestsCount, checkIn, checkOut }];
    });
  };

  const removeFromCart = (listingId: string, checkIn: string, checkOut: string) => {
    setCart((prev) => prev.filter(ci => !(ci.listing.id === listingId && ci.checkIn === checkIn && ci.checkOut === checkOut)));
  };

  const clearCart = () => setCart([]);

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

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, getTotalAmount }}>
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
