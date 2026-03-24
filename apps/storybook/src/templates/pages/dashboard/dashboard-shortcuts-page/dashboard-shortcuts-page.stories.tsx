/**
 * @file dashboard-shortcuts-page.stories.tsx
 * @description Storybook stories for Dashboard Shortcuts Page.
 * Includes large action buttons, grid shortcuts, keyboard hints, and persisted drag-and-drop.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { useCallback } from "react";
import DashboardShortcutsPage, {
  DashboardShortcutsActionsSection,
  DashboardShortcutsFooter,
  DashboardShortcutsGridSection,
  DashboardShortcutsHeader,
  DashboardShortcutsLayout,
  type DashboardAction,
  type ShortcutItem,
} from "./index";

const ACTIONS: DashboardAction[] = [
  { id: "create", label: "Create", shortcutHint: "C" },
  { id: "upload", label: "Upload", shortcutHint: "U" },
  { id: "download", label: "Download", shortcutHint: "D" },
  { id: "share", label: "Share", shortcutHint: "S" },
];

const SHORTCUTS: ShortcutItem[] = [
  { id: "new-project", label: "New project", description: "Start from a template", shortcutHint: "N" },
  { id: "quick-search", label: "Quick search", description: "Find pages and assets fast", shortcutHint: "/" },
  { id: "launch-center", label: "Launch center", description: "Open deployment tools", shortcutHint: "L" },
  { id: "sync-files", label: "Sync files", description: "Upload and sync workspace files", shortcutHint: "Y" },
  { id: "export-data", label: "Export data", description: "Download reports and CSVs", shortcutHint: "E" },
  { id: "preferences", label: "Preferences", description: "Customize dashboard options", shortcutHint: "P" },
];

/**
 * Meta configuration for Dashboard Shortcuts Page stories.
 */
const meta: Meta<typeof DashboardShortcutsPage> = {
  title: "Templates/Pages/Dashboard/Dashboard Shortcuts Page",
  component: DashboardShortcutsPage,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Dashboard shortcuts page with large action buttons, icon-backed shortcut cards, keyboard hints, and drag-and-drop customization persisted to localStorage.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof DashboardShortcutsPage>;

/**
 * Wrapper that wires action/shortcut callbacks for interactive keyboard testing.
 * @returns Dashboard shortcuts page with interactive handlers.
 */
function InteractiveWrapper() {
  const buildAction = useCallback(
    (action: DashboardAction): DashboardAction => ({
      ...action,
      onClick: () => {
        console.log(`[Action] ${action.label} triggered`);
      },
    }),
    [],
  );

  const buildShortcut = useCallback(
    (shortcut: ShortcutItem): ShortcutItem => ({
      ...shortcut,
      onTrigger: () => {
        console.log(`[Shortcut] ${shortcut.label} triggered`);
      },
    }),
    [],
  );

  return (
    <DashboardShortcutsPage
      actions={ACTIONS.map(buildAction)}
      shortcuts={SHORTCUTS.map(buildShortcut)}
      storageKey="storybook.dashboard-shortcuts-page.default"
    />
  );
}

/**
 * Default story with full interaction support.
 */
export const Default: Story = {
  render: () => <InteractiveWrapper />,
  name: "Default",
};

/**
 * Mobile viewport story to validate click targets and layout density.
 */
export const MobileResponsive: Story = {
  render: () => (
    <DashboardShortcutsPage
      actions={ACTIONS}
      shortcuts={SHORTCUTS}
      storageKey="storybook.dashboard-shortcuts-page.mobile"
    />
  ),
  name: "Mobile responsive",
  parameters: {
    viewport: {
      defaultViewport: "iphone12",
    },
  },
};

/**
 * Composable story: independently customizes header, actions, shortcuts, and footer.
 */
export const ComposableSections: Story = {
  render: () => (
    <DashboardShortcutsLayout>
      <DashboardShortcutsHeader
        title="Workspace Command Center"
        description="Customize each section independently while keeping the same visual system."
      />
      <DashboardShortcutsActionsSection
        actions={[
          { id: "create", label: "Create item", shortcutHint: "C" },
          { id: "upload", label: "Upload file", shortcutHint: "U" },
          { id: "download", label: "Download all", shortcutHint: "D" },
          { id: "share", label: "Share link", shortcutHint: "S" },
        ]}
      />
      <DashboardShortcutsGridSection
        shortcuts={SHORTCUTS}
        draggingId={null}
        onDragStart={() => undefined}
        onDrop={() => undefined}
        onDragEnd={() => undefined}
      />
      <DashboardShortcutsFooter text="Footer is replaceable too: add quotas, status, or deployment notes here." />
    </DashboardShortcutsLayout>
  ),
  name: "Composable sections",
};
