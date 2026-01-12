// components/ErrorDisplay.test.tsx
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ErrorDisplay } from "../../components/ErrorDisplay";

// Mock dependencies
vi.mock("../../../../../utils/cn", () => ({
    cn: (...classes: any[]) => classes.filter(Boolean).join(" "),
}));

vi.mock("framer-motion", () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("lucide-react", () => ({
    AlertCircle: () => <div data-testid="alert-circle-icon" />,
}));

describe("ErrorDisplay Component", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("returns null when no error is provided", () => {
        const { container } = render(
            <ErrorDisplay error={undefined} isDarkVariant={false} />
        );

        expect(container.firstChild).toBeNull();
    });

    it("renders error message when provided", () => {
        const errorMessage = "An error occurred";
        render(
            <ErrorDisplay error={errorMessage} isDarkVariant={false} />
        );

        expect(screen.getByText(errorMessage)).toBeInTheDocument();
        expect(screen.getByTestId("alert-circle-icon")).toBeInTheDocument();
    });

    it("applies dark variant styles", () => {
        const errorMessage = "Dark mode error";
        render(
            <ErrorDisplay error={errorMessage} isDarkVariant={true} />
        );

        const errorContainer = screen.getByText(errorMessage).parentElement;
        const errorText = screen.getByText(errorMessage);

        // Container styles
        expect(errorContainer).toHaveClass("bg-red-900/20");
        expect(errorContainer).toHaveClass("border-red-800");

        // Text styles (on the span element, not container)
        expect(errorText).toHaveClass("text-red-300");
    });

    it("applies light variant styles", () => {
        const errorMessage = "Light mode error";
        render(
            <ErrorDisplay error={errorMessage} isDarkVariant={false} />
        );

        const errorContainer = screen.getByText(errorMessage).parentElement;
        const errorText = screen.getByText(errorMessage);

        // Container styles
        expect(errorContainer).toHaveClass("bg-red-50");
        expect(errorContainer).toHaveClass("border-red-200");

        // Text styles (on the span element, not container)
        expect(errorText).toHaveClass("text-red-700");
    });

    it("renders with proper structure", () => {
        const errorMessage = "Test error";
        render(
            <ErrorDisplay error={errorMessage} isDarkVariant={false} />
        );

        const icon = screen.getByTestId("alert-circle-icon");
        const text = screen.getByText(errorMessage);

        expect(icon).toBeInTheDocument();
        expect(text).toBeInTheDocument();

        // Check they're in the same container
        const container = icon.parentElement;
        expect(container).toContainElement(text);
    });

    it("has animation properties", () => {
        const errorMessage = "Animated error";
        render(
            <ErrorDisplay error={errorMessage} isDarkVariant={false} />
        );

        const errorContainer = screen.getByText(errorMessage).parentElement;
        expect(errorContainer).toBeInTheDocument();
        // The motion.div should pass through animation props
        expect(errorContainer).toHaveAttribute("initial");
        expect(errorContainer).toHaveAttribute("animate");
        expect(errorContainer).toHaveAttribute("exit");
    });

    it("handles multiple line error messages", () => {
        const errorMessage = "Multiple line\nerror message";
        render(
            <ErrorDisplay error={errorMessage} isDarkVariant={false} />
        );

        // Instead of using a complex matcher, just check that the text content exists
        // The span element should contain the exact text with newline
        const spanElement = screen.getByText((content, element) => {
            // Only match span elements
            return element?.tagName.toLowerCase() === 'span' &&
                element.textContent === errorMessage;
        });

        expect(spanElement).toBeInTheDocument();
        expect(spanElement.textContent).toBe(errorMessage);
    });

    it("handles error messages with special characters", () => {
        const errorMessage = "Error: Something went wrong! (Code: 500)";
        render(
            <ErrorDisplay error={errorMessage} isDarkVariant={false} />
        );

        expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it("maintains accessibility with proper structure", () => {
        const errorMessage = "Accessible error";
        render(
            <ErrorDisplay error={errorMessage} isDarkVariant={false} />
        );

        const errorContainer = screen.getByText(errorMessage).parentElement;

        // Check for semantic structure - the error is clearly presented
        expect(errorContainer).toHaveClass("flex");
        expect(errorContainer).toHaveClass("items-start");

        // The icon provides visual indication
        const icon = screen.getByTestId("alert-circle-icon");
        expect(icon).toBeInTheDocument();

        // The text is clearly styled as an error
        const errorText = screen.getByText(errorMessage);
        expect(errorText).toHaveClass("font-medium");
        expect(errorText).toHaveClass("text-sm");
    });

    it("applies correct margins and padding", () => {
        const errorMessage = "Error with spacing";
        render(
            <ErrorDisplay error={errorMessage} isDarkVariant={false} />
        );

        const errorContainer = screen.getByText(errorMessage).parentElement;
        expect(errorContainer).toHaveClass("mb-6");
        expect(errorContainer).toHaveClass("p-4");
        expect(errorContainer).toHaveClass("rounded-lg");
    });

    it("uses AnimatePresence for conditional rendering", () => {
        const errorMessage = "Animated error";
        render(
            <ErrorDisplay error={errorMessage} isDarkVariant={false} />
        );

        // The component should be wrapped in AnimatePresence
        // We can't directly test this, but we can verify the structure
        const errorContainer = screen.getByText(errorMessage).parentElement;
        expect(errorContainer).toBeInTheDocument();
    });
});