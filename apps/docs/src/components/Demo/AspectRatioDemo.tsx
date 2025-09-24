import React, { useState } from 'react';
import { AspectRatio } from '@site/src/components/UI/aspect-ratio';
import VariantSelector from './VariantSelector';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import image from "../../../static/img/demo-img.jpg"

const ratios = ['1:1', '4:3', '16:9', '21:9', '3:2'];
const maxWidths = ['200px', '400px', '600px', '800px'];

const AspectRatioDemo = () => {
  const [ratio, setRatio] = useState('16:9');
  const [maxWidth, setMaxWidth] = useState('400px');

  const codeString = `
    <AspectRatio ratio="${ratio}" maxWidth="${maxWidth}">
    <img src={image} alt="Demo Image" />
    </AspectRatio>
    `;

  return (
    <div className="space-y-6 mb-8">
      <div className="flex flex-wrap gap-4 justify-start sm:justify-end">
        <div>
          <label className="block text-sm font-medium mb-1">Ratio</label>
          <div className="flex gap-2 items-center">
            <VariantSelector
              variants={ratios}
              selectedVariant={ratio}
              onSelectVariant={setRatio}
              type="Ratio"
            />
            <input
              type="text"
              placeholder="Custom (e.g., 5:4)"
              value={ratios.includes(ratio) ? '' : ratio}
              onChange={(e) => setRatio(e.target.value)}
              className="border border-input rounded px-2 py-2 text-sm mb-4"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Max Width</label>
          <div className="flex gap-2 items-center">
            <VariantSelector
              variants={maxWidths}
              selectedVariant={maxWidth}
              onSelectVariant={setMaxWidth}
              type="Max Width"
            />
            <input
              type="text"
              placeholder="Custom (e.g., 500px)"
              value={maxWidths.includes(maxWidth) ? '' : maxWidth}
              onChange={(e) => setMaxWidth(e.target.value)}
              className="border border-input rounded px-2 py-2 text-sm mb-4"
            />
          </div>
        </div>
      </div>

      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="p-6 border rounded-lg mt-4 flex justify-center">
            <AspectRatio ratio={ratio} maxWidth={maxWidth}>
              <img
                src={image}
                alt="Demo Image"
                className="object-cover w-full h-full"
              />
            </AspectRatio>
          </div>
        </TabItem>
        <TabItem value="code" label="Code">
          <CodeBlock language="tsx" className="mt-4 text-sm">
            {codeString}
          </CodeBlock>
        </TabItem>
      </Tabs>
    </div>
  );
};

export default AspectRatioDemo;
