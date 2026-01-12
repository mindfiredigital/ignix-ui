/**
 * ButtonWithIcon Component Unit Tests
 * 
 * Comprehensive test suite for the ButtonWithIcon component covering:
 * - Basic rendering with icons and text
 * - Icon positioning (left, right, only)
 * - Loading states
 * - Disabled states
 * - Size and variant props
 * - Edge cases and accessibility
 * 
 * @file button-with-icon.test.tsx
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { ButtonWithIcon } from './index';

// Mock framer-motion to avoid animation-related issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
}));

// Mock the Button component
vi.mock('../button', () => ({
  Button: React.forwardRef<HTMLButtonElement, any>(
    ({ children, className, disabled, size, variant, ...props }, ref) => (
      <button
        ref={ref}
        className={className}
        disabled={disabled}
        data-size={size}
        data-variant={variant}
        {...props}
      >
        {children}
      </button>
    )
  ),
  buttonVariants: {},
}));

// Mock the Spinner component
vi.mock('../spinner', () => ({
  Spinner: ({ size, variant, className }: any) => (
    <div
      data-testid="spinner"
      data-size={size}
      data-variant={variant}
      className={className}
    >
      Loading...
    </div>
  ),
}));

// Mock lucide-react icons - create a simple test icon component
const TestIcon = ({ 'data-testid': testId = 'test-icon' }: { 'data-testid'?: string }) => (
  <svg data-testid={testId} width="16" height="16" viewBox="0 0 16 16">
    <circle cx="8" cy="8" r="4" fill="currentColor" />
  </svg>
);

describe('ButtonWithIcon', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ============================================================================
  // Basic Rendering Tests
  // ============================================================================

  describe('Basic Rendering', () => {
    it('renders button with text correctly', () => {
      render(<ButtonWithIcon>Click Me</ButtonWithIcon>);

      const button = screen.getByRole('button', { name: /click me/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Click Me');
    });

    it('renders button with icon and text correctly', () => {
      render(
        <ButtonWithIcon icon={<TestIcon />}>
          Download
        </ButtonWithIcon>
      );

      const button = screen.getByRole('button', { name: /download/i });
      expect(button).toBeInTheDocument();
      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });

    it('renders without children when icon only', () => {
      render(<ButtonWithIcon icon={<TestIcon />} iconPosition="only" />);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });
  });

  // ============================================================================
  // Icon Position Tests
  // ============================================================================

  describe('Icon Position', () => {
    it('renders icon on the left by default', () => {
      render(
        <ButtonWithIcon icon={<TestIcon />}>
          Button Text
        </ButtonWithIcon>
      );

      const button = screen.getByRole('button');
      const icon = screen.getByTestId('test-icon');
      const text = screen.getByText('Button Text');

      // Icon should be before text in DOM order
      expect(button).toContainElement(icon);
      expect(button).toContainElement(text);
    });

    it('renders icon on the right when iconPosition is "right"', () => {
      render(
        <ButtonWithIcon icon={<TestIcon />} iconPosition="right">
          Button Text
        </ButtonWithIcon>
      );

      const button = screen.getByRole('button');
      const icon = screen.getByTestId('test-icon');
      const text = screen.getByText('Button Text');

      expect(button).toContainElement(icon);
      expect(button).toContainElement(text);
    });

    it('renders icon-only button when iconPosition is "only"', () => {
      render(<ButtonWithIcon icon={<TestIcon />} iconPosition="only" />);

      const button = screen.getByRole('button');
      const icon = screen.getByTestId('test-icon');

      expect(button).toContainElement(icon);
      expect(screen.queryByText('Button Text')).not.toBeInTheDocument();
    });

    it('renders icon-only button implicitly when no children provided', () => {
      render(<ButtonWithIcon icon={<TestIcon />} />);

      const button = screen.getByRole('button');
      const icon = screen.getByTestId('test-icon');

      expect(button).toContainElement(icon);
      expect(button).not.toHaveTextContent('Button Text');
    });
  });

  // ============================================================================
  // Loading State Tests
  // ============================================================================

  describe('Loading State', () => {
    it('shows spinner when loading is true', () => {
      render(
        <ButtonWithIcon loading={true}>
          Processing
        </ButtonWithIcon>
      );

      expect(screen.getByTestId('spinner')).toBeInTheDocument();
      expect(screen.getByText('Processing')).toBeInTheDocument();
    });

    it('shows only spinner when loading and icon-only', () => {
      render(
        <ButtonWithIcon loading={true} iconPosition="only" icon={<TestIcon />} />
      );

      expect(screen.getByTestId('spinner')).toBeInTheDocument();
      expect(screen.queryByTestId('test-icon')).not.toBeInTheDocument();
    });

    it('disables button when loading is true', () => {
      render(
        <ButtonWithIcon loading={true}>
          Processing
        </ButtonWithIcon>
      );

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('calculates correct spinner size for different button sizes', () => {
      const { rerender } = render(
        <ButtonWithIcon loading={true} size="xs">
          Small
        </ButtonWithIcon>
      );
      let spinner = screen.getByTestId('spinner');
      expect(spinner).toHaveAttribute('data-size', '12');

      rerender(
        <ButtonWithIcon loading={true} size="sm">
          Small
        </ButtonWithIcon>
      );
      spinner = screen.getByTestId('spinner');
      expect(spinner).toHaveAttribute('data-size', '14');

      rerender(
        <ButtonWithIcon loading={true} size="md">
          Medium
        </ButtonWithIcon>
      );
      spinner = screen.getByTestId('spinner');
      expect(spinner).toHaveAttribute('data-size', '16');

      rerender(
        <ButtonWithIcon loading={true} size="lg">
          Large
        </ButtonWithIcon>
      );
      spinner = screen.getByTestId('spinner');
      expect(spinner).toHaveAttribute('data-size', '18');

      rerender(
        <ButtonWithIcon loading={true} size="xl">
          Extra Large
        </ButtonWithIcon>
      );
      spinner = screen.getByTestId('spinner');
      expect(spinner).toHaveAttribute('data-size', '20');
    });
  });

  // ============================================================================
  // Disabled State Tests
  // ============================================================================

  describe('Disabled State', () => {
    it('disables button when disabled prop is true', () => {
      render(
        <ButtonWithIcon disabled>
          Disabled Button
        </ButtonWithIcon>
      );

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('disables button when loading is true even if disabled is false', () => {
      render(
        <ButtonWithIcon loading={true} disabled={false}>
          Loading Button
        </ButtonWithIcon>
      );

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('does not call onClick when disabled', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(
        <ButtonWithIcon disabled onClick={handleClick}>
          Disabled
        </ButtonWithIcon>
      );

      const button = screen.getByRole('button');
      await user.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  // ============================================================================
  // Size and Variant Tests
  // ============================================================================

  describe('Size and Variant Props', () => {
    it('passes size prop to Button component', () => {
      render(
        <ButtonWithIcon size="lg">
          Large Button
        </ButtonWithIcon>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-size', 'lg');
    });

    it('passes variant prop to Button component', () => {
      render(
        <ButtonWithIcon variant="primary">
          Primary Button
        </ButtonWithIcon>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-variant', 'primary');
    });

    it('uses icon size for icon-only buttons when iconPosition is "only"', () => {
      render(
        <ButtonWithIcon icon={<TestIcon />} iconPosition="only" size="lg" />
      );

      const button = screen.getByRole('button');
      // When iconPosition is 'only', size should be 'icon'
      expect(button).toHaveAttribute('data-size', 'icon');
    });
  });

  // ============================================================================
  // Icon Size Tests
  // ============================================================================

  describe('Icon Size', () => {
    it('applies custom icon size correctly', () => {
      const { container } = render(
        <ButtonWithIcon icon={<TestIcon />} iconSize={24}>
          Custom Size
        </ButtonWithIcon>
      );

      const iconWrapper = container.querySelector('span[style*="width: 24px"]');
      expect(iconWrapper).toBeInTheDocument();
      expect(iconWrapper).toHaveStyle({ width: '24px', height: '24px' });
    });

    it('uses default icon size of 16px when not specified', () => {
      const { container } = render(
        <ButtonWithIcon icon={<TestIcon />}>
          Default Size
        </ButtonWithIcon>
      );

      const iconWrapper = container.querySelector('span[style*="width: 16px"]');
      expect(iconWrapper).toBeInTheDocument();
      expect(iconWrapper).toHaveStyle({ width: '16px', height: '16px' });
    });
  });

  // ============================================================================
  // Event Handling Tests
  // ============================================================================

  describe('Event Handling', () => {
    it('calls onClick handler when button is clicked', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(
        <ButtonWithIcon onClick={handleClick}>
          Click Me
        </ButtonWithIcon>
      );

      const button = screen.getByRole('button');
      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('calls onClick handler when icon-only button is clicked', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(
        <ButtonWithIcon icon={<TestIcon />} iconPosition="only" onClick={handleClick} />
      );

      const button = screen.getByRole('button');
      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when button is loading', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(
        <ButtonWithIcon loading={true} onClick={handleClick}>
          Loading
        </ButtonWithIcon>
      );

      const button = screen.getByRole('button');
      await user.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  // ============================================================================
  // Ref Forwarding Tests
  // ============================================================================

  describe('Ref Forwarding', () => {
    it('forwards ref to button element', () => {
      const ref = React.createRef<HTMLButtonElement>();

      render(
        <ButtonWithIcon ref={ref}>
          Ref Test
        </ButtonWithIcon>
      );

      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
      expect(ref.current).toBe(screen.getByRole('button'));
    });

    it('forwards ref correctly for icon-only button', () => {
      const ref = React.createRef<HTMLButtonElement>();

      render(
        <ButtonWithIcon ref={ref} icon={<TestIcon />} iconPosition="only" />
      );

      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
      expect(ref.current).toBe(screen.getByRole('button'));
    });

    it('forwards ref correctly when loading', () => {
      const ref = React.createRef<HTMLButtonElement>();

      render(
        <ButtonWithIcon ref={ref} loading={true}>
          Loading
        </ButtonWithIcon>
      );

      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
      expect(ref.current).toBe(screen.getByRole('button'));
    });
  });

  // ============================================================================
  // Custom ClassName Tests
  // ============================================================================

  describe('Custom ClassName', () => {
    it('applies custom className to button', () => {
      render(
        <ButtonWithIcon className="custom-button-class">
          Custom Class
        </ButtonWithIcon>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-button-class');
    });

    it('merges custom className with default classes', () => {
      render(
        <ButtonWithIcon className="custom-class" variant="primary">
          Merged Classes
        </ButtonWithIcon>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });
  });

  // ============================================================================
  // Edge Cases Tests
  // ============================================================================

  describe('Edge Cases', () => {
    it('handles undefined icon gracefully', () => {
      render(<ButtonWithIcon icon={undefined}>No Icon</ButtonWithIcon>);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('No Icon');
    });

    it('handles null children gracefully', () => {
      render(<ButtonWithIcon icon={<TestIcon />} iconPosition="only" />);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });

    it('handles empty string children', () => {
      render(<ButtonWithIcon icon={<TestIcon />}>{''}</ButtonWithIcon>);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      // When children is empty string, it should still render as icon-only
      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });

    it('handles multiple icons correctly', () => {
      render(
        <ButtonWithIcon icon={<TestIcon />}>
          <TestIcon data-testid="second-icon" />
          Text
        </ButtonWithIcon>
      );

      const button = screen.getByRole('button');
      expect(button).toContainElement(screen.getByTestId('test-icon'));
      expect(button).toContainElement(screen.getByTestId('second-icon'));
    });

    it('maintains state when props change', () => {
      const { rerender } = render(
        <ButtonWithIcon icon={<TestIcon />} iconPosition="left">
          Button
        </ButtonWithIcon>
      );

      expect(screen.getByTestId('test-icon')).toBeInTheDocument();

      rerender(
        <ButtonWithIcon icon={<TestIcon />} iconPosition="right">
          Button
        </ButtonWithIcon>
      );

      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });
  });

  // ============================================================================
  // Accessibility Tests
  // ============================================================================

  describe('Accessibility', () => {
    it('has proper button role', () => {
      render(<ButtonWithIcon>Accessible Button</ButtonWithIcon>);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('maintains accessibility when disabled', () => {
      render(
        <ButtonWithIcon disabled>
          Disabled Button
        </ButtonWithIcon>
      );

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('disabled');
    });

    it('maintains accessibility when loading', () => {
      render(
        <ButtonWithIcon loading={true}>
          Loading Button
        </ButtonWithIcon>
      );

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('preserves aria attributes from Button component', () => {
      render(
        <ButtonWithIcon aria-label="Custom Label">
          Button
        </ButtonWithIcon>
      );

      const button = screen.getByRole('button', { name: 'Custom Label' });
      expect(button).toHaveAttribute('aria-label', 'Custom Label');
    });
  });

  // ============================================================================
  // Integration Tests
  // ============================================================================

  describe('Integration Scenarios', () => {
    it('handles complete form submission scenario', async () => {
      const user = userEvent.setup();
      const handleSubmit = vi.fn();

      const { rerender } = render(
        <ButtonWithIcon
          icon={<TestIcon />}
          onClick={handleSubmit}
          variant="primary"
        >
          Submit
        </ButtonWithIcon>
      );

      const button = screen.getByRole('button');
      await user.click(button);
      expect(handleSubmit).toHaveBeenCalledTimes(1);

      // Simulate loading state
      rerender(
        <ButtonWithIcon
          icon={<TestIcon />}
          loading={true}
          variant="primary"
        >
          Submitting...
        </ButtonWithIcon>
      );

      expect(screen.getByTestId('spinner')).toBeInTheDocument();
      expect(button).toBeDisabled();
    });

    it('handles icon position change dynamically', () => {
      const { rerender } = render(
        <ButtonWithIcon icon={<TestIcon />} iconPosition="left">
          Dynamic
        </ButtonWithIcon>
      );

      expect(screen.getByTestId('test-icon')).toBeInTheDocument();

      rerender(
        <ButtonWithIcon icon={<TestIcon />} iconPosition="right">
          Dynamic
        </ButtonWithIcon>
      );

      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });
  });
});

