// components/FormContent.test.tsx
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FormContent } from "../../components/FormContent";

// Mock dependencies
vi.mock("../../../../../utils/cn", () => ({
    cn: (...classes: any[]) => classes.filter(Boolean).join(" "),
}));

vi.mock("@ignix-ui/button", () => ({
    Button: ({ children, ...props }: any) => (
        <button {...props} data-testid="button">
            {children}
        </button>
    ),
}));

vi.mock("@ignix-ui/input", () => ({
    AnimatedInput: ({ onChange, onBlur, inputClassName, ...props }: any) => {
        const domProps = { ...props };
        if (inputClassName) {
            domProps.inputclassname = inputClassName;
        }
        return (
            <input
                {...domProps}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    onChange && onChange(e.target.value)
                }
                onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
                    onBlur && onBlur(e)
                }
                data-testid="animated-input"
            />
        );
    },
}));

vi.mock("lucide-react", () => ({
    Eye: () => <div data-testid="eye-icon" />,
    EyeOff: () => <div data-testid="eye-off-icon" />,
    Mail: () => <div data-testid="mail-icon" />,
    Lock: () => <div data-testid="lock-icon" />,
    User: () => <div data-testid="user-icon" />,
    UserPlus: () => <div data-testid="user-plus-icon" />,
    Loader2: () => <div data-testid="loader-icon" />,
}));

vi.mock("framer-motion", () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
}));

// Mock child components
vi.mock("../../components/PasswordStrength", () => ({
    PasswordStrength: ({ password, isDarkVariant }: any) => (
        <div data-testid="password-strength">
            Strength for: {password} - Dark: {isDarkVariant.toString()}
        </div>
    ),
}));

vi.mock("../../components/SocialSignUp", () => ({
    SocialSignUp: ({ isDarkVariant }: any) => (
        <div data-testid="social-signup">
            Social Sign Up - Dark: {isDarkVariant.toString()}
        </div>
    ),
}));

vi.mock("../../components/TermsCheckbox", () => ({
    TermsCheckbox: ({ acceptTerms, isDarkVariant }: any) => (
        <div data-testid="terms-checkbox">
            Terms Accepted: {acceptTerms.toString()} - Dark: {isDarkVariant.toString()}
        </div>
    ),
}));

vi.mock("../../components/Captcha", () => ({
    Captcha: ({ isDarkVariant }: any) => (
        <div data-testid="captcha">
            CAPTCHA - Dark: {isDarkVariant.toString()}
        </div>
    ),
}));

vi.mock("../../components/ErrorDisplay", () => ({
    ErrorDisplay: ({ error, isDarkVariant }: any) => (
        <div data-testid="error-display">
            Error: {error} - Dark: {isDarkVariant.toString()}
        </div>
    ),
}));

// Mock utility function
vi.mock("../../utils", () => ({
    getInputClasses: () => "mocked-input-classes",
}));

