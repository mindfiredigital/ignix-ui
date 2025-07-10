
import React, { useState } from 'react';
import { Navbar } from '@site/src/components/UI/navbar';
import { Button } from '@site/src/components/UI/button';
import VariantSelector from './VariantSelector';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

const navbarVariants = ['default', 'dark', 'glass', 'gradient'];
const navbarAnimations = ['slide', 'glow', 'spotlight', 'hoverSubmenu', 'clickSubmenu'];

const NavbarDemo = () => {
  const [variant, setVariant] = useState('default');
  const [animation, setAnimation] = useState('slide');

  const codeString = `
<Navbar variant="${variant}" animationType="${animation}">
  <div className="flex gap-4">
    <Button>Home</Button>
    <Button>About</Button>
    <Button>Contact</Button>
  </div>
</Navbar>
`;

  return (
    <div className="flex flex-col space-y-4 mb-8">
      <div className="flex flex-wrap gap-4">
        <VariantSelector
          variants={navbarVariants}
          selectedVariant={variant}
          onSelectVariant={setVariant}
          type="variant"
        />
        <VariantSelector
          variants={navbarAnimations}
          selectedVariant={animation}
          onSelectVariant={setAnimation}
          type="animation"
        />
      </div>
      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="p-4 border rounded-lg mt-4">
            <Navbar variant={variant as any} animationType={animation as any}>
              <div className="flex gap-4">
                <Button>Home</Button>
                <Button>About</Button>
                <Button>Contact</Button>
              </div>
            </Navbar>
          </div>
        </TabItem>
        <TabItem value="code" label="Code">
          <CodeBlock language="tsx">{codeString}</CodeBlock>
        </TabItem>
      </Tabs>
    </div>
  );
};

export default NavbarDemo;
