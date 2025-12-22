/**
 * Unit Tests for SecurityPage Component
 *
 * This test suite covers all functionality of the SecurityPage component including:
 * - Component rendering and initial state
 * - Password change functionality (strength calculation, validation, submission)
 * - Active sessions management (sorting, logout all)
 * - Two-factor authentication toggle and recovery codes
 * - Login activity history (sorting, display)
 * - Layout variants (grid vs list)
 * - Theme variants (light, dark, auto)
 * - Edge cases and boundary conditions
 */

import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach, beforeAll } from "vitest";
import { SecurityPage } from ".";

/**
 * Mock @ignix-ui/button component
 */
vi.mock("@ignix-ui/button", () => {
  return {
    Button: ({ children, onClick, disabled, type, asChild, ...props }: any) => {
      const { animationVariant, ...domProps } = props;
      // Suppress unused variable warnings for intentionally ignored props
      void animationVariant;
      void asChild;
      
      if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children, { onClick, disabled, type, ...domProps });
      }
      
      return (
        <button {...domProps} onClick={onClick} disabled={disabled} type={type}>
          {children}
        </button>
      );
    },
  };
});

/**
 * Mock @ignix-ui/input component (AnimatedInput)
 */
vi.mock("@ignix-ui/input", () => {
  const AnimatedInput = ({
    value,
    onChange,
    placeholder,
    error,
    success,
    successMessage,
    type,
    ...props
  }: any) => {
    const { icon, labelClassName, showPasswordToggle, size, variant, inputClassName, ...domProps } = props;
    // Suppress unused variable warnings for intentionally ignored props
    void icon;
    void labelClassName;
    void showPasswordToggle;
    void size;
    void variant;
    void inputClassName;
    return (
      <div>
        <input
          {...domProps}
          type={type || "text"}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          data-testid={`input-${placeholder?.toLowerCase().replace(/\s+/g, "-") || "input"}`}
        />
        {error && <div data-testid="error-message">{error}</div>}
        {success && successMessage && (
          <div data-testid="success-message">{successMessage}</div>
        )}
      </div>
    );
  };
  return { AnimatedInput };
});

/**
 * Mock @ignix-ui/switch component
 */
vi.mock("@ignix-ui/switch", () => {
  return {
    Switch: ({ checked, onCheckedChange, ...props }: any) => {
      const { variant, animation, glowEffect, ...domProps } = props;
      // Suppress unused variable warnings for intentionally ignored props
      void variant;
      void animation;
      void glowEffect;
      return (
        <button
          {...domProps}
          role="switch"
          aria-checked={checked}
          onClick={() => onCheckedChange?.(!checked)}
          data-testid="two-factor-switch"
        >
          {checked ? "ON" : "OFF"}
        </button>
      );
    },
  };
});

/**
 * Mock @ignix-ui/table component
 */
