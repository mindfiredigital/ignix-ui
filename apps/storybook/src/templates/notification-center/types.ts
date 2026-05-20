/**
 * @file types.ts
 * @description Type definitions for the Notification Center template.
 */

import type { ReactNode } from "react";

/**
 * Notification category aligned with common product use cases.
 */
export type NotificationType = "product" | "system" | "user";

/**
 * Priority level for triage, filtering, and flag display.
 */
export type NotificationPriority = "low" | "medium" | "high" | "critical";

/**
 * A single notification item in the center.
 */
export interface NotificationItem {
  /** Unique identifier. */
  id: string;
  /** Category: product alert, system notice, or user update. */
  type: NotificationType;
  /** Priority for filtering and flag emphasis. */
  priority: NotificationPriority;
  /** Short headline (bold in the list). */
  title: string;
  /** Supporting detail text (truncated in the popup). */
  message: string;
  /** Whether the user has read this notification. */
  read: boolean;
  /** When the notification was created. */
  createdAt: Date;
  /** Source label shown after the timestamp (e.g. "Applicant Tracking"). */
  source?: string;
  /** Optional contextual label. */
  contextLabel?: string;
  /** User-flagged state; when omitted, high/critical priority shows as flagged. */
  flagged?: boolean;
}

/**
 * Filter state for the notification center.
 */
export interface NotificationCenterFilterState {
  /** Selected type; null means all types. */
  type: NotificationType | null;
  /** Selected priority; null means all priorities. */
  priority: NotificationPriority | null;
}

/**
 * Context value shared across compound notification center parts.
 */
export interface NotificationCenterContextValue {
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

/**
 * Props for the notification center root (provider + popover shell).
 */
export interface NotificationCenterProps {
  /** Notifications to display (sorted newest-first internally). */
  notifications: NotificationItem[];
  /** Panel content (Trigger, Content, etc.). */
  children: ReactNode;
  /** Controlled open state. */
  open?: boolean;
  /** Fired when the panel opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Controlled filter state. */
  filterState?: NotificationCenterFilterState;
  /** Fired when type or priority filter changes. */
  onFilterChange?: (next: NotificationCenterFilterState) => void;
  /** Fired when a single notification is marked read. */
  onMarkAsRead?: (id: string) => void;
  /** Fired when all notifications should be marked read. */
  onMarkAllAsRead?: () => void;
  /** Fired when the user toggles a flag on an item. */
  onToggleFlag?: (id: string) => void;
  /** Fired when "See all notifications" is clicked. */
  onSeeAll?: () => void;
  /** Fired when Settings is clicked (also toggles inline filters). */
  onSettings?: () => void;
  /** Optional class name on the root wrapper. */
  className?: string;
}

/** Props for the bell trigger button. */
export interface NotificationCenterTriggerProps {
  className?: string;
}

/** Props for the dropdown panel container. */
export interface NotificationCenterContentProps {
  children: ReactNode;
  className?: string;
}

/** Props for the popup header row. */
export interface NotificationCenterHeaderProps {
  title?: string;
}

/** Props for the filter section (shown when Settings is toggled). */
export interface NotificationCenterFiltersProps {
  className?: string;
}

/** Props for the scrollable notification list. */
export interface NotificationCenterListProps {
  className?: string;
  maxHeight?: number;
}

/** Props for a single notification row. */
export interface NotificationCenterItemProps {
  notification: NotificationItem;
}

/** Props for the footer link. */
export interface NotificationCenterFooterProps {
  label?: string;
}

/**
 * Props for the all-in-one composed popup (trigger + panel).
 */
export interface NotificationCenterPopupProps
  extends Omit<NotificationCenterProps, "children"> {
  /** Header title text. */
  title?: string;
  /** Footer CTA label. */
  seeAllLabel?: string;
}
