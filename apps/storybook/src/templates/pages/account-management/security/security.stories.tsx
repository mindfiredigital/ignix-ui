import type { Meta, StoryObj } from "@storybook/react-vite";
import { SecurityPage } from ".";

const meta: Meta<typeof SecurityPage> = {
  title: "Templates/Pages/AccountManagement/Security",
  component: SecurityPage,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Account Security page showing change password form, active sessions list, logout-all control, login activity log, two-factor authentication toggle, and recovery codes management.",
      },
    },
  },
  argTypes: {
    title: {
      control: { type: "text" },
      description: "Page heading text",
    },
    description: {
      control: { type: "text" },
      description: "Short description under the heading",
    },
    variant: {
      control: { type: "select" },
      options: ["light", "dark", "auto"],
      description: "Background theme variant",
    },
    layout: {
      control: { type: "select" },
      options: ["grid", "list"],
      description: "Layout variant: grid sections or list (accordion) view",
    },
  },
};

export default meta;

type Story = StoryObj<typeof SecurityPage>;

export const Default: Story = {
  args: {
    variant: "dark",
    title: "Security",
    description:
      "Manage account security, sessions, two-factor authentication and recovery options in one place.",
    layout: "grid",
  },
};

export const Light: Story = {
  args: {
    variant: "light",
    title: "Security",
    description:
      "Manage account security, sessions, two-factor authentication and recovery options in one place.",
    layout: "grid",
  },
};

export const AutoTheme: Story = {
  args: {
    variant: "auto",
    title: "Security",
    description:
      "Auto theme adapts to the current system or app theme while keeping all security controls available.",
    layout: "grid",
  },
};

export const ListView: Story = {
  args: {
    variant: "dark",
    title: "Security (list view)",
    description:
      "List / accordion variant where each security section is collapsible for compact layouts.",
    layout: "list",
  },
};


