import React, { useCallback, useMemo } from "react";
import { cn } from "../../../utils/cn";
import { ListBasic, type ListBasicProps } from "../list-basic";

/**
 * Configuration for a single action displayed for each list item.
 *
 * @interface ListAction
 * @property {string} id - Unique identifier for the action (used as key).
 * @property {React.ReactNode} label - Visible label or icon for the action button.
 * @property {string} [ariaLabel] - Accessible label announced to screen readers.
 * @property {(index: number) => void} onClick - Callback fired when the action is clicked.
 */
export interface ListAction {
  id: string;
  label: React.ReactNode;
  ariaLabel?: string;
  onClick: (index: number) => void;
}

/**
 * Props for the ListWithActions component.
 *
 * @interface ListWithActionsProps
 * @property {React.ReactNode[]} items - Array of items to render.
 * @property {ListAction[]} actions - Array of actions rendered per item.
 * @property {"unordered" | "ordered"} [type] - Marker style inherited from ListBasic.
 * When provided, a bullet or number marker is rendered before each item.
 * When omitted, only the item content is shown (no marker).
 * @property {"sm" | "md" | "lg"} [spacing="md"] - Vertical spacing between items (inherited from ListBasic).
 * @property {string} [className] - Additional classes for the list container.
 * @property {string} [itemClassName] - Additional classes for each item row.
 */
export interface ListWithActionsProps {
  items: React.ReactNode[];
  actions: ListAction[];
  type?: ListBasicProps["type"];
  spacing?: "sm" | "md" | "lg";
  className?: string;
  itemClassName?: string;
}

/**
 * ListWithActions Component
 *
 * Renders a list where each item has a set of action buttons (edit, delete, view, etc.)
 * that appear on **hover/focus** on desktop and remain **always visible on mobile**.
 *
 * This component composes the existing `ListBasic` component so it **inherits**
 * list semantics, marker styles (ordered/unordered), and spacing behavior.
 *
 * Performance optimizations:
 * - Uses `React.memo` to prevent unnecessary re-renders when props are stable.
 * - Uses `useMemo` for computed class names.
 * - Uses `useCallback` to memoize the click handler factory for actions.
 *
 * Accessibility:
 * - Each row is focusable (`tabIndex={0}`) so keyboard users can reveal actions.
 * - Actions container becomes visible on row hover or when the row has focus.
 *
 * @component
 * @param {ListWithActionsProps} props - Component props.
 * @returns {JSX.Element} Rendered list with per-item actions.
 */
const ListWithActionsComponent: React.FC<ListWithActionsProps> = ({
  items,
  actions,
  type,
  spacing = "md",
  className,
  itemClassName,
}) => {
  const listClassName = useMemo(
    () =>
      cn(
        "w-full",
        "text-foreground",
        // Remove default browser markers; we render our own indicators inside rows
        "list-none",
        className
      ),
    [className]
  );

  const rowClasses = useMemo(
    () =>
      cn(
        "flex items-center justify-between gap-3 rounded-md border border-border/60 bg-background px-3 py-2",
        "transition-colors",
        "hover:bg-muted/60 focus-within:bg-muted/60",
        "group",
        itemClassName
      ),
    [itemClassName]
  );

  /**
   * Returns a memoized click handler for a given action and item index.
   * This avoids creating new inline functions inside the JSX tree on every render.
   */
  const createActionClickHandler = useCallback(
    (action: ListAction, index: number) => () => {
      action.onClick(index);
    },
    []
  );

  return (
    <ListBasic type={type} spacing={spacing} className={listClassName}>
      {items.map((item, index) => (
        <li
          key={index}
          className={rowClasses}
          tabIndex={0}
        >
          <div className={cn("flex-1 min-w-0", type && "flex items-center gap-2")}>
            {type && (
              <span className="w-6 shrink-0 text-xs font-medium text-muted-foreground text-right">
                {type === "ordered" ? `${index + 1}.` : "•"}
              </span>
            )}
            <div className="flex-1 min-w-0">
              {item}
            </div>
          </div>

          <div
            className={cn(
              "flex items-center gap-1",
              // Desktop: hidden until hover/focus.
              "hidden group-hover:flex group-focus-within:flex",
              // Mobile: always visible.
              "sm:flex"
            )}
          >
            {actions.map((action) => (
              <button
                key={action.id}
                type="button"
                className="inline-flex items-center justify-center rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                aria-label={action.ariaLabel}
                onClick={createActionClickHandler(action, index)}
              >
                {action.label}
              </button>
            ))}
          </div>
        </li>
      ))}
    </ListBasic>
  );
};

ListWithActionsComponent.displayName = "ListWithActions";

/**
 * Memoized ListWithActions component to avoid re-renders
 * when `items` and `actions` references do not change.
 */
export const ListWithActions = React.memo(ListWithActionsComponent);



