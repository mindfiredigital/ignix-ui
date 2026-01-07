// components/LeftPanel.test.tsx
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { LeftPanel } from "../../components/LeftPanel";

// Mock dependencies
vi.mock("../../../../../utils/cn", () => ({
    cn: (...classes: any[]) => classes.filter(Boolean).join(" "),
}));

vi.mock("framer-motion", () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
}));

vi.mock("lucide-react", () => ({
    Check: () => <div data-testid="check-icon" />,
    Star: () => <div data-testid="star-icon" />,
    UserPlus: () => <div data-testid="user-plus-icon" />,
    ShieldCheck: () => <div data-testid="shield-check-icon" />,
    Zap: () => <div data-testid="zap-icon" />,
    Users: () => <div data-testid="users-icon" />,
    Globe: () => <div data-testid="globe-icon" />,
}));

vi.mock("../../config", () => ({
    DEFAULT_FEATURES: [
        {
            text: "Enterprise-grade security & encryption",
            icon: <div data-testid="default-icon-1" />,
            iconColor: "text-blue-400",
            textClassName: "font-semibold text-white/95",
        },
        {
            text: "Lightning-fast performance",
            icon: <div data-testid="default-icon-2" />,
            iconColor: "text-yellow-400",
            textClassName: "font-semibold text-white/95",
        },
    ],
    DEFAULT_ANIMATION_CONFIG: {
        titleDelay: 0.2,
        descriptionDelay: 0.3,
        featuresDelay: 0.4,
        staggerChildren: 0.1
    },
    DEFAULT_COMPANY_NAME: "YourBrand",
}));

