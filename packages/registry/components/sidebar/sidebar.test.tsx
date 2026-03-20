import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, afterEach } from 'vitest';
import '@testing-library/jest-dom';

import { Sidebar, SidebarProvider, useSidebar } from './index';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, animate, ...props }: any) => {
      const isHidden =
        animate &&
        typeof animate === 'object' &&
        animate.height === 0;
      return React.createElement(
        'div',
        props,
        isHidden ? null : children
      );
    },
    nav:  ({ children, ...props }: any) => React.createElement('nav',  props, children),
    span: ({ children, ...props }: any) => React.createElement('span', props, children),
  },
  AnimatePresence: ({ children }: any) =>
    React.createElement(React.Fragment, null, children),
}));

vi.mock('@radix-ui/react-icons', () => ({
  HamburgerMenuIcon: ({ width, height }: any) => <svg data-testid="menu-icon"    width={width} height={height} />,
  DoubleArrowLeftIcon: ({ width, height }: any) => <svg data-testid="close-icon"   width={width} height={height} />,
  ChevronDownIcon: ({ width, height }: any) => <svg data-testid="chevron-icon" width={width} height={height} />,
  HomeIcon: () => <svg data-testid="home-radix-icon" />,
  PersonIcon: () => <svg data-testid="person-icon" />,
  GearIcon: () => <svg data-testid="gear-icon" />,
  QuestionMarkCircledIcon: () => <svg data-testid="help-icon" />,
  DashboardIcon: () => <svg data-testid="dashboard-icon" />,
  BarChartIcon: () => <svg data-testid="barchart-icon" />,
  FaceIcon: () => <svg data-testid="face-icon" />,
  LockClosedIcon: () => <svg data-testid="lock-icon" />,
  InfoCircledIcon: () => <svg data-testid="info-icon" />,
}));

const HomeIcon = () => <svg data-testid="home-icon" />;
const SettingsIcon = () => <svg data-testid="settings-icon" />;
const ChildIcon = () => <svg data-testid="child-icon" />;

const defaultLinks = [
  { label: 'Home',     href: '/home',     icon: HomeIcon },
  { label: 'Settings', href: '/settings', icon: SettingsIcon },
];

const linksWithChildren = [
  {
    label: 'Home',
    href: '/home',
    icon: HomeIcon,
    children: [
      { label: 'Dashboard', href: '/dashboard', icon: ChildIcon },
      { label: 'Analytics', href: '/analytics', icon: ChildIcon },
    ],
  },
  { label: 'Settings', href: '/settings', icon: SettingsIcon },
];

