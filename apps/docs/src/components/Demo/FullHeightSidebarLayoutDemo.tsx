import React, { useState } from 'react';
import VariantSelector from './VariantSelector';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import { Navbar } from '@site/src/components/UI/navbar';
import { Sidebar } from '@site/src/components/UI/sidebar';
import { Home, Settings, BookOpen, Palette, Layout, CheckCircle2, FileText, Users, Download, BarChart3, Clock, DollarSign, Bell, ArrowDownRight, ArrowUpRight, ShoppingCart, Target, Plus, Sparkles } from 'lucide-react';
import { cn } from '@site/src/utils/cn';
import { FullHeightSidebarLayout } from '@site/src/components/UI/fullheightsidebar-layout';

type LayoutBreakpoints = typeof mobileBreakpoints[number];
type LayoutVariants = typeof variants[number];
type LayoutPosition = typeof sidebarPosition[number];

const variants = ["default", "dark", "light", "glass"] as const;
const sidebarPosition = ["left", "right"] as const;
const mobileBreakpoints = ["sm", "md", "lg"] as const

/**
 * FullHeightSidebarLayoutDemo Component
 * 
 * A demo component showcasing the FullHeightSidebarLayout with interactive controls.
 * Allows users to preview different variants, sidebar positions, and mobile breakpoints.
 * Includes a live preview and code example for the layout component.
 * 
 * @component
 * @returns {JSX.Element} The demo component with preview and code tabs
 * 
 * @example
 * ```tsx
 * <FullHeightSidebarLayoutDemo />
 * ```
 */
