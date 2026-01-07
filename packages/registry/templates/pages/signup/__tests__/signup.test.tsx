// SignUp.test.tsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { SignUp } from "../";

// ✅ Safe synchronous mocks (Vitest hoist-friendly)
vi.mock("lucide-react", () => ({
    Eye: () => <div data-testid="eye-icon" />,
    EyeOff: () => <div data-testid="eye-off-icon" />,
    AlertCircle: () => <div data-testid="alert-circle-icon" />,
    Mail: () => <div data-testid="mail-icon" />,
    Lock: () => <div data-testid="lock-icon" />,
    Shield: () => <div data-testid="shield-icon" />,
    User: () => <div data-testid="user-icon" />,
    UserPlus: () => <div data-testid="user-plus-icon" />,
    Loader2: () => <div data-testid="loader-icon" />,
    Check: () => <div data-testid="check-icon" />,
    Star: () => <div data-testid="star-icon" />,
    Users: () => <div data-testid="users-icon" />,
    Zap: () => <div data-testid="zap-icon" />,
    Globe: () => <div data-testid="globe-icon" />,
    ShieldCheck: () => <div data-testid="shield-check-icon" />,
    ArrowRight: () => <div data-testid="arrow-right-icon" />,
    Info: () => <div data-testid="info-icon" />,
}));

