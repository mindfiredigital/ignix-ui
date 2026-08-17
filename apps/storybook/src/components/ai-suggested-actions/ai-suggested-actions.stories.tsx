import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { AISuggestedActions, type SuggestedAction } from "./index";
import { Sparkles, MessageSquare, Lightbulb, Code2 } from "lucide-react";

const meta: Meta<typeof AISuggestedActions> = {
  title: "Components/AI/AISuggestedActions",
  component: AISuggestedActions,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
The **AISuggestedActions** component provides a quick, interactive layout for prompt starters, suggestions, and templates. It supports inline chip buttons and modular card grids, featuring bouncier, stagger-delayed spring animations.
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "dark", "glass", "minimal"],
    },
    layout: {
      control: "select",
      options: ["flex", "grid"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof AISuggestedActions>;

const mockActions: SuggestedAction[] = [
  {
    label: "Analyze codebase performance",
    description: "Find bottlenecks, calculate complexity, and optimize modules.",
    actionText: "Analyze this codebase for performance bottlenecks and recommend optimizations.",
    icon: <Code2 size={16} />,
  },
  {
    label: "Brainstorm SaaS marketing ideas",
    description: "Formulate creative growth loops, SEO content structures, and ad campaigns.",
    actionText: "Help me brainstorm SaaS marketing growth strategies for a B2B product.",
    icon: <Lightbulb size={16} />,
  },
  {
    label: "Refactor legacy React components",
    description: "Migrate class structures to modern functional components with custom hooks.",
    actionText: "Can you help me migrate this legacy class component to hooks?",
    icon: <Sparkles size={16} />,
  },
  {
    label: "Draft client onboarding template",
    description: "Write email drafts, documentation welcome cards, and set up checklists.",
    actionText: "Draft a friendly client onboarding email template for new software users.",
    icon: <MessageSquare size={16} />,
  },
];

export const FlexChips: Story = {
  args: {
    actions: mockActions,
    layout: "flex",
    variant: "default",
    onActionClick: (text) => alert(`Suggested Action clicked:\n"${text}"`),
  },
};

export const GridCards: Story = {
  args: {
    actions: mockActions,
    layout: "grid",
    variant: "default",
    onActionClick: (text) => alert(`Suggested Action clicked:\n"${text}"`),
  },
};

export const DarkTheme: Story = {
  args: {
    actions: mockActions,
    layout: "grid",
    variant: "dark",
    onActionClick: (text) => alert(`Suggested Action clicked:\n"${text}"`),
  },
  decorators: [
    (Story) => (
      <div className="p-8 rounded-3xl bg-neutral-950 max-w-2xl border border-neutral-900">
        <Story />
      </div>
    ),
  ],
};

export const Glassmorphic: Story = {
  args: {
    actions: mockActions,
    layout: "grid",
    variant: "glass",
    onActionClick: (text) => alert(`Suggested Action clicked:\n"${text}"`),
  },
  decorators: [
    (Story) => (
      <div className="p-8 rounded-3xl bg-gradient-to-br from-black via-red-950 to-neutral-900 max-w-2xl">
        <Story />
      </div>
    ),
  ],
};

export const Minimal: Story = {
  args: {
    actions: mockActions,
    layout: "flex",
    variant: "minimal",
    onActionClick: (text) => alert(`Suggested Action clicked:\n"${text}"`),
  },
};

const CallbackSimulation = () => {
  const [inputValue, setInputValue] = useState("");

  return (
    <div className="p-6 border dark:border-neutral-800 rounded-3xl max-w-xl bg-white dark:bg-neutral-900 shadow-md space-y-4">
      <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
        Suggested Prompts
      </h4>
      <AISuggestedActions
        actions={mockActions}
        layout="grid"
        variant="default"
        onActionClick={(text) => setInputValue(text)}
      />
      {inputValue && (
        <div className="p-3 text-xs rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800">
          Last Clicked Action: <span className="font-bold text-indigo-500 dark:text-indigo-400">"{inputValue}"</span>
        </div>
      )}
    </div>
  );
};

export const Interactive: Story = {
  render: () => <CallbackSimulation />,
};
