/**
 * @file index.tsx
 * @description Dashboard Shortcuts Page template with large action buttons, shortcut grid,
 * recognisable Radix UI icons, keyboard hints, and persisted drag-and-drop customization.
 */

"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  DownloadIcon,
  FilePlusIcon,
  GearIcon,
  MagnifyingGlassIcon,
  RocketIcon,
  Share1Icon,
  UploadIcon,
} from "@radix-ui/react-icons";
import { cn } from "../../../../../utils/cn";
import { Button } from "../../../../components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/card";

/**
 * One-click dashboard action shown in the large action bar.
 */
export interface DashboardAction {
  /** Stable unique identifier. */
  id: string;
  /** User-facing label. */
  label: string;
  /** Keyboard hint shown in the UI, for example "C". */
  shortcutHint: string;
  /** Optional click callback. */
  onClick?: () => void;
}

/**
 * Config for a single draggable shortcut tile.
 */
export interface ShortcutItem {
  /** Stable unique identifier used for reordering/persistence. */
  id: string;
  /** User-facing shortcut title. */
  label: string;
  /** Optional supporting text. */
  description?: string;
  /** Keyboard hint shown in the tile. */
  shortcutHint: string;
  /** Optional click callback. */
  onTrigger?: () => void;
}

/**
 * Props for DashboardShortcutsPage.
 */
export interface DashboardShortcutsPageProps {
  /** Large action buttons shown at the top. */
  actions?: DashboardAction[];
  /** Draggable shortcuts rendered in a grid. */
  shortcuts?: ShortcutItem[];
  /** localStorage key used to persist shortcut order. */
  storageKey?: string;
  /** Optional extra class name for the page wrapper. */
  className?: string;
  /** Optional custom header node; overrides default header component. */
  header?: React.ReactNode;
  /** Optional custom actions section node; overrides default actions section. */
  actionsSection?: React.ReactNode;
  /** Optional custom shortcuts section node; overrides default shortcuts section. */
  shortcutsSection?: React.ReactNode;
  /** Optional custom footer node; overrides default footer component. */
  footer?: React.ReactNode;
  /** Optional footer text for the default footer. */
  footerText?: string;
}

type IconComponent = React.ElementType<{
  className?: string;
  "aria-hidden"?: boolean;
}>;

/**
 * Props for the visual layout wrapper.
 */
export interface DashboardShortcutsLayoutProps {
  /** Page content to render in the layout container. */
  children: React.ReactNode;
  /** Optional root class name. */
  className?: string;
}

/**
 * Props for the page header section.
 */
export interface DashboardShortcutsHeaderProps {
  /** Main heading text. */
  title?: string;
  /** Supporting description text. */
  description?: string;
}

/**
 * Props for the action buttons section.
 */
export interface DashboardShortcutsActionsSectionProps {
  /** Large action button items. */
  actions: DashboardAction[];
  /** Optional resolver for custom icons by action id. */
  resolveIcon?: (id: string) => IconComponent;
}

/**
 * Props for the customizable shortcuts section.
 */
export interface DashboardShortcutsGridSectionProps {
  /** Current ordered shortcuts to render. */
  shortcuts: ShortcutItem[];
  /** Currently dragged shortcut id. */
  draggingId: string | null;
  /** Drag start callback. */
  onDragStart: (id: string) => void;
  /** Drop callback. */
  onDrop: (targetId: string) => void;
  /** Drag end callback. */
  onDragEnd: () => void;
  /** Move a shortcut up by one position. */
  onMoveUp?: (id: string) => void;
  /** Move a shortcut down by one position. */
  onMoveDown?: (id: string) => void;
  /** Optional icon resolver for shortcut tiles. */
  resolveIcon?: (id: string) => IconComponent;
}

/**
 * Props for the page footer section.
 */
export interface DashboardShortcutsFooterProps {
  /** Footer text content. */
  text?: string;
}

/**
 * Default actions for the action button bar.
 */
