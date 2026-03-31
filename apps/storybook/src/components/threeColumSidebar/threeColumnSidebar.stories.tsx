import type { Decorator, Meta, StoryObj } from "@storybook/react";
import { motion, type Variants, type Easing } from "framer-motion";
import {
  BarChart2,
  Bell,
  Bookmark,
  FileText,
  HelpCircle,
  Home,
  Inbox,
  Layers,
  LogOut,
  Settings,
  Shield,
  Star,
  User,
  Zap,
} from "lucide-react";
import ThreeColumnSidebar, { SidebarProvider } from "./index";

const defaultLinks = [
  { label: "Home", href: "#", icon: Home },
  { label: "Inbox", href: "#", icon: Inbox },
  { label: "Analytics", href: "#", icon: BarChart2 },
  { label: "Files", href: "#", icon: FileText },
  { label: "Bookmarks", href: "#", icon: Bookmark },
  { label: "Settings", href: "#", icon: Settings },
];

const extendedLinks = [
  { label: "Home", href: "#", icon: Home },
  { label: "Inbox", href: "#", icon: Inbox },
  { label: "Analytics", href: "#", icon: BarChart2 },
  { label: "Files", href: "#", icon: FileText },
  { label: "Bookmarks", href: "#", icon: Bookmark },
  { label: "Profile", href: "#", icon: User },
  { label: "Notifications", href: "#", icon: Bell },
  { label: "Security", href: "#", icon: Shield },
  { label: "Layers", href: "#", icon: Layers },
  { label: "Quickstart", href: "#", icon: Zap },
  { label: "Stars", href: "#", icon: Star },
  { label: "Help", href: "#", icon: HelpCircle },
  { label: "Logout", href: "#", icon: LogOut },
];

const STORY_STYLES = `
  .sb-dot-grid {
    background-image: radial-gradient(circle, rgba(248,250,252,0.04) 1px, transparent 1px);
    background-size: 22px 22px;
  }

  .sb-side-l > * {
    background: var(--background) !important;
    border-right: 1px solid var(--border) !important;
    color: var(--foreground) !important;
  }
  .sb-side-r > * {
    background: var(--background) !important;
    border-left:  1px solid var(--border) !important;
    color: var(--foreground) !important;
  }
  .sb-side-b > * {
    background: var(--background) !important;
    border-top: 1px solid var(--border) !important;
    color: var(--foreground) !important;
  }

  .sb-gradient-pill {
    background: linear-gradient(
      135deg,
      var(--color-gradient-from-dropdown, #a855f7) 0%,
      var(--color-gradient-to-dropdown, #ec4899) 100%
    );
  }
`;

function injectStoryStyles() {
  if (typeof document === "undefined") return;
  const id = "sb-three-col-styles-v3";
  if (document.getElementById(id)) return;
  const el = document.createElement("style");
  el.id = id;
  el.textContent = STORY_STYLES;
  document.head.appendChild(el);
}

const shellVariants: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.982 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] as Easing },
  },
};

const panelVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, delay: 0.1 } },
};

const itemVariants = (delay: number): Variants => ({
  hidden: { opacity: 0, y: 7 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.38, delay, ease: "easeOut" as Easing },
  },
});

function AnimatedContentPanel({
  subtitle = "Resize the canvas to test responsive behaviour.",
}: {
  subtitle?: string;
}) {
  return (
    <motion.div
      className="sb-dot-grid relative flex flex-1 flex-col items-center justify-center gap-4 overflow-hidden p-10 text-center bg-background"
      variants={panelVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="pointer-events-none absolute size-[340px] rounded-full blur-[52px] bg-[radial-gradient(circle,rgba(168,85,247,0.07)_0%,rgba(236,72,153,0.04)_50%,transparent_72%)]" />

      <motion.p
        className="text-[13px] text-muted-foreground max-w-[230px] leading-relaxed m-0"
        variants={itemVariants(0.38)}
        initial="hidden"
        animate="visible"
      >
        {subtitle}
      </motion.p>

      <motion.div
        className="w-8 h-px rounded-full bg-border my-0.5"
        variants={itemVariants(0.44)}
        initial="hidden"
        animate="visible"
      />
    </motion.div>
  );
}

function Shell({
  children,
  flex = "row",
}: {
  children: React.ReactNode;
  flex?: "row" | "col";
}) {
  injectStoryStyles();
  return (
    <motion.div
      className={[
        "dark relative overflow-hidden rounded-2xl bg-background border border-border",
        "flex w-full",
        flex === "col" ? "flex-col" : "",
      ].join(" ")}
      style={{
        height: 600,
        boxShadow:
          "0 0 0 1px rgba(255,255,255,0.025)," +
          "0 24px 56px rgba(0,0,0,0.55)," +
          "0 6px 16px rgba(0,0,0,0.3)",
      }}
      variants={shellVariants}
      initial="hidden"
      animate="visible"
    >
      <div
        className="absolute inset-x-0 top-0 h-px z-20"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(168,85,247,0.5) 40%, rgba(236,72,153,0.5) 60%, transparent 100%)",
        }}
      />
      {children}
    </motion.div>
  );
}

const withLeftShell: Decorator = (Story) => (
  <Shell flex="row">
    <div className="sb-side-l flex h-full"><Story /></div>
    <AnimatedContentPanel />
  </Shell>
);

