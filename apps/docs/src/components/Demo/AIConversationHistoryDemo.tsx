import React, { useState } from "react";
import { AIConversationHistory } from "../UI/ai-conversation-history";
import VariantSelector from "./VariantSelector";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import CodeBlock from "@theme/CodeBlock";
import { cn } from "@site/src/utils/cn";

const AIConversationHistoryDemo: React.FC = () => {
  const [variant, setVariant] = useState<"default" | "dark" | "glass" | "minimal">("default");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSessionId, setActiveSessionId] = useState("1");
  const [sessions, setSessions] = useState<any[]>([
    { id: "1", title: "React state URL sync hook", timestamp: new Date() },
    { id: "2", title: "Organic B2B SaaS growth ideas", timestamp: new Date() },
    { id: "3", title: "Docusaurus sidebar layout custom", timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    { id: "4", title: "Framer motion spring troubleshooting", timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
    { id: "5", title: "Old Ignix UI components list review", timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
  ]);

  const handleSessionSelect = (id: string) => {
    setActiveSessionId(id);
  };

  const handleSessionRename = (id: string, newTitle: string) => {
    setSessions((prev) => prev.map((s) => (s.id === id ? { ...s, title: newTitle } : s)));
  };

  const handleSessionDelete = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    if (activeSessionId === id) {
      setActiveSessionId("");
    }
  };

  const handleNewChat = () => {
    const nextId = (Date.now()).toString();
    const newSession = {
      id: nextId,
      title: `New Conversation ${sessions.length + 1}`,
      timestamp: new Date(),
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(nextId);
  };

  const handleReset = () => {
    setSessions([
      { id: "1", title: "React state URL sync hook", timestamp: new Date() },
      { id: "2", title: "Organic B2B SaaS growth ideas", timestamp: new Date() },
      { id: "3", title: "Docusaurus sidebar layout custom", timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      { id: "4", title: "Framer motion spring troubleshooting", timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
      { id: "5", title: "Old Ignix UI components list review", timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
    ]);
    setActiveSessionId("1");
    setSearchQuery("");
  };

  const codeString = `
import { AIConversationHistory } from '@mindfiredigital/ignix-ui';
import { useState } from 'react';

function HistorySidebar() {
  const [sessions, setSessions] = useState([
    { id: '1', title: 'React state URL sync hook', timestamp: new Date() }
  ]);
  const [search, setSearch] = useState('');
  const [activeId, setActiveId] = useState('1');

  return (
    <AIConversationHistory
      sessions={sessions}
      searchQuery={search}
      onSearchChange={setSearch}
      activeSessionId={activeId}
      onSessionSelect={setActiveId}
      onNewChat={() => alert('New session initiated!')}
      variant="${variant}"
    />
  );
}
`;

  return (
    <div className="flex flex-col space-y-4 mb-8">
      {/* Configuration Panel */}
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
          className="px-3 py-1.5 h-9 text-xs font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 rounded-lg cursor-pointer active:scale-95 transition-all select-none"
        >
          Reset History
        </button>

      </div>

      {/* Tabs */}
      <Tabs>
        <TabItem value="preview" label="Preview">
          <div
            className={`p-4 border rounded-xl min-h-[450px] flex items-center justify-center transition-all ${variant === "dark"
              ? "bg-neutral-950 border-neutral-900"
              : variant === 'glass'
                ? 'bg-gradient-to-br from-black via-red-950 to-neutral-900'
                : 'bg-white dark:bg-neutral-950'
              }`}
          >
            <div className={cn(
              "w-[280px] h-[380px] rounded-2xl overflow-hidden shadow-md flex flex-col transition-all",
              variant === "glass"
                ? "border border-white/20"
                : variant === "minimal"
                  ? "border border-transparent"
                  : variant === "dark"
                    ? "border border-neutral-900"
                    : "border border-neutral-200 dark:border-neutral-800"
            )}>
              <AIConversationHistory
                sessions={sessions}
                activeSessionId={activeSessionId}
                onSessionSelect={handleSessionSelect}
                onSessionRename={handleSessionRename}
                onSessionDelete={handleSessionDelete}
                onNewChat={handleNewChat}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                variant={variant}
                footerSlot="Ignix UI • Premium Side Panels"
              />
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

export default AIConversationHistoryDemo;
