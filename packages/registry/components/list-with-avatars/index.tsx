/**
 * ListWithAvatars Component
 *
 * A list component that extends ListBasic functionality by displaying avatars on the left
 * side of each item, with names and descriptions on the right. Items can optionally link
 * to profile pages and support custom click handlers.
 *
 * This component composes the existing `ListBasic` component so it inherits
 * list semantics, marker styles (ordered/unordered), and spacing behavior.
 *
 * Features:
 * - Avatar aligned on the left side
 * - Name and description text on the right
 * - Optional profile links for navigation
 * - Consistent spacing and alignment
 * - Accessible keyboard navigation
 *
 * Performance optimizations:
 * - Uses `React.memo` to prevent unnecessary re-renders when props are stable.
 * - Uses `useMemo` for computed class names.
 * - Uses `useCallback` to memoize click handlers.
 *
 * Accessibility:
 * - Each row is focusable when it has a profile link.
 * - Proper semantic HTML structure.
 * - Avatar images include alt text support.
 *
 * @file components/list-with-avatars/index.tsx
 * @component ListWithAvatars
 */

'use client';

import React, { useMemo, useCallback } from "react";
import { cn } from "../../../utils/cn";
import { ListBasic, type ListBasicProps } from "../list-basic";
import { Avatar, type AvatarProps } from "../avatar";

/**
 * Configuration for a single list item with avatar.
 *
 * @interface ListItemWithAvatar
 * @property {string} id - Unique identifier for the item (used as key).
 * @property {string} name - Display name of the person/user.
 * @property {string} [description] - Optional description or subtitle text.
 * @property {string} [profileLink] - Optional URL to the profile page. If provided, the item becomes clickable.
 * @property {string} [avatarSrc] - Optional image source URL for the avatar.
 * @property {string} [avatarAlt] - Optional alt text for the avatar image.
 * @property {string} [avatarLetters] - Optional letters to display in avatar (e.g., initials).
 * @property {React.ReactNode} [avatarIcon] - Optional icon to display in avatar.
 * @property {AvatarProps['size']} [avatarSize] - Optional size of the avatar. Defaults to 'md'.
 * @property {AvatarProps['shape']} [avatarShape] - Optional shape of the avatar. Defaults to 'circle'.
 * @property {React.ReactNode} [customContent] - Optional custom content to render instead of name/description.
 */
export interface ListItemWithAvatar {
  /**
   * Unique identifier for the item (used as React key).
   */
  id: string;
  
  /**
   * Display name of the person/user.
   */
  name: string;
  
  /**
   * Optional description or subtitle text.
   */
  description?: string;
  
  /**
   * Optional URL to the profile page. If provided, the item becomes clickable.
   */
  profileLink?: string;
  
  /**
   * Optional image source URL for the avatar.
   */
  avatarSrc?: string;
  
  /**
   * Optional alt text for the avatar image.
   */
  avatarAlt?: string;
  
  /**
   * Optional letters to display in avatar (e.g., initials).
   */
  avatarLetters?: string;
  
  /**
   * Optional icon to display in avatar.
   */
  avatarIcon?: React.ReactNode;
  
  /**
   * Optional size of the avatar. Overrides default avatarSize prop.
   */
  avatarSize?: AvatarProps["size"];
  
  /**
   * Optional shape of the avatar. Overrides default avatarShape prop.
   */
  avatarShape?: AvatarProps["shape"];
  
  /**
   * Optional custom content to render instead of name/description.
   */
  customContent?: React.ReactNode;
}

