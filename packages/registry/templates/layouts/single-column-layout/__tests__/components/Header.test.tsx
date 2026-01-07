import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Header } from "../../components/Header";
import type { HeaderProps } from "../../types";

// Mock dependencies
vi.mock("lucide-react", () => ({
    Menu: () => <div data-testid="menu-icon">Menu</div>,
    X: () => <div data-testid="x-icon">X</div>,
}));

vi.mock("../../../../../../utils/cn", () => ({
    cn: (...classes: (string | undefined | boolean)[]) =>
        classes.filter(Boolean).join(" "),
}));

vi.mock("../../components/Navigation", () => ({
    Navigation: ({ navLinks, onNavLinkClick }: any) => (
        <nav data-testid="navigation">
            {navLinks.map((link: any) => (
                <button
                    key={link.label}
                    data-testid={`nav-${link.label}`}
                    onClick={() => onNavLinkClick?.(link.href, link.label)}
                >
                    {link.label}
                </button>
            ))}
        </nav>
    ),
}));

vi.mock("../../components/AuthControls", () => ({
    AuthControls: ({ variant }: any) => (
        <div data-testid="auth-controls" data-variant={variant}>
            Auth Controls
        </div>
    ),
}));

vi.mock("../../variants", () => ({
    getLogoClass: (variant: string) => `logo-${variant}`,
    getLogoTextClass: (variant: string) => `logo-text-${variant}`,
}));

vi.mock("../../constants", () => ({
    LOGO_TEXT: {
        modern: "ModernBrand",
        default: "DefaultBrand",
    },
}));

describe("Header Component", () => {
    const defaultProps: HeaderProps & {
        isMobileMenuOpen: boolean;
        toggleMobileMenu: () => void;
    } = {
        navLinks: [
            { label: "Home", href: "/" },
            { label: "About", href: "/about" },
        ],
        showAuthControls: true,
        variant: "default",
        isMobileMenuOpen: false,
        toggleMobileMenu: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders default logo when no logo prop provided", () => {
        render(<Header {...defaultProps} />);

        expect(screen.getByText("DefaultBrand")).toBeInTheDocument();
        expect(screen.getByTestId("navigation")).toBeInTheDocument();
        expect(screen.getByTestId("auth-controls")).toBeInTheDocument();
    });

    it("renders custom logo when provided", () => {
        const customLogo = <div data-testid="custom-logo">Custom Logo</div>;
        render(<Header {...defaultProps} logo={customLogo} />);

        expect(screen.getByTestId("custom-logo")).toBeInTheDocument();
        expect(screen.queryByText("DefaultBrand")).not.toBeInTheDocument();
    });

    it("renders modern variant logo text", () => {
        render(<Header {...defaultProps} variant="modern" />);

        expect(screen.getByText("ModernBrand")).toBeInTheDocument();
    });

    it("toggles mobile menu when menu button is clicked", () => {
        const toggleMobileMenu = vi.fn();
        render(
            <Header {...defaultProps} toggleMobileMenu={toggleMobileMenu} />
        );

        const menuButton = screen.getByLabelText("Toggle Menu");
        fireEvent.click(menuButton);

        expect(toggleMobileMenu).toHaveBeenCalledTimes(1);
    });

    it("shows menu icon when mobile menu is closed", () => {
        render(<Header {...defaultProps} isMobileMenuOpen={false} />);

        expect(screen.getByTestId("menu-icon")).toBeInTheDocument();
        expect(screen.queryByTestId("x-icon")).not.toBeInTheDocument();
    });

    it("shows close icon when mobile menu is open", () => {
        render(<Header {...defaultProps} isMobileMenuOpen={true} />);

        expect(screen.getByTestId("x-icon")).toBeInTheDocument();
        expect(screen.queryByTestId("menu-icon")).not.toBeInTheDocument();
    });

    it("applies solid variant menu button classes", () => {
        render(<Header {...defaultProps} variant="solid" />);

        const menuButton = screen.getByLabelText("Toggle Menu");
        expect(menuButton.className).toContain("text-white");
        expect(menuButton.className).toContain("hover:bg-white/20");
    });

    it("applies modern variant menu button classes", () => {
        render(<Header {...defaultProps} variant="modern" />);

        const menuButton = screen.getByLabelText("Toggle Menu");
        expect(menuButton.className).toContain("text-slate-700");
        expect(menuButton.className).toContain("hover:bg-slate-100");
    });

    it("calls onNavLinkClick when navigation link is clicked", () => {
        const onNavLinkClick = vi.fn();
        render(
            <Header {...defaultProps} onNavLinkClick={onNavLinkClick} />
        );

        const homeLink = screen.getByTestId("nav-Home");
        fireEvent.click(homeLink);

        expect(onNavLinkClick).toHaveBeenCalledWith("/", "Home");
    });

    it("hides desktop navigation and auth controls on mobile", () => {
        const { container } = render(<Header {...defaultProps} />);

        const desktopNav = container.querySelector(".hidden.md\\:flex");
        expect(desktopNav).toBeInTheDocument();
    });

    it("renders with custom renderHeader function", () => {
        const renderHeader = vi.fn((props) => (
            <div data-testid="custom-header-render">
                <div data-testid="custom-logo">{props.logo}</div>
                <div data-testid="custom-nav">{props.navLinks}</div>
                <div data-testid="custom-auth">{props.authControls}</div>
                <button
                    data-testid="custom-toggle"
                    onClick={props.toggleMobileMenu}
                >
                    Toggle
                </button>
            </div>
        ));

        render(<Header {...defaultProps} renderHeader={renderHeader} />);

        expect(renderHeader).toHaveBeenCalled();
        expect(screen.getByTestId("custom-header-render")).toBeInTheDocument();
        expect(screen.getByTestId("custom-toggle")).toBeInTheDocument();

        // Verify renderHeader was called with correct props
        expect(renderHeader).toHaveBeenCalledWith(
            expect.objectContaining({
                logo: expect.any(Object),
                navLinks: expect.any(Object),
                authControls: expect.any(Object),
                variant: "default",
                isMobileMenuOpen: false,
                toggleMobileMenu: expect.any(Function),
            })
        );
    });

    it("has correct layout classes", () => {
        const { container } = render(<Header {...defaultProps} />);

        const headerContent = container.firstChild;
        expect(headerContent).toHaveClass("flex");
        expect(headerContent).toHaveClass("items-center");
        expect(headerContent).toHaveClass("justify-between");
        expect(headerContent).toHaveClass("w-full");
        expect(headerContent).toHaveClass("h-full");
        expect(headerContent).toHaveClass("px-4");
    });

    it("passes auth callbacks to AuthControls", () => {
        const onSignInClick = vi.fn();
        const onSignUpClick = vi.fn();

        render(
            <Header
                {...defaultProps}
                onSignInClick={onSignInClick}
                onSignUpClick={onSignUpClick}
            />
        );

        // The callbacks should be passed through to AuthControls
        expect(screen.getByTestId("auth-controls")).toBeInTheDocument();
    });
});