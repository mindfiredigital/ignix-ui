
import React, { useState } from 'react';
import AnimatedTextarea from '@site/src/components/UI/textarea';
import VariantSelector from './VariantSelector';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

const textareaVariants = [
  'clean',
  'glowBorder',
  'neonGlow',
  'expandable',
  'characterCount',
  'lineHighlight',
  'syntaxHighlight',
  'particleField',
  'wave',
  'spotlight',
  'liquid',
  'cosmic',
  'hologram',
  'elastic',
  'rippleEffect',
  'gradientBorder',
];

const TextareaDemo = () => {
  const [variant, setVariant] = useState('clean');
  const [value, setValue] = useState('');

  const codeString = `
<AnimatedTextarea
  placeholder="Type something..."
  variant="${variant}"
  value={value}
  onChange={setValue}
/>
`;

  return (
    <div className="flex flex-col space-y-4 mb-8">
      <VariantSelector
        variants={textareaVariants}
        selectedVariant={variant}
        onSelectVariant={setVariant}
        type="Variant"
      />
      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="w-full p-8 space-y-8 rounded-lg border mt-4">
            <div className="p-6 rounded-lg">
              <AnimatedTextarea
                placeholder="Type something..."
                variant={variant}
                value={value}
                onChange={setValue}
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

export default TextareaDemo;
