import * as React from "react";
import { Button } from "../../../components/button";
import { Plus, Minus, RotateCcw, X, Pencil } from "lucide-react";
import { cn } from "../../../../utils/cn";

/* -------------------------------------------------------------------------- */
/*                              TYPES & INTERFACES                            */
/* -------------------------------------------------------------------------- */

/** Pan/zoom state of the workflow canvas, in the canvas's own (untransformed) coordinate space. */
export interface WorkflowViewport {
  x: number;
  y: number;
  zoom: number;
}

/** Restricts `value` to the inclusive `[min, max]` range. */
function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export type WorkflowNodeStatus = "idle" | "running" | "success" | "error";

/**
 * A single node placed on the workflow canvas at world coordinates `(x, y)`. Ports render at a
 * fixed vertical offset from the top edge (matching the header row's height), so edge geometry
 * never depends on a node's rendered content height.
 */
export interface WorkflowNodeData {
  id: string;
  x: number;
  y: number;
  width?: number;
  title: string;
  icon?: React.ReactNode;
  status?: WorkflowNodeStatus;
  content?: React.ReactNode;
  hasInput?: boolean;
  hasOutput?: boolean;
}

/** A directed connection between one node's output port and another node's input port. */
export interface WorkflowEdgeData {
  id: string;
  source: string;
  target: string;
  label?: string;
}

/** An entry in the node palette sidebar - a node type consumers can add to the canvas. */
export interface WorkflowPaletteItem {
  type: string;
  label: string;
  icon?: React.ReactNode;
  description?: string;
}

/**
 * Props for the {@link WorkflowBuilderLayout} template.
 *
 * @property header - Custom node rendered at the start of the top toolbar (e.g. a logo/title).
 * @property actions - Optional node rendered at the end of the top toolbar.
 * @property paletteItems - Node types listed in the left sidebar. Omit (or pass an empty array)
 * to hide the sidebar entirely.
 * @property onPaletteItemSelect - Called when a palette item is clicked (accessible alternative
 * to dragging it onto the canvas).
 * @property onPaletteItemDrop - Called with the dropped item and the world-space drop position
 * when a palette item is dragged onto the canvas.
 * @property showPalette - Whether to render the palette sidebar when `paletteItems` is non-empty.
 * Default `true`.
 * @property nodes - The nodes currently on the canvas. This component is fully controlled: wire
 * `onNodesChange` to persist moves, or nodes won't visually update while dragged.
 * @property edges - Connections between nodes, rendered as curved lines between ports.
 * @property onNodesChange - Called with the next `nodes` array after a drag or keyboard nudge.
 * @property onNodeDelete - Called with a node's id when Delete/Backspace is pressed while it's
 * focused.
 * @property onConnect - Called when a drag from one node's output port is released over another
 * node's input port.
 * @property selectedNodeId - Controlled selected node id. Provide alongside `onNodeSelect` to
 * drive selection externally; omit to let the layout manage its own state.
 * @property onNodeSelect - Called whenever the selected node changes, whether controlled or not.
 * @property inspector - Content rendered in the right panel while a node is selected (e.g. a
 * form for editing the selected node).
 * @property showNodeEditButton - Whether each node renders a pencil icon that selects it (and
 * thus opens `inspector`) without starting a drag. Default `true`; set to `false` when no
 * `inspector` is wired up, so nodes don't show an icon that has nothing to open.
 * @property viewport - Controlled pan/zoom state. Provide alongside `onViewportChange` to drive
 * the canvas externally; omit to let the layout manage its own state.
 * @property defaultViewport - Initial pan/zoom state when uncontrolled, and the state the
 * "Reset view" control returns to. Defaults to `{ x: 0, y: 0, zoom: 1 }`.
 * @property onViewportChange - Called whenever the viewport changes, whether controlled or not.
 * @property minZoom - Minimum zoom factor. Default `0.25`.
 * @property maxZoom - Maximum zoom factor. Default `2.5`.
 * @property showGrid - Whether to render the background dot grid. Default `true`.
 * @property gridSize - Spacing between grid dots, in canvas world units. Default `32`.
 * @property showControls - Whether to render the floating zoom in/out/reset control panel.
 * Default `true`.
 * @property className - Class name for the root container. The root fills its parent's height
 * (`h-full`), not the viewport - give it a sized ancestor, or pass a height utility here (e.g.
 * `h-screen`) to make it fill the viewport directly.
 */
