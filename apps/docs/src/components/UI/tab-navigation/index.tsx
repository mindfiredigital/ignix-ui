/**
 * @file tab-navigation/index.tsx
 * @description Tab Navigation template: horizontal tabs with active indicator,
 * content switching, optional icons, and keyboard support (Arrow keys, Enter).
 */

"use client";

import React, {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@site/src/utils/cn";

/* -------------------------------------------------------------------------- */
/*                              TYPES & INTERFACES                             */
/* -------------------------------------------------------------------------- */

/**
 * Configuration for a single tab: label, content, and optional icon.
 */
export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  icon?: LucideIcon;
  iconPosition?: "left" | "right" | "top";
  badge?: {
    label?: string;
    count?: number;
    showZero?: boolean;
    shape?: "pill" | "circle" | "square";
  };
}

/**
 * Props for the TabNavigation root component.
 */
export interface TabNavigationProps {
  tabs: TabItem[];
  defaultActiveId?: string;
  activeId?: string;
  onChange?: (activeId: string) => void;
  className?: string;
  tabListClassName?: string;
  panelClassName?: string;
  indicatorVariant?: "underline" | "pill";
  activeTabClassName?: string;
  inactiveTabClassName?: string;
  activeIndicatorClassName?: string;
}

/* -------------------------------------------------------------------------- */
/*                           TAB NAVIGATION COMPONENT                         */
/* -------------------------------------------------------------------------- */

