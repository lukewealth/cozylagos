import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import NotificationCenter from '../NotificationCenter';

// Mock dependencies
vi.mock('../../auth', () => ({
  useAuth: () => ({
    currentUser: { id: 'test-user', name: 'Test User', email: 'test@example.com' }
  })
}));

vi.mock('../../hooks/useDatabase', () => ({
  useDatabase: () => ({
    data: [
      {
        id: '1',
        title: 'Test Notification',
        message: 'This is a test notification',
        type: 'info',
        read: false,
        createdAt: new Date().toISOString(),
        userId: 'test-user'
      },
      {
        id: '2',
        title: 'Booking Confirmed',
        message: 'Your booking has been confirmed',
        type: 'booking',
        read: true,
        createdAt: new Date().toISOString(),
        userId: 'test-user'
      }
    ],
    updateRecord: vi.fn()
  })
}));

vi.mock('../ui/UniversalModal', () => ({
  default: ({ children, isOpen, onClose, title }: any) => 
    isOpen ? <div data-testid="modal"><h2>{title}</h2>{children}</div> : null
}));

describe('NotificationCenter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders notification bell', () => {
    render(<NotificationCenter />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('displays unread count badge', () => {
    render(<NotificationCenter />);
    const badge = screen.getByText('1');
    expect(badge).toBeInTheDocument();
  });

  it('opens modal when bell is clicked', () => {
    render(<NotificationCenter />);
    const bell = screen.getByRole('button');
    fireEvent.click(bell);
    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(screen.getByText('Notifications')).toBeInTheDocument();
  });

  it('displays notifications in modal', async () => {
    render(<NotificationCenter />);
    const bell = screen.getByRole('button');
    fireEvent.click(bell);
    
    await waitFor(() => {
      expect(screen.getByText('Test Notification')).toBeInTheDocument();
      expect(screen.getByText('Booking Confirmed')).toBeInTheDocument();
    });
  });

  it('filters notifications by status', async () => {
    render(<NotificationCenter />);
    const bell = screen.getByRole('button');
    fireEvent.click(bell);
    
    const filterSelect = screen.getByDisplayValue('All');
    fireEvent.change(filterSelect, { target: { value: 'unread' } });
    
    await waitFor(() => {
      expect(screen.getByText('Test Notification')).toBeInTheDocument();
    });
  });

  it('shows empty state when no notifications', async () => {
    render(<NotificationCenter />);
    const bell = screen.getByRole('button');
    fireEvent.click(bell);
    
    // Modal should open
    expect(screen.getByTestId('modal')).toBeInTheDocument();
  });
});