const FullHeightSidebarLayoutDemo = () => {
  const [variant, setVariant] = useState<LayoutVariants>("default");
  const [position, setPosition] = useState<LayoutPosition>("left");
  const [mobileBreakpoint, setMobileBreakpoint] = useState<LayoutBreakpoints>("md");

 // Sample navigation items for sidebar
  const navItems = [
    { label: "Dashboard", href: "#", icon:  Home },
    { label: "Pages", href: "#", icon: BookOpen },
    { label: "Component", href: "#", icon: Layout },
    { label: "Themes", href: "#", icon:Palette },
    { label: "Settings", href: "#", icon: Settings },
  ];

  const codeString = `
  const navItems = [
    { label: "Dashboard", href: "#", icon:  Home },
    { label: "Pages", href: "#", icon: BookOpen },
    { label: "Component", href: "#", icon: Layout },
    { label: "Themes", href: "#", icon:Palette },
    { label: "Settings", href: "#", icon: Settings },
  ];
  
<FullHeightSidebarLayout
  variant="${variant}"
  sidebarPosition="${position}"
  mobileBreakpoint="${mobileBreakpoint}"
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
        position="${position}"
        variant="${variant}"
      />
  }
  children={mainContent}
</FullHeightSidebarLayout>`;
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
     <div className={cn("scrollbar-hidden min-h-screen px-0 lg:px-0 py-2 sm:py-4 transition-all",         
        mobileBreakpoint === "sm" && hasOpenButton
          ? "overflow-y-auto"
          : mobileBreakpoint === "sm"
          ? "overflow-hidden"
          : "overflow-y-auto")}>

      {/* COMPACT HEADER */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-2">
              App Dashboard
            </h1>
            <p className="text-sm text-slate-600 dark:text-white flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Live • Updated 2 min ago</span>
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:shadow-sm transition-all text-sm font-medium flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 shadow-sm transition-all text-sm font-medium flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New
            </button>
          </div>
        </div>

        {/* QUICK STATS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Today", value: "$12.4K", trend: "+8.2%" },
            { label: "Week", value: "$89.2K", trend: "+15.3%" },
            { label: "Month", value: "$342K", trend: "+22.1%" },
            { label: "Total", value: "$1.24M", trend: "+45.8%" },
          ].map((stat, i) => (
            <div key={i} className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{stat.value}</p>
                <span className="text-xs font-semibold text-emerald-600">{stat.trend}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* KEY METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { 
            label: "Revenue", 
            value: "$128,540", 
            change: "+12.4%", 
            icon: DollarSign,
            iconBg: "bg-emerald-500",
            iconColor: "text-emerald-600",
            changeColor: "text-emerald-600"
          },
          { 
            label: "Users", 
            value: "12,480", 
            change: "+8.1%", 
            icon: Users,
            iconBg: "bg-blue-500",
            iconColor: "text-blue-600",
            changeColor: "text-blue-600"
          },
          { 
            label: "Conversion", 
            value: "3.24%", 
            change: "+0.8%", 
            icon: Target,
            iconBg: "bg-indigo-500",
            iconColor: "text-indigo-600",
            changeColor: "text-indigo-600"
          },
          { 
            label: "Orders", 
            value: "$142", 
            change: "+5.2%", 
            icon: ShoppingCart,
            iconBg: "bg-amber-500",
            iconColor: "text-amber-600",
            changeColor: "text-amber-600"
          },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="rounded-xl p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${stat.iconBg}`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                {stat.change.startsWith('+') ? (
                  <ArrowUpRight className={`w-4 h-4 ${stat.changeColor}`} />
                ) : (
                  <ArrowDownRight className={`w-4 h-4 ${stat.changeColor}`} />
                )}
              </div>
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">{stat.label}</p>
              <h2 className={`text-2xl font-bold ${stat.iconColor} mb-1`}>{stat.value}</h2>
              <span className={`text-xs font-semibold ${stat.changeColor}`}>{stat.change}</span>
            </div>
          );
        })}
      </div>

      {/* CHART & PROJECTS */}
      <div className="grid lg:grid-cols-3 gap-4 mb-8">
        {/* CHART */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">Revenue Trend</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">Last 7 days</p>
            </div>
            <div className="flex gap-1 bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
              <button className="px-2 py-1 text-xs font-semibold bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 rounded shadow-sm">7D</button>
              <button className="px-2 py-1 text-xs font-medium text-slate-600 dark:text-slate-400 rounded hover:text-slate-900 dark:hover:text-slate-100">30D</button>
              <button className="px-2 py-1 text-xs font-medium text-slate-600 dark:text-slate-400 rounded hover:text-slate-900 dark:hover:text-slate-100">90D</button>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { day: "Mon", value: 85, amount: "$12.4K" },
              { day: "Tue", value: 92, amount: "$14.2K" },
              { day: "Wed", value: 78, amount: "$11.8K" },
              { day: "Thu", value: 95, amount: "$15.1K" },
              { day: "Fri", value: 88, amount: "$13.6K" },
              { day: "Sat", value: 65, amount: "$9.2K" },
              { day: "Sun", value: 72, amount: "$10.5K" },
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{item.day}</span>
                  <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">{item.amount}</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-1000"
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PROJECTS */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">Projects</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">3 active</p>
            </div>
            <span className="px-2 py-1 text-xs font-bold bg-slate-900 dark:bg-slate-600 text-white rounded-full">3</span>
          </div>
          <div className="space-y-4">
            {[
              { name: "Dashboard", progress: 88, color: "bg-indigo-500" },
              { name: "Mobile App", progress: 63, color: "bg-emerald-500" },
              { name: "Web App", progress: 41, color: "bg-amber-500" },
            ].map((project, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-slate-900 dark:text-slate-100 text-xs">{project.name}</span>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{project.progress}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${project.color} rounded-full transition-all duration-1000`}
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TEAM & ACTIVITY */}
      <div className="grid lg:grid-cols-3 gap-4 mb-8">
        {/* TEAM */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Team</h3>
            <Users className="w-4 h-4 text-slate-400 dark:text-slate-500" />
          </div>
          <div className="space-y-3">
            {[
              { name: "Alex Morgan", role: "Designer", avatar: "https://i.pravatar.cc/150?img=10", status: "bg-emerald-500" },
              { name: "Sofia Khan", role: "PM", avatar: "https://i.pravatar.cc/150?img=11", status: "bg-emerald-500" },
              { name: "Daniel Cruz", role: "Developer", avatar: "https://i.pravatar.cc/150?img=12", status: "bg-amber-400" },
            ].map((member, idx) => (
              <div key={idx} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                <div className="relative">
                  <img src={member.avatar} alt={member.name} className="h-9 w-9 rounded-full ring-2 ring-slate-100 dark:ring-slate-700 object-cover" />
                  <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 ${member.status} rounded-full border-2 border-white dark:border-slate-800`}></span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 dark:text-slate-100 truncate text-xs">{member.name}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 truncate">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ACTIVITY */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Activity</h3>
            <Bell className="w-4 h-4 text-slate-400 dark:text-slate-500" />
          </div>
          <div className="space-y-2">
            {[
              { icon: CheckCircle2, title: "Project completed", desc: "Dashboard v2.0 launched", time: "2h ago", color: "text-emerald-600", bgColor: "bg-emerald-50" },
              { icon: DollarSign, title: "Payment received", desc: "$12,450 from Acme Corp", time: "5h ago", color: "text-indigo-600", bgColor: "bg-indigo-50" },
              { icon: Users, title: "New member", desc: "Emma joined the team", time: "Yesterday", color: "text-blue-600", bgColor: "bg-blue-50" },
            ].map((activity, i) => {
              const Icon = activity.icon;
              return (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                  <div className={`p-2 rounded-lg ${activity.bgColor} dark:bg-opacity-20`}>
                    <Icon className={`w-3.5 h-3.5 ${activity.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 dark:text-slate-100 mb-0.5 text-xs">{activity.title}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">{activity.desc}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
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

      {/* QUICK ACTIONS */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Invoice", icon: FileText, bg: "bg-indigo-500" },
          { label: "Add User", icon: Users, bg: "bg-blue-500" },
          { label: "Upload", icon: Download, bg: "bg-emerald-500" },
          { label: "Reports", icon: BarChart3, bg: "bg-amber-500" },
        ].map((action, i) => {
          const Icon = action.icon;
          return (
            <button 
              key={i} 
              className={`p-4 rounded-xl ${action.bg} text-white shadow-sm hover:shadow-md transition-all group`}
            >
              <div className="flex flex-col items-center gap-2">
                <Icon className="w-5 h-5" />
                <span className="text-xs font-semibold">{action.label}</span>
              </div>
            </button>
          );
        })}
      </div>

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
          variants={[...sidebarPosition]}
          selectedVariant={position}
          onSelectVariant={(v) => setPosition(v as "left"| "right")}
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
            <FullHeightSidebarLayout
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
                  position={position}
                  variant={variant}
                />
              }
              sidebarPosition={position}
              variant={variant}
              mobileBreakpoint={mobileBreakpoint}
            >
            <div className={cn(
                "relative z-10",
                variant === "dark"
              )}>
                {mobileBreakpoint==='sm' && (
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 z-0 bg-black/50 sidebar-sm-ignis"
                  />
                )}
                <div className="relative z-10">{mainContent}</div>
              </div>
            </FullHeightSidebarLayout>
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

export default FullHeightSidebarLayoutDemo;

