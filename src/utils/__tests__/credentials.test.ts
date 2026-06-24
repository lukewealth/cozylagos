import { describe, it, expect } from 'vitest';
import { 
  verifyPassword, 
  getUserByEmail, 
  getAllUsers, 
  getDashboardRoute,
  hasPermission,
  DEMO_CREDENTIALS 
} from '../credentials';

describe('Credentials Utility', () => {
  describe('verifyPassword', () => {
    it('should verify correct credentials', async () => {
      const result = await verifyPassword('lukeokagha@gmail.com', 'cozy_guest_2024');
      expect(result.valid).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user?.email).toBe('lukeokagha@gmail.com');
    });

    it('should reject incorrect password', async () => {
      const result = await verifyPassword('lukeokagha@gmail.com', 'wrong_password');
      expect(result.valid).toBe(false);
      expect(result.user).toBeUndefined();
    });

    it('should reject non-existent email', async () => {
      const result = await verifyPassword('nonexistent@example.com', 'any_password');
      expect(result.valid).toBe(false);
      expect(result.user).toBeUndefined();
    });
  });

  describe('getUserByEmail', () => {
    it('should return user without password', () => {
      const user = getUserByEmail('lukeokagha@gmail.com');
      expect(user).toBeDefined();
      expect(user?.email).toBe('lukeokagha@gmail.com');
      expect(user?.name).toBe('Luke Okagha');
      expect((user as any)?.password).toBeUndefined();
    });

    it('should return null for non-existent user', () => {
      const user = getUserByEmail('nonexistent@example.com');
      expect(user).toBeNull();
    });
  });

  describe('getAllUsers', () => {
    it('should return all users without passwords', () => {
      const users = getAllUsers();
      expect(users).toHaveLength(DEMO_CREDENTIALS.length);
      users.forEach(user => {
        expect((user as any).password).toBeUndefined();
      });
    });
  });

  describe('getDashboardRoute', () => {
    it('should return correct route for user role', () => {
      expect(getDashboardRoute('user')).toBe('user-dashboard');
    });

    it('should return correct route for admin role', () => {
      expect(getDashboardRoute('admin')).toBe('admin-dashboard');
    });

    it('should return correct route for super_admin role', () => {
      expect(getDashboardRoute('super_admin')).toBe('super-admin-dashboard');
    });

    it('should return correct route for service_provider role', () => {
      expect(getDashboardRoute('service_provider')).toBe('service-dashboard');
    });

    it('should return home for unknown role', () => {
      expect(getDashboardRoute('unknown')).toBe('home');
    });
  });

  describe('hasPermission', () => {
    it('should return true when user has required role', () => {
      expect(hasPermission('admin', ['admin', 'super_admin'])).toBe(true);
    });

    it('should return false when user lacks required role', () => {
      expect(hasPermission('user', ['admin', 'super_admin'])).toBe(false);
    });

    it('should handle single role requirement', () => {
      expect(hasPermission('admin', ['admin'])).toBe(true);
      expect(hasPermission('user', ['admin'])).toBe(false);
    });
  });
});
