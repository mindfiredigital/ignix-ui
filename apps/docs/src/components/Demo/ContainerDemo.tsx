import React, { useState } from 'react';
import { Container } from '../UI/container';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import { cn } from '@site/src/utils/cn';
import { ContainerSize, ContainerPadding } from '../UI/container';
import VariantSelector from './VariantSelector';

const sizeOptions = ['small', 'normal', 'large', 'readable', 'full'];
const paddingOptions = ['none', 'small', 'normal', 'large', 'xl'];

const ContainerDemo = () => {
  const [size, setSize] = useState<ContainerSize>('normal');
  const [padding, setPadding] = useState<ContainerPadding>('normal');
  const [center, setCenter] = useState(true);
  const [responsive, setResponsive] = useState(true);

  const codeString = `
import { Container } from '@ignix-ui/container';

<Container
  size="${size}"
  padding="${padding}"
  center={${center}}
  responsive={${responsive}}
>
  {/* Your content here */}
</Container>`;

  return (
    <Tabs>
      <TabItem value="preview" label="Preview" default>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4 mb-6 justify-start md:justify-end">
            <VariantSelector
              variants={sizeOptions}
              selectedVariant={size}
              onSelectVariant={(value) => setSize(value as ContainerSize)}
              type="Size"
            />
            <VariantSelector
              variants={paddingOptions}
              selectedVariant={padding}
              onSelectVariant={(value) => setPadding(value as ContainerPadding)}
              type="Padding"
            />
          </div>

          <div className="flex flex-wrap gap-4 mb-6 justify-start md:justify-end">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={center}
                onChange={(e) => setCenter(e.target.checked)}
                className="rounded text-blue-600"
              />
              <span className="ml-2 text-sm">Center</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={responsive}
                onChange={(e) => setResponsive(e.target.checked)}
                className="rounded text-blue-600"
              />
              <span className="ml-2 text-sm">Responsive</span>
            </label>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="text-sm font-medium mb-3">Preview</h3>
            <div className="p-4 border-border rounded">
              <Container
                size={size}
                padding={padding}
                center={center}
                responsive={responsive}
                className={cn(
                  'bg-gray-50 border border-border rounded transition-all duration-200',
                )}
              >
                <div className="text-center">
                  <p className="font-medium text-lg mb-2 text-gray-800">Container Preview</p>
                  <p className="text-sm text-gray-600 mb-4">
                    The container size is set to <span className="font-bold">{size}</span>. This affects the
                    maximum width of the content area.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white">
                    <div className="bg-red-500 p-4 rounded-lg">
                      <h4 className="font-bold">Column 1</h4>
                      <p className="text-sm">This content is inside the container.</p>
                    </div>
                    <div className="bg-orange-500 p-4 rounded-lg">
                      <h4 className="font-bold">Column 2</h4>
                      <p className="text-sm">It will be constrained by the container's size.</p>
                    </div>
                    <div className="bg-yellow-500 p-4 rounded-lg">
                      <h4 className="font-bold">Column 3</h4>
                      <p className="text-sm">Resize the browser to see responsive behavior.</p>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-gray-500">
                    <p>
                      Current props: padding: <span className="font-medium">{padding}</span>,
                      center:{' '}
                      <span className="font-medium">{center ? 'Yes' : 'No'}</span>, responsive:{' '}
                      <span className="font-medium">{responsive ? 'Yes' : 'No'}</span>
                    </p>
                  </div>
                </div>
              </Container>
            </div>
          </div>
        </div>
      </TabItem>

      <TabItem value="code" label="Code">
        <CodeBlock language="tsx">{codeString.trim()}</CodeBlock>
      </TabItem>
    </Tabs>
  );
};

export default ContainerDemo;
