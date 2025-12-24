// GenerateKeyModal.test.tsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { GenerateKeyModal } from "../../modals/GenerateKeyModal";

// Complete framer-motion mock
vi.mock("framer-motion", () => {
    const motionFactory = () => {
        const motion = new Proxy({}, {
            get: (_, prop) => {
                const MotionComponent = React.forwardRef(({ children, ...props }: any, ref) => {
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
        Users: createMockIcon("users"),
        Database: createMockIcon("database"),
        BarChart3: createMockIcon("barchart3"),
        Settings: createMockIcon("settings"),
        Key: createMockIcon("key"),
        Copy: createMockIcon("copy"),
        Check: createMockIcon("check"),
        AlertTriangle: createMockIcon("alerttriangle"),
        Loader2: createMockIcon("loader2"),
        CheckCircle: createMockIcon("checkcircle"),
        X: createMockIcon("x"),
        Calendar: createMockIcon("calendar"),
        Clock: createMockIcon("clock"),
        Eye: createMockIcon("eye"),
        EyeOff: createMockIcon("eyeoff"),
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
        Trash2: createMockIcon("trash2"),
    };
});

vi.mock("../../../../utils/cn", () => ({
    cn: (...args: any[]) => args.filter(Boolean).join(" "),
}));

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

vi.mock("../../components/StatusBadge", () => ({
    StatusBadge: () => <span data-testid="status-badge">Active</span>,
}));

vi.mock("../../components/ScopeBadge", () => ({
    ScopeBadge: ({ scope }: any) => <span data-testid="scope-badge">{scope}</span>,
}));

// Mock constants
vi.mock("../../constants", () => ({
    SCOPES: [
        {
            id: "read:users" as const,
            name: "Read Users",
            description: "Access to read user data",
            risk: "low" as const,
            icon: () => <span data-testid="icon-users" />,
        },
        {
            id: "write:data" as const,
            name: "Write Data",
            description: "Create and update application data",
            risk: "medium" as const,
            icon: () => <span data-testid="icon-database" />,
        },
    ],
}));

describe("GenerateKeyModal Component", () => {
    const mockOnClose = vi.fn();
    const mockOnGenerate = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        Object.assign(navigator, {
            clipboard: {
                writeText: vi.fn(),
            },
        });
    });

    // Helper function to find input by preceding label text
    const getInputByLabel = (labelText: string) => {
        // Find all labels with the text
        const labels = screen.getAllByText(labelText);

        // For each label, find the closest input
        for (const label of labels) {
            // The input is usually in a sibling or parent div
            const container = label.closest('div[class*="relative"]') || label.parentElement?.parentElement;
            if (container) {
                const input = container.querySelector('input');
                if (input) return input;
            }
        }

        // Fallback: try to find by placeholder or other means
        const inputs = screen.getAllByRole('textbox');
        for (const input of inputs) {
            const container = input.closest('div[class*="relative"]');
            if (container) {
                const label = container.querySelector('label');
                if (label && label.textContent?.includes(labelText)) {
                    return input;
                }
            }
        }

        // Last resort: get all inputs and check their surrounding context
        const allInputs = screen.getAllByRole('textbox');
        if (allInputs.length > 0) {
            // Assuming first textbox is key name, second is description
            if (labelText.includes('Production API')) return allInputs[0];
            if (labelText.includes('Optional description')) return allInputs[1];
        }

        throw new Error(`Could not find input with label: ${labelText}`);
    };

    it("does not render when not open", () => {
        render(
            <GenerateKeyModal
                isOpen={false}
                onClose={mockOnClose}
                onGenerate={mockOnGenerate}
            />
        );

        expect(screen.queryByText("Generate New API Key")).not.toBeInTheDocument();
    });

    it("renders form step initially", () => {
        render(
            <GenerateKeyModal
                isOpen={true}
                onClose={mockOnClose}
                onGenerate={mockOnGenerate}
            />
        );

        expect(screen.getByText("Generate New API Key")).toBeInTheDocument();
        expect(screen.getByText("Read Users")).toBeInTheDocument();
        expect(screen.getByText("Write Data")).toBeInTheDocument();
    });

    it("toggles scope selection", () => {
        render(
            <GenerateKeyModal
                isOpen={true}
                onClose={mockOnClose}
                onGenerate={mockOnGenerate}
            />
        );

        // Find scope item by text and click it
        const scopeText = screen.getByText("Read Users");
        const scopeItem = scopeText.closest('[data-testid^="scope-"]') || scopeText.closest('div');
        fireEvent.click(scopeItem!);

        // Should show check icon for selected scope
        expect(screen.getByTestId("icon-check")).toBeInTheDocument();
    });

    it("submits form with valid data", async () => {
        const mockGeneratedKey = {
            id: "1",
            name: "Test Key",
            keyPrefix: "sk_live_",
            keySuffix: "abcd",
            fullKey: "sk_live_test123",
            scopes: ["read:users"],
            createdAt: new Date(),
            lastUsed: null,
            usageCount: 0,
            usageHistory: [],
            status: "active" as const,
        };

        mockOnGenerate.mockResolvedValueOnce(mockGeneratedKey);

        render(
            <GenerateKeyModal
                isOpen={true}
                onClose={mockOnClose}
                onGenerate={mockOnGenerate}
            />
        );

        // Fill form - use helper function
        const nameInput = getInputByLabel("e.g., Production API");
        fireEvent.change(nameInput, { target: { value: "Test Key" } });

        // Select scope
        const scopeText = screen.getByText("Read Users");
        const scopeItem = scopeText.closest('[data-testid^="scope-"]') || scopeText.closest('div');
        fireEvent.click(scopeItem!);

        // Click generate
        const generateButton = screen.getByText("Generate Key");
        fireEvent.click(generateButton);

        await waitFor(() => {
            expect(mockOnGenerate).toHaveBeenCalledWith({
                name: "Test Key",
                scopes: ["read:users"],
                expiresAt: undefined,
                description: "",
            });
        });
    });

    it("shows result step after generation", async () => {
        const mockGeneratedKey = {
            id: "1",
            name: "Test Key",
            keyPrefix: "sk_live_",
            keySuffix: "abcd",
            fullKey: "sk_live_test123456",
            scopes: ["read:users"],
            createdAt: new Date(),
            lastUsed: null,
            usageCount: 0,
            usageHistory: [],
            status: "active" as const,
        };

        mockOnGenerate.mockResolvedValueOnce(mockGeneratedKey);

        render(
            <GenerateKeyModal
                isOpen={true}
                onClose={mockOnClose}
                onGenerate={mockOnGenerate}
            />
        );

        // Fill and submit form
        const nameInput = getInputByLabel("e.g., Production API");
        fireEvent.change(nameInput, { target: { value: "Test Key" } });

        const scopeText = screen.getByText("Read Users");
        const scopeItem = scopeText.closest('[data-testid^="scope-"]') || scopeText.closest('div');
        fireEvent.click(scopeItem!);

        const generateButton = screen.getByText("Generate Key");
        fireEvent.click(generateButton);

        await waitFor(() => {
            expect(screen.getByText("API Key Generated")).toBeInTheDocument();
            expect(screen.getByText("sk_live_test123456")).toBeInTheDocument();
            expect(screen.getByTestId("icon-checkcircle")).toBeInTheDocument();
        });
    });

    it("copies generated key", async () => {
        const mockGeneratedKey = {
            id: "1",
            name: "Test Key",
            keyPrefix: "sk_live_",
            keySuffix: "abcd",
            fullKey: "sk_live_test123",
            scopes: ["read:users"],
            createdAt: new Date(),
            lastUsed: null,
            usageCount: 0,
            usageHistory: [],
            status: "active" as const,
        };

        mockOnGenerate.mockResolvedValueOnce(mockGeneratedKey);

        render(
            <GenerateKeyModal
                isOpen={true}
                onClose={mockOnClose}
                onGenerate={mockOnGenerate}
            />
        );

        // Generate key first
        const nameInput = getInputByLabel("e.g., Production API");
        fireEvent.change(nameInput, { target: { value: "Test Key" } });

        const scopeText = screen.getByText("Read Users");
        const scopeItem = scopeText.closest('[data-testid^="scope-"]') || scopeText.closest('div');
        fireEvent.click(scopeItem!);

        const generateButton = screen.getByText("Generate Key");
        fireEvent.click(generateButton);

        await waitFor(() => {
            // Find copy button by icon
            const copyButton = screen.getByTestId("icon-copy").closest("button");
            fireEvent.click(copyButton!);

            expect(navigator.clipboard.writeText).toHaveBeenCalledWith("sk_live_test123");
        });
    });

    it("shows loading state", () => {
        render(
            <GenerateKeyModal
                isOpen={true}
                onClose={mockOnClose}
                onGenerate={mockOnGenerate}
                isLoading={true}
            />
        );

        expect(screen.getByText("Generating...")).toBeInTheDocument();
        expect(screen.getByTestId("icon-loader2")).toBeInTheDocument();
    });

    it("closes modal when done button is clicked in result step", async () => {
        const mockGeneratedKey = {
            id: "1",
            name: "Test Key",
            keyPrefix: "sk_live_",
            keySuffix: "abcd",
            fullKey: "sk_live_test123",
            scopes: ["read:users"],
            createdAt: new Date(),
            lastUsed: null,
            usageCount: 0,
            usageHistory: [],
            status: "active" as const,
        };

        mockOnGenerate.mockResolvedValueOnce(mockGeneratedKey);

        render(
            <GenerateKeyModal
                isOpen={true}
                onClose={mockOnClose}
                onGenerate={mockOnGenerate}
            />
        );

        // Generate key
        const nameInput = getInputByLabel("e.g., Production API");
        fireEvent.change(nameInput, { target: { value: "Test Key" } });

        const scopeText = screen.getByText("Read Users");
        const scopeItem = scopeText.closest('[data-testid^="scope-"]') || scopeText.closest('div');
        fireEvent.click(scopeItem!);

        const generateButton = screen.getByText("Generate Key");
        fireEvent.click(generateButton);

        await waitFor(() => {
            const doneButton = screen.getByText("Done");
            fireEvent.click(doneButton);

            expect(mockOnClose).toHaveBeenCalled();
        });
    });
});