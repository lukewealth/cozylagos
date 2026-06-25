import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from '../api';

describe('API Service - Extended Endpoints', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('assets', () => {
    it('should fetch all assets', async () => {
      const mockAssets = [{ id: '1', name: 'Test Asset', assetCode: 'AST-001' }];
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, data: mockAssets }),
      });

      const result = await api.assets.getAll();
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockAssets);
    });

    it('should create an asset', async () => {
      const newAsset = { name: 'New Asset', assetCode: 'AST-002', category: 'fleet' };
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, data: { id: '123', ...newAsset } }),
      });

      const result = await api.assets.create(newAsset);
      expect(result.success).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/assets',
        expect.objectContaining({ method: 'POST' })
      );
    });

    it('should update an asset', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, message: 'Updated' }),
      });

      const result = await api.assets.update({ id: '1', name: 'Updated' });
      expect(result.success).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/assets',
        expect.objectContaining({ method: 'PUT' })
      );
    });

    it('should patch an asset', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, message: 'Patched' }),
      });

      const result = await api.assets.patch({ id: '1', status: 'in_use' });
      expect(result.success).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/assets',
        expect.objectContaining({ method: 'PATCH' })
      );
    });

    it('should delete an asset', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, message: 'Deleted' }),
      });

      const result = await api.assets.delete('1');
      expect(result.success).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/assets',
        expect.objectContaining({ method: 'DELETE' })
      );
    });
  });

  describe('staff', () => {
    it('should fetch all staff', async () => {
      const mockStaff = [{ id: '1', name: 'Test Staff', role: 'driver' }];
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, data: mockStaff }),
      });

      const result = await api.staff.getAll();
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockStaff);
    });

    it('should create staff', async () => {
      const newStaff = { name: 'New Staff', role: 'chef' };
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, data: { id: '123', ...newStaff } }),
      });

      const result = await api.staff.create(newStaff);
      expect(result.success).toBe(true);
    });

    it('should update staff', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, message: 'Updated' }),
      });

      const result = await api.staff.update({ id: '1', name: 'Updated Name' });
      expect(result.success).toBe(true);
    });

    it('should patch staff status', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, message: 'Patched' }),
      });

      const result = await api.staff.patch({ id: '1', status: 'on_duty' });
      expect(result.success).toBe(true);
    });

    it('should delete staff', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, message: 'Deleted' }),
      });

      const result = await api.staff.delete('1');
      expect(result.success).toBe(true);
    });

    it('should filter staff by role', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, data: [] }),
      });

      await api.staff.getAll({ role: 'driver' });
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/staff?role=driver',
        expect.any(Object)
      );
    });
  });

  describe('bookings extended', () => {
    it('should cancel a booking', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, message: 'Cancelled' }),
      });

      const result = await api.bookings.cancel('booking-1');
      expect(result.success).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/bookings',
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({ id: 'booking-1', status: 'cancelled' }),
        })
      );
    });

    it('should update booking status', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, message: 'Updated' }),
      });

      const result = await api.bookings.updateStatus('booking-1', 'in_progress');
      expect(result.success).toBe(true);
    });
  });

  describe('services CRUD', () => {
    it('should create a service', async () => {
      const newService = { title: 'VIP Driver', providerId: 'p1', category: 'driver', price: 180000 };
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, data: { id: '123', ...newService } }),
      });

      const result = await api.services.create(newService);
      expect(result.success).toBe(true);
    });

    it('should update a service', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, message: 'Updated' }),
      });

      const result = await api.services.update('1', { title: 'Updated Service' });
      expect(result.success).toBe(true);
    });

    it('should delete a service', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, message: 'Deleted' }),
      });

      const result = await api.services.delete('1');
      expect(result.success).toBe(true);
    });
  });

  describe('transactions extended', () => {
    it('should create a transaction', async () => {
      const tx = { amount: 500000, userId: 'u1', type: 'booking_revenue', description: 'Booking payment' };
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, data: { id: '123', ...tx } }),
      });

      const result = await api.transactions.create(tx);
      expect(result.success).toBe(true);
    });

    it('should process payout', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, message: 'Processed' }),
      });

      const result = await api.transactions.processPayout('tx-1');
      expect(result.success).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/transactions',
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({ id: 'tx-1', status: 'processed' }),
        })
      );
    });
  });
});
