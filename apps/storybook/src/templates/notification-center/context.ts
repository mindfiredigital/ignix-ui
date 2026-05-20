/**
 * @file context.ts
 * @description React context and hook for the Notification Center compound components.
 */

import { createContext, useContext } from "react";
import type { NotificationCenterContextValue } from "./types";

export const NotificationCenterContext =
  createContext<NotificationCenterContextValue | null>(null);

/**
 * Returns the notification center context from a compound child.
 */
export function useNotificationCenter(): NotificationCenterContextValue {
  const context = useContext(NotificationCenterContext);
  if (!context) {
    throw new Error(
      "Notification Center compound components must be used within <NotificationCenter>.",
    );
  }
  return context;
}
