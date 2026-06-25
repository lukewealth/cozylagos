import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import StaffAssignModal from '../ui/StaffAssignModal';

vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: any) => {
      const { initial, animate, exit, transition, whileHover, whileTap, ...rest } = props;
      return <div {...rest}>{children}</div>;
    },
    button: ({ children, ...props }: any) => {
      const { initial, animate, exit, transition, whileHover, whileTap, ...rest } = props;
      return <button {...rest}>{children}</button>;
    },
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('StaffAssignModal', () => {
  const mockStaff = [
    { id: 's1', name: 'John Doe', role: 'driver', status: 'on_duty', initials: 'JD', certifications: ['CDL'], specializations: ['VIP'], rating: 4.8, availabilityFrom: 'Now', currentAssignment: undefined, tenureYears: 3 },
    { id: 's2', name: 'Jane Smith', role: 'chef', status: 'available', initials: 'JS', certifications: ['Culinary'], specializations: ['French'], rating: 4.9, availabilityFrom: 'Now', currentAssignment: undefined, tenureYears: 5 },
    { id: 's3', name: 'Off Duty', role: 'security', status: 'off_duty', initials: 'OD', certifications: [], specializations: [], rating: 4.5, availabilityFrom: 'Tomorrow', currentAssignment: undefined, tenureYears: 2 },
  ];

  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onAssign: vi.fn(),
    staff: mockStaff,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders when open', () => {
    render(<StaffAssignModal {...defaultProps} />);
    expect(screen.getAllByText('Assign Staff').length).toBeGreaterThanOrEqual(1);
  });

  it('filters out off-duty staff', () => {
    render(<StaffAssignModal {...defaultProps} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.queryByText('Off Duty')).not.toBeInTheDocument();
  });

  it('shows available staff count', () => {
    render(<StaffAssignModal {...defaultProps} />);
    expect(screen.getByText('Available Staff (2)')).toBeInTheDocument();
  });

  it('shows booking info when provided', () => {
    render(
      <StaffAssignModal
        {...defaultProps}
        bookingInfo={{ title: 'VIP Pickup', guestName: 'Guest A', date: '2026-06-25' }}
      />
    );
    expect(screen.getByText('VIP Pickup')).toBeInTheDocument();
    expect(screen.getByText('Guest A')).toBeInTheDocument();
  });

  it('calls onClose when cancel clicked', () => {
    render(<StaffAssignModal {...defaultProps} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('shows empty state when no staff available', () => {
    render(<StaffAssignModal {...defaultProps} staff={[]} />);
    expect(screen.getByText('No staff available right now.')).toBeInTheDocument();
  });
});
