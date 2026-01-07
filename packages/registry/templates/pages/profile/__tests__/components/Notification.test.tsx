// Notification.test.tsx
import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NotificationComponent } from "../../components/Notification";

// Mock dependencies
vi.mock("../../../../utils/cn", () => ({
    cn: (...classes: any[]) => classes.filter(Boolean).join(" "),
}));

vi.mock("framer-motion", () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
}));

vi.mock("@ignix-ui/typography", () => ({
    Typography: ({ children, variant, weight }: any) => (
        <div data-variant={variant} data-weight={weight}>
            {children}
        </div>
    ),
}));

vi.mock("lucide-react", () => ({
    CheckCircle: () => <div data-testid="check-circle-icon">CheckCircleIcon</div>,
    X: () => <div data-testid="x-icon">XIcon</div>,
    Loader2: () => <div data-testid="loader2-icon">Loader2Icon</div>,
}));

describe("NotificationComponent", () => {
    const mockOnClose = vi.fn();
    const defaultProps = {
        message: "Test notification",
        onClose: mockOnClose,
        duration: 3000,
    };

    beforeEach(() => {
        vi.useFakeTimers();
        mockOnClose.mockClear();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("renders success notification with correct icon", () => {
        render(<NotificationComponent {...defaultProps} type="success" />);

        // Use getAllByTestId for error type since X icon appears twice
        const checkCircleIcons = screen.getAllByTestId("check-circle-icon");
        expect(checkCircleIcons.length).toBe(1); // Only one check circle icon
        expect(screen.getByText("Test notification")).toBeInTheDocument();
    });

    it("renders error notification with correct icon", () => {
        render(<NotificationComponent {...defaultProps} type="error" />);

        // For error type, there should be two X icons: one for error icon and one for close button
        const xIcons = screen.getAllByTestId("x-icon");
        expect(xIcons.length).toBe(2); // One for error icon, one for close button
        expect(screen.getByText("Test notification")).toBeInTheDocument();
    });

    it("renders info notification with correct icon", () => {
        render(<NotificationComponent {...defaultProps} type="info" />);

        const loaderIcons = screen.getAllByTestId("loader2-icon");
        expect(loaderIcons.length).toBe(1);
        expect(screen.getByText("Test notification")).toBeInTheDocument();
    });

    it("renders warning notification with correct icon", () => {
        render(<NotificationComponent {...defaultProps} type="warning" />);

        const loaderIcons = screen.getAllByTestId("loader2-icon");
        expect(loaderIcons.length).toBe(1);
        expect(screen.getByText("Test notification")).toBeInTheDocument();
    });

    it("calls onClose after duration", () => {
        render(<NotificationComponent {...defaultProps} duration={1000} />);

        expect(mockOnClose).not.toHaveBeenCalled();

        act(() => {
            vi.advanceTimersByTime(1000);
        });

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("cleans up timer on unmount", () => {
        const clearTimeoutSpy = vi.spyOn(window, "clearTimeout");

        const { unmount } = render(<NotificationComponent {...defaultProps} />);

        unmount();

        expect(clearTimeoutSpy).toHaveBeenCalled();
        clearTimeoutSpy.mockRestore();
    });

    it("calls onClose when close button is clicked", () => {
        render(<NotificationComponent {...defaultProps} type="success" />);

        // For success type, the close button should have an X icon
        const closeButtons = screen.getAllByRole("button");
        expect(closeButtons.length).toBe(1);

        closeButtons[0].click();

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("uses default duration when not provided", () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { rerender } = render(
            <NotificationComponent
                message="Test"
                onClose={mockOnClose}
                type="success"
            />
        );

        expect(mockOnClose).not.toHaveBeenCalled();

        act(() => {
            vi.advanceTimersByTime(3000); // Default duration
        });

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("has correct button for closing", () => {
        render(<NotificationComponent {...defaultProps} type="success" />);

        const closeButton = screen.getByRole("button");
        expect(closeButton).toBeInTheDocument();
        expect(closeButton).toHaveClass("ml-4");
    });

    it("renders with correct positioning classes", () => {
        render(<NotificationComponent {...defaultProps} />);

        const notification = screen.getByText("Test notification").closest('div[class*="fixed"]');
        expect(notification).toHaveClass("fixed", "top-4", "right-4", "z-50");
    });
});