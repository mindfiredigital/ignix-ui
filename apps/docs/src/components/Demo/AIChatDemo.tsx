import React, { useState } from "react";
import { AIChat } from "../UI/ai-chat";
import { AIModelSelector } from "../UI/ai-model-selector";
import VariantSelector from "./VariantSelector";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import CodeBlock from "@theme/CodeBlock";
import { Bot, Code2, Lightbulb, Settings } from "lucide-react";
import { AIConversationHistory } from "../UI/ai-conversation-history";

const AIChatDemo: React.FC = () => {
  const [variant, setVariant] = useState<"default" | "dark" | "glass" | "minimal">("default");
  const [messages, setMessages] = useState<any[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [selectedModelId, setSelectedModelId] = useState("gpt-4o");
  const [searchQuery, setSearchQuery] = useState("");

  const sessions = [
    {
      id: "1",
      title: "React Router Hook",
      timestamp: new Date(),
    },
    {
      id: "2",
      title: "SaaS Growth Ideas",
      timestamp: new Date(Date.now() - 86400000),
    },
  ];

  const starters = [
    {
      label: "Code sync hook",
      description: "Write router-synchronized state React hook.",
      actionText: "Write a custom React hook that synchronizes search queries directly with query string parameters in the URL.",
      icon: <Code2 size={16} />,
    },
    {
      label: "SaaS growth ideas",
      description: "Brainstorm creative marketing growth loops.",
      actionText: "Can you help me brainstorm creative B2B SaaS growth loops to acquire organic developers?",
      icon: <Lightbulb size={16} />,
    },
  ];

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    // Append user message
    const userMsg = {
      id: Date.now().toString(),
      content: text,
      role: "user" as const,
      senderName: "User",
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    setIsThinking(true);

    // Simulate assistant reply
    setTimeout(() => {
      setIsThinking(false);
      let replyContent = "";

      if (text.toLowerCase().includes("hook")) {
        replyContent = `Here is a custom React hook for router state synchronization:

\`\`\`typescript
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export function useQueryState(key: string, defaultValue: string) {
  const router = useRouter();
  const [value, setValue] = useState(() => {
    return (router.query[key] as string) || defaultValue;
  });

  useEffect(() => {
    if (value !== defaultValue) {
      router.push({ query: { ...router.query, [key]: value } });
    }
  }, [value]);

  return [value, setValue] as const;
}
\`\`\``;
      } else if (text.toLowerCase().includes("growth") || text.toLowerCase().includes("saas")) {
        replyContent = `Here are 3 creative developer-focused SaaS growth loops:
1. **Interactive Sandbox Embedding:** Let users embed their styled component sandboxes in their blogs with a "Built via Ignix UI" badge.
2. **Open-Source Tooling Utilities:** Release lightweight terminal tooling packages that solve diagnostic issues, linking back to your registry.
3. **Template Contributor Badging:** Highlight developer templates on your community page, giving them custom contributor tags.`;
      } else {
        replyContent = `That's a great question! Let's explore how we can build a modular solution using Ignix UI components. What specific tech stack are you targeting?`;
      }

      const assistantMsg = {
        id: (Date.now() + 1).toString(),
        content: replyContent,
        role: "assistant" as const,
        senderName: "Assistant",
        showCopy: true,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    }, 1800);
  };

  const handleReset = () => {
    setMessages([]);
    setInputVal("");
    setIsThinking(false);
  };

  const codeString = `
import { AIChat, AIModelSelector } from '@mindfiredigital/ignix-ui';
import { useState } from 'react';

function SandboxChat() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [modelId, setModelId] = useState("gpt-4o");

  const handleSend = (text) => {
    setMessages(prev => [...prev, { id: Date.now().toString(), role: "user", content: text }]);
    // Trigger assistant reply logic...
  };

  return (
    <AIChat
      messages={messages}
      inputValue={inputValue}
      onInputChange={setInputValue}
      onSend={handleSend}
      variant="${variant}"
      headerSlot={
        <div className="flex justify-between items-center w-full">
          <span>Copilot Workspace</span>
          <AIModelSelector
            selectedModelId={modelId}
            onModelChange={(m) => setModelId(m.id)}
            size="sm"
          />
        </div>
      }
    />
  );
}
`;

  return (
    <div className="flex flex-col space-y-4 mb-8">
      {/* Control Configuration Panel */}
      <div className="flex flex-wrap gap-4 justify-start md:justify-end">
        <VariantSelector
          type="Variant"
          variants={["default", "dark", "glass", "minimal"]}
          selectedVariant={variant}
          onSelectVariant={(v) => setVariant(v as any)}
          variantLabels={{
            default: "Default",
            dark: "Dark",
            glass: "Glass",
            minimal: "Minimal",
          }}
        />

        <button
          onClick={handleReset}
          className="px-1 py-1.5 h-9 text-xs font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 rounded-lg cursor-pointer active:scale-95 transition-all select-none"
        >
          Clear Session
        </button>
      </div>

      {/* Tabs */}
      <Tabs>
        <TabItem value="preview" label="Preview">
          <div
            className={`p-4 border rounded-xl min-h-[500px] flex items-center justify-center transition-all ${variant === "dark"
              ? "bg-neutral-950 border-neutral-900"
              : variant === 'glass'
                ? 'bg-gradient-to-br from-black via-red-950 to-neutral-900'
                : 'bg-white dark:bg-neutral-950'
              }`}
          >
            <div className="flex h-[550px] overflow-hidden rounded-xl border">


              <div className="w-72 shrink-0 border-r">
                <AIConversationHistory
                  sessions={sessions}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  activeSessionId="1"
                  onSessionSelect={(id) => console.log(id)}
                  onNewChat={() => console.log("new")}
                  variant={variant}
                />
              </div>
              <div className="flex-1">
                <AIChat
                  messages={messages}
                  isThinking={isThinking}
                  inputValue={inputVal}
                  onInputChange={setInputVal}
                  onSend={handleSend}
                  suggestedActions={starters}
                  variant={variant}
                  className="h-full w-full rounded-none border-0 r-0"

                  headerSlot={
                    <div className="flex justify-between items-center w-full select-none">
                      <div className="flex items-center gap-2">
                        <Bot className={variant === "glass" ? "text-white" : "text-indigo-500 dark:text-indigo-400"} />
                        <div className="flex flex-col text-left">
                          <span
                            className={`font-bold text-xs ${variant === "glass" || variant === "dark"
                              ? "text-white"
                              : "text-neutral-900"
                              }`}
                          >
                            Ignix Assistant
                          </span>
                          <span
                            className={`text-[9px] ${variant === "glass" || variant === "dark"
                              ? "text-white/70"
                              : "text-neutral-500"
                              }`}
                          >
                            Ready for instructions
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Settings size={16} className="cursor-pointer text-neutral-450 hover:text-neutral-600 dark:hover:text-white" />
                      </div>
                    </div>
                  }
                  attachmentSlot={
                    <div className="flex items-center gap-1.5 select-none">
                      {/* File Upload Button */}
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

                      {/* Model Selector Dropdown inside the input bar */}
                      <AIModelSelector
                        selectedModelId={selectedModelId}
                        onModelChange={(model) => setSelectedModelId(model.id)}
                        size="sm"
                        variant={
                          variant === "minimal"
                            ? "minimal"
                            : variant
                        }
                      />
                    </div>
                  }
                  footerSlot="AI answers may contain errors. Please verify component configurations."
                />
              </div>
            </div>
          </div>
        </TabItem>
        <TabItem value="code" label="Code">
          <CodeBlock language="tsx">{codeString}</CodeBlock>
        </TabItem>
      </Tabs>
    </div>
  );
};

export default AIChatDemo;
