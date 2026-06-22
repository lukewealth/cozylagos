import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserRecord, dbGet, dbPut, dbGetByIndex, generateId, cacheSet, cacheGet, syncToLocalStorage } from './db';

export type UserRole = 'guest' | 'user' | 'admin' | 'service_provider' | 'super_admin';

interface AuthContextType {
  currentUser: UserRecord | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, name: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  updateUser: (updates: Partial<UserRecord>) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USERS: UserRecord[] = [
  {
    id: 'guest-001',
    email: 'guest@cozylagos.ng',
    name: 'Alexander Sterling',
    role: 'guest',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDx15JuvuMcDijKEA4B_8Byjpib6fMI0fFxbYNjGPlhYAmDWvMdQMnX_byTMGQod-bhOYO4sugMfBPzJcWxb18Bmql8ORNoXufqWmoeBxtHTbACjeGG_PLhXiHkFL2osEeAHCx3O-SMpXLi_x1k6m7U63tChmAPXFuSi8NBKZZRkEVk2H9wgx0RHOtyObOSAqG24z8-V2mImw29UWFWmSYElo66Yb3acIv983sY8rqYphNg18jA9VNHTqWG9_nxNvLH1FbtnxRmPijH',
    phone: '+234 801 234 5678',
    verified: true,
    createdAt: '2024-01-15T10:00:00Z',
    lastLogin: new Date().toISOString(),
    loyaltyPoints: 12450
  },
  {
    id: 'user-001',
    email: 'user@cozylagos.ng',
    name: 'Chuka Obi',
    role: 'user',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9Lh8rkEuZ0WtuwD5WIDKt8X-Rcw_hkbPJc4me77k4fCkgvj7bw8uS_oG_i5TwGhETMSGEO8280C-iff0nUzjqzM2S4kHFg5mbfWBJzan8ih4yEEtAdcVG3RBSr9E2D2cIGqu5JReEW10IA7NXk6IzHsmjKVrqjjVOlp8L8uCHSQF6kvoikGM4EOodrcn2VvxVlXT3MdMLy4uqFdnqsmxEB_PvwDpzjr1euEh0V68xjDrRvmA70yqiRTMfrAJUIC9aGARCX0VHZCK',
    phone: '+234 802 345 6789',
    verified: true,
    createdAt: '2024-02-20T14:30:00Z',
    lastLogin: new Date().toISOString(),
    loyaltyPoints: 8200
  },
  {
    id: 'admin-001',
    email: 'admin@cozylagos.ng',
    name: 'Emeka Anene',
    role: 'admin',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuChO__jpr70PBuRfnq-BQBd5gWupLLFUTveVncrizosRGPnEKwyHQoENzgCg9lwfnKYOEM7t7cKhrxteYnQmMCPCT6fQiQhw0t5x_oyWaDcgpF6YVWQbFEqVsbRYkLo5jeNWRChx-mVO8ogBC_FOKOHv6-xLWrZeGqBTzy9SST378Rfx0ud7ubpuCc9pG_6KQSvtogIK9kbjtONB7EkpsMQcX3gIGzOMqtwgdxiG_aXaJN_AYuzaZ_bhvFIN5-cXDVzxd9AW4Sl1pM2',
    phone: '+234 803 456 7890',
    verified: true,
    createdAt: '2023-12-01T09:00:00Z',
    lastLogin: new Date().toISOString(),
    loyaltyPoints: 25000
  },
  {
    id: 'provider-001',
    email: 'chef@cozylagos.ng',
    name: 'Chef Adaeze',
    role: 'service_provider',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9lTotMd2RIFjd-3xeK4mO_pmn_YYNyDArzN4tfbFqP4RQklnVe0rYjO7FozZUN0q1OWa3DeOu-ssQ3pyzcns_p3HivAPKLD29383WGDgK7lr1wXrwFiOhXyQL0XWXIpa6C-M3iqJWUVSZG7u5maEXPdRpMTZz4hyhjRB2ciQ2NIYsmPTdywDAsBFkZ7-a_KkFgu73NjCA6ligR5O66nIl54t-AJSB4ttjEwiRBH9ARqWh0YB7Af1tO_9g0HQ3eJmKCryEixQ-8-PF',
    phone: '+234 804 567 8901',
    verified: true,
    createdAt: '2024-03-10T11:15:00Z',
    lastLogin: new Date().toISOString(),
    loyaltyPoints: 5600
  },
  {
    id: 'superadmin-001',
    email: 'superadmin@cozylagos.ng',
    name: 'System Administrator',
    role: 'super_admin',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDx15JuvuMcDijKEA4B_8Byjpib6fMI0fFxbYNjGPlhYAmDWvMdQMnX_byTMGQod-bhOYO4sugMfBPzJcWxb18Bmql8ORNoXufqWmoeBxtHTbACjeGG_PLhXiHkFL2osEeAHCx3O-SMpXLi_x1k6m7U63tChmAPXFuSi8NBKZZRkEVk2H9wgx0RHOtyObOSAqG24z8-V2mImw29UWFWmSYElo66Yb3acIv983sY8rqYphNg18jA9VNHTqWG9_nxNvLH1FbtnxRmPijH',
    phone: '+234 800 000 0000',
    verified: true,
    createdAt: '2023-01-01T00:00:00Z',
    lastLogin: new Date().toISOString(),
    loyaltyPoints: 99999
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const cached = await cacheGet<UserRecord>('current_user');
      if (cached) {
        setCurrentUser(cached);
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = useCallback(async (email: string, _password: string): Promise<boolean> => {
    let user = (await dbGetByIndex('users', 'email', email))[0];
    
    if (!user) {
      const demoUser = DEMO_USERS.find(u => u.email === email);
      if (demoUser) {
        user = demoUser;
        await dbPut('users', demoUser);
      }
    }

    if (user) {
      const updatedUser = { ...user, lastLogin: new Date().toISOString() };
      await dbPut('users', updatedUser);
      await cacheSet('current_user', updatedUser, 86400000);
      setCurrentUser(updatedUser);
      await syncToLocalStorage();
      return true;
    }

    return false;
  }, []);

  const register = useCallback(async (email: string, name: string, _password: string, role: UserRole): Promise<boolean> => {
    const existing = await dbGetByIndex('users', 'email', email);
    if (existing.length > 0) return false;

    const newUser: UserRecord = {
      id: generateId(),
      email,
      name,
      role,
      verified: false,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      loyaltyPoints: 0
    };

    await dbPut('users', newUser);
    await cacheSet('current_user', newUser, 86400000);
    setCurrentUser(newUser);
    await syncToLocalStorage();
    return true;
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    cacheSet('current_user', null, 0);
    localStorage.removeItem('cozy_lagos_current_user');
  }, []);

  const switchRole = useCallback(async (role: UserRole) => {
    const demoUser = DEMO_USERS.find(u => u.role === role);
    if (demoUser) {
      await dbPut('users', demoUser);
      await cacheSet('current_user', demoUser, 86400000);
      setCurrentUser(demoUser);
    }
  }, []);

  const updateUser = useCallback(async (updates: Partial<UserRecord>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    await dbPut('users', updated);
    await cacheSet('current_user', updated, 86400000);
    setCurrentUser(updated);
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{
      currentUser,
      isLoading,
      login,
      register,
      logout,
      switchRole,
      updateUser,
      isAuthenticated: !!currentUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
