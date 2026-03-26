
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
const sliderOrientation = ['horizontal', 'vertical'];

const SliderDemo = () => {
  const [variant, setVariant] = useState('default');
  const [animation, setAnimation] = useState('slide');
  const [orientation, setOrientation] = useState('horizontal');

  const codeString = `
import { Slider } from '@ignix-ui/slider';

<Slider
  key={"${variant}-${animation}"}
  defaultValue={[50]}
  max={100}
  step={1}
  variant="${variant}"
  animationType="${animation}"
  showValue
  valueSuffix="%"
  orientation="${orientation}"
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
        <VariantSelector 
          variants={sliderOrientation}
          selectedVariant={orientation}
          onSelectVariant={setOrientation}
          type="Orientation"
        />
      </div>
      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="w-full p-8 space-y-8 border rounded-lg mt-4">
            <div className="p-6 rounded-lg">
              <Slider
                key={`${variant}-${animation}`}
                defaultValue={[50]}
                max={100}
                step={1}
                variant={variant as any}
                animationType={animation as any}
                showValue
                valueSuffix="%"
                orientation={orientation as any}
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
