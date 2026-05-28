/**
 * @file index.tsx
 * @description Notification Center dropdown popup template for docs.
 * Bell-triggered panel with read/unread states, type and priority filters,
 * mark-all-as-read, and product / system / user notification use cases.
 * Built as compound components (Root, Trigger, Content, Header, List, Item, Footer).
 */

"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  BellIcon,
  BookmarkFilledIcon,
  BookmarkIcon,
  DotsVerticalIcon,
  EnvelopeClosedIcon,
  ExclamationTriangleIcon,
  FileTextIcon,
  GearIcon,
  InfoCircledIcon,
  PersonIcon,
  RocketIcon,
} from "@radix-ui/react-icons";
import {
  Dropdown,
  DropdownItem,
  DropdownLabel,
  DropdownSeparator,
} from "../dropdown";
import { cn } from "@site/src/utils/cn";

// =============================================================================
// TYPES
// =============================================================================

/** Notification category aligned with common product use cases. */
export type NotificationType = "product" | "system" | "user";

/** Priority level for triage, filtering, and flag display. */
export type NotificationPriority = "low" | "medium" | "high" | "critical";

/** A single notification item in the center. */
export interface NotificationItem {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  source?: string;
  contextLabel?: string;
  flagged?: boolean;
}

/** Filter state for the notification center. */
export interface NotificationCenterFilterState {
  type: NotificationType | null;
  priority: NotificationPriority | null;
}

/** Context value shared across compound notification center parts. */
interface NotificationCenterContextValue {
  notifications: NotificationItem[];
  filteredNotifications: NotificationItem[];
  filter: NotificationCenterFilterState;
  setFilter: (next: NotificationCenterFilterState) => void;
  unreadCount: number;
  now: Date;
  open: boolean;
  setOpen: (open: boolean) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onToggleFlag?: (id: string) => void;
  onSeeAll?: () => void;
  onSettings?: () => void;
}

/** Props for the notification center root (provider + popover shell). */
export interface NotificationCenterProps {
  notifications: NotificationItem[];
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  filterState?: NotificationCenterFilterState;
  onFilterChange?: (next: NotificationCenterFilterState) => void;
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onToggleFlag?: (id: string) => void;
  onSeeAll?: () => void;
  onSettings?: () => void;
  className?: string;
}

export interface NotificationCenterTriggerProps {
  className?: string;
}

export interface NotificationCenterContentProps {
  children: ReactNode;
  className?: string;
}

export interface NotificationCenterHeaderProps {
  title?: string;
}

export interface NotificationCenterFiltersProps {
  className?: string;
}

export interface NotificationCenterListProps {
  className?: string;
  maxHeight?: number;
}

export interface NotificationCenterItemProps {
  notification: NotificationItem;
}

export interface NotificationCenterFooterProps {
  label?: string;
}

export interface NotificationCenterPopupProps
  extends Omit<NotificationCenterProps, "children"> {
  title?: string;
  seeAllLabel?: string;
}

// =============================================================================
// CONTEXT
// =============================================================================

const NotificationCenterContext =
  createContext<NotificationCenterContextValue | null>(null);

