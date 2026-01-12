/**
 * ButtonWithIconDemo Component
 * 
 * Interactive demo component for showcasing the ButtonWithIcon component.
 * Allows users to explore different variants, sizes, icon positions, and loading states.
 * 
 * @file ButtonWithIconDemo.tsx
 * @component ButtonWithIconDemo
 */

import React, { useState } from 'react';
import { ButtonWithIcon } from '@site/src/components/UI/button-with-icon';
import VariantSelector from './VariantSelector';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import { Download, Send, Settings } from 'lucide-react';

// Available button variants
const buttonVariants = [
  { value: 'default', label: 'Default' },
  { value: 'primary', label: 'Primary' },
  { value: 'secondary', label: 'Secondary' },
  { value: 'success', label: 'Success' },
  { value: 'warning', label: 'Warning' },
  { value: 'danger', label: 'Danger' },
  { value: 'outline', label: 'Outline' },
  { value: 'ghost', label: 'Ghost' },
  { value: 'link', label: 'Link' },
  { value: 'subtle', label: 'Subtle' },
  { value: 'elevated', label: 'Elevated' },
  { value: 'glass', label: 'Glass' },
  { value: 'neon', label: 'Neon' },
  { value: 'pill', label: 'Pill' },
];

// Available button sizes
const buttonSizes = [
  { value: 'xs', label: 'Extra Small (xs)' },
  { value: 'sm', label: 'Small (sm)' },
  { value: 'md', label: 'Medium (md)' },
  { value: 'lg', label: 'Large (lg)' },
  { value: 'xl', label: 'Extra Large (xl)' },
  { value: 'icon', label: 'Icon' },
];

// Available icon positions
const iconPositions = [
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' },
  { value: 'only', label: 'Icon Only' },
];

/**
 * ButtonWithIconDemo Component
 * 
 * Provides an interactive demo interface for the ButtonWithIcon component
 * with controls for variant, size, icon position, and loading state.
 */
const ButtonWithIconDemo = () => {
  // State management for component props
  const [variant, setVariant] = useState('default');
  const [size, setSize] = useState('md');
  const [iconPosition, setIconPosition] = useState('left');
  const [loading, setLoading] = useState(false);

  // Generate code string based on current state
  const codeString = `
<ButtonWithIcon 
  variant="${variant}" 
  size="${size}" 
  iconPosition="${iconPosition}"
  ${loading ? 'loading={true}' : ''}
  icon={${iconPosition === 'only' ? '<Settings />' : iconPosition === 'right' ? '<Send />' : '<Download />'}}
>
  ${iconPosition !== 'only' ? 'Button Text' : ''}
</ButtonWithIcon>
  `.trim();

  // Icon selection based on position
  const getIcon = () => {
    if (iconPosition === 'only') return <Settings />;
    if (iconPosition === 'right') return <Send />;
    return <Download />;
  };

  return (
    <div className="space-y-6 mb-8">
      {/* Control Panel - Variant Selectors */}
      <div className="flex flex-wrap gap-4 justify-start sm:justify-end">
        {/* Variant Selector */}
        <VariantSelector
          variants={buttonVariants.map(v => v.value)}
          selectedVariant={variant}
          onSelectVariant={setVariant}
        />

        {/* Size Selector */}
        <VariantSelector
          variants={buttonSizes.map(s => s.value)}
          selectedVariant={size}
          onSelectVariant={setSize}
          type="Size"
        />

        {/* Icon Position Selector */}
        <VariantSelector
          variants={iconPositions.map(p => p.value)}
          selectedVariant={iconPosition}
          onSelectVariant={setIconPosition}
          type="Icon Position"
        />

        {/* Loading State Toggle */}
        <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
          <input
            type="checkbox"
            checked={loading}
            onChange={(e) => setLoading(e.target.checked)}
            className="w-4 h-4"
          />
          Loading
        </label>
      </div>

      {/* Preview and Code Tabs */}
      <Tabs>
        <TabItem value="preview" label="Preview" default>
          <div className="p-6 border rounded-lg mt-4">
            <div className="flex flex-wrap gap-4 items-center justify-center p-4">
              <ButtonWithIcon
                variant={variant as any}
                size={size as any}
                iconPosition={iconPosition as any}
                loading={loading}
                icon={getIcon()}
              >
                {iconPosition !== 'only' ? 'Button Text' : undefined}
              </ButtonWithIcon>
            </div>
          </div>
        </TabItem>

        <TabItem value="code" label="Code">
          <div className="mt-4">
            <CodeBlock language="tsx" className="text-sm whitespace-pre-wrap">
              {codeString}
            </CodeBlock>
          </div>
        </TabItem>
      </Tabs>
    </div>
  );
};

export default ButtonWithIconDemo;

