import type { Meta, StoryObj } from "@storybook/react"
import { Slider } from "./"

const meta: Meta<typeof Slider> = {
    title: "Components/Slider",
    component: Slider,

    parameters: {
        layout: "centered",
    },

    decorators: [
        (Story) => (
            <div className="w-[420px] p-10">
                <Story />
            </div>
        ),
    ],

    argTypes: {
        variant: {
            control: "select",
            options: [
                "default",
                "minimal",
                "rounded",
                "gradient",
                "glass",
                "outline",
                "shadow",
                "neon",
                "material",
                "neumorphic",
                "retro",
                "cyberpunk",
                "brutalist",
                "skeuomorphic",
            ],
        },

        animationType: {
            control: "select",
            options: [
                "none",
                "slide",
                "fade",
                "zoom",
                "spring",
                "elastic",
                "parallax",
                "flip",
                "morph",
                "hover",
                "pulse",
                "breathe",
                "wave",
                "rainbow",
                "bounce",
            ],
        },

        size: {
            control: "select",
            options: ["sm", "md", "lg"],
        },
        showValue: { control: "boolean" },
        showTooltip: { control: "boolean" },
        glowEffect: { control: "boolean" },
        valuePrefix: { control: "text" },
        valueSuffix: { control: "text" },
        animationDuration: { control: { type: "number", min: 0.1, max: 3, step: 0.1 } },
        disabled: { control: "boolean" },
        min: { control: "number" },
        max: { control: "number" },
        step: { control: "number" },
    },

    args: {
        defaultValue: [50],
        min: 0,
        max: 100,
        step: 1,
        variant: "default",
        animationType: "none",
        animationDuration: 0.3,
        size: "md",
        showValue: false,
        showTooltip: false,
        glowEffect: false,
        disabled: false,
        valuePrefix: "",
        valueSuffix: "",
    },
}

export default meta

type Story = StoryObj<typeof Slider>

export const Default: Story = {}

export const WithValue: Story = {
    args: { showValue: true },
}

export const WithValuePrefixSuffix: Story = {
    name: "With Value Prefix & Suffix",
    args: {
        showValue: true,
        valuePrefix: "$",
        valueSuffix: "k",
    },
}

export const WithTooltip: Story = {
    args: { 
        showTooltip: true 
    },
}

export const WithTooltipPrefixSuffix: Story = {
    name: "With Tooltip Prefix & Suffix",
    args: {
        showTooltip: true,
        valuePrefix: "€",
        valueSuffix: "%",
    },
}

export const Minimal: Story = {
    args: {
        variant: "minimal",
        showTooltip: true,
    },
}

export const Rounded: Story = {
    args: { 
        variant: "rounded", 
        showTooltip: true 
    },
}

export const Gradient: Story = {
    args: { 
        variant: "gradient", 
        showValue: true 
    },
}

export const Glass: Story = {
    decorators: [
        (Story) => (
            <div className="h-[300px] flex items-center bg-accent-foreground justify-center p-10">
                <Story />
            </div>
        ),
    ],
    args: { 
        variant: "glass", 
        showTooltip: true 
    },
}

export const Outline: Story = {
    args: { 
        variant: "outline", 
        showTooltip: true 
    },
}

export const Shadow: Story = {
    args: { 
        variant: "shadow", 
        showTooltip: true 
    },
}

export const Neon: Story = {
    args: { 
        variant: "neon", 
        showValue: true 
    },
}

export const Material: Story = {
    args: { 
        variant: "material", 
        showTooltip: true 
    },
}

export const Neumorphic: Story = {
    args: {
        variant: "neumorphic",
        showTooltip: true,
    },
}

export const Retro: Story = {
    args: {
        variant: "retro",
        showTooltip: true,
    },
}

export const Cyberpunk: Story = {
    args: {
        variant: "cyberpunk",
        showTooltip: true,
    },
}

export const Brutalist: Story = {
    args: {
        variant: "brutalist",
        showTooltip: true,
    },
}

export const Skeuomorphic: Story = {
    args: { 
        variant: "skeuomorphic", 
        showTooltip: true 
    },
}

export const Small: Story = {
    args: { 
        size: "sm", 
        showValue: true 
    },
}

export const Medium: Story = {
    args: { 
        size: "md", 
        showValue: true 
    },
}

export const Large: Story = {
    args: { 
        size: "lg", 
        showValue: true 
    },
}

export const AnimatedSlide: Story = {
    name: "Animation: Slide",
    args: { 
        animationType: "slide" 
    },
}

export const AnimatedFade: Story = {
    name: "Animation: Fade",
    args: { 
        animationType: "fade" 
    },
}

export const AnimatedZoom: Story = {
    name: "Animation: Zoom",
    args: { 
        animationType: "zoom"
    },
}

export const AnimatedSpring: Story = {
    name: "Animation: Spring",
    args: { 
        animationType: "spring" 
    },
}

export const AnimatedElastic: Story = {
    name: "Animation: Elastic",
    args: { 
        animationType: "elastic" 
    },
}

export const AnimatedParallax: Story = {
    name: "Animation: Parallax",
    args: { 
        animationType: "parallax" 
    },
}

export const AnimatedFlip: Story = {
    name: "Animation: Flip",
    args: { 
        animationType: "flip" 
    },
}

export const AnimatedMorph: Story = {
    name: "Animation: Morph",
    args: { 
        animationType: "morph" 
    },
}

export const AnimatedHover: Story = {
    name: "Animation: Hover",
    args: { 
        animationType: "hover" 
    },
}

export const AnimatedPulse: Story = {
    name: "Animation: Pulse",
    args: { 
        animationType: "pulse", 
        variant: "gradient" 
    },
}

export const AnimatedBreathe: Story = {
    name: "Animation: Breathe",
    args: { 
        animationType: "breathe", 
        variant: "neon" 
    },
}

export const AnimatedWave: Story = {
    name: "Animation: Wave",
    args: { 
        animationType: "wave" 
    },
}

export const AnimatedRainbow: Story = {
    name: "Animation: Rainbow",
    args: { 
        animationType: "rainbow" 
    },
}

export const AnimatedBounce: Story = {
    name: "Animation: Bounce",
    args: { 
        animationType: "bounce", 
        variant: "rounded" 
    },
}

export const RangeSlider: Story = {
    name: "Range Slider",
    args: {
        defaultValue: [20, 80],
        showValue: true,
    },
}

export const RangeSliderWithTooltip: Story = {
    name: "Range Slider with Tooltip",
    args: {
        defaultValue: [20, 80],
        showTooltip: true,
        variant: "gradient",
    },
}

export const Disabled: Story = {
    args: { 
        disabled: true, 
        showValue: true 
    },
}

export const GlowEffect: Story = {
    name: "Glow Effect",
    args: { 
        glowEffect: true, 
        variant: "neon", 
        showValue: true 
    },
}

export const CustomStep: Story = {
    name: "Custom Step (10)",
    args: { 
        step: 10, 
        showValue: true, 
        defaultValue: [50] 
    },
}

export const CustomRange: Story = {
    name: "Custom Range (−50 to 50)",
    args: { 
        min: -50, 
        max: 50, 
        defaultValue: [0], 
        showValue: true 
    },
}

export const Orientation: Story = {
    name: "Vertical Orientation",
    decorators: [
        (Story) => (
            <div className="h-[300px] flex items-center justify-center p-10">
                <Story />
            </div>
        ),
    ],
    args: {
        orientation: "vertical",
        defaultValue: [50],
        showValue: true,
        style: { height: 200 },
    },
}