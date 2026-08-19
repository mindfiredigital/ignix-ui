import type { Meta, StoryObj } from "@storybook/react";
import { AIStatusBadge } from "./index";

const meta: Meta<typeof AIStatusBadge> = {
  title: "Components/AI/AIStatusBadge",
  component: AIStatusBadge,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
The **AIStatusBadge** shows the current state of an AI assistant: idle, thinking, streaming, error, or ready.

### Features
- Five states, each with a distinct color and animated indicator
- Four surface variants: default, dark, glass, minimal
- Size variants: sm, md, lg
- Optional model name display
        `,
      },
    },
  },
  argTypes: {
    status: {
      control: "select",
      options: ["idle", "thinking", "streaming", "error", "ready"],
      description: "Current AI state",
    },
    variant: {
      control: "select",
      options: ["default", "dark", "glass", "minimal"],
      description: "Surface style of the badge",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size of the badge",
    },
    model: {
      control: "text",
      description: "Optional model name shown alongside the status",
    },
    label: {
      control: "text",
      description: "Overrides the default label derived from status",
    },
    className: {
      control: "text",
      description: "Custom styles",
    },
  },
};

export default meta;
type Story = StoryObj<typeof AIStatusBadge>;

export const Default: Story = {
  args: {
    status: "streaming",
    variant: "default",
    model: "gpt-4",
  },
};

export const Statuses: Story = {
  render: () => (
    <div className="flex gap-4 items-center flex-wrap">
      <AIStatusBadge status="idle" />
      <AIStatusBadge status="thinking" />
      <AIStatusBadge status="streaming" />
      <AIStatusBadge status="error" />
      <AIStatusBadge status="ready" />
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="flex gap-4 items-center flex-wrap">
      <AIStatusBadge status="streaming" variant="default" model="gpt-4" />
      <AIStatusBadge status="streaming" variant="dark" model="gpt-4" />
      <div className="bg-neutral-800 p-4 rounded-lg">
        <AIStatusBadge status="streaming" variant="glass" model="gpt-4" />
      </div>
      <AIStatusBadge status="streaming" variant="minimal" model="gpt-4" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <AIStatusBadge status="ready" size="sm" />
      <AIStatusBadge status="ready" size="md" />
      <AIStatusBadge status="ready" size="lg" />
    </div>

  ),
};
