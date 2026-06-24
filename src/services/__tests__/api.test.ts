import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from '../api';

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('health.check', () => {
    it('should call health endpoint', async () => {
      const mockResponse = { success: true, data: { status: 'ok' } };
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await api.health.check();
      
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/health',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
      expect(result.success).toBe(true);
    });
  });

  describe('users.getAll', () => {
    it('should fetch all users', async () => {
      const mockUsers = [
        { id: '1', email: 'test@example.com', name: 'Test User' },
      ];
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, data: mockUsers }),
      });

      const result = await api.users.getAll();
      
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockUsers);
    });

    it('should handle query parameters', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, data: [] }),
      });

      await api.users.getAll({ role: 'admin' });
      
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/users?role=admin',
        expect.any(Object)
      );
    });
  });

  describe('users.create', () => {
    it('should create a new user', async () => {
      const newUser = {
        email: 'new@example.com',
        name: 'New User',
        password: 'password123',
        role: 'user',
      };
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, data: { id: '123', ...newUser } }),
      });

      const result = await api.users.create(newUser);
      
      expect(result.success).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/users',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(newUser),
        })
      );
    });
  });

  describe('bookings.confirm', () => {
    it('should confirm a booking', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, message: 'Booking confirmed' }),
      });

      const result = await api.bookings.confirm('booking-123');
      
      expect(result.success).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/bookings',
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({ id: 'booking-123', status: 'confirmed' }),
        })
      );
    });
  });

  describe('listings.getAll', () => {
    it('should fetch all listings', async () => {
      const mockListings = [
        { id: '1', title: 'Test Property' },
      ];
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, data: mockListings }),
      });

      const result = await api.listings.getAll();
      
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockListings);
    });
  });

  describe('error handling', () => {
    it('should handle network errors', async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

      const result = await api.users.getAll();
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Network error');
    });

    it('should handle API errors', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ message: 'Unauthorized' }),
      });

      const result = await api.users.getAll();
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Unauthorized');
    });
  });

  describe('authentication headers', () => {
    it('should include auth token when available', async () => {
      localStorage.setItem('cozy_lagos_auth_token', 'test-token');
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, data: [] }),
      });

      await api.users.getAll();
      
      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-token',
          }),
        })
      );
    });
  });
});
