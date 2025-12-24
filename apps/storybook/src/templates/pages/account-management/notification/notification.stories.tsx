import type { Meta, StoryObj } from "@storybook/react-vite";
import { NotificationPage } from ".";

const meta: Meta<typeof NotificationPage> = {
  title: "Templates/Pages/AccountManagement/Notification",
  component: NotificationPage,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Notification preferences page showing email, push, and SMS notification toggles, frequency selection (real-time, daily, weekly), notification type preferences (marketing, updates, alerts), and unsubscribe all option.",
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

type Story = StoryObj<typeof NotificationPage>;

export const Default: Story = {
  args: {
    variant: "dark",
    title: "Notifications",
    description:
      "Manage your notification preferences and stay informed about what matters to you.",
    layout: "grid",
  },
};

export const Light: Story = {
  args: {
    variant: "light",
    title: "Notifications",
    description:
      "Manage your notification preferences and stay informed about what matters to you.",
    layout: "grid",
  },
};

export const AutoTheme: Story = {
  args: {
    variant: "auto",
    title: "Notifications",
    description:
      "Auto theme adapts to the current system or app theme while keeping all notification controls available.",
    layout: "grid",
  },
};

export const ListView: Story = {
  args: {
    variant: "dark",
    title: "Notifications (list view)",
    description:
      "List / accordion variant where each notification section is collapsible for compact layouts.",
    layout: "list",
  },
};

