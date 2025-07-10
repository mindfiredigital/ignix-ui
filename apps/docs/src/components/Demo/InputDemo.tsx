
import React, { useState } from 'react';
import { AnimatedInput } from '@site/src/components/UI/input';
import VariantSelector from './VariantSelector';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

const inputVariants = [
  'clean',
  'underline',
  'floating',
  'borderGlow',
  'shimmer',
  'bounce',
  'flip',
  'slide',
  'rotate',
  'elastic',
  'springy',
  'borderBeam',
  'glow',
  'shake',
  'wave',
  'typewriter',
  'neon',
  'particles',
  'cosmic',
  'materialFloat',
  'gradientBorder',
  'ripple',
  'neonPulse',
  'typewriterReveal',
  'morphing',
  'liquidBorder',
  'particleField',
  'magnetic',
  'pulse',
  'spotlight',
  'liquid',
  'origami',
  'glitch',
  'hologram',
  'cosmic',
];

const InputDemo = () => {
  const [variant, setVariant] = useState('clean');
  const [value, setValue] = useState('');

  const codeString = `
<AnimatedInput
  placeholder="Type something..."
  variant="${variant}"
  value={value}
  onChange={setValue}
/>
`;

  return (
    <div className="flex flex-col space-y-4 mb-8">
      <VariantSelector
        variants={inputVariants}
        selectedVariant={variant}
        onSelectVariant={setVariant}
      />
      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="p-4 border rounded-lg mt-4">
            <AnimatedInput
              placeholder="Type something..."
              variant={variant}
              value={value}
              onChange={setValue}
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

export default InputDemo;
