
// ProfileField.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ProfileField } from "../../components/ProfileField";

// Mock dependencies
vi.mock("../../../../utils/cn", () => ({
    cn: (...classes: any[]) => classes.filter(Boolean).join(" "),
}));

vi.mock("@ignix-ui/typography", () => ({
    Typography: ({ children, variant, weight, color, className }: any) => (
        <div
            data-variant={variant}
            data-weight={weight}
            data-color={color}
            className={className}
        >
            {children}
        </div>
    ),
}));

vi.mock("@ignix-ui/input", () => ({
    AnimatedInput: ({ placeholder, variant, value, onChange, type, disabled }: any) => (
        <input
            data-testid="animated-input"
            placeholder={placeholder}
            data-variant={variant}
            value={value}
            onChange={(e) => onChange && onChange(e.target.value)}
            type={type}
            disabled={disabled}
        />
    ),
}));

vi.mock("lucide-react", () => ({
    Lock: () => <div data-testid="lock-icon">LockIcon</div>,
    Mail: () => <div data-testid="mail-icon">MailIcon</div>,
}));

describe("ProfileField", () => {
    const mockOnChange = vi.fn();
    const defaultProps = {
        label: "Display Name",
        value: "John Doe",
        isEditing: false,
        onChange: mockOnChange,
    };

    beforeEach(() => {
        mockOnChange.mockClear();
    });

    it("renders read-only field with label and value", () => {
        render(<ProfileField {...defaultProps} />);

        expect(screen.getByText("Display Name")).toBeInTheDocument();
        expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    it("renders icon when provided in read-only mode", () => {
        const MockIcon = () => <div data-testid="mock-icon">MockIcon</div>;
        render(<ProfileField {...defaultProps} icon={MockIcon as any} />);

        expect(screen.getByTestId("mock-icon")).toBeInTheDocument();
    });

    it("shows 'No [label] provided' when value is empty in read-only mode", () => {
        render(<ProfileField {...defaultProps} value="" />);

        expect(screen.getByText(/no display name provided/i)).toBeInTheDocument();
    });

    it("renders editable text input when isEditing is true", () => {
        render(<ProfileField {...defaultProps} isEditing={true} />);

        const input = screen.getByTestId("animated-input");
        expect(input).toBeInTheDocument();
        expect(input).toHaveValue("John Doe");
    });

    it("renders editable textarea when type is textarea", () => {
        render(
            <ProfileField
                {...defaultProps}
                isEditing={true}
                type="textarea"
            />
        );

        const textarea = screen.getByRole("textbox");
        expect(textarea).toBeInTheDocument();
        expect(textarea).toHaveValue("John Doe");
    });


    it("does NOT show lock icon when readOnly is true but NOT in edit mode", () => {
        render(<ProfileField {...defaultProps} readOnly={true} />);

        // Lock icon should only appear in edit mode with readOnly
        expect(screen.queryByTestId("lock-icon")).not.toBeInTheDocument();
    });

    it("renders different input types correctly", () => {
        const types = ["text", "email", "tel", "url"] as const;

        types.forEach(type => {
            const { unmount } = render(
                <ProfileField
                    {...defaultProps}
                    isEditing={true}
                    type={type}
                />
            );

            const input = screen.getByTestId("animated-input");
            expect(input).toHaveAttribute("type", type);
            unmount();
        });
    });

    it("applies correct variant to input", () => {
        render(
            <ProfileField
                {...defaultProps}
                isEditing={true}
                inputVariant="clean"
            />
        );

        const input = screen.getByTestId("animated-input");
        expect(input).toHaveAttribute("data-variant", "clean");
    });

    it("handles placeholder in edit mode", () => {
        render(
            <ProfileField
                {...defaultProps}
                isEditing={true}
                placeholder="Enter your name"
            />
        );

        const input = screen.getByTestId("animated-input");
        expect(input).toHaveAttribute("placeholder", "Enter your name");
    });

    it("handles textarea rows", () => {
        render(
            <ProfileField
                {...defaultProps}
                isEditing={true}
                type="textarea"
                rows={6}
            />
        );

        const textarea = screen.getByRole("textbox");
        expect(textarea).toHaveAttribute("rows", "6");
    });

    it("shows correct styling for readOnly fields in view mode", () => {
        render(<ProfileField {...defaultProps} readOnly={true} />);

        const valueContainer = screen.getByText("John Doe").closest('div[class*="bg-secondary"]');
        expect(valueContainer).toHaveClass("text-muted-foreground");
    });

    it("shows correct styling for editable fields in view mode", () => {
        render(<ProfileField {...defaultProps} readOnly={false} />);

        const valueContainer = screen.getByText("John Doe").closest('div[class*="bg-secondary"]');
        expect(valueContainer).toHaveClass("text-foreground");
    });

    it("shows no input field when not in edit mode", () => {
        render(<ProfileField {...defaultProps} />);

        expect(screen.queryByTestId("animated-input")).not.toBeInTheDocument();
    });
});