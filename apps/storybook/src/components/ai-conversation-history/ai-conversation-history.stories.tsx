import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { AIConversationHistory } from "./index";

const meta: Meta<typeof AIConversationHistory> = {
  title: "Components/AI/AIConversationHistory",
  component: AIConversationHistory,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
The **AIConversationHistory** component is a sidebar/panel list viewer that manages historical chat sessions, search filters, and context controls.
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
type Story = StoryObj<typeof AIConversationHistory>;

const StatefulHistorySidebar = ({ variant = "default" }: { variant?: any }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSessionId, setActiveSessionId] = useState("1");
  const [sessions, setSessions] = useState([
    { id: "1", title: "React state URL sync hook", timestamp: new Date() },
    { id: "2", title: "Organic B2B SaaS growth ideas", timestamp: new Date() },
    { id: "3", title: "Docusaurus sidebar layout custom", timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    { id: "4", title: "Framer motion spring troubleshooting", timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
  ]);

  const handleRename = (id: string, newTitle: string) => {
    setSessions((prev) => prev.map((s) => (s.id === id ? { ...s, title: newTitle } : s)));
  };

  const handleDelete = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    if (activeSessionId === id) {
      setActiveSessionId("");
    }
  };

  const handleNewChat = () => {
    const nextId = Date.now().toString();
    const newSession = {
      id: nextId,
      title: `New Session ${sessions.length + 1}`,
      timestamp: new Date(),
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(nextId);
  };

  return (
    <div className={`w-[280px] h-[400px] rounded-2xl overflow-hidden shadow-sm flex flex-col transition-all ${variant === "glass"
        ? "border border-white/20"
        : variant === "minimal"
          ? "border border-transparent shadow-none"
          : variant === "dark"
            ? "border border-neutral-900"
            : "border border-neutral-200 dark:border-neutral-800"
      }`}>
      <AIConversationHistory
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSessionSelect={setActiveSessionId}
        onSessionRename={handleRename}
        onSessionDelete={handleDelete}
        onNewChat={handleNewChat}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        variant={variant}
        footerSlot="Ignix UI • Side Sidebar Panels"
      />
    </div>
  );
};

export const InteractiveExplorer: Story = {
  render: () => <StatefulHistorySidebar variant="default" />,
};

export const DarkExplorer: Story = {
  render: () => <StatefulHistorySidebar variant="dark" />,
  decorators: [
    (Story) => (
      <div className="p-6 bg-neutral-950 rounded-3xl border border-neutral-900 flex justify-center">
        <Story />
      </div>
    ),
  ],
};

export const GlassExplorer: Story = {
  render: () => <StatefulHistorySidebar variant="glass" />,
  decorators: [
    (Story) => (
      <div className="p-6 bg-gradient-to-br from-black via-red-950 to-neutral-900 rounded-3xl flex justify-center">
        <Story />
      </div>
    ),
  ],
};

export const MinimalExplorer: Story = {
  render: () => <StatefulHistorySidebar variant="minimal" />,
};
