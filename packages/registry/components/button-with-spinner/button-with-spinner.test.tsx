/**
 * @fileoverview Unit tests for ButtonWithSpinner component
 * 
 * Comprehensive test suite covering all functionality including loading states,
 * spinner variants, button variants, sizes, and accessibility.
 * 
 * @module ButtonWithSpinner.test
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { ButtonWithSpinner } from './index';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => React.createElement('div', props, children),
    span: ({ children, ...props }: any) => React.createElement('span', props, children),
    button: ({ children, ...props }: any) => React.createElement('button', props, children),
  },
}));

// Mock Button component
vi.mock('../button', () => ({
  Button: React.forwardRef<HTMLButtonElement, any>(
    ({ children, disabled, className, variant, onClick, ...props }, ref) => {
      return React.createElement(
        'button',
        {
          ref,
          disabled,
          className,
          'data-variant': variant,
          onClick,
          ...props,
        },
        children
      );
    }
  ),
  buttonVariants: vi.fn(),
}));

// Mock Spinner component
vi.mock('../spinner', () => ({
  Spinner: ({ size, variant, color, className }: any) => {
    return React.createElement('div', {
      'data-testid': 'spinner',
      'data-size': size,
      'data-variant': variant,
      'data-color': color,
      className,
    });
  },
}));

describe('ButtonWithSpinner', () => {
  const defaultProps = {
    children: 'Click Me',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders button with children text when not loading', () => {
      render(<ButtonWithSpinner {...defaultProps} />);

      expect(screen.getByText('Click Me')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('renders button with custom className', () => {
      render(<ButtonWithSpinner {...defaultProps} className="custom-class" />);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(<ButtonWithSpinner {...defaultProps} ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
      expect(ref.current?.textContent).toBe('Click Me');
    });

    it('has correct displayName', () => {
      expect(ButtonWithSpinner.displayName).toBe('ButtonWithSpinner');
    });
  });

  describe('Loading State', () => {
    it('shows spinner when isLoading is true', () => {
      render(<ButtonWithSpinner {...defaultProps} isLoading={true} />);

      expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });

    it('hides spinner when isLoading is false', () => {
      render(<ButtonWithSpinner {...defaultProps} isLoading={false} />);

      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    });

    it('displays loading text when isLoading is true', () => {
      render(
        <ButtonWithSpinner {...defaultProps} isLoading={true} loadingText="Saving..." />
      );

      expect(screen.getByText('Saving...')).toBeInTheDocument();
      expect(screen.queryByText('Click Me')).not.toBeInTheDocument();
    });

    it('displays default loading text when isLoading is true and loadingText is not provided', () => {
      render(<ButtonWithSpinner {...defaultProps} isLoading={true} />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('disables button when isLoading is true', () => {
      render(<ButtonWithSpinner {...defaultProps} isLoading={true} />);

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('enables button when isLoading is false', () => {
      render(<ButtonWithSpinner {...defaultProps} isLoading={false} />);

      const button = screen.getByRole('button');
      expect(button).not.toBeDisabled();
    });

    it('prevents onClick when button is disabled during loading', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();

      render(
        <ButtonWithSpinner {...defaultProps} isLoading={true} onClick={onClick} />
      );

      const button = screen.getByRole('button');
      await user.click(button);

      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('Spinner Variants', () => {
    it('renders default spinner variant', () => {
      render(
        <ButtonWithSpinner {...defaultProps} isLoading={true} spinnerVariant="default" />
      );

      const spinner = screen.getByTestId('spinner');
      expect(spinner).toHaveAttribute('data-variant', 'default');
    });

    it('renders bars spinner variant', () => {
      render(
        <ButtonWithSpinner {...defaultProps} isLoading={true} spinnerVariant="bars" />
      );

      const spinner = screen.getByTestId('spinner');
      expect(spinner).toHaveAttribute('data-variant', 'bars');
    });

    it('renders dots-bounce spinner variant', () => {
      render(
        <ButtonWithSpinner {...defaultProps} isLoading={true} spinnerVariant="dots-bounce" />
      );

      const spinner = screen.getByTestId('spinner');
      expect(spinner).toHaveAttribute('data-variant', 'dots-bounce');
    });

    it('uses default spinner variant when not specified', () => {
      render(<ButtonWithSpinner {...defaultProps} isLoading={true} />);

      const spinner = screen.getByTestId('spinner');
      expect(spinner).toHaveAttribute('data-variant', 'default');
    });
  });

  describe('Spinner Size', () => {
    it('renders spinner with custom size', () => {
      render(
        <ButtonWithSpinner {...defaultProps} isLoading={true} spinnerSize={20} />
      );

      const spinner = screen.getByTestId('spinner');
      expect(spinner).toHaveAttribute('data-size', '20');
    });

    it('uses default spinner size when not specified', () => {
      render(<ButtonWithSpinner {...defaultProps} isLoading={true} />);

      const spinner = screen.getByTestId('spinner');
      expect(spinner).toHaveAttribute('data-size', '16');
    });
  });

  describe('Spinner Color', () => {
    it('uses custom spinner color when provided', () => {
      render(
        <ButtonWithSpinner
          {...defaultProps}
          isLoading={true}
          spinnerColor="bg-blue-500"
        />
      );

      const spinner = screen.getByTestId('spinner');
      expect(spinner).toHaveAttribute('data-color', 'bg-blue-500');
    });

    it('automatically determines spinner color for dark button variants', () => {
      const { rerender } = render(
        <ButtonWithSpinner {...defaultProps} isLoading={true} variant="default" />
      );

      let spinner = screen.getByTestId('spinner');
      expect(spinner).toHaveAttribute('data-color', 'border-white');

      rerender(
        <ButtonWithSpinner
          {...defaultProps}
          isLoading={true}
          variant="default"
          spinnerVariant="bars"
        />
      );
      spinner = screen.getByTestId('spinner');
      expect(spinner).toHaveAttribute('data-color', 'bg-white');
    });

    it('automatically determines spinner color for light button variants', () => {
      const { rerender } = render(
        <ButtonWithSpinner {...defaultProps} isLoading={true} variant="outline" />
      );

      let spinner = screen.getByTestId('spinner');
      expect(spinner).toHaveAttribute('data-color', 'border-primary');

      rerender(
        <ButtonWithSpinner
          {...defaultProps}
          isLoading={true}
          variant="outline"
          spinnerVariant="bars"
        />
      );
      spinner = screen.getByTestId('spinner');
      expect(spinner).toHaveAttribute('data-color', 'bg-primary');
    });

    it('uses default spinner color when variant is not specified', () => {
      render(<ButtonWithSpinner {...defaultProps} isLoading={true} />);

      const spinner = screen.getByTestId('spinner');
      expect(spinner).toHaveAttribute('data-color', 'border-white');
    });
  });

  describe('Button Variants', () => {
    const variants = [
      'default',
      'primary',
      'secondary',
      'success',
      'warning',
      'danger',
      'outline',
      'ghost',
      'subtle',
      'elevated',
      'glass',
      'neon',
      'pill',
    ];

    variants.forEach((variant) => {
      it(`renders with ${variant} variant`, () => {
        render(<ButtonWithSpinner {...defaultProps} variant={variant as any} />);

        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('data-variant', variant);
      });
    });
  });

  describe('Button Sizes', () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'];

    sizes.forEach((size) => {
      it(`renders with ${size} size`, () => {
        render(<ButtonWithSpinner {...defaultProps} size={size as any} />);

        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
      });
    });
  });

  describe('Event Handlers', () => {
    it('calls onClick when button is clicked and not loading', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();

      render(<ButtonWithSpinner {...defaultProps} onClick={onClick} />);

      const button = screen.getByRole('button');
      await user.click(button);

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when button is loading', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();

      render(
        <ButtonWithSpinner {...defaultProps} isLoading={true} onClick={onClick} />
      );

      const button = screen.getByRole('button');
      await user.click(button);

      expect(onClick).not.toHaveBeenCalled();
    });

    it('handles onClick with event object', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn((e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
      });

      render(<ButtonWithSpinner {...defaultProps} onClick={onClick} />);

      const button = screen.getByRole('button');
      await user.click(button);

      expect(onClick).toHaveBeenCalledTimes(1);
      // React passes SyntheticEvent, not native Event
      const event = onClick.mock.calls[0][0] as React.MouseEvent<HTMLButtonElement>;
      expect(event).toBeDefined();
      expect(typeof event.preventDefault).toBe('function');
    });
  });

  describe('Accessibility', () => {
    it('has proper button role', () => {
      render(<ButtonWithSpinner {...defaultProps} />);

      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('has disabled attribute when loading', () => {
      render(<ButtonWithSpinner {...defaultProps} isLoading={true} />);

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('disabled');
    });

    it('does not have disabled attribute when not loading', () => {
      render(<ButtonWithSpinner {...defaultProps} isLoading={false} />);

      const button = screen.getByRole('button');
      expect(button).not.toBeDisabled();
      expect(button).not.toHaveAttribute('disabled');
    });

    it('maintains accessible text content', () => {
      render(<ButtonWithSpinner {...defaultProps} isLoading={true} loadingText="Saving..." />);

      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('Saving...');
    });
  });

  describe('Props Forwarding', () => {
    it('forwards additional button props', () => {
      render(
        <ButtonWithSpinner
          {...defaultProps}
          type="submit"
          name="submit-button"
          aria-label="Submit form"
        />
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
      expect(button).toHaveAttribute('name', 'submit-button');
      expect(button).toHaveAttribute('aria-label', 'Submit form');
    });

    it('does not forward disabled prop (it is controlled by isLoading)', () => {
      // Note: disabled prop is omitted from ButtonWithSpinnerProps, so we can't pass it
      // The button should be disabled when isLoading is true
      render(<ButtonWithSpinner {...defaultProps} isLoading={true} />);

      const button = screen.getByRole('button');
      // Should be disabled because isLoading is true
      expect(button).toBeDisabled();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty children gracefully', () => {
      render(<ButtonWithSpinner isLoading={false}>{''}</ButtonWithSpinner>);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button.textContent).toBe('');
    });

    it('handles React node children', () => {
      render(
        <ButtonWithSpinner>
          <span data-testid="custom-child">Custom Content</span>
        </ButtonWithSpinner>
      );

      expect(screen.getByTestId('custom-child')).toBeInTheDocument();
      expect(screen.getByText('Custom Content')).toBeInTheDocument();
    });

    it('handles rapid loading state changes', () => {
      const { rerender } = render(<ButtonWithSpinner {...defaultProps} isLoading={false} />);

      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();

      rerender(<ButtonWithSpinner {...defaultProps} isLoading={true} />);
      expect(screen.getByTestId('spinner')).toBeInTheDocument();

      rerender(<ButtonWithSpinner {...defaultProps} isLoading={false} />);
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    });

    it('handles undefined loadingText gracefully', () => {
      render(<ButtonWithSpinner {...defaultProps} isLoading={true} loadingText={undefined} />);

      // Should use default 'Loading...'
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('handles empty loadingText', () => {
      render(<ButtonWithSpinner {...defaultProps} isLoading={true} loadingText="" />);

      const button = screen.getByRole('button');
      expect(button.textContent).toBe('');
    });
  });

  describe('Integration', () => {
    it('works correctly with all props combined', () => {
      const onClick = vi.fn();

      render(
        <ButtonWithSpinner
          variant="success"
          size="lg"
          isLoading={true}
          loadingText="Processing..."
          spinnerVariant="bars"
          spinnerSize={20}
          spinnerColor="bg-white"
          onClick={onClick}
          className="custom-class"
        >
          Submit
        </ButtonWithSpinner>
      );

      const button = screen.getByRole('button');
      const spinner = screen.getByTestId('spinner');

      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('custom-class');
      expect(button).toHaveAttribute('data-variant', 'success');
      expect(button).toBeDisabled();
      expect(button).toHaveTextContent('Processing...');

      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveAttribute('data-variant', 'bars');
      expect(spinner).toHaveAttribute('data-size', '20');
      expect(spinner).toHaveAttribute('data-color', 'bg-white');
    });

    it('transitions correctly from loading to not loading', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();

      const { rerender } = render(
        <ButtonWithSpinner {...defaultProps} isLoading={true} onClick={onClick} />
      );

      expect(screen.getByTestId('spinner')).toBeInTheDocument();
      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeDisabled();

      rerender(<ButtonWithSpinner {...defaultProps} isLoading={false} onClick={onClick} />);

      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
      expect(screen.getByText('Click Me')).toBeInTheDocument();
      expect(screen.getByRole('button')).not.toBeDisabled();

      const button = screen.getByRole('button');
      await user.click(button);

      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });
});

