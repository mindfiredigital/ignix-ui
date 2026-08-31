// workflow-builder-layout.test.tsx
import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

vi.mock("lucide-react", () => ({
  Plus: () => <div data-testid="plus-icon" />,
  Minus: () => <div data-testid="minus-icon" />,
  RotateCcw: () => <div data-testid="reset-icon" />,
  X: () => <div data-testid="close-icon" />,
  Pencil: () => <div data-testid="edit-icon" />,
}));

import { WorkflowBuilderLayout, type WorkflowNodeData, type WorkflowEdgeData } from ".";

function getSurface(container: HTMLElement): HTMLElement {
  return container.querySelector('[aria-label^="Workflow canvas"]') as HTMLElement;
}

function getNode(container: HTMLElement, title: string): HTMLElement {
  return Array.from(container.querySelectorAll('[role="group"]')).find((el) =>
    (el.getAttribute("aria-label") ?? "").startsWith(title)
  ) as HTMLElement;
}

// jsdom doesn't implement the PointerEvent constructor, so @testing-library's fireEvent.pointerX
// helpers silently fall back to a bare `Event` that drops clientX/clientY/pointerId entirely.
// Dispatching a MouseEvent (which jsdom does support, and which carries the same fields React's
// synthetic pointer events read) under the same "pointerdown"/"pointermove"/"pointerup" type
// names reaches the same onPointer* handlers with the properties intact.
function firePointer(
  el: Element,
  type: "pointerdown" | "pointermove" | "pointerup" | "pointercancel",
  init: { pointerId: number; clientX?: number; clientY?: number; button?: number }
): void {
  const event = new MouseEvent(type, {
    bubbles: true,
    cancelable: true,
    clientX: init.clientX ?? 0,
    clientY: init.clientY ?? 0,
    button: init.button ?? 0,
  });
  Object.defineProperty(event, "pointerId", { value: init.pointerId, configurable: true });
  act(() => {
    el.dispatchEvent(event);
  });
}

const NODES: WorkflowNodeData[] = [
  { id: "a", x: 0, y: 0, title: "Trigger" },
  { id: "b", x: 300, y: 0, title: "Action" },
];

const EDGES: WorkflowEdgeData[] = [{ id: "e1", source: "a", target: "b" }];

