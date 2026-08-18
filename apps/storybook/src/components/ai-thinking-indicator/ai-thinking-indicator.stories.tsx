import type { Meta, StoryObj } from "@storybook/react";
import { AIThinkingIndicator } from "./index";

const meta: Meta<typeof AIThinkingIndicator> = {
  title: "Components/AI/AIThinkingIndicator",
  component: AIThinkingIndicator,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
The **AIThinkingIndicator** shows that an AI assistant is "thinking" or generating a response.

### Features
- Eight animation types: dots, pulse, wave, skeleton, sparkle (Gemini-style shimmer), bloom (Claude Code-style rotating asterisk), ring, and bars (the latter two reuse the Spinner component)
- Four surface variants: default, dark, glass, minimal
- Size variants: sm, md, lg
- Optional label and sound effect
        `,
      },
    },
  },
  argTypes: {
    type: {
      control: "select",
      options: ["dots", "pulse", "wave", "skeleton", "sparkle", "bloom", "ring", "bars"],
      description: "Animation style",
    },
    variant: {
      control: "select",
      options: ["default", "dark", "glass", "minimal"],
      description: "Surface style of the indicator",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size of the indicator",
    },
    label: {
      control: "text",
      description: "Text shown next to the animation",
    },
    className: {
      control: "text",
      description: "Custom styles",
    },
  },
};

export default meta;
type Story = StoryObj<typeof AIThinkingIndicator>;

export const Default: Story = {
  args: {
    type: "dots",
    variant: "default",
    label: "Thinking...",
  },
};

export const Types: Story = {
  render: () => (
    <div className="flex gap-4 items-center flex-wrap">
      <AIThinkingIndicator type="dots" />
      <AIThinkingIndicator type="pulse" />
      <AIThinkingIndicator type="wave" />
      <AIThinkingIndicator type="skeleton" />
      <AIThinkingIndicator type="sparkle" />
      <AIThinkingIndicator type="bloom" />
      <AIThinkingIndicator type="ring" />
      <AIThinkingIndicator type="bars" />
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="flex gap-4 items-center flex-wrap">
      <AIThinkingIndicator variant="default" label="Default" />
      <AIThinkingIndicator variant="dark" label="Dark" />
      <div className="bg-neutral-800 p-4 rounded-lg">
        <AIThinkingIndicator variant="glass" label="Glass" />
      </div>
      <AIThinkingIndicator variant="minimal" label="Minimal" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <AIThinkingIndicator size="sm" label="Small" />
      <AIThinkingIndicator size="md" label="Medium" />
      <AIThinkingIndicator size="lg" label="Large" />
    </div>
  ),
};
