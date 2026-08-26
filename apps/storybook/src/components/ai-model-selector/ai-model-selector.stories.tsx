import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { AIModelSelector, type AIModel } from "./index";

const meta: Meta<typeof AIModelSelector> = {
  title: "Components/AI/AIModelSelector",
  component: AIModelSelector,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
The **AIModelSelector** is a provider-grouped model selection dropdown. It provides complete keyboard accessibility, maps description subtexts for each selection option, and adapts dynamically using default rounded-rect, minimal, glassmorphic, and compact pill trigger shapes.
        `,
      },
    },
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    variant: {
      control: "select",
      options: ["default", "dark", "glass", "minimal"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof AIModelSelector>;

export const Default: Story = {
  args: {
    selectedModelId: "gpt-4o",
    size: "md",
    variant: "default",
  },
};

export const PillCompact: Story = {
  args: {
    selectedModelId: "claude-3.5-sonnet",
    size: "sm",
    variant: "default",
  },
};

export const DarkTheme: Story = {
  args: {
    selectedModelId: "gemini-1.5-pro",
    size: "md",
    variant: "dark",
  },
};

export const Glassmorphic: Story = {
  args: {
    selectedModelId: "llama-3-70b",
    size: "md",
    variant: "glass",
  },
  decorators: [
    (Story) => (
      <div className="p-8 rounded-xl bg-gradient-to-br from-black via-red-950 to-neutral-900 max-w-sm">
        <Story />
      </div>
    ),
  ],
};

export const MinimalLayout: Story = {
  args: {
    selectedModelId: "gpt-4o",
    size: "md",
    variant: "minimal",
  },
};

const SelectorStateSimulator = () => {
  const [selectedId, setSelectedId] = useState("gpt-4o");

  return (
    <div className="flex flex-col space-y-4 max-w-sm p-6 border rounded-2xl bg-neutral-50/30 dark:bg-neutral-900/30 min-h-[220px]">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-neutral-400">Selected Model ID</label>
        <code className="text-xs bg-white dark:bg-neutral-950 px-2 py-1 border dark:border-neutral-800 rounded font-mono text-neutral-700 dark:text-neutral-300">
          {selectedId}
        </code>
      </div>
      <div>
        <AIModelSelector
          selectedModelId={selectedId}
          onModelChange={(model: AIModel) => setSelectedId(model.id)}
        />
      </div>
    </div>
  );
};

export const InteractiveState: Story = {
  render: () => <SelectorStateSimulator />,
};
