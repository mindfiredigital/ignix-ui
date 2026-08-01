import type { Meta, StoryObj } from "@storybook/react";
import { LazyLoad } from "./index";

const meta: Meta<typeof LazyLoad> = {
  title: "Layouts/LazyLoad",
  component: LazyLoad,
  tags: ["autodocs"],
  argTypes: {
    threshold: {
      control: { type: "text" },
      defaultValue: "100px",
    },
    placeholder: {
      control: { type: "text" },
      defaultValue: "Loading...",
    },
    once: {
      control: { type: "boolean" },
      defaultValue: true,
    },
    animation: {
      control: { type: "select" },
      options: ["fade", "slide", "none"],
      defaultValue: "fade",
    },
  },
};

export default meta;
type Story = StoryObj<typeof LazyLoad>;

export const Default: Story = {
  args: {
    threshold: "100px",
    placeholder: <div style={{ height: "200px", background: "#eee" }}>Loading...</div>,
    once: true,
    animation: "fade",
  },
  render: (args) => (
    <LazyLoad {...args}>
      <div style={{ height: "200px", background: "#ccc", display: "flex", justifyContent: "center", alignItems: "center" }}>
        Loaded Content
      </div>
    </LazyLoad>
  ),
};

export const SlideAnimation: Story = {
  args: {
    threshold: "50px",
    placeholder: <div style={{ height: "200px", background: "#eee" }}>Loading...</div>,
    once: false,
    animation: "slide",
  },
  render: (args) => (
    <LazyLoad {...args}>
      <div style={{ height: "200px", background: "#ccc", display: "flex", justifyContent: "center", alignItems: "center" }}>
        Loaded Content
      </div>
    </LazyLoad>
  ),
};