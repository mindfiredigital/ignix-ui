import React, { useState } from 'react';
import { AIMessages } from '../UI/ai-messages';
import VariantSelector from './VariantSelector';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import { Plus, Trash2, Loader } from 'lucide-react';

const AIMessagesDemo = () => {
  const [variant, setVariant] = useState('default');
  const [isThinking, setIsThinking] = useState(false);
  const [shape, setShape] = useState<
    "bubble" | "card" | "pill" | "flat"
  >("bubble");
  const [messages, setMessages] = useState<any[]>([
    {
      id: 1,
      role: 'system',
      content: 'AI session established.',
    },
    {
      id: 2,
      role: 'user',
      content: 'Can you show me a simple CSS grid layout?',
      senderName: 'You',
      timestamp: '12:00 PM',
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=alice',
    },
    {
      id: 3,
      role: 'assistant',
      content: 'Sure! Here is a simple grid setup:\n\n```css\n.container {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 16px;\n}\n```',
      senderName: 'Assistant',
      timestamp: '12:00 PM',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=bob',
      showCopy: true,
    },
  ]);

  const addMessage = (role: 'user' | 'assistant') => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (role === 'user') {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: 'user',
          content: 'Add another message to push this viewport height!',
          senderName: 'You',
          timestamp: time,
          avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=alice',
        },
      ]);
    } else {
      setIsThinking(true);
      setTimeout(() => {
        setIsThinking(false);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            role: 'assistant',
            content: 'This is a simulated AI message to demonstrate auto-scroll behavior. Notice how the chat feed scrolled down smoothly when this appeared!',
            senderName: 'Assistant',
            timestamp: time,
            avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=bob',
            showCopy: true,
          },
        ]);
      }, 1000);
    }
  };

  const clearMessages = () => {
    setMessages([]);
    setIsThinking(false);
  };

  const codeString = `
import { AIMessages } from '@mindfiredigital/ignix-ui';

const messages = [
  { role: 'user', content: 'Hello!', senderName: 'You' },
  { role: 'assistant', content: 'Hi there!', senderName: 'Assistant' }
];

function ChatLayout() {
  return (
    <div className="h-[400px] border rounded-xl overflow-hidden flex flex-col">
      <AIMessages
        messages={messages}
        variant="${variant}"
        isThinking={${isThinking}}
        autoScroll={true}
        showJumpToBottom={true}
        messageBubbleProps={{
          shape: "${shape}",
        }}
      />
    </div>
  );
}
`;

  const isGlass = variant === 'glass';
  const isDark = variant === 'dark';

  return (
    <div className="flex flex-col space-y-4 mb-8">
      <div className="flex flex-wrap gap-4 justify-between items-center">
        {/* Trigger Controls */}
        <div className="flex gap-2">
          <button
            onClick={() => addMessage('user')}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-950 dark:hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            <Plus size={12} /> Send User Msg
          </button>
          <button
            onClick={() => addMessage('assistant')}
            disabled={isThinking}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-neutral-100 text-neutral-900 border rounded-lg hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-700 transition-colors cursor-pointer disabled:opacity-50"
          >
            {isThinking ? <Loader size={12} className="animate-spin" /> : <Plus size={12} />}
            Simulate AI Msg
          </button>
          {messages.length > 0 && (
            <button
              onClick={clearMessages}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-red-50 text-red-600 rounded-lg hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/60 transition-colors cursor-pointer"
            >
              <Trash2 size={12} /> Clear
            </button>
          )}
        </div>
        {/* Selector */}
        <div className="flex gap-3">
          <VariantSelector
            variants={['default', 'minimal', 'glass', 'dark']}
            selectedVariant={variant}
            onSelectVariant={setVariant}
            type="Variant"
          />

          <VariantSelector
            variants={['bubble', 'card', 'pill', 'flat']}
            selectedVariant={shape}
            onSelectVariant={(v) => setShape(v as any)}
            type="Shape"
          />
        </div>
      </div>

      <Tabs>
        <TabItem value="preview" label="Preview">
          <div
            className={`border rounded-xl mt-4 flex flex-col h-[400px] overflow-hidden transition-all ${isGlass
                ? 'bg-gradient-to-br from-neutral-950 via-red-950 to-black border-white/10 shadow-2xl'
                : isDark
                  ? 'bg-neutral-950 border-neutral-800 text-white'
                  : 'bg-neutral-50/50 dark:bg-neutral-900/50'
              }`}
          >
            <AIMessages
              messages={messages}
              isThinking={isThinking}
              variant={variant as any}
              messageBubbleProps={{
                shape,
              }}
            />
          </div>
        </TabItem>
        <TabItem value="code" label="Code">
          <CodeBlock language="tsx">{codeString}</CodeBlock>
        </TabItem>
      </Tabs>
    </div>
  );
};

export default AIMessagesDemo;
