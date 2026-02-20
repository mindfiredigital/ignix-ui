/**
 * @file tab-navigation.stories.tsx
 * @description Storybook stories for Tab Navigation template. Covers default usage,
 * optional icons, indicator variants, controlled mode, and keyboard navigation.
 */

import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { TabNavigation } from ".";
import { FileText, Settings, BarChart3, Palette, Bell } from "lucide-react";
import { Typography } from "../../../../components/typography";

const meta: Meta<typeof TabNavigation> = {
  title: "Templates/Section/Content/Tab Navigation",
  component: TabNavigation,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Horizontal tab list with active indicator, content switching, optional icons, and full keyboard support (Arrow Left/Right, Enter/Space, Home/End). Tabs switch content; the active indicator is clear; keyboard navigation is functional.",
      },
    },
  },
  argTypes: {
    defaultActiveId: {
      control: "text",
      description: "Initial active tab id (uncontrolled mode)",
    },
    activeId: {
      control: "text",
      description: "Controlled active tab id",
    },
    indicatorVariant: {
      control: "select",
      options: ["underline", "pill"],
      description: "Style of the active tab indicator",
      table: {
        defaultValue: { summary: "underline" },
      },
    },
    onChange: {
      action: "onChange",
      description: "Callback when the active tab changes",
    },
    activeTabClassName: {
      control: "text",
      description: "Class name for active tab (e.g. text-blue-600, bg-amber-100 text-amber-900)",
    },
    inactiveTabClassName: {
      control: "text",
      description: "Class name for inactive tabs (e.g. text-gray-500)",
    },
    activeIndicatorClassName: {
      control: "text",
      description: "Class name for underline indicator (e.g. bg-blue-600)",
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-2xl p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof TabNavigation>;

/** Base tabs used across stories (text-only). */
const baseTabs = [
  {
    id: "overview",
    label: "Overview",
    content: (
      <div className="space-y-2">
        <Typography variant="h3" weight="semibold">
          Overview
        </Typography>
        <Typography variant="body" className="text-muted-foreground">
          This is the overview content. Tabs switch content when you click or use
          the keyboard. Use Arrow Left/Right to move between tabs and Enter or
          Space to activate.
        </Typography>
      </div>
    ),
  },
  {
    id: "features",
    label: "Features",
    content: (
      <div className="space-y-2">
        <Typography variant="h3" weight="semibold">
          Features
        </Typography>
        <Typography variant="body" className="text-muted-foreground">
          Feature list and details appear here. The active tab indicator shows
          clearly which tab is selected.
        </Typography>
      </div>
    ),
  },
  {
    id: "pricing",
    label: "Pricing",
    content: (
      <div className="space-y-2">
        <Typography variant="h3" weight="semibold">
          Pricing
        </Typography>
        <Typography variant="body" className="text-muted-foreground">
          Pricing information and plans are displayed in this panel.
        </Typography>
      </div>
    ),
  },
];

/**
 * Default horizontal tab list with underline indicator.
 * Acceptance: Tabs switch content; active indicator is clear.
 */
export const Default: Story = {
  args: {
    tabs: baseTabs,
    indicatorVariant: "underline",
  },
};

/**
 * Same as Default but with pill-style active indicator (background highlight).
 */
export const PillIndicator: Story = {
  args: {
    tabs: baseTabs,
    indicatorVariant: "pill",
  },
};

/**
 * Tabs with optional icons. Icons are rendered before the label.
 */
export const WithIcons: Story = {
  args: {
    tabs: [
      {
        id: "documents",
        label: "Documents",
        icon: FileText,
        iconPosition: "left",
        content: (
          <div className="space-y-2">
            <Typography variant="h3" weight="semibold">
              Documents
            </Typography>
            <Typography variant="body" className="text-muted-foreground">
              Manage your documents and files here.
            </Typography>
          </div>
        ),
      },
      {
        id: "analytics",
        label: "Analytics",
        icon: BarChart3,
        iconPosition: "top",
        content: (
          <div className="space-y-2">
            <Typography variant="h3" weight="semibold">
              Analytics
            </Typography>
            <Typography variant="body" className="text-muted-foreground">
              View charts and reports.
            </Typography>
          </div>
        ),
      },
      {
        id: "settings",
        label: "Settings",
        icon: Settings,
        iconPosition: "right",
        content: (
          <div className="space-y-2">
            <Typography variant="h3" weight="semibold">
              Settings
            </Typography>
            <Typography variant="body" className="text-muted-foreground">
              Configure your preferences.
            </Typography>
          </div>
        ),
      },
      {
        id: "appearance",
        label: "Appearance",
        icon: Palette,
        iconPosition: "left",
        content: (
          <div className="space-y-2">
            <Typography variant="h3" weight="semibold">
              Appearance
            </Typography>
            <Typography variant="body" className="text-muted-foreground">
              Customize theme and layout.
            </Typography>
          </div>
        ),
      },
    ],
    indicatorVariant: "underline",
  },
};

/**
 * Demonstrates icon position variants and badge options (with/without counter, shapes).
 */
export const IconPositionAndBadges: Story = {
  args: {
    tabs: [
      {
        id: "left-icon-pill-badge",
        label: "Inbox",
        icon: FileText,
        iconPosition: "left",
        badge: { count: 8, shape: "pill" },
        content: (
          <div className="space-y-2">
            <Typography variant="h3" weight="semibold">
              Inbox
            </Typography>
            <Typography variant="body" className="text-muted-foreground">
              Left icon with pill badge showing a numeric counter.
            </Typography>
          </div>
        ),
      },
      {
        id: "right-icon-circle-badge",
        label: "Alerts",
        icon: Bell,
        iconPosition: "right",
        badge: { count: 3, shape: "circle" },
        content: (
          <div className="space-y-2">
            <Typography variant="h3" weight="semibold">
              Alerts
            </Typography>
            <Typography variant="body" className="text-muted-foreground">
              Right icon with circular badge counter.
            </Typography>
          </div>
        ),
      },
      {
        id: "top-icon-square-label-badge",
        label: "Theme",
        icon: Palette,
        iconPosition: "top",
        // badge: { label: "New", shape: "square" },
        content: (
          <div className="space-y-2">
            <Typography variant="h3" weight="semibold">
              Theme
            </Typography>
            <Typography variant="body" className="text-muted-foreground">
              Top icon with label-only square badge (no counter).
            </Typography>
          </div>
        ),
      },
      {
        id: "badge-without-counter-zero-hidden",
        label: "Empty",
        icon: BarChart3,
        iconPosition: "left",
        badge: { count: 0, shape: "pill" },
        content: (
          <div className="space-y-2">
            <Typography variant="h3" weight="semibold">
              Empty
            </Typography>
            <Typography variant="body" className="text-muted-foreground">
              Badge is hidden when count is 0 and showZero is not set.
            </Typography>
          </div>
        ),
      },
    ],
    indicatorVariant: "underline",
  },
};

/**
 * Keyboard navigation: Arrow Left/Right to move, Enter/Space to activate, Home/End for first/last tab.
 * Focus the tab list and use the keyboard to verify.
 */
export const KeyboardNavigation: Story = {
  args: {
    tabs: baseTabs,
    indicatorVariant: "underline",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Focus the tab list (click a tab or Tab into it), then use Arrow Right/Left to move, Enter or Space to activate. Home goes to first tab, End to last. Keyboard navigation is fully functional.",
      },
    },
  },
};

