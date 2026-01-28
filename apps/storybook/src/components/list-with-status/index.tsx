import React, { useMemo, useCallback } from "react";
import { cn } from "../../../utils/cn";
import { ListBasic, type ListBasicProps } from "../list-basic";
import { CheckCircle2, XCircle, AlertCircle, Clock, Info } from "lucide-react";

/**
 * Status type configuration for list items.
 *
 * @type StatusType
 * @property {'success' | 'error' | 'warning' | 'info' | 'pending'} - Available status types
 */
export type StatusType = 'success' | 'error' | 'warning' | 'info' | 'pending';

/**
 * Configuration for a single list item with status.
 *
 * @interface ListItemWithStatus
 * @property {string} id - Unique identifier for the item (used as key).
 * @property {string} title - Display title of the item.
 * @property {string} [description] - Optional description or subtitle text.
 * @property {StatusType} status - Status type that determines badge color and icon.
 * @property {string} [statusLabel] - Optional custom label for the status badge. If not provided, uses default label based on status type.
 * @property {React.ReactNode} [statusIcon] - Optional custom icon for the status badge. If not provided, uses default icon based on status type.
 * @property {React.ReactNode} [customContent] - Optional custom content to render instead of title/description.
 */
export interface ListItemWithStatus {
  id: string;
  title: string;
  description?: string;
  status: StatusType;
  statusLabel?: string;
  statusIcon?: React.ReactNode;
  customContent?: React.ReactNode;
}

/**
 * Props for the ListWithStatus component.
 *
 * @interface ListWithStatusProps
 * @property {ListItemWithStatus[]} items - Array of items to render, each with title, description, and status badge.
 * @property {"unordered" | "ordered"} [type] - Marker style inherited from ListBasic.
 * When provided, a bullet or number marker is rendered before each item.
 * When omitted, only the item content is shown (no marker).
 * @property {"sm" | "md" | "lg"} [spacing="md"] - Vertical spacing between items (inherited from ListBasic).
 * @property {string} [className] - Additional classes for the list container.
 * @property {string} [itemClassName] - Additional classes for each item row.
 * @property {(item: ListItemWithStatus, index: number) => void} [onItemClick] - Optional callback fired when an item is clicked.
 */
export interface ListWithStatusProps {
  items: ListItemWithStatus[];
  type?: ListBasicProps["type"];
  spacing?: "sm" | "md" | "lg";
  className?: string;
  itemClassName?: string;
  onItemClick?: (item: ListItemWithStatus, index: number) => void;
}

/**
 * Default status labels mapping.
 * Moved outside component to prevent recreation on every render.
 */
const STATUS_LABELS: Record<StatusType, string> = {
  success: 'Success',
  error: 'Error',
  warning: 'Warning',
  info: 'Info',
  pending: 'Pending',
} as const;

/**
 * Default status badge color classes mapping.
 * Maps status types to badge color classes for inline badges.
 * Moved outside component to prevent recreation on every render.
 */
const STATUS_BADGE_CLASSES: Record<StatusType, string> = {
  success: cn(
    "bg-success/30 text-success border-success/20",
    "dark:bg-success/100 dark:text-success-foreground"
  ),
  error: cn(
    "bg-destructive/30 text-destructive border-destructive/20",
    "dark:bg-destructive/50 dark:text-destructive-foreground"
  ),
  warning: cn(
    "bg-warning/10 text-warning border-warning/20",
    "dark:bg-warning/50 dark:text-warning-foreground"
  ),
  info: cn(
    "bg-primary/10 text-primary border-primary/20",
    "dark:bg-primary/30 dark:text-primary-foreground"
  ),
  pending: cn(
    "bg-secondary/10 text-secondary-foreground border-primary/20",
    "dark:bg-secondary/20"
  ),
} as const;

/**
 * Default status icon classes mapping.
 * Maps status types to icon color classes.
 * Moved outside component to prevent recreation on every render.
 */
const STATUS_ICON_CLASSES: Record<StatusType, string> = {
  success: "text-success",
  error: "text-destructive",
  warning: "text-warning",
  info: "text-primary",
  pending: "text-secondary-foreground",
} as const;

/**
 * Default status icons mapping.
 * Moved outside component to prevent recreation on every render.
 */
const STATUS_ICONS: Record<StatusType, React.ReactNode> = {
  success: <CheckCircle2 className="h-3 w-3" />,
  error: <XCircle className="h-3 w-3" />,
  warning: <AlertCircle className="h-3 w-3" />,
  info: <Info className="h-3 w-3" />,
  pending: <Clock className="h-3 w-3" />,
} as const;

