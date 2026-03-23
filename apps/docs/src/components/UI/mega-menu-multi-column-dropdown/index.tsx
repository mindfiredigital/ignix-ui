"use client";

/**
 * @fileOverview Mega Menu with Multi-Column Dropdown UI component for docs.
 * Mirrors the Storybook template implementation but uses @site imports so it
 * can be showcased in the documentation site and used from demos/examples.
 */

import * as React from "react";
import { ChevronDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@site/src/utils/cn";
import { Button } from "@site/src/components/UI/button";

/* -------------------------------------------------------------------------- */
/*                                 TYPES                                      */
/* -------------------------------------------------------------------------- */

/**
 * Single link item within a mega menu column.
 * Supports optional icon (Lucide), image URL per link, and nested children
 * for n-level menus.
 */
export interface MegaMenuLinkItem {
  /** Display label for the link */
  label: string;
  /** Destination URL or hash */
  href: string;
  /** Optional Lucide icon component */
  icon?: LucideIcon;
  /** Optional image URL (used when icon is not provided) */
  imageUrl?: string;
  /** Optional alt text for image */
  imageAlt?: string;
  /** Open in new tab when true */
  external?: boolean;
  /**
   * Optional nested children that will be rendered as expandable
   * sub-items under this link. Supports arbitrarily deep hierarchies.
   */
  children?: MegaMenuLinkItem[];
}

/**
 * One column in the mega menu dropdown with a category header and list of links.
 */
export interface MegaMenuColumn {
  /** Category header text for this column */
  header: string;
  /** Links in this column; each can have an icon or image */
  links: MegaMenuLinkItem[];
}

/**
 * Configuration for the CTA button rendered inside the mega menu panel.
 */
export interface MegaMenuCtaConfig {
  /** Button label */
  label: string;
  /** Button destination URL */
  href?: string;
  /** Click handler (used when href is not provided) */
  onClick?: () => void;
  /** Visual variant for the button */
  variant?: "default" | "primary" | "secondary" | "outline" | "ghost" | "link";
}

/**
 * Props for the root Mega Menu component.
 */
export interface MegaMenuMultiColumnDropdownProps {
  /** Label for the top-level nav item that opens the mega menu */
  triggerLabel: string;
  /** Columns to show in the dropdown (each has header + links) */
  columns: MegaMenuColumn[];
  /** Optional CTA button shown inside the dropdown (e.g. "View all" or "Get started") */
  cta?: MegaMenuCtaConfig;
  /** Optional callback when a link is selected (for analytics or routing) */
  onLinkSelect?: (item: MegaMenuLinkItem, column: MegaMenuColumn) => void;
  /** Optional callback when the menu opens */
  onOpen?: () => void;
  /** Optional callback when the menu closes */
  onClose?: () => void;
  /** Additional class name for the root nav container */
  className?: string;
  /** Theme: light or dark (affects dropdown background and text) */
  theme?: "light" | "dark";
  /** Alignment of the dropdown panel relative to the trigger */
  align?: "left" | "center" | "right";
}

/** Internal: flattened focusable element id for keyboard navigation */
interface FocusableItem {
  type: "trigger" | "link" | "cta";
  columnIndex: number;
  linkIndex?: number;
  elementId: string;
}

/* -------------------------------------------------------------------------- */
/*                           SUB-COMPONENTS (Memoized)                        */
/* -------------------------------------------------------------------------- */

/**
 * Renders a single link row with optional icon or image.
 * Memoized to avoid re-renders when parent state changes but props are stable.
 */
const MegaMenuLinkRow = React.memo(function MegaMenuLinkRow({
  item,
  onSelect,
  theme,
  id,
  hasChildren,
  isExpanded,
  onToggleExpand,
}: {
  item: MegaMenuLinkItem;
  onSelect?: (item: MegaMenuLinkItem) => void;
  theme: "light" | "dark";
  id: string;
  hasChildren?: boolean;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}) {
  const handleClick = React.useCallback(() => {
    if (!hasChildren) {
      onSelect?.(item);
    } else {
      onToggleExpand?.();
    }
  }, [hasChildren, item, onSelect, onToggleExpand]);

  const linkContent = (
    <>
      <span className="flex min-w-0 flex-1 items-center gap-3">
        {item.icon ? (
          <item.icon className="h-5 w-5 shrink-0 text-current opacity-80" aria-hidden />
        ) : item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.imageAlt ?? item.label}
            className="h-8 w-8 shrink-0 rounded object-cover"
          />
        ) : null}
        <span className="truncate">{item.label}</span>
      </span>
      {hasChildren && (
        <ChevronDown
          className={cn(
            "ml-2 h-4 w-4 shrink-0 text-current transition-transform",
            isExpanded && "rotate-180"
          )}
          aria-hidden
        />
      )}
    </>
  );

  const isDark = theme === "dark";
  const baseClass = cn(
    "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    isDark
      ? "text-gray-200 hover:bg-white/10 focus-visible:ring-primary-500"
      : "text-gray-700 hover:bg-gray-100 focus-visible:ring-primary-500"
  );

  if (hasChildren) {
    return (
      <button
        id={id}
        type="button"
        className={baseClass}
        onClick={handleClick}
        aria-expanded={isExpanded}
        aria-haspopup="true"
      >
        {linkContent}
      </button>
    );
  }

  return (
    <a
      id={id}
      href={item.href}
      target={item.external ? "_blank" : undefined}
      rel={item.external ? "noopener noreferrer" : undefined}
      className={baseClass}
      onClick={handleClick}
    >
      {linkContent}
    </a>
  );
});

