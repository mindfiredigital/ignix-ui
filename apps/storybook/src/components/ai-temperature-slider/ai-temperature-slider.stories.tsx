import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { AITemperatureSlider } from "./index";

const meta: Meta<typeof AITemperatureSlider> = {
  title: "Components/AI/AITemperatureSlider",
  component: AITemperatureSlider,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
The **AITemperatureSlider** is an interactive range selector for model generation settings. It builds directly on the project's premium custom \`Slider\` component. Features include clickable quick presets (Precise, Balanced, Creative) and visual color descriptions to warn the user about hallucination risks at higher values.
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "dark", "glass"],
    },
    showPresets: {
      control: "boolean",
    },
    showRiskIndicator: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof AITemperatureSlider>;

export const Default: Story = {
  args: {
    defaultValue: 0.7,
    variant: "default",
    showPresets: true,
    showRiskIndicator: true,
  },
};

export const WithoutPresets: Story = {
  args: {
    defaultValue: 0.2,
    variant: "default",
    showPresets: false,
    showRiskIndicator: true,
  },
};

export const WithoutRiskIndicator: Story = {
  args: {
    defaultValue: 1.2,
    variant: "default",
    showPresets: true,
    showRiskIndicator: false,
  },
};

export const DarkTheme: Story = {
  args: {
    defaultValue: 0.7,
    variant: "dark",
    showPresets: true,
    showRiskIndicator: true,
  },
};

export const Glassmorphic: Story = {
  args: {
    defaultValue: 0.7,
    variant: "glass",
    showPresets: true,
    showRiskIndicator: true,
  },
  decorators: [
    (Story) => (
      <div className="p-8 rounded-2xl bg-gradient-to-br from-black via-red-950 to-neutral-900 max-w-md">
        <Story />
      </div>
    ),
  ],
};

const SliderStateSimulator = () => {
  const [val, setVal] = useState(0.7);

  return (
    <div className="flex flex-col space-y-4 max-w-sm">
      <AITemperatureSlider
        value={val}
        onChange={(newVal) => setVal(newVal)}
      />
    </div>
  );
};

export const InteractiveState: Story = {
  render: () => <SliderStateSimulator />,
};
