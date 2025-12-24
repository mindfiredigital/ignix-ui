// ScopeBadge.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ScopeBadge } from "../../components/ScopeBadge";

// Mock dependencies
vi.mock("../../../../utils/cn", () => ({
    cn: (...args: any[]) => args.filter(Boolean).join(" "),
}));

// Mock NewBadge component with data-testid
vi.mock("../../components/NewBadge", () => ({
    NewBadge: ({ text, type, variant, className, icon: Icon }: any) => (
        <div data-testid="new-badge" data-type={type} data-variant={variant} className={className}>
            {text}
            {Icon && <Icon data-testid="badge-icon" />}
        </div>
    ),
}));

// Comprehensive lucide-react mock
vi.mock("lucide-react", () => {
    const createIcon = (name: string) => () => <div data-testid={`icon-${name.toLowerCase()}`} />;

    return {
        Users: createIcon("users"),
        Settings: createIcon("settings"),
        Database: createIcon("database"),
        BarChart3: createIcon("barchart3"),
        Key: createIcon("key"),
        Eye: createIcon("eye"),
        Trash2: createIcon("trash2"),
        Copy: createIcon("copy"),
        Check: createIcon("check"),
        MoreVertical: createIcon("morevertical"),
        Ban: createIcon("ban"),
        Calendar: createIcon("calendar"),
        Clock: createIcon("clock"),
        EyeOff: createIcon("eyeoff"),
        ChevronRight: createIcon("chevronright"),
        ChevronDown: createIcon("chevrondown"),
        ChevronUp: createIcon("chevronup"),
        ChevronLeft: createIcon("chevronleft"),
        X: createIcon("x"),
        Edit: createIcon("edit"),
        AlertCircle: createIcon("alertcircle"),
        CheckCircle: createIcon("checkcircle"),
        XCircle: createIcon("xcircle"),
        Activity: createIcon("activity"),
        Grid: createIcon("grid"),
        List: createIcon("list"),
        AlertTriangle: createIcon("alerttriangle"),
        Loader2: createIcon("loader2"),
        Filter: createIcon("filter"),
        Search: createIcon("search"),
        Plus: createIcon("plus"),
        Download: createIcon("download"),
        Shield: createIcon("shield"),
        UserPlus: createIcon("userplus"),
        MoreHorizontal: createIcon("morehorizontal"),
        RefreshCw: createIcon("refreshcw"),
        ExternalLink: createIcon("externallink"),
        Info: createIcon("info"),
        Mail: createIcon("mail"),
        Lock: createIcon("lock"),
        Globe: createIcon("globe"),
        Server: createIcon("server"),
        CreditCard: createIcon("creditcard"),
        Bell: createIcon("bell"),
        User: createIcon("user"),
        __esModule: true,
    };
});

// Mock SCOPES constant with all possible scopes
vi.mock("../constants", () => ({
    SCOPES: [
        {
            id: "read:users",
            name: "Read Users",
            description: "Access to read user data",
            risk: "low",
            icon: () => <div data-testid="icon-users" />,
        },
        {
            id: "write:users",
            name: "Write Users",
            description: "Create and update user data",
            risk: "medium",
            icon: () => <div data-testid="icon-users" />,
        },
        {
            id: "read:data",
            name: "Read Data",
            description: "Access to read application data",
            risk: "low",
            icon: () => <div data-testid="icon-database" />,
        },
        {
            id: "write:data",
            name: "Write Data",
            description: "Create and update application data",
            risk: "medium",
            icon: () => <div data-testid="icon-database" />,
        },
        {
            id: "read:analytics",
            name: "Read Analytics",
            description: "Access to analytics and metrics",
            risk: "low",
            icon: () => <div data-testid="icon-barchart3" />,
        },
        {
            id: "admin",
            name: "Admin Access",
            description: "Full administrative privileges",
            risk: "high",
            icon: () => <div data-testid="icon-settings" />,
        },
    ],
    SCOPE_RISK_BADGE_TYPES: {
        low: "success",
        medium: "warning",
        high: "error",
    },
}));

describe("ScopeBadge Component", () => {
    it("renders scope badge with correct text", () => {
        render(<ScopeBadge scope="read:users" />);

        expect(screen.getByText("Read Users")).toBeInTheDocument();
    });

    it("applies correct type based on risk level", () => {
        render(<ScopeBadge scope="read:users" />);

        const badge = screen.getByTestId("new-badge");
        expect(badge).toHaveAttribute("data-type", "success");
    });

    it("applies high risk type for admin scope", () => {
        render(<ScopeBadge scope="admin" />);

        const badge = screen.getByTestId("new-badge");
        expect(badge).toHaveAttribute("data-type", "error");
    });

    it("shows icon when showIcon is true", () => {
        render(<ScopeBadge scope="read:users" showIcon={true} />);

        // The icon has data-testid="icon-users" from the lucide-react mock
        expect(screen.getByTestId("icon-users")).toBeInTheDocument();
    });

    it("does not show icon when showIcon is false", () => {
        render(<ScopeBadge scope="read:users" showIcon={false} />);

        expect(screen.queryByTestId("icon-users")).not.toBeInTheDocument();
    });

    it("applies animation variant for high-risk scopes", () => {
        render(<ScopeBadge scope="admin" badgeVariant="pulse" />);

        const badge = screen.getByTestId("new-badge");
        expect(badge).toHaveAttribute("data-variant", "pulse");
    });

    it("does not animate low-risk scopes by default", () => {
        render(<ScopeBadge scope="read:users" badgeVariant="pulse" />);

        const badge = screen.getByTestId("new-badge");
        // Check that data-variant attribute is not present or is null/undefined
        expect(badge.getAttribute("data-variant")).toBeNull();
    });

    it("applies custom className", () => {
        render(<ScopeBadge scope="read:users" className="custom-class" />);

        const badge = screen.getByTestId("new-badge");
        expect(badge).toHaveClass("custom-class");
    });

    it("returns null for non-existent scope", () => {
        const { container } = render(<ScopeBadge scope="nonexistent" />);

        expect(container.firstChild).toBeNull();
    });

    // Additional tests for other scope types
    it("renders medium risk scope correctly", () => {
        render(<ScopeBadge scope="write:data" />);

        const badge = screen.getByTestId("new-badge");
        expect(badge).toHaveAttribute("data-type", "warning");
    });

    it("handles different scope icons", () => {
        render(<ScopeBadge scope="read:analytics" showIcon={true} />);

        // The icon has data-testid="icon-barchart3" from the lucide-react mock
        expect(screen.getByTestId("icon-barchart3")).toBeInTheDocument();
    });
});