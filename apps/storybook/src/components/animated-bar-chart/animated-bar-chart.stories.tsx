import type { Meta, StoryObj } from "@storybook/react";
import { AnimatedBarChart } from "./index";

const meta: Meta<typeof AnimatedBarChart> = {
  title: "Components/Charts/AnimatedBarChart",
  component: AnimatedBarChart,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
The **AnimatedBarChart** renders staggered, animated SVG bar charts. It supports single-data mode with per-bar colors, grouped multi-series layouts, value labels, hover effects, and all four theme variants.
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "dark", "glass", "minimal"],
    },
    showXLabels: { control: "boolean" },
    showYLabels: { control: "boolean" },
    showGrid: { control: "boolean" },
    showValues: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof AnimatedBarChart>;

const monthlyData = [
  { label: "Jan", value: 3200, color: "#6366f1" },
  { label: "Feb", value: 4100, color: "#8b5cf6" },
  { label: "Mar", value: 5800, color: "#ec4899" },
  { label: "Apr", value: 4700, color: "#10b981" },
  { label: "May", value: 6900, color: "#f59e0b" },
  { label: "Jun", value: 7200, color: "#3b82f6" },
];

const groupedSeries = [
  {
    name: "Online",
    color: "#6366f1",
    data: [
      { label: "Q1", value: 12000 },
      { label: "Q2", value: 18000 },
      { label: "Q3", value: 15000 },
      { label: "Q4", value: 22000 },
    ],
  },
  {
    name: "In-Store",
    color: "#10b981",
    data: [
      { label: "Q1", value: 9000 },
      { label: "Q2", value: 11000 },
      { label: "Q3", value: 14000 },
      { label: "Q4", value: 16000 },
    ],
  },
];

export const Default: Story = {
  args: {
    data: monthlyData,
    title: "Monthly Revenue",
    subtitle: "Jan – Jun 2024",
    variant: "default",
    showValues: false,
  },
};

export const WithValueLabels: Story = {
  args: {
    data: monthlyData,
    title: "Monthly Revenue",
    subtitle: "With value annotations",
    variant: "default",
    showValues: true,
  },
};

export const Grouped: Story = {
  args: {
    data: [],
    series: groupedSeries,
    title: "Quarterly Sales",
    subtitle: "Online vs In-Store",
    variant: "default",
    showLegend: true,
  },
};

export const DarkVariant: Story = {
  args: {
    data: monthlyData,
    title: "Monthly Revenue",
    subtitle: "Dark theme",
    variant: "dark",
  },
  decorators: [
    (Story): React.ReactElement => (
      <div className="p-6 bg-neutral-950 rounded-3xl">
        <Story />
      </div>
    ),
  ],
};

export const GlassVariant: Story = {
  args: {
    data: monthlyData,
    title: "Monthly Revenue",
    subtitle: "Glassmorphic theme",
    variant: "glass",
  },
  decorators: [
    (Story): React.ReactElement => (
      <div className="p-6 bg-gradient-to-br from-black via-red-950 to-neutral-900 rounded-3xl">
        <Story />
      </div>
    ),
  ],
};

export const MinimalVariant: Story = {
  args: {
    data: monthlyData,
    title: "Monthly Revenue",
    variant: "minimal",
    showGrid: false,
  },
};
