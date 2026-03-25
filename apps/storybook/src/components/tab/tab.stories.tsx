import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tabs } from "./index";

const meta: Meta<typeof Tabs> = {
  title: "Components/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A tab strip built with Framer Motion for smooth active indicator transitions." 
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["underline", "filled", "pill", "outline", "ghost", "shadow", "gradient", "glow", "block"],
      description: "Visual style of the tab strip.",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    theme: {
      control: "select",
      options: ["light", "dark", "glass", "glassDark", "glassLight", "glassGradient", "glassGradientDark"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

const options = ["Home", "Profile", "Settings", "About"];

export const Underline: Story = {
  args: { options, variant: "underline" },
};

export const Filled: Story = {
  args: { options, variant: "filled" },
};

export const Pill: Story = {
  args: { options, variant: "pill" },
};

export const Outline: Story = {
  args: { options, variant: "outline" },
};

export const Ghost: Story = {
  args: { options, variant: "ghost" },
};

export const Shadow: Story = {
  args: { options, variant: "shadow" },
};

export const Gradient: Story = {
  args: { options, variant: "gradient" },
};

export const Glow: Story = {
  args: { options, variant: "glow" },
};

export const AllVariants: Story = {
  name: "All variants",
  render: () => (
    <div className="flex flex-col gap-6">
      {(["underline", "filled", "pill", "outline", "ghost", "shadow", "gradient", "glow", "block"] as const).map((v) => (
        <div key={v}>
          <p className="text-xs text-muted-foreground mb-2">{v}</p>
          <Tabs options={options} variant={v} />
        </div>
      ))}
    </div>
  ),
};

export const Controlled: Story = {
  name: "Controlled (with callback)",
  render: () => {
    const [selected, setSelected] = useState(0);
    return (
      <div className="flex flex-col gap-4">
        <Tabs options={options} variant="underline" selected={selected} value={setSelected} />
        <p className="text-sm text-muted-foreground">Active tab index: <strong>{selected}</strong></p>
      </div>
    );
  },
};