const DEFAULT_ACTIONS: DashboardAction[] = [
  { id: "create", label: "Create", shortcutHint: "C" },
  { id: "upload", label: "Upload", shortcutHint: "U" },
  { id: "download", label: "Download", shortcutHint: "D" },
  { id: "share", label: "Share", shortcutHint: "S" },
];

/**
 * Default shortcuts shown in the reorderable grid.
 */
const DEFAULT_SHORTCUTS: ShortcutItem[] = [
  { id: "new-project", label: "New project", description: "Start from a template", shortcutHint: "N" },
  { id: "quick-search", label: "Quick search", description: "Find pages and assets fast", shortcutHint: "/" },
  { id: "launch-center", label: "Launch center", description: "Open deployment tools", shortcutHint: "L" },
  { id: "sync-files", label: "Sync files", description: "Upload and sync workspace files", shortcutHint: "Y" },
  { id: "export-data", label: "Export data", description: "Download reports and CSVs", shortcutHint: "E" },
  { id: "preferences", label: "Preferences", description: "Customize dashboard options", shortcutHint: "P" },
];

/**
 * Icon map for top-level actions.
 */
const ACTION_ICON_MAP: Record<string, IconComponent> = {
  create: FilePlusIcon,
  upload: UploadIcon,
  download: DownloadIcon,
  share: Share1Icon,
};

/**
 * Theme-safe color styles for action buttons.
 */
const ACTION_COLOR_MAP: Record<
  string,
  {
    button: string;
    keyHint: string;
    iconWrap: string;
  }
> = {
  create: {
    button:
      "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border border-primary/30 hover:from-primary/90 hover:to-primary/75",
    keyHint:
      "border-primary-foreground/40 bg-primary-foreground/15 text-primary-foreground",
    iconWrap: "bg-primary-foreground/15 text-primary-foreground",
  },
  upload: {
    button:
      "bg-gradient-to-r from-success to-success/80 text-success-foreground border border-success/30 hover:from-success/90 hover:to-success/75",
    keyHint:
      "border-success-foreground/40 bg-success-foreground/15 text-success-foreground",
    iconWrap: "bg-success-foreground/15 text-success-foreground",
  },
  download: {
    button:
      "bg-gradient-to-r from-info to-info/80 text-info-foreground border border-info/30 hover:from-info/90 hover:to-info/75",
    keyHint:
      "border-info-foreground/40 bg-info-foreground/15 text-info-foreground",
    iconWrap: "bg-info-foreground/15 text-info-foreground",
  },
  share: {
    button:
      "bg-gradient-to-r from-warning to-warning/80 text-warning-foreground border border-warning/35 hover:from-warning/90 hover:to-warning/75",
    keyHint:
      "border-warning-foreground/40 bg-warning-foreground/15 text-warning-foreground",
    iconWrap: "bg-warning-foreground/15 text-warning-foreground",
  },
};

/**
 * Icon map for shortcuts.
 */
const SHORTCUT_ICON_MAP: Record<string, IconComponent> = {
  "new-project": FilePlusIcon,
  "quick-search": MagnifyingGlassIcon,
  "launch-center": RocketIcon,
  "sync-files": UploadIcon,
  "export-data": DownloadIcon,
  "preferences": GearIcon,
};

/**
 * Theme-safe tile accent colors for shortcuts.
 */
const SHORTCUT_ACCENT_MAP: Record<
  string,
  {
    tile: string;
    iconWrap: string;
    keyHint: string;
  }
