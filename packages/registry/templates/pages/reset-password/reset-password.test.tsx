/**
 * Unit Tests for ResetPasswordPage Component
 * 
 * This test suite covers all functionality of the ResetPasswordPage component including:
 * - Component rendering and initial state
 * - Token validation (default and custom)
 * - Password strength calculation and display
 * - Password matching validation
 * - Form submission and error handling
 * - Success states and user feedback
 * - Edge cases and boundary conditions
 */

// React Testing Library imports for component rendering and DOM queries
import { render, screen, waitFor } from "@testing-library/react";
// Vitest testing framework imports
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
// Component under test
import { ResetPasswordPage } from ".";
// User event simulation library for testing user interactions
import userEvent from "@testing-library/user-event";

/**
 * Mock @ignix-ui/button component
 * 
 * Creates a simple button mock that forwards all props and handles click events.
 * This allows us to test button interactions without the full component implementation.
 * Filters out non-DOM props to prevent React warnings.
 */
vi.mock("@ignix-ui/button", () => {
  return {
    Button: ({ 
      children,
       onClick, 
       disabled, 
       type, 
      //  animationVariant,
        ...props 
    }: any) => {
      // Filter out non-DOM props to prevent React warnings
      const { 
        // animationVariant: _,
         ...domProps 
      } = props;
      return (
        <button {...domProps} onClick={onClick} disabled={disabled} type={type}>
          {children}
        </button>
      );
    },
  };
});

/**
 * Mock @ignix-ui/card components
 * 
 * Mocks all card-related components (Card, CardContent, CardDescription, etc.)
 * as simple div elements. This isolates the test to focus on ResetPasswordPage logic
 * rather than card component implementation details.
 */
vi.mock("@ignix-ui/card", () => {
  return {
    Card: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    CardContent: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    CardDescription: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    CardHeader: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    CardTitle: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
  };
});

/**
 * Mock @ignix-ui/input component (AnimatedInput)
 * 
 * Creates a mock input component that:
 * - Handles value and onChange props correctly
 * - Displays error messages when provided
 * - Displays success messages when provided
 * - Adds test IDs for easier querying in tests
 * - Filters out non-DOM props to prevent React warnings
 * 
 * The mock simulates the AnimatedInput behavior without animation complexity.
 */
vi.mock("@ignix-ui/input", () => {
  const AnimatedInput = ({ 
    value, 
    onChange, 
    placeholder, 
    error, 
    success, 
    successMessage,
    // icon,
    // labelClassName,
    // showPasswordToggle,
    // size,
    // variant,
    ...props 
  }: any) => {
    // Filter out non-DOM props to prevent React warnings
    const domProps = Object.fromEntries(
      Object.entries(props).filter(([key]) => 
        !['icon', 'labelClassName', 'showPasswordToggle', 'size', 'variant'].includes(key)
      )
    );
    
    return (
      <div>
        <input
          {...domProps}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          data-testid={`input-${placeholder?.toLowerCase().replace(/\s+/g, '-')}`}
        />
        {/* Render error message if provided */}
        {error && <div data-testid="error-message">{error}</div>}
        {/* Render success message if provided */}
        {success && successMessage && <div data-testid="success-message">{successMessage}</div>}
      </div>
    );
  };

  return { default: AnimatedInput };
});

/**
 * Mock framer-motion library
 * 
 * Framer Motion is an animation library that can cause issues in test environments.
 * This mock:
 * - Replaces all motion.* components with simple div elements
 * - Mocks animation hooks to return safe default values
 * - Prevents animation-related errors during testing
 * 
 * Uses Proxy to catch any motion component access and return a mock component.
 */