/** Returns the notification center context from a compound child. */
function useNotificationCenter(): NotificationCenterContextValue {
  const context = useContext(NotificationCenterContext);
  if (!context) {
    throw new Error(
      "Notification Center compound components must be used within <NotificationCenter>.",
    );
  }
  return context;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const TYPE_ORDER: NotificationType[] = ["product", "system", "user"];

const TYPE_LABEL: Record<NotificationType, string> = {
  product: "Product Alerts",
  system: "System Notices",
  user: "User Updates",
};

const PRIORITY_ORDER: NotificationPriority[] = [
  "low",
  "medium",
  "high",
  "critical",
];

const PRIORITY_LABEL: Record<NotificationPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

// =============================================================================
// UTILS
// =============================================================================

/** Filters notifications by type and priority. */
function applyNotificationFilters(
  items: NotificationItem[],
  filter: NotificationCenterFilterState,
): NotificationItem[] {
  return items.filter((item) => {
    if (filter.type !== null && item.type !== filter.type) return false;
    if (filter.priority !== null && item.priority !== filter.priority) {
      return false;
    }
    return true;
  });
}

/** Formats a relative timestamp similar to "5 Hours Ago". */
function formatNotificationTime(date: Date, now: Date): string {
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.max(0, Math.floor(diffMs / 1000));
  const minutes = Math.floor(diffSec / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (diffSec < 45) return "Just now";
  if (minutes < 60) {
    return `${minutes} Minute${minutes === 1 ? "" : "s"} Ago`;
  }
  if (hours < 24) {
    return `${hours} Hour${hours === 1 ? "" : "s"} Ago`;
  }
  if (days < 7) {
    return `${days} Day${days === 1 ? "" : "s"} Ago`;
  }
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

/** Whether the notification should show an active (red) flag. */
function isNotificationFlagged(item: NotificationItem): boolean {
  if (item.flagged !== undefined) return item.flagged;
  return item.priority === "high" || item.priority === "critical";
}

/** Resolves the display source for metadata line. */
function getNotificationSource(item: NotificationItem): string {
  return item.source ?? item.contextLabel ?? TYPE_LABEL[item.type];
}

// =============================================================================
// INTERNAL UI HELPERS
// =============================================================================

/**
 * Icon and color chip per notification type (Radix UI icons).
 */
function NotificationTypeVisual({ type }: { type: NotificationType }) {
  const className = "h-4 w-4";
  switch (type) {
    case "product":
      return (
        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
            "bg-sky-100 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400",
          )}
        >
          <RocketIcon className={className} aria-hidden />
        </span>
      );
    case "system":
      return (
        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
            "bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400",
          )}
        >
          <GearIcon className={className} aria-hidden />
        </span>
      );
    case "user":
      return (
        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
            "bg-sky-100 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400",
          )}
        >
          <EnvelopeClosedIcon className={className} aria-hidden />
        </span>
      );
  }
}

/**
 * Picks a contextual icon when title/message imply alert or info variants.
 */
function NotificationRowIcon({ item }: { item: NotificationItem }) {
  const haystack = `${item.title} ${item.message}`.toLowerCase();
  if (haystack.includes("expired") || haystack.includes("alert")) {
    return (
      <span
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
          "bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400",
        )}
      >
        <ExclamationTriangleIcon className="h-4 w-4" aria-hidden />
      </span>
    );
  }
  if (haystack.includes("note") || haystack.includes("responded")) {
    return (
      <span
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
          "bg-sky-100 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400",
        )}
      >
        <FileTextIcon className="h-4 w-4" aria-hidden />
      </span>
    );
  }
  if (haystack.includes("maintenance") || haystack.includes("system")) {
    return (
      <span
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
          "bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400",
        )}
      >
        <GearIcon className="h-4 w-4" aria-hidden />
      </span>
    );
  }
  if (haystack.includes("information")) {
    return (
      <span
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
          "bg-sky-100 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400",
        )}
      >
        <InfoCircledIcon className="h-4 w-4" aria-hidden />
      </span>
    );
  }
  if (item.type === "user") {
    return (
      <span
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
          "bg-sky-100 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400",
        )}
      >
        <PersonIcon className="h-4 w-4" aria-hidden />
      </span>
    );
  }
  return <NotificationTypeVisual type={item.type} />;
}

// =============================================================================
// ROOT
// =============================================================================

/**
 * Root provider and positioning shell for the notification dropdown.
 */
