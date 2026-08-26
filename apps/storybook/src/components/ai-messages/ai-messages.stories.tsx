import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { AIMessages } from "./index";
import { Button } from "../button";
import { Plus, RotateCcw } from "lucide-react";

const meta: Meta<typeof AIMessages> = {
  title: "Components/AI/AIMessages",
  component: AIMessages,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
The **AIMessages** component is a scrollable feed container that displays a chronological list of conversation messages (\`AIMessageBubble\` elements). It includes smart auto-scrolling when new messages mount, a floating overlay to quickly scroll to the bottom when the user has scrolled up, thinking state indicator slots, and custom empty states.
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "dark", "glass", "minimal"],
    },
    isThinking: {
      control: "boolean",
    },
    autoScroll: {
      control: "boolean",
    },
    showJumpToBottom: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof AIMessages>;

const initialMessages = [
  {
    id: 1,
    role: "system" as const,
    content: "Security protocols active. End-to-end encryption verified.",
  },
  {
    id: 2,
    role: "user" as const,
    content: "Explain React's useEffect hook in a simplified way.",
    senderName: "You",
    timestamp: "11:30 AM",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=alice",
  },
  {
    id: 3,
    role: "assistant" as const,
    content: "The `useEffect` hook lets you perform side effects in functional components. Think of it as a combined alternative to lifecycle events like `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount`.\n\nIt runs after the component renders and can clean up after itself when the component unmounts.",
    senderName: "AI Expert",
    timestamp: "11:31 AM",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=bob",
    showCopy: true,
  },
];

export const EmptyState: Story = {
  args: {
    messages: [],
    variant: "default",
  },
};

export const PrePopulatedFeed: Story = {
  decorators: [
    (Story) => (
      <div className="h-[450px] border border-neutral-250 dark:border-neutral-800 rounded-2xl flex flex-col overflow-hidden max-w-2xl bg-white dark:bg-neutral-900 shadow-sm">
        <Story />
      </div>
    ),
  ],
  args: {
    messages: initialMessages,
    variant: "default",
    isThinking: false,
  },
};

export const GlassVariant: Story = {
  decorators: [
    (Story) => (
      <div
        className="h-[450px] p-4 rounded-3xl max-w-2xl overflow-hidden flex flex-col shadow-lg border border-white/20 bg-gradient-to-br from-black via-red-950 to-neutral-900"
      >
        <Story />
      </div>
    ),
  ],
  args: {
    messages: initialMessages,
    variant: "glass",
    isThinking: true,
  },
};

const ScrollSimulator = () => {
  const [messages, setMessages] = useState<any[]>(initialMessages);
  const [isThinking, setIsThinking] = useState(false);

  const simulateIncomingMessage = () => {
    setIsThinking(true);

    setTimeout(() => {
      setIsThinking(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: "assistant" as const,
          content: `Here is chunk #${prev.length - 1} of simulated stream. It is designed to overflow the container height so you can test auto-scrolling and manual navigation!`,
          senderName: "Streamer Bot",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=streamer",
          showCopy: true,
        },
      ]);
    }, 1200);
  };

  const simulateUserPrompt = () => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        role: "user" as const,
        content: "Please send another chunk of data.",
        senderName: "You",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=alice",
      },
    ]);

    setTimeout(simulateIncomingMessage, 800);
  };

  const handleReset = () => {
    setMessages(initialMessages);
    setIsThinking(false);
  };

  return (
    <div className="flex flex-col space-y-4 max-w-2xl">
      <div className="flex gap-2">
        <Button onClick={simulateUserPrompt} className="flex items-center gap-1 cursor-pointer">
          <Plus size={14} /> Send User Prompt
        </Button>
        <Button onClick={handleReset} variant="outline" className="flex items-center gap-1 cursor-pointer">
          <RotateCcw size={14} /> Reset Feed
        </Button>
      </div>

      <div className="h-[400px] border border-neutral-250 dark:border-neutral-800 rounded-2xl flex flex-col overflow-hidden bg-neutral-50/20 dark:bg-neutral-900/40">
        <AIMessages
          messages={messages}
          isThinking={isThinking}
          variant="default"
        />
      </div>
    </div>
  );
};

export const InteractiveScrolling: Story = {
  render: () => <ScrollSimulator />,
};
