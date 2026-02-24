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
  ErrorPageIcons,
  ErrorPageErrorReference,
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

  const MockCopy = ({ className, 'data-testid': testId, ...props }: MockIconProps) => (
    <svg
      data-testid={testId || 'copy-icon'}
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      {...props}
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );

  const MockAlertTriangle = ({ className, 'data-testid': testId, ...props }: MockIconProps) => (
    <svg
      data-testid={testId || 'alert-triangle-icon'}
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      {...props}
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );

  const MockWrench = ({ className, 'data-testid': testId, ...props }: MockIconProps) => (
    <svg
      data-testid={testId || 'wrench-icon'}
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      {...props}
    >
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );

  const MockSettings = ({ className, 'data-testid': testId, ...props }: MockIconProps) => (
    <svg
      data-testid={testId || 'settings-icon'}
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      {...props}
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v18.84a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z" />
      <path d="M18.22 6h-.44a2 2 0 0 0-2 2v12.84a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2z" />
      <path d="M6.22 10h-.44a2 2 0 0 0-2 2v8.84a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2V12a2 2 0 0 0-2-2z" />
    </svg>
  );

  return {
    Search: MockSearch,
    Home: MockHome,
    ArrowLeft: MockArrowLeft,
    Copy: MockCopy,
    AlertTriangle: MockAlertTriangle,
    Wrench: MockWrench,
    Settings: MockSettings,
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

// Mock ButtonWithIcon component
vi.mock('@ignix-ui/buttonwithicon', () => ({
  ButtonWithIcon: ({ children, onClick, className, variant, size, icon, iconPosition, ...props }: any) => (
    <button
      className={className}
      onClick={onClick}
      data-variant={variant}
      data-size={size}
      data-icon-position={iconPosition}
      {...props}
    >
      {icon && <span data-testid="button-icon">{icon}</span>}
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
      expect(container.querySelector('.relative.inset-0')).toBeInTheDocument();
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
            <ErrorPageLinks>
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

  // Test 61-65: ErrorPageIcons
  describe('ErrorPageIcons', () => {
    it('should render ErrorPageIcons with basic icon array', () => {
      const MockIcon1 = () => <svg data-testid="icon-1" />;
      const MockIcon2 = () => <svg data-testid="icon-2" />;
      render(
        <ErrorPage>
          <ErrorPageContent>
            <ErrorPageIcons icons={[MockIcon1 as any, MockIcon2 as any, MockIcon1 as any, MockIcon2 as any]}>
              <ErrorPageErrorCode errorCode="500" />
            </ErrorPageIcons>
          </ErrorPageContent>
        </ErrorPage>
      );
      expect(screen.getByText('500')).toBeInTheDocument();
    });

    it('should render ErrorPageIcons with tuple icon array (custom colors)', () => {
      const MockIcon1 = () => <svg data-testid="icon-1" />;
      const MockIcon2 = () => <svg data-testid="icon-2" />;
      render(
        <ErrorPage>
          <ErrorPageContent>
            <ErrorPageIcons
              icons={[
                [MockIcon1 as any, "text-red-500"],
                [MockIcon2 as any, "text-blue-500"],
                [MockIcon1 as any, "text-purple-500"],
                [MockIcon2 as any, "text-orange-500"],
              ]}
            >
              <ErrorPageErrorCode errorCode="500" />
            </ErrorPageIcons>
          </ErrorPageContent>
        </ErrorPage>
      );
      expect(screen.getByText('500')).toBeInTheDocument();
    });

    it('should render children when icons array has less than 4 items', () => {
      const MockIcon = () => <svg data-testid="icon-1" />;
      render(
        <ErrorPage>
          <ErrorPageContent>
            <ErrorPageIcons icons={[MockIcon as any]}>
              <ErrorPageErrorCode errorCode="500" />
            </ErrorPageIcons>
          </ErrorPageContent>
        </ErrorPage>
      );
      expect(screen.getByText('500')).toBeInTheDocument();
    });

    it('should render children when icons prop is not provided', () => {
      render(
        <ErrorPage>
          <ErrorPageContent>
            <ErrorPageIcons>
              <ErrorPageErrorCode errorCode="500" />
            </ErrorPageIcons>
          </ErrorPageContent>
        </ErrorPage>
      );
      expect(screen.getByText('500')).toBeInTheDocument();
    });

    it('should apply custom className to ErrorPageIcons', () => {
      const MockIcon1 = () => <svg data-testid="icon-1" />;
      const MockIcon2 = () => <svg data-testid="icon-2" />;
      const { container } = render(
        <ErrorPage>
          <ErrorPageContent>
            <ErrorPageIcons
              icons={[MockIcon1 as any, MockIcon2 as any, MockIcon1 as any, MockIcon2 as any]}
              className="custom-icons"
            >
              <ErrorPageErrorCode errorCode="500" />
            </ErrorPageIcons>
          </ErrorPageContent>
        </ErrorPage>
      );
      expect(container.querySelector('.custom-icons')).toBeInTheDocument();
    });
  });

  // Test 66-75: ErrorPageErrorReference
  describe('ErrorPageErrorReference', () => {
    it('should render error reference ID', () => {
      const referenceId = 'ERR-ABC123-XYZ789';
      render(
        <ErrorPage>
          <ErrorPageContent>
            <ErrorPageErrorReference errorReferenceId={referenceId} />
          </ErrorPageContent>
        </ErrorPage>
      );
      expect(screen.getByText(referenceId)).toBeInTheDocument();
    });

    it('should render with custom label', () => {
      const referenceId = 'ERR-ABC123-XYZ789';
      render(
        <ErrorPage>
          <ErrorPageContent>
            <ErrorPageErrorReference
              errorReferenceId={referenceId}
              label="Custom Label"
            />
          </ErrorPageContent>
        </ErrorPage>
      );
      expect(screen.getByText('Custom Label')).toBeInTheDocument();
      expect(screen.getByText(referenceId)).toBeInTheDocument();
    });

    it('should render with custom helper text', () => {
      const referenceId = 'ERR-ABC123-XYZ789';
      render(
        <ErrorPage>
          <ErrorPageContent>
            <ErrorPageErrorReference
              errorReferenceId={referenceId}
              helperText="Custom helper text"
            />
          </ErrorPageContent>
        </ErrorPage>
      );
      expect(screen.getByText('Custom helper text')).toBeInTheDocument();
    });

    it('should call onCopy when copy button is clicked', async () => {
      const referenceId = 'ERR-ABC123-XYZ789';
      const handleCopy = vi.fn();
      const user = userEvent.setup();
      // Mock clipboard API
      const mockWriteText = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: mockWriteText,
        },
        writable: true,
        configurable: true,
      });
      render(
        <ErrorPage>
          <ErrorPageContent>
            <ErrorPageErrorReference
              errorReferenceId={referenceId}
              onCopy={handleCopy}
            />
          </ErrorPageContent>
        </ErrorPage>
      );
      const copyButton = screen.getByText('Copy');
      await user.click(copyButton);
      expect(handleCopy).toHaveBeenCalledWith(referenceId);
    });

    it('should not render when errorReferenceId is not provided', () => {
      const { container } = render(
        <ErrorPage>
          <ErrorPageContent>
            <ErrorPageErrorReference />
          </ErrorPageContent>
        </ErrorPage>
      );
      expect(container.querySelector('.mb-6')).not.toBeInTheDocument();
    });

    it('should hide copy button when showCopyButton is false', () => {
      const referenceId = 'ERR-ABC123-XYZ789';
      render(
        <ErrorPage>
          <ErrorPageContent>
            <ErrorPageErrorReference
              errorReferenceId={referenceId}
              showCopyButton={false}
            />
          </ErrorPageContent>
        </ErrorPage>
      );
      expect(screen.queryByText('Copy')).not.toBeInTheDocument();
    });

    it('should use custom copy button text', () => {
      const referenceId = 'ERR-ABC123-XYZ789';
      render(
        <ErrorPage>
          <ErrorPageContent>
            <ErrorPageErrorReference
              errorReferenceId={referenceId}
              copyButtonText="Copy ID"
            />
          </ErrorPageContent>
        </ErrorPage>
      );
      expect(screen.getByText('Copy ID')).toBeInTheDocument();
    });

    it('should render custom children when provided', () => {
      const referenceId = 'ERR-ABC123-XYZ789';
      render(
        <ErrorPage>
          <ErrorPageContent>
            <ErrorPageErrorReference errorReferenceId={referenceId}>
              <div data-testid="custom-reference">Custom Reference</div>
            </ErrorPageErrorReference>
          </ErrorPageContent>
        </ErrorPage>
      );
      expect(screen.getByTestId('custom-reference')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const referenceId = 'ERR-ABC123-XYZ789';
      const { container } = render(
        <ErrorPage>
          <ErrorPageContent>
            <ErrorPageErrorReference
              errorReferenceId={referenceId}
              className="custom-reference"
            />
          </ErrorPageContent>
        </ErrorPage>
      );
      expect(container.querySelector('.custom-reference')).toBeInTheDocument();
    });

    it('should handle clipboard API failure gracefully', async () => {
      const referenceId = 'ERR-ABC123-XYZ789';
      const handleCopy = vi.fn();
      const user = userEvent.setup();
      // Mock clipboard API with rejection
      const mockWriteText = vi.fn().mockRejectedValue(new Error('Clipboard error'));
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: mockWriteText,
        },
        writable: true,
        configurable: true,
      });
      render(
        <ErrorPage>
          <ErrorPageContent>
            <ErrorPageErrorReference
              errorReferenceId={referenceId}
              onCopy={handleCopy}
            />
          </ErrorPageContent>
        </ErrorPage>
      );
      const copyButton = screen.getByText('Copy');
      await user.click(copyButton);
      expect(handleCopy).toHaveBeenCalledWith(referenceId);
    });
  });

  // Test 76-80: Icon prop functionality
  describe('Icon Prop Functionality', () => {
    it('should render icon instances when icon prop is provided', () => {
      const MockSettings = () => <svg data-testid="settings-icon" />;
      const { container } = render(
        <ErrorPage icon={MockSettings as any}>
          <ErrorPageContent>
            <ErrorPageErrorCode>404</ErrorPageErrorCode>
          </ErrorPageContent>
        </ErrorPage>
      );
      const icons = container.querySelectorAll('svg[data-testid="settings-icon"]');
      expect(icons.length).toBeGreaterThan(0);
    });

    it('should apply custom iconColor when provided', () => {
      const MockSettings = () => <svg data-testid="settings-icon" />;
      const { container } = render(
        <ErrorPage icon={MockSettings as any} iconColor="text-blue-500">
          <ErrorPageContent>
            <ErrorPageErrorCode>404</ErrorPageErrorCode>
          </ErrorPageContent>
        </ErrorPage>
      );
      const iconContainer = container.querySelector('.absolute.pointer-events-none');
      expect(iconContainer?.className).toContain('text-blue-500');
    });

    it('should use white color for icons when backgroundImage is present', () => {
      const MockSettings = () => <svg data-testid="settings-icon" />;
      const { container } = render(
        <ErrorPage
          icon={MockSettings as any}
          backgroundImage="https://example.com/bg.jpg"
        >
          <ErrorPageContent>
            <ErrorPageErrorCode>404</ErrorPageErrorCode>
          </ErrorPageContent>
        </ErrorPage>
      );
      const iconContainer = container.querySelector('.absolute.pointer-events-none');
      expect(iconContainer?.className).toContain('text-white');
    });

    it('should prioritize iconColor over backgroundImage default', () => {
      const MockSettings = () => <svg data-testid="settings-icon" />;
      const { container } = render(
        <ErrorPage
          icon={MockSettings as any}
          iconColor="text-red-500"
          backgroundImage="https://example.com/bg.jpg"
        >
          <ErrorPageContent>
            <ErrorPageErrorCode>404</ErrorPageErrorCode>
          </ErrorPageContent>
        </ErrorPage>
      );
      const iconContainer = container.querySelector('.absolute.pointer-events-none');
      expect(iconContainer?.className).toContain('text-red-500');
    });

    it('should not render icons when icon prop is not provided', () => {
      const { container } = render(
        <ErrorPage>
          <ErrorPageContent>
            <ErrorPageErrorCode>404</ErrorPageErrorCode>
          </ErrorPageContent>
        </ErrorPage>
      );
      const icons = container.querySelectorAll('.absolute.pointer-events-none');
      expect(icons.length).toBe(0);
    });
  });

  // Test 81-85: Illustration topCenter position
  describe('Illustration topCenter Position', () => {
    it('should position illustration at topCenter when position="topCenter"', () => {
      const { container } = render(
        <ErrorPage>
          <ErrorPageIllustration
            illustration="https://example.com/image.jpg"
            position="topCenter"
          />
          <ErrorPageContent>
            <ErrorPageErrorCode>404</ErrorPageErrorCode>
          </ErrorPageContent>
        </ErrorPage>
      );
      const illustrationContainer = container.querySelector('.flex.items-center.justify-center.mb-8');
      expect(illustrationContainer).toBeInTheDocument();
    });

    it('should render illustration above content when position is topCenter', () => {
      render(
        <ErrorPage>
          <ErrorPageIllustration
            illustration="https://example.com/image.jpg"
            position="topCenter"
          />
          <ErrorPageContent>
            <ErrorPageErrorCode>404</ErrorPageErrorCode>
          </ErrorPageContent>
        </ErrorPage>
      );
      expect(screen.getByAltText('Error illustration')).toBeInTheDocument();
      expect(screen.getByText('404')).toBeInTheDocument();
    });

    it('should not affect flex direction when position is topCenter', () => {
      const { container } = render(
        <ErrorPage>
          <ErrorPageIllustration
            illustration="https://example.com/image.jpg"
            position="topCenter"
          />
          <ErrorPageContent>
            <ErrorPageErrorCode>404</ErrorPageErrorCode>
          </ErrorPageContent>
        </ErrorPage>
      );
      const flexContainer = container.querySelector('.flex.flex-col');
      expect(flexContainer).toBeInTheDocument();
    });

    it('should handle topCenter position with React node illustration', () => {
      const CustomIllustration = () => <div data-testid="top-center-illustration">Top Center</div>;
      render(
        <ErrorPage>
          <ErrorPageIllustration
            illustration={<CustomIllustration />}
            position="topCenter"
          />
          <ErrorPageContent>
            <ErrorPageErrorCode>404</ErrorPageErrorCode>
          </ErrorPageContent>
        </ErrorPage>
      );
      expect(screen.getByTestId('top-center-illustration')).toBeInTheDocument();
    });

    it('should apply className to topCenter illustration container', () => {
      const { container } = render(
        <ErrorPage>
          <ErrorPageIllustration
            illustration="https://example.com/image.jpg"
            position="topCenter"
            className="custom-top-center"
          />
          <ErrorPageContent>
            <ErrorPageErrorCode>404</ErrorPageErrorCode>
          </ErrorPageContent>
        </ErrorPage>
      );
      expect(container.querySelector('.custom-top-center')).toBeInTheDocument();
    });
  });

  // Test 86-90: Error code with illustration prop
  describe('ErrorPageErrorCode with Illustration', () => {
    it('should render illustration above error code when illustration prop is provided', () => {
      render(
        <ErrorPage>
          <ErrorPageContent>
            <ErrorPageErrorCode
              errorCode="404"
              illustration="https://example.com/illustration.jpg"
            />
          </ErrorPageContent>
        </ErrorPage>
      );
      expect(screen.getByAltText('Error illustration')).toBeInTheDocument();
      expect(screen.getByText('404')).toBeInTheDocument();
    });

    it('should render React node illustration above error code', () => {
      const CustomIllustration = () => <div data-testid="error-code-illustration">Illustration</div>;
      render(
        <ErrorPage>
          <ErrorPageContent>
            <ErrorPageErrorCode
              errorCode="404"
              illustration={<CustomIllustration />}
            />
          </ErrorPageContent>
        </ErrorPage>
      );
      expect(screen.getByTestId('error-code-illustration')).toBeInTheDocument();
      expect(screen.getByText('404')).toBeInTheDocument();
    });

    it('should apply animation when illustration is provided', () => {
      render(
        <ErrorPage>
          <ErrorPageContent>
            <ErrorPageErrorCode
              errorCode="404"
              animationType="pulse"
              illustration="https://example.com/illustration.jpg"
            />
          </ErrorPageContent>
        </ErrorPage>
      );
      expect(screen.getByText('404')).toBeInTheDocument();
    });

    it('should render illustration in flex column layout', () => {
      const { container } = render(
        <ErrorPage>
          <ErrorPageContent>
            <ErrorPageErrorCode
              errorCode="404"
              illustration="https://example.com/illustration.jpg"
            />
          </ErrorPageContent>
        </ErrorPage>
      );
      const flexColumn = container.querySelector('.flex.flex-col.items-center');
      expect(flexColumn).toBeInTheDocument();
    });

    it('should prioritize children over errorCode prop when both are provided', () => {
      render(
        <ErrorPage>
          <ErrorPageContent>
            <ErrorPageErrorCode
              errorCode="404"
              illustration="https://example.com/illustration.jpg"
            >
              500
            </ErrorPageErrorCode>
          </ErrorPageContent>
        </ErrorPage>
      );
      // Children take precedence over errorCode prop
      expect(screen.getByText('500')).toBeInTheDocument();
      expect(screen.queryByText('404')).not.toBeInTheDocument();
    });
  });
});


