import React, { useState } from 'react';
import VariantSelector from './VariantSelector';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import { DocumentationLayout } from '@site/src/components/UI/documentation-layout';
import { Github, Sparkles } from 'lucide-react';
import { Navbar } from '@site/src/components/UI/navbar';

const sidebarWidths = ['220', '260', '280', '320'];
const tocWidths = ['180', '220', '240', '280'];

const navSections = [
  {
    label: 'Getting Started',
    items: [
      { label: 'Introduction', href: '#', active: true },
      { label: 'Installation', href: '#' },
      { label: 'Quick Start', href: '#' },
    ],
  },
  {
    label: 'Guides',
    items: [
      {
        label: 'Theming',
        items: [
          { label: 'Core Concepts', href: '#' },
          { label: 'Dark Mode', href: '#' },
        ],
      },
      {
        label: 'Components',
        items: [
          { label: 'Button', href: '#' },
          { label: 'Textarea', href: '#' },
        ],
      },
    ],
  },
];

const tocHeadings = [
  { id: 'demo-overview', label: 'Overview' },
  { id: 'demo-installation', label: 'Installation' },
  { id: 'demo-usage', label: 'Usage' },
  { id: 'demo-props', label: 'Props' },
];

const mainContent = (
  <article className="prose prose-sm max-w-none">
    <h2 id="demo-overview" className="text-2xl font-bold mb-4 text-[var(--foreground)]">
      Overview
    </h2>
    <p className="text-[var(--muted-foreground)] mb-6 leading-relaxed">
      DocumentationLayout provides a sticky header, a collapsible-tree navigation sidebar
      (a drawer on mobile), and a scroll-spy "On this page" panel - the shape most
      documentation and reference sites need out of the box.
    </p>
    <h2 id="demo-installation" className="text-2xl font-bold mt-8 mb-4 text-[var(--foreground)]">
      Installation
    </h2>
    <p className="text-[var(--muted-foreground)] mb-6 leading-relaxed">
      Add the template to your project, then wrap your page content with it.
    </p>
    <h2 id="demo-usage" className="text-2xl font-bold mt-8 mb-4 text-[var(--foreground)]">
      Usage
    </h2>
    <p className="text-[var(--muted-foreground)] mb-6 leading-relaxed">
      Pass <code>navSections</code> for the left sidebar and <code>tocHeadings</code> for the
      right panel - the active heading highlights automatically as you scroll.
    </p>
    <h2 id="demo-props" className="text-2xl font-bold mt-8 mb-4 text-[var(--foreground)]">
      Props
    </h2>
    <p className="text-[var(--muted-foreground)] mb-6 leading-relaxed">
      See the Props table below this demo for the full API, including breadcrumbs, page
      title, and previous/next page links.
    </p>
  </article>
);

const DocumentationLayoutDemo = () => {
  const [sidebarWidth, setSidebarWidth] = useState<number>(280);
  const [tocWidth, setTocWidth] = useState<number>(240);

  const codeString = `
import { DocumentationLayout } from '@ignix-ui/documentationlayout';

<DocumentationLayout
  header={<span className="font-bold">Ignix UI</span>}
  searchSlot={<SearchBox placeholder="Search docs..." />}
  actions={<ThemeToggle />}
  navSections={[
    {
      label: 'Getting Started',
      items: [
        { label: 'Introduction', href: '/intro', active: true },
        { label: 'Installation', href: '/install' },
      ],
    },
    {
      label: 'Guides',
      items: [
        {
          label: 'Theming',
          items: [
            { label: 'Core Concepts', href: '/theming/core' },
            { label: 'Dark Mode', href: '/theming/dark-mode' },
          ],
        },
      ],
    },
  ]}
  tocHeadings={[
    { id: 'overview', label: 'Overview' },
    { id: 'installation', label: 'Installation' },
  ]}
  breadcrumbs={[
    { label: 'Docs', href: '/docs' },
    { label: 'Getting Started', href: '/docs/getting-started' },
  ]}
  title="Introduction"
  previousPage={{ label: 'Home', href: '/' }}
  nextPage={{ label: 'Installation', href: '/install' }}
  editPageUrl="https://github.com/org/repo/edit/main/intro.mdx"
  sidebarWidth={${sidebarWidth}}
  tocWidth={${tocWidth}}
>
  <article>{/* page content, with matching heading ids for the TOC */}</article>
</DocumentationLayout>
`;

  return (
    <div>
      <div className="flex flex-wrap gap-4 justify-start sm:justify-end">
        <VariantSelector
          variants={sidebarWidths}
          selectedVariant={sidebarWidth.toString()}
          onSelectVariant={(val) => setSidebarWidth(Number(val))}
          type="Sidebar Width"
        />
        <VariantSelector
          variants={tocWidths}
          selectedVariant={tocWidth.toString()}
          onSelectVariant={(val) => setTocWidth(Number(val))}
          type="TOC Width"
        />
      </div>
      <Tabs>
        <TabItem value="preview" label="Preview" default>
          <div className="border border-gray-300 rounded-lg overflow-hidden mt-4" style={{ height: 560 }}>
            <div className="h-full overflow-y-auto">
              <DocumentationLayout
                header={
                  <Navbar variant="primary" size="md" className="rounded-none px-4 w-full">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      <span className="text-sm font-semibold tracking-tight">Ignix UI</span>
                    </div>
                  </Navbar>
                }
                actions={
                  <a href="#" aria-label="GitHub" className="rounded-md p-2 hover:bg-[var(--accent)]">
                    <Github className="h-4 w-4" />
                  </a>
                }
                navSections={navSections}
                tocHeadings={tocHeadings}
                breadcrumbs={[
                  { label: 'Docs', href: '#' },
                  { label: 'Getting Started', href: '#' },
                ]}
                title="Introduction"
                previousPage={{ label: 'Home', href: '#' }}
                nextPage={{ label: 'Installation', href: '#' }}
                editPageUrl="#"
                sidebarWidth={sidebarWidth}
                tocWidth={tocWidth}
              >
                {mainContent}
              </DocumentationLayout>
            </div>
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

export default DocumentationLayoutDemo;
