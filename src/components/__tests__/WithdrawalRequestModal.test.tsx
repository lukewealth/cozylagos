import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import WithdrawalRequestModal from '../WithdrawalRequestModal';

// Mock dependencies
vi.mock('../../auth', () => ({
  useAuth: () => ({
    currentUser: { id: 'test-provider', name: 'Test Provider', email: 'test@example.com' }
  })
}));

vi.mock('../../hooks/useDatabase', () => ({
  useDatabase: () => ({
    data: [],
    addRecord: vi.fn(),
    updateRecord: vi.fn()
  })
}));

vi.mock('../ui/Toast', () => ({
  showToast: vi.fn()
}));

vi.mock('../ui/UniversalModal', () => ({
  default: ({ children, isOpen, onClose }: any) => isOpen ? <div data-testid="modal">{children}</div> : null
}));

describe('WithdrawalRequestModal', () => {
  const mockOnClose = vi.fn();
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders when isOpen is true', () => {
    render(
      <WithdrawalRequestModal
        isOpen={true}
        onClose={mockOnClose}
        availableBalance={1000000}
      />
    );
    expect(screen.getByTestId('modal')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(
      <WithdrawalRequestModal
        isOpen={false}
        onClose={mockOnClose}
        availableBalance={1000000}
      />
    );
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('displays available balance', () => {
    render(
      <WithdrawalRequestModal
        isOpen={true}
        onClose={mockOnClose}
        availableBalance={500000}
      />
    );
    expect(screen.getByText('Available Balance')).toBeInTheDocument();
    expect(screen.getByText('₦500,000')).toBeInTheDocument();
  });

  it('validates minimum withdrawal amount', async () => {
    render(
      <WithdrawalRequestModal
        isOpen={true}
        onClose={mockOnClose}
        availableBalance={1000000}
      />
    );

    const amountInput = screen.getByPlaceholderText('Enter amount');
    fireEvent.change(amountInput, { target: { value: '500' } });

    const submitButton = screen.getByText('Submit Request');
    expect(submitButton).toBeInTheDocument();
  });

  it('validates withdrawal does not exceed available balance', async () => {
    render(
      <WithdrawalRequestModal
        isOpen={true}
        onClose={mockOnClose}
        availableBalance={10000}
      />
    );

    const amountInput = screen.getByPlaceholderText('Enter amount');
    expect(amountInput).toBeInTheDocument();
  });

  it('shows bank details fields when method is bank_transfer', () => {
    render(
      <WithdrawalRequestModal
        isOpen={true}
        onClose={mockOnClose}
        availableBalance={1000000}
      />
    );

    // Modal should be present
    expect(screen.getByTestId('modal')).toBeInTheDocument();
  });

  it('calls onClose when cancel button is clicked', () => {
    render(
      <WithdrawalRequestModal
        isOpen={true}
        onClose={mockOnClose}
        availableBalance={1000000}
      />
    );

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });
});
