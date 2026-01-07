// SaveCancelBar.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { SaveCancelBar } from "../../components/SaveCancelBar";

// Mock dependencies
vi.mock("../../../../utils/cn", () => ({
    cn: (...classes: any[]) => classes.filter(Boolean).join(" "),
}));

vi.mock("@ignix-ui/button", () => ({
    Button: ({ children, variant, onClick, disabled, className, animationVariant }: any) => (
        <button
            data-testid="button"
            data-variant={variant}
            data-animation={animationVariant}
            onClick={onClick}
            disabled={disabled}
            className={className}
        >
            {children}
        </button>
    ),
}));

vi.mock("lucide-react", () => ({
    Save: () => <div data-testid="save-icon">SaveIcon</div>,
    X: () => <div data-testid="x-icon">XIcon</div>,
    Loader2: () => <div data-testid="loader2-icon">Loader2Icon</div>,
}));

describe("SaveCancelBar", () => {
    const mockOnSave = vi.fn();
    const mockOnCancel = vi.fn();
    const defaultProps = {
        onSave: mockOnSave,
        onCancel: mockOnCancel,
        isSaving: false,
    };

    beforeEach(() => {
        mockOnSave.mockClear();
        mockOnCancel.mockClear();
    });

    it("renders save and cancel buttons", () => {
        render(<SaveCancelBar {...defaultProps} />);

        expect(screen.getAllByTestId("button")).toHaveLength(2);
        expect(screen.getByText("Save Changes")).toBeInTheDocument();
        expect(screen.getByText("Cancel")).toBeInTheDocument();
    });

    it("calls onSave when save button is clicked", () => {
        render(<SaveCancelBar {...defaultProps} />);

        const saveButton = screen.getByText("Save Changes").closest("button");
        fireEvent.click(saveButton!);

        expect(mockOnSave).toHaveBeenCalledTimes(1);
    });

    it("calls onCancel when cancel button is clicked", () => {
        render(<SaveCancelBar {...defaultProps} />);

        const cancelButton = screen.getByText("Cancel").closest("button");
        fireEvent.click(cancelButton!);

        expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });

    it("shows saving state when isSaving is true", () => {
        render(<SaveCancelBar {...defaultProps} isSaving={true} />);

        expect(screen.getByText("Saving...")).toBeInTheDocument();
        expect(screen.getByTestId("loader2-icon")).toBeInTheDocument();

        const saveButton = screen.getByText("Saving...").closest("button");
        expect(saveButton).toBeDisabled();
    });

    it("shows save icon when not saving", () => {
        render(<SaveCancelBar {...defaultProps} />);

        expect(screen.getByTestId("save-icon")).toBeInTheDocument();
        expect(screen.queryByTestId("loader2-icon")).not.toBeInTheDocument();
    });

    it("disables cancel button when isSaving is true", () => {
        render(<SaveCancelBar {...defaultProps} isSaving={true} />);

        const cancelButton = screen.getByText("Cancel").closest("button");
        expect(cancelButton).toBeDisabled();
    });

    it("applies correct button variants", () => {
        render(
            <SaveCancelBar
                {...defaultProps}
                saveButtonVariant="primary"
                cancelButtonVariant="outline"
            />
        );

        const buttons = screen.getAllByTestId("button");

        // Cancel button should be outline variant
        const cancelButton = buttons.find(btn => btn.textContent?.includes("Cancel"));
        expect(cancelButton).toHaveAttribute("data-variant", "outline");

        // Save button should be primary variant
        const saveButton = buttons.find(btn => btn.textContent?.includes("Save Changes"));
        expect(saveButton).toHaveAttribute("data-variant", "primary");
    });

    it("applies correct animation variants", () => {
        render(<SaveCancelBar {...defaultProps} />);

        const buttons = screen.getAllByTestId("button");

        // Cancel button animation
        const cancelButton = buttons.find(btn => btn.textContent?.includes("Cancel"));
        expect(cancelButton).toHaveAttribute("data-animation", "press3DSoft");

        // Save button animation when not saving
        const saveButton = buttons.find(btn => btn.textContent?.includes("Save Changes"));
        expect(saveButton).toHaveAttribute("data-animation", "scaleHeartbeat");
    });

    it("applies spin animation to save button when saving", () => {
        render(<SaveCancelBar {...defaultProps} isSaving={true} />);

        const buttons = screen.getAllByTestId("button");
        const saveButton = buttons.find(btn => btn.textContent?.includes("Saving..."));
        expect(saveButton).toHaveAttribute("data-animation", "spinSlow");
    });
});