/**
 * Props for the ListWithAvatars component.
 *
 * @interface ListWithAvatarsProps
 * @property {ListItemWithAvatar[]} items - Array of items to render, each with avatar, name, and description.
 * @property {"unordered" | "ordered"} [type] - Marker style inherited from ListBasic.
 * When provided, a bullet or number marker is rendered before each item.
 * When omitted, only the item content is shown (no marker).
 * @property {"sm" | "md" | "lg"} [spacing="md"] - Vertical spacing between items (inherited from ListBasic).
 * @property {string} [className] - Additional classes for the list container.
 * @property {string} [itemClassName] - Additional classes for each item row.
 * @property {AvatarProps['size']} [avatarSize] - Default size for all avatars. Can be overridden per item.
 * @property {AvatarProps['shape']} [avatarShape] - Default shape for all avatars. Can be overridden per item.
 * @property {(item: ListItemWithAvatar, index: number) => void} [onItemClick] - Optional callback fired when an item is clicked.
 * @property {boolean} [showProfileLinks] - Whether to make items clickable via profileLink. Defaults to true.
 */
export interface ListWithAvatarsProps {
  /**
   * Array of items to render, each with avatar, name, and description.
   */
  items: ListItemWithAvatar[];
  
  /**
   * Marker style inherited from ListBasic.
   * When provided, a bullet or number marker is rendered before each item.
   * When omitted, only the item content is shown (no marker).
   */
  type?: ListBasicProps["type"];
  
  /**
   * Vertical spacing between items (inherited from ListBasic).
   * @default 'md'
   */
  spacing?: "sm" | "md" | "lg";
  
  /**
   * Additional classes for the list container.
   */
  className?: string;
  
  /**
   * Additional classes for each item row.
   */
  itemClassName?: string;
  
  /**
   * Default size for all avatars. Can be overridden per item.
   * @default 'md'
   */
  avatarSize?: AvatarProps["size"];
  
  /**
   * Default shape for all avatars. Can be overridden per item.
   * @default 'circle'
   */
  avatarShape?: AvatarProps["shape"];
  
  /**
   * Optional callback fired when an item is clicked.
   */
  onItemClick?: (item: ListItemWithAvatar, index: number) => void;
  
  /**
   * Whether to make items clickable via profileLink.
   * @default true
   */
  showProfileLinks?: boolean;
}

/**
 * ListWithAvatars Component
 *
 * Renders a list where each item displays an avatar on the left and text content (name and description) on the right.
 * Items can optionally link to profile pages and support custom click handlers.
 *
 * This component composes the existing `ListBasic` component so it **inherits**
 * list semantics, marker styles (ordered/unordered), and spacing behavior.
 *
 * Features:
 * - Avatar aligned on the left side
 * - Name and description text on the right
 * - Optional profile links for navigation
 * - Consistent spacing and alignment
 * - Accessible keyboard navigation
 *
 * Performance optimizations:
 * - Uses `React.memo` to prevent unnecessary re-renders when props are stable.
 * - Uses `useMemo` for computed class names.
 * - Uses `useCallback` to memoize click handlers.
 *
 * Accessibility:
 * - Each row is focusable when it has a profile link.
 * - Proper semantic HTML structure.
 * - Avatar images include alt text support.
 *
 * @component
 * @param {ListWithAvatarsProps} props - Component props.
 * @returns {JSX.Element} Rendered list with avatars.
 *
 * @example
 * ```tsx
 * const items = [
 *   {
 *     id: '1',
 *     name: 'John Doe',
 *     description: 'Software Engineer',
 *     profileLink: '/profile/john',
 *     avatarSrc: '/avatars/john.jpg',
 *     avatarAlt: 'John Doe',
 *   },
 *   {
 *     id: '2',
 *     name: 'Jane Smith',
 *     description: 'Product Designer',
 *     profileLink: '/profile/jane',
 *     avatarLetters: 'JS',
 *   },
 * ];
 *
 * <ListWithAvatars items={items} spacing="md" />
 * ```
 */
