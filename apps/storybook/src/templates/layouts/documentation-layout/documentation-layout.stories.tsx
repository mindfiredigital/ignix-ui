/**
 * @file documentation-layout.stories.tsx
 * @description Storybook stories for the DocumentationLayout template. Covers the
 * navigation sidebar (flat and nested/collapsible), the scroll-spy table of contents,
 * breadcrumbs, prev/next page links, and responsive (mobile drawer) behavior.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { DocumentationLayout, type DocNavSection, type TocHeading } from ".";
import { Github } from "lucide-react";

const meta: Meta<typeof DocumentationLayout> = {
  title: "Templates/Layouts/DocumentationLayout",
  component: DocumentationLayout,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A full-page documentation/reference site shell: sticky header, a collapsible-tree left navigation sidebar (a drawer on mobile), page content with breadcrumbs and prev/next links, and a scroll-spy 'On this page' panel.",
      },
    },
  },
  argTypes: {
    sidebarWidth: {
      control: { type: "number", min: 200, max: 400, step: 20 },
      description: "Left sidebar width in px",
    },
    tocWidth: {
      control: { type: "number", min: 160, max: 320, step: 20 },
      description: "Right 'On this page' panel width in px",
    },
    mobileBreakpoint: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Breakpoint below which the left sidebar becomes a drawer",
    },
  },
};

export default meta;

type Story = StoryObj<typeof DocumentationLayout>;

const navSections: DocNavSection[] = [
  {
    label: "Getting Started",
    items: [
      { label: "Introduction", href: "#", active: true },
      { label: "Installation", href: "#" },
      { label: "Quick Start", href: "#" },
    ],
  },
  {
    label: "Guides",
    items: [
      {
        label: "Theming",
        items: [
          { label: "Core Concepts", href: "#" },
          { label: "Dark Mode", href: "#" },
        ],
      },
      {
        label: "Components",
        items: [
          { label: "Button", href: "#" },
          { label: "Textarea", href: "#" },
        ],
      },
    ],
  },
];

const tocHeadings: TocHeading[] = [
  { id: "overview", label: "Overview" },
  { id: "installation", label: "Installation" },
  { id: "usage", label: "Usage" },
  { id: "basic-example", label: "Basic Example", depth: 3 },
  { id: "advanced-example", label: "Advanced Example", depth: 3 },
  { id: "props", label: "Props" },
];

const SampleContent = () => (
  <article className="prose prose-neutral max-w-none dark:prose-invert">
    <h2 id="overview">Overview</h2>
    <p>
      This layout provides a sticky header, a collapsible navigation sidebar, and a
      scroll-spy table of contents - the standard shape for a documentation or
      reference site.
    </p>
    <h2 id="installation">Installation</h2>
    <p>Add the template to your project via the CLI, then wrap your page content with it.</p>
    <h2 id="usage">Usage</h2>
    <p>Pass navSections for the left sidebar and tocHeadings for the right panel.</p>
    <h3 id="basic-example">Basic Example</h3>
    <p>A minimal setup with just navSections and children.</p>
    <h3 id="advanced-example">Advanced Example</h3>
    <p>Add breadcrumbs, a title, and previous/next page links for a complete page.</p>
    <h2 id="props">Props</h2>
    <p>See the Props table below for the full API.</p>
  </article>
);

export const Default: Story = {
  args: {
    header: <span className="text-sm font-bold">Ignix UI</span>,
    navSections,
    tocHeadings,
    title: "Documentation Layout",
    breadcrumbs: [
      { label: "Docs", href: "#" },
      { label: "Templates", href: "#" },
      { label: "Documentation Layout", href: "#" },
    ],
    previousPage: { label: "Installation", href: "#" },
    nextPage: { label: "Theming", href: "#" },
    editPageUrl: "#",
    children: <SampleContent />,
  },
};

export const WithActions: Story = {
  args: {
    ...Default.args,
    header: <span className="text-sm font-bold">Ignix UI</span>,
    actions: (
      <a href="#" aria-label="GitHub" className="rounded-md p-2 hover:bg-[var(--accent)]">
        <Github className="h-4 w-4" />
      </a>
    ),
  },
};

export const NestedCollapsibleNav: Story = {
  args: {
    header: <span className="text-sm font-bold">Ignix UI</span>,
    navSections,
    title: "Nested Navigation",
    children: (
      <p>
        Click the chevron next to "Theming" or "Components" in the sidebar to expand or
        collapse its nested items.
      </p>
    ),
  },
};

export const CustomSidebarOverride: Story = {
  args: {
    header: <span className="text-sm font-bold">Ignix UI</span>,
    sidebar: (
      <div className="p-4 text-sm text-[var(--muted-foreground)]">
        Fully custom sidebar content, passed via the <code>sidebar</code> prop instead of{" "}
        <code>navSections</code>.
      </div>
    ),
    title: "Custom Sidebar",
    children: <p>The sidebar prop always takes precedence over navSections.</p>,
  },
};

export const CustomTocOverride: Story = {
  args: {
    header: <span className="text-sm font-bold">Ignix UI</span>,
    navSections,
    toc: (
      <div className="text-sm text-[var(--muted-foreground)]">
        Fully custom TOC content, passed via the <code>toc</code> prop instead of{" "}
        <code>tocHeadings</code>.
      </div>
    ),
    title: "Custom Table of Contents",
    children: <p>The toc prop always takes precedence over tocHeadings.</p>,
  },
};

export const NoSidebars: Story = {
  args: {
    header: <span className="text-sm font-bold">Ignix UI</span>,
    title: "No Sidebars",
    children: <p>A page with neither a left navigation nor a right table of contents.</p>,
  },
};

export const NoHeader: Story = {
  args: {
    navSections,
    title: "No Header",
    children: <p>The header is entirely optional.</p>,
  },
};

export const MobileView: Story = {
  globals: {
    viewport: { value: "mobile1", isRotated: false },
  },
  args: {
    header: <span className="text-sm font-bold">Ignix UI</span>,
    navSections,
    tocHeadings,
    title: "Mobile View",
    mobileBreakpoint: "lg",
    children: (
      <p>
        At narrow widths the left sidebar collapses into a drawer, opened via the
        hamburger button in the header.
      </p>
    ),
  },
};
