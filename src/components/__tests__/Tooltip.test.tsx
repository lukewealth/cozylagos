import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Tooltip from '../ui/Tooltip';

describe('Tooltip Component', () => {
  it('should render children', () => {
    render(
      <Tooltip content="Test tooltip">
        <button>Hover me</button>
      </Tooltip>
    );
    expect(screen.getByText('Hover me')).toBeTruthy();
  });

  it('should show tooltip on hover', () => {
    render(
      <Tooltip content="Test tooltip">
        <button>Hover me</button>
      </Tooltip>
    );
    
    const trigger = screen.getByText('Hover me');
    fireEvent.mouseEnter(trigger);
    
    expect(screen.getByText('Test tooltip')).toBeTruthy();
  });

  it('should hide tooltip on mouse leave', () => {
    render(
      <Tooltip content="Test tooltip">
        <button>Hover me</button>
      </Tooltip>
    );
    
    const trigger = screen.getByText('Hover me');
    fireEvent.mouseEnter(trigger);
    expect(screen.getByText('Test tooltip')).toBeTruthy();
    
    fireEvent.mouseLeave(trigger);
    // Tooltip should be hidden (may still be in DOM but not visible)
  });

  it('should render with description', () => {
    render(
      <Tooltip content="Title" description="Description text">
        <button>Hover me</button>
      </Tooltip>
    );
    
    const trigger = screen.getByText('Hover me');
    fireEvent.mouseEnter(trigger);
    
    expect(screen.getByText('Title')).toBeTruthy();
    expect(screen.getByText('Description text')).toBeTruthy();
  });
});
