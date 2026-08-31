import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { AIResponseActions } from "./index";

const meta: Meta<typeof AIResponseActions> = {
  title: "Components/AI/AIResponseActions",
  component: AIResponseActions,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
The **AIResponseActions** toolbar provides a premium, micro-animated set of quick actions for AI responses. It includes native hooks for **copying text**, **thumbs up/down feedback**, **response regeneration**, **sharing**, and **bookmarking**, each wrapped in design system tooltips.
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "dark", "glass", "minimal"],
    },
    size: {
      control: "select",
      options: ["sm", "md"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof AIResponseActions>;

export const Default: Story = {
  args: {
    content: "This is a sample AI assistant response with useful insights.",
    onFeedback: (type) => console.log("Feedback: ", type),
    onRegenerate: () => console.log("Regenerate response clicked"),
  },
};

export const FullActions: Story = {
  args: {
    content: "Check out this comprehensive response. Share it or bookmark it for later reference!",
    onFeedback: (type) => console.log("Feedback: ", type),
    onRegenerate: () => console.log("Regenerate response clicked"),
    onBookmark: () => console.log("Bookmark clicked"),
    onShare: () => console.log("Share clicked"),
  },
};

export const DarkTheme: Story = {
  args: {
    content: "Llama 3 response rendered in custom dark metrics overlay.",
    variant: "dark",
    onFeedback: (type) => console.log("Feedback: ", type),
    onRegenerate: () => console.log("Regenerate response clicked"),
    onBookmark: () => console.log("Bookmark clicked"),
    onShare: () => console.log("Share clicked"),
  },
  decorators: [
    (Story) => (
      <div className="p-6 rounded-2xl bg-neutral-950 max-w-md">
        <Story />
      </div>
    ),
  ],
};

export const Glassmorphic: Story = {
  args: {
    content: "Ultra-premium glassmorphism actions on high-contrast gradients.",
    variant: "glass",
    onFeedback: (type) => console.log("Feedback: ", type),
    onRegenerate: () => console.log("Regenerate response clicked"),
    onBookmark: () => console.log("Bookmark clicked"),
    onShare: () => console.log("Share clicked"),
  },
  decorators: [
    (Story) => (
      <div className="p-8 rounded-2xl bg-gradient-to-br from-black via-red-950 to-neutral-900 max-w-md">
        <Story />
      </div>
    ),
  ],
};

export const Minimal: Story = {
  args: {
    content: "A minimal, borderless, overlay button group for clean messaging views.",
    variant: "minimal",
    onFeedback: (type) => console.log("Feedback: ", type),
    onRegenerate: () => console.log("Regenerate response clicked"),
    onBookmark: () => console.log("Bookmark clicked"),
  },
};

const InteractiveDemoComponent = () => {
  const [feedbackState, setFeedbackState] = useState<"up" | "down" | null>(null);
  const [bookmarked, setBookmarked] = useState(false);
  const responseText = "Here is your completed code snippet! Let me know if you need help styling this card further.";

  return (
    <div className="p-5 border dark:border-neutral-800 rounded-2xl max-w-md bg-white dark:bg-neutral-900 shadow-sm space-y-4">
      <div className="text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed whitespace-pre-wrap">
        {responseText}
      </div>
      <div className="border-t dark:border-neutral-800 pt-3 flex justify-between items-center">
        <span className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider">
          AI Assistant
        </span>
        <AIResponseActions
          content={responseText}
          feedback={feedbackState}
          onFeedback={(type) => setFeedbackState((prev) => (prev === type ? null : type))}
          isBookmarked={bookmarked}
          onBookmark={() => setBookmarked((prev) => !prev)}
          onRegenerate={() => alert("Regenerating response...")}
          onShare={() => alert("Sharing link copied!")}
        />
      </div>
    </div>
  );
};

export const InteractiveMessageBubble: Story = {
  render: () => <InteractiveDemoComponent />,
};
