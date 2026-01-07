import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AuthControls } from "../../components/AuthControls";
import type { AuthControlsProps } from "../../types";

// Mock the Button component
vi.mock("@ignix-ui/button", () => ({
    Button: ({ children, variant, size, className, onClick, ...props }: any) => (
        <button
            className={`${variant} ${size} ${className}`}
            onClick={onClick}
            {...props}
        >
            {children}
        </button>
    ),
}));

// Mock utils
vi.mock("../../../../utils/cn", () => ({
    cn: (...classes: (string | undefined | boolean)[]) =>
        classes.filter(Boolean).join(" "),
}));

// Mock variants
vi.mock("../variants", () => ({
    getButtonVariant: (variant: string, baseVariant: string) => {
        if (variant === "solid" && baseVariant === "ghost") return "ghost";
        if (variant === "solid" && baseVariant === "primary") return "primary";
        if (variant === "modern" && baseVariant === "primary") return "primary";
        return baseVariant;
    },
}));

describe("AuthControls Component", () => {
    const defaultProps: AuthControlsProps = {
        showAuthControls: true,
        variant: "default",
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("returns null when showAuthControls is false", () => {
        const { container } = render(
            <AuthControls {...defaultProps} showAuthControls={false} />
        );
        expect(container.firstChild).toBeNull();
    });

    it("renders default Sign In and Sign Up buttons", () => {
        render(<AuthControls {...defaultProps} />);

        expect(screen.getByText("Sign In")).toBeInTheDocument();
        expect(screen.getByText("Sign Up")).toBeInTheDocument();
    });

    it("calls onSignInClick when Sign In button is clicked", () => {
        const onSignInClick = vi.fn();
        render(
            <AuthControls {...defaultProps} onSignInClick={onSignInClick} />
        );

        fireEvent.click(screen.getByText("Sign In"));
        expect(onSignInClick).toHaveBeenCalledTimes(1);
    });

    it("calls onSignUpClick when Sign Up button is clicked", () => {
        const onSignUpClick = vi.fn();
        render(
            <AuthControls {...defaultProps} onSignUpClick={onSignUpClick} />
        );

        fireEvent.click(screen.getByText("Sign Up"));
        expect(onSignUpClick).toHaveBeenCalledTimes(1);
    });

    it("renders custom auth components when provided", () => {
        const authComponents = {
            signIn: <button data-testid="custom-signin">Custom Sign In</button>,
            signUp: <button data-testid="custom-signup">Custom Sign Up</button>,
        };

        render(
            <AuthControls {...defaultProps} authComponents={authComponents} />
        );

        expect(screen.getByTestId("custom-signin")).toBeInTheDocument();
        expect(screen.getByTestId("custom-signup")).toBeInTheDocument();
        expect(screen.queryByText("Sign In")).not.toBeInTheDocument();
        expect(screen.queryByText("Sign Up")).not.toBeInTheDocument();
    });

    it("calls onCloseMenu for mobile when Sign In is clicked", () => {
        const onCloseMenu = vi.fn();
        const onSignInClick = vi.fn();

        render(
            <AuthControls
                {...defaultProps}
                isMobile={true}
                onCloseMenu={onCloseMenu}
                onSignInClick={onSignInClick}
            />
        );

        fireEvent.click(screen.getByText("Sign In"));
        expect(onCloseMenu).toHaveBeenCalledTimes(1);
        expect(onSignInClick).toHaveBeenCalledTimes(1);
    });

    it("calls onCloseMenu for mobile when Sign Up is clicked", () => {
        const onCloseMenu = vi.fn();
        const onSignUpClick = vi.fn();

        render(
            <AuthControls
                {...defaultProps}
                isMobile={true}
                onCloseMenu={onCloseMenu}
                onSignUpClick={onSignUpClick}
            />
        );

        fireEvent.click(screen.getByText("Sign Up"));
        expect(onCloseMenu).toHaveBeenCalledTimes(1);
        expect(onSignUpClick).toHaveBeenCalledTimes(1);
    });

    it("applies modern variant classes", () => {
        render(
            <AuthControls {...defaultProps} variant="modern" />
        );

        const signInButton = screen.getByText("Sign In");
        const signUpButton = screen.getByText("Sign Up");

        // Check that modern classes are applied
        expect(signInButton.className).toContain("text-slate-700");
        expect(signInButton.className).toContain("hover:text-blue-600");
        expect(signUpButton.className).toContain("bg-gradient-to-r");
        expect(signUpButton.className).toContain("from-blue-500");
    });

    it("applies solid variant classes", () => {
        render(
            <AuthControls {...defaultProps} variant="solid" />
        );

        const signInButton = screen.getByText("Sign In");
        const signUpButton = screen.getByText("Sign Up");

        expect(signInButton.className).toContain("text-white");
        expect(signInButton.className).toContain("hover:bg-white/20");
        expect(signUpButton.className).toContain("bg-white");
        expect(signUpButton.className).toContain("text-blue-600");
    });

    it("renders mobile layout when isMobile is true", () => {
        const { container } = render(
            <AuthControls {...defaultProps} isMobile={true} />
        );

        // Mobile layout should have flex-col
        expect(container.firstChild).toHaveClass("flex");
        expect(container.firstChild).toHaveClass("flex-col");
        expect(container.firstChild).toHaveClass("space-y-2");
    });

    it("renders desktop layout when isMobile is false", () => {
        const { container } = render(
            <AuthControls {...defaultProps} isMobile={false} />
        );

        // Desktop layout should have flex-row
        expect(container.firstChild).toHaveClass("flex");
        expect(container.firstChild).toHaveClass("items-center");
        expect(container.firstChild).toHaveClass("space-x-3");
    });

    it("applies mobile specific classes", () => {
        render(
            <AuthControls {...defaultProps} isMobile={true} />
        );

        const signInButton = screen.getByText("Sign In");
        const signUpButton = screen.getByText("Sign Up");

        expect(signInButton.className).toContain("justify-start");
        expect(signUpButton.className).toContain("justify-start");
    });

    it("renders border for mobile in non-modern variants", () => {
        const { container } = render(
            <AuthControls {...defaultProps} isMobile={true} variant="default" />
        );

        expect(container.firstChild).toHaveClass("border-t");
        expect(container.firstChild).toHaveClass("border-border");
    });

    it("does not render border for mobile in modern variant", () => {
        const { container } = render(
            <AuthControls {...defaultProps} isMobile={true} variant="modern" />
        );

        expect(container.firstChild).not.toHaveClass("border-t");
    });
});