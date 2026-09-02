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

export const Persistent: Story = {
  name: "Persistent (survives refresh)",
  render: () => (
    <div className="flex flex-col gap-4">
      <Tabs options={options} variant="underline" />
      <p className="text-sm text-muted-foreground">
        The selected tab is always saved to localStorage under a key derived from <code>options</code> - reload this story and it stays selected. No prop needed.
      </p>
    </div>
  ),
};

export const IndependentInstances: Story = {
  name: "Independent instances (custom storageKey)",
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs text-muted-foreground mb-2">storageKey=&quot;left-tabs&quot;</p>
        <Tabs options={options} variant="underline" storageKey="left-tabs" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-2">storageKey=&quot;right-tabs&quot;</p>
        <Tabs options={options} variant="underline" storageKey="right-tabs" />
      </div>
      <p className="text-sm text-muted-foreground">
        Both share the same <code>options</code>, so without a <code>storageKey</code> they'd persist to the same default key and stay in sync. Giving each an explicit <code>storageKey</code> keeps their remembered selection independent.
      </p>
    </div>
  ),
};