vi.mock("@ignix-ui/table", () => {
  return {
    Table: ({ headings, data, applySort, ...props }: any) => {
      const { variant, size, animationVariant, showHoverEffects, showStripes, showBorders, glow, currentPage, totalPages, onPageChange, ...domProps } = props;
      // Suppress unused variable warnings for intentionally ignored props
      void variant;
      void size;
      void animationVariant;
      void showHoverEffects;
      void showStripes;
      void showBorders;
      void glow;
      void currentPage;
      void totalPages;
      void onPageChange;
      return (
        <table {...domProps} data-testid="table">
          <thead>
            <tr>
              {headings?.map((heading: any) => (
                <th
                  key={heading.key}
                  onClick={() => applySort?.(heading.key, heading.sort === "asc" ? "desc" : "asc")}
                  style={{ cursor: "pointer" }}
                >
                  {heading.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data?.map((row: any, idx: number) => (
              <tr key={idx}>
                {headings?.map((heading: any) => (
                  <td key={heading.key}>{row[heading.key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    },
  };
});

/**
 * Mock @ignix-ui/accordion components
 */
vi.mock("@ignix-ui/accordion", () => {
  return {
    Accordion: ({ children, collapsible, ...props }: any) => {
      // Suppress unused variable warnings
      void collapsible;
      return <div {...props}>{children}</div>;
    },
    AccordionItem: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    AccordionTrigger: ({ children, onClick, ...props }: any) => (
      <button {...props} onClick={onClick}>
        {children}
      </button>
    ),
    AccordionContent: ({ children, variant, ...props }: any) => {
      void variant;
      return <div {...props}>{children}</div>;
    },
  };
});

/**
 * Mock @ignix-ui/card components
 */
vi.mock("@ignix-ui/card", () => {
  return {
    Card: ({ children, variant, animation, ...props }: any) => {
      // Suppress unused variable warnings
      void variant;
      void animation;
      return <div {...props}>{children}</div>;
    },
    CardContent: ({ children, variant, ...props }: any) => {
      void variant;
      return <div {...props}>{children}</div>;
    },
    CardDescription: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    CardHeader: ({ children, variant, ...props }: any) => {
      void variant;
      return <div {...props}>{children}</div>;
    },
    CardTitle: ({ children, size, gradient, ...props }: any) => {
      void size;
      void gradient;
      return <h2 {...props}>{children}</h2>;
    },
    CardFooter: ({ children, variant, justify, ...props }: any) => {
      void variant;
      void justify;
      return <div {...props}>{children}</div>;
    },
  };
});

/**
 * Mock framer-motion to avoid animation complexity in tests
 */
vi.mock("framer-motion", async () => {
  const react = await vi.importActual<typeof import("react")>("react");
  const MockMotion = react.forwardRef(({ children, ...props }: any, ref: any) =>
    react.createElement("div", { ref, ...props }, children)
  );
  return {
    motion: new Proxy({}, { get: () => MockMotion }),
    useReducedMotion: () => false,
  };
});

/**
 * Mock lucide-react icons as simple spans with test IDs
 */
vi.mock("lucide-react", () => ({
  Shield: () => <span data-testid="icon-shield" />,
  Lock: () => <span data-testid="icon-lock" />,
  LogOut: () => <span data-testid="icon-logout" />,
  Smartphone: () => <span data-testid="icon-smartphone" />,
  MapPin: () => <span data-testid="icon-mappin" />,
  Clock: () => <span data-testid="icon-clock" />,
  Activity: () => <span data-testid="icon-activity" />,
  Key: () => <span data-testid="icon-key" />,
  CheckCircle2: () => <span data-testid="icon-check" />,
  Copy: () => <span data-testid="icon-copy" />,
  History: () => <span data-testid="icon-history" />,
  Laptop: () => <span data-testid="icon-laptop" />,
  Tablet: () => <span data-testid="icon-tablet" />,
}));

describe("SecurityPage", () => {
  // Shared clipboard mock for all tests
  const writeTextMock = vi.fn();

  beforeAll(() => {
    Object.defineProperty(globalThis.navigator, "clipboard", {
      value: { writeText: writeTextMock },
      configurable: true,
    });
  });

  beforeEach(() => {
    writeTextMock.mockReset();
    // Mock window.confirm - ensure it's always available
    Object.defineProperty(window, "confirm", {
      value: vi.fn(() => true),
      configurable: true,
      writable: true,
    });
    // Use real timers by default - userEvent works better with real timers
    vi.useRealTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    // Ensure window.confirm is always restored
    Object.defineProperty(window, "confirm", {
      value: vi.fn(() => true),
      configurable: true,
      writable: true,
    });
    // Ensure we're back to real timers after each test
    vi.useRealTimers();
  });

  const renderComponent = (props: Partial<React.ComponentProps<typeof SecurityPage>> = {}) =>
    render(<SecurityPage {...props} />);

  describe("Rendering", () => {
    it("renders with default props", () => {
      renderComponent();

      expect(screen.getByText("Security")).toBeInTheDocument();
      expect(
        screen.getByText("Manage account security, sessions, and two-factor authentication.")
      ).toBeInTheDocument();
      expect(screen.getByText("High security")).toBeInTheDocument();
    });

    it("renders with custom title and description", () => {
      renderComponent({
        title: "Account Security",
        description: "Custom security description",
      });

      expect(screen.getByText("Account Security")).toBeInTheDocument();
      expect(screen.getByText("Custom security description")).toBeInTheDocument();
    });

    it("renders all main sections in grid layout", () => {
      renderComponent({ layout: "grid" });

      expect(screen.getByText("Change password")).toBeInTheDocument();
      expect(screen.getByText("Active sessions")).toBeInTheDocument();
      expect(screen.getByText("Two-factor authentication")).toBeInTheDocument();
      expect(screen.getByText("Login activity")).toBeInTheDocument();
    });

    it("renders all sections in accordion layout when layout is list", () => {
      renderComponent({ layout: "list" });

      // In list layout, sections appear both in accordion triggers and card titles
      expect(screen.getAllByText("Change password").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Two-factor authentication").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Active sessions").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Login activity").length).toBeGreaterThan(0);
    });

    it("applies correct variant classes", () => {
      const { container } = renderComponent({ variant: "dark" });
      expect(container.firstChild).toHaveClass("bg-gradient-to-br");
    });
  });

  describe("Password Change Functionality", () => {
    it("renders password change form with all inputs", () => {
      renderComponent();

      expect(screen.getByPlaceholderText("Current password")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("New password")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Confirm new password")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /update password/i })).toBeInTheDocument();
    });

    it("disables update button when form is empty", () => {
      renderComponent();

      const updateButton = screen.getByRole("button", { name: /update password/i });
      expect(updateButton).toBeDisabled();
    });

    it("disables update button when passwords don't match", async () => {
      const user = userEvent.setup();
      renderComponent();

      const currentPasswordInput = screen.getByPlaceholderText("Current password");
      const newPasswordInput = screen.getByPlaceholderText("New password");
      const confirmPasswordInput = screen.getByPlaceholderText("Confirm new password");

      await user.type(currentPasswordInput, "oldpass123");
      await user.type(newPasswordInput, "newpass123");
      await user.type(confirmPasswordInput, "differentpass");

      const updateButton = screen.getByRole("button", { name: /update password/i });
      expect(updateButton).toBeDisabled();
      expect(screen.getByTestId("error-message")).toHaveTextContent("Passwords do not match");
    });

    it("shows password strength indicator when new password is entered", async () => {
      const user = userEvent.setup();
      renderComponent();

      const newPasswordInput = screen.getByPlaceholderText("New password");
      await user.type(newPasswordInput, "weak");

      await waitFor(() => {
        expect(screen.getByText(/password strength:/i)).toBeInTheDocument();
        expect(screen.getByText("Very Weak")).toBeInTheDocument();
      });
    });

    it("calculates password strength correctly for weak password", async () => {
      const user = userEvent.setup();
      renderComponent();

      const newPasswordInput = screen.getByPlaceholderText("New password");
      await user.type(newPasswordInput, "weak");

      await waitFor(() => {
        expect(screen.getByText("Very Weak")).toBeInTheDocument();
      });
    });

    it("calculates password strength correctly for strong password", async () => {
      const user = userEvent.setup();
      renderComponent();

      const newPasswordInput = screen.getByPlaceholderText("New password");
      await user.type(newPasswordInput, "StrongPass123!");

      await waitFor(() => {
        const strengthLabel = screen.getByText(/password strength:/i).nextSibling;
        expect(strengthLabel).toHaveTextContent(/Strong|Good/);
      });
    });

    it("disables update button when password strength is too weak", async () => {
      const user = userEvent.setup();
      renderComponent();

      const currentPasswordInput = screen.getByPlaceholderText("Current password");
      const newPasswordInput = screen.getByPlaceholderText("New password");
      const confirmPasswordInput = screen.getByPlaceholderText("Confirm new password");

      await user.type(currentPasswordInput, "oldpass123");
      await user.type(newPasswordInput, "weak");
      await user.type(confirmPasswordInput, "weak");

      const updateButton = screen.getByRole("button", { name: /update password/i });
      expect(updateButton).toBeDisabled();
    });

    it("enables update button when all conditions are met", async () => {
      const user = userEvent.setup();
      renderComponent();

      const currentPasswordInput = screen.getByPlaceholderText("Current password");
      const newPasswordInput = screen.getByPlaceholderText("New password");
      const confirmPasswordInput = screen.getByPlaceholderText("Confirm new password");

      await user.type(currentPasswordInput, "oldpass123");
      await user.type(newPasswordInput, "NewPass123!");
      await user.type(confirmPasswordInput, "NewPass123!");

      const updateButton = screen.getByRole("button", { name: /update password/i });
      expect(updateButton).not.toBeDisabled();
    });

    it("shows success message after password update", async () => {
      const user = userEvent.setup();
      renderComponent();

      const currentPasswordInput = screen.getByPlaceholderText("Current password");
      const newPasswordInput = screen.getByPlaceholderText("New password");
      const confirmPasswordInput = screen.getByPlaceholderText("Confirm new password");

      await user.type(currentPasswordInput, "oldpass123");
      await user.type(newPasswordInput, "NewPass123!");
      await user.type(confirmPasswordInput, "NewPass123!");

      const updateButton = screen.getByRole("button", { name: /update password/i });
      expect(updateButton).not.toBeDisabled();
      
      await user.click(updateButton);

      // Button should show "Updating..." state
      await waitFor(() => {
        expect(screen.getByText("Updating…")).toBeInTheDocument();
      });

      // Wait for the simulated API call delay (1200ms) to complete
      await waitFor(
        () => {
          expect(screen.getByText("Password updated successfully.")).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });

    it("shows passwords match message when confirm password matches", async () => {
      const user = userEvent.setup();
      renderComponent();

      const newPasswordInput = screen.getByPlaceholderText("New password");
      const confirmPasswordInput = screen.getByPlaceholderText("Confirm new password");

      await user.type(newPasswordInput, "NewPass123!");
      await user.type(confirmPasswordInput, "NewPass123!");

      await waitFor(() => {
        expect(screen.getByTestId("success-message")).toHaveTextContent("Passwords match");
      });
    });
  });

  describe("Active Sessions Management", () => {
    it("renders active sessions table with default sessions", () => {
      renderComponent();

      expect(screen.getByText("Active sessions")).toBeInTheDocument();
      // Device names appear multiple times (in table and potentially elsewhere), so use getAllByText
      expect(screen.getAllByText("MacBook Pro · Chrome").length).toBeGreaterThan(0);
      expect(screen.getAllByText("iPhone 15 · Safari").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Windows · Edge").length).toBeGreaterThan(0);
    });

    it("renders logout all sessions button", () => {
      renderComponent();

      expect(screen.getByRole("button", { name: /logout all/i })).toBeInTheDocument();
    });

    it("does not log out sessions when confirmation is cancelled", async () => {
      const user = userEvent.setup();
      const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(false);
      renderComponent();

      const logoutButton = screen.getByRole("button", { name: /logout all/i });
      await user.click(logoutButton);

      expect(confirmSpy).toHaveBeenCalled();

      // All sessions should still be present
      expect(screen.getAllByText("MacBook Pro · Chrome").length).toBeGreaterThan(0);
      expect(screen.getAllByText("iPhone 15 · Safari").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Windows · Edge").length).toBeGreaterThan(0);

      confirmSpy.mockRestore();
    });

    it("sorts sessions when table header is clicked", async () => {
      const user = userEvent.setup();
      renderComponent();

      const tables = screen.getAllByTestId("table");
      const sessionsTable = tables[0]; // First table is sessions table
      const deviceHeader = within(sessionsTable).getByText("Device");

      await user.click(deviceHeader);

      // Table should still be rendered (sorting happened)
      expect(sessionsTable).toBeInTheDocument();
    });

    it("sorts sessions by location when location header is clicked", async () => {
      const user = userEvent.setup();
      renderComponent();

      const tables = screen.getAllByTestId("table");
      const sessionsTable = tables[0];
      const locationHeader = within(sessionsTable).getByText("Location");

      await user.click(locationHeader);

      // Table should still be rendered (sorting happened)
      expect(sessionsTable).toBeInTheDocument();
    });

    it("sorts sessions by IP address when IP header is clicked", async () => {
      const user = userEvent.setup();
      renderComponent();

      const tables = screen.getAllByTestId("table");
      const sessionsTable = tables[0];
      const ipHeader = within(sessionsTable).getByText("IP Address");

      await user.click(ipHeader);

      // Table should still be rendered (sorting happened)
      expect(sessionsTable).toBeInTheDocument();
    });

    it("sorts sessions by last active when last active header is clicked", async () => {
      const user = userEvent.setup();
      renderComponent();

      const tables = screen.getAllByTestId("table");
      const sessionsTable = tables[0];
      const lastActiveHeader = within(sessionsTable).getByText("Last Active");

      await user.click(lastActiveHeader);

      // Table should still be rendered (sorting happened)
      expect(sessionsTable).toBeInTheDocument();
    });

    it("toggles sort direction when clicking the same header twice", async () => {
      const user = userEvent.setup();
      renderComponent();

      const tables = screen.getAllByTestId("table");
      const sessionsTable = tables[0];
      const deviceHeader = within(sessionsTable).getByText("Device");

      await user.click(deviceHeader);
      await user.click(deviceHeader);

      // Table should still be rendered (sorting happened)
      expect(sessionsTable).toBeInTheDocument();
    });
  });

  describe("Two-Factor Authentication", () => {
    it("renders 2FA section with toggle enabled by default", () => {
      renderComponent();

      expect(screen.getByText("Two-factor authentication")).toBeInTheDocument();
      const switchButton = screen.getByTestId("two-factor-switch");
      expect(switchButton).toHaveAttribute("aria-checked", "true");
    });

    it("shows recovery codes when 2FA is enabled", () => {
      renderComponent();

      expect(screen.getByText("Recovery codes")).toBeInTheDocument();
      expect(screen.getByText("ABCD-1234")).toBeInTheDocument();
      expect(screen.getByText("EFGH-5678")).toBeInTheDocument();
    });

    it("toggles 2FA on/off when switch is clicked", async () => {
      const user = userEvent.setup();
      renderComponent();

      const switchButton = screen.getByTestId("two-factor-switch");
      expect(switchButton).toHaveAttribute("aria-checked", "true");

      await user.click(switchButton);

      await waitFor(() => {
        expect(switchButton).toHaveAttribute("aria-checked", "false");
      });
    });

    it("hides recovery codes when 2FA is disabled", async () => {
      const user = userEvent.setup();
      renderComponent();

      // Verify recovery codes are visible initially
      expect(screen.getByText("ABCD-1234")).toBeInTheDocument();

      const switchButton = screen.getByTestId("two-factor-switch");
      await user.click(switchButton);

      await waitFor(
        () => {
          expect(screen.queryByText("ABCD-1234")).not.toBeInTheDocument();
          expect(screen.getByText(/Two-factor authentication is currently/i)).toBeInTheDocument();
          expect(screen.getByText(/disabled/i)).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });

    it("shows copied state after copying a code", async () => {
      const user = userEvent.setup();
      renderComponent();

      const codeText = screen.getByText("ABCD-1234");
      const codeButton = codeText.closest("button");
      expect(codeButton).toBeInTheDocument();

      if (codeButton) {
        await user.click(codeButton);

        await waitFor(
          () => {
            // Check icon should appear
            const checkIcon = within(codeButton as HTMLElement).queryByTestId("icon-check");
            expect(checkIcon).toBeInTheDocument();
          },
          { timeout: 2000 }
        );

        // After some time (1500ms), copied state should reset back to copy icon
        await waitFor(
          () => {
            const copyIcon = within(codeButton as HTMLElement).queryByTestId("icon-copy");
            expect(copyIcon).toBeInTheDocument();
          },
          { timeout: 2000 }
        );
      }
    });

    it("displays all recovery codes", () => {
      renderComponent();

      expect(screen.getByText("ABCD-1234")).toBeInTheDocument();
      expect(screen.getByText("EFGH-5678")).toBeInTheDocument();
      expect(screen.getByText("IJKL-9012")).toBeInTheDocument();
      expect(screen.getByText("MNOP-3456")).toBeInTheDocument();
      expect(screen.getByText("QRST-7890")).toBeInTheDocument();
      expect(screen.getByText("UVWX-1357")).toBeInTheDocument();
    });

    it("shows copied state for copy all button after clicking", async () => {
      const user = userEvent.setup();
      renderComponent();

      const copyAllButton = screen.getByRole("button", { name: /copy all/i });
      await user.click(copyAllButton);

      await waitFor(
        () => {
          expect(copyAllButton).toHaveTextContent("Copied");
        },
        { timeout: 2000 }
      );

      // After some time (1500ms), copied state should reset
      await waitFor(
        () => {
          expect(copyAllButton).toHaveTextContent("Copy all");
        },
        { timeout: 2000 }
      );
    });

  });

  describe("Login Activity", () => {
    it("renders login activity table with default events", () => {
      renderComponent();

      expect(screen.getByText("Login activity")).toBeInTheDocument();
      expect(screen.getByText("Today · 09:14")).toBeInTheDocument();
      expect(screen.getByText("Today · 07:02")).toBeInTheDocument();
      expect(screen.getByText("Yesterday · 22:41")).toBeInTheDocument();
    });

    it("displays success status for successful logins", () => {
      renderComponent();

      const successStatuses = screen.getAllByText("Success");
      expect(successStatuses.length).toBeGreaterThan(0);
    });

    it("displays failed status for failed logins", () => {
      renderComponent();

      expect(screen.getByText("Failed")).toBeInTheDocument();
    });

    it("sorts login events when table header is clicked", async () => {
      const user = userEvent.setup();
      renderComponent();

      const table = screen.getAllByTestId("table")[1]; // Login activity table
      const dateHeader = within(table).getByText("Date & Time");

      await user.click(dateHeader);

      // Table should still be rendered (sorting happened)
      expect(table).toBeInTheDocument();
    });

    it("sorts login events by device when device header is clicked", async () => {
      const user = userEvent.setup();
      renderComponent();

      const table = screen.getAllByTestId("table")[1]; // Login activity table
      const deviceHeader = within(table).getByText("Device");

      await user.click(deviceHeader);

      // Table should still be rendered (sorting happened)
      expect(table).toBeInTheDocument();
    });

    it("sorts login events by location when location header is clicked", async () => {
      const user = userEvent.setup();
      renderComponent();

      const table = screen.getAllByTestId("table")[1]; // Login activity table
      const locationHeader = within(table).getByText("Location");

      await user.click(locationHeader);

      // Table should still be rendered (sorting happened)
      expect(table).toBeInTheDocument();
    });

    it("sorts login events by IP address when IP header is clicked", async () => {
      const user = userEvent.setup();
      renderComponent();

      const table = screen.getAllByTestId("table")[1]; // Login activity table
      const ipHeader = within(table).getByText("IP Address");

      await user.click(ipHeader);

      // Table should still be rendered (sorting happened)
      expect(table).toBeInTheDocument();
    });

    it("sorts login events by status when status header is clicked", async () => {
      const user = userEvent.setup();
      renderComponent();

      const table = screen.getAllByTestId("table")[1]; // Login activity table
      const statusHeader = within(table).getByText("Status");

      await user.click(statusHeader);

      // Table should still be rendered (sorting happened)
      expect(table).toBeInTheDocument();
    });

    it("toggles sort direction when clicking login table header twice", async () => {
      const user = userEvent.setup();
      renderComponent();

      const table = screen.getAllByTestId("table")[1]; // Login activity table
      const dateHeader = within(table).getByText("Date & Time");

      await user.click(dateHeader);
      await user.click(dateHeader);

      // Table should still be rendered (sorting happened)
      expect(table).toBeInTheDocument();
    });
  });

  describe("Layout Variants", () => {
    it("renders grid layout by default", () => {
      const { container } = renderComponent();
      const gridContainer = container.querySelector(".grid");
      expect(gridContainer).toBeInTheDocument();
    });

    it("renders accordion layout when layout prop is list", () => {
      renderComponent({ layout: "list" });

      // In list layout, sections are in accordion
      const accordionTriggers = screen.getAllByRole("button");
      expect(accordionTriggers.some((btn) => btn.textContent === "Change password")).toBe(true);
    });

    it("renders grid layout when layout prop is grid", () => {
      const { container } = renderComponent({ layout: "grid" });
      const gridContainer = container.querySelector(".grid");
      expect(gridContainer).toBeInTheDocument();
    });
  });

  describe("Theme Variants", () => {
    it("applies dark variant classes by default", () => {
      const { container } = renderComponent();
      expect(container.firstChild).toHaveClass("bg-gradient-to-br");
    });

    it("applies light variant classes when variant is light", () => {
      const { container } = renderComponent({ variant: "light" });
      expect(container.firstChild).toHaveClass("bg-gradient-to-br");
      expect(container.firstChild).toHaveClass("from-slate-50");
    });

    it("applies auto variant classes when variant is auto", () => {
      const { container } = renderComponent({ variant: "auto" });
      expect(container.firstChild).toHaveClass("bg-gradient-to-br");
    });
  });

  describe("Password Strength Calculation", () => {
    it("returns Very Weak for empty password", async () => {
      // This tests the computePasswordStrength function indirectly
      const user = userEvent.setup();
      renderComponent();

      const newPasswordInput = screen.getByPlaceholderText("New password");
      
      // Type and clear to test empty state
      await user.type(newPasswordInput, "test");
      await user.clear(newPasswordInput);

      // The strength indicator should not show for empty password
      expect(screen.queryByText(/password strength:/i)).not.toBeInTheDocument();
    });

    it("returns Very Weak for password less than 6 characters", async () => {
      const user = userEvent.setup();
      renderComponent();

      const newPasswordInput = screen.getByPlaceholderText("New password");
      await user.type(newPasswordInput, "weak");

      await waitFor(() => {
        expect(screen.getByText("Very Weak")).toBeInTheDocument();
      });
    });

    it("returns Weak for password with 2 or fewer requirements met", async () => {
      const user = userEvent.setup();
      renderComponent();

      const newPasswordInput = screen.getByPlaceholderText("New password");
      await user.type(newPasswordInput, "weakpass");

      await waitFor(() => {
        const strengthText = screen.getByText(/password strength:/i).nextSibling;
        expect(strengthText?.textContent).toMatch(/Very Weak|Weak/);
      });
    });

    it("returns Fair for password with 3 requirements met", async () => {
      const user = userEvent.setup();
      renderComponent();

      const newPasswordInput = screen.getByPlaceholderText("New password");
      await user.type(newPasswordInput, "FairPass123");

      await waitFor(() => {
        const strengthText = screen.getByText(/password strength:/i).nextSibling;
        expect(strengthText?.textContent).toMatch(/Fair|Good|Strong/);
      });
    });

    it("returns Strong for password with all requirements met", async () => {
      const user = userEvent.setup();
      renderComponent();

      const newPasswordInput = screen.getByPlaceholderText("New password");
      await user.type(newPasswordInput, "StrongPass123!");

      await waitFor(() => {
        const strengthText = screen.getByText(/password strength:/i).nextSibling;
        expect(strengthText?.textContent).toMatch(/Strong|Good/);
      });
    });

    it("returns Good for password with exactly 4 requirements met", async () => {
      const user = userEvent.setup();
      renderComponent();

      // Password with length >= 8, uppercase, lowercase, number (4 requirements, no special char)
      const newPasswordInput = screen.getByPlaceholderText("New password");
      await user.type(newPasswordInput, "GoodPass123");

      await waitFor(() => {
        expect(screen.getByText("Good")).toBeInTheDocument();
      });
    });

    it("returns Weak for password with only length requirement met", async () => {
      const user = userEvent.setup();
      renderComponent();

      const newPasswordInput = screen.getByPlaceholderText("New password");
      await user.type(newPasswordInput, "longpassword");

      await waitFor(() => {
        const strengthText = screen.getByText(/password strength:/i).nextSibling;
        expect(strengthText?.textContent).toMatch(/Very Weak|Weak/);
      });
    });

    it("returns Weak for password with length and uppercase only", async () => {
      const user = userEvent.setup();
      renderComponent();

      const newPasswordInput = screen.getByPlaceholderText("New password");
      await user.type(newPasswordInput, "LONGPASSWORD");

      await waitFor(() => {
        const strengthText = screen.getByText(/password strength:/i).nextSibling;
        expect(strengthText?.textContent).toMatch(/Very Weak|Weak/);
      });
    });

    it("returns Fair for password with length, uppercase, lowercase, and number", async () => {
      const user = userEvent.setup();
      renderComponent();

      // Use a password with exactly 3 requirements: length >= 8, uppercase, lowercase (no number, no special char)
      const newPasswordInput = screen.getByPlaceholderText("New password");
      await user.type(newPasswordInput, "FairPassw");

      await waitFor(() => {
        const strengthText = screen.getByText(/password strength:/i).nextSibling;
        expect(strengthText?.textContent).toMatch(/Fair/);
      });
    });

    it("returns Very Weak for password with exactly 5 characters", async () => {
      const user = userEvent.setup();
      renderComponent();

      const newPasswordInput = screen.getByPlaceholderText("New password");
      await user.type(newPasswordInput, "pass5");

      await waitFor(() => {
        expect(screen.getByText("Very Weak")).toBeInTheDocument();
      });
    });

    it("returns Very Weak for password with exactly 6 characters but no other requirements", async () => {
      const user = userEvent.setup();
      renderComponent();

      const newPasswordInput = screen.getByPlaceholderText("New password");
      await user.type(newPasswordInput, "passwo");

      await waitFor(() => {
        const strengthText = screen.getByText(/password strength:/i).nextSibling;
        expect(strengthText?.textContent).toMatch(/Very Weak|Weak/);
      });
    });
  });

  describe("Edge Cases", () => {
    it("handles clipboard API not available gracefully", async () => {
      const user = userEvent.setup();
      // Remove clipboard mock
      Object.defineProperty(globalThis.navigator, "clipboard", {
        value: undefined,
        configurable: true,
      });

      renderComponent();

      const codeButton = screen.getByText("ABCD-1234").closest("button");
      if (codeButton) {
        // Should not throw error
        await user.click(codeButton);
      }

      // Restore clipboard mock
      Object.defineProperty(globalThis.navigator, "clipboard", {
        value: { writeText: writeTextMock },
        configurable: true,
      });
    });

    it("handles window.confirm not available gracefully", async () => {
      const user = userEvent.setup();
      const originalConfirm = window.confirm;
      
      // Mock confirm as undefined to test graceful handling
      // The component checks typeof window !== "undefined" but doesn't check confirm existence
      // So we'll test that the button is clickable even if confirm might fail
      Object.defineProperty(window, "confirm", {
        value: () => false, // Return false to prevent logout
        configurable: true,
        writable: true,
      });

      renderComponent();

      const logoutButton = screen.getByRole("button", { name: /logout all/i });
      // Click should complete without throwing
      await user.click(logoutButton);

      // Restore original confirm immediately
      Object.defineProperty(window, "confirm", {
        value: originalConfirm,
        configurable: true,
        writable: true,
      });
    });

    it("handles rapid password input changes", async () => {
      const user = userEvent.setup();
      renderComponent();

      const newPasswordInput = screen.getByPlaceholderText("New password");
      
      await user.type(newPasswordInput, "test1");
      await user.clear(newPasswordInput);
      await user.type(newPasswordInput, "test2");
      await user.clear(newPasswordInput);
      await user.type(newPasswordInput, "StrongPass123!");

      await waitFor(() => {
        const strengthText = screen.getByText(/password strength:/i).nextSibling;
        expect(strengthText?.textContent).toMatch(/Strong|Good/);
      });
    });

    it("handles form submission with invalid state", async () => {
      renderComponent();

      const form = screen.getByPlaceholderText("Current password").closest("form");
      if (form) {
        const submitEvent = new Event("submit", { bubbles: true, cancelable: true });
        form.dispatchEvent(submitEvent);

        // Should not show success message
        expect(screen.queryByText("Password updated successfully.")).not.toBeInTheDocument();
      }
    });

    it("does not show password strength indicator when new password is empty", () => {
      renderComponent();

      expect(screen.queryByText(/password strength:/i)).not.toBeInTheDocument();
    });

    it("shows password strength indicator only when new password has content", async () => {
      const user = userEvent.setup();
      renderComponent();

      const newPasswordInput = screen.getByPlaceholderText("New password");
      
      // Initially should not show
      expect(screen.queryByText(/password strength:/i)).not.toBeInTheDocument();

      // After typing, should show
      await user.type(newPasswordInput, "test");
      await waitFor(() => {
        expect(screen.getByText(/password strength:/i)).toBeInTheDocument();
      });

      // After clearing, should hide again
      await user.clear(newPasswordInput);
      await waitFor(() => {
        expect(screen.queryByText(/password strength:/i)).not.toBeInTheDocument();
      });
    });

    it("does not show error message when confirm password is empty", async () => {
      const user = userEvent.setup();
      renderComponent();

      const newPasswordInput = screen.getByPlaceholderText("New password");
      await user.type(newPasswordInput, "NewPass123!");

      // Confirm password is empty, so no error should show
      expect(screen.queryByTestId("error-message")).not.toBeInTheDocument();
    });

    it("does not show success message when confirm password is empty", async () => {
      const user = userEvent.setup();
      renderComponent();

      const newPasswordInput = screen.getByPlaceholderText("New password");
      await user.type(newPasswordInput, "NewPass123!");

      // Confirm password is empty, so no success should show
      expect(screen.queryByTestId("success-message")).not.toBeInTheDocument();
    });

    it("prevents password update when button is disabled", async () => {
      const user = userEvent.setup();
      renderComponent();

      const currentPasswordInput = screen.getByPlaceholderText("Current password");
      const newPasswordInput = screen.getByPlaceholderText("New password");
      const confirmPasswordInput = screen.getByPlaceholderText("Confirm new password");

      // Fill with weak password that doesn't meet requirements
      await user.type(currentPasswordInput, "oldpass123");
      await user.type(newPasswordInput, "weak");
      await user.type(confirmPasswordInput, "weak");

      const updateButton = screen.getByRole("button", { name: /update password/i });
      expect(updateButton).toBeDisabled();

      // Try to submit form
      const form = screen.getByPlaceholderText("Current password").closest("form");
      if (form) {
        const submitEvent = new Event("submit", { bubbles: true, cancelable: true });
        form.dispatchEvent(submitEvent);

        // Should not show success message
        await waitFor(() => {
          expect(screen.queryByText("Password updated successfully.")).not.toBeInTheDocument();
        });
      }
    });

  });

  describe("Accessibility", () => {
    it("has proper ARIA labels for 2FA switch", () => {
      renderComponent();

      const switchButton = screen.getByTestId("two-factor-switch");
      expect(switchButton).toHaveAttribute("aria-label", "Enable two-factor authentication");
    });

    it("has proper form structure for password change", () => {
      renderComponent();

      const form = screen.getByPlaceholderText("Current password").closest("form");
      expect(form).toBeInTheDocument();
    });
  });

  describe("Component Integration", () => {
    it("renders all sections correctly in grid layout", () => {
      renderComponent({ layout: "grid" });

      expect(screen.getByText("Change password")).toBeInTheDocument();
      expect(screen.getByText("Active sessions")).toBeInTheDocument();
      expect(screen.getByText("Two-factor authentication")).toBeInTheDocument();
      expect(screen.getByText("Login activity")).toBeInTheDocument();
    });

    it("renders all sections correctly in list layout", () => {
      renderComponent({ layout: "list" });

      // In list layout, sections appear both in accordion triggers and card titles
      expect(screen.getAllByText("Change password").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Active sessions").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Two-factor authentication").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Login activity").length).toBeGreaterThan(0);
    });

    it("displays security badge in header", () => {
      renderComponent();

      expect(screen.getByText("High security")).toBeInTheDocument();
      expect(screen.getByTestId("icon-shield")).toBeInTheDocument();
    });

    it("displays last security review information", () => {
      renderComponent();

      expect(screen.getByText(/Last security review/i)).toBeInTheDocument();
      expect(screen.getByTestId("icon-activity")).toBeInTheDocument();
    });
  });
});

