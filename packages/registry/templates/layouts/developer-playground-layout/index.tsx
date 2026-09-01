import * as React from "react";
import { ChevronDown, ChevronUp, Terminal, FileCode, Trash2 } from "lucide-react";
import { cn } from "../../../utils/cn";

/* -------------------------------------------------------------------------- */
/*                              TYPES & INTERFACES                            */
/* -------------------------------------------------------------------------- */

/** A single file listed in the playground's tab strip. */
export interface PlaygroundFile {
  name: string;
  language?: string;
  icon?: React.ReactNode;
}

export type PlaygroundOrientation = "horizontal" | "vertical";

/**
 * Props for the {@link DeveloperPlaygroundLayout} template.
 *
 * @property header - Custom node rendered at the start of the top toolbar (e.g. a logo/title).
 * @property actions - Optional node rendered at the end of the top toolbar (e.g. a "Run" button).
 * @property files - Files listed in the tab strip above the editor. Omit to hide the tab strip
 * entirely (e.g. for a single-file playground).
 * @property activeFileName - Controlled active file name. Provide alongside `onActiveFileChange`
 * to drive the active tab externally; omit to let the layout manage its own state.
 * @property onActiveFileChange - Called whenever the active file changes, whether controlled or
 * not.
 * @property editor - Editor content for the currently active file. This component only provides
 * the shell (tabs, pane, split) - swapping the actual editor content per file is the consumer's
 * responsibility (typically driven by `activeFileName`).
 * @property preview - Live preview content, rendered in the other pane of the split.
 * @property consoleContent - Content for the collapsible console panel at the bottom. Omit to
 * hide the console entirely.
 * @property onClearConsole - Called when the console's clear button is clicked. The layout does
 * not own the console's contents (`consoleContent` is an opaque node), so clearing is delegated
 * entirely to the consumer via this callback. The clear button only renders when `consoleContent`
 * is provided.
 * @property showConsole - Controlled console-expanded state. Provide alongside
 * `onShowConsoleChange` to drive it externally; omit to let the layout manage its own state.
 * @property defaultShowConsole - Initial console-expanded state when uncontrolled. Default `true`.
 * @property onShowConsoleChange - Called whenever the console's expanded state changes, whether
 * controlled or not.
 * @property orientation - Split direction between the editor and preview panes. Default
 * `"horizontal"` (side by side).
 * @property splitPercentage - Controlled editor-pane size, as a percentage of the split axis.
 * Provide alongside `onSplitChange` to drive it externally; omit to let the layout manage its
 * own state.
 * @property defaultSplitPercentage - Initial editor-pane percentage when uncontrolled. Default
 * `50`.
 * @property onSplitChange - Called whenever the split changes, whether controlled or not.
 * @property minSplitPercentage - Minimum editor-pane percentage. Default `20`.
 * @property maxSplitPercentage - Maximum editor-pane percentage. Default `80`.
 * @property className - Class name for the root container. The root fills its parent's height
 * (`h-full`), not the viewport - give it a sized ancestor, or pass a height utility here (e.g.
 * `h-screen`) to make it fill the viewport directly.
 */
export interface DeveloperPlaygroundLayoutProps {
  header?: React.ReactNode;
  actions?: React.ReactNode;
  files?: PlaygroundFile[];
  activeFileName?: string;
  onActiveFileChange?: (name: string) => void;
  editor: React.ReactNode;
  preview?: React.ReactNode;
  consoleContent?: React.ReactNode;
  onClearConsole?: () => void;
  showConsole?: boolean;
  defaultShowConsole?: boolean;
  onShowConsoleChange?: (show: boolean) => void;
  orientation?: PlaygroundOrientation;
  splitPercentage?: number;
  defaultSplitPercentage?: number;
  onSplitChange?: (percentage: number) => void;
  minSplitPercentage?: number;
  maxSplitPercentage?: number;
  className?: string;
}

const DEFAULT_SPLIT = 50;
const SPLIT_KEYBOARD_STEP = 5;

/** Restricts `value` to the inclusive `[min, max]` range. */
function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/* -------------------------------------------------------------------------- */
/*                              MAIN COMPONENT                                */
/* -------------------------------------------------------------------------- */

