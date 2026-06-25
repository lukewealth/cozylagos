import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBackendHealth } from '../useBackendHealth';

vi.mock('../../services/api', () => ({
  default: {
    health: {
      check: vi.fn(),
    },
  },
}));

vi.mock('../../db', () => ({
  dbGetAll: vi.fn().mockResolvedValue([]),
}));

describe('useBackendHealth', () => {
  it('initializes with checking status', () => {
    const { result } = renderHook(() => useBackendHealth(999999));
    expect(result.current.status).toBeDefined();
    expect(typeof result.current.checkHealth).toBe('function');
  });

  it('returns health state properties', () => {
    const { result } = renderHook(() => useBackendHealth(999999));
    expect(result.current).toHaveProperty('status');
    expect(result.current).toHaveProperty('lastChecked');
    expect(result.current).toHaveProperty('message');
    expect(result.current).toHaveProperty('retryCount');
    expect(result.current).toHaveProperty('checkHealth');
  });

  it('checkHealth is callable', () => {
    const { result } = renderHook(() => useBackendHealth(999999));
    expect(() => result.current.checkHealth()).not.toThrow();
  });
});
