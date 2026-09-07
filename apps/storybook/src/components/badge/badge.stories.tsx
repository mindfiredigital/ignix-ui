import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge, type BadgeVariant } from "./index";
import { Mail, Star } from "lucide-react";

const VARIANTS: BadgeVariant[] = [
  "default",
  "secondary",
  "success",
  "warning",
  "destructive",
  "info",
  "purple",
  "outline",
  "notification",
];

const meta: Meta<typeof Badge> = {
  title: "Components/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
A versatile, theme-aware badge for status indicators, colored action pills, and notification counters.

### Features
- Color variants: default, secondary, success, warning, destructive, info, purple, outline, notification
- Size variants: sm, md, lg
- Optional leading icon and dismiss (\`onRemove\`) button
- \`anchor\` prop reproduces the classic floating notification-counter positioning
- Built-in animation variants (pulse, bounce, tinypop) via \`animate\`
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: VARIANTS,
      description: "Color/style of the badge",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size of the badge",
    },
    animate: {
      control: "select",
      options: ["none", "pulse", "bounce", "tinypop"],
      description: "Motion applied to the badge",
    },
    children: {
      control: "text",
      description: "Content displayed inside the badge",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    children: "Badge",
    variant: "default",
    size: "md",
  },
};

export const AllVariants: Story = {
  name: "All variants",
  render: () => (
    <div className="flex flex-wrap gap-3 items-center">
      {VARIANTS.map((variant) => (
        <Badge key={variant} variant={variant}>
          {variant}
        </Badge>
      ))}
    </div>
  ),
};

export const AllSizes: Story = {
  name: "All sizes",
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
      <Badge size="lg">Large</Badge>
    </div>
  ),
};

export const StatusPills: Story = {
  args: {
    children: "dxxx"
  },

  name: "Status pills (real-world use)",

  render: () => (
    <div className="flex flex-wrap gap-3 items-center">
      <Badge variant="success">Published</Badge>
      <Badge variant="secondary">Draft</Badge>
      <Badge variant="destructive">Archived</Badge>
      <Badge variant="info">CREATE</Badge>
      <Badge variant="warning">UPDATE</Badge>
      <Badge variant="destructive">DELETE</Badge>
      <Badge variant="purple">Admin</Badge>
      <Badge variant="outline">Disabled</Badge>
    </div>
  )
};

export const WithIcon: Story = {
  name: "With icon",
  render: () => (
    <div className="flex flex-wrap gap-3 items-center">
      <Badge variant="success" icon={<Star className="h-3 w-3" />}>
        Featured
      </Badge>
      <Badge variant="info" icon={<Mail className="h-3 w-3" />}>
        3 new messages
      </Badge>
    </div>
  ),
};

export const Dismissible: Story = {
  name: "Dismissible (onRemove)",
  render: () => {
    const [tags, setTags] = useState(["React", "TypeScript", "Tailwind"]);
    return (
      <div className="flex flex-wrap gap-2 items-center">
        {tags.length === 0 && <span className="text-sm text-muted-foreground">All tags removed</span>}
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary" onRemove={() => setTags((prev) => prev.filter((t) => t !== tag))}>
            {tag}
          </Badge>
        ))}
      </div>
    );
  },
};

export const NotificationCounter: Story = {
  name: "Notification counter (attached)",
  render: () => (
    <div className="flex items-center gap-8">
      <Badge variant="notification" anchor={<Mail className="h-10 w-10" />}>
        3
      </Badge>
      <Badge variant="notification" animate="bounce" anchor={<button className="rounded-lg bg-muted px-4 py-2 shadow">Inbox</button>}>
        New
      </Badge>
      <div className="flex items-center gap-1">
        <span className="text-lg font-medium">Alerts</span>
        <Badge variant="notification">99+</Badge>
      </div>
    </div>
  ),
};

export const AnimationVariants: Story = {
  name: "Animation variants",
  render: () => (
    <div className="flex gap-4 items-center">
      <Badge variant="notification" animate="pulse">
        5
      </Badge>
      <Badge variant="notification" animate="bounce">
        5
      </Badge>
      <Badge variant="notification" animate="tinypop">
        5
      </Badge>
      <Badge variant="notification" animate="none">
        5
      </Badge>
    </div>
  ),
};
