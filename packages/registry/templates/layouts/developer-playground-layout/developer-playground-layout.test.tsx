// developer-playground-layout.test.tsx
import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

vi.mock("lucide-react", () => ({
  ChevronDown: () => <div data-testid="chevron-down-icon" />,
  ChevronUp: () => <div data-testid="chevron-up-icon" />,
  Terminal: () => <div data-testid="terminal-icon" />,
  FileCode: () => <div data-testid="file-icon" />,
  Trash2: () => <div data-testid="trash-icon" />,
}));

import { DeveloperPlaygroundLayout, type PlaygroundFile } from ".";

// jsdom has no PointerEvent constructor, so @testing-library's fireEvent.pointerX helpers
// silently drop clientX/clientY/pointerId. Dispatching a MouseEvent (which jsdom does support)
// under the real "pointerdown"/"pointermove"/"pointerup" type names reaches the same
// onPointer* handlers with the properties intact.
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

const FILES: PlaygroundFile[] = [{ name: "index.tsx" }, { name: "styles.css" }];

describe("DeveloperPlaygroundLayout", () => {
  describe("rendering", () => {
    it("renders the editor and preview content", () => {
      render(<DeveloperPlaygroundLayout editor={<p>Editor</p>} preview={<p>Preview</p>} />);
      expect(screen.getByText("Editor")).toBeInTheDocument();
      expect(screen.getByText("Preview")).toBeInTheDocument();
    });

    it("renders header and actions when provided", () => {
      render(
        <DeveloperPlaygroundLayout
          editor={<p>Editor</p>}
          header={<span>Logo</span>}
          actions={<button>Run</button>}
        />
      );
      expect(screen.getByRole("banner")).toBeInTheDocument();
      expect(screen.getByText("Logo")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Run" })).toBeInTheDocument();
    });

    it("omits the header entirely when neither header nor actions are provided", () => {
      render(<DeveloperPlaygroundLayout editor={<p>Editor</p>} />);
      expect(screen.queryByRole("banner")).not.toBeInTheDocument();
    });

    it("applies a custom className to the root container", () => {
      const { container } = render(<DeveloperPlaygroundLayout editor={<p>Editor</p>} className="custom-root" />);
      expect(container.firstChild).toHaveClass("custom-root");
    });
  });

  describe("file tabs", () => {
    it("renders a tab per file and marks the first as active by default", () => {
      render(<DeveloperPlaygroundLayout editor={<p>Editor</p>} files={FILES} />);
      expect(screen.getByRole("tab", { name: /index.tsx/ })).toHaveAttribute("aria-selected", "true");
      expect(screen.getByRole("tab", { name: /styles.css/ })).toHaveAttribute("aria-selected", "false");
    });

    it("switches the active tab on click and notifies onActiveFileChange", () => {
      const onActiveFileChange = vi.fn();
      render(<DeveloperPlaygroundLayout editor={<p>Editor</p>} files={FILES} onActiveFileChange={onActiveFileChange} />);
      fireEvent.click(screen.getByRole("tab", { name: /styles.css/ }));
      expect(onActiveFileChange).toHaveBeenCalledWith("styles.css");
      expect(screen.getByRole("tab", { name: /styles.css/ })).toHaveAttribute("aria-selected", "true");
    });

    it("respects a controlled activeFileName", () => {
      render(<DeveloperPlaygroundLayout editor={<p>Editor</p>} files={FILES} activeFileName="styles.css" />);
      expect(screen.getByRole("tab", { name: /styles.css/ })).toHaveAttribute("aria-selected", "true");
      expect(screen.getByRole("tab", { name: /index.tsx/ })).toHaveAttribute("aria-selected", "false");
    });

    it("omits the tab strip when no files are provided", () => {
      render(<DeveloperPlaygroundLayout editor={<p>Editor</p>} />);
      expect(screen.queryByRole("tablist")).not.toBeInTheDocument();
    });

    it("auto-selects the first file once an initially empty files list is populated", () => {
      const onActiveFileChange = vi.fn();
      const { rerender } = render(
        <DeveloperPlaygroundLayout editor={<p>Editor</p>} files={[]} onActiveFileChange={onActiveFileChange} />
      );
      expect(screen.queryByRole("tablist")).not.toBeInTheDocument();

      rerender(<DeveloperPlaygroundLayout editor={<p>Editor</p>} files={FILES} onActiveFileChange={onActiveFileChange} />);
      expect(screen.getByRole("tab", { name: /index.tsx/ })).toHaveAttribute("aria-selected", "true");
      expect(onActiveFileChange).toHaveBeenCalledWith("index.tsx");
    });

    it("falls back to a remaining file when the active file is removed from the list", () => {
      const { rerender } = render(<DeveloperPlaygroundLayout editor={<p>Editor</p>} files={FILES} />);
      fireEvent.click(screen.getByRole("tab", { name: /styles.css/ }));
      expect(screen.getByRole("tab", { name: /styles.css/ })).toHaveAttribute("aria-selected", "true");

      rerender(<DeveloperPlaygroundLayout editor={<p>Editor</p>} files={[FILES[0]]} />);
      expect(screen.getByRole("tab", { name: /index.tsx/ })).toHaveAttribute("aria-selected", "true");
    });
  });

  describe("console", () => {
    it("omits the console section when no consoleContent is provided", () => {
      render(<DeveloperPlaygroundLayout editor={<p>Editor</p>} />);
      expect(screen.queryByText("Console")).not.toBeInTheDocument();
    });

    it("renders the console section when consoleContent is the falsy-but-valid node 0", () => {
      render(<DeveloperPlaygroundLayout editor={<p>Editor</p>} consoleContent={0} />);
      expect(screen.getByText("Console")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Collapse console" })).toBeInTheDocument();
    });

    it("shows console content by default and collapses it on toggle", () => {
      render(<DeveloperPlaygroundLayout editor={<p>Editor</p>} consoleContent={<p>Log output</p>} />);
      expect(screen.getByText("Log output")).toBeInTheDocument();
      fireEvent.click(screen.getByRole("button", { name: "Collapse console" }));
      expect(screen.queryByText("Log output")).not.toBeInTheDocument();
    });

    it("respects a controlled showConsole", () => {
      render(<DeveloperPlaygroundLayout editor={<p>Editor</p>} consoleContent={<p>Log output</p>} showConsole={false} />);
      expect(screen.queryByText("Log output")).not.toBeInTheDocument();
    });

    it("omits the clear console button when no consoleContent is provided", () => {
      render(<DeveloperPlaygroundLayout editor={<p>Editor</p>} />);
      expect(screen.queryByRole("button", { name: "Clear console" })).not.toBeInTheDocument();
    });

    it("omits the clear console button when consoleContent is provided but onClearConsole is not", () => {
      render(<DeveloperPlaygroundLayout editor={<p>Editor</p>} consoleContent={<p>Log output</p>} />);
      expect(screen.queryByRole("button", { name: "Clear console" })).not.toBeInTheDocument();
    });

    it("calls onClearConsole when the clear button is clicked", () => {
      const onClearConsole = vi.fn();
      render(
        <DeveloperPlaygroundLayout
          editor={<p>Editor</p>}
          consoleContent={<p>Log output</p>}
          onClearConsole={onClearConsole}
        />
      );
      fireEvent.click(screen.getByRole("button", { name: "Clear console" }));
      expect(onClearConsole).toHaveBeenCalledTimes(1);
    });
  });

  describe("resizable split", () => {
    it("drags the divider to update the split percentage", () => {
      const onSplitChange = vi.fn();
      const { container } = render(
        <DeveloperPlaygroundLayout editor={<p>Editor</p>} preview={<p>Preview</p>} onSplitChange={onSplitChange} />
      );
      const splitContainer = container.querySelector('[role="separator"]')!.parentElement as HTMLElement;
      splitContainer.getBoundingClientRect = () =>
        ({ left: 0, top: 0, right: 1000, bottom: 500, width: 1000, height: 500 }) as DOMRect;
      const divider = screen.getByRole("separator");

      firePointer(divider, "pointerdown", { pointerId: 1, clientX: 500, clientY: 0 });
      firePointer(divider, "pointermove", { pointerId: 1, clientX: 700, clientY: 0 });

      expect(onSplitChange).toHaveBeenLastCalledWith(70);
    });

    it("clamps the split to the configured min/max via keyboard", () => {
      render(
        <DeveloperPlaygroundLayout
          editor={<p>Editor</p>}
          preview={<p>Preview</p>}
          minSplitPercentage={30}
          maxSplitPercentage={70}
          defaultSplitPercentage={30}
        />
      );
      const divider = screen.getByRole("separator");
      fireEvent.keyDown(divider, { key: "ArrowLeft" });
      expect(divider).toHaveAttribute("aria-valuenow", "30");
      fireEvent.keyDown(divider, { key: "End" });
      expect(divider).toHaveAttribute("aria-valuenow", "70");
      fireEvent.keyDown(divider, { key: "Home" });
      expect(divider).toHaveAttribute("aria-valuenow", "30");
    });

    it("nudges the split by the keyboard step on arrow keys", () => {
      render(<DeveloperPlaygroundLayout editor={<p>Editor</p>} preview={<p>Preview</p>} />);
      const divider = screen.getByRole("separator");
      fireEvent.keyDown(divider, { key: "ArrowRight" });
      expect(divider).toHaveAttribute("aria-valuenow", "55");
    });

    it("uses ArrowUp/ArrowDown for a vertical orientation", () => {
      render(<DeveloperPlaygroundLayout editor={<p>Editor</p>} preview={<p>Preview</p>} orientation="vertical" />);
      const divider = screen.getByRole("separator");
      // The panes stack vertically, so the divider bar itself is drawn horizontally -
      // aria-orientation describes the bar's own axis, not the pane-split direction.
      expect(divider).toHaveAttribute("aria-orientation", "horizontal");
      fireEvent.keyDown(divider, { key: "ArrowDown" });
      expect(divider).toHaveAttribute("aria-valuenow", "55");
    });

    it("recovers to a finite split when maxSplitPercentage is less than minSplitPercentage", () => {
      render(
        <DeveloperPlaygroundLayout
          editor={<p>Editor</p>}
          preview={<p>Preview</p>}
          minSplitPercentage={70}
          maxSplitPercentage={30}
          defaultSplitPercentage={50}
        />
      );
      const divider = screen.getByRole("separator");
      expect(Number(divider.getAttribute("aria-valuenow"))).toBeGreaterThanOrEqual(70);
    });

    it("clamps the non-finite split fallback into a min/max range that excludes the default", () => {
      render(
        <DeveloperPlaygroundLayout
          editor={<p>Editor</p>}
          preview={<p>Preview</p>}
          splitPercentage={NaN}
          minSplitPercentage={60}
          maxSplitPercentage={80}
        />
      );
      const divider = screen.getByRole("separator");
      const value = Number(divider.getAttribute("aria-valuenow"));
      expect(value).toBeGreaterThanOrEqual(60);
      expect(value).toBeLessThanOrEqual(80);
    });
  });
});
