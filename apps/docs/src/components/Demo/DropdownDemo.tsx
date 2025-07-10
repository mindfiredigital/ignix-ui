
import React, { useState } from 'react';
import { Dropdown, DropdownItem } from '@site/src/components/UI/dropdown';
import { Button } from '@site/src/components/UI/button';
import VariantSelector from './VariantSelector';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

const dropdownAnimations = ['default', 'fade', 'scale', 'slide', 'flip'];
const dropdownBgs = ['default', 'dark', 'glass', 'transparent', 'gradient', 'primary'];

const DropdownDemo = () => {
  const [animation, setAnimation] = useState('default');
  const [bg, setBg] = useState('default');

  const codeString = `
<Dropdown
  trigger={<Button>Open Menu</Button>}
  animation="${animation}"
  bg="${bg}"
>
  <DropdownItem>Profile</DropdownItem>
  <DropdownItem>Settings</DropdownItem>
  <DropdownItem>Logout</DropdownItem>
</Dropdown>
`;

  return (
    <div className="flex flex-col space-y-4 mb-8">
      <div className="flex flex-wrap gap-4">
        <VariantSelector
          variants={dropdownAnimations}
          selectedVariant={animation}
          onSelectVariant={setAnimation}
          type="animation"
        />
        <VariantSelector variants={dropdownBgs} selectedVariant={bg} onSelectVariant={setBg} type="bg" />
      </div>
      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="p-4 border rounded-lg mt-4">
            <Dropdown
              trigger={<Button>Open Menu</Button>}
              animation={animation as any}
              bg={bg as any}
            >
              <DropdownItem>Profile</DropdownItem>
              <DropdownItem>Settings</DropdownItem>
              <DropdownItem>Logout</DropdownItem>
            </Dropdown>
          </div>
        </TabItem>
        <TabItem value="code" label="Code">
          <CodeBlock language="tsx">{codeString}</CodeBlock>
        </TabItem>
      </Tabs>
    </div>
  );
};

export default DropdownDemo;
