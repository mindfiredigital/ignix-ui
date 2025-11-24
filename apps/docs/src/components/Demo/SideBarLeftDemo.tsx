import React, { useState } from 'react';
import VariantSelector from './VariantSelector';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import { Navbar } from '@site/src/components/UI/navbar';
import { Sidebar } from '@site/src/components/UI/sidebar';
import { Card } from '../UI/card';
import { Home, Settings, BookOpen, Palette, Layout } from 'lucide-react';
import { SideBarLeftLayout } from '../UI/sidebarleft-layout';
import { cn } from '@site/src/utils/cn';

const layoutVariants = ['default', 'dark', 'light', 'glass', 'gradient'];
const sidebarWidth = ['default', 'compact','wide','expanded'];
const mobileBreakpoints = ['sm', 'md', 'lg'];

const SideBarLeftDemo = () => {
  const [variant, setVariant] = useState('default');
  const [width, setWidth] = useState('default');
  const [mobileBreakpoint, setMobileBreakpoint] = useState('md');

 // Sample navigation items for sidebar
  const navItems = [
    { label: "Dashboard", href: "#", icon:  Home },
    { label: "Pages", href: "#", icon: BookOpen},
    { label: "Component", href: "#", icon: Layout },
    { label: "Themes", href: "#", icon:Palette },
    { label: "Settings", href: "#", icon: Settings},
  ];
  const breakpointValues = {
    sm: 640,
    md: 768,
    lg: 1024,
  };

  const widthValues: Record<string, string> = {
    compact: "250px",
    default: "270px",
    wide: "320px",
    expanded: "380px",
  };

  const codeString = `
<SideBarLeftLayout
  variant="${variant}"
  sidebarPosition="${width}"
  mobileBreakpoint="${mobileBreakpoint}"
header={
  <Navbar variant={variant as any} size="md">
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-2">
        <img
          src="/ignix-ui/img/logo.png" // use your logo path
          alt="Brand Logo"
          className="w-6 h-6"
        />
        <h1 className="text-lg font-bold tracking-tight">Ignix</h1>
        <nav className="flex space-x-4">
        <a href="#" className="hover:text-primary">Home</a>
        <a href="#" className="hover:text-primary">About</a>
        <a href="#" className="hover:text-primary">Contact</a>
        </nav>
      </div>
    </div>
  </Navbar>
}
sidebar={
    <Sidebar
      links={navItems}
      brandName="SIDEBAR"
      position="left"
      variant="${variant}"
      style={{
        height: "calc(100dvh - var(--header-h) - var(--footer-h))",
        width: "${widthValues[width]}",
      }}
    />
}
footer={
<footer className="py-4 text-center text-muted-foreground">
© 2025 My Application. All rights reserved.
</footer>
}
variant={variant as any}
sidebarPosition={sidebarPosition as any}
mobileBreakpoint={mobileBreakpoint as any}
>
{mainContent}
</SideBarLeftLayout>`;
const [hasOpenButton, setHasOpenButton] = React.useState(false);

React.useEffect(() => {
  // small delay ensures the DOM is ready
  const check = () => {
    const btn = document.querySelector('span[title="Open"]');
    setHasOpenButton(!!btn);
  };

  check();

  // Optional: re-check if DOM might update
  const observer = new MutationObserver(check);
  observer.observe(document.body, { childList: true, subtree: true });

  return () => observer.disconnect();
}, []);

  const mainContent = (
    <>
    {/* Main content wrapper (scrollable area) */}
    {/* <div className={`flex flex-col gap-1 p-10  ${mobileBreakpoint === 'sm' ? 'overflow-hidden' : 'overflow-y-auto'} max-h-[calc(100dvh-var(--header-h)-var(--footer-h))]`}> */}
      
<div
  className={cn(
    "flex flex-col gap-1 p-10 max-h-[calc(100dvh-var(--header-h)-var(--footer-h))]",
    mobileBreakpoint === "sm" && hasOpenButton
      ? "overflow-y-auto"
      : mobileBreakpoint === "sm"
      ? "overflow-hidden"
      : "overflow-y-auto"
  )}
>
      {/* Overview */}
      <section className="space-y-4 ">
        <h2 className="text-3xl font-bold tracking-tight">Welcome to Sidebar Layout</h2>
        <p className="text-muted-foreground text-base leading-relaxed">
          The <strong>SidebarLeft Layout</strong> provides a flexible and responsive page structure 
          for modern web applications. It supports animations, theming, mobile responsiveness, and 
          accessibility — perfect for dashboards, admin panels, and productivity tools.
        </p>
      </section>

      {/* Key Features Grid */}
      <section>
        <h3 className="text-xl font-semibold mb-3">Key Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <Card className="p-6">
            <h4 className="font-semibold">⚡ Framer Motion Animations</h4>
            <p className="text-sm text-muted-foreground">
              Smooth sidebar transitions with <code>framer-motion</code> for a delightful user experience.
            </p>
          </Card>
          <Card className="p-6">
            <h4 className="font-semibold">📱 Fully Responsive</h4>
            <p className="text-sm text-muted-foreground">
              Adapts seamlessly to all screen sizes — from mobile devices to ultra-wide monitors.
            </p>
          </Card>
          <Card className="p-6">
            <h4 className="font-semibold">🎨 Theme Variants</h4>
            <p className="text-sm text-muted-foreground">
              Choose between <em>light</em>, <em>dark</em>, <em>glass</em>, or <em>gradient</em> styles effortlessly.
            </p>
          </Card>
          <Card className="p-6">
            <h4 className="font-semibold">🧱 Modular Structure</h4>
            <p className="text-sm text-muted-foreground">
              Clean separation between header, sidebar, content, and footer components for easy customization.
            </p>
          </Card>
          <Card className="p-6">
            <h4 className="font-semibold">🪶 Accessibility Ready</h4>
            <p className="text-sm text-muted-foreground">
              ARIA-compliant and keyboard navigable by default — accessible to all users.
            </p>
          </Card>
          <Card className="p-6">
            <h4 className="font-semibold">🚀 Developer-Friendly</h4>
            <p className="text-sm text-muted-foreground">
              Built with <strong>TypeScript</strong> and Storybook integration for rapid prototyping and testing.
            </p>
          </Card>
        </div>
      </section>

      {/* Use Cases */}
      <section>
        <h3 className="text-xl font-semibold mb-3">Common Use Cases</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-6">
            <h4 className="font-semibold">🧭 Admin Dashboards</h4>
            <p className="text-sm text-muted-foreground">
              Manage analytics, user data, and reports in an organized interface.
            </p>
          </Card>
          <Card className="p-6">
            <h4 className="font-semibold">📋 Project Management Tools</h4>
            <p className="text-sm text-muted-foreground">
              Perfect for apps like task managers, CRMs, and Kanban-style boards.
            </p>
          </Card>
          <Card className="p-6">
            <h4 className="font-semibold">💡 Design Systems</h4>
            <p className="text-sm text-muted-foreground">
              Showcase and document UI components in a structured environment.
            </p>
          </Card>
          <Card className="p-6">
            <h4 className="font-semibold">🧩 SaaS Applications</h4>
            <p className="text-sm text-muted-foreground">
              Use this layout for scalable, feature-rich applications with dynamic side navigation.
            </p>
          </Card>
        </div>
      </section>

      {/* Performance Section */}
      <section>
        <h3 className="text-xl font-semibold mb-3">Performance Insights</h3>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">
            The layout uses efficient re-render control and lightweight animation libraries, ensuring smooth 
            scrolling and minimal performance overhead, even with heavy UI content.
          </p>
        </Card>
      </section>

      {/* Accessibility Section */}
      <section>
        <h3 className="text-xl font-semibold mb-3">Accessibility Standards</h3>
        <Card className="p-6">
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            <li>Keyboard navigation (Tab / Shift+Tab) supported for sidebar and header controls.</li>
            <li>ARIA roles and labels provided for improved screen-reader compatibility.</li>
            <li>Color contrast ratios optimized for readability in all theme variants.</li>
          </ul>
        </Card>
      </section>

      {/* Footer Note */}
      <footer className="pt-4 text-sm text-center text-muted-foreground border-t border-border">
        <p>
          Built with ❤️ using <strong>React</strong>, <strong>TypeScript</strong>, and <strong>Tailwind CSS</strong>.  
          Contributions welcome on GitHub!
        </p>
      </footer>
    </div>
    </>
  );

  return (
    <div className="space-y-6 mb-8">
      <div className="flex flex-wrap gap-4 justify-start sm:justify-end">
        <VariantSelector
          variants={layoutVariants}
          selectedVariant={variant}
          onSelectVariant={setVariant}
          type="Variant"
        />
        <VariantSelector
          variants={sidebarWidth}
          selectedVariant={width}
          onSelectVariant={setWidth}
          type="SideBar Width"
        />
        <VariantSelector
          variants={mobileBreakpoints}
          selectedVariant={mobileBreakpoint}
          onSelectVariant={setMobileBreakpoint}
          type="Mobile Breakpoint"
        />
      </div>
      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="border rounded-lg overflow-hidden">
            <SideBarLeftLayout
              header={
                <Navbar variant={variant as any} size="md" className='pl-16 md:pl-0'>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <img
                      src="/ignix-ui/img/logo.png" // use your logo path
                      alt="Brand Logo"
                      className="w-6 h-6"
                    />
                    <h1 className="text-lg font-bold tracking-tight">Ignix</h1>
                    <nav className="flex space-x-4">
                    <a href="#" className="hover:text-primary">Home</a>
                    <a href="#" className="hover:text-primary">About</a>
                    <a href="#" className="hover:text-primary">Contact</a>
                    </nav>
                  </div>
                </div>
              </Navbar>
              }
              sidebar={
                <Sidebar
                  links={navItems}
                  brandName="Sidebar"
                  position="left"
                  variant={variant as any}
                  style={{
                    top:"2px",
                    height: breakpointValues[mobileBreakpoint] >= 768 ? `calc(100dvh - var(--header-h) - var(--footer-h))` : `full`,
                    width: widthValues[width]
                  }}
                />
              }
              footer={
                <footer className="py-4 text-center text-muted-foreground">
                  © 2025 My Application. All rights reserved.
                </footer>
              }
              sidebarWidth={width as any}
              variant={variant as any}
              mobileBreakpoint={mobileBreakpoint as any}
            >
            {/* {mainContent} */}
              <div className="relative">
               
                {mobileBreakpoint==='sm' && (
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 z-0 bg-black/50 sidebar-sm-ignis"
                  />
                )}

                <div className="relative z-10">{mainContent}</div>
              </div>
            
            </SideBarLeftLayout>
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
}

export default SideBarLeftDemo;

