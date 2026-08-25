import React, { useState } from 'react';
import { AIModelSelector, AIModel } from '../UI/ai-model-selector';
import VariantSelector from './VariantSelector';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

const AIModelSelectorDemo = () => {
  const [selectedId, setSelectedId] = useState('gpt-4o');
  const [size, setSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [variant, setVariant] = useState<'default' | 'dark' | 'glass' | 'minimal'>('default');

  const codeString = `
import { useState } from 'react';
import { AIModelSelector } from '@mindfiredigital/ignix-ui';

function ModelPicker() {
  const [selectedModel, setSelectedModel] = useState("${selectedId}");

  return (
    <AIModelSelector
      selectedModelId={selectedModel}
      onModelChange={(model) => setSelectedModel(model.id)}
      size="${size}"
      variant="${variant}"
    />
  );
}
`;

  return (
    <div className="flex flex-col space-y-4 mb-8">
      {/* Control selectors */}
      <div className="flex flex-wrap gap-4 justify-start md:justify-end">
        <VariantSelector
          type="Size"
          variants={['sm', 'md', 'lg']}
          selectedVariant={size}
          onSelectVariant={(v) => setSize(v as any)}
          variantLabels={{
            sm: 'Small (Pill)',
            md: 'Medium (Default)',
            lg: 'Large',
          }}
        />

        <VariantSelector
          type="Variant"
          variants={['default', 'dark', 'glass', 'minimal']}
          selectedVariant={variant}
          onSelectVariant={(v) => setVariant(v as any)}
          variantLabels={{
            default: 'Default',
            dark: 'Dark',
            glass: 'Glass',
            minimal: 'Minimal',
          }}
        />
      </div>

      <Tabs>
        <TabItem value="preview" label="Preview">
          <div
            className={`p-10 border dark:border-neutral-800 rounded-xl min-h-[160px] flex items-center justify-center transition-all ${variant === 'glass'
              ? 'bg-gradient-to-br from-black via-red-950 to-neutral-900'
              : 'bg-white dark:bg-neutral-950'
              }`}
          >
            <AIModelSelector
              selectedModelId={selectedId}
              onModelChange={(model: AIModel) => setSelectedId(model.id)}
              size={size}
              variant={variant}
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

export default AIModelSelectorDemo;
