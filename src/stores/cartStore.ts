import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  type: 'listing' | 'service' | 'experience' | 'bundle';
  title: string;
  price: number;
  quantity: number;
  image?: string;
  metadata?: Record<string, any>;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => set((state) => {
        const existingItem = state.items.find((i) => i.id === item.id);
        if (existingItem) {
          return {
            items: state.items.map((i) =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          };
        }
        return { items: [...state.items, item] };
      }),

      removeItem: (id) => set((state) => ({
        items: state.items.filter((i) => i.id !== id),
      })),

      updateQuantity: (id, quantity) => set((state) => ({
        items: state.items.map((i) =>
          i.id === id ? { ...i, quantity } : i
        ),
      })),

      clearCart: () => set({ items: [] }),

      openCart: () => set({ isOpen: true }),

      closeCart: () => set({ isOpen: false }),

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: 'cozy-lagos-cart',
    }
  )
);