/**
 * Renders one column (category header + list of links) in the mega menu.
 * Memoized to limit re-renders to when column data changes.
 */
const MegaMenuColumnBlock = React.memo(function MegaMenuColumnBlock({
  column,
  columnIndex,
  onLinkSelect,
  theme,
  linkIdPrefix,
}: {
  column: MegaMenuColumn;
  columnIndex: number;
  onLinkSelect?: (item: MegaMenuLinkItem, column: MegaMenuColumn) => void;
  theme: "light" | "dark";
  linkIdPrefix: string;
}) {
  const [expandedKeys, setExpandedKeys] = React.useState<Set<string>>(() => new Set());

  const handleSelect = React.useCallback(
    (item: MegaMenuLinkItem) => {
      onLinkSelect?.(item, column);
    },
    [column, onLinkSelect]
  );

  const toggleExpand = React.useCallback((key: string) => {
    setExpandedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }, []);

  const isDark = theme === "dark";

  const renderItem = (
    link: MegaMenuLinkItem,
    linkIndex: number,
    depth = 0,
    parentKey = ""
  ): React.ReactNode => {
    const key = parentKey ? `${parentKey}-${linkIndex}` : `${linkIndex}`;
    const hasChildren = Array.isArray(link.children) && link.children.length > 0;
    const isExpanded = expandedKeys.has(key);

    const idForFocus =
      depth === 0 && !parentKey
        ? `${linkIdPrefix}-col-${columnIndex}-link-${linkIndex}`
        : `${linkIdPrefix}-col-${columnIndex}-link-${key}`;

    return (
      <li key={`${link.href}-${key}`}>
        <MegaMenuLinkRow
          item={link}
          onSelect={hasChildren ? undefined : handleSelect}
          theme={theme}
          id={idForFocus}
          hasChildren={hasChildren}
          isExpanded={isExpanded}
          onToggleExpand={hasChildren ? () => toggleExpand(key) : undefined}
        />
        {hasChildren && isExpanded && (
          <ul
            className={cn(
              "mt-1 space-y-0.5 border-l pl-3",
              isDark ? "border-gray-700" : "border-gray-200"
            )}
            role="list"
          >
            {link.children!.map((child, childIndex) =>
              renderItem(child, childIndex, depth + 1, key)
            )}
          </ul>
        )}
      </li>
    );
  };

  return (
    <div className="flex min-w-0 flex-col">
      <h3
        className={cn(
          "mb-2 px-3 text-xs font-semibold uppercase tracking-wider",
          isDark ? "text-gray-400" : "text-gray-500"
        )}
      >
        {column.header}
      </h3>
      <ul className="flex flex-col gap-0.5" role="list">
        {column.links.map((link, linkIndex) => renderItem(link, linkIndex))}
      </ul>
    </div>
  );
});

/* -------------------------------------------------------------------------- */
/*                         MAIN MEGA MENU COMPONENT                           */
/* -------------------------------------------------------------------------- */

/**
 * Mega Menu with Multi-Column Dropdown.
 *
 * Renders a top-level nav trigger; on hover (and focus) opens a large dropdown
 * with multiple columns, each with a category header and links. Links can
 * display an icon or image. Optional CTA button can be placed in the panel.
 * Supports keyboard navigation (arrow keys) and responsive layout.
 */
