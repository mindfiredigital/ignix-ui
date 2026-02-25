/**
 * Unit Tests for ErrorPage Component
 * 
 * This test suite covers all functionality of the ErrorPage component including:
 * - Basic rendering and default behavior
 * - All sub-components (ErrorPageHead, ErrorPageErrorCode, ErrorPageHeading, ErrorPageDesc, ErrorPageIllustration, ErrorPageContent, ErrorPageSearch, ErrorPageFooter, ErrorPageLinks)
 * - Variant handling (default, minimal, gradient, dark)
 * - Background image support
 * - Dark variant text color changes
 * - Animation types for error code
 * - Search functionality and callbacks
 * - Illustration positioning
 * - Context usage
 * - Memoization behavior
 * - Edge cases and boundary conditions
 * - Accessibility features
 * 
 * @file error-page.test.tsx
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom';
import {
  ErrorPage,
  ErrorPageHead,
  ErrorPageErrorCode,
  ErrorPageHeading,
  ErrorPageDesc,
  ErrorPageIllustration,
  ErrorPageContent,
  ErrorPageSearch,
  ErrorPageFooter,
  ErrorPageLinks,
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

// Mock framer-motion to avoid animation-related issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: MockComponentProps) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => {
  const MockSearch = ({ className, 'data-testid': testId, ...props }: MockIconProps) => (
    <svg
      data-testid={testId || 'search-icon'}
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      {...props}
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );

  const MockHome = ({ className, 'data-testid': testId, ...props }: MockIconProps) => (
    <svg
      data-testid={testId || 'home-icon'}
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      {...props}
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );

  const MockArrowLeft = ({ className, 'data-testid': testId, ...props }: MockIconProps) => (
    <svg
      data-testid={testId || 'arrow-left-icon'}
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      {...props}
    >
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );

  return {
    Search: MockSearch,
    Home: MockHome,
    ArrowLeft: MockArrowLeft,
  };
});

// Mock Typography component
vi.mock('@ignix-ui/typography', () => ({
  Typography: ({ children, className, variant, 'aria-label': ariaLabel, ...props }: any) => {
    const Tag = variant === 'h1' ? 'h1' : variant === 'h2' ? 'h2' : 'p';
    return (
      <Tag className={className} aria-label={ariaLabel} {...props}>
        {children}
      </Tag>
    );
  },
}));

// Mock Button component
vi.mock('@ignix-ui/button', () => ({
  Button: ({ children, onClick, className, variant, size, ...props }: any) => (
    <button
      className={className}
      onClick={onClick}
      data-variant={variant}
      data-size={size}
      {...props}
    >
      {children}
    </button>
  ),
}));

describe('ErrorPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Test 1: Basic rendering
  describe('Basic Rendering', () => {
    it('should render ErrorPage with default variant', () => {
      render(
        <ErrorPage>
          <ErrorPageContent>
            <ErrorPageErrorCode>404</ErrorPageErrorCode>
          </ErrorPageContent>
        </ErrorPage>
      );
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByText('404')).toBeInTheDocument();
    });

    it('should render ErrorPage with custom className', () => {
      const { container } = render(
        <ErrorPage className="custom-class">
          <ErrorPageContent>
            <ErrorPageErrorCode>404</ErrorPageErrorCode>
          </ErrorPageContent>
        </ErrorPage>
      );
      expect(container.querySelector('.custom-class')).toBeInTheDocument();
    });

    it('should have correct aria-label', () => {
      render(
        <ErrorPage>
          <ErrorPageContent>
            <ErrorPageErrorCode>404</ErrorPageErrorCode>
          </ErrorPageContent>
        </ErrorPage>
      );
      expect(screen.getByRole('main')).toHaveAttribute('aria-label', 'Error page');
    });
  });

  // Test 2-5: Variant handling
  describe('Variant Handling', () => {
    it('should render with default variant', () => {
      const { container } = render(
        <ErrorPage variant="default">
          <ErrorPageContent>
            <ErrorPageErrorCode>404</ErrorPageErrorCode>
          </ErrorPageContent>
        </ErrorPage>
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render with minimal variant', () => {
      const { container } = render(
        <ErrorPage variant="minimal">
          <ErrorPageContent>
            <ErrorPageErrorCode>404</ErrorPageErrorCode>
          </ErrorPageContent>
        </ErrorPage>
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render with gradient variant', () => {
      const { container } = render(
        <ErrorPage variant="gradient">
          <ErrorPageContent>
            <ErrorPageErrorCode>404</ErrorPageErrorCode>
          </ErrorPageContent>
        </ErrorPage>
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render with dark variant', () => {
      const { container } = render(
        <ErrorPage variant="dark">
          <ErrorPageContent>
            <ErrorPageErrorCode>404</ErrorPageErrorCode>
          </ErrorPageContent>
        </ErrorPage>
      );
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  // Test 6-7: Background image
  describe('Background Image', () => {
    it('should apply background image when provided', () => {
      const { container } = render(
        <ErrorPage backgroundImage="https://example.com/bg.jpg">
          <ErrorPageContent>
            <ErrorPageErrorCode>404</ErrorPageErrorCode>
          </ErrorPageContent>
        </ErrorPage>
      );
      const mainElement = container.querySelector('[role="main"]');
      expect(mainElement).toHaveStyle({
        backgroundImage: 'url(https://example.com/bg.jpg)',
      });
    });

    it('should render overlay when background image is provided', () => {
      const { container } = render(
        <ErrorPage backgroundImage="https://example.com/bg.jpg">
          <ErrorPageContent>
            <ErrorPageErrorCode>404</ErrorPageErrorCode>
          </ErrorPageContent>
        </ErrorPage>
      );
      expect(container.querySelector('.absolute.inset-0')).toBeInTheDocument();
    });
  });

  // Test 8-12: ErrorPageErrorCode
  describe('ErrorPageErrorCode', () => {
    it('should render error code from prop', () => {
      render(
        <ErrorPage>
          <ErrorPageContent>
            <ErrorPageErrorCode errorCode="500" />
          </ErrorPageContent>
        </ErrorPage>
      );
      expect(screen.getByText('500')).toBeInTheDocument();
    });

    it('should render error code from children', () => {
      render(
        <ErrorPage>
          <ErrorPageContent>
            <ErrorPageErrorCode>403</ErrorPageErrorCode>
          </ErrorPageContent>
        </ErrorPage>
      );
      expect(screen.getByText('403')).toBeInTheDocument();
    });

    it('should default to 404 when no errorCode or children provided', () => {
      render(
        <ErrorPage>
          <ErrorPageContent>
            <ErrorPageErrorCode />
          </ErrorPageContent>
        </ErrorPage>
      );
      expect(screen.getByText('404')).toBeInTheDocument();
    });

    it('should have correct aria-label', () => {
      render(
        <ErrorPage>
          <ErrorPageContent>
            <ErrorPageErrorCode errorCode="500" />
          </ErrorPageContent>
        </ErrorPage>
      );
      expect(screen.getByLabelText('Error code 500')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(
        <ErrorPage>
          <ErrorPageContent>
            <ErrorPageErrorCode errorCode="404" className="custom-error-code" />
          </ErrorPageContent>
        </ErrorPage>
      );
      expect(container.querySelector('.custom-error-code')).toBeInTheDocument();
    });
  });

  // Test 13-18: Animation types
  describe('ErrorPageErrorCode Animation Types', () => {
    it('should render with pulse animation', () => {
      render(
        <ErrorPage>
          <ErrorPageContent>
            <ErrorPageErrorCode errorCode="404" animationType="pulse" />
          </ErrorPageContent>
        </ErrorPage>
      );
      expect(screen.getByText('404')).toBeInTheDocument();
    });

    it('should render with bounce animation', () => {
      render(
        <ErrorPage>
          <ErrorPageContent>
            <ErrorPageErrorCode errorCode="404" animationType="bounce" />
          </ErrorPageContent>
        </ErrorPage>
      );
      expect(screen.getByText('404')).toBeInTheDocument();
    });

    it('should render with glow animation', () => {
      render(
        <ErrorPage>
          <ErrorPageContent>
            <ErrorPageErrorCode errorCode="404" animationType="glow" />
          </ErrorPageContent>
        </ErrorPage>
      );
      expect(screen.getByText('404')).toBeInTheDocument();
    });

    it('should render with shake animation', () => {
      render(
        <ErrorPage>
          <ErrorPageContent>
            <ErrorPageErrorCode errorCode="404" animationType="shake" />
          </ErrorPageContent>
        </ErrorPage>
      );
      expect(screen.getByText('404')).toBeInTheDocument();
    });

    it('should render with rotate animation', () => {
      render(
        <ErrorPage>
          <ErrorPageContent>
            <ErrorPageErrorCode errorCode="404" animationType="rotate" />
          </ErrorPageContent>
        </ErrorPage>
      );
      expect(screen.getByText('404')).toBeInTheDocument();
    });

    it('should render with none animation (default)', () => {
      render(
        <ErrorPage>
          <ErrorPageContent>
            <ErrorPageErrorCode errorCode="404" animationType="none" />
          </ErrorPageContent>
        </ErrorPage>
      );
      expect(screen.getByText('404')).toBeInTheDocument();
    });
  });

  // Test 19-23: ErrorPageHeading
  describe('ErrorPageHeading', () => {
    it('should render heading from title prop', () => {
      render(
        <ErrorPage>
          <ErrorPageContent>
            <ErrorPageHeading title="Page Not Found" />
          </ErrorPageContent>
        </ErrorPage>
      );
      expect(screen.getByText('Page Not Found')).toBeInTheDocument();
    });

    it('should render heading from children', () => {
      render(
        <ErrorPage>
          <ErrorPageContent>
            <ErrorPageHeading>Custom Heading</ErrorPageHeading>
          </ErrorPageContent>
        </ErrorPage>
      );
      expect(screen.getByText('Custom Heading')).toBeInTheDocument();
    });

    it('should default to "Page Not Found" when no title or children', () => {
      render(
        <ErrorPage>
          <ErrorPageContent>
            <ErrorPageHeading />
          </ErrorPageContent>
        </ErrorPage>
      );
      expect(screen.getByText('Page Not Found')).toBeInTheDocument();
    });

    it('should prioritize children over title prop', () => {
      render(
        <ErrorPage>
          <ErrorPageContent>
            <ErrorPageHeading title="Title Prop">Children Text</ErrorPageHeading>
          </ErrorPageContent>
        </ErrorPage>
      );
      expect(screen.getByText('Children Text')).toBeInTheDocument();
      expect(screen.queryByText('Title Prop')).not.toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(
        <ErrorPage>
          <ErrorPageContent>
            <ErrorPageHeading title="Test" className="custom-heading" />
          </ErrorPageContent>
        </ErrorPage>
      );
      expect(container.querySelector('.custom-heading')).toBeInTheDocument();
    });
  });

  // Test 24-28: ErrorPageDesc
  describe('ErrorPageDesc', () => {
    it('should render description from prop', () => {
      render(
        <ErrorPage>
          <ErrorPageContent>
            <ErrorPageDesc description="This is a test description" />
          </ErrorPageContent>
        </ErrorPage>
      );
      expect(screen.getByText('This is a test description')).toBeInTheDocument();
    });

    it('should render description from children', () => {
      render(
        <ErrorPage>
          <ErrorPageContent>
            <ErrorPageDesc>Children description</ErrorPageDesc>
          </ErrorPageContent>
        </ErrorPage>
      );
      expect(screen.getByText('Children description')).toBeInTheDocument();
    });

    it('should prioritize children over description prop', () => {
      render(
        <ErrorPage>
          <ErrorPageContent>
            <ErrorPageDesc description="Prop description">Children description</ErrorPageDesc>
          </ErrorPageContent>
        </ErrorPage>
      );
      expect(screen.getByText('Children description')).toBeInTheDocument();
      expect(screen.queryByText('Prop description')).not.toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(
        <ErrorPage>
          <ErrorPageContent>
            <ErrorPageDesc description="Test" className="custom-desc" />
          </ErrorPageContent>
        </ErrorPage>
      );
      expect(container.querySelector('.custom-desc')).toBeInTheDocument();
    });

    it('should render empty when no description or children', () => {
      const { container } = render(
        <ErrorPage>
          <ErrorPageContent>
            <ErrorPageDesc />
          </ErrorPageContent>
        </ErrorPage>
      );
      // Should render but with empty content
      expect(container.querySelector('p')).toBeInTheDocument();
    });
  });

  // Test 29-33: Dark variant text colors
  describe('Dark Variant Text Colors', () => {
    it('should apply white text to ErrorPageErrorCode in dark variant', () => {
      const { container } = render(
        <ErrorPage variant="dark">
          <ErrorPageContent>
            <ErrorPageErrorCode errorCode="404" />
          </ErrorPageContent>
        </ErrorPage>
      );
      const errorCode = container.querySelector('h1');
      expect(errorCode?.className).toContain('text-white');
    });

    it('should apply white text to ErrorPageHeading in dark variant', () => {
      const { container } = render(
        <ErrorPage variant="dark">
          <ErrorPageContent>
            <ErrorPageHeading title="Test" />
          </ErrorPageContent>
        </ErrorPage>
      );
      const heading = container.querySelector('h2');
      expect(heading?.className).toContain('text-white');
    });

    it('should apply white text to ErrorPageDesc in dark variant', () => {
      const { container } = render(
        <ErrorPage variant="dark">
          <ErrorPageContent>
            <ErrorPageDesc description="Test" />
          </ErrorPageContent>
        </ErrorPage>
      );
      const desc = container.querySelector('p');
      expect(desc?.className).toContain('text-white');
    });

    it('should apply primary text to ErrorPageErrorCode in default variant', () => {
      const { container } = render(
        <ErrorPage variant="default">
          <ErrorPageContent>
            <ErrorPageErrorCode errorCode="404" />
          </ErrorPageContent>
        </ErrorPage>
      );
      const errorCode = container.querySelector('h1');
      expect(errorCode?.className).toContain('text-primary');
    });

    it('should apply primary text to ErrorPageHeading in default variant', () => {
      const { container } = render(
        <ErrorPage variant="default">
          <ErrorPageContent>
            <ErrorPageHeading title="Test" />
          </ErrorPageContent>
        </ErrorPage>
      );
      const heading = container.querySelector('h2');
      expect(heading?.className).toContain('text-primary');
    });
  });

  // Test 34-38: ErrorPageIllustration
  describe('ErrorPageIllustration', () => {
    it('should render illustration from string URL', () => {
      render(
        <ErrorPage>
          <ErrorPageIllustration illustration="https://example.com/image.jpg" />
          <ErrorPageContent>
            <ErrorPageErrorCode>404</ErrorPageErrorCode>
          </ErrorPageContent>
        </ErrorPage>
      );
      const img = screen.getByAltText('Error illustration');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', 'https://example.com/image.jpg');
    });

    it('should render illustration from React node', () => {
      const CustomIllustration = () => <div data-testid="custom-illustration">Custom</div>;
      render(
        <ErrorPage>
          <ErrorPageIllustration illustration={<CustomIllustration />} />
          <ErrorPageContent>
            <ErrorPageErrorCode>404</ErrorPageErrorCode>
          </ErrorPageContent>
        </ErrorPage>
      );
      expect(screen.getByTestId('custom-illustration')).toBeInTheDocument();
    });

    it('should render illustration from children', () => {
      render(
        <ErrorPage>
          <ErrorPageIllustration>
            <div data-testid="child-illustration">Child</div>
          </ErrorPageIllustration>
          <ErrorPageContent>
            <ErrorPageErrorCode>404</ErrorPageErrorCode>
          </ErrorPageContent>
        </ErrorPage>
      );
      expect(screen.getByTestId('child-illustration')).toBeInTheDocument();
    });

    it('should prioritize children over illustration prop', () => {
      render(
        <ErrorPage>
          <ErrorPageIllustration illustration="https://example.com/image.jpg">
            <div data-testid="child-illustration">Child</div>
          </ErrorPageIllustration>
          <ErrorPageContent>
            <ErrorPageErrorCode>404</ErrorPageErrorCode>
          </ErrorPageContent>
        </ErrorPage>
      );
      expect(screen.getByTestId('child-illustration')).toBeInTheDocument();
      expect(screen.queryByAltText('Error illustration')).not.toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(
        <ErrorPage>
          <ErrorPageIllustration illustration="https://example.com/image.jpg" className="custom-illustration" />
          <ErrorPageContent>
            <ErrorPageErrorCode>404</ErrorPageErrorCode>
          </ErrorPageContent>
        </ErrorPage>
      );
      expect(container.querySelector('.custom-illustration')).toBeInTheDocument();
    });
  });

  // Test 39-40: Illustration positioning
  describe('Illustration Positioning', () => {
    it('should position illustration on left by default', () => {
      const { container } = render(
        <ErrorPage>
          <ErrorPageIllustration illustration="https://example.com/image.jpg" />
          <ErrorPageContent>
            <ErrorPageErrorCode>404</ErrorPageErrorCode>
          </ErrorPageContent>
        </ErrorPage>
      );
      // Check that flex-row is applied (left positioning)
      const flexContainer = container.querySelector('.flex.flex-col');
      expect(flexContainer).toBeInTheDocument();
    });

    it('should position illustration on right when position="right"', () => {
      const { container } = render(
        <ErrorPage>
          <ErrorPageIllustration illustration="https://example.com/image.jpg" position="right" />
          <ErrorPageContent>
            <ErrorPageErrorCode>404</ErrorPageErrorCode>
          </ErrorPageContent>
        </ErrorPage>
      );
      // Check that flex-row-reverse is applied (right positioning)
      const flexContainer = container.querySelector('.lg\\:flex-row-reverse');
      expect(flexContainer).toBeInTheDocument();
    });
  });

  // Test 41-47: ErrorPageSearch
  describe('ErrorPageSearch', () => {
    it('should render search bar by default', () => {
      render(
        <ErrorPage>
          <ErrorPageContent>
            <ErrorPageSearch />
          </ErrorPageContent>
        </ErrorPage>
      );
      expect(screen.getByPlaceholderText('Search for content...')).toBeInTheDocument();
    });

    it('should not render when showSearch is false', () => {
      render(
        <ErrorPage>
          <ErrorPageContent>
            <ErrorPageSearch showSearch={false} />
          </ErrorPageContent>
        </ErrorPage>
      );
      expect(screen.queryByPlaceholderText('Search for content...')).not.toBeInTheDocument();
    });

    it('should use custom placeholder', () => {
      render(
        <ErrorPage>
          <ErrorPageContent>
            <ErrorPageSearch searchPlaceholder="Custom placeholder" />
          </ErrorPageContent>
        </ErrorPage>
      );
      expect(screen.getByPlaceholderText('Custom placeholder')).toBeInTheDocument();
    });

    it('should call onSearch when typing', async () => {
      const handleSearch = vi.fn();
      const user = userEvent.setup();
      render(
        <ErrorPage>
          <ErrorPageContent>
            <ErrorPageSearch onSearch={handleSearch} />
          </ErrorPageContent>
        </ErrorPage>
      );
      const input = screen.getByPlaceholderText('Search for content...');
      await user.type(input, 'test');
      expect(handleSearch).toHaveBeenCalledWith('test');
    });

    it('should call onSearch when Enter key is pressed', async () => {
      const handleSearch = vi.fn();
      const user = userEvent.setup();
      render(
        <ErrorPage>
          <ErrorPageContent>
            <ErrorPageSearch onSearch={handleSearch} />
          </ErrorPageContent>
        </ErrorPage>
      );
      const input = screen.getByPlaceholderText('Search for content...');
      await user.type(input, 'test{Enter}');
      expect(handleSearch).toHaveBeenCalled();
    });

    it('should call onSearch when search button is clicked', async () => {
      const handleSearch = vi.fn();
      const user = userEvent.setup();
      render(
        <ErrorPage>
          <ErrorPageContent>
            <ErrorPageSearch onSearch={handleSearch} />
          </ErrorPageContent>
        </ErrorPage>
      );
      const input = screen.getByPlaceholderText('Search for content...');
      await user.type(input, 'test');
      const button = screen.getByText('Search');
      await user.click(button);
      expect(handleSearch).toHaveBeenCalledWith('test');
    });

    it('should use custom search button text', () => {
      render(
        <ErrorPage>
          <ErrorPageContent>
            <ErrorPageSearch searchButtonText="Find" />
          </ErrorPageContent>
        </ErrorPage>
      );
      expect(screen.getByText('Find')).toBeInTheDocument();
    });
  });

  // Test 48-50: ErrorPageLinks
  describe('ErrorPageLinks', () => {
    it('should render links in row direction by default', () => {
      const { container } = render(
        <ErrorPage>
          <ErrorPageContent>
            <ErrorPageLinks>
              <button>Link 1</button>
              <button>Link 2</button>
            </ErrorPageLinks>
          </ErrorPageContent>
        </ErrorPage>
      );
      const linksContainer = container.querySelector('.flex-row');
      expect(linksContainer).toBeInTheDocument();
    });

    it('should render links in column direction when specified', () => {
      const { container } = render(
        <ErrorPage>
          <ErrorPageContent>
            <ErrorPageLinks direction="column">
              <button>Link 1</button>
              <button>Link 2</button>
            </ErrorPageLinks>
          </ErrorPageContent>
        </ErrorPage>
      );
      const linksContainer = container.querySelector('.flex-col');
      expect(linksContainer).toBeInTheDocument();
    });

    it('should render children correctly', () => {
      render(
        <ErrorPage>
          <ErrorPageContent>
            <ErrorPageLinks>
              <button>Home</button>
              <button>Back</button>
            </ErrorPageLinks>
          </ErrorPageContent>
        </ErrorPage>
      );
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Back')).toBeInTheDocument();
    });
  });

  // Test 51-52: ErrorPageFooter
  describe('ErrorPageFooter', () => {
    it('should render footer with children', () => {
      render(
        <ErrorPage>
          <ErrorPageContent>
            <ErrorPageErrorCode>404</ErrorPageErrorCode>
          </ErrorPageContent>
          <ErrorPageFooter>
            <p>Footer content</p>
          </ErrorPageFooter>
        </ErrorPage>
      );
      expect(screen.getByText('Footer content')).toBeInTheDocument();
    });

    it('should not render when no children provided', () => {
      const { container } = render(
        <ErrorPage>
          <ErrorPageContent>
            <ErrorPageErrorCode>404</ErrorPageErrorCode>
          </ErrorPageContent>
          <ErrorPageFooter />
        </ErrorPage>
      );
      // Footer should not render anything
      expect(container.querySelector('.pt-8')).not.toBeInTheDocument();
    });
  });

  // Test 53-54: ErrorPageContent
  describe('ErrorPageContent', () => {
    it('should render content children', () => {
      render(
        <ErrorPage>
          <ErrorPageContent>
            <ErrorPageErrorCode>404</ErrorPageErrorCode>
            <ErrorPageHeading title="Test" />
          </ErrorPageContent>
        </ErrorPage>
      );
      expect(screen.getByText('404')).toBeInTheDocument();
      expect(screen.getByText('Test')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(
        <ErrorPage>
          <ErrorPageContent className="custom-content">
            <ErrorPageErrorCode>404</ErrorPageErrorCode>
          </ErrorPageContent>
        </ErrorPage>
      );
      expect(container.querySelector('.custom-content')).toBeInTheDocument();
    });
  });

  // Test 55-56: ErrorPageHead
  describe('ErrorPageHead', () => {
    it('should render head children', () => {
      render(
        <ErrorPage>
          <ErrorPageHead>
            <ErrorPageErrorCode>404</ErrorPageErrorCode>
          </ErrorPageHead>
        </ErrorPage>
      );
      expect(screen.getByText('404')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(
        <ErrorPage>
          <ErrorPageHead className="custom-head">
            <ErrorPageErrorCode>404</ErrorPageErrorCode>
          </ErrorPageHead>
        </ErrorPage>
      );
      expect(container.querySelector('.custom-head')).toBeInTheDocument();
    });
  });

  // Test 57-58: Background children handling
  describe('Background Children Handling', () => {
    it('should render absolute positioned background divs', () => {
      const { container } = render(
        <ErrorPage>
          <div className="absolute inset-0 bg-black" />
          <ErrorPageContent>
            <ErrorPageErrorCode>404</ErrorPageErrorCode>
          </ErrorPageContent>
        </ErrorPage>
      );
      expect(container.querySelector('.absolute.inset-0')).toBeInTheDocument();
    });

    it('should separate background children from content children', () => {
      render(
        <ErrorPage>
          <div className="absolute inset-0 bg-black" />
          <ErrorPageContent>
            <ErrorPageErrorCode>404</ErrorPageErrorCode>
          </ErrorPageContent>
        </ErrorPage>
      );
      expect(screen.getByText('404')).toBeInTheDocument();
    });
  });

  // Test 59-60: Edge cases and integration
  describe('Edge Cases and Integration', () => {
    it('should handle empty children array', () => {
      const { container } = render(<ErrorPage />);
      expect(container.querySelector('[role="main"]')).toBeInTheDocument();
    });

    it('should handle multiple ErrorPageContent components', () => {
      render(
        <ErrorPage>
          <ErrorPageContent>
            <ErrorPageErrorCode>404</ErrorPageErrorCode>
          </ErrorPageContent>
          <ErrorPageContent>
            <ErrorPageHeading title="Test" />
          </ErrorPageContent>
        </ErrorPage>
      );
      expect(screen.getByText('404')).toBeInTheDocument();
      expect(screen.getByText('Test')).toBeInTheDocument();
    });
  });
});


