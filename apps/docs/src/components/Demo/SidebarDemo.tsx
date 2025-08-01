
import React, { useState } from 'react';
import Sidebar from '@site/src/components/UI/sidebar';
import VariantSelector from './VariantSelector';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import { Home, Settings, User, HelpCircle } from 'lucide-react';

const sidebarVariants = ['default', 'dark', 'light', 'glass'];
const sidebarPositions = ['left', 'right'];

const SidebarDemo = () => {
  const [variant, setVariant] = useState('default');
  const [position, setPosition] = useState('left');

  const codeString = `
<Sidebar
  links={[
    { label: 'Home', href: '#', icon: Home },
    { label: 'Profile', href: '#', icon: User },
    { label: 'Settings', href: '#', icon: Settings },
    { label: 'Help', href: '#', icon: HelpCircle },
  ]}
  brandName="Demo App"
  variant="${variant}"
  position="${position}"
/>
`;

  return (
    <div className="flex flex-col space-y-4 mb-8">
      <div className="flex flex-wrap gap-4 sm:justify-end justify-start">
        <VariantSelector
          variants={sidebarVariants}
          selectedVariant={variant}
          onSelectVariant={setVariant}
          type="Variant"
        />
        <VariantSelector
          variants={sidebarPositions}
          selectedVariant={position}
          onSelectVariant={setPosition}
          type="Position"
        />
      </div>
      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="w-full h-[400px] relative border rounded-lg overflow-hidden bg-slate-100 shadow-lg mt-4">
            <div className="w-full h-8 bg-gray-200 flex items-center px-2 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm text-gray-600 ml-2">Demo Window</span>
            </div>
            <div className="relative h-[calc(100%-2rem)] bg-white">
              <Sidebar
                links={[
                  { label: 'Home', href: '#', icon: Home },
                  { label: 'Profile', href: '#', icon: User },
                  { label: 'Settings', href: '#', icon: Settings },
                  { label: 'Help', href: '#', icon: HelpCircle },
                ]}
                brandName="Demo App"
                variant={variant as any}
                position={position as any}
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

export default SidebarDemo;
