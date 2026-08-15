import type { Meta, StoryObj } from "@storybook/react";
import { ThumbsUp, ThumbsDown, RotateCcw } from "lucide-react";
import { AIMessageBubble } from "./index";

const meta: Meta<typeof AIMessageBubble> = {
  title: "Components/AI/AIMessageBubble",
  component: AIMessageBubble,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
The **AIMessageBubble** component styles and animates individual messages in a chat interface. It supports alignment and color differentiation by role (User vs Assistant vs System), custom avatars, copy-to-clipboard actions, and glassmorphic layouts.
        `,
      },
    },
  },
  argTypes: {
    role: {
      control: "select",
      options: ["user", "assistant", "system"],
      description: "Sender's role, affecting alignment and bubble layout",
    },
    variant: {
      control: "select",
      options: ["default", "minimal", "glass"],
      description: "Bubble theme style",
    },
    shape: {
      control: "select",
      options: ["bubble", "card", "pill", "flat"],
      description: "Controls the visual shape of the message bubble",
    },
    content: {
      control: "text",
      description: "Message content (string or ReactNode)",
    },
    senderName: {
      control: "text",
    },
    timestamp: {
      control: "text",
    },
    showCopy: {
      control: "boolean",
    },
    animateEntry: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof AIMessageBubble>;

export const Default: Story = {
  args: {
    role: "assistant",
    variant: "default",
    content: "Hello! I am your AI assistant. How can I help you today?",
    senderName: "Assistant",
    timestamp: "10:14 AM",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=assistant",
    showCopy: true,
  },
};

export const UserMessage: Story = {
  args: {
    role: "user",
    variant: "default",
    content: "Can you explain quantum computing in simple terms?",
    senderName: "You",
    timestamp: "10:15 AM",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=user",
    showCopy: true,
  },
};

export const SystemMessage: Story = {
  args: {
    role: "system",
    variant: "default",
    content: "Conversation history cleared. Context reset to default settings.",
  },
};

export const GlassVariant: Story = {
  decorators: [
    (Story) => (
      <div
        className="p-8 rounded-3xl bg-gradient-to-br from-black via-red-950 to-neutral-900"
      >
        <Story />
      </div>
    )
  ],
  args: {
    role: "assistant",
    variant: "glass",
    content: "This is a glassmorphic message bubble, perfect for layered layout setups or gradients.",
    senderName: "AI Companion",
    timestamp: "Just now",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=companion",
    showCopy: true,
  },
};

export const MinimalVariant: Story = {
  args: {
    role: "assistant",
    variant: "minimal",
    content: "This is a minimal message bubble layout. It does not render a border or a filled background, allowing it to sit cleanly directly in standard document flows.",
    senderName: "Claude Code",
    timestamp: "11:20 AM",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=claude",
    showCopy: true,
  },
};

export const WithCustomActions: Story = {
  args: {
    role: "assistant",
    variant: "default",
    content: "Here is the code structure we discussed. Let me know if you would like me to regenerate it or make any edits.",
    senderName: "Coder Bot",
    timestamp: "11:22 AM",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=coder",
    showCopy: true,
    actions: (
      <>
        <button
          className="p-1 rounded text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all cursor-pointer"
          title="Regenerate"
        >
          <RotateCcw size={14} />
        </button>
        <button
          className="p-1 rounded text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all cursor-pointer"
          title="Good response"
        >
          <ThumbsUp size={14} />
        </button>
        <button
          className="p-1 rounded text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all cursor-pointer"
          title="Bad response"
        >
          <ThumbsDown size={14} />
        </button>
      </>
    ),
  },
};
