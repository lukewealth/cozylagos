import React, { createContext, useContext, useState, useEffect } from 'react';
import { Listing } from '../types';

interface CartItem {
  listing: Listing;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (listing: Listing) => void;
  removeFromCart: (listingId: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
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
      } catch (error) {
        console.error('Failed to load cart from localStorage', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cozy_lagos_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (listing: Listing) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.listing.id === listing.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.listing.id === listing.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { listing, quantity: 1 }];
    });
  };

  const removeFromCart = (listingId: string) => {
    setCart(prevCart => prevCart.filter(item => item.listing.id !== listingId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((total, item) => total + (item.listing.nightlyRate * item.quantity), 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, cartTotal, cartCount }}>
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
