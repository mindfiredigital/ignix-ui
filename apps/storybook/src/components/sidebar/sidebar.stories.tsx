import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  HomeIcon,
  GearIcon,
  PersonIcon,
  EnvelopeClosedIcon,
  QuestionMarkCircledIcon,
  BarChartIcon,
  BellIcon,
  FileIcon,
  StarIcon,
  PinRightIcon,
} from "@radix-ui/react-icons";
 
import { Sidebar, SidebarProvider, useSidebar } from "./index";
 
// Shared link sets
const defaultLinks = [
  { label: "Home", href: "#", icon: HomeIcon },
  { label: "Profile", href: "#", icon: PersonIcon },
  { label: "Settings", href: "#", icon: GearIcon },
  { label: "Help", href: "#", icon: QuestionMarkCircledIcon },
];
 
const extendedLinks = [
  { label: "Dashboard", href: "#", icon: BarChartIcon },
  { label: "Profile", href: "#", icon: PersonIcon },
  { label: "Notifications", href: "#", icon: BellIcon },
  { label: "Files", href: "#", icon: FileIcon },
  { label: "Favourites", href: "#", icon: StarIcon },
  { label: "Mail", href: "#", icon: EnvelopeClosedIcon },
  { label: "Settings", href: "#", icon: GearIcon },
  { label: "Logout", href: "#", icon: PinRightIcon },
];
 
// Decorator
const withSidebarProvider =
  (initialOpen = true, backgroundClass = "bg-slate-50") =>
  (Story: React.ComponentType) =>
    (
      <div
        className={`relative w-full h-[420px] overflow-hidden border border-gray-200 rounded-lg ${backgroundClass}`}
      >
        <SidebarProvider initialOpen={initialOpen}>
          <Story />
        </SidebarProvider>
      </div>
    );
 
// Meta
const meta: Meta<typeof Sidebar> = {
  title: "Navigation/Sidebar",
  component: Sidebar,
  tags: ["autodocs"],
  decorators: [withSidebarProvider()],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A flexible, animated sidebar component built with Framer Motion. " +
          "Supports multiple positions, visual variants, and a context-driven " +
          "open/closed state managed by `SidebarProvider`. " +
          "Use `useSidebar()` anywhere inside the provider to read `isOpen` " +
          "and call `toggle()`, `onOpen()`, or `onClose()`.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "dark", "light", "glass", "gradient"],
      description: "Visual theme of the sidebar.",
    },
    position: {
      control: "select",
      options: ["left", "right", "bottomLeft", "bottomRight"],
      description: "Which corner/edge the sidebar is anchored to.",
    },
    direction: {
      control: "select",
      options: ["vertical", "horizontal"],
      description: "Layout direction of the navigation links.",
    },
    brandName: {
      control: "text",
      description: "Text displayed in the sidebar header when expanded.",
    },
  },
};
 
export default meta;
type Story = StoryObj<typeof Sidebar>;
 
// Stories — visual variants
export const Default: Story = {
  args: {
    links: defaultLinks,
    brandName: "My App",
    position: "left",
    variant: "default",
  },
};
 
export const Dark: Story = {
  args: {
    links: defaultLinks,
    brandName: "Dark UI",
    variant: "dark",
  },
};
 
export const Light: Story = {
  args: {
    links: defaultLinks,
    brandName: "Light UI",
    variant: "light",
  },
};
 
export const Glass: Story = {
  decorators: [
    (Story) => (
      <div className="relative w-full h-[500px] overflow-hidden rounded-lg bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900">
        <SidebarProvider>
          <Story />
        </SidebarProvider>
      </div>
    ),
  ],
  parameters: { decorators: { disable: true } },
  args: {
    links: defaultLinks,
    brandName: "Glass UI",
    variant: "glass",
  },
};
 
export const Gradient: Story = {
  args: {
    links: defaultLinks,
    brandName: "Gradient UI",
    variant: "gradient",
  },
};
 
// Stories — position variants
export const PositionRight: Story = {
  name: "Position / Right",
  args: {
    links: defaultLinks,
    brandName: "Right Bar",
    position: "right",
    variant: "light",
  },
};
 
export const PositionBottomLeft: Story = {
  name: "Position / Bottom Left",
  args: {
    links: defaultLinks,
    brandName: "BL App",
    position: "bottomLeft",
    variant: "dark",
  },
};
 
export const PositionBottomRight: Story = {
  name: "Position / Bottom Right",
  args: {
    links: defaultLinks,
    brandName: "BR App",
    position: "bottomRight",
    variant: "dark",
  },
};
 
// Stories — direction
export const HorizontalDirection: Story = {
  name: "Direction / Horizontal",
  args: {
    links: defaultLinks,
    brandName: "H-Nav",
    direction: "horizontal",
    position: "bottomLeft",
    variant: "dark",
  },
};
 
// Stories — open/close state
export const InitiallyCollapsed: Story = {
  decorators: [withSidebarProvider(false)],
  parameters: { decorators: { disable: true } },
  args: {
    links: defaultLinks,
    brandName: "My App",
    variant: "light",
  },
};
 
// Stories — content
export const ManyLinks: Story = {
  args: {
    links: extendedLinks,
    brandName: "Full Nav",
    variant: "dark",
  },
};
 
// Stories — external context control
const ExternalToggleDemo = (args: React.ComponentProps<typeof Sidebar>) => {
  const { toggle, isOpen } = useSidebar();
 
  return (
    <>
      <Sidebar {...args} />
      <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
        <button
          onClick={toggle}
          className="px-4 py-2 bg-accent-foreground text-white border-none rounded-md cursor-pointer text-sm font-medium"
        >
          {isOpen ? "Collapse sidebar" : "Expand sidebar"}
        </button>
        <span className="text-xs text-primary">
          isOpen: <strong className="font-bold">{String(isOpen)}</strong>
        </span>
      </div>
    </>
  );
};
 
export const ExternalToggle: Story = {
  name: "External Toggle Control",
  render: (args) => <ExternalToggleDemo {...args} />,
  args: {
    links: defaultLinks,
    brandName: "Controlled",
    variant: "light",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Call `useSidebar()` anywhere inside `<SidebarProvider>` to read " +
          "`isOpen` and imperatively call `toggle()`, `onOpen()`, or `onClose()` " +
          "from external UI elements such as a top nav hamburger button.",
      },
    },
  },
};
 
// Stories — responsive / mobile
export const MobileViewport: Story = {
  decorators: [
    (Story) => (
      <div className="relative w-[360px] h-[420px] overflow-hidden border border-gray-200 rounded-lg bg-slate-50 mx-auto">
        <SidebarProvider>
          <Story />
        </SidebarProvider>
      </div>
    ),
  ],
  parameters: {
    decorators: { disable: true },
    docs: {
      description: {
        story:
          "Below the 768 px `window.innerWidth` breakpoint the sidebar collapses " +
          "to `w-0` when closed, fully hiding it to preserve content area. " +
          "Use the **Viewport** toolbar in Storybook and set it to a mobile size " +
          "to see the true behaviour.",
      },
    },
  },
  args: {
    links: defaultLinks,
    brandName: "Mobile",
    variant: "light",
  },
};
 
// Playground
export const Playground: Story = {
  args: {
    links: defaultLinks,
    brandName: "Playground",
    position: "left",
    variant: "default",
    direction: "vertical",
  },
};