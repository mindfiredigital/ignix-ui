import React, { useState } from 'react';
import { Split, Left, Right, Ratio, Gap, MobileMode } from '../UI/split';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import VariantSelector from './VariantSelector';

const ratioOptions: Ratio[] = ['30:70', '40:60', '50:50', '60:40', '70:30'];
const gapOptions: Gap[] = ['none', 'small', 'normal', 'large'];
const mobileOptions: MobileMode[] = ['stack', 'keep-split', 'reverse'];

const SplitDemo = () => {
  const [ratio, setRatio] = useState<Ratio>('50:50');
  const [gap, setGap] = useState<Gap>('normal');
  const [mobile, setMobile] = useState<MobileMode>('stack');
  const [resizable, setResizable] = useState(false);

  const codeString = `
<Split
  ratio="${ratio}"
  gap="${gap}"
  mobile="${mobile}"
  resizable={${resizable}}
>
  <Left>
    <div className="p-4 bg-red-500 text-white rounded">Left Content</div>
  </Left>
  <Right>
    <div className="p-4 bg-yellow-500 text-white rounded">Right Content</div>
  </Right>
</Split>`;

  return (
    <Tabs>
      <TabItem value="preview" label="Preview" default>
        <div className="space-y-6">
          <div className="flex flex-wrap gap-4 mb-4 justify-end">
            <VariantSelector
              variants={ratioOptions}
              selectedVariant={ratio}
              onSelectVariant={(value) => setRatio(value as Ratio)}
              type="Ratio"
            />
            <VariantSelector
              variants={gapOptions}
              selectedVariant={gap}
              onSelectVariant={(value) => setGap(value as Gap)}
              type="Gap"
            />
            <VariantSelector
              variants={mobileOptions}
              selectedVariant={mobile}
              onSelectVariant={(value) => setMobile(value as MobileMode)}
              type="Mobile"
            />
          </div>

          <div className="flex gap-6 mb-6 justify-end">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={resizable}
                onChange={(e) => setResizable(e.target.checked)}
                className="rounded text-blue-600"
              />
              <span className="ml-2 text-sm">Resizable</span>
            </label>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="text-sm font-medium mb-3">Preview</h3>
            <Split
              ratio={ratio}
              gap={gap}
              mobile={mobile}
              resizable={resizable}
            >
              <Left>
                <div className="p-4 bg-red-500 text-white rounded">Left Content</div>
              </Left>
              <Right>
                <div className="p-4 bg-yellow-500 text-white rounded">Right Content</div>
              </Right>
            </Split>
          </div>
        </div>
      </TabItem>

      <TabItem value="code" label="Code">
        <CodeBlock language="tsx">{codeString.trim()}</CodeBlock>
      </TabItem>
    </Tabs>
  );
};

export default SplitDemo;