describe("FormContent Component", () => {
    const defaultProps = {
        variant: 'default' as const,
        type: 'centered' as const,
        formData: {
            firstName: '',
            lastName: '',
            email: '',
            confirmEmail: '',
            password: '',
            confirmPassword: '',
            acceptTerms: false,
        },
        errors: {},
        showPassword: false,
        showConfirmPassword: false,
        loading: false,
        error: '',
        showSocialSignUp: true,
        showLoginLink: true,
        loginText: "Already have an account?",
        requireEmailConfirmation: true,
        captchaVerified: false,
        setCaptchaVerified: vi.fn(),
        handleInputChange: vi.fn(),
        handleBlur: vi.fn(),
        togglePasswordVisibility: vi.fn(),
        toggleConfirmPasswordVisibility: vi.fn(),
        handleSubmit: vi.fn((e) => e.preventDefault()),
        isDarkVariant: false,
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders all form fields", () => {
        render(<FormContent {...defaultProps} />);

        expect(screen.getByText("Create Your Account")).toBeInTheDocument();
        expect(screen.getByText("Join our community and start your journey today")).toBeInTheDocument();

        // Check for all input fields
        expect(screen.getAllByTestId("animated-input")).toHaveLength(6); // firstName, lastName, email, confirmEmail, password, confirmPassword

        // Check for icons
        expect(screen.getAllByTestId("user-icon")).toHaveLength(2);
        expect(screen.getAllByTestId("mail-icon")).toHaveLength(2);
        expect(screen.getAllByTestId("lock-icon")).toHaveLength(2);
    });

    it("renders without email confirmation field when requireEmailConfirmation is false", () => {
        render(
            <FormContent
                {...defaultProps}
                requireEmailConfirmation={false}
            />
        );

        // Should have 5 inputs instead of 6 (no confirm email)
        expect(screen.getAllByTestId("animated-input")).toHaveLength(5);
    });

    it("shows error message when error prop is provided", () => {
        const errorMessage = "Registration failed";
        render(
            <FormContent
                {...defaultProps}
                error={errorMessage}
            />
        );

        expect(screen.getByTestId("error-display")).toBeInTheDocument();
    });

    it("handles form submission", () => {
        const handleSubmit = vi.fn((e) => e.preventDefault());
        render(
            <FormContent
                {...defaultProps}
                handleSubmit={handleSubmit}
            />
        );

        // Get the form element directly (not by role)
        const form = screen.getByTestId("button").closest("form");
        if (form) {
            fireEvent.submit(form);
            expect(handleSubmit).toHaveBeenCalled();
        } else {
            // Fallback: get the submit button and click it
            const submitButton = screen.getByTestId("button");
            fireEvent.click(submitButton);
            expect(handleSubmit).toHaveBeenCalled();
        }
    });

    it("shows loading state on submit button", () => {
        render(
            <FormContent
                {...defaultProps}
                loading={true}
            />
        );

        const submitButton = screen.getByTestId("button");
        expect(submitButton).toHaveAttribute("disabled");
        expect(submitButton).toContainElement(screen.getByTestId("loader-icon"));
    });

    it("disables submit button when terms not accepted", () => {
        render(
            <FormContent
                {...defaultProps}
                formData={{ ...defaultProps.formData, acceptTerms: false }}
            />
        );

        const submitButton = screen.getByTestId("button");
        expect(submitButton).toHaveAttribute("disabled");
    });

    it("enables submit button when terms accepted", () => {
        render(
            <FormContent
                {...defaultProps}
                formData={{ ...defaultProps.formData, acceptTerms: true }}
            />
        );

        const submitButton = screen.getByTestId("button");
        expect(submitButton).not.toHaveAttribute("disabled");
    });

    it("toggles password visibility", () => {
        const togglePasswordVisibility = vi.fn();
        render(
            <FormContent
                {...defaultProps}
                togglePasswordVisibility={togglePasswordVisibility}
            />
        );

        // Find the password visibility toggle button
        const passwordVisibilityButtons = screen.getAllByRole("button", {
            name: /show password|hide password/i
        });

        if (passwordVisibilityButtons.length > 0) {
            fireEvent.click(passwordVisibilityButtons[0]);
            expect(togglePasswordVisibility).toHaveBeenCalled();
        }
    });

    it("renders social sign up when showSocialSignUp is true", () => {
        render(
            <FormContent
                {...defaultProps}
                showSocialSignUp={true}
            />
        );

        expect(screen.getByTestId("social-signup")).toBeInTheDocument();
    });

    it("hides social sign up when showSocialSignUp is false", () => {
        render(
            <FormContent
                {...defaultProps}
                showSocialSignUp={false}
            />
        );

        expect(screen.queryByTestId("social-signup")).not.toBeInTheDocument();
    });

    it("renders login link when showLoginLink is true", () => {
        render(
            <FormContent
                {...defaultProps}
                showLoginLink={true}
            />
        );

        expect(screen.getByText("Already have an account?")).toBeInTheDocument();
        expect(screen.getByText("Sign In")).toBeInTheDocument();
    });

    it("hides login link when showLoginLink is false", () => {
        render(
            <FormContent
                {...defaultProps}
                showLoginLink={false}
            />
        );

        expect(screen.queryByText("Already have an account?")).not.toBeInTheDocument();
    });

    it("calls onLogin when login link is clicked", () => {
        const onLogin = vi.fn();
        render(
            <FormContent
                {...defaultProps}
                onLogin={onLogin}
            />
        );

        const loginButton = screen.getByText("Sign In");
        fireEvent.click(loginButton);

        expect(onLogin).toHaveBeenCalled();
    });

    it("renders CAPTCHA when enabled in config", () => {
        render(
            <FormContent
                {...defaultProps}
                captchaConfig={{ enabled: true }}
            />
        );

        expect(screen.getByTestId("captcha")).toBeInTheDocument();
    });

    it("renders password strength component", () => {
        render(
            <FormContent
                {...defaultProps}
                passwordStrength={{ showStrengthMeter: true }}
            />
        );

        expect(screen.getByTestId("password-strength")).toBeInTheDocument();
    });

    it("renders terms checkbox component", () => {
        render(<FormContent {...defaultProps} />);

        expect(screen.getByTestId("terms-checkbox")).toBeInTheDocument();
    });

    it("applies dark variant styles", () => {
        render(
            <FormContent
                {...defaultProps}
                variant="dark"
                isDarkVariant={true}
            />
        );

        // Find the main card container by looking for the form's parent
        const form = screen.getByTestId("button").closest("form");
        const cardContainer = form?.parentElement;

        expect(cardContainer).toHaveClass("bg-gray-800");
    });

    it("applies glass variant styles", () => {
        render(
            <FormContent
                {...defaultProps}
                variant="glass"
            />
        );

        // Find the main card container by looking for the form's parent
        const form = screen.getByTestId("button").closest("form");
        const cardContainer = form?.parentElement;

        expect(cardContainer).toHaveClass("bg-white/10");
        expect(cardContainer).toHaveClass("backdrop-blur-lg");
    });

    it("applies modern variant styles", () => {
        render(
            <FormContent
                {...defaultProps}
                variant="modern"
            />
        );

        // Find the main card container by looking for the form's parent
        const form = screen.getByTestId("button").closest("form");
        const cardContainer = form?.parentElement;

        expect(cardContainer).toHaveClass("bg-white/95");
        expect(cardContainer).toHaveClass("backdrop-blur-sm");
    });

    it("renders custom logo when provided", () => {
        const CustomLogo = () => <div data-testid="custom-logo">Custom Logo</div>;
        render(
            <FormContent
                {...defaultProps}
                logo={<CustomLogo />}
            />
        );

        expect(screen.getByTestId("custom-logo")).toBeInTheDocument();
    });

    it("handles input changes", () => {
        const handleInputChange = vi.fn();
        render(
            <FormContent
                {...defaultProps}
                handleInputChange={handleInputChange}
            />
        );

        const firstNameInput = screen.getAllByTestId("animated-input")[0];
        fireEvent.change(firstNameInput, { target: { value: 'John' } });

        expect(handleInputChange).toHaveBeenCalledWith('firstName', 'John');
    });

    it("handles blur events", () => {
        const handleBlur = vi.fn();
        render(
            <FormContent
                {...defaultProps}
                handleBlur={handleBlur}
            />
        );

        const firstNameInput = screen.getAllByTestId("animated-input")[0];
        fireEvent.blur(firstNameInput);

        expect(handleBlur).toHaveBeenCalledWith('firstName');
    });

    it("disables submit button when CAPTCHA is enabled but not verified", () => {
        render(
            <FormContent
                {...defaultProps}
                formData={{ ...defaultProps.formData, acceptTerms: true }}
                captchaConfig={{ enabled: true }}
                captchaVerified={false}
            />
        );

        const submitButton = screen.getByTestId("button");
        expect(submitButton).toHaveAttribute("disabled");
    });

    it("enables submit button when CAPTCHA is enabled and verified", () => {
        render(
            <FormContent
                {...defaultProps}
                formData={{ ...defaultProps.formData, acceptTerms: true }}
                captchaConfig={{ enabled: true }}
                captchaVerified={true}
            />
        );

        const submitButton = screen.getByTestId("button");
        expect(submitButton).not.toHaveAttribute("disabled");
    });
});