/**
 * @file index.tsx
 * @description Dashboard Shortcuts Page components for docs, implemented in the docs UI layer.
 * Provides composable building blocks for layout, header, action buttons, shortcuts grid, and footer.
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
import { cn } from "@site/src/utils/cn";
import { Button } from "../button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../card";

/**
 * Action item shown in the top shortcuts bar.
 */
export interface DashboardAction {
  /** Stable unique action id. */
  id: string;
  /** Button label. */
  label: string;
  /** Single key hint shown in the chip, e.g. "C". */
  shortcutHint: string;
  /** Optional click callback. */
  onClick?: () => void;
}

/**
 * Draggable shortcut tile item.
 */
export interface ShortcutItem {
  /** Stable unique id used by reorder and persistence logic. */
  id: string;
  /** Shortcut tile label. */
  label: string;
  /** Optional supporting description text. */
  description?: string;
  /** Keyboard hint shown in tile chip. */
  shortcutHint: string;
  /** Optional click callback for tile activation. */
  onTrigger?: () => void;
}

/**
 * Layout component props.
 */
export interface DashboardShortcutsLayoutProps {
  /** Child nodes to render inside the dashboard shell. */
  children: React.ReactNode;
  /** Optional root class name. */
  className?: string;
}

/**
 * Header section props.
 */
export interface DashboardShortcutsHeaderProps {
  /** Header title. */
  title?: string;
  /** Header description text. */
  description?: string;
}

/**
 * Top actions section props.
 */
export interface DashboardShortcutsActionsSectionProps {
  /** Action buttons list. */
  actions: DashboardAction[];
}

/**
 * Shortcuts grid section props.
 */
export interface DashboardShortcutsGridSectionProps {
  /** Ordered shortcut items. */
  shortcuts: ShortcutItem[];
  /** Current dragging item id. */
  draggingId: string | null;
  /** Called when drag starts on an item. */
  onDragStart: (id: string) => void;
  /** Called when an item is dropped on a target. */
  onDrop: (targetId: string) => void;
  /** Called when drag interaction ends. */
  onDragEnd: () => void;
}

/**
 * Footer section props.
 */
export interface DashboardShortcutsFooterProps {
  /** Footer text. */
  text?: string;
}

type IconComponent = React.ElementType<{ className?: string; "aria-hidden"?: boolean }>;

const ACTION_ICON_MAP: Record<string, IconComponent> = {
  create: FilePlusIcon,
  upload: UploadIcon,
  download: DownloadIcon,
  share: Share1Icon,
};

const SHORTCUT_ICON_MAP: Record<string, IconComponent> = {
  "new-project": FilePlusIcon,
  "quick-search": MagnifyingGlassIcon,
  "launch-center": RocketIcon,
  "sync-files": UploadIcon,
  "export-data": DownloadIcon,
  preferences: GearIcon,
};

const ACTION_COLOR_MAP: Record<
  string,
  { button: string; keyHint: string; iconWrap: string }
> = {
  create: {
    button:
      "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border border-primary/30 hover:from-primary/90 hover:to-primary/75",
    keyHint: "border-primary-foreground/40 bg-primary-foreground/15 text-primary-foreground",
    iconWrap: "bg-primary-foreground/15 text-primary-foreground",
  },
  upload: {
    button:
      "bg-gradient-to-r from-success to-success/80 text-success-foreground border border-success/30 hover:from-success/90 hover:to-success/75",
    keyHint: "border-success-foreground/40 bg-success-foreground/15 text-success-foreground",
    iconWrap: "bg-success-foreground/15 text-success-foreground",
  },
  download: {
    button:
      "bg-gradient-to-r from-info to-info/80 text-info-foreground border border-info/30 hover:from-info/90 hover:to-info/75",
    keyHint: "border-info-foreground/40 bg-info-foreground/15 text-info-foreground",
    iconWrap: "bg-info-foreground/15 text-info-foreground",
  },
  share: {
    button:
      "bg-gradient-to-r from-warning to-warning/80 text-warning-foreground border border-warning/35 hover:from-warning/90 hover:to-warning/75",
    keyHint: "border-warning-foreground/40 bg-warning-foreground/15 text-warning-foreground",
    iconWrap: "bg-warning-foreground/15 text-warning-foreground",
  },
};

