import { SplitSignupForm } from "./";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

// Mock onSubmit handler
const handleSubmit = (data: any) => {
    console.log("Form submitted:", data);
    return new Promise((resolve) => setTimeout(resolve, 2000));
};

const meta: Meta<typeof SplitSignupForm> = {
    title: "Templates/Pages/Forms/SplitSignupForm",
    component: SplitSignupForm,
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component:
                    "A modern split-layout signup form with an info panel and form side. Features multiple variants, animations, and responsive design.",
            },
        },
    },
    argTypes: {
        variant: {
            control: { type: "select" },
            options: ["default", "modern", "gradient", "dark"],
            description: "Visual theme variant for the form.",
        },
        companyName: {
            control: { type: "text" },
            description: "Company/brand name displayed in the info panel.",
        },
        loading: {
            control: { type: "boolean" },
            description: "Loading state for form submission.",
        },
        showLoginLink: {
            control: { type: "boolean" },
            description: "Show/hide the login link.",
        },
        onSubmit: {
            action: "submitted",
            description: "Callback function when form is submitted.",
        },
    },
};

export default meta;
type Story = StoryObj<typeof SplitSignupForm>;

// 🎯 Default Split Form
export const Default: Story = {
    args: {
        variant: "default",
        companyName: "YourBrand",
        loading: false,
        showLoginLink: true,
    },
};

// 🎨 Modern Variant
export const Modern: Story = {
    args: {
        ...Default.args,
        variant: "modern",
        companyName: "TechCorp",
    },
};

// 🌈 Gradient Variant
export const Gradient: Story = {
    args: {
        ...Default.args,
        variant: "gradient",
        companyName: "InnovateLabs",
    },
};

// 🌙 Dark Variant
export const Dark: Story = {
    args: {
        ...Default.args,
        variant: "dark",
        companyName: "DarkMode Inc",
    },
};

// ⏳ Loading State
export const Loading: Story = {
    args: {
        ...Default.args,
        loading: true,
    },
};

// 🔗 No Login Link
export const NoLoginLink: Story = {
    args: {
        ...Default.args,
        showLoginLink: false,
    },
};

// 🏢 Custom Company Name
export const CustomBrand: Story = {
    args: {
        ...Default.args,
        companyName: "Acme Corporation",
    },
};

// Interactive Example with State Management
export const Interactive: Story = {
    render: function Render(args) {
        const [loading, setLoading] = useState(false);

        const handleSubmit = async (data: any) => {
            setLoading(true);
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            setLoading(false);
            console.log("Form submitted:", data);
        };

        return (
            <SplitSignupForm
                {...args}
                loading={loading}
                onSubmit={handleSubmit}
            />
        );
    },
    args: {
        ...Default.args,
    },
};

// Mobile View
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

// Tablet View
export const TabletView: Story = {
    args: {
        ...Default.args,
    },
    parameters: {
        viewport: {
            defaultViewport: "ipad",
        },
    },
};

// Form with Validation Errors
export const WithErrors: Story = {
    render: function Render(args) {
        return (
            <div className="min-h-screen">
                <SplitSignupForm {...args} />
            </div>
        );
    },
    args: {
        ...Default.args,
    },
};