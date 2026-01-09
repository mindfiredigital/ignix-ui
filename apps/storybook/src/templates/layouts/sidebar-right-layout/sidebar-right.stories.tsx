import { SidebarRightLayout } from "./index";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Home, Settings, BookOpen, Palette, Layout } from 'lucide-react';
import { Navbar } from "../../../components/navbar";
import Sidebar from "../../../components/sidebar";
import { Card } from "../../../components/card";

const date = new Date()
const year = date.getFullYear()

const meta: Meta<typeof SidebarRightLayout> = {
  title: "Templates/Layouts/SideBarRight",
  tags: ['autodocs'],
  component: SidebarRightLayout,
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
type Story = StoryObj<typeof SidebarRightLayout>;

// Sample navigation items for sidebar
const navItems = [
  { label: "Dashboard", href: "#", icon:  Home },
  { label: "Pages", href: "#", icon: BookOpen},
  { label: "Component", href: "#", icon: Layout },
  { label: "Themes", href: "#", icon:Palette },
  { label: "Settings", href: "#", icon: Settings},
];

// Basic HeaderLayout Story
export const Basic: Story = {
  args: {
    header: (
      <Navbar variant="primary" size="md">
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
        position="right"
        variant="default"
        className="overflow-auto"
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
        <div className="flex flex-col gap-6 overflow-y-auto p-8 max-h-[calc(100dvh-var(--header-h)-var(--footer-h))]">

        {/* Overview */}
        <section className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Welcome to Sidebar Right Layout</h2>
          <p className="text-muted-foreground text-base leading-relaxed">
          The <strong>SidebarRight Layout</strong> is designed for interfaces that place tools, insights, or 
          contextual actions on the right side of the screen. This structure is especially useful in 
          data-rich, content-focused, or collaboration-heavy environments where the sidebar acts as a 
          secondary workspace rather than a primary navigation column.
          </p>
        </section>

        {/* Key Features Grid */}
        <section>
          <h3 className="text-xl font-semibold mb-3">Key Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

          <Card className="p-6">
          <h4 className="font-semibold">🧭 Context-Aware Layout</h4>
          <p className="text-sm text-muted-foreground">
            Ideal for showing details, side tools, inspectors, or secondary actions without interrupting 
            the main workflow.
          </p>
          </Card>

          <Card className="p-6">
          <h4 className="font-semibold">🪄 Smooth Sliding Drawer</h4>
          <p className="text-sm text-muted-foreground">
            The sidebar opens from the right edge with fluid animations that feel intuitive, especially 
            in mobile or compact setups.
          </p>
          </Card>

          <Card className="p-6">
          <h4 className="font-semibold">🌍 Multi-Panel Support</h4>
          <p className="text-sm text-muted-foreground">
            Can host tabs, collapsible sections, or multi-level tools without cluttering your main view.
          </p>
          </Card>

          <Card className="p-6">
          <h4 className="font-semibold">🎚 Adjustable Width</h4>
          <p className="text-sm text-muted-foreground">
            Configure width presets or allow users to resize the sidebar for a personalized workspace.
          </p>
          </Card>

          <Card className="p-6">
          <h4 className="font-semibold">🧊 Stable Layout</h4>
          <p className="text-sm text-muted-foreground">
            The main content area adjusts smoothly when the right sidebar is expanded or collapsed, 
            preventing visual jumps.
          </p>
          </Card>

          <Card className="p-6">
          <h4 className="font-semibold">🔧 Developer-Optimized</h4>
          <p className="text-sm text-muted-foreground">
            Built with clean separation of concerns, making it ideal for customizing advanced UI tools 
            like property editors, inspectors, or previews.
          </p>
          </Card>

        </div>
        </section>

        {/* Use Cases */}
        <section>
        <h3 className="text-xl font-semibold mb-3">Common Use Cases</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <Card className="p-6">
        <h4 className="font-semibold">📊 Insight Panels</h4>
        <p className="text-sm text-muted-foreground">
          Great for dashboards where analytics, summaries, or timelines sit alongside primary data.
        </p>
        </Card>

        <Card className="p-6">
          <h4 className="font-semibold">🛠 Property & Style Editors</h4>
          <p className="text-sm text-muted-foreground">
            Perfect for design tools, code playgrounds, and builder interfaces that need adjustable 
            controls on the right side.
          </p>
        </Card>

        <Card className="p-6">
          <h4 className="font-semibold">💬 Communication Panels</h4>
          <p className="text-sm text-muted-foreground">
            Useful in collaboration apps where chat, mentions, and activity logs complement the main task.
          </p>
        </Card>

        <Card className="p-6">
          <h4 className="font-semibold">🔍 Document Review</h4>
          <p className="text-sm text-muted-foreground">
            Right sidebars are perfect for comments, annotations, version history, and AI suggestions 
            while reading or editing content.
          </p>
        </Card>

        </div>
        </section>

        {/* Performance Section */}
        <section>
          <h3 className="text-xl font-semibold mb-3">Performance Insights</h3>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground">
            Engineered to minimize layout shifts, the right sidebar only re-renders when its internal 
            state changes. This ensures that heavy content or interaction tools do not affect the 
            fluidity of the main content area.
            </p>
          </Card>
        </section>

        {/* Accessibility Section */}
        <section>
          <h3 className="text-xl font-semibold mb-3">Accessibility Standards</h3>
          <Card className="p-6">
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            <li>Logical navigation order ensures the sidebar remains reachable after main content.</li>
            <li>ARIA labels clearly communicate open and closed states of the sidebar drawer.</li>
            <li>Supports keyboard shortcuts and focus-traps for complex sidebar tools.</li>
            </ul>
          </Card>
        </section>

        </div>

      </>
    ),
  },
};

// Dark Theme Story
export const DarkTheme: Story = {
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
        position="right"
        variant="dark"
      />
    ),
  },
};

// Expanded Sidebar Width Story
export const ExpandedSidebar: Story = {
  args: {
    ...Basic.args,
    variant: "dark",
    sidebarWidth: "expanded",
    sidebar: (
      <Sidebar
        links={navItems}
        brandName="SIDEBAR"
        position="right"
        variant="dark"
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
        position="right"
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


