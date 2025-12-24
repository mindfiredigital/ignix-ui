/**
 * Unit Tests for NotificationPage Component
 *
 * This test suite covers all functionality of the NotificationPage component including:
 * - Component rendering and initial state
 * - Notification channel toggles (Email, Push, SMS)
 * - Notification frequency selection (Real-time, Daily, Weekly)
 * - Notification type preferences (Marketing, Updates, Alerts)
 * - Save preferences functionality
 * - Unsubscribe from all functionality
 * - Layout variants (grid vs list)
 * - Theme variants (light, dark, auto)
 * - Status badge (Active/Inactive)
 * - Edge cases and boundary conditions
 */

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NotificationPage } from ".";

/**
 * Mock @ignix-ui/button component
 */
vi.mock("@ignix-ui/button", () => {
  return {
    Button: ({ children, onClick, disabled, ...props }: any) => {
      const { animationVariant, ...domProps } = props;
      // Suppress unused variable warnings for intentionally ignored props
      void animationVariant;
      
      return (
        <button {...domProps} onClick={onClick} disabled={disabled}>
          {children}
        </button>
      );
    },
  };
});

/**
 * Mock @ignix-ui/switch component
 */
vi.mock("@ignix-ui/switch", () => {
  return {
    Switch: ({ checked, onCheckedChange, "aria-label": ariaLabel, ...props }: any) => {
      const { variant, animation, glowEffect, className, ...domProps } = props;
      // Suppress unused variable warnings for intentionally ignored props
      void variant;
      void animation;
      void glowEffect;
      void className;
      // Generate test ID from aria-label
      const testId = ariaLabel
        ? `switch-toggle-${ariaLabel.toLowerCase().replace(/\s+/g, "-")}`
        : "switch-switch";
      return (
        <button
          {...domProps}
          role="switch"
          aria-checked={checked}
          aria-label={ariaLabel}
          onClick={() => onCheckedChange?.(!checked)}
          data-testid={testId}
        >
          {checked ? "ON" : "OFF"}
        </button>
      );
    },
  };
});

/**
 * Mock @ignix-ui/radio component (RadioGroup)
 */
