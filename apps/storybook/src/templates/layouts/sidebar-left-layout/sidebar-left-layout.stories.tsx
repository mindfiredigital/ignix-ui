import { SideBarLeftLayout } from "./index";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Home, Settings, BookOpen, Palette, Layout } from 'lucide-react';
import { Navbar } from "../../../components/navbar";
import Sidebar from "../../../components/sidebar";
import { Card } from "../../../components/card";

const date = new Date()
const year = date.getFullYear()

const meta: Meta<typeof SideBarLeftLayout> = {
  title: "Templates/Layouts/SideBarLeft",
  tags: ['autodocs'],
  component: SideBarLeftLayout,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: "Enhanced HeaderLayout component with advanced features including animations, responsive behavior, theme variants, and accessibility support.",
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["default", "dark", "light", "glass", "gradient"],
      description: "Visual theme variant for the layout",
    },
    animation: {
      control: { type: "select" },
      options: ["none", "slide", "fade", "scale", "bounce"],
      description: "Animation type for sidebar transitions",
    },
    sidebarWidth: {
      control: { type: "select" },
      options: ["default", "compact", "wide", "expanded"],
      description: "Configurable Sidebar width",
    },
    mobileBreakpoint: {
      control: { type: "select" },
      options: ["sm", "md", "lg"],
      description: "Breakpoint for mobile behavior",
    },
    stickyFooter: {
      control: { type: "boolean" },
      description: "Make footer sticky",
    },
   
  },
};

export default meta;
type Story = StoryObj<typeof SideBarLeftLayout>;

// Sample navigation items for sidebar
const navItems = [
  { label: "Dashboard", href: "#", icon:  Home },
  { label: "Pages", href: "#", icon: BookOpen},
  { label: "Component", href: "#", icon: Layout },
  { label: "Themes", href: "#", icon:Palette },
  { label: "Settings", href: "#", icon: Settings}
];

// Basic HeaderLayout Story 
export const Basic: Story = {
  args: {
    header: (
      <Navbar variant="primary" size="md" className='pl-16 md:pl-0'>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <img
              src="logo.png" // use your logo path
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
    ),
    sidebar: (
      <Sidebar
        links={navItems}
        brandName="SIDEBAR"
        variant="default"
      />
    ),
    footer: (
      <footer className="py-4 text-center text-muted-foreground">
        © {year} My Application. All rights reserved.
      </footer>
      ),
    children: (
      <>
      {/* Main content wrapper (scrollable area) */}
        <div className="flex flex-col gap-6 overflow-y-auto p-0 mt-4">
          
          {/* Overview */}
          <section className="space-y-2">
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
    ),
  },
};

// Dark Theme Story
export const SidebarDarkTheme: Story = {
  args: {
    ...Basic.args,
    variant: "dark",
    header:(
      <Navbar variant="default"  size="md">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <img
              src="logo.png" // use your logo path
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
    ),
    sidebar: (
      <Sidebar
        links={navItems}
        brandName="SIDEBAR"
        variant="dark"
      />
    ),
  },
};

//WidthConfigurable
export const SidebarBarConfigure: Story = {
  args: {
    ...Basic.args,
    sidebarWidth: "expanded",
    sidebar: (
      <Sidebar
        links={navItems}
        brandName="SIDEBAR"
      />
    ),
  },
};

// Mobile-Optimized Story
export const MobileOptimized: Story = {
  args: {
    ...Basic.args,
    mobileBreakpoint: "md",
    enableGestures: true,
    overlay: true,
    sidebar: (
      <Sidebar
        links={navItems}
        brandName="SIDEBAR"
        position="left"
        variant="light"
      />
    ),
  },
  parameters: {
    viewport: {
      defaultViewport: "iphone12",
    },
  },
};


