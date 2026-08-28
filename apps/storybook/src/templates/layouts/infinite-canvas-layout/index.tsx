import * as React from "react";
import { Button } from "../../../components/button";
import { Plus, Minus, RotateCcw } from "lucide-react";
import { cn } from "../../../../utils/cn";

/* -------------------------------------------------------------------------- */
/*                              TYPES & INTERFACES                            */
/* -------------------------------------------------------------------------- */

/** Pan/zoom state of the canvas, in the canvas's own (untransformed) coordinate space. */
export interface CanvasViewport {
  x: number;
  y: number;
  zoom: number;
}

/** Restricts `value` to the inclusive `[min, max]` range. */
function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Props for the {@link CanvasNode} helper - a single item absolutely positioned on the
 * infinite canvas at world coordinates `(x, y)`.
 */
export interface CanvasNodeProps {
  x: number;
  y: number;
  width?: number | string;
  height?: number | string;
  className?: string;
  children: React.ReactNode;
}

/**
 * Positions its children at a fixed `(x, y)` point in the canvas's world space. Use one per
 * item placed on an {@link InfiniteCanvasLayout} - panning/zooming the canvas moves and scales
 * every `CanvasNode` together, since they're rendered inside the same transformed layer.
 */
export const CanvasNode: React.FC<CanvasNodeProps> = ({ x, y, width, height, className, children }) => (
  <div className={cn("absolute", className)} style={{ left: x, top: y, width, height }}>
    {children}
  </div>
);
CanvasNode.displayName = "CanvasNode";

/**
 * Props for the {@link InfiniteCanvasLayout} template.
 *
 * @property header - Custom node rendered at the start of the top toolbar (e.g. a logo/title).
 * @property actions - Optional node rendered at the end of the top toolbar.
 * @property children - Canvas content, typically one or more {@link CanvasNode} elements.
 * @property viewport - Controlled pan/zoom state. Provide alongside `onViewportChange` to
 * drive the canvas externally; omit to let the layout manage its own state.
 * @property defaultViewport - Initial pan/zoom state when uncontrolled, and the state the
 * "Reset view" control returns to. Defaults to `{ x: 0, y: 0, zoom: 1 }`.
 * @property onViewportChange - Called whenever the viewport changes, whether controlled or not.
 * @property minZoom - Minimum zoom factor. Default `0.25`.
 * @property maxZoom - Maximum zoom factor. Default `2.5`.
 * @property showGrid - Whether to render the background dot grid. Default `true`.
 * @property gridSize - Spacing between grid dots, in canvas world units. Default `32`.
 * @property showControls - Whether to render the floating zoom in/out/reset control panel.
 * Default `true`.
 * @property className - Class name for the root container.
 */
export interface InfiniteCanvasLayoutProps {
  header?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  viewport?: CanvasViewport;
  defaultViewport?: CanvasViewport;
  onViewportChange?: (viewport: CanvasViewport) => void;
  minZoom?: number;
  maxZoom?: number;
  showGrid?: boolean;
  gridSize?: number;
  showControls?: boolean;
  className?: string;
}

const DEFAULT_VIEWPORT: CanvasViewport = { x: 0, y: 0, zoom: 1 };

// A zoom of exactly 0 (or less) isn't just visually degenerate (scale(0), zero-size grid) - the
// wheel handler's zoom-to-cursor math divides by the current zoom, so it would produce
// Infinity/NaN and permanently corrupt the viewport. This floor applies regardless of what
// minZoom a consumer configures.
const MIN_SAFE_ZOOM = 0.01;

/* -------------------------------------------------------------------------- */
/*                              MAIN COMPONENT                                */
/* -------------------------------------------------------------------------- */

