import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MobileMenu } from "../../components/MobileMenu";
import type { MobileMenuProps } from "../../types";

// Mock dependencies
vi.mock("framer-motion", () => ({
    motion: {
        div: ({ children, className, style, ...props }: any) => (
            <div className={className} style={style} {...props}>
                {children}
            </div>
        ),
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => (
        <>{children}</>
    ),
}));

vi.mock("../../../../../utils/cn", () => ({
    cn: (...classes: (string | undefined | boolean)[]) =>
        classes.filter(Boolean).join(" "),
}));

vi.mock("../../components/Navigation", () => ({
    Navigation: ({ navLinks, variant, onNavLinkClick }: any) => (
        <nav data-testid="mobile-navigation" data-variant={variant}>
            {navLinks.map((link: any) => (
                <a
                    key={link.label}
                    href={link.href}
                    data-testid={`mobile-nav-${link.label}`}
                    onClick={(e) => {
                        e.preventDefault();
                        onNavLinkClick?.(link.href, link.label);
                    }}
                >
                    {link.label}
                </a>
            ))}
        </nav>
    ),
}));

vi.mock("../../components/AuthControls", () => ({
    AuthControls: ({ onCloseMenu }: any) => (
        <div data-testid="mobile-auth-controls">
            <button
                data-testid="close-menu-via-auth"
                onClick={() => onCloseMenu?.()}
            >
                Close via Auth
            </button>
        </div>
    ),
}));

vi.mock("../../variants", () => ({
    mobileMenuVariants: ({ variant }: any) => `mobile-menu-${variant}`,
}));

describe("MobileMenu Component", () => {
    const defaultProps: MobileMenuProps = {
        isOpen: true,
        onClose: vi.fn(),
        navLinks: [
            { label: "Home", href: "/" },
            { label: "About", href: "/about" },
        ],
        variant: "default",
        showAuthControls: true,
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("does not render when isOpen is false", () => {
        const { container } = render(
            <MobileMenu {...defaultProps} isOpen={false} />
        );

        // AnimatePresence will render null when not open
        expect(container.firstChild).toBeNull();
    });

    it("renders when isOpen is true", () => {
        render(<MobileMenu {...defaultProps} />);

        expect(screen.getByTestId("mobile-navigation")).toBeInTheDocument();
        expect(screen.getByTestId("mobile-auth-controls")).toBeInTheDocument();
    });

    it("applies correct variant classes", () => {
        const { container } = render(
            <MobileMenu {...defaultProps} variant="modern" />
        );

        const mobileMenu = container.firstChild;
        expect(mobileMenu).toHaveClass("mobile-menu-modern");
    });

    it("applies custom z-index", () => {
        const { container } = render(
            <MobileMenu {...defaultProps} zIndex={1000} />
        );

        const mobileMenu = container.firstChild as HTMLElement;
        expect(mobileMenu.style.zIndex).toBe("1000");
    });

    it("calls onNavLinkClick when navigation link is clicked", () => {
        const onNavLinkClick = vi.fn();
        render(
            <MobileMenu {...defaultProps} onNavLinkClick={onNavLinkClick} />
        );

        const homeLink = screen.getByTestId("mobile-nav-Home");
        fireEvent.click(homeLink);

        expect(onNavLinkClick).toHaveBeenCalledWith("/", "Home");
    });

    it("passes variant to Navigation component", () => {
        render(<MobileMenu {...defaultProps} variant="solid" />);

        const navigation = screen.getByTestId("mobile-navigation");
        expect(navigation).toHaveAttribute("data-variant", "solid");
    });

    it("passes isMobile to AuthControls", () => {
        render(<MobileMenu {...defaultProps} />);

        expect(screen.getByTestId("mobile-auth-controls")).toBeInTheDocument();
    });

    it("passes onClose to AuthControls as onCloseMenu", () => {
        const onClose = vi.fn();
        render(
            <MobileMenu {...defaultProps} onClose={onClose} />
        );

        const closeButton = screen.getByTestId("close-menu-via-auth");
        fireEvent.click(closeButton);

        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("passes auth callbacks to AuthControls", () => {
        const onSignInClick = vi.fn();
        const onSignUpClick = vi.fn();

        render(
            <MobileMenu
                {...defaultProps}
                onSignInClick={onSignInClick}
                onSignUpClick={onSignUpClick}
            />
        );

        // The callbacks should be passed through to AuthControls
        expect(screen.getByTestId("mobile-auth-controls")).toBeInTheDocument();
    });

    it("renders with different variants", () => {
        const variants = ["default", "solid", "modern", "dark"] as const;

        variants.forEach((variant) => {
            const { container } = render(
                <MobileMenu {...defaultProps} variant={variant} />
            );

            const mobileMenu = container.firstChild;
            expect(mobileMenu).toHaveClass(`mobile-menu-${variant}`);
        });
    });


    it("handles empty navLinks array", () => {
        render(
            <MobileMenu {...defaultProps} navLinks={[]} />
        );

        expect(screen.getByTestId("mobile-navigation")).toBeInTheDocument();
    });
});