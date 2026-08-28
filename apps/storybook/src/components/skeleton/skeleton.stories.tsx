import type { Meta, StoryObj } from "@storybook/react-vite";
import { Skeleton } from "./index";

const meta: Meta<typeof Skeleton> = {
  title: "Components/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
The **Skeleton** component is a placeholder indicator used to show page loading outlines.

### Features
- Support for circular, text, and rectangular variants.
- Premium animated shimmer movement overlay, pulse fading, or static modes.
- Multiple color themes (default gray, primary blue, and soft muted).
- Easily customizable sizing.
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["text", "circular", "rectangular"],
      description: "Visual variant / shape of the skeleton",
    },
    width: {
      control: "text",
      description: "Custom width (number or string)",
    },
    height: {
      control: "text",
      description: "Custom height (number or string)",
    },
    animation: {
      control: "select",
      options: ["shimmer", "pulse", "none"],
      description: "Type of loading animation to apply",
    },
    colorTheme: {
      control: "select",
      options: ["default", "primary", "muted"],
      description: "Color theme styling used for background",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
  args: {
    variant: "rectangular",
    width: "100%",
    height: 100,
    animation: "shimmer",
    colorTheme: "default",
  },
};

export const PulseAnimation: Story = {
  args: {
    variant: "rectangular",
    width: "100%",
    height: 100,
    animation: "pulse",
    colorTheme: "default",
  },
};

export const PrimaryTheme: Story = {
  args: {
    variant: "rectangular",
    width: "100%",
    height: 100,
    animation: "shimmer",
    colorTheme: "primary",
  },
};



export const Circular: Story = {
  args: {
    variant: "circular",
    width: 60,
    height: 60,
    animation: "shimmer",
    colorTheme: "default",
  },
};

export const TextLine: Story = {
  args: {
    variant: "text",
    width: "100%",
    height: 16,
    animation: "shimmer",
    colorTheme: "default",
  },
};

export const ComplexLayout: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-6 max-w-sm border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50 shadow-sm">
      <div className="flex items-center gap-4">
        <Skeleton variant="circular" width={48} height={48} animation="shimmer" />
        <div className="flex flex-col gap-2 flex-1">
          <Skeleton variant="text" width="60%" height={16} animation="shimmer" />
          <Skeleton variant="text" width="40%" height={12} animation="shimmer" />
        </div>
      </div>
      <Skeleton variant="rectangular" width="100%" height={120} animation="shimmer" />
      <div className="flex flex-col gap-2">
        <Skeleton variant="text" width="100%" height={14} animation="shimmer" />
        <Skeleton variant="text" width="85%" height={14} animation="shimmer" />
      </div>
    </div>
  ),
};
