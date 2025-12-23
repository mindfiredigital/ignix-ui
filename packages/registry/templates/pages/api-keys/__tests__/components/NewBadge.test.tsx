// NewBadge.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { NewBadge } from "../../components/NewBadge";

describe("NewBadge Component", () => {
    it("renders with default props", () => {
        render(<NewBadge text="New" />);

        const badge = screen.getByText("New");
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveClass("inline-flex");
        expect(badge).toHaveClass("rounded-full");
    });

    it("applies primary type styling", () => {
        render(<NewBadge text="Primary" type="primary" />);

        const badge = screen.getByText("Primary");
        expect(badge).toHaveClass("bg-primary");
        expect(badge).toHaveClass("text-primary-foreground");
    });

    it("applies success type styling", () => {
        render(<NewBadge text="Success" type="success" />);

        const badge = screen.getByText("Success");
        expect(badge).toHaveClass("bg-green-100");
        expect(badge).toHaveClass("text-green-800");
    });

    it("applies warning type styling", () => {
        render(<NewBadge text="Warning" type="warning" />);

        const badge = screen.getByText("Warning");
        expect(badge).toHaveClass("bg-yellow-100");
        expect(badge).toHaveClass("text-yellow-800");
    });

    it("applies error type styling", () => {
        render(<NewBadge text="Error" type="error" />);

        const badge = screen.getByText("Error");
        expect(badge).toHaveClass("bg-red-100");
        expect(badge).toHaveClass("text-red-800");
    });

    it("applies animation variant classes", () => {
        render(<NewBadge text="Pulse" variant="pulse" />);
        expect(screen.getByText("Pulse")).toHaveClass("animate-pulse");

        render(<NewBadge text="Bounce" variant="bounce" />);
        expect(screen.getByText("Bounce")).toHaveClass("animate-bounce");
    });

    it("renders with custom className", () => {
        render(<NewBadge text="Custom" className="custom-class" />);

        const badge = screen.getByText("Custom");
        expect(badge).toHaveClass("custom-class");
    });

    it("shows icon when provided", () => {
        const MockIcon = () => <svg data-testid="mock-icon" />;
        render(<NewBadge text="With Icon" icon={MockIcon} showIcon={true} />);

        expect(screen.getByTestId("mock-icon")).toBeInTheDocument();
    });

});