import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserRecord, dbGet, dbPut, dbGetByIndex, generateId, cacheSet, cacheGet, syncToLocalStorage } from './db';
import { DEMO_CREDENTIALS, verifyPassword, getUserByEmail } from './utils/credentials';

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

// Convert demo credentials to user records (without passwords)
const getDemoUserRecord = (credential: typeof DEMO_CREDENTIALS[0]): UserRecord => ({
  id: credential.id,
  email: credential.email,
  name: credential.name,
  role: credential.role,
  avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(credential.name)}&background=random`,
  phone: credential.phone,
  verified: true,
  createdAt: '2024-01-15T10:00:00Z',
  lastLogin: new Date().toISOString(),
  loyaltyPoints: credential.loyaltyPoints || 0
});

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

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    let user = (await dbGetByIndex('users', 'email', email))[0];
    
    if (!user) {
      // Use secure password verification
      const { valid, user: credential } = await verifyPassword(email, password);
      if (valid && credential) {
        user = getDemoUserRecord(credential);
        await dbPut('users', user);
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
    const credential = DEMO_CREDENTIALS.find(u => u.role === role);
    if (credential) {
      const user = getDemoUserRecord(credential);
      await dbPut('users', user);
      await cacheSet('current_user', user, 86400000);
      setCurrentUser(user);
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

export function getDefaultDashboardTab(role: UserRole | null | undefined): string {
  switch (role) {
    case 'user':
      return 'user-dashboard';
    case 'service_provider':
      return 'service-dashboard';
    case 'admin':
      return 'admin-dashboard';
    case 'super_admin':
      return 'super-admin-dashboard';
    case 'guest':
      return 'home';
    default:
      return 'home';
  }
}
