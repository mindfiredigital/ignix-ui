
import React, { useState } from 'react';
import { Slider } from '@site/src/components/UI/slider';
import VariantSelector from './VariantSelector';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

const sliderVariants = [
  'default',
  'minimal',
  'gradient',
  'glass',
  'neon',
  'material',
  'neumorphic',
  'retro',
  'cyberpunk',
  'brutalist',
  'skeuomorphic',
  'rounded',
  'outline',
  'shadow',
];
const sliderAnimations = ['none', 'slide', 'fade', 'flip', 'scale', 'breathe', 'rainbow', 'pulse', 'zoom', 'spring', 'elastic', 'parallax', 'morph', 'hover', 'bounce', 'wave'];

const SliderDemo = () => {
  const [variant, setVariant] = useState('default');
  const [animation, setAnimation] = useState('slide');

  const codeString = `
<Slider
  defaultValue={[50]}
  max={100}
  step={1}
  variant="${variant}"
  animationType="${animation}"
  showValue
  valueSuffix="%"
/>
`;

  return (
    <div className="flex flex-col space-y-4 mb-8">
      <div className="flex flex-wrap gap-4 sm:justify-end justify-start">
        <VariantSelector
          variants={sliderVariants}
          selectedVariant={variant}
          onSelectVariant={setVariant}
          type="Variant"
        />
        <VariantSelector
          variants={sliderAnimations}
          selectedVariant={animation}
          onSelectVariant={setAnimation}
          type="Animation"
        />
      </div>
      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="w-full p-8 space-y-8 border rounded-lg mt-4">
            <div className="p-6 rounded-lg">
              <Slider
                defaultValue={[50]}
                max={100}
                step={1}
                variant={variant as any}
                animationType={animation as any}
                showValue
                valueSuffix="%"
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

export default SliderDemo;
