/**
 * @file logo-clouds.stories.tsx
 * @description Storybook stories for the LogoClouds template. Covers the grid and
 * marquee layouts, headings, grayscale toggling, linked logos, and sizing.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { LogoClouds, type LogoCloudItem } from ".";

const meta: Meta<typeof LogoClouds> = {
  title: "Templates/Section/Content/Logo Clouds",
  component: LogoClouds,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A responsive 'trusted by' logo strip. Supports a static wrapped grid or a continuous, accessible marquee scroll, with grayscale-on-hover styling and optional linked logos.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["grid", "marquee"],
      description: "Static wrapped grid, or a continuously scrolling marquee",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Logo height",
    },
    grayscale: {
      control: "boolean",
      description: "Render logos in grayscale, restoring color on hover/focus",
    },
    bordered: {
      control: "boolean",
      description: "Add a top/bottom divider",
    },
    speed: {
      control: { type: "number", min: 5, max: 60 },
      description: "Seconds for one full marquee loop (marquee variant only)",
    },
    pauseOnHover: {
      control: "boolean",
      description: "Pause the marquee while hovered (marquee variant only)",
    },
  },
};

export default meta;

type Story = StoryObj<typeof LogoClouds>;

/** A simple wordmark placeholder so stories render instantly with no network calls. */
const Wordmark = ({ label }: { label: string }) => (
  <span className="flex h-8 items-center rounded-md bg-foreground/10 px-3 text-sm font-bold tracking-tight text-foreground">
    {label}
  </span>
);

const baseLogos: LogoCloudItem[] = [
  { id: "acme", name: "Acme Corp", icon: <Wordmark label="Acme" /> },
  { id: "globex", name: "Globex", icon: <Wordmark label="Globex" /> },
  { id: "initech", name: "Initech", icon: <Wordmark label="Initech" /> },
  { id: "umbrella", name: "Umbrella", icon: <Wordmark label="Umbrella" /> },
  { id: "soylent", name: "Soylent", icon: <Wordmark label="Soylent" /> },
  { id: "hooli", name: "Hooli", icon: <Wordmark label="Hooli" /> },
];

const linkedLogos: LogoCloudItem[] = baseLogos.map((logo) => ({
  ...logo,
  href: `https://example.com/${logo.id}`,
}));

export const Default: Story = {
  args: {
    logos: baseLogos,
    title: "Trusted by teams at",
  },
};

export const WithSubtitle: Story = {
  args: {
    logos: baseLogos,
    title: "Trusted by teams at",
    subtitle: "Join thousands of companies already building with Ignix UI",
  },
};

export const NoHeading: Story = {
  args: {
    logos: baseLogos,
  },
};

export const Marquee: Story = {
  args: {
    logos: baseLogos,
    variant: "marquee",
    title: "Trusted by teams at",
    size: "sm",
    subtitle: "",
    columns: {},
    grayscale: false,
    bordered: false,
    speed: 30,
    pauseOnHover: false,
    className: "",
    logoClassName: ""
  },
};

export const MarqueeFast: Story = {
  args: {
    logos: baseLogos,
    variant: "marquee",
    speed: 10,
    title: "Fast Scroll",
  },
};

export const MarqueeNoPauseOnHover: Story = {
  args: {
    logos: baseLogos,
    variant: "marquee",
    pauseOnHover: false,
    title: "Keeps Scrolling on Hover",
  },
};

export const FullColor: Story = {
  args: {
    logos: baseLogos,
    grayscale: false,
    title: "Full Color Logos",
  },
};

export const LinkedLogos: Story = {
  args: {
    logos: linkedLogos,
    title: "Click a logo to visit the brand",
  },
};

export const Bordered: Story = {
  args: {
    logos: baseLogos,
    bordered: true,
    title: "With Top/Bottom Divider",
  },
};

export const SmallLogos: Story = {
  args: {
    logos: baseLogos,
    size: "sm",
    title: "Compact Size",
  },
};

export const LargeLogos: Story = {
  args: {
    logos: baseLogos,
    size: "lg",
    title: "Large Size",
  },
};

export const TwoColumnGrid: Story = {
  args: {
    logos: baseLogos,
    columns: { mobile: 1, tablet: 2, desktop: 2 },
    title: "Two Column Grid",
  },
};

export const OnDarkBackground: Story = {
  args: {
    logos: baseLogos,
    title: "Trusted by teams at",
  },
  decorators: [
    (Story) => (
      <div className="bg-zinc-900">
        <Story />
      </div>
    ),
  ],
};