vi.mock("framer-motion", () => ({
    motion: {
        div: ({ children, ...props }: any) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { initial, animate, transition, ...rest } = props;
            return <div {...rest}>{children}</div>;
        },
        span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("react-icons/fc", () => ({
    FcGoogle: () => <div data-testid="google-icon" />,
}));

vi.mock("react-icons/fa", () => ({
    FaGithub: () => <div data-testid="github-icon" />,
    FaMicrosoft: () => <div data-testid="microsoft-icon" />,
}));

vi.mock("../../../../utils/cn", () => ({
    cn: (...classes: any[]) => classes.filter(Boolean).join(" "),
}));

vi.mock("../../../../components/button", () => ({
    Button: ({ children, ...props }: any) => (
        <button {...props} data-testid="button">
            {children}
        </button>
    ),
}));

vi.mock("../../../../components/input", () => ({
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

// Mock the hooks module - keep this simple without external references
vi.mock("../hooks/useSignUpForm", () => {
    return {
        useSignUpForm: vi.fn(),
    };
});

// Mock the internal components
vi.mock("../components/LeftPanel", () => ({
    LeftPanel: ({ companyName }: any) => (
        <div data-testid="left-panel">
            <div>Welcome to {companyName || "YourBrand"}</div>
        </div>
    ),
}));

vi.mock("../components/FormContent", () => ({
    FormContent: ({
        formData = {
            firstName: "",
            lastName: "",
            email: "",
            confirmEmail: "",
            password: "",
            confirmPassword: "",
            agreeToTerms: false,
        },
        errors = {},
        loading = false,
        error = "",
        showSocialSignUp = true,
        showLoginLink = true,
        loginText = "Already have an account?",
        requireEmailConfirmation = true,
        onLogin = vi.fn(),
        onSocialSignUp = vi.fn(),
        socialLoading = null,
        handleInputChange = vi.fn(),
        handleSubmit = vi.fn((e) => e.preventDefault()),
        togglePasswordVisibility = vi.fn(),
        toggleConfirmPasswordVisibility = vi.fn(),
        buttonStyle,
        logo,
    }: any) => (
        <div data-testid="form-content">
            {/* Remove the wrapper div with data-testid to avoid duplicates */}
            {logo && <div data-testid="logo-container">{logo}</div>}
            <h2>Create Your Account</h2>

            {error && <div data-testid="error-message">{error}</div>}

            <form onSubmit={handleSubmit} data-testid="signup-form">
                <input
                    type="text"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    data-testid="first-name-input"
                />
                <input
                    type="text"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    data-testid="last-name-input"
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    data-testid="email-input"
                />
                {requireEmailConfirmation && (
                    <input
                        type="email"
                        placeholder="Confirm Email"
                        value={formData.confirmEmail}
                        onChange={(e) => handleInputChange("confirmEmail", e.target.value)}
                        data-testid="confirm-email-input"
                    />
                )}
                <div>
                    <input
                        type="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        data-testid="password-input"
                    />
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        aria-label="Toggle password visibility"
                        data-testid="toggle-password"
                    >
                        Show/Hide
                    </button>
                </div>
                <div>
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        data-testid="confirm-password-input"
                    />
                    <button
                        type="button"
                        onClick={toggleConfirmPasswordVisibility}
                        aria-label="Toggle confirm password visibility"
                        data-testid="toggle-confirm-password"
                    >
                        Show/Hide
                    </button>
                </div>

                {errors.firstName && <div data-testid="error-first-name">{errors.firstName}</div>}
                {errors.lastName && <div data-testid="error-last-name">{errors.lastName}</div>}
                {errors.email && <div data-testid="error-email">{errors.email}</div>}
                {errors.confirmEmail && <div data-testid="error-confirm-email">{errors.confirmEmail}</div>}
                {errors.password && <div data-testid="error-password">{errors.password}</div>}
                {errors.confirmPassword && <div data-testid="error-confirm-password">{errors.confirmPassword}</div>}

                <button
                    type="submit"
                    data-testid="submit-button"
                    disabled={loading}
                    className={buttonStyle?.className}
                >
                    {loading ? "Creating Account..." : "Sign Up"}
                </button>
            </form>

            {showSocialSignUp && (
                <div data-testid="social-signup">
                    <button
                        onClick={() => onSocialSignUp?.('google')}
                        disabled={socialLoading === 'google'}
                        aria-label="Sign up with Google"
                        data-testid="google-signup"
                    >
                        {socialLoading === 'google' ? 'Loading...' : 'Google'}
                    </button>
                    <button
                        onClick={() => onSocialSignUp?.('github')}
                        disabled={socialLoading === 'github'}
                        aria-label="Sign up with GitHub"
                        data-testid="github-signup"
                    >
                        {socialLoading === 'github' ? 'Loading...' : 'GitHub'}
                    </button>
                    <button
                        onClick={() => onSocialSignUp?.('microsoft')}
                        disabled={socialLoading === 'microsoft'}
                        aria-label="Sign up with Microsoft"
                        data-testid="microsoft-signup"
                    >
                        {socialLoading === 'microsoft' ? 'Loading...' : 'Microsoft'}
                    </button>
                </div>
            )}

            {showLoginLink && (
                <div data-testid="login-link">
                    <span>{loginText}</span>
                    <button onClick={onLogin} data-testid="login-button">
                        Login
                    </button>
                </div>
            )}
        </div>
    ),
}));

// Import the mocked module after setting up the mock
import * as useSignUpFormModule from "../hooks/useSignUpForm";

describe("SignUp Component", () => {
    const mockOnSubmit = vi.fn();
    const mockOnLogin = vi.fn();
    const mockOnGoogleSignUp = vi.fn();
    // const mockOnGitHubSignUp = vi.fn();
    // const mockOnMicrosoftSignUp = vi.fn();

    const defaultHookReturn = {
        formData: {
            firstName: "",
            lastName: "",
            email: "",
            confirmEmail: "",
            password: "",
            confirmPassword: "",
            agreeToTerms: false,
        },
        showPassword: false,
        showConfirmPassword: false,
        errors: {},
        touched: {},
        captchaVerified: false,
        setCaptchaVerified: vi.fn(),
        handleSubmit: vi.fn((e: React.FormEvent) => {
            e.preventDefault();
            mockOnSubmit();
        }),
        handleInputChange: vi.fn(),
        handleBlur: vi.fn(),
        togglePasswordVisibility: vi.fn(),
        toggleConfirmPasswordVisibility: vi.fn(),
        validateForm: vi.fn(),
    };

    // Get the mocked hook
    const useSignUpFormMock = vi.mocked(useSignUpFormModule.useSignUpForm);

    beforeEach(() => {
        vi.clearAllMocks();
        // Reset the mock implementation
        useSignUpFormMock.mockReturnValue(defaultHookReturn);
    });

    it("renders centered layout by default", () => {
        render(<SignUp onSubmit={mockOnSubmit} />);

        expect(screen.getByText("Create Your Account")).toBeInTheDocument();
        expect(screen.getByTestId("first-name-input")).toBeInTheDocument();
        expect(screen.getByTestId("last-name-input")).toBeInTheDocument();
        expect(screen.getByTestId("email-input")).toBeInTheDocument();
        expect(screen.getByTestId("password-input")).toBeInTheDocument();
        expect(screen.getByTestId("submit-button")).toBeInTheDocument();
    });

    it("renders split layout when type='split'", () => {
        render(<SignUp type="split" onSubmit={mockOnSubmit} />);

        expect(screen.getByTestId("left-panel")).toBeInTheDocument();
        expect(screen.getByText("Create Your Account")).toBeInTheDocument();
        expect(screen.getByTestId("form-content")).toBeInTheDocument();
    });

    it("handles form submission", async () => {
        const handleSubmit = vi.fn((e: React.FormEvent) => {
            e.preventDefault();
            mockOnSubmit();
        });

        useSignUpFormMock.mockReturnValue({
            ...defaultHookReturn,
            handleSubmit,
        });

        render(<SignUp onSubmit={mockOnSubmit} />);

        const submitButton = screen.getByTestId("submit-button");
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(handleSubmit).toHaveBeenCalled();
        });
    });

    it("shows validation errors", () => {
        // Mock errors in the hook
        useSignUpFormMock.mockReturnValue({
            ...defaultHookReturn,
            errors: {
                firstName: "First name is required",
                email: "Email is required",
                password: "Password is required",
            },
        });

        render(<SignUp onSubmit={mockOnSubmit} />);

        expect(screen.getByTestId("error-first-name")).toHaveTextContent("First name is required");
        expect(screen.getByTestId("error-email")).toHaveTextContent("Email is required");
        expect(screen.getByTestId("error-password")).toHaveTextContent("Password is required");
    });

    it("toggles password visibility", () => {
        const togglePasswordVisibility = vi.fn();
        const toggleConfirmPasswordVisibility = vi.fn();

        useSignUpFormMock.mockReturnValue({
            ...defaultHookReturn,
            togglePasswordVisibility,
            toggleConfirmPasswordVisibility,
        });

        render(<SignUp onSubmit={mockOnSubmit} />);

        const togglePasswordButton = screen.getByTestId("toggle-password");
        fireEvent.click(togglePasswordButton);
        expect(togglePasswordVisibility).toHaveBeenCalled();

        const toggleConfirmPasswordButton = screen.getByTestId("toggle-confirm-password");
        fireEvent.click(toggleConfirmPasswordButton);
        expect(toggleConfirmPasswordVisibility).toHaveBeenCalled();
    });

    it("handles login link click", () => {
        render(<SignUp onSubmit={mockOnSubmit} onLogin={mockOnLogin} />);

        const loginButton = screen.getByTestId("login-button");
        fireEvent.click(loginButton);

        expect(mockOnLogin).toHaveBeenCalled();
    });

    it("renders custom company name in split layout", () => {
        render(<SignUp type="split" companyName="Acme Corp" onSubmit={mockOnSubmit} />);
        expect(screen.getByText("Welcome to Acme Corp")).toBeInTheDocument();
    });

    it("renders error message when error prop is provided", () => {
        const errorMessage = "Registration failed";
        render(<SignUp onSubmit={mockOnSubmit} error={errorMessage} />);

        expect(screen.getByTestId("error-message")).toHaveTextContent(errorMessage);
    });

    it("applies dark variant styles", () => {
        render(<SignUp variant="dark" onSubmit={mockOnSubmit} />);

        expect(screen.getByText("Create Your Account")).toBeInTheDocument();
        // The actual variant styling would be applied via CSS classes
    });

    it("shows email confirmation field when requireEmailConfirmation is true", () => {
        render(<SignUp requireEmailConfirmation={true} onSubmit={mockOnSubmit} />);

        expect(screen.getByTestId("confirm-email-input")).toBeInTheDocument();
    });

    it("hides email confirmation field when requireEmailConfirmation is false", () => {
        render(<SignUp requireEmailConfirmation={false} onSubmit={mockOnSubmit} />);

        expect(screen.queryByTestId("confirm-email-input")).not.toBeInTheDocument();
    });

    it("hides social sign-up when showSocialSignUp is false", () => {
        render(<SignUp onSubmit={mockOnSubmit} showSocialSignUp={false} />);

        expect(screen.queryByTestId("social-signup")).not.toBeInTheDocument();
    });

    it("hides login link when showLoginLink is false", () => {
        render(<SignUp onSubmit={mockOnSubmit} showLoginLink={false} />);

        expect(screen.queryByTestId("login-link")).not.toBeInTheDocument();
    });

    it("shows loading state on form submission", () => {
        render(<SignUp onSubmit={mockOnSubmit} loading={true} />);

        const submitButton = screen.getByTestId("submit-button");
        expect(submitButton).toHaveTextContent("Creating Account...");
        expect(submitButton).toBeDisabled();
    });

    it("renders custom logo", () => {
        const CustomLogo = () => <div data-testid="custom-logo">Custom Logo</div>;
        render(<SignUp logo={<CustomLogo />} onSubmit={mockOnSubmit} />);

        // Now it should find only one element with this test ID
        expect(screen.getByTestId("custom-logo")).toBeInTheDocument();
    });

    it("applies custom button styles", () => {
        const customClassName = "custom-button-class";
        render(
            <SignUp
                onSubmit={mockOnSubmit}
                buttonStyle={{
                    className: customClassName,
                }}
            />
        );

        const submitButton = screen.getByTestId("submit-button");
        expect(submitButton.className).toContain(customClassName);
    });

    it("handles input changes", () => {
        const handleInputChange = vi.fn();

        useSignUpFormMock.mockReturnValue({
            ...defaultHookReturn,
            handleInputChange,
        });

        render(<SignUp onSubmit={mockOnSubmit} />);

        const firstNameInput = screen.getByTestId("first-name-input");
        fireEvent.change(firstNameInput, { target: { value: "John" } });

        expect(handleInputChange).toHaveBeenCalledWith("firstName", "John");
    });

    it("renders modern variant correctly", () => {
        render(<SignUp variant="modern" onSubmit={mockOnSubmit} />);

        expect(screen.getByText("Create Your Account")).toBeInTheDocument();
    });

    it("renders glass variant correctly", () => {
        render(<SignUp variant="glass" onSubmit={mockOnSubmit} />);

        expect(screen.getByText("Create Your Account")).toBeInTheDocument();
    });

    it("handles split layout background customization", () => {
        const splitBackground = {
            backgroundImage: "https://example.com/bg.jpg",
            overlayColor: "rgba(0,0,0,0.5)",
        };

        render(
            <SignUp
                type="split"
                onSubmit={mockOnSubmit}
                splitBackground={splitBackground}
            />
        );

        expect(screen.getByTestId("left-panel")).toBeInTheDocument();
    });

    it("handles custom left panel content", () => {
        const leftPanelContent = {
            title: "Join Our Community",
            description: "Sign up to access exclusive features",
            hideBranding: true,
        };

        render(
            <SignUp
                type="split"
                onSubmit={mockOnSubmit}
                leftPanelContent={leftPanelContent}
            />
        );

        expect(screen.getByTestId("left-panel")).toBeInTheDocument();
    });

    it("handles social sign-up callbacks", () => {
        render(
            <SignUp
                onSubmit={mockOnSubmit}
                onGoogleSignUp={mockOnGoogleSignUp}
                showSocialSignUp={true}
            />
        );

        const googleButton = screen.getByTestId("google-signup");
        expect(googleButton).toBeInTheDocument();
    });

    it("handles terms and conditions configuration", () => {
        const termsConfig = {
            enabled: true,
            text: "I agree to the Terms and Conditions",
            linkText: "Terms and Conditions",
            onLinkClick: vi.fn(),
        };

        render(<SignUp onSubmit={mockOnSubmit} termsConfig={termsConfig} />);

        expect(screen.getByTestId("form-content")).toBeInTheDocument();
    });

    it("handles password strength configuration", () => {
        const passwordStrength = {
            minLength: 10,
            showStrengthMeter: true,
        };

        render(<SignUp onSubmit={mockOnSubmit} passwordStrength={passwordStrength} />);

        expect(screen.getByTestId("password-input")).toBeInTheDocument();
    });

    it("handles CAPTCHA configuration", () => {
        const captchaConfig = {
            enabled: true,
            siteKey: "test-site-key",
        };

        render(<SignUp onSubmit={mockOnSubmit} captchaConfig={captchaConfig} />);

        expect(screen.getByTestId("form-content")).toBeInTheDocument();
    });
});