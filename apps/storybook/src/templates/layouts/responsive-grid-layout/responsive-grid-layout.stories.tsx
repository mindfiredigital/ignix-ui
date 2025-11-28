import type { Meta, StoryObj } from "@storybook/react-vite";
import { Sparkles } from "lucide-react";
import { ResponsiveGridLayout, type ResponsiveGridItem } from "./index";
import { Navbar } from "../../../components/navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/card";

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
    statValue: "68 integrations",
    statChange: "+8 new",
    statTrend: "up",
    actionLabel: "Open marketplace",
  },
];

const meta: Meta<typeof ResponsiveGridLayout> = {
  title: "Templates/Layouts/ResponsiveGridLayout",
  component: ResponsiveGridLayout,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Responsive grid layout template for CLI dashboards. It keeps a header, auto-flowing cards, and a footer aligned across breakpoints at 640px, 768px, 1024px, and 1280px.",
      },
    },
  },
  argTypes: {
    gap: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    padding: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    maxWidth: {
      control: "select",
      options: ["3xl", "4xl", "5xl", "6xl", "7xl", "full", "prose"],
    },
    
  },
};

export default meta;
type Story = StoryObj<typeof ResponsiveGridLayout>;

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

export const Default: Story = {
  args: {
    header: <HeaderContent />,
    footer: <FooterContent />,
    items: gridItems,
  },
};

export const CustomCardRenderer: Story = {
  args: {
    ...Default.args,
    renderItem: (item: ResponsiveGridItem, index: number) => (
      <Card
        key={item.id ?? index}
        variant="premium"
        interactive="lift"
        className="h-full rounded-3xl"
      >
        <CardHeader className="space-y-3">
          <CardTitle className="text-2xl">{item.title}</CardTitle>
          {item.description && (
            <CardDescription className="text-base leading-relaxed">
              {item.description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {item.statValue && (
            <p className="text-4xl font-bold">{item.statValue}</p>
          )}
          <div className="flex flex-wrap gap-2 text-xs uppercase tracking-wide text-primary">
            {typeof item.badge === "string" ? (
              <span>{item.badge}</span>
            ) : (
              item.badge
            )}
            {item.meta && <span className="text-muted-foreground">{item.meta}</span>}
          </div>
        </CardContent>
      </Card>
    ),
  },
};

export const CompactMobileFirst: Story = {
  args: {
    header: <HeaderContent />,
    footer: <FooterContent />,
    items: gridItems.slice(0, 4),
    gap: "sm",
    padding: "sm",
    maxWidth: "5xl",
    className: "bg-background",
  },
  parameters: {
    viewport: {
      defaultViewport: "iphone12",
    },
    docs: {
      description: {
        story:
          "Demonstrates touch-friendly spacing, tighter gutters, and the single-column mobile view. Switch to desktop to see the grid expand to 3–4 columns automatically.",
      },
    },
  },
};


