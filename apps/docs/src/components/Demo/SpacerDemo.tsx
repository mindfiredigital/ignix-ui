import React, { useState } from 'react';
import { Spacer } from '@site/src/components/UI/spacer';
import VariantSelector from './VariantSelector';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

const spacerSizes = [
  { value: 'xs', label: 'Extra Small (xs)' },
  { value: 'sm', label: 'Small (sm)' },
  { value: 'md', label: 'Medium (md)' },
  { value: 'lg', label: 'Large (lg)' },
  { value: 'xl', label: 'Extra Large (xl)' },
  { value: '24px', label: 'Custom 24px' },
];

const spacerDirections = [
  { value: 'vertical', label: 'Vertical' },
  { value: 'horizontal', label: 'Horizontal' },
  { value: 'both', label: 'Both' },
];

const SpacerDemo = () => {
  const [size, setSize] = useState<string | number>('md');
  const [direction, setDirection] = useState<'vertical' | 'horizontal' | 'both'>('vertical');
  const [responsive, setResponsive] = useState<{
    mobile?: string;
    tablet?: string;
    desktop?: string;
  }>({
    mobile: undefined,
    tablet: undefined,
    desktop: undefined,
  });

  const codeString = `
    import { Spacer } from '@ignix-ui/spacer';

    <Spacer 
      size="${size}" 
      direction="${direction}" 
      responsive={{
        mobile: "${responsive.mobile ?? ''}",
        tablet: "${responsive.tablet ?? ''}",
        desktop: "${responsive.desktop ?? ''}"
      }}
    />
    `;

  return (
    <div className="space-y-6 mb-8">
      <div className="flex flex-wrap gap-4 justify-start sm:justify-end">
        <VariantSelector
          variants={spacerSizes.map(s => s.value)}
          selectedVariant={size.toString()}
          onSelectVariant={setSize}
          type="Base Size"
        />
        <VariantSelector
          variants={spacerDirections.map(d => d.value)}
          selectedVariant={direction}
          onSelectVariant={(val) =>
            setDirection(val as 'vertical' | 'horizontal' | 'both')
          }
          type="Direction"
        />
        <VariantSelector
          variants={spacerSizes.map(s => s.value)}
          selectedVariant={responsive.mobile ?? ''}
          onSelectVariant={(val) => setResponsive(r => ({ ...r, mobile: val }))}
          type="Mobile"
        />
        <VariantSelector
          variants={spacerSizes.map(s => s.value)}
          selectedVariant={responsive.tablet ?? ''}
          onSelectVariant={(val) => setResponsive(r => ({ ...r, tablet: val }))}
          type="Tablet"
        />
        <VariantSelector
          variants={spacerSizes.map(s => s.value)}
          selectedVariant={responsive.desktop ?? ''}
          onSelectVariant={(val) => setResponsive(r => ({ ...r, desktop: val }))}
          type="Desktop"
        />
      </div>

      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="p-6 border rounded-lg mt-4 flex items-center justify-center">
            <div
              className={`flex items-center ${
                direction === 'horizontal' ? 'flex-row' : 'flex-col'
              }`}
            >
              <div className="bg-blue-500 w-16 h-8" />
              <Spacer size={size} direction={direction} responsive={responsive} />
              <div className="bg-red-500 w-16 h-8" />
            </div>
          </div>
        </TabItem>

        <TabItem value="code" label="Code">
          <div className="mt-4">
            <CodeBlock language="tsx" className="text-sm">
              {codeString}
            </CodeBlock>
          </div>
        </TabItem>
      </Tabs>
    </div>
  );
};

export default SpacerDemo;
