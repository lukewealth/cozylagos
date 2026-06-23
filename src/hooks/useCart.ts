import { useState, useEffect } from 'react';
import { Listing } from '../types';

export interface CartItem {
  listing: Listing;
  guestsCount: number;
  checkIn: string;
  checkOut: string;
}

export function useCart() {
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

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      // Check if item is already in cart (same listing and dates)
      const exists = prev.some(
        (ci) => 
          ci.listing.id === item.listing.id && 
          ci.checkIn === item.checkIn && 
          ci.checkOut === item.checkOut
      );
      if (exists) return prev;
      return [...prev, item];
    });
  };

  const removeFromCart = (listingId: string, checkIn: string, checkOut: string) => {
    setCart((prev) => prev.filter(ci => !(ci.listing.id === listingId && ci.checkIn === checkIn && ci.checkOut === checkOut)));
  };

  const clearCart = () => setCart([]);

  const getTotalAmount = () => {
    return cart.reduce((sum, item) => {
      const nights = Math.ceil((new Date(item.checkOut).getTime() - new Date(item.checkIn).getTime()) / (1000 * 60 * 60 * 24));
      const base = item.listing.nightlyRate * Math.max(1, nights);
      const cleaning = item.listing.cleaningFee || 0;
      return sum + base + cleaning;
    }, 0);
  };

  return { cart, addToCart, removeFromCart, clearCart, getTotalAmount };
}
