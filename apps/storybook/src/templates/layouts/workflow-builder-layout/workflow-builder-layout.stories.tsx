/**
 * @file workflow-builder-layout.stories.tsx
 * @description Storybook stories for the WorkflowBuilderLayout template. Covers the node
 * palette, the pannable/zoomable canvas where nodes are placed and wired together, the
 * inspector panel, and dragging a palette item onto the canvas to create a new node.
 */

import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  WorkflowBuilderLayout,
  type WorkflowNodeData,
  type WorkflowEdgeData,
  type WorkflowPaletteItem,
} from ".";
import { Sparkles, Github, Webhook, Mail, Filter, Clock, Play } from "lucide-react";

const meta: Meta<typeof WorkflowBuilderLayout> = {
  title: "Templates/Layouts/WorkflowBuilderLayout",
  component: WorkflowBuilderLayout,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A node-and-connection workspace shell - the shape behind visual automation/workflow tools. A node palette sits on the left, an optional inspector panel on the right, and a pannable/zoomable canvas in between where nodes are placed, dragged, and wired together by dragging from an output port to an input port.",
      },
    },
  },
  argTypes: {
    minZoom: { control: { type: "number", min: 0.1, max: 1, step: 0.05 } },
    maxZoom: { control: { type: "number", min: 1, max: 4, step: 0.25 } },
    gridSize: { control: { type: "number", min: 8, max: 128, step: 8 } },
    showGrid: { control: "boolean" },
    showControls: { control: "boolean" },
    showPalette: { control: "boolean" },
  },
};

export default meta;

type Story = StoryObj<typeof WorkflowBuilderLayout>;

const PALETTE_ITEMS: WorkflowPaletteItem[] = [
  { type: "webhook", label: "Webhook", icon: <Webhook className="h-4 w-4" />, description: "Start on an HTTP call" },
  { type: "filter", label: "Filter", icon: <Filter className="h-4 w-4" />, description: "Keep matching items only" },
  { type: "delay", label: "Delay", icon: <Clock className="h-4 w-4" />, description: "Wait before continuing" },
  { type: "email", label: "Send Email", icon: <Mail className="h-4 w-4" />, description: "Send a templated email" },
];

const PIPELINE_NODES: WorkflowNodeData[] = [
  { id: "trigger", x: 40, y: 120, title: "New Signup", icon: <Play className="h-4 w-4" />, status: "success" },
  { id: "filter", x: 320, y: 40, title: "Filter: Verified", icon: <Filter className="h-4 w-4" />, status: "idle" },
  { id: "delay", x: 320, y: 220, title: "Wait 1 Day", icon: <Clock className="h-4 w-4" />, status: "idle" },
  { id: "email", x: 600, y: 120, title: "Send Welcome Email", icon: <Mail className="h-4 w-4" />, status: "running" },
];

const PIPELINE_EDGES: WorkflowEdgeData[] = [
  { id: "trigger-filter", source: "trigger", target: "filter" },
  { id: "trigger-delay", source: "trigger", target: "delay" },
  { id: "filter-email", source: "filter", target: "email", label: "verified" },
  { id: "delay-email", source: "delay", target: "email" },
];

