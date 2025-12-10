import { ThreeColumnSidebarLayout } from "./index";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Navbar } from "../../../components/navbar";
import Sidebar from "../../../components/threeColumSidebar";
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
} from "lucide-react"

const date = new Date()
const year = date.getFullYear()
const meta: Meta<typeof ThreeColumnSidebarLayout> = {
  title: "Templates/Layouts/ThreeColumnSidebarLayout",
  component: ThreeColumnSidebarLayout,
  tags: ['autodocs'],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: "Enhanced HeaderLayout component with advanced features including animations, responsive behavior, theme variants, and accessibility support.",
      },
    },
  },
  argTypes: {
    theme: {
      control: { type: "select" },
      options: ["light", "dark", "corporate", "custom", "glass", "modern", "ocean", "forest", "solarized"],
      description: "Visual theme variant for the layout",
    },
    mobileBreakpoint: {
      control: { type: "select" },
      options: ["sm", "md", "lg"],
      description: "Breakpoint for mobile behavior",
    },
    stickyHeader: {
      control: { type: "boolean" },
      description: "Make header sticky",
    },
    stickyFooter: {
      control: { type: "boolean" },
      description: "Make footer sticky",
    },
    sidebarLayoutMode: {
      control: { type: "select" },
      options: [ "OVERLAY_ONLY", "BOTTOM_DOCKED", "OVERLAY_WITH_PANE"],
      description: "Sidebar Layout Mode for Mobile Resposiveness"
    }
  },
};

export default meta;
type Story = StoryObj<typeof ThreeColumnSidebarLayout>;

// Sample navigation items for sidebar
const leftNavItems = [
  { label: "Type", href: "#", icon:  TypeIcon },
  { label: "Date", href: "#", icon: Calendar1},
  { label: "Sort", href: "#", icon: SortDesc },
];

const rightNavItems = [
  // Core Stats
  { label: "Stats", href: "#", icon: BarChart3 },
  { label: "Analytics", href: "#", icon: BarChartBig },
  { label: "Activity", href: "#", icon: Activity },
  { label: "Timeline", href: "#", icon: History },

  // Supplementary Info
  { label: "Related", href: "#", icon: Link },
  { label: "Details", href: "#", icon: FileText },
  { label: "Metadata", href: "#", icon: Tag },
  { label: "Sources", href: "#", icon: ExternalLink },

  // Context / People / Sharing
  { label: "Contributors", href: "#", icon: Users },
  { label: "Comments", href: "#", icon: MessageSquare },
  { label: "Bookmarks", href: "#", icon: Bookmark },
  { label: "Notifications", href: "#", icon: Bell },

  // System / Structure
  { label: "Structure", href: "#", icon: Layers },
  { label: "Database", href: "#", icon: Database },
  { label: "Overview", href: "#", icon: LayoutGrid },

  // Utility
  { label: "History Log", href: "#", icon: Clock },
  { label: "Settings", href: "#", icon: Settings },
  { label: "Help", href: "#", icon: HelpCircle },
]

const isMobile = window.innerWidth > 768 ? false: true;

const structure = [
{
  title: "Left Column",
  description:
    "This area is designed for navigation — menus, categories, profile shortcuts, or filters.",
},
{
  title: "Main Column",
  description:
    "The main workspace for your app. This contains feeds, forms, posts, dashboards, and important data.",
},
{
  title: "Right Column",
  description:
    "Perfect for enhancements such as trends, widgets, analytics, suggestions, and notifications.",
},
];

const useCases = [
  "Social media platforms (Twitter / LinkedIn)",
  "Admin & analytics dashboards",
  "News and blog platforms",
  "Project management tools",
  "Data-intensive applications",
  "CRM & content management systems",
];

const responsive = [
  { title: "Desktop", desc: "All 3 columns visible" },
  { title: "Tablet", desc: "Sidebars collapse" },
  { title: "Mobile", desc: "Only main content + drawer or bottom nav" },
];

const benefits = [
  "Highly organized layout",
  "Great user experience",
  "Scales for complex features",
  "Easy to maintain",
];

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl p-8 shadow-sm space-y-6 border">
      <h2 className="text-xl font-semibold">{title}</h2>
      {children}
    </section>
  );
}

