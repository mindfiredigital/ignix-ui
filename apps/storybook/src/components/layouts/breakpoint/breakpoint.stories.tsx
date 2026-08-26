import type { Meta, StoryObj } from "@storybook/react-vite";
import { Breakpoint } from "./index";

const meta: Meta<typeof Breakpoint> = {
  title: "Layouts/Breakpoint",
  component: Breakpoint,
  tags: ["autodocs"],
  argTypes: {
    show: {
      control: { type: "select" },
      options: ["mobile", "tablet", "desktop"],
    },
    hide: {
      control: { type: "select" },
      options: ["mobile", "tablet", "desktop"],
    },
    from: {
      control: { type: "select" },
      options: ["mobile", "tablet", "desktop"],
    },
    to: {
      control: { type: "select" },
      options: ["mobile", "tablet", "desktop"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Breakpoint>;

export const ShowMobile: Story = {
  args: {
    show: "mobile",
  },
  render: (args) => (
    <Breakpoint {...args}>
      <p>This content is conditionally rendered based on the viewport size.</p>
    </Breakpoint>
  ),
};

export const HideDesktop: Story = {
  args: {
    hide: "desktop",
  },
  render: (args) => (
    <Breakpoint {...args}>
      <p>This content is conditionally rendered based on the viewport size.</p>
    </Breakpoint>
  ),
};

export const FromTabletToDesktop: Story = {
  args: {
    from: "tablet",
    to: "desktop",
  },
  render: (args) => (
    <Breakpoint {...args}>
      <p>This content is conditionally rendered based on the viewport size.</p>
    </Breakpoint>
  ),
};

export const CustomRange: Story = {
  args: {
    from: "mobile",
    to: "tablet",
  },
  render: (args) => (
    <Breakpoint {...args}>
      <p>This content is conditionally rendered based on the viewport size.</p>
    </Breakpoint>
  ),
};