describe("WorkflowBuilderLayout", () => {
  describe("rendering", () => {
    it("renders nodes from the nodes prop", () => {
      render(<WorkflowBuilderLayout nodes={NODES} />);
      expect(screen.getByText("Trigger")).toBeInTheDocument();
      expect(screen.getByText("Action")).toBeInTheDocument();
    });

    it("renders header and actions when provided", () => {
      render(
        <WorkflowBuilderLayout nodes={NODES} header={<span>Logo</span>} actions={<button>Publish</button>} />
      );
      expect(screen.getByRole("banner")).toBeInTheDocument();
      expect(screen.getByText("Logo")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Publish" })).toBeInTheDocument();
    });

    it("omits the header entirely when neither header nor actions are provided", () => {
      render(<WorkflowBuilderLayout nodes={NODES} />);
      expect(screen.queryByRole("banner")).not.toBeInTheDocument();
    });

    it("renders an edge between two existing nodes", () => {
      const { container } = render(<WorkflowBuilderLayout nodes={NODES} edges={EDGES} />);
      expect(container.querySelector("svg path")).toBeInTheDocument();
    });

    it("skips an edge that references a non-existent node instead of crashing", () => {
      const badEdges: WorkflowEdgeData[] = [{ id: "e1", source: "a", target: "missing" }];
      expect(() => render(<WorkflowBuilderLayout nodes={NODES} edges={badEdges} />)).not.toThrow();
    });

    it("renders the node status dot when a status is provided", () => {
      const { container } = render(
        <WorkflowBuilderLayout nodes={[{ id: "a", x: 0, y: 0, title: "Trigger", status: "success" }]} />
      );
      const dot = container.querySelector('[aria-hidden="true"].rounded-full.h-2') as HTMLElement | null;
      expect(dot?.classList.contains("bg-[var(--success)]")).toBe(true);
    });
  });

  describe("palette", () => {
    it("renders palette items and fires onPaletteItemSelect on click", () => {
      const onSelect = vi.fn();
      render(
        <WorkflowBuilderLayout
          nodes={NODES}
          paletteItems={[{ type: "http", label: "HTTP Request" }]}
          onPaletteItemSelect={onSelect}
        />
      );
      fireEvent.click(screen.getByRole("button", { name: "HTTP Request" }));
      expect(onSelect).toHaveBeenCalledWith({ type: "http", label: "HTTP Request" });
    });

    it("hides the palette when showPalette is false", () => {
      render(
        <WorkflowBuilderLayout nodes={NODES} paletteItems={[{ type: "http", label: "HTTP Request" }]} showPalette={false} />
      );
      expect(screen.queryByLabelText("Node palette")).not.toBeInTheDocument();
    });

    it("omits the palette when no items are provided", () => {
      render(<WorkflowBuilderLayout nodes={NODES} />);
      expect(screen.queryByLabelText("Node palette")).not.toBeInTheDocument();
    });
  });

  describe("selection", () => {
    it("does not select a node merely from pressing its header (that only starts a drag)", () => {
      const onSelect = vi.fn();
      const { container } = render(
        <WorkflowBuilderLayout nodes={NODES} onNodeSelect={onSelect} inspector={<p>Node settings</p>} />
      );
      const node = getNode(container, "Trigger");
      firePointer(node.querySelector(".cursor-grab") as HTMLElement, "pointerdown", { pointerId: 1, clientX: 0, clientY: 0 });
      expect(onSelect).not.toHaveBeenCalled();
    });

    it("selects a node when its edit icon is clicked, without starting a drag", () => {
      const onSelect = vi.fn();
      const onNodesChange = vi.fn();
      const { container } = render(
        <WorkflowBuilderLayout
          nodes={NODES}
          onNodeSelect={onSelect}
          onNodesChange={onNodesChange}
          inspector={<p>Node settings</p>}
        />
      );
      const node = getNode(container, "Trigger");
      fireEvent.click(node.querySelector('[aria-label="Edit Trigger"]') as HTMLElement);
      expect(onSelect).toHaveBeenCalledWith("a");
      expect(onNodesChange).not.toHaveBeenCalled();
    });

    it("renders the edit icon even without inspector content, so onNodeSelect still fires", () => {
      // `inspector` is commonly computed from the *currently selected* node (e.g.
      // `selectedNode && <Panel />`), so it's falsy before anything is selected - gating the
      // edit icon on it would make the very first selection impossible.
      const onSelect = vi.fn();
      const { container } = render(<WorkflowBuilderLayout nodes={NODES} onNodeSelect={onSelect} />);
      const node = getNode(container, "Trigger");
      const editButton = node.querySelector('[aria-label="Edit Trigger"]') as HTMLElement;
      expect(editButton).toBeInTheDocument();
      fireEvent.click(editButton);
      expect(onSelect).toHaveBeenCalledWith("a");
    });

    it("omits the edit icon when showNodeEditButton is false", () => {
      const { container } = render(<WorkflowBuilderLayout nodes={NODES} showNodeEditButton={false} />);
      const node = getNode(container, "Trigger");
      expect(node.querySelector('[aria-label="Edit Trigger"]')).not.toBeInTheDocument();
    });

    it("shows the inspector for the selected node when inspector content is provided", () => {
      const { container } = render(
        <WorkflowBuilderLayout nodes={NODES} selectedNodeId="a" inspector={<p>Node settings</p>} />
      );
      expect(screen.getByText("Node settings")).toBeInTheDocument();
      expect(screen.getByLabelText("Inspector for Trigger")).toBeInTheDocument();
      void container;
    });

    it("does not show the inspector when no node is selected", () => {
      render(<WorkflowBuilderLayout nodes={NODES} selectedNodeId={null} inspector={<p>Node settings</p>} />);
      expect(screen.queryByText("Node settings")).not.toBeInTheDocument();
    });

    it("closes the inspector via the close button, notifying a controlled consumer", () => {
      const onSelect = vi.fn();
      render(
        <WorkflowBuilderLayout nodes={NODES} selectedNodeId="a" onNodeSelect={onSelect} inspector={<p>Node settings</p>} />
      );
      fireEvent.click(screen.getByRole("button", { name: "Close inspector" }));
      expect(onSelect).toHaveBeenCalledWith(null);
    });
  });

  describe("focus on click", () => {
    // preventDefault() (needed to stop native drag-to-select-text while panning/dragging) also
    // suppresses the browser's default click-to-focus behavior, so clicking wouldn't actually
    // move keyboard focus without an explicit .focus() call in these handlers.
    it("focuses the canvas surface when empty background is pressed, enabling keyboard pan", () => {
      const { container } = render(<WorkflowBuilderLayout nodes={NODES} />);
      const surface = getSurface(container);
      firePointer(surface, "pointerdown", { pointerId: 1, clientX: 500, clientY: 500 });
      expect(document.activeElement).toBe(surface);
    });

    it("focuses the node when its header is pressed, enabling keyboard nudge/delete", () => {
      const { container } = render(<WorkflowBuilderLayout nodes={NODES} />);
      const node = getNode(container, "Trigger");
      firePointer(node.querySelector(".cursor-grab") as HTMLElement, "pointerdown", { pointerId: 1, clientX: 0, clientY: 0 });
      expect(document.activeElement).toBe(node);
    });
  });

  describe("dragging nodes", () => {
    it("reports a moved node's new position via onNodesChange", () => {
      const onNodesChange = vi.fn();
      const { container } = render(<WorkflowBuilderLayout nodes={NODES} onNodesChange={onNodesChange} />);
      const handle = getNode(container, "Trigger").querySelector(".cursor-grab") as HTMLElement;
      firePointer(handle, "pointerdown", { pointerId: 1, clientX: 100, clientY: 100 });
      firePointer(handle, "pointermove", { pointerId: 1, clientX: 150, clientY: 130 });
      expect(onNodesChange).toHaveBeenLastCalledWith([
        { id: "a", x: 50, y: 30, title: "Trigger" },
        NODES[1],
      ]);
    });

    it("divides the drag delta by the current zoom so dragging tracks the pointer at any zoom level", () => {
      const onNodesChange = vi.fn();
      const { container } = render(
        <WorkflowBuilderLayout nodes={NODES} onNodesChange={onNodesChange} viewport={{ x: 0, y: 0, zoom: 2 }} />
      );
      const handle = getNode(container, "Trigger").querySelector(".cursor-grab") as HTMLElement;
      firePointer(handle, "pointerdown", { pointerId: 1, clientX: 0, clientY: 0 });
      firePointer(handle, "pointermove", { pointerId: 1, clientX: 100, clientY: 0 });
      expect(onNodesChange).toHaveBeenLastCalledWith([
        { id: "a", x: 50, y: 0, title: "Trigger" },
        NODES[1],
      ]);
    });

    it("ignores a move event from a different, unrelated pointer id", () => {
      const onNodesChange = vi.fn();
      const { container } = render(<WorkflowBuilderLayout nodes={NODES} onNodesChange={onNodesChange} />);
      const handle = getNode(container, "Trigger").querySelector(".cursor-grab") as HTMLElement;
      firePointer(handle, "pointerdown", { pointerId: 1, clientX: 0, clientY: 0 });
      firePointer(handle, "pointermove", { pointerId: 2, clientX: 999, clientY: 999 });
      expect(onNodesChange).not.toHaveBeenCalled();
    });

    it("does not start a canvas pan when the drag begins on a node", () => {
      const onViewportChange = vi.fn();
      const { container } = render(<WorkflowBuilderLayout nodes={NODES} onViewportChange={onViewportChange} />);
      const handle = getNode(container, "Trigger").querySelector(".cursor-grab") as HTMLElement;
      firePointer(handle, "pointerdown", { pointerId: 1, clientX: 0, clientY: 0 });
      firePointer(handle, "pointermove", { pointerId: 1, clientX: 50, clientY: 50 });
      expect(onViewportChange).not.toHaveBeenCalled();
    });
  });

  describe("keyboard interaction on a node", () => {
    it("nudges the focused node's position with arrow keys", () => {
      const onNodesChange = vi.fn();
      const { container } = render(<WorkflowBuilderLayout nodes={NODES} onNodesChange={onNodesChange} />);
      const node = getNode(container, "Trigger");
      fireEvent.keyDown(node, { key: "ArrowRight" });
      expect(onNodesChange).toHaveBeenLastCalledWith([{ ...NODES[0], x: 10 }, NODES[1]]);
    });

    it("uses a larger step when Shift is held", () => {
      const onNodesChange = vi.fn();
      const { container } = render(<WorkflowBuilderLayout nodes={NODES} onNodesChange={onNodesChange} />);
      const node = getNode(container, "Trigger");
      fireEvent.keyDown(node, { key: "ArrowRight", shiftKey: true });
      expect(onNodesChange).toHaveBeenLastCalledWith([{ ...NODES[0], x: 40 }, NODES[1]]);
    });

    it("calls onNodeDelete on Delete", () => {
      const onNodeDelete = vi.fn();
      const { container } = render(<WorkflowBuilderLayout nodes={NODES} onNodeDelete={onNodeDelete} />);
      const node = getNode(container, "Trigger");
      fireEvent.keyDown(node, { key: "Delete" });
      expect(onNodeDelete).toHaveBeenCalledWith("a");
    });

    it("does not also pan the canvas when an arrow key is pressed on a focused node", () => {
      const onViewportChange = vi.fn();
      const { container } = render(<WorkflowBuilderLayout nodes={NODES} onViewportChange={onViewportChange} />);
      const node = getNode(container, "Trigger");
      fireEvent.keyDown(node, { key: "ArrowRight" });
      expect(onViewportChange).not.toHaveBeenCalled();
    });
  });

  describe("connecting nodes", () => {
    it("calls onConnect when a drag from an output port is released over another node's input port", () => {
      const onConnect = vi.fn();
      const { container } = render(<WorkflowBuilderLayout nodes={NODES} onConnect={onConnect} />);
      const sourceNode = getNode(container, "Trigger");
      const targetNode = getNode(container, "Action");
      const outputPort = sourceNode.querySelector(".cursor-crosshair") as HTMLElement;
      const inputPort = targetNode.firstElementChild as HTMLElement;

      inputPort.getBoundingClientRect = () =>
        ({ left: 300, top: 20, right: 306, bottom: 26, width: 6, height: 6 }) as DOMRect;

      firePointer(outputPort, "pointerdown", { pointerId: 5, clientX: 220, clientY: 20 });
      firePointer(outputPort, "pointermove", { pointerId: 5, clientX: 302, clientY: 22 });
      firePointer(outputPort, "pointerup", { pointerId: 5, clientX: 302, clientY: 22 });

      expect(onConnect).toHaveBeenCalledWith({ source: "a", target: "b" });
    });

    it("does not connect when released far from any input port", () => {
      const onConnect = vi.fn();
      const { container } = render(<WorkflowBuilderLayout nodes={NODES} onConnect={onConnect} />);
      const sourceNode = getNode(container, "Trigger");
      const targetNode = getNode(container, "Action");
      const outputPort = sourceNode.querySelector(".cursor-crosshair") as HTMLElement;
      const inputPort = targetNode.firstElementChild as HTMLElement;

      inputPort.getBoundingClientRect = () =>
        ({ left: 300, top: 20, right: 306, bottom: 26, width: 6, height: 6 }) as DOMRect;

      firePointer(outputPort, "pointerdown", { pointerId: 5, clientX: 220, clientY: 20 });
      firePointer(outputPort, "pointerup", { pointerId: 5, clientX: 900, clientY: 900 });

      expect(onConnect).not.toHaveBeenCalled();
    });

    it("cancels an in-progress connection when Escape is pressed", () => {
      const onConnect = vi.fn();
      const { container } = render(<WorkflowBuilderLayout nodes={NODES} onConnect={onConnect} />);
      const sourceNode = getNode(container, "Trigger");
      const outputPort = sourceNode.querySelector(".cursor-crosshair") as HTMLElement;
      firePointer(outputPort, "pointerdown", { pointerId: 5, clientX: 220, clientY: 20 });
      fireEvent.keyDown(getSurface(container), { key: "Escape" });
      firePointer(outputPort, "pointerup", { pointerId: 5, clientX: 300, clientY: 20 });
      expect(onConnect).not.toHaveBeenCalled();
    });

    it("still cancels via Escape when keyboard focus is on a node (not the canvas) during the drag", () => {
      // Starting a connection (pointerdown on an output port) never moves focus, so whatever had
      // focus before - e.g. a node, after clicking its edit icon - stays focused. Escape bubbles
      // from there through the node's own keydown handler up to the canvas; the node handler must
      // not swallow it.
      const onConnect = vi.fn();
      const { container } = render(
        <WorkflowBuilderLayout nodes={NODES} onConnect={onConnect} showNodeEditButton />
      );
      const sourceNode = getNode(container, "Trigger");
      const targetNode = getNode(container, "Action");
      const editButton = sourceNode.querySelector('[aria-label="Edit Trigger"]') as HTMLElement;
      editButton.focus();
      expect(document.activeElement).toBe(editButton);

      const outputPort = sourceNode.querySelector(".cursor-crosshair") as HTMLElement;
      const inputPort = targetNode.firstElementChild as HTMLElement;
      inputPort.getBoundingClientRect = () =>
        ({ left: 300, top: 20, right: 306, bottom: 26, width: 6, height: 6 }) as DOMRect;

      firePointer(outputPort, "pointerdown", { pointerId: 5, clientX: 220, clientY: 20 });
      fireEvent.keyDown(editButton, { key: "Escape" });
      firePointer(outputPort, "pointerup", { pointerId: 5, clientX: 302, clientY: 22 });
      expect(onConnect).not.toHaveBeenCalled();
    });
  });

  describe("controlled vs uncontrolled viewport", () => {
    it("clamps zoom to the configured minZoom/maxZoom", () => {
      const { container } = render(<WorkflowBuilderLayout nodes={NODES} minZoom={0.5} maxZoom={1} />);
      const surface = getSurface(container);
      fireEvent.click(screen.getByRole("button", { name: "Zoom in" }));
      fireEvent.click(screen.getByRole("button", { name: "Zoom in" }));
      fireEvent.click(screen.getByRole("button", { name: "Zoom in" }));
      expect(screen.getByText("100%")).toBeInTheDocument();
      void surface;
    });

    it("recovers to a finite zoom when maxZoom is less than minZoom", () => {
      render(<WorkflowBuilderLayout nodes={NODES} minZoom={2} maxZoom={0.5} />);
      expect(screen.getByText("200%")).toBeInTheDocument();
    });

    it("replaces non-finite x/y with coordinate defaults instead of producing an invalid transform", () => {
      const { container } = render(
        <WorkflowBuilderLayout nodes={NODES} viewport={{ x: NaN, y: 0, zoom: 1 }} onViewportChange={() => undefined} />
      );
      const layer = container.querySelector('[aria-label^="Workflow canvas"] > div') as HTMLElement;
      expect(layer.style.transform).not.toContain("NaN");
      expect(layer.style.transform).toContain("translate(0px");
    });

    it("replaces a non-finite controlled zoom value with a finite fallback", () => {
      render(
        <WorkflowBuilderLayout nodes={NODES} viewport={{ x: 0, y: 0, zoom: NaN }} onViewportChange={() => undefined} />
      );
      expect(screen.getByText("100%")).toBeInTheDocument();
      expect(screen.queryByText("NaN%")).not.toBeInTheDocument();
    });

    it("does not tear down and reattach the wheel listener when onViewportChange is a fresh inline function every render", () => {
      const addEventListenerSpy = vi.spyOn(HTMLElement.prototype, "addEventListener");
      const removeEventListenerSpy = vi.spyOn(HTMLElement.prototype, "removeEventListener");
      function Wrapper() {
        const [, setTick] = React.useState(0);
        return (
          <>
            <WorkflowBuilderLayout nodes={NODES} onViewportChange={() => undefined} />
            <button onClick={() => setTick((t) => t + 1)}>rerender</button>
          </>
        );
      }
      render(<Wrapper />);
      addEventListenerSpy.mockClear();
      removeEventListenerSpy.mockClear();
      fireEvent.click(screen.getByRole("button", { name: "rerender" }));
      fireEvent.click(screen.getByRole("button", { name: "rerender" }));
      const wheelAttaches = addEventListenerSpy.mock.calls.filter((call) => call[0] === "wheel").length;
      const wheelDetaches = removeEventListenerSpy.mock.calls.filter((call) => call[0] === "wheel").length;
      expect(wheelAttaches).toBe(0);
      expect(wheelDetaches).toBe(0);
      addEventListenerSpy.mockRestore();
      removeEventListenerSpy.mockRestore();
    });
  });
});
