import { CenteredSignupForm } from "./index";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

// Mock onSubmit handler
// const handleSubmit = (data: any) => {
//     console.log("Form submitted:", data);
//     return new Promise((resolve) => setTimeout(resolve, 2000));
// };

const meta: Meta<typeof CenteredSignupForm> = {
    title: "Forms/CenteredSignupForm",
    component: CenteredSignupForm,
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component:
                    "A modern, animated signup form with theme support, password strength indicator, and responsive design. Supports multiple variants and states.",
            },
        },
    },
    argTypes: {
        variant: {
            control: { type: "select" },
            options: ["default", "modern", "glass", "dark"],
            description: "Visual theme variant for the form.",
        },
        showThemeToggle: {
            control: { type: "boolean" },
            description: "Show/hide the theme toggle button.",
        },
        loading: {
            control: { type: "boolean" },
            description: "Loading state for form submission.",
        },
        success: {
            control: { type: "boolean" },
            description: "Success state after form submission.",
        },
        onSubmit: {
            action: "submitted",
            description: "Callback function when form is submitted.",
        },
    },
};

export default meta;
type Story = StoryObj<typeof CenteredSignupForm>;

// 🎯 Default Form
export const Default: Story = {
    args: {
        variant: "default",
        showThemeToggle: true,
        loading: false,
        success: false,
    },
};

// 🌙 Dark Variant
export const Dark: Story = {
    args: {
        ...Default.args,
        variant: "dark",
    },
};

// 🎨 Modern Variant
export const Modern: Story = {
    args: {
        ...Default.args,
        variant: "modern",
    },
};

// 🔮 Glass Variant
export const Glass: Story = {
    args: {
        ...Default.args,
        variant: "glass",
    },
};

// ⏳ Loading State
export const Loading: Story = {
    args: {
        ...Default.args,
        loading: true,
    },
};

// ✅ Success State
export const Success: Story = {
    args: {
        ...Default.args,
        success: true,
    },
};

// 📱 Without Theme Toggle
export const NoThemeToggle: Story = {
    args: {
        ...Default.args,
        showThemeToggle: false,
    },
};

// Interactive Example with State Management
export const Interactive: Story = {
    render: function Render(args) {
        const [loading, setLoading] = useState(false);
        const [success, setSuccess] = useState(false);

        const handleSubmit = async () => {
            setLoading(true);
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            setLoading(false);
            setSuccess(true);
            // Reset success after 3 seconds
            setTimeout(() => setSuccess(false), 3000);
        };

        return (
            <CenteredSignupForm
                {...args}
                loading={loading}
                success={success}
                onSubmit={handleSubmit}
            />
        );
    },
    args: {
        ...Default.args,
    },
};

// Form with Validation Errors
export const WithErrors: Story = {
    render: function Render(args) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <CenteredSignupForm {...args} />
            </div>
        );
    },
    args: {
        ...Default.args,
    },
};

// Mobile Responsive View
export const MobileView: Story = {
    args: {
        ...Default.args,
    },
    parameters: {
        viewport: {
            defaultViewport: "iphone12",
        },
    },
};