/**
 * InfiniteCanvasLayout is a pannable, zoomable workspace shell - the shape behind
 * whiteboard/canvas tools (Figma, Miro, tldraw). An optional top toolbar sits above a
 * full-bleed canvas; content is placed via {@link CanvasNode} at fixed world coordinates,
 * and the whole layer pans/zooms together via drag, wheel/trackpad, keyboard, or the
 * floating zoom controls.
 */
export const InfiniteCanvasLayout: React.FC<InfiniteCanvasLayoutProps> = ({
  header,
  actions,
  children,
  viewport,
  defaultViewport = DEFAULT_VIEWPORT,
  onViewportChange,
  minZoom = 0.25,
  maxZoom = 2.5,
  showGrid = true,
  gridSize = 32,
  showControls = true,
  className,
}) => {
  const isControlled = viewport !== undefined;
  const [internalViewport, setInternalViewport] = React.useState<CanvasViewport>(defaultViewport);
  const rawViewport = isControlled ? viewport : internalViewport;
  const safeMinZoom = Math.max(minZoom, MIN_SAFE_ZOOM);

  // Normalize whichever viewport is currently in effect before it's used for rendering math or
  // stored for event handlers to read. A consumer-supplied `viewport` prop (controlled mode)
  // bypasses updateViewport's own clamping entirely, so without this, an out-of-range or zero
  // zoom would reach the CSS transform/grid sizing - and the divide-by-zero in the wheel-zoom
  // math - unclamped.
  const currentViewport: CanvasViewport = {
    ...rawViewport,
    zoom: clamp(rawViewport.zoom, safeMinZoom, maxZoom),
  };

  // Read the latest viewport (and callback) inside event handlers without making them - or the
  // effects that attach them - depend on it. Consumers commonly pass an inline function for
  // onViewportChange, which would otherwise get a new identity every render and tear down and
  // reattach the wheel listener on every unrelated re-render.
  const viewportRef = React.useRef(currentViewport);
  viewportRef.current = currentViewport;
  const onViewportChangeRef = React.useRef(onViewportChange);
  onViewportChangeRef.current = onViewportChange;

  const updateViewport = React.useCallback(
    (updater: (prev: CanvasViewport) => CanvasViewport) => {
      const next = updater(viewportRef.current);
      const clamped: CanvasViewport = { ...next, zoom: clamp(next.zoom, safeMinZoom, maxZoom) };
      if (!isControlled) {
        setInternalViewport(clamped);
      }
      onViewportChangeRef.current?.(clamped);
    },
    [isControlled, safeMinZoom, maxZoom]
  );

  const zoomIn = React.useCallback(
    () => updateViewport((prev) => ({ ...prev, zoom: prev.zoom * 1.2 })),
    [updateViewport]
  );
  const zoomOut = React.useCallback(
    () => updateViewport((prev) => ({ ...prev, zoom: prev.zoom / 1.2 })),
    [updateViewport]
  );
  const resetView = React.useCallback(
    () => updateViewport(() => defaultViewport),
    [updateViewport, defaultViewport]
  );

  const surfaceRef = React.useRef<HTMLDivElement>(null);

  // Wheel must call preventDefault() to stop the page from scrolling/zooming - React's JSX
  // onWheel is passive by default, so a native listener with { passive: false } is required.
  React.useEffect(() => {
    const surface = surfaceRef.current;
    if (!surface) return;

    const handleWheel = (event: WheelEvent): void => {
      event.preventDefault();
      const rect = surface.getBoundingClientRect();
      const pointerX = event.clientX - rect.left;
      const pointerY = event.clientY - rect.top;

      if (event.ctrlKey || event.metaKey) {
        updateViewport((prev) => {
          const nextZoom = clamp(prev.zoom * (1 - event.deltaY * 0.01), minZoom, maxZoom);
          const worldX = (pointerX - prev.x) / prev.zoom;
          const worldY = (pointerY - prev.y) / prev.zoom;
          return { x: pointerX - worldX * nextZoom, y: pointerY - worldY * nextZoom, zoom: nextZoom };
        });
      } else {
        updateViewport((prev) => ({ ...prev, x: prev.x - event.deltaX, y: prev.y - event.deltaY }));
      }
    };

    surface.addEventListener("wheel", handleWheel, { passive: false });
    return () => surface.removeEventListener("wheel", handleWheel);
  }, [updateViewport, minZoom, maxZoom]);

  const panStateRef = React.useRef<{ pointerId: number; lastX: number; lastY: number } | null>(null);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>): void => {
    // Only start a pan when the drag begins on empty canvas background, not on a CanvasNode
    // (or anything else) rendered above it - so content stays independently interactive.
    if (event.target !== event.currentTarget || event.button !== 0) return;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    panStateRef.current = { pointerId: event.pointerId, lastX: event.clientX, lastY: event.clientY };
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>): void => {
    const state = panStateRef.current;
    if (!state || state.pointerId !== event.pointerId) return;
    const dx = event.clientX - state.lastX;
    const dy = event.clientY - state.lastY;
    state.lastX = event.clientX;
    state.lastY = event.clientY;
    updateViewport((prev) => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>): void => {
    if (panStateRef.current?.pointerId === event.pointerId) {
      panStateRef.current = null;
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    const step = 40;
    switch (event.key) {
      case "ArrowUp":
        updateViewport((prev) => ({ ...prev, y: prev.y + step }));
        event.preventDefault();
        break;
      case "ArrowDown":
        updateViewport((prev) => ({ ...prev, y: prev.y - step }));
        event.preventDefault();
        break;
      case "ArrowLeft":
        updateViewport((prev) => ({ ...prev, x: prev.x + step }));
        event.preventDefault();
        break;
      case "ArrowRight":
        updateViewport((prev) => ({ ...prev, x: prev.x - step }));
        event.preventDefault();
        break;
      case "+":
      case "=":
        zoomIn();
        event.preventDefault();
        break;
      case "-":
      case "_":
        zoomOut();
        event.preventDefault();
        break;
      case "0":
        resetView();
        event.preventDefault();
        break;
      default:
        break;
    }
  };

  return (
    <div className={cn("flex h-screen w-full flex-col bg-[var(--background)] text-[var(--foreground)]", className)}>
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
        ref={surfaceRef}
        className="relative flex-1 touch-none overflow-hidden"
        style={
          showGrid
            ? {
                backgroundImage: "radial-gradient(circle, var(--border) 1px, transparent 1px)",
                backgroundSize: `${gridSize * currentViewport.zoom}px ${gridSize * currentViewport.zoom}px`,
                backgroundPosition: `${currentViewport.x}px ${currentViewport.y}px`,
              }
            : undefined
        }
        role="group"
        aria-label="Infinite canvas. Drag to pan, scroll to pan, ctrl or cmd plus scroll to zoom. Focus and use arrow keys to pan, plus and minus to zoom, zero to reset the view."
        tabIndex={0}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={handleKeyDown}
      >
        <div
          className="absolute left-0 top-0"
          style={{
            transform: `translate(${currentViewport.x}px, ${currentViewport.y}px) scale(${currentViewport.zoom})`,
            transformOrigin: "0 0",
          }}
        >
          {children}
        </div>

        {showControls && (
          <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-1 rounded-lg border border-[var(--border)] bg-[var(--background)] p-1 shadow-lg">
            <Button variant="outline" size="icon" aria-label="Zoom in" onClick={zoomIn}>
              <Plus className="h-4 w-4" />
            </Button>
            <div className="text-center text-xs text-[var(--muted-foreground)]">
              {Math.round(currentViewport.zoom * 100)}%
            </div>
            <Button variant="outline" size="icon" aria-label="Zoom out" onClick={zoomOut}>
              <Minus className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" aria-label="Reset view" onClick={resetView}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

InfiniteCanvasLayout.displayName = "InfiniteCanvasLayout";

export default InfiniteCanvasLayout;
