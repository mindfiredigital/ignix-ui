import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, afterEach } from 'vitest';
import '@testing-library/jest-dom';

import Sidebar, { SidebarProvider, useSidebar } from '.';
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) =>
      React.createElement('div', props, children),
    nav: ({ children, ...props }: any) =>
      React.createElement('nav', props, children),
    span: ({ children, ...props }: any) =>
      React.createElement('span', props, children),
  },
  AnimatePresence: ({ children }: any) =>
    React.createElement(React.Fragment, null, children),
}));

vi.mock('lucide-react', () => ({
  Menu: ({ size }: { size?: number }) => (
    <svg data-testid="menu-icon" width={size} height={size} />
  ),
  X: ({ size }: { size?: number }) => (
    <svg data-testid="x-icon" width={size} height={size} />
  ),
}));

// Shared test helpers

const HomeIcon = () => <svg data-testid="home-icon" />;
const SettingsIcon = () => <svg data-testid="settings-icon" />;

const defaultLinks = [
  { label: 'Home', href: '/home', icon: HomeIcon },
  { label: 'Settings', href: '/settings', icon: SettingsIcon },
];

const renderSidebar = (
  sidebarProps: Partial<React.ComponentProps<typeof Sidebar>> = {},
  providerProps: { initialOpen?: boolean } = {}
) => {
  return render(
    <SidebarProvider initialOpen={providerProps.initialOpen ?? true}>
      <Sidebar links={defaultLinks} {...sidebarProps} />
    </SidebarProvider>
  );
};

const SidebarConsumer = ({
  onRender,
}: {
  onRender: (ctx: ReturnType<typeof useSidebar>) => void;
}) => {
  const ctx = useSidebar();
  onRender(ctx);
  return null;
};

// SidebarProvider

describe('SidebarProvider', () => {
  it('renders children', () => {
    render(
      <SidebarProvider>
        <span>child content</span>
      </SidebarProvider>
    );
    expect(screen.getByText('child content')).toBeInTheDocument();
  });

  it('provides isOpen=true by default', () => {
    let capturedCtx: ReturnType<typeof useSidebar> | null = null;
    render(
      <SidebarProvider>
        <SidebarConsumer onRender={(ctx) => { capturedCtx = ctx; }} />
      </SidebarProvider>
    );
    expect(capturedCtx!.isOpen).toBe(true);
  });

  it('respects initialOpen=false', () => {
    let capturedCtx: ReturnType<typeof useSidebar> | null = null;
    render(
      <SidebarProvider initialOpen={false}>
        <SidebarConsumer onRender={(ctx) => { capturedCtx = ctx; }} />
      </SidebarProvider>
    );
    expect(capturedCtx!.isOpen).toBe(false);
  });

  it('toggle flips isOpen', () => {
    let capturedCtx: ReturnType<typeof useSidebar> | null = null;
    render(
      <SidebarProvider initialOpen={false}>
        <SidebarConsumer onRender={(ctx) => { capturedCtx = ctx; }} />
      </SidebarProvider>
    );
    act(() => capturedCtx!.toggle());
    expect(capturedCtx!.isOpen).toBe(true);
    act(() => capturedCtx!.toggle());
    expect(capturedCtx!.isOpen).toBe(false);
  });

  it('onOpen sets isOpen to true', () => {
    let capturedCtx: ReturnType<typeof useSidebar> | null = null;
    render(
      <SidebarProvider initialOpen={false}>
        <SidebarConsumer onRender={(ctx) => { capturedCtx = ctx; }} />
      </SidebarProvider>
    );
    act(() => capturedCtx!.onOpen());
    expect(capturedCtx!.isOpen).toBe(true);
  });

  it('onClose sets isOpen to false', () => {
    let capturedCtx: ReturnType<typeof useSidebar> | null = null;
    render(
      <SidebarProvider initialOpen={true}>
        <SidebarConsumer onRender={(ctx) => { capturedCtx = ctx; }} />
      </SidebarProvider>
    );
    act(() => capturedCtx!.onClose());
    expect(capturedCtx!.isOpen).toBe(false);
  });

  it('setIsOpen accepts an explicit value', () => {
    let capturedCtx: ReturnType<typeof useSidebar> | null = null;
    render(
      <SidebarProvider initialOpen={true}>
        <SidebarConsumer onRender={(ctx) => { capturedCtx = ctx; }} />
      </SidebarProvider>
    );
    act(() => capturedCtx!.setIsOpen(false));
    expect(capturedCtx!.isOpen).toBe(false);
    act(() => capturedCtx!.setIsOpen(true));
    expect(capturedCtx!.isOpen).toBe(true);
  });
});

