/**
 * @file notification-center.test.tsx
 * @description Unit tests for the Notification Center registry template and
 * its composable building blocks (trigger, content, header, filters, list, footer).
 */

import React, { useCallback, useState } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import {
  NotificationCenter,
  NotificationCenterPopup,
  type NotificationCenterFilterState,
  type NotificationItem,
} from ".";

/* -------------------------------------------------------------------------- */
/*                                Mock Ignix UI                               */
/* -------------------------------------------------------------------------- */

vi.mock("@ignix-ui/dropdown", () => {
  const Dropdown = ({
    trigger,
    children,
  }: {
    trigger: React.ReactElement<{ onClick?: React.MouseEventHandler }>;
    children: React.ReactNode;
  }) => {
    const [menuOpen, setMenuOpen] = React.useState(false);
    const toggleMenu = () => setMenuOpen((prev) => !prev);

    const triggerElement = React.isValidElement(trigger)
      ? React.cloneElement(trigger, {
          onClick: (event: React.MouseEvent) => {
            trigger.props.onClick?.(event);
            toggleMenu();
          },
        })
      : trigger;

    return (
      <div data-testid="item-dropdown">
        {triggerElement}
        {menuOpen ? <div data-testid="dropdown-menu">{children}</div> : null}
      </div>
    );
  };

  const DropdownItem = ({
    children,
    onSelect,
  }: {
    children: React.ReactNode;
    onSelect?: () => void;
  }) => (
    <button type="button" onClick={() => onSelect?.()}>
      {children}
    </button>
  );

  const DropdownLabel = ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  );

  const DropdownSeparator = () => <hr />;

  return { Dropdown, DropdownItem, DropdownLabel, DropdownSeparator };
});

/* -------------------------------------------------------------------------- */
/*                              Browser API mocks                             */
/* -------------------------------------------------------------------------- */

beforeEach(() => {
  vi.clearAllMocks();
  vi.useRealTimers();
});

/* -------------------------------------------------------------------------- */
/*                                   Fixtures                                 */
/* -------------------------------------------------------------------------- */

function makeNotification(
  partial: Partial<NotificationItem> & Pick<NotificationItem, "id" | "title">,
): NotificationItem {
  const now = new Date();
  return {
    id: partial.id,
    type: partial.type ?? "user",
    priority: partial.priority ?? "medium",
    title: partial.title,
    message: partial.message ?? `${partial.title} message`,
    read: partial.read ?? false,
    createdAt: partial.createdAt ?? new Date(now.getTime() - 30 * 60_000),
    source: partial.source,
    contextLabel: partial.contextLabel,
    flagged: partial.flagged,
  };
}

const NOTIFICATIONS: NotificationItem[] = [
  makeNotification({
    id: "n-product",
    type: "product",
    priority: "medium",
    title: "Inventory threshold reached",
    message: "SKU dropped below safety stock.",
    source: "Product Alerts",
    read: false,
    createdAt: new Date(Date.now() - 120 * 60_000),
  }),
  makeNotification({
    id: "n-system",
    type: "system",
    priority: "high",
    title: "Scheduled maintenance",
    message: "Maintenance Sunday 02:00 UTC.",
    source: "System Notices",
    read: false,
    createdAt: new Date(Date.now() - 15 * 60_000),
  }),
  makeNotification({
    id: "n-user-read",
    type: "user",
    priority: "low",
    title: "Policy acknowledgment due",
    message: "Complete security training.",
    source: "User Updates",
    read: true,
    flagged: false,
    createdAt: new Date(Date.now() - 5 * 60_000),
  }),
];

function renderPopup(
  props: Partial<React.ComponentProps<typeof NotificationCenterPopup>> = {},
) {
  return render(
    <NotificationCenterPopup
      notifications={NOTIFICATIONS}
      open={true}
      {...props}
    />,
  );
}

function renderComposable(
  props: Partial<React.ComponentProps<typeof NotificationCenter>> & {
    open?: boolean;
  } = {},
) {
  const { open = true, ...rootProps } = props;
  return render(
    <NotificationCenter notifications={NOTIFICATIONS} open={open} {...rootProps}>
      <NotificationCenter.Trigger />
      <NotificationCenter.Content>
        <NotificationCenter.Header />
        <NotificationCenter.Filters />
        <NotificationCenter.List />
        <NotificationCenter.Footer />
      </NotificationCenter.Content>
    </NotificationCenter>,
  );
}

/**
 * Stateful harness for interactions that update notification data in tests.
 */