function NotificationCenterRoot({
  notifications,
  children,
  open: controlledOpen,
  onOpenChange,
  filterState,
  onFilterChange,
  onMarkAsRead,
  onMarkAllAsRead,
  onToggleFlag,
  onSeeAll,
  onSettings,
  className,
}: NotificationCenterProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [internalFilter, setInternalFilter] =
    useState<NotificationCenterFilterState>({
      type: null,
      priority: null,
    });
  const [showFilters, setShowFilters] = useState(false);
  const [now, setNow] = useState<Date>(() => new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  const open = controlledOpen ?? internalOpen;

  const setOpen = useCallback(
    (next: boolean) => {
      if (controlledOpen === undefined) {
        setInternalOpen(next);
      }
      onOpenChange?.(next);
    },
    [controlledOpen, onOpenChange],
  );

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, setOpen]);

  const effectiveFilter = filterState ?? internalFilter;

  const sorted = useMemo(
    () =>
      [...notifications].sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
      ),
    [notifications],
  );

  const filteredNotifications = useMemo(
    () => applyNotificationFilters(sorted, effectiveFilter),
    [sorted, effectiveFilter],
  );

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  );

  const setFilter = useCallback(
    (next: NotificationCenterFilterState) => {
      if (filterState === undefined) setInternalFilter(next);
      onFilterChange?.(next);
    },
    [filterState, onFilterChange],
  );

  const handleSettings = useCallback(() => {
    setShowFilters((prev) => !prev);
    onSettings?.();
  }, [onSettings]);

  const contextValue = useMemo(
    () => ({
      notifications: sorted,
      filteredNotifications,
      filter: effectiveFilter,
      setFilter,
      unreadCount,
      now,
      open,
      setOpen,
      showFilters,
      setShowFilters,
      onMarkAsRead,
      onMarkAllAsRead,
      onToggleFlag,
      onSeeAll,
      onSettings: handleSettings,
    }),
    [
      sorted,
      filteredNotifications,
      effectiveFilter,
      setFilter,
      unreadCount,
      now,
      open,
      setOpen,
      showFilters,
      onMarkAsRead,
      onMarkAllAsRead,
      onToggleFlag,
      onSeeAll,
      handleSettings,
    ],
  );

  return (
    <NotificationCenterContext.Provider value={contextValue}>
      <div ref={containerRef} className={cn("relative inline-flex", className)}>
        {children}
      </div>
    </NotificationCenterContext.Provider>
  );
}

// =============================================================================
// COMPOUND PARTS
// =============================================================================

/**
 * Bell icon trigger with unread count badge.
 */
const NotificationCenterTrigger = React.memo(function NotificationCenterTrigger({
  className,
}: NotificationCenterTriggerProps) {
  const { unreadCount, open, setOpen } = useNotificationCenter();

  const handleClick = useCallback(() => {
    setOpen(!open);
  }, [open, setOpen]);

  return (
    <button
      type="button"
      className={cn(
        "relative inline-flex h-10 w-10 items-center justify-center rounded-lg",
        "border border-border/60 bg-background text-muted-foreground",
        "hover:bg-muted/60 hover:text-foreground transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        open && "bg-muted/80 text-foreground",
        className,
      )}
      onClick={handleClick}
      aria-label={
        unreadCount > 0
          ? `Notifications, ${unreadCount} unread`
          : "Notifications"
      }
      aria-haspopup="dialog"
      aria-expanded={open}
    >
      <BellIcon className="h-5 w-5" aria-hidden />
      {unreadCount > 0 && (
        <span
          className={cn(
            "absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center",
            "rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground",
          )}
        >
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </button>
  );
});

/**
 * Dropdown panel with caret, shadow, and scrollable body.
 */
function NotificationCenterContent({
  children,
  className,
}: NotificationCenterContentProps) {
  const { open } = useNotificationCenter();

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-label="Notifications"
      className={cn(
        "absolute right-0 top-full z-50 mt-3 w-[min(100vw-2rem,24rem)]",
        "rounded-lg border border-border/80 bg-card text-card-foreground shadow-xl",
        "animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-150",
        className,
      )}
    >
      {/* Caret pointing to trigger */}
      <span
        className={cn(
          "pointer-events-none absolute -top-1.5 right-4 h-3 w-3 rotate-45",
          "border-l border-t border-border/80 bg-card",
        )}
        aria-hidden
      />
      <div className="relative overflow-hidden rounded-lg">{children}</div>
    </div>
  );
}

/**
 * Header with title and Mark all as Read | Settings actions.
 */
const NotificationCenterHeader = React.memo(function NotificationCenterHeader({
  title = "Notifications",
}: NotificationCenterHeaderProps) {
  const { unreadCount, onMarkAllAsRead, onSettings } = useNotificationCenter();

  const handleMarkAll = useCallback(() => {
    onMarkAllAsRead?.();
  }, [onMarkAllAsRead]);

  return (
    <div className="flex items-center justify-between gap-3 border-b border-border/60 px-4 py-3">
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      <div className="flex items-center gap-1.5 text-xs font-medium text-primary">
        <button
          type="button"
          className="hover:underline disabled:opacity-40 disabled:no-underline"
          onClick={handleMarkAll}
          disabled={unreadCount === 0}
        >
          Mark all as Read
        </button>
        <span className="text-border" aria-hidden>
          |
        </span>
        <button
          type="button"
          className="hover:underline"
          onClick={onSettings}
        >
          Settings
        </button>
      </div>
    </div>
  );
});

/**
 * Compact type and priority filter chips (toggle via Settings).
 */
const NotificationCenterFilters = React.memo(function NotificationCenterFilters({
  className,
}: NotificationCenterFiltersProps) {
  const { notifications, filter, setFilter, showFilters } = useNotificationCenter();

  const handleType = useCallback(
    (type: NotificationType | null) => {
      setFilter({ ...filter, type });
    },
    [filter, setFilter],
  );

  const handlePriority = useCallback(
    (priority: NotificationPriority | null) => {
      setFilter({ ...filter, priority });
    },
    [filter, setFilter],
  );

  if (!showFilters) return null;

  return (
    <div
      className={cn(
        "border-b border-border/60 bg-muted/20 px-4 py-3 space-y-3",
        className,
      )}
    >
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        Filter notifications
      </p>
      <div className="flex flex-wrap gap-1.5">
        <FilterPill
          label="All types"
          active={filter.type === null}
          onClick={() => handleType(null)}
        />
        {TYPE_ORDER.map((type) => (
          <FilterPill
            key={type}
            label={TYPE_LABEL[type]}
            active={filter.type === type}
            onClick={() => handleType(type)}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-1.5">
        <FilterPill
          label="All priorities"
          active={filter.priority === null}
          onClick={() => handlePriority(null)}
        />
        {PRIORITY_ORDER.map((priority) => (
          <FilterPill
            key={priority}
            label={PRIORITY_LABEL[priority]}
            active={filter.priority === priority}
            onClick={() => handlePriority(priority)}
          />
        ))}
      </div>
      <p className="text-[11px] text-muted-foreground">
        {notifications.length} total in inbox
      </p>
    </div>
  );
});

const FilterPill = React.memo(function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "bg-background border border-border/60 text-muted-foreground hover:text-foreground",
      )}
    >
      {label}
    </button>
  );
});

