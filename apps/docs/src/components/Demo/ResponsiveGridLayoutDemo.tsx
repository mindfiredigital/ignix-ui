import React, { useState } from 'react';
import VariantSelector from './VariantSelector';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import { ResponsiveGridLayout, type ResponsiveGridItem } from '@site/src/components/UI/responsive-grid-layout';
import { Navbar } from '@site/src/components/UI/navbar';
import { Sparkles } from 'lucide-react';

const gapOptions = ['sm', 'md', 'lg'];
const paddingOptions = ['sm', 'md', 'lg'];
const maxWidthOptions = ['3xl', '4xl', '5xl', '6xl', '7xl', 'full'];

const gridItems: ResponsiveGridItem[] = [
  {
    id: "init",
    badge: "Getting started",
    title: "ignix init",
    description: "Bootstrap a new workspace with linting, testing, and CI wiring in under 3 minutes.",
    statValue: "3 min",
    statChange: "avg setup",
    statTrend: "neutral",
    meta: "Updated 2h ago",
    actionLabel: "Run ignix init",
  },
  {
    id: "scan",
    badge: "Quality",
    title: "Security Scan",
    description: "Audit dependencies, secrets, and config drift before every deploy.",
    statValue: "12 issues",
    statChange: "−4 this week",
    statTrend: "up",
    meta: "Last scan 32m ago",
    actionLabel: "View report",
  },
  {
    id: "deploy",
    badge: "Delivery",
    title: "One-command deploys",
    description: "Target preview, staging, or production environments directly from the CLI.",
    statValue: "28% faster",
    statChange: "vs. manual",
    statTrend: "up",
    actionLabel: "Deploy now",
  },
  {
    id: "metrics",
    badge: "Insights",
    title: "Realtime metrics",
    description: "Track build duration, bundle size, and regression signals in one place.",
    statValue: "9.4s",
    statChange: "+1.2s",
    statTrend: "down",
    meta: "Build #248",
  },
  {
    id: "templates",
    badge: "Templates",
    title: "Curated starters",
    description: "Pick from dashboard, marketing, and application templates optimized for Ignix UI.",
    statValue: "24 kits",
    statTrend: "neutral",
    actionLabel: "Browse gallery",
  },
  {
    id: "workflows",
    badge: "Automation",
    title: "Guided workflows",
    description: "Answer a few prompts and let the CLI scaffold pipelines, docs, and governance.",
    meta: "Beta",
    actionLabel: "Join waitlist",
  },
  {
    id: "mobile",
    badge: "Mobile",
    title: "Touch-ready controls",
    description: "Tap targets, haptics, and gesture helpers make commands friendly on tablets.",
    statValue: "44%",
    statChange: "mobile users",
    statTrend: "up",
  },
  {
    id: "extensions",
    badge: "Ecosystem",
    title: "Extension marketplace",
    description: "Compose official and community plugins for auth, payments, data, and more.",
    statValue: "68 Ext.",
    statChange: "+8 new",
    statTrend: "up",
    actionLabel: "Open marketplace",
  },
];

const HeaderContent = () => (
  <div className="space-y-4">
    <Navbar variant="primary" size="md" className="rounded-2xl px-6">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <Sparkles className="h-5 w-5" />
          <span className="text-lg font-semibold tracking-tight">
            Ignix CLI
          </span>
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
          <a className="font-semibold text-primary-foreground/80" href="#">
            Docs
          </a>
          <a className="font-semibold text-primary-foreground/80" href="#">
            Templates
          </a>
          <a className="font-semibold text-primary-foreground/80" href="#">
            Deploy
          </a>
        </div>
      </div>
    </Navbar>
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-[0.35rem] text-primary">
        Build once. Ship everywhere.
      </p>
      <h1 className="text-3xl font-bold tracking-tight">
        Responsive Grid Layout
      </h1>
      <p className="text-sm text-muted-foreground leading-relaxed">
        The cards below demonstrate how Ignix UI reflows from a single column on
        phones to multi-column grids on tablets, laptops, and large monitors.
      </p>
    </div>
  </div>
);

const FooterContent = () => (
  <div className="flex flex-col gap-2 text-center text-xs text-muted-foreground sm:text-sm">
    <span>Need a different breakpoint? Override the grid classes via props.</span>
    <span>© {new Date().getFullYear()} Ignix UI. Crafted for developers on the move.</span>
  </div>
);

const ResponsiveGridLayoutDemo = () => {
  const [gap, setGap] = useState('md');
  const [padding, setPadding] = useState('md');
  const [maxWidth, setMaxWidth] = useState('7xl');

  const codeString = `<ResponsiveGridLayout
  gap="${gap}"
  padding="${padding}"
  maxWidth="${maxWidth}"
  header={<HeaderContent />}
  footer={<FooterContent />}
  items={gridItems}
/>`;

  return (
    <div className="space-y-6 mb-8">
      <div className="flex flex-wrap gap-4 justify-start sm:justify-end">
        <VariantSelector
          variants={gapOptions}
          selectedVariant={gap}
          onSelectVariant={setGap}
          type="Gap"
        />
        <VariantSelector
          variants={paddingOptions}
          selectedVariant={padding}
          onSelectVariant={setPadding}
          type="Padding"
        />
        <VariantSelector
          variants={maxWidthOptions}
          selectedVariant={maxWidth}
          onSelectVariant={setMaxWidth}
          type="Max Width"
        />
      </div>
      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="border rounded-lg overflow-hidden">
            <ResponsiveGridLayout
              gap={gap as any}
              padding={padding as any}
              maxWidth={maxWidth as any}
              header={<HeaderContent />}
              footer={<FooterContent />}
              items={gridItems}
            />
          </div>
        </TabItem>
        <TabItem value="code" label="Code">
          <CodeBlock language="tsx" className="whitespace-pre-wrap max-h-[500px] overflow-y-scroll">
            {codeString}
          </CodeBlock>
        </TabItem>
      </Tabs>
    </div>
  );
};

export default ResponsiveGridLayoutDemo;