export function MegaMenuMultiColumnDropdown({
  triggerLabel,
  columns,
  cta,
  onLinkSelect,
  onOpen,
  onClose,
  className,
  theme = "light",
  align = "left",
}: MegaMenuMultiColumnDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [focusedIndex, setFocusedIndex] = React.useState(-1);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const openTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  /** Build flat list of focusable items for arrow-key navigation */
  const focusableItems = React.useMemo((): FocusableItem[] => {
    const items: FocusableItem[] = [{ type: "trigger", columnIndex: -1, elementId: "mega-menu-trigger" }];
    columns.forEach((col, colIdx) => {
      col.links.forEach((_, linkIdx) => {
        items.push({
          type: "link",
          columnIndex: colIdx,
          linkIndex: linkIdx,
          elementId: `mega-menu-col-${colIdx}-link-${linkIdx}`,
        });
      });
    });
    if (cta) {
      items.push({ type: "cta", columnIndex: -1, elementId: "mega-menu-cta" });
    }
    return items;
  }, [columns, cta]);

  const clearOpenTimeout = React.useCallback(() => {
    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current);
      openTimeoutRef.current = null;
    }
  }, []);

  const clearCloseTimeout = React.useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, []);

  const openMenu = React.useCallback(() => {
    clearCloseTimeout();
    openTimeoutRef.current = setTimeout(() => {
      setIsOpen(true);
      setFocusedIndex(-1);
      onOpen?.();
      openTimeoutRef.current = null;
    }, 150);
  }, [clearCloseTimeout, onOpen]);

  const closeMenu = React.useCallback(() => {
    clearOpenTimeout();
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
      setFocusedIndex(-1);
      onClose?.();
      closeTimeoutRef.current = null;
    }, 120);
  }, [clearOpenTimeout, onClose]);

  /** Sync focus to DOM element by index */
  React.useEffect(() => {
    if (!isOpen || focusedIndex < 0) return;
    const item = focusableItems[focusedIndex];
    if (!item) return;
    if (item.type === "trigger") {
      triggerRef.current?.focus();
      return;
    }
    if (item.type === "cta") {
      panelRef.current?.querySelector<HTMLElement>(`#${item.elementId}`)?.focus();
      return;
    }
    const el = document.getElementById(item.elementId);
    if (el) el.focus();
  }, [isOpen, focusedIndex, focusableItems]);

  const handleTriggerKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        if (!isOpen) setFocusedIndex(0);
      }
      if (e.key === "ArrowDown" && isOpen) {
        e.preventDefault();
        setFocusedIndex((i) => Math.min(i + 1, focusableItems.length - 1));
      }
      if (e.key === "Escape") {
        e.preventDefault();
        closeMenu();
        triggerRef.current?.focus();
      }
    },
    [isOpen, focusableItems.length, closeMenu]
  );

  const handlePanelKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setFocusedIndex((i) => Math.min(i + 1, focusableItems.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocusedIndex((i) => Math.max(i - 1, 0));
      }
      if (e.key === "Escape") {
        e.preventDefault();
        closeMenu();
        triggerRef.current?.focus();
      }
    },
    [focusableItems.length, closeMenu]
  );

  const isDark = theme === "dark";

  return (
    <nav
      className={cn("relative inline-block", className)}
      aria-label="Mega menu"
      onMouseEnter={openMenu}
      onMouseLeave={closeMenu}
    >
      <button
        ref={triggerRef}
        id="mega-menu-trigger"
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-controls="mega-menu-panel"
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleTriggerKeyDown}
        onFocus={openMenu}
        className={cn(
          "inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500",
          isDark
            ? "text-gray-200 hover:bg-white/10 hover:text-white"
            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        )}
      >
        {triggerLabel}
        <ChevronDown
          className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")}
          aria-hidden
        />
      </button>

      <div
        id="mega-menu-panel"
        ref={panelRef}
        role="menu"
        aria-orientation="vertical"
        aria-label="Menu"
        hidden={!isOpen}
        onKeyDown={handlePanelKeyDown}
        className={cn(
          "absolute top-full z-50 mt-1 min-w-[280px] rounded-xl border shadow-lg transition-opacity duration-150",
          "md:min-w-[560px] lg:min-w-[720px]",
          align === "left" && "left-0",
          align === "right" && "right-0",
          align === "center" && "left-1/2 -translate-x-1/2",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
          isDark
            ? "border-gray-700 bg-gray-900"
            : "border-gray-200 bg-white"
        )}
        style={{ visibility: isOpen ? "visible" : "hidden" }}
      >
        <div className="p-4 md:p-5">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {columns.map((column, idx) => (
              <MegaMenuColumnBlock
                key={column.header}
                column={column}
                columnIndex={idx}
                onLinkSelect={onLinkSelect}
                theme={theme}
                linkIdPrefix="mega-menu"
              />
            ))}
          </div>
          {cta && (
            <div className="mt-4 border-t pt-4 sm:border-gray-200 lg:border-gray-700">
              {cta.href ? (
                <Button
                  id="mega-menu-cta"
                  variant={cta.variant ?? "primary"}
                  size="sm"
                  asChild
                  className="w-full sm:w-auto"
                >
                  <a href={cta.href}>{cta.label}</a>
                </Button>
              ) : (
                <Button
                  id="mega-menu-cta"
                  variant={cta.variant ?? "primary"}
                  size="sm"
                  onClick={cta.onClick}
                  className="w-full sm:w-auto"
                >
                  {cta.label}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

MegaMenuMultiColumnDropdown.displayName = "MegaMenuMultiColumnDropdown";

export default MegaMenuMultiColumnDropdown;