const SHORTCUT_ACCENT_MAP: Record<
  string,
  { tile: string; iconWrap: string; keyHint: string }
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
 * Hook props for composable state and keyboard interactions.
 */
export interface UseDashboardShortcutsStateOptions {
  /** Initial/controlled shortcut list to seed ordering. */
  shortcuts: ShortcutItem[];
  /** Action buttons used for key mapping. */
  actions: DashboardAction[];
  /** Browser storage key used for persisted ordering. */
  storageKey?: string;
}

/**
 * Return value of useDashboardShortcutsState hook.
 */
export interface UseDashboardShortcutsStateResult {
  /** Ordered shortcuts list for rendering. */
  orderedShortcuts: ShortcutItem[];
  /** Current dragging id. */
  draggingId: string | null;
  /** Start drag with item id. */
  handleDragStart: (id: string) => void;
  /** Drop on target item id to reorder. */
  handleDrop: (targetId: string) => void;
  /** Reset drag state on drag end. */
  handleDragEnd: () => void;
}

function getActionIcon(id: string): IconComponent {
  return ACTION_ICON_MAP[id] ?? FilePlusIcon;
}

function getShortcutIcon(id: string): IconComponent {
  return SHORTCUT_ICON_MAP[id] ?? RocketIcon;
}

function getActionColors(id: string): { button: string; keyHint: string; iconWrap: string } {
  return (
    ACTION_COLOR_MAP[id] ?? {
      button:
        "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border border-primary/30 hover:from-primary/90 hover:to-primary/75",
      keyHint: "border-primary-foreground/40 bg-primary-foreground/15 text-primary-foreground",
      iconWrap: "bg-primary-foreground/15 text-primary-foreground",
    }
  );
}

function getShortcutColors(id: string): { tile: string; iconWrap: string; keyHint: string } {
  return (
    SHORTCUT_ACCENT_MAP[id] ?? {
      tile: "border-border/60 bg-background/80 hover:bg-muted/40",
      iconWrap: "bg-primary/10 text-primary",
      keyHint: "border-border/70 bg-muted/50 text-muted-foreground",
    }
  );
}

function reorderById(items: ShortcutItem[], activeId: string, targetId: string): ShortcutItem[] {
  const sourceIndex = items.findIndex((item) => item.id === activeId);
  const targetIndex = items.findIndex((item) => item.id === targetId);
  if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex) {
    return items;
  }

  const next = [...items];
  const [moved] = next.splice(sourceIndex, 1);
  next.splice(targetIndex, 0, moved);
  return next;
}

/**
 * Composable state hook handling keyboard shortcuts and persisted drag-drop order.
 */
