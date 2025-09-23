// AnimatedInput.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { AnimatedInput } from "./index";
import { Mail, Lock } from "lucide-react";


const meta: Meta<typeof AnimatedInput> = {
    title: "Components/AnimatedInput",
    component: AnimatedInput,
    tags: ["autodocs"],
    parameters: {
        docs: {
            description: {
                component: `
The **AnimatedInput** component provides multiple interactive and animated input field styles.  
It supports validation states, icons, password toggling, and 20+ animation variants for modern UI/UX.

###  Features
- 30+ animation \`variants\` (clean, underline, floating, ripple, particleField, etc.)
- Validation states: **error** + **success**
- Leading **icon** support
- **Password toggle** (show/hide)
- **Sizes**: sm, md, lg
- Works with \`disabled\` state
- Full keyboard + screen reader accessibility
        `,
            },
        },
    },
    argTypes: {
        variant: {
            control: "select",
            options: [
                "clean", "underline", "floating", "borderGlow", "shimmer", "particles",
                "slide", "scale", "rotate", "bounce", "elastic", "glow", "shake", "wave",
                "typewriter", "magnetic", "pulse", "borderBeam", "ripple", "particleField", "tilt3D"
            ],
            description: "Selects the animation style of the input.",
        },
        size: {
            control: "radio",
            options: ["sm", "md", "lg"],
            description: "Controls the size of the input.",
        },
        success: {
            control: "boolean",
            description: "Displays green success style when true.",
        },
        disabled: {
            control: "boolean",
            description: "Disables the input field.",
        },
        error: {
            control: "text",
            description: "Shows error message & highlights the input in red.",
        },
        showPasswordToggle: {
            control: "boolean",
            description: "Adds eye icon for password show/hide toggle.",
        },
        placeholder: {
            control: "text",
            description: "Placeholder text for the input.",
        },
        value: {
            control: "text",
            description: "Controlled value of the input.",
        },
    },
};
export default meta;

type Story = StoryObj<typeof AnimatedInput>;

// Default Clean Input
export const Default: Story = {
    args: {
        placeholder: "Enter your text",
        variant: "clean",
        value: "",
        onChange: (v) => console.log("Changed:", v),
    },
};

// With Icon
export const WithIcon: Story = {
    args: {
        placeholder: "Email address",
        variant: "underline",
        value: "",
        icon: Mail,
    },
};

// Password Input with Toggle
export const Password: Story = {
    args: {
        placeholder: "Password",
        variant: "floating",
        type: "password",
        value: "mypassword",
        icon: Lock,
        showPasswordToggle: true,
    },
};

// Error State
export const Error: Story = {
    args: {
        placeholder: "Username",
        variant: "floating",
        value: "wrong@input",
        error: "Invalid username",
    },
};

// Success State
export const Success: Story = {
    args: {
        placeholder: "Valid Input",
        variant: "borderGlow",
        value: "success@example.com",
        success: true,
    },
};

// Disabled
export const Disabled: Story = {
    args: {
        placeholder: "Disabled Input",
        variant: "slide",
        value: "",
        disabled: true,
    },
};

// Showcase of Fancy Variants
export const Ripple: Story = {
    args: {
        placeholder: "Ripple Effect",
        variant: "ripple",
        value: "",
    },
};

export const ParticleField: Story = {
    args: {
        placeholder: "Particle Field",
        variant: "particleField",
        value: "",
    },
};

export const BorderBeam: Story = {
    args: {
        placeholder: "Border Beam",
        variant: "borderBeam",
        value: "",
    },
};