vi.mock("framer-motion", async () => {
  const react = await vi.importActual<typeof import("react")>("react");

  // Create a mock motion component that renders as a regular div
  const MockMotion = react.forwardRef(
    ({ children, ...props }: any, ref: any) =>
      react.createElement("div", { ref, ...props }, children)
  );

  // Safe dummy function for hooks that return numbers
  const mockFn = () => 0;

  return {
    // Proxy allows any motion.* component access to return MockMotion
    motion: new Proxy(
      {},
      {
        get: () => MockMotion,
      }
    ),
    // Mock animation hooks with safe defaults
    useMotionValue: mockFn,
    useTransform: mockFn,
    useSpring: mockFn,
    useVelocity: mockFn,
    useReducedMotion: () => false,
    useAnimate: () => [react.useRef(null), mockFn],
    AnimatePresence: ({ children }: any) => <div>{children}</div>,
    LayoutGroup: ({ children }: any) => <div>{children}</div>,
  };
});

/**
 * Mock lucide-react icons
 * 
 * Replaces icon components with simple div elements containing test IDs.
 * This allows us to verify icon rendering without importing the full icon library.
 */
vi.mock("lucide-react", () => ({
  Lock: () => <div data-testid="lock-icon" />,
  Key: () => <div data-testid="key-icon" />,
  CheckCircle2: () => <div data-testid="check-circle-icon" />,
  Shield: () => <div data-testid="shield-icon" />,
  XCircle: () => <div data-testid="x-circle-icon" />,
}));

/**
 * Main test suite for ResetPasswordPage component
 */
