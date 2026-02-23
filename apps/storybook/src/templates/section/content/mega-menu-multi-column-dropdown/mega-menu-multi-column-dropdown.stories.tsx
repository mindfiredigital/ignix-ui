import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  MegaMenuMultiColumnDropdown,
  type MegaMenuColumn,
  type MegaMenuLinkItem,
} from ".";
import {
  LayoutDashboard,
  FileText,
  Settings,
  Users,
  HelpCircle,
  BookOpen,
  Code2,
  Zap,
  Shield,
  Globe,
} from "lucide-react";

/**
 * Storybook meta for the Mega Menu with Multi-Column Dropdown section.
 * Documents props, controls, and acceptance criteria (alignment, hover, keyboard, responsive).
 */
const meta: Meta<typeof MegaMenuMultiColumnDropdown> = {
  title: "Templates/Section/Content/Mega Menu Multi-Column Dropdown",
  component: MegaMenuMultiColumnDropdown,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Mega menu with multi-column dropdown: category headers, links per column, optional icons/images per link, and CTA button. Supports hover to open, keyboard (arrow keys + Escape), and responsive layout.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    triggerLabel: {
      control: "text",
      description: "Label for the nav item that opens the mega menu",
    },
    theme: {
      control: { type: "select" },
      options: ["light", "dark"],
      description: "Theme for dropdown background and text",
    },
    align: {
      control: { type: "select" },
      options: ["left", "center", "right"],
      description: "Alignment of the dropdown panel relative to the trigger",
    },
  },
  decorators: [
    (Story) => (
      <div className="flex min-h-[320px] w-full items-start justify-center p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof MegaMenuMultiColumnDropdown>;

/** Shared column data: Products column with icons */
const productsColumn: MegaMenuColumn = {
  header: "Products",
  links: [
    { label: "Dashboard", href: "#dashboard", icon: LayoutDashboard },
    { label: "Documents", href: "#documents", icon: FileText },
    { label: "Settings", href: "#settings", icon: Settings },
  ],
};

/** Shared column data: Resources column */
const resourcesColumn: MegaMenuColumn = {
  header: "Resources",
  links: [
    { label: "Help Center", href: "#help", icon: HelpCircle },
    { label: "Documentation", href: "#docs", icon: BookOpen },
    { label: "API Reference", href: "#api", icon: Code2 },
  ],
};

/** Shared column data: Company column */
const companyColumn: MegaMenuColumn = {
  header: "Company",
  links: [
    { label: "About Us", href: "#about", icon: Users },
    { label: "Careers", href: "#careers", icon: Zap },
    { label: "Security", href: "#security", icon: Shield },
    { label: "Contact", href: "#contact", icon: Globe },
  ],
};

/** Default story: multi-column dropdown with category headers and icons */
export const Default: Story = {
  args: {
    triggerLabel: "Menu",
    theme: "light",
    align: "left",
    columns: [productsColumn, resourcesColumn, companyColumn],
  },
};

/** With CTA button in the menu panel */
export const WithCtaButton: Story = {
  args: {
    triggerLabel: "Solutions",
    theme: "light",
    align: "left",
    columns: [productsColumn, resourcesColumn, companyColumn],
    cta: {
      label: "View all features",
      href: "#all-features",
      variant: "primary",
    },
  },
};

/** CTA with onClick callback (e.g. open modal or track event) */
export const WithCtaCallback: Story = {
  args: {
    triggerLabel: "Solutions",
    theme: "light",
    align: "left",
    columns: [productsColumn, resourcesColumn, companyColumn],
    cta: {
      label: "Get started",
      variant: "primary",
      onClick: () => alert("CTA clicked"),
    },
  },
};

/** Links with image URLs instead of icons */
export const WithImagesPerLink: Story = {
  args: {
    triggerLabel: "Explore",
    theme: "light",
    align: "left",
    columns: [
      {
        header: "Products",
        links: [
          {
            label: "Analytics",
            href: "#analytics",
            imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=64&h=64&fit=crop",
            imageAlt: "Analytics",
          },
          {
            label: "Reports",
            href: "#reports",
            imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=64&h=64&fit=crop",
            imageAlt: "Reports",
          },
        ],
      },
      {
        header: "Resources",
        links: [
          {
            label: "Blog",
            href: "#blog",
            imageUrl: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=64&h=64&fit=crop",
            imageAlt: "Blog",
          },
          {
            label: "Webinars",
            href: "#webinars",
            imageUrl: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=64&h=64&fit=crop",
            imageAlt: "Webinars",
          },
        ],
      },
    ],
    cta: { label: "View all", href: "#all", variant: "outline" },
  },
};

/** Dark theme dropdown */
export const DarkTheme: Story = {
  args: {
    triggerLabel: "Menu",
    theme: "dark",
    align: "left",
    columns: [productsColumn, resourcesColumn, companyColumn],
    cta: { label: "Get started", href: "#start", variant: "primary" },
  },
  decorators: [
    (Story) => (
      <div className="rounded-xl bg-gray-900 p-6">
        <Story />
      </div>
    ),
  ],
};

/** Dropdown aligned to the right of the trigger */
export const AlignRight: Story = {
  args: {
    triggerLabel: "Menu",
    theme: "light",
    align: "right",
    columns: [productsColumn, resourcesColumn, companyColumn],
    cta: { label: "View all", href: "#all", variant: "outline" },
  },
};

/** Dropdown centered under the trigger */
export const AlignCenter: Story = {
  args: {
    triggerLabel: "Menu",
    theme: "light",
    align: "center",
    columns: [productsColumn, resourcesColumn, companyColumn],
    cta: { label: "Learn more", href: "#learn", variant: "primary" },
  },
};

/** Callbacks: onLinkSelect, onOpen, onClose (e.g. for analytics) */
export const WithCallbacks: Story = {
  args: {
    triggerLabel: "Menu",
    theme: "light",
    align: "left",
    columns: [productsColumn, resourcesColumn, companyColumn],
    onLinkSelect: (item: MegaMenuLinkItem, column) => {
      console.log("Link selected:", item.label, "Column:", column.header);
    },
    onOpen: () => console.log("Menu opened"),
    onClose: () => console.log("Menu closed"),
    cta: {
      label: "Sign up",
      href: "#signup",
      variant: "primary",
    },
  },
};

/** Responsive: single column on small viewport, multi-column on larger */
export const ResponsiveLayout: Story = {
  args: {
    triggerLabel: "Menu",
    theme: "light",
    align: "left",
    columns: [productsColumn, resourcesColumn, companyColumn],
    cta: { label: "View all", href: "#all", variant: "outline" },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Dropdown uses a responsive grid: 1 column on small screens, 2 on sm, 3 on lg. Resize the viewport to see the layout change.",
      },
    },
  },
};

