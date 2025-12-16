import type { Meta, StoryObj } from "@storybook/react-vite";
import { SettingsPage } from ".";

const meta: Meta = {
  title: "Templates/Pages/AccountManagement/Settings",
  component: SettingsPage,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Implement a Settings Page in the CLI that allows users to customize their experience, including language, theme, timezone, notification defaults, privacy options, and data export.",
      },
    },
  },
  args: {
    variant: {
      control: "select",
      options: ["light", "dark", "auto"],
      description: "Visual theme",
    },
    animation: {
      control: "select",
      options: ["fadeUp", "scaleIn", "slideLeft", "slideRight", "flipIn"],
      description: "Animation Variant" 
    },
  }
}

export default meta

type Story = StoryObj<typeof SettingsPage>;

// -------------------------------------
// STORIES
// -------------------------------------
export const Basic: Story = {
  args: {
    variant: "dark"
  }
};