function useDashboardShortcutsState({
  shortcuts,
  actions,
  storageKey = "docs.dashboard-shortcuts-page.order",
}: UseDashboardShortcutsStateOptions): UseDashboardShortcutsStateResult {
  const [orderedShortcuts, setOrderedShortcuts] = useState<ShortcutItem[]>(shortcuts);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const actionByShortcutKey = useMemo(() => {
    const map = new Map<string, DashboardAction>();
    actions.forEach((action) => {
      map.set(action.shortcutHint.toLowerCase(), action);
    });
    return map;
  }, [actions]);

  const shortcutByShortcutKey = useMemo(() => {
    const map = new Map<string, ShortcutItem>();
    orderedShortcuts.forEach((shortcut) => {
      map.set(shortcut.shortcutHint.toLowerCase(), shortcut);
    });
    return map;
  }, [orderedShortcuts]);

  useEffect(() => {
    setOrderedShortcuts((prev) => {
      const byId = new Map(shortcuts.map((item) => [item.id, item]));
      const filtered = prev.filter((item) => byId.has(item.id));
      const appended = shortcuts.filter((item) => !filtered.some((existing) => existing.id === item.id));
      return [...filtered, ...appended];
    });
  }, [shortcuts]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) {
        return;
      }
      const parsed = JSON.parse(raw) as string[];
      if (!Array.isArray(parsed)) {
        return;
      }
      const byId = new Map(shortcuts.map((item) => [item.id, item]));
      const fromStorage = parsed.map((id) => byId.get(id)).filter((item): item is ShortcutItem => item !== undefined);
      const remaining = shortcuts.filter((item) => !parsed.includes(item.id));
      setOrderedShortcuts([...fromStorage, ...remaining]);
    } catch {
      setOrderedShortcuts(shortcuts);
    }
  }, [shortcuts, storageKey]);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(orderedShortcuts.map((item) => item.id)));
  }, [orderedShortcuts, storageKey]);

  const handleKeyboardShortcut = useCallback(
    (event: KeyboardEvent) => {
      const target = event.target;
      if (target instanceof HTMLElement) {
        const tag = target.tagName.toLowerCase();
        if (tag === "input" || tag === "textarea" || target.isContentEditable) {
          return;
        }
      }

      const key = event.key.toLowerCase();
      const actionMatch = actionByShortcutKey.get(key);
      if (actionMatch) {
        actionMatch.onClick?.();
        return;
      }

      const shortcutMatch = shortcutByShortcutKey.get(key);
      if (shortcutMatch) {
        shortcutMatch.onTrigger?.();
      }
    },
    [actionByShortcutKey, shortcutByShortcutKey],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyboardShortcut);
    return () => window.removeEventListener("keydown", handleKeyboardShortcut);
  }, [handleKeyboardShortcut]);

  const handleDrop = useCallback((targetId: string) => {
    setOrderedShortcuts((prev) => {
      if (!draggingId) {
        return prev;
      }
      return reorderById(prev, draggingId, targetId);
    });
    setDraggingId(null);
  }, [draggingId]);

  const handleDragStart = useCallback((id: string) => {
    setDraggingId(id);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggingId(null);
  }, []);

  return {
    orderedShortcuts,
    draggingId,
    handleDragStart,
    handleDrop,
    handleDragEnd,
  };
}

/**
 * Outer layout shell for the shortcuts page.
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
 * Header section with title and description.
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
 * Top section rendering large action buttons.
 */
function DashboardShortcutsActionsSection({ actions }: DashboardShortcutsActionsSectionProps) {
  return (
    <section aria-label="Large action buttons">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map((action) => {
          const Icon = getActionIcon(action.id);
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
 * Section rendering customisable shortcut cards in a grid.
 */
function DashboardShortcutsGridSection({
  shortcuts,
  draggingId,
  onDragStart,
  onDrop,
  onDragEnd,
}: DashboardShortcutsGridSectionProps) {
  return (
    <section aria-label="Customisable shortcut grid">
      <Card variant="premium">
        <CardHeader variant="compact">
          <CardTitle size="md">Customizable shortcuts</CardTitle>
          <CardDescription>
            Drag cards to reorder. Your layout is persisted in local storage.
          </CardDescription>
        </CardHeader>
        <CardContent variant="compact" className="pt-0">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {shortcuts.map((shortcut) => {
              const Icon = getShortcutIcon(shortcut.id);
              const isDragging = draggingId === shortcut.id;
              const colors = getShortcutColors(shortcut.id);
              return (
                <button
                  key={shortcut.id}
                  type="button"
                  draggable
                  onDragStart={() => onDragStart(shortcut.id)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => onDrop(shortcut.id)}
                  onDragEnd={onDragEnd}
                  onClick={shortcut.onTrigger}
                  className={cn(
                    "rounded-xl border p-4 text-left shadow-sm transition-all",
                    "hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    colors.tile,
                    isDragging && "scale-[0.98] opacity-70",
                  )}
                  aria-label={`${shortcut.label} shortcut`}
                >
                  <div className={cn("mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg", colors.iconWrap)}>
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-foreground">{shortcut.label}</p>
                    {shortcut.description ? (
                      <p className="text-sm text-muted-foreground">{shortcut.description}</p>
                    ) : null}
                  </div>
                  <div className={cn("mt-4 inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium", colors.keyHint)}>
                    Key: {shortcut.shortcutHint}
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

/**
 * Footer area for usage tips or status text.
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

export {
  DashboardShortcutsLayout,
  DashboardShortcutsHeader,
  DashboardShortcutsActionsSection,
  DashboardShortcutsGridSection,
  DashboardShortcutsFooter,
  useDashboardShortcutsState,
};
