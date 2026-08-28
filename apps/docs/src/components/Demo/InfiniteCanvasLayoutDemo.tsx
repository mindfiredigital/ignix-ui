import React, { useState } from 'react';
import VariantSelector from './VariantSelector';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import { InfiniteCanvasLayout, CanvasNode } from '@site/src/components/UI/infinite-canvas-layout';
import { Sparkles, Github } from 'lucide-react';
import { Navbar } from '@site/src/components/UI/navbar';

const gridSizes = ['16', '24', '32', '48'];
const maxZooms = ['1.5', '2', '2.5', '4'];

const SampleCard = ({ label, color }: { label: string; color: string }) => (
  <div
    className="flex h-28 w-52 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--card)] p-4 text-sm font-medium text-[var(--card-foreground)] shadow-md"
    style={{ borderTopColor: color, borderTopWidth: 3 }}
  >
    {label}
  </div>
);

const InfiniteCanvasLayoutDemo = () => {
  const [gridSize, setGridSize] = useState<number>(32);
  const [maxZoom, setMaxZoom] = useState<number>(2.5);

  const codeString = `
import { InfiniteCanvasLayout, CanvasNode } from '@ignix-ui/infinitecanvaslayout';

<InfiniteCanvasLayout
  header={<span className="font-bold">Board</span>}
  actions={<a href="https://github.com" aria-label="GitHub"><GithubIcon /></a>}
  minZoom={0.25}
  maxZoom={${maxZoom}}
  gridSize={${gridSize}}
>
  <CanvasNode x={0} y={0}>
    <Card label="Idea" />
  </CanvasNode>
  <CanvasNode x={320} y={80}>
    <Card label="Sketch" />
  </CanvasNode>
  <CanvasNode x={80} y={280}>
    <Card label="Draft" />
  </CanvasNode>
</InfiniteCanvasLayout>
`;

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
            <InfiniteCanvasLayout
              header={
                <Navbar variant="primary" size="md" className="rounded-none px-4 w-full">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    <span className="text-sm font-semibold tracking-tight">Board</span>
                  </div>
                </Navbar>
              }
              actions={
                <a href="#" aria-label="GitHub" className="rounded-md p-2 hover:bg-[var(--accent)]">
                  <Github className="h-4 w-4" />
                </a>
              }
              minZoom={0.25}
              maxZoom={maxZoom}
              gridSize={gridSize}
            >
              <CanvasNode x={0} y={0}>
                <SampleCard label="Idea" color="#6366f1" />
              </CanvasNode>
              <CanvasNode x={280} y={70}>
                <SampleCard label="Sketch" color="#22c55e" />
              </CanvasNode>
              <CanvasNode x={70} y={240}>
                <SampleCard label="Draft" color="#f59e0b" />
              </CanvasNode>
              <CanvasNode x={360} y={280}>
                <SampleCard label="Review" color="#ef4444" />
              </CanvasNode>
            </InfiniteCanvasLayout>
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

export default InfiniteCanvasLayoutDemo;
