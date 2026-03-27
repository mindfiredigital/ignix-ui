import type { Meta, StoryObj } from "@storybook/react";
import { Tooltip } from "./index";

const meta: Meta<typeof Tooltip> = {
  title: "Components/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    animation: {
      control: "select",
      options: ["fade", "scale", "slideUp", "slideDown", "slideLeft", "slideRight"],
    },
    bg: {
      control: "select",
      options: ["dark", "light", "slate", "default", "transparent", "glass", "gradient", "primary"],
    },
    rounded: {
      control: "select",
      options: ["sm", "md", "full"],
    },
    content: {
      control: "text",
    },
    className: {
      control: "text",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const BgDark: Story = {
  args: { content: "Dark tooltip", bg: "dark" },
  render: (args) => (
    <Tooltip {...args}>
      <button className="px-4 py-2 rounded-md bg-zinc-800 text-sm text-white hover:bg-zinc-700 transition-colors">
        bg: dark
      </button>
    </Tooltip>
  ),
};

export const BgLight: Story = {
  args: { content: "Light tooltip", bg: "light" },
  render: (args) => (
    <Tooltip {...args}>
      <button className="px-4 py-2 rounded-md bg-zinc-100 text-sm text-zinc-900 hover:bg-zinc-200 transition-colors border border-zinc-300">
        bg: light
      </button>
    </Tooltip>
  ),
};

export const BgSlate: Story = {
  args: { content: "Slate tooltip", bg: "slate" },
  render: (args) => (
    <Tooltip {...args}>
      <button className="px-4 py-2 rounded-md bg-slate-700 text-sm text-white hover:bg-slate-600 transition-colors">
        bg: slate
      </button>
    </Tooltip>
  ),
};

export const BgDefault: Story = {
  args: { content: "Default tooltip", bg: "default" },
  render: (args) => (
    <Tooltip {...args}>
      <button className="px-4 py-2 rounded-md bg-white text-sm text-gray-900 border border-gray-200 hover:bg-gray-50 transition-colors">
        bg: default
      </button>
    </Tooltip>
  ),
};

export const BgGlass: Story = {
  args: { content: "Glass tooltip", bg: "glass" },
  render: (args) => (
    <div className="p-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
      <Tooltip {...args}>
        <button className="px-4 py-2 rounded-md bg-white/20 text-sm text-white hover:bg-white/30 transition-colors backdrop-blur-sm border border-white/30">
          bg: glass
        </button>
      </Tooltip>
    </div>
  ),
};

export const BgGradient: Story = {
  args: { content: "Gradient tooltip", bg: "gradient" },
  render: (args) => (
    <Tooltip {...args}>
      <button className="px-4 py-2 rounded-md bg-gradient-to-r from-blue-500 to-purple-500 text-sm text-white hover:opacity-90 transition-opacity">
        bg: gradient
      </button>
    </Tooltip>
  ),
};

export const BgPrimary: Story = {
  args: { content: "Primary tooltip", bg: "primary" },
  render: (args) => (
    <Tooltip {...args}>
      <button className="px-4 py-2 rounded-md bg-blue-500 text-sm text-white hover:bg-blue-600 transition-colors">
        bg: primary
      </button>
    </Tooltip>
  ),
};

export const BgTransparent: Story = {
  args: { content: "Transparent tooltip", bg: "transparent" },
  render: (args) => (
    <Tooltip {...args}>
      <button className="px-4 py-2 rounded-md bg-zinc-800 text-sm text-white hover:bg-zinc-700 transition-colors">
        bg: transparent
      </button>
    </Tooltip>
  ),
};

export const AllBgVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      {(["dark", "light", "slate", "default", "glass", "gradient", "primary"] as const).map(
        (bg) => (
          <Tooltip key={bg} content={`bg: ${bg}`} bg={bg}>
            <button className="px-3 py-1.5 rounded-md bg-zinc-800 text-xs text-zinc-300 border border-zinc-700 hover:bg-zinc-700 transition-colors capitalize">
              {bg}
            </button>
          </Tooltip>
        )
      )}
    </div>
  ),
};

