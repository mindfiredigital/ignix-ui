import React, { useState } from 'react';
import VariantSelector from './VariantSelector';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import { HomeIcon, GearIcon, PersonIcon, QuestionMarkCircledIcon, DashboardIcon, BarChartIcon, FaceIcon, LockClosedIcon } from '@radix-ui/react-icons';
import { SidebarProvider, Sidebar } from '@site/src/components/UI/sidebar';

const sidebarVariants = ['default', 'dark', 'light', 'glass', 'gradient', 'dropdown'];
const sidebarPositions = ['left', 'right'];

const dropdownLinks = [
  {
    label: 'Home',
    href: '#',
    icon: HomeIcon,
    children: 
    [
      { label: 'Dashboard', href: '#', icon: DashboardIcon },
      { label: 'Analytics', href: '#', icon: BarChartIcon },
    ],
  },
  { 
    label: 'Profile', 
    href: '#', 
    icon: PersonIcon, 
    children: 
    [
      { label: 'Account', href: '#', icon: FaceIcon },
    ],
  },
  {
    label: 'Settings',
    href: '#',
    icon: GearIcon,
    children: 
    [
      { label: 'General',  href: '#', icon: GearIcon },
      { label: 'Security', href: '#', icon: LockClosedIcon },
    ],
  },
  { 
    label: 'Help', 
    href: '#', 
    icon: QuestionMarkCircledIcon,
    children: 
    [
      { label: 'Contact',  href: '#', icon: QuestionMarkCircledIcon },
    ],
  },
];

const plainLinks = [
  { label: 'Home',     href: '#', icon: HomeIcon },
  { label: 'Profile',  href: '#', icon: PersonIcon },
  { label: 'Settings', href: '#', icon: GearIcon },
  { label: 'Help',     href: '#', icon: QuestionMarkCircledIcon },
];

const SidebarDemo = () => {
  const [variant, setVariant] = useState('default');
  const [position, setPosition] = useState('left');

  const isDropdown = variant === 'dropdown';

  const codeString = isDropdown ? `
import { Sidebar, SidebarProvider } from '@ignix-ui/sidebar';
import {
  HomeIcon,
  DashboardIcon,
  BarChartIcon,
  PersonIcon,
  FaceIcon,
  GearIcon,
  LockClosedIcon,
  InfoCircledIcon,
  QuestionMarkCircledIcon
} from "@radix-ui/react-icons";
  
function Example(){
  return (
    <SidebarProvider>
      <Sidebar
        variant="dropdown"
        links={[
          {
            label: 'Home',
            href: '#',
            icon: HomeIcon,
            children: [
              { label: 'Dashboard', href: '#', icon: DashboardIcon },
              { label: 'Analytics', href: '#', icon: BarChartIcon },
            ],
          },
          { label: 'Profile', 
            href: '#', 
            icon: PersonIcon, 
            children: [
              { label: 'Account', href: '#', icon: FaceIcon },
            ],
          },
          {
            label: 'Settings',
            href: '#',
            icon: GearIcon,
            children: [
              { label: 'General',  href: '#', icon: GearIcon },
              { label: 'Security', href: '#', icon: LockClosedIcon },
            ],
          },
          { 
            label: 'Help', 
            href: '#', 
            icon: QuestionMarkCircledIcon,
            children: [
              { label: 'Contact',  href: '#', icon: InfoCircledIcon },
            ],
          },
        ]}
        brandName="Demo App"
        position="${position}"
      />
    </SidebarProvider>
  );
}
` : `
import { Sidebar, SidebarProvider } from '@ignix-ui/sidebar';
import {
  HomeIcon,
  PersonIcon,
  GearIcon,
  QuestionMarkCircledIcon,
} from "@radix-ui/react-icons";

function Example(){
  return (
    <SidebarProvider>
      <Sidebar
        links={[
          { label: 'Home',     href: '#', icon: HomeIcon },
          { label: 'Profile',  href: '#', icon: PersonIcon },
          { label: 'Settings', href: '#', icon: GearIcon },
          { label: 'Help',     href: '#', icon: QuestionMarkCircledIcon },
        ]}
      brandName="Demo App"
      variant="${variant}"
      position="${position}"
      />
    </SidebarProvider>
  );
}
`;

  return (
    <SidebarProvider>
      <div className="flex flex-col space-y-4 mb-8">
        <div className="flex flex-wrap gap-4 sm:justify-end justify-start">
          <VariantSelector
            variants={sidebarVariants}
            selectedVariant={variant}
            onSelectVariant={setVariant}
            type="Variant"
          />
          <VariantSelector
            variants={sidebarPositions}
            selectedVariant={position}
            onSelectVariant={setPosition}
            type="Position"
          />
        </div>
        <Tabs>
          <TabItem value="preview" label="Preview">
            <div className="w-full h-[400px] relative border rounded-lg overflow-hidden bg-slate-100 shadow-lg mt-4">
              <div className="w-full h-8 bg-gray-200 flex items-center px-2 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm text-gray-600 ml-2">Demo Window</span>
              </div>
              <div className="relative h-[calc(100%-2rem)] bg-background/90 scrollbar-hidden">
                <Sidebar
                  links={isDropdown ? dropdownLinks : plainLinks}
                  brandName="Demo App"
                  variant={variant as any}
                  position={position as any}
                />
              </div>
            </div>
          </TabItem>
          <TabItem value="code" label="Code">
            <CodeBlock language="tsx">{codeString}</CodeBlock>
          </TabItem>
        </Tabs>
      </div>
    </SidebarProvider>
  );
};

export default SidebarDemo;
