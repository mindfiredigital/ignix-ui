
import React, { useState } from 'react';
import { Switch } from '@site/src/components/UI/switch';
import VariantSelector from './VariantSelector';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

const switchVariants = [
  'default',
  'large',
  'small',
  'pill',
  'square',
  'slim',
  'ios',
  'material',
];
const switchAnimations = [
  'default',
  'bounce',
  'scale',
  'rotate',
  'fade',
  'elastic',
  'pulse',
  'shake',
  'flip',
  'jelly',
  'glow',
];

const SwitchDemo = () => {
  const [variant, setVariant] = useState('default');
  const [animation, setAnimation] = useState('default');

  const codeString = `
<Switch variant="${variant}" animation="${animation}" defaultChecked />
`;

  return (
    <div className="flex flex-col space-y-4 mb-8">
      <div className="flex flex-wrap gap-4">
        <VariantSelector
          variants={switchVariants}
          selectedVariant={variant}
          onSelectVariant={setVariant}
          type="variant"
        />
        <VariantSelector
          variants={switchAnimations}
          selectedVariant={animation}
          onSelectVariant={setAnimation}
          type="animation"
        />
      </div>
      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="w-full p-8 space-y-8 border rounded-lg mt-4">
            <div className="p-6 rounded-lg">
              <div className="flex items-center gap-4">
                <Switch variant={variant as any} animation={animation as any} defaultChecked />
              </div>
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

export default SwitchDemo;
