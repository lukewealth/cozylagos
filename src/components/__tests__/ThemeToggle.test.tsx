import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ThemeToggle, useTheme } from '../ThemeToggle';

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('light', 'dark');
  });

  it('renders moon icon in light mode', () => {
    localStorage.setItem('theme', 'light');
    render(<ThemeToggle />);
    expect(screen.getByLabelText('Switch to dark mode')).toBeInTheDocument();
  });

  it('renders sun icon in dark mode', () => {
    localStorage.setItem('theme', 'dark');
    render(<ThemeToggle />);
    expect(screen.getByLabelText('Switch to light mode')).toBeInTheDocument();
  });

  it('toggles theme when clicked', () => {
    localStorage.setItem('theme', 'light');
    render(<ThemeToggle />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('applies theme class to document element', () => {
    localStorage.setItem('theme', 'dark');
    render(<ThemeToggle />);
    
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });
});
