import React, { useState } from 'react';
import { Drawer } from '@site/src/components/UI/drawer';
import VariantSelector from './VariantSelector';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import { Button } from '@site/src/components/UI/button';

const positionVariants = [
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' },
  { value: 'top', label: 'Top' },
  { value: 'bottom', label: 'Bottom' },
];

const animationVariants = [
  { value: 'slide', label: 'Slide' },
  { value: 'reveal', label: 'Reveal' },
  { value: 'fade', label: 'Fade' },
  { value: 'hinge', label: 'Hinge' },
  { value: 'zoom', label: 'Zoom' },
  { value: 'flip', label: 'Flip' },
];

const sizeVariants = [
  { value: '300px', label: 'Small (300px)' },
  { value: '400px', label: 'Medium (400px)' },
  { value: '500px', label: 'Large (500px)' },
  { value: '600px', label: 'Extra Large (600px)' },
];

const DrawerDemo = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState('right');
  const [animationType, setAnimationType] = useState('slide');
  const [size, setSize] = useState('350px');

  const codeString = `
<Drawer
  isOpen={${isOpen}}
  onClose={() => setIsOpen(false)}
  position="${position}"
  animationType="${animationType}"
  size="${size}"
  title="Drawer Title"
  footer={<div>Footer Content</div>}
>
  <div className="p-4">
    <h3 className="text-lg font-semibold mb-4">Drawer Content</h3>
    <p className="mb-4">
      This is the main content area of the drawer. You can put any content here.
    </p>
    <div className="space-y-2">
      <Button variant="outline" size="sm">Action 1</Button>
      <Button variant="outline" size="sm">Action 2</Button>
      <Button variant="default" size="sm">Primary Action</Button>
    </div>
  </div>
</Drawer>
`;

  const drawerContent = (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Drawer Content</h3>
      <p className="mb-4">
        This is the main content area of the drawer. You can put any content here including forms, lists, or other components.
      </p>
      <div className="space-y-2">
        <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>Close Drawer</Button>
        <Button variant="outline" size="sm">Action 1</Button>
        <Button variant="outline" size="sm">Action 2</Button>
        <Button variant="default" size="sm">Primary Action</Button>
      </div>
    </div>
  );

  const drawerFooter = (
    <div className="flex justify-end gap-2 p-2">
      <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>Cancel</Button>
      <Button variant="default" size="sm" onClick={() => setIsOpen(false)}>Save</Button>
    </div>
  );

  return (
    <div className="space-y-6 mb-8">
      <div className="flex flex-wrap gap-4 justify-start sm:justify-end">
        <VariantSelector
          variants={positionVariants.map(v => v.value)}
          selectedVariant={position}
          onSelectVariant={setPosition}
          type="Position"
        />
        <VariantSelector
          variants={animationVariants.map(v => v.value)}
          selectedVariant={animationType}
          onSelectVariant={setAnimationType}
          type="Animation"
        />
        <VariantSelector
          variants={sizeVariants.map(v => v.value)}
          selectedVariant={size}
          onSelectVariant={setSize}
          type="Size"
        />
      </div>
      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="relative border rounded-lg overflow-hidden p-8">
            <div className="text-center mb-6">
              <p className="pb-2">Click the button above to open the drawer</p>
              <Button variant="default" size="sm" onClick={() => setIsOpen(true)}>
                Open Drawer
              </Button>
            </div>
          </div>
        </TabItem>
        <TabItem value="code" label="Code">
          <CodeBlock language="tsx" className="whitespace-pre-wrap max-h-[500px] overflow-y-scroll">
            {codeString}
          </CodeBlock>
        </TabItem>
      </Tabs>

      <Drawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        position={position as 'left' | 'right' | 'top' | 'bottom'}
        animationType={animationType as 'slide' | 'reveal' | 'fade' | 'hinge' | 'zoom' | 'flip'}
        size={size}
        title="Drawer Demo"
        footer={drawerFooter}
      >
        {drawerContent}
      </Drawer>
    </div>
  );
};

export default DrawerDemo;
