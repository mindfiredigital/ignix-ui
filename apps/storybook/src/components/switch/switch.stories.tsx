import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Switch } from "./index";

const meta: Meta<typeof Switch> = {
  title: "Components/Switch",
  component: Switch,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A Radix UI switch with rich Framer Motion thumb animations." 
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "large", "small", "pill", "square", "slim", "ios", "material"],
      description: "Visual shape and size of the switch track and thumb.",
    },
    animation: {
      control: "select",
      options: ["default", "bounce", "scale", "rotate", "fade", "elastic", "pulse", "shake", "flip", "jelly", "glow"],
      description: "Framer Motion animation applied to the thumb on state change.",
    },
    glowEffect: {
      control: "boolean",
      description: "Radial glow halo behind the switch when checked.",
    },
    disabled: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

const Labeled = ({
  label,
  ...props
}: React.ComponentProps<typeof Switch> & { label: string }) => (
  <label className="flex items-center gap-3 cursor-pointer select-none">
    <Switch {...props} />
    <span className="text-sm">{label}</span>
  </label>
);

export const Default: Story = {
  args: { variant: "default", animation: "default" },
  render: (args) => {
    const [checked, setChecked] = useState(false);
    return (
      <Labeled
        {...args}
        checked={checked}
        onCheckedChange={setChecked}
        label={checked ? "On" : "Off"}
      />
    );
  },
};

export const IOS: Story = {
  args: { variant: "ios", animation: "elastic" },
  render: (args) => {
    const [checked, setChecked] = useState(true);
    return (
      <Labeled
        {...args}
        checked={checked}
        onCheckedChange={setChecked}
        label="iOS style"
      />
    );
  },
};

export const Material: Story = {
  args: { variant: "material", animation: "default" },
  render: (args) => {
    const [checked, setChecked] = useState(false);
    return (
      <Labeled {...args} checked={checked} onCheckedChange={setChecked} label="Material" />
    );
  },
};

export const Square: Story = {
  args: { variant: "square", animation: "shake" },
  render: (args) => {
    const [checked, setChecked] = useState(false);
    return (
      <Labeled {...args} checked={checked} onCheckedChange={setChecked} label="Square + shake" />
    );
  },
};

const VariantSwitch = ({ variant }: { variant: string }) => {
  const [checked, setChecked] = useState(false);
  return (
    <Labeled
      variant={variant as any}
      checked={checked}
      onCheckedChange={setChecked}
      label={variant}
    />
  );
};

export const AllVariants: Story = {
  name: "All variants",
  render: () => {
    const variants = ["default", "large", "small", "pill", "square", "slim", "ios", "material"] as const;
    return (
      <div className="flex flex-col gap-4">
        {variants.map((variant) => (
           <VariantSwitch key={variant} variant={variant} />
        ))}
      </div>
    );
  },
};

const AnimationSwitch = ({ animation }: { animation: string }) => {
  const [checked, setChecked] = useState(false);
  return (
    <Labeled
      animation={animation as any}
      checked={checked}
      onCheckedChange={setChecked}
      label={animation}
    />
  );
};

export const AllAnimations: Story = {
  name: "All animations",
  render: () => {
    const anims = ["default", "bounce", "scale", "rotate", "fade", "elastic", "pulse", "shake", "flip", "jelly", "glow"] as const;
    return (
      <div className="grid grid-cols-2 gap-4">
        {anims.map((animation) => (
          <AnimationSwitch key={animation} animation={animation} />
        ))}
      </div>
    );
  },
};

export const GlowEffect: Story = {
  name: "Glow effect",
  args: { variant: "default", animation: "glow", glowEffect: true },
  render: (args) => {
    const [checked, setChecked] = useState(true);
    return (
      <Labeled {...args} checked={checked} onCheckedChange={setChecked} label="Glow on" />
    );
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <div className="flex flex-col gap-3">
      <Labeled {...args} checked={false} label="Disabled (off)" />
      <Labeled {...args} checked={true} label="Disabled (on)" />
    </div>
  ),
};
