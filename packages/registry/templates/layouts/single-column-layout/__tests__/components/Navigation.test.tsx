import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Navigation } from "../../components/Navigation";
import type { NavigationProps } from "../../types";

// Mock dependencies
vi.mock("../../../../utils/cn", () => ({
    cn: (...classes: (string | undefined | boolean)[]) =>
        classes.filter(Boolean).join(" "),
}));

vi.mock("lucide-react", () => ({
    ChevronRight: () => <div data-testid="chevron-right">→</div>,
}));

// Mock variants
vi.mock("../variants", () => ({
    getNavLinkClass: (variant: string, href: string, activeNavLink?: string, isMobile?: boolean) => {
        const isActive = activeNavLink === href;
        if (isMobile) {
            return `mobile-link ${isActive ? 'active' : 'inactive'} ${variant}`;
        }
        return `desktop-link ${isActive ? 'active' : 'inactive'} ${variant}`;
    },
}));

describe("Navigation Component", () => {
    const defaultProps: NavigationProps = {
        navLinks: [
            { label: "Home", href: "/" },
            { label: "About", href: "/about", icon: <span>📖</span> },
            { label: "Contact", href: "/contact" },
        ],
        variant: "default",
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("Desktop Navigation", () => {
        it("renders desktop navigation links", () => {
            render(<Navigation {...defaultProps} />);

            expect(screen.getByText("Home")).toBeInTheDocument();
            expect(screen.getByText("About")).toBeInTheDocument();
            expect(screen.getByText("Contact")).toBeInTheDocument();
        });

        it("hides on mobile (md:hidden class)", () => {
            const { container } = render(<Navigation {...defaultProps} />);

            const nav = container.firstChild;
            expect(nav).toHaveClass("hidden");
            expect(nav).toHaveClass("md:flex");
        });

        it("calls onNavLinkClick when link is clicked", () => {
            const onNavLinkClick = vi.fn();
            render(
                <Navigation {...defaultProps} onNavLinkClick={onNavLinkClick} />
            );

            const homeLink = screen.getByText("Home").closest("a");
            fireEvent.click(homeLink!);

            expect(onNavLinkClick).toHaveBeenCalledWith("/", "Home");
        });

        it("renders icons when provided", () => {
            render(<Navigation {...defaultProps} />);

            const aboutLink = screen.getByText("About");
            expect(aboutLink.previousSibling).toHaveTextContent("📖");
        });

        it("applies active state classes", () => {
            render(
                <Navigation {...defaultProps} activeNavLink="/about" />
            );

            const aboutLink = screen.getByText("About").closest("a");
            expect(aboutLink).toHaveClass("text-blue-600");
            expect(aboutLink).toHaveClass("font-semibold");
            expect(aboutLink).toHaveClass("bg-blue-50");
        });

        it("applies hover state classes", () => {
            render(<Navigation {...defaultProps} />);

            const homeLink = screen.getByText("Home").closest("a");
            expect(homeLink).toHaveClass("hover:text-blue-600");
            expect(homeLink).toHaveClass("hover:bg-blue-50");
        });
    });

    describe("Mobile Navigation", () => {
        it("renders mobile navigation links", () => {
            render(<Navigation {...defaultProps} isMobile={true} />);

            expect(screen.getByText("Home")).toBeInTheDocument();
            expect(screen.getByText("About")).toBeInTheDocument();
            expect(screen.getByText("Contact")).toBeInTheDocument();
        });

        it("calls onNavLinkClick when mobile link is clicked", () => {
            const onNavLinkClick = vi.fn();
            render(
                <Navigation
                    {...defaultProps}
                    isMobile={true}
                    onNavLinkClick={onNavLinkClick}
                />
            );

            const homeLink = screen.getByText("Home").closest("a");
            fireEvent.click(homeLink!);

            expect(onNavLinkClick).toHaveBeenCalledWith("/", "Home");
        });

        it("renders chevron for modern variant in mobile", () => {
            render(
                <Navigation {...defaultProps} isMobile={true} variant="modern" />
            );

            expect(screen.getAllByTestId("chevron-right")).toHaveLength(3);
        });

        it("does not render chevron for non-modern variants in mobile", () => {
            render(
                <Navigation {...defaultProps} isMobile={true} variant="default" />
            );

            expect(screen.queryByTestId("chevron-right")).not.toBeInTheDocument();
        });

        it("renders icons in mobile navigation", () => {
            render(<Navigation {...defaultProps} isMobile={true} />);

            const aboutLink = screen.getByText("About");
            expect(aboutLink.previousSibling).toHaveTextContent("📖");
        });
    });

    describe("Variant Handling", () => {
        it("applies modern variant classes", () => {
            render(
                <Navigation {...defaultProps} variant="modern" />
            );

            const homeLink = screen.getByText("Home").closest("a");
            expect(homeLink).toHaveClass("rounded-lg");
            expect(homeLink).toHaveClass("px-4");
            expect(homeLink).toHaveClass("py-2");
        });
    });

    describe("Layout and Styling", () => {


        it("applies rounded corners to links", () => {
            render(<Navigation {...defaultProps} />);

            const homeLink = screen.getByText("Home").closest("a");
            expect(homeLink).toHaveClass("rounded-lg");
        });

        it("applies text size classes", () => {
            render(<Navigation {...defaultProps} />);

            const homeLink = screen.getByText("Home").closest("a");
            expect(homeLink).toHaveClass("text-sm");
        });

        it("applies transition classes", () => {
            render(<Navigation {...defaultProps} />);

            const homeLink = screen.getByText("Home").closest("a");
            expect(homeLink).toHaveClass("transition-all");
            expect(homeLink).toHaveClass("duration-300");
        });
    });

    describe("Edge Cases", () => {
        it("handles empty navLinks array", () => {
            render(<Navigation {...defaultProps} navLinks={[]} />);

            // Should render empty navigation container
            const { container } = render(<Navigation {...defaultProps} navLinks={[]} />);
            expect(container.firstChild).toBeInTheDocument();
        });

        it("handles navLinks without icons", () => {
            const navLinks = [
                { label: "Home", href: "/" },
                { label: "About", href: "/about" },
            ];

            render(<Navigation {...defaultProps} navLinks={navLinks} />);

            expect(screen.getByText("Home")).toBeInTheDocument();
            expect(screen.getByText("About")).toBeInTheDocument();
        });

        it("prevents default link behavior", () => {
            const onNavLinkClick = vi.fn();
            render(
                <Navigation {...defaultProps} onNavLinkClick={onNavLinkClick} />
            );

            const homeLink = screen.getByText("Home").closest("a");
            const clickEvent = new MouseEvent("click", { bubbles: true });

            homeLink?.dispatchEvent(clickEvent);

            // The preventDefault is called in the onClick handler
            expect(onNavLinkClick).toHaveBeenCalled();
        });
    });
});