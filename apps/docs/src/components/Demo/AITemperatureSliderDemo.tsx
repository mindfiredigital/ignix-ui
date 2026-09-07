import React, { useState } from 'react';
import { AITemperatureSlider } from '../UI/ai-temperature-slider';
import VariantSelector from './VariantSelector';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

const AITemperatureSliderDemo = () => {
  const [val, setVal] = useState(0.7);
  const [showPresets, setShowPresets] = useState(true);
  const [showRiskIndicator, setShowRiskIndicator] = useState(true);
  const [variant, setVariant] = useState<'default' | 'dark' | 'glass'>('default');

  const codeString = `
import { useState } from 'react';
import { AITemperatureSlider } from '@mindfiredigital/ignix-ui';

function Configurator() {
  const [temp, setTemp] = useState(${val});

  return (
    <AITemperatureSlider
      value={temp}
      onChange={setTemp}
      showPresets={${showPresets}}
      showRiskIndicator={${showRiskIndicator}}
      variant="${variant}"
    />
  );
}
`;

  return (
    <div className="flex flex-col space-y-4 mb-8">
      {/* Configuration Panel */}
      <div className="flex flex-wrap gap-4 justify-start md:justify-end">
        <VariantSelector
          type="Variant"
          variants={['default', 'dark', 'glass']}
          selectedVariant={variant}
          onSelectVariant={(v) => setVariant(v as any)}
          variantLabels={{
            default: 'Default',
            dark: 'Dark',
            glass: 'Glass',
          }}
        />

        <label className="flex items-center gap-1.5 text-xs text-neutral-500 font-semibold cursor-pointer">
          <input
            type="checkbox"
            checked={showPresets}
            onChange={(e) => setShowPresets(e.target.checked)}
            className="cursor-pointer"
          />
          Presets
        </label>

        <label className="flex items-center gap-1.5 text-xs text-neutral-500 font-semibold cursor-pointer">
          <input
            type="checkbox"
            checked={showRiskIndicator}
            onChange={(e) => setShowRiskIndicator(e.target.checked)}
            className="cursor-pointer"
          />
          Risk Warning
        </label>
      </div>

      <div className="text-xs text-neutral-400">
        Value: <code className="bg-white dark:bg-neutral-950 px-1.5 py-0.5 border dark:border-neutral-800 rounded font-mono font-semibold">{val.toFixed(1)}</code>
      </div>

      <Tabs>
        <TabItem value="preview" label="Preview">
          <div
            className={`p-10 border dark:border-neutral-800 rounded-xl min-h-[180px] flex items-center justify-center transition-all ${variant === 'glass'
                ? 'bg-gradient-to-br from-black via-red-950 to-neutral-900'
                : 'bg-white dark:bg-neutral-950'
              }`}
          >
            <div className="w-full max-w-sm">
              <AITemperatureSlider
                value={val}
                onChange={setVal}
                showPresets={showPresets}
                showRiskIndicator={showRiskIndicator}
                variant={variant}
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

export default AITemperatureSliderDemo;