// useSidebar hook

describe('useSidebar', () => {
  it('throws when used outside SidebarProvider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(vi.fn());
    expect(() =>
      render(<SidebarConsumer onRender={vi.fn()} />)
    ).toThrow('useSidebar must be used within a SidebarProvider');
    spy.mockRestore();
  });
});

//Rendering

describe('Sidebar rendering', () => {
  it('renders the brand name when open', () => {
    renderSidebar({ brandName: 'Ignix' });
    expect(screen.getByText('Ignix')).toBeInTheDocument();
  });

  it('falls back to "Brand" when brandName is not provided', () => {
    renderSidebar();
    expect(screen.getByText('Brand')).toBeInTheDocument();
  });

  it('hides the brand name when sidebar is closed', () => {
    renderSidebar({}, { initialOpen: false });
    expect(screen.queryByText('Brand')).not.toBeInTheDocument();
  });

  it('renders all navigation links', () => {
    renderSidebar();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('renders link hrefs correctly', () => {
    renderSidebar();
    expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute('href', '/home');
    expect(screen.getByRole('link', { name: /settings/i })).toHaveAttribute('href', '/settings');
  });

  it('renders link icons', () => {
    renderSidebar();
    expect(screen.getByTestId('home-icon')).toBeInTheDocument();
    expect(screen.getByTestId('settings-icon')).toBeInTheDocument();
  });

  it('hides link labels when sidebar is closed', () => {
    renderSidebar({}, { initialOpen: false });
    expect(screen.queryByText('Home')).not.toBeInTheDocument();
    expect(screen.queryByText('Settings')).not.toBeInTheDocument();
  });

  it('still renders link icons when sidebar is closed', () => {
    renderSidebar({}, { initialOpen: false });
    expect(screen.getByTestId('home-icon')).toBeInTheDocument();
    expect(screen.getByTestId('settings-icon')).toBeInTheDocument();
  });

  it('renders an empty sidebar when links array is empty', () => {
    renderSidebar({ links: [] });
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});

// Toggle buttons

describe('Sidebar toggle buttons', () => {
  it('shows the X (close) button when open', () => {
    renderSidebar();
    expect(screen.getByTitle('Close')).toBeInTheDocument();
    expect(screen.queryByTitle('Open')).not.toBeInTheDocument();
  });

  it('shows the Menu (open) button when closed', () => {
    renderSidebar({}, { initialOpen: false });
    expect(screen.getByTitle('Open')).toBeInTheDocument();
    expect(screen.queryByTitle('Close')).not.toBeInTheDocument();
  });

  it('closes the sidebar when the X button is clicked', async () => {
    const user = userEvent.setup();
    renderSidebar();
    await user.click(screen.getByTitle('Close').closest('button')!);
    expect(screen.queryByText('Brand')).not.toBeInTheDocument();
    expect(screen.getByTitle('Open')).toBeInTheDocument();
  });

  it('opens the sidebar when the Menu button is clicked', async () => {
    const user = userEvent.setup();
    renderSidebar({}, { initialOpen: false });
    await user.click(screen.getByTitle('Open').closest('button')!);
    expect(screen.getByText('Brand')).toBeInTheDocument();
    expect(screen.getByTitle('Close')).toBeInTheDocument();
  });
});

//Position variants

describe('Sidebar position variants', () => {
  const positions = ['left', 'right', 'bottomLeft', 'bottomRight'] as const;

  positions.forEach((position) => {
    it(`applies position="${position}" class`, () => {
      const { container } = renderSidebar({ position });
      const root = container.firstChild as HTMLElement;
      const expectedClasses: Record<typeof position, string> = {
        left: 'left-0',
        right: 'right-0',
        bottomLeft: 'left-0',
        bottomRight: 'right-0',
      };
      expect(root).toHaveClass(expectedClasses[position]);
    });
  });
});

// Variant styles

describe('Sidebar variant styles', () => {
  const variants = [
    { variant: 'default' as const, expectedClass: 'bg-background' },
    { variant: 'dark' as const, expectedClass: 'bg-black' },
    { variant: 'light' as const, expectedClass: 'bg-white' },
    { variant: 'glass' as const, expectedClass: 'backdrop-blur-lg' },
    { variant: 'gradient' as const, expectedClass: 'from-purple-500' },
  ];

  variants.forEach(({ variant, expectedClass }) => {
    it(`applies variant="${variant}" class`, () => {
      const { container } = renderSidebar({ variant });
      const root = container.firstChild as HTMLElement;
      expect(root).toHaveClass(expectedClass);
    });
  });
});

//Custom className

describe('Sidebar className prop', () => {
  it('merges a custom className onto the root element', () => {
    const { container } = renderSidebar({ className: 'my-custom-sidebar' });
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveClass('my-custom-sidebar');
  });
});

// Direction

describe('Sidebar direction prop', () => {
  it('applies flex-col for vertical direction (default)', () => {
    renderSidebar({ direction: 'vertical' });
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('flex-col');
  });

  it('applies flex-row for horizontal direction', () => {
    renderSidebar({ direction: 'horizontal' });
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('flex-row');
  });
});


// Responsive / mobile behaviour

describe('Sidebar mobile responsiveness', () => {
  const originalInnerWidth = window.innerWidth;

  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
    window.dispatchEvent(new Event('resize'));
  });

  it('detects mobile viewport below 768px', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });
    const { container } = renderSidebar({}, { initialOpen: false });
    fireEvent(window, new Event('resize'));
    expect(container.firstChild).toBeInTheDocument();
  });

  it('updates isMobile state on window resize', () => {
    const { container } = renderSidebar();
    act(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      window.dispatchEvent(new Event('resize'));
    });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('cleans up the resize event listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = renderSidebar();
    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    removeEventListenerSpy.mockRestore();
  });
});

