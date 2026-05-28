import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import CodeBlock from "@theme/CodeBlock";
import {
  NotificationCenter,
  type NotificationCenterFilterState,
  type NotificationItem,
  type NotificationPriority,
  type NotificationType,
} from "@site/src/components/UI/notification-center";

const TYPES: NotificationType[] = ["product", "system", "user"];
const PRIORITIES: NotificationPriority[] = ["low", "medium", "high", "critical"];

const DEMO_COPY: Record<
  NotificationType,
  Array<{ title: string; message: string; source: string }>
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

/** Default list max height used by NotificationCenter.List in the docs UI. */
const DEMO_LIST_MAX_HEIGHT = 360;

const PREVIEW_MIN_HEIGHT_CLOSED = 200;
const PREVIEW_HEIGHT_BUFFER = 32;

function DemoNavBar({
  children,
  minHeight,
  containerRef,
}: {
  children: React.ReactNode;
  minHeight: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      ref={containerRef}
      className="notification-center-demo overflow-visible rounded-xl border border-slate-200 bg-slate-100 text-foreground transition-[min-height] duration-200"
      style={{ minHeight }}
    >
      <header className="flex items-center justify-between overflow-visible border-b border-slate-200 bg-white px-6 py-3 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-primary/15" aria-hidden />
          <span className="text-sm font-semibold text-foreground">Ignix UI</span>
        </div>
        <div className="relative flex w-96 shrink-0 justify-end overflow-visible">
          {children}
        </div>
      </header>
      <main className="px-6 py-6">
        <p className="text-sm text-muted-foreground">
          Click the bell to open the notification popup assembled from compound
          parts.
        </p>
      </main>
    </div>
  );
}

function ComposableNotificationPreview() {
  const previewRef = useRef<HTMLDivElement>(null);
  const [previewMinHeight, setPreviewMinHeight] = useState(
    PREVIEW_MIN_HEIGHT_CLOSED + DEMO_LIST_MAX_HEIGHT,
  );
  const [notifications, setNotifications] = useState(DEMO_NOTIFICATIONS);
  const [open, setOpen] = useState(true);
  const [filter, setFilter] = useState<NotificationCenterFilterState>({
    type: null,
    priority: null,
  });

  const updatePreviewHeight = useCallback(() => {
    const container = previewRef.current;
    if (!container) return;

    if (!open) {
      setPreviewMinHeight(PREVIEW_MIN_HEIGHT_CLOSED);
      return;
    }

    const panel = container.querySelector<HTMLElement>(
      '[role="dialog"][aria-label="Notifications"]',
    );
    if (!panel) return;

    const containerTop = container.getBoundingClientRect().top;
    const panelBottom = panel.getBoundingClientRect().bottom;
    setPreviewMinHeight(
      Math.ceil(panelBottom - containerTop) + PREVIEW_HEIGHT_BUFFER,
    );
  }, [open]);

  useLayoutEffect(() => {
    updatePreviewHeight();

    const container = previewRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(updatePreviewHeight);
    resizeObserver.observe(container);

    const panel = container.querySelector<HTMLElement>(
      '[role="dialog"][aria-label="Notifications"]',
    );
    if (panel) resizeObserver.observe(panel);

    return () => resizeObserver.disconnect();
  }, [updatePreviewHeight, notifications, filter, open]);

  const handleMarkAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true } : item)),
    );
  }, []);

  const handleMarkAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
  }, []);

  const handleToggleFlag = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, flagged: !item.flagged } : item,
      ),
    );
  }, []);

  return (
    <DemoNavBar minHeight={previewMinHeight} containerRef={previewRef}>
      <NotificationCenter
        notifications={notifications}
        open={open}
        onOpenChange={setOpen}
        filterState={filter}
        onFilterChange={setFilter}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
        onToggleFlag={handleToggleFlag}
        onSeeAll={() => console.log("See all notifications")}
        onSettings={() => console.log("Open notification settings")}
      >
        <NotificationCenter.Trigger />
        <NotificationCenter.Content>
          <NotificationCenter.Header />
          <NotificationCenter.Filters />
          <NotificationCenter.List maxHeight={DEMO_LIST_MAX_HEIGHT} />
          <NotificationCenter.Footer />
        </NotificationCenter.Content>
      </NotificationCenter>
    </DemoNavBar>
  );
}

const composableCodeString = `
import { useCallback, useState } from "react";
import {
  NotificationCenter,
  type NotificationCenterFilterState,
  type NotificationItem,
} from "@ignix-ui/notification-center";

function ComposableNotificationPage({
  initialNotifications,
}: {
  initialNotifications: NotificationItem[];
}) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<NotificationCenterFilterState>({
    type: null,
    priority: null,
  });

  const handleMarkAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true } : item)),
    );
  }, []);

  const handleMarkAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
  }, []);

  const handleToggleFlag = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, flagged: !item.flagged } : item,
      ),
    );
  }, []);

  return (
    <header className="flex items-center justify-end gap-3 border-b px-6 py-3">
      <NotificationCenter
        notifications={notifications}
        open={open}
        onOpenChange={setOpen}
        filterState={filter}
        onFilterChange={setFilter}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
        onToggleFlag={handleToggleFlag}
        onSeeAll={() => console.log("See all")}
        onSettings={() => console.log("Settings")}
      >
        <NotificationCenter.Trigger />
        <NotificationCenter.Content>
          <NotificationCenter.Header title="Notifications" />
          <NotificationCenter.Filters />
          <NotificationCenter.List maxHeight={360} />
          <NotificationCenter.Footer label="See All Notifications" />
        </NotificationCenter.Content>
      </NotificationCenter>
    </header>
  );
}
`.trim();

/**
 * NotificationCenterDemo
 *
 * Composable preview + code demo for the Notification Center template.
 * Uses the docs-layer compound API only (no monolithic popup shortcut in docs).
 */
const NotificationCenterDemo: React.FC = () => {
  return (
    <div className="mb-8 flex flex-col space-y-6 ">
      <Tabs>
        <TabItem value="preview" label="Preview" default>
          <div className="notification-center-demo mt-4 overflow-visible pb-2">
            <ComposableNotificationPreview />
          </div>
        </TabItem>
        <TabItem value="code" label="Code">
          <CodeBlock
            language="tsx"
            className="max-h-[520px] overflow-y-auto whitespace-pre-wrap"
          >
            {composableCodeString}
          </CodeBlock>
        </TabItem>
      </Tabs>
    </div>
  );
};

export default NotificationCenterDemo;
