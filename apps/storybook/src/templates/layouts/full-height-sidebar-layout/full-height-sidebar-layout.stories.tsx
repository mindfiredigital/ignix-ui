import { FullHeightSidebarLayout } from "./index";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Home, Settings, BookOpen, Palette, Layout, Users, DollarSign, Activity, ArrowUpRight, ArrowDownRight, CheckCircle2, Clock, FileText, Plus, Download, Zap, Target, BarChart3, Bell, Award, LineChart, ShoppingCart } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 text-slate-900 px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 transition-all">

      {/* STUNNING HEADER SECTION */}
      <div className="mb-12 lg:mb-16">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-10">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-40 group-hover:opacity-60 transition-opacity animate-pulse"></div>
                <div className="relative p-4 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 rounded-3xl shadow-2xl shadow-indigo-500/30 group-hover:scale-105 transition-transform">
                  <Activity className="w-7 h-7 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  Dashboard
                </h1>
                <p className="text-base text-slate-600 flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  <span>Live data • Last updated 2 minutes ago</span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 w-full lg:w-auto">
            <button className="flex-1 lg:flex-none px-6 py-3 rounded-xl bg-white/80 backdrop-blur-sm border-2 border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 font-semibold text-sm">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="flex-1 lg:flex-none px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white hover:shadow-2xl hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 font-semibold text-sm shadow-lg">
              <Plus className="w-4 h-4" />
              New Report
            </button>
          </div>
        </div>

        {/* ENHANCED STATS BAR */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Today", value: "$12,450", trend: "+8.2%", period: "vs yesterday", gradient: "from-emerald-500 to-teal-600" },
            { label: "This Week", value: "$89,200", trend: "+15.3%", period: "vs last week", gradient: "from-blue-500 to-cyan-600" },
            { label: "This Month", value: "$342,000", trend: "+22.1%", period: "vs last month", gradient: "from-purple-500 to-pink-600" },
            { label: "All Time", value: "$1.24M", trend: "+45.8%", period: "total revenue", gradient: "from-amber-500 to-orange-600" },
          ].map((stat, i) => (
            <div key={i} className="group relative p-5 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all overflow-hidden">
              <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 rounded-full -mr-10 -mt-10 transition-opacity duration-500`}></div>
              <div className="relative">
                <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">{stat.label}</p>
                <div className="flex items-baseline gap-2 mb-1">
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">{stat.trend}</span>
                </div>
                <p className="text-xs text-slate-500">{stat.period}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* STUNNING METRICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10 lg:mb-12">
        {[
          { 
            label: "Total Revenue", 
            value: "$128,540", 
            change: "+12.4%", 
            icon: DollarSign,
            gradient: "from-emerald-500 to-teal-600",
            bgGradient: "from-emerald-50 to-teal-50",
            iconColor: "text-emerald-600",
            changeColor: "text-emerald-600",
            description: "vs last month"
          },
          { 
            label: "Active Users", 
            value: "12,480", 
            change: "+8.1%", 
            icon: Users,
            gradient: "from-blue-500 to-cyan-600",
            bgGradient: "from-blue-50 to-cyan-50",
            iconColor: "text-blue-600",
            changeColor: "text-blue-600",
            description: "1,280 new this month"
          },
          { 
            label: "Conversion Rate", 
            value: "3.24%", 
            change: "+0.8%", 
            icon: Target,
            gradient: "from-indigo-500 to-purple-600",
            bgGradient: "from-indigo-50 to-purple-50",
            iconColor: "text-indigo-600",
            changeColor: "text-indigo-600",
            description: "above industry avg"
          },
          { 
            label: "Avg. Order Value", 
            value: "$142", 
            change: "+5.2%", 
            icon: ShoppingCart,
            gradient: "from-amber-500 to-orange-600",
            bgGradient: "from-amber-50 to-orange-50",
            iconColor: "text-amber-600",
            changeColor: "text-amber-600",
            description: "trending upward"
          },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="group relative rounded-2xl p-6 bg-white/80 backdrop-blur-sm border border-slate-200/80 shadow-lg hover:shadow-2xl hover:border-slate-300 transition-all duration-300 overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-full -mr-16 -mt-16`}></div>
              
              <div className="relative">
                <div className="flex items-start justify-between mb-5">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                
                <p className="text-sm font-semibold text-slate-600 mb-2">{stat.label}</p>
                <h2 className={`text-3xl font-extrabold ${stat.iconColor} mb-3`}>{stat.value}</h2>
                
                <div className="flex items-center gap-2 mb-1">
                  {stat.change.startsWith('+') ? (
                    <ArrowUpRight className={`w-5 h-5 ${stat.changeColor}`} />
                  ) : (
                    <ArrowDownRight className={`w-5 h-5 ${stat.changeColor}`} />
                  )}
                  <span className={`text-sm font-bold ${stat.changeColor} bg-${stat.changeColor.split('-')[1]}-50 px-2 py-0.5 rounded-md`}>{stat.change}</span>
                </div>
                <p className="text-xs text-slate-500">{stat.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* STUNNING CHARTS & PROJECTS SECTION */}
      <div className="grid lg:grid-cols-3 gap-6 mb-10 lg:mb-12">
        {/* REVENUE CHART */}
        <div className="lg:col-span-2 p-6 lg:p-8 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200/80 shadow-lg hover:shadow-2xl transition-all duration-300">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-1">Revenue Overview</h3>
              <p className="text-sm text-slate-600">Last 7 days performance</p>
            </div>
            <div className="flex gap-2 bg-gradient-to-r from-slate-100 to-slate-50 p-1 rounded-xl border border-slate-200">
              <button className="px-4 py-2 text-xs font-bold bg-white text-slate-900 rounded-lg shadow-sm hover:shadow-md transition">
                7D
              </button>
              <button className="px-4 py-2 text-xs font-semibold text-slate-600 rounded-lg hover:text-slate-900 hover:bg-white/50 transition">
                30D
              </button>
              <button className="px-4 py-2 text-xs font-semibold text-slate-600 rounded-lg hover:text-slate-900 hover:bg-white/50 transition">
                90D
              </button>
            </div>
          </div>

          {/* Enhanced Chart Bars */}
          <div className="space-y-6">
            {[
              { day: "Mon", value: 85, amount: "$12.4K", gradient: "from-indigo-500 to-purple-600" },
              { day: "Tue", value: 92, amount: "$14.2K", gradient: "from-indigo-500 to-purple-600" },
              { day: "Wed", value: 78, amount: "$11.8K", gradient: "from-indigo-500 to-purple-600" },
              { day: "Thu", value: 95, amount: "$15.1K", gradient: "from-indigo-500 to-purple-600" },
              { day: "Fri", value: 88, amount: "$13.6K", gradient: "from-indigo-500 to-purple-600" },
              { day: "Sat", value: 65, amount: "$9.2K", gradient: "from-indigo-500 to-purple-600" },
              { day: "Sun", value: 72, amount: "$10.5K", gradient: "from-indigo-500 to-purple-600" },
            ].map((item, idx) => (
              <div key={idx} className="group">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-slate-700">{item.day}</span>
                  <span className="text-sm font-bold text-slate-900 bg-slate-50 px-2 py-1 rounded-md">{item.amount}</span>
                </div>
                <div className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className={`h-full bg-gradient-to-r ${item.gradient} rounded-full transition-all duration-1000 ease-out shadow-md group-hover:shadow-lg`}
                    style={{ width: `${item.value}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 rounded-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ACTIVE PROJECTS */}
        <div className="p-6 lg:p-8 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200/80 shadow-lg hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-1">Active Projects</h3>
              <p className="text-sm text-slate-600">3 in progress</p>
            </div>
            <span className="px-4 py-2 text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-lg">
              3
            </span>
          </div>

          <div className="space-y-6">
            {[
              { name: "AI Dashboard", progress: 88, days: "12 days left", gradient: "from-indigo-500 to-purple-600", bgColor: "bg-indigo-100" },
              { name: "Mobile App", progress: 63, days: "8 days left", gradient: "from-emerald-500 to-teal-600", bgColor: "bg-emerald-100" },
              { name: "Web Platform", progress: 41, days: "15 days left", gradient: "from-amber-500 to-orange-600", bgColor: "bg-amber-100" },
            ].map((project, idx) => (
              <div key={idx} className="group">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-semibold text-slate-900 text-sm">{project.name}</span>
                  <span className="text-sm font-bold text-slate-700">{project.progress}%</span>
                </div>
                <div className={`h-3 ${project.bgColor} rounded-full overflow-hidden mb-2 shadow-inner`}>
                  <div 
                    className={`h-full bg-gradient-to-r ${project.gradient} rounded-full transition-all duration-1000 ease-out shadow-sm group-hover:shadow-md`}
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500">{project.days}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* STUNNING TEAM & ACTIVITY SECTION */}
      <div className="grid lg:grid-cols-3 gap-6 mb-10 lg:mb-12">
        {/* TEAM MEMBERS */}
        <div className="p-6 lg:p-8 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200/80 shadow-lg hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-1">Team</h3>
              <p className="text-sm text-slate-600">8 active members</p>
            </div>
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
              <Users className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="space-y-4">
            {[
              { name: "Alex Morgan", role: "UI/UX Designer", avatar: "https://i.pravatar.cc/150?img=10", status: "bg-emerald-500", ring: "ring-emerald-200" },
              { name: "Sofia Khan", role: "Product Manager", avatar: "https://i.pravatar.cc/150?img=11", status: "bg-emerald-500", ring: "ring-emerald-200" },
              { name: "Daniel Cruz", role: "Full Stack Dev", avatar: "https://i.pravatar.cc/150?img=12", status: "bg-amber-400", ring: "ring-amber-200" },
              { name: "Emma Wilson", role: "Marketing Lead", avatar: "https://i.pravatar.cc/150?img=13", status: "bg-blue-500", ring: "ring-blue-200" },
            ].map((member, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200 group cursor-pointer">
                <div className="relative">
                  <img src={member.avatar} alt={member.name} className="h-12 w-12 rounded-full ring-2 ring-slate-100 group-hover:ring-4 group-hover:ring-indigo-200 transition-all object-cover shadow-md" />
                  <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 ${member.status} rounded-full border-2 border-white shadow-sm`}></span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 truncate text-sm">{member.name}</p>
                  <p className="text-xs text-slate-600 truncate">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RECENT ACTIVITY */}
        <div className="lg:col-span-2 p-6 lg:p-8 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200/80 shadow-lg hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-1">Recent Activity</h3>
              <p className="text-sm text-slate-600">Latest updates and notifications</p>
            </div>
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
              <Bell className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="space-y-4">
            {[
              { 
                icon: CheckCircle2, 
                title: "Project completed", 
                desc: "AI Dashboard v2.0 launched successfully", 
                time: "2 hours ago",
                gradient: "from-emerald-500 to-teal-600",
                bgColor: "bg-emerald-50",
                color: "text-emerald-600"
              },
              { 
                icon: DollarSign, 
                title: "Payment received", 
                desc: "$12,450 from Acme Corp", 
                time: "5 hours ago",
                gradient: "from-indigo-500 to-purple-600",
                bgColor: "bg-indigo-50",
                color: "text-indigo-600"
              },
              { 
                icon: Users, 
                title: "New team member", 
                desc: "Emma Wilson joined the team", 
                time: "Yesterday",
                gradient: "from-blue-500 to-cyan-600",
                bgColor: "bg-blue-50",
                color: "text-blue-600"
              },
              { 
                icon: Award, 
                title: "Milestone achieved", 
                desc: "Reached 10K active users", 
                time: "2 days ago",
                gradient: "from-amber-500 to-orange-600",
                bgColor: "bg-amber-50",
                color: "text-amber-600"
              },
            ].map((activity, i) => {
              const Icon = activity.icon;
              return (
                <div key={i} className="flex items-start gap-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-slate-50 hover:to-indigo-50 transition-all group cursor-pointer">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${activity.gradient} shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 mb-1 text-sm">{activity.title}</p>
                    <p className="text-sm text-slate-600 mb-2">{activity.desc}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {activity.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* STUNNING QUICK ACTIONS & METRICS */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* QUICK ACTIONS */}
        <div className="p-6 lg:p-8 bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Quick Actions</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Create Invoice", icon: FileText, gradient: "from-indigo-500 to-purple-600" },
              { label: "Add User", icon: Users, gradient: "from-blue-500 to-cyan-600" },
              { label: "Upload File", icon: Download, gradient: "from-emerald-500 to-teal-600" },
              { label: "View Reports", icon: BarChart3, gradient: "from-amber-500 to-orange-600" },
            ].map((action, i) => {
              const Icon = action.icon;
              return (
                <button 
                  key={i} 
                  className={`group relative px-5 py-5 rounded-xl bg-gradient-to-r ${action.gradient} text-white shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-200 overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
                  <div className="relative flex flex-col items-center gap-2">
                    <Icon className="w-6 h-6" />
                    <span className="text-xs font-bold text-center">{action.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* PERFORMANCE METRICS */}
        <div className="p-6 lg:p-8 bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
              <LineChart className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Performance</h3>
          </div>
          <div className="space-y-4">
            {[
              { label: "Page Load Time", value: "1.2s", target: "< 2s", gradient: "from-emerald-500 to-teal-600" },
              { label: "API Response", value: "145ms", target: "< 200ms", gradient: "from-blue-500 to-cyan-600" },
              { label: "Uptime", value: "99.9%", target: "> 99%", gradient: "from-indigo-500 to-purple-600" },
              { label: "Error Rate", value: "0.02%", target: "< 0.1%", gradient: "from-emerald-500 to-teal-600" },
            ].map((metric, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-slate-50 to-indigo-50/30 hover:from-slate-100 hover:to-indigo-50 transition-all border border-slate-200/50">
                <div>
                  <p className="font-bold text-slate-900 text-sm mb-1">{metric.label}</p>
                  <p className="text-xs text-slate-500">Target: {metric.target}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-slate-900 mb-1">{metric.value}</p>
                  <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" />
                    Optimal
                  </div>
                </div>
              </div>
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

