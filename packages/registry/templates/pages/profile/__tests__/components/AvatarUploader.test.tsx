// AvatarUploader.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AvatarUploader } from "../../components/AvatarUploader";

// Mock dependencies
vi.mock("../../../../utils/cn", () => ({
    cn: (...classes: any[]) => classes.filter(Boolean).join(" "),
}));

vi.mock("@ignix-ui/avatar", () => ({
    Avatar: ({ src, alt, shape, size, letters, bordered, clickable, status, className }: any) => (
        <div
            data-testid="avatar"
            data-src={src}
            data-alt={alt}
            data-shape={shape}
            data-size={size}
            data-letters={letters}
            data-bordered={bordered}
            data-clickable={clickable}
            data-status={status}
            className={className}
        >
            Avatar: {letters}
        </div>
    ),
}));

vi.mock("@ignix-ui/button", () => ({
    Button: ({ children, variant, size, onClick, className }: any) => (
        <button
            data-testid="button"
            data-variant={variant}
            data-size={size}
            onClick={onClick}
            className={className}
        >
            {children}
        </button>
    ),
}));

vi.mock("lucide-react", () => ({
    Camera: () => <div data-testid="camera-icon">CameraIcon</div>,
}));

describe("AvatarUploader", () => {
    const mockOnAvatarChange = vi.fn();
    const defaultProps = {
        name: "John Doe",
        avatarUrl: "https://example.com/avatar.jpg",
        isEditing: false,
        onAvatarChange: mockOnAvatarChange,
        shape: "circle" as const,
        size: "9xl" as const,
    };

    beforeEach(() => {
        mockOnAvatarChange.mockClear();
    });

    it("renders avatar with name initials when no avatarUrl", () => {
        render(
            <AvatarUploader
                {...defaultProps}
                avatarUrl={undefined}
            />
        );

        const avatar = screen.getByTestId("avatar");
        expect(avatar).toBeInTheDocument();
        expect(avatar).toHaveAttribute("data-letters", "John Doe");
    });

    it("renders avatar with image when avatarUrl provided", () => {
        render(<AvatarUploader {...defaultProps} />);

        const avatar = screen.getByTestId("avatar");
        expect(avatar).toHaveAttribute("data-src", "https://example.com/avatar.jpg");
    });

    it("does not show camera overlay when not in edit mode", () => {
        render(<AvatarUploader {...defaultProps} />);

        expect(screen.queryByTestId("button")).not.toBeInTheDocument();
    });

    it("shows camera overlay when in edit mode", () => {
        render(<AvatarUploader {...defaultProps} isEditing={true} />);

        expect(screen.getByTestId("button")).toBeInTheDocument();
    });

    it("calls onAvatarChange when file is selected", () => {
        render(<AvatarUploader {...defaultProps} isEditing={true} />);

        const fileInput = screen.getByTestId("button").closest('div')?.querySelector('input');
        expect(fileInput).toBeInTheDocument();

        if (fileInput) {
            const file = new File(["dummy content"], "avatar.jpg", { type: "image/jpeg" });

            // Mock FileReader
            const mockFileReader = {
                readAsDataURL: vi.fn(),
                result: "data:image/jpeg;base64,dummy",
                onloadend: null as any,
            };

            vi.spyOn(window, 'FileReader').mockImplementation(() => mockFileReader as any);

            fireEvent.change(fileInput, { target: { files: [file] } });

            // Trigger onloadend
            if (mockFileReader.onloadend) {
                mockFileReader.onloadend();
            }

            expect(mockOnAvatarChange).toHaveBeenCalledWith(file, "data:image/jpeg;base64,dummy");
        }
    });

    it("handles different shapes correctly", () => {
        const shapes = ["circle", "square", "rounded", "hexagon", "star", "diamond", "pentagon", "octagon"] as const;

        shapes.forEach(shape => {
            const { unmount } = render(
                <AvatarUploader {...defaultProps} shape={shape} />
            );

            const avatar = screen.getByTestId("avatar");
            expect(avatar).toHaveAttribute("data-shape", shape);
            unmount();
        });
    });

    it("handles different sizes correctly", () => {
        const sizes = ["md", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl", "7xl", "8xl", "9xl"] as const;

        sizes.forEach(size => {
            const { unmount } = render(
                <AvatarUploader {...defaultProps} size={size} />
            );

            const avatar = screen.getByTestId("avatar");
            expect(avatar).toHaveAttribute("data-size", size);
            unmount();
        });
    });

    it("shows status indicator when provided", () => {
        render(<AvatarUploader {...defaultProps} status="online" />);

        const avatar = screen.getByTestId("avatar");
        expect(avatar).toHaveAttribute("data-status", "online");
    });

    it("triggers file input click when edit button is clicked", () => {
        render(<AvatarUploader {...defaultProps} isEditing={true} />);

        const clickSpy = vi.spyOn(HTMLInputElement.prototype, 'click');

        const editButton = screen.getByTestId("button");
        fireEvent.click(editButton);

        expect(clickSpy).toHaveBeenCalled();
    });

    it("handles empty name gracefully", () => {
        render(
            <AvatarUploader
                {...defaultProps}
                name=""
                avatarUrl={undefined}
            />
        );

        const avatar = screen.getByTestId("avatar");
        expect(avatar).toHaveAttribute("data-letters", "");
    });
});