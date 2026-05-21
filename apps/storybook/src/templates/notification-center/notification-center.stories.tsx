/**
 * @file notification-center.stories.tsx
 * @description Storybook stories for the Notification Center dropdown popup template.
 * Demonstrates bell-triggered panel UI with read/unread states, filters, and mark-all-as-read.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import React, { useCallback, useState, type ReactNode } from "react";
import {
  NotificationCenter,
  NotificationCenterPopup,
  type NotificationCenterFilterState,
  type NotificationItem,
  type NotificationPriority,
  type NotificationType,
} from "./index";

/**
 * Storybook meta for the Notification Center popup template.
 */
const meta: Meta<typeof NotificationCenterPopup> = {
  title: "Templates/Notification Center",
  component: NotificationCenterPopup,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Bell-triggered notification dropdown popup with read/unread row states, type and priority filters (via Settings), mark-all-as-read, per-item flag and actions menu, and footer link. Compound API: NotificationCenter, Trigger, Content, Header, Filters, List, Item, Footer.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    onFilterChange: { action: "filterChange" },
    onMarkAsRead: { action: "markAsRead" },
    onMarkAllAsRead: { action: "markAllAsRead" },
    onToggleFlag: { action: "toggleFlag" },
    onSeeAll: { action: "seeAll" },
    onSettings: { action: "settings" },
  },
};

export default meta;

type Story = StoryObj<typeof NotificationCenterPopup>;

const TYPES: NotificationType[] = ["product", "system", "user"];
const PRIORITIES: NotificationPriority[] = ["low", "medium", "high", "critical"];

/**
 * Demo copy aligned with product, system, and user notification use cases.
 */
const DEMO_COPY: Record<
  NotificationType,
  Array<{
    title: string;
    message: string;
    source: string;
  }>
> = {
  product: [
    {
      title: "Inventory threshold reached",
      message:
        "SKU-4421 dropped below the safety stock level for the EU warehouse.",
      source: "Product Alerts",
    },
    {
      title: "Price change published",
      message: "A scheduled price update is now live for the Pro tier.",
      source: "Catalog",
    },
  ],
  system: [
    {
      title: "Scheduled maintenance",
      message: "Platform maintenance is planned Sunday 02:00–03:00 UTC.",
      source: "System Notices",
    },
    {
      title: "API rate limit warning",
      message: "Your workspace is at 85% of the hourly API quota.",
      source: "System Notices",
    },
  ],
  user: [
    {
      title: "Jamie Pines has responded to your note on Applicant #112",
      message:
        "Please review the updated application materials when you have a moment.",
      source: "Applicant Tracking",
    },
    {
      title: "Alex Morgan left a note on your profile",
      message: "Quick sync requested before tomorrow's standup.",
      source: "Team Updates",
    },
    {
      title: "Information: policy acknowledgment due",
      message: "Complete the annual security training by end of week.",
      source: "User Updates",
    },
  ],
};

/**
 * Builds demo notifications with mixed read/unread states.
 */
function makeDemoNotifications(count: number): NotificationItem[] {
  const now = new Date();

  return Array.from({ length: count }).map((_, index) => {
    const type = TYPES[index % TYPES.length] ?? "system";
    const priority = PRIORITIES[index % PRIORITIES.length] ?? "medium";
    const templates = DEMO_COPY[type];
    const template = templates[index % templates.length] ?? templates[0];

    const minutesAgo = index * 47 + (index % 4) * 23;
    const createdAt = new Date(now.getTime() - minutesAgo * 60_000);

    return {
      id: `notification-${index + 1}`,
      type,
      priority,
      title: template.title,
      message: template.message,
      source: template.source,
      read: index % 3 === 0,
      createdAt,
      flagged: index % 5 === 1,
    };
  });
}

const DEMO_NOTIFICATIONS = makeDemoNotifications(8);

type StoryThemeMode = "light" | "dark";

/**
 * Mock top navigation bar matching the reference screenshot layout.
 */
function StoryNavBar({
  children,
  mode = "light",
}: {
  children: ReactNode;
  mode?: StoryThemeMode;
}) {
  const isDark = mode === "dark";

  return (
    <div
      className={
        isDark
          ? "dark min-h-[520px] bg-gray-950 text-foreground"
          : "min-h-[520px] bg-slate-100 text-foreground"
      }
    >
      <header
        className={
          isDark
            ? "flex items-center justify-between border-b border-gray-800 bg-gray-900 px-6 py-3 shadow-sm"
            : "flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3 shadow-sm"
        }
      >
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-primary/15" aria-hidden />
          <span className="text-sm font-semibold text-foreground">Ignix UI</span>
        </div>
        <div className="flex items-center gap-3">{children}</div>
      </header>
      <main className="px-6 py-10">
        <p className="text-sm text-muted-foreground">
          {isDark ? "Dark mode" : "Light mode"} — click the bell to open the
          notification popup.
        </p>
      </main>
    </div>
  );
}