const withRightShell: Decorator = (Story) => (
  <Shell flex="row">
    <AnimatedContentPanel subtitle="Sidebar anchored to the right edge." />
    <div className="sb-side-r flex h-full"><Story /></div>
  </Shell>
);

const withBottomShell: Decorator = (Story) => (
  <Shell flex="col">
    <AnimatedContentPanel subtitle="Bottom sidebar anchored below." />
    <div className="sb-side-b w-full"><Story /></div>
  </Shell>
);

const meta: Meta<typeof ThreeColumnSidebar> = {
  title: "Navigation/ThreeColumnSidebar",
  component: ThreeColumnSidebar,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "app-dark",
      values: [
        { name: "app-dark", value: "#0f172a" },
        { name: "app-light", value: "#ffffff" },
      ],
    },
    docs: {
      description: {
        component: `
**ThreeColumnSidebar** is a responsive, position-aware sidebar built on
\`SidebarProvider\` / \`useSidebar\`. Supports four anchor positions
(\`left\`, \`right\`, \`bottomLeft\`, \`bottomRight\`).
        `,
      },
    },
  },
  argTypes: {
    position: {
      control: "select",
      options: ["left", "right", "bottomLeft", "bottomRight"],
    },
    sidebarLayoutMode: {
      control: "select",
      options: ["OVERLAY_ONLY", "BOTTOM_DOCKED", "OVERLAY_WITH_PANE"],
    },
    brandName: {
      control: "text",
    },
    direction: {
      control: "select",
      options: ["horizontal", "vertical"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof ThreeColumnSidebar>;

export const Default: Story = {
  name: "Default",
  args: { links: defaultLinks, brandName: "Ignix", position: "left", sidebarLayoutMode: "OVERLAY_ONLY" },
  decorators: [
    withLeftShell,
    (Story) => <SidebarProvider initialState={{ left: true }}><Story /></SidebarProvider>,
  ],
};

export const CollapsedByDefault: Story = {
  name: "Collapsed",
  args: { links: defaultLinks, brandName: "Ignix", position: "left", sidebarLayoutMode: "OVERLAY_ONLY" },
  decorators: [
    withLeftShell,
    (Story) => <SidebarProvider initialState={{ left: false }}><Story /></SidebarProvider>,
  ],
};

export const RightPosition: Story = {
  name: "Right side, open",
  args: { links: defaultLinks, brandName: "Ignix", position: "right", sidebarLayoutMode: "OVERLAY_ONLY" },
  decorators: [
    withRightShell,
    (Story) => <SidebarProvider initialState={{ right: true }}><Story /></SidebarProvider>,
  ],
};

export const BottomLeftDocked: Story = {
  name: "Bottom-left",
  args: {
    links: defaultLinks, brandName: "Ignix",
    position: "bottomLeft", sidebarLayoutMode: "BOTTOM_DOCKED", direction: "horizontal",
  },
  decorators: [
    withBottomShell,
    (Story) => <SidebarProvider initialState={{ bottomLeft: true }}><Story /></SidebarProvider>,
  ],
};

export const BottomRightDocked: Story = {
  name: "Bottom-right",
  args: {
    links: defaultLinks, brandName: "Ignix",
    position: "bottomRight", sidebarLayoutMode: "BOTTOM_DOCKED", direction: "horizontal",
  },
  decorators: [
    withBottomShell,
    (Story) => <SidebarProvider initialState={{ bottomRight: true }}><Story /></SidebarProvider>,
  ],
};

export const OverlayWithPane: Story = {
  name: "Left",
  args: { links: defaultLinks, brandName: "Ignix", position: "left", sidebarLayoutMode: "OVERLAY_WITH_PANE" },
  decorators: [
    withLeftShell,
    (Story) => <SidebarProvider initialState={{ left: true }}><Story /></SidebarProvider>,
  ],
};

export const ManyLinks: Story = {
  name: "Many links",
  args: { links: extendedLinks, brandName: "Ignix", position: "left", sidebarLayoutMode: "OVERLAY_ONLY" },
  decorators: [
    withLeftShell,
    (Story) => <SidebarProvider initialState={{ left: true }}><Story /></SidebarProvider>,
  ],
};

export const DualSidebars: Story = {
  name: "Dual sidebars",
  render: () => {
    injectStoryStyles();
    return (
      <SidebarProvider initialState={{ left: true, right: true }}>
        <motion.div
          className="dark relative flex overflow-hidden rounded-2xl w-full bg-background border border-border"
          style={{
            height: 600,
            boxShadow: "0 24px 56px rgba(0,0,0,0.55)",
          }}
          variants={shellVariants}
          initial="hidden"
          animate="visible"
        >
          <div
            className="absolute inset-x-0 top-0 h-px z-20"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(168,85,247,0.5) 40%, rgba(236,72,153,0.5) 60%, transparent)",
            }}
          />

          <div className="sb-side-l flex h-full">
            <ThreeColumnSidebar
              links={defaultLinks.slice(0, 4)}
              brandName="Left"
              position="left"
              sidebarLayoutMode="OVERLAY_ONLY"
            />
          </div>

          <AnimatedContentPanel subtitle="One SidebarProvider manages both sidebars independently." />

          <div className="sb-side-r flex h-full">
            <ThreeColumnSidebar
              links={defaultLinks.slice(3)}
              brandName="Right"
              position="right"
              sidebarLayoutMode="OVERLAY_ONLY"
            />
          </div>
        </motion.div>
      </SidebarProvider>
    );
  },
};