import React, { useState } from 'react';
import { AITokenCounter } from '../UI/ai-token-counter';
import { Button } from '../UI/button';
import VariantSelector from './VariantSelector';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

const AITokenCounterDemo = () => {
  const [inputs, setInputs] = useState(800);
  const [outputs, setOutputs] = useState(400);
  const [mode, setMode] = useState<'bar' | 'circular' | 'compact' | 'detailed'>('detailed');
  const [variant, setVariant] = useState<'default' | 'dark' | 'glass' | 'minimal'>('default');
  const max = 2000;

  const codeString = `
import { AITokenCounter } from '@mindfiredigital/ignix-ui';

function ContextTracker() {
  return (
    <AITokenCounter
      inputTokens={${inputs}}
      outputTokens={${outputs}}
      maxTokens={${max}}
      mode="${mode}"
      variant="${variant}"
      label="GPT-4o Context"
    />
  );
}
`;

  return (
    <div className="flex flex-col space-y-4 mb-8">
      <div className="flex flex-wrap gap-4 justify-start md:justify-end">
        <VariantSelector
          type="Mode"
          variants={['detailed', 'bar', 'circular', 'compact']}
          selectedVariant={mode}
          onSelectVariant={(v) => setMode(v as any)}
          variantLabels={{
            detailed: 'Detailed Breakdown',
            bar: 'Linear Bar Only',
            circular: 'Circular Progress',
            compact: 'Compact Pill',
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

        <div className="flex gap-2">
          <Button
            size="compact"
            variant="subtle"
            onClick={() => setInputs((prev) => Math.min(prev + 150, max - outputs))}
          >
            +150 In
          </Button>
          <Button
            size="compact"
            variant="subtle"
            onClick={() => setOutputs((prev) => Math.min(prev + 150, max - inputs))}
          >
            +150 Out
          </Button>
          <Button
            size="compact"
            variant="outline"
            onClick={() => {
              setInputs(800);
              setOutputs(400);
            }}
          >
            Reset
          </Button>
        </div>
      </div>

      <Tabs>
        <TabItem value="preview" label="Preview">
          <div
            className={`p-10 border dark:border-neutral-800 rounded-xl min-h-[160px] flex items-center justify-center transition-all ${variant === 'glass'
                ? 'bg-gradient-to-br from-black via-red-950 to-neutral-900'
                : 'bg-white dark:bg-neutral-950'
              }`}
          >
            <div className="w-full max-w-sm">
              <AITokenCounter
                inputTokens={inputs}
                outputTokens={outputs}
                maxTokens={max}
                mode={mode}
                variant={variant}
                label="Claude 3.5 Sonnet"
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

export default AITokenCounterDemo;
