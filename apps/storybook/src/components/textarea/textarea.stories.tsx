import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import AnimatedTextarea from "./index";

const meta: Meta<typeof AnimatedTextarea> = {
  title: "Components/Textarea",
  component: AnimatedTextarea,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A fully animated textarea with floating label, auto-resize, character count, " +
          "and visual variants driven by Framer Motion.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 560, margin: "15px" }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "clean", "expandable", "smoothExpand", "glowBorder", "characterCount",
        "lineHighlight", "typewriterSound", "markdownPreview", "autoComplete",
        "syntaxHighlight", "rippleEffect", "gradientBorder", "neonGlow",
        "particleField", "elastic", "wave", "spotlight", "liquid", "cosmic", "hologram",
      ],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    disabled: { control: "boolean" },
    showCharacterCount: { control: "boolean" },
    autoResize: { control: "boolean" },
    glowEffect: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof AnimatedTextarea>;

const Controlled = (props: Omit<React.ComponentProps<typeof AnimatedTextarea>, "value" | "onChange">) => {
  const [value, setValue] = useState("");
  return <AnimatedTextarea {...props} value={value} onChange={setValue} />;
};

export const Clean: Story = {
  render: () => <Controlled variant="clean" placeholder="Your message" />,
};

export const Expandable: Story = {
  render: () => <Controlled variant="expandable" placeholder="Type to expand..." autoResize />,
};

export const GlowBorder: Story = {
  name: "Glow border",
  render: () => <Controlled variant="glowBorder" placeholder="Focus me" />,
};

export const CharacterCount: Story = {
  name: "Character count",
  render: () => (
    <Controlled
      variant="characterCount"
      placeholder="140-character limit"
      maxLength={140}
      showCharacterCount
    />
  ),
};

export const NeonGlow: Story = {
  name: "Neon glow",
  render: () => <Controlled variant="neonGlow" placeholder="Neon mode" />,
};

export const GradientBorder: Story = {
  name: "Gradient border",
  render: () => <Controlled variant="gradientBorder" placeholder="Gradient border" />,
};

export const Cosmic: Story = {
  render: () => <Controlled variant="cosmic" placeholder="Cosmic input" />,
};

export const Wave: Story = {
  render: () => <Controlled variant="wave" placeholder="Wave motion" />,
};

export const Disabled: Story = {
  render: () => <Controlled variant="clean" placeholder="Disabled textarea" disabled />,
};

export const Hologram: Story = {
  name: "Hologram",
  render: () => <Controlled variant="hologram" placeholder="Hologram" />,
};

export const Elastic: Story = {
  name: "Elastic",
  render: () => <Controlled variant="elastic" placeholder="Elastic" />,
};

export const RippleEffect: Story = {
    name: "Ripple Effect",
    render: () => <Controlled variant="rippleEffect" placeholder="Ripple effect" />, 
}

export const AllVariants: Story = {
  name: "All variants",
  render: () => (
    <div className="flex flex-col gap-10">
      {([  'clean',
            'glowBorder',
            'neonGlow',
            'expandable',
            'characterCount',
            'lineHighlight',
            'syntaxHighlight',
            'particleField',
            'wave',
            'spotlight',
            'liquid',
            'cosmic',
            'hologram',
            'elastic',
            'rippleEffect',
            'gradientBorder',
        ] as const).map((v) => (
        <div key={v}>
          <Controlled variant={v} placeholder={v} />
        </div>
      ))}
    </div>
  ),
};
