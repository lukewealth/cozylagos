import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from '../ui/LoadingSpinner';

describe('LoadingSpinner Component', () => {
  it('should render with default props', () => {
    render(<LoadingSpinner />);
    const spinner = document.querySelector('.rounded-full.border-2');
    expect(spinner).toBeTruthy();
  });

  it('should render with text', () => {
    render(<LoadingSpinner text="Loading..." />);
    expect(screen.getByText('Loading...')).toBeTruthy();
  });

  it('should render with different sizes', () => {
    const { rerender } = render(<LoadingSpinner size="sm" />);
    let spinner = document.querySelector('.w-4');
    expect(spinner).toBeTruthy();

    rerender(<LoadingSpinner size="md" />);
    spinner = document.querySelector('.w-8');
    expect(spinner).toBeTruthy();

    rerender(<LoadingSpinner size="lg" />);
    spinner = document.querySelector('.w-12');
    expect(spinner).toBeTruthy();
  });

  it('should render with different colors', () => {
    const { rerender } = render(<LoadingSpinner color="primary" />);
    let spinner = document.querySelector('.border-primary');
    expect(spinner).toBeTruthy();

    rerender(<LoadingSpinner color="secondary" />);
    spinner = document.querySelector('.border-secondary');
    expect(spinner).toBeTruthy();

    rerender(<LoadingSpinner color="white" />);
    spinner = document.querySelector('.border-white');
    expect(spinner).toBeTruthy();
  });
});
