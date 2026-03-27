/**
 * @file DashboardShortcutsPageDemo.tsx
 * @description Composable preview and code demo for Dashboard Shortcuts Page.
 */

import React from "react";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import CodeBlock from "@theme/CodeBlock";
import {
  DashboardShortcutsLayout,
  DashboardShortcutsHeader,
  DashboardShortcutsActionsSection,
  DashboardShortcutsGridSection,
  DashboardShortcutsFooter,
  useDashboardShortcutsState,
  type DashboardAction,
  type ShortcutItem,
} from "@site/src/components/UI/dashboard-shortcuts-page";

const actions: DashboardAction[] = [
  { id: "create", label: "Create", shortcutHint: "C", onClick: () => console.log("Create") },
  { id: "upload", label: "Upload", shortcutHint: "U", onClick: () => console.log("Upload") },
  { id: "download", label: "Download", shortcutHint: "D", onClick: () => console.log("Download") },
  { id: "share", label: "Share", shortcutHint: "S", onClick: () => console.log("Share") },
];

const shortcuts: ShortcutItem[] = [
  { id: "new-project", label: "New project", description: "Start from a template", shortcutHint: "N", onTrigger: () => console.log("New project") },
  { id: "quick-search", label: "Quick search", description: "Find pages and assets fast", shortcutHint: "/", onTrigger: () => console.log("Quick search") },
  { id: "launch-center", label: "Launch center", description: "Open deployment tools", shortcutHint: "L", onTrigger: () => console.log("Launch center") },
  { id: "sync-files", label: "Sync files", description: "Upload and sync workspace files", shortcutHint: "Y", onTrigger: () => console.log("Sync files") },
  { id: "export-data", label: "Export data", description: "Download reports and CSVs", shortcutHint: "E", onTrigger: () => console.log("Export data") },
  { id: "preferences", label: "Preferences", description: "Customize dashboard options", shortcutHint: "P", onTrigger: () => console.log("Preferences") },
];

/**
 * Composable preview implementation.
 */
function ComposablePreview(): React.JSX.Element {
  const { orderedShortcuts, draggingId, handleDragStart, handleDrop, handleDragEnd } =
    useDashboardShortcutsState({
      shortcuts,
      actions,
      storageKey: "docs.dashboard-shortcuts.composable",
    });

  return (
    <DashboardShortcutsLayout>
      <DashboardShortcutsHeader
        title="Workspace Command Center"
        description="Compose each section independently and persist shortcut order."
      />
      <DashboardShortcutsActionsSection actions={actions} />
      <DashboardShortcutsGridSection
        shortcuts={orderedShortcuts}
        draggingId={draggingId}
        onDragStart={handleDragStart}
        onDrop={handleDrop}
        onDragEnd={handleDragEnd}
      />
      <DashboardShortcutsFooter text="Composable footer area: add system status, hints, or contextual actions." />
    </DashboardShortcutsLayout>
  );
}

/**
 * DashboardShortcutsPageDemo component.
 */
export default function DashboardShortcutsPageDemo(): React.JSX.Element {
  const codeString = `
import React from "react";
import {
  DashboardShortcutsLayout,
  DashboardShortcutsHeader,
  DashboardShortcutsActionsSection,
  DashboardShortcutsGridSection,
  DashboardShortcutsFooter,
  useDashboardShortcutsState,
  type DashboardAction,
  type ShortcutItem,
} from "@ignix-ui/dashboard-shortcuts-page";

const actions: DashboardAction[] = [
  { id: "create", label: "Create", shortcutHint: "C", onClick: () => console.log("Create") },
  { id: "upload", label: "Upload", shortcutHint: "U", onClick: () => console.log("Upload") },
  { id: "download", label: "Download", shortcutHint: "D", onClick: () => console.log("Download") },
  { id: "share", label: "Share", shortcutHint: "S", onClick: () => console.log("Share") },
];

const shortcuts: ShortcutItem[] = [
  { id: "new-project", label: "New project", description: "Start from a template", shortcutHint: "N" },
  { id: "quick-search", label: "Quick search", description: "Find pages and assets fast", shortcutHint: "/" },
  { id: "launch-center", label: "Launch center", description: "Open deployment tools", shortcutHint: "L" },
  { id: "sync-files", label: "Sync files", description: "Upload and sync workspace files", shortcutHint: "Y" },
  { id: "export-data", label: "Export data", description: "Download reports and CSVs", shortcutHint: "E" },
  { id: "preferences", label: "Preferences", description: "Customize dashboard options", shortcutHint: "P" },
];

export function DashboardShortcutsComposable(): React.JSX.Element {
  const { orderedShortcuts, draggingId, handleDragStart, handleDrop, handleDragEnd } =
    useDashboardShortcutsState({
      shortcuts,
      actions,
      storageKey: "dashboard-shortcuts.order",
    });

  return (
    <DashboardShortcutsLayout>
      <DashboardShortcutsHeader
        title="Workspace Command Center"
        description="Compose each section independently and persist shortcut order."
      />
      <DashboardShortcutsActionsSection actions={actions} />
      <DashboardShortcutsGridSection
        shortcuts={orderedShortcuts}
        draggingId={draggingId}
        onDragStart={handleDragStart}
        onDrop={handleDrop}
        onDragEnd={handleDragEnd}
      />
      <DashboardShortcutsFooter text="Composable footer area: add system status, hints, or contextual actions." />
    </DashboardShortcutsLayout>
  );
}
`.trim();

  return (
    <div className="mb-8 flex flex-col space-y-6">
      <Tabs>
        <TabItem value="preview" label="Preview" default>
          <div className="rounded-xl border border-slate-200 bg-slate-900 p-4 shadow-sm">
            <ComposablePreview />
          </div>
        </TabItem>
        <TabItem value="code" label="Code">
          <CodeBlock language="tsx" className="max-h-[560px] overflow-y-auto whitespace-pre-wrap">
            {codeString}
          </CodeBlock>
        </TabItem>
      </Tabs>
    </div>
  );
}
