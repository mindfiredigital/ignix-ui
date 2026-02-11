/**
 * Unit Tests for ProgressIndicator Component
 *
 * This test suite covers all functionality of the ProgressIndicator component including:
 * - Basic rendering (linear and circular)
 * - Determinate and indeterminate states
 * - Animation variants
 * - Label positions (linear and circular)
 * - Percentage display and formatting
 * - Accessibility features
 * - Edge cases and boundary conditions
 * - Performance optimizations
 *
 * @file progress-indicator.test.tsx
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom';
import {
  ProgressIndicator,
  type ProgressAnimationVariant,
  type LinearLabelPosition,
  type CircularLabelPosition,
} from './index';

// Mock framer-motion to avoid animation-related issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
    svg: ({ children, ...props }: React.SVGProps<SVGSVGElement>) => (
      <svg {...props}>{children}</svg>
    ),
    circle: ({ ...props }: React.SVGProps<SVGCircleElement>) => <circle {...props} />,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('ProgressIndicator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('Basic Rendering', () => {
    it('should render linear progress with default props', () => {
      const { container } = render(<ProgressIndicator />);
      const progressbar = container.querySelector('[role="progressbar"]');
      expect(progressbar).toBeInTheDocument();
      expect(progressbar).toHaveAttribute('aria-valuenow', '0');
      expect(progressbar).toHaveAttribute('aria-valuemin', '0');
      expect(progressbar).toHaveAttribute('aria-valuemax', '100');
    });

    it('should render circular progress when type is circular', () => {
      const { container } = render(<ProgressIndicator type="circular" />);
      const progressbar = container.querySelector('[role="progressbar"]');
      expect(progressbar).toBeInTheDocument();
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('should render with custom value', () => {
      const { container } = render(<ProgressIndicator value={42} />);
      const progressbar = container.querySelector('[role="progressbar"]');
      expect(progressbar).toHaveAttribute('aria-valuenow', '42');
    });

    it('should apply custom className', () => {
      const { container } = render(<ProgressIndicator className="custom-class" />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('custom-class');
    });
  });

  describe('Linear Progress', () => {
    it('should render linear progress bar with correct height', () => {
      const { container } = render(<ProgressIndicator type="linear" linearHeight={12} />);
      const track = container.querySelector('[role="progressbar"]') as HTMLElement;
      expect(track).toHaveStyle({ height: '12px' });
    });

    it('should render fill with correct width percentage', () => {
      const { container } = render(<ProgressIndicator type="linear" value={75} />);
      const fill = container.querySelector('.h-full.rounded-full');
      expect(fill).toBeInTheDocument();
    });

    it('should apply trackClassName to track', () => {
      const { container } = render(
        <ProgressIndicator type="linear" trackClassName="bg-red-500" />
      );
      const track = container.querySelector('[role="progressbar"]');
      expect(track).toHaveClass('bg-red-500');
    });

    it('should apply fillClassName to fill', () => {
      const { container } = render(
        <ProgressIndicator type="linear" value={50} fillClassName="bg-blue-500" />
      );
      const fill = container.querySelector('.h-full.rounded-full');
      expect(fill).toHaveClass('bg-blue-500');
    });
  });

  describe('Circular Progress', () => {
    it('should render circular progress with correct size', () => {
      const { container } = render(<ProgressIndicator type="circular" size={80} />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '80');
      expect(svg).toHaveAttribute('height', '80');
    });

    it('should render track and fill circles', () => {
      const { container } = render(<ProgressIndicator type="circular" value={50} />);
      const circles = container.querySelectorAll('circle');
      expect(circles.length).toBeGreaterThanOrEqual(2);
    });

    it('should apply trackClassName to track circle', () => {
      const { container } = render(
        <ProgressIndicator type="circular" trackClassName="text-gray-400" />
      );
      const trackCircle = container.querySelectorAll('circle')[0];
      expect(trackCircle).toHaveClass('text-gray-400');
    });

    it('should apply fillClassName to fill circle', () => {
      const { container } = render(
        <ProgressIndicator type="circular" value={50} fillClassName="text-blue-500" />
      );
      const fillCircle = container.querySelectorAll('circle')[1];
      expect(fillCircle).toHaveClass('text-blue-500');
    });
  });

  describe('Determinate State', () => {
    it('should render determinate progress with value', () => {
      const { container } = render(<ProgressIndicator value={64} />);
      const progressbar = container.querySelector('[role="progressbar"]');
      expect(progressbar).toHaveAttribute('aria-valuenow', '64');
    });

    it('should clamp value to 0-100 range', () => {
      const { container: container1 } = render(<ProgressIndicator value={150} />);
      const progressbar1 = container1.querySelector('[role="progressbar"]');
      expect(progressbar1).toHaveAttribute('aria-valuenow', '100');

      const { container: container2 } = render(<ProgressIndicator value={-10} />);
      const progressbar2 = container2.querySelector('[role="progressbar"]');
      expect(progressbar2).toHaveAttribute('aria-valuenow', '0');
    });

    it('should update progress when value changes', () => {
      const { container, rerender } = render(<ProgressIndicator value={25} />);
      let progressbar = container.querySelector('[role="progressbar"]');
      expect(progressbar).toHaveAttribute('aria-valuenow', '25');

      rerender(<ProgressIndicator value={75} />);
      progressbar = container.querySelector('[role="progressbar"]');
      expect(progressbar).toHaveAttribute('aria-valuenow', '75');
    });
  });

  describe('Indeterminate State', () => {
    it('should render indeterminate linear progress', () => {
      const { container } = render(<ProgressIndicator type="linear" indeterminate />);
      const progressbar = container.querySelector('[role="progressbar"]');
      expect(progressbar).not.toHaveAttribute('aria-valuenow');
      expect(progressbar).not.toHaveAttribute('aria-valuemin');
      expect(progressbar).not.toHaveAttribute('aria-valuemax');
    });

    it('should render indeterminate circular progress', () => {
      const { container } = render(<ProgressIndicator type="circular" indeterminate />);
      const progressbar = container.querySelector('[role="progressbar"]');
      expect(progressbar).not.toHaveAttribute('aria-valuenow');
    });

    it('should not show percentage label when indeterminate', () => {
      render(<ProgressIndicator indeterminate showPercentage />);
      expect(screen.queryByText(/\d+%/)).not.toBeInTheDocument();
    });
  });

  describe('Percentage Display', () => {
    it('should show percentage label when showPercentage is true', () => {
      render(<ProgressIndicator value={42} showPercentage />);
      expect(screen.getByText('42%')).toBeInTheDocument();
    });

    it('should not show percentage label when showPercentage is false', () => {
      render(<ProgressIndicator value={42} showPercentage={false} />);
      expect(screen.queryByText('42%')).not.toBeInTheDocument();
    });

    it('should use default formatter for percentage', () => {
      render(<ProgressIndicator value={33.7} showPercentage />);
      expect(screen.getByText('34%')).toBeInTheDocument();
    });

    it('should use custom formatPercentage formatter', () => {
      const formatter = (value: number) => `Done ${Math.round(value)}%`;
      render(<ProgressIndicator value={50} showPercentage formatPercentage={formatter} />);
      expect(screen.getByText('Done 50%')).toBeInTheDocument();
    });

    it('should update percentage when value changes', () => {
      const { rerender } = render(<ProgressIndicator value={25} showPercentage />);
      expect(screen.getByText('25%')).toBeInTheDocument();

      rerender(<ProgressIndicator value={75} showPercentage />);
      expect(screen.getByText('75%')).toBeInTheDocument();
    });
  });

  describe('Linear Label Positions', () => {
    const linearPositions: LinearLabelPosition[] = [
      'top',
      'bottom',
      'inside-left',
      'inside-right',
      'inside-center',
      'outside-left',
      'outside-right',
    ];

    linearPositions.forEach((position) => {
      it(`should render label at ${position} position`, () => {
        render(
          <ProgressIndicator
            type="linear"
            value={50}
            showPercentage
            labelPosition={position}
          />
        );
        expect(screen.getByText('50%')).toBeInTheDocument();
      });
    });

    it('should default to bottom position for linear', () => {
      render(<ProgressIndicator type="linear" value={50} showPercentage />);
      const label = screen.getByText('50%');
      expect(label).toBeInTheDocument();
      expect(label.closest('.mt-2')).toBeInTheDocument();
    });
  });

  describe('Circular Label Positions', () => {
    const circularPositions: CircularLabelPosition[] = [
      'inside-center',
      'outside-top',
      'outside-bottom',
      'outside-left',
      'outside-right',
    ];

    circularPositions.forEach((position) => {
      it(`should render label at ${position} position`, () => {
        render(
          <ProgressIndicator
            type="circular"
            value={50}
            showPercentage
            labelPosition={position}
          />
        );
        expect(screen.getByText('50%')).toBeInTheDocument();
      });
    });

    it('should default to inside-center position for circular', () => {
      render(<ProgressIndicator type="circular" value={50} showPercentage />);
      const label = screen.getByText('50%');
      expect(label).toBeInTheDocument();
    });
  });

  describe('Animation Variants', () => {
    const variants: ProgressAnimationVariant[] = ['none', 'smooth', 'snappy', 'spring', 'bounce'];

    variants.forEach((variant) => {
      it(`should render with ${variant} animation variant`, () => {
        const { container } = render(
          <ProgressIndicator type="linear" value={50} animationVariant={variant} />
        );
        const progressbar = container.querySelector('[role="progressbar"]');
        expect(progressbar).toBeInTheDocument();
      });
    });

    it('should default to smooth animation variant', () => {
      const { container } = render(<ProgressIndicator type="linear" value={50} />);
      const progressbar = container.querySelector('[role="progressbar"]');
      expect(progressbar).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes for determinate progress', () => {
      const { container } = render(<ProgressIndicator value={42} />);
      const progressbar = container.querySelector('[role="progressbar"]');
      expect(progressbar).toHaveAttribute('role', 'progressbar');
      expect(progressbar).toHaveAttribute('aria-valuenow', '42');
      expect(progressbar).toHaveAttribute('aria-valuemin', '0');
      expect(progressbar).toHaveAttribute('aria-valuemax', '100');
    });

    it('should have proper ARIA attributes for indeterminate progress', () => {
      const { container } = render(<ProgressIndicator indeterminate />);
      const progressbar = container.querySelector('[role="progressbar"]');
      expect(progressbar).toHaveAttribute('role', 'progressbar');
      expect(progressbar).not.toHaveAttribute('aria-valuenow');
      expect(progressbar).not.toHaveAttribute('aria-valuemin');
      expect(progressbar).not.toHaveAttribute('aria-valuemax');
    });

    it('should use custom ariaLabel when provided', () => {
      const { container } = render(<ProgressIndicator value={50} ariaLabel="Custom label" />);
      const progressbar = container.querySelector('[role="progressbar"]');
      expect(progressbar).toHaveAttribute('aria-label', 'Custom label');
    });

    it('should use default ariaLabel for determinate progress', () => {
      const { container } = render(<ProgressIndicator value={50} />);
      const progressbar = container.querySelector('[role="progressbar"]');
      expect(progressbar).toHaveAttribute('aria-label', 'Progress');
    });

    it('should use default ariaLabel for indeterminate progress', () => {
      const { container } = render(<ProgressIndicator indeterminate />);
      const progressbar = container.querySelector('[role="progressbar"]');
      expect(progressbar).toHaveAttribute('aria-label', 'Loading');
    });
  });

  describe('Edge Cases', () => {
    it('should handle value of 0', () => {
      const { container } = render(<ProgressIndicator value={0} />);
      const progressbar = container.querySelector('[role="progressbar"]');
      expect(progressbar).toHaveAttribute('aria-valuenow', '0');
    });

    it('should handle value of 100', () => {
      const { container } = render(<ProgressIndicator value={100} />);
      const progressbar = container.querySelector('[role="progressbar"]');
      expect(progressbar).toHaveAttribute('aria-valuenow', '100');
    });

    it('should handle decimal values', () => {
      const { container } = render(<ProgressIndicator value={42.7} />);
      const progressbar = container.querySelector('[role="progressbar"]');
      expect(progressbar).toHaveAttribute('aria-valuenow', '42.7');
    });

    it('should handle very small circular size', () => {
      const { container } = render(<ProgressIndicator type="circular" size={32} />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '32');
    });

    it('should handle large circular size', () => {
      const { container } = render(<ProgressIndicator type="circular" size={200} />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '200');
    });

    it('should handle thin stroke width', () => {
      const { container } = render(<ProgressIndicator type="circular" strokeWidth={2} />);
      const circles = container.querySelectorAll('circle');
      expect(circles.length).toBeGreaterThan(0);
    });

    it('should handle thick stroke width', () => {
      const { container } = render(<ProgressIndicator type="circular" strokeWidth={16} />);
      const circles = container.querySelectorAll('circle');
      expect(circles.length).toBeGreaterThan(0);
    });
  });

  describe('Type Switching', () => {
    it('should switch from linear to circular', () => {
      const { container, rerender } = render(<ProgressIndicator type="linear" value={50} />);
      let progressbar = container.querySelector('[role="progressbar"]');
      expect(progressbar).toBeInTheDocument();
      expect(container.querySelector('svg')).not.toBeInTheDocument();

      rerender(<ProgressIndicator type="circular" value={50} />);
      progressbar = container.querySelector('[role="progressbar"]');
      expect(progressbar).toBeInTheDocument();
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('should switch from circular to linear', () => {
      const { container, rerender } = render(<ProgressIndicator type="circular" value={50} />);
      expect(container.querySelector('svg')).toBeInTheDocument();

      rerender(<ProgressIndicator type="linear" value={50} />);
      expect(container.querySelector('svg')).not.toBeInTheDocument();
    });
  });

  describe('Custom Styling', () => {
    it('should apply custom trackClassName', () => {
      const { container } = render(
        <ProgressIndicator type="linear" trackClassName="custom-track" />
      );
      const track = container.querySelector('[role="progressbar"]');
      expect(track).toHaveClass('custom-track');
    });

    it('should apply custom fillClassName', () => {
      const { container } = render(
        <ProgressIndicator type="linear" value={50} fillClassName="custom-fill" />
      );
      const fill = container.querySelector('.h-full.rounded-full');
      expect(fill).toHaveClass('custom-fill');
    });

    it('should apply default gradient fillClassName for linear', () => {
      const { container } = render(<ProgressIndicator type="linear" value={50} />);
      const fill = container.querySelector('.h-full.rounded-full');
      expect(fill).toHaveClass('bg-gradient-to-r');
    });

    it('should apply default gradient fillClassName for circular', () => {
      const { container } = render(<ProgressIndicator type="circular" value={50} />);
      const fillCircle = container.querySelectorAll('circle')[1];
      expect(fillCircle).toHaveClass('bg-gradient-to-r');
    });
  });

  describe('Label Rendering Logic', () => {
    it('should not render label when showPercentage is false', () => {
      render(<ProgressIndicator value={50} showPercentage={false} />);
      expect(screen.queryByText('50%')).not.toBeInTheDocument();
    });

    it('should not render label when indeterminate even if showPercentage is true', () => {
      render(<ProgressIndicator indeterminate showPercentage />);
      expect(screen.queryByText(/\d+%/)).not.toBeInTheDocument();
    });

    it('should render label inside bar for inside positions', () => {
      render(
        <ProgressIndicator
          type="linear"
          value={50}
          showPercentage
          labelPosition="inside-center"
        />
      );
      const label = screen.getByText('50%');
      expect(label).toHaveClass('text-white', 'drop-shadow-sm');
    });
  });

  describe('React.memo Optimization', () => {
    it('should not rerender when props remain the same', () => {
      const renderSpy = vi.fn();
      const TestWrapper = ({ value }: { value: number }) => {
        renderSpy();
        return <ProgressIndicator value={value} />;
      };

      const { rerender } = render(<TestWrapper value={50} />);
      expect(renderSpy).toHaveBeenCalledTimes(1);

      rerender(<TestWrapper value={50} />);
      expect(renderSpy).toHaveBeenCalledTimes(2);
    });

    it('should rerender when value changes', () => {
      const { container, rerender } = render(<ProgressIndicator value={25} />);
      let progressbar = container.querySelector('[role="progressbar"]');
      expect(progressbar).toHaveAttribute('aria-valuenow', '25');

      rerender(<ProgressIndicator value={75} />);
      progressbar = container.querySelector('[role="progressbar"]');
      expect(progressbar).toHaveAttribute('aria-valuenow', '75');
    });
  });

  describe('Format Percentage Callback', () => {
    it('should call formatPercentage with correct value', () => {
      const formatter = vi.fn((value: number) => `${value}%`);
      render(<ProgressIndicator value={42.5} showPercentage formatPercentage={formatter} />);
      expect(formatter).toHaveBeenCalledWith(42.5);
    });

    it('should use default formatter when formatPercentage is not provided', () => {
      render(<ProgressIndicator value={33.7} showPercentage />);
      expect(screen.getByText('34%')).toBeInTheDocument();
    });

    it('should handle formatter returning empty string', () => {
      const formatter = () => '';
      const { container } = render(
        <ProgressIndicator value={50} showPercentage formatPercentage={formatter} />
      );
      // Find the label element by its class and verify it has empty text content
      const label = container.querySelector('.text-xs.font-medium.text-muted-foreground');
      expect(label).toBeInTheDocument();
      expect(label?.textContent).toBe('');
    });
  });

  describe('Combined Props', () => {
    it('should handle all props together correctly', () => {
      const formatter = (value: number) => `Progress: ${value}%`;
      const { container } = render(
        <ProgressIndicator
          type="linear"
          value={64}
          showPercentage
          labelPosition="outside-right"
          animationVariant="spring"
          ariaLabel="Custom progress"
          formatPercentage={formatter}
          trackClassName="bg-gray-200"
          fillClassName="bg-blue-500"
          className="w-full max-w-md"
          linearHeight={12}
        />
      );

      const progressbar = container.querySelector('[role="progressbar"]');
      expect(progressbar).toHaveAttribute('aria-label', 'Custom progress');
      expect(progressbar).toHaveAttribute('aria-valuenow', '64');
      expect(screen.getByText('Progress: 64%')).toBeInTheDocument();
    });

    it('should handle circular with all props', () => {
      const { container } = render(
        <ProgressIndicator
          type="circular"
          value={72}
          showPercentage
          labelPosition="outside-top"
          animationVariant="bounce"
          ariaLabel="Circular progress"
          size={100}
          strokeWidth={10}
          trackClassName="text-gray-300"
          fillClassName="text-blue-500"
        />
      );

      const progressbar = container.querySelector('[role="progressbar"]');
      expect(progressbar).toHaveAttribute('aria-label', 'Circular progress');
      expect(progressbar).toHaveAttribute('aria-valuenow', '72');
      expect(screen.getByText('72%')).toBeInTheDocument();
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '100');
    });
  });

  describe('Boundary Values', () => {
    it('should handle value exactly at 0', () => {
      const { container } = render(<ProgressIndicator value={0} showPercentage />);
      const progressbar = container.querySelector('[role="progressbar"]');
      expect(progressbar).toHaveAttribute('aria-valuenow', '0');
      expect(screen.getByText('0%')).toBeInTheDocument();
    });

    it('should handle value exactly at 100', () => {
      const { container } = render(<ProgressIndicator value={100} showPercentage />);
      const progressbar = container.querySelector('[role="progressbar"]');
      expect(progressbar).toHaveAttribute('aria-valuenow', '100');
      expect(screen.getByText('100%')).toBeInTheDocument();
    });

    it('should clamp values above 100', () => {
      const { container } = render(<ProgressIndicator value={150} showPercentage />);
      const progressbar = container.querySelector('[role="progressbar"]');
      expect(progressbar).toHaveAttribute('aria-valuenow', '100');
      expect(screen.getByText('100%')).toBeInTheDocument();
    });

    it('should clamp values below 0', () => {
      const { container } = render(<ProgressIndicator value={-50} showPercentage />);
      const progressbar = container.querySelector('[role="progressbar"]');
      expect(progressbar).toHaveAttribute('aria-valuenow', '0');
      expect(screen.getByText('0%')).toBeInTheDocument();
    });
  });

  describe('Default Values', () => {
    it('should use default type linear', () => {
      const { container } = render(<ProgressIndicator />);
      expect(container.querySelector('svg')).not.toBeInTheDocument();
    });

    it('should use default value 0', () => {
      const { container } = render(<ProgressIndicator />);
      const progressbar = container.querySelector('[role="progressbar"]');
      expect(progressbar).toHaveAttribute('aria-valuenow', '0');
    });

    it('should use default animationVariant smooth', () => {
      const { container } = render(<ProgressIndicator value={50} />);
      const progressbar = container.querySelector('[role="progressbar"]');
      expect(progressbar).toBeInTheDocument();
    });

    it('should use default linearHeight 8', () => {
      const { container } = render(<ProgressIndicator type="linear" />);
      const track = container.querySelector('[role="progressbar"]') as HTMLElement;
      expect(track).toHaveStyle({ height: '8px' });
    });

    it('should use default size 64 for circular', () => {
      const { container } = render(<ProgressIndicator type="circular" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '64');
    });

    it('should use default strokeWidth 6 for circular', () => {
      const { container } = render(<ProgressIndicator type="circular" value={50} />);
      const circles = container.querySelectorAll('circle');
      expect(circles.length).toBeGreaterThan(0);
    });
  });
});