/**
 * Interactive state for read, flag, and filter actions.
 */
function InteractivePopup({
  mode = "light",
  defaultOpen = false,
  ...args
}: React.ComponentProps<typeof NotificationCenterPopup> & {
  mode?: StoryThemeMode;
  defaultOpen?: boolean;
}) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    () => args.notifications ?? DEMO_NOTIFICATIONS,
  );
  const [filter, setFilter] = useState<NotificationCenterFilterState>({
    type: null,
    priority: null,
  });
  const [open, setOpen] = useState(defaultOpen);

  const handleMarkAsRead = useCallback(
    (id: string) => {
      setNotifications((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, read: true } : item,
        ),
      );
      args.onMarkAsRead?.(id);
    },
    [args],
  );

  const handleMarkAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
    args.onMarkAllAsRead?.();
  }, [args]);

  const handleToggleFlag = useCallback(
    (id: string) => {
      setNotifications((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, flagged: !item.flagged } : item,
        ),
      );
      args.onToggleFlag?.(id);
    },
    [args],
  );

  return (
    <StoryNavBar mode={mode}>
      <NotificationCenterPopup
        {...args}
        open={open}
        onOpenChange={setOpen}
        notifications={notifications}
        filterState={filter}
        onFilterChange={(next) => {
          setFilter(next);
          args.onFilterChange?.(next);
        }}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
        onToggleFlag={handleToggleFlag}
      />
    </StoryNavBar>
  );
}

/**
 * Default popup anchored to a top-nav bell icon (matches reference UI).
 */
export const Default: Story = {
  name: "Dropdown popup (default)",
  render: (args) => <InteractivePopup {...args} />,
};

/**
 * Light theme with the notification panel open for visual review.
 */
export const LightMode: Story = {
  name: "Light mode",
  render: (args) => <InteractivePopup {...args} mode="light" defaultOpen />,
  parameters: {
    backgrounds: { default: "light" },
    docs: {
      description: {
        story:
          "Notification center on a light page shell. Popup opens by default so read/unread row styles are easy to compare.",
      },
    },
  },
};

/**
 * Dark theme with the notification panel open for visual review.
 */
export const DarkMode: Story = {
  name: "Dark mode",
  render: (args) => <InteractivePopup {...args} mode="dark" defaultOpen />,
  parameters: {
    backgrounds: { default: "dark" },
    docs: {
      description: {
        story:
          "Notification center on a dark page shell using the `.dark` token set. Popup opens by default.",
      },
    },
  },
};

/**
 * Compound API: assemble Trigger, Content, Header, List, and Footer manually.
 */
export const Composable: Story = {
  name: "Composable (compound components)",
  render: function ComposableStory() {
    const [notifications, setNotifications] = useState(DEMO_NOTIFICATIONS);
    const [open, setOpen] = useState(true);

    const handleMarkAsRead = useCallback((id: string) => {
      setNotifications((prev) =>
        prev.map((item) => (item.id === id ? { ...item, read: true } : item)),
      );
    }, []);

    const handleMarkAllAsRead = useCallback(() => {
      setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
    }, []);

    return (
      <StoryNavBar mode="light">
        <NotificationCenter
          notifications={notifications}
          open={open}
          onOpenChange={setOpen}
          onMarkAsRead={handleMarkAsRead}
          onMarkAllAsRead={handleMarkAllAsRead}
        >
          <NotificationCenter.Trigger />
          <NotificationCenter.Content>
            <NotificationCenter.Header />
            <NotificationCenter.Filters />
            <NotificationCenter.List />
            <NotificationCenter.Footer />
          </NotificationCenter.Content>
        </NotificationCenter>
      </StoryNavBar>
    );
  },
};

/**
 * Mostly unread items to stress unread row highlighting.
 */
export const MostlyUnread: Story = {
  name: "Mostly unread",
  render: function MostlyUnreadStory(args) {
    const [notifications] = useState(() =>
      DEMO_NOTIFICATIONS.map((n, i) => ({ ...n, read: i % 4 === 0 })),
    );
    return (
      <StoryNavBar mode="light">
        <NotificationCenterPopup {...args} notifications={notifications} />
      </StoryNavBar>
    );
  },
};

/**
 * All read — white row background throughout the list.
 */
export const AllRead: Story = {
  name: "All read",
  render: function AllReadStory(args) {
    const [notifications] = useState(() =>
      DEMO_NOTIFICATIONS.map((n) => ({ ...n, read: true })),
    );
    return (
      <StoryNavBar mode="light">
        <NotificationCenterPopup {...args} notifications={notifications} />
      </StoryNavBar>
    );
  },
};
