/**
 * @file dashboard-shortcuts-page.test.tsx
 * @description Unit tests for the DashboardShortcutsPage registry template.
 * Focuses on rendering, handlers, keyboard shortcuts, and drag-and-drop persistence.
 */

import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  DashboardShortcutsPage,
  DashboardShortcutsHeader,
  DashboardShortcutsActionsSection,
  DashboardShortcutsGridSection,
  DashboardShortcutsFooter,
  type DashboardAction,
  type ShortcutItem,
} from ".";

/* -------------------------------------------------------------------------- */
/*                                Mock Ignix UI                               */
/* -------------------------------------------------------------------------- */

vi.mock("@ignix-ui/button", () => ({
  Button: ({
    children,
    onClick,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & { children?: React.ReactNode }) => (
    <button type="button" onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

vi.mock("@ignix-ui/card", () => {
  const Card = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div {...props}>{children}</div>
  );
  const CardHeader = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div {...props}>{children}</div>
  );
  const CardTitle = ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 {...props}>{children}</h2>
  );
  const CardDescription = ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p {...props}>{children}</p>
  );
  const CardContent = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div {...props}>{children}</div>
  );
  return { Card, CardHeader, CardTitle, CardDescription, CardContent };
});

/* -------------------------------------------------------------------------- */
/*                                   Fixtures                                 */
/* -------------------------------------------------------------------------- */

const actionsFixture = (overrides?: Partial<DashboardAction>[]): DashboardAction[] => {
  const base: DashboardAction[] = [
    { id: "create", label: "Create", shortcutHint: "C", onClick: vi.fn() },
    { id: "upload", label: "Upload", shortcutHint: "U", onClick: vi.fn() },
    { id: "download", label: "Download", shortcutHint: "D", onClick: vi.fn() },
    { id: "share", label: "Share", shortcutHint: "S", onClick: vi.fn() },
  ];

  if (!overrides?.length) return base;
  return base.map((item, index) => ({ ...item, ...(overrides[index] ?? {}) }));
};

const shortcutsFixture = (overrides?: Partial<ShortcutItem>[]): ShortcutItem[] => {
  const base: ShortcutItem[] = [
    { id: "new-project", label: "New project", description: "Start from a template", shortcutHint: "N", onTrigger: vi.fn() },
    { id: "quick-search", label: "Quick search", description: "Find pages and assets fast", shortcutHint: "/", onTrigger: vi.fn() },
    { id: "launch-center", label: "Launch center", description: "Open deployment tools", shortcutHint: "L", onTrigger: vi.fn() },
    { id: "sync-files", label: "Sync files", description: "Upload and sync workspace files", shortcutHint: "Y", onTrigger: vi.fn() },
    { id: "export-data", label: "Export data", description: "Download reports and CSVs", shortcutHint: "E", onTrigger: vi.fn() },
    { id: "preferences", label: "Preferences", description: "Customize dashboard options", shortcutHint: "P", onTrigger: vi.fn() },
  ];

  if (!overrides?.length) return base;
  return base.map((item, index) => ({ ...item, ...(overrides[index] ?? {}) }));
};

/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */

function getShortcutButtonsInOrder() {
  // Each shortcut tile button has aria-label: `${label} shortcut`
  const buttons = screen.getAllByRole("button").filter((button) => {
    const label = button.getAttribute("aria-label");
    return label != null && label.endsWith(" shortcut");
  });
  return buttons.map((button) => button.getAttribute("aria-label") ?? "");
}

/* -------------------------------------------------------------------------- */
/*                                   Tests                                    */
/* -------------------------------------------------------------------------- */

const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value.toString(); }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; })
  };
})();

Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

