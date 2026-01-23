import React from "react";
import { ThreeColumnSidebarLayout } from "./index";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Home,
  ChevronRight,
  Github,
  Sun,
  CheckCircle2,
  BarChart3,
  Users,
  ShoppingCart,
  Package,
  TrendingUp,
  Bell,
  Search,
  BookOpen,
  Code,
  Mail,
  Inbox,
  Star,
  Send,
  Pin,
  Paperclip,
  MessageSquare,
  Upload,
  Info,
  Zap,
  ChevronDown,
} from "lucide-react";

const meta: Meta<typeof ThreeColumnSidebarLayout> = {
  title: "Templates/Layouts/ThreeColumnLayout",
  component: ThreeColumnSidebarLayout,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `A Docusaurus-inspired three-column layout with navigation sidebar, main content area, and table of contents sidebar.`,
      },
    },
  },
  argTypes: {
    sidebarWidth: {
      control: { type: "number", min: 200, max: 400, step: 20 },
      description: "Width of the left sidebar in pixels",
    },
    rightSidebarWidth: {
      control: { type: "number", min: 200, max: 400, step: 20 },
      description: "Width of the right sidebar in pixels",
    },
    stickyHeader: {
      control: { type: "boolean" },
      description: "Make header sticky",
    },
    stickyFooter: {
      control: { type: "boolean" },
      description: "Make footer sticky",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ThreeColumnSidebarLayout>;

// Navigation items structure
const navItems = [
  {
    label: "Getting Started",
    items: [
      { label: "Introduction", href: "#", active: true },
      { label: "Installation", href: "#" },
      { label: "Quick Start", href: "#" },
    ],
  },
  {
    label: "Components",
    items: [
      { label: "Table", href: "#" },
      { label: "Textarea", href: "#" },
      { label: "Toast", href: "#" },
      { label: "Tooltip", href: "#" },
      { label: "Typography", href: "#" },
    ],
  },
  {
    label: "Templates",
    items: [
      { label: "Starter", href: "#" },
      { label: "Monorepo Starter", href: "#" },
      { label: "Next.js App Starter", href: "#" },
      { label: "Vite + React Starter", href: "#" },
    ],
  },
  {
    label: "Layouts",
    items: [
      { label: "SingleColumnLayout", href: "#" },
      { label: "SidebarLeft", href: "#" },
      { label: "SidebarRight", href: "#" },
      { label: "FullHeightSidebar", href: "#" },
      { label: "ResponsiveGridLayout", href: "#" },
      { label: "ThreeColumnLayout", href: "#" },
    ],
  },
  {
    label: "Pages",
    items: [
      { label: "Authentication", href: "#" },
      { label: "Signin", href: "#" },
    ],
  },
];

// Table of contents items - converted to navItems format
const tocNavItems = [
  {
    label: "On this page",
    items: [
      { label: "Finding the Sweet Spot in the UI Landscape", href: "#finding-the-sweet-spot-in-the-ui-landscape" },
      { label: "Why Ignix UI", href: "#why-ignix-ui" },
      { label: "FAQ", href: "#faq" },
      { label: "Is Ignix UI a copy-paste library?", href: "#is-ignix-ui-a-copy-paste-library" },
      { label: "What makes Ignix UI a one-stop solution?", href: "#what-makes-ignix-ui-a-one-stop-solution" },
      { label: "Does Ignix UI support TypeScript?", href: "#does-ignix-ui-support-typescript" },
      { label: "Get Started", href: "#get-started" },
      { label: "Community", href: "#community" },
      { label: "Contributing", href: "#contributing" },
    ],
  },
];

// Docusaurus-style Documentation Layout
export const Documentation: Story = {
  args: {
    header: (
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <div>
            <span className="text-lg font-bold text-[var(--foreground)]">Ignix UI</span>
            <span className="text-sm text-[var(--muted-foreground)] ml-2">Documentation</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-md hover:bg-[var(--accent)] transition-colors">
            <Github className="w-5 h-5 text-[var(--foreground)]" />
          </button>
          <button className="p-2 rounded-md hover:bg-[var(--accent)] transition-colors">
            <Sun className="w-5 h-5 text-[var(--foreground)]" />
          </button>
        </div>
      </div>
    ),
    navItems: navItems,
    tocItems: tocNavItems,
    children: (
      <article className="prose prose-sm max-w-none">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 mb-4 text-sm">
          <Home className="w-4 h-4 text-[var(--muted-foreground)]" />
          <span className="text-[var(--muted-foreground)]">Getting Started</span>
          <ChevronRight className="w-4 h-4 text-[var(--muted-foreground)]" />
          <span className="px-2 py-0.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] font-medium">
            Introduction
          </span>
        </nav>

        {/* Version Badge */}
        <div className="mb-6">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-[var(--muted)] text-[var(--muted-foreground)]">
            <CheckCircle2 className="w-3 h-3" />
            Version: 1.0.3
          </span>
        </div>

        {/* Main Content */}
        <h1 className="text-4xl font-bold mb-4 text-[var(--foreground)]">Welcome to Ignix UI</h1>

        <p className="text-lg text-[var(--muted-foreground)] mb-6 leading-relaxed">
          Ignix UI is a modern, production-ready React UI system built with Tailwind CSS. It's designed
          for developer happiness, providing a polished and performant foundation out of the box.
        </p>

        <p className="text-base text-[var(--muted-foreground)] mb-8 leading-relaxed">
          Whether you're building a simple landing page or a complex dashboard, Ignix UI gives you the
          components and patterns you need to ship faster without compromising on quality or flexibility.
        </p>

        <h2 id="finding-the-sweet-spot-in-the-ui-landscape" className="text-2xl font-bold mt-8 mb-4 text-[var(--foreground)]">
          Finding the Sweet Spot in the UI Landscape
        </h2>

        <p className="text-base text-[var(--muted-foreground)] mb-4 leading-relaxed">
          The React ecosystem is flooded with UI libraries, each promising to solve your design system
          needs. But most fall into one of two extremes: rigid, opinionated frameworks that lock you in,
          or unstyled, do-it-yourself primitives that require endless configuration.
        </p>

        <h3 id="why-ignix-ui" className="text-xl font-bold mt-6 mb-4 text-[var(--foreground)]">
          Why Ignix UI
        </h3>

        <div className="space-y-4 mb-6">
          <div>
            <h4 className="font-semibold mb-2 text-[var(--foreground)]">Structure without Restriction</h4>
            <p className="text-[var(--muted-foreground)]">
              Unlike MUI, Ant Design, or Fluent UI, Ignix UI doesn't force you into a specific design
              language. You get well-structured components that you can customize to match your brand.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-2 text-[var(--foreground)]">Productivity without the Pain</h4>
            <p className="text-[var(--muted-foreground)]">
              Say goodbye to JSX bloat. Unlike Chakra UI, Radix, or shadcn/ui, Ignix UI components are
              optimized for readability and maintainability right out of the box.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-2 text-[var(--foreground)]">Lean and Performant</h4>
            <p className="text-[var(--muted-foreground)]">
              Lightweight and optimized, with micro-interactions and animations built-in. No need for
              heavy frameworks like Bootstrap that slow down your app.
            </p>
          </div>
        </div>

        <p className="text-base text-[var(--muted-foreground)] mb-8 leading-relaxed">
          Ignix UI is our rebellion against the compromises. It's not just another library; it's a
          developer-first arsenal, crafted to give you structure, flexibility, and speed.
        </p>

        <h3 id="faq" className="text-xl font-bold mt-6 mb-4 text-[var(--foreground)]">
          FAQ
        </h3>

        <div className="space-y-6">
          <div>
            <h4 id="is-ignix-ui-a-copy-paste-library" className="font-semibold mb-2 text-[var(--foreground)]">
              Is Ignix UI a copy-paste library?
            </h4>
            <p className="text-[var(--muted-foreground)]">
              No. While Ignix UI provides ready-to-use components, it's designed as a complete system
              with consistent patterns, theming, and best practices built-in.
            </p>
          </div>

          <div>
            <h4 id="what-makes-ignix-ui-a-one-stop-solution" className="font-semibold mb-2 text-[var(--foreground)]">
              What makes Ignix UI a one-stop solution?
            </h4>
            <p className="text-[var(--muted-foreground)]">
              Ignix UI includes everything you need: components, layouts, templates, and documentation.
              No need to piece together multiple libraries or frameworks.
            </p>
          </div>

          <div>
            <h4 id="does-ignix-ui-support-typescript" className="font-semibold mb-2 text-[var(--foreground)]">
              Does Ignix UI support TypeScript?
            </h4>
            <p className="text-[var(--muted-foreground)]">
              Yes! Ignix UI is built with TypeScript and provides full type definitions for all
              components and utilities.
            </p>
          </div>
        </div>

        <h3 id="get-started" className="text-xl font-bold mt-8 mb-4 text-[var(--foreground)]">
          Get Started
        </h3>

        <p className="text-base text-[var(--muted-foreground)] mb-6 leading-relaxed">
          Ready to build something amazing? Check out our installation guide and start building with
          Ignix UI today.
        </p>

        <h3 id="community" className="text-xl font-bold mt-8 mb-4 text-[var(--foreground)]">
          Community
        </h3>

        <p className="text-base text-[var(--muted-foreground)] mb-6 leading-relaxed">
          Join our community of developers building beautiful UIs with Ignix UI. Share your projects,
          ask questions, and contribute to the ecosystem.
        </p>

        <h3 id="contributing" className="text-xl font-bold mt-8 mb-4 text-[var(--foreground)]">
          Contributing
        </h3>

        <p className="text-base text-[var(--muted-foreground)] mb-6 leading-relaxed">
          We welcome contributions! Whether it's fixing bugs, adding features, or improving
          documentation, every contribution helps make Ignix UI better.
        </p>
      </article>
    ),
    footer: (
      <div className="text-center text-xs text-[var(--muted-foreground)]">
        © {new Date().getFullYear()} Ignix UI. Built with Docusaurus-inspired layout.
      </div>
    ),
    stickyHeader: true,
    sidebarWidth: 300,
    rightSidebarWidth: 240,
  },
};

// Tablet View - Only Center Content
export const TabletView: Story = {
  args: {
    ...Documentation.args,
  },
  parameters: {
    viewport: {
      defaultViewport: "ipad",
    },
  },
};

// Mobile View
export const MobileView: Story = {
  args: {
    ...Documentation.args,
  },
  parameters: {
    viewport: {
      defaultViewport: "iphone12",
    },
  },
};

// Dashboard Variant
const dashboardNavItems = [
  {
    label: "Main",
    items: [
      { label: "Dashboard", href: "#", active: true },
      { label: "Analytics", href: "#" },
      { label: "Reports", href: "#" },
    ],
  },
  {
    label: "Management",
    items: [
      { label: "Users", href: "#" },
      { label: "Products", href: "#" },
      { label: "Orders", href: "#" },
      { label: "Inventory", href: "#" },
    ],
  },
  {
    label: "Settings",
    items: [
      { label: "General", href: "#" },
      { label: "Security", href: "#" },
      { label: "Notifications", href: "#" },
    ],
  },
];

const dashboardTocItems = [
  {
    label: "Quick Stats",
    items: [
      { label: "Revenue Overview", href: "#revenue" },
      { label: "User Growth", href: "#users" },
      { label: "Top Products", href: "#products" },
      { label: "Recent Activity", href: "#activity" },
    ],
  },
];

export const Dashboard: Story = {
  args: {
    header: (
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-6 h-6 text-[var(--primary)]" />
          <span className="text-lg font-bold text-[var(--foreground)]">Dashboard</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-md hover:bg-[var(--accent)] transition-colors relative">
            <Bell className="w-5 h-5 text-[var(--foreground)]" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <button className="p-2 rounded-md hover:bg-[var(--accent)] transition-colors">
            <Search className="w-5 h-5 text-[var(--foreground)]" />
          </button>
          <button className="p-2 rounded-md hover:bg-[var(--accent)] transition-colors">
            <Sun className="w-5 h-5 text-[var(--foreground)]" />
          </button>
        </div>
      </div>
    ),
    navItems: dashboardNavItems,
    tocItems: dashboardTocItems,
    children: (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 rounded-lg border border-[var(--border)] bg-[var(--card)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[var(--muted-foreground)]">Total Revenue</span>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-[var(--foreground)]">$45,231</p>
            <p className="text-xs text-green-500 mt-1">+20.1% from last month</p>
          </div>
          <div className="p-6 rounded-lg border border-[var(--border)] bg-[var(--card)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[var(--muted-foreground)]">Active Users</span>
              <Users className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-[var(--foreground)]">2,350</p>
            <p className="text-xs text-blue-500 mt-1">+12.5% from last month</p>
          </div>
          <div className="p-6 rounded-lg border border-[var(--border)] bg-[var(--card)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[var(--muted-foreground)]">Orders</span>
              <ShoppingCart className="w-4 h-4 text-purple-500" />
            </div>
            <p className="text-2xl font-bold text-[var(--foreground)]">1,234</p>
            <p className="text-xs text-purple-500 mt-1">+8.2% from last month</p>
          </div>
          <div className="p-6 rounded-lg border border-[var(--border)] bg-[var(--card)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[var(--muted-foreground)]">Products</span>
              <Package className="w-4 h-4 text-orange-500" />
            </div>
            <p className="text-2xl font-bold text-[var(--foreground)]">567</p>
            <p className="text-xs text-orange-500 mt-1">+5.3% from last month</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-lg border border-[var(--border)] bg-[var(--card)]">
            <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">Revenue Overview</h3>
            <div className="h-64 flex items-center justify-center text-[var(--muted-foreground)]">
              Chart placeholder
            </div>
          </div>
          <div className="p-6 rounded-lg border border-[var(--border)] bg-[var(--card)]">
            <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">User Growth</h3>
            <div className="h-64 flex items-center justify-center text-[var(--muted-foreground)]">
              Chart placeholder
            </div>
          </div>
        </div>
      </div>
    ),
    footer: (
      <div className="text-center text-xs text-[var(--muted-foreground)]">
        © {new Date().getFullYear()} Dashboard. All rights reserved.
      </div>
    ),
    stickyHeader: true,
    sidebarWidth: 280,
    rightSidebarWidth: 220,
  },
};

// Blog/Article Variant
const blogNavItems = [
  {
    label: "Categories",
    items: [
      { label: "All Posts", href: "#", active: true },
      { label: "Technology", href: "#" },
      { label: "Design", href: "#" },
      { label: "Business", href: "#" },
      { label: "Lifestyle", href: "#" },
    ],
  },
  {
    label: "Archives",
    items: [
      { label: "2024", href: "#" },
      { label: "2023", href: "#" },
      { label: "2022", href: "#" },
    ],
  },
];

const blogTocItems = [
  {
    label: "Table of Contents",
    items: [
      { label: "Introduction", href: "#intro" },
      { label: "Getting Started", href: "#getting-started" },
      { label: "Key Features", href: "#features" },
      { label: "Best Practices", href: "#practices" },
      { label: "Conclusion", href: "#conclusion" },
    ],
  },
];

export const BlogArticle: Story = {
  args: {
    header: (
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-[var(--primary)]" />
          <span className="text-lg font-bold text-[var(--foreground)]">Blog</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 rounded-md bg-[var(--primary)] text-white hover:opacity-90 transition-opacity">
            Subscribe
          </button>
          <button className="p-2 rounded-md hover:bg-[var(--accent)] transition-colors">
            <Search className="w-5 h-5 text-[var(--foreground)]" />
          </button>
        </div>
      </div>
    ),
    navItems: blogNavItems,
    tocItems: blogTocItems,
    children: (
      <article className="prose prose-lg max-w-none">
        <div className="mb-6">
          <span className="px-3 py-1 rounded-full text-sm bg-[var(--primary)]/10 text-[var(--primary)]">
            Technology
          </span>
          <span className="ml-2 text-sm text-[var(--muted-foreground)]">Jan 21, 2024</span>
        </div>
        <h1 id="intro" className="text-4xl font-bold mb-4 text-[var(--foreground)]">
          Building Modern Web Applications with React
        </h1>
        <p className="text-xl text-[var(--muted-foreground)] mb-8 leading-relaxed">
          Learn how to build scalable, performant web applications using modern React patterns and best practices.
        </p>
        <div className="h-64 bg-[var(--muted)] rounded-lg mb-8 flex items-center justify-center text-[var(--muted-foreground)]">
          Featured Image
        </div>
        <h2 id="getting-started" className="text-2xl font-bold mt-8 mb-4 text-[var(--foreground)]">
          Getting Started
        </h2>
        <p className="text-base text-[var(--muted-foreground)] mb-4 leading-relaxed">
          React has become the de facto standard for building modern web applications. Its component-based architecture
          and declarative syntax make it easier to build and maintain complex user interfaces.
        </p>
        <h2 id="features" className="text-2xl font-bold mt-8 mb-4 text-[var(--foreground)]">
          Key Features
        </h2>
        <ul className="list-disc list-inside space-y-2 text-[var(--muted-foreground)] mb-4">
          <li>Component-based architecture</li>
          <li>Virtual DOM for performance</li>
          <li>Rich ecosystem and community</li>
          <li>TypeScript support</li>
        </ul>
        <h2 id="practices" className="text-2xl font-bold mt-8 mb-4 text-[var(--foreground)]">
          Best Practices
        </h2>
        <p className="text-base text-[var(--muted-foreground)] mb-4 leading-relaxed">
          When building React applications, it's important to follow best practices to ensure maintainability and
          performance. This includes proper state management, component composition, and performance optimization.
        </p>
        <h2 id="conclusion" className="text-2xl font-bold mt-8 mb-4 text-[var(--foreground)]">
          Conclusion
        </h2>
        <p className="text-base text-[var(--muted-foreground)] mb-4 leading-relaxed">
          React continues to evolve and improve, making it an excellent choice for building modern web applications.
          By following best practices and leveraging the rich ecosystem, you can build powerful and maintainable
          applications.
        </p>
      </article>
    ),
    footer: (
      <div className="text-center text-xs text-[var(--muted-foreground)]">
        © {new Date().getFullYear()} Blog. All articles are licensed under CC BY 4.0.
      </div>
    ),
    stickyHeader: true,
    sidebarWidth: 250,
    rightSidebarWidth: 200,
  },
};

// Minimal Variant (No Footer)
export const Minimal: Story = {
  args: {
    header: (
      <div className="flex items-center justify-between w-full">
        <span className="text-lg font-bold text-[var(--foreground)]">Minimal Layout</span>
        <button className="p-2 rounded-md hover:bg-[var(--accent)] transition-colors">
          <Sun className="w-5 h-5 text-[var(--foreground)]" />
        </button>
      </div>
    ),
    navItems: [
      {
        label: "Navigation",
        items: [
          { label: "Home", href: "#", active: true },
          { label: "About", href: "#" },
          { label: "Contact", href: "#" },
        ],
      },
    ],
    children: (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-[var(--foreground)]">Minimal Design</h1>
        <p className="text-[var(--muted-foreground)]">
          This is a minimal layout variant without a footer. Perfect for simple pages and landing sections.
        </p>
      </div>
    ),
    stickyHeader: true,
    stickyFooter: false,
    sidebarWidth: 240,
    rightSidebarWidth: 200,
  },
};

// Custom Sidebar Content Variant
export const CustomSidebars: Story = {
  args: {
    header: (
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <Code className="w-6 h-6 text-[var(--primary)]" />
          <span className="text-lg font-bold text-[var(--foreground)]">Custom Sidebars</span>
        </div>
      </div>
    ),
    sidebar: (
      <div className="h-full p-4">
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-[var(--primary)]/10 border border-[var(--primary)]/20">
            <h3 className="font-semibold mb-2 text-[var(--foreground)]">Custom Left Sidebar</h3>
            <p className="text-sm text-[var(--muted-foreground)]">
              This sidebar uses custom React content instead of navItems.
            </p>
          </div>
          <div className="space-y-2">
            <button className="w-full text-left px-3 py-2 rounded-md hover:bg-[var(--accent)] transition-colors text-sm">
              Custom Item 1
            </button>
            <button className="w-full text-left px-3 py-2 rounded-md hover:bg-[var(--accent)] transition-colors text-sm">
              Custom Item 2
            </button>
            <button className="w-full text-left px-3 py-2 rounded-md hover:bg-[var(--accent)] transition-colors text-sm">
              Custom Item 3
            </button>
          </div>
        </div>
      </div>
    ),
    rightSidebar: (
      <div className="h-full p-4">
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-[var(--muted)] border border-[var(--border)]">
            <h3 className="font-semibold mb-2 text-[var(--foreground)]">Custom Right Sidebar</h3>
            <p className="text-sm text-[var(--muted-foreground)]">
              This sidebar also uses custom React content.
            </p>
          </div>
          <div className="space-y-2">
            <div className="p-3 rounded-md bg-[var(--card)] border border-[var(--border)]">
              <p className="text-xs font-medium text-[var(--foreground)]">Info Card 1</p>
              <p className="text-xs text-[var(--muted-foreground)] mt-1">Additional information</p>
            </div>
            <div className="p-3 rounded-md bg-[var(--card)] border border-[var(--border)]">
              <p className="text-xs font-medium text-[var(--foreground)]">Info Card 2</p>
              <p className="text-xs text-[var(--muted-foreground)] mt-1">More details here</p>
            </div>
          </div>
        </div>
      </div>
    ),
    children: (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-[var(--foreground)]">Custom Sidebar Content</h1>
        <p className="text-[var(--muted-foreground)]">
          This layout demonstrates using custom React components for both sidebars instead of the navItems prop.
          This gives you complete control over the sidebar content and styling.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 rounded-lg border border-[var(--border)] bg-[var(--card)]">
            <h3 className="font-semibold mb-2 text-[var(--foreground)]">Feature 1</h3>
            <p className="text-sm text-[var(--muted-foreground)]">
              Custom sidebars allow for more complex layouts and interactions.
            </p>
          </div>
          <div className="p-6 rounded-lg border border-[var(--border)] bg-[var(--card)]">
            <h3 className="font-semibold mb-2 text-[var(--foreground)]">Feature 2</h3>
            <p className="text-sm text-[var(--muted-foreground)]">
              You can include forms, cards, or any React component in the sidebars.
            </p>
          </div>
        </div>
      </div>
    ),
    footer: (
      <div className="text-center text-xs text-[var(--muted-foreground)]">
        Custom sidebar layout example
      </div>
    ),
    stickyHeader: true,
    sidebarWidth: 280,
    rightSidebarWidth: 260,
  },
};

// Wide Sidebars Variant
export const WideSidebars: Story = {
  args: {
    ...Documentation.args,
    sidebarWidth: 350,
    rightSidebarWidth: 300,
  },
};

// Narrow Sidebars Variant
export const NarrowSidebars: Story = {
  args: {
    ...Documentation.args,
    sidebarWidth: 220,
    rightSidebarWidth: 180,
  },
};

// No Sticky Header/Footer Variant
export const NoSticky: Story = {
  args: {
    ...Documentation.args,
    stickyHeader: false,
    stickyFooter: false,
  },
};

// Dark Theme Variant
export const DarkTheme: Story = {
  args: {
    header: (
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center">
              <div className="w-6 h-6 bg-gradient-to-br from-red-500 to-orange-500 rounded-sm rotate-45" />
            </div>
            <div>
              <span className="text-lg font-bold text-white">Ignix UI</span>
              <span className="text-sm text-gray-400 ml-2">Documentation</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-md hover:bg-gray-700 transition-colors">
            <Github className="w-5 h-5 text-gray-300" />
          </button>
          <button className="p-2 rounded-md hover:bg-gray-700 transition-colors">
            <Sun className="w-5 h-5 text-gray-300" />
          </button>
        </div>
      </div>
    ),
    navItems: navItems,
    tocItems: tocNavItems,
    children: (
      <article className="prose prose-invert prose-sm max-w-none">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 mb-4 text-sm">
          <Home className="w-4 h-4 text-gray-400" />
          <span className="text-gray-400">Getting Started</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 font-medium">
            Introduction
          </span>
        </nav>

        {/* Version Badge */}
        <div className="mb-6">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-gray-800 text-gray-300">
            <CheckCircle2 className="w-3 h-3" />
            Version: 1.0.3
          </span>
        </div>

        {/* Main Content */}
        <h1 className="text-4xl font-bold mb-4 text-white">Welcome to Ignix UI</h1>

        <p className="text-lg text-gray-300 mb-6 leading-relaxed">
          Ignix UI is a modern, production-ready React UI system built with Tailwind CSS. It's designed
          for developer happiness, providing a polished and performant foundation out of the box.
        </p>

        <p className="text-base text-gray-400 mb-8 leading-relaxed">
          Whether you're building a simple landing page or a complex dashboard, Ignix UI gives you the
          components and patterns you need to ship faster without compromising on quality or flexibility.
        </p>

        <h2 id="finding-the-sweet-spot-in-the-ui-landscape" className="text-2xl font-bold mt-8 mb-4 text-white">
          Finding the Sweet Spot in the UI Landscape
        </h2>

        <p className="text-base text-gray-300 mb-4 leading-relaxed">
          The React ecosystem is flooded with UI libraries, each promising to solve your design system
          needs. But most fall into one of two extremes: rigid, opinionated frameworks that lock you in,
          or unstyled, do-it-yourself primitives that require endless configuration.
        </p>

        <h3 id="why-ignix-ui" className="text-xl font-bold mt-6 mb-4 text-white">
          Why Ignix UI
        </h3>

        <div className="space-y-4 mb-6">
          <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
            <h4 className="font-semibold mb-2 text-white">Structure without Restriction</h4>
            <p className="text-gray-300">
              Unlike MUI, Ant Design, or Fluent UI, Ignix UI doesn't force you into a specific design
              language. You get well-structured components that you can customize to match your brand.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
            <h4 className="font-semibold mb-2 text-white">Productivity without the Pain</h4>
            <p className="text-gray-300">
              Say goodbye to JSX bloat. Unlike Chakra UI, Radix, or shadcn/ui, Ignix UI components are
              optimized for readability and maintainability right out of the box.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
            <h4 className="font-semibold mb-2 text-white">Lean and Performant</h4>
            <p className="text-gray-300">
              Lightweight and optimized, with micro-interactions and animations built-in. No need for
              heavy frameworks like Bootstrap that slow down your app.
            </p>
          </div>
        </div>

        <p className="text-base text-gray-300 mb-8 leading-relaxed">
          Ignix UI is our rebellion against the compromises. It's not just another library; it's a
          developer-first arsenal, crafted to give you structure, flexibility, and speed.
        </p>

        <h3 id="faq" className="text-xl font-bold mt-6 mb-4 text-white">
          FAQ
        </h3>

        <div className="space-y-6">
          <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
            <h4 id="is-ignix-ui-a-copy-paste-library" className="font-semibold mb-2 text-white">
              Is Ignix UI a copy-paste library?
            </h4>
            <p className="text-gray-300">
              No. While Ignix UI provides ready-to-use components, it's designed as a complete system
              with consistent patterns, theming, and best practices built-in.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
            <h4 id="what-makes-ignix-ui-a-one-stop-solution" className="font-semibold mb-2 text-white">
              What makes Ignix UI a one-stop solution?
            </h4>
            <p className="text-gray-300">
              Ignix UI includes everything you need: components, layouts, templates, and documentation.
              No need to piece together multiple libraries or frameworks.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
            <h4 id="does-ignix-ui-support-typescript" className="font-semibold mb-2 text-white">
              Does Ignix UI support TypeScript?
            </h4>
            <p className="text-gray-300">
              Yes! Ignix UI is built with TypeScript and provides full type definitions for all
              components and utilities.
            </p>
          </div>
        </div>

        <h3 id="get-started" className="text-xl font-bold mt-8 mb-4 text-white">
          Get Started
        </h3>

        <p className="text-base text-gray-300 mb-6 leading-relaxed">
          Ready to build something amazing? Check out our installation guide and start building with
          Ignix UI today.
        </p>

        <h3 id="community" className="text-xl font-bold mt-8 mb-4 text-white">
          Community
        </h3>

        <p className="text-base text-gray-300 mb-6 leading-relaxed">
          Join our community of developers building beautiful UIs with Ignix UI. Share your projects,
          ask questions, and contribute to the ecosystem.
        </p>

        <h3 id="contributing" className="text-xl font-bold mt-8 mb-4 text-white">
          Contributing
        </h3>

        <p className="text-base text-gray-300 mb-6 leading-relaxed">
          We welcome contributions! Whether it's fixing bugs, adding features, or improving
          documentation, every contribution helps make Ignix UI better.
        </p>
      </article>
    ),
    footer: (
      <div className="text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Ignix UI. Built with Docusaurus-inspired layout.
      </div>
    ),
    stickyHeader: true,
    sidebarWidth: 300,
    rightSidebarWidth: 240,
    className: "bg-gray-900 text-white",
  },
  decorators: [
    (Story) => (
      <div className="bg-gray-900 min-h-screen" style={{ '--background': '#111827', '--foreground': '#f9fafb', '--muted': '#1f2937', '--muted-foreground': '#9ca3af', '--border': '#374151', '--accent': '#374151', '--card': '#1f2937', '--primary': '#ef4444' } as React.CSSProperties}>
        <Story />
      </div>
    ),
  ],
};
// Email Dashboard Variant
const emailNavItems = [
  {
    label: "Folders",
    items: [
      { label: "Inbox", href: "#", active: true },
      { label: "Favorite", href: "#" },
      { label: "Sent", href: "#" },
    ],
  },
  {
    label: "Labels",
    items: [
      { label: "Davis", href: "#" },
      { label: "Family", href: "#" },
    ],
  },
];

const emailTocItems = [
  {
    label: "Quick Actions",
    items: [
      { label: "Reply", href: "#reply" },
      { label: "Forward", href: "#forward" },
      { label: "Archive", href: "#archive" },
      { label: "Delete", href: "#delete" },
    ],
  },
];

export const EmailDashboard: Story = {
  parameters: {
    docs: {
      description: {
        story: "A modern email dashboard layout with AI-powered features, email preview, and smart organization. Perfect for email management applications with three-column layout: navigation sidebar, email list, and email preview panel.",
      },
    },
    layout: "fullscreen",
  },
  args: {
    header: (
      <div className="flex items-center justify-between w-full px-6">
        <div className="flex items-center gap-4">
          <Mail className="w-6 h-6 text-[var(--primary)]" />
          <span className="text-lg font-semibold text-[var(--foreground)]">Email Dashboard</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-md hover:bg-[var(--accent)] transition-colors">
            <Bell className="w-5 h-5 text-[var(--foreground)]" />
          </button>
          <button className="p-2 rounded-md hover:bg-[var(--accent)] transition-colors">
            <Sun className="w-5 h-5 text-[var(--foreground)]" />
          </button>
        </div>
      </div>
    ),
    navItems: emailNavItems,
    tocItems: emailTocItems,
    sidebar: (
      <div className="h-full p-4 space-y-6">
        {/* Profile Section */}
        <div className="flex items-center gap-3 pb-4 border-b border-[var(--border)]">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
            VM
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[var(--foreground)] truncate">Vadim.M</p>
            <p className="text-xs text-[var(--muted-foreground)] truncate">hawl.digital@gmail.com</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-[var(--muted)] border border-[var(--border)] text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-[var(--muted-foreground)]">⌘K</span>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          <a
            href="#"
            className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-[var(--accent)] transition-colors group"
          >
            <div className="flex items-center gap-3">
              <Inbox className="w-5 h-5 text-[var(--muted-foreground)]" />
              <span className="text-sm text-[var(--foreground)]">Inbox</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-500 text-white">32</span>
          </a>
          <a
            href="#"
            className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-[var(--accent)] transition-colors group"
          >
            <div className="flex items-center gap-3">
              <Star className="w-5 h-5 text-[var(--muted-foreground)]" />
              <span className="text-sm text-[var(--foreground)]">Favorite</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-500 text-white">4</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[var(--accent)] transition-colors"
          >
            <Send className="w-5 h-5 text-[var(--muted-foreground)]" />
            <span className="text-sm text-[var(--foreground)]">Sent</span>
          </a>
        </nav>

        <div className="pt-2">
          <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
            <ChevronDown className="w-4 h-4" />
            <span>Show more</span>
          </button>
        </div>

        {/* Custom Labels */}
        <div className="pt-4 border-t border-[var(--border)]">
          <div className="flex items-center gap-2 px-3 py-2">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-sm text-[var(--foreground)]">Davis</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2">
            <div className="w-2 h-2 rounded-full bg-purple-500" />
            <span className="text-sm text-[var(--foreground)]">Family</span>
          </div>
        </div>
      </div>
    ),
    rightSidebar: (
      <div className="h-full flex flex-col">
        {/* Email Preview Header */}
        <div className="p-4 border-b border-[var(--border)]">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-[var(--foreground)]">Should you follow up?</h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-yellow-500" />
              <span className="text-xs text-[var(--muted-foreground)]">Ignored</span>
            </div>
          </div>
        </div>

        {/* AI Summary */}
        <div className="p-4 border-b border-[var(--border)] bg-gradient-to-br from-purple-500/10 to-blue-500/10">
          <div className="flex items-start gap-2.5 mb-3">
            <Zap className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-[var(--foreground)] mb-1.5">Summary of Canary Mail's Email</h4>
              <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                Canary Mail promotes its read tracking feature to show whether messages were seen or ignored, helping users make follow-up decisions. The tool is highlighted for claiming the first 24 hours with Canary.
              </p>
            </div>
          </div>
        </div>

        {/* Email Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Email Header */}
            <div className="space-y-3">
              <div>
                <p className="text-xs text-[var(--muted-foreground)] mb-1.5 uppercase tracking-wide">From</p>
                <p className="text-sm font-semibold text-[var(--foreground)]">Sohel from Canary Mail</p>
                <p className="text-xs text-[var(--muted-foreground)] mt-0.5">hello@canarymail.io</p>
              </div>
              <div>
                <p className="text-xs text-[var(--muted-foreground)] mb-1.5 uppercase tracking-wide">To</p>
                <p className="text-sm text-[var(--foreground)]">me</p>
              </div>
              <div>
                <p className="text-xs text-[var(--muted-foreground)] mb-1.5 uppercase tracking-wide">Subject</p>
                <p className="text-base font-semibold text-[var(--foreground)]">Hello there!</p>
              </div>
            </div>

            {/* Email Body */}
            <div className="pt-6 border-t border-[var(--border)]">
              <div className="space-y-4 text-sm leading-relaxed">
                <p className="text-[var(--foreground)] font-medium">
                  The first 24 hours after downloading Canary
                </p>
                <p className="text-[var(--muted-foreground)]">
                  This feature <span className="text-[var(--foreground)] font-medium">will change your life</span> by revealing if emails are being ignored.
                </p>
                <p className="text-[var(--muted-foreground)]">
                  Canary Mail's <span className="text-[var(--foreground)]">read receipt icon</span> helps you understand engagement.
                </p>
                <div className="my-6 p-4 rounded-lg bg-[var(--muted)] border border-[var(--border)]">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                      <Mail className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-[var(--foreground)]">Canary Mail's read email</p>
                      <p className="text-xs text-[var(--muted-foreground)]">Read Receipt icon</p>
                    </div>
                  </div>
                </div>
                <p className="text-[var(--muted-foreground)]">
                  Talk soon.
                </p>
                <div className="pt-4 mt-4 border-t border-[var(--border)]">
                  <p className="text-sm font-semibold text-[var(--foreground)]">Sohel</p>
                  <p className="text-xs text-[var(--muted-foreground)] mt-1">Founder & CEO of Canary Mail</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Icons */}
        <div className="p-4 border-t border-[var(--border)]">
          <div className="flex flex-col items-end gap-2">
            <button className="p-2.5 rounded-lg hover:bg-[var(--accent)] transition-colors">
              <MessageSquare className="w-5 h-5 text-[var(--muted-foreground)]" />
            </button>
            <button className="p-2.5 rounded-lg hover:bg-[var(--accent)] transition-colors">
              <Upload className="w-5 h-5 text-[var(--muted-foreground)]" />
            </button>
            <button className="p-2.5 rounded-lg hover:bg-[var(--accent)] transition-colors">
              <Info className="w-5 h-5 text-[var(--muted-foreground)]" />
            </button>
          </div>
        </div>
      </div>
    ),
    children: (
      <div className="h-full flex flex-col">
        {/* Filters */}
        <div className="p-4 border-b border-[var(--border)]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">Inbox - All</h2>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button className="px-3 py-1.5 rounded-md bg-[var(--primary)] text-white text-sm font-medium">
              All
            </button>
            <button className="px-3 py-1.5 rounded-md bg-[var(--muted)] text-[var(--foreground)] text-sm hover:bg-[var(--accent)] transition-colors">
              Primary
            </button>
            <button className="px-3 py-1.5 rounded-md bg-[var(--muted)] text-[var(--foreground)] text-sm hover:bg-[var(--accent)] transition-colors">
              Promotions
            </button>
            <button className="px-3 py-1.5 rounded-md bg-[var(--muted)] text-[var(--foreground)] text-sm hover:bg-[var(--accent)] transition-colors">
              Socials
            </button>
            <button className="p-1.5 rounded-md bg-[var(--muted)] text-[var(--foreground)] hover:bg-[var(--accent)] transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* AI Feature */}
        <div className="p-4 border-b border-[var(--border)] bg-gradient-to-r from-purple-500/5 to-blue-500/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-[var(--foreground)]">Smart responses</p>
                <p className="text-xs text-[var(--muted-foreground)]">Simplify your process with AI</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[var(--primary)]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary)]"></div>
            </label>
          </div>
        </div>

        {/* Pinned Section */}
        <div className="p-4 border-b border-[var(--border)]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Pin className="w-4 h-4 text-[var(--muted-foreground)]" />
              <span className="text-sm font-medium text-[var(--foreground)]">Pinned</span>
            </div>
            <button className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
              Hide
            </button>
          </div>
        </div>

        {/* Email List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            <div className="text-xs font-medium text-[var(--muted-foreground)] px-3 py-2 uppercase tracking-wide">Today</div>
            {[
              { 
                name: "Eliot Rivers", 
                subject: "Find your design muse and let yo...", 
                snippet: "In the middle of difficulty lies opport@", 
                time: "Dec 9", 
                unread: 3, 
                pinned: true,
                avatar: "ER"
              },
              { 
                name: "Sohel", 
                subject: "Hello there!", 
                snippet: "The first 24 hours after downloading...", 
                time: "Today", 
                unread: 1,
                avatar: "S"
              },
              { 
                name: "Jasper Quinn", 
                subject: "Weekly design inspiration", 
                snippet: "Check out these amazing designs...", 
                time: "Today", 
                unread: 2,
                avatar: "JQ"
              },
              { 
                name: "Liam Hawthorne", 
                subject: "Project update", 
                snippet: "Here's the latest on the project...", 
                time: "Dec 9",
                avatar: "LH"
              },
              { 
                name: "Finnian Blake", 
                subject: "Meeting reminder", 
                snippet: "Don't forget about our meeting...", 
                time: "Dec 9",
                avatar: "FB"
              },
            ].map((email, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 p-3 rounded-lg hover:bg-[var(--accent)] transition-colors cursor-pointer group ${index === 1 ? 'bg-[var(--accent)]' : ''}`}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                  {email.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-[var(--foreground)] truncate">{email.name}</p>
                    {email.unread && (
                      <span className="px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-500 text-white min-w-[18px] text-center">
                        {email.unread}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[var(--foreground)] font-medium mb-1 truncate">{email.subject}</p>
                  <p className="text-xs text-[var(--muted-foreground)] truncate">{email.snippet}</p>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span className="text-xs text-[var(--muted-foreground)] whitespace-nowrap">{email.time}</span>
                  <div className="flex items-center gap-1">
                    {email.pinned && <Pin className="w-3 h-3 text-[var(--muted-foreground)]" />}
                    <Star className="w-3 h-3 text-[var(--muted-foreground)] opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Paperclip className="w-3 h-3 text-[var(--muted-foreground)]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    footer: null,
    stickyHeader: true,
    sidebarWidth: 240,
    rightSidebarWidth: 480,
  },
  decorators: [
    (Story) => (
      <div className="bg-gray-900 min-h-screen" style={{ '--background': '#111827', '--foreground': '#f9fafb', '--muted': '#1f2937', '--muted-foreground': '#9ca3af', '--border': '#374151', '--accent': '#374151', '--card': '#1f2937', '--primary': '#8b5cf6' } as React.CSSProperties}>
        <Story />
      </div>
    ),
  ],
};


