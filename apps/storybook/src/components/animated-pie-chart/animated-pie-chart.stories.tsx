import type { Meta, StoryObj } from "@storybook/react";
import { AnimatedPieChart } from "./index";

const meta: Meta<typeof AnimatedPieChart> = {
  title: "Components/Charts/AnimatedPieChart",
  component: AnimatedPieChart,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
The **AnimatedPieChart** renders animated SVG pie and donut charts. Each slice animates in individually with a spring effect, supports hover scaling, interactive legend, percentage labels, and custom center labels in donut mode.
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "dark", "glass", "minimal"],
    },
    showLegend: { control: "boolean" },
    showPercentages: { control: "boolean" },
    donutRatio: { control: { type: "range", min: 0, max: 0.8, step: 0.05 } },
    radius: { control: { type: "number", min: 60, max: 150 } },
  },
};

export default meta;
type Story = StoryObj<typeof AnimatedPieChart>;

const browserData = [
  { label: "Chrome", value: 63.4 },
  { label: "Safari", value: 19.7 },
  { label: "Firefox", value: 4.1 },
  { label: "Edge", value: 3.9 },
  { label: "Other", value: 8.9 },
];

const revenueData = [
  { label: "Product A", value: 44000, color: "#6366f1" },
  { label: "Product B", value: 31000, color: "#ec4899" },
  { label: "Product C", value: 21000, color: "#10b981" },
  { label: "Services", value: 12000, color: "#f59e0b" },
];

export const Default: Story = {
  args: {
    data: browserData,
    title: "Browser Market Share",
    subtitle: "Global usage — Q2 2024",
    variant: "default",
    showLegend: true,
    showPercentages: false,
  },
};

export const WithPercentages: Story = {
  args: {
    data: browserData,
    title: "Browser Market Share",
    subtitle: "With percentage labels",
    variant: "default",
    showLegend: true,
    showPercentages: true,
  },
};

export const DonutChart: Story = {
  args: {
    data: revenueData,
    title: "Revenue Breakdown",
    subtitle: "By product category",
    variant: "default",
    donutRatio: 0.55,
    centerLabel: "$108K",
    centerSubLabel: "Total Revenue",
    showLegend: true,
    showPercentages: false,
  },
};

export const DarkVariant: Story = {
  args: {
    data: revenueData,
    title: "Revenue Breakdown",
    subtitle: "Dark theme",
    variant: "dark",
    donutRatio: 0.55,
    centerLabel: "$108K",
    centerSubLabel: "Total",
    showLegend: true,
  },
  decorators: [
    (Story) => (
      <div className="p-6 bg-neutral-950 rounded-3xl">
        <Story />
      </div>
    ),
  ],
};

export const GlassVariant: Story = {
  args: {
    data: browserData,
    title: "Browser Market Share",
    subtitle: "Glassmorphic theme",
    variant: "glass",
    showLegend: true,
    showPercentages: true,
  },
  decorators: [
    (Story) => (
      <div className="p-6 bg-gradient-to-br from-black via-red-950 to-neutral-900 rounded-3xl">
        <Story />
      </div>
    ),
  ],
};

export const MinimalVariant: Story = {
  args: {
    data: browserData,
    title: "Browser Share",
    variant: "minimal",
    showLegend: true,
    showPercentages: false,
  },
};
