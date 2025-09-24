import React, { useState } from 'react';
import { HeaderLayout } from '@site/src/components/UI/header-layout';
import { Button } from '@site/src/components/UI/button';
import VariantSelector from './VariantSelector';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import { Navbar } from '@site/src/components/UI/navbar';
import { Sidebar } from '@site/src/components/UI/sidebar';

const layoutVariants = ['default', 'dark', 'light', 'glass', 'gradient'];
const sidebarPositions = ['left', 'right'];
const mobileBreakpoints = ['sm', 'md', 'lg'];

const HeaderLayoutDemo = () => {
  const [variant, setVariant] = useState('default');
  const [sidebarPosition, setSidebarPosition] = useState('left');
  const [mobileBreakpoint, setMobileBreakpoint] = useState('md');
  const navItems = [
  { label: "Dashboard", href: "#", icon: () => <div className="w-5 h-5 bg-blue-500 rounded" /> },
  { label: "Projects", href: "#", icon: () => <div className="w-5 h-5 bg-green-500 rounded" /> },
  { label: "Team", href: "#", icon: () => <div className="w-5 h-5 bg-purple-500 rounded" /> },
  { label: "Settings", href: "#", icon: () => <div className="w-5 h-5 bg-orange-500 rounded" /> },
];

  const mainContent = (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h2 className="text-2xl font-bold mb-4">Welcome to Header Layout</h2>
        <p className="text-gray-600 mb-4">
          This is a demonstration of the HeaderLayout component with various configuration options.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Features</h3>
            <ul className="text-sm space-y-1 text-gray-700">
              <li>• Responsive sidebar with mobile support</li>
              <li>• Configurable animations and transitions</li>
              <li>• Sticky header and footer options</li>
              <li>• Multiple layout variants</li>
            </ul>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Configuration</h3>
            <ul className="text-sm space-y-1 text-gray-700">
              <li>• Variant: {variant}</li>
              <li>• Sidebar Position: {sidebarPosition}</li>
              <li>• Mobile Breakpoint: {mobileBreakpoint}</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Interactive Demo</h3>
        <p className="text-gray-600 mb-4">
          Try resizing the browser window to see the responsive behavior in action.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">Action 1</Button>
          <Button variant="outline" size="sm">Action 2</Button>
          <Button variant="default" size="sm">Primary Action</Button>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Content Area</h3>
        <p className="text-gray-600">
          This is the main content area. The HeaderLayout component provides a flexible layout system
          with a header, sidebar, and footer that can be configured in various ways.
        </p>
      </div>
    </div>
  );

  const codeString = `
<HeaderLayout
  variant="${variant}"
  sidebarPosition="${sidebarPosition}"
  mobileBreakpoint="${mobileBreakpoint}"
header={
  <Navbar variant={variant as any} size="md">
    <div className="flex items-center space-x-4">
      <nav className="flex space-x-4">
        <a className="hover:text-primary cursor-pointer">Home</a>
        <a className="hover:text-primary cursor-pointer">About</a>
        <a className="hover:text-primary cursor-pointer">Contact</a>
      </nav>
    </div>
  </Navbar>
}
sidebar={
<Sidebar
  links={navItems}
  brandName="App"
  variant={variant as any}
/>
}
footer={
<footer className="py-4 text-center text-muted-foreground">
© 2024 My Application. All rights reserved.
</footer>
}
variant={variant as any}
sidebarPosition={sidebarPosition as any}
animation={animation as any}
mobileBreakpoint={mobileBreakpoint as any}
>
{mainContent}
</HeaderLayout>`;

  return (
    <div className="space-y-6 mb-8">
      <div className="flex flex-wrap gap-4 justify-start sm:justify-end">
        <VariantSelector
          variants={layoutVariants}
          selectedVariant={variant}
          onSelectVariant={setVariant}
          type="Variant"
        />
        <VariantSelector
          variants={sidebarPositions}
          selectedVariant={sidebarPosition}
          onSelectVariant={setSidebarPosition}
          type="Sidebar Position"
        />
        <VariantSelector
          variants={mobileBreakpoints}
          selectedVariant={mobileBreakpoint}
          onSelectVariant={setMobileBreakpoint}
          type="Mobile Breakpoint"
        />
      </div>
      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="border rounded-lg overflow-hidden">
            <HeaderLayout
              header={
                <Navbar variant={variant as any} size="md">
                  <div className="flex items-center space-x-4">
                    <nav className="flex space-x-4">
                      <a className="hover:text-primary cursor-pointer">Home</a>
                      <a className="hover:text-primary cursor-pointer">About</a>
                      <a className="hover:text-primary cursor-pointer">Contact</a>
                    </nav>
                  </div>
                </Navbar>
              }
              sidebar={
                <Sidebar
                  links={navItems}
                  brandName="App"
                  variant={variant as any}
                />
              }
              footer={
                <footer className="py-4 text-center text-muted-foreground">
                  © 2024 My Application. All rights reserved.
                </footer>
              }
              variant={variant as any}
              sidebarPosition={sidebarPosition as any}
              mobileBreakpoint={mobileBreakpoint as any}
            >
              {mainContent}
            </HeaderLayout>
          </div>
        </TabItem>
        <TabItem value="code" label="Code">
          <CodeBlock language="tsx" className="whitespace-pre-wrap max-h-[500px] overflow-y-scroll">
            {codeString}
          </CodeBlock>
        </TabItem>
      </Tabs>
    </div>
  );
};

export default HeaderLayoutDemo;