export interface WorkflowBuilderLayoutProps {
  header?: React.ReactNode;
  actions?: React.ReactNode;
  paletteItems?: WorkflowPaletteItem[];
  onPaletteItemSelect?: (item: WorkflowPaletteItem) => void;
  onPaletteItemDrop?: (item: WorkflowPaletteItem, position: { x: number; y: number }) => void;
  showPalette?: boolean;
  nodes: WorkflowNodeData[];
  edges?: WorkflowEdgeData[];
  onNodesChange?: (nodes: WorkflowNodeData[]) => void;
  onNodeDelete?: (id: string) => void;
  onConnect?: (connection: { source: string; target: string }) => void;
  selectedNodeId?: string | null;
  onNodeSelect?: (id: string | null) => void;
  inspector?: React.ReactNode;
  showNodeEditButton?: boolean;
  viewport?: WorkflowViewport;
  defaultViewport?: WorkflowViewport;
  onViewportChange?: (viewport: WorkflowViewport) => void;
  minZoom?: number;
  maxZoom?: number;
  showGrid?: boolean;
  gridSize?: number;
  showControls?: boolean;
  className?: string;
}

const DEFAULT_VIEWPORT: WorkflowViewport = { x: 0, y: 0, zoom: 1 };

// Floors zoom regardless of consumer-configured minZoom - the wheel handler's zoom-to-cursor
// math divides by zoom, so 0 (or less) would produce Infinity/NaN and corrupt the viewport.
const MIN_SAFE_ZOOM = 0.01;

const DEFAULT_NODE_WIDTH = 220;
const NODE_HEADER_HEIGHT = 40;
const PORT_HIT_RADIUS = 24;
const NODE_KEYBOARD_STEP = 10;
const NODE_KEYBOARD_STEP_LARGE = 40;
const PALETTE_DRAG_MIME = "application/workflow-node-type";

/**
 * Replaces non-finite x/y/zoom with safe fallbacks, then clamps zoom to `[minZoom, maxZoom]`.
 * NaN otherwise propagates into everything derived from the viewport (CSS transform, refs,
 * `onViewportChange`), since NaN pollutes every calculation that touches it.
 */
function normalizeViewport(viewport: WorkflowViewport, minZoom: number, maxZoom: number): WorkflowViewport {
  const x = Number.isFinite(viewport.x) ? viewport.x : DEFAULT_VIEWPORT.x;
  const y = Number.isFinite(viewport.y) ? viewport.y : DEFAULT_VIEWPORT.y;
  const zoom = Number.isFinite(viewport.zoom) ? viewport.zoom : DEFAULT_VIEWPORT.zoom;
  return { x, y, zoom: clamp(zoom, minZoom, maxZoom) };
}

const STATUS_DOT_CLASSES: Record<WorkflowNodeStatus, string> = {
  idle: "bg-[var(--muted-foreground)]",
  running: "bg-[var(--primary)] animate-pulse",
  success: "bg-[var(--success)]",
  error: "bg-[var(--destructive)]",
};

/** World-space position of a node's input (left edge) or output (right edge) port. */
function getPortPosition(node: WorkflowNodeData, side: "input" | "output"): { x: number; y: number } {
  const width = node.width ?? DEFAULT_NODE_WIDTH;
  return { x: side === "input" ? node.x : node.x + width, y: node.y + NODE_HEADER_HEIGHT / 2 };
}

/** A horizontal cubic-bezier path between two ports, curved outward proportionally to distance. */
function buildEdgePath(source: { x: number; y: number }, target: { x: number; y: number }): string {
  const curvature = Math.max(Math.abs(target.x - source.x) / 2, 40);
  return `M ${source.x},${source.y} C ${source.x + curvature},${source.y} ${target.x - curvature},${target.y} ${target.x},${target.y}`;
}