vi.mock("@ignix-ui/radio", () => {
  return {
    RadioGroup: ({ name, options, value, onChange, ...props }: any) => {
      const { variant, size, labelPosition, checkedVariant, animationVariant, ...domProps } = props;
      // Suppress unused variable warnings for intentionally ignored props
      void variant;
      void size;
      void labelPosition;
      void checkedVariant;
      void animationVariant;
      return (
        <div {...domProps} data-testid="radio-group" role="radiogroup">
          {options?.map((option: any) => (
            <label key={option.value} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={(e) => onChange?.(e.target.value)}
                data-testid={`radio-${option.value}`}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
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
  Bell: () => <span data-testid="icon-bell" />,
  Mail: () => <span data-testid="icon-mail" />,
  Smartphone: () => <span data-testid="icon-smartphone" />,
  MessageSquare: () => <span data-testid="icon-message-square" />,
  Settings: () => <span data-testid="icon-settings" />,
  CheckCircle2: () => <span data-testid="icon-check" />,
  AlertTriangle: () => <span data-testid="icon-alert-triangle" />,
  Save: () => <span data-testid="icon-save" />,
  X: () => <span data-testid="icon-x" />,
  Activity: () => <span data-testid="icon-activity" />,
}));

describe("NotificationPage", () => {
  beforeEach(() => {
    // Use real timers by default - userEvent works better with real timers
    vi.useRealTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    // Ensure we're back to real timers after each test
    vi.useRealTimers();
  });

  const renderComponent = (props: Partial<React.ComponentProps<typeof NotificationPage>> = {}) =>
    render(<NotificationPage {...props} />);

  describe("Rendering", () => {
    it("renders with default props", () => {
      renderComponent();

      expect(screen.getByText("Notifications")).toBeInTheDocument();
      expect(
        screen.getByText("Manage your notification preferences and stay informed about what matters to you.")
      ).toBeInTheDocument();
      expect(screen.getByText("Active")).toBeInTheDocument();
    });

    it("renders with custom title and description", () => {
      renderComponent({
        title: "Notification Settings",
        description: "Custom notification description",
      });

      expect(screen.getByText("Notification Settings")).toBeInTheDocument();
      expect(screen.getByText("Custom notification description")).toBeInTheDocument();
    });

    it("renders all main sections in grid layout", () => {
      renderComponent({ layout: "grid" });

      expect(screen.getByText("Notification channels")).toBeInTheDocument();
      expect(screen.getByText("Notification frequency")).toBeInTheDocument();
      expect(screen.getByText("Notification types")).toBeInTheDocument();
      expect(screen.getByText("Unsubscribe from all")).toBeInTheDocument();
    });

    it("renders all sections in accordion layout when layout is list", () => {
      renderComponent({ layout: "list" });

      // In list layout, sections appear both in accordion triggers and card titles
      expect(screen.getAllByText("Notification channels").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Notification frequency").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Notification types").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Unsubscribe from all").length).toBeGreaterThan(0);
    });

    it("applies correct variant classes", () => {
      const { container } = renderComponent({ variant: "dark" });
      expect(container.firstChild).toHaveClass("bg-gradient-to-br");
    });
  });

  describe("Notification Channels", () => {
    it("renders all three notification channels", () => {
      renderComponent();

      expect(screen.getByText("Email notifications")).toBeInTheDocument();
      expect(screen.getByText("Push notifications")).toBeInTheDocument();
      expect(screen.getByText("SMS notifications")).toBeInTheDocument();
    });

    it("renders email channel with correct initial state (enabled)", () => {
      renderComponent();

      const emailSwitch = screen.getByRole("switch", { name: /toggle email notifications/i });
      expect(emailSwitch).toHaveAttribute("aria-checked", "true");
    });

    it("renders push channel with correct initial state (enabled)", () => {
      renderComponent();

      const pushSwitch = screen.getByRole("switch", { name: /toggle push notifications/i });
      expect(pushSwitch).toHaveAttribute("aria-checked", "true");
    });

    it("renders SMS channel with correct initial state (disabled)", () => {
      renderComponent();

      const smsSwitch = screen.getByRole("switch", { name: /toggle sms notifications/i });
      expect(smsSwitch).toHaveAttribute("aria-checked", "false");
    });

    it("toggles email channel when switch is clicked", async () => {
      const user = userEvent.setup();
      renderComponent();

      const emailSwitch = screen.getByRole("switch", { name: /toggle email notifications/i });
      expect(emailSwitch).toHaveAttribute("aria-checked", "true");

      await user.click(emailSwitch);

      await waitFor(() => {
        expect(emailSwitch).toHaveAttribute("aria-checked", "false");
      });
    });

    it("toggles push channel when switch is clicked", async () => {
      const user = userEvent.setup();
      renderComponent();

      const pushSwitch = screen.getByRole("switch", { name: /toggle push notifications/i });
      expect(pushSwitch).toHaveAttribute("aria-checked", "true");

      await user.click(pushSwitch);

      await waitFor(() => {
        expect(pushSwitch).toHaveAttribute("aria-checked", "false");
      });
    });

    it("toggles SMS channel when switch is clicked", async () => {
      const user = userEvent.setup();
      renderComponent();

      const smsSwitch = screen.getByRole("switch", { name: /toggle sms notifications/i });
      expect(smsSwitch).toHaveAttribute("aria-checked", "false");

      await user.click(smsSwitch);

      await waitFor(() => {
        expect(smsSwitch).toHaveAttribute("aria-checked", "true");
      });
    });

    it("updates status badge to Inactive when all channels are disabled", async () => {
      const user = userEvent.setup();
      renderComponent();

      // Initially Active
      expect(screen.getByText("Active")).toBeInTheDocument();

      // Disable all channels
      const emailSwitch = screen.getByRole("switch", { name: /toggle email notifications/i });
      const pushSwitch = screen.getByRole("switch", { name: /toggle push notifications/i });

      await user.click(emailSwitch);
      await user.click(pushSwitch);

      await waitFor(() => {
        expect(screen.getByText("Inactive")).toBeInTheDocument();
      });
    });
  });

  describe("Notification Frequency", () => {
    it("renders frequency selection with all three options", () => {
      renderComponent();

      expect(screen.getByText("Real-time")).toBeInTheDocument();
      expect(screen.getByText("Daily digest")).toBeInTheDocument();
      expect(screen.getByText("Weekly summary")).toBeInTheDocument();
    });

    it("has realtime selected by default", () => {
      renderComponent();

      const realtimeRadio = screen.getByTestId("radio-realtime");
      expect(realtimeRadio).toBeChecked();
    });

    it("shows correct description for realtime frequency", () => {
      renderComponent();

      expect(screen.getByText("You'll receive notifications immediately as they happen.")).toBeInTheDocument();
    });

    it("changes frequency to daily when selected", async () => {
      const user = userEvent.setup();
      renderComponent();

      const dailyRadio = screen.getByTestId("radio-daily");
      await user.click(dailyRadio);

      await waitFor(() => {
        expect(dailyRadio).toBeChecked();
        expect(screen.getByText("You'll receive a daily summary of all notifications.")).toBeInTheDocument();
      });
    });

    it("changes frequency to weekly when selected", async () => {
      const user = userEvent.setup();
      renderComponent();

      const weeklyRadio = screen.getByTestId("radio-weekly");
      await user.click(weeklyRadio);

      await waitFor(() => {
        expect(weeklyRadio).toBeChecked();
        expect(screen.getByText("You'll receive a weekly summary every Monday.")).toBeInTheDocument();
      });
    });

    it("updates description when frequency changes", async () => {
      const user = userEvent.setup();
      renderComponent();

      // Initially realtime
      expect(screen.getByText("You'll receive notifications immediately as they happen.")).toBeInTheDocument();

      // Change to daily
      const dailyRadio = screen.getByTestId("radio-daily");
      await user.click(dailyRadio);

      await waitFor(() => {
        expect(screen.queryByText("You'll receive notifications immediately as they happen.")).not.toBeInTheDocument();
        expect(screen.getByText("You'll receive a daily summary of all notifications.")).toBeInTheDocument();
      });
    });
  });

  describe("Notification Types", () => {
    it("renders all three notification types", () => {
      renderComponent();

      expect(screen.getByText("Marketing")).toBeInTheDocument();
      expect(screen.getByText("Updates")).toBeInTheDocument();
      expect(screen.getByText("Alerts")).toBeInTheDocument();
    });

    it("renders marketing type with correct initial state (enabled)", () => {
      renderComponent();

      const marketingSwitch = screen.getByRole("switch", { name: /toggle marketing notifications/i });
      expect(marketingSwitch).toHaveAttribute("aria-checked", "true");
    });

    it("renders updates type with correct initial state (enabled)", () => {
      renderComponent();

      const updatesSwitch = screen.getByRole("switch", { name: /toggle update notifications/i });
      expect(updatesSwitch).toHaveAttribute("aria-checked", "true");
    });

    it("renders alerts type with correct initial state (enabled)", () => {
      renderComponent();

      const alertsSwitch = screen.getByRole("switch", { name: /toggle alert notifications/i });
      expect(alertsSwitch).toHaveAttribute("aria-checked", "true");
    });

    it("toggles marketing type when switch is clicked", async () => {
      const user = userEvent.setup();
      renderComponent();

      const marketingSwitch = screen.getByRole("switch", { name: /toggle marketing notifications/i });
      expect(marketingSwitch).toHaveAttribute("aria-checked", "true");

      await user.click(marketingSwitch);

      await waitFor(() => {
        expect(marketingSwitch).toHaveAttribute("aria-checked", "false");
      });
    });

    it("toggles updates type when switch is clicked", async () => {
      const user = userEvent.setup();
      renderComponent();

      const updatesSwitch = screen.getByRole("switch", { name: /toggle update notifications/i });
      expect(updatesSwitch).toHaveAttribute("aria-checked", "true");

      await user.click(updatesSwitch);

      await waitFor(() => {
        expect(updatesSwitch).toHaveAttribute("aria-checked", "false");
      });
    });

    it("toggles alerts type when switch is clicked", async () => {
      const user = userEvent.setup();
      renderComponent();

      const alertsSwitch = screen.getByRole("switch", { name: /toggle alert notifications/i });
      expect(alertsSwitch).toHaveAttribute("aria-checked", "true");

      await user.click(alertsSwitch);

      await waitFor(() => {
        expect(alertsSwitch).toHaveAttribute("aria-checked", "false");
      });
    });
  });

  describe("Save Preferences", () => {
    it("renders save preferences button", () => {
      renderComponent();

      expect(screen.getByRole("button", { name: /save preferences/i })).toBeInTheDocument();
    });

    it("shows saving state when save button is clicked", async () => {
      const user = userEvent.setup();
      renderComponent();

      const saveButton = screen.getByRole("button", { name: /save preferences/i });
      await user.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText("Saving…")).toBeInTheDocument();
      });
    });

    it("shows saved state after save completes", async () => {
      const user = userEvent.setup();
      renderComponent();

      const saveButton = screen.getByRole("button", { name: /save preferences/i });
      await user.click(saveButton);

      // Wait for saving state
      await waitFor(() => {
        expect(screen.getByText("Saving…")).toBeInTheDocument();
      });

      // Wait for saved state (after 1200ms)
      await waitFor(
        () => {
          expect(screen.getByText("Saved")).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });

    it("disables save button while saving", async () => {
      const user = userEvent.setup();
      renderComponent();

      const saveButton = screen.getByRole("button", { name: /save preferences/i });
      await user.click(saveButton);

      await waitFor(() => {
        expect(saveButton).toBeDisabled();
      });
    });

    it("disables save button after saved", async () => {
      const user = userEvent.setup();
      renderComponent();

      const saveButton = screen.getByRole("button", { name: /save preferences/i });
      await user.click(saveButton);

      // Wait for saved state
      await waitFor(
        () => {
          expect(screen.getByText("Saved")).toBeInTheDocument();
          expect(saveButton).toBeDisabled();
        },
        { timeout: 2000 }
      );
    });

  });

  describe("Unsubscribe from All", () => {
    it("renders unsubscribe button", () => {
      renderComponent();

      expect(screen.getByRole("button", { name: /unsubscribe/i })).toBeInTheDocument();
    });

    it("shows confirmation dialog when unsubscribe button is clicked", async () => {
      const user = userEvent.setup();
      renderComponent();

      const unsubscribeButton = screen.getByRole("button", { name: /unsubscribe/i });
      await user.click(unsubscribeButton);

      await waitFor(() => {
        expect(screen.getByText(/Are you sure you want to unsubscribe/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /confirm unsubscribe/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
      });
    });

    it("cancels unsubscribe when cancel button is clicked", async () => {
      const user = userEvent.setup();
      renderComponent();

      // Open confirmation
      const unsubscribeButton = screen.getByRole("button", { name: /unsubscribe/i });
      await user.click(unsubscribeButton);

      await waitFor(() => {
        expect(screen.getByText(/Are you sure you want to unsubscribe/i)).toBeInTheDocument();
      });

      // Cancel
      const cancelButton = screen.getByRole("button", { name: /cancel/i });
      await user.click(cancelButton);

      await waitFor(() => {
        expect(screen.queryByText(/Are you sure you want to unsubscribe/i)).not.toBeInTheDocument();
        expect(screen.getByRole("button", { name: /unsubscribe/i })).toBeInTheDocument();
      });
    });

    it("unsubscribes from all when confirm button is clicked", async () => {
      const user = userEvent.setup();
      renderComponent();

      // Initially all channels are enabled
      const emailSwitch = screen.getByRole("switch", { name: /toggle email notifications/i });
      const pushSwitch = screen.getByRole("switch", { name: /toggle push notifications/i });
      expect(emailSwitch).toHaveAttribute("aria-checked", "true");
      expect(pushSwitch).toHaveAttribute("aria-checked", "true");

      // Open confirmation
      const unsubscribeButton = screen.getByRole("button", { name: /unsubscribe/i });
      await user.click(unsubscribeButton);

      await waitFor(() => {
        expect(screen.getByText(/Are you sure you want to unsubscribe/i)).toBeInTheDocument();
      });

      // Confirm
      const confirmButton = screen.getByRole("button", { name: /confirm unsubscribe/i });
      await user.click(confirmButton);

      await waitFor(() => {
        // All channels should be disabled
        expect(emailSwitch).toHaveAttribute("aria-checked", "false");
        expect(pushSwitch).toHaveAttribute("aria-checked", "false");
        // Status should be Inactive
        expect(screen.getByText("Inactive")).toBeInTheDocument();
        // Frequency should be weekly
        const weeklyRadio = screen.getByTestId("radio-weekly");
        expect(weeklyRadio).toBeChecked();
      });
    });

    it("disables all notification types when unsubscribing", async () => {
      const user = userEvent.setup();
      renderComponent();

      // Initially all types are enabled
      const marketingSwitch = screen.getByRole("switch", { name: /toggle marketing notifications/i });
      const updatesSwitch = screen.getByRole("switch", { name: /toggle update notifications/i });
      const alertsSwitch = screen.getByRole("switch", { name: /toggle alert notifications/i });
      expect(marketingSwitch).toHaveAttribute("aria-checked", "true");
      expect(updatesSwitch).toHaveAttribute("aria-checked", "true");
      expect(alertsSwitch).toHaveAttribute("aria-checked", "true");

      // Unsubscribe
      const unsubscribeButton = screen.getByRole("button", { name: /unsubscribe/i });
      await user.click(unsubscribeButton);

      const confirmButton = screen.getByRole("button", { name: /confirm unsubscribe/i });
      await user.click(confirmButton);

      await waitFor(() => {
        // All types should be disabled
        expect(marketingSwitch).toHaveAttribute("aria-checked", "false");
        expect(updatesSwitch).toHaveAttribute("aria-checked", "false");
        expect(alertsSwitch).toHaveAttribute("aria-checked", "false");
      });
    });
  });

  describe("Status Badge", () => {
    it("shows Active badge when at least one channel is enabled", () => {
      renderComponent();

      expect(screen.getByText("Active")).toBeInTheDocument();
    });

    it("shows Inactive badge when all channels are disabled", async () => {
      const user = userEvent.setup();
      renderComponent();

      // Disable all channels
      const emailSwitch = screen.getByRole("switch", { name: /toggle email notifications/i });
      const pushSwitch = screen.getByRole("switch", { name: /toggle push notifications/i });

      await user.click(emailSwitch);
      await user.click(pushSwitch);

      await waitFor(() => {
        expect(screen.getByText("Inactive")).toBeInTheDocument();
      });
    });

    it("updates badge from Inactive to Active when channel is enabled", async () => {
      const user = userEvent.setup();
      renderComponent();

      // Disable all channels
      const emailSwitch = screen.getByRole("switch", { name: /toggle email notifications/i });
      const pushSwitch = screen.getByRole("switch", { name: /toggle push notifications/i });

      await user.click(emailSwitch);
      await user.click(pushSwitch);

      await waitFor(() => {
        expect(screen.getByText("Inactive")).toBeInTheDocument();
      });

      // Enable one channel
      await user.click(emailSwitch);

      await waitFor(() => {
        expect(screen.getByText("Active")).toBeInTheDocument();
      });
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
      expect(accordionTriggers.some((btn) => btn.textContent === "Notification channels")).toBe(true);
    });

    it("renders grid layout when layout prop is grid", () => {
      const { container } = renderComponent({ layout: "grid" });
      const gridContainer = container.querySelector(".grid");
      expect(gridContainer).toBeInTheDocument();
    });
  });

  describe("Theme Variants", () => {
    it("applies auto variant classes by default", () => {
      const { container } = renderComponent();
      expect(container.firstChild).toHaveClass("bg-gradient-to-br");
    });

    it("applies light variant classes when variant is light", () => {
      const { container } = renderComponent({ variant: "light" });
      expect(container.firstChild).toHaveClass("bg-gradient-to-br");
      expect(container.firstChild).toHaveClass("from-slate-50");
    });

    it("applies dark variant classes when variant is dark", () => {
      const { container } = renderComponent({ variant: "dark" });
      expect(container.firstChild).toHaveClass("bg-gradient-to-br");
      expect(container.firstChild).toHaveClass("from-[#020617]");
    });

    it("applies auto variant classes when variant is auto", () => {
      const { container } = renderComponent({ variant: "auto" });
      expect(container.firstChild).toHaveClass("bg-gradient-to-br");
    });
  });

  describe("Edge Cases", () => {
    it("handles rapid channel toggles", async () => {
      const user = userEvent.setup();
      renderComponent();

      const emailSwitch = screen.getByRole("switch", { name: /toggle email notifications/i });
      const pushSwitch = screen.getByRole("switch", { name: /toggle push notifications/i });

      // Rapidly toggle channels
      await user.click(emailSwitch);
      await user.click(pushSwitch);
      await user.click(emailSwitch);
      await user.click(pushSwitch);

      // Should still be functional
      await waitFor(() => {
        expect(emailSwitch).toBeInTheDocument();
        expect(pushSwitch).toBeInTheDocument();
      });
    });

    it("handles rapid frequency changes", async () => {
      const user = userEvent.setup();
      renderComponent();

      const realtimeRadio = screen.getByTestId("radio-realtime");
      const dailyRadio = screen.getByTestId("radio-daily");
      const weeklyRadio = screen.getByTestId("radio-weekly");

      // Rapidly change frequency
      await user.click(dailyRadio);
      await user.click(weeklyRadio);
      await user.click(realtimeRadio);

      // Should end up on realtime
      await waitFor(() => {
        expect(realtimeRadio).toBeChecked();
      });
    });

    it("handles rapid type toggles", async () => {
      const user = userEvent.setup();
      renderComponent();

      const marketingSwitch = screen.getByRole("switch", { name: /toggle marketing notifications/i });
      const updatesSwitch = screen.getByRole("switch", { name: /toggle update notifications/i });

      // Rapidly toggle types
      await user.click(marketingSwitch);
      await user.click(updatesSwitch);
      await user.click(marketingSwitch);
      await user.click(updatesSwitch);

      // Should still be functional
      await waitFor(() => {
        expect(marketingSwitch).toBeInTheDocument();
        expect(updatesSwitch).toBeInTheDocument();
      });
    });

    it("handles save button click when already saving", async () => {
      const user = userEvent.setup();
      renderComponent();

      const saveButton = screen.getByRole("button", { name: /save preferences/i });
      
      // Click save button
      await user.click(saveButton);

      // Try to click again while saving
      await waitFor(() => {
        expect(saveButton).toBeDisabled();
      });

      // Button should be disabled, so clicking again should not cause issues
      expect(saveButton).toBeDisabled();
    });

    it("renders correctly in both grid and list layouts", () => {
      // Test grid layout
      const { rerender } = renderComponent({ layout: "grid" });
      expect(screen.getByText("Notification channels")).toBeInTheDocument();
      expect(screen.getByRole("switch", { name: /toggle email notifications/i })).toBeInTheDocument();

      // Test list layout - content is in accordion, so we check for accordion triggers
      rerender(<NotificationPage layout="list" />);
      // In list layout, sections appear in accordion triggers
      const accordionTriggers = screen.getAllByRole("button");
      expect(accordionTriggers.some((btn) => btn.textContent?.includes("Notification channels"))).toBe(true);
    });
  });

  describe("Component Integration", () => {
    it("renders all sections correctly in grid layout", () => {
      renderComponent({ layout: "grid" });

      expect(screen.getByText("Notification channels")).toBeInTheDocument();
      expect(screen.getByText("Notification frequency")).toBeInTheDocument();
      expect(screen.getByText("Notification types")).toBeInTheDocument();
      expect(screen.getByText("Unsubscribe from all")).toBeInTheDocument();
    });

    it("renders all sections correctly in list layout", () => {
      renderComponent({ layout: "list" });

      // In list layout, sections appear both in accordion triggers and card titles
      expect(screen.getAllByText("Notification channels").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Notification frequency").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Notification types").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Unsubscribe from all").length).toBeGreaterThan(0);
    });

    it("displays notification badge in header", () => {
      renderComponent();

      expect(screen.getByText("Active")).toBeInTheDocument();
      // There are multiple bell icons, so use getAllByTestId
      expect(screen.getAllByTestId("icon-bell").length).toBeGreaterThan(0);
    });

    it("displays save button with icon", () => {
      renderComponent();

      const saveButton = screen.getByRole("button", { name: /save preferences/i });
      expect(saveButton).toBeInTheDocument();
      expect(screen.getByTestId("icon-save")).toBeInTheDocument();
    });
  });
});

