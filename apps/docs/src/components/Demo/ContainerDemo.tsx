import React, { useState } from 'react';
import { Container } from '../UI/layout/container';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import { cn } from '@site/src/utils/cn';
import { ContainerSize, ContainerPadding, MaxWidth } from '../UI/layout/container';
import VariantSelector from './VariantSelector';

const sizeOptions = ['small', 'normal', 'large', 'readable', 'full'];
const paddingOptions = ['none', 'small', 'normal', 'large', 'xl'];
const maxWidthOptions = ['sm', 'md', 'lg', 'xl', 'full'];

const ContainerDemo = () => {
  const [size, setSize] = useState<ContainerSize>('normal');
  const [padding, setPadding] = useState<ContainerPadding>('normal');
  const [maxWidth, setMaxWidth] = useState<MaxWidth>('lg');
  const [center, setCenter] = useState(true);
  const [responsive, setResponsive] = useState(true);
  const [showBorder, setShowBorder] = useState(true);

  const codeString = `
<Container
  size="${size}"
  padding="${padding}"
  maxWidth="${maxWidth}"
  center={${center}}
  responsive={${responsive}}
  className="${showBorder ? 'border border-gray-200' : ''}"
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
            <VariantSelector
              variants={maxWidthOptions}
              selectedVariant={maxWidth}
              onSelectVariant={(value) => setMaxWidth(value as MaxWidth)}
              type="Max Width"
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
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={showBorder}
                onChange={(e) => setShowBorder(e.target.checked)}
                className="rounded text-blue-600"
              />
              <span className="ml-2 text-sm">Show Border</span>
            </label>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="text-sm font-medium mb-3">Preview</h3>
            <div className={showBorder ? 'p-4 border border-dashed border-border rounded' : 'p-4'}>
              <Container
                size={size}
                padding={padding}
                maxWidth={maxWidth}
                center={center}
                responsive={responsive}
                className={cn(
                  'bg-gray-50 rounded transition-all duration-200',
                  showBorder && 'border border-gray-200'
                )}
              >
                <div className="text-center">
                  <p className="font-medium text-lg mb-2 text-gray-800">Container Preview</p>
                  <p className="text-sm text-gray-600 mb-4">
                    The container size is set to <span className="font-bold">{size}</span>. This affects the
                    maximum width of the content area.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white">
                    <div className="bg-blue-500 p-4 rounded-lg">
                      <h4 className="font-bold">Column 1</h4>
                      <p className="text-sm">This content is inside the container.</p>
                    </div>
                    <div className="bg-green-500 p-4 rounded-lg">
                      <h4 className="font-bold">Column 2</h4>
                      <p className="text-sm">It will be constrained by the container's size.</p>
                    </div>
                    <div className="bg-red-500 p-4 rounded-lg">
                      <h4 className="font-bold">Column 3</h4>
                      <p className="text-sm">Resize the browser to see responsive behavior.</p>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-gray-500">
                    <p>
                      Current props: padding: <span className="font-medium">{padding}</span>,
                      maxWidth: <span className="font-medium">{maxWidth}</span>, center:{' '}
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