describe("LeftPanel Component", () => {
    const defaultProps = {
        isDarkVariant: false,
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders with default company name", () => {
        render(<LeftPanel {...defaultProps} />);

        expect(screen.getByText("Join Our Community")).toBeInTheDocument();
        expect(screen.getByText("at YourBrand")).toBeInTheDocument();
    });

    it("renders with custom company name", () => {
        render(
            <LeftPanel
                {...defaultProps}
                companyName="Acme Corp"
            />
        );

        expect(screen.getByText("at Acme Corp")).toBeInTheDocument();
    });

    it("renders default features list", () => {
        render(<LeftPanel {...defaultProps} />);

        expect(screen.getByText("Enterprise-grade security & encryption")).toBeInTheDocument();
        expect(screen.getByText("Lightning-fast performance")).toBeInTheDocument();
        // Check for the mocked default icons
        expect(screen.getByTestId("default-icon-1")).toBeInTheDocument();
        expect(screen.getByTestId("default-icon-2")).toBeInTheDocument();
    });

    it("renders custom features", () => {
        const customFeatures = [
            {
                text: "Custom Feature 1",
                icon: <div data-testid="custom-icon-1" />,
                iconColor: "text-red-400",
            },
            {
                text: "Custom Feature 2",
                icon: <div data-testid="custom-icon-2" />,
            },
        ];

        render(
            <LeftPanel
                {...defaultProps}
                leftPanelContent={{ features: customFeatures }}
            />
        );

        expect(screen.getByText("Custom Feature 1")).toBeInTheDocument();
        expect(screen.getByText("Custom Feature 2")).toBeInTheDocument();
        expect(screen.getByTestId("custom-icon-1")).toBeInTheDocument();
        expect(screen.getByTestId("custom-icon-2")).toBeInTheDocument();
    });

    it("renders custom title and description", () => {
        const customContent = {
            title: "Welcome to Our Platform",
            description: "Join thousands of satisfied customers",
            subtitle: "Premium Service",
        };

        render(
            <LeftPanel
                {...defaultProps}
                leftPanelContent={customContent}
            />
        );

        expect(screen.getByText("Welcome to Our Platform")).toBeInTheDocument();
        expect(screen.getByText("Join thousands of satisfied customers")).toBeInTheDocument();
        expect(screen.getByText("Premium Service")).toBeInTheDocument();
    });

    it("renders statistics when provided", () => {
        const statistics = [
            { value: "10K+", label: "Users" },
            { value: "99%", label: "Satisfaction", subtext: "Rating" },
        ];

        render(
            <LeftPanel
                {...defaultProps}
                leftPanelContent={{ statistics }}
            />
        );

        expect(screen.getByText("10K+")).toBeInTheDocument();
        expect(screen.getByText("Users")).toBeInTheDocument();
        expect(screen.getByText("99%")).toBeInTheDocument();
        expect(screen.getByText("Satisfaction")).toBeInTheDocument();
        expect(screen.getByText("Rating")).toBeInTheDocument();
    });

    it("renders testimonials when provided", () => {
        const testimonials = [
            {
                quote: "Amazing service!",
                author: "John Doe",
                role: "CEO at Company",
            },
        ];

        render(
            <LeftPanel
                {...defaultProps}
                leftPanelContent={{ testimonials }}
            />
        );

        expect(screen.getByText('"Amazing service!"')).toBeInTheDocument();
        expect(screen.getByText("John Doe")).toBeInTheDocument();
        expect(screen.getByText("CEO at Company")).toBeInTheDocument();
    });

    it("renders custom content when provided", () => {
        const customContent = <div data-testid="custom-content">Custom Content</div>;

        render(
            <LeftPanel
                {...defaultProps}
                leftPanelContent={{ customContent }}
            />
        );

        expect(screen.getByTestId("custom-content")).toBeInTheDocument();
    });

    it("hides branding when hideBranding is true", () => {
        render(
            <LeftPanel
                {...defaultProps}
                leftPanelContent={{ hideBranding: true }}
            />
        );

        // Should not show the company name in the top branding section
        const topBranding = screen.queryByText("YourBrand", { selector: 'span.text-2xl' });
        expect(topBranding).not.toBeInTheDocument();
    });

    // Helper function to get the main panel container
    const getMainPanelContainer = () => {
        // Find the element with the main panel classes
        const panels = screen.getAllByText((content, element) => {
            if (element) {
                // Look for elements that contain "Join Our Community" text
                // and have parent elements with gradient classes
                const textContent = element.textContent || '';
                if (textContent.includes('Join Our Community')) {
                    // Walk up the DOM to find the main panel
                    let parent = element.parentElement;
                    while (parent) {
                        if (parent.className &&
                            (parent.className.includes('bg-gradient-to-br') ||
                                parent.className.includes('bg-gradient-to-r'))) {
                            return true;
                        }
                        parent = parent.parentElement;
                    }
                }
            }
            return false;
        });

        // Return the first panel found
        if (panels.length > 0) {
            // Walk up to find the actual panel container
            let element = panels[0];
            while (element && element.parentElement) {
                if (element.className &&
                    (element.className.includes('bg-gradient-to-br') ||
                        element.className.includes('bg-gradient-to-r'))) {
                    return element;
                }
                element = element.parentElement;
            }
        }

        // Fallback: find by test ID or other means
        return screen.getByText("Join Our Community").closest('[class*="bg-gradient-to-"]');
    };

    it("renders with dark variant styles", () => {
        render(
            <LeftPanel
                {...defaultProps}
                isDarkVariant={true}
            />
        );

        const panel = getMainPanelContainer();
        expect(panel).toHaveClass("from-gray-900");
        expect(panel).toHaveClass("via-gray-800");
        expect(panel).toHaveClass("to-gray-900");
    });

    it("renders with light variant styles", () => {
        render(<LeftPanel {...defaultProps} />);

        const panel = getMainPanelContainer();
        expect(panel).toHaveClass("from-emerald-600");
        expect(panel).toHaveClass("via-green-600");
        expect(panel).toHaveClass("to-teal-600");
    });

    it("applies custom background gradient", () => {
        const splitBackground = {
            gradient: "bg-gradient-to-r from-blue-500 to-purple-500",
        };

        render(
            <LeftPanel
                {...defaultProps}
                splitBackground={splitBackground}
            />
        );

        const panel = getMainPanelContainer();
        expect(panel).toHaveClass("from-blue-500");
        expect(panel).toHaveClass("to-purple-500");
    });

    it("applies background image when provided", () => {
        const splitBackground = {
            backgroundImage: "https://example.com/bg.jpg",
            overlayColor: "rgba(0,0,0,0.5)",
        };

        render(
            <LeftPanel
                {...defaultProps}
                splitBackground={splitBackground}
            />
        );

        // Find the main panel container
        const panel = getMainPanelContainer();
        // The panel should have the background image style
        expect(panel).toHaveStyle({
            backgroundImage: "url(https://example.com/bg.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
        });
    });

    it("renders custom logo", () => {
        const CustomLogo = () => <div data-testid="custom-logo">Custom Logo</div>;
        render(
            <LeftPanel
                {...defaultProps}
                logo={<CustomLogo />}
            />
        );

        expect(screen.getByTestId("custom-logo")).toBeInTheDocument();
    });

    it("renders footer text", () => {
        const leftPanelContent = {
            footerText: "© 2024 Custom Footer",
        };

        render(
            <LeftPanel
                {...defaultProps}
                leftPanelContent={leftPanelContent}
            />
        );

        expect(screen.getByText("© 2024 Custom Footer")).toBeInTheDocument();
    });

    it("renders default footer when no custom footer provided", () => {
        render(<LeftPanel {...defaultProps} />);

        // Use getAllByText since there are multiple elements with "YourBrand"
        const footerTexts = screen.getAllByText(/YourBrand/);
        expect(footerTexts.length).toBeGreaterThan(0);

        // Specifically check for the footer text (the one in the copyright section)
        const copyrightText = screen.getByText(/© 2024/);
        expect(copyrightText).toBeInTheDocument();

        // Check that the copyright text contains "YourBrand"
        const copyrightContainer = copyrightText.closest('div');
        expect(copyrightContainer?.textContent).toContain("YourBrand");
    });

    // Helper to get the main content container
    const getMainContentContainer = () => {
        const title = screen.getByText("Join Our Community");
        // Walk up to find the container with layout classes
        let container = title.parentElement;
        while (container && !container.className.includes('relative z-10')) {
            container = container.parentElement;
        }
        return container;
    };

    it("handles layout alignment", () => {
        const leftPanelContent = {
            layout: { align: "left" as const },
        };

        render(
            <LeftPanel
                {...defaultProps}
                leftPanelContent={leftPanelContent}
            />
        );

        // Find the main content container
        const contentContainer = getMainContentContainer();
        expect(contentContainer).toBeInTheDocument();
        expect(contentContainer).toHaveClass("items-start");
        expect(contentContainer).toHaveClass("text-left");
    });

    it("handles center layout alignment by default", () => {
        render(<LeftPanel {...defaultProps} />);

        // Find the main content container
        const contentContainer = getMainContentContainer();
        expect(contentContainer).toBeInTheDocument();
        expect(contentContainer).toHaveClass("items-center");
        expect(contentContainer).toHaveClass("text-center");
    });

    it("applies overlay for background image", () => {
        const splitBackground = {
            backgroundImage: "https://example.com/bg.jpg",
            overlayColor: "rgba(0,0,0,0.5)",
        };

        render(
            <LeftPanel
                {...defaultProps}
                splitBackground={splitBackground}
            />
        );

        // Find the main panel
        const panel = getMainPanelContainer();
        expect(panel).toBeInTheDocument();

        // Look for an overlay div (absolute positioned element inside the panel)
        const overlay = panel.querySelector('.absolute.inset-0');
        expect(overlay).toBeInTheDocument();

        // Check if overlay has a background color style
        if (overlay) {
            const hasOverlayStyle = overlay.getAttribute('style')?.includes('background-color') ||
                overlay.className.includes('bg-');
            expect(hasOverlayStyle).toBe(true);
        }
    });

    it("handles right layout alignment", () => {
        const leftPanelContent = {
            layout: { align: "right" as const },
        };

        render(
            <LeftPanel
                {...defaultProps}
                leftPanelContent={leftPanelContent}
            />
        );

        // Find the main content container
        const contentContainer = getMainContentContainer();
        expect(contentContainer).toBeInTheDocument();
        expect(contentContainer).toHaveClass("items-end");
        expect(contentContainer).toHaveClass("text-right");
    });
});