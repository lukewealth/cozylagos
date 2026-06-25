import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import EditModal from '../ui/EditModal';
import { EditField } from '../ui/EditModal';

vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: any) => {
      const { initial, animate, exit, transition, whileHover, whileTap, ...rest } = props;
      return <div {...rest}>{children}</div>;
    },
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('EditModal', () => {
  const mockFields: EditField[] = [
    { name: 'title', label: 'Title', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'price', label: 'Price', type: 'number', min: 0 },
    { name: 'category', label: 'Category', type: 'select', options: [
      { value: 'a', label: 'Option A' },
      { value: 'b', label: 'Option B' },
    ]},
    { name: 'isActive', label: 'Active', type: 'toggle' },
  ];

  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onSave: vi.fn(),
    title: 'Edit Item',
    fields: mockFields,
    initialData: { title: 'Test', description: 'Desc', price: 100, category: 'a', isActive: true },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders when open', () => {
    render(<EditModal {...defaultProps} />);
    expect(screen.getByText('Edit Item')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<EditModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText('Edit Item')).not.toBeInTheDocument();
  });

  it('renders all fields', () => {
    render(<EditModal {...defaultProps} />);
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Price')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
  });

  it('calls onClose when cancel clicked', () => {
    render(<EditModal {...defaultProps} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('calls onSave when save clicked', () => {
    render(<EditModal {...defaultProps} />);
    fireEvent.click(screen.getByText('Save Changes'));
    expect(defaultProps.onSave).toHaveBeenCalled();
  });

  it('shows required indicator', () => {
    render(<EditModal {...defaultProps} />);
    const requiredMarkers = screen.getAllByText('*');
    expect(requiredMarkers.length).toBeGreaterThan(0);
  });
});
