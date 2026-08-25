import type { Meta, StoryObj } from "@storybook/react-vite";
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
    placeholder: <div className="h-[200px] bg-neutral-100 flex items-center justify-center text-sm text-neutral-500">Loading...</div>,
    once: true,
    animation: "fade",
  },
  render: (args) => (
    <LazyLoad {...args}>
      <div className="h-[200px] bg-neutral-300 flex items-center justify-center">
        Loaded Content
      </div>
    </LazyLoad>
  ),
};

export const SlideAnimation: Story = {
  args: {
    threshold: "50px",
    placeholder: <div className="h-[200px] bg-neutral-100 flex items-center justify-center text-sm text-neutral-500">Loading...</div>,
    once: false,
    animation: "slide",
  },
  render: (args) => (
    <LazyLoad {...args}>
      <div className="h-[200px] bg-neutral-300 flex items-center justify-center">
        Loaded Content
      </div>
    </LazyLoad>
  ),
};