> = {
  "new-project": {
    tile: "border-primary/30 bg-primary/5 hover:bg-primary/10 dark:bg-primary/10 dark:hover:bg-primary/15",
    iconWrap: "bg-primary/15 text-primary dark:bg-primary/25",
    keyHint: "border-primary/40 bg-primary/10 text-primary dark:bg-primary/20",
  },
  "quick-search": {
    tile: "border-info/30 bg-info/5 hover:bg-info/10 dark:bg-info/10 dark:hover:bg-info/15",
    iconWrap: "bg-info/15 text-info dark:bg-info/25",
    keyHint: "border-info/40 bg-info/10 text-info dark:bg-info/20",
  },
  "launch-center": {
    tile: "border-purple-500/30 bg-purple-500/5 hover:bg-purple-500/10 dark:bg-purple-500/10 dark:hover:bg-purple-500/15",
    iconWrap: "bg-purple-600 text-white dark:bg-purple-500 dark:text-white",
    keyHint: "border-purple-600/60 bg-purple-600 text-white dark:border-purple-400/60 dark:bg-purple-500 dark:text-white",
  },
  "sync-files": {
    tile: "border-success/30 bg-success/5 hover:bg-success/10 dark:bg-success/10 dark:hover:bg-success/15",
    iconWrap: "bg-success/15 text-success dark:bg-success/25",
    keyHint: "border-success/40 bg-success/10 text-success dark:bg-success/20",
  },
  "export-data": {
    tile: "border-warning/30 bg-warning/5 hover:bg-warning/10 dark:bg-warning/10 dark:hover:bg-warning/15",
    iconWrap: "bg-warning/15 text-warning dark:bg-warning/25",
    keyHint: "border-warning/40 bg-warning/10 text-warning dark:bg-warning/20",
  },
  preferences: {
    tile: "border-muted-foreground/30 bg-muted/40 hover:bg-muted/60 dark:bg-muted/20 dark:hover:bg-muted/35",
    iconWrap: "border border-foreground/30 bg-background text-foreground dark:border-foreground/40 dark:bg-muted/50",
    keyHint: "border-muted-foreground/40 bg-muted/60 text-foreground dark:bg-muted/30",
  },
};

/**
 * Returns an icon component for a given action id.
 * @param id - action id
 * @returns matching icon component or fallback
 */
function getActionIcon(id: string): IconComponent {
  return ACTION_ICON_MAP[id] ?? FilePlusIcon;
}

/**
 * Returns an icon component for a given shortcut id.
 * @param id - shortcut id
 * @returns matching icon component or fallback
 */
function getShortcutIcon(id: string): IconComponent {
  return SHORTCUT_ICON_MAP[id] ?? RocketIcon;
}

/**
 * Returns the style object for an action button.
 * @param id - action id
 * @returns style classes for the action
 */
function getActionColors(id: string) {
  return (
    ACTION_COLOR_MAP[id] ?? {
      button:
        "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border border-primary/30 hover:from-primary/90 hover:to-primary/75",
      keyHint:
        "border-primary-foreground/40 bg-primary-foreground/15 text-primary-foreground",
      iconWrap: "bg-primary-foreground/15 text-primary-foreground",
    }
  );
}

/**
 * Returns the style object for a shortcut tile.
 * @param id - shortcut id
 * @returns style classes for the shortcut
 */
function getShortcutColors(id: string) {
  return (
    SHORTCUT_ACCENT_MAP[id] ?? {
      tile: "border-border/60 bg-background/80 hover:bg-muted/40",
      iconWrap: "bg-primary/10 text-primary",
      keyHint: "border-border/70 bg-muted/50 text-muted-foreground",
    }
  );
}

/**
 * Reorders an array of ids by moving one id before another.
 * @param ids - current id order
 * @param activeId - dragged id
 * @param targetId - drop target id
 * @returns reordered id list
 */
function reorderIds(ids: string[], activeId: string, targetId: string): string[] {
  const sourceIndex = ids.indexOf(activeId);
  const targetIndex = ids.indexOf(targetId);
  if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex) return ids;
  const next = [...ids];
  const [moved] = next.splice(sourceIndex, 1);
  next.splice(targetIndex, 0, moved);
  return next;
}

/**
 * Moves an id up/down by a delta within the list.
 * @param ids - current order
 * @param id - id to move
 * @param delta - -1 for up, +1 for down
 * @returns reordered ids
 */
