// ApiKeyCard.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ApiKeyCard } from "../../components/ApiKeyCard";

// Mock dependencies
vi.mock("../../../../utils/cn", () => ({
    cn: (...args: any[]) => args.filter(Boolean).join(" "),
}));

// Fix Button mock to match working pattern
vi.mock("../../../../components/button", () => ({
    Button: React.forwardRef(({ children, onClick, disabled, ...props }: any, ref) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { animationVariant, ...restProps } = props;
        return (
            <button
                ref={ref}
                onClick={onClick}
                disabled={disabled}
                {...restProps}
                data-testid={props['data-testid'] || 'button'}
            >
                {children}
            </button>
        );
    }),
}));

// Ensure Typography mock returns a valid component
vi.mock("../../../../components/typography", () => ({
    Typography: ({ children, ...props }: any) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { animationVariant, ...restProps } = props;
        return <div {...restProps}>{children}</div>;
    },
}));

// Mock child components
vi.mock("../components/ScopeBadge", () => ({
    ScopeBadge: ({ scope }: any) => <span data-testid="scope-badge">{scope}</span>,
}));

vi.mock("../components/StatusBadge", () => ({
    StatusBadge: ({ status }: any) => <span data-testid="status-badge">{status}</span>,
}));

vi.mock("../components/NewBadge", () => ({
    NewBadge: ({ text }: any) => <span data-testid="new-badge">{text}</span>,
}));

// Complete lucide-react mock similar to working example
vi.mock("lucide-react", () => {
    const createMockIcon = (name: string) => () =>
        <span data-testid={`icon-${name.toLowerCase()}`} />;

    return {
        Eye: createMockIcon("eye"),
        Trash2: createMockIcon("trash2"),
        Copy: createMockIcon("copy"),
        Check: createMockIcon("check"),
        MoreVertical: createMockIcon("morevertical"),
        Ban: createMockIcon("ban"),
        Users: createMockIcon("users"),
        Database: createMockIcon("database"),
        BarChart3: createMockIcon("barchart3"),
        Settings: createMockIcon("settings"),
        Key: createMockIcon("key"),
        Calendar: createMockIcon("calendar"),
        Clock: createMockIcon("clock"),
        EyeOff: createMockIcon("eyeoff"),
        ChevronRight: createMockIcon("chevronright"),
        ChevronDown: createMockIcon("chevrondown"),
        ChevronUp: createMockIcon("chevronup"),
        ChevronLeft: createMockIcon("chevronleft"),
        X: createMockIcon("x"),
        Edit: createMockIcon("edit"),
        AlertCircle: createMockIcon("alertcircle"),
        CheckCircle: createMockIcon("checkcircle"),
        XCircle: createMockIcon("xcircle"),
        Activity: createMockIcon("activity"),
        Grid: createMockIcon("grid"),
        List: createMockIcon("list"),
        AlertTriangle: createMockIcon("alerttriangle"),
        Loader2: createMockIcon("loader2"),
        Filter: createMockIcon("filter"),
        Search: createMockIcon("search"),
        Plus: createMockIcon("plus"),
        Download: createMockIcon("download"),
        Shield: createMockIcon("shield"),
        UserPlus: createMockIcon("userplus"),
        MoreHorizontal: createMockIcon("morehorizontal"),
        RefreshCw: createMockIcon("refreshcw"),
        ExternalLink: createMockIcon("externallink"),
        Info: createMockIcon("info"),
        Mail: createMockIcon("mail"),
        Lock: createMockIcon("lock"),
        Globe: createMockIcon("globe"),
        Server: createMockIcon("server"),
        CreditCard: createMockIcon("creditcard"),
        Bell: createMockIcon("bell"),
        User: createMockIcon("user"),
    };
});

// Add framer-motion mock if it's being used
vi.mock("framer-motion", () => {
    // Create a simple motion component
    const motionFactory = () => {
        const motion = new Proxy({}, {
            get: (_, prop) => {
                // Return a component for any HTML element
                const MotionComponent = React.forwardRef(({ children, ...props }: any, ref) => {
                    // Filter out animation props
                    const {
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        initial, animate, exit, whileHover, whileTap,
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        transition, layout, variants, custom, animationVariant,
                        ...restProps
                    } = props;
                    return React.createElement(prop as string, { ...restProps, ref }, children);
                });
                MotionComponent.displayName = `motion.${String(prop)}`;
                return MotionComponent;
            }
        });
        return motion;
    };

    return {
        motion: motionFactory(),
        useMotionValue: vi.fn(() => ({
            get: vi.fn(),
            set: vi.fn(),
            on: vi.fn(),
            stop: vi.fn(),
        })),
        useTransform: vi.fn(() => vi.fn()),
        useSpring: vi.fn(() => vi.fn()),
        AnimatePresence: ({ children }: any) => <>{children}</>,
        motionValue: vi.fn(),
        spring: vi.fn(),
        isBezierDefinition: vi.fn(),
    };
});

describe("ApiKeyCard Component", () => {
    const mockApiKey = {
        id: "1",
        name: "Test API Key",
        description: "Test Description",
        keyPrefix: "sk_live_",
        keySuffix: "abcd",
        scopes: ["read:users", "write:data"],
        createdAt: new Date("2024-01-01"),
        lastUsed: new Date("2024-01-02"),
        usageCount: 1000,
        usageHistory: [],
        status: "active" as const,
        expiresAt: new Date("2025-01-01"),
    };

    const mockCallbacks = {
        onSelect: vi.fn(),
        onReveal: vi.fn(),
        onDelete: vi.fn(),
        onCopy: vi.fn(),
        onRevoke: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
        Object.assign(navigator, {
            clipboard: {
                writeText: vi.fn(),
            },
        });
    });

    it("renders API key information correctly", () => {
        render(<ApiKeyCard apiKey={mockApiKey} />);

        expect(screen.getByText("Test API Key")).toBeInTheDocument();
        expect(screen.getByText("Test Description")).toBeInTheDocument();
        expect(screen.getByText("sk_live_••••••••abcd")).toBeInTheDocument();
        expect(screen.getByText("1,000 calls")).toBeInTheDocument();
    });

    it("calls onSelect when card is clicked", () => {
        render(<ApiKeyCard apiKey={mockApiKey} onSelect={mockCallbacks.onSelect} />);

        const card = screen.getByText("Test API Key").closest("div");
        fireEvent.click(card!);

        expect(mockCallbacks.onSelect).toHaveBeenCalledWith("1");
    });

    it("copies key when copy button is clicked", () => {
        render(<ApiKeyCard apiKey={mockApiKey} onCopy={mockCallbacks.onCopy} />);

        // Use the icon test id from our mock
        const copyIcon = screen.getByTestId("icon-copy");
        const copyButton = copyIcon.closest("button");
        fireEvent.click(copyButton!);

        expect(navigator.clipboard.writeText).toHaveBeenCalledWith("sk_live_••••••••abcd");
        expect(mockCallbacks.onCopy).toHaveBeenCalledWith(mockApiKey);
    });

    it("shows menu when more button is clicked", () => {
        render(<ApiKeyCard apiKey={mockApiKey} />);

        // Use the icon test id from our mock
        const menuIcon = screen.getByTestId("icon-morevertical");
        const menuButton = menuIcon.closest("button");
        fireEvent.click(menuButton!);

        expect(screen.getByText("Reveal Key")).toBeInTheDocument();
        expect(screen.getByText("Copy Reference")).toBeInTheDocument();
        expect(screen.getByText("Revoke Key")).toBeInTheDocument();
        expect(screen.getByText("Delete")).toBeInTheDocument();
    });

    it("calls onReveal when Reveal Key is clicked", () => {
        render(<ApiKeyCard apiKey={mockApiKey} onReveal={mockCallbacks.onReveal} />);

        // Open menu
        const menuIcon = screen.getByTestId("icon-morevertical");
        const menuButton = menuIcon.closest("button");
        fireEvent.click(menuButton!);

        // Click Reveal Key
        fireEvent.click(screen.getByText("Reveal Key"));

        expect(mockCallbacks.onReveal).toHaveBeenCalledWith(mockApiKey);
    });

    it("shows selected state when isSelected is true", () => {
        const { container } = render(
            <ApiKeyCard apiKey={mockApiKey} isSelected={true} />
        );

        expect(container.firstChild).toHaveClass("border-primary");
    });

    it("formats dates correctly", () => {
        render(<ApiKeyCard apiKey={mockApiKey} />);

        // Check created date format
        const createdText = screen.getByText("Created").nextSibling?.textContent;
        expect(createdText).toMatch(/Jan \d+, 2024/);
    });

    it("shows 'Never used' when lastUsed is null", () => {
        const apiKeyWithoutLastUsed = { ...mockApiKey, lastUsed: null };
        render(<ApiKeyCard apiKey={apiKeyWithoutLastUsed} />);

        expect(screen.getByText("Never used")).toBeInTheDocument();
    });

    it("does not show revoke option for revoked keys", () => {
        const revokedKey = { ...mockApiKey, status: "revoked" as const };
        render(<ApiKeyCard apiKey={revokedKey} />);

        const menuIcon = screen.getByTestId("icon-morevertical");
        const menuButton = menuIcon.closest("button");
        fireEvent.click(menuButton!);

        // Revoke should not be in the menu for revoked keys
        expect(screen.queryByText("Revoke Key")).not.toBeInTheDocument();
    });
});