export const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  defaultActiveId,
  activeId: controlledActiveId,
  onChange,
  className,
  tabListClassName,
  panelClassName,
  indicatorVariant = "underline",
  activeTabClassName,
  inactiveTabClassName,
  activeIndicatorClassName,
}) => {
  const isControlled = controlledActiveId !== undefined;
  const [internalActiveId, setInternalActiveId] = useState<string>(() => {
    if (defaultActiveId && tabs.some((t) => t.id === defaultActiveId)) {
      return defaultActiveId;
    }
    return tabs[0]?.id ?? "";
  });

  const tabIds = useMemo(() => tabs.map((t) => t.id), [tabs]);

  /** Resolved active tab id: valid within current tabs, or first tab when stale. */
  const activeId = useMemo(() => {
    const baseId = isControlled ? controlledActiveId! : internalActiveId;

    if (tabs.length === 0) return "";

    if (tabIds.includes(baseId)) return baseId;

    return tabs[0].id;
  }, [isControlled, controlledActiveId, internalActiveId, tabIds, tabs]);

  const tabRefsMap = useRef<Record<string, HTMLButtonElement | null>>({});
  const listRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({
    left: 0,
    width: 0,
  });

  const setActiveId = useCallback(
    (id: string) => {
      if (!tabs.some((t) => t.id === id)) return;
      if (!isControlled) setInternalActiveId(id);
      onChange?.(id);
    },
    [isControlled, onChange, tabs]
  );

  const handleTabClick = useCallback(
    (id: string) => {
      setActiveId(id);
    },
    [setActiveId]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const currentIndex = tabIds.indexOf(activeId);
      if (currentIndex === -1) return;

      let nextIndex: number | null = null;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        nextIndex = Math.min(currentIndex + 1, tabIds.length - 1);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        nextIndex = Math.max(currentIndex - 1, 0);
      } else if (e.key === "Home") {
        e.preventDefault();
        nextIndex = 0;
      } else if (e.key === "End") {
        e.preventDefault();
        nextIndex = tabIds.length - 1;
      }

      if (nextIndex !== null && nextIndex !== currentIndex) {
        const nextId = tabIds[nextIndex];
        setActiveId(nextId);
        tabRefsMap.current[nextId]?.focus();
      }
    },
    [activeId, tabIds, setActiveId]
  );

  useLayoutEffect(() => {
    if (indicatorVariant !== "underline" || !listRef.current) return;
    const btn = tabRefsMap.current[activeId];
    const list = listRef.current;
    if (btn && list) {
      const listRect = list.getBoundingClientRect();
      const btnRect = btn.getBoundingClientRect();
      setIndicatorStyle({
        left: btnRect.left - listRect.left,
        width: btnRect.width,
      });
    }
  }, [activeId, indicatorVariant, tabs.length]);

  const activeContent = useMemo(
    () => tabs.find((t) => t.id === activeId)?.content ?? null,
    [tabs, activeId]
  );

  if (tabs.length === 0) return null;

  return (
    <div className={cn("w-full", className)}>
      <div className="relative">
        <div
          ref={listRef}
          role="tablist"
          aria-orientation="horizontal"
          onKeyDown={handleKeyDown}
          className={cn(
            "flex flex-row flex-wrap gap-1 border-b border-border",
            indicatorVariant === "pill" && "gap-2 p-1 rounded-lg bg-muted/50",
            tabListClassName
          )}
        >
          {tabs.map((tab) => {
            const isActive = tab.id === activeId;
            const Icon = tab.icon;
            const iconPosition = tab.iconPosition ?? "left";
            const badgeShape = tab.badge?.shape ?? "pill";

            const hasCount =
              typeof tab.badge?.count === "number" &&
              (tab.badge.showZero ? true : tab.badge.count > 0);
            const badgeText = hasCount
              ? String(tab.badge?.count)
              : tab.badge?.label;

            return (
              <button
                key={tab.id}
                ref={(el) => {
                  tabRefsMap.current[tab.id] = el;
                }}
                type="button"
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={isActive}
                aria-controls={`panel-${tab.id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => handleTabClick(tab.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleTabClick(tab.id);
                  }
                }}
                className={cn(
                  "inline-flex gap-2 px-4 py-3 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-t-md",
                  iconPosition === "top"
                    ? "flex-col items-center"
                    : "items-center",
                  isActive
                    ? cn("text-foreground", activeTabClassName)
                    : cn(
                        "text-muted-foreground hover:text-foreground",
                        inactiveTabClassName
                      ),
                  indicatorVariant === "pill" &&
                    (isActive
                      ? cn(
                          "bg-background text-foreground shadow rounded-md",
                          activeTabClassName
                        )
                      : cn("rounded-md hover:bg-muted", inactiveTabClassName))
                )}
              >
                {Icon && iconPosition === "left" && (
                  <Icon className="h-4 w-4 shrink-0" aria-hidden />
                )}

                {Icon && iconPosition === "top" && (
                  <Icon className="h-5 w-5 shrink-0 mb-0.5" aria-hidden />
                )}

                <span
                  className={cn(
                    "inline-flex items-center gap-1",
                    iconPosition === "top" && "justify-center"
                  )}
                >
                  {tab.label}
                  {badgeText && (
                    <span
                      className={cn(
                        "text-[0.65rem] leading-none inline-flex items-center justify-center",
                        "px-1.5 py-0.5",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground",
                        badgeShape === "pill" && "rounded-full",
                        badgeShape === "circle" &&
                          "rounded-full w-5 h-5 px-0 py-0",
                        badgeShape === "square" && "rounded-sm"
                      )}
                    >
                      {badgeText}
                    </span>
                  )}
                </span>

                {Icon && iconPosition === "right" && (
                  <Icon className="h-4 w-4 shrink-0" aria-hidden />
                )}
              </button>
            );
          })}
        </div>
        {indicatorVariant === "underline" && (
          <div
            className={cn(
              "absolute bottom-0 h-0.5 bg-primary transition-all duration-200 ease-out pointer-events-none",
              activeIndicatorClassName
            )}
            style={{
              left: indicatorStyle.left,
              width: indicatorStyle.width,
            }}
            aria-hidden
          />
        )}
      </div>

      <div
        id={`panel-${activeId}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeId}`}
        className={cn("mt-4", panelClassName)}
      >
        {activeContent}
      </div>
    </div>
  );
};

TabNavigation.displayName = "TabNavigation";

export default TabNavigation;
