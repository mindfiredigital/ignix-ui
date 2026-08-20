import React, { useState } from 'react';
import { AIStatusBadge } from '@site/src/components/UI/ai-status-badge';
import VariantSelector from './VariantSelector';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

const statuses = ['idle', 'thinking', 'streaming', 'error', 'ready'];
const badgeVariants = ['default', 'dark', 'glass', 'minimal'];

const AIStatusBadgeDemo = () => {
  const [status, setStatus] = useState('streaming');
  const [variant, setVariant] = useState('default');

  const codeString = `
import { AIStatusBadge } from '@mindfiredigital/ignix-ui';

<AIStatusBadge status="${status}" variant="${variant}" model="gpt-4" />
`;

  return (
    <div className="flex flex-col space-y-4 mb-8">
      <div className="flex flex-wrap gap-4 justify-start md:justify-end">
        <VariantSelector
          variants={statuses}
          selectedVariant={status}
          onSelectVariant={setStatus}
          type="Status"
        />
        <VariantSelector
          variants={badgeVariants}
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
            <AIStatusBadge status={status as any} variant={variant as any} model="gpt-4" />
          </div>
        </TabItem>
        <TabItem value="code" label="Code">
          <CodeBlock language="tsx">{codeString}</CodeBlock>
        </TabItem>
      </Tabs>
    </div>
  );
};

export default AIStatusBadgeDemo;
