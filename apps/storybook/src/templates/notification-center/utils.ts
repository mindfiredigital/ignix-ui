/**
 * @file utils.ts
 * @description Shared utilities for the Notification Center template.
 */

import type {
  NotificationCenterFilterState,
  NotificationItem,
  NotificationType,
} from "./types";

/** Human-readable labels for notification types. */
export const TYPE_LABEL: Record<NotificationType, string> = {
  product: "Product Alerts",
  system: "System Notices",
  user: "User Updates",
};

/**
 * Filters notifications by type and priority.
 */
export function applyNotificationFilters(
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

/**
 * Formats a relative timestamp similar to "5 Hours Ago".
 */
export function formatNotificationTime(date: Date, now: Date): string {
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

/**
 * Whether the notification should show an active (red) flag.
 */
export function isNotificationFlagged(item: NotificationItem): boolean {
  if (item.flagged !== undefined) return item.flagged;
  return item.priority === "high" || item.priority === "critical";
}

/**
 * Resolves the display source for metadata line.
 */
export function getNotificationSource(item: NotificationItem): string {
  return item.source ?? item.contextLabel ?? TYPE_LABEL[item.type];
}
