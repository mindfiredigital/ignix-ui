
import React, { useState } from 'react';
import { Tooltip } from '@site/src/components/UI/tooltip';
import VariantSelector from './VariantSelector';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

const tooltipAnimations = ['fade', 'scale', 'slideUp', 'slideDown', 'slideLeft', 'slideRight'];
const tooltipBgs = ['dark', 'light', 'slate', 'default', 'transparent', 'glass', 'gradient', 'primary'];
const tooltipRounded = ['sm', 'md', 'full'];

const TooltipDemo = () => {
  const [animation, setAnimation] = useState('fade');
  const [bg, setBg] = useState('dark');
  const [rounded, setRounded] = useState('sm');

  const codeString = `
<Tooltip
  content="This is a tooltip"
  animation="${animation}"
  bg="${bg}"
  rounded="${rounded}"
>
  <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
    Hover me
  </button>
</Tooltip>
`;

  return (
    <div className="flex flex-col space-y-4 mb-8">
      <div className="flex flex-wrap gap-4">
        <VariantSelector
          variants={tooltipAnimations}
          selectedVariant={animation}
          onSelectVariant={setAnimation}
        />
        <VariantSelector variants={tooltipBgs} selectedVariant={bg} onSelectVariant={setBg} type="bg" />
        <VariantSelector
          variants={tooltipRounded}
          selectedVariant={rounded}
          onSelectVariant={setRounded}
          type="rounded"
        />
      </div>
      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="w-full p-8 rounded-lg border flex items-center justify-center mt-4">
            <Tooltip
              content="This is a tooltip"
              animation={animation as any}
              bg={bg as any}
              rounded={rounded as any}
            >
              <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                Hover me
              </button>
            </Tooltip>
          </div>
        </TabItem>
        <TabItem value="code" label="Code">
          <CodeBlock language="tsx">{codeString}</CodeBlock>
        </TabItem>
      </Tabs>
    </div>
  );
};

export default TooltipDemo;
