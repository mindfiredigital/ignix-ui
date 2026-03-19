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

        showValue: {
            control: "boolean",
        },

        showTooltip: {
            control: "boolean",
        },

        glowEffect: {
            control: "boolean",
        },
    },

    args: {
        defaultValue: [50],
        max: 100,
        step: 1,
        variant: "default",
        animationType: "none",
        size: "md",
        showValue: false,
        showTooltip: false,
        glowEffect: false,
    },
}

export default meta

type Story = StoryObj<typeof Slider>

export const Default: Story = {}

export const WithValue: Story = {
    args: {
        showValue: true,
    },
}

export const WithTooltip: Story = {
    args: {
        showTooltip: true,
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
        showTooltip: true,
    },
}

export const Neon: Story = {
    args: {
        variant: "neon",
        showValue: true,
    },
}

export const Gradient: Story = {
    args: {
        variant: "gradient",
        showValue: true,
    },
}

export const Outline: Story = {
    args: {
        variant: "outline",
        showTooltip: true,
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
        showTooltip: true,
    },
}

export const AnimatedPulse: Story = {
  args: {
    animationType: "pulse",
    variant: "gradient",
  },
}

export const Large: Story = {
    args: {
        size: "lg",
        showValue: true,
    },
}

export const Small: Story = {
    args: {
        size: "sm",
    },
}