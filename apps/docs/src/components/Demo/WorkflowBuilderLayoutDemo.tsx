import React, { useState, useCallback } from 'react';
import VariantSelector from './VariantSelector';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import {
  WorkflowBuilderLayout,
  type WorkflowNodeData,
  type WorkflowEdgeData,
  type WorkflowPaletteItem,
} from '@site/src/components/UI/workflow-builder-layout';
import { Sparkles, Github, Webhook, Mail, Filter, Clock, Play } from 'lucide-react';

const gridSizes = ['16', '24', '32', '48'];
const maxZooms = ['1.5', '2', '2.5', '4'];

const PALETTE_ITEMS: WorkflowPaletteItem[] = [
  { type: 'webhook', label: 'Webhook', icon: <Webhook className="h-4 w-4" />, description: 'Start on an HTTP call' },
  { type: 'filter', label: 'Filter', icon: <Filter className="h-4 w-4" />, description: 'Keep matching items only' },
  { type: 'delay', label: 'Delay', icon: <Clock className="h-4 w-4" />, description: 'Wait before continuing' },
  { type: 'email', label: 'Send Email', icon: <Mail className="h-4 w-4" />, description: 'Send a templated email' },
];

const INITIAL_NODES: WorkflowNodeData[] = [
  { id: 'trigger', x: 20, y: 90, title: 'New Signup', icon: <Play className="h-4 w-4" />, status: 'success' },
  { id: 'filter', x: 280, y: 20, title: 'Filter: Verified', icon: <Filter className="h-4 w-4" />, status: 'idle' },
  { id: 'email', x: 540, y: 90, title: 'Send Welcome Email', icon: <Mail className="h-4 w-4" />, status: 'running' },
];

const INITIAL_EDGES: WorkflowEdgeData[] = [
  { id: 'trigger-filter', source: 'trigger', target: 'filter' },
  { id: 'filter-email', source: 'filter', target: 'email', label: 'verified' },
];

const codeString = `
import {
  WorkflowBuilderLayout,
  type WorkflowNodeData,
  type WorkflowEdgeData,
} from '@ignix-ui/workflow-builder-layout';
import { Play, Filter, Mail } from 'lucide-react';

const [nodes, setNodes] = useState<WorkflowNodeData[]>([
  { id: 'trigger', x: 20, y: 90, title: 'New Signup', icon: <Play className="h-4 w-4" />, status: 'success' },
  { id: 'filter', x: 280, y: 20, title: 'Filter: Verified', icon: <Filter className="h-4 w-4" /> },
  { id: 'email', x: 540, y: 90, title: 'Send Welcome Email', icon: <Mail className="h-4 w-4" />, status: 'running' },
]);
const [edges, setEdges] = useState<WorkflowEdgeData[]>([
  { id: 'trigger-filter', source: 'trigger', target: 'filter' },
  { id: 'filter-email', source: 'filter', target: 'email', label: 'verified' },
]);

<WorkflowBuilderLayout
  nodes={nodes}
  edges={edges}
  onNodesChange={setNodes}
  onConnect={(edge) => setEdges((prev) => [...prev, { id: \`\${edge.source}-\${edge.target}\`, ...edge }])}
  paletteItems={[{ type: 'webhook', label: 'Webhook' }]}
/>
`;

const WorkflowBuilderLayoutDemo = () => {
  const [gridSize, setGridSize] = useState<number>(32);
  const [maxZoom, setMaxZoom] = useState<number>(2.5);
  const [nodes, setNodes] = useState<WorkflowNodeData[]>(INITIAL_NODES);
  const [edges, setEdges] = useState<WorkflowEdgeData[]>(INITIAL_EDGES);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const onConnect = useCallback((connection: { source: string; target: string }) => {
    setEdges((prev) => [...prev, { id: `${connection.source}-${connection.target}-${prev.length}`, ...connection }]);
  }, []);

  const onNodeDelete = useCallback((id: string) => {
    setNodes((prev) => prev.filter((node) => node.id !== id));
    setEdges((prev) => prev.filter((edge) => edge.source !== id && edge.target !== id));
    setSelectedNodeId((prev) => (prev === id ? null : prev));
  }, []);

  const onPaletteItemDrop = useCallback((item: WorkflowPaletteItem, position: { x: number; y: number }) => {
    setNodes((prev) => [
      ...prev,
      { id: `${item.type}-${prev.length}`, x: position.x, y: position.y, title: item.label, icon: item.icon, status: 'idle' },
    ]);
  }, []);

  const selectedNode = nodes.find((node) => node.id === selectedNodeId) ?? null;

  return (
    <div>
      <div className="flex flex-wrap gap-4 justify-start sm:justify-end">
        <VariantSelector
          variants={gridSizes}
          selectedVariant={gridSize.toString()}
          onSelectVariant={(val) => setGridSize(Number(val))}
          type="Grid Size"
        />
        <VariantSelector
          variants={maxZooms}
          selectedVariant={maxZoom.toString()}
          onSelectVariant={(val) => setMaxZoom(Number(val))}
          type="Max Zoom"
        />
      </div>
      <Tabs>
        <TabItem value="preview" label="Preview" default>
          <div className="border border-gray-300 rounded-lg overflow-hidden mt-4" style={{ height: 480 }}>
            <WorkflowBuilderLayout
              header={
                <div className="flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-sm font-semibold tracking-tight text-primary-foreground">
                  <Sparkles className="h-4 w-4" />
                  Onboarding Flow
                </div>
              }
              actions={
                <a href="#" aria-label="GitHub" className="rounded-md p-2 hover:bg-[var(--accent)]">
                  <Github className="h-4 w-4" />
                </a>
              }
              minZoom={0.25}
              maxZoom={maxZoom}
              gridSize={gridSize}
              nodes={nodes}
              edges={edges}
              onNodesChange={setNodes}
              onConnect={onConnect}
              onNodeDelete={onNodeDelete}
              selectedNodeId={selectedNodeId}
              onNodeSelect={setSelectedNodeId}
              paletteItems={PALETTE_ITEMS}
              onPaletteItemDrop={onPaletteItemDrop}
              inspector={
                selectedNode && (
                  <div className="flex flex-col gap-3">
                    <label className="flex flex-col gap-1 text-xs font-medium text-[var(--muted-foreground)]">
                      Node title
                      <input
                        className="rounded-md border border-[var(--border)] bg-[var(--background)] px-2 py-1 text-sm text-[var(--foreground)]"
                        value={selectedNode.title}
                        onChange={(event) =>
                          setNodes((prev) =>
                            prev.map((node) =>
                              node.id === selectedNode.id ? { ...node, title: event.target.value } : node
                            )
                          )
                        }
                      />
                    </label>
                    <p className="text-xs text-[var(--muted-foreground)]">Node id: {selectedNode.id}</p>
                  </div>
                )
              }
            />
          </div>
        </TabItem>
        <TabItem value="code" label="Code">
          <div className="mt-4">
            <CodeBlock language="tsx" className="text-sm">
              {codeString}
            </CodeBlock>
          </div>
        </TabItem>
      </Tabs>
    </div>
  );
};

export default WorkflowBuilderLayoutDemo;
