import React, { useState } from 'react';
import { AIThinkingIndicator } from '@site/src/components/UI/ai-thinking-indicator';
import VariantSelector from './VariantSelector';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

const indicatorTypes = ['dots', 'pulse', 'wave', 'skeleton', 'sparkle', 'bloom', 'ring', 'bars'];
const indicatorVariants = ['default', 'dark', 'glass', 'minimal'];

const AIThinkingIndicatorDemo = () => {
  const [type, setType] = useState('dots');
  const [variant, setVariant] = useState('default');

  const codeString = `
import { AIThinkingIndicator } from '@ignix-ui/ai-thinking-indicator';

<AIThinkingIndicator type="${type}" variant="${variant}" label="Thinking..." />
`;

  return (
    <div className="flex flex-col space-y-4 mb-8">
      <div className="flex flex-wrap gap-4 justify-start md:justify-end">
        <VariantSelector
          variants={indicatorTypes}
          selectedVariant={type}
          onSelectVariant={setType}
          type="Type"
        />
        <VariantSelector
          variants={indicatorVariants}
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
            <AIThinkingIndicator
              type={type as any}
              variant={variant as any}
              label="Thinking..."
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

export default AIThinkingIndicatorDemo;
