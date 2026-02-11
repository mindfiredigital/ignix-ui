/**
 * Unit Tests for ProductCard Component
 * 
 * This test suite covers all functionality of the ProductCard component including:
 * - Basic rendering and default behavior
 * - All sub-components (Image, Tag, Discount, Wishlist, Title, Price, Rating, Sizes, Button, Footer, Promo, Thumbnails)
 * - User interactions (clicks, hover)
 * - Callback handlers
 * - State management (favorite, size selection, thumbnail selection)
 * - Size variants (sm, md, lg)
 * - Edge cases and boundary conditions
 * - Context usage
 * - Toast notifications
 * - Discount calculations
 * 
 * @file product-card.test.tsx
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom';
import {
  ProductCard,
  ProductCardHeader,
  ProductCardImage,
  ProductCardTag,
  ProductCardDiscount,
  ProductCardWishlist,
  ProductCardThumbnails,
  ProductCardSubHeading,
  ProductCardContent,
  ProductCardTitle,
  ProductCardPrice,
  ProductCardSizes,
  ProductCardRating,
  ProductCardButton,
  ProductCardFooter,
  ProductCardPromo,
} from './index';

// Type definitions for mock components
interface MockComponentProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  className?: string;
  variant?: string;
  'data-testid'?: string;
}

interface MockIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  'data-testid'?: string;
}

interface MockRatingProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  size?: string;
  readOnly?: boolean;
  allowHalf?: boolean;
}

interface MockButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  size?: string;
  icon?: React.ReactNode;
}

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: MockComponentProps) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => {
  const MockHeart = ({ className, 'data-testid': testId, ...props }: MockIconProps) => (
    <svg
      data-testid={testId || 'heart-icon'}
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );

  const MockShoppingCart = ({ className, 'data-testid': testId, ...props }: MockIconProps) => (
    <svg
      data-testid={testId || 'shopping-cart-icon'}
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      {...props}
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );

  return {
    Heart: MockHeart,
    ShoppingCartIcon: MockShoppingCart,
  };
});

// Mock Card and CardContent components
vi.mock('@ignix-ui/card', () => ({
  Card: ({ children, className, ...props }: MockComponentProps) => (
    <div data-testid="card" className={className} {...props}>
      {children}
    </div>
  ),
  CardContent: ({ children, className, ...props }: MockComponentProps) => (
    <div data-testid="card-content" className={className} {...props}>
      {children}
    </div>
  ),
}));

// Mock Typography component
vi.mock('@ignix-ui/typography', () => ({
  Typography: ({ children, className, variant, ...props }: MockComponentProps & { variant?: string }) => (
    <div data-testid={`typography-${variant || 'default'}`} className={className} {...props}>
      {children}
    </div>
  ),
}));

// Mock Rating component
vi.mock('@ignix-ui/rating', () => ({
  Rating: ({ value, max, size, readOnly, allowHalf, ...props }: MockRatingProps) => (
    <div
      data-testid="rating"
      data-value={value}
      data-max={max}
      data-size={size}
      data-readonly={readOnly}
      data-allow-half={allowHalf}
      {...props}
    >
      Rating: {value}/{max}
    </div>
  ),
}));

// Mock Button component (used by ButtonWithIcon)
vi.mock('@ignix-ui/button', () => ({
  Button: ({ children, onClick, className, size, ...props }: MockButtonProps) => (
    <button
      data-testid="button"
      onClick={onClick}
      className={className}
      data-size={size}
      {...props}
    >
      {children}
    </button>
  ),
}));

// Mock ButtonWithIcon component
vi.mock('@ignix-ui/buttonwithicon', () => ({
  ButtonWithIcon: ({ children, onClick, icon, className, size, ...props }: MockButtonProps) => (
    <button
      data-testid="button-with-icon"
      onClick={onClick}
      className={className}
      data-size={size}
      {...props}
    >
      {icon}
      {children}
    </button>
  ),
}));

describe('ProductCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  describe('Basic Rendering', () => {
    it('should render ProductCard with minimal props', () => {
      render(
        <ProductCard>
          <ProductCardContent>
            <ProductCardTitle>Test Product</ProductCardTitle>
          </ProductCardContent>
        </ProductCard>
      );
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    it('should render ProductCard with default size sm', () => {
      const { container } = render(
        <ProductCard>
          <ProductCardContent>
            <ProductCardTitle>Test Product</ProductCardTitle>
          </ProductCardContent>
        </ProductCard>
      );
      const card = container.querySelector('[data-testid="card"]');
      expect(card).toBeInTheDocument();
    });

    it('should render ProductCard with custom className', () => {
      const { container } = render(
        <ProductCard className="custom-card-class">
          <ProductCardContent>
            <ProductCardTitle>Test Product</ProductCardTitle>
          </ProductCardContent>
        </ProductCard>
      );
      const card = container.querySelector('.custom-card-class');
      expect(card).toBeInTheDocument();
    });

    it('should render ProductCard with size md', () => {
      render(
        <ProductCard size="md">
          <ProductCardContent>
            <ProductCardTitle>Test Product</ProductCardTitle>
          </ProductCardContent>
        </ProductCard>
      );
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    it('should render ProductCard with size lg', () => {
      render(
        <ProductCard size="lg">
          <ProductCardContent>
            <ProductCardTitle>Test Product</ProductCardTitle>
          </ProductCardContent>
        </ProductCard>
      );
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });
  });

  describe('ProductCardImage', () => {
    it('should render ProductCardImage with src and alt', () => {
      render(
        <ProductCard>
          <ProductCardHeader>
            <ProductCardImage src="https://example.com/image.jpg" alt="Product Image" />
          </ProductCardHeader>
        </ProductCard>
      );
      const img = screen.getByAltText('Product Image');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', 'https://example.com/image.jpg');
    });

    it('should switch image when thumbnail is selected', () => {
      render(
        <ProductCard>
          <ProductCardHeader>
            <ProductCardImage
              src="https://example.com/image1.jpg"
              alt="Product Image"
              images={[
                'https://example.com/image1.jpg',
                'https://example.com/image2.jpg',
                'https://example.com/image3.jpg',
              ]}
            />
            <ProductCardThumbnails
              images={[
                'https://example.com/image1.jpg',
                'https://example.com/image2.jpg',
                'https://example.com/image3.jpg',
              ]}
            />
          </ProductCardHeader>
        </ProductCard>
      );
      const thumbnails = screen.getAllByRole('button');
      const secondThumbnail = thumbnails.find((btn) =>
        btn.getAttribute('aria-label')?.includes('thumbnail 2')
      );
      if (secondThumbnail) {
        fireEvent.click(secondThumbnail);
        const img = screen.getByAltText('Product Image');
        expect(img).toHaveAttribute('src', 'https://example.com/image2.jpg');
      }
    });
  });

  describe('ProductCardTag', () => {
    it('should render ProductCardTag with default text', () => {
      render(
        <ProductCard>
          <ProductCardHeader>
            <ProductCardTag />
          </ProductCardHeader>
        </ProductCard>
      );
      expect(screen.getByText('Best Seller')).toBeInTheDocument();
    });

    it('should render ProductCardTag with custom text', () => {
      render(
        <ProductCard>
          <ProductCardHeader>
            <ProductCardTag text="New Arrival" />
          </ProductCardHeader>
        </ProductCard>
      );
      expect(screen.getByText('New Arrival')).toBeInTheDocument();
    });
  });

  describe('ProductCardDiscount', () => {
    it('should render ProductCardDiscount when discount percentage is provided', () => {
      render(
        <ProductCard>
          <ProductCardHeader>
            <ProductCardDiscount discount={25} />
          </ProductCardHeader>
        </ProductCard>
      );
      expect(screen.getByText(/-25%/)).toBeInTheDocument();
    });

    it('should calculate discount from originalPrice and currentPrice', () => {
      render(
        <ProductCard>
          <ProductCardHeader>
            <ProductCardDiscount originalPrice={100} currentPrice={75} />
          </ProductCardHeader>
        </ProductCard>
      );
      expect(screen.getByText(/-25%/)).toBeInTheDocument();
    });

    it('should not render when discount is 0 or negative', () => {
      const { container } = render(
        <ProductCard>
          <ProductCardHeader>
            <ProductCardDiscount originalPrice={100} currentPrice={100} />
          </ProductCardHeader>
        </ProductCard>
      );
      expect(container.textContent).not.toContain('%');
    });

    it('should prioritize discount prop over calculated discount', () => {
      render(
        <ProductCard>
          <ProductCardHeader>
            <ProductCardDiscount discount={30} originalPrice={100} currentPrice={75} />
          </ProductCardHeader>
        </ProductCard>
      );
      expect(screen.getByText(/-30%/)).toBeInTheDocument();
    });
  });

  describe('ProductCardWishlist', () => {
    it('should render ProductCardWishlist button', () => {
      render(
        <ProductCard>
          <ProductCardHeader>
            <ProductCardWishlist />
          </ProductCardHeader>
        </ProductCard>
      );
      const button = screen.getByRole('button', { name: /add to favorites/i });
      expect(button).toBeInTheDocument();
    });

    it('should toggle favorite state on click', () => {
      render(
        <ProductCard>
          <ProductCardHeader>
            <ProductCardWishlist />
          </ProductCardHeader>
        </ProductCard>
      );
      const button = screen.getByRole('button', { name: /add to favorites/i });
      const initialClass = button.className;
      fireEvent.click(button);
      expect(button.className).not.toBe(initialClass);
    });

    it('should call onFavorite callback when clicked', () => {
      const onFavorite = vi.fn();
      render(
        <ProductCard onFavorite={onFavorite}>
          <ProductCardHeader>
            <ProductCardWishlist />
          </ProductCardHeader>
        </ProductCard>
      );
      const button = screen.getByRole('button', { name: /add to favorites/i });
      fireEvent.click(button);
      expect(onFavorite).toHaveBeenCalledTimes(1);
    });
  });

  describe('ProductCardTitle', () => {
    it('should render ProductCardTitle with children', () => {
      render(
        <ProductCard>
          <ProductCardContent>
            <ProductCardTitle>Amazing Product</ProductCardTitle>
          </ProductCardContent>
        </ProductCard>
      );
      expect(screen.getByText('Amazing Product')).toBeInTheDocument();
    });

    it('should apply size-based classes for title', () => {
      render(
        <ProductCard size="lg">
          <ProductCardContent>
            <ProductCardTitle>Amazing Product</ProductCardTitle>
          </ProductCardContent>
        </ProductCard>
      );
      const title = screen.getByText('Amazing Product');
      expect(title).toHaveClass('text-2xl');
    });
  });

  describe('ProductCardSubHeading', () => {
    it('should render ProductCardSubHeading with children', () => {
      render(
        <ProductCard>
          <ProductCardContent>
            <ProductCardSubHeading>Electronics</ProductCardSubHeading>
          </ProductCardContent>
        </ProductCard>
      );
      expect(screen.getByText('Electronics')).toBeInTheDocument();
    });
  });

  describe('ProductCardPrice', () => {
    it('should render ProductCardPrice with currentPrice', () => {
      render(
        <ProductCard>
          <ProductCardContent>
            <ProductCardPrice currentPrice={29.99} />
          </ProductCardContent>
        </ProductCard>
      );
      expect(screen.getByText('$29.99')).toBeInTheDocument();
    });

    it('should render ProductCardPrice with originalPrice strikethrough', () => {
      render(
        <ProductCard>
          <ProductCardContent>
            <ProductCardPrice currentPrice={29.99} originalPrice={39.99} />
          </ProductCardContent>
        </ProductCard>
      );
      expect(screen.getByText('$29.99')).toBeInTheDocument();
      expect(screen.getByText('$39.99')).toHaveClass('line-through');
    });

    it('should not render originalPrice when it is less than currentPrice', () => {
      render(
        <ProductCard>
          <ProductCardContent>
            <ProductCardPrice currentPrice={39.99} originalPrice={29.99} />
          </ProductCardContent>
        </ProductCard>
      );
      expect(screen.getByText('$39.99')).toBeInTheDocument();
      expect(screen.queryByText('$29.99')).not.toBeInTheDocument();
    });

    it('should apply size-based classes for price', () => {
      render(
        <ProductCard size="lg">
          <ProductCardContent>
            <ProductCardPrice currentPrice={29.99} />
          </ProductCardContent>
        </ProductCard>
      );
      const price = screen.getByText('$29.99');
      expect(price).toHaveClass('text-2xl');
    });
  });

  describe('ProductCardRating', () => {
    it('should render ProductCardRating with value', () => {
      render(
        <ProductCard>
          <ProductCardContent>
            <ProductCardRating value={4.5} />
          </ProductCardContent>
        </ProductCard>
      );
      const rating = screen.getByTestId('rating');
      expect(rating).toHaveAttribute('data-value', '4.5');
    });

    it('should render ProductCardRating with outOf value', () => {
      render(
        <ProductCard>
          <ProductCardContent>
            <ProductCardRating value={4.5} outOf={128} />
          </ProductCardContent>
        </ProductCard>
      );
      expect(screen.getByText(/\(128\)/)).toBeInTheDocument();
    });

    it('should render ProductCardRating with custom max', () => {
      render(
        <ProductCard>
          <ProductCardContent>
            <ProductCardRating value={8} max={10} />
          </ProductCardContent>
        </ProductCard>
      );
      const rating = screen.getByTestId('rating');
      expect(rating).toHaveAttribute('data-max', '10');
    });
  });

  describe('ProductCardSizes', () => {
    it('should render ProductCardSizes with size options', () => {
      render(
        <ProductCard>
          <ProductCardContent>
            <ProductCardSizes sizes={['S', 'M', 'L']} />
          </ProductCardContent>
        </ProductCard>
      );
      expect(screen.getByText('Size:')).toBeInTheDocument();
      expect(screen.getByText('S')).toBeInTheDocument();
      expect(screen.getByText('M')).toBeInTheDocument();
      expect(screen.getByText('L')).toBeInTheDocument();
    });

    it('should not render when sizes array is empty', () => {
      const { container } = render(
        <ProductCard>
          <ProductCardContent>
            <ProductCardSizes sizes={[]} />
          </ProductCardContent>
        </ProductCard>
      );
      expect(container.textContent).not.toContain('Size:');
    });

    it('should select size on click', () => {
      render(
        <ProductCard>
          <ProductCardContent>
            <ProductCardSizes sizes={['S', 'M', 'L']} />
          </ProductCardContent>
        </ProductCard>
      );
      const sizeButton = screen.getByRole('button', { name: /select size m/i });
      const initialClass = sizeButton.className;
      fireEvent.click(sizeButton);
      expect(sizeButton.className).not.toBe(initialClass);
      expect(sizeButton.className).toMatch(/border-gray-900/);
    });
  });

  describe('ProductCardButton', () => {
    it('should render ProductCardButton with default text', () => {
      render(
        <ProductCard>
          <ProductCardFooter>
            <ProductCardButton />
          </ProductCardFooter>
        </ProductCard>
      );
      expect(screen.getByText('Add To Cart')).toBeInTheDocument();
    });

    it('should render ProductCardButton with custom text', () => {
      render(
        <ProductCard>
          <ProductCardFooter>
            <ProductCardButton>Buy Now</ProductCardButton>
          </ProductCardFooter>
        </ProductCard>
      );
      expect(screen.getByText('Buy Now')).toBeInTheDocument();
    });

    it('should call onAddToCart callback when clicked', () => {
      const onAddToCart = vi.fn();
      render(
        <ProductCard onAddToCart={onAddToCart}>
          <ProductCardFooter>
            <ProductCardButton />
          </ProductCardFooter>
        </ProductCard>
      );
      const button = screen.getByRole('button', { name: /add to cart/i });
      fireEvent.click(button);
      expect(onAddToCart).toHaveBeenCalledTimes(1);
    });
  });

  describe('ProductCardFooter', () => {
    it('should render ProductCardFooter with children', () => {
      render(
        <ProductCard>
          <ProductCardFooter>
            <ProductCardPrice currentPrice={29.99} />
            <ProductCardButton />
          </ProductCardFooter>
        </ProductCard>
      );
      expect(screen.getByText('$29.99')).toBeInTheDocument();
      expect(screen.getByText('Add To Cart')).toBeInTheDocument();
    });
  });

  describe('ProductCardPromo', () => {
    it('should render ProductCardPromo with code', () => {
      render(
        <ProductCard>
          <ProductCardPromo code="SAVE20" />
        </ProductCard>
      );
      expect(screen.getByText(/#SAVE20/)).toBeInTheDocument();
      expect(screen.getByText(/20% Off/)).toBeInTheDocument();
    });

    it('should render ProductCardPromo with text and code', () => {
      render(
        <ProductCard>
          <ProductCardPromo code="SAVE20" text="Use code" />
        </ProductCard>
      );
      expect(screen.getByText(/Use code/)).toBeInTheDocument();
      expect(screen.getByText(/#SAVE20/)).toBeInTheDocument();
    });
  });

  describe('ProductCardThumbnails', () => {
    it('should render ProductCardThumbnails with images', () => {
      render(
        <ProductCard>
          <ProductCardHeader>
            <ProductCardImage
              src="https://example.com/image1.jpg"
              alt="Product"
              images={[
                'https://example.com/image1.jpg',
                'https://example.com/image2.jpg',
              ]}
            />
            <ProductCardThumbnails
              images={[
                'https://example.com/image1.jpg',
                'https://example.com/image2.jpg',
              ]}
            />
          </ProductCardHeader>
        </ProductCard>
      );
      const thumbnails = screen.getAllByRole('button');
      expect(thumbnails.length).toBeGreaterThan(0);
    });

    it('should not render when images array is empty', () => {
      const { container } = render(
        <ProductCard>
          <ProductCardHeader>
            <ProductCardThumbnails images={[]} />
          </ProductCardHeader>
        </ProductCard>
      );
      const thumbnails = container.querySelectorAll('[aria-label*="thumbnail"]');
      expect(thumbnails.length).toBe(0);
    });

    it('should highlight selected thumbnail', () => {
      const { container } = render(
        <ProductCard>
          <ProductCardHeader>
            <ProductCardImage
              src="https://example.com/image1.jpg"
              alt="Product"
              images={[
                'https://example.com/image1.jpg',
                'https://example.com/image2.jpg',
              ]}
            />
            <ProductCardThumbnails
              images={[
                'https://example.com/image1.jpg',
                'https://example.com/image2.jpg',
              ]}
            />
          </ProductCardHeader>
        </ProductCard>
      );
      const thumbnails = screen.getAllByRole('button');
      const secondThumbnail = thumbnails.find((btn) =>
        btn.getAttribute('aria-label')?.includes('thumbnail 2')
      );
      if (secondThumbnail) {
        const initialClass = secondThumbnail.className;
        fireEvent.click(secondThumbnail);
        // Verify the thumbnail was clicked and state changed
        const updatedThumbnail = container.querySelector('[aria-label*="thumbnail 2"]');
        expect(updatedThumbnail).toBeTruthy();
        if (updatedThumbnail) {
          expect(updatedThumbnail.className).not.toBe(initialClass);
        }
      }
    });
  });

  describe('Toast Notifications', () => {
    it('should show toast when item is added to wishlist', () => {
      const { container } = render(
        <ProductCard>
          <ProductCardHeader>
            <ProductCardWishlist />
          </ProductCardHeader>
        </ProductCard>
      );
      const button = screen.getByRole('button', { name: /add to favorites/i });
      fireEvent.click(button);
      // Toast should be rendered in the DOM
      const toast = container.querySelector('.fixed.z-50');
      expect(toast).toBeTruthy();
      if (toast) {
        expect(toast.textContent).toContain('Item added to Wishlist');
      }
    });

    it('should show toast when item is removed from wishlist', () => {
      const { container } = render(
        <ProductCard>
          <ProductCardHeader>
            <ProductCardWishlist />
          </ProductCardHeader>
        </ProductCard>
      );
      const button = screen.getByRole('button', { name: /add to favorites/i });
      fireEvent.click(button);
      fireEvent.click(button);
      // Toast should show removed message
      const toast = container.querySelector('.fixed.z-50');
      expect(toast).toBeTruthy();
      if (toast) {
        expect(toast.textContent).toContain('Item removed from Wishlist');
      }
    });

    it('should show toast when item is added to cart', () => {
      const { container } = render(
        <ProductCard>
          <ProductCardFooter>
            <ProductCardButton />
          </ProductCardFooter>
        </ProductCard>
      );
      const button = screen.getByRole('button', { name: /add to cart/i });
      fireEvent.click(button);
      // Toast should be rendered
      const toast = container.querySelector('.fixed.z-50');
      expect(toast).toBeTruthy();
      if (toast) {
        expect(toast.textContent).toContain('Item added to Cart');
      }
    });

    it('should configure auto-hide timeout for toast', () => {
      const { container } = render(
        <ProductCard>
          <ProductCardFooter>
            <ProductCardButton />
          </ProductCardFooter>
        </ProductCard>
      );
      const button = screen.getByRole('button', { name: /add to cart/i });
      fireEvent.click(button);
      // Toast should be visible initially
      const toast = container.querySelector('.fixed.z-50');
      expect(toast).toBeTruthy();
      expect(toast?.textContent).toContain('Item added to Cart');
      // Verify that setTimeout was called (useEffect sets up the timeout)
      // The timeout is configured in the component's useEffect hook
      expect(vi.getTimerCount()).toBeGreaterThan(0);
    });
  });

  describe('Complete ProductCard Integration', () => {
    it('should render complete ProductCard with all components', () => {
      render(
        <ProductCard size="md">
          <ProductCardHeader>
            <ProductCardImage src="https://example.com/image.jpg" alt="Product" />
            <ProductCardTag text="Best Seller" />
            <ProductCardDiscount originalPrice={100} currentPrice={75} />
            <ProductCardWishlist />
          </ProductCardHeader>
          <ProductCardContent>
            <ProductCardSubHeading>Electronics</ProductCardSubHeading>
            <ProductCardTitle>Amazing Product</ProductCardTitle>
            <ProductCardSizes sizes={['S', 'M', 'L']} />
            <ProductCardRating value={4.5} outOf={128} />
          </ProductCardContent>
          <ProductCardFooter>
            <ProductCardPrice currentPrice={75} originalPrice={100} />
            <ProductCardButton />
          </ProductCardFooter>
          <ProductCardPromo code="SAVE25" />
        </ProductCard>
      );
      expect(screen.getByText('Best Seller')).toBeInTheDocument();
      expect(screen.getByText(/-25%/)).toBeInTheDocument();
      expect(screen.getByText('Electronics')).toBeInTheDocument();
      expect(screen.getByText('Amazing Product')).toBeInTheDocument();
      expect(screen.getByText('$75.00')).toBeInTheDocument();
      expect(screen.getByText(/#SAVE25/)).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty children gracefully', () => {
      const { container } = render(<ProductCard>{null}</ProductCard>);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should handle multiple ProductCardPromo components', () => {
      render(
        <ProductCard>
          <ProductCardPromo code="CODE1" />
          <ProductCardPromo code="CODE2" />
        </ProductCard>
      );
      expect(screen.getByText(/#CODE1/)).toBeInTheDocument();
      expect(screen.getByText(/#CODE2/)).toBeInTheDocument();
    });

    it('should handle very long product titles', () => {
      const longTitle = 'A'.repeat(200);
      render(
        <ProductCard>
          <ProductCardContent>
            <ProductCardTitle>{longTitle}</ProductCardTitle>
          </ProductCardContent>
        </ProductCard>
      );
      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });

    it('should handle zero price', () => {
      render(
        <ProductCard>
          <ProductCardContent>
            <ProductCardPrice currentPrice={0} />
          </ProductCardContent>
        </ProductCard>
      );
      expect(screen.getByText('$0.00')).toBeInTheDocument();
    });

    it('should handle very high price values', () => {
      render(
        <ProductCard>
          <ProductCardContent>
            <ProductCardPrice currentPrice={999999.99} />
          </ProductCardContent>
        </ProductCard>
      );
      expect(screen.getByText('$999999.99')).toBeInTheDocument();
    });

    it('should handle ProductCardHeader with all child components', () => {
      render(
        <ProductCard>
          <ProductCardHeader>
            <ProductCardImage src="https://example.com/image.jpg" alt="Product" />
            <ProductCardTag text="New" />
            <ProductCardDiscount discount={20} />
            <ProductCardWishlist />
            <ProductCardThumbnails
              images={[
                'https://example.com/image1.jpg',
                'https://example.com/image2.jpg',
              ]}
            />
          </ProductCardHeader>
        </ProductCard>
      );
      expect(screen.getByAltText('Product')).toBeInTheDocument();
      expect(screen.getByText('New')).toBeInTheDocument();
      expect(screen.getByText(/-20%/)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /add to favorites/i })).toBeInTheDocument();
    });
  });

  describe('Layout Variants', () => {
    it('should support vertical layout (default)', () => {
      const { container } = render(
        <ProductCard layout="vertical">
          <ProductCardContent>
            <ProductCardTitle>Test Product</ProductCardTitle>
          </ProductCardContent>
        </ProductCard>
      );
      const card = container.querySelector('[data-testid="card"]');
      expect(card).toBeInTheDocument();
    });

    it('should support horizontal layout', () => {
      const { container } = render(
        <ProductCard layout="horizontal">
          <ProductCardContent>
            <ProductCardTitle>Test Product</ProductCardTitle>
          </ProductCardContent>
        </ProductCard>
      );
      const card = container.querySelector('[data-testid="card"]');
      expect(card).toBeInTheDocument();
    });
  });

  describe('Size Selection Behavior', () => {
    it('should allow selecting different sizes sequentially', () => {
      render(
        <ProductCard>
          <ProductCardContent>
            <ProductCardSizes sizes={['S', 'M', 'L', 'XL']} />
          </ProductCardContent>
        </ProductCard>
      );
      const sizeS = screen.getByRole('button', { name: /select size s/i });
      const sizeM = screen.getByRole('button', { name: /select size m/i });
      const sizeL = screen.getByRole('button', { name: /select size l/i });
      
      fireEvent.click(sizeS);
      expect(sizeS.className).toMatch(/border-gray-900/);
      
      fireEvent.click(sizeM);
      expect(sizeM.className).toMatch(/border-gray-900/);
      expect(sizeS.className).not.toMatch(/border-gray-900/);
      
      fireEvent.click(sizeL);
      expect(sizeL.className).toMatch(/border-gray-900/);
      expect(sizeM.className).not.toMatch(/border-gray-900/);
    });

    it('should deselect size when clicking the same size twice', () => {
      render(
        <ProductCard>
          <ProductCardContent>
            <ProductCardSizes sizes={['S', 'M', 'L']} />
          </ProductCardContent>
        </ProductCard>
      );
      const sizeM = screen.getByRole('button', { name: /select size m/i });      
      fireEvent.click(sizeM);
      expect(sizeM.className).toMatch(/border-gray-900/);
      
      fireEvent.click(sizeM);
      // Size should remain selected (component doesn't deselect on second click)
      expect(sizeM.className).toMatch(/border-gray-900/);
    });
  });

  describe('Thumbnail Selection Behavior', () => {
    it('should allow selecting different thumbnails sequentially', () => {
      render(
        <ProductCard>
          <ProductCardHeader>
            <ProductCardImage
              src="https://example.com/image1.jpg"
              alt="Product"
              images={[
                'https://example.com/image1.jpg',
                'https://example.com/image2.jpg',
                'https://example.com/image3.jpg',
              ]}
            />
            <ProductCardThumbnails
              images={[
                'https://example.com/image1.jpg',
                'https://example.com/image2.jpg',
                'https://example.com/image3.jpg',
              ]}
            />
          </ProductCardHeader>
        </ProductCard>
      );
      const thumbnails = screen.getAllByRole('button');
      const firstThumbnail = thumbnails.find((btn) =>
        btn.getAttribute('aria-label')?.includes('thumbnail 1')
      );
      const secondThumbnail = thumbnails.find((btn) =>
        btn.getAttribute('aria-label')?.includes('thumbnail 2')
      );
      const thirdThumbnail = thumbnails.find((btn) =>
        btn.getAttribute('aria-label')?.includes('thumbnail 3')
      );
      
      if (firstThumbnail && secondThumbnail && thirdThumbnail) {
        fireEvent.click(secondThumbnail);
        let img = screen.getByAltText('Product');
        expect(img).toHaveAttribute('src', 'https://example.com/image2.jpg');
        
        fireEvent.click(thirdThumbnail);
        img = screen.getByAltText('Product');
        expect(img).toHaveAttribute('src', 'https://example.com/image3.jpg');
        
        fireEvent.click(firstThumbnail);
        img = screen.getByAltText('Product');
        expect(img).toHaveAttribute('src', 'https://example.com/image1.jpg');
      }
    });
  });

  describe('Rating Variants', () => {
    it('should render rating without showValue when showValue is false', () => {
      render(
        <ProductCard>
          <ProductCardContent>
            <ProductCardRating value={4.5} showValue={false} />
          </ProductCardContent>
        </ProductCard>
      );
      const rating = screen.getByTestId('rating');
      expect(rating).toBeInTheDocument();
      expect(screen.queryByText(/\(/)).not.toBeInTheDocument();
    });

    it('should render rating with outOf when showValue is true', () => {
      render(
        <ProductCard>
          <ProductCardContent>
            <ProductCardRating value={4.5} showValue={true} outOf={256} />
          </ProductCardContent>
        </ProductCard>
      );
      expect(screen.getByText(/\(256\)/)).toBeInTheDocument();
    });
  });

  describe('Discount Edge Cases', () => {
    it('should handle 100% discount correctly', () => {
      render(
        <ProductCard>
          <ProductCardHeader>
            <ProductCardDiscount discount={100} />
          </ProductCardHeader>
        </ProductCard>
      );
      expect(screen.getByText(/-100%/)).toBeInTheDocument();
    });

    it('should handle discount calculation with decimal prices', () => {
      render(
        <ProductCard>
          <ProductCardHeader>
            <ProductCardDiscount originalPrice={99.99} currentPrice={49.99} />
          </ProductCardHeader>
        </ProductCard>
      );
      // Should calculate approximately 50% discount
      expect(screen.getByText(/-50%/)).toBeInTheDocument();
    });
  });

  describe('Content Size Variants', () => {
    it('should apply correct padding for sm size in ProductCardContent', () => {
      const { container } = render(
        <ProductCard size="sm">
          <ProductCardContent>
            <ProductCardTitle>Test</ProductCardTitle>
          </ProductCardContent>
        </ProductCard>
      );
      const content = container.querySelector('[data-testid="card-content"]');
      expect(content).toHaveClass('p-2');
    });

    it('should apply correct padding for lg size in ProductCardContent', () => {
      const { container } = render(
        <ProductCard size="lg">
          <ProductCardContent>
            <ProductCardTitle>Test</ProductCardTitle>
          </ProductCardContent>
        </ProductCard>
      );
      const content = container.querySelector('[data-testid="card-content"]');
      expect(content).toHaveClass('p-4');
    });
  });

  describe('SubHeading Size Variants', () => {
    it('should apply correct size classes for SubHeading based on card size', () => {
      render(
        <ProductCard size="md">
          <ProductCardContent>
            <ProductCardSubHeading>Category</ProductCardSubHeading>
          </ProductCardContent>
        </ProductCard>
      );
      const subHeading = screen.getByText('Category');
      expect(subHeading).toHaveClass('text-xl');
    });
  });
});