interface DragState {
  nodeId: string;
  pointerId: number;
  startClientX: number;
  startClientY: number;
  startX: number;
  startY: number;
}

interface ConnectingState {
  sourceId: string;
  // `null` marks a keyboard-initiated connection - pointer move/up handlers compare against a
  // real pointerId, so they naturally no-op against this without a separate branch.
  pointerId: number | null;
  x: number;
  y: number;
}

/* -------------------------------------------------------------------------- */
/*                              MAIN COMPONENT                                */
/* -------------------------------------------------------------------------- */

/**
 * WorkflowBuilderLayout is a node-and-connection workspace shell - the shape behind visual
 * automation/workflow tools (n8n, Zapier, Node-RED). A node palette sits on the left, an
 * optional inspector panel on the right, and a pannable/zoomable canvas in between where nodes
 * are placed, dragged, and wired together by dragging from an output port to an input port.
 */
export const WorkflowBuilderLayout: React.FC<WorkflowBuilderLayoutProps> = ({
  header,
  actions,
  paletteItems,
  onPaletteItemSelect,
  onPaletteItemDrop,
  showPalette = true,
  nodes,
  edges = [],
  onNodesChange,
  onNodeDelete,
  onConnect,
  selectedNodeId,
  onNodeSelect,
  inspector,
  showNodeEditButton = true,
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
  const isViewportControlled = viewport !== undefined;
  const [internalViewport, setInternalViewport] = React.useState<WorkflowViewport>(defaultViewport);
  const rawViewport = isViewportControlled ? viewport : internalViewport;

  // Guards against non-finite bounds (propagate NaN through clamp) and an inverted range
  // (maxZoom < minZoom would freeze zoom at a fixed value).
  const safeMinZoom = Number.isFinite(minZoom) ? Math.max(minZoom, MIN_SAFE_ZOOM) : MIN_SAFE_ZOOM;
  const safeMaxZoom = Number.isFinite(maxZoom)
    ? Math.max(maxZoom, safeMinZoom)
    : Math.max(safeMinZoom, DEFAULT_VIEWPORT.zoom);

  const currentViewport: WorkflowViewport = normalizeViewport(rawViewport, safeMinZoom, safeMaxZoom);

  // Lets event handlers read the latest viewport/callback without depending on them, so an
  // inline onViewportChange doesn't tear down and reattach the wheel listener every render.
  const viewportRef = React.useRef(currentViewport);
  viewportRef.current = currentViewport;
  const onViewportChangeRef = React.useRef(onViewportChange);
  onViewportChangeRef.current = onViewportChange;

  const updateViewport = React.useCallback(
    (updater: (prev: WorkflowViewport) => WorkflowViewport) => {
      const next = updater(viewportRef.current);
      const clamped = normalizeViewport(next, safeMinZoom, safeMaxZoom);
      if (!isViewportControlled) {
        setInternalViewport(clamped);
      }
      onViewportChangeRef.current?.(clamped);
    },
    [isViewportControlled, safeMinZoom, safeMaxZoom]
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

  const isSelectionControlled = selectedNodeId !== undefined;
  const [internalSelectedId, setInternalSelectedId] = React.useState<string | null>(null);
  const currentSelectedId = isSelectionControlled ? selectedNodeId : internalSelectedId;
  const selectNode = React.useCallback(
    (id: string | null) => {
      if (!isSelectionControlled) setInternalSelectedId(id);
      onNodeSelect?.(id);
    },
    [isSelectionControlled, onNodeSelect]
  );

  const nodeById = React.useMemo(() => new Map(nodes.map((node) => [node.id, node])), [nodes]);
  const selectedNode = currentSelectedId ? (nodeById.get(currentSelectedId) ?? null) : null;

  const surfaceRef = React.useRef<HTMLDivElement>(null);
  const dragStateRef = React.useRef<DragState | null>(null);
  const inputPortRefs = React.useRef(new Map<string, HTMLDivElement>());
  const [connecting, setConnecting] = React.useState<ConnectingState | null>(null);

  // Colons from useId() are stripped since this feeds an SVG url(#id) reference, where they're
  // unreliable across browsers.
  const arrowMarkerId = `workflow-arrow-${React.useId().replace(/:/g, "")}`;

  // React's JSX onWheel is passive by default (can't preventDefault), so a native listener
  // with { passive: false } is used instead to stop page scroll/zoom.
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
          const nextZoom = clamp(prev.zoom * (1 - event.deltaY * 0.01), safeMinZoom, safeMaxZoom);
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
  }, [updateViewport, safeMinZoom, safeMaxZoom]);

  const panStateRef = React.useRef<{ pointerId: number; lastX: number; lastY: number } | null>(null);

  const handleSurfacePointerDown = (event: React.PointerEvent<HTMLDivElement>): void => {
    // Only pan when the drag starts on empty background, not a node, so nodes stay
    // independently draggable/connectable.
    if (event.target !== event.currentTarget || event.button !== 0) return;
    event.preventDefault();
    // preventDefault() also suppresses default click-to-focus, so this restores it for
    // keyboard pan/zoom.
    event.currentTarget.focus();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    panStateRef.current = { pointerId: event.pointerId, lastX: event.clientX, lastY: event.clientY };
  };

  const handleSurfacePointerMove = (event: React.PointerEvent<HTMLDivElement>): void => {
    const state = panStateRef.current;
    if (!state || state.pointerId !== event.pointerId) return;
    const dx = event.clientX - state.lastX;
    const dy = event.clientY - state.lastY;
    state.lastX = event.clientX;
    state.lastY = event.clientY;
    updateViewport((prev) => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
  };

  const handleSurfacePointerUp = (event: React.PointerEvent<HTMLDivElement>): void => {
    if (panStateRef.current?.pointerId === event.pointerId) {
      panStateRef.current = null;
    }
  };

  const handleSurfaceKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    // Ignores bubbled key events from a focused node (handled separately), except Escape -
    // cancelling a connection (started by a pointer drag, which never moves focus) shouldn't
    // depend on what currently has focus.
    if (event.target !== event.currentTarget && event.key !== "Escape") return;
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
      case "Escape":
        if (connecting) {
          setConnecting(null);
          event.preventDefault();
        }
        break;
      default:
        break;
    }
  };

  const handleNodeKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, node: WorkflowNodeData): void => {
    // Does not stopPropagation - handleSurfaceKeyDown's own target check already prevents
    // double-handling arrow keys, and letting other keys (e.g. Escape) bubble up still works.
    const step = event.shiftKey ? NODE_KEYBOARD_STEP_LARGE : NODE_KEYBOARD_STEP;
    const move = (dx: number, dy: number): void => {
      onNodesChange?.(nodes.map((n) => (n.id === node.id ? { ...n, x: n.x + dx, y: n.y + dy } : n)));
    };
    switch (event.key) {
      case "ArrowUp":
        move(0, -step);
        event.preventDefault();
        break;
      case "ArrowDown":
        move(0, step);
        event.preventDefault();
        break;
      case "ArrowLeft":
        move(-step, 0);
        event.preventDefault();
        break;
      case "ArrowRight":
        move(step, 0);
        event.preventDefault();
        break;
      case "Enter":
      case " ":
        selectNode(node.id);
        event.preventDefault();
        break;
      case "Delete":
      case "Backspace":
        onNodeDelete?.(node.id);
        event.preventDefault();
        break;
      default:
        break;
    }
  };

  const handleNodeHeaderPointerDown = (event: React.PointerEvent<HTMLDivElement>, node: WorkflowNodeData): void => {
    if (event.button !== 0) return;
    event.stopPropagation();
    event.preventDefault();
    // preventDefault() also suppresses default click-to-focus; the header itself isn't
    // focusable, so this focuses the node (closest ancestor role="group") instead.
    (event.currentTarget.closest('[role="group"]') as HTMLElement | null)?.focus();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    dragStateRef.current = {
      nodeId: node.id,
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startX: node.x,
      startY: node.y,
    };
  };

  const handleNodeHeaderPointerMove = (event: React.PointerEvent<HTMLDivElement>): void => {
    const state = dragStateRef.current;
    if (!state || state.pointerId !== event.pointerId) return;
    const zoom = currentViewport.zoom || 1;
    const dx = (event.clientX - state.startClientX) / zoom;
    const dy = (event.clientY - state.startClientY) / zoom;
    onNodesChange?.(
      nodes.map((n) => (n.id === state.nodeId ? { ...n, x: state.startX + dx, y: state.startY + dy } : n))
    );
  };

  const handleNodeHeaderPointerUp = (event: React.PointerEvent<HTMLDivElement>): void => {
    if (dragStateRef.current?.pointerId === event.pointerId) {
      dragStateRef.current = null;
    }
  };

  const handleOutputPointerDown = (event: React.PointerEvent<HTMLDivElement>, node: WorkflowNodeData): void => {
    if (event.button !== 0) return;
    event.stopPropagation();
    event.preventDefault();
    // preventDefault() also suppresses default click-to-focus. A port itself isn't focusable,
    // and a connection isn't owned by either node, so this focuses the canvas - otherwise
    // whatever had focus before (or nothing) would stay focused through and after the drag.
    surfaceRef.current?.focus();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    const outputPos = getPortPosition(node, "output");
    setConnecting({ sourceId: node.id, pointerId: event.pointerId, x: outputPos.x, y: outputPos.y });
  };

  const handleOutputPointerMove = (event: React.PointerEvent<HTMLDivElement>): void => {
    if (!connecting || connecting.pointerId !== event.pointerId) return;
    const surface = surfaceRef.current;
    if (!surface) return;
    const rect = surface.getBoundingClientRect();
    const worldX = (event.clientX - rect.left - currentViewport.x) / currentViewport.zoom;
    const worldY = (event.clientY - rect.top - currentViewport.y) / currentViewport.zoom;
    setConnecting((prev) => (prev && prev.pointerId === event.pointerId ? { ...prev, x: worldX, y: worldY } : prev));
  };

  const handleOutputPointerUp = (event: React.PointerEvent<HTMLDivElement>): void => {
    if (!connecting || connecting.pointerId !== event.pointerId) return;
    // Finds the nearest input port within range via geometry (rect centers) rather than
    // document.elementFromPoint, since the pointer capture on the output port means the
    // release target is always the output port itself, never whatever's underneath it.
    let targetId: string | null = null;
    // Strict `<` against the running minimum (not the fixed radius) so the first port
    // encountered wins an exact tie, while a port sitting exactly at PORT_HIT_RADIUS is still
    // selectable as the sole candidate.
    let closestDistance = Infinity;
    inputPortRefs.current.forEach((el, nodeId) => {
      if (nodeId === connecting.sourceId) return;
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distance = Math.hypot(event.clientX - centerX, event.clientY - centerY);
      if (distance <= PORT_HIT_RADIUS && distance < closestDistance) {
        closestDistance = distance;
        targetId = nodeId;
      }
    });
    if (targetId) {
      onConnect?.({ source: connecting.sourceId, target: targetId });
    }
    setConnecting(null);
  };

  const handleCanvasDragOver = (event: React.DragEvent<HTMLDivElement>): void => {
    if (!onPaletteItemDrop || !event.dataTransfer.types.includes(PALETTE_DRAG_MIME)) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  };

  const handleCanvasDrop = (event: React.DragEvent<HTMLDivElement>): void => {
    if (!onPaletteItemDrop) return;
    const type = event.dataTransfer.getData(PALETTE_DRAG_MIME);
    const item = paletteItems?.find((candidate) => candidate.type === type);
    const surface = surfaceRef.current;
    if (!type || !item || !surface) return;
    event.preventDefault();
    const rect = surface.getBoundingClientRect();
    const worldX = (event.clientX - rect.left - currentViewport.x) / currentViewport.zoom;
    const worldY = (event.clientY - rect.top - currentViewport.y) / currentViewport.zoom;
    onPaletteItemDrop(item, { x: worldX, y: worldY });
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

      <div className="flex flex-1 overflow-hidden">
        {showPalette && paletteItems && paletteItems.length > 0 && (
          <aside
            className="w-64 shrink-0 overflow-y-auto border-r border-[var(--border)] bg-[var(--background)] p-2"
            aria-label="Node palette"
          >
            <ul className="flex flex-col gap-1">
              {paletteItems.map((item) => (
                <li key={item.type}>
                  <button
                    type="button"
                    draggable={Boolean(onPaletteItemDrop)}
                    onDragStart={(event) => {
                      event.dataTransfer.setData(PALETTE_DRAG_MIME, item.type);
                      event.dataTransfer.effectAllowed = "copy";
                    }}
                    onClick={() => onPaletteItemSelect?.(item)}
                    className="flex w-full items-center gap-2 rounded-md p-2 text-left text-sm hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]"
                  >
                    {item.icon && <span className="shrink-0">{item.icon}</span>}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">{item.label}</span>
                      {item.description && (
                        <span className="block truncate text-xs text-[var(--muted-foreground)]">
                          {item.description}
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </aside>
        )}

        <div
          ref={surfaceRef}
          className="relative flex-1 touch-none select-none overflow-hidden"
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
          aria-label="Workflow canvas. Drag to pan, scroll to pan, ctrl or cmd plus scroll to zoom. Drag a node's header to move it, click its edit icon to select it, and drag from an output port to an input port to connect two nodes, or press Enter on an output port then Enter on an input port. Focus and use arrow keys to pan, plus and minus to zoom, zero to reset the view."
          tabIndex={0}
          onPointerDown={handleSurfacePointerDown}
          onPointerMove={handleSurfacePointerMove}
          onPointerUp={handleSurfacePointerUp}
          onPointerCancel={handleSurfacePointerUp}
          onKeyDown={handleSurfaceKeyDown}
          onDragOver={handleCanvasDragOver}
          onDrop={handleCanvasDrop}
        >
          <div
            className="absolute left-0 top-0"
            style={{
              transform: `translate(${currentViewport.x}px, ${currentViewport.y}px) scale(${currentViewport.zoom})`,
              transformOrigin: "0 0",
            }}
          >
            <svg className="pointer-events-none absolute left-0 top-0 overflow-visible" width={1} height={1}>
              <defs>
                <marker
                  id={arrowMarkerId}
                  viewBox="0 0 10 10"
                  refX={9}
                  refY={5}
                  markerWidth={7}
                  markerHeight={7}
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--border)" />
                </marker>
              </defs>
              {edges.map((edge) => {
                const sourceNode = nodeById.get(edge.source);
                const targetNode = nodeById.get(edge.target);
                if (!sourceNode || !targetNode) return null;
                const sourcePos = getPortPosition(sourceNode, "output");
                const targetPos = getPortPosition(targetNode, "input");
                return (
                  <g key={edge.id}>
                    <path
                      d={buildEdgePath(sourcePos, targetPos)}
                      stroke="var(--border)"
                      strokeWidth={2}
                      fill="none"
                      markerEnd={`url(#${arrowMarkerId})`}
                    />
                    {edge.label && (
                      <text
                        x={(sourcePos.x + targetPos.x) / 2}
                        y={(sourcePos.y + targetPos.y) / 2 - 6}
                        textAnchor="middle"
                        fontSize={11}
                        fill="var(--muted-foreground)"
                      >
                        {edge.label}
                      </text>
                    )}
                  </g>
                );
              })}
              {connecting &&
                (() => {
                  const sourceNode = nodeById.get(connecting.sourceId);
                  if (!sourceNode) return null;
                  const sourcePos = getPortPosition(sourceNode, "output");
                  return (
                    <path
                      d={buildEdgePath(sourcePos, { x: connecting.x, y: connecting.y })}
                      stroke="var(--primary)"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      fill="none"
                    />
                  );
                })()}
            </svg>

            {nodes.map((node) => {
              const isSelected = node.id === currentSelectedId;
              const width = node.width ?? DEFAULT_NODE_WIDTH;
              return (
                <div
                  key={node.id}
                  role="group"
                  aria-label={`${node.title} node${node.status ? `, status ${node.status}` : ""}${isSelected ? ", selected" : ""}`}
                  tabIndex={0}
                  className={cn(
                    "absolute rounded-lg border bg-[var(--background)] shadow-sm",
                    isSelected ? "border-[var(--primary)] ring-2 ring-[var(--primary)]" : "border-[var(--border)]"
                  )}
                  style={{ left: node.x, top: node.y, width }}
                  onKeyDown={(event) => handleNodeKeyDown(event, node)}
                >
                  {node.hasInput !== false && (
                    <div
                      ref={(el) => {
                        if (el) inputPortRefs.current.set(node.id, el);
                        else inputPortRefs.current.delete(node.id);
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label={`Connect to ${node.title} input`}
                      className="absolute -left-1.5 h-3 w-3 rounded-full border-2 border-[var(--background)] bg-[var(--muted-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      style={{ top: NODE_HEADER_HEIGHT / 2 - 6 }}
                      onKeyDown={(event) => {
                        if (event.key !== "Enter" && event.key !== " ") return;
                        if (!connecting || connecting.sourceId === node.id) return;
                        event.preventDefault();
                        onConnect?.({ source: connecting.sourceId, target: node.id });
                        setConnecting(null);
                      }}
                    />
                  )}

                  <div
                    className="flex h-10 cursor-grab items-center gap-2 rounded-t-lg border-b border-[var(--border)] px-3 active:cursor-grabbing"
                    onPointerDown={(event) => handleNodeHeaderPointerDown(event, node)}
                    onPointerMove={handleNodeHeaderPointerMove}
                    onPointerUp={handleNodeHeaderPointerUp}
                    onPointerCancel={handleNodeHeaderPointerUp}
                  >
                    {node.icon && <span className="shrink-0">{node.icon}</span>}
                    <span className="flex-1 truncate text-sm font-medium">{node.title}</span>
                    {node.status && (
                      <span
                        className={cn("h-2 w-2 shrink-0 rounded-full", STATUS_DOT_CLASSES[node.status])}
                        aria-hidden="true"
                      />
                    )}
                    {showNodeEditButton && (
                      <button
                        type="button"
                        aria-label={`Edit ${node.title}`}
                        className="shrink-0 rounded p-1 text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]"
                        onPointerDown={(event) => event.stopPropagation()}
                        onClick={(event) => {
                          event.stopPropagation();
                          selectNode(node.id);
                        }}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  {node.content && <div className="p-3 text-sm text-[var(--muted-foreground)]">{node.content}</div>}

                  {node.hasOutput !== false && (
                    <div
                      role="button"
                      tabIndex={0}
                      aria-label={`Connect ${node.title} to another node`}
                      className="absolute -right-1.5 h-3 w-3 cursor-crosshair rounded-full border-2 border-[var(--background)] bg-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      style={{ top: NODE_HEADER_HEIGHT / 2 - 6 }}
                      onPointerDown={(event) => handleOutputPointerDown(event, node)}
                      onPointerMove={handleOutputPointerMove}
                      onPointerUp={handleOutputPointerUp}
                      onPointerCancel={() => setConnecting(null)}
                      onKeyDown={(event) => {
                        if (event.key !== "Enter" && event.key !== " ") return;
                        event.preventDefault();
                        const outputPos = getPortPosition(node, "output");
                        setConnecting({ sourceId: node.id, pointerId: null, x: outputPos.x, y: outputPos.y });
                      }}
                    />
                  )}
                </div>
              );
            })}
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

        {selectedNode && inspector && (
          <aside
            className="w-80 shrink-0 overflow-y-auto border-l border-[var(--border)] bg-[var(--background)] p-4"
            aria-label={`Inspector for ${selectedNode.title}`}
          >
            <div className="mb-3 flex items-center justify-between gap-2">
              <h3 className="truncate text-sm font-semibold">{selectedNode.title}</h3>
              <Button variant="ghost" size="icon" aria-label="Close inspector" onClick={() => selectNode(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            {inspector}
          </aside>
        )}
      </div>
    </div>
  );
};

WorkflowBuilderLayout.displayName = "WorkflowBuilderLayout";

export default WorkflowBuilderLayout;
