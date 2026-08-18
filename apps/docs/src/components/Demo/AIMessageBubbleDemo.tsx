import React, { useState } from 'react';
import { AIMessageBubble } from '../UI/ai-message-bubble';
import VariantSelector from './VariantSelector';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import { Plus, ThumbsUp, ThumbsDown, Trash2 } from 'lucide-react';

const AIMessageBubbleDemo = () => {
  const [variant, setVariant] = useState('default');
  const [shape, setShape] = useState<
    'bubble' | 'card' | 'pill' | 'flat'
  >('bubble');
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'system' as const,
      content: 'Session started. AI assistant initialized.',
      timestamp: '11:00 AM',
    },
    {
      id: 2,
      role: 'user' as const,
      content: 'Can you show me how to style a button in Tailwind?',
      senderName: 'You',
      timestamp: '11:01 AM',
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=user',
    },
    {
      id: 3,
      role: 'assistant' as const,
      content: 'Certainly! Here is a standard button class:\n\n<button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">\n  Click Me\n</button>',
      senderName: 'Assistant',
      timestamp: '11:01 AM',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=assistant',
    },
  ]);

  const addMessage = (role: 'user' | 'assistant' | 'system') => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let content = '';
    let avatar = undefined;
    let senderName = undefined;

    if (role === 'user') {
      content = 'How do I center a div?';
      senderName = 'You';
      avatar = 'https://api.dicebear.com/7.x/adventurer/svg?seed=user';
    } else if (role === 'assistant') {
      content = 'Use the classes "flex items-center justify-center" on the parent container!';
      senderName = 'Assistant';
      avatar = 'https://api.dicebear.com/7.x/bottts/svg?seed=assistant';
    } else {
      content = 'System: Auto-save completed.';
    }

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        role,
        content,
        senderName,
        timestamp: time,
        avatar,
      },
    ]);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const codeString = `
import { AIMessageBubble } from '@ignix-ui/ai-message-bubble';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

function ChatFeed() {
  return (
    <div className="flex flex-col space-y-4">
      <AIMessageBubble
        role="assistant"
        variant="${variant}"
        shape="${shape}"  
        senderName="Assistant"
        timestamp="10:30 AM"
        avatar="https://api.dicebear.com/7.x/bottts/svg?seed=assistant"
        showCopy
        content="Hello! How can I assist you today?"
        actions={
          <>
            <button className="p-1 text-neutral-400 hover:text-neutral-600"><ThumbsUp size={14} /></button>
            <button className="p-1 text-neutral-400 hover:text-neutral-600"><ThumbsDown size={14} /></button>
          </>
        }
      />
      <AIMessageBubble
        role="user"
        variant="${variant}"
        shape="${shape}"
        senderName="You"
        timestamp="10:31 AM"
        avatar="https://api.dicebear.com/7.x/adventurer/svg?seed=user"
        showCopy
        content="Explain quantum computing in one sentence."
      />
    </div>
  );
}
`;

  return (
    <div className="flex flex-col space-y-4 mb-8">
      <div className="flex flex-wrap gap-4 justify-between items-center">
        {/* Action Controls */}
        <div className="flex gap-2">
          <button
            onClick={() => addMessage('user')}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-950 dark:hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            <Plus size={12} /> Add User Msg
          </button>
          <button
            onClick={() => addMessage('assistant')}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-neutral-100 text-neutral-900 border rounded-lg hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
          >
            <Plus size={12} /> Add AI Msg
          </button>
          <button
            onClick={() => addMessage('system')}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-neutral-100 text-neutral-900 border rounded-lg hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
          >
            <Plus size={12} /> Add System Msg
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
            variants={['default', 'minimal', 'glass']}
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
            className={`border rounded-xl p-4 md:p-6 mt-4 transition-all min-h-[300px] max-h-[500px] overflow-y-auto ${variant === 'glass'
              ? 'bg-gradient-to-br from-neutral-950 via-red-950 to-black backdrop-blur-3xl'
              : 'bg-neutral-50/50 dark:bg-neutral-900/50'
              }`}
          >
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-[200px] text-sm text-neutral-400">
                No messages yet. Click the buttons above to add messages.
              </div>
            ) : (
              <div className="flex flex-col space-y-1">
                {messages.map((msg) => (
                  <AIMessageBubble
                    key={msg.id}
                    role={msg.role}
                    variant={variant as any}
                    shape={shape}
                    content={msg.content}
                    senderName={msg.senderName}
                    timestamp={msg.timestamp}
                    avatar={msg.avatar}
                    showCopy={msg.role !== 'system'}
                    actions={
                      msg.role === 'assistant' ? (
                        <>
                          <button className="p-1 rounded text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all cursor-pointer">
                            <ThumbsUp size={12} />
                          </button>
                          <button className="p-1 rounded text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all cursor-pointer">
                            <ThumbsDown size={12} />
                          </button>
                        </>
                      ) : undefined
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </TabItem>
        <TabItem value="code" label="Code">
          <CodeBlock language="tsx">{codeString}</CodeBlock>
        </TabItem>
      </Tabs>
    </div>
  );
};

export default AIMessageBubbleDemo;
