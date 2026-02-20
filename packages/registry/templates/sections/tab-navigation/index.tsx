import React, {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "../../../utils/cn";

/* -------------------------------------------------------------------------- */
/*                              TYPES & INTERFACES                            */
/* -------------------------------------------------------------------------- */

/**
 * Single tab configuration used by {@link TabNavigation}.
 *
 * @property id - Unique identifier for the tab (used for active state and keyboard navigation).
 * @property label - Visible label in the tab list.
 * @property content - React node that is rendered when the tab is active.
 * @property icon - Optional icon component rendered alongside the label.
 * @property iconPosition - Placement of the icon relative to the label.
 * @property badge - Optional badge configuration for counters or small labels.
 */
export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  icon?: LucideIcon;
  iconPosition?: "left" | "right" | "top";
  badge?: {
    /** Optional text label for non-numeric badges (e.g. `"New"`). */
    label?: string;
    /** Optional numeric counter (e.g. unread count). */
    count?: number;
    /** Show the badge when count is 0 (default: `false`). */
    showZero?: boolean;
    /** Visual shape of the badge. */
    shape?: "pill" | "circle" | "square";
  };
}

/**
 * Props for the {@link TabNavigation} template.
 *
 * @property tabs - Array of tab definitions (id, label, content, optional icon and badge).
 * @property defaultActiveId - Initial active tab id (uncontrolled mode).
 * @property activeId - Controlled active tab id (if provided, component acts as controlled).
 * @property onChange - Callback invoked when the active tab changes.
 * @property className - Optional class name for the root container.
 * @property tabListClassName - Optional class name for the horizontal tab list.
 * @property panelClassName - Optional class name for the content panel.
 * @property indicatorVariant - Style of the active indicator: `"underline"` \| `"pill"`.
 * @property activeTabClassName - Extra classes applied to the active tab (e.g. color overrides).
 * @property inactiveTabClassName - Extra classes applied to inactive tabs.
 * @property activeIndicatorClassName - Extra classes applied to the active indicator bar.
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

/**
 * TabNavigation provides a horizontal tab list with:
 * - underline or pill active indicator,
 * - optional icons and badges for each tab,
 * - content switching and full keyboard support (Arrow keys, Home/End, Enter/Space).
 *
 * It supports controlled and uncontrolled modes and is optimized with memoized
 * state updaters and ref-based measurements to avoid unnecessary re-renders.
 *
 * Keyboard behavior:
 * - ArrowRight / ArrowDown → move to next tab.
 * - ArrowLeft / ArrowUp → move to previous tab.
 * - Home → first tab, End → last tab.
 * - Enter / Space on a focused tab activates it.
 */
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
    if (defaultActiveId && tabs.some((tab) => tab.id === defaultActiveId)) {
      return defaultActiveId;
    }
    return tabs[0]?.id ?? "";
  });

  const tabIds = useMemo(() => tabs.map((tab) => tab.id), [tabs]);

  /** Resolved active tab id: valid within current tabs, or first tab when stale. */
  const activeId = useMemo(() => {
    const baseId = isControlled ? controlledActiveId! : internalActiveId;

    if (tabs.length === 0) return "";

    if (tabIds.includes(baseId)) return baseId;

    return tabs[0].id;
  }, [isControlled, controlledActiveId, internalActiveId, tabIds, tabs]);

  const tabRefsMap = useRef<Record<string, HTMLButtonElement | null>>({});
  const listRef = useRef<HTMLDivElement | null>(null);

  const [indicatorStyle, setIndicatorStyle] = useState<{ left: number; width: number }>({
    left: 0,
    width: 0,
  });

  /**
   * Internal helper that updates the active id and notifies external listeners.
   */
  const setActiveId = useCallback(
    (id: string): void => {
      if (!tabs.some((tab) => tab.id === id)) return;
      if (!isControlled) setInternalActiveId(id);
      if (onChange) onChange(id);
    },
    [isControlled, onChange, tabs]
  );

  const handleTabClick = useCallback(
    (id: string): void => {
      setActiveId(id);
    },
    [setActiveId]
  );

  /**
   * Handle roving focus and activation using keyboard.
   */
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>): void => {
      const currentIndex = tabIds.indexOf(activeId);
      if (currentIndex === -1) return;

      let nextIndex: number | null = null;

      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        event.preventDefault();
        nextIndex = Math.min(currentIndex + 1, tabIds.length - 1);
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault();
        nextIndex = Math.max(currentIndex - 1, 0);
      } else if (event.key === "Home") {
        event.preventDefault();
        nextIndex = 0;
      } else if (event.key === "End") {
        event.preventDefault();
        nextIndex = tabIds.length - 1;
      }

      if (nextIndex !== null && nextIndex !== currentIndex) {
        const nextId = tabIds[nextIndex];
        setActiveId(nextId);
        const nextRef = tabRefsMap.current[nextId];
        if (nextRef) nextRef.focus();
      }
    },
    [activeId, tabIds, setActiveId]
  );

  /**
   * Measure the active tab's DOM position to drive the animated underline indicator.
   */
  useLayoutEffect(() => {
    if (indicatorVariant !== "underline" || !listRef.current) return;

    const activeButton = tabRefsMap.current[activeId];
    const listElement = listRef.current;

    if (!activeButton || !listElement) return;

    const listRect = listElement.getBoundingClientRect();
    const buttonRect = activeButton.getBoundingClientRect();

    setIndicatorStyle({
      left: buttonRect.left - listRect.left,
      width: buttonRect.width,
    });
  }, [activeId, indicatorVariant, tabs.length]);

  const activeContent = useMemo<React.ReactNode>(
    () => tabs.find((tab) => tab.id === activeId)?.content ?? null,
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
                ref={(element) => {
                  tabRefsMap.current[tab.id] = element;
                }}
                type="button"
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={isActive}
                aria-controls={`panel-${tab.id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => handleTabClick(tab.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    handleTabClick(tab.id);
                  }
                }}
                className={cn(
                  "inline-flex gap-2 px-4 py-3 text-sm font-medium transition-colors",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-t-md",
                  iconPosition === "top" ? "flex-col items-center" : "items-center",
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

