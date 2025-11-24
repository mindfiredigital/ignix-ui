import { FullHeightSidebarLayout } from "./index";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Home, Settings, BookOpen, Palette, Layout } from 'lucide-react';
import { Navbar } from "../../../components/navbar";
import Sidebar from "../../../components/sidebar";

const meta: Meta<typeof FullHeightSidebarLayout> = {
  title: "Templates/Layouts/FullHeightSidebarLayout",
  component: FullHeightSidebarLayout,
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
    variant: {
      control: { type: "select" },
      options: ["default", "dark", "light", "glass", "gradient"],
      description: "Visual theme variant for the layout",
    },
    sidebarPosition: {
      control: { type: "select" },
      options: ["left", "right"],
      description: "Position for sidebar",
    },
    mobileBreakpoint: {
      control: { type: "select" },
      options: ["sm", "md", "lg"],
      description: "Breakpoint for mobile behavior",
    },
  },
};

export default meta;
type Story = StoryObj<typeof FullHeightSidebarLayout>;

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
        links={navItems}
        brandName="SIDEBAR"
        position="left"
      />
    ),

    children: (
    <>
    <div className="min-h-screen text-slate-900 px-6 py-8 transition-all">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Performance Center</h1>
          <p className="text-sm  mt-1">Live stats from last 30 days</p>
        </div>

        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-lg bg-purple-600 text-white border border-indigo-200 hover:scale-105 transition">
            Export
          </button>
          <button className="px-5 py-2 rounded-lg bg-purple-600 text-white hover:scale-105 transition">
            + Add Report
          </button>
        </div>
      </div>

      {/* GLASS STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  gap-6 mb-10">
        {[
          { label: "Total Revenue", value: "$128,540", change: "+12.4%", color: "text-green-500" },
          { label: "New Clients", value: "1,280", change: "+8.1%", color: "text-blue-500" },
          { label: "Active Plans", value: "320", change: "Stable", color: "text-yellow-500" },
          { label: "Churn Rate", value: "2.4%", change: "-0.6%", color: "text-red-500" },
        ].map((stat, i) => (
          <div
            key={i}
            className="rounded-2xl p-6 bg-white border border-indigo-100 shadow-lg hover:scale-[1.03] transition cursor-pointer"
          >
            <p className="text-sm opacity-70">{stat.label}</p>
            <h2 className="text-3xl font-bold mt-2">{stat.value}</h2>
            <span className={`text-sm font-medium ${stat.color}`}>{stat.change}</span>
          </div>
        ))}
      </div>

      {/* MIDDLE SECTION */}
      <div className="grid md:grid-cols-1 lg:grid-cols-3  gap-6">

        {/* PROJECT STATUS */}
        <div className="md:col-span-2 p-6 rounded-2xl bg-white border border-indigo-100 shadow-xl hover:shadow-2xl transition">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Live Projects</h3>
            <span className="px-3 py-1 text-xs bg-indigo-600 text-white rounded-full">3 Ongoing</span>
          </div>

          <div className="space-y-6">
            {[
              { name: "AI Dashboard", progress: 88, color: "bg-indigo-600" },
              { name: "Mobile Banking", progress: 63, color: "bg-green-500" },
              { name: "Crypto Platform", progress: 41, color: "bg-orange-500" },
            ].map((project, idx) => (
              <div key={idx}>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">{project.name}</span>
                  <span className="text-indigo-500">{project.progress}%</span>
                </div>
                <div className="h-2 bg-indigo-100 rounded-full">
                  <div className={`${project.color} h-full rounded-full`} style={{ width: `${project.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TEAM CARD */}
        <div className="p-6 rounded-2xl bg-white border border-indigo-100 shadow-xl hover:shadow-2xl transition">
          <h3 className="text-lg font-semibold mb-6">Core Team</h3>
          <div className="space-y-4">
            {[
              { name: "Alex Morgan", role: "UI Engineer", avatar: "https://i.pravatar.cc/40?img=10", status: "bg-green-500" },
              { name: "Sofia Khan", role: "Product Lead", avatar: "https://i.pravatar.cc/40?img=11", status: "bg-green-500" },
              { name: "Daniel Cruz", role: "Backend Dev", avatar: "https://i.pravatar.cc/40?img=12", status: "bg-yellow-400" },
            ].map((member, idx) => (
              <div key={idx} className="flex items-center gap-3 p-2 rounded-xl hover:bg-indigo-50 transition cursor-pointer">
                <img src={member.avatar} className="h-10 w-10 rounded-full" />
                <div className="flex-1">
                  <p className="font-medium">{member.name}</p>
                  <p className="text-sm opacity-70">{member.role}</p>
                </div>
                <span className={`w-2 h-2 rounded-full ${member.status}`}></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION */}
      <div className="mt-10 grid md:grid-cols-2 gap-6">

        {/* MESSAGES */}
        <div className="bg-white border border-indigo-100 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition">
          <h3 className="text-lg font-semibold mb-4">Recent Messages</h3>
          <div className="space-y-3">
            {[
              { msg: "Client approved design ✅", time: "2h ago" },
              { msg: "Server upgrade completed 🚀", time: "6h ago" },
              { msg: "Payment received 💳", time: "Yesterday" },
            ].map((m, i) => (
              <div key={i} className="flex justify-between text-sm ">
                <span>{m.msg}</span>
                <span className="opacity-70">{m.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="p-6 bg-white border border-indigo-100 rounded-2xl shadow-xl hover:shadow-2xl transition">
          <h3 className="text-lg font-semibold mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            {["Create Invoice", "Add User", "Upload File", "View Reports"].map((action, i) => (
              <button key={i} className="bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-900/90 transition">{action}</button>
            ))}
          </div>
        </div>
      </div>

    </div>
    </>
    )
  },
};

// Right Side Bar Story
export const RightDarkSidebar: Story = {
  args: {
    ...Basic.args,
    variant: "dark",
    sidebarPosition:"right",
    sidebar: (
      <Sidebar
        links={navItems}
        brandName="SIDEBAR"
        variant="dark"
        position="right"
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
    sidebarPosition:"right",
    overlay: true,
    sidebar: (
      <Sidebar
        links={navItems}
        brandName="SIDEBAR"
        variant="default"
      />
    ),
  },
  parameters: {
    viewport: {
      defaultViewport: "iphone12",
    },
  },
};

// Gradient Effect + Slide Story 
export const GradientEffect: Story = {
  args: {
    ...Basic.args,
    variant:"gradient",
    sidebar: (
      <Sidebar
        links={navItems}
        brandName="SIDEBAR"
        variant="gradient"
        position="left"
    />
    ),
  },
};