function moveId(ids: string[], id: string, delta: -1 | 1): string[] {
  const index = ids.indexOf(id);
  if (index < 0) return ids;
  const nextIndex = index + delta;
  if (nextIndex < 0 || nextIndex >= ids.length) return ids;
  const next = [...ids];
  const tmp = next[index];
  next[index] = next[nextIndex];
  next[nextIndex] = tmp;
  return next;
}

/**
 * Creates a normalized order list from a stored order and the current shortcuts list.
 * - removes ids that no longer exist
 * - appends any new shortcut ids that are missing
 * @param storedOrder - stored id order (possibly stale)
 * @param shortcuts - current shortcuts list
 * @returns normalized order list
 */
function normalizeOrderIds(storedOrder: string[], shortcuts: ShortcutItem[]): string[] {
  const validIds = new Set(shortcuts.map((s) => s.id));
  const filtered = storedOrder.filter((id) => validIds.has(id));
  const missing = shortcuts.map((s) => s.id).filter((id) => !filtered.includes(id));
  return [...filtered, ...missing];
}

/**
 * Reads an order id list from localStorage, falling back to the given shortcuts list.
 * @param storageKey - localStorage key
 * @param shortcuts - current shortcuts list
 * @returns initial order ids
 */
function loadInitialOrderIds(storageKey: string, shortcuts: ShortcutItem[]): string[] {
  if (typeof window === "undefined") {
    return shortcuts.map((s) => s.id);
  }

  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return shortcuts.map((s) => s.id);
    const parsed = JSON.parse(raw) as string[];
    if (!Array.isArray(parsed)) return shortcuts.map((s) => s.id);
    return normalizeOrderIds(parsed, shortcuts);
  } catch {
    return shortcuts.map((s) => s.id);
  }
}

/**
 * Layout wrapper used by both the pre-composed page and custom composition.
 */
