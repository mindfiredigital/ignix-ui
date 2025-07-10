import React, { useState } from 'react';
import { Badge } from '@site/src/components/UI/badge';
import VariantSelector from './VariantSelector';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import { Mail } from 'lucide-react';

const badgeVariants = ['pulse', 'bounce', 'tinypop'];
const badgeTypes = ['primary', 'secondary', 'success', 'warning', 'error'];

const BadgeDemo = () => {
  const [variant, setVariant] = useState('pulse');
  const [type, setType] = useState('primary');

  const codeString = `
<div className="relative inline-flex items-center">
  <Mail className="h-6 w-6" />
  <Badge text="3" type="${type}" variant="${variant}" />
</div>
`;

  return (
    <div className="flex flex-col space-y-4 mb-8">
      <div className="flex flex-wrap gap-4">
        <VariantSelector
          variants={badgeVariants}
          selectedVariant={variant}
          onSelectVariant={setVariant}
        />
        <VariantSelector
          variants={badgeTypes}
          selectedVariant={type}
          onSelectVariant={setType}
        />
      </div>
      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="flex items-center gap-8 border rounded-lg p-4 mt-4">
            <div className="relative inline-flex items-center">
              <Mail className="h-6 w-6" />
              <Badge text="3" type={type as any} variant={variant as any} />
            </div>
          </div>
        </TabItem>
        <TabItem value="code" label="Code">
          <CodeBlock language="tsx" className='whitespace-pre-wrap max-h-[500px] overflow-y-scroll'>{codeString}</CodeBlock>
        </TabItem>
      </Tabs>
    </div>
  );
};

export default BadgeDemo;