/**
 * A single notification row matching the reference popup layout.
 */
const NotificationCenterItem = React.memo(function NotificationCenterItem({
  notification,
}: NotificationCenterItemProps) {
  const { now, onMarkAsRead, onToggleFlag } = useNotificationCenter();

  const timestamp = useMemo(
    () => formatNotificationTime(notification.createdAt, now),
    [notification.createdAt, now],
  );

  const source = useMemo(
    () => getNotificationSource(notification),
    [notification],
  );

  const flagged = isNotificationFlagged(notification);

  const handleRowClick = useCallback(() => {
    if (!notification.read) {
      onMarkAsRead?.(notification.id);
    }
  }, [notification.id, notification.read, onMarkAsRead]);

  const handleFlagClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      onToggleFlag?.(notification.id);
    },
    [notification.id, onToggleFlag],
  );

  const itemMenuTrigger = useMemo(
    () => (
      <button
        type="button"
        className={cn(
          "inline-flex h-7 w-7 items-center justify-center rounded-md",
          "text-muted-foreground hover:bg-muted/80 hover:text-foreground",
        )}
        aria-label="More actions"
      >
        <DotsVerticalIcon className="h-4 w-4" />
      </button>
    ),
    [],
  );

  return (
    <li>
      <div
        role="button"
        tabIndex={0}
        onClick={handleRowClick}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleRowClick();
          }
        }}
        className={cn(
          "flex gap-3 px-4 py-3 transition-colors cursor-pointer",
          "border-b border-border/40 last:border-b-0",
          "hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
          !notification.read
            ? "bg-sky-50/90 dark:bg-primary/5"
            : "bg-card",
        )}
        data-read={notification.read}
        data-testid={`notification-${notification.id}`}
      >
        <NotificationRowIcon item={notification} />

        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "text-sm leading-snug text-foreground line-clamp-2",
              !notification.read && "font-semibold",
            )}
          >
            {notification.title}
          </p>
          <p className="mt-0.5 text-sm text-muted-foreground line-clamp-2">
            {notification.message}
          </p>
          <p className="mt-1.5 text-xs text-muted-foreground">
            <time dateTime={notification.createdAt.toISOString()}>{timestamp}</time>
            <span aria-hidden> | </span>
            <span>{source}</span>
          </p>
        </div>

        <div
          className="flex shrink-0 flex-col items-center gap-1 pt-0.5"
          onClick={(event) => event.stopPropagation()}
          onKeyDown={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            onClick={handleFlagClick}
            className={cn(
              "inline-flex h-7 w-7 items-center justify-center rounded-md transition-colors",
              flagged
                ? "text-destructive hover:bg-destructive/10"
                : "text-muted-foreground/50 hover:text-muted-foreground hover:bg-muted/60",
            )}
            aria-label={flagged ? "Remove flag" : "Flag notification"}
            aria-pressed={flagged}
          >
            {flagged ? (
              <BookmarkFilledIcon className="h-4 w-4" />
            ) : (
              <BookmarkIcon className="h-4 w-4" />
            )}
          </button>

          <Dropdown
            trigger={itemMenuTrigger}
            side="left"
            align="end"
            size="sm"
            rounded="md"
            className="min-w-[9rem] p-1"
          >
            <DropdownLabel className="text-xs text-muted-foreground px-2">
              Actions
            </DropdownLabel>
            <DropdownSeparator />
            {!notification.read && (
              <DropdownItem onSelect={() => onMarkAsRead?.(notification.id)}>
                Mark as read
              </DropdownItem>
            )}
            <DropdownItem onSelect={() => onToggleFlag?.(notification.id)}>
              {flagged ? "Unflag" : "Flag"}
            </DropdownItem>
            <DropdownItem
              onSelect={() => onMarkAsRead?.(notification.id)}
              className="text-destructive focus:text-destructive"
            >
              Dismiss
            </DropdownItem>
          </Dropdown>
        </div>
      </div>
    </li>
  );
});