const ListWithAvatarsComponent: React.FC<ListWithAvatarsProps> = ({
  items,
  type,
  spacing = "md",
  className,
  itemClassName,
  avatarSize = "md",
  avatarShape = "circle",
  onItemClick,
  showProfileLinks = true,
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
   * Only recalculates when itemClassName changes.
   */
  const rowClasses = useMemo(
    () =>
      cn(
        "flex items-center gap-3",
        "transition-colors",
        itemClassName
      ),
    [itemClassName]
  );

  /**
   * Memoized clickable row classes.
   * Only recalculates when showProfileLinks changes.
   */
  const clickableRowClasses = useMemo(
    () =>
      cn(
        rowClasses,
        showProfileLinks && "cursor-pointer rounded-md px-3 py-2 hover:bg-muted/60 focus-within:bg-muted/60 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
      ),
    [rowClasses, showProfileLinks]
  );

  /**
   * Memoized click handler factory.
   * Creates a stable click handler for each item to avoid recreating functions on every render.
   */
  const createItemClickHandler = useCallback(
    (item: ListItemWithAvatar, index: number) => () => {
      if (onItemClick) {
        onItemClick(item, index);
      }
      // If profile link exists and showProfileLinks is true, navigate
      if (showProfileLinks && item.profileLink && !onItemClick) {
        // Allow default link behavior if no custom handler
        // The link element will handle navigation
      }
    },
    [onItemClick, showProfileLinks]
  );

  /**
   * Renders a single list item with avatar, name, and description.
   * This function is not memoized as it's called directly in the map,
   * but the component itself is memoized to prevent unnecessary re-renders.
   */
  const renderItem = (item: ListItemWithAvatar, index: number) => {
    // A row is considered visually clickable if it has an onItemClick handler or,
    // when profile links are enabled, if it has a profileLink.
    const hasClickHandler = Boolean(onItemClick) || (showProfileLinks && item.profileLink);
    const finalRowClasses = hasClickHandler ? clickableRowClasses : rowClasses;

    // Attach row-level click handler only when:
    // - an onItemClick handler is provided, and
    // - either there is no profileLink, or profile links are disabled.
    // When a visible profile link exists, we rely on the <a> element's onClick
    // to avoid double-invoking the handler via event bubbling.
    const shouldHandleRowClick =
      Boolean(onItemClick) && (!item.profileLink || !showProfileLinks);
    const finalAvatarSize = item.avatarSize || avatarSize;
    const finalAvatarShape = item.avatarShape || avatarShape;

    const content = item.customContent || (
      <div className="flex flex-col min-w-0 flex-1">
        <span className="font-medium text-foreground truncate">{item.name}</span>
        {item.description && (
          <span className="text-sm text-muted-foreground truncate">
            {item.description}
          </span>
        )}
      </div>
    );

    const avatar = (
      <Avatar
        src={item.avatarSrc}
        alt={item.avatarAlt || item.name}
        letters={item.avatarLetters}
        icon={item.avatarIcon}
        size={finalAvatarSize}
        shape={finalAvatarShape}
        className="shrink-0"
      />
    );

    const itemContent = (
      <div
        className={finalRowClasses}
        onClick={shouldHandleRowClick ? createItemClickHandler(item, index) : undefined}
      >
        {type && (
          <span className="w-6 shrink-0 text-xs font-medium text-muted-foreground text-right">
            {type === "ordered" ? `${index + 1}.` : "•"}
          </span>
        )}
        {avatar}
        {item.profileLink && showProfileLinks ? (
          <a
            href={item.profileLink}
            className="flex flex-col min-w-0 flex-1 no-underline text-inherit hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm"
            onClick={(e) => {
              if (onItemClick) {
                e.preventDefault();
                onItemClick(item, index);
              }
            }}
            tabIndex={0}
          >
            {content}
          </a>
        ) : (
          content
        )}
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

ListWithAvatarsComponent.displayName = "ListWithAvatars";

/**
 * Memoized ListWithAvatars component to avoid re-renders
 * when `items` and other prop references do not change.
 */
export const ListWithAvatars = React.memo(ListWithAvatarsComponent);

