import type { Meta, StoryObj } from "@storybook/react-vite";
import { SettingsPage } from "./index";
// import {
//   Palette,
//   Languages,
//   Clock,
//   Bell,
//   Shield,
//   Database,
//   Settings,
//   Download,
//   BellIcon,
//   ShieldAlert,
//   Globe,
//   type LucideIcon,
// } from "lucide-react";

const meta: Meta<typeof SettingsPage> = {
  title: "Templates/Pages/Account Management/Settings",
  component: SettingsPage,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Implement a Settings Page that allows users to customize language, theme, timezone, notifications, privacy options, and data export.",
      },
    },
  },
  // argTypes: {
  //   theme: {
  //     control: "select",
  //     options: ["light", "dark", "auto"],
  //     description: "Visual theme",
  //   },
  //   dialogAnimation: {
  //     control: "select",
  //     options: ["popIn", "springPop", "backdropZoom", "flip3D", "skewSlide", "glassBlur", "skyDrop"],
  //     description: "Animation For Dialog Down"
  //   },
  //   dropDownAnimation: {
  //     control: "select",
  //     options: ["default", "fade", "scale", "slide", "flip"],
  //     description: "Animation For Dialog Down"
  //   },
  //   switchAnimation: {
  //     control: "select",
  //     options: ["default", "bounce", "scale", "rotate", "fade", "elastic", "pulse", "shake", "flip", "jelly", "glow"],
  //     description: "Animation For Switch Button"
  //   },
  //   animationVariant: {
  //     control: "select",
  //     options: ["none", "fade", "slide", "scale", "spring", "stagger"],
  //     description: "Animation For Settings Page"
  //   },
  // },
};

export default meta;

type Story = StoryObj<typeof SettingsPage>;

export const Default: Story = {
  render: () => {
    return (
      <SettingsPage
        title= "Settings"
    //     sidebarItems={[ { label: "General", icon: Settings, id: "general" },
    // { label: "Appearance", icon: Palette, id: "appearance" },
    // { label: "Time & Locale", icon: Clock, id: "timezone" },
    // { label: "Notifications", icon: Bell, id: "notifications" },
    // { label: "Privacy", icon: Shield, id: "privacy" },
    // { label: "Data Management", icon: Database, id: "data" }]}
        
        // notificationOptions={[
        //   { id: "email", label: "Email Notification", defaultChecked: true },
        //   { id: "push", label: "Push Notification" },
        // ]}
        // onNotificationChange={(id, checked) => {
        //   console.log(`Notification ${id} changed to`, checked);
        // }}
        // onNotificationsChange={(all) => {
        //   fetch("/api/preferences", {
        //     method: "POST",
        //     body: JSON.stringify(all),
        //   });
        // }}
      />
    )
  }
};

// export const Animation: Story = {
//   args: {
//     dialogAnimation: "flip3D",
//     dropDownAnimation: "scale"
//   }
// };

// export const CardAnimation: Story = {
//   args: {
//     animationVariant: "slide"
//   }
// };
