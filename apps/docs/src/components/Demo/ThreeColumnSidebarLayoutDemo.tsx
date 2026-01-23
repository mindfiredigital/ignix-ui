import React, { useState } from 'react';
import VariantSelector from './VariantSelector';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import { ThreeColumnSidebarLayout } from '@site/src/components/UI/threeColumnSidebar-layout';
import {
  Home,
  ChevronRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { Navbar } from '@site/src/components/UI/navbar';

const sidebarWidths = ['200', '240', '280', '300', '320'];
const rightSidebarWidths = ['180', '200', '220', '240', '280'];

const ThreeColumnSidebarLayoutDemo = () => {
  const [sidebarWidth, setSidebarWidth] = useState<number>(240);
  const [rightSidebarWidth, setRightSidebarWidth] = useState<number>(180);

  // Sample navigation items for left sidebar
  const navItems = [
    {
      label: 'Introduction',
      items: [
        { label: 'Installation', href: '#' },
        { label: 'Quick Start', href: '#' },
      ],
    },
    {
      label: 'Components',
      items: [
        { label: 'Button', href: '#' },
        { label: 'Card', href: '#' },
        { label: 'Input', href: '#' },
      ],
    },
    {
      label: 'Layouts',
      items: [
        { label: 'Three Column', href: '#', active: false },
        { label: 'Single Column', href: '#' },
      ],
    },
  ];

  // Sample TOC items for right sidebar
  const tocItems = [
    {
      items: [
        { label: 'Overview', href: '#overview' },
        { label: 'Installation', href: '#installation' },
        { label: 'Usage', href: '#usage' },
        { label: 'Props', href: '#props' },
      ],
    },
  ];

  const year = new Date().getFullYear();

  const codeString = `<ThreeColumnSidebarLayout
  header={
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 flex items-center justify-center">
            <div className="w-6 h-6 bg-gradient-to-br from-red-500 to-orange-500 rounded-sm rotate-45" />
          </div>
          <div>
            <span className="text-lg font-bold">Ignix UI</span>
            <span className="text-sm text-muted-foreground ml-2">Documentation</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="p-2 rounded-md hover:bg-accent transition-colors">
          <Github className="w-5 h-5" />
        </button>
        <button className="p-2 rounded-md hover:bg-accent transition-colors">
          <Sun className="w-5 h-5" />
        </button>
      </div>
    </div>
  }
  navItems={[
    {
      label: 'Getting Started',
      items: [
        { label: 'Introduction', href: '#', active: true },
        { label: 'Installation', href: '#' },
        { label: 'Quick Start', href: '#' },
      ],
    },
    {
      label: 'Components',
      items: [
        { label: 'Button', href: '#' },
        { label: 'Card', href: '#' },
        { label: 'Input', href: '#' },
      ],
    },
  ]}
  tocItems={[
    {
      label: 'On this page',
      items: [
        { label: 'Overview', href: '#overview' },
        { label: 'Installation', href: '#installation' },
        { label: 'Usage', href: '#usage' },
      ],
    },
  ]}
  footer={
    <div className="text-center text-xs text-muted-foreground">
      © ${year} Ignix UI. Built with Docusaurus-inspired layout.
    </div>
  }
  sidebarWidth={${sidebarWidth}}
  rightSidebarWidth={${rightSidebarWidth}}
  stickyHeader={true}
>
  <article className="prose prose-sm max-w-none">
    {/* Breadcrumbs */}
    <nav className="flex items-center gap-2 mb-4 text-sm">
      <Home className="w-4 h-4" />
      <span>Getting Started</span>
      <ChevronRight className="w-4 h-4" />
      <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
        Introduction
      </span>
    </nav>

    {/* Version Badge */}
    <div className="mb-6">
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-muted">
        <CheckCircle2 className="w-3 h-3" />
        Version: 1.0.3
      </span>
    </div>

    {/* Main Content */}
    <h1 className="text-4xl font-bold mb-4">Welcome to Ignix UI</h1>
    {/* ... rest of content ... */}
  </article>
</ThreeColumnSidebarLayout>`;

  const mainContent = (
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
  );

  return (
    <div>
      <div className='flex flex-wrap gap-4 justify-start sm:justify-end'>
        <VariantSelector
          variants={sidebarWidths}
          selectedVariant={sidebarWidth.toString()}
          onSelectVariant={(val) => setSidebarWidth(Number(val))}
          type='Sidebar Width'
        />
        <VariantSelector
          variants={rightSidebarWidths}
          selectedVariant={rightSidebarWidth.toString()}
          onSelectVariant={(val) => setRightSidebarWidth(Number(val))}
          type='Right Sidebar Width'
        />
      </div>
      <Tabs>
        <TabItem value='preview' label='Preview'>
          <div className='border border-gray-300 rounded-lg overflow-hidden p-3'>
            <ThreeColumnSidebarLayout
              header={
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
                </div>
              }
              navItems={navItems}
              tocItems={tocItems}
              footer={
                <div className="text-center text-xs text-muted-foreground">
                  © {year} Ignix UI. Built with Docusaurus-inspired layout.
                </div>
              }
              sidebarWidth={sidebarWidth}
              rightSidebarWidth={rightSidebarWidth}
              stickyHeader={true}
            >
              {mainContent}
            </ThreeColumnSidebarLayout>
          </div>
        </TabItem>
        <TabItem value='code' label='Code'>
          <CodeBlock language='tsx' className='whitespace-pre-wrap max-h-[500px] overflow-y-scroll'>
            {codeString}
          </CodeBlock>
        </TabItem>
      </Tabs>
    </div>
  );
}

export default ThreeColumnSidebarLayoutDemo;
