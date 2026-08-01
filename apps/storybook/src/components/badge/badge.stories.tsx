import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge, type AttachedBadgeProps } from "./index";
import { Mail } from "lucide-react";

const meta: Meta<typeof Badge> = {
  title: "Components/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
The **Badge** component is a small status indicator used for notifications, counts, and labels.

### Features
- Inline and attached modes
- Multiple color types (primary, success, warning, error)
- Built-in animation variants (pulse, bounce, tinypop)
- Works with text, icons, buttons, and avatars
        `,
      },
    },
  },
  argTypes: {
    text: {
      control: "text",
      description: "Content displayed inside the badge",
      defaultValue: "5",
    },
    type: {
      control: "select",
      options: ["primary", "secondary", "success", "warning", "error"],
      description: "Color style of the badge",
    },
    variant: {
      control: "select",
      options: ["pulse", "bounce", "tinypop"],
      description: "Animation style",
    },
    mode: {
      control: "select",
      options: ["inline", "attached"],
      description: "Layout behavior of the badge",
    },
    className: {
      control: "text",
      description: "Custom styles",
    },
    children: {
      table: { disable: true },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;


// Inline Badge (default usage)
export const Inline: Story = {
  args: {
    text: "99+",
    type: "error",
    mode: "inline",
  },
  render: (args) => (
    <div className="flex items-center gap-2">
      <span className="text-lg font-medium">Notifications</span>
      <Badge {...args} />
    </div>
  ),
};


// Attached to Icon
export const AttachedIcon: Story = {
  args: {
    text: "3",
    type: "primary",
    variant: "pulse",
    mode: "attached",
  },
  render: (args) => (
    <Badge {...args as AttachedBadgeProps}>
      <Mail className="h-10 w-10" />
    </Badge>
  ),
};


// Attached to Button
export const AttachedButton: Story = {
  args: {
    text: "New",
    type: "error",
    variant: "tinypop",
    mode: "attached",
  },
  render: (args) => (
    <Badge {...args as AttachedBadgeProps}>
      <button className="px-4 py-2 bg-muted rounded-lg shadow">
        Components
      </button>
    </Badge>
  ),
};


// Variants Showcase
export const Variants: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <Badge text="5" variant="pulse" type="primary" />
      <Badge text="5" variant="bounce" type="success" />
      <Badge text="5" variant="tinypop" type="warning" />
    </div>
  ),
};


// Types Showcase
export const Types: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <Badge text="1" type="primary" />
      <Badge text="2" type="secondary" />
      <Badge text="3" type="success" />
      <Badge text="4" type="warning" />
      <Badge text="5" type="error" />
    </div>
  ),
};