function InteractiveNotificationCenter({
  initialNotifications = NOTIFICATIONS,
  initialOpen = true,
  onMarkAsRead: onMarkAsReadProp,
  onMarkAllAsRead: onMarkAllAsReadProp,
  onToggleFlag: onToggleFlagProp,
  onSeeAll: onSeeAllProp,
  onSettings: onSettingsProp,
  onOpenChange: onOpenChangeProp,
  onFilterChange: onFilterChangeProp,
  filterState: controlledFilter,
}: {
  initialNotifications?: NotificationItem[];
  initialOpen?: boolean;
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onToggleFlag?: (id: string) => void;
  onSeeAll?: () => void;
  onSettings?: () => void;
  onOpenChange?: (open: boolean) => void;
  onFilterChange?: (next: NotificationCenterFilterState) => void;
  filterState?: NotificationCenterFilterState;
}) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [open, setOpen] = useState(initialOpen);
  const [filter, setFilter] = useState<NotificationCenterFilterState>({
    type: null,
    priority: null,
  });

  const handleMarkAsRead = useCallback(
    (id: string) => {
      onMarkAsReadProp?.(id);
      setNotifications((prev) =>
        prev.map((item) => (item.id === id ? { ...item, read: true } : item)),
      );
    },
    [onMarkAsReadProp],
  );

  const handleMarkAllAsRead = useCallback(() => {
    onMarkAllAsReadProp?.();
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
  }, [onMarkAllAsReadProp]);

  const handleToggleFlag = useCallback(
    (id: string) => {
      onToggleFlagProp?.(id);
      setNotifications((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, flagged: !item.flagged } : item,
        ),
      );
    },
    [onToggleFlagProp],
  );

  return (
    <NotificationCenterPopup
      notifications={notifications}
      open={open}
      onOpenChange={(next) => {
        onOpenChangeProp?.(next);
        setOpen(next);
      }}
      filterState={controlledFilter ?? filter}
      onFilterChange={(next) => {
        onFilterChangeProp?.(next);
        if (controlledFilter === undefined) setFilter(next);
      }}
      onMarkAsRead={handleMarkAsRead}
      onMarkAllAsRead={handleMarkAllAsRead}
      onToggleFlag={handleToggleFlag}
      onSeeAll={onSeeAllProp}
      onSettings={onSettingsProp}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*                                 Test Suite                                 */
/* -------------------------------------------------------------------------- */

describe("NotificationCenterPopup", () => {
  it("renders bell trigger with unread badge count", () => {
    renderPopup();

    expect(
      screen.getByRole("button", { name: /notifications, 2 unread/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("renders panel UI when open (header, list, footer)", () => {
    renderPopup();

    expect(screen.getByRole("dialog", { name: /notifications/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /notifications/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /mark all as read/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /settings/i })).toBeInTheDocument();
    expect(screen.getByRole("list", { name: /notification list/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /see all notifications/i })).toBeInTheDocument();
  });

  it("renders custom title and footer label", () => {
    renderPopup({
      title: "Inbox",
      seeAllLabel: "View all",
    });

    expect(screen.getByRole("heading", { name: /inbox/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /view all/i })).toBeInTheDocument();
  });

  it("renders all notification rows with titles, messages, and metadata", () => {
    renderPopup();

    expect(screen.getByText("Inventory threshold reached")).toBeInTheDocument();
    expect(screen.getByText("Scheduled maintenance")).toBeInTheDocument();
    expect(screen.getByText("Policy acknowledgment due")).toBeInTheDocument();
    expect(screen.getByText("Product Alerts")).toBeInTheDocument();
    expect(screen.getByText("System Notices")).toBeInTheDocument();
    expect(screen.getAllByRole("time").length).toBeGreaterThanOrEqual(3);
  });

  it("sorts notifications newest-first in the list", () => {
    const { container } = renderPopup();
    const rows = container.querySelectorAll("[data-testid^='notification-']");
    expect(rows[0]).toHaveAttribute("data-testid", "notification-n-user-read");
    expect(rows[1]).toHaveAttribute("data-testid", "notification-n-system");
    expect(rows[2]).toHaveAttribute("data-testid", "notification-n-product");
  });

  it("does not render panel when closed", async () => {
    const user = userEvent.setup();
    renderPopup({ open: false });

    expect(screen.queryByRole("dialog", { name: /notifications/i })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /notifications/i }));
    expect(screen.queryByRole("dialog", { name: /notifications/i })).not.toBeInTheDocument();
  });

  it("toggles panel open state via trigger when uncontrolled", async () => {
    const user = userEvent.setup();
    render(<NotificationCenterPopup notifications={NOTIFICATIONS} />);

    const trigger = screen.getByRole("button", { name: /notifications/i });
    expect(screen.queryByRole("dialog", { name: /notifications/i })).not.toBeInTheDocument();

    await user.click(trigger);
    expect(screen.getByRole("dialog", { name: /notifications/i })).toBeInTheDocument();
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    await user.click(trigger);
    expect(screen.queryByRole("dialog", { name: /notifications/i })).not.toBeInTheDocument();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("shows empty state when there are no notifications", () => {
    renderPopup({ notifications: [] });

    expect(screen.getByRole("status")).toHaveTextContent(/no notifications/i);
    expect(screen.getByText(/you are all caught up/i)).toBeInTheDocument();
  });

  it("disables mark all as read when every notification is read", () => {
    const allRead = NOTIFICATIONS.map((n) => ({ ...n, read: true }));
    renderPopup({ notifications: allRead });

    expect(screen.getByRole("button", { name: /mark all as read/i })).toBeDisabled();
    expect(
      screen.getByRole("button", { name: /^notifications$/i }),
    ).toBeInTheDocument();
  });
});

describe("Handlers and interactions", () => {
  it("calls onMarkAsRead when clicking an unread row", async () => {
    const user = userEvent.setup();
    const onMarkAsRead = vi.fn();
    renderPopup({ onMarkAsRead });

    await user.click(screen.getByTestId("notification-n-product"));
    expect(onMarkAsRead).toHaveBeenCalledWith("n-product");
  });

  it("does not call onMarkAsRead when clicking an already read row", async () => {
    const user = userEvent.setup();
    const onMarkAsRead = vi.fn();
    renderPopup({ onMarkAsRead });

    await user.click(screen.getByTestId("notification-n-user-read"));
    expect(onMarkAsRead).not.toHaveBeenCalled();
  });

  it("marks unread row as read on Enter key", async () => {
    const onMarkAsRead = vi.fn();
    renderPopup({ onMarkAsRead });

    const row = screen.getByTestId("notification-n-system");
    row.focus();
    fireEvent.keyDown(row, { key: "Enter" });

    expect(onMarkAsRead).toHaveBeenCalledWith("n-system");
  });

  it("calls onMarkAllAsRead from header action", async () => {
    const user = userEvent.setup();
    const onMarkAllAsRead = vi.fn();
    renderPopup({ onMarkAllAsRead });

    await user.click(screen.getByRole("button", { name: /mark all as read/i }));
    expect(onMarkAllAsRead).toHaveBeenCalledTimes(1);
  });

  it("calls onToggleFlag when flag button is clicked", async () => {
    const user = userEvent.setup();
    const onToggleFlag = vi.fn();
    renderPopup({ onToggleFlag });

    const row = screen.getByTestId("notification-n-product");
    await user.click(within(row).getByRole("button", { name: /flag notification/i }));
    expect(onToggleFlag).toHaveBeenCalledWith("n-product");
  });

  it("calls onSeeAll and closes panel from footer", async () => {
    const user = userEvent.setup();
    const onSeeAll = vi.fn();
    const onOpenChange = vi.fn();

    render(
      <InteractiveNotificationCenter
        onSeeAll={onSeeAll}
        onOpenChange={onOpenChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: /see all notifications/i }));
    expect(onSeeAll).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.queryByRole("dialog", { name: /notifications/i })).not.toBeInTheDocument();
  });

  it("calls onSettings and reveals filter panel when Settings is clicked", async () => {
    const user = userEvent.setup();
    const onSettings = vi.fn();
    renderPopup({ onSettings });

    expect(screen.queryByText(/filter notifications/i)).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /settings/i }));
    expect(onSettings).toHaveBeenCalledTimes(1);
    expect(screen.getByText(/filter notifications/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /all types/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /all priorities/i })).toBeInTheDocument();
  });

  it("filters notifications by type via filter pills", async () => {
    const user = userEvent.setup();
    renderPopup();

    await user.click(screen.getByRole("button", { name: /settings/i }));
    const filterPanel = screen.getByText(/filter notifications/i).parentElement;
    expect(filterPanel).toBeTruthy();
    await user.click(
      within(filterPanel as HTMLElement).getByRole("button", {
        name: /product alerts/i,
      }),
    );

    expect(screen.getByText("Inventory threshold reached")).toBeInTheDocument();
    expect(screen.queryByText("Scheduled maintenance")).not.toBeInTheDocument();
    expect(screen.queryByText("Policy acknowledgment due")).not.toBeInTheDocument();
  });

  it("filters notifications by priority via filter pills", async () => {
    const user = userEvent.setup();
    renderPopup();

    await user.click(screen.getByRole("button", { name: /settings/i }));
    await user.click(screen.getByRole("button", { name: /^high$/i }));

    expect(screen.getByText("Scheduled maintenance")).toBeInTheDocument();
    expect(screen.queryByText("Inventory threshold reached")).not.toBeInTheDocument();
  });

  it("calls onFilterChange in controlled filter mode", async () => {
    const user = userEvent.setup();
    const onFilterChange = vi.fn();
    const filterState: NotificationCenterFilterState = { type: null, priority: null };

    render(
      <NotificationCenterPopup
        notifications={NOTIFICATIONS}
        open={true}
        filterState={filterState}
        onFilterChange={onFilterChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: /settings/i }));
    const filterPanel = screen.getByText(/filter notifications/i).parentElement;
    expect(filterPanel).toBeTruthy();
    await user.click(
      within(filterPanel as HTMLElement).getByRole("button", {
        name: /system notices/i,
      }),
    );

    expect(onFilterChange).toHaveBeenCalledWith({
      type: "system",
      priority: null,
    });
  });

  it("calls onOpenChange when pressing Escape", () => {
    const onOpenChange = vi.fn();
    renderPopup({ onOpenChange });

    fireEvent.keyDown(document, { key: "Escape" });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("calls onOpenChange when clicking outside the panel", () => {
    const onOpenChange = vi.fn();
    renderPopup({ onOpenChange });

    fireEvent.mouseDown(document.body);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("dropdown row menu marks notification as read", async () => {
    const user = userEvent.setup();
    const onMarkAsRead = vi.fn();
    renderPopup({ onMarkAsRead });

    const row = screen.getByTestId("notification-n-product");
    await user.click(within(row).getByRole("button", { name: /more actions/i }));
    const menu = within(row).getByTestId("dropdown-menu");

    await user.click(
      within(menu).getByRole("button", { name: /^mark as read$/i }),
    );
    expect(onMarkAsRead).toHaveBeenCalledWith("n-product");
  });

  it("dropdown row menu toggles flag", async () => {
    const user = userEvent.setup();
    const onToggleFlag = vi.fn();
    renderPopup({ onToggleFlag });

    const row = screen.getByTestId("notification-n-product");
    await user.click(within(row).getByRole("button", { name: /more actions/i }));
    const menu = within(row).getByTestId("dropdown-menu");

    await user.click(within(menu).getByRole("button", { name: /^flag$/i }));
    expect(onToggleFlag).toHaveBeenCalledWith("n-product");
  });

  it("dropdown row menu dismisses notification", async () => {
    const user = userEvent.setup();
    const onMarkAsRead = vi.fn();
    renderPopup({ onMarkAsRead });

    const row = screen.getByTestId("notification-n-system");
    await user.click(within(row).getByRole("button", { name: /more actions/i }));
    const menu = within(row).getByTestId("dropdown-menu");

    await user.click(within(menu).getByRole("button", { name: /dismiss/i }));
    expect(onMarkAsRead).toHaveBeenCalledWith("n-system");
  });

  it("updates UI after mark all as read in interactive harness", async () => {
    const user = userEvent.setup();
    render(<InteractiveNotificationCenter />);

    expect(screen.getByText("2")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /mark all as read/i }));
    expect(
      screen.getByRole("button", { name: /^notifications$/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /mark all as read/i })).toBeDisabled();
  });
});

describe("Composable NotificationCenter API", () => {
  it("renders compound layout when open", () => {
    renderComposable();

    expect(screen.getByRole("dialog", { name: /notifications/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /notifications/i })).toBeInTheDocument();
    expect(screen.getByRole("list", { name: /notification list/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /see all notifications/i })).toBeInTheDocument();
  });

  it("supports trigger toggle in compound mode", async () => {
    const user = userEvent.setup();

    function CompoundToggleHarness() {
      const [open, setOpen] = useState(false);
      return (
        <NotificationCenter
          notifications={NOTIFICATIONS}
          open={open}
          onOpenChange={setOpen}
        >
          <NotificationCenter.Trigger />
          <NotificationCenter.Content>
            <NotificationCenter.Header />
            <NotificationCenter.List />
          </NotificationCenter.Content>
        </NotificationCenter>
      );
    }

    render(<CompoundToggleHarness />);

    const trigger = screen.getByRole("button", { name: /notifications/i });
    expect(screen.queryByRole("dialog", { name: /notifications/i })).not.toBeInTheDocument();

    await user.click(trigger);
    expect(screen.getByRole("dialog", { name: /notifications/i })).toBeInTheDocument();
  });

  it("invokes handlers from compound layout", async () => {
    const user = userEvent.setup();
    const onMarkAsRead = vi.fn();
    const onMarkAllAsRead = vi.fn();

    renderComposable({ open: true, onMarkAsRead, onMarkAllAsRead });

    await user.click(screen.getByTestId("notification-n-system"));
    expect(onMarkAsRead).toHaveBeenCalledWith("n-system");

    await user.click(screen.getByRole("button", { name: /mark all as read/i }));
    expect(onMarkAllAsRead).toHaveBeenCalledTimes(1);
  });
});
