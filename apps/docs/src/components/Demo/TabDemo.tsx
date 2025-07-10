
import React, { useState } from 'react';
import { Tabs as TabsComponent } from '@site/src/components/UI/tab';
import VariantSelector from './VariantSelector';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

const tabVariants = [
  'underline',
  'filled',
  'pill',
  'outline',
  'ghost',
  'shadow',
  'gradient',
  'glow',
  'block',
];
const tabThemes = ['light', 'dark', 'glass', 'glassDark', 'glassLight', 'glassGradient', 'glassGradientDark'];

const TabDemo = () => {
  const [variant, setVariant] = useState('underline');
  const [theme, setTheme] = useState('light');

  const codeString = `
<TabsComponent
  options={["Home", "Profile", "Settings", "About"]}
  selected={0}
  variant="${variant}"
  theme="${theme}"
/>
`;

  return (
    <div className="flex flex-col space-y-4 mb-8">
      <div className="flex flex-wrap gap-4">
        <VariantSelector
          variants={tabVariants}
          selectedVariant={variant}
          onSelectVariant={setVariant}
          type="variant"
        />
        <VariantSelector variants={tabThemes} selectedVariant={theme} onSelectVariant={setTheme} type="theme" />
      </div>
      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="w-full p-8 space-y-8 rounded-lg border shadow-lg mt-4">
            <div className="p-6 rounded-lg">
              <TabsComponent
                options={["Home", "Profile", "Settings", "About"]}
                selected={0}
                variant={variant as any}
                theme={theme as any}
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

export default TabDemo;
