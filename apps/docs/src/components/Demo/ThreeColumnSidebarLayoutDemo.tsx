import React, { useState } from 'react';
import VariantSelector from './VariantSelector';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import { Navbar } from '@site/src/components/UI/navbar';
import { ThreeColumnSidebarLayout } from '../UI/threeColumnSidebar-layout';
import {
  TypeIcon,
  SortDesc,
  Calendar1, 
  Link,
  BarChart3,
  Activity,
  Layers,
  History,
  Bookmark,
  FileText,
  Clock,
  Tag,
  Users,
  Settings,
  Database,
  ExternalLink,
  HelpCircle,
  Bell,
  MessageSquare,
  BarChartBig,
  LayoutGrid
} from 'lucide-react'
import Sidebar from '../UI/threeColumnSidebar';

const themeVariant = ['light', 'dark', 'corporate', 'custom', 'glass', 'modern', 'ocean', 'forest', 'solarized'];
const mobileBreakpoints = ['sm', 'md', 'lg'];
const sidebarLayoutMode = ['OVERLAY_ONLY', 'BOTTOM_DOCKED', 'OVERLAY_WITH_PANE'];

const ThreeColumnSidebarLayoutDemo = () => {
  const [theme, setTheme] = useState('modern');
  const [mobileBreakpoint, setMobileBreakpoint] = useState('md');
  const [layoutMode, setLayoutMode] = useState('BOTTOM_DOCKED');

  // Sample navigation items for sidebar
  const leftNavItems = [
    { label: 'Type', href: '#', icon:  TypeIcon },
    { label: 'Date', href: '#', icon: Calendar1},
    { label: 'Sort', href: '#', icon: SortDesc },
  ];

  const rightNavItems = [
    // Core Stats
    { label: 'Stats', href: '#', icon: BarChart3 },
    { label: 'Analytics', href: '#', icon: BarChartBig },
    { label: 'Activity', href: '#', icon: Activity },
    { label: 'Timeline', href: '#', icon: History },

    // Supplementary Info
    { label: 'Related', href: '#', icon: Link },
    { label: 'Details', href: '#', icon: FileText },
    { label: 'Metadata', href: '#', icon: Tag },
    { label: 'Sources', href: '#', icon: ExternalLink },

    // Context / People / Sharing
    { label: 'Contributors', href: '#', icon: Users },
    { label: 'Comments', href: '#', icon: MessageSquare },
    { label: 'Bookmarks', href: '#', icon: Bookmark },
    { label: 'Notifications', href: '#', icon: Bell },

    // System / Structure
    { label: 'Structure', href: '#', icon: Layers },
    { label: 'Database', href: '#', icon: Database },
    { label: 'Overview', href: '#', icon: LayoutGrid },

    // Utility
    { label: 'History Log', href: '#', icon: Clock },
    { label: 'Settings', href: '#', icon: Settings },
    { label: 'Help', href: '#', icon: HelpCircle },
  ]

  const year = new Date().getFullYear()

  const codeString = `
   <ThreeColumnSidebarLayout
      theme="${theme}"
      mobileBreakpoint="${mobileBreakpoint}"
      sidebarLayoutMode="${layoutMode}"
      header={
        <Navbar size="md">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <img
                src="/ignix-ui/img/logo.png" // use your logo path
                alt="Brand Logo"
                className="w-6 h-6"
              />
              <h1 className="text-lg font-bold tracking-tight">Ignix</h1>
              <nav className="flex space-x-4">
                <a href="#" className="hover:text-primary">
                  Home
                </a>
                <a href="#" className="hover:text-primary">
                  About
                </a>
                <a href="#" className="hover:text-primary">
                  Contact
                </a>
              </nav>
            </div>
          </div>
        </Navbar>
      }
      sidebar={(props) => (
        <Sidebar links={leftNavItems} brandName="Filter" {...props} />
      )}
      rightSidebar={(props) => (
        <Sidebar links={rightNavItems} brandName="Right Pane" {...props} />
      )}
      footer={
        <footer className="py-5 text-center">
          © ${year} My Application. All rights reserved.
        </footer>
      }
    >
      {mainContent}
    </ThreeColumnSidebarLayout>`;

  const structure = [
  {
    title: 'Left Column',
    description:
      'This area is designed for navigation — menus, categories, profile shortcuts, or filters.',
  },
  {
    title: 'Main Column',
    description:
      'The main workspace for your app. This contains feeds, forms, posts, dashboards, and important data.',
  },
  {
    title: 'Right Column',
    description:
      'Perfect for enhancements such as trends, widgets, analytics, suggestions, and notifications.',
  }];

  const useCases = [
    'Social media platforms (Twitter / LinkedIn)',
    'Admin & analytics dashboards',
    'News and blog platforms',
    'Project management tools',
    'Data-intensive applications',
    'CRM & content management systems',
  ];

  const responsive = [
    { title: 'Desktop', desc: 'All 3 columns visible' },
    { title: 'Tablet', desc: 'Sidebars collapse' },
    { title: 'Mobile', desc: 'Only main content + drawer or bottom nav' },
  ];

  const benefits = [
    'Highly organized layout',
    'Great user experience',
    'Scales for complex features',
    'Easy to maintain',
  ];

  function Section({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) {
    return (
      <section className='rounded-2xl p-8 shadow-sm space-y-6 border'>
        <h2 className='text-xl font-semibold'>{title}</h2>
        {children}
      </section>
    );
  }

  const mainContent = (
    <>
    {/* Main content wrapper (scrollable area) */}    
     <div className='space-y-8 p-4'>

      {/* INTRO */}
      <section className='rounded-2xl p-8 shadow-sm space-y-4 border'>
        <h1 className='text-3xl font-bold tracking-tight'>
          Three Column Layout
        </h1>
        <p className='opacity-80 leading-relaxed max-w-3xl'>
          A three-column layout is one of the most powerful and flexible UI
          patterns in modern web applications. It separates navigation,
          content, and supporting information to create clarity and balance.
        </p>
      </section>

      {/* STRUCTURE */}
      <Section title='1. Structure Overview'>
        <div className='grid md:grid-cols-3 gap-6'>
          {structure.map((item) => (
            <div
              key={item.title}
              className='p-5 rounded-xl border space-y-2'
            >
              <h3 className='font-semibold'>{item.title}</h3>
              <p className='opacity-80 text-sm leading-relaxed'>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* USE CASES */}
      <Section title='2. Best Use Cases'>
        <div className='grid md:grid-cols-2 gap-4'>
          {useCases.map((item) => (
            <div
              key={item}
              className='flex items-center gap-3 p-4 rounded-xl border text-sm'
            >
              <span className='w-2 h-2 rounded-full bg-current' />
              {item}
            </div>
          ))}
        </div>
      </Section>

      {/* RESPONSIVE */}
      <Section title='3. Responsive Behavior'>
        <p className='opacity-80 max-w-3xl leading-relaxed'>
          On large screens, all three columns appear clearly. As the device
          gets smaller, the layout smoothly adapts to focus on the main
          content.
        </p>

        <div className='grid md:grid-cols-3 gap-6 pt-4'>
          {responsive.map((item) => (
            <div
              key={item.title}
              className='p-5 rounded-xl border text-sm space-y-1'
            >
              <strong>{item.title}</strong>
              <p className='opacity-80'>{item.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* VISUAL PREVIEW */}
      <Section title='4. Visual Preview'>
        <div className='grid grid-cols-3 gap-4 text-center text-sm font-medium'>
          {['Left Sidebar', 'Main Content', 'Right Sidebar'].map(
            (item, i) => (
              <div
                key={item}
                className={`p-6 rounded-xl border ${
                  i === 1 ? 'scale-105' : ''
                }`}
              >
                {item}
                <p className='opacity-70 text-xs mt-1'>
                  {i === 1 ? '(Primary Area)' : i === 0 ? '(Navigation)' : '(Extras)'}
                </p>
              </div>
            )
          )}
        </div>
      </Section>

      {/* BENEFITS */}
      <Section title='5. Why Developers Love This Pattern'>
        <ul className='grid md:grid-cols-2 gap-4 text-sm list-none'>
          {benefits.map((item) => (
            <li
              key={item}
              className='flex items-center gap-3 p-4 rounded-xl border'
            >
              ✅ {item}
            </li>
          ))}
        </ul>
      </Section>

      {/* DEV TIP */}
      <section className='rounded-2xl p-8 shadow-sm space-y-4 border'>
        <h2 className='text-xl font-semibold'>6. Pro Developer Tip</h2>
        <p className='opacity-80 max-w-3xl leading-relaxed'>
          Keep only the <strong>main column scrollable</strong> while the
          header, footer, and sidebars remain fixed. This improves both
          performance and user experience — especially on mobile.
        </p>
      </section>
    </div>
    </>  
  );

  return (
    <div className='space-y-6 mb-8'>
      <div className='flex flex-wrap gap-4 justify-start sm:justify-end'>
        <VariantSelector
          variants={themeVariant}
          selectedVariant={theme}
          onSelectVariant={setTheme}
          type='Select Theme'
        />
        <VariantSelector
          variants={mobileBreakpoints}
          selectedVariant={mobileBreakpoint}
          onSelectVariant={setMobileBreakpoint}
          type='Mobile Breakpoint'
        />
        {mobileBreakpoint === 'sm' && <VariantSelector
          variants={sidebarLayoutMode}
          selectedVariant={layoutMode}
          onSelectVariant={setLayoutMode}
          type='Mobile Sidebar Configuration'
        />}
      </div>
      <Tabs>
        <TabItem value='preview' label='Preview'>
          <div className='border rounded-lg overflow-hidden'>
            <ThreeColumnSidebarLayout
              header={
                <Navbar size='md'>
                <div className='flex items-center justify-between w-full'>
                  <div className='flex items-center gap-2'>
                    <img
                      src='/ignix-ui/img/logo.png' // use your logo path
                      alt='Brand Logo'
                      className='w-6 h-6'
                    />
                    <h1 className='text-lg font-bold tracking-tight'>Ignix</h1>
                    <nav className='flex space-x-4'>
                    <a href='#' className='hover:text-primary'>Home</a>
                    <a href='#' className='hover:text-primary'>About</a>
                    <a href='#' className='hover:text-primary'>Contact</a>
                    </nav>
                  </div>
                </div>
                </Navbar>
              }
              sidebar={
                <Sidebar
                  links={leftNavItems}
                  brandName='Filter'
                  position={mobileBreakpoint === 'sm' && layoutMode === 'BOTTOM_DOCKED' ? 'bottomLeft' : 'left'}
                  direction={mobileBreakpoint === 'sm' && layoutMode === 'BOTTOM_DOCKED' ? 'horizontal' : 'vertical'}
                />
              }
              rightSidebar={
                <Sidebar
                  links={rightNavItems}
                  brandName='Right Panel'
                  position={mobileBreakpoint === 'sm' && layoutMode !== 'BOTTOM_DOCKED' ? 'bottomLeft' :'right'}
                  direction={mobileBreakpoint === 'sm' && layoutMode !== 'BOTTOM_DOCKED' ? 'horizontal' : 'vertical'}
                />
              }
              footer={
                <footer className='py-5 text-center'>
                  © {year} My Application. All rights reserved.
                </footer>
              }
              theme={theme as any}
              mobileBreakpoint={mobileBreakpoint as any}
              sidebarLayoutMode={layoutMode as any}
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