function DashboardShortcutsLayout({ children, className }: DashboardShortcutsLayoutProps) {
  return (
    <div
      className={cn(
        "relative min-h-screen overflow-hidden bg-gradient-to-br from-background via-background to-muted/40 p-4 text-foreground md:p-6",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -left-16 -top-24 h-56 w-56 rounded-full bg-gradient-to-br from-primary/25 via-cyan-400/15 to-transparent blur-3xl" />
        <div className="absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-gradient-to-tr from-purple-500/20 via-pink-500/10 to-transparent blur-3xl" />
      </div>
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-6">{children}</div>
    </div>
  );
}

/**
 * Default page header for Dashboard Shortcuts.
 */
function DashboardShortcutsHeader({
  title = "Dashboard Shortcuts Page",
  description = "Fast actions, keyboard-friendly shortcuts, and drag-and-drop customization.",
}: DashboardShortcutsHeaderProps) {
  return (
    <header className="flex flex-col gap-2">
      <h1 className="bg-gradient-to-r from-primary via-cyan-400 to-purple-500 bg-clip-text text-2xl font-bold tracking-tight text-transparent">
        {title}
      </h1>
      <p className="text-sm text-muted-foreground">{description}</p>
    </header>
  );
}

/**
 * Default section rendering large action buttons.
 */
function DashboardShortcutsActionsSection({
  actions,
  resolveIcon = getActionIcon,
}: DashboardShortcutsActionsSectionProps) {
  return (
    <section aria-label="Large action buttons">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map((action) => {
          const Icon = resolveIcon(action.id);
          const colors = getActionColors(action.id);
          return (
            <Button
              key={action.id}
              variant="none"
              size="xl"
              className={cn(
                "h-20 justify-between rounded-xl px-5 text-left text-base font-semibold leading-tight shadow-md shadow-black/10 transform-gpu",
                "transition-[background-color,color,border-color,filter] duration-300 ease-out motion-reduce:transition-none",
                "hover:brightness-[1.03] focus-visible:ring-offset-0",
                colors.button,
              )}
              onClick={action.onClick}
            >
              <span className="inline-flex min-w-0 flex-1 items-center gap-2">
                <span className={cn("inline-flex h-8 w-8 items-center justify-center rounded-md", colors.iconWrap)}>
                  <Icon className="h-5 w-5 shrink-0" aria-hidden />
                </span>
                <span className="truncate">{action.label}</span>
              </span>
              <span className={cn("shrink-0 rounded-md border px-2 py-1 text-[11px] font-medium", colors.keyHint)}>
                {action.shortcutHint}
              </span>
            </Button>
          );
        })}
      </div>
    </section>
  );
}

/**
 * Options for the shared dashboard shortcuts state hook.
 */
export interface UseDashboardShortcutsStateOptions {
  /** Action buttons used for keyboard shortcut mapping. */
  actions: DashboardAction[];
  /** Source shortcuts list used for ordering and rendering. */
  shortcuts: ShortcutItem[];
  /** localStorage key for persisted order. */
  storageKey: string;
  /** Enable global keyboard shortcuts. */
  enableKeyboardShortcuts?: boolean;
}

/**
 * Result for useDashboardShortcutsState.
 */
export interface UseDashboardShortcutsStateResult {
  /** Ordered shortcuts for rendering. */
  orderedShortcuts: ShortcutItem[];
  /** Current dragging id. */
  draggingId: string | null;
  /** Starts drag interaction. */
  handleDragStart: (id: string) => void;
  /** Drops on a target id to reorder. */
  handleDrop: (targetId: string) => void;
  /** Ends drag interaction. */
  handleDragEnd: () => void;
  /** Moves a shortcut up. */
  moveUp: (id: string) => void;
  /** Moves a shortcut down. */
  moveDown: (id: string) => void;
}

/**
 * Shared state hook for composable usage.
 * Handles:
 * - persisted ordering with localStorage (guarded)
 * - drag/drop reorder
 * - accessible move up/down reorder
 * - global keyboard shortcuts (optional)
 */
function useDashboardShortcutsState({
  actions,
  shortcuts,
  storageKey,
  enableKeyboardShortcuts = true,
}: UseDashboardShortcutsStateOptions): UseDashboardShortcutsStateResult {
  // SSR-safe: start with source order so server/client initial render match.
  const [orderIds, setOrderIds] = useState<string[]>(() => shortcuts.map((s) => s.id));
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const didHydrateRef = React.useRef(false);

  const normalizedOrderIds = useMemo(
    () => normalizeOrderIds(orderIds, shortcuts),
    [orderIds, shortcuts],
  );

  const orderedShortcuts = useMemo(() => {
    const byId = new Map(shortcuts.map((s) => [s.id, s]));
    return normalizedOrderIds
      .map((id) => byId.get(id))
      .filter((item): item is ShortcutItem => item !== undefined);
  }, [normalizedOrderIds, shortcuts]);

  const actionByShortcutKey = useMemo(() => {
    const map = new Map<string, DashboardAction>();
    actions.forEach((action) => map.set(action.shortcutHint.toLowerCase(), action));
    return map;
  }, [actions]);

  const shortcutByShortcutKey = useMemo(() => {
    const map = new Map<string, ShortcutItem>();
    orderedShortcuts.forEach((shortcut) => map.set(shortcut.shortcutHint.toLowerCase(), shortcut));
    return map;
  }, [orderedShortcuts]);

  // Hydrate from storage post-mount and when storageKey changes.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const initial = loadInitialOrderIds(storageKey, shortcuts);
    setOrderIds(initial);
    didHydrateRef.current = true;
  }, [storageKey, shortcuts]);

  // Persist order to storage (guarded) after hydration.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!didHydrateRef.current) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(normalizedOrderIds));
    } catch {
      // ignore storage failures (quota/private mode)
    }
  }, [normalizedOrderIds, storageKey]);

  const handleKeyboardShortcut = useCallback(
    (event: KeyboardEvent) => {
      if (!enableKeyboardShortcuts) return;
      if (event.repeat) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      const target = event.target;
      if (target instanceof HTMLElement) {
        const tag = target.tagName.toLowerCase();
        if (tag === "input" || tag === "textarea" || target.isContentEditable) return;
      }

      const key = event.key.toLowerCase();
      const actionMatch = actionByShortcutKey.get(key);
      if (actionMatch) {
        actionMatch.onClick?.();
        return;
      }

      const shortcutMatch = shortcutByShortcutKey.get(key);
      shortcutMatch?.onTrigger?.();
    },
    [actionByShortcutKey, enableKeyboardShortcuts, shortcutByShortcutKey],
  );

  useEffect(() => {
    if (!enableKeyboardShortcuts) return;
    window.addEventListener("keydown", handleKeyboardShortcut);
    return () => window.removeEventListener("keydown", handleKeyboardShortcut);
  }, [enableKeyboardShortcuts, handleKeyboardShortcut]);

  const handleDrop = useCallback(
    (targetId: string) => {
      if (!draggingId) return;
      setOrderIds((prev) => {
        const normalized = normalizeOrderIds(prev, shortcuts);
        const reordered = reorderIds(normalized, draggingId, targetId);
        return normalizeOrderIds(reordered, shortcuts);
      });
      setDraggingId(null);
    },
    [draggingId, shortcuts],
  );

  const handleDragStart = useCallback((id: string) => setDraggingId(id), []);
  const handleDragEnd = useCallback(() => setDraggingId(null), []);

  const moveUp = useCallback(
    (id: string) => {
      setOrderIds((prev) => {
        const normalized = normalizeOrderIds(prev, shortcuts);
        return normalizeOrderIds(moveId(normalized, id, -1), shortcuts);
      });
    },
    [shortcuts],
  );

  const moveDown = useCallback(
    (id: string) => {
      setOrderIds((prev) => {
        const normalized = normalizeOrderIds(prev, shortcuts);
        return normalizeOrderIds(moveId(normalized, id, 1), shortcuts);
      });
    },
    [shortcuts],
  );

  return {
    orderedShortcuts,
    draggingId,
    handleDragStart,
    handleDrop,
    handleDragEnd,
    moveUp,
    moveDown,
  };
}