/**
 * Scrollable list of notification items.
 */
const NotificationCenterList = React.memo(function NotificationCenterList({
  className,
  maxHeight = 360,
}: NotificationCenterListProps) {
  const { filteredNotifications } = useNotificationCenter();

  if (filteredNotifications.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center px-6 py-12 text-center"
        role="status"
      >
        <BellIcon
          className="h-8 w-8 text-muted-foreground/40"
          aria-hidden
        />
        <p className="mt-2 text-sm font-medium text-foreground">
          No notifications
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          You are all caught up.
        </p>
      </div>
    );
  }

  return (
    <ul
      className={cn("overflow-y-auto overscroll-contain", className)}
      style={{ maxHeight }}
      aria-label="Notification list"
    >
      {filteredNotifications.map((notification) => (
        <NotificationCenterItem
          key={notification.id}
          notification={notification}
        />
      ))}
    </ul>
  );
});

/**
 * Footer with centered "See all" link.
 */
const NotificationCenterFooter = React.memo(function NotificationCenterFooter({
  label = "See All Notifications",
}: NotificationCenterFooterProps) {
  const { onSeeAll, setOpen } = useNotificationCenter();

  const handleClick = useCallback(() => {
    onSeeAll?.();
    setOpen(false);
  }, [onSeeAll, setOpen]);

  return (
    <div className="border-t border-border/60 px-4 py-3 text-center">
      <button
        type="button"
        className="text-sm font-medium text-primary hover:underline"
        onClick={handleClick}
      >
        {label}
      </button>
    </div>
  );
});

// =============================================================================
// COMPOSED POPUP
// =============================================================================

/**
 * Ready-to-use notification dropdown (bell trigger + panel).
 */
export function NotificationCenterPopup({
  title = "Notifications",
  seeAllLabel = "See All Notifications",
  ...rootProps
}: NotificationCenterPopupProps) {
  return (
    <NotificationCenter {...rootProps}>
      <NotificationCenterTrigger />
      <NotificationCenterContent>
        <NotificationCenterHeader title={title} />
        <NotificationCenterFilters />
        <NotificationCenterList />
        <NotificationCenterFooter label={seeAllLabel} />
      </NotificationCenterContent>
    </NotificationCenter>
  );
}

/**
 * Compound notification center with attached sub-components.
 */
export const NotificationCenter = Object.assign(NotificationCenterRoot, {
  Trigger: NotificationCenterTrigger,
  Content: NotificationCenterContent,
  Header: NotificationCenterHeader,
  Filters: NotificationCenterFilters,
  List: NotificationCenterList,
  Item: NotificationCenterItem,
  Footer: NotificationCenterFooter,
  Popup: NotificationCenterPopup,
});

export default NotificationCenterPopup;