const renderSidebar = (
  sidebarProps: Partial<React.ComponentProps<typeof Sidebar>> = {},
  providerProps: { initialOpen?: boolean } = {}
) =>
  render(
    <SidebarProvider initialOpen={providerProps.initialOpen ?? true}>
      <Sidebar links={defaultLinks} {...sidebarProps} />
    </SidebarProvider>
  );

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

  it('brand name is invisible (not removed) when sidebar is closed', () => {
    renderSidebar({}, { initialOpen: false });
    const brand = screen.getByText('Brand');
    expect(brand).toBeInTheDocument();
    expect(brand).toHaveClass('invisible');
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
  it('shows the close button when open', () => {
    renderSidebar();
    expect(screen.getByTitle('Close')).toBeInTheDocument();
    expect(screen.queryByTitle('Open')).not.toBeInTheDocument();
  });

  it('shows the menu button when closed', () => {
    renderSidebar({}, { initialOpen: false });
    expect(screen.getByTitle('Open')).toBeInTheDocument();
    expect(screen.queryByTitle('Close')).not.toBeInTheDocument();
  });

  it('closes the sidebar when close button is clicked', async () => {
    const user = userEvent.setup();
    renderSidebar();
    await user.click(screen.getByTitle('Close').closest('button')!);
    expect(screen.getByText('Brand')).toHaveClass('invisible');
    expect(screen.getByTitle('Open')).toBeInTheDocument();
  });

  it('opens the sidebar when menu button is clicked', async () => {
    const user = userEvent.setup();
    renderSidebar({}, { initialOpen: false });
    await user.click(screen.getByTitle('Open').closest('button')!);
    expect(screen.getByText('Brand')).not.toHaveClass('invisible');
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
    { variant: 'glass' as const, expectedClass: 'backdrop-blur-3xl' },
    { variant: 'gradient' as const, expectedClass: 'from-gray-800' },
    { variant: 'dropdown' as const, expectedClass: 'bg-background' },
  ];

  variants.forEach(({ variant, expectedClass }) => {
    it(`applies variant="${variant}" class`, () => {
      const { container } = renderSidebar({ variant });
      const root = container.firstChild as HTMLElement;
      expect(root).toHaveClass(expectedClass);
    });
  });
});


describe('Glass variant sheen', () => {
  it('renders the sheen div when variant is glass', () => {
    const { container } = renderSidebar({ variant: 'glass' });
    const sheen = container.querySelector('.bg-gradient-to-br');
    expect(sheen).toBeInTheDocument();
  });

  it('does not render sheen div for non-glass variants', () => {
    const { container } = renderSidebar({ variant: 'default' });
    const sheen = container.querySelector('.bg-gradient-to-br');
    expect(sheen).not.toBeInTheDocument();
  });
});

// Custom className

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

// SidebarLink — dropdown variant behaviour

describe('SidebarLink — dropdown variant', () => {
  it('renders plain <a> for links without children even in dropdown variant', () => {
    render(
      <SidebarProvider initialOpen={true}>
        <Sidebar links={defaultLinks} variant="dropdown" />
      </SidebarProvider>
    );
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /settings/i })).toBeInTheDocument();
  });

  it('renders a button trigger for links with children in dropdown variant', () => {
    render(
      <SidebarProvider initialOpen={true}>
        <Sidebar links={linksWithChildren} variant="dropdown" />
      </SidebarProvider>
    );
    expect(screen.getByRole('button', { name: /home/i })).toBeInTheDocument();
  });

  it('children are hidden by default', () => {
    render(
      <SidebarProvider initialOpen={true}>
        <Sidebar links={linksWithChildren} variant="dropdown" />
      </SidebarProvider>
    );
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
    expect(screen.queryByText('Analytics')).not.toBeInTheDocument();
  });

  it('clicking the trigger reveals children', async () => {
    const user = userEvent.setup();
    render(
      <SidebarProvider initialOpen={true}>
        <Sidebar links={linksWithChildren} variant="dropdown" />
      </SidebarProvider>
    );
    await user.click(screen.getByRole('button', { name: /home/i }));
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
  });

  it('clicking the trigger again hides children', async () => {
    const user = userEvent.setup();
    render(
      <SidebarProvider initialOpen={true}>
        <Sidebar links={linksWithChildren} variant="dropdown" />
      </SidebarProvider>
    );
    await user.click(screen.getByRole('button', { name: /home/i }));
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /home/i }));
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
  });

  it('child links have correct hrefs', async () => {
    const user = userEvent.setup();
    render(
      <SidebarProvider initialOpen={true}>
        <Sidebar links={linksWithChildren} variant="dropdown" />
      </SidebarProvider>
    );
    await user.click(screen.getByRole('button', { name: /home/i }));
    expect(screen.getByRole('link', { name: /dashboard/i })).toHaveAttribute('href', '/dashboard');
    expect(screen.getByRole('link', { name: /analytics/i })).toHaveAttribute('href', '/analytics');
  });

  it('shows chevron icon when sidebar is open', () => {
    render(
      <SidebarProvider initialOpen={true}>
        <Sidebar links={linksWithChildren} variant="dropdown" />
      </SidebarProvider>
    );
    expect(screen.getByTestId('chevron-icon')).toBeInTheDocument();
  });

  it('hides label and chevron when sidebar is collapsed', () => {
    render(
      <SidebarProvider initialOpen={false}>
        <Sidebar links={linksWithChildren} variant="dropdown" />
      </SidebarProvider>
    );
    expect(screen.queryByText('Home')).not.toBeInTheDocument();
    expect(screen.queryByTestId('chevron-icon')).not.toBeInTheDocument();
  });

  it('open groups collapse when sidebar collapses', async () => {
    const user = userEvent.setup();
    let capturedCtx: ReturnType<typeof useSidebar> | null = null;
    render(
      <SidebarProvider initialOpen={true}>
        <SidebarConsumer onRender={(ctx) => { capturedCtx = ctx; }} />
        <Sidebar links={linksWithChildren} variant="dropdown" />
      </SidebarProvider>
    );
    await user.click(screen.getByRole('button', { name: /home/i }));
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    act(() => capturedCtx!.onClose());
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
  });

  it('renders plain <a> for links with children when variant is NOT dropdown', () => {
    render(
      <SidebarProvider initialOpen={true}>
        <Sidebar links={linksWithChildren} variant="default" />
      </SidebarProvider>
    );
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /home/i })).not.toBeInTheDocument();
  });
});

// Responsive / mobile behaviour

describe('Sidebar mobileBreakPoint prop', () => {
  const originalInnerWidth = window.innerWidth;

  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
    window.dispatchEvent(new Event('resize'));
  });

  it('detects mobile viewport below default 768px breakpoint', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });
    const { container } = renderSidebar({}, { initialOpen: false });
    fireEvent(window, new Event('resize'));
    expect(container.firstChild).toBeInTheDocument();
  });

  it('respects custom mobileBreakPoint', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 900,
    });
    const { container } = renderSidebar({ mobileBreakPoint: 1024 }, { initialOpen: false });
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

// Many links

describe('Sidebar with many links', () => {
  it('renders all links when a large list is provided', () => {
    const manyLinks = Array.from({ length: 10 }, (_, i) => ({
      label: `Link ${i}`,
      href:  `/link-${i}`,
      icon:  HomeIcon,
    }));
    renderSidebar({ links: manyLinks });
    manyLinks.forEach(({ label }) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it('renders correct href for every link', () => {
    const manyLinks = Array.from({ length: 5 }, (_, i) => ({
      label: `Page ${i}`,
      href:  `/page-${i}`,
      icon:  HomeIcon,
    }));
    renderSidebar({ links: manyLinks });
    manyLinks.forEach(({ label, href }) => {
      expect(
        screen.getByRole('link', { name: new RegExp(label, 'i') })
      ).toHaveAttribute('href', href);
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
    const brand = screen.getByText('Ignix');
    expect(brand).not.toHaveClass('invisible');
    act(() => capturedCtx!.onClose());
    expect(brand).toHaveClass('invisible');
  });

  it('multiple siblings share the same context state', () => {
    let capturedCtx: ReturnType<typeof useSidebar> | null = null;

    render(
      <SidebarProvider initialOpen={true}>
        <SidebarConsumer onRender={(ctx) => { capturedCtx = ctx; }} />
        <Sidebar links={defaultLinks} brandName="Sidebar A" />
      </SidebarProvider>
    );
    const brand = screen.getByText('Sidebar A');
    act(() => capturedCtx!.onClose());
    expect(brand).toHaveClass('invisible');
    act(() => capturedCtx!.onOpen());
    expect(brand).not.toHaveClass('invisible');
  });
});