describe("ResetPasswordPage", () => {
  // Mock functions for component callbacks
  let onSubmitMock: ReturnType<typeof vi.fn>;
  let onTokenValidateMock: ReturnType<typeof vi.fn>;

  /**
   * Setup before each test
   * 
   * - Creates fresh mock functions for each test to ensure test isolation
   * - Note: We use real timers by default for userEvent interactions
   * - Fake timers are only enabled in specific tests that need them (setTimeout tests)
   */
  beforeEach(() => {
    onSubmitMock = vi.fn();
    onTokenValidateMock = vi.fn();
    // Use real timers by default - userEvent works better with real timers
    // Fake timers will be enabled only in tests that need them
  });

  /**
   * Cleanup after each test
   * 
   * - Restores all mocks to their original state
   * - Ensures timers are restored to real timers
   */
  afterEach(() => {
    vi.restoreAllMocks();
    // Ensure we're back to real timers after each test
    vi.useRealTimers();
  });


  /**
   * Helper function to render the component with default props
   * 
   * @param props - Optional props to override defaults
   * @returns Rendered component instance
   */
  const renderComponent = (props = {}) =>
    render(
      <ResetPasswordPage
        onSubmit={onSubmitMock}
        onTokenValidate={onTokenValidateMock}
        {...props}
      />
    );

  /**
   * Test Suite: Component Rendering
   * 
   * Tests that the component renders correctly with all expected elements
   * visible and in the correct initial state.
   */
  describe("Rendering", () => {
    it("renders the reset password form", () => {
      renderComponent();
      // Verify main heading is displayed
      expect(screen.getByText("Reset Your Password")).toBeInTheDocument();
      // Verify description text is displayed
      expect(
        screen.getByText("Enter your reset token and create a new secure password")
      ).toBeInTheDocument();
    });

    it("renders all input fields", () => {
      renderComponent();
      // Verify all three input fields are present
      expect(screen.getByPlaceholderText("Reset Token / Code")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("New Password")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Confirm Password")).toBeInTheDocument();
    });

    it("renders the submit button", () => {
      renderComponent();
      const button = screen.getByRole("button", { name: /reset password/i });
      expect(button).toBeInTheDocument();
      // Button should be disabled initially (no valid data entered)
      expect(button).toBeDisabled();
    });

    it("renders with initial token prop", () => {
      // Test that component accepts and displays an initial token value
      renderComponent({ token: "test-token-123" });
      const tokenInput = screen.getByPlaceholderText("Reset Token / Code") as HTMLInputElement;
      expect(tokenInput.value).toBe("test-token-123");
    });
  });

  /**
   * Test Suite: Token Validation
   * 
   * Tests token validation logic including:
   * - Default validation (length-based: 6-32 characters)
   * - Custom validation callback
   * - Error message display
   * - Error clearing on valid input
   */
  describe("Token Validation", () => {
    it("uses custom token validation when provided", async () => {
      const user = userEvent.setup();
      // Mock custom validation to return false (invalid token)
      onTokenValidateMock.mockReturnValue(false);
      renderComponent();

      const tokenInput = screen.getByPlaceholderText("Reset Token / Code");
      await user.type(tokenInput, "custom-token");

      await waitFor(() => {
        // Verify custom validation function was called
        expect(onTokenValidateMock).toHaveBeenCalledWith("custom-token");
        // Verify error message is displayed
        expect(screen.getByTestId("error-message")).toHaveTextContent(
          "Invalid or expired reset token. Please check your email."
        );
      });
    });

  });

  /**
   * Test Suite: Password Strength
   * 
   * Tests password strength calculation and display:
   * - Strength levels: Very Weak, Weak, Fair, Good, Strong
   * - Requirements checklist display
   * - Error messages for weak passwords
   * - Success messages for strong passwords
   */
  describe("Password Strength", () => {
    it("shows password strength indicator when password is entered", async () => {
      const user = userEvent.setup();
      renderComponent();

      const passwordInput = screen.getByPlaceholderText("New Password");
      await user.type(passwordInput, "test");

      await waitFor(() => {
        // Verify strength indicator appears
        expect(screen.getByText("Password Strength:")).toBeInTheDocument();
        // Verify strength label is displayed
        expect(screen.getByText("Very Weak")).toBeInTheDocument();
      });
    });

    it("calculates password strength correctly for very weak password", async () => {
      const user = userEvent.setup();
      renderComponent();

      const passwordInput = screen.getByPlaceholderText("New Password");
      // Password less than 6 characters = Very Weak
      await user.type(passwordInput, "short");

      await waitFor(() => {
        expect(screen.getByText("Very Weak")).toBeInTheDocument();
      });
    });

    it("calculates password strength correctly for weak password", async () => {
      const user = userEvent.setup();
      renderComponent();

      const passwordInput = screen.getByPlaceholderText("New Password");
      // Password with only lowercase (1-2 requirements met) = Weak
      // Using a password that meets only 2 requirements: minLength and hasLowerCase
      await user.type(passwordInput, "password");

      await waitFor(() => {
        // Use getByText with exact match
        expect(screen.getByText("Weak")).toBeInTheDocument();
      });
    });

    it("calculates password strength correctly for fair password", async () => {
      const user = userEvent.setup();
      renderComponent();

      const passwordInput = screen.getByPlaceholderText("New Password");
      // Password with exactly 3 requirements met = Fair
      // "Password" has: minLength (8>=8), hasUpperCase (P), hasLowerCase (assword) = 3 requirements = Fair
      await user.type(passwordInput, "Password");

      await waitFor(() => {
        // Use getByText with exact match - wait for strength indicator to appear
        expect(screen.getByText("Password Strength:")).toBeInTheDocument();
        expect(screen.getByText("Fair")).toBeInTheDocument();
      }, { timeout: 2000 });
    });

    it("calculates password strength correctly for strong password", async () => {
      const user = userEvent.setup();
      renderComponent();

      const passwordInput = screen.getByPlaceholderText("New Password");
      // Password with all 5 requirements met = Strong
      await user.type(passwordInput, "Password123!@#");

      await waitFor(() => {
        expect(screen.getByText("Strong")).toBeInTheDocument();
      });
    });

    it("shows password requirements checklist", async () => {
      const user = userEvent.setup();
      renderComponent();

      const passwordInput = screen.getByPlaceholderText("New Password");
      await user.type(passwordInput, "Test123!");

      await waitFor(() => {
        // Verify all requirement labels are displayed
        expect(screen.getByText("At least 8 characters")).toBeInTheDocument();
        expect(screen.getByText("One uppercase letter")).toBeInTheDocument();
        expect(screen.getByText("One lowercase letter")).toBeInTheDocument();
        expect(screen.getByText("One number")).toBeInTheDocument();
        expect(screen.getByText("One special character")).toBeInTheDocument();
      });
    });

    it("shows error for weak password", async () => {
      const user = userEvent.setup();
      renderComponent();

      const passwordInput = screen.getByPlaceholderText("New Password");
      // Password with score < 2 should show error
      await user.type(passwordInput, "weak");

      await waitFor(() => {
        const errorMessage = screen.getByTestId("error-message");
        expect(errorMessage).toHaveTextContent("Password is too weak");
      });
    });

    it("shows success message for strong password", async () => {
      const user = userEvent.setup();
      renderComponent();

      const passwordInput = screen.getByPlaceholderText("New Password");
      // Password with score = 4 (Strong) should show success message
      await user.type(passwordInput, "StrongPassword123!@#");

      await waitFor(() => {
        const successMessage = screen.getByTestId("success-message");
        expect(successMessage).toHaveTextContent("Strong password achieved");
      });
    });
  });

  /**
   * Test Suite: Password Matching
   * 
   * Tests password confirmation validation:
   * - Error when passwords don't match
   * - Success when passwords match
   * - Submit button state based on matching
   */
  describe("Password Matching", () => {
    it("shows error when passwords do not match", async () => {
      const user = userEvent.setup();
      renderComponent();

      const passwordInput = screen.getByPlaceholderText("New Password");
      const confirmPasswordInput = screen.getByPlaceholderText("Confirm Password");

      // Enter different passwords
      await user.type(passwordInput, "Password123!");
      await user.type(confirmPasswordInput, "Different123!");

      await waitFor(() => {
        // Find the error message related to password mismatch
        const errorMessages = screen.getAllByTestId("error-message");
        const passwordMismatchError = errorMessages.find((msg) =>
          msg.textContent?.includes("Passwords do not match")
        );
        expect(passwordMismatchError).toBeInTheDocument();
      });
    });

    it("shows success when passwords match", async () => {
      const user = userEvent.setup();
      renderComponent();

      const passwordInput = screen.getByPlaceholderText("New Password");
      const confirmPasswordInput = screen.getByPlaceholderText("Confirm Password");

      // Enter matching passwords
      await user.type(passwordInput, "Password123!");
      await user.type(confirmPasswordInput, "Password123!");

      await waitFor(() => {
        // Find the success message related to password match
        const successMessages = screen.getAllByTestId("success-message");
        const passwordMatchSuccess = successMessages.find((msg) =>
          msg.textContent?.includes("Passwords match successfully")
        );
        expect(passwordMatchSuccess).toBeInTheDocument();
      });
    });

    it("enables submit button when passwords match and strength is sufficient", async () => {
      const user = userEvent.setup();
      // Mock token validation to return true
      onTokenValidateMock.mockReturnValue(true);
      renderComponent({ token: "valid-token-123" });

      const passwordInput = screen.getByPlaceholderText("New Password");
      const confirmPasswordInput = screen.getByPlaceholderText("Confirm Password");
      const submitButton = screen.getByRole("button", { name: /reset password/i });

      // Enter matching passwords with sufficient strength
      await user.type(passwordInput, "Password123!");
      await user.type(confirmPasswordInput, "Password123!");

      await waitFor(() => {
        // Button should be enabled when all conditions are met:
        // - Valid token
        // - Passwords match
        // - Password strength >= 2
        expect(submitButton).not.toBeDisabled();
      });
    });
  });

  /**
   * Test Suite: Form Submission
   * 
   * Tests form submission logic including:
   * - Validation preventing invalid submissions
   * - Successful submission flow
   * - Loading states
   * - Success message display
   * - Callback invocation with correct parameters
   */
  describe("Form Submission", () => {
    it("prevents submission with invalid token", async () => {
      const user = userEvent.setup();
      renderComponent();

      const tokenInput = screen.getByPlaceholderText("Reset Token / Code");
      const passwordInput = screen.getByPlaceholderText("New Password");
      const confirmPasswordInput = screen.getByPlaceholderText("Confirm Password");
      const submitButton = screen.getByRole("button", { name: /reset password/i });

      // Fill form with invalid token (too short)
      await user.type(tokenInput, "short");
      await user.type(passwordInput, "Password123!");
      await user.type(confirmPasswordInput, "Password123!");
      await user.click(submitButton);

      // onSubmit should not be called due to invalid token
      expect(onSubmitMock).not.toHaveBeenCalled();
    });

    it("prevents submission when passwords do not match", async () => {
      const user = userEvent.setup();
      onTokenValidateMock.mockReturnValue(true);
      renderComponent({ token: "valid-token-123" });

      const passwordInput = screen.getByPlaceholderText("New Password");
      const confirmPasswordInput = screen.getByPlaceholderText("Confirm Password");
      const submitButton = screen.getByRole("button", { name: /reset password/i });

      // Enter mismatched passwords
      await user.type(passwordInput, "Password123!");
      await user.type(confirmPasswordInput, "Different123!");
      await user.click(submitButton);

      // onSubmit should not be called due to password mismatch
      expect(onSubmitMock).not.toHaveBeenCalled();
    });

    it("prevents submission when password strength is too weak", async () => {
      const user = userEvent.setup();
      onTokenValidateMock.mockReturnValue(true);
      renderComponent({ token: "valid-token-123" });

      const passwordInput = screen.getByPlaceholderText("New Password");
      const confirmPasswordInput = screen.getByPlaceholderText("Confirm Password");
      const submitButton = screen.getByRole("button", { name: /reset password/i });

      // Enter weak password (score < 2)
      await user.type(passwordInput, "weak");
      await user.type(confirmPasswordInput, "weak");
      await user.click(submitButton);

      // onSubmit should not be called due to weak password
      expect(onSubmitMock).not.toHaveBeenCalled();
    });

    it("submits form with valid data", async () => {
      onTokenValidateMock.mockReturnValue(true);
      renderComponent({ token: "valid-token-123" });

      const passwordInput = screen.getByPlaceholderText("New Password");
      const confirmPasswordInput = screen.getByPlaceholderText("Confirm Password");
      const submitButton = screen.getByRole("button", { name: /reset password/i });

      // Fill form with valid data
      const user = userEvent.setup();
      await user.type(passwordInput, "Password123!");
      await user.type(confirmPasswordInput, "Password123!");
      await user.click(submitButton);

      // Wait for setTimeout to complete (1500ms delay in component)
      await waitFor(() => {
        // Verify onSubmit was called with correct parameters
        expect(onSubmitMock).toHaveBeenCalledWith("Password123!", "valid-token-123");
      }, { timeout: 3000 });
    });

    it("shows loading state during submission", async () => {
      const user = userEvent.setup();
      onTokenValidateMock.mockReturnValue(true);
      renderComponent({ token: "valid-token-123" });

      const passwordInput = screen.getByPlaceholderText("New Password");
      const confirmPasswordInput = screen.getByPlaceholderText("Confirm Password");
      const submitButton = screen.getByRole("button", { name: /reset password/i });

      await user.type(passwordInput, "Password123!");
      await user.type(confirmPasswordInput, "Password123!");
      await user.click(submitButton);

      await waitFor(() => {
        // Verify loading text is displayed
        expect(screen.getByText(/resetting password/i)).toBeInTheDocument();
        // Verify button is disabled during submission
        expect(submitButton).toBeDisabled();
      });
    });

    it("shows success message after successful submission", async () => {
      onTokenValidateMock.mockReturnValue(true);
      renderComponent({ token: "valid-token-123" });

      const passwordInput = screen.getByPlaceholderText("New Password");
      const confirmPasswordInput = screen.getByPlaceholderText("Confirm Password");
      const submitButton = screen.getByRole("button", { name: /reset password/i });

      const user = userEvent.setup();
      await user.type(passwordInput, "Password123!");
      await user.type(confirmPasswordInput, "Password123!");
      await user.click(submitButton);

      // Wait for setTimeout to complete (1500ms delay in component)
      await waitFor(() => {
        // Verify success message is displayed
        expect(screen.getByText("Password Reset Successful!")).toBeInTheDocument();
        expect(
          screen.getByText(
            "Your password has been reset. You can now log in with your new password."
          )
        ).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it("calls onSubmit callback with correct parameters", async () => {
      onTokenValidateMock.mockReturnValue(true);
      renderComponent({ token: "test-token-456" });

      const passwordInput = screen.getByPlaceholderText("New Password");
      const confirmPasswordInput = screen.getByPlaceholderText("Confirm Password");
      const submitButton = screen.getByRole("button", { name: /reset password/i });

      const user = userEvent.setup();
      await user.type(passwordInput, "NewPassword123!");
      await user.type(confirmPasswordInput, "NewPassword123!");
      await user.click(submitButton);

      // Wait for setTimeout to complete (1500ms delay in component)
      await waitFor(() => {
        // Verify callback was called exactly once
        expect(onSubmitMock).toHaveBeenCalledTimes(1);
        // Verify callback was called with correct password and token
        expect(onSubmitMock).toHaveBeenCalledWith("NewPassword123!", "test-token-456");
      }, { timeout: 3000 });
    });
  });

  /**
   * Test Suite: Input Variants
   * 
   * Tests that custom input variants can be applied to the component.
   */
  describe("Input Variants", () => {
    it("applies custom input variant", () => {
      // Test that component accepts and uses custom input variant prop
      renderComponent({ inputVariant: "underline" });
      const tokenInput = screen.getByPlaceholderText("Reset Token / Code");
      expect(tokenInput).toBeInTheDocument();
    });
  });

  /**
   * Test Suite: Custom ClassName
   * 
   * Tests that custom className prop is applied to the component.
   */
  describe("Custom ClassName", () => {
    it("applies custom className prop", () => {
      // Test that component accepts and applies custom className
      const { container } = renderComponent({ className: "custom-class" });
      const mainDiv = container.querySelector(".custom-class");
      expect(mainDiv).toBeInTheDocument();
    });
  });

  /**
   * Test Suite: Edge Cases
   * 
   * Tests boundary conditions and edge cases:
   * - Empty values
   * - Very long values
   * - Real-time updates
   */
  describe("Edge Cases", () => {
    it("handles empty token initially", () => {
      // Test that component handles empty token prop gracefully
      renderComponent({ token: "" });
      const tokenInput = screen.getByPlaceholderText("Reset Token / Code") as HTMLInputElement;
      expect(tokenInput.value).toBe("");
    });

    it("handles very long token", async () => {
      const user = userEvent.setup();
      onTokenValidateMock.mockReturnValue(true);
      // Test with maximum valid token length (32 characters)
      const longToken = "a".repeat(32);
      renderComponent({ token: longToken });

      const submitButton = screen.getByRole("button", { name: /reset password/i });
      const passwordInput = screen.getByPlaceholderText("New Password");
      const confirmPasswordInput = screen.getByPlaceholderText("Confirm Password");

      await user.type(passwordInput, "Password123!");
      await user.type(confirmPasswordInput, "Password123!");

      await waitFor(() => {
        // Form should still be submittable with max-length token
        expect(submitButton).not.toBeDisabled();
      });
    });

    it("handles token that exceeds max length", async () => {
      const user = userEvent.setup();
      // Test with token exceeding max length (33 characters)
      const longToken = "a".repeat(33);
      renderComponent({ token: longToken });

      // Trigger validation by interacting with the input
      const tokenInput = screen.getByPlaceholderText("Reset Token / Code");
      await user.click(tokenInput);
      await user.type(tokenInput, "b"); // Add a character to trigger validation
      
      await waitFor(() => {
        const errorMessages = screen.queryAllByTestId("error-message");
        // Token validation should fail for tokens longer than 32 characters
        const tokenError = errorMessages.find((msg) =>
          msg.textContent?.includes("Invalid or expired reset token")
        );
        expect(tokenError).toBeInTheDocument();
      });
    });

  });
});
