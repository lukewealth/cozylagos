import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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

  it('should show tooltip on hover', async () => {
    render(
      <Tooltip content="Test tooltip" delay={0}>
        <button>Hover me</button>
      </Tooltip>
    );
    
    const trigger = screen.getByText('Hover me');
    fireEvent.mouseEnter(trigger);
    
    await waitFor(() => {
      expect(screen.getByText('Test tooltip')).toBeTruthy();
    });
  });

  it('should hide tooltip on mouse leave', async () => {
    render(
      <Tooltip content="Test tooltip" delay={0}>
        <button>Hover me</button>
      </Tooltip>
    );
    
    const trigger = screen.getByText('Hover me');
    fireEvent.mouseEnter(trigger);
    
    await waitFor(() => {
      expect(screen.getByText('Test tooltip')).toBeTruthy();
    });
    
    fireEvent.mouseLeave(trigger);
  });

  it('should render with description', async () => {
    render(
      <Tooltip content="Title" description="Description text" delay={0}>
        <button>Hover me</button>
      </Tooltip>
    );
    
    const trigger = screen.getByText('Hover me');
    fireEvent.mouseEnter(trigger);
    
    await waitFor(() => {
      expect(screen.getByText('Title')).toBeTruthy();
      expect(screen.getByText('Description text')).toBeTruthy();
    });
  });
});