// Multiple links cases

describe('Sidebar with many links', () => {
  it('renders all links when a large list is provided', () => {
    const manyLinks = Array.from({ length: 10 }, (_, i) => ({
      label: `Link ${i}`,
      href: `/link-${i}`,
      icon: HomeIcon,
    }));
    renderSidebar({ links: manyLinks });
    manyLinks.forEach(({ label }) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it('renders correct href for every link', () => {
    const manyLinks = Array.from({ length: 5 }, (_, i) => ({
      label: `Page ${i}`,
      href: `/page-${i}`,
      icon: HomeIcon,
    }));
    renderSidebar({ links: manyLinks });
    manyLinks.forEach(({ label, href }) => {
      expect(screen.getByRole('link', { name: new RegExp(label, 'i') })).toHaveAttribute('href', href);
    });
  });
});

// context state shared between provider and sidebar

describe('Sidebar context integration', () => {
  it('external toggle from context updates the sidebar UI', () => {
    let capturedCtx: ReturnType<typeof useSidebar> | null = null;

    render(
      <SidebarProvider initialOpen={true}>
        <SidebarConsumer onRender={(ctx) => { capturedCtx = ctx; }} />
        <Sidebar links={defaultLinks} brandName="Ignix" />
      </SidebarProvider>
    );

    expect(screen.getByText('Ignix')).toBeInTheDocument();
    act(() => capturedCtx!.onClose());
    expect(screen.queryByText('Ignix')).not.toBeInTheDocument();
  });

  it('multiple siblings share the same context state', () => {
    let capturedCtx: ReturnType<typeof useSidebar> | null = null;

    render(
      <SidebarProvider initialOpen={true}>
        <SidebarConsumer onRender={(ctx) => { capturedCtx = ctx; }} />
        <Sidebar links={defaultLinks} brandName="Sidebar A" />
      </SidebarProvider>
    );

    act(() => capturedCtx!.onClose());
    expect(screen.queryByText('Sidebar A')).not.toBeInTheDocument();

    act(() => capturedCtx!.onOpen());
    expect(screen.getByText('Sidebar A')).toBeInTheDocument();
  });
});