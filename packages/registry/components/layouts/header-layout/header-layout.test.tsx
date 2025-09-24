import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom';
import { HeaderLayout, type HeaderLayoutProps } from '.';

vi.mock('lucide-react', () => ({
  Menu: () => <div data-testid="menu-icon" />,
  X: () => <div data-testid="x-icon" />,
}));

// Mock framer-motion to remove animation delays and complexity from tests
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return {
    ...actual,
    motion: {
      ...actual,
      div: React.forwardRef(({ ...props }, ref: React.Ref<HTMLDivElement>) => (
        <div {...props} ref={ref} />
      )),
      aside: React.forwardRef(({ ...props }, ref: React.Ref<HTMLDivElement>) => (
        <aside {...props} ref={ref} />
      )),
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

// Helper function to set the viewport size
const setViewport = (width: number) => {
  window.innerWidth = width;
  act(() => {
    window.dispatchEvent(new Event('resize'));
  });
};

describe('HeaderLayout', () => {
  // Store original window properties to restore after tests
  const originalInnerWidth = window.innerWidth;

  afterEach(() => {
    window.innerWidth = originalInnerWidth;
    vi.clearAllMocks();
  });

  const defaultProps: HeaderLayoutProps = {
    header: <header>Header Content</header>,
    sidebar: <nav>Sidebar Content</nav>,
    footer: <footer>Footer Content</footer>,
    children: <main>Main Content</main>,
  };

  it('renders all layout components correctly', () => {
    render(<HeaderLayout {...defaultProps} />);

    expect(screen.getByText('Header Content')).toBeInTheDocument();
    expect(screen.getByText('Sidebar Content')).toBeInTheDocument();
    expect(screen.getByText('Footer Content')).toBeInTheDocument();
    expect(screen.getByText('Main Content')).toBeInTheDocument();
  });

  it('applies custom className and variant', () => {
    const { container } = render(
      <HeaderLayout {...defaultProps} className="custom-class" variant="dark" />
    );
    const rootElement = container.firstChild as HTMLElement;

    expect(rootElement).toHaveClass('custom-class');
    expect(rootElement).toHaveClass('bg-card'); // from the 'dark' variant
  });

  it('applies custom CSS variables for dimensions', () => {
    const { container } = render(
      <HeaderLayout
        {...defaultProps}
        headerHeight={80}
        sidebarWidth={300}
        footerHeight={50}
      />
    );
    const rootElement = container.firstChild as HTMLElement;

    expect(rootElement.style.getPropertyValue('--header-h')).toBe('80px');
    expect(rootElement.style.getPropertyValue('--sidebar-w')).toBe('300px');
    expect(rootElement.style.getPropertyValue('--footer-h')).toBe('50px');
  });

  describe('Desktop View', () => {
    beforeEach(() => {
      setViewport(1280); // Desktop width
    });

    it('displays the sidebar as a sticky element', () => {
      render(<HeaderLayout {...defaultProps} />);
      const sidebar = screen.getByText('Sidebar Content').closest('aside');

      // 'hidden md:block' makes it visible on desktop
      expect(sidebar).toBeVisible();
      expect(sidebar).toHaveClass('sticky');
    });

    it('collapses the sidebar when sidebarCollapsed is true', () => {
      render(<HeaderLayout {...defaultProps} sidebarCollapsed />);
      const sidebar = screen.getByText('Sidebar Content').closest('aside');

      // The animation target width should be 0
      expect(sidebar).toHaveStyle('width: 0px');
    });

    it('positions the sidebar on the right when specified', () => {
      render(<HeaderLayout {...defaultProps} sidebarPosition="right" />);
      const sidebar = screen.getByText('Sidebar Content').closest('aside');
      expect(sidebar).toHaveClass('order-2');
    });

    it('does not render mobile-specific elements', () => {
      render(<HeaderLayout {...defaultProps} />);
      expect(screen.queryByTestId('menu-icon')).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /open sidebar/i })).not.toBeInTheDocument();
    });
  });

  describe('Mobile View', () => {
    beforeEach(() => {
      // Use a mobile width based on the default `md` breakpoint (768px)
      setViewport(640);
    });

    it('opens and closes the sidebar when the toggle button is clicked', async () => {
      const user = userEvent.setup();
      const onSidebarToggle = vi.fn();
      render(<HeaderLayout {...defaultProps} onSidebarToggle={onSidebarToggle} />);

      const toggleButton = screen.getByRole('button', { name: /open sidebar/i });
      
      // --- Open Sidebar ---
      await user.click(toggleButton);

      expect(screen.getByRole('button', { name: /close sidebar/i })).toBeVisible();
      expect(screen.getByTestId('x-icon')).toBeInTheDocument();
      // The overlay should be present when sidebar is open
      expect(document.querySelector('.fixed.inset-0')).toBeInTheDocument();
      expect(onSidebarToggle).toHaveBeenCalledWith(true);

      // --- Close Sidebar ---
      const closeButton = screen.getByRole('button', { name: /close sidebar/i });
      await user.click(closeButton);

      expect(screen.getByRole('button', { name: /open sidebar/i })).toBeVisible();
      expect(screen.getByTestId('menu-icon')).toBeInTheDocument();
      expect(onSidebarToggle).toHaveBeenCalledWith(false);
      expect(onSidebarToggle).toHaveBeenCalledTimes(4);
    });

    it('closes the sidebar when the overlay is clicked', async () => {
      const user = userEvent.setup();
      const onSidebarToggle = vi.fn();
      render(<HeaderLayout {...defaultProps} onSidebarToggle={onSidebarToggle} />);

      // First, open the sidebar
      await user.click(screen.getByRole('button', { name: /open sidebar/i }));
      expect(onSidebarToggle).toHaveBeenCalledWith(true);

      // The overlay is the div with z-index 80
      const overlay = document.querySelector('.fixed.inset-0');
      expect(overlay).toBeInTheDocument();

      // Click the overlay
      await user.click(overlay as HTMLElement);
      
      expect(onSidebarToggle).toHaveBeenCalledWith(false);
      expect(onSidebarToggle).toHaveBeenCalledTimes(4);
      expect(screen.getByRole('button', { name: /open sidebar/i })).toBeVisible();
    });
  });
});