export const RoundedSm: Story = {
  args: { content: "rounded: sm", rounded: "sm" },
  render: (args) => (
    <Tooltip {...args}>
      <button className="px-4 py-2 rounded-md bg-zinc-800 text-sm text-white hover:bg-zinc-700 transition-colors">
        rounded: sm
      </button>
    </Tooltip>
  ),
};

export const RoundedMd: Story = {
  args: { content: "rounded: md", rounded: "md" },
  render: (args) => (
    <Tooltip {...args}>
      <button className="px-4 py-2 rounded-md bg-zinc-800 text-sm text-white hover:bg-zinc-700 transition-colors">
        rounded: md
      </button>
    </Tooltip>
  ),
};

export const RoundedFull: Story = {
  args: { content: "rounded: full", rounded: "full" },
  render: (args) => (
    <Tooltip {...args}>
      <button className="px-4 py-2 rounded-md bg-zinc-800 text-sm text-white hover:bg-zinc-700 transition-colors">
        rounded: full
      </button>
    </Tooltip>
  ),
};

export const AllRoundedVariants: Story = {
  render: () => (
    <div className="flex gap-3">
      {(["sm", "md", "full"] as const).map((rounded) => (
        <Tooltip key={rounded} content={`rounded: ${rounded}`} rounded={rounded}>
          <button className="px-3 py-1.5 rounded-md bg-zinc-800 text-xs text-zinc-300 border border-zinc-700 hover:bg-zinc-700 transition-colors">
            {rounded}
          </button>
        </Tooltip>
      ))}
    </div>
  ),
};

export const AnimationFade: Story = {
  args: { content: "Fade animation", animation: "fade" },
  render: (args) => (
    <Tooltip {...args}>
      <button className="px-4 py-2 rounded-md bg-zinc-800 text-sm text-white hover:bg-zinc-700 transition-colors">
        fade
      </button>
    </Tooltip>
  ),
};

export const AnimationScale: Story = {
  args: { content: "Scale animation", animation: "scale" },
  render: (args) => (
    <Tooltip {...args}>
      <button className="px-4 py-2 rounded-md bg-zinc-800 text-sm text-white hover:bg-zinc-700 transition-colors">
        scale
      </button>
    </Tooltip>
  ),
};

export const AnimationSlideUp: Story = {
  args: { content: "Slide up animation", animation: "slideUp" },
  render: (args) => (
    <Tooltip {...args}>
      <button className="px-4 py-2 rounded-md bg-zinc-800 text-sm text-white hover:bg-zinc-700 transition-colors">
        slideUp
      </button>
    </Tooltip>
  ),
};

export const AnimationSlideDown: Story = {
  args: { content: "Slide down animation", animation: "slideDown" },
  render: (args) => (
    <Tooltip {...args}>
      <button className="px-4 py-2 rounded-md bg-zinc-800 text-sm text-white hover:bg-zinc-700 transition-colors">
        slideDown
      </button>
    </Tooltip>
  ),
};

export const AnimationSlideLeft: Story = {
  args: { content: "Slide left animation", animation: "slideLeft" },
  render: (args) => (
    <Tooltip {...args}>
      <button className="px-4 py-2 rounded-md bg-zinc-800 text-sm text-white hover:bg-zinc-700 transition-colors">
        slideLeft
      </button>
    </Tooltip>
  ),
};

export const AnimationSlideRight: Story = {
  args: { content: "Slide right animation", animation: "slideRight" },
  render: (args) => (
    <Tooltip {...args}>
      <button className="px-4 py-2 rounded-md bg-zinc-800 text-sm text-white hover:bg-zinc-700 transition-colors">
        slideRight
      </button>
    </Tooltip>
  ),
};

export const AllAnimationVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      {(["fade", "scale", "slideUp", "slideDown", "slideLeft", "slideRight"] as const).map(
        (animation) => (
          <Tooltip key={animation} content={animation} animation={animation}>
            <button className="px-3 py-1.5 rounded-md bg-zinc-800 text-xs text-zinc-300 border border-zinc-700 hover:bg-zinc-700 transition-colors">
              {animation}
            </button>
          </Tooltip>
        )
      )}
    </div>
  ),
};