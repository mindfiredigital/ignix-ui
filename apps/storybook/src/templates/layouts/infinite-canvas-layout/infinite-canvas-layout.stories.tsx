/**
 * @file infinite-canvas-layout.stories.tsx
 * @description Storybook stories for the InfiniteCanvasLayout template. Covers the pannable/
 * zoomable canvas surface, CanvasNode placement, the floating zoom controls, the optional
 * header/actions slots, and controlled vs. uncontrolled viewport state.
 */

import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { InfiniteCanvasLayout, CanvasNode, type CanvasViewport } from ".";
import { Sparkles, Github } from "lucide-react";
import { cn } from "../../../../utils/cn";

const meta: Meta<typeof InfiniteCanvasLayout> = {
  title: "Templates/Layouts/InfiniteCanvasLayout",
  component: InfiniteCanvasLayout,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A pannable, zoomable canvas workspace shell - the shape behind whiteboard/canvas tools. An optional top toolbar sits above a full-bleed canvas; content is placed via CanvasNode at fixed world coordinates, and the whole layer pans/zooms together via drag, wheel/trackpad, keyboard, or the floating zoom controls.",
      },
    },
  },
  argTypes: {
    minZoom: { control: { type: "number", min: 0.1, max: 1, step: 0.05 } },
    maxZoom: { control: { type: "number", min: 1, max: 4, step: 0.25 } },
    gridSize: { control: { type: "number", min: 8, max: 128, step: 8 } },
    showGrid: { control: "boolean" },
    showControls: { control: "boolean" },
  },
};

export default meta;

type Story = StoryObj<typeof InfiniteCanvasLayout>;

const CARD_ACCENT_CLASSES: Record<string, string> = {
  "#6366f1": "border-t-indigo-500",
  "#22c55e": "border-t-green-500",
  "#f59e0b": "border-t-amber-500",
  "#ef4444": "border-t-red-500",
};

const SampleCard: React.FC<{ label: string; color: string; className?: string }> = ({ label, color, className }) => (
  <div
    className={cn(
      "flex h-32 w-56 items-center justify-center rounded-lg border border-t-[3px] border-[var(--border)] bg-[var(--card)] p-4 text-sm font-medium text-[var(--card-foreground)] shadow-md",
      CARD_ACCENT_CLASSES[color],
      className
    )}
  >
    {label}
  </div>
);

export const Default: Story = {
  args: {
    children: (
      <>
        <CanvasNode x={0} y={0}>
          <SampleCard label="Idea" color="#6366f1" />
        </CanvasNode>
        <CanvasNode x={320} y={80}>
          <SampleCard label="Sketch" color="#22c55e" />
        </CanvasNode>
        <CanvasNode x={80} y={280}>
          <SampleCard label="Draft" color="#f59e0b" />
        </CanvasNode>
        <CanvasNode x={420} y={320}>
          <SampleCard label="Review" color="#ef4444" />
        </CanvasNode>
      </>
    ),
  },
};

export const WithHeaderAndActions: Story = {
  args: {
    ...Default.args,
    header: (
      <div className="flex items-center gap-2 text-sm font-semibold tracking-tight">
        <Sparkles className="h-4 w-4" />
        Board
      </div>
    ),
    actions: (
      <a href="#" aria-label="GitHub" className="rounded-md p-2 hover:bg-[var(--accent)]">
        <Github className="h-4 w-4" />
      </a>
    ),
  },
};

export const WithoutGrid: Story = {
  args: {
    ...Default.args,
    showGrid: false,
  },
};

export const WithoutControls: Story = {
  args: {
    ...Default.args,
    showControls: false,
  },
};

export const ManyNodes: Story = {
  args: {
    children: (
      <>
        {Array.from({ length: 24 }).map((_, index) => {
          const col = index % 6;
          const row = Math.floor(index / 6);
          return (
            <CanvasNode key={index} x={col * 260} y={row * 200}>
              <SampleCard label={`Node ${index + 1}`} color={["#6366f1", "#22c55e", "#f59e0b", "#ef4444"][index % 4]} />
            </CanvasNode>
          );
        })}
      </>
    ),
  },
};

export const CustomZoomLimits: Story = {
  args: {
    ...Default.args,
    minZoom: 0.5,
    maxZoom: 1.5,
    defaultViewport: { x: 0, y: 0, zoom: 0.75 },
  },
};

export const ControlledViewport: Story = {
  render: (args) => {
    const [viewport, setViewport] = React.useState<CanvasViewport>({ x: 0, y: 0, zoom: 1 });
    return (
      <div className="relative h-full w-full">
        <InfiniteCanvasLayout {...args} viewport={viewport} onViewportChange={setViewport} />
        <div className="pointer-events-none absolute left-4 top-20 z-10 rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 font-mono text-xs">
          x: {Math.round(viewport.x)}, y: {Math.round(viewport.y)}, zoom: {viewport.zoom.toFixed(2)}
        </div>
      </div>
    );
  },
  args: {
    ...Default.args,
    header: <span className="text-sm font-semibold">Controlled viewport</span>,
  },
};
