import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { AIChat } from "./index";
import { AIModelSelector } from "../ai-model-selector";
import { Bot, Code2, Lightbulb, Settings } from "lucide-react";

const meta: Meta<typeof AIChat> = {
  title: "Components/AI/AIChat",
  component: AIChat,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
The **AIChat** component is the top-level orchestrator container for your chat layout. It links message feeds, scroll handles, prompt starters, and input boxes into a cohesive design layout that supports custom visual variants and custom headers/sidebars.
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "dark", "glass", "minimal"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof AIChat>;

const mockSuggestedActions = [
  {
    label: "Code sync hook",
    description: "Write router-synchronized state React hook.",
    actionText: "Write a custom React hook that synchronizes search queries directly with query parameters in the URL.",
    icon: <Code2 size={16} />,
  },
  {
    label: "SaaS growth ideas",
    description: "Brainstorm creative marketing growth loops.",
    actionText: "Can you help me brainstorm creative B2B SaaS growth loops to acquire organic developers?",
    icon: <Lightbulb size={16} />,
  },
];

const StatefulChatPortal = ({ variant = "default" }: { variant?: any }) => {
  const [messages, setMessages] = useState<any[]>([
    {
      id: "init",
      role: "assistant",
      content: "Hello! I am your AI layout copilot. How can I help you design today?",
      senderName: "Assistant",
      showCopy: true,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [selectedModelId, setSelectedModelId] = useState("gpt-4o");

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      content: text,
      role: "user" as const,
      senderName: "User",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsThinking(true);

    setTimeout(() => {
      setIsThinking(false);
      const assistantMsg = {
        id: (Date.now() + 1).toString(),
        content: `I've received your query: "${text}". I can help you orchestrate this template card component structure using our custom variant guidelines! Let me know if you would like me to draft code samples.`,
        role: "assistant" as const,
        senderName: "Assistant",
        showCopy: true,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    }, 1500);
  };

  return (
    <div className="max-w-2xl w-full mx-auto">
      <AIChat
        messages={messages}
        isThinking={isThinking}
        inputValue={inputValue}
        onInputChange={setInputValue}
        onSend={handleSend}
        suggestedActions={mockSuggestedActions}
        variant={variant}
        headerSlot={
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-2">
              <Bot size={18} className="text-indigo-500" />
              <div className="text-left">
                <span className="font-bold text-xs block leading-tight">Copilot Session</span>
                <span className="text-[9px] text-neutral-400">Ready for instructions</span>
              </div>
            </div>
            <Settings size={16} className="cursor-pointer text-neutral-400 hover:text-neutral-600 dark:hover:text-white" />
          </div>
        }
        attachmentSlot={
          <div className="flex items-center gap-1.5 select-none">
            <button
              onClick={() => alert("File attachment explorer opened!")}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${variant === "glass"
                ? "border-transparent text-white/65 hover:bg-white/10 hover:text-white"
                : "border-transparent text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:text-neutral-500 hover:text-neutral-700"
                }`}
              aria-label="Attach files"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
              </svg>
            </button>

            <AIModelSelector
              selectedModelId={selectedModelId}
              onModelChange={(model) => setSelectedModelId(model.id)}
              size="sm"
              variant="minimal"
            />
          </div>
        }
        footerSlot="Copilot answers may contain errors. Please verify component configurations."
      />
    </div>
  );
};

export const InteractiveWorkspace: Story = {
  render: () => <StatefulChatPortal variant="default" />,
};

export const DarkWorkspace: Story = {
  render: () => <StatefulChatPortal variant="dark" />,
  decorators: [
    (Story) => (
      <div className="p-6 bg-neutral-950 rounded-3xl border border-neutral-900 flex justify-center">
        <Story />
      </div>
    ),
  ],
};

export const GlassWorkspace: Story = {
  render: () => <StatefulChatPortal variant="glass" />,
  decorators: [
    (Story) => (
      <div className="p-6 bg-gradient-to-br from-black via-red-950 to-neutral-900 rounded-3xl flex justify-center">
        <Story />
      </div>
    ),
  ],
};

export const MinimalWorkspace: Story = {
  render: () => <StatefulChatPortal variant="minimal" />,
};