/**
 * DeveloperPlaygroundLayout is a code-playground shell - the shape behind in-browser coding
 * environments (CodeSandbox, StackBlitz, CodePen). A file tab strip sits above an editor pane, a
 * draggable/keyboard-resizable divider splits it from a live preview pane, and an optional
 * collapsible console sits along the bottom.
 */
export const DeveloperPlaygroundLayout: React.FC<DeveloperPlaygroundLayoutProps> = ({
  header,
  actions,
  files,
  activeFileName,
  onActiveFileChange,
  editor,
  preview,
  consoleContent,
  onClearConsole,
  showConsole,
  defaultShowConsole = true,
  onShowConsoleChange,
  orientation = "horizontal",
  splitPercentage,
  defaultSplitPercentage = DEFAULT_SPLIT,
  onSplitChange,
  minSplitPercentage = 20,
  maxSplitPercentage = 80,
  className,
}) => {
  const isActiveFileControlled = activeFileName !== undefined;
  const [internalActiveFile, setInternalActiveFile] = React.useState<string | undefined>(files?.[0]?.name);
  const currentActiveFile = isActiveFileControlled ? activeFileName : internalActiveFile;

  const selectFile = React.useCallback(
    (name: string) => {
      if (!isActiveFileControlled) setInternalActiveFile(name);
      onActiveFileChange?.(name);
    },
    [isActiveFileControlled, onActiveFileChange]
  );

  const isConsoleControlled = showConsole !== undefined;
  const [internalShowConsole, setInternalShowConsole] = React.useState(defaultShowConsole);
  const currentShowConsole = isConsoleControlled ? showConsole : internalShowConsole;

  const toggleConsole = React.useCallback(() => {
    const next = !currentShowConsole;
    if (!isConsoleControlled) setInternalShowConsole(next);
    onShowConsoleChange?.(next);
  }, [currentShowConsole, isConsoleControlled, onShowConsoleChange]);

  // Guards against an inverted range (max < min would freeze the split at a fixed value), the
  // same defensive pattern used for zoom bounds elsewhere in this template family.
  const safeMin = Number.isFinite(minSplitPercentage) ? minSplitPercentage : 20;
  const safeMax = Number.isFinite(maxSplitPercentage) ? Math.max(maxSplitPercentage, safeMin) : Math.max(safeMin, 80);

  const isSplitControlled = splitPercentage !== undefined;
  const [internalSplit, setInternalSplit] = React.useState(clamp(defaultSplitPercentage, safeMin, safeMax));
  const rawSplit = isSplitControlled ? splitPercentage : internalSplit;
  const currentSplit = Number.isFinite(rawSplit) ? clamp(rawSplit, safeMin, safeMax) : DEFAULT_SPLIT;

  const updateSplit = React.useCallback(
    (next: number) => {
      const clamped = clamp(next, safeMin, safeMax);
      if (!isSplitControlled) setInternalSplit(clamped);
      onSplitChange?.(clamped);
    },
    [isSplitControlled, safeMin, safeMax, onSplitChange]
  );

  const splitContainerRef = React.useRef<HTMLDivElement>(null);
  const dragPointerIdRef = React.useRef<number | null>(null);

  const handleDividerPointerDown = (event: React.PointerEvent<HTMLDivElement>): void => {
    if (event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    dragPointerIdRef.current = event.pointerId;
  };

  const handleDividerPointerMove = (event: React.PointerEvent<HTMLDivElement>): void => {
    if (dragPointerIdRef.current !== event.pointerId) return;
    const container = splitContainerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const percentage =
      orientation === "horizontal"
        ? ((event.clientX - rect.left) / rect.width) * 100
        : ((event.clientY - rect.top) / rect.height) * 100;
    updateSplit(percentage);
  };

  const handleDividerPointerUp = (event: React.PointerEvent<HTMLDivElement>): void => {
    if (dragPointerIdRef.current === event.pointerId) {
      dragPointerIdRef.current = null;
    }
  };

  const handleDividerKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    const decreaseKey = orientation === "horizontal" ? "ArrowLeft" : "ArrowUp";
    const increaseKey = orientation === "horizontal" ? "ArrowRight" : "ArrowDown";
    switch (event.key) {
      case decreaseKey:
        updateSplit(currentSplit - SPLIT_KEYBOARD_STEP);
        event.preventDefault();
        break;
      case increaseKey:
        updateSplit(currentSplit + SPLIT_KEYBOARD_STEP);
        event.preventDefault();
        break;
      case "Home":
        updateSplit(safeMin);
        event.preventDefault();
        break;
      case "End":
        updateSplit(safeMax);
        event.preventDefault();
        break;
      default:
        break;
    }
  };

  return (
    <div className={cn("flex h-full min-h-0 w-full flex-col bg-[var(--background)] text-[var(--foreground)]", className)}>
      {(header || actions) && (
        <header
          className="z-10 flex h-14 w-full shrink-0 items-center gap-3 border-b border-[var(--border)] bg-[var(--background)] px-4"
          role="banner"
        >
          {header && <div className="flex shrink-0 items-center">{header}</div>}
          {actions && <div className="ml-auto flex shrink-0 items-center gap-2">{actions}</div>}
        </header>
      )}

      <div
        ref={splitContainerRef}
        className={cn("flex flex-1 overflow-hidden", orientation === "vertical" ? "flex-col" : "flex-col md:flex-row")}
      >
        <div className="flex min-h-0 min-w-0 flex-col overflow-hidden" style={{ flexBasis: `${currentSplit}%` }}>
          {files && files.length > 0 && (
            <div role="tablist" aria-label="Files" className="flex shrink-0 overflow-x-auto border-b border-[var(--border)]">
              {files.map((file) => {
                const isActive = file.name === currentActiveFile;
                return (
                  <button
                    key={file.name}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => selectFile(file.name)}
                    className={cn(
                      "flex shrink-0 items-center gap-1.5 border-r border-[var(--border)] px-3 py-2 text-sm",
                      isActive
                        ? "bg-[var(--background)] text-[var(--foreground)]"
                        : "bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                    )}
                  >
                    {file.icon ?? <FileCode className="h-3.5 w-3.5" aria-hidden="true" />}
                    {file.name}
                  </button>
                );
              })}
            </div>
          )}
          <div className="min-h-0 flex-1 overflow-auto">{editor}</div>
        </div>

        <div
          role="separator"
          aria-orientation={orientation === "horizontal" ? "vertical" : "horizontal"}
          aria-label="Resize editor and preview panes"
          aria-valuenow={Math.round(currentSplit)}
          aria-valuemin={Math.round(safeMin)}
          aria-valuemax={Math.round(safeMax)}
          tabIndex={0}
          className={cn(
            "shrink-0 touch-none bg-[var(--border)] transition-colors hover:bg-[var(--primary)] focus-visible:outline-none focus-visible:bg-[var(--primary)]",
            orientation === "horizontal" ? "hidden w-1 cursor-col-resize md:block" : "h-1 cursor-row-resize"
          )}
          onPointerDown={handleDividerPointerDown}
          onPointerMove={handleDividerPointerMove}
          onPointerUp={handleDividerPointerUp}
          onPointerCancel={handleDividerPointerUp}
          onKeyDown={handleDividerKeyDown}
        />

        <div className="min-h-0 min-w-0 flex-1 overflow-auto">{preview}</div>
      </div>

      {consoleContent && (
        <div className="shrink-0 border-t border-[var(--border)] bg-[var(--background)]">
          <div className="flex items-center justify-between px-3 py-1.5">
            <div className="flex items-center gap-1.5 text-xs font-medium text-[var(--muted-foreground)]">
              <Terminal className="h-3.5 w-3.5" aria-hidden="true" />
              Console
            </div>
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                aria-label="Clear console"
                onClick={() => onClearConsole?.()}
                className="rounded p-1 text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label={currentShowConsole ? "Collapse console" : "Expand console"}
                aria-expanded={currentShowConsole}
                onClick={toggleConsole}
                className="rounded p-1 text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]"
              >
                {currentShowConsole ? (
                  <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
          {currentShowConsole && <div className="max-h-40 overflow-auto border-t border-[var(--border)]">{consoleContent}</div>}
        </div>
      )}
    </div>
  );
};

DeveloperPlaygroundLayout.displayName = "DeveloperPlaygroundLayout";

export default DeveloperPlaygroundLayout;