/** Nested children: demonstrates n-level nested options within a column */
export const NestedOptions: Story = {
  args: {
    triggerLabel: "Nested",
    theme: "light",
    align: "left",
    columns: [
      {
        header: "Products",
        links: [
          {
            label: "Analytics",
            href: "#analytics",
            icon: LayoutDashboard,
            children: [
              {
                label: "Dashboards",
                href: "#analytics-dashboards",
                children: [
                  {
                    label: "Team Dashboard",
                    href: "#analytics-dashboards-team",
                  },
                  {
                    label: "Executive Overview",
                    href: "#analytics-dashboards-exec",
                  },
                ],
              },
              {
                label: "Reports",
                href: "#analytics-reports",
                children: [
                  {
                    label: "Weekly Reports",
                    href: "#analytics-reports-weekly",
                  },
                  {
                    label: "Custom Reports",
                    href: "#analytics-reports-custom",
                  },
                ],
              },
            ],
          },
          {
            label: "Workflows",
            href: "#workflows",
            icon: Settings,
            children: [
              {
                label: "Automation",
                href: "#workflows-automation",
              },
              {
                label: "Approvals",
                href: "#workflows-approvals",
              },
            ],
          },
        ],
      },
      resourcesColumn,
      companyColumn,
    ],
    cta: {
      label: "View all features",
      href: "#all-features",
      variant: "primary",
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Shows nested options at multiple levels. Click a parent item (e.g. Analytics → Dashboards) to expand or collapse its children.",
      },
    },
  },
};

/** Full example: icons, images, CTA, and dark theme in a header bar */
export const InHeaderBar: Story = {
  render: () => (
    <header className="flex w-full max-w-4xl items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
      <div className="text-lg font-semibold text-gray-900">Acme Inc.</div>
      <nav className="flex items-center gap-2">
        <a
          href="#home"
          className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          Home
        </a>
        <MegaMenuMultiColumnDropdown
          triggerLabel="Products"
          theme="light"
          align="left"
          columns={[productsColumn, resourcesColumn, companyColumn]}
          cta={{ label: "Get started free", href: "#signup", variant: "primary" }}
        />
        <a
          href="#pricing"
          className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          Pricing
        </a>
      </nav>
    </header>
  ),
  parameters: {
    docs: {
      description: {
        story: "Mega menu used in a typical header with other nav links. Hover over Products to open the dropdown.",
      },
    },
  },
};