/**
 * ListWithStatus Component
 *
 * Renders a list where each item displays a status badge, title, and optional description.
 * Status badges use appropriate colors and icons to indicate the item's status.
 *
 * This component composes the existing `ListBasic` component so it **inherits**
 * list semantics, marker styles (ordered/unordered), and spacing behavior.
 *
 * Features:
 * - Status badges with appropriate colors (success, error, warning, info, pending)
 * - Status icons for visual clarity
 * - Title and description text
 * - Consistent spacing and alignment
 * - Accessible status indicators
 *
 * Performance optimizations:
 * - Uses `React.memo` to prevent unnecessary re-renders when props are stable.
 * - Uses `useMemo` for computed class names.
 * - Uses `useCallback` to memoize click handlers.
 * - Static objects moved outside component.
 *
 * Accessibility:
 * - Status badges are clearly visible with appropriate color contrast.
 * - Status labels provide text alternatives for screen readers.
 * - Proper semantic HTML structure.
 *
 * @component
 * @param {ListWithStatusProps} props - Component props.
 * @returns {JSX.Element} Rendered list with status badges.
 *
 * @example
 * ```tsx
 * const items = [
 *   {
 *     id: '1',
 *     title: 'Payment Processed',
 *     description: 'Your payment has been successfully processed',
 *     status: 'success',
 *   },
 *   {
 *     id: '2',
 *     title: 'Order Failed',
 *     description: 'Unable to process your order',
 *     status: 'error',
 *   },
 * ];
 *
 * <ListWithStatus items={items} spacing="md" />
 * ```
 */
const ListWithStatusComponent: React.FC<ListWithStatusProps> = ({
  items,
  type,
  spacing = "md",
  className,
  itemClassName,
  onItemClick,
}) => {
  /**
   * Memoized list container classes.
   * Only recalculates when className changes.
   */
  const listClassName = useMemo(
    () =>
      cn(
        "w-full",
        "text-foreground",
        // Remove default browser markers; we render our own indicators inside rows.
        "list-none",
        className
      ),
    [className]
  );

  /**
   * Memoized row classes for list items.
   * Only recalculates when itemClassName or onItemClick changes.
   */
  const rowClasses = useMemo(
    () =>
      cn(
        "flex items-center justify-between gap-3 pr-4",
        "transition-colors",
        onItemClick && "cursor-pointer rounded-md px-3 py-2 hover:bg-muted/60 focus-within:bg-muted/60 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2",
        itemClassName
      ),
    [itemClassName, onItemClick]
  );

  /**
   * Memoized click handler factory.
   * Creates a stable click handler for each item to avoid recreating functions on every render.
   */
  const createItemClickHandler = useCallback(
    (item: ListItemWithStatus, index: number) => () => {
      if (onItemClick) {
        onItemClick(item, index);
      }
    },
    [onItemClick]
  );

  /**
   * Gets the status badge configuration for an item.
   * Uses custom label/icon if provided, otherwise falls back to defaults.
   *
   * @param {ListItemWithStatus} item - The list item.
   * @returns {Object} Badge configuration with label, icon, icon classes, and badge classes.
   */
  const getStatusBadgeConfig = useCallback((item: ListItemWithStatus) => {
    return {
      label: item.statusLabel || STATUS_LABELS[item.status],
      icon: item.statusIcon || STATUS_ICONS[item.status],
      iconClasses: STATUS_ICON_CLASSES[item.status],
      badgeClasses: STATUS_BADGE_CLASSES[item.status],
    };
  }, []);

  /**
   * Renders a single list item with status badge, title, and description.
   * This function is not memoized as it's called directly in the map,
   * but the component itself is memoized to prevent unnecessary re-renders.
   */
  const renderItem = (item: ListItemWithStatus, index: number) => {
    const badgeConfig = getStatusBadgeConfig(item);
    const hasClickHandler = !!onItemClick;

    const content = item.customContent || (
      <div className="flex flex-col min-w-0 flex-1">
        <span className="font-medium text-foreground truncate">{item.title}</span>
        {item.description && (
          <span className="text-sm text-muted-foreground truncate">
            {item.description}
          </span>
        )}
      </div>
    );

    const statusBadge = (
      <div className="flex items-center gap-1.5 shrink-0">
        {badgeConfig.icon && (
          <span className={cn("flex-shrink-0", badgeConfig.iconClasses)} aria-hidden="true">
            {badgeConfig.icon}
          </span>
        )}
        <span
          className={cn(
            "inline-flex items-center px-2 py-1 rounded-md text-xs font-medium",
            "border transition-colors",
            badgeConfig.badgeClasses
          )}
          aria-label={`Status: ${badgeConfig.label}`}
        >
          {badgeConfig.label}
        </span>
      </div>
    );

    const itemContent = (
      <div 
        className={rowClasses} 
        onClick={hasClickHandler ? createItemClickHandler(item, index) : undefined}
      >
        {type && (
          <span className="w-6 shrink-0 text-xs font-medium text-muted-foreground text-right">
            {type === "ordered" ? `${index + 1}.` : "•"}
          </span>
        )}
        {content}
        {statusBadge}
      </div>
    );

    return (
      <li key={item.id}>
        {itemContent}
      </li>
    );
  };

  return (
    <ListBasic type={type} spacing={spacing} className={listClassName}>
      {items.map(renderItem)}
    </ListBasic>
  );
};

ListWithStatusComponent.displayName = "ListWithStatus";

/**
 * Memoized ListWithStatus component to avoid re-renders
 * when `items` and other prop references do not change.
 */
export const ListWithStatus = React.memo(ListWithStatusComponent);

