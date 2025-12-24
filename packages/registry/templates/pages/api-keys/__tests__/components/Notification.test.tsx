// Notification.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Notification } from "../../components/Notification";

// Mock framer-motion
vi.mock("framer-motion", () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
}));

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
    Activity: () => <div data-testid="activity-icon" />,
    AlertTriangle: () => <div data-testid="alert-triangle-icon" />,
    X: () => <div data-testid="x-icon" />,
    CheckCircle: () => <div data-testid="check-circle-icon" />,
    AlertCircle: () => <div data-testid="alert-circle-icon" />,
}));

describe("Notification Component", () => {
    const mockOnClose = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("renders success notification", () => {
        render(
            <Notification
                type="success"
                message="Operation successful"
                onClose={mockOnClose}
            />
        );

        expect(screen.getByText("Operation successful")).toBeInTheDocument();
        expect(screen.getByTestId("check-circle-icon")).toBeInTheDocument();
        expect(screen.getByTestId("x-icon")).toBeInTheDocument();
    });

    it("renders error notification", () => {
        render(
            <Notification
                type="error"
                message="Operation failed"
                onClose={mockOnClose}
            />
        );

        expect(screen.getByText("Operation failed")).toBeInTheDocument();
        expect(screen.getByTestId("alert-circle-icon")).toBeInTheDocument();
    });

    it("renders info notification", () => {
        render(
            <Notification
                type="info"
                message="Information"
                onClose={mockOnClose}
            />
        );

        expect(screen.getByText("Information")).toBeInTheDocument();
        expect(screen.getByTestId("activity-icon")).toBeInTheDocument();
    });

    it("renders warning notification", () => {
        render(
            <Notification
                type="warning"
                message="Warning message"
                onClose={mockOnClose}
            />
        );

        expect(screen.getByText("Warning message")).toBeInTheDocument();
        expect(screen.getByTestId("alert-triangle-icon")).toBeInTheDocument();
    });

    it("calls onClose when close button is clicked", () => {
        render(
            <Notification
                type="success"
                message="Test"
                onClose={mockOnClose}
            />
        );

        const closeButton = screen.getByTestId("x-icon").closest("button");
        fireEvent.click(closeButton!);

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("auto-closes after duration", () => {
        render(
            <Notification
                type="success"
                message="Test"
                onClose={mockOnClose}
                duration={1000}
            />
        );

        // Advance timers by 1 second
        vi.advanceTimersByTime(1000);

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("cleans up timer on unmount", () => {
        const { unmount } = render(
            <Notification
                type="success"
                message="Test"
                onClose={mockOnClose}
                duration={5000}
            />
        );

        unmount();

        // Ensure timers are cleaned up
        vi.advanceTimersByTime(5000);
        expect(mockOnClose).not.toHaveBeenCalled();
    });

    it("applies correct CSS classes for each type", () => {
        const { rerender } = render(
            <Notification
                type="success"
                message="Test"
                onClose={mockOnClose}
            />
        );

        let notification = screen.getByText("Test").parentElement;
        expect(notification).toHaveClass("bg-green-50");
        expect(notification).toHaveClass("text-green-800");

        rerender(
            <Notification
                type="error"
                message="Test"
                onClose={mockOnClose}
            />
        );

        notification = screen.getByText("Test").parentElement;
        expect(notification).toHaveClass("bg-red-50");
        expect(notification).toHaveClass("text-red-800");
    });
});