describe("DashboardShortcutsPage (registry template)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    window.localStorage.clear();
  });

  it("renders header, actions, shortcuts grid, and footer", () => {
    render(
      <DashboardShortcutsPage
        actions={actionsFixture()}
        shortcuts={shortcutsFixture()}
        footerText="Footer message"
        storageKey="test.shortcuts.order"
      />,
    );

    expect(screen.getByRole("heading", { name: /dashboard shortcuts page/i })).toBeInTheDocument();

    // Action buttons
    expect(screen.getByRole("button", { name: /create/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /upload/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /download/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /share/i })).toBeInTheDocument();

    // Shortcut tiles
    expect(screen.getByRole("button", { name: "New project shortcut" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Quick search shortcut" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Launch center shortcut" })).toBeInTheDocument();

    // Footer
    expect(screen.getByText("Footer message")).toBeInTheDocument();
  });

  it("invokes action click handlers when action buttons are clicked", async () => {
    const user = userEvent.setup();
    const actions = actionsFixture();

    render(
      <DashboardShortcutsPage
        actions={actions}
        shortcuts={shortcutsFixture()}
        storageKey="test.shortcuts.order"
      />,
    );

    await user.click(screen.getByRole("button", { name: /create/i }));
    await user.click(screen.getByRole("button", { name: /download/i }));

    expect(actions[0]?.onClick).toHaveBeenCalledTimes(1);
    expect(actions[2]?.onClick).toHaveBeenCalledTimes(1);
  });

  it("invokes shortcut handlers when shortcut tiles are clicked", async () => {
    const user = userEvent.setup();
    const shortcuts = shortcutsFixture();

    render(
      <DashboardShortcutsPage
        actions={actionsFixture()}
        shortcuts={shortcuts}
        storageKey="test.shortcuts.order"
      />,
    );

    await user.click(screen.getByRole("button", { name: "Preferences shortcut" }));
    await user.click(screen.getByRole("button", { name: "Launch center shortcut" }));

    expect(shortcuts[5]?.onTrigger).toHaveBeenCalledTimes(1);
    expect(shortcuts[2]?.onTrigger).toHaveBeenCalledTimes(1);
  });

  it("supports keyboard shortcuts for actions and shortcut tiles (and ignores inputs)", () => {
    const actions = actionsFixture();
    const shortcuts = shortcutsFixture();

    render(
      <div>
        <input aria-label="test-input" />
        <DashboardShortcutsPage
          actions={actions}
          shortcuts={shortcuts}
          storageKey="test.shortcuts.order"
        />
      </div>,
    );

    // Action keyboard shortcut
    fireEvent.keyDown(window, { key: "d" });
    expect(actions[2]?.onClick).toHaveBeenCalledTimes(1);

    // Shortcut keyboard shortcut
    fireEvent.keyDown(window, { key: "p" });
    expect(shortcuts[5]?.onTrigger).toHaveBeenCalledTimes(1);

    // Ignore when an input is focused
    const input = screen.getByLabelText("test-input");
    input.focus();
    fireEvent.keyDown(input, { key: "c" });
    expect(actions[0]?.onClick).toHaveBeenCalledTimes(0);
  });

  it("reads initial shortcut order from localStorage and renders tiles in that order", () => {
    const storageKey = "test.shortcuts.order";
    window.localStorage.setItem(
      storageKey,
      JSON.stringify(["preferences", "launch-center", "new-project"]),
    );

    render(
      <DashboardShortcutsPage
        actions={actionsFixture()}
        shortcuts={shortcutsFixture()}
        storageKey={storageKey}
      />,
    );

    const labels = getShortcutButtonsInOrder();
    expect(labels[0]).toBe("Preferences shortcut");
    expect(labels[1]).toBe("Launch center shortcut");
    expect(labels[2]).toBe("New project shortcut");
  });

  it("supports drag-and-drop reordering and persists order to localStorage", async () => {
    const storageKey = "test.shortcuts.order";
    const setItemSpy = vi.spyOn(window.localStorage, "setItem");

    render(
      <DashboardShortcutsPage
        actions={actionsFixture()}
        shortcuts={shortcutsFixture()}
        storageKey={storageKey}
      />,
    );

    const source = screen.getByRole("button", { name: "Preferences shortcut" });
    const target = screen.getByRole("button", { name: "New project shortcut" });

    fireEvent.dragStart(source);
    // Flush state update from dragStart before drop reads it.
    await act(async () => undefined);
    fireEvent.dragOver(target);
    fireEvent.drop(target);
    fireEvent.dragEnd(source);

    // localStorage should be written with a JSON array of ids.
    await waitFor(() => {
      expect(setItemSpy).toHaveBeenCalled();
      const calls = setItemSpy.mock.calls.filter((call) => call[0] === storageKey);
      expect(calls.length).toBeGreaterThan(0);
    });

    // Dropping Preferences onto New project moves it before the target (becomes first).
    const labels = getShortcutButtonsInOrder();
    expect(labels[0]).toBe("Preferences shortcut");
  });

  it("renders composable sections individually (layout/header/actions/grid/footer)", () => {
    const shortcuts = shortcutsFixture();

    render(
      <div>
        <DashboardShortcutsHeader title="Custom Title" description="Custom Description" />
        <DashboardShortcutsActionsSection actions={actionsFixture()} />
        <DashboardShortcutsGridSection
          shortcuts={shortcuts}
          draggingId={null}
          onDragStart={() => undefined}
          onDrop={() => undefined}
          onDragEnd={() => undefined}
        />
        <DashboardShortcutsFooter text="Custom footer" />
      </div>,
    );

    expect(screen.getByRole("heading", { name: /custom title/i })).toBeInTheDocument();
    expect(screen.getByText("Custom Description")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "New project shortcut" })).toBeInTheDocument();
    expect(screen.getByText("Custom footer")).toBeInTheDocument();

    // Click still triggers shortcut handler.
    fireEvent.click(screen.getByRole("button", { name: "New project shortcut" }));
    expect(shortcuts[0]?.onTrigger).toHaveBeenCalledTimes(1);
  });
});