/**
 * DashboardShortcutsPage component type with the state hook attached.
 * Allows keeping a single file export surface that remains Fast Refresh friendly.
 */
export type DashboardShortcutsPageComponent = ((
  props: DashboardShortcutsPageProps
) => React.JSX.Element) & {
  useDashboardShortcutsState: (options: UseDashboardShortcutsStateOptions) => UseDashboardShortcutsStateResult;
};

/**
 * Default section rendering draggable shortcuts grid.
 */
function DashboardShortcutsGridSection({
  shortcuts,
  draggingId,
  onDragStart,
  onDrop,
  onDragEnd,
  onMoveUp,
  onMoveDown,
  resolveIcon = getShortcutIcon,
}: DashboardShortcutsGridSectionProps) {
  return (
    <section aria-label="Customisable shortcut grid">
      <Card variant="premium">
        <CardHeader variant="compact">
          <CardTitle size="md">Customizable shortcuts</CardTitle>
          <CardDescription>
            Drag cards to reorder. Your layout is persisted for this browser session.
          </CardDescription>
        </CardHeader>
        <CardContent variant="compact" className="pt-0">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {shortcuts.map((shortcut) => {
              const Icon = resolveIcon(shortcut.id);
              const isDragging = draggingId === shortcut.id;
              const colors = getShortcutColors(shortcut.id);

              return (
                <div
                  key={shortcut.id}
                  className={cn(
                    "rounded-xl border p-4 text-left shadow-sm transition-all",
                    "hover:shadow-md",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    colors.tile,
                    isDragging && "scale-[0.98] opacity-70",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className={cn(
                        "inline-flex h-10 w-10 items-center justify-center rounded-lg",
                        colors.iconWrap,
                      )}
                    >
                      <Icon className="h-5 w-5" aria-hidden />
                    </div>

                    {(onMoveUp || onMoveDown) && (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className={cn(
                            "rounded-md border border-border/60 bg-background/60 px-2 py-1 text-xs text-foreground",
                            "hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          )}
                          onClick={() => onMoveUp?.(shortcut.id)}
                          aria-label={`Move ${shortcut.label} up`}
                        >
                          Up
                        </button>
                        <button
                          type="button"
                          className={cn(
                            "rounded-md border border-border/60 bg-background/60 px-2 py-1 text-xs text-foreground",
                            "hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          )}
                          onClick={() => onMoveDown?.(shortcut.id)}
                          aria-label={`Move ${shortcut.label} down`}
                        >
                          Down
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    draggable
                    onDragStart={() => onDragStart(shortcut.id)}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={() => onDrop(shortcut.id)}
                    onDragEnd={onDragEnd}
                    onClick={shortcut.onTrigger}
                    className="mt-3 block w-full text-left"
                    aria-label={`${shortcut.label} shortcut`}
                  >
                    <div className="space-y-1">
                      <p className="font-semibold text-foreground">{shortcut.label}</p>
                      {shortcut.description && (
                        <p className="text-sm text-muted-foreground">{shortcut.description}</p>
                      )}
                    </div>
                    <div
                      className={cn(
                        "mt-4 inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium",
                        colors.keyHint,
                      )}
                    >
                      Key: {shortcut.shortcutHint}
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

/**
 * Default page footer with usage guidance.
 */
function DashboardShortcutsFooter({
  text = "Tip: Use keyboard hints for faster navigation and drag shortcuts to match your workflow.",
}: DashboardShortcutsFooterProps) {
  return (
    <footer className="rounded-lg border border-border/60 bg-background/70 px-4 py-3 text-sm text-muted-foreground">
      {text}
    </footer>
  );
}

/**
 * Dashboard page for shortcuts and frequent actions.
 * Supports keyboard activation and persistent drag-drop customization.
 */
const DashboardShortcutsPage = function DashboardShortcutsPage({
  actions = DEFAULT_ACTIONS,
  shortcuts = DEFAULT_SHORTCUTS,
  storageKey = "storybook.dashboard-shortcuts-page.order",
  className,
  header,
  actionsSection,
  shortcutsSection,
  footer,
  footerText,
}: DashboardShortcutsPageProps) {
  const {
    orderedShortcuts,
    draggingId,
    handleDragStart,
    handleDrop,
    handleDragEnd,
    moveUp,
    moveDown,
  } = useDashboardShortcutsState({
    actions,
    shortcuts,
    storageKey,
  });

  return (
    <DashboardShortcutsLayout className={className}>
      {header ?? <DashboardShortcutsHeader />}
      {actionsSection ?? <DashboardShortcutsActionsSection actions={actions} />}
      {shortcutsSection ?? (
        <DashboardShortcutsGridSection
          shortcuts={orderedShortcuts}
          draggingId={draggingId}
          onDragStart={handleDragStart}
          onDrop={handleDrop}
          onDragEnd={handleDragEnd}
          onMoveUp={moveUp}
          onMoveDown={moveDown}
        />
      )}
      {footer ?? <DashboardShortcutsFooter text={footerText} />}
    </DashboardShortcutsLayout>
  );
} as DashboardShortcutsPageComponent;

DashboardShortcutsPage.useDashboardShortcutsState = useDashboardShortcutsState;


export default DashboardShortcutsPage;
export {
  DashboardShortcutsPage,
  DashboardShortcutsLayout,
  DashboardShortcutsHeader,
  DashboardShortcutsActionsSection,
  DashboardShortcutsGridSection,
  DashboardShortcutsFooter,
};
