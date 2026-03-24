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
 * Icon map for shortcuts.
 */
const SHORTCUT_ICON_MAP: Record<string, IconComponent> = {
  "new-project": FilePlusIcon,
  "quick-search": MagnifyingGlassIcon,
  "launch-center": RocketIcon,
  "sync-files": UploadIcon,
  "export-data": DownloadIcon,
  preferences: GearIcon,
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
 * Reorders items by moving one id before another id.
 * @param items - current item list
 * @param activeId - dragged item id
 * @param targetId - drop target item id
 * @returns reordered array
 */
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
          return (
            <Button
              key={action.id}
              variant="default"
              size="xl"
              className="h-20 justify-between rounded-xl px-5 text-left font-semibold shadow-md shadow-black/5"
              onClick={action.onClick}
            >
              <span className="inline-flex items-center gap-2">
                <Icon className="h-5 w-5 shrink-0" aria-hidden />
                <span>{action.label}</span>
              </span>
              <span className="rounded-md border border-white/30 bg-white/10 px-2 py-1 text-xs font-medium">
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
 * Default section rendering draggable shortcuts grid.
 */
function DashboardShortcutsGridSection({
  shortcuts,
  draggingId,
  onDragStart,
  onDrop,
  onDragEnd,
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
                    "rounded-xl border border-border/60 bg-background/80 p-4 text-left shadow-sm transition-all",
                    "hover:border-border hover:bg-muted/40 hover:shadow-md",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    isDragging && "scale-[0.98] opacity-70",
                  )}
                  aria-label={`${shortcut.label} shortcut`}
                >
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-foreground">{shortcut.label}</p>
                    {shortcut.description && (
                      <p className="text-sm text-muted-foreground">{shortcut.description}</p>
                    )}
                  </div>
                  <div className="mt-4 inline-flex items-center rounded-md border border-border/70 bg-muted/50 px-2 py-1 text-xs font-medium text-muted-foreground">
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
function DashboardShortcutsPage({
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
      const filteredPrevious = prev.filter((item) => byId.has(item.id));
      const appended = shortcuts.filter((item) => !filteredPrevious.some((current) => current.id === item.id));
      return [...filteredPrevious, ...appended];
    });
  }, [shortcuts]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) {
        return;
      }

      const parsed = JSON.parse(raw) as string[];
      if (!Array.isArray(parsed)) {
        return;
      }

      const shortcutMap = new Map(shortcuts.map((item) => [item.id, item]));
      const fromStorage = parsed
        .map((id) => shortcutMap.get(id))
        .filter((item): item is ShortcutItem => item !== undefined);
      const remaining = shortcuts.filter((item) => !parsed.includes(item.id));
      setOrderedShortcuts([...fromStorage, ...remaining]);
    } catch {
      setOrderedShortcuts(shortcuts);
    }
  }, [shortcuts, storageKey]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const ids = orderedShortcuts.map((shortcut) => shortcut.id);
    window.localStorage.setItem(storageKey, JSON.stringify(ids));
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
    return () => {
      window.removeEventListener("keydown", handleKeyboardShortcut);
    };
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
        />
      )}
      {footer ?? <DashboardShortcutsFooter text={footerText} />}
    </DashboardShortcutsLayout>
  );
}

export { DashboardShortcutsPage };
export default DashboardShortcutsPage;
export {
  DashboardShortcutsLayout,
  DashboardShortcutsHeader,
  DashboardShortcutsActionsSection,
  DashboardShortcutsGridSection,
  DashboardShortcutsFooter,
};
