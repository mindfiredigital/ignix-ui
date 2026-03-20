import type { Meta, StoryObj } from "@storybook/react-vite";
import { AspectRatio } from "./index";

const meta: Meta<typeof AspectRatio> = {
  title: "Layouts/AspectRatio",
  component: AspectRatio,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Constrains children to a fixed aspect ratio. Uses the native `aspect-ratio` CSS property. " +
          "Children are absolutely positioned to fill the container — wrap images with `w-full h-full object-cover`.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 800, padding: "1rem" }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    ratio: {
      control: "select",
      options: ["1:1", "4:3", "16:9", "21:9"],
      description: "Aspect ratio. Accepts preset strings or any `W:H` string.",
    },
    maxWidth: {
      control: "number",
      description: "Maximum width of the container in pixels.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof AspectRatio>;

const PlaceholderImage = ({ label }: { label: string }) => (
  <img
    src={`https://placehold.co/800x450/1a1a2e/white?text=${encodeURIComponent(label)}`}
    alt={label}
    className="w-full h-full object-cover"
  />
);

const ColorBox = ({ color, label }: { color: string; label: string }) => (
  <div
    style={{ background: color }}
    className="w-full h-full flex items-center justify-center text-white font-medium text-sm"
  >
    {label}
  </div>
);

// Square 1:1 ratio
export const Square: Story = {
  name: "1:1",
  render: () => (
    <AspectRatio ratio="1:1" maxWidth={320}>
      <PlaceholderImage label="1:1" />
    </AspectRatio>
  ),
};

// 4:3 ratio
export const FourThree: Story = {
  name: "4:3",
  args: { ratio: "4:3" },
  render: (args) => (
    <AspectRatio {...args}>
      <PlaceholderImage label="4:3" />
    </AspectRatio>
  ),
};

// Widescreen 16:9
export const SixteenNine: Story = {
  name: "16:9",
  args: { ratio: "16:9" },
  render: (args) => (
    <AspectRatio {...args}>
      <PlaceholderImage label="16:9" />
    </AspectRatio>
  ),
};

// Cinematic 21:9
export const TwentyOneNine: Story = {
  name: "21:9",
  args: { ratio: "21:9" },
  render: (args) => (
    <AspectRatio {...args}>
      <PlaceholderImage label="21:9 Cinematic" />
    </AspectRatio>
  ),
};

// Custom numeric max-width
export const WithMaxWidth: Story = {
  name: "With Max Width",
  args: { ratio: "16:9", maxWidth: 400 },
  render: (args) => (
    <AspectRatio {...args}>
      <PlaceholderImage label="maxWidth=400" />
    </AspectRatio>
  ),
};

// Non-image child
export const WithNonImageChild: Story = {
  name: "Non-Image Child",
  args: { ratio: "16:9" },
  render: (args) => (
    <AspectRatio {...args}>
      <ColorBox color="#4f46e5" label="Non-image child" />
    </AspectRatio>
  ),
};

// Comparison of all 4 ratios
export const AllRatios: Story = {
  name: "All Ratios",
  render: () => (
    <div className="flex flex-col gap-6">
      {(["1:1", "4:3", "16:9", "21:9"] as const).map((ratio) => (
        <div key={ratio}>
          <p className="text-xs text-muted-foreground mb-1">{ratio}</p>
          <AspectRatio ratio={ratio}>
            <ColorBox
              color={
                ratio === "1:1"
                  ? "#4f46e5"
                  : ratio === "4:3"
                  ? "#0891b2"
                  : ratio === "16:9"
                  ? "#059669"
                  : "#d97706"
              }
              label={ratio}
            />
          </AspectRatio>
        </div>
      ))}
    </div>
  ),
};

// Playground
export const Playground: Story = {
  name: "Playground",
  args: { ratio: "16:9" },
  render: (args) => (
    <AspectRatio {...args}>
      <PlaceholderImage label="Playground" />
    </AspectRatio>
  ),
};