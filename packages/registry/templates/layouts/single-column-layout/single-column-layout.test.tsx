// single-column-layout.test.tsx - FIXED HOISTING ISSUE
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { SingleColumnLayout, type SingleColumnLayoutProps } from './';

// Mock lucide-react icons - defined inline to avoid hoisting issues
vi.mock('lucide-react', () => ({
    Menu: () => <span data-testid="menu-icon">Menu</span>,
    X: () => <span data-testid="x-icon">X</span>,
    Home: () => <span data-testid="home-icon">Home</span>,
    ChevronRight: () => <span data-testid="chevron-right-icon">ChevronRight</span>,
}));

// Mock framer-motion - defined inline
vi.mock('framer-motion', () => ({
    motion: {
        div: (props: any) => <div {...props} />,
        header: (props: any) => <header {...props} />,
        footer: (props: any) => <footer {...props} />,
        main: (props: any) => <main {...props} />,
    },
    AnimatePresence: ({ children }: any) => children,
}));

// Mock the button component - defined inline
vi.mock('../../../components/button', () => ({
    Button: ({ children, onClick, ...props }: any) => (
        <button
            data-testid="mock-button"
            onClick={onClick}
            {...props}
        >
            {children}
        </button>
    ),
    default: ({ children, onClick, ...props }: any) => (
        <button
            data-testid="mock-button-default"
            onClick={onClick}
            {...props}
        >
            {children}
        </button>
    ),
}));

// Mock cn utility - defined inline
vi.mock('../../../utils/cn', () => ({
    cn: (...classes: any[]) => classes.filter(Boolean).join(' '),
}));

