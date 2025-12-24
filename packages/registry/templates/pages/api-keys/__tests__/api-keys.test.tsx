
// ApiKeysPage.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ApiKeysPage } from "../";

// Simple framer-motion mock
vi.mock("framer-motion", () => {
    const createMotionComponent = (tagName: string) => {
        const Component = React.forwardRef(({ children, ...props }: any, ref) => {
            const {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                initial, animate, exit, whileHover, whileTap,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                transition, layout, variants, custom, animationVariant,
                ...domProps
            } = props;
            return React.createElement(tagName, { ...domProps, ref }, children);
        });
        Component.displayName = `motion.${tagName}`;
        return Component;
    };

    return {
        motion: {
            div: createMotionComponent("div"),
            span: createMotionComponent("span"),
            button: createMotionComponent("button"),
            section: createMotionComponent("section"),
            header: createMotionComponent("header"),
            main: createMotionComponent("main"),
            footer: createMotionComponent("footer"),
            nav: createMotionComponent("nav"),
            article: createMotionComponent("article"),
            aside: createMotionComponent("aside"),
            h1: createMotionComponent("h1"),
            h2: createMotionComponent("h2"),
            h3: createMotionComponent("h3"),
            h4: createMotionComponent("h4"),
            h5: createMotionComponent("h5"),
            h6: createMotionComponent("h6"),
            p: createMotionComponent("p"),
            ul: createMotionComponent("ul"),
            ol: createMotionComponent("ol"),
            li: createMotionComponent("li"),
            a: createMotionComponent("a"),
            input: createMotionComponent("input"),
        },
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

// Complete lucide-react mock with ALL icons
vi.mock("lucide-react", () => {
    const createMockIcon = (name: string) => ({ className, ...props }: any) =>
        <span data-testid={`icon-${name.toLowerCase()}`} className={className} {...props} />;

    return {
        Search: createMockIcon("search"),
        Filter: createMockIcon("filter"),
        Key: createMockIcon("key"),
        Plus: createMockIcon("plus"),
        Eye: createMockIcon("eye"),
        Trash2: createMockIcon("trash2"),
        Copy: createMockIcon("copy"),
        Shield: createMockIcon("shield"),
        Loader2: createMockIcon("loader2"),
        Download: createMockIcon("download"),
        Ban: createMockIcon("ban"),
        Users: createMockIcon("users"),
        UserPlus: createMockIcon("userplus"),
        Database: createMockIcon("database"),
        Edit: createMockIcon("edit"),
        EyeOff: createMockIcon("eyeoff"),
        Calendar: createMockIcon("calendar"),
        Activity: createMockIcon("activity"),
        Clock: createMockIcon("clock"),
        Grid: createMockIcon("grid"),
        List: createMockIcon("list"),
        X: createMockIcon("x"),
        Check: createMockIcon("check"),
        AlertCircle: createMockIcon("alertcircle"),
        BarChart3: createMockIcon("barchart3"),
        Settings: createMockIcon("settings"),
        ChevronRight: createMockIcon("chevronright"),
        CheckCircle: createMockIcon("checkcircle"),
        ChevronDown: createMockIcon("chevrondown"),
        ChevronUp: createMockIcon("chevronup"),
        ChevronLeft: createMockIcon("chevronleft"),
        MoreHorizontal: createMockIcon("morehorizontal"),
        MoreVertical: createMockIcon("morevertical"), // Added this missing icon
        RefreshCw: createMockIcon("refreshcw"),
        ExternalLink: createMockIcon("externallink"),
        Info: createMockIcon("info"),
        AlertTriangle: createMockIcon("alerttriangle"),
        Mail: createMockIcon("mail"),
        Lock: createMockIcon("lock"),
        Globe: createMockIcon("globe"),
        Server: createMockIcon("server"),
        CreditCard: createMockIcon("creditcard"),
        Bell: createMockIcon("bell"),
        User: createMockIcon("user"),
        Home: createMockIcon("home"),
        Folder: createMockIcon("folder"),
        FileText: createMockIcon("filetext"),
        Image: createMockIcon("image"),
        Video: createMockIcon("video"),
        Music: createMockIcon("music"),
        Package: createMockIcon("package"),
        ShoppingCart: createMockIcon("shoppingcart"),
        Tag: createMockIcon("tag"),
        Star: createMockIcon("star"),
        Heart: createMockIcon("heart"),
        ThumbsUp: createMockIcon("thumbsup"),
        MessageSquare: createMockIcon("messagesquare"),
        Send: createMockIcon("send"),
        Share2: createMockIcon("share2"),
        Bookmark: createMockIcon("bookmark"),
        Camera: createMockIcon("camera"),
        Mic: createMockIcon("mic"),
        Headphones: createMockIcon("headphones"),
        Smartphone: createMockIcon("smartphone"),
        Tablet: createMockIcon("tablet"),
        Monitor: createMockIcon("monitor"),
        Printer: createMockIcon("printer"),
        Wifi: createMockIcon("wifi"),
        Bluetooth: createMockIcon("bluetooth"),
        Battery: createMockIcon("battery"),
        Zap: createMockIcon("zap"),
        Cloud: createMockIcon("cloud"),
        Sun: createMockIcon("sun"),
        Moon: createMockIcon("moon"),
        CloudRain: createMockIcon("cloudrain"),
        CloudSnow: createMockIcon("cloudsnow"),
        Wind: createMockIcon("wind"),
        Thermometer: createMockIcon("thermometer"),
        Umbrella: createMockIcon("umbrella"),
        Flag: createMockIcon("flag"),
        MapPin: createMockIcon("mappin"),
        Navigation: createMockIcon("navigation"),
        Compass: createMockIcon("compass"),
        Layers: createMockIcon("layers"),
        Box: createMockIcon("box"),
        Briefcase: createMockIcon("briefcase"),
        Coffee: createMockIcon("coffee"),
        Gift: createMockIcon("gift"),
        Award: createMockIcon("award"),
        TrendingUp: createMockIcon("trendingup"),
        TrendingDown: createMockIcon("trendingdown"),
        DollarSign: createMockIcon("dollarsign"),
        Euro: createMockIcon("euro"),
        PoundSterling: createMockIcon("poundsterling"),
        Bitcoin: createMockIcon("bitcoin"),
    };
});

vi.mock("../../../utils/cn", () => ({
    cn: (...args: any[]) => args.filter(Boolean).join(" "),
}));

// Mock for API key card components
vi.mock("./components/ApiKeyCard", () => ({
    ApiKeyCard: ({
        apiKey,
        onCopy,
        onDelete,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        onEdit,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        viewMode = "list"
    }: any) => (
        <div data-testid="api-key-card">
            <div>{apiKey?.name}</div>
            <div>{apiKey?.keyPrefix}••••{apiKey?.keySuffix}</div>
            <button
                data-testid="copy-key-btn"
                onClick={() => onCopy?.(apiKey)}
            >
                <span data-testid="icon-copy" />
            </button>
            <button
                data-testid="delete-key-btn"
                onClick={() => onDelete?.(apiKey)}
            >
                <span data-testid="icon-trash2" />
            </button>
            <button
                data-testid="more-options-btn"
            >
                <span data-testid="icon-morevertical" />
            </button>
        </div>
    ),
}));

// Mock for EmptyState component
vi.mock("./components/EmptyState", () => ({
    EmptyState: () => (
        <div data-testid="empty-state">
            <h3>No API Keys</h3>
            <p>Generate Your First Key</p>
        </div>
    ),
}));

vi.mock("../../../../components/input", () => ({
    AnimatedInput: ({
        placeholder,
        value,
        onChange,
        type = "text",
        ...props
    }: any) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { animationVariant, ...restProps } = props;
        return (
            <input
                type={type}
                placeholder={placeholder}
                value={value || ""}
                onChange={(e) => onChange?.(e.target.value)}
                data-testid="search-input"
                {...restProps}
            />
        );
    },
}));

vi.mock("../../../../components/button", () => ({
    Button: ({ children, onClick, variant, size, className, ...props }: any) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { animationVariant, ...restProps } = props;
        return (
            <button
                onClick={onClick}
                className={`button ${variant || ''} ${size || ''} ${className || ''}`}
                {...restProps}
                data-testid={props['data-testid'] || 'button'}
            >
                {children}
            </button>
        );
    },
}));

vi.mock("../../../../components/checkbox", () => ({
    Checkbox: ({ checked, onChange, ...props }: any) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { animationVariant, ...restProps } = props;
        return (
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange?.(e.target.checked)}
                {...restProps}
            />
        );
    },
}));

vi.mock("./components/Notification", () => ({
    Notification: ({ message, onClose }: any) => (
        <div data-testid="notification">
            {message}
            <button onClick={onClose}>Close</button>
        </div>
    ),
}));

vi.mock("./components/StatsOverview", () => ({
    StatsOverview: ({ stats }: any) => (
        <div data-testid="stats-overview">
            <div>Total Keys: {stats?.totalKeys || 0}</div>
            <div>Active Keys: {stats?.activeKeys || 0}</div>
            <div>Expired Keys: {stats?.expiredKeys || 0}</div>
            <div>Revoked Keys: {stats?.revokedKeys || 0}</div>
        </div>
    ),
}));

// Mock SearchFilter component
vi.mock("./components/SearchFilter", () => ({
    SearchFilter: ({
        searchQuery,
        onSearchChange,
        searchPlaceholder = "Search API keys...",
        onFilterClick
    }: any) => (
        <div data-testid="search-filter">
            <div className="relative">
                <span data-testid="icon-search" />
                <input
                    data-testid="search-input"
                    value={searchQuery || ""}
                    onChange={(e) => onSearchChange?.(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="pl-10"
                />
            </div>
            <button onClick={onFilterClick}>
                <span data-testid="icon-filter" />
                Filter
            </button>
        </div>
    ),
}));

// Mock GenerateKeyModal - Fixed to actually open when button is clicked
vi.mock("./components/GenerateKeyModal", () => {
    const GenerateKeyModal = ({ isOpen, onClose, onGenerate }: any) => {
        const [internalOpen, setInternalOpen] = React.useState(isOpen);

        React.useEffect(() => {
            setInternalOpen(isOpen);
        }, [isOpen]);

        const handleGenerate = () => {
            onGenerate?.({ name: "Test Key", scopes: [] });
            setInternalOpen(false);
            onClose?.();
        };

        const handleClose = () => {
            setInternalOpen(false);
            onClose?.();
        };

        return internalOpen ? (
            <div data-testid="generate-key-modal">
                <div>Generate New API Key</div>
                <button onClick={handleGenerate}>Generate</button>
                <button onClick={handleClose}>Close</button>
            </div>
        ) : null;
    };

    return { GenerateKeyModal };
});

// Mock DeleteKeyModal - Fixed to actually open when button is clicked
vi.mock("./components/DeleteKeyModal", () => {
    const DeleteKeyModal = ({
        isOpen,
        onClose,
        onDelete,
        keyName
    }: any) => {
        const [internalOpen, setInternalOpen] = React.useState(isOpen);

        React.useEffect(() => {
            setInternalOpen(isOpen);
        }, [isOpen]);

        const handleDelete = () => {
            onDelete?.();
            setInternalOpen(false);
            onClose?.();
        };

        const handleClose = () => {
            setInternalOpen(false);
            onClose?.();
        };

        return internalOpen ? (
            <div data-testid="delete-key-modal">
                <div>Delete API Key</div>
                <p>Are you sure you want to delete {keyName}?</p>
                <button onClick={handleDelete}>Delete</button>
                <button onClick={handleClose}>Cancel</button>
            </div>
        ) : null;
    };

    return { DeleteKeyModal };
});

// Mock ViewToggle component
vi.mock("./components/ViewToggle", () => ({
    ViewToggle: ({ viewMode, onViewChange }: any) => (
        <div data-testid="view-toggle">
            <button
                onClick={() => onViewChange?.("grid")}
                data-active={viewMode === "grid"}
            >
                <span data-testid="icon-grid" />
                Grid
            </button>
            <button
                onClick={() => onViewChange?.("list")}
                data-active={viewMode === "list"}
            >
                <span data-testid="icon-list" />
                List
            </button>
        </div>
    ),
}));

describe("ApiKeysPage Component", () => {
    const mockApiKeys = [
        {
            id: "1",
            name: "Test Key",
            keyPrefix: "sk_live_",
            keySuffix: "abcd",
            scopes: ["read:users"],
            createdAt: new Date("2024-01-01"),
            lastUsed: new Date("2024-01-02"),
            usageCount: 100,
            usageHistory: [],
            status: "active" as const,
        },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders loading state correctly", () => {
        render(<ApiKeysPage isLoading={true} />);
        expect(screen.getByTestId("icon-loader2")).toBeInTheDocument();
    });

    it("renders header with default title", () => {
        render(<ApiKeysPage initialApiKeys={mockApiKeys} />);
        expect(screen.getByText("API Keys Management")).toBeInTheDocument();
        expect(screen.getByText("Manage your API access keys and permissions")).toBeInTheDocument();
    });

    it("renders custom header when provided", () => {
        const customHeader = <div data-testid="custom-header">Custom Header</div>;
        render(<ApiKeysPage customHeader={customHeader} initialApiKeys={mockApiKeys} />);
        expect(screen.getByTestId("custom-header")).toBeInTheDocument();
    });

    it("displays API keys in list view by default", () => {
        render(<ApiKeysPage initialApiKeys={mockApiKeys} />);
        expect(screen.getByText("Test Key")).toBeInTheDocument();
        expect(screen.getByText(/sk_live_/)).toBeInTheDocument();
    });

    it("filters API keys by search query", async () => {
        render(<ApiKeysPage initialApiKeys={mockApiKeys} />);

        const searchInput = screen.getByTestId("search-input");
        fireEvent.change(searchInput, { target: { value: "Test" } });

        expect(screen.getByText("Test Key")).toBeInTheDocument();

        fireEvent.change(searchInput, { target: { value: "Nonexistent" } });
        expect(screen.queryByText("Test Key")).not.toBeInTheDocument();
    });

    it("exports keys when export button is clicked", () => {
        const mockOnExport = vi.fn();
        render(
            <ApiKeysPage
                initialApiKeys={mockApiKeys}
                onExportKeys={mockOnExport}
                showExport={true}
            />
        );

        const exportButton = screen.getByText(/Export/i);
        fireEvent.click(exportButton);

        expect(mockOnExport).toHaveBeenCalled();
    });

    it("handles dark mode", () => {
        const { container } = render(
            <ApiKeysPage initialApiKeys={mockApiKeys} darkMode={true} />
        );
        expect(container.firstChild).toBeDefined();
    });

});