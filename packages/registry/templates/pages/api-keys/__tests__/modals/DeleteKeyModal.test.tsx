
// DeleteKeyModal.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { DeleteKeyModal } from "../../modals/DeleteKeyModal";

// Complete framer-motion mock
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

// Complete lucide-react mock
vi.mock("lucide-react", () => {
    const createMockIcon = (name: string) => () =>
        <span data-testid={`icon-${name.toLowerCase()}`} />;

    return {
        Trash2: createMockIcon("trash2"),
        AlertTriangle: createMockIcon("alerttriangle"),
        Loader2: createMockIcon("loader2"),
        Users: createMockIcon("users"),
        Database: createMockIcon("database"),
        BarChart3: createMockIcon("barchart3"),
        Settings: createMockIcon("settings"),
        Key: createMockIcon("key"),
        X: createMockIcon("x"),
        Check: createMockIcon("check"),
        Calendar: createMockIcon("calendar"),
        Clock: createMockIcon("clock"),
        Eye: createMockIcon("eye"),
        EyeOff: createMockIcon("eyeoff"),
        Copy: createMockIcon("copy"),
        Edit: createMockIcon("edit"),
        ChevronDown: createMockIcon("chevrondown"),
        ChevronRight: createMockIcon("chevronright"),
        ChevronUp: createMockIcon("chevronup"),
        ChevronLeft: createMockIcon("chevronleft"),
        Filter: createMockIcon("filter"),
        Search: createMockIcon("search"),
        Plus: createMockIcon("plus"),
        Download: createMockIcon("download"),
        Shield: createMockIcon("shield"),
        Ban: createMockIcon("ban"),
        UserPlus: createMockIcon("userplus"),
        Activity: createMockIcon("activity"),
        Grid: createMockIcon("grid"),
        List: createMockIcon("list"),
        AlertCircle: createMockIcon("alertcircle"),
        CheckCircle: createMockIcon("checkcircle"),
        MoreHorizontal: createMockIcon("morehorizontal"),
        MoreVertical: createMockIcon("morevertical"),
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

// Mock the input - but the actual component might not be using AnimatedInput
// So let's not mock it and let it render normally

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

vi.mock("../../../../components/typography", () => ({
    Typography: ({ children, ...props }: any) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { animationVariant, ...restProps } = props;
        return <div {...restProps}>{children}</div>;
    },
}));

// Fix StatusBadge mock path - it might be in a different location
vi.mock("../../components/StatusBadge", () => ({
    StatusBadge: ({ status }: any) => (
        <span data-testid="status-badge" className={`status-${status}`}>
            {status === 'active' ? 'Active' : status}
        </span>
    ),
}));

describe("DeleteKeyModal Component", () => {
    const mockApiKey = {
        id: "1",
        name: "Test API Key",
        keyPrefix: "sk_live_",
        keySuffix: "abcd",
        scopes: ["read:users"],
        createdAt: new Date("2024-01-01"),
        lastUsed: new Date("2024-01-02"),
        usageCount: 100,
        usageHistory: [],
        status: "active" as const,
    };

    const mockOnClose = vi.fn();
    const mockOnDelete = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("does not render when not open", () => {
        render(
            <DeleteKeyModal
                isOpen={false}
                onClose={mockOnClose}
                onDelete={mockOnDelete}
                apiKey={mockApiKey}
            />
        );

        expect(screen.queryByText("Delete API Key")).not.toBeInTheDocument();
    });

    it("renders modal with API key information", () => {
        render(
            <DeleteKeyModal
                isOpen={true}
                onClose={mockOnClose}
                onDelete={mockOnDelete}
                apiKey={mockApiKey}
            />
        );

        expect(screen.getByText("Delete API Key")).toBeInTheDocument();
        expect(screen.getByText(/Permanently delete/)).toBeInTheDocument();
        expect(screen.getByText("Test API Key")).toBeInTheDocument();
        // Check for status badge text instead of testid
        expect(screen.getByText("Active")).toBeInTheDocument();
        expect(screen.getByText("Key Details")).toBeInTheDocument();
    });

    it("shows warning message", () => {
        render(
            <DeleteKeyModal
                isOpen={true}
                onClose={mockOnClose}
                onDelete={mockOnDelete}
                apiKey={mockApiKey}
            />
        );

        expect(screen.getByText("Warning: Irreversible Action")).toBeInTheDocument();
        expect(screen.getByTestId("icon-alerttriangle")).toBeInTheDocument();
    });

    it("shows loading state", () => {
        render(
            <DeleteKeyModal
                isOpen={true}
                onClose={mockOnClose}
                onDelete={mockOnDelete}
                apiKey={mockApiKey}
                isLoading={true}
            />
        );

        expect(screen.getByText("Deleting...")).toBeInTheDocument();
        expect(screen.getByTestId("icon-loader2")).toBeInTheDocument();
    });

    it("calls onClose when cancel button is clicked", () => {
        render(
            <DeleteKeyModal
                isOpen={true}
                onClose={mockOnClose}
                onDelete={mockOnDelete}
                apiKey={mockApiKey}
            />
        );

        const cancelButton = screen.getByText("Cancel");
        fireEvent.click(cancelButton);

        expect(mockOnClose).toHaveBeenCalled();
    });

    it("does not render when apiKey is null", () => {
        render(
            <DeleteKeyModal
                isOpen={true}
                onClose={mockOnClose}
                onDelete={mockOnDelete}
                apiKey={null}
            />
        );

        expect(screen.queryByText("Delete API Key")).not.toBeInTheDocument();
    });
});