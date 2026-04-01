import React, { useState } from "react";
import AppShell from "../UI/app-shell";
import VariantSelector from "./VariantSelector";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import CodeBlock from "@theme/CodeBlock";

const AppShellDemo = () => {
  const [navigation, setNavigation] = useState("side");
  const [responsive, setResponsive] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState("normal");
  const [theme, setTheme] = useState("modern");

  const navigationOptions = ["top", "side"];
  const sidebarWidthOptions = ["narrow", "normal", "wide"];
  const responsiveOptions = ["true", "false"];
  const themeOptions = [
    "light",
    "dark",
    "corporate",
    "ocean",
    "forest",
    "solarized",
    "modern",
  ];

  const menu = [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Analytics', href: '/analytics' },
        { label: 'Settings', href: '/settings' },
      ];

  const topMenuItems = (
    <nav className="flex space-x-4">
      <a
        href="#"
        className="!text-gray-300 hover:text-gray-900 hover:no-underline"
      >
        Dashboard
      </a>
      <a
        href="#"
        className="!text-gray-300 hover:text-gray-900 hover:no-underline"
      >
        Analytics
      </a>
      <a
        href="#"
        className="!text-gray-300 hover:text-gray-900 hover:no-underline"
      >
        Settings
      </a>
    </nav>
  );

  const brand = (
    <h2 className="text-base font-bold text-white md:text-gray-900 !mb-0 !me-4 ">My App</h2>
  );

  const user = (
    <div className="flex items-center space-x-2">
      <div className="w-8 h-8 bg-purple-500 rounded-full flex justify-center items-center"><span className='text-white'>U</span></div>
      <h2 className="!text-lg pt-4 !font-normal hidden md:block text-gray-700 dark:text-gray-200">
        User Name
      </h2>
    </div>
  );

  const codeString = `
import AppShell from '@ignix-ui/appshell';
import Logo from './components/Logo';
import UserProfile from './components/UserProfile';
import NavItems from './components/NavItems';

<AppShell
  navigation="${navigation}"
  responsive={${responsive}}
  sidebarWidth="${sidebarWidth}"
  theme="${theme}"
  brand={<Logo />}
  menu={<NavItems />}
  user={<UserProfile />}
>
  <div className="p-6">
    <h2 className="text-2xl font-semibold">Welcome to the Dashboard</h2>
    <p className="mt-2 text-gray-600">This is the main content area of your application.</p>
  </div>
</AppShell>
`;

  return (
    <div className="space-y-6 mb-8">
      {/* Variant selectors */}
      <div className="flex flex-wrap gap-4 justify-start sm:justify-end">
        {/* Navigation */}
        <VariantSelector
          variants={navigationOptions}
          selectedVariant={navigation}
          onSelectVariant={setNavigation}
          type="Navigation"
        />

        {/* Responsive */}
        <VariantSelector
          variants={responsiveOptions}
          selectedVariant={String(responsive)}
          onSelectVariant={(val) => setResponsive(val === "true")}
          type="Responsive"
        />

        {/* Sidebar Width */}
        {navigation === "side" && (
          <VariantSelector
            variants={sidebarWidthOptions}
            selectedVariant={sidebarWidth}
            onSelectVariant={setSidebarWidth}
            type="Sidebar Width"
          />
        )}

        {/* Theme */}
        <VariantSelector
          variants={themeOptions}
          selectedVariant={theme}
          onSelectVariant={setTheme}
          type="Theme"
        />
      </div>

      {/* Tabs for preview/code */}
      <Tabs>
        <TabItem value="preview" label="Preview" default>
          <div className="border p-6 rounded-lg overflow-hidden h-[420px]">
            <AppShell
              key={`${navigation}-${responsive}-${sidebarWidth}-${theme}`}
              navigation={navigation as "top" | "side" | "bottom" | "drawer"}
              responsive={responsive}
              sidebarWidth={sidebarWidth as "narrow" | "normal" | "wide"}
              theme={
                theme as
                | "light"
                | "dark"
                | "corporate"
                | "ocean"
                | "forest"
                | "solarized"
                | "glass"
                | "modern"
              }
              brand={brand}
              menu={navigation === "top" ? topMenuItems : menu}
              user={user}
              footer={
                <h2 className="p-1 !text-base text-center text-gray-800 dark:text-gray-600">© 2025 My App</h2>
              }
            >
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                  Welcome to the Dashboard
                </h2>
                
                
              </div>
            </AppShell>
          </div>
        </TabItem>

        <TabItem value="code" label="Code">
          <div className="mt-4">
            <CodeBlock language="tsx" className="text-sm">
              {codeString}
            </CodeBlock>
          </div>
        </TabItem>
      </Tabs>
    </div>
  );
};

export default AppShellDemo;
