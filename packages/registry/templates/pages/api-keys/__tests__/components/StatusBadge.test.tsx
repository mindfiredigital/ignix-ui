// StatusBadge.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { StatusBadge } from "../../components/StatusBadge";

// Mock dependencies
vi.mock("../../../../utils/cn", () => ({
    cn: (...args: any[]) => args.filter(Boolean).join(" "),
}));

// Remove NewBadge mock since it's not being used
// The StatusBadge component renders spans directly

describe("StatusBadge Component", () => {
    it("renders active status badge", () => {
        render(<StatusBadge status="active" />);

        const badge = screen.getByText("Active");
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveClass(
            "inline-flex",
            "items-center",
            "gap-1",
            "px-2",
            "py-1",
            "rounded-full",
            "bg-green-100",
            "text-green-800",
            "dark:bg-green-900",
            "dark:text-green-100",
            "text-xs",
            "font-medium"
        );
    });

    it("renders inactive status badge", () => {
        render(<StatusBadge status="inactive" />);

        const badge = screen.getByText("Inactive");
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveClass(
            "inline-flex",
            "items-center",
            "gap-1",
            "px-2",
            "py-1",
            "rounded-full",
            "bg-yellow-100",
            "text-yellow-800",
            "dark:bg-yellow-900",
            "dark:text-yellow-100",
            "text-xs",
            "font-medium"
        );
    });

    it("renders expired status badge", () => {
        render(<StatusBadge status="expired" />);

        const badge = screen.getByText("Expired");
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveClass(
            "inline-flex",
            "items-center",
            "gap-1",
            "px-2",
            "py-1",
            "rounded-full",
            "bg-red-100",
            "text-red-800",
            "dark:bg-red-900",
            "dark:text-red-100",
            "text-xs",
            "font-medium"
        );
    });

    it("renders revoked status badge", () => {
        render(<StatusBadge status="revoked" />);

        const badge = screen.getByText("Revoked");
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveClass(
            "inline-flex",
            "items-center",
            "gap-1",
            "px-2",
            "py-1",
            "rounded-full",
            "bg-red-100",
            "text-red-800",
            "dark:bg-red-900",
            "dark:text-red-100",
            "text-xs",
            "font-medium"
        );
    });

    it("applies custom badge variant", () => {
        render(<StatusBadge status="active" badgeVariant="pulse" />);

        const badge = screen.getByText("Active");
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveClass("animate-pulse");
    });

    it("only animates active badges by default", () => {
        const { rerender } = render(<StatusBadge status="active" />);

        let badge = screen.getByText("Active");
        expect(badge).not.toHaveClass("animate-pulse");

        rerender(<StatusBadge status="inactive" />);
        badge = screen.getByText("Inactive");
        expect(badge).not.toHaveClass("animate-pulse");
    });

    it("applies custom className", () => {
        render(<StatusBadge status="active" className="custom-class" />);

        const badge = screen.getByText("Active");
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveClass("custom-class");
    });

    it("respects badgeVariant prop for non-active statuses", () => {
        render(<StatusBadge status="inactive" badgeVariant="pulse" />);

        const badge = screen.getByText("Inactive");
        expect(badge).toBeInTheDocument();
        // Inactive should not have pulse animation
        expect(badge).not.toHaveClass("animate-pulse");
    });

    it("adds animation when badgeVariant is specified for active status", () => {
        const { rerender } = render(<StatusBadge status="active" />);

        let badge = screen.getByText("Active");
        expect(badge).not.toHaveClass("animate-pulse");

        rerender(<StatusBadge status="active" badgeVariant="pulse" />);
        badge = screen.getByText("Active");
        expect(badge).toHaveClass("animate-pulse");
    });

    it("does not add animation for non-active statuses even with badgeVariant", () => {
        const { rerender } = render(<StatusBadge status="inactive" badgeVariant="pulse" />);

        let badge = screen.getByText("Inactive");
        expect(badge).not.toHaveClass("animate-pulse");

        rerender(<StatusBadge status="expired" badgeVariant="pulse" />);
        badge = screen.getByText("Expired");
        expect(badge).not.toHaveClass("animate-pulse");

        rerender(<StatusBadge status="revoked" badgeVariant="pulse" />);
        badge = screen.getByText("Revoked");
        expect(badge).not.toHaveClass("animate-pulse");
    });
});