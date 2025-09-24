import { HeaderLayout } from "./index";
import { Navbar } from "../../navbar";
import Sidebar from "../../sidebar";
import { Button } from "../../button";
import { Card } from "../../card";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof HeaderLayout> = {
  title: "Layouts/HeaderLayout",
  component: HeaderLayout,
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
    sidebarPosition: {
      control: { type: "select" },
      options: ["left", "right", "top", "bottom"],
      description: "Position of the sidebar",
    },
    mobileBreakpoint: {
      control: { type: "select" },
      options: ["sm", "md", "lg"],
      description: "Breakpoint for mobile behavior",
    },
    enableGestures: {
      control: { type: "boolean" },
      description: "Enable touch gestures for mobile sidebar",
    },
    overlay: {
      control: { type: "boolean" },
      description: "Show overlay when sidebar is open on mobile",
    },
    stickyHeader: {
      control: { type: "boolean" },
      description: "Make header sticky",
    },
    stickyFooter: {
      control: { type: "boolean" },
      description: "Make footer sticky",
    },
    sidebarCollapsed: {
      control: { type: "boolean" },
      description: "Start with sidebar collapsed",
    },
  },
};

export default meta;
type Story = StoryObj<typeof HeaderLayout>;

// Sample navigation items for sidebar
const navItems = [
  { label: "Dashboard", href: "#", icon: () => <div className="w-5 h-5 bg-blue-500 rounded" /> },
  { label: "Projects", href: "#", icon: () => <div className="w-5 h-5 bg-green-500 rounded" /> },
  { label: "Team", href: "#", icon: () => <div className="w-5 h-5 bg-purple-500 rounded" /> },
  { label: "Settings", href: "#", icon: () => <div className="w-5 h-5 bg-orange-500 rounded" /> },
];

// Basic HeaderLayout Story
export const Basic: Story = {
  args: {
    header: (
      <Navbar variant="default" size="md">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold">My Application</h1>
          <nav className="flex space-x-4">
            <a href="#" className="hover:text-primary">Home</a>
            <a href="#" className="hover:text-primary">About</a>
            <a href="#" className="hover:text-primary">Contact</a>
          </nav>
        </div>
      </Navbar>
    ),
    sidebar: (
      <Sidebar
        links={navItems}
        brandName="App"
        variant="default"
      />
    ),
    footer: (
      <footer className="py-4 text-center text-muted-foreground">
        © 2024 My Application. All rights reserved.
      </footer>
    ),
    children: (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Welcome to HeaderLayout</h2>
        <p className="text-muted-foreground">
          This is a comprehensive layout component with advanced features including animations, 
          responsive behavior, and theme variants.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <h3 className="font-semibold">Feature 1</h3>
            <p className="text-sm text-muted-foreground">Advanced animations with framer-motion</p>
          </Card>
          <Card>
            <h3 className="font-semibold">Feature 2</h3>
            <p className="text-sm text-muted-foreground">Responsive mobile-first design</p>
          </Card>
          <Card>
            <h3 className="font-semibold">Feature 3</h3>
            <p className="text-sm text-muted-foreground">Theme variants and styling system</p>
          </Card>
        </div>
      </div>
    ),
  },
};

// Dark Theme Story
export const DarkTheme: Story = {
  args: {
    ...Basic.args,
    variant: "dark",
    header: (
      <Navbar variant="dark" size="md">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold">Dark Mode App</h1>
          <nav className="flex space-x-4">
            <a href="#" className="hover:text-primary">Home</a>
            <a href="#" className="hover:text-primary">About</a>
            <a href="#" className="hover:text-primary">Contact</a>
          </nav>
        </div>
      </Navbar>
    ),
    sidebar: (
      <Sidebar
        links={navItems}
        brandName="Dark App"
        variant="dark"
      />
    ),
    children: (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Dark Theme Layout</h2>
        <p className="text-muted-foreground">
          This layout uses the dark theme variant with a sophisticated color scheme.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <h3 className="font-semibold">Dark Mode Benefits</h3>
            <p className="text-sm text-muted-foreground">Reduced eye strain in low-light environments</p>
          </Card>
          <Card>
            <h3 className="font-semibold">Modern Design</h3>
            <p className="text-sm text-muted-foreground">Clean and contemporary appearance</p>
          </Card>
        </div>
      </div>
    ),
  },
};

// Right Sidebar Story
export const RightSidebar: Story = {
  args: {
    ...Basic.args,
    sidebarPosition: "right",
    header: (
      <Navbar variant="default" size="md">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold">Right Sidebar Layout</h1>
          <nav className="flex space-x-4">
            <a href="#" className="hover:text-primary">Home</a>
            <a href="#" className="hover:text-primary">About</a>
            <a href="#" className="hover:text-primary">Contact</a>
          </nav>
        </div>
      </Navbar>
    ),
    sidebar: (
      <Sidebar
        links={navItems}
        brandName="Right App"
        variant="default"
        position="right"
      />
    ),
    children: (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Right Sidebar Layout</h2>
        <p className="text-muted-foreground">
          This layout features a sidebar positioned on the right side of the screen.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <h3 className="font-semibold">Right-Aligned</h3>
            <p className="text-sm text-muted-foreground">Content flows from left to right</p>
          </Card>
          <Card>
            <h3 className="font-semibold">Alternative Layout</h3>
            <p className="text-sm text-muted-foreground">Different visual organization</p>
          </Card>
        </div>
      </div>
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
    header: (
      <Navbar variant="default" size="sm">
        <div className="flex items-center justify-between w-full">
          <h1 className="text-lg font-bold">Mobile App</h1>
          <Button variant="ghost" size="sm">
            Menu
          </Button>
        </div>
      </Navbar>
    ),
    sidebar: (
      <Sidebar
        links={navItems}
        brandName="Mobile"
        variant="default"
      />
    ),
    children: (
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Mobile-First Design</h2>
        <p className="text-muted-foreground">
          This layout is optimized for mobile devices with touch gestures and responsive behavior.
        </p>
        <div className="space-y-3">
          <Card>
            <h3 className="font-semibold">Touch Gestures</h3>
            <p className="text-sm text-muted-foreground">Swipe to open/close sidebar</p>
          </Card>
          <Card>
            <h3 className="font-semibold">Responsive Breakpoint</h3>
            <p className="text-sm text-muted-foreground">Mobile behavior at md breakpoint</p>
          </Card>
          <Card>
            <h3 className="font-semibold">Overlay Support</h3>
            <p className="text-sm text-muted-foreground">Dark overlay when sidebar is open</p>
          </Card>
        </div>
      </div>
    ),
  },
  parameters: {
    viewport: {
      defaultViewport: "iphone12",
    },
  },
};