/** Wires up the controlled nodes/edges/selection state a story needs to be interactive. */
function useWorkflowState(initialNodes: WorkflowNodeData[], initialEdges: WorkflowEdgeData[] = []) {
  const [nodes, setNodes] = React.useState<WorkflowNodeData[]>(initialNodes);
  const [edges, setEdges] = React.useState<WorkflowEdgeData[]>(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = React.useState<string | null>(null);

  const onConnect = React.useCallback((connection: { source: string; target: string }) => {
    setEdges((prev) => [...prev, { id: `${connection.source}->${connection.target}-${prev.length}`, ...connection }]);
  }, []);

  const onNodeDelete = React.useCallback((id: string) => {
    setNodes((prev) => prev.filter((node) => node.id !== id));
    setEdges((prev) => prev.filter((edge) => edge.source !== id && edge.target !== id));
    setSelectedNodeId((prev) => (prev === id ? null : prev));
  }, []);

  return { nodes, setNodes, edges, setEdges, selectedNodeId, setSelectedNodeId, onConnect, onNodeDelete };
}

export const Default: Story = {
  render: (args) => {
    const state = useWorkflowState(PIPELINE_NODES, PIPELINE_EDGES);
    return (
      <WorkflowBuilderLayout
        {...args}
        nodes={state.nodes}
        edges={state.edges}
        onNodesChange={state.setNodes}
        onConnect={state.onConnect}
        onNodeDelete={state.onNodeDelete}
        selectedNodeId={state.selectedNodeId}
        onNodeSelect={state.setSelectedNodeId}
        paletteItems={PALETTE_ITEMS}
        showNodeEditButton={false}
      />
    );
  },
};

export const WithHeaderAndActions: Story = {
  render: (args) => {
    const state = useWorkflowState(PIPELINE_NODES, PIPELINE_EDGES);
    return (
      <WorkflowBuilderLayout
        {...args}
        nodes={state.nodes}
        edges={state.edges}
        onNodesChange={state.setNodes}
        onConnect={state.onConnect}
        selectedNodeId={state.selectedNodeId}
        onNodeSelect={state.setSelectedNodeId}
        paletteItems={PALETTE_ITEMS}
        header={
          <div className="flex items-center gap-2 text-sm font-semibold tracking-tight">
            <Sparkles className="h-4 w-4" />
            Onboarding Flow
          </div>
        }
        actions={
          <a href="#" aria-label="GitHub" className="rounded-md p-2 hover:bg-[var(--accent)]">
            <Github className="h-4 w-4" />
          </a>
        }
        showNodeEditButton={false}
      />
    );
  },
};

export const WithInspector: Story = {
  render: (args) => {
    const state = useWorkflowState(PIPELINE_NODES, PIPELINE_EDGES);
    const selectedNode = state.nodes.find((node) => node.id === state.selectedNodeId) ?? null;
    return (
      <WorkflowBuilderLayout
        {...args}
        nodes={state.nodes}
        edges={state.edges}
        onNodesChange={state.setNodes}
        onConnect={state.onConnect}
        onNodeDelete={state.onNodeDelete}
        selectedNodeId={state.selectedNodeId}
        onNodeSelect={state.setSelectedNodeId}
        paletteItems={PALETTE_ITEMS}
        inspector={
          selectedNode && (
            <div className="flex flex-col gap-3">
              <label className="flex flex-col gap-1 text-xs font-medium text-[var(--muted-foreground)]">
                Node title
                <input
                  className="rounded-md border border-[var(--border)] bg-[var(--background)] px-2 py-1 text-sm text-[var(--foreground)]"
                  value={selectedNode.title}
                  onChange={(event) =>
                    state.setNodes((prev) =>
                      prev.map((node) => (node.id === selectedNode.id ? { ...node, title: event.target.value } : node))
                    )
                  }
                />
              </label>
              <p className="text-xs text-[var(--muted-foreground)]">Node id: {selectedNode.id}</p>
            </div>
          )
        }
      />
    );
  },
};

export const WithoutGrid: Story = {
  render: (args) => {
    const state = useWorkflowState(PIPELINE_NODES, PIPELINE_EDGES);
    return (
      <WorkflowBuilderLayout
        {...args}
        nodes={state.nodes}
        edges={state.edges}
        onNodesChange={state.setNodes}
        onConnect={state.onConnect}
        showGrid={false}
        showNodeEditButton={false}
      />
    );
  },
};

export const WithoutControls: Story = {
  render: (args) => {
    const state = useWorkflowState(PIPELINE_NODES, PIPELINE_EDGES);
    return (
      <WorkflowBuilderLayout
        {...args}
        nodes={state.nodes}
        edges={state.edges}
        onNodesChange={state.setNodes}
        onConnect={state.onConnect}
        showControls={false}
        showNodeEditButton={false}
      />
    );
  },
};

export const DragFromPalette: Story = {
  render: (args) => {
    const state = useWorkflowState(PIPELINE_NODES.slice(0, 1));
    let nextId = 1;
    return (
      <WorkflowBuilderLayout
        {...args}
        nodes={state.nodes}
        edges={state.edges}
        onNodesChange={state.setNodes}
        onConnect={state.onConnect}
        onNodeDelete={state.onNodeDelete}
        selectedNodeId={state.selectedNodeId}
        onNodeSelect={state.setSelectedNodeId}
        paletteItems={PALETTE_ITEMS}
        onPaletteItemDrop={(item, position) => {
          const id = `${item.type}-${nextId++}`;
          state.setNodes((prev) => [
            ...prev,
            { id, x: position.x, y: position.y, title: item.label, icon: item.icon, status: "idle" },
          ]);
        }}
        showNodeEditButton={false}
      />
    );
  },
};

export const NodeStatuses: Story = {
  args: {
    showNodeEditButton: false,
    nodes: [
      { id: "idle", x: 40, y: 40, title: "Idle", status: "idle" },
      { id: "running", x: 320, y: 40, title: "Running", status: "running" },
      { id: "success", x: 40, y: 220, title: "Success", status: "success" },
      { id: "error", x: 320, y: 220, title: "Error", status: "error" },
    ],
  },
};
