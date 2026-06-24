import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'guest' | 'user' | 'admin' | 'super_admin' | 'service_provider';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      currentUser: null,
      isAuthenticated: false,
      isLoading: true,

      login: (user) => set({
        currentUser: user,
        isAuthenticated: true,
        isLoading: false,
      }),

      logout: () => set({
        currentUser: null,
        isAuthenticated: false,
        isLoading: false,
      }),

      updateUser: (userData) => set((state) => ({
        currentUser: state.currentUser
          ? { ...state.currentUser, ...userData }
          : null,
      })),

      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'cozy-lagos-auth',
      partialize: (state) => ({
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
