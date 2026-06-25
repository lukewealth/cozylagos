import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AssetCreateModal from '../ui/AssetCreateModal';

vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: any) => {
      const { initial, animate, exit, transition, whileHover, whileTap, ...rest } = props;
      return <div {...rest}>{children}</div>;
    },
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('AssetCreateModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onCreate: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders when open', () => {
    render(<AssetCreateModal {...defaultProps} />);
    expect(screen.getAllByText('Create Asset').length).toBeGreaterThanOrEqual(1);
  });

  it('does not render when closed', () => {
    render(<AssetCreateModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText('Create Asset')).not.toBeInTheDocument();
  });

  it('renders all form fields', () => {
    render(<AssetCreateModal {...defaultProps} />);
    expect(screen.getByText('Asset Name')).toBeInTheDocument();
    expect(screen.getByText('Asset Code')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('Tags')).toBeInTheDocument();
    expect(screen.getByText('Notes')).toBeInTheDocument();
  });

  it('calls onClose when cancel clicked', () => {
    render(<AssetCreateModal {...defaultProps} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('shows required field indicators', () => {
    render(<AssetCreateModal {...defaultProps} />);
    const requiredMarkers = screen.getAllByText('*');
    expect(requiredMarkers.length).toBeGreaterThanOrEqual(2);
  });
});
