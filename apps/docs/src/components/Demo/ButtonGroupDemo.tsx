/**
 * ButtonGroupDemo Component
 * 
 * Interactive demo component for showcasing the ButtonGroup component.
 * Allows users to explore different configurations, active states, and selection modes.
 * 
 * @file ButtonGroupDemo.tsx
 * @component ButtonGroupDemo
 */

import React, { useState } from 'react';
import { ButtonGroup, type ButtonGroupItem } from '@site/src/components/UI/button-group';
import type { ButtonProps } from '@site/src/components/UI/button';
import VariantSelector from './VariantSelector';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

// Available button variants
type ButtonVariant = NonNullable<ButtonProps['variant']>;

const buttonVariants: Array<{ value: ButtonVariant; label: string }> = [
  { value: 'default', label: 'Default' },
  { value: 'primary', label: 'Primary' },
  { value: 'secondary', label: 'Secondary' },
  { value: 'success', label: 'Success' },
  { value: 'warning', label: 'Warning' },
  { value: 'danger', label: 'Danger' },
  { value: 'outline', label: 'Outline' },
  { value: 'ghost', label: 'Ghost' },
];

// Available orientations
const orientations: Array<{ value: 'horizontal' | 'vertical'; label: string }> = [
  { value: 'horizontal', label: 'Horizontal' },
  { value: 'vertical', label: 'Vertical' },
];

// Available spacing options
const spacingOptions: Array<{ value: string; label: string }> = [
  { value: 'gap-1', label: 'Small (gap-1)' },
  { value: 'gap-2', label: 'Medium (gap-2)' },
  { value: 'gap-3', label: 'Large (gap-3)' },
  { value: 'gap-4', label: 'Extra Large (gap-4)' },
];

/**
 * ButtonGroupDemo Component
 * 
 * Provides an interactive demo interface for the ButtonGroup component
 * with controls for variant, orientation, spacing, and selection mode.
 */
const ButtonGroupDemo = () => {
  // State management for component props
  const [variant, setVariant] = useState<ButtonVariant>('default');
  const [orientation, setOrientation] = useState<'horizontal' | 'vertical'>('horizontal');
  const [spacing, setSpacing] = useState('gap-2');
  const [wrap, setWrap] = useState(true);
  const [multiple, setMultiple] = useState(false);
  const [activeValue, setActiveValue] = useState('option1');
  const [activeValues, setActiveValues] = useState<string[]>(['option1']);

  // Sample button items
  const items: ButtonGroupItem[] = [
    { value: 'option1', children: 'Option 1', variant },
    { value: 'option2', children: 'Option 2', variant },
    { value: 'option3', children: 'Option 3', variant },
  ];

  // Generate code string based on current state
  const codeString = multiple
    ? `
<ButtonGroup
  items={[
    { value: 'option1', children: 'Option 1' },
    { value: 'option2', children: 'Option 2' },
    { value: 'option3', children: 'Option 3' }
  ]}
  activeValues={[${activeValues.map(v => `'${v}'`).join(', ')}]}
  onChange={(value) => {
    setActiveValues(prev =>
      prev.includes(value)
        ? prev.filter(v => v !== value)
        : [...prev, value]
    );
  }}
  orientation="${orientation}"
  spacing="${spacing}"
  wrap={${wrap}}
  multiple
/>
  `.trim()
    : `
<ButtonGroup
  items={[
    { value: 'option1', children: 'Option 1' },
    { value: 'option2', children: 'Option 2' },
    { value: 'option3', children: 'Option 3' }
  ]}
  activeValue="${activeValue}"
  onChange={(value) => setActiveValue(value)}
  orientation="${orientation}"
  spacing="${spacing}"
  wrap={${wrap}}
/>
  `.trim();

  return (
    <div className="space-y-6 mb-8">
      {/* Control Panel - Variant Selectors */}
      <div className="flex flex-wrap gap-4 justify-start sm:justify-end">
        {/* Variant Selector */}
        <VariantSelector
          variants={buttonVariants.map(v => v.value)}
          selectedVariant={variant}
          onSelectVariant={(value) => setVariant(value as ButtonVariant)}
        />

        {/* Orientation Selector */}
        <VariantSelector
          variants={orientations.map(o => o.value)}
          selectedVariant={orientation}
          onSelectVariant={(value) => setOrientation(value as 'horizontal' | 'vertical')}
          type="Orientation"
        />

        {/* Spacing Selector */}
        <VariantSelector
          variants={spacingOptions.map(s => s.value)}
          selectedVariant={spacing}
          onSelectVariant={setSpacing}
          type="Spacing"
        />

        {/* Wrap Toggle */}
        <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
          <input
            type="checkbox"
            checked={wrap}
            onChange={(e) => setWrap(e.target.checked)}
            className="w-4 h-4"
          />
          Wrap
        </label>

        {/* Multiple Selection Toggle */}
        <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
          <input
            type="checkbox"
            checked={multiple}
            onChange={(e) => {
              const isMultiple = e.target.checked;
              setMultiple(isMultiple);
              if (!isMultiple) {
                // Switch back to single selection - use first active value or default
                setActiveValue(activeValues.length > 0 ? activeValues[0] : 'option1');
                setActiveValues([]);
              } else {
                // Switch to multiple selection - convert current activeValue to array
                setActiveValues(activeValue ? [activeValue] : []);
              }
            }}
            className="w-4 h-4"
          />
          Multiple
        </label>
      </div>

      {/* Preview and Code Tabs */}
      <Tabs>
        <TabItem value="preview" label="Preview" default>
          <div className="p-6 border rounded-lg mt-4">
            <div className="flex flex-col gap-4 items-center p-4">
              <ButtonGroup
                items={items}
                activeValue={multiple ? undefined : activeValue}
                activeValues={multiple ? activeValues : undefined}
                onChange={(value) => {
                  if (multiple) {
                    setActiveValues((prev) =>
                      prev.includes(value)
                        ? prev.filter((v) => v !== value)
                        : [...prev, value]
                    );
                  } else {
                    setActiveValue(value);
                  }
                }}
                orientation={orientation}
                spacing={spacing}
                wrap={wrap}
                multiple={multiple}
              />
              <div className="text-sm text-muted-foreground mt-2">
                Active: <strong>{multiple ? (activeValues.length > 0 ? activeValues.join(', ') : 'None') : activeValue}</strong>
              </div>
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

export default ButtonGroupDemo;

