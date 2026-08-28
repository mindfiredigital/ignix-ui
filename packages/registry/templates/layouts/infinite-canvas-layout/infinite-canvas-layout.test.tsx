// infinite-canvas-layout.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

vi.mock("lucide-react", () => ({
  Plus: () => <div data-testid="plus-icon" />,
  Minus: () => <div data-testid="minus-icon" />,
  RotateCcw: () => <div data-testid="reset-icon" />,
}));

import { InfiniteCanvasLayout, CanvasNode, type CanvasViewport } from ".";

function getSurface(container: HTMLElement): HTMLElement {
  return container.querySelector('[role="group"]') as HTMLElement;
}

describe("InfiniteCanvasLayout", () => {
  describe("rendering", () => {
    it("renders canvas content", () => {
      render(
        <InfiniteCanvasLayout>
          <CanvasNode x={0} y={0}>
            <p>Node content</p>
          </CanvasNode>
        </InfiniteCanvasLayout>
      );
      expect(screen.getByText("Node content")).toBeInTheDocument();
    });

    it("renders header and actions when provided", () => {
      render(
        <InfiniteCanvasLayout header={<span>Logo</span>} actions={<button>Share</button>}>
          <p>Content</p>
        </InfiniteCanvasLayout>
      );
      expect(screen.getByRole("banner")).toBeInTheDocument();
      expect(screen.getByText("Logo")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Share" })).toBeInTheDocument();
    });

    it("omits the header entirely when neither header nor actions are provided", () => {
      render(
        <InfiniteCanvasLayout>
          <p>Content</p>
        </InfiniteCanvasLayout>
      );
      expect(screen.queryByRole("banner")).not.toBeInTheDocument();
    });

    it("exposes an accessible, focusable canvas region", () => {
      const { container } = render(
        <InfiniteCanvasLayout>
          <p>Content</p>
        </InfiniteCanvasLayout>
      );
      const surface = getSurface(container);
      expect(surface).toHaveAttribute("tabIndex", "0");
      expect(surface.getAttribute("aria-label")).toMatch(/infinite canvas/i);
    });

    it("positions a CanvasNode at its given world coordinates", () => {
      render(
        <InfiniteCanvasLayout>
          <CanvasNode x={120} y={240} width={100} height={50}>
            <p>Positioned</p>
          </CanvasNode>
        </InfiniteCanvasLayout>
      );
      const node = screen.getByText("Positioned").closest("div.absolute") as HTMLElement;
      expect(node).toHaveStyle({ left: "120px", top: "240px", width: "100px", height: "50px" });
    });
  });

  describe("zoom controls", () => {
    it("renders the floating zoom control panel by default", () => {
      render(
        <InfiniteCanvasLayout>
          <p>Content</p>
        </InfiniteCanvasLayout>
      );
      expect(screen.getByRole("button", { name: "Zoom in" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Zoom out" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Reset view" })).toBeInTheDocument();
      expect(screen.getByText("100%")).toBeInTheDocument();
    });

    it("hides the control panel when showControls is false", () => {
      render(
        <InfiniteCanvasLayout showControls={false}>
          <p>Content</p>
        </InfiniteCanvasLayout>
      );
      expect(screen.queryByRole("button", { name: "Zoom in" })).not.toBeInTheDocument();
    });

    it("zooms in and out via the control buttons, updating the displayed percentage", () => {
      render(
        <InfiniteCanvasLayout>
          <p>Content</p>
        </InfiniteCanvasLayout>
      );
      fireEvent.click(screen.getByRole("button", { name: "Zoom in" }));
      expect(screen.getByText("120%")).toBeInTheDocument();

      fireEvent.click(screen.getByRole("button", { name: "Zoom out" }));
      expect(screen.getByText("100%")).toBeInTheDocument();
    });

    it("resets to defaultViewport when the reset button is clicked", () => {
      render(
        <InfiniteCanvasLayout defaultViewport={{ x: 10, y: 20, zoom: 1.5 }}>
          <p>Content</p>
        </InfiniteCanvasLayout>
      );
      expect(screen.getByText("150%")).toBeInTheDocument();

      fireEvent.click(screen.getByRole("button", { name: "Zoom in" }));
      expect(screen.queryByText("150%")).not.toBeInTheDocument();

      fireEvent.click(screen.getByRole("button", { name: "Reset view" }));
      expect(screen.getByText("150%")).toBeInTheDocument();
    });

    it("clamps zoom to minZoom/maxZoom", () => {
      render(
        <InfiniteCanvasLayout minZoom={0.5} maxZoom={0.6} defaultViewport={{ x: 0, y: 0, zoom: 0.5 }}>
          <p>Content</p>
        </InfiniteCanvasLayout>
      );
      fireEvent.click(screen.getByRole("button", { name: "Zoom in" }));
      expect(screen.getByText("60%")).toBeInTheDocument();
    });
  });

  describe("keyboard interaction", () => {
    it("zooms in and out and resets via keyboard shortcuts", () => {
      const { container } = render(
        <InfiniteCanvasLayout>
          <p>Content</p>
        </InfiniteCanvasLayout>
      );
      const surface = getSurface(container);

      fireEvent.keyDown(surface, { key: "+" });
      expect(screen.getByText("120%")).toBeInTheDocument();

      fireEvent.keyDown(surface, { key: "0" });
      expect(screen.getByText("100%")).toBeInTheDocument();

      fireEvent.keyDown(surface, { key: "-" });
      expect(screen.getByText(/8[0-3]%/)).toBeInTheDocument();
    });

    it("pans via arrow keys", () => {
      const onViewportChange = vi.fn();
      const { container } = render(
        <InfiniteCanvasLayout onViewportChange={onViewportChange}>
          <p>Content</p>
        </InfiniteCanvasLayout>
      );
      const surface = getSurface(container);

      fireEvent.keyDown(surface, { key: "ArrowRight" });
      expect(onViewportChange).toHaveBeenLastCalledWith(expect.objectContaining({ x: -40, y: 0 }));

      fireEvent.keyDown(surface, { key: "ArrowDown" });
      expect(onViewportChange).toHaveBeenLastCalledWith(expect.objectContaining({ x: -40, y: -40 }));
    });
  });

  describe("controlled vs uncontrolled viewport", () => {
    it("manages its own viewport when uncontrolled", () => {
      render(
        <InfiniteCanvasLayout>
          <p>Content</p>
        </InfiniteCanvasLayout>
      );
      fireEvent.click(screen.getByRole("button", { name: "Zoom in" }));
      expect(screen.getByText("120%")).toBeInTheDocument();
    });

    it("does not update its displayed viewport on its own when controlled", () => {
      const fixedViewport: CanvasViewport = { x: 0, y: 0, zoom: 1 };
      const onViewportChange = vi.fn();
      render(
        <InfiniteCanvasLayout viewport={fixedViewport} onViewportChange={onViewportChange}>
          <p>Content</p>
        </InfiniteCanvasLayout>
      );

      fireEvent.click(screen.getByRole("button", { name: "Zoom in" }));

      // The parent "ignored" the callback (didn't update the `viewport` prop), so the
      // displayed zoom must stay exactly what was passed in, not self-manage state.
      expect(screen.getByText("100%")).toBeInTheDocument();
      expect(onViewportChange).toHaveBeenCalledWith(expect.objectContaining({ zoom: 1.2 }));
    });

    it("reflects viewport updates driven by the parent in controlled mode", () => {
      const ControlledDemo: React.FC = () => {
        const [viewport, setViewport] = React.useState<CanvasViewport>({ x: 0, y: 0, zoom: 1 });
        return (
          <InfiniteCanvasLayout viewport={viewport} onViewportChange={setViewport}>
            <p>Content</p>
          </InfiniteCanvasLayout>
        );
      };
      render(<ControlledDemo />);

      fireEvent.click(screen.getByRole("button", { name: "Zoom in" }));
      expect(screen.getByText("120%")).toBeInTheDocument();
    });
  });

  describe("background grid", () => {
    it("applies a dot-grid background by default", () => {
      const { container } = render(
        <InfiniteCanvasLayout>
          <p>Content</p>
        </InfiniteCanvasLayout>
      );
      const surface = getSurface(container);
      expect(surface.style.backgroundImage).toContain("radial-gradient");
    });

    it("omits the background grid when showGrid is false", () => {
      const { container } = render(
        <InfiniteCanvasLayout showGrid={false}>
          <p>Content</p>
        </InfiniteCanvasLayout>
      );
      const surface = getSurface(container);
      expect(surface.style.backgroundImage).toBe("");
    });
  });

  describe("effect stability", () => {
    it("does not tear down and reattach the wheel listener when onViewportChange is a fresh inline function every render", () => {
      // A consumer passing `onViewportChange={(vp) => ...}` inline gets a new function identity
      // on every render. The wheel-listener effect must not depend on that identity, or it would
      // remove/re-add the native listener on every unrelated re-render.
      const RerenderingParent: React.FC = () => {
        const [tick, setTick] = React.useState(0);
        return (
          <div>
            <button onClick={() => setTick((t) => t + 1)}>rerender</button>
            <InfiniteCanvasLayout onViewportChange={() => undefined}>
              <p>Content {tick}</p>
            </InfiniteCanvasLayout>
          </div>
        );
      };
      const { container } = render(<RerenderingParent />);
      const surface = getSurface(container);

      // Spy only after the initial mount (already covered by other tests) so React's own
      // internal event-delegation setup isn't counted alongside our explicit listener.
      const addEventListenerSpy = vi.spyOn(surface, "addEventListener");
      const removeEventListenerSpy = vi.spyOn(surface, "removeEventListener");

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
