import React, { useState } from "react";
import VariantSelector from "./VariantSelector";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import CodeBlock from "@theme/CodeBlock";
import { Navbar } from "@site/src/components/UI/navbar";
import { Card } from "@site/src/components/UI/card";
import { Home, Settings, BookOpen, Palette, Layout, Sparkles } from "lucide-react";
import { SideBarLeftLayout } from "@site/src/components/UI/sidebarleft-layout";
import { cn } from "@site/src/utils/cn";
import { Sidebar } from "@site/src/components/UI/sidebar";

interface Props {
  layout: "left" | "right"
}

type LayoutBreakpoints = typeof mobileBreakpoints[number];
type LayoutVariants = typeof variants[number];
type LayoutWidth = typeof sidebarWidth[number];

const variants = ["default", "dark", "light", "glass"] as const;
const sidebarWidth = ["default", "compact","wide","expanded"] as const;
const mobileBreakpoints = ["sm", "md", "lg"] as const;

const TemplateSideBarLayoutDemo = (props: Props) => {
  const [variant, setVariant] = useState<LayoutVariants>("default");
  const [width, setWidth] = useState<LayoutWidth>("default");
  const [mobileBreakpoint, setMobileBreakpoint] = useState<LayoutBreakpoints>("md");

 // Sample navigation items for sidebar
  const navItems = [
    { label: "Dashboard", href: "#", icon:  Home },
    { label: "Pages", href: "#", icon: BookOpen},
    { label: "Component", href: "#", icon: Layout },
    { label: "Themes", href: "#", icon:Palette },
    { label: "Settings", href: "#", icon: Settings},
  ];

  const OptimisedTemplate = props.layout.charAt(0).toUpperCase() + props.layout.slice(1) 
  
  const codeString = `
<Sidebar${OptimisedTemplate}Layout
  variant="${variant}"
  sidebarWidth="${width}"
  mobileBreakpoint="${mobileBreakpoint}"
  sidebarPosition="${props?.layout}"
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
  sidebar={
    <Sidebar
      links={navItems}
      brandName="SIDEBAR"
      position="${props?.layout}"
      variant="${variant}"
    />
  }
  footer={
  <footer className="py-4 text-center text-muted-foreground">
  © 2025 My Application. All rights reserved.
  </footer>
}>
{mainContent}
</Sidebar${OptimisedTemplate}Layout>`;

  const [hasOpenButton, setHasOpenButton] = React.useState(false);

  React.useEffect(() => {
    // small delay ensures the DOM is ready
    const check = () => {
      const btn = document.querySelector("span[title='Open']");
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
    <div
      className={cn(
        "flex flex-col gap-1 p-0 mt-4 max-h-[calc(100dvh-var(--header-h)-var(--footer-h))] scrollbar-hidden ",
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

    </div>
    </>
  );

  return (
    <div className="space-y-6 mb-8">
      <div className="flex flex-wrap gap-4 justify-start sm:justify-end">
        <VariantSelector
          variants={[...variants]}
          selectedVariant={variant}
          onSelectVariant={(v) => setVariant(v as "default"| "dark"| "light"| "glass")}
          type="Variant"
        />
        <VariantSelector
          variants={[...sidebarWidth]}
          selectedVariant={width}
          onSelectVariant={(v) => setWidth(v as "default"| "compact"|"wide"|"expanded")}
          type="SideBar Width"
        />
        <VariantSelector
          variants={[...mobileBreakpoints]}
          selectedVariant={mobileBreakpoint}
          onSelectVariant={(v) => setMobileBreakpoint(v as "sm"| "md"| "lg")}
          type="Mobile Breakpoint"
        />
      </div>
      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="border border-gray-300 rounded-lg overflow-hidden p-3">
            <SideBarLeftLayout
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
              sidebar={
                <Sidebar
                  links={navItems}
                  brandName="Sidebar"
                  position={props?.layout}
                  variant={variant}
                  className="overflow-auto"
                />
              }
              footer={
                <footer className="py-4 text-center text-muted-foreground">
                  © 2025 My Application. All rights reserved.
                </footer>
              }
              sidebarWidth={width}
              variant={variant}
              mobileBreakpoint={mobileBreakpoint}
              sidebarPosition={props.layout}
            >
            {/* {mainContent} */}
              <div className="relative">
               
                {mobileBreakpoint==="sm" && (
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

export default TemplateSideBarLayoutDemo;

