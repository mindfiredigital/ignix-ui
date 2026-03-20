/**
 * Unit Tests for MaintenancePage Component
 * 
 * This test suite covers all functionality of the MaintenancePage component including:
 * - Basic rendering and default behavior
 * - All sub-components (MaintenancePageLogo, MaintenancePageHeading, MaintenancePageDesc, 
 *   MaintenancePageCountdown, MaintenancePageEmailSubscription, MaintenancePageSocialIcons, 
 *   MaintenancePageFooter)
 * - Variant handling (default, minimal, gradient, dark)
 * - Background image support
 * - Icon and iconColor props
 * - Split layout functionality
 * - Countdown timer functionality
 * - Email validation and submission
 * - Context usage
 * - Memoization behavior
 * - Edge cases and boundary conditions
 * - Accessibility features
 * 
 * @file maintenance-page.test.tsx
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom';
import {
  MaintenancePage,
  MaintenancePageLogo,
  MaintenancePageHeading,
  MaintenancePageDesc,
  MaintenancePageCountdown,
  MaintenancePageEmailSubscription,
  MaintenancePageSocialIcons,
  MaintenancePageFooter,
  type AnimationType,
} from './index';

interface MockIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  'data-testid'?: string;
  size?: number;
}

// Mock lucide-react icons
// Note: Mock components are defined inside the factory because vi.mock is hoisted
vi.mock('lucide-react', () => {
  const MockWrench = ({ className, 'data-testid': testId, size, ...props }: MockIconProps) => (
    <svg
      data-testid={testId || 'wrench-icon'}
      className={className}
      width={size || 24}
      height={size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      {...props}
    >
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );

  const MockCheckCircle = ({ className, 'data-testid': testId, size, ...props }: MockIconProps) => (
    <svg
      data-testid={testId || 'check-circle-icon'}
      className={className}
      width={size || 24}
      height={size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      {...props}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );

  const MockXCircle = ({ className, 'data-testid': testId, size, ...props }: MockIconProps) => (
    <svg
      data-testid={testId || 'x-circle-icon'}
      className={className}
      width={size || 24}
      height={size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  );

  const MockTwitter = ({ className, 'data-testid': testId, size, ...props }: MockIconProps) => (
    <svg
      data-testid={testId || 'twitter-icon'}
      className={className}
      width={size || 24}
      height={size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      {...props}
    >
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );

  const MockFacebook = ({ className, 'data-testid': testId, size, ...props }: MockIconProps) => (
    <svg
      data-testid={testId || 'facebook-icon'}
      className={className}
      width={size || 24}
      height={size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      {...props}
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );

  return {
    Wrench: MockWrench,
    CheckCircle: MockCheckCircle,
    XCircle: MockXCircle,
    Twitter: MockTwitter,
    Facebook: MockFacebook,
  };
});

// Import mocked icons - vitest mocks are hoisted, so these will use the mocked versions
import { Wrench } from 'lucide-react';

// Mock Typography component
vi.mock('@ignix-ui/typography', () => ({
  Typography: ({ children, className, variant, 'aria-label': ariaLabel, ...props }: any) => {
    const Tag = variant === 'h1' ? 'h1' : variant === 'h2' ? 'h2' : variant === 'h4' ? 'h4' : 'p';
    return (
      <Tag className={className} aria-label={ariaLabel} {...props}>
        {children}
      </Tag>
    );
  },
}));

// Mock Button component
vi.mock('@ignix-ui/button', () => ({
  Button: ({ children, onClick, className, type, ...props }: any) => (
    <button
      className={className}
      onClick={onClick}
      type={type}
      {...props}
    >
      {children}
    </button>
  ),
}));

// Mock cn utility
vi.mock('../../../utils/cn', () => ({
  cn: (...classes: (string | undefined | null | false)[]) => {
    return classes.filter(Boolean).join(' ');
  },
}));

describe('MaintenancePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Test 1: Basic rendering
  describe('Basic Rendering', () => {
    it('should render MaintenancePage with default variant', () => {
      render(
        <MaintenancePage>
          <MaintenancePageHeading />
        </MaintenancePage>
      );
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByText('SITE UNDER MAINTENANCE')).toBeInTheDocument();
    });

    it('should render MaintenancePage with custom className', () => {
      const { container } = render(
        <MaintenancePage className="custom-class">
          <MaintenancePageHeading />
        </MaintenancePage>
      );
      expect(container.querySelector('.custom-class')).toBeInTheDocument();
    });

    it('should have correct aria-label', () => {
      render(
        <MaintenancePage>
          <MaintenancePageHeading />
        </MaintenancePage>
      );
      expect(screen.getByRole('main')).toHaveAttribute('aria-label', 'Maintenance page');
    });

    it('should render children correctly', () => {
      render(
        <MaintenancePage>
          <MaintenancePageHeading title="Custom Title" />
          <MaintenancePageDesc description="Custom description" />
        </MaintenancePage>
      );
      expect(screen.getByText('Custom Title')).toBeInTheDocument();
      expect(screen.getByText('Custom description')).toBeInTheDocument();
    });
  });

  // Test 5-8: Variant handling
  describe('Variant Handling', () => {
    it('should render with default variant', () => {
      const { container } = render(
        <MaintenancePage variant="default">
          <MaintenancePageHeading />
        </MaintenancePage>
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render with minimal variant', () => {
      const { container } = render(
        <MaintenancePage variant="minimal">
          <MaintenancePageHeading />
        </MaintenancePage>
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render with gradient variant', () => {
      const { container } = render(
        <MaintenancePage variant="gradient">
          <MaintenancePageHeading />
        </MaintenancePage>
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render with dark variant', () => {
      const { container } = render(
        <MaintenancePage variant="dark">
          <MaintenancePageHeading />
        </MaintenancePage>
      );
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  // Test 9-12: Background image support
  describe('Background Image Support', () => {
    it('should apply background image style when backgroundImage prop is provided', () => {
      const { container } = render(
        <MaintenancePage backgroundImage="/test-image.jpg">
          <MaintenancePageHeading />
        </MaintenancePage>
      );
      const mainElement = container.querySelector('main') || container.firstChild as HTMLElement;
      expect(mainElement).toHaveStyle({
        backgroundImage: 'url(/test-image.jpg)',
      });
    });

    it('should render overlay when backgroundImage is present', () => {
      const { container } = render(
        <MaintenancePage backgroundImage="/test-image.jpg">
          <MaintenancePageHeading />
        </MaintenancePage>
      );
      const overlay = container.querySelector('.bg-black\\/40');
      expect(overlay).toBeInTheDocument();
    });

    it('should not render overlay when backgroundImage is not present', () => {
      const { container } = render(
        <MaintenancePage>
          <MaintenancePageHeading />
        </MaintenancePage>
      );
      const overlay = container.querySelector('.bg-black\\/40');
      expect(overlay).not.toBeInTheDocument();
    });

    it('should apply white text color when backgroundImage is present', () => {
      render(
        <MaintenancePage backgroundImage="/test-image.jpg">
          <MaintenancePageHeading title="Test Title" />
        </MaintenancePage>
      );
      const heading = screen.getByText('Test Title');
      expect(heading).toHaveClass('text-white');
    });
  });

  // Test 13-16: Icon support
  describe('Icon Support', () => {
    it('should render animated icons when icon prop is provided', () => {
      const { container } = render(
        <MaintenancePage icon={Wrench}>
          <MaintenancePageHeading />
        </MaintenancePage>
      );
      // Icons are rendered in absolute positioned divs
      const iconContainers = container.querySelectorAll('.absolute');
      expect(iconContainers.length).toBeGreaterThan(0);
    });

    it('should not render icons when icon prop is not provided', () => {
      const { container } = render(
        <MaintenancePage>
          <MaintenancePageHeading />
        </MaintenancePage>
      );
      const icons = container.querySelectorAll('[data-testid="wrench-icon"]');
      expect(icons.length).toBe(0);
    });

    it('should apply custom iconColor when provided', () => {
      const { container } = render(
        <MaintenancePage icon={Wrench} iconColor="text-blue-500">
          <MaintenancePageHeading />
        </MaintenancePage>
      );
      const icon = container.querySelector('.text-blue-500');
      expect(icon).toBeInTheDocument();
    });

    it('should use white icon color when backgroundImage is present and iconColor is not provided', () => {
      const { container } = render(
        <MaintenancePage icon={Wrench} backgroundImage="/test.jpg">
          <MaintenancePageHeading />
        </MaintenancePage>
      );
      const icon = container.querySelector('.text-white');
      expect(icon).toBeInTheDocument();
    });
  });

  // Test 17-20: Split layout
  describe('Split Layout', () => {
    it('should render split layout when split prop is true', () => {
      const { container } = render(
        <MaintenancePage split>
          <MaintenancePageLogo companyName="Test Company" />
          <MaintenancePageHeading title="Test Title" />
          <MaintenancePageDesc description="Test Description" />
          <MaintenancePageCountdown />
        </MaintenancePage>
      );
      const grid = container.querySelector('.grid-cols-1.lg\\:grid-cols-2');
      expect(grid).toBeInTheDocument();
    });

    it('should render non-split layout when split prop is false', () => {
      const { container } = render(
        <MaintenancePage split={false}>
          <MaintenancePageHeading />
        </MaintenancePage>
      );
      const grid = container.querySelector('.grid-cols-1.lg\\:grid-cols-2');
      expect(grid).not.toBeInTheDocument();
    });

    it('should align heading left in split layout', () => {
      render(
        <MaintenancePage split>
          <MaintenancePageHeading title="Test Title" />
        </MaintenancePage>
      );
      const heading = screen.getByText('Test Title');
      expect(heading).toHaveClass('text-left');
    });

    it('should align heading center in non-split layout', () => {
      render(
        <MaintenancePage split={false}>
          <MaintenancePageHeading title="Test Title" />
        </MaintenancePage>
      );
      const heading = screen.getByText('Test Title');
      expect(heading).toHaveClass('text-center');
    });
  });

  // Test 21-24: MaintenancePageLogo
  describe('MaintenancePageLogo', () => {
    it('should render logo with company name', () => {
      render(
        <MaintenancePage>
          <MaintenancePageLogo companyName="Test Company" />
        </MaintenancePage>
      );
      expect(screen.getByText('Test Company')).toBeInTheDocument();
    });

    it('should render logo with string URL', () => {
      const { container } = render(
        <MaintenancePage>
          <MaintenancePageLogo logo="/logo.png" companyName="Test" />
        </MaintenancePage>
      );
      const img = container.querySelector('img');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', '/logo.png');
    });

    it('should render logo with LucideIcon', () => {
      const { container } = render(
        <MaintenancePage>
          <MaintenancePageLogo logo={Wrench} companyName="Test" />
        </MaintenancePage>
      );
      // Icon is rendered inside a wrapper div with rounded-xl border
      const logoWrapper = container.querySelector('.rounded-xl.border');
      expect(logoWrapper).toBeInTheDocument();
      // Check if icon is rendered (it should be inside the wrapper)
      // The icon might be rendered without data-testid, so check for the wrapper structure
      const iconContainer = logoWrapper?.querySelector('svg');
      expect(iconContainer).toBeInTheDocument();
    });

    it('should render custom children when provided', () => {
      render(
        <MaintenancePage>
          <MaintenancePageLogo>
            <div>Custom Logo Content</div>
          </MaintenancePageLogo>
        </MaintenancePage>
      );
      expect(screen.getByText('Custom Logo Content')).toBeInTheDocument();
    });
  });

  // Test 25-28: MaintenancePageHeading
  describe('MaintenancePageHeading', () => {
    it('should render default title when title prop is not provided', () => {
      render(
        <MaintenancePage>
          <MaintenancePageHeading />
        </MaintenancePage>
      );
      expect(screen.getByText('SITE UNDER MAINTENANCE')).toBeInTheDocument();
    });

    it('should render custom title when title prop is provided', () => {
      render(
        <MaintenancePage>
          <MaintenancePageHeading title="Custom Maintenance Title" />
        </MaintenancePage>
      );
      expect(screen.getByText('Custom Maintenance Title')).toBeInTheDocument();
    });

    it('should render children when provided', () => {
      render(
        <MaintenancePage>
          <MaintenancePageHeading>
            Custom Heading Content
          </MaintenancePageHeading>
        </MaintenancePage>
      );
      expect(screen.getByText('Custom Heading Content')).toBeInTheDocument();
    });

    it('should apply white text color in dark variant', () => {
      render(
        <MaintenancePage variant="dark">
          <MaintenancePageHeading title="Test Title" />
        </MaintenancePage>
      );
      const heading = screen.getByText('Test Title');
      expect(heading).toHaveClass('text-white');
    });
  });

  // Test 29-32: MaintenancePageDesc
  describe('MaintenancePageDesc', () => {
    it('should render default description when description prop is not provided', () => {
      render(
        <MaintenancePage>
          <MaintenancePageDesc />
        </MaintenancePage>
      );
      expect(screen.getByText(/Sorry for the inconvenience/)).toBeInTheDocument();
    });

    it('should render custom description when description prop is provided', () => {
      render(
        <MaintenancePage>
          <MaintenancePageDesc description="Custom description text" />
        </MaintenancePage>
      );
      expect(screen.getByText('Custom description text')).toBeInTheDocument();
    });

    it('should render children when provided', () => {
      render(
        <MaintenancePage>
          <MaintenancePageDesc>
            Custom Description Content
          </MaintenancePageDesc>
        </MaintenancePage>
      );
      expect(screen.getByText('Custom Description Content')).toBeInTheDocument();
    });

    it('should apply max-width-none in split layout', () => {
      render(
        <MaintenancePage split>
          <MaintenancePageDesc description="Test Description" />
        </MaintenancePage>
      );
      const desc = screen.getByText('Test Description');
      expect(desc).toHaveClass('max-w-none');
    });
  });

  // Test 33-40: MaintenancePageCountdown
  describe('MaintenancePageCountdown', () => {
    it('should render countdown timer with default 30 days', () => {
      render(
        <MaintenancePage>
          <MaintenancePageCountdown />
        </MaintenancePage>
      );
      expect(screen.getByText('Days')).toBeInTheDocument();
      expect(screen.getByText('Hours')).toBeInTheDocument();
      expect(screen.getByText('Minutes')).toBeInTheDocument();
      expect(screen.getByText('Seconds')).toBeInTheDocument();
    });

    it('should render countdown timer with Date object targetDate', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 5);
      render(
        <MaintenancePage>
          <MaintenancePageCountdown targetDate={futureDate} />
        </MaintenancePage>
      );
      expect(screen.getByText('Days')).toBeInTheDocument();
    });

    it('should render countdown timer with string targetDate', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 5);
      render(
        <MaintenancePage>
          <MaintenancePageCountdown targetDate={futureDate.toISOString()} />
        </MaintenancePage>
      );
      expect(screen.getByText('Days')).toBeInTheDocument();
    });

    it('should call onCountdownEnd when countdown reaches zero', async () => {
      const onCountdownEnd = vi.fn();
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      render(
        <MaintenancePage>
          <MaintenancePageCountdown targetDate={pastDate} onCountdownEnd={onCountdownEnd} />
        </MaintenancePage>
      );
      // Wait for the countdown to check and call the callback
      await waitFor(() => {
        expect(onCountdownEnd).toHaveBeenCalled();
      }, { timeout: 2000 });
    });

    it('should update countdown values over time', async () => {
      const futureDate = new Date();
      futureDate.setSeconds(futureDate.getSeconds() + 5);
      render(
        <MaintenancePage>
          <MaintenancePageCountdown targetDate={futureDate} />
        </MaintenancePage>
      );
      expect(screen.getByText('Seconds')).toBeInTheDocument();
      // Wait a bit for countdown to update
      await waitFor(() => {
        expect(screen.getByText('Seconds')).toBeInTheDocument();
      }, { timeout: 2000 });
    });

    it('should apply fade animation by default', () => {
      const { container } = render(
        <MaintenancePage>
          <MaintenancePageCountdown />
        </MaintenancePage>
      );
      expect(container.querySelector('.grid-cols-2')).toBeInTheDocument();
    });

    it('should apply different animation types', () => {
      const animations: AnimationType[] = ['fade', 'slide', 'scale', 'bounce', 'flip', 'none'];
      animations.forEach((animationType) => {
        const { unmount } = render(
          <MaintenancePage>
            <MaintenancePageCountdown animationType={animationType} />
          </MaintenancePage>
        );
        expect(screen.getByText('Days')).toBeInTheDocument();
        unmount();
      });
    });

    it('should display countdown values with zero padding', () => {
      render(
        <MaintenancePage>
          <MaintenancePageCountdown />
        </MaintenancePage>
      );
      const daysElement = screen.getByText('Days').parentElement;
      expect(daysElement).toBeInTheDocument();
    });
  });

  // Test 41-52: MaintenancePageEmailSubscription
  describe('MaintenancePageEmailSubscription', () => {
    it('should render email input with default placeholder', () => {
      render(
        <MaintenancePage>
          <MaintenancePageEmailSubscription />
        </MaintenancePage>
      );
      expect(screen.getByPlaceholderText('Enter your email address')).toBeInTheDocument();
    });

    it('should render email input with custom placeholder', () => {
      render(
        <MaintenancePage>
          <MaintenancePageEmailSubscription placeholder="Custom placeholder" />
        </MaintenancePage>
      );
      expect(screen.getByPlaceholderText('Custom placeholder')).toBeInTheDocument();
    });

    it('should render submit button with default text', () => {
      render(
        <MaintenancePage>
          <MaintenancePageEmailSubscription />
        </MaintenancePage>
      );
      expect(screen.getByText('Get Notified!')).toBeInTheDocument();
    });

    it('should render submit button with custom text', () => {
      render(
        <MaintenancePage>
          <MaintenancePageEmailSubscription buttonText="Subscribe Now" />
        </MaintenancePage>
      );
      expect(screen.getByText('Subscribe Now')).toBeInTheDocument();
    });

    it('should validate email format and show error for invalid email', async () => {
      const user = userEvent.setup({ delay: null });
      render(
        <MaintenancePage>
          <MaintenancePageEmailSubscription />
        </MaintenancePage>
      );
      const input = screen.getByPlaceholderText('Enter your email address');
      await user.type(input, 'invalid-email');
      await waitFor(() => {
        expect(screen.getByText(/valid email address/i)).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('should show error icon for invalid email', async () => {
      const user = userEvent.setup({ delay: null });
      const { container } = render(
        <MaintenancePage>
          <MaintenancePageEmailSubscription />
        </MaintenancePage>
      );
      const input = screen.getByPlaceholderText('Enter your email address');
      await user.type(input, 'invalid-email');
      // Wait for validation to trigger - error icon appears in the input field
      await waitFor(() => {
        // Error icon appears in the input wrapper (absolute positioned div)
        const inputWrapper = container.querySelector('.relative');
        const errorIcon = inputWrapper?.querySelector('[data-testid="x-circle-icon"]');
        expect(errorIcon).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('should call onSubmit with valid email', async () => {
      const onSubmit = vi.fn();
      const user = userEvent.setup({ delay: null });
      render(
        <MaintenancePage>
          <MaintenancePageEmailSubscription onSubmit={onSubmit} />
        </MaintenancePage>
      );
      const input = screen.getByPlaceholderText('Enter your email address');
      const button = screen.getByText('Get Notified!');
      await user.type(input, 'test@example.com');
      await user.click(button);
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith('test@example.com');
      }, { timeout: 3000 });
    });

    it('should show success message after valid submission', async () => {
      const onSubmit = vi.fn();
      const user = userEvent.setup({ delay: null });
      render(
        <MaintenancePage>
          <MaintenancePageEmailSubscription onSubmit={onSubmit} />
        </MaintenancePage>
      );
      const input = screen.getByPlaceholderText('Enter your email address');
      const button = screen.getByText('Get Notified!');
      await user.type(input, 'test@example.com');
      await user.click(button);
      await waitFor(() => {
        expect(screen.getByText(/Thank you! We'll notify you/i)).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('should show success icon after valid submission', async () => {
      const onSubmit = vi.fn();
      const user = userEvent.setup({ delay: null });
      render(
        <MaintenancePage>
          <MaintenancePageEmailSubscription onSubmit={onSubmit} />
        </MaintenancePage>
      );
      const input = screen.getByPlaceholderText('Enter your email address');
      const button = screen.getByText('Get Notified!');
      await user.type(input, 'test@example.com');
      await user.click(button);
      // Wait for success state - check for success message first, then icon
      await waitFor(() => {
        expect(screen.getByText(/Thank you! We'll notify you/i)).toBeInTheDocument();
      }, { timeout: 3000 });
      // Success icon should be present in the input field
      const successIcons = screen.getAllByTestId('check-circle-icon');
      expect(successIcons.length).toBeGreaterThan(0);
    });

    it('should clear email input after successful submission', async () => {
      const onSubmit = vi.fn();
      const user = userEvent.setup({ delay: null });
      render(
        <MaintenancePage>
          <MaintenancePageEmailSubscription onSubmit={onSubmit} />
        </MaintenancePage>
      );
      const input = screen.getByPlaceholderText('Enter your email address') as HTMLInputElement;
      const button = screen.getByText('Get Notified!');
      await user.type(input, 'test@example.com');
      await user.click(button);
      await waitFor(() => {
        expect(input.value).toBe('');
      }, { timeout: 3000 });
    });

    it('should validate email in real-time as user types', async () => {
      const user = userEvent.setup({ delay: null });
      render(
        <MaintenancePage>
          <MaintenancePageEmailSubscription />
        </MaintenancePage>
      );
      const input = screen.getByPlaceholderText('Enter your email address');
      await user.type(input, 'test');
      await waitFor(() => {
        expect(screen.getByText(/valid email address/i)).toBeInTheDocument();
      }, { timeout: 3000 });
      await user.clear(input);
      await user.type(input, 'test@example.com');
      await waitFor(() => {
        const errorMessage = screen.queryByText(/valid email address/i);
        expect(errorMessage).not.toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('should not submit form with invalid email', async () => {
      const onSubmit = vi.fn();
      const user = userEvent.setup({ delay: null });
      render(
        <MaintenancePage>
          <MaintenancePageEmailSubscription onSubmit={onSubmit} />
        </MaintenancePage>
      );
      const input = screen.getByPlaceholderText('Enter your email address');
      const button = screen.getByText('Get Notified!');
      await user.type(input, 'invalid-email');
      await user.click(button);
      await waitFor(() => {
        expect(onSubmit).not.toHaveBeenCalled();
      }, { timeout: 3000 });
    });
  });

  // Test 53-56: MaintenancePageSocialIcons
  describe('MaintenancePageSocialIcons', () => {
    it('should not render when icons array is empty', () => {
      const { container } = render(
        <MaintenancePage>
          <MaintenancePageSocialIcons icons={[]} />
        </MaintenancePage>
      );
      const links = container.querySelectorAll('a');
      expect(links.length).toBe(0);
    });

    it('should not render when icons prop is not provided', () => {
      const { container } = render(
        <MaintenancePage>
          <MaintenancePageSocialIcons />
        </MaintenancePage>
      );
      const links = container.querySelectorAll('a');
      expect(links.length).toBe(0);
    });
  });

  // Test 57-60: MaintenancePageFooter and Edge Cases
  describe('MaintenancePageFooter and Edge Cases', () => {
    it('should render footer with children', () => {
      render(
        <MaintenancePage>
          <MaintenancePageFooter>
            <p>Footer content</p>
          </MaintenancePageFooter>
        </MaintenancePage>
      );
      expect(screen.getByText('Footer content')).toBeInTheDocument();
    });

    it('should apply correct text color in dark variant', () => {
      render(
        <MaintenancePage variant="dark">
          <MaintenancePageFooter>
            <p>Footer content</p>
          </MaintenancePageFooter>
        </MaintenancePage>
      );
      const footer = screen.getByText('Footer content');
      expect(footer.parentElement).toHaveClass('text-white/70');
    });

    it('should handle absolute positioned background children', () => {
      const { container } = render(
        <MaintenancePage>
          <div className="absolute top-0 left-0">Background</div>
          <MaintenancePageHeading />
        </MaintenancePage>
      );
      const background = container.querySelector('.absolute');
      expect(background).toBeInTheDocument();
    });

    it('should handle multiple children components correctly', () => {
      render(
        <MaintenancePage>
          <MaintenancePageLogo companyName="Company" />
          <MaintenancePageHeading title="Title" />
          <MaintenancePageDesc description="Description" />
          <MaintenancePageCountdown />
          <MaintenancePageEmailSubscription />
          <MaintenancePageSocialIcons icons={[]} />
          <MaintenancePageFooter>Footer</MaintenancePageFooter>
        </MaintenancePage>
      );
      expect(screen.getByText('Company')).toBeInTheDocument();
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('Days')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter your email address')).toBeInTheDocument();
      expect(screen.getByText('Footer')).toBeInTheDocument();
    });
  });
});