/**
 * Controlled mode: active tab is driven by parent state via activeId and onChange.
 */
export const Controlled: Story = {
  render: function ControlledStory() {
    const [activeId, setActiveId] = useState("features");
    return (
      <div className="space-y-4">
        <TabNavigation
          tabs={baseTabs}
          activeId={activeId}
          onChange={setActiveId}
          indicatorVariant="underline"
        />
        <p className="text-sm text-muted-foreground">
          Current tab (controlled): <strong>{activeId}</strong>
        </p>
      </div>
    );
  },
};

/**
 * Default active tab set to the second item via defaultActiveId.
 */
export const DefaultActiveTab: Story = {
  args: {
    tabs: baseTabs,
    defaultActiveId: "features",
    indicatorVariant: "underline",
  },
};

/**
 * Custom active and inactive colors via activeTabClassName, inactiveTabClassName, and activeIndicatorClassName.
 */
export const CustomActiveInactiveColors: Story = {
  args: {
    tabs: baseTabs,
    indicatorVariant: "underline",
    activeTabClassName: "text-emerald-600",
    inactiveTabClassName: "text-slate-500 hover:text-slate-700",
    activeIndicatorClassName: "bg-emerald-600",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Use activeTabClassName, inactiveTabClassName, and activeIndicatorClassName to supply your own colors (Tailwind or custom classes).",
      },
    },
  },
};

/**
 * Pill variant with custom active/inactive background and text colors.
 */
export const CustomColorsPillVariant: Story = {
  args: {
    tabs: baseTabs,
    indicatorVariant: "pill",
    activeTabClassName: "bg-violet-500 text-violet-900 shadow",
    inactiveTabClassName: "text-slate-900 hover:bg-slate-500 hover:text-slate-700",
  },
};
