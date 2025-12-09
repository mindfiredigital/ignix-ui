
import { SingleColumnLayout } from "./index";
import { Card } from "../../../components/card";
import type { Meta, StoryObj } from "@storybook/react-vite";

// Reusable content component for consistency across all stories
const DemoContent = () => (
    <div className="space-y-6 text-center">
        <h2 className="text-2xl font-bold">Welcome to Single Column Layout</h2>
        <p className="text-muted-foreground">
            A responsive full-width layout with constrained content width (1200px max).
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <Card variant={"outline"} className="p-3">
                <h3 className="font-semibold">Responsive</h3>
                <p className="text-sm text-muted-foreground">Optimized for all screen sizes.</p>
            </Card>
            <Card variant={"outline"} className="p-3">
                <h3 className="font-semibold">Accessible</h3>
                <p className="text-sm text-muted-foreground">Semantic HTML with ARIA roles.</p>
            </Card>
            <Card variant={"outline"} className="p-3">
                <h3 className="font-semibold">Customizable</h3>
                <p className="text-sm text-muted-foreground">Supports theme variants and animations.</p>
            </Card>
        </div>
    </div>
);

const meta: Meta<typeof SingleColumnLayout> = {
    title: "Templates/Layouts/SingleColumnLayout",
    component: SingleColumnLayout,
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component:
                    "A clean, responsive single-column layout. It provides a full-width structure with a header, constrained content area, and footer. Supports theme variants, sticky header/footer, and subtle animations.",
            },
        },
    },
    argTypes: {
        variant: {
            control: { type: "select" },
            options: ["default", "light", "dark", "glass", "gradient", "transparent", "solid"],
            description: "Visual theme variant for the layout.",
        },
        animation: {
            control: { type: "select" },
            options: ["none", "fade", "slide", "scale"],
            description: "Animation type for content transition.",
        },
        stickyHeader: {
            control: { type: "boolean" },
            description: "Makes the header sticky to the top.",
        },
        stickyFooter: {
            control: { type: "boolean" },
            description: "Makes the footer stick to the bottom.",
        },
        activeNavLink: {
            control: { type: "text" },
            description: "Currently active navigation link href",
        },
    },
};

export default meta;
type Story = StoryObj<typeof SingleColumnLayout>;

// 🌤️ Basic Example
export const Basic: Story = {
    args: {
        variant: "default",
        stickyHeader: true,
        stickyFooter: false,
        children: <DemoContent />,
    },
};

// 🌑 Dark Theme
export const DarkTheme: Story = {
    args: {
        ...Basic.args,
        variant: "dark",
    },
};

// 🌈 Gradient Variant
export const Gradient: Story = {
    args: {
        ...Basic.args,
        variant: "gradient",
        animation: "slide",
    },
};

// 🔮 Glass Variant
export const Glass: Story = {
    args: {
        ...Basic.args,
        variant: "glass",
        animation: "fade",
    },
};

// 🎯 Variant 1: Transparent Header
export const TransparentHeader: Story = {
    args: {
        ...Basic.args,
        variant: "transparent",
        activeNavLink: "#",
        children: <DemoContent />,
    },
    parameters: {
        docs: {
            description: {
                story: "Transparent header with hover effects and selected item background. Footer matches the selected item color. Content has complementing gradient background.",
            },
        },
    },
};

// 🎨 Variant 2: Solid Header
export const SolidHeader: Story = {
    args: {
        ...Basic.args,
        variant: "solid",
        activeNavLink: "#Features",
        children: <DemoContent />,
    },
    parameters: {
        docs: {
            description: {
                story: "Solid blue header with white text. Navigation items have hover effects and active states. Entire page has complementing light background. Footer matches header color.",
            },
        },
    },
};

// 📱 Mobile Responsive Story
// export const MobileResponsive: Story = {
//     args: {
//         ...Basic.args,
//         animation: "fade",
//         variant: "solid",
//         stickyHeader: true,
//         stickyFooter: true,
//         activeNavLink: "#",
//     },
//     parameters: {
//         viewport: {
//             defaultViewport: "iphone12",
//         },
//     },
// };

// 🎨 Modern Variant
export const Modern: Story = {
    args: {
        ...Basic.args,
        variant: "modern",
        activeNavLink: "#",
        children: <DemoContent />,
    },
    parameters: {
        docs: {
            description: {
                story: "Modern design with gradient backgrounds, animated navigation, and beautiful hover effects. Features a sleek logo, animated underline navigation, and gradient footer.",
            },
        },
    },
};