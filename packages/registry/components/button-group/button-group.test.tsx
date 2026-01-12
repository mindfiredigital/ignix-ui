/**
 * ButtonGroup Component Unit Tests
 * 
 * Comprehensive test suite for the ButtonGroup component covering:
 * - Basic rendering with multiple buttons
 * - Single selection (controlled and uncontrolled)
 * - Multiple selection (controlled and uncontrolled)
 * - Active state highlighting
 * - Orientation and wrap behavior
 * - Spacing configuration
 * - Event handling and callbacks
 * - Accessibility
 * - Edge cases
 * 
 * @file button-group.test.tsx
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { ButtonGroup, type ButtonGroupItem } from './index';

// Mock framer-motion to avoid animation-related issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    button: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
      <button {...props}>{children}</button>
    ),
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
  },
}));

// Mock the Button component
interface MockButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: string;
  variant?: string;
  'aria-pressed'?: boolean;
}

vi.mock('../button', () => ({
  Button: React.forwardRef<HTMLButtonElement, MockButtonProps>(
    ({ children, className, disabled, size, variant, onClick, 'aria-pressed': ariaPressed, ...props }, ref) => (
      <button
        ref={ref}
        className={className}
        disabled={disabled}
        data-size={size}
        data-variant={variant}
        data-aria-pressed={ariaPressed}
        onClick={onClick}
        {...props}
      >
        {children}
      </button>
    )
  ),
  buttonVariants: {},
}));

describe('ButtonGroup', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Sample button items for testing
  const defaultItems: ButtonGroupItem[] = [
    { value: 'option1', children: 'Option 1' },
    { value: 'option2', children: 'Option 2' },
    { value: 'option3', children: 'Option 3' },
  ];

  // ============================================================================
  // Basic Rendering Tests
  // ============================================================================

  describe('Basic Rendering', () => {
    it('renders all buttons correctly', () => {
      render(<ButtonGroup items={defaultItems} />);

      expect(screen.getByRole('button', { name: 'Option 1' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Option 2' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Option 3' })).toBeInTheDocument();
    });

    it('renders with correct group role and aria-label', () => {
      const { container } = render(<ButtonGroup items={defaultItems} />);

      const group = container.querySelector('[role="group"]');
      expect(group).toBeInTheDocument();
      expect(group).toHaveAttribute('aria-label', 'Button group');
    });

    it('renders buttons with unique keys', () => {
      render(<ButtonGroup items={defaultItems} />);

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(3);
    });

    it('renders empty group when items array is empty', () => {
      const { container } = render(<ButtonGroup items={[]} />);

      const group = container.querySelector('[role="group"]');
      expect(group).toBeInTheDocument();
      expect(screen.queryAllByRole('button')).toHaveLength(0);
    });
  });

  // ============================================================================
  // Single Selection Tests (Controlled Mode)
  // ============================================================================

  describe('Single Selection - Controlled Mode', () => {
    it('highlights active button when activeValue is provided', () => {
      render(<ButtonGroup items={defaultItems} activeValue="option2" />);

      const button1 = screen.getByRole('button', { name: 'Option 1' });
      const button2 = screen.getByRole('button', { name: 'Option 2' });
      const button3 = screen.getByRole('button', { name: 'Option 3' });

      expect(button1).toHaveAttribute('data-aria-pressed', 'false');
      expect(button2).toHaveAttribute('data-aria-pressed', 'true');
      expect(button3).toHaveAttribute('data-aria-pressed', 'false');
    });

    it('calls onChange when button is clicked', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(<ButtonGroup items={defaultItems} activeValue="option1" onChange={handleChange} />);

      const button2 = screen.getByRole('button', { name: 'Option 2' });
      await user.click(button2);

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith('option2');
    });

    it('does not update active state internally in controlled mode', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      const { rerender } = render(
        <ButtonGroup items={defaultItems} activeValue="option1" onChange={handleChange} />
      );

      const button2 = screen.getByRole('button', { name: 'Option 2' });
      await user.click(button2);

      // Active state should remain as controlled by parent
      expect(screen.getByRole('button', { name: 'Option 1' })).toHaveAttribute('data-aria-pressed', 'true');
      expect(screen.getByRole('button', { name: 'Option 2' })).toHaveAttribute('data-aria-pressed', 'false');

      // Update activeValue prop
      rerender(<ButtonGroup items={defaultItems} activeValue="option2" onChange={handleChange} />);

      expect(screen.getByRole('button', { name: 'Option 1' })).toHaveAttribute('data-aria-pressed', 'false');
      expect(screen.getByRole('button', { name: 'Option 2' })).toHaveAttribute('data-aria-pressed', 'true');
    });
  });

  // ============================================================================
  // Single Selection Tests (Uncontrolled Mode)
  // ============================================================================

  describe('Single Selection - Uncontrolled Mode', () => {
    it('uses defaultValue to set initial active button', () => {
      render(<ButtonGroup items={defaultItems} defaultValue="option2" />);

      const button2 = screen.getByRole('button', { name: 'Option 2' });
      expect(button2).toHaveAttribute('data-aria-pressed', 'true');
    });

    it('updates active state internally when button is clicked', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(<ButtonGroup items={defaultItems} defaultValue="option1" onChange={handleChange} />);

      const button1 = screen.getByRole('button', { name: 'Option 1' });
      const button2 = screen.getByRole('button', { name: 'Option 2' });

      expect(button1).toHaveAttribute('data-aria-pressed', 'true');
      expect(button2).toHaveAttribute('data-aria-pressed', 'false');

      await user.click(button2);

      expect(button1).toHaveAttribute('data-aria-pressed', 'false');
      expect(button2).toHaveAttribute('data-aria-pressed', 'true');
      expect(handleChange).toHaveBeenCalledWith('option2');
    });

    it('handles no defaultValue gracefully', async () => {
      const user = userEvent.setup();

      render(<ButtonGroup items={defaultItems} />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).toHaveAttribute('data-aria-pressed', 'false');
      });

      await user.click(buttons[0]);

      expect(buttons[0]).toHaveAttribute('data-aria-pressed', 'true');
    });
  });

  // ============================================================================
  // Multiple Selection Tests (Controlled Mode)
  // ============================================================================

  describe('Multiple Selection - Controlled Mode', () => {
    it('highlights multiple active buttons when activeValues is provided', () => {
      render(
        <ButtonGroup
          items={defaultItems}
          multiple
          activeValues={['option1', 'option3']}
        />
      );

      expect(screen.getByRole('button', { name: 'Option 1' })).toHaveAttribute('data-aria-pressed', 'true');
      expect(screen.getByRole('button', { name: 'Option 2' })).toHaveAttribute('data-aria-pressed', 'false');
      expect(screen.getByRole('button', { name: 'Option 3' })).toHaveAttribute('data-aria-pressed', 'true');
    });

    it('calls onChange when button is clicked in multiple mode', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(
        <ButtonGroup
          items={defaultItems}
          multiple
          activeValues={['option1']}
          onChange={handleChange}
        />
      );

      const button2 = screen.getByRole('button', { name: 'Option 2' });
      await user.click(button2);

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith('option2');
    });

    it('does not update active state internally in controlled multiple mode', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      const { rerender } = render(
        <ButtonGroup
          items={defaultItems}
          multiple
          activeValues={['option1']}
          onChange={handleChange}
        />
      );

      const button2 = screen.getByRole('button', { name: 'Option 2' });
      await user.click(button2);

      // Active state should remain as controlled by parent
      expect(screen.getByRole('button', { name: 'Option 1' })).toHaveAttribute('data-aria-pressed', 'true');
      expect(screen.getByRole('button', { name: 'Option 2' })).toHaveAttribute('data-aria-pressed', 'false');

      // Update activeValues prop
      rerender(
        <ButtonGroup
          items={defaultItems}
          multiple
          activeValues={['option1', 'option2']}
          onChange={handleChange}
        />
      );

      expect(screen.getByRole('button', { name: 'Option 1' })).toHaveAttribute('data-aria-pressed', 'true');
      expect(screen.getByRole('button', { name: 'Option 2' })).toHaveAttribute('data-aria-pressed', 'true');
    });

    it('handles empty activeValues array', () => {
      render(<ButtonGroup items={defaultItems} multiple activeValues={[]} />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).toHaveAttribute('data-aria-pressed', 'false');
      });
    });
  });

  // ============================================================================
  // Multiple Selection Tests (Uncontrolled Mode)
  // ============================================================================

  describe('Multiple Selection - Uncontrolled Mode', () => {
    it('uses defaultValue to set initial active button in multiple mode', () => {
      render(<ButtonGroup items={defaultItems} multiple defaultValue="option2" />);

      expect(screen.getByRole('button', { name: 'Option 2' })).toHaveAttribute('data-aria-pressed', 'true');
    });

    it('toggles button selection when clicked in multiple mode', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(
        <ButtonGroup
          items={defaultItems}
          multiple
          defaultValue="option1"
          onChange={handleChange}
        />
      );

      const button1 = screen.getByRole('button', { name: 'Option 1' });
      const button2 = screen.getByRole('button', { name: 'Option 2' });

      expect(button1).toHaveAttribute('data-aria-pressed', 'true');
      expect(button2).toHaveAttribute('data-aria-pressed', 'false');

      // Click button2 to select it
      await user.click(button2);

      expect(button1).toHaveAttribute('data-aria-pressed', 'true');
      expect(button2).toHaveAttribute('data-aria-pressed', 'true');
      expect(handleChange).toHaveBeenCalledWith('option2');

      // Click button2 again to deselect it
      await user.click(button2);

      expect(button1).toHaveAttribute('data-aria-pressed', 'true');
      expect(button2).toHaveAttribute('data-aria-pressed', 'false');
      expect(handleChange).toHaveBeenCalledTimes(2);
    });

    it('allows selecting multiple buttons independently', async () => {
      const user = userEvent.setup();

      render(<ButtonGroup items={defaultItems} multiple />);

      const button1 = screen.getByRole('button', { name: 'Option 1' });
      const button2 = screen.getByRole('button', { name: 'Option 2' });
      const button3 = screen.getByRole('button', { name: 'Option 3' });

      await user.click(button1);
      await user.click(button2);
      await user.click(button3);

      expect(button1).toHaveAttribute('data-aria-pressed', 'true');
      expect(button2).toHaveAttribute('data-aria-pressed', 'true');
      expect(button3).toHaveAttribute('data-aria-pressed', 'true');
    });
  });

  // ============================================================================
  // Active State Highlighting Tests
  // ============================================================================

  describe('Active State Highlighting', () => {
    it('applies ring styling to active button when no activeVariant is provided', () => {
      render(<ButtonGroup items={defaultItems} activeValue="option2" />);

      const button2 = screen.getByRole('button', { name: 'Option 2' });
      expect(button2.className).toContain('ring-2');
      expect(button2.className).toContain('ring-offset-2');
      expect(button2.className).toContain('ring-primary');
    });

    it('applies activeVariant to active button instead of ring styling', () => {
      render(
        <ButtonGroup
          items={defaultItems}
          activeValue="option2"
          activeVariant="primary"
        />
      );

      const button2 = screen.getByRole('button', { name: 'Option 2' });
      expect(button2).toHaveAttribute('data-variant', 'primary');
      expect(button2.className).not.toContain('ring-2');
    });

    it('uses button variant when not active', () => {
      const itemsWithVariants: ButtonGroupItem[] = [
        { value: 'option1', children: 'Option 1', variant: 'success' },
        { value: 'option2', children: 'Option 2', variant: 'danger' },
      ];

      render(<ButtonGroup items={itemsWithVariants} activeValue="option1" />);

      expect(screen.getByRole('button', { name: 'Option 1' })).toHaveAttribute('data-variant', 'success');
      expect(screen.getByRole('button', { name: 'Option 2' })).toHaveAttribute('data-variant', 'danger');
    });

    it('uses default variant (outline) when no variant is specified', () => {
      render(<ButtonGroup items={defaultItems} />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).toHaveAttribute('data-variant', 'outline');
      });
    });
  });

  // ============================================================================
  // Orientation Tests
  // ============================================================================

  describe('Orientation', () => {
    it('renders horizontally by default', () => {
      const { container } = render(<ButtonGroup items={defaultItems} />);

      const group = container.querySelector('[role="group"]');
      expect(group?.className).toContain('flex-row');
    });

    it('renders vertically when orientation is vertical', () => {
      const { container } = render(<ButtonGroup items={defaultItems} orientation="vertical" />);

      const group = container.querySelector('[role="group"]');
      expect(group?.className).toContain('flex-col');
    });

    it('switches orientation dynamically', () => {
      const { container, rerender } = render(<ButtonGroup items={defaultItems} orientation="horizontal" />);

      let group = container.querySelector('[role="group"]');
      expect(group?.className).toContain('flex-row');

      rerender(<ButtonGroup items={defaultItems} orientation="vertical" />);

      group = container.querySelector('[role="group"]');
      expect(group?.className).toContain('flex-col');
    });
  });

  // ============================================================================
  // Wrap Behavior Tests
  // ============================================================================

  describe('Wrap Behavior', () => {
    it('wraps buttons by default', () => {
      const { container } = render(<ButtonGroup items={defaultItems} />);

      const group = container.querySelector('[role="group"]');
      expect(group?.className).toContain('flex-wrap');
    });

    it('does not wrap when wrap is false', () => {
      const { container } = render(<ButtonGroup items={defaultItems} wrap={false} />);

      const group = container.querySelector('[role="group"]');
      expect(group?.className).toContain('flex-nowrap');
    });

    it('switches wrap behavior dynamically', () => {
      const { container, rerender } = render(<ButtonGroup items={defaultItems} wrap={true} />);

      let group = container.querySelector('[role="group"]');
      expect(group?.className).toContain('flex-wrap');

      rerender(<ButtonGroup items={defaultItems} wrap={false} />);

      group = container.querySelector('[role="group"]');
      expect(group?.className).toContain('flex-nowrap');
    });
  });

  // ============================================================================
  // Spacing Tests
  // ============================================================================

  describe('Spacing', () => {
    it('uses default spacing (gap-2)', () => {
      const { container } = render(<ButtonGroup items={defaultItems} />);

      const group = container.querySelector('[role="group"]');
      expect(group?.className).toContain('gap-2');
    });

    it('applies custom spacing', () => {
      const { container } = render(<ButtonGroup items={defaultItems} spacing="gap-4" />);

      const group = container.querySelector('[role="group"]');
      expect(group?.className).toContain('gap-4');
    });

    it('updates spacing dynamically', () => {
      const { container, rerender } = render(<ButtonGroup items={defaultItems} spacing="gap-2" />);

      let group = container.querySelector('[role="group"]');
      expect(group?.className).toContain('gap-2');

      rerender(<ButtonGroup items={defaultItems} spacing="gap-6" />);

      group = container.querySelector('[role="group"]');
      expect(group?.className).toContain('gap-6');
    });
  });

  // ============================================================================
  // Event Handling Tests
  // ============================================================================

  describe('Event Handling', () => {
    it('calls item onClick handler when button is clicked', async () => {
      const user = userEvent.setup();
      const itemOnClick = vi.fn();

      const items: ButtonGroupItem[] = [
        { value: 'option1', children: 'Option 1', onClick: itemOnClick },
        { value: 'option2', children: 'Option 2' },
      ];

      render(<ButtonGroup items={items} />);

      const button1 = screen.getByRole('button', { name: 'Option 1' });
      await user.click(button1);

      expect(itemOnClick).toHaveBeenCalledTimes(1);
      expect(itemOnClick).toHaveBeenCalledWith('option1', expect.any(Object));
    });

    it('calls both item onClick and onChange when button is clicked', async () => {
      const user = userEvent.setup();
      const itemOnClick = vi.fn();
      const handleChange = vi.fn();

      const items: ButtonGroupItem[] = [
        { value: 'option1', children: 'Option 1', onClick: itemOnClick },
      ];

      render(<ButtonGroup items={items} onChange={handleChange} />);

      const button1 = screen.getByRole('button', { name: 'Option 1' });
      await user.click(button1);

      expect(itemOnClick).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith('option1');
    });

    it('does not call onChange when not provided', async () => {
      const user = userEvent.setup();

      render(<ButtonGroup items={defaultItems} />);

      const button1 = screen.getByRole('button', { name: 'Option 1' });
      await user.click(button1);

      // Should not throw error
      expect(button1).toBeInTheDocument();
    });
  });

  // ============================================================================
  // Ref Forwarding Tests
  // ============================================================================

  describe('Ref Forwarding', () => {
    it('forwards ref to container div', () => {
      const ref = React.createRef<HTMLDivElement>();

      render(<ButtonGroup items={defaultItems} ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toHaveAttribute('role', 'group');
    });

    it('ref points to the correct element', () => {
      const ref = React.createRef<HTMLDivElement>();
      const { container } = render(<ButtonGroup items={defaultItems} ref={ref} />);

      const group = container.querySelector('[role="group"]');
      expect(ref.current).toBe(group);
    });
  });

  // ============================================================================
  // Custom ClassName Tests
  // ============================================================================

  describe('Custom ClassName', () => {
    it('applies custom className to container', () => {
      const { container } = render(<ButtonGroup items={defaultItems} className="custom-group" />);

      const group = container.querySelector('[role="group"]');
      expect(group).toHaveClass('custom-group');
    });

    it('applies custom className to individual buttons', () => {
      const items: ButtonGroupItem[] = [
        { value: 'option1', children: 'Option 1', className: 'custom-button' },
        { value: 'option2', children: 'Option 2' },
      ];

      render(<ButtonGroup items={items} />);

      const button1 = screen.getByRole('button', { name: 'Option 1' });
      expect(button1).toHaveClass('custom-button');
    });

    it('merges custom className with default classes', () => {
      const { container } = render(
        <ButtonGroup items={defaultItems} className="custom-class" spacing="gap-4" />
      );

      const group = container.querySelector('[role="group"]');
      expect(group).toHaveClass('custom-class');
      expect(group?.className).toContain('gap-4');
    });
  });

  // ============================================================================
  // Edge Cases Tests
  // ============================================================================

  describe('Edge Cases', () => {
    it('handles single button in group', () => {
      const singleItem: ButtonGroupItem[] = [{ value: 'only', children: 'Only Button' }];

      render(<ButtonGroup items={singleItem} />);

      expect(screen.getByRole('button', { name: 'Only Button' })).toBeInTheDocument();
    });

    it('handles buttons with same children but different values', () => {
      const items: ButtonGroupItem[] = [
        { value: 'btn1', children: 'Button' },
        { value: 'btn2', children: 'Button' },
      ];

      render(<ButtonGroup items={items} />);

      const buttons = screen.getAllByRole('button', { name: 'Button' });
      expect(buttons).toHaveLength(2);
    });

    it('handles undefined activeValue gracefully', () => {
      render(<ButtonGroup items={defaultItems} activeValue={undefined} />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).toHaveAttribute('data-aria-pressed', 'false');
      });
    });

    it('handles switching between single and multiple modes', async () => {
      const user = userEvent.setup();
      const { rerender } = render(<ButtonGroup items={defaultItems} defaultValue="option1" />);

      const button1 = screen.getByRole('button', { name: 'Option 1' });
      expect(button1).toHaveAttribute('data-aria-pressed', 'true');

      // Switch to multiple mode
      rerender(<ButtonGroup items={defaultItems} multiple defaultValue="option1" />);

      expect(button1).toHaveAttribute('data-aria-pressed', 'true');

      // Click another button
      const button2 = screen.getByRole('button', { name: 'Option 2' });
      await user.click(button2);

      expect(button1).toHaveAttribute('data-aria-pressed', 'true');
      expect(button2).toHaveAttribute('data-aria-pressed', 'true');
    });

    it('handles rapid button clicks', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(<ButtonGroup items={defaultItems} onChange={handleChange} />);

      const button1 = screen.getByRole('button', { name: 'Option 1' });
      const button2 = screen.getByRole('button', { name: 'Option 2' });

      await user.click(button1);
      await user.click(button2);
      await user.click(button1);

      expect(handleChange).toHaveBeenCalledTimes(3);
      expect(handleChange).toHaveBeenNthCalledWith(1, 'option1');
      expect(handleChange).toHaveBeenNthCalledWith(2, 'option2');
      expect(handleChange).toHaveBeenNthCalledWith(3, 'option1');
    });

    it('handles items with all button props', () => {
      const items: ButtonGroupItem[] = [
        {
          value: 'full',
          children: 'Full Button',
          variant: 'primary',
          size: 'lg',
          disabled: false,
          className: 'custom-class',
        },
      ];

      render(<ButtonGroup items={items} />);

      const button = screen.getByRole('button', { name: 'Full Button' });
      expect(button).toHaveAttribute('data-variant', 'primary');
      expect(button).toHaveAttribute('data-size', 'lg');
      expect(button).toHaveClass('custom-class');
    });
  });

  // ============================================================================
  // Accessibility Tests
  // ============================================================================

  describe('Accessibility', () => {
    it('has proper group role', () => {
      const { container } = render(<ButtonGroup items={defaultItems} />);

      const group = container.querySelector('[role="group"]');
      expect(group).toBeInTheDocument();
    });

    it('has aria-label on group', () => {
      const { container } = render(<ButtonGroup items={defaultItems} />);

      const group = container.querySelector('[role="group"]');
      expect(group).toHaveAttribute('aria-label', 'Button group');
    });

    it('sets aria-pressed correctly for active buttons', () => {
      render(<ButtonGroup items={defaultItems} activeValue="option2" />);

      expect(screen.getByRole('button', { name: 'Option 1' })).toHaveAttribute('data-aria-pressed', 'false');
      expect(screen.getByRole('button', { name: 'Option 2' })).toHaveAttribute('data-aria-pressed', 'true');
      expect(screen.getByRole('button', { name: 'Option 3' })).toHaveAttribute('data-aria-pressed', 'false');
    });

    it('sets aria-pressed correctly for multiple active buttons', () => {
      render(
        <ButtonGroup
          items={defaultItems}
          multiple
          activeValues={['option1', 'option3']}
        />
      );

      expect(screen.getByRole('button', { name: 'Option 1' })).toHaveAttribute('data-aria-pressed', 'true');
      expect(screen.getByRole('button', { name: 'Option 2' })).toHaveAttribute('data-aria-pressed', 'false');
      expect(screen.getByRole('button', { name: 'Option 3' })).toHaveAttribute('data-aria-pressed', 'true');
    });

    it('preserves other aria attributes from container props', () => {
      const { container } = render(
        <ButtonGroup items={defaultItems} aria-label="Custom Group Label" />
      );

      const group = container.querySelector('[role="group"]');
      expect(group).toHaveAttribute('aria-label', 'Custom Group Label');
    });
  });

  // ============================================================================
  // Integration Tests
  // ============================================================================

  describe('Integration Scenarios', () => {
    it('handles complete filter scenario', async () => {
      const user = userEvent.setup();
      const handleFilterChange = vi.fn();

      const filterItems: ButtonGroupItem[] = [
        { value: 'all', children: 'All' },
        { value: 'active', children: 'Active' },
        { value: 'inactive', children: 'Inactive' },
      ];

      const { rerender } = render(
        <ButtonGroup items={filterItems} activeValue="all" onChange={handleFilterChange} />
      );

      const activeButton = screen.getByRole('button', { name: 'Active' });
      await user.click(activeButton);

      expect(handleFilterChange).toHaveBeenCalledWith('active');

      rerender(
        <ButtonGroup items={filterItems} activeValue="active" onChange={handleFilterChange} />
      );

      expect(screen.getByRole('button', { name: 'Active' })).toHaveAttribute('data-aria-pressed', 'true');
    });

    it('handles size selector scenario', async () => {
      const user = userEvent.setup();

      const sizeItems: ButtonGroupItem[] = [
        { value: 'xs', children: 'XS' },
        { value: 'sm', children: 'SM' },
        { value: 'md', children: 'MD' },
        { value: 'lg', children: 'LG' },
      ];

      render(<ButtonGroup items={sizeItems} defaultValue="md" />);

      expect(screen.getByRole('button', { name: 'MD' })).toHaveAttribute('data-aria-pressed', 'true');

      const lgButton = screen.getByRole('button', { name: 'LG' });
      await user.click(lgButton);

      expect(screen.getByRole('button', { name: 'MD' })).toHaveAttribute('data-aria-pressed', 'false');
      expect(screen.getByRole('button', { name: 'LG' })).toHaveAttribute('data-aria-pressed', 'true');
    });

    it('handles text formatting toolbar scenario', async () => {
      const user = userEvent.setup();

      const formatItems: ButtonGroupItem[] = [
        { value: 'bold', children: 'Bold' },
        { value: 'italic', children: 'Italic' },
        { value: 'underline', children: 'Underline' },
      ];

      render(<ButtonGroup items={formatItems} multiple />);

      const boldButton = screen.getByRole('button', { name: 'Bold' });
      const italicButton = screen.getByRole('button', { name: 'Italic' });

      await user.click(boldButton);
      await user.click(italicButton);

      expect(boldButton).toHaveAttribute('data-aria-pressed', 'true');
      expect(italicButton).toHaveAttribute('data-aria-pressed', 'true');
      expect(screen.getByRole('button', { name: 'Underline' })).toHaveAttribute('data-aria-pressed', 'false');

      // Toggle bold off
      await user.click(boldButton);

      expect(boldButton).toHaveAttribute('data-aria-pressed', 'false');
      expect(italicButton).toHaveAttribute('data-aria-pressed', 'true');
    });
  });
});

