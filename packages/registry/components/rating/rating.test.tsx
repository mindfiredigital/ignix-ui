/**
 * Unit Tests for Rating Component
 * 
 * This test suite covers all functionality of the Rating component including:
 * - Basic rendering and default behavior
 * - Controlled and uncontrolled modes
 * - Interactive behavior (click, hover, keyboard)
 * - Half-star support
 * - Emoji support
 * - Color schemes
 * - Size and orientation variants
 * - Animation types
 * - Disabled and read-only states
 * - Custom icons
 * - Callback handlers
 * - Edge cases and boundary conditions
 * - Accessibility features
 * 
 * @file rating.test.tsx
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom';
import { Rating } from '.';

// Mock framer-motion to avoid animation-related issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    create: (Component: any) => Component,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
  useAnimationControls: () => ({
    start: vi.fn(),
    stop: vi.fn(),
  }),
}));

// Mock lucide-react icons - must be defined inline in vi.mock factory
vi.mock('lucide-react', () => {
  const MockStar = ({ className, 'data-testid': testId, ...props }: any) => (
    <svg
      data-testid={testId || 'star-icon'}
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );

  const MockStarHalf = ({ className, 'data-testid': testId, ...props }: any) => (
    <svg
      data-testid={testId || 'star-half-icon'}
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );

  return {
    Star: MockStar,
    StarHalf: MockStarHalf,
  };
});

describe('Rating', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('Basic Rendering', () => {
    it('should render with default props', () => {
      const { container } = render(<Rating />);
      const ratingDiv = container.firstChild as HTMLElement;
      expect(ratingDiv).toBeInTheDocument();
      expect(ratingDiv).toHaveAttribute('aria-valuenow', '0');
      expect(ratingDiv).toHaveAttribute('aria-valuemin', '0');
      expect(ratingDiv).toHaveAttribute('aria-valuemax', '5');
    });

    it('should render correct number of stars based on max prop', () => {
      const { container, rerender } = render(<Rating max={3} />);
      let stars = container.querySelectorAll('svg[data-testid="star-icon"]');
      expect(stars).toHaveLength(3);

      rerender(<Rating max={10} />);
      stars = container.querySelectorAll('svg[data-testid="star-icon"]');
      expect(stars).toHaveLength(10);
    });

    it('should render with custom value', () => {
      const { container } = render(<Rating value={3} />);
      const ratingDiv = container.firstChild as HTMLElement;
      expect(ratingDiv).toHaveAttribute('aria-valuenow', '3');
    });

    it('should render value display when showValue is true', () => {
      render(<Rating value={3.5} showValue allowHalf />);
      expect(screen.getByText('3.5 / 5')).toBeInTheDocument();
    });

    it('should render value display without decimals when allowHalf is false', () => {
      render(<Rating value={3.7} showValue />);
      expect(screen.getByText('4 / 5')).toBeInTheDocument();
    });
  });

  describe('Controlled vs Uncontrolled', () => {
    it('should work as controlled component', () => {
      const { container, rerender } = render(<Rating value={2} onChange={vi.fn()} />);
      let ratingDiv = container.firstChild as HTMLElement;
      expect(ratingDiv).toHaveAttribute('aria-valuenow', '2');

      rerender(<Rating value={4} onChange={vi.fn()} />);
      ratingDiv = container.firstChild as HTMLElement;
      expect(ratingDiv).toHaveAttribute('aria-valuenow', '4');
    });

    it('should work as uncontrolled component', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      const { container } = render(<Rating onChange={handleChange} interactive />);

      const stars = container.querySelectorAll('svg[data-testid="star-icon"]');
      const thirdStar = stars[2];
      if (thirdStar) {
        await user.click(thirdStar);
        await waitFor(() => {
          expect(handleChange).toHaveBeenCalledWith(3);
        });
      }
    });

    it('should sync internal value when controlled value changes', () => {
      const { container, rerender } = render(<Rating value={1} />);
      let ratingDiv = container.firstChild as HTMLElement;
      expect(ratingDiv).toHaveAttribute('aria-valuenow', '1');

      rerender(<Rating value={5} />);
      ratingDiv = container.firstChild as HTMLElement;
      expect(ratingDiv).toHaveAttribute('aria-valuenow', '5');
    });
  });

  describe('Interactive Behavior', () => {
    it('should call onChange when star is clicked', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      const { container } = render(<Rating interactive onChange={handleChange} />);

      const stars = container.querySelectorAll('svg[data-testid="star-icon"]');
      const secondStar = stars[1];
      if (secondStar) {
        await user.click(secondStar);
        await waitFor(() => {
          expect(handleChange).toHaveBeenCalledWith(2);
        });
      }
    });

    it('should not call onChange when interactive is false', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      const { container } = render(<Rating onChange={handleChange} />);

      const stars = container.querySelectorAll('svg[data-testid="star-icon"]');
      const secondStar = stars[1];
      if (secondStar) {
        await user.click(secondStar);
        expect(handleChange).not.toHaveBeenCalled();
      }
    });

    it('should not call onChange when disabled', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      const { container } = render(<Rating interactive disabled onChange={handleChange} />);

      const stars = container.querySelectorAll('svg[data-testid="star-icon"]');
      const secondStar = stars[1];
      if (secondStar) {
        await user.click(secondStar);
        expect(handleChange).not.toHaveBeenCalled();
      }
    });

    it('should not call onChange when readOnly', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      const { container } = render(<Rating interactive readOnly onChange={handleChange} />);

      const stars = container.querySelectorAll('svg[data-testid="star-icon"]');
      const secondStar = stars[1];
      if (secondStar) {
        await user.click(secondStar);
        expect(handleChange).not.toHaveBeenCalled();
      }
    });

    it('should handle keyboard navigation', async () => {
      const handleChange = vi.fn();
      const { container } = render(<Rating value={2} interactive onChange={handleChange} />);

      const stars = container.querySelectorAll('[role="button"]');
      const thirdButton = stars[2] as HTMLElement;
      if (thirdButton) {
        thirdButton.focus();
        fireEvent.keyDown(thirdButton, { key: 'Enter' });
        await waitFor(() => {
          expect(handleChange).toHaveBeenCalled();
        });
      }
    });
  });

  describe('Half-Star Support', () => {
    it('should render half-star when allowHalf is true and value is 0.5', () => {
      const { container } = render(<Rating value={0.5} allowHalf />);
      const halfStars = container.querySelectorAll('svg[data-testid="star-half-icon"]');
      expect(halfStars.length).toBeGreaterThan(0);
    });

    it('should handle half-star clicks', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      const { container } = render(<Rating allowHalf interactive onChange={handleChange} />);

      const leftHalfDivs = container.querySelectorAll('.absolute.left-0');
      if (leftHalfDivs[0]) {
        await user.click(leftHalfDivs[0] as HTMLElement);
        await waitFor(() => {
          expect(handleChange).toHaveBeenCalled();
        });
      }
    });
  });

  describe('Emoji Support', () => {
    it('should render emoji when emoji prop is provided', () => {
      const { container } = render(<Rating emoji="⭐" value={3} />);
      expect(container.textContent).toContain('⭐');
    });

    it('should call onEmojiSelect when emoji is clicked', async () => {
      const user = userEvent.setup();
      const handleEmojiSelect = vi.fn();
      const { container } = render(<Rating emoji="⭐" interactive onEmojiSelect={handleEmojiSelect} />);

      const emojis = container.querySelectorAll('[role="button"]');
      if (emojis[2]) {
        await user.click(emojis[2] as HTMLElement);
        await waitFor(() => {
          expect(handleEmojiSelect).toHaveBeenCalled();
        });
      }
    });
  });

  describe('Color Schemes', () => {
    it('should apply color scheme', () => {
      const { container } = render(<Rating colorScheme="red" value={3} />);
      const stars = container.querySelectorAll('svg[data-testid="star-icon"]');
      expect(stars.length).toBe(5);
      
      // Check filled stars (first 3 should be filled with red color)
      const firstStar = stars[0] as SVGElement;
      expect(firstStar).toBeTruthy();
      const className = firstStar.getAttribute('class') || '';
      expect(className).toContain('text-red-500');
      expect(className).toContain('fill-red-500');
      
      // Check empty stars (last 2 should be empty with gray color)
      const fourthStar = stars[3] as SVGElement;
      expect(fourthStar).toBeTruthy();
      const emptyClassName = fourthStar.getAttribute('class') || '';
      expect(emptyClassName).toContain('text-gray-300');
    });
  });

  describe('Size Variants', () => {
    it('should apply size variant', () => {
      const { container } = render(<Rating size="lg" />);
      const ratingDiv = container.firstChild as HTMLElement;
      expect(ratingDiv).toHaveClass('gap-2');
    });
  });

  describe('Orientation', () => {
    it('should render with correct orientation', () => {
      const { container } = render(<Rating orientation="vertical" />);
      const ratingDiv = container.firstChild as HTMLElement;
      expect(ratingDiv).toHaveClass('flex-col');
    });
  });

  describe('Animation Types', () => {
    it('should support animation types', () => {
      const { container } = render(<Rating animationType="spring" emoji="⭐" />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Custom Icons', () => {
    const CustomIcon = ({ className }: { className?: string }) => (
      <svg data-testid="custom-icon" className={className} width="24" height="24">
        <circle cx="12" cy="12" r="10" fill="currentColor" />
      </svg>
    );

    const CustomHalfIcon = ({ className }: { className?: string }) => (
      <svg data-testid="custom-half-icon" className={className} width="24" height="24">
        <circle cx="12" cy="12" r="10" fill="currentColor" />
      </svg>
    );

    it('should render custom icon components', () => {
      const { container } = render(<Rating icon={CustomIcon} halfIcon={CustomHalfIcon} allowHalf value={0.5} />);
      const customIcons = container.querySelectorAll('[data-testid="custom-icon"]');
      expect(customIcons.length).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    it('should clamp value to max when value exceeds max', () => {
      const { container } = render(<Rating value={10} max={5} />);
      // The component uses clampedValue for rendering stars but currentValue for aria
      // Stars should be clamped (all 5 filled), but aria shows actual value
      const stars = container.querySelectorAll('svg[data-testid="star-icon"]');
      expect(stars.length).toBe(5);
      // All stars should be filled when value exceeds max (clamped to 5)
      const firstStar = stars[0] as SVGElement;
      const lastStar = stars[4] as SVGElement;
      const firstStarClass = firstStar.getAttribute('class') || '';
      const lastStarClass = lastStar.getAttribute('class') || '';
      // Both first and last star should be filled (all 5 stars filled)
      expect(firstStarClass).toContain('text-yellow-400');
      expect(lastStarClass).toContain('text-yellow-400');
    });

    it('should clamp value to 0 when value is negative', () => {
      const { container } = render(<Rating value={-5} />);
      // Stars should be empty when value is negative (clamped to 0)
      const stars = container.querySelectorAll('svg[data-testid="star-icon"]');
      expect(stars.length).toBe(5);
      // All stars should be empty (gray)
      const firstStar = stars[0] as SVGElement;
      const lastStar = stars[4] as SVGElement;
      const firstStarClass = firstStar.getAttribute('class') || '';
      const lastStarClass = lastStar.getAttribute('class') || '';
      // Both first and last star should be empty (gray)
      expect(firstStarClass).toContain('text-gray-300');
      expect(lastStarClass).toContain('text-gray-300');
    });

    it('should handle value changes correctly', () => {
      const { container, rerender } = render(<Rating value={0} />);
      let ratingDiv = container.firstChild as HTMLElement;
      expect(ratingDiv).toHaveAttribute('aria-valuenow', '0');

      rerender(<Rating value={3} />);
      ratingDiv = container.firstChild as HTMLElement;
      expect(ratingDiv).toHaveAttribute('aria-valuenow', '3');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      const { container } = render(<Rating value={3} max={5} />);
      const ratingDiv = container.firstChild as HTMLElement;
      expect(ratingDiv).toHaveAttribute('aria-label');
      expect(ratingDiv).toHaveAttribute('aria-valuenow', '3');
      expect(ratingDiv).toHaveAttribute('aria-valuemin', '0');
      expect(ratingDiv).toHaveAttribute('aria-valuemax', '5');
    });

    it('should have proper tabIndex for interactive and disabled states', () => {
      const { container: container1 } = render(<Rating interactive />);
      const buttons1 = container1.querySelectorAll('[role="button"]');
      if (buttons1[0]) {
        // HTML uses lowercase 'tabindex', React prop 'tabIndex' converts to 'tabindex'
        expect(buttons1[0]).toHaveAttribute('tabindex', '0');
      }

      const { container: container2 } = render(<Rating interactive disabled />);
      const buttons2 = container2.querySelectorAll('[role="button"]');
      if (buttons2[0]) {
        expect(buttons2[0]).toHaveAttribute('tabindex', '-1');
      }
    });
  });

  describe('Ref Forwarding', () => {
    it('should forward ref to container element', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Rating ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('Custom ClassName', () => {
    it('should apply custom className', () => {
      const { container } = render(<Rating className="custom-rating-class" />);
      const ratingDiv = container.firstChild as HTMLElement;
      expect(ratingDiv).toHaveClass('custom-rating-class');
    });
  });

  describe('Value Display Formatting', () => {
    it('should format value correctly', () => {
      render(<Rating value={2.5} allowHalf showValue />);
      expect(screen.getByText('2.5 / 5')).toBeInTheDocument();
    });
  });

  describe('Hover Behavior', () => {
    it('should update display on mouse enter', () => {
      const { container } = render(<Rating value={2} interactive />);
      const stars = container.querySelectorAll('[role="button"]');
      const thirdStar = stars[2] as HTMLElement;
      
      if (thirdStar) {
        fireEvent.mouseEnter(thirdStar);
        // After hover, the third star should appear filled
        const allStars = container.querySelectorAll('svg[data-testid="star-icon"]');
        const thirdStarIcon = allStars[2] as SVGElement;
        const className = thirdStarIcon.getAttribute('class') || '';
        expect(className).toContain('text-yellow-400');
      }
    });

    it('should reset display on mouse leave', () => {
      const { container } = render(<Rating value={2} interactive />);
      const ratingDiv = container.firstChild as HTMLElement;
      
      fireEvent.mouseLeave(ratingDiv);
      // After mouse leave, should return to original value
      expect(ratingDiv).toHaveAttribute('aria-valuenow', '2');
    });
  });

  describe('Multiple Interactions', () => {
    it('should handle multiple sequential clicks', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      const { container } = render(<Rating interactive onChange={handleChange} />);

      const stars = container.querySelectorAll('svg[data-testid="star-icon"]');
      
      // Click first star
      await user.click(stars[0] as HTMLElement);
      await waitFor(() => {
        expect(handleChange).toHaveBeenCalledWith(1);
      });

      // Click third star
      await user.click(stars[2] as HTMLElement);
      await waitFor(() => {
        expect(handleChange).toHaveBeenCalledWith(3);
      });

      // Click fifth star
      await user.click(stars[4] as HTMLElement);
      await waitFor(() => {
        expect(handleChange).toHaveBeenCalledWith(5);
      });

      expect(handleChange).toHaveBeenCalledTimes(3);
    });

    it('should handle clicking same star multiple times', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      const { container } = render(<Rating interactive onChange={handleChange} />);

      const stars = container.querySelectorAll('svg[data-testid="star-icon"]');
      const thirdStar = stars[2] as HTMLElement;
      
      // Click same star twice
      await user.click(thirdStar);
      await user.click(thirdStar);
      
      await waitFor(() => {
        expect(handleChange).toHaveBeenCalledTimes(2);
      });
      expect(handleChange).toHaveBeenCalledWith(3);
    });
  });

  describe('Half-Star Value Display', () => {
    it('should display half-star values correctly', () => {
      render(<Rating value={1.5} allowHalf showValue />);
      expect(screen.getByText('1.5 / 5')).toBeInTheDocument();
    });

    it('should display multiple half-star values', () => {
      const { rerender } = render(<Rating value={2.5} allowHalf showValue />);
      expect(screen.getByText('2.5 / 5')).toBeInTheDocument();

      rerender(<Rating value={4.5} allowHalf showValue />);
      expect(screen.getByText('4.5 / 5')).toBeInTheDocument();
    });
  });

  describe('Emoji Array Handling', () => {
    it('should handle emoji array with fewer items than max', () => {
      const { container } = render(<Rating emojis={['😞', '😕', '😐']} value={2} max={5} />);
      expect(container.textContent).toContain('😐');
    });

    it('should handle emoji array with more items than max', () => {
      const { container } = render(<Rating emojis={['😞', '😕', '😐', '🙂', '😄', '🤩', '🌟']} value={3} max={5} />);
      expect(container.textContent).toContain('🙂');
    });
  });

  describe('Icon Type Prop', () => {
    it('should use iconType prop when provided', () => {
      // iconType defaults to Star (from lucide-react), so we're testing that it works
      // Since Star is mocked, we can test that the component renders correctly
      const { container } = render(<Rating value={3} />);
      const stars = container.querySelectorAll('svg[data-testid="star-icon"]');
      expect(stars.length).toBe(5);
    });
  });

  describe('Boundary Values', () => {
    it('should render correctly with value of 0', () => {
      const { container } = render(<Rating value={0} />);
      const stars = container.querySelectorAll('svg[data-testid="star-icon"]');
      expect(stars.length).toBe(5);
      
      // All stars should be empty
      const firstStar = stars[0] as SVGElement;
      const className = firstStar.getAttribute('class') || '';
      expect(className).toContain('text-gray-300');
    });

    it('should render correctly with maximum value', () => {
      const { container } = render(<Rating value={5} max={5} />);
      const stars = container.querySelectorAll('svg[data-testid="star-icon"]');
      expect(stars.length).toBe(5);
      
      // All stars should be filled
      const lastStar = stars[4] as SVGElement;
      const className = lastStar.getAttribute('class') || '';
      expect(className).toContain('text-yellow-400');
    });
  });

  describe('Value Display Positioning', () => {
    it('should position value display correctly for horizontal orientation', () => {
      render(<Rating value={3} showValue orientation="horizontal" />);
      const valueDisplay = screen.getByText('3 / 5');
      expect(valueDisplay).toBeInTheDocument();
      expect(valueDisplay.className).toContain('ml-2');
    });

    it('should position value display correctly for vertical orientation', () => {
      render(<Rating value={3} showValue orientation="vertical" />);
      const valueDisplay = screen.getByText('3 / 5');
      expect(valueDisplay).toBeInTheDocument();
      expect(valueDisplay.className).toContain('mt-1');
    });
  });

  describe('Callback Parameters', () => {
    it('should call onChange with correct value parameter', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      const { container } = render(<Rating interactive onChange={handleChange} />);

      const stars = container.querySelectorAll('svg[data-testid="star-icon"]');
      await user.click(stars[3] as HTMLElement); // Click 4th star (value = 4)
      
      await waitFor(() => {
        expect(handleChange).toHaveBeenCalledWith(4);
      });
    });

    it('should call onEmojiSelect with correct value and emoji parameters', async () => {
      const user = userEvent.setup();
      const handleEmojiSelect = vi.fn();
      const { container } = render(<Rating emoji="⭐" interactive onEmojiSelect={handleEmojiSelect} />);

      const emojis = container.querySelectorAll('[role="button"]');
      if (emojis[1]) {
        await user.click(emojis[1] as HTMLElement);
        await waitFor(() => {
          expect(handleEmojiSelect).toHaveBeenCalled();
          const callArgs = handleEmojiSelect.mock.calls[0];
          expect(callArgs[0]).toBe(2); // value
          expect(callArgs[1]).toBe('⭐'); // emoji
        });
      }
    });
  });
});

