import React, { useState } from "react";
import VariantSelector from "./VariantSelector";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import CodeBlock from "@theme/CodeBlock";
import { SettingsPage } from "../UI/setting-page";
import { SideBarLeftLayout } from "../UI/sidebarleft-layout";
import { Navbar } from "../UI/navbar";
import { Sidebar } from "../UI/sidebar";
import { BookOpen, Home, Settings } from "lucide-react";

const dialogAnimations = ["popIn", "springPop", "backdropZoom", "flip3D", "skewSlide", "glassBlur", "skyDrop"]

const dropDownAnimations = ["default", "fade", "scale", "slide", "flip"]

const switchAnimations = ["default", "bounce", "scale", "rotate", "fade", "elastic", "pulse", "shake", "flip", "jelly", "glow"]

const animationVariants = ["none", "fade", "slide", "scale", "spring", "stagger"]

const SettingsPageBasicDemo = () => {

  const codeString = `
  <I18nProvider
    value={{
      language,
      setLanguage,
      t,
      onLanguageChange: loadLanguage,
    }}
  >
    <SettingsPage/>
  </I18nProvider>
`;
 
  return (
    <div className="space-y-8 mb-8">
      {/* Demo */}
      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="border rounded-lg overflow-hidden">
              {/* Basic RadioGroup */}
              <SettingsPage/>
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


const SettingsPageDemo = () => {
  const [dialogAnimation, setDialogAnimation] = useState("popIn");
  const [dropDownAnimation, setDropDownAnimation] = useState("fade");
  const [switchAnimation, setSwitchAnimation] = useState("bounce");
  const [animationVariant, setAnimationVariant] = useState("fade");

  const codeString = `
  <SettingsPage
    dialogAnimation= "${dialogAnimation}" 
    dropDownAnimation= "${dropDownAnimation}"
    switchAnimation= "${switchAnimation}"
    animationVariant= "${animationVariant}"
    languages={[{ code: "en", name: "English", native: "English" },
    { code: "de", name: "German", native: "Deutsch" },
    { code: "ja", name: "Japanese", native: "日本語" }, { code: "hi", name: "Hindi", native: "Hindi" }]}
    notificationOptions={[
      { id: "email", label: "Email Notification", defaultChecked: true },
      { id: "push", label: "Push Notification" },
    ]}
    privacyOptions={[
      { id: "everyone", label: "Everyone", defaultChecked: true },
      { id: "contact", label: "Contact" },
      { id: "nobody", label: "Nobody" },
    ]}
  />
`;
 
  return (
    <div className="space-y-8 mb-8">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 justify-start sm:justify-end">

        <div className="space-y-2">
          <VariantSelector
            variants={dialogAnimations}
            selectedVariant={dialogAnimation}
            onSelectVariant={setDialogAnimation}
            type="Dialog Box Animation"
          />
        </div>

         <div className="space-y-2">
          <VariantSelector
            variants={dropDownAnimations}
            selectedVariant={dropDownAnimation}
            onSelectVariant={setDropDownAnimation}
            type="DropDown Animation"
          />
        </div>
        
        <div className="space-y-2">
          <VariantSelector
            variants={switchAnimations}
            selectedVariant={switchAnimation}
            onSelectVariant={setSwitchAnimation}
            type="Switch Button Animation"
          />
        </div>

        <div className="space-y-2">
          <VariantSelector
            variants={animationVariants}
            selectedVariant={animationVariant}
            onSelectVariant={setAnimationVariant}
            type="Animation Variant for Setting Page"
          />
        </div>
      </div>
      {/* Demo */}
      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="border rounded-lg overflow-hidden">
              {/* Basic RadioGroup */}
              <SettingsPage
                dialogAnimation= {dialogAnimation as any}
                dropDownAnimation= {dropDownAnimation as any}
                animationVariant= {animationVariant as any}
                switchAnimation={switchAnimation as any}
                languages={[{ code: "en", name: "English", native: "English" },
                { code: "de", name: "German", native: "Deutsch" },
                { code: "ja", name: "Japanese", native: "日本語" }, { code: "hi", name: "Hindi", native: "Hindi" }]}
                notificationOptions={[
                  { id: "email", label: "Email Notification", defaultChecked: true },
                  { id: "push", label: "Push Notification" },
                ]}
                onNotificationChange={(id, checked) => {
                  console.log(`Notification ${id} changed to`, checked);
                }}
                onNotificationsChange={(all) => {
                  fetch("/api/preferences", {
                    method: "POST",
                    body: JSON.stringify(all),
                  });
                }}
                privacyOptions={[
                  { id: "everyone", label: "Everyone", defaultChecked: true },
                  { id: "contact", label: "Contact" },
                  { id: "nobody", label: "Nobody" },
                ]}
                onPrivacyChange={(id, checked) => {
                  console.log(`Privacy ${id} changed to`, checked);
                }}
                onPrivacysChange={(all) => {
                  fetch("/api/preferences", {
                    method: "POST",
                    body: JSON.stringify(all),
                  });
                }}
              />
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

const SettingsPageDemoWithLayout = () => {
  const navItems = [
    { label: "Dashboard", href: "#", icon:  Home },
    { label: "Pages", href: "#", icon: BookOpen},
    { label: "Settings", href: "#", icon: Settings},
  ];

  const codeString = `
  <SideBarLeftLayout
    variant="default"
    sidebarWidth="default"
    mobileBreakpoint="md"
    sidebarPosition="left"
    header={
      <Navbar variant="default" size="md">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <img
              src="/ignix-ui/img/logo.png" // use your logo path
              alt="Brand Logo"
              className="w-6 h-6"
            />
            <h1 className="text-lg font-bold tracking-tight">Ignix</h1>
            <nav className="flex space-x-4">
            <a href="#" className="hover:text-primary">Home</a>
            <a href="#" className="hover:text-primary">About</a>
            <a href="#" className="hover:text-primary">Contact</a>
            </nav>
          </div>
        </div>
      </Navbar>
    }
    sidebar={
        <Sidebar
          links={navItems}
          brandName="SIDEBAR"
          position="left"
          variant="default"
          style={{
            height: "calc(100dvh - var(--header-h) - var(--footer-h))",
            width: "270px",
          }}
        />
    }
  footer={
    <footer className="py-4 text-center text-muted-foreground">
    © 2025 My Application. All rights reserved.
    </footer>
  }>
  <I18nProvider
    value={{
      language,
      setLanguage,
      t,
      onLanguageChange: loadLanguage,
    }}
  >
    <SettingsPage/>
  </I18nProvider>
  </SideBarLeftLayout>
`;
 
  return (
    <div className="space-y-8 mb-8">
      {/* Demo */}
      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="border rounded-lg overflow-hidden bg-background">
              {/* Basic RadioGroup */}
              <SideBarLeftLayout
                variant="default"
                sidebarWidth="default"
                mobileBreakpoint="md"
                sidebarPosition="left"
                header={
                  <Navbar variant="default" size="md">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <img
                          src="/ignix-ui/img/logo.png" // use your logo path
                          alt="Brand Logo"
                          className="w-6 h-6"
                        />
                        <h1 className="text-lg font-bold tracking-tight">Ignix</h1>
                        <nav className="flex space-x-4">
                        <a href="#" className="hover:text-primary">Home</a>
                        <a href="#" className="hover:text-primary">About</a>
                        <a href="#" className="hover:text-primary">Contact</a>
                        </nav>
                      </div>
                    </div>
                  </Navbar>
                }
                sidebar={
                    <Sidebar
                      links={navItems}
                      brandName="SIDEBAR"
                      position="left"
                      variant="default"
                      style={{
                        height: "calc(100dvh - var(--header-h) - var(--footer-h))",
                        width: "270px",
                      }}
                    />
                }
              footer={
                <footer className="py-4 text-center text-muted-foreground">
                © 2025 My Application. All rights reserved.
                </footer>
              }>
              <SettingsPage/>
              </SideBarLeftLayout>
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

export { SettingsPageBasicDemo, SettingsPageDemo, SettingsPageDemoWithLayout }