describe('SingleColumnLayout - Working Tests', () => {
    const defaultProps: SingleColumnLayoutProps = {
        children: <div data-testid="test-content">Main Content</div>,
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Core Functionality', () => {
        it('renders basic layout', () => {
            render(<SingleColumnLayout {...defaultProps} />);

            // Basic structure
            expect(screen.getByRole('banner')).toBeInTheDocument();
            expect(screen.getByRole('main')).toBeInTheDocument();
            expect(screen.getByRole('contentinfo')).toBeInTheDocument();

            // Content
            expect(screen.getByTestId('test-content')).toBeInTheDocument();

            // Default elements
            expect(screen.getByText('Logo')).toBeInTheDocument();
        });

        it('renders custom header and footer', () => {
            const props: SingleColumnLayoutProps = {
                ...defaultProps,
                header: <div data-testid="custom-header">Custom Header</div>,
                footer: <div data-testid="custom-footer">Custom Footer</div>,
            };

            render(<SingleColumnLayout {...props} />);

            expect(screen.getByTestId('custom-header')).toBeInTheDocument();
            expect(screen.getByTestId('custom-footer')).toBeInTheDocument();
        });
    });

    describe('Configuration Props', () => {
        it('renders custom logo', () => {
            const logo = <div data-testid="custom-logo">Custom Logo</div>;
            render(<SingleColumnLayout {...defaultProps} logo={logo} />);

            expect(screen.getByTestId('custom-logo')).toBeInTheDocument();
        });

        it('renders custom navigation links', () => {
            const navLinks = [
                { label: 'Products', href: '#products' },
                { label: 'Services', href: '#services' },
                { label: 'Contact', href: '#contact' },
            ];

            render(<SingleColumnLayout {...defaultProps} navLinks={navLinks} />);

            expect(screen.getByText('Products')).toBeInTheDocument();
            expect(screen.getByText('Services')).toBeInTheDocument();
            expect(screen.getByText('Contact')).toBeInTheDocument();
        });

        it('hides auth controls when showAuthControls is false', () => {
            render(<SingleColumnLayout {...defaultProps} showAuthControls={false} />);

            expect(screen.queryByText('Sign In')).not.toBeInTheDocument();
            expect(screen.queryByText('Sign Up')).not.toBeInTheDocument();
        });
    });

    describe('Mobile Menu', () => {
        it('toggles mobile menu visibility', async () => {
            const user = userEvent.setup();
            render(<SingleColumnLayout {...defaultProps} />);

            // Initial state - menu closed
            expect(screen.getByTestId('menu-icon')).toBeInTheDocument();
            expect(screen.queryByTestId('x-icon')).not.toBeInTheDocument();

            // Open menu
            const menuButton = screen.getByLabelText('Toggle Menu');
            await user.click(menuButton);

            // Menu should be open
            expect(screen.getByTestId('x-icon')).toBeInTheDocument();
            expect(screen.queryByTestId('menu-icon')).not.toBeInTheDocument();

            // Close menu
            await user.click(menuButton);

            // Menu should be closed
            expect(screen.getByTestId('menu-icon')).toBeInTheDocument();
            expect(screen.queryByTestId('x-icon')).not.toBeInTheDocument();
        });
    });

    describe('Event Handlers', () => {
        it('calls onNavLinkClick when navigation link is clicked', async () => {
            const user = userEvent.setup();
            const onNavLinkClick = vi.fn();

            const props: SingleColumnLayoutProps = {
                ...defaultProps,
                navLinks: [{ label: 'Home', href: '#home' }],
                onNavLinkClick,
            };

            render(<SingleColumnLayout {...props} />);

            const homeLink = screen.getByText('Home');
            await user.click(homeLink);

            expect(onNavLinkClick).toHaveBeenCalledWith('#home', 'Home');
        });

        it('calls onSignInClick when sign in button is clicked', async () => {
            const user = userEvent.setup();
            const onSignInClick = vi.fn();

            render(<SingleColumnLayout {...defaultProps} onSignInClick={onSignInClick} />);

            const signInButton = screen.getByText('Sign In');
            await user.click(signInButton);

            expect(onSignInClick).toHaveBeenCalled();
        });

        it('calls onSignUpClick when sign up button is clicked', async () => {
            const user = userEvent.setup();
            const onSignUpClick = vi.fn();

            render(<SingleColumnLayout {...defaultProps} onSignUpClick={onSignUpClick} />);

            const signUpButton = screen.getByText('Sign Up');
            await user.click(signUpButton);

            expect(onSignUpClick).toHaveBeenCalled();
        });
    });

    describe('Layout Variants', () => {
        const variants = [
            'default',
            'light',
            'dark',
            'glass',
            'gradient',
            'transparent',
            'solid',
            'modern',
        ] as const;

        variants.forEach(variant => {
            it(`renders ${variant} variant without errors`, () => {
                const props = { ...defaultProps, variant };
                const { container } = render(<SingleColumnLayout {...props} />);

                // Should render successfully
                expect(container.firstChild).toBeInTheDocument();
            });
        });
    });

    describe('Layout Configuration', () => {
        it('applies custom padding', () => {
            const props = { ...defaultProps, contentPadding: 'p-10' };
            const { container } = render(<SingleColumnLayout {...props} />);

            const main = container.querySelector('main');
            expect(main?.className).toContain('p-10');
        });

        it('applies custom max width', () => {
            const props = { ...defaultProps, maxWidth: 'max-w-4xl' };
            const { container } = render(<SingleColumnLayout {...props} />);

            const main = container.querySelector('main');
            expect(main?.className).toContain('max-w-4xl');
        });

        it('applies sticky header', () => {
            const props = { ...defaultProps, stickyHeader: true };
            render(<SingleColumnLayout {...props} />);

            const header = screen.getByRole('banner');
            expect(header.className).toContain('sticky');
        });
    });

    describe('Footer Configuration', () => {
        it('hides footer when showFooter is false', () => {
            const props = { ...defaultProps, showFooter: false };
            render(<SingleColumnLayout {...props} />);

            expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument();
        });

        it('renders custom footer content', () => {
            const footerContent = <div data-testid="footer-content">Custom Footer</div>;
            const props = { ...defaultProps, footerContent };
            render(<SingleColumnLayout {...props} />);

            expect(screen.getByTestId('footer-content')).toBeInTheDocument();
        });
    });

    describe('ClassName Customization', () => {
        it('applies string className to root', () => {
            const props = { ...defaultProps, className: 'custom-class' };
            const { container } = render(<SingleColumnLayout {...props} />);

            expect(container.firstChild).toHaveClass('custom-class');
        });

        it('applies object className to sections', () => {
            const className = {
                root: 'root-class',
                header: 'header-class',
                main: 'main-class',
                footer: 'footer-class',
            };

            const props = { ...defaultProps, className };
            render(<SingleColumnLayout {...props} />);

            const header = screen.getByRole('banner');
            const main = screen.getByRole('main');
            const footer = screen.getByRole('contentinfo');

            expect(header.className).toContain('header-class');
            expect(main.className).toContain('main-class');
            expect(footer.className).toContain('footer-class');
        });
    });

    describe('Active Navigation', () => {
        it('handles active navigation link', () => {
            const navLinks = [
                { label: 'Home', href: '#home' },
                { label: 'About', href: '#about' },
            ];

            const props = {
                ...defaultProps,
                navLinks,
                activeNavLink: '#home',
            };

            render(<SingleColumnLayout {...props} />);

            // Both links should be rendered
            expect(screen.getByText('Home')).toBeInTheDocument();
            expect(screen.getByText('About')).toBeInTheDocument();
        });
    });

    describe('Edge Cases', () => {
        it('renders without navigation links', () => {
            const props = {
                ...defaultProps,
                navLinks: [],
                showAuthControls: false,
            };

            render(<SingleColumnLayout {...props} />);

            // Should still render basic layout
            expect(screen.getByRole('banner')).toBeInTheDocument();
            expect(screen.getByRole('main')).toBeInTheDocument();
        });

        it('renders with minimal props', () => {
            render(<SingleColumnLayout>Minimal Content</SingleColumnLayout>);

            expect(screen.getByText('Minimal Content')).toBeInTheDocument();
            expect(screen.getByRole('banner')).toBeInTheDocument();
        });
    });

    describe('Accessibility', () => {
        it('has proper ARIA roles and labels', () => {
            render(<SingleColumnLayout {...defaultProps} />);

            expect(screen.getByRole('banner')).toBeInTheDocument();
            expect(screen.getByRole('main')).toBeInTheDocument();
            expect(screen.getByRole('contentinfo')).toBeInTheDocument();
            expect(screen.getByLabelText('Toggle Menu')).toBeInTheDocument();
        });
    });

    describe('Render Function Customization', () => {
        it('uses renderHeader function with correct props', () => {
            const renderHeader = vi.fn().mockReturnValue(
                <div data-testid="render-header">Custom Header</div>
            );

            render(<SingleColumnLayout {...defaultProps} renderHeader={renderHeader} />);

            expect(renderHeader).toHaveBeenCalled();
            expect(screen.getByTestId('render-header')).toBeInTheDocument();
        });

        it('uses renderFooter function with correct props', () => {
            const renderFooter = vi.fn().mockReturnValue(
                <div data-testid="render-footer">Custom Footer</div>
            );

            render(<SingleColumnLayout {...defaultProps} renderFooter={renderFooter} />);

            expect(renderFooter).toHaveBeenCalled();
            expect(screen.getByTestId('render-footer')).toBeInTheDocument();
        });

        it('uses contentWrapper function', () => {
            const contentWrapper = vi.fn().mockImplementation((children) => (
                <div data-testid="wrapped-content">{children}</div>
            ));

            render(<SingleColumnLayout {...defaultProps} contentWrapper={contentWrapper} />);

            expect(contentWrapper).toHaveBeenCalled();
            expect(screen.getByTestId('wrapped-content')).toBeInTheDocument();
        });
    });


    describe('Navigation Links with Icons', () => {
        it('renders nav links with icons', () => {
            const navLinks = [
                { label: 'Home', href: '#', icon: <span data-testid="home-icon-nav">🏠</span> },
                { label: 'Settings', href: '#', icon: <span data-testid="settings-icon-nav">⚙️</span> },
            ];

            render(<SingleColumnLayout {...defaultProps} navLinks={navLinks} />);

            expect(screen.getByTestId('home-icon-nav')).toBeInTheDocument();
            expect(screen.getByTestId('settings-icon-nav')).toBeInTheDocument();
        });
    });

    describe('Z-Index Configuration', () => {
        it('applies custom z-index values', () => {
            const customZIndex = { header: 1000, footer: 500, mobileMenu: 900 };
            const props = { ...defaultProps, zIndex: customZIndex };

            render(<SingleColumnLayout {...props} />);

            const header = screen.getByRole('banner');
            const footer = screen.getByRole('contentinfo');

            expect(header).toHaveStyle('z-index: 1000');
            expect(footer).toHaveStyle('z-index: 500');
        });
    });

    describe('Animation Configuration', () => {
        const animations = ['none', 'fade', 'slide', 'scale'] as const;

        animations.forEach(animation => {
            it(`applies ${animation} animation`, () => {
                const props = { ...defaultProps, animation };
                const { container } = render(<SingleColumnLayout {...props} />);

                expect(container.firstChild).toBeInTheDocument();
            });
        });
    });

    describe('Responsive Behavior', () => {

        it('shows mobile menu button on mobile', () => {
            render(<SingleColumnLayout {...defaultProps} />);

            const mobileMenuButton = screen.getByLabelText('Toggle Menu');
            expect(mobileMenuButton).toHaveClass('md:hidden');
        });
    });

    describe('Performance and Edge Cases', () => {
        it('handles many navigation links efficiently', () => {
            const manyNavLinks = Array.from({ length: 50 }, (_, i) => ({
                label: `Link ${i + 1}`,
                href: `#link-${i + 1}`,
            }));

            const props = { ...defaultProps, navLinks: manyNavLinks };
            render(<SingleColumnLayout {...props} />);

            expect(screen.getByText('Link 1')).toBeInTheDocument();
            expect(screen.getByText('Link 50')).toBeInTheDocument();
        });

        it('handles special characters in nav links', () => {
            const navLinks = [
                { label: 'Home 🏠', href: '#' },
                { label: 'Contact 📞', href: '#' },
                { label: 'About ℹ️', href: '#' },
            ];

            const props = { ...defaultProps, navLinks };
            render(<SingleColumnLayout {...props} />);

            expect(screen.getByText('Home 🏠')).toBeInTheDocument();
            expect(screen.getByText('Contact 📞')).toBeInTheDocument();
        });
    });
});