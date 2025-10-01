import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./index";
import { Bell } from "lucide-react";

const meta: Meta<typeof Badge> = {
    title: "Components/Badge",
    component: Badge,
    tags: ["autodocs"],
    parameters: {
        docs: {
            description: {
                component: `
The **Badge** component is a small animated indicator often used for notifications, statuses, or counts.  
It supports multiple **types** (primary, success, warning, etc.) and **animation variants** (pulse, bounce, tinypop).

###  Features
- Type-based color variants (primary, success, warning, error, etc.)
- Built-in animations (pulse, bounce, tinypop)
- Works with or without a parent icon/element
        `,
            },
        },
    },
    argTypes: {
        text: {
            control: "text",
            description: "Text or number displayed inside the badge",
            defaultValue: "3",
        },
        type: {
            control: "select",
            options: ["primary", "secondary", "success", "warning", "error"],
            description: "Color style of the badge",
        },
        variant: {
            control: "select",
            options: ["pulse", "bounce", "tinypop"],
            description: "Animation style of the badge",
        },
        className: {
            control: "text",
            description: "Custom Tailwind or CSS class names",
        },
        children: {
            table: { disable: true },
            description: "Optional parent element or icon (like a bell or avatar)",
        },
    },
};

export default meta;
type Story = StoryObj<typeof Badge>;


export const Default: Story = {
    args: {
        text: "5",
        type: "primary",
        variant: "tinypop",
    },
};

export const WithIcon: Story = {
    args: {
        text: "12",
        type: "success",
        variant: "pulse",
        children: (
            <div className="p-4 bg-gray-200 rounded-full">
                <Bell className="w-6 h-6 text-gray-700" />
            </div>
        ),
    },
};

export const Warning: Story = {
    args: {
        text: "99+",
        type: "warning",
        variant: "bounce",
        children: (
            <div className="p-4 bg-gray-100 rounded-full">
                <Bell className="w-6 h-6 text-gray-700" />
            </div>
        ),
    },
};

export const ErrorBadge: Story = {
    args: {
        text: "9",
        type: "error",
        variant: "pulse",
    },
};