// Basic HeaderLayout Story
export const Basic: Story = {
  args: {
    header: (
      <Navbar size="md">
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
        links={leftNavItems}
        brandName="Filter"
        position={isMobile ? "bottomLeft" : "left"}
        direction={isMobile ? "horizontal" : "vertical"}
      />
    ),

    rightSidebar:( 
      <Sidebar
        links={rightNavItems}
        brandName="Right Panel"
        position="right"
      />
    ),

    children: (
    <>
    <div className="space-y-8 p-4">
      {/* INTRO */}
      <section className="rounded-2xl p-8 shadow-sm space-y-4 border">
        <h1 className="text-3xl font-bold tracking-tight">
          Three Column Layout
        </h1>
        <p className="opacity-80 leading-relaxed max-w-3xl">
          A three-column layout is one of the most powerful and flexible UI
          patterns in modern web applications. It separates navigation,
          content, and supporting information to create clarity and balance.
        </p>
      </section>

      {/* STRUCTURE */}
      <Section title="1. Structure Overview">
        <div className="grid md:grid-cols-3 gap-6">
          {structure.map((item) => (
            <div
              key={item.title}
              className="p-5 rounded-xl border space-y-2"
            >
              <h3 className="font-semibold">{item.title}</h3>
              <p className="opacity-80 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* USE CASES */}
      <Section title="2. Best Use Cases">
        <div className="grid md:grid-cols-2 gap-4">
          {useCases.map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 p-4 rounded-xl border text-sm"
            >
              <span className="w-2 h-2 rounded-full bg-current" />
              {item}
            </div>
          ))}
        </div>
      </Section>

      {/* RESPONSIVE */}
      <Section title="3. Responsive Behavior">
        <p className="opacity-80 max-w-3xl leading-relaxed">
          On large screens, all three columns appear clearly. As the device
          gets smaller, the layout smoothly adapts to focus on the main
          content.
        </p>

        <div className="grid md:grid-cols-3 gap-6 pt-4">
          {responsive.map((item) => (
            <div
              key={item.title}
              className="p-5 rounded-xl border text-sm space-y-1"
            >
              <strong>{item.title}</strong>
              <p className="opacity-80">{item.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* VISUAL PREVIEW */}
      <Section title="4. Visual Preview">
        <div className="grid grid-cols-3 gap-4 text-center text-sm font-medium">
          {["Left Sidebar", "Main Content", "Right Sidebar"].map(
            (item, i) => (
              <div
                key={item}
                className={`p-6 rounded-xl border ${
                  i === 1 ? "scale-105" : ""
                }`}
              >
                {item}
                <p className="opacity-70 text-xs mt-1">
                  {i === 1 ? "(Primary Area)" : i === 0 ? "(Navigation)" : "(Extras)"}
                </p>
              </div>
            )
          )}
        </div>
      </Section>

      {/* BENEFITS */}
      <Section title="5. Why Developers Love This Pattern">
        <ul className="grid md:grid-cols-2 gap-4 text-sm list-none">
          {benefits.map((item) => (
            <li
              key={item}
              className="flex items-center gap-3 p-4 rounded-xl border"
            >
              ✅ {item}
            </li>
          ))}
        </ul>
      </Section>

      {/* DEV TIP */}
      <section className="rounded-2xl p-8 shadow-sm space-y-4 border">
        <h2 className="text-xl font-semibold">6. Pro Developer Tip</h2>
        <p className="opacity-80 max-w-3xl leading-relaxed">
          Keep only the <strong>main column scrollable</strong> while the
          header, footer, and sidebars remain fixed. This improves both
          performance and user experience — especially on mobile.
        </p>
      </section>
    </div>
    </>
    ),

    footer: (
      <footer className="py-5 text-center">
        © {year} My Application. All rights reserved.
      </footer>
    )
  },
};

// Right Side Bar Story
export const ThemedColumns: Story = {
  args: {
    ...Basic.args,
    theme: "modern",
  },
};

// Mobile-Optimized Story
export const MobileBottomDocked: Story = {
  args: {
    ...Basic.args,
    mobileBreakpoint: "md",
    sidebarLayoutMode: "BOTTOM_DOCKED",
    stickyHeader: true,
    stickyFooter: true,
    sidebar: (
       <Sidebar
        links={leftNavItems}
        brandName="Filter"
        position= "bottomLeft"
        direction= "horizontal"
        sidebarLayoutMode= "BOTTOM_DOCKED"
      />
    ) 
  },
  parameters: {
    viewport: {
      defaultViewport: "iphone12",
    },
  },
};

// Mobile-Optimised Only Overlay
export const MobileOverlay: Story = {
  args: {
    ...Basic.args,
    mobileBreakpoint: "md",
    overlay: true,
    sidebarLayoutMode: "OVERLAY_ONLY",
    stickyHeader: true,
    stickyFooter: true,
    sidebar: (
       <Sidebar
        links={leftNavItems}
        brandName="Filter"
        position= "left"
        direction= "vertical"
        sidebarLayoutMode= "OVERLAY_ONLY"
      />
    ) 
  },
  parameters: {
    viewport: {
      defaultViewport: "iphone12",
    },
  },
};

export const OverlayWithPane: Story = {
  args: {
    ...Basic.args,
    mobileBreakpoint: "md",
    overlay: true,
    sidebarLayoutMode: "OVERLAY_WITH_PANE",
    stickyHeader: true,
    stickyFooter: true,
    sidebar: (
      <Sidebar
        links={leftNavItems}
        brandName="Filter"
        position= "left"
        direction= "vertical"
        sidebarLayoutMode= "OVERLAY_WITH_PANE"
      />
    ),
    rightSidebar: (
      <Sidebar
        links={rightNavItems}
        brandName="Filter"
        position= "bottomLeft"
        direction= "horizontal"
        sidebarLayoutMode= "OVERLAY_WITH_PANE"
      />
    ) 
  },
  parameters: {
    viewport: {
      defaultViewport: "iphone12",
    },
  },
};


