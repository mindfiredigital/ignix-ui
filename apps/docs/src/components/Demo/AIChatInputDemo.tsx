import React, { useState } from 'react';
import { AIChatInput } from '@site/src/components/UI/ai-chat-input';
import { Plus } from 'lucide-react';
import VariantSelector from './VariantSelector';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

const inputVariants = ['default', 'dark', 'glass', 'minimal'];

const AIChatInputDemo = () => {
  const [variant, setVariant] = useState('default');
  const [value, setValue] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

  const codeString = `
import { AIChatInput } from '@ignix-ui/ai-chat-input';
import { Plus } from 'lucide-react';

function ChatInputDemo() {
  const [value, setValue] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

  return (
    <AIChatInput
      variant="${variant}"
      value={value}
      onChange={setValue}
      onSend={(message) => {
        setIsStreaming(true);
        // send message, then setIsStreaming(false) once the response completes
      }}
      isStreaming={isStreaming}
      onStop={() => setIsStreaming(false)}
      attachmentSlot={
        <button
          type="button"
          aria-label="Attach file"
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 -ml-2"
        >
          <Plus size={18} />
        </button>
      }
    />
  );
}
`;

  return (
    <div className="flex flex-col space-y-4 mb-8">
      <div className="flex flex-wrap gap-4 justify-start md:justify-end">
        <VariantSelector
          variants={inputVariants}
          selectedVariant={variant}
          onSelectVariant={setVariant}
          type="Variant"
        />
      </div>
      <Tabs>
        <TabItem value="preview" label="Preview">
          <div
            className={
              variant === 'dark'
                ? 'flex items-center justify-center border rounded-lg p-8 mt-4 bg-neutral-900'
                : 'flex items-center justify-center border rounded-lg p-8 mt-4'
            }
          >
            <div className="w-full max-w-md">
              <AIChatInput
                variant={variant as any}
                value={value}
                onChange={setValue}
                onSend={(_message) => {
                  setIsStreaming(true);
                  setValue('');
                  setTimeout(() => setIsStreaming(false), 2000);
                }}
                isStreaming={isStreaming}
                onStop={() => setIsStreaming(false)}
                attachmentSlot={
                  <button
                    type="button"
                    onClick={() => alert('Attachment button clicked!')}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors cursor-pointer -ml-2"
                  >
                    <Plus size={18} />
                  </button>
                }
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

export default AIChatInputDemo;
