import type { Meta, StoryObj } from "@storybook/react";
import {
    StatsGrid,
    StatsGridTitle,
    StatsGridDescription,
    StatsGridCard,
    StatsGridContainer,
    StatValue,
    StatLabel,
    StatSubtext,
    StatIcon,
} from ".";
import {
    Users,
    DollarSign,
    Download,
    Clock,
    Star,
    Shield,
    Globe,
    Award,
    Rocket,
    Heart,
    Activity,
    ShoppingCart,
    Mail,
    TrendingUp,
    Zap,
    CheckCircle,
    Target,
    Crown,
    HeartHandshake,
    CreditCard,
    CircleDollarSign,
    Package,
    FileText,
    Flag,
    UserPlus,
    Building,
    Network,
    Database,
    Server,
    HeartPulse,
    Timer,
    Banknote,
    Calendar,
    Calculator,
    TrendingDown,
    PieChart,
    Eye,
    Smile,
    Circle,
    Sparkles,
    Wand2,
    Palette,
    Brush,
} from "lucide-react";
import { cn } from "../../../../../utils/cn";
import React from "react";

const meta: Meta<typeof StatsGrid> = {
    title: "Templates/Section/Content/StatsGrid",
    component: StatsGrid,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component:
                    "A versatile statistics grid component with multiple layout variants, themes, animations, and number formatting options. Supports compound components for flexible layouts.",
            },
        },
    },
    argTypes: {
        variant: {
            control: "select",
            options: ["default", "dark", "light", "primary", "secondary"],
            description: "Visual variant of the stats grid",
        },
        columns: {
            control: "select",
            options: [2, 3, 4, 5, 6],
            description: "Number of columns in the grid",
        },
        contentAlign: {
            control: "select",
            options: ["left", "center", "right"],
            description: "Content alignment within the section",
        },
        animated: {
            control: "boolean",
            description: "Enable/disable counting animations",
        },
        animationType: {
            control: "select",
            options: ["fade", "slide", "scale", "none"],
            description: "Type of entrance animation",
        },
        padding: {
            control: "select",
            options: ["sm", "md", "lg", "xl", "2xl"],
            description: "Vertical padding of the section",
        },
        gap: {
            control: "select",
            options: ["sm", "md", "lg", "xl"],
            description: "Gap between grid items",
        },
        containerSize: {
            control: "select",
            options: ["small", "normal", "large", "full", "readable"],
            description: "Container max width",
        },
    },
    decorators: [
        (Story) => (
            <div className="min-h-screen">
                <Story />
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof StatsGrid>;

/* ============================================
   0. BASIC VARIANTS WITH DIFFERENT THEMES
============================================ */

// Light theme stories
// export const CenteredStatsLight: Story = {
//     render: () => (
//         <StatsGrid
//             variant="light"
//             columns={4}
//             contentAlign="center"
//             padding="lg"
//             animated={true}
//             animationType="slide"
//         >
//             <StatsGridTitle>Key Performance Indicators</StatsGridTitle>
//             <StatsGridDescription>
//                 Track our growth and success metrics in real-time. All numbers are updated daily.
//             </StatsGridDescription>
//             <StatsGridContainer>
//                 <StatsGridCard
//                     stat={{
//                         value: 10000000,
//                         label: "Active Users",
//                         subtext: "Growing 20% month over month",
//                         icon: Users,
//                         format: "compact",
//                         accent: "blue",
//                     }}
//                 />
//                 <StatsGridCard
//                     stat={{
//                         value: 99.9,
//                         label: "Uptime SLA",
//                         subtext: "Enterprise-grade reliability",
//                         icon: Shield,
//                         format: "percentage",
//                         suffix: "%",
//                         accent: "emerald",
//                     }}
//                 />
//                 <StatsGridCard
//                     stat={{
//                         value: 2500000000,
//                         label: "Revenue",
//                         subtext: "Annual recurring revenue",
//                         icon: DollarSign,
//                         format: "currency",
//                         accent: "amber",
//                     }}
//                 />
//                 <StatsGridCard
//                     stat={{
//                         value: 50000000,
//                         label: "Downloads",
//                         subtext: "Across all platforms",
//                         icon: Download,
//                         format: "compact",
//                         suffix: "+",
//                         accent: "violet",
//                     }}
//                 />
//             </StatsGridContainer>
//         </StatsGrid>
//     ),
//     name: "0.1 Centered Stats - Light Theme",
// };

/* ============================================
   0.2 Centered Stats - Dark Theme (Enhanced)
============================================ */
// export const CenteredStatsDark: Story = {
//     render: () => (
//         <StatsGrid
//             variant="dark"
//             columns={4}
//             contentAlign="center"
//             padding="lg"
//             animated={true}
//             animationType="slide"
//         >
//             <StatsGridTitle>Performance Metrics</StatsGridTitle>
//             <StatsGridDescription>
//                 Dark theme with optimized contrast for better visibility.
//             </StatsGridDescription>
//             <StatsGridContainer>
//                 <StatsGridCard
//                     stat={{
//                         value: 10000000,
//                         label: "Active Users",
//                         subtext: "Growing 20% month over month",
//                         icon: Users,
//                         format: "compact",
//                         accent: "blue",
//                     }}
//                 />
//                 <StatsGridCard
//                     stat={{
//                         value: 99.9,
//                         label: "Uptime SLA",
//                         subtext: "Enterprise-grade reliability",
//                         icon: Shield,
//                         format: "percentage",
//                         suffix: "%",
//                         accent: "emerald",
//                     }}
//                 />
//                 <StatsGridCard
//                     stat={{
//                         value: 2500000000,
//                         label: "Revenue",
//                         subtext: "Annual recurring revenue",
//                         icon: DollarSign,
//                         format: "currency",
//                         accent: "amber",
//                     }}
//                 />
//                 <StatsGridCard
//                     stat={{
//                         value: 50000000,
//                         label: "Downloads",
//                         subtext: "Across all platforms",
//                         icon: Download,
//                         format: "compact",
//                         suffix: "+",
//                         accent: "violet",
//                     }}
//                 />
//             </StatsGridContainer>
//         </StatsGrid>
//     ),
//     name: "0.2 Centered Stats - Dark Theme",
// };

export const CenteredStatsPrimary: Story = {
    render: () => (
        <StatsGrid
            variant="primary"
            columns={4}
            contentAlign="center"
            padding="lg"
            animated={true}
        >
            <StatsGridTitle>Primary Theme</StatsGridTitle>
            <StatsGridDescription>
                Primary color background with subtle gradient and decorative elements.
            </StatsGridDescription>
            <StatsGridContainer>
                <StatsGridCard
                    stat={{
                        value: 10000000,
                        label: "Active Users",
                        icon: Users,
                        format: "compact",
                        accent: "blue",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 99.9,
                        label: "Uptime SLA",
                        icon: Shield,
                        format: "percentage",
                        suffix: "%",
                        accent: "emerald",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 2500000000,
                        label: "Revenue",
                        icon: DollarSign,
                        format: "currency",
                        accent: "amber",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 50000000,
                        label: "Downloads",
                        icon: Download,
                        format: "compact",
                        suffix: "+",
                        accent: "violet",
                    }}
                />
            </StatsGridContainer>
        </StatsGrid>
    ),
    name: "0.3 Centered Stats - Primary Theme",
};

export const CenteredStatsSecondary: Story = {
    render: () => (
        <StatsGrid
            variant="secondary"
            columns={4}
            contentAlign="center"
            padding="lg"
            animated={true}
        >
            <StatsGridTitle>Secondary Theme</StatsGridTitle>
            <StatsGridDescription>
                Secondary color background with complementary styling.
            </StatsGridDescription>
            <StatsGridContainer>
                <StatsGridCard
                    stat={{
                        value: 10000000,
                        label: "Active Users",
                        icon: Users,
                        format: "compact",
                        accent: "blue",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 99.9,
                        label: "Uptime SLA",
                        icon: Shield,
                        format: "percentage",
                        suffix: "%",
                        accent: "emerald",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 2500000000,
                        label: "Revenue",
                        icon: DollarSign,
                        format: "currency",
                        accent: "amber",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 50000000,
                        label: "Downloads",
                        icon: Download,
                        format: "compact",
                        suffix: "+",
                        accent: "violet",
                    }}
                />
            </StatsGridContainer>
        </StatsGrid>
    ),
    name: "0.4 Centered Stats - Secondary Theme",
};

/* ============================================
   1. CONTENT ALIGNMENT VARIANTS
============================================ */

export const AlignLeftStats: Story = {
    render: () => (
        <StatsGrid
            variant="light"
            columns={4}
            contentAlign="left"
            padding="lg"
            animated={true}
        >
            <StatsGridTitle>Left Aligned Content</StatsGridTitle>
            <StatsGridDescription>
                Title, description, and cards aligned to the left for traditional layouts.
            </StatsGridDescription>
            <StatsGridContainer>
                <StatsGridCard
                    stat={{
                        value: 10000000,
                        label: "Active Users",
                        icon: Users,
                        format: "compact",
                        accent: "blue",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 99.9,
                        label: "Uptime SLA",
                        icon: Shield,
                        format: "percentage",
                        suffix: "%",
                        accent: "emerald",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 2500000000,
                        label: "Revenue",
                        icon: DollarSign,
                        format: "currency",
                        accent: "amber",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 50000000,
                        label: "Downloads",
                        icon: Download,
                        format: "compact",
                        suffix: "+",
                        accent: "violet",
                    }}
                />
            </StatsGridContainer>
        </StatsGrid>
    ),
    name: "1.1 Alignment - Left",
};

export const AlignCenterStats: Story = {
    render: () => (
        <StatsGrid
            variant="light"
            columns={4}
            contentAlign="center"
            padding="lg"
            animated={true}
        >
            <StatsGridTitle>Center Aligned Content</StatsGridTitle>
            <StatsGridDescription>
                Title, description, and cards centered for balanced presentation.
            </StatsGridDescription>
            <StatsGridContainer>
                <StatsGridCard
                    stat={{
                        value: 10000000,
                        label: "Active Users",
                        icon: Users,
                        format: "compact",
                        accent: "blue",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 99.9,
                        label: "Uptime SLA",
                        icon: Shield,
                        format: "percentage",
                        suffix: "%",
                        accent: "emerald",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 2500000000,
                        label: "Revenue",
                        icon: DollarSign,
                        format: "currency",
                        accent: "amber",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 50000000,
                        label: "Downloads",
                        icon: Download,
                        format: "compact",
                        suffix: "+",
                        accent: "violet",
                    }}
                />
            </StatsGridContainer>
        </StatsGrid>
    ),
    name: "1.2 Alignment - Center",
};

export const AlignRightStats: Story = {
    render: () => (
        <StatsGrid
            variant="light"
            columns={4}
            contentAlign="right"
            padding="lg"
            animated={true}
        >
            <StatsGridTitle>Right Aligned Content</StatsGridTitle>
            <StatsGridDescription>
                Title, description, and cards aligned to the right for unique layouts.
            </StatsGridDescription>
            <StatsGridContainer>
                <StatsGridCard
                    stat={{
                        value: 10000000,
                        label: "Active Users",
                        icon: Users,
                        format: "compact",
                        accent: "blue",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 99.9,
                        label: "Uptime SLA",
                        icon: Shield,
                        format: "percentage",
                        suffix: "%",
                        accent: "emerald",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 2500000000,
                        label: "Revenue",
                        icon: DollarSign,
                        format: "currency",
                        accent: "amber",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 50000000,
                        label: "Downloads",
                        icon: Download,
                        format: "compact",
                        suffix: "+",
                        accent: "violet",
                    }}
                />
            </StatsGridContainer>
        </StatsGrid>
    ),
    name: "1.3 Alignment - Right",
};

/* ============================================
   2. COLUMN LAYOUT VARIANTS
============================================ */

export const TwoColumnStats: Story = {
    render: () => (
        <StatsGrid
            variant="light"
            columns={2}
            contentAlign="center"
            padding="lg"
            animated={true}
        >
            <StatsGridTitle>Two Column Layout</StatsGridTitle>
            <StatsGridDescription>
                Perfect for highlighting 2 key metrics with more space for details.
            </StatsGridDescription>
            <StatsGridContainer>
                <StatsGridCard
                    stat={{
                        value: 10000000,
                        label: "Active Users",
                        subtext: "Growing 20% month over month across all platforms",
                        icon: Users,
                        format: "compact",
                        accent: "blue",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 2500000000,
                        label: "Annual Revenue",
                        subtext: "Record growth with 45% increase from previous year",
                        icon: DollarSign,
                        format: "currency",
                        accent: "amber",
                    }}
                />
            </StatsGridContainer>
        </StatsGrid>
    ),
    name: "2.1 Layout - Two Columns",
};

export const ThreeColumnStats: Story = {
    render: () => (
        <StatsGrid
            variant="light"
            columns={3}
            contentAlign="center"
            padding="lg"
            animated={true}
        >
            <StatsGridTitle>Three Column Layout</StatsGridTitle>
            <StatsGridDescription>
                Ideal for 3 core statistics with balanced presentation.
            </StatsGridDescription>
            <StatsGridContainer>
                <StatsGridCard
                    stat={{
                        value: 10000000,
                        label: "Active Users",
                        icon: Users,
                        format: "compact",
                        accent: "blue",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 99.9,
                        label: "Uptime SLA",
                        icon: Shield,
                        format: "percentage",
                        suffix: "%",
                        accent: "emerald",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 2500000000,
                        label: "Revenue",
                        icon: DollarSign,
                        format: "currency",
                        accent: "amber",
                    }}
                />
            </StatsGridContainer>
        </StatsGrid>
    ),
    name: "2.2 Layout - Three Columns",
};

export const FourColumnStats: Story = {
    render: () => (
        <StatsGrid
            variant="light"
            columns={4}
            contentAlign="center"
            padding="lg"
            animated={true}
        >
            <StatsGridTitle>Four Column Layout</StatsGridTitle>
            <StatsGridDescription>
                Standard layout for most dashboard and metric display use cases.
            </StatsGridDescription>
            <StatsGridContainer>
                <StatsGridCard
                    stat={{
                        value: 10000000,
                        label: "Active Users",
                        icon: Users,
                        format: "compact",
                        accent: "blue",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 99.9,
                        label: "Uptime SLA",
                        icon: Shield,
                        format: "percentage",
                        suffix: "%",
                        accent: "emerald",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 2500000000,
                        label: "Revenue",
                        icon: DollarSign,
                        format: "currency",
                        accent: "amber",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 50000000,
                        label: "Downloads",
                        icon: Download,
                        format: "compact",
                        suffix: "+",
                        accent: "violet",
                    }}
                />
            </StatsGridContainer>
        </StatsGrid>
    ),
    name: "2.3 Layout - Four Columns",
};

export const SixColumnStats: Story = {
    render: () => (
        <StatsGrid
            variant="light"
            columns={6}
            contentAlign="center"
            padding="lg"
            animated={true}
        >
            <StatsGridTitle>Six Column Layout</StatsGridTitle>
            <StatsGridDescription>
                Maximum density for showing multiple metrics at once.
            </StatsGridDescription>
            <StatsGridContainer>
                <StatsGridCard
                    stat={{
                        value: 10000000,
                        label: "Users",
                        icon: Users,
                        format: "compact",
                        accent: "blue",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 99.9,
                        label: "Uptime",
                        icon: Shield,
                        format: "percentage",
                        suffix: "%",
                        accent: "emerald",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 2.5,
                        label: "Revenue",
                        icon: DollarSign,
                        format: "currency",
                        accent: "amber",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 50,
                        label: "Downloads",
                        icon: Download,
                        format: "compact",
                        suffix: "M+",
                        accent: "violet",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 4.9,
                        label: "Rating",
                        icon: Star,
                        format: "raw",
                        decimals: 1,
                        accent: "purple",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 24,
                        label: "Support",
                        icon: Clock,
                        format: "raw",
                        suffix: "/7",
                        accent: "rose",
                    }}
                />
            </StatsGridContainer>
        </StatsGrid>
    ),
    name: "2.4 Layout - Six Columns",
};

/* ============================================
   3. ANIMATION VARIANTS
============================================ */

export const FadeAnimationStats: Story = {
    render: () => (
        <StatsGrid
            variant="light"
            columns={4}
            contentAlign="center"
            padding="lg"
            animated={true}
            animationType="fade"
            gap="lg"
        >
            <StatsGridTitle>Fade Animation</StatsGridTitle>
            <StatsGridDescription>
                Cards fade in smoothly with a staggered entrance effect.
            </StatsGridDescription>
            <StatsGridContainer>
                <StatsGridCard
                    stat={{
                        value: 10000000,
                        label: "Active Users",
                        icon: Users,
                        format: "compact",
                        accent: "blue",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 99.9,
                        label: "Uptime SLA",
                        icon: Shield,
                        format: "percentage",
                        suffix: "%",
                        accent: "emerald",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 2500000000,
                        label: "Revenue",
                        icon: DollarSign,
                        format: "currency",
                        accent: "amber",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 50000000,
                        label: "Downloads",
                        icon: Download,
                        format: "compact",
                        suffix: "+",
                        accent: "violet",
                    }}
                />
            </StatsGridContainer>
        </StatsGrid>
    ),
    name: "3.1 Animation - Fade",
};

export const SlideAnimationStats: Story = {
    render: () => (
        <StatsGrid
            variant="light"
            columns={4}
            contentAlign="center"
            padding="lg"
            animated={true}
            animationType="slide"
            gap="lg"
        >
            <StatsGridTitle>Slide Animation</StatsGridTitle>
            <StatsGridDescription>
                Cards slide up from below with staggered timing.
            </StatsGridDescription>
            <StatsGridContainer>
                <StatsGridCard
                    stat={{
                        value: 10000000,
                        label: "Active Users",
                        icon: Users,
                        format: "compact",
                        accent: "blue",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 99.9,
                        label: "Uptime SLA",
                        icon: Shield,
                        format: "percentage",
                        suffix: "%",
                        accent: "emerald",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 2500000000,
                        label: "Revenue",
                        icon: DollarSign,
                        format: "currency",
                        accent: "amber",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 50000000,
                        label: "Downloads",
                        icon: Download,
                        format: "compact",
                        suffix: "+",
                        accent: "violet",
                    }}
                />
            </StatsGridContainer>
        </StatsGrid>
    ),
    name: "3.2 Animation - Slide",
};

export const ScaleAnimationStats: Story = {
    render: () => (
        <StatsGrid
            variant="light"
            columns={4}
            contentAlign="center"
            padding="lg"
            animated={true}
            animationType="scale"
            gap="lg"
        >
            <StatsGridTitle>Scale Animation</StatsGridTitle>
            <StatsGridDescription>
                Cards scale in from 0.9 to 1 with a smooth bounce effect.
            </StatsGridDescription>
            <StatsGridContainer>
                <StatsGridCard
                    stat={{
                        value: 10000000,
                        label: "Active Users",
                        icon: Users,
                        format: "compact",
                        accent: "blue",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 99.9,
                        label: "Uptime SLA",
                        icon: Shield,
                        format: "percentage",
                        suffix: "%",
                        accent: "emerald",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 2500000000,
                        label: "Revenue",
                        icon: DollarSign,
                        format: "currency",
                        accent: "amber",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 50000000,
                        label: "Downloads",
                        icon: Download,
                        format: "compact",
                        suffix: "+",
                        accent: "violet",
                    }}
                />
            </StatsGridContainer>
        </StatsGrid>
    ),
    name: "3.3 Animation - Scale",
};

export const NoAnimationStats: Story = {
    render: () => (
        <StatsGrid
            variant="light"
            columns={4}
            contentAlign="center"
            padding="lg"
            animated={false}
        >
            <StatsGridTitle>No Animation</StatsGridTitle>
            <StatsGridDescription>
                Cards appear instantly without any entrance animation.
            </StatsGridDescription>
            <StatsGridContainer>
                <StatsGridCard
                    stat={{
                        value: 10000000,
                        label: "Active Users",
                        icon: Users,
                        format: "compact",
                        accent: "blue",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 99.9,
                        label: "Uptime SLA",
                        icon: Shield,
                        format: "percentage",
                        suffix: "%",
                        accent: "emerald",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 2500000000,
                        label: "Revenue",
                        icon: DollarSign,
                        format: "currency",
                        accent: "amber",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 50000000,
                        label: "Downloads",
                        icon: Download,
                        format: "compact",
                        suffix: "+",
                        accent: "violet",
                    }}
                />
            </StatsGridContainer>
        </StatsGrid>
    ),
    name: "3.4 Animation - None",
};

/* ============================================
   4. ACCENT COLOR SHOWCASE
============================================ */

export const AccentColorShowcase: Story = {
    render: () => (
        <StatsGrid
            variant="light"
            columns={3}
            contentAlign="center"
            padding="lg"
            animated={true}
        >
            <StatsGridTitle>Accent Color Variants</StatsGridTitle>
            <StatsGridDescription>
                Each stat can have its own accent color for visual distinction.
            </StatsGridDescription>
            <StatsGridContainer>
                <StatsGridCard
                    stat={{
                        value: 1000000,
                        label: "Blue Accent",
                        icon: Users,
                        format: "compact",
                        accent: "blue",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 99.9,
                        label: "Emerald Accent",
                        icon: Shield,
                        format: "percentage",
                        suffix: "%",
                        accent: "emerald",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 50000000,
                        label: "Amber Accent",
                        icon: DollarSign,
                        format: "currency",
                        accent: "amber",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 1000000,
                        label: "Rose Accent",
                        icon: Heart,
                        format: "compact",
                        accent: "rose",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 99.9,
                        label: "Violet Accent",
                        icon: Star,
                        format: "percentage",
                        suffix: "%",
                        accent: "violet",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 50000000,
                        label: "Purple Accent",
                        icon: Crown,
                        format: "currency",
                        accent: "purple",
                    }}
                />
            </StatsGridContainer>
        </StatsGrid>
    ),
    name: "4.1 Accent Colors - Showcase",
};
export const AccentColorsOnDark: Story = {
    render: () => (
        <StatsGrid
            variant="dark"
            columns={3}
            contentAlign="center"
            padding="lg"
            animated={true}
        >
            <StatsGridTitle>Accent Colors on Dark</StatsGridTitle>
            <StatsGridDescription>
                Accent colors pop dramatically against deep dark backgrounds.
            </StatsGridDescription>
            <StatsGridContainer>
                <StatsGridCard
                    stat={{
                        value: 1000000,
                        label: "Blue Accent",
                        icon: Users,
                        format: "compact",
                        accent: "blue",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 99.9,
                        label: "Emerald Accent",
                        icon: Shield,
                        format: "percentage",
                        suffix: "%",
                        accent: "emerald",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 50000000,
                        label: "Amber Accent",
                        icon: DollarSign,
                        format: "currency",
                        accent: "amber",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 1000000,
                        label: "Rose Accent",
                        icon: Heart,
                        format: "compact",
                        accent: "rose",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 99.9,
                        label: "Violet Accent",
                        icon: Star,
                        format: "percentage",
                        suffix: "%",
                        accent: "violet",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 50000000,
                        label: "Purple Accent",
                        icon: Crown,
                        format: "currency",
                        accent: "purple",
                    }}
                />
            </StatsGridContainer>
        </StatsGrid>
    ),
    name: "4.2 Accent Colors - Dark Theme",
};

/* ============================================
   5. NUMBER FORMATTING SHOWCASE
============================================ */

export const DarkThemeGradient: Story = {
    render: () => (
        <div className="bg-gradient-to-br from-gray-950 via-gray-900 to-black">
            <StatsGrid
                variant="dark"
                columns={4}
                contentAlign="center"
                padding="xl"
                animated={true}
                animationType="slide"
            >
                <StatsGridTitle>Deep Dark Gradient</StatsGridTitle>
                <StatsGridDescription>
                    Rich, deep gradients create dramatic depth and atmosphere.
                </StatsGridDescription>
                <StatsGridContainer>
                    <StatsGridCard
                        stat={{
                            value: 10000000,
                            label: "Active Users",
                            subtext: "Growing 20% month over month",
                            icon: Users,
                            format: "compact",
                            accent: "blue",
                        }}
                    />
                    <StatsGridCard
                        stat={{
                            value: 99.99,
                            label: "Uptime SLA",
                            subtext: "Enterprise-grade reliability",
                            icon: Shield,
                            format: "percentage",
                            suffix: "%",
                            accent: "emerald",
                        }}
                    />
                    <StatsGridCard
                        stat={{
                            value: 2500000000,
                            label: "Annual Revenue",
                            subtext: "Record growth this quarter",
                            icon: DollarSign,
                            format: "currency",
                            accent: "amber",
                        }}
                    />
                    <StatsGridCard
                        stat={{
                            value: 50000000,
                            label: "Downloads",
                            subtext: "Across all platforms",
                            icon: Download,
                            format: "compact",
                            suffix: "+",
                            accent: "violet",
                        }}
                    />
                </StatsGridContainer>
            </StatsGrid>
        </div>
    ),
    name: "5.1 Dark Theme - Deep Gradient",
};

export const DarkThemeMinimal: Story = {
    render: () => (
        <div className="bg-neutral-950">
            <StatsGrid
                variant="dark"
                columns={4}
                contentAlign="center"
                padding="lg"
                animated={true}
                animationType="fade"
            >
                <StatsGridTitle>Pure Black Minimal</StatsGridTitle>
                <StatsGridDescription>
                    True black background for maximum contrast and OLED efficiency.
                </StatsGridDescription>
                <StatsGridContainer>
                    <StatsGridCard
                        stat={{
                            value: 15000000,
                            label: "Total Users",
                            icon: Users,
                            format: "compact",
                            accent: "blue",
                        }}
                    />
                    <StatsGridCard
                        stat={{
                            value: 98.5,
                            label: "Satisfaction Rate",
                            icon: Star,
                            format: "percentage",
                            suffix: "%",
                            accent: "emerald",
                        }}
                    />
                    <StatsGridCard
                        stat={{
                            value: 3500000000,
                            label: "Revenue",
                            icon: DollarSign,
                            format: "currency",
                            accent: "amber",
                        }}
                    />
                    <StatsGridCard
                        stat={{
                            value: 75000000,
                            label: "Downloads",
                            icon: Download,
                            format: "compact",
                            accent: "violet",
                        }}
                    />
                </StatsGridContainer>
            </StatsGrid>
        </div>
    ),
    name: "5.2 Dark Theme - Pure Black",
};

export const DarkThemeWithIcons: Story = {
    render: () => (
        <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
            <StatsGrid
                variant="dark"
                columns={3}
                contentAlign="center"
                padding="lg"
                animated={true}
                animationType="scale"
            >
                <StatsGridTitle>Vibrant Icons on Dark</StatsGridTitle>
                <StatsGridDescription>
                    Icons with intense colors that glow against the dark canvas.
                </StatsGridDescription>
                <StatsGridContainer>
                    <StatsGridCard
                        stat={{
                            value: 99.9,
                            label: "System Uptime",
                            subtext: "99.9% availability guaranteed",
                            icon: Zap,
                            format: "percentage",
                            suffix: "%",
                            accent: "amber",
                        }}
                    />
                    <StatsGridCard
                        stat={{
                            value: 1000000,
                            label: "API Calls/Day",
                            subtext: "Average daily volume",
                            icon: Activity,
                            format: "compact",
                            accent: "blue",
                        }}
                    />
                    <StatsGridCard
                        stat={{
                            value: 250,
                            label: "Team Members",
                            subtext: "Across 15 countries",
                            icon: Users,
                            format: "raw",
                            accent: "emerald",
                        }}
                    />
                    <StatsGridCard
                        stat={{
                            value: 50000,
                            label: "GitHub Stars",
                            subtext: "Open source community",
                            icon: Star,
                            format: "compact",
                            accent: "violet",
                        }}
                    />
                    <StatsGridCard
                        stat={{
                            value: 98,
                            label: "Customer Retention",
                            subtext: "Annual retention rate",
                            icon: Heart,
                            format: "percentage",
                            suffix: "%",
                            accent: "rose",
                        }}
                    />
                    <StatsGridCard
                        stat={{
                            value: 45,
                            label: "Countries Served",
                            subtext: "Global presence",
                            icon: Globe,
                            format: "raw",
                            accent: "purple",
                        }}
                    />
                </StatsGridContainer>
            </StatsGrid>
        </div>
    ),
    name: "5.3 Dark Theme - Vibrant Icons",
};

export const DarkThemeNoBorders: Story = {
    render: () => (
        <div className="bg-[#0A0A0F]">
            <StatsGrid
                variant="dark"
                columns={4}
                contentAlign="center"
                padding="xl"
                animated={true}
                animationType="slide"
            >
                <StatsGridTitle>Borderless & Atmospheric</StatsGridTitle>
                <StatsGridDescription>
                    Cards without borders for a cleaner, more ethereal look.
                </StatsGridDescription>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { value: 10000000, label: "Active Users", icon: Users, color: "blue", format: "compact" },
                        { value: 99.99, label: "Uptime", icon: Shield, color: "emerald", format: "percentage", suffix: "%" },
                        { value: 2500000000, label: "Revenue", icon: DollarSign, color: "amber", format: "currency" },
                        { value: 50000000, label: "Downloads", icon: Download, color: "violet", format: "compact", suffix: "+" },
                    ].map((stat, i) => (
                        <div key={i} className="bg-gradient-to-br from-gray-800/10 via-gray-800/5 to-transparent backdrop-blur-sm rounded-2xl p-6 border border-gray-700/20">
                            <div className="flex items-start justify-between">
                                <div>
                                    <StatLabel>{stat.label}</StatLabel>
                                    <StatValue
                                        value={stat.value}
                                        format={stat.format as any}
                                        suffix={stat.suffix}
                                        className="text-3xl mt-2"
                                    />
                                </div>
                                <StatIcon icon={stat.icon} accent={stat.color as any} size="lg" />
                            </div>
                        </div>
                    ))}
                </div>
            </StatsGrid>
        </div>
    ),
    name: "5.4 Dark Theme - Borderless",
};

export const DarkThemeGlassy: Story = {
    render: () => (
        <div className="bg-[#0B0B0F] relative overflow-hidden">
            {/* Animated gradient orbs */}
            <div className="absolute top-0 -left-20 w-96 h-96 bg-purple-900/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 -right-20 w-96 h-96 bg-blue-900/20 rounded-full blur-3xl animate-pulse delay-1000" />

            <StatsGrid
                variant="dark"
                columns={4}
                contentAlign="center"
                padding="xl"
                animated={true}
                animationType="fade"
            >
                <StatsGridTitle>Glass Morphism Dark</StatsGridTitle>
                <StatsGridDescription>
                    Frosted glass effect with deep dark background.
                </StatsGridDescription>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                    {[
                        { value: 10000000, label: "Users", icon: Users, color: "blue" },
                        { value: 99.99, label: "Uptime", icon: Shield, color: "emerald", suffix: "%" },
                        { value: 2500000000, label: "Revenue", icon: DollarSign, color: "amber" },
                        { value: 50000000, label: "Downloads", icon: Download, color: "violet", suffix: "+" },
                    ].map((stat, i) => (
                        <div key={i} className="backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10 shadow-2xl">
                            <div className="flex items-start justify-between">
                                <div>
                                    <StatLabel className="text-gray-400">{stat.label}</StatLabel>
                                    <p className="text-white text-3xl font-bold mt-2">
                                        {stat.format === 'currency' ? '$' : ''}
                                        {stat.value.toLocaleString()}
                                        {stat.suffix || (stat.format === 'percentage' ? '%' : '')}
                                    </p>
                                </div>
                                <div className={cn(
                                    "p-3 rounded-xl",
                                    stat.color === "blue" && "bg-blue-500/20",
                                    stat.color === "emerald" && "bg-emerald-500/20",
                                    stat.color === "amber" && "bg-amber-500/20",
                                    stat.color === "violet" && "bg-violet-500/20",
                                )}>
                                    {React.createElement(stat.icon, {
                                        className: cn(
                                            "w-6 h-6",
                                            stat.color === "blue" && "text-blue-400",
                                            stat.color === "emerald" && "text-emerald-400",
                                            stat.color === "amber" && "text-amber-400",
                                            stat.color === "violet" && "text-violet-400",
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </StatsGrid>
        </div>
    ),
    name: "5.5 Dark Theme - Glass Morphism",
};


/* ============================================
   6. USE CASE EXAMPLES
============================================ */

export const SaaSExample: Story = {
    render: () => (
        <StatsGrid
            variant="light"
            columns={4}
            contentAlign="center"
            padding="lg"
            animated={true}
        >
            <StatsGridTitle>SaaS Business Metrics</StatsGridTitle>
            <StatsGridDescription>
                Key performance indicators for a subscription-based business.
            </StatsGridDescription>
            <StatsGridContainer>
                <StatsGridCard
                    stat={{
                        value: 2500000,
                        label: "Monthly Recurring Revenue",
                        subtext: "Up 32% from last quarter",
                        icon: CircleDollarSign,
                        format: "currency",
                        accent: "amber",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 15000,
                        label: "Active Subscribers",
                        subtext: "Paying customers",
                        icon: Users,
                        format: "compact",
                        accent: "blue",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 98.5,
                        label: "Retention Rate",
                        subtext: "Monthly customer retention",
                        icon: HeartHandshake,
                        format: "percentage",
                        suffix: "%",
                        accent: "emerald",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 45000,
                        label: "Trial Signups",
                        subtext: "Last 30 days",
                        icon: UserPlus,
                        format: "compact",
                        accent: "violet",
                    }}
                />
            </StatsGridContainer>
        </StatsGrid>
    ),
    name: "6.1 Use Case - SaaS Metrics",
};

export const EcommerceExample: Story = {
    render: () => (
        <StatsGrid
            variant="light"
            columns={3}
            contentAlign="center"
            padding="lg"
            animated={true}
        >
            <StatsGridTitle>E-commerce Dashboard</StatsGridTitle>
            <StatsGridDescription>
                Real-time store performance and customer metrics.
            </StatsGridDescription>
            <StatsGridContainer>
                <StatsGridCard
                    stat={{
                        value: 1500000,
                        label: "Monthly Revenue",
                        subtext: "Gross merchandise value",
                        icon: CreditCard,
                        format: "currency",
                        accent: "amber",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 25000,
                        label: "Orders Processed",
                        subtext: "This month, up 15%",
                        icon: ShoppingCart,
                        format: "compact",
                        accent: "blue",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 85.5,
                        label: "Conversion Rate",
                        subtext: "Visitors to customers",
                        icon: TrendingUp,
                        format: "percentage",
                        suffix: "%",
                        accent: "emerald",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 4.8,
                        label: "Average Rating",
                        subtext: "From 50K+ reviews",
                        icon: Star,
                        format: "raw",
                        decimals: 1,
                        accent: "violet",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 35000,
                        label: "Returning Customers",
                        subtext: "Loyalty members",
                        icon: Heart,
                        format: "compact",
                        accent: "rose",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 1250,
                        label: "Products Sold",
                        subtext: "Unique items",
                        icon: Package,
                        format: "raw",
                        accent: "purple",
                    }}
                />
            </StatsGridContainer>
        </StatsGrid>
    ),
    name: "6.2 Use Case - E-commerce",
};

export const MarketingExample: Story = {
    render: () => (
        <StatsGrid
            variant="light"
            columns={3}
            contentAlign="center"
            padding="lg"
            animated={true}
        >
            <StatsGridTitle>Marketing Performance</StatsGridTitle>
            <StatsGridDescription>
                Key metrics from marketing campaigns and channels.
            </StatsGridDescription>
            <StatsGridContainer>
                <StatsGridCard
                    stat={{
                        value: 2500000,
                        label: "Email Subscribers",
                        subtext: "32% open rate",
                        icon: Mail,
                        format: "compact",
                        accent: "blue",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 750000,
                        label: "Social Followers",
                        subtext: "Across all platforms",
                        icon: Users,
                        format: "compact",
                        accent: "emerald",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 150000,
                        label: "Monthly Visitors",
                        subtext: "Organic + Paid",
                        icon: Globe,
                        format: "compact",
                        accent: "amber",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 1250,
                        label: "Blog Posts",
                        subtext: "Published to date",
                        icon: FileText,
                        format: "raw",
                        accent: "violet",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 45,
                        label: "Live Campaigns",
                        subtext: "Across channels",
                        icon: Flag,
                        format: "raw",
                        accent: "rose",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 12.5,
                        label: "Conversion Rate",
                        subtext: "Marketing qualified leads",
                        icon: Target,
                        format: "percentage",
                        suffix: "%",
                        accent: "purple",
                    }}
                />
            </StatsGridContainer>
        </StatsGrid>
    ),
    name: "6.3 Use Case - Marketing",
};

export const StartupExample: Story = {
    render: () => (
        <StatsGrid
            variant="dark"
            columns={3}
            contentAlign="center"
            padding="lg"
            animated={true}
        >
            <StatsGridTitle>Startup Milestones</StatsGridTitle>
            <StatsGridDescription>
                Key achievements on our growth journey.
            </StatsGridDescription>
            <StatsGridContainer>
                <StatsGridCard
                    stat={{
                        value: 5000000,
                        label: "Funding Raised",
                        subtext: "Series A led by Top VC Partners",
                        icon: Rocket,
                        format: "currency",
                        accent: "violet",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 50,
                        label: "Team Members",
                        subtext: "Across 4 countries",
                        icon: Users,
                        format: "raw",
                        accent: "blue",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 100000,
                        label: "Active Users",
                        subtext: "Growing 200% month over month",
                        icon: Heart,
                        format: "compact",
                        accent: "rose",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 97,
                        label: "NPS Score",
                        subtext: "Customer satisfaction",
                        icon: Star,
                        format: "raw",
                        accent: "amber",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 3,
                        label: "Years in Business",
                        subtext: "Bootstrapped to Series A",
                        icon: Calendar,
                        format: "raw",
                        accent: "emerald",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 15,
                        label: "Enterprise Clients",
                        subtext: "Fortune 500 companies",
                        icon: Building,
                        format: "raw",
                        accent: "purple",
                    }}
                />
            </StatsGridContainer>
        </StatsGrid>
    ),
    name: "6.4 Use Case - Startup",
};

export const TechExample: Story = {
    render: () => (
        <StatsGrid
            variant="dark"
            columns={3}
            contentAlign="center"
            padding="lg"
            animated={true}
        >
            <StatsGridTitle>Infrastructure Metrics</StatsGridTitle>
            <StatsGridDescription>
                Engineering and system performance KPIs.
            </StatsGridDescription>
            <StatsGridContainer>
                <StatsGridCard
                    stat={{
                        value: 1000000000,
                        label: "API Calls",
                        subtext: "Processed monthly",
                        icon: Zap,
                        format: "compact",
                        accent: "blue",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 99.99,
                        label: "Uptime",
                        subtext: "Last 30 days",
                        icon: Shield,
                        format: "percentage",
                        suffix: "%",
                        accent: "emerald",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 5000000,
                        label: "Data Points",
                        subtext: "Per second",
                        icon: Database,
                        format: "compact",
                        accent: "amber",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 1000,
                        label: "Servers",
                        subtext: "Global infrastructure",
                        icon: Server,
                        format: "raw",
                        accent: "violet",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 50,
                        label: "Edge Locations",
                        subtext: "Worldwide CDN",
                        icon: Network,
                        format: "raw",
                        accent: "purple",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 99.95,
                        label: "Success Rate",
                        subtext: "Request success",
                        icon: CheckCircle,
                        format: "percentage",
                        suffix: "%",
                        accent: "rose",
                    }}
                />
            </StatsGridContainer>
        </StatsGrid>
    ),
    name: "6.5 Use Case - Tech Infrastructure",
};

export const HealthcareExample: Story = {
    render: () => (
        <StatsGrid
            variant="light"
            columns={3}
            contentAlign="center"
            padding="lg"
            animated={true}
        >
            <StatsGridTitle>Healthcare Analytics</StatsGridTitle>
            <StatsGridDescription>
                Patient care and operational metrics.
            </StatsGridDescription>
            <StatsGridContainer>
                <StatsGridCard
                    stat={{
                        value: 50000,
                        label: "Patients Treated",
                        subtext: "Last 12 months",
                        icon: HeartPulse,
                        format: "compact",
                        accent: "rose",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 98.5,
                        label: "Satisfaction Rate",
                        subtext: "Patient feedback",
                        icon: Smile,
                        format: "percentage",
                        suffix: "%",
                        accent: "emerald",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 250,
                        label: "Medical Staff",
                        subtext: "Qualified professionals",
                        icon: Users,
                        format: "raw",
                        accent: "blue",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 15,
                        label: "Locations",
                        subtext: "Nationwide clinics",
                        icon: Building,
                        format: "raw",
                        accent: "amber",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 99.9,
                        label: "Success Rate",
                        subtext: "Treatment success",
                        icon: CheckCircle,
                        format: "percentage",
                        suffix: "%",
                        accent: "violet",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 24,
                        label: "Emergency Response",
                        subtext: "Average response time",
                        icon: Timer,
                        format: "raw",
                        suffix: "min",
                        accent: "purple",
                    }}
                />
            </StatsGridContainer>
        </StatsGrid>
    ),
    name: "6.6 Use Case - Healthcare",
};

export const FinancialExample: Story = {
    render: () => (
        <StatsGrid
            variant="light"
            columns={3}
            contentAlign="center"
            padding="lg"
            animated={true}
        >
            <StatsGridTitle>Financial Metrics</StatsGridTitle>
            <StatsGridDescription>
                Key performance indicators for financial services.
            </StatsGridDescription>
            <StatsGridContainer>
                <StatsGridCard
                    stat={{
                        value: 15000000000,
                        label: "Assets Under Management",
                        subtext: "Total AUM across funds",
                        icon: Banknote,
                        format: "currency",
                        accent: "amber",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 2500000,
                        label: "Daily Transactions",
                        subtext: "Average daily volume",
                        icon: CreditCard,
                        format: "compact",
                        accent: "blue",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 99.97,
                        label: "Transaction Success",
                        subtext: "Success rate",
                        icon: CheckCircle,
                        format: "percentage",
                        suffix: "%",
                        accent: "emerald",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 500000,
                        label: "Active Accounts",
                        subtext: "Retail + institutional",
                        icon: Users,
                        format: "compact",
                        accent: "violet",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 150,
                        label: "Countries Served",
                        subtext: "Global presence",
                        icon: Globe,
                        format: "raw",
                        accent: "purple",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 25,
                        label: "Years in Business",
                        subtext: "Since founding",
                        icon: Calendar,
                        format: "raw",
                        accent: "rose",
                    }}
                />
            </StatsGridContainer>
        </StatsGrid>
    ),
    name: "6.7 Use Case - Financial",
};

/* ============================================
   7. STAT SUB-COMPONENTS SHOWCASE
============================================ */

export const StatSubComponentsShowcase: Story = {
    render: () => (
        <StatsGrid
            variant="light"
            columns={2}
            contentAlign="center"
            padding="lg"
            animated={true}
        >
            <StatsGridTitle>Stat Sub-Components</StatsGridTitle>
            <StatsGridDescription>
                Use individual components to create custom layouts.
            </StatsGridDescription>
            <StatsGridContainer>
                {/* Custom Card 1 - Horizontal Layout */}
                <div className="flex items-center gap-4 p-6 border rounded-lg bg-card">
                    <StatIcon icon={Users} accent="blue" size="lg" />
                    <div className="flex-1">
                        <StatLabel>Total Users</StatLabel>
                        <StatValue value={1500000} format="compact" className="text-3xl" />
                        <StatSubtext>↑ 12% from last month</StatSubtext>
                    </div>
                </div>

                {/* Custom Card 2 - Vertical Centered */}
                <div className="flex flex-col items-center text-center p-6 border rounded-lg bg-card">
                    <StatIcon icon={DollarSign} accent="amber" size="lg" className="mb-3" />
                    <StatLabel>Revenue</StatLabel>
                    <StatValue value={2500000} format="currency" className="text-3xl mt-1" />
                    <StatSubtext>Quarterly earnings</StatSubtext>
                </div>

                {/* Custom Card 3 - Minimal */}
                <div className="p-6 border rounded-lg bg-card">
                    <StatLabel as="h3" className="text-base">Customer Satisfaction</StatLabel>
                    <div className="flex items-baseline gap-2 mt-2">
                        <StatValue value={98.5} format="percentage" suffix="%" className="text-4xl" />
                        <span className="text-sm text-muted-foreground">NPS Score</span>
                    </div>
                </div>

                {/* Custom Card 4 - Side by Side Values */}
                <div className="p-6 border rounded-lg bg-card">
                    <StatLabel className="mb-3">Key Metrics</StatLabel>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <StatValue value={99.9} format="percentage" suffix="%" className="text-2xl" />
                            <StatSubtext>Uptime</StatSubtext>
                        </div>
                        <div>
                            <StatValue value={45} format="raw" suffix="ms" className="text-2xl" />
                            <StatSubtext>Latency</StatSubtext>
                        </div>
                    </div>
                </div>
            </StatsGridContainer>
        </StatsGrid>
    ),
    name: "7.1 Sub-Components - Custom Layouts",
};

export const StatValueVariants: Story = {
    render: () => (
        <StatsGrid variant="light" columns={3} contentAlign="center" padding="lg" animated={true}>
            <StatsGridTitle>StatValue Variations</StatsGridTitle>
            <StatsGridDescription>
                Different ways to display and format values.
            </StatsGridDescription>
            <StatsGridContainer>
                <div className="p-6 border rounded-lg bg-card">
                    <StatLabel>Compact Format</StatLabel>
                    <StatValue value={1234567} format="compact" className="text-3xl mt-2" />
                </div>
                <div className="p-6 border rounded-lg bg-card">
                    <StatLabel>Currency Format</StatLabel>
                    <StatValue value={45000000} format="currency" className="text-3xl mt-2" />
                </div>
                <div className="p-6 border rounded-lg bg-card">
                    <StatLabel>Percentage Format</StatLabel>
                    <StatValue value={87.5} format="percentage" suffix="%" className="text-3xl mt-2" />
                </div>
                <div className="p-6 border rounded-lg bg-card">
                    <StatLabel>Custom Prefix/Suffix</StatLabel>
                    <StatValue value={1000} format="raw" prefix="€" suffix="/mo" className="text-3xl mt-2" />
                </div>
                <div className="p-6 border rounded-lg bg-card">
                    <StatLabel>With Decimals</StatLabel>
                    <StatValue value={3.14159} format="raw" decimals={2} className="text-3xl mt-2" />
                </div>
                <div className="p-6 border rounded-lg bg-card">
                    <StatLabel>Large Number</StatLabel>
                    <StatValue value={9999999999} format="compact" className="text-3xl mt-2" />
                </div>
            </StatsGridContainer>
        </StatsGrid>
    ),
    name: "7.2 Sub-Components - StatValue Variants",
};

/* ============================================
   8. EDGE CASES
============================================ */

export const EdgeCases: Story = {
    render: () => (
        <StatsGrid
            variant="light"
            columns={3}
            contentAlign="center"
            padding="lg"
            animated={true}
        >
            <StatsGridTitle>Edge Cases</StatsGridTitle>
            <StatsGridDescription>
                Testing zero, large numbers, negatives, and custom formatting.
            </StatsGridDescription>
            <StatsGridContainer>
                <StatsGridCard
                    stat={{
                        value: 0,
                        label: "Zero Value",
                        subtext: "Handles zero correctly",
                        icon: Activity,
                        format: "compact",
                        accent: "blue",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 999999999999,
                        label: "Very Large Number",
                        subtext: "999.9B",
                        icon: TrendingUp,
                        format: "compact",
                        accent: "amber",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 0.0001,
                        label: "Very Small Number",
                        subtext: "4 decimal places",
                        icon: Target,
                        format: "raw",
                        decimals: 4,
                        accent: "emerald",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: -1000000,
                        label: "Negative Number",
                        subtext: "Shows with minus sign",
                        icon: TrendingDown,
                        format: "compact",
                        accent: "rose",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 1234.5678,
                        label: "Custom Decimals",
                        subtext: "3 decimal places",
                        icon: Calculator,
                        format: "raw",
                        decimals: 3,
                        accent: "violet",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 1000,
                        label: "Custom Prefix/Suffix",
                        subtext: "€1,000/mo",
                        icon: CircleDollarSign,
                        format: "raw",
                        prefix: "€",
                        suffix: "/mo",
                        accent: "purple",
                    }}
                />
            </StatsGridContainer>
        </StatsGrid>
    ),
    name: "8.1 Edge Cases - Number Handling",
};

export const SingleStat: Story = {
    render: () => (
        <StatsGrid
            variant="light"
            columns={1}
            contentAlign="center"
            padding="lg"
            animated={true}
        >
            <StatsGridTitle>Single Stat</StatsGridTitle>
            <StatsGridDescription>
                Works with just one statistic in the grid.
            </StatsGridDescription>
            <StatsGridContainer>
                <StatsGridCard
                    stat={{
                        value: 10000000,
                        label: "Total Users",
                        subtext: "Across all platforms",
                        icon: Users,
                        format: "compact",
                        accent: "blue",
                    }}
                />
            </StatsGridContainer>
        </StatsGrid>
    ),
    name: "8.2 Edge Cases - Single Stat",
};

export const NoIconsNoSubtext: Story = {
    render: () => (
        <StatsGrid
            variant="light"
            columns={4}
            contentAlign="center"
            padding="lg"
            animated={true}
        >
            <StatsGridTitle>Minimal Design</StatsGridTitle>
            <StatsGridDescription>
                No icons, no subtext - just numbers and labels.
            </StatsGridDescription>
            <StatsGridContainer>
                <StatsGridCard
                    stat={{
                        value: 10000000,
                        label: "Active Users",
                        format: "compact",
                        accent: "blue",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 99.9,
                        label: "Uptime SLA",
                        format: "percentage",
                        suffix: "%",
                        accent: "emerald",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 2500000000,
                        label: "Revenue",
                        format: "currency",
                        accent: "amber",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 50000000,
                        label: "Downloads",
                        format: "compact",
                        suffix: "+",
                        accent: "violet",
                    }}
                />
            </StatsGridContainer>
        </StatsGrid>
    ),
    name: "8.3 Edge Cases - No Icons, No Subtext",
};


/* ============================================
   6. ACCENT COLOR COMBINATIONS
============================================ */

export const AllAccentColors: Story = {
    render: () => (
        <StatsGrid
            variant="light"
            columns={4}
            contentAlign="center"
            padding="lg"
            animated={true}
        >
            <StatsGridTitle>All Accent Colors</StatsGridTitle>
            <StatsGridDescription>
                Showcase of all available accent color options.
            </StatsGridDescription>
            <StatsGridContainer>
                <StatsGridCard
                    stat={{
                        value: 1000000,
                        label: "Default Accent",
                        icon: Circle,
                        format: "compact",
                        accent: "default",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 1000000,
                        label: "Blue Accent",
                        icon: Circle,
                        format: "compact",
                        accent: "blue",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 1000000,
                        label: "Emerald Accent",
                        icon: Circle,
                        format: "compact",
                        accent: "emerald",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 1000000,
                        label: "Amber Accent",
                        icon: Circle,
                        format: "compact",
                        accent: "amber",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 1000000,
                        label: "Rose Accent",
                        icon: Circle,
                        format: "compact",
                        accent: "rose",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 1000000,
                        label: "Violet Accent",
                        icon: Circle,
                        format: "compact",
                        accent: "violet",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 1000000,
                        label: "Purple Accent",
                        icon: Circle,
                        format: "compact",
                        accent: "purple",
                    }}
                />
            </StatsGridContainer>
        </StatsGrid>
    ),
    name: "6.1 Accent Colors - All Variants",
};

export const AccentColorsMixed: Story = {
    render: () => (
        <StatsGrid
            variant="light"
            columns={3}
            contentAlign="center"
            padding="lg"
            animated={true}
        >
            <StatsGridTitle>Mixed Accent Colors</StatsGridTitle>
            <StatsGridDescription>
                Each card can have its own accent color for visual hierarchy.
            </StatsGridDescription>
            <StatsGridContainer>
                <StatsGridCard
                    stat={{
                        value: 99.9,
                        label: "Performance",
                        subtext: "System uptime",
                        icon: Zap,
                        format: "percentage",
                        suffix: "%",
                        accent: "amber",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 1000000,
                        label: "Users",
                        subtext: "Active monthly",
                        icon: Users,
                        format: "compact",
                        accent: "blue",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 98.5,
                        label: "Satisfaction",
                        subtext: "Customer rating",
                        icon: Star,
                        format: "percentage",
                        suffix: "%",
                        accent: "emerald",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 2500000,
                        label: "Revenue",
                        subtext: "Monthly recurring",
                        icon: DollarSign,
                        format: "currency",
                        accent: "violet",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 50000,
                        label: "Support Tickets",
                        subtext: "Resolved this month",
                        icon: HeartHandshake,
                        format: "compact",
                        accent: "rose",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 15,
                        label: "New Features",
                        subtext: "Released in Q2",
                        icon: Rocket,
                        format: "raw",
                        accent: "purple",
                    }}
                />
            </StatsGridContainer>
        </StatsGrid>
    ),
    name: "6.2 Accent Colors - Mixed",
};

export const AccentColorsOnDarkMixed: Story = {
    render: () => (
        <div className="bg-gradient-to-b from-neutral-950 via-slate-950 to-neutral-950">
            <StatsGrid
                variant="dark"
                columns={3}
                contentAlign="center"
                padding="lg"
                animated={true}
            >
                <StatsGridTitle>Mixed Accents on Deep Dark</StatsGridTitle>
                <StatsGridDescription>
                    Each accent color creates its own luminous atmosphere.
                </StatsGridDescription>
                <StatsGridContainer>
                    <StatsGridCard
                        stat={{
                            value: 99.99,
                            label: "Uptime SLA",
                            subtext: "Enterprise grade",
                            icon: Shield,
                            format: "percentage",
                            suffix: "%",
                            accent: "emerald",
                        }}
                    />
                    <StatsGridCard
                        stat={{
                            value: 15000000,
                            label: "Active Users",
                            subtext: "Global audience",
                            icon: Users,
                            format: "compact",
                            accent: "blue",
                        }}
                    />
                    <StatsGridCard
                        stat={{
                            value: 5000000000,
                            label: "Total Revenue",
                            subtext: "Annual run rate",
                            icon: DollarSign,
                            format: "currency",
                            accent: "amber",
                        }}
                    />
                    <StatsGridCard
                        stat={{
                            value: 98,
                            label: "NPS Score",
                            subtext: "Customer loyalty",
                            icon: Heart,
                            format: "raw",
                            accent: "rose",
                        }}
                    />
                    <StatsGridCard
                        stat={{
                            value: 75000000,
                            label: "Downloads",
                            subtext: "All time",
                            icon: Download,
                            format: "compact",
                            suffix: "+",
                            accent: "violet",
                        }}
                    />
                    <StatsGridCard
                        stat={{
                            value: 4.9,
                            label: "App Store Rating",
                            subtext: "Based on 50K reviews",
                            icon: Star,
                            format: "raw",
                            decimals: 1,
                            accent: "purple",
                        }}
                    />
                </StatsGridContainer>
            </StatsGrid>
        </div>
    ),
    name: "6.3 Accent Colors - Dark Theme Mixed",
};

/* ============================================
   7. CUSTOM COLOR SCHEMES
============================================ */

export const MonochromeScheme: Story = {
    render: () => (
        <StatsGrid
            variant="light"
            columns={4}
            contentAlign="center"
            padding="lg"
            animated={true}
        >
            <StatsGridTitle>Monochrome Design</StatsGridTitle>
            <StatsGridDescription>
                Using default accent for a clean, monochromatic look.
            </StatsGridDescription>
            <StatsGridContainer>
                <StatsGridCard
                    stat={{
                        value: 10000000,
                        label: "Active Users",
                        icon: Users,
                        format: "compact",
                        accent: "default",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 99.9,
                        label: "Uptime",
                        icon: Shield,
                        format: "percentage",
                        suffix: "%",
                        accent: "default",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 2500000000,
                        label: "Revenue",
                        icon: DollarSign,
                        format: "currency",
                        accent: "default",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 50000000,
                        label: "Downloads",
                        icon: Download,
                        format: "compact",
                        suffix: "+",
                        accent: "default",
                    }}
                />
            </StatsGridContainer>
        </StatsGrid>
    ),
    name: "7.1 Custom Schemes - Monochrome",
};

export const WarmTones: Story = {
    render: () => (
        <StatsGrid
            variant="light"
            columns={3}
            contentAlign="center"
            padding="lg"
            animated={true}
        >
            <StatsGridTitle>Warm Color Palette</StatsGridTitle>
            <StatsGridDescription>
                Using amber, rose, and emerald for a warm, inviting feel.
            </StatsGridDescription>
            <StatsGridContainer>
                <StatsGridCard
                    stat={{
                        value: 99.9,
                        label: "Customer Satisfaction",
                        icon: Heart,
                        format: "percentage",
                        suffix: "%",
                        accent: "rose",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 15000000,
                        label: "Happy Users",
                        icon: Smile,
                        format: "compact",
                        accent: "amber",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 98.5,
                        label: "Retention Rate",
                        icon: HeartHandshake,
                        format: "percentage",
                        suffix: "%",
                        accent: "emerald",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 2500000,
                        label: "Monthly Active",
                        icon: Activity,
                        format: "compact",
                        accent: "amber",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 4.9,
                        label: "App Rating",
                        icon: Star,
                        format: "raw",
                        decimals: 1,
                        accent: "rose",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 50000,
                        label: "Support Tickets",
                        icon: Timer,
                        format: "compact",
                        accent: "emerald",
                    }}
                />
            </StatsGridContainer>
        </StatsGrid>
    ),
    name: "7.2 Custom Schemes - Warm Tones",
};

export const CoolTones: Story = {
    render: () => (
        <div className="bg-gradient-to-br from-slate-950 via-blue-950/30 to-slate-950">
            <StatsGrid
                variant="dark"
                columns={3}
                contentAlign="center"
                padding="lg"
                animated={true}
            >
                <StatsGridTitle>Arctic Dark Palette</StatsGridTitle>
                <StatsGridDescription>
                    Cool blue tones create a professional, trustworthy atmosphere.
                </StatsGridDescription>
                <StatsGridContainer>
                    <StatsGridCard
                        stat={{
                            value: 99.99,
                            label: "System Uptime",
                            icon: Shield,
                            format: "percentage",
                            suffix: "%",
                            accent: "blue",
                        }}
                    />
                    <StatsGridCard
                        stat={{
                            value: 5000000,
                            label: "API Calls/Day",
                            icon: Zap,
                            format: "compact",
                            accent: "violet",
                        }}
                    />
                    <StatsGridCard
                        stat={{
                            value: 250,
                            label: "Team Size",
                            icon: Users,
                            format: "raw",
                            accent: "purple",
                        }}
                    />
                    <StatsGridCard
                        stat={{
                            value: 1000000,
                            label: "Data Points",
                            icon: Database,
                            format: "compact",
                            accent: "blue",
                        }}
                    />
                    <StatsGridCard
                        stat={{
                            value: 50,
                            label: "Edge Locations",
                            icon: Network,
                            format: "raw",
                            accent: "violet",
                        }}
                    />
                    <StatsGridCard
                        stat={{
                            value: 99.95,
                            label: "Success Rate",
                            icon: CheckCircle,
                            format: "percentage",
                            suffix: "%",
                            accent: "purple",
                        }}
                    />
                </StatsGridContainer>
            </StatsGrid>
        </div>
    ),
    name: "7.3 Custom Schemes - Arctic Dark",
};

export const VibrantPalette: Story = {
    render: () => (
        <StatsGrid
            variant="light"
            columns={3}
            contentAlign="center"
            padding="lg"
            animated={true}
        >
            <StatsGridTitle>Vibrant Color Palette</StatsGridTitle>
            <StatsGridDescription>
                Bold, vibrant colors for high-impact visualization.
            </StatsGridDescription>
            <StatsGridContainer>
                <StatsGridCard
                    stat={{
                        value: 10000000,
                        label: "Active Users",
                        icon: Users,
                        format: "compact",
                        accent: "blue",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 2500000000,
                        label: "Revenue",
                        icon: DollarSign,
                        format: "currency",
                        accent: "amber",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 99.9,
                        label: "Satisfaction",
                        icon: Star,
                        format: "percentage",
                        suffix: "%",
                        accent: "emerald",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 50000000,
                        label: "Downloads",
                        icon: Download,
                        format: "compact",
                        accent: "violet",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 98.5,
                        label: "Retention",
                        icon: Heart,
                        format: "percentage",
                        suffix: "%",
                        accent: "rose",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 4.9,
                        label: "Rating",
                        icon: Award,
                        format: "raw",
                        decimals: 1,
                        accent: "purple",
                    }}
                />
            </StatsGridContainer>
        </StatsGrid>
    ),
    name: "7.4 Custom Schemes - Vibrant",
};

/* ============================================
   8. GRADIENT BACKGROUND VARIANTS
============================================ */

export const GradientLight: Story = {
    render: () => (
        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <StatsGrid
                variant="light"
                columns={4}
                contentAlign="center"
                padding="xl"
                animated={true}
            >
                <StatsGridTitle>Light Gradient Background</StatsGridTitle>
                <StatsGridDescription>
                    Stats grid on top of a custom gradient background.
                </StatsGridDescription>
                <StatsGridContainer>
                    <StatsGridCard
                        stat={{
                            value: 10000000,
                            label: "Active Users",
                            icon: Users,
                            format: "compact",
                            accent: "blue",
                        }}
                    />
                    <StatsGridCard
                        stat={{
                            value: 99.9,
                            label: "Uptime",
                            icon: Shield,
                            format: "percentage",
                            suffix: "%",
                            accent: "emerald",
                        }}
                    />
                    <StatsGridCard
                        stat={{
                            value: 2500000000,
                            label: "Revenue",
                            icon: DollarSign,
                            format: "currency",
                            accent: "amber",
                        }}
                    />
                    <StatsGridCard
                        stat={{
                            value: 50000000,
                            label: "Downloads",
                            icon: Download,
                            format: "compact",
                            suffix: "+",
                            accent: "violet",
                        }}
                    />
                </StatsGridContainer>
            </StatsGrid>
        </div>
    ),
    name: "8.1 Gradients - Light Background",
};

export const GradientDark: Story = {
    render: () => (
        <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
            <StatsGrid
                variant="dark"
                columns={4}
                contentAlign="center"
                padding="xl"
                animated={true}
            >
                <StatsGridTitle>Dark Gradient Background</StatsGridTitle>
                <StatsGridDescription>
                    Stats grid on top of a rich dark gradient.
                </StatsGridDescription>
                <StatsGridContainer>
                    <StatsGridCard
                        stat={{
                            value: 10000000,
                            label: "Active Users",
                            icon: Users,
                            format: "compact",
                            accent: "blue",
                        }}
                    />
                    <StatsGridCard
                        stat={{
                            value: 99.9,
                            label: "Uptime",
                            icon: Shield,
                            format: "percentage",
                            suffix: "%",
                            accent: "emerald",
                        }}
                    />
                    <StatsGridCard
                        stat={{
                            value: 2500000000,
                            label: "Revenue",
                            icon: DollarSign,
                            format: "currency",
                            accent: "amber",
                        }}
                    />
                    <StatsGridCard
                        stat={{
                            value: 50000000,
                            label: "Downloads",
                            icon: Download,
                            format: "compact",
                            suffix: "+",
                            accent: "violet",
                        }}
                    />
                </StatsGridContainer>
            </StatsGrid>
        </div>
    ),
    name: "8.2 Gradients - Dark Background",
};

export const GradientMesh: Story = {
    render: () => (
        <div className="bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-blue-50 to-transparent">
            <StatsGrid
                variant="light"
                columns={4}
                contentAlign="center"
                padding="xl"
                animated={true}
            >
                <StatsGridTitle>Mesh Gradient Background</StatsGridTitle>
                <StatsGridDescription>
                    Modern mesh gradient for a contemporary look.
                </StatsGridDescription>
                <StatsGridContainer>
                    <StatsGridCard
                        stat={{
                            value: 10000000,
                            label: "Active Users",
                            icon: Users,
                            format: "compact",
                            accent: "blue",
                        }}
                    />
                    <StatsGridCard
                        stat={{
                            value: 99.9,
                            label: "Uptime",
                            icon: Shield,
                            format: "percentage",
                            suffix: "%",
                            accent: "emerald",
                        }}
                    />
                    <StatsGridCard
                        stat={{
                            value: 2500000000,
                            label: "Revenue",
                            icon: DollarSign,
                            format: "currency",
                            accent: "amber",
                        }}
                    />
                    <StatsGridCard
                        stat={{
                            value: 50000000,
                            label: "Downloads",
                            icon: Download,
                            format: "compact",
                            suffix: "+",
                            accent: "violet",
                        }}
                    />
                </StatsGridContainer>
            </StatsGrid>
        </div>
    ),
    name: "8.3 Gradients - Mesh",
};

/* ============================================
   9. INDUSTRY-SPECIFIC DARK THEMES
============================================ */
export const DarkThemeTech: Story = {
    render: () => (
        <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
            {/* Circuit board pattern overlay */}
            <div className="absolute inset-0 opacity-5"
                style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, cyan 1px, transparent 0)`,
                    backgroundSize: '40px 40px'
                }}
            />
            <StatsGrid
                variant="dark"
                columns={3}
                contentAlign="center"
                padding="xl"
                animated={true}
                animationType="slide"
            >
                <StatsGridTitle>Tech Infrastructure</StatsGridTitle>
                <StatsGridDescription>
                    Real-time metrics with cyberpunk-inspired dark aesthetic.
                </StatsGridDescription>
                <StatsGridContainer>
                    <StatsGridCard
                        stat={{
                            value: 99.99,
                            label: "API Uptime",
                            subtext: "Last 30 days",
                            icon: Zap,
                            format: "percentage",
                            suffix: "%",
                            accent: "blue",
                        }}
                    />
                    <StatsGridCard
                        stat={{
                            value: 1500000,
                            label: "Requests/Min",
                            subtext: "Peak load",
                            icon: Activity,
                            format: "compact",
                            accent: "violet",
                        }}
                    />
                    <StatsGridCard
                        stat={{
                            value: 45,
                            label: "Avg Latency",
                            subtext: "Milliseconds",
                            icon: Timer,
                            format: "raw",
                            suffix: "ms",
                            accent: "emerald",
                        }}
                    />
                    <StatsGridCard
                        stat={{
                            value: 1000000000,
                            label: "Data Processed",
                            subtext: "Daily",
                            icon: Database,
                            format: "compact",
                            suffix: "GB",
                            accent: "amber",
                        }}
                    />
                    <StatsGridCard
                        stat={{
                            value: 25000,
                            label: "Active Containers",
                            subtext: "Kubernetes cluster",
                            icon: Server,
                            format: "compact",
                            accent: "purple",
                        }}
                    />
                    <StatsGridCard
                        stat={{
                            value: 100,
                            label: "Edge Locations",
                            subtext: "Worldwide",
                            icon: Network,
                            format: "raw",
                            accent: "rose",
                        }}
                    />
                </StatsGridContainer>
            </StatsGrid>
        </div>
    ),
    name: "9.1 Industry Dark - Tech",
};

export const DarkThemeGaming: Story = {
    render: () => (
        <div className="bg-gradient-to-b from-violet-950 via-purple-950 to-fuchsia-950 relative overflow-hidden">
            {/* Neon grid overlay */}
            <div className="absolute inset-0"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,0,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.03) 1px, transparent 1px)`,
                    backgroundSize: '50px 50px'
                }}
            />
            <StatsGrid
                variant="dark"
                columns={3}
                contentAlign="center"
                padding="xl"
                animated={true}
                animationType="scale"
            >
                <StatsGridTitle>Gaming Platform</StatsGridTitle>
                <StatsGridDescription>
                    Neon-drenched metrics from the gaming universe.
                </StatsGridDescription>
                <StatsGridContainer>
                    <StatsGridCard
                        stat={{
                            value: 5000000,
                            label: "Active Players",
                            subtext: "Monthly active users",
                            icon: Users,
                            format: "compact",
                            accent: "violet",
                        }}
                    />
                    <StatsGridCard
                        stat={{
                            value: 1500000,
                            label: "Peak Concurrent",
                            subtext: "All-time record",
                            icon: Activity,
                            format: "compact",
                            accent: "purple",
                        }}
                    />
                    <StatsGridCard
                        stat={{
                            value: 250000000,
                            label: "Matches Played",
                            subtext: "Total to date",
                            icon: Target,
                            format: "compact",
                            accent: "amber",
                        }}
                    />
                    <StatsGridCard
                        stat={{
                            value: 4.8,
                            label: "Avg Rating",
                            subtext: "From 2M+ reviews",
                            icon: Star,
                            format: "raw",
                            decimals: 1,
                            accent: "emerald",
                        }}
                    />
                    <StatsGridCard
                        stat={{
                            value: 50,
                            label: "Tournaments",
                            subtext: "Running this month",
                            icon: Crown,
                            format: "raw",
                            accent: "rose",
                        }}
                    />
                    <StatsGridCard
                        stat={{
                            value: 1000000,
                            label: "Twitch Viewers",
                            subtext: "Monthly watch hours",
                            icon: Eye,
                            format: "compact",
                            accent: "blue",
                        }}
                    />
                </StatsGridContainer>
            </StatsGrid>
        </div>
    ),
    name: "9.2 Industry Dark - Gaming",
};

export const DarkThemeFinance: Story = {
    render: () => (
        <div className="bg-gradient-to-b from-emerald-950 via-teal-950 to-emerald-950 relative overflow-hidden">
            {/* Subtle market pattern */}
            <div className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(16, 185, 129, 0.1) 10px, rgba(16, 185, 129, 0.1) 20px)`,
                }}
            />
            <StatsGrid
                variant="dark"
                columns={3}
                contentAlign="center"
                padding="xl"
                animated={true}
                animationType="fade"
            >
                <StatsGridTitle>Financial Markets</StatsGridTitle>
                <StatsGridDescription>
                    Premium dark theme for serious financial data.
                </StatsGridDescription>
                <StatsGridContainer>
                    <StatsGridCard
                        stat={{
                            value: 2500000000000,
                            label: "Trading Volume",
                            subtext: "24h volume",
                            icon: Banknote,
                            format: "currency",
                            accent: "emerald",
                        }}
                    />
                    <StatsGridCard
                        stat={{
                            value: 1500000,
                            label: "Daily Transactions",
                            subtext: "Average",
                            icon: CreditCard,
                            format: "compact",
                            accent: "blue",
                        }}
                    />
                    <StatsGridCard
                        stat={{
                            value: 500000,
                            label: "Active Traders",
                            subtext: "Daily active",
                            icon: Users,
                            format: "compact",
                            accent: "amber",
                        }}
                    />
                    <StatsGridCard
                        stat={{
                            value: 99.97,
                            label: "Execution Rate",
                            subtext: "Success rate",
                            icon: CheckCircle,
                            format: "percentage",
                            suffix: "%",
                            accent: "emerald",
                        }}
                    />
                    <StatsGridCard
                        stat={{
                            value: 0.001,
                            label: "Avg Spread",
                            subtext: "Major pairs",
                            icon: TrendingDown,
                            format: "raw",
                            decimals: 3,
                            accent: "rose",
                        }}
                    />
                    <StatsGridCard
                        stat={{
                            value: 150,
                            label: "Markets",
                            subtext: "Global exchanges",
                            icon: Globe,
                            format: "raw",
                            accent: "purple",
                        }}
                    />
                </StatsGridContainer>
            </StatsGrid>
        </div>
    ),
    name: "9.3 Industry Dark - Finance",
};

export const DarkThemeCyberpunk: Story = {
    render: () => (
        <div className="bg-black relative overflow-hidden">
            {/* Cyberpunk grid with glow */}
            <div className="absolute inset-0"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(0, 255, 255, 0.05) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255, 0, 255, 0.05) 1px, transparent 1px)
                    `,
                    backgroundSize: '40px 40px'
                }}
            />
            {/* Neon glow orbs */}
            <div className="absolute top-0 -left-20 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 -right-20 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl animate-pulse delay-1000" />

            <StatsGrid
                variant="dark"
                columns={4}
                contentAlign="center"
                padding="xl"
                animated={true}
                animationType="scale"
            >
                <StatsGridTitle>Cyberpunk 2077</StatsGridTitle>
                <StatsGridDescription>
                    Night City's most wanted data streams - enhanced.
                </StatsGridDescription>
                <StatsGridContainer>
                    <StatsGridCard
                        stat={{
                            value: 25000000,
                            label: "Eddies Spent",
                            subtext: "Weekly transactions",
                            icon: Banknote,
                            format: "currency",
                            accent: "amber",
                        }}
                    />
                    <StatsGridCard
                        stat={{
                            value: 5000000,
                            label: "Cyberware Users",
                            subtext: "Enhanced citizens",
                            icon: Zap,
                            format: "compact",
                            accent: "blue",
                        }}
                    />
                    <StatsGridCard
                        stat={{
                            value: 99.9,
                            label: "Network Uptime",
                            subtext: "City net reliability",
                            icon: Network,
                            format: "percentage",
                            suffix: "%",
                            accent: "violet",
                        }}
                    />
                    <StatsGridCard
                        stat={{
                            value: 15000,
                            label: "Active Mercs",
                            subtext: "Available for hire",
                            icon: Users,
                            format: "compact",
                            accent: "rose",
                        }}
                    />
                    <StatsGridCard
                        stat={{
                            value: 85,
                            label: "Gangs Active",
                            subtext: "Across districts",
                            icon: Flag,
                            format: "raw",
                            accent: "purple",
                        }}
                    />
                    <StatsGridCard
                        stat={{
                            value: 99.97,
                            label: "Mission Success",
                            subtext: "Completion rate",
                            icon: Target,
                            format: "percentage",
                            suffix: "%",
                            accent: "emerald",
                        }}
                    />
                    <StatsGridCard
                        stat={{
                            value: 5000000,
                            label: "Data Traffic",
                            subtext: "TB per day",
                            icon: Database,
                            format: "compact",
                            suffix: "TB",
                            accent: "blue",
                        }}
                    />
                    <StatsGridCard
                        stat={{
                            value: 24,
                            label: "Security Level",
                            subtext: "Threat index",
                            icon: Shield,
                            format: "raw",
                            accent: "amber",
                        }}
                    />
                </StatsGridContainer>
            </StatsGrid>
        </div>
    ),
    name: "9.4 Industry Dark - Cyberpunk",
};

/* ============================================
   10. ANIMATION COMBINATIONS
============================================ */

export const DarkThemeWithGlow: Story = {
    render: () => (
        <div className="bg-black">
            <StatsGrid
                variant="dark"
                columns={4}
                contentAlign="center"
                padding="xl"
                animated={true}
                animationType="scale"
            >
                <StatsGridTitle>Neon Glow Effects</StatsGridTitle>
                <StatsGridDescription>
                    Cards with intense neon glow that activates on hover.
                </StatsGridDescription>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { value: 10000000, label: "Users", icon: Users, color: "blue", format: "compact" },
                        { value: 99.99, label: "Uptime", icon: Shield, color: "emerald", format: "percentage", suffix: "%" },
                        { value: 2500000000, label: "Revenue", icon: DollarSign, color: "amber", format: "currency" },
                        { value: 50000000, label: "Downloads", icon: Download, color: "violet", format: "compact" },
                    ].map((stat, i) => (
                        <div
                            key={i}
                            className="group relative"
                        >
                            {/* Animated glow effect */}
                            <div className={cn(
                                "absolute -inset-0.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl",
                                stat.color === "blue" && "bg-blue-600",
                                stat.color === "emerald" && "bg-emerald-600",
                                stat.color === "amber" && "bg-amber-600",
                                stat.color === "violet" && "bg-violet-600",
                            )}></div>

                            {/* Second glow layer for intensity */}
                            <div className={cn(
                                "absolute -inset-1 rounded-xl opacity-0 group-hover:opacity-40 transition-all duration-700 blur-2xl",
                                stat.color === "blue" && "bg-blue-400",
                                stat.color === "emerald" && "bg-emerald-400",
                                stat.color === "amber" && "bg-amber-400",
                                stat.color === "violet" && "bg-violet-400",
                            )}></div>

                            <div className="relative bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl p-6 border border-gray-800 group-hover:border-gray-700 transition-colors">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <StatLabel className="text-gray-400">{stat.label}</StatLabel>
                                        <StatValue
                                            value={stat.value}
                                            format={stat.format as any}
                                            suffix={stat.suffix}
                                            className="text-3xl mt-2 text-white"
                                        />
                                    </div>
                                    <StatIcon icon={stat.icon} accent={stat.color as any} size="lg" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </StatsGrid>
        </div>
    ),
    name: "10.1 Dark Theme - Neon Glow",
};

export const DarkThemeWithPulse: Story = {
    render: () => (
        <div className="bg-gradient-to-b from-gray-950 to-black">
            <StatsGrid
                variant="dark"
                columns={4}
                contentAlign="center"
                padding="xl"
                animated={true}
                animationType="fade"
            >
                <StatsGridTitle>Pulse Animation on Dark</StatsGridTitle>
                <StatsGridDescription>
                    Subtle pulse animation brings cards to life.
                </StatsGridDescription>
                <StatsGridContainer>
                    <StatsGridCard
                        stat={{
                            value: 10000000,
                            label: "Active Users",
                            icon: Users,
                            format: "compact",
                            accent: "blue",
                        }}
                    />
                    <StatsGridCard
                        stat={{
                            value: 99.99,
                            label: "Uptime",
                            icon: Shield,
                            format: "percentage",
                            suffix: "%",
                            accent: "emerald",
                        }}
                    />
                    <StatsGridCard
                        stat={{
                            value: 2500000000,
                            label: "Revenue",
                            icon: DollarSign,
                            format: "currency",
                            accent: "amber",
                        }}
                    />
                    <StatsGridCard
                        stat={{
                            value: 50000000,
                            label: "Downloads",
                            icon: Download,
                            format: "compact",
                            suffix: "+",
                            accent: "violet",
                        }}
                    />
                </StatsGridContainer>
            </StatsGrid>
        </div>
    ),
    name: "10.2 Dark Theme - Pulse",
};

/* ============================================
   11. ACCESSIBILITY & CONTRAST
============================================ */

export const HighContrastDark: Story = {
    render: () => (
        <div className="bg-black">
            <StatsGrid
                variant="dark"
                columns={4}
                contentAlign="center"
                padding="lg"
                animated={true}
            >
                <StatsGridTitle>High Contrast Dark</StatsGridTitle>
                <StatsGridDescription>
                    Maximum contrast for accessibility needs.
                </StatsGridDescription>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { value: 10000000, label: "Users", color: "blue" },
                        { value: 99.99, label: "Uptime", suffix: "%", color: "emerald" },
                        { value: 2500000000, label: "Revenue", color: "amber" },
                        { value: 50000000, label: "Downloads", suffix: "+", color: "violet" },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white border-2 border-white rounded-xl p-6">
                            <StatLabel className="text-black text-sm font-medium">{stat.label}</StatLabel>
                            <p className="text-black text-3xl font-bold mt-2">
                                {stat.value.toLocaleString()}{stat.suffix || ''}
                            </p>
                        </div>
                    ))}
                </div>
            </StatsGrid>
        </div>
    ),
    name: "11.1 Accessibility - High Contrast Dark",
};

export const SoftDarkTheme: Story = {
    render: () => (
        <div className="bg-[#0A0C0E]">
            <StatsGrid
                variant="dark"
                columns={4}
                contentAlign="center"
                padding="lg"
                animated={true}
            >
                <StatsGridTitle>Soft Dark Comfort</StatsGridTitle>
                <StatsGridDescription>
                    Gentle dark theme for reduced eye strain during long sessions.
                </StatsGridDescription>
                <div className="bg-[#14171A] rounded-2xl p-8 border border-gray-800/30">
                    <StatsGridContainer>
                        <StatsGridCard
                            stat={{
                                value: 10000000,
                                label: "Active Users",
                                icon: Users,
                                format: "compact",
                                accent: "blue",
                            }}
                        />
                        <StatsGridCard
                            stat={{
                                value: 99.9,
                                label: "Uptime",
                                icon: Shield,
                                format: "percentage",
                                suffix: "%",
                                accent: "emerald",
                            }}
                        />
                        <StatsGridCard
                            stat={{
                                value: 2500000000,
                                label: "Revenue",
                                icon: DollarSign,
                                format: "currency",
                                accent: "amber",
                            }}
                        />
                        <StatsGridCard
                            stat={{
                                value: 50000000,
                                label: "Downloads",
                                icon: Download,
                                format: "compact",
                                suffix: "+",
                                accent: "violet",
                            }}
                        />
                    </StatsGridContainer>
                </div>
            </StatsGrid>
        </div>
    ),
    name: "11.2 Accessibility - Soft Dark",
};

/* ============================================
   9. RESPONSIVE BEHAVIOR
============================================ */

export const MobileView: Story = {
    parameters: {
        viewport: {
            defaultViewport: "mobile1",
        },
    },
    render: () => (
        <StatsGrid
            variant="light"
            columns={4}
            contentAlign="center"
            padding="lg"
            animated={true}
        >
            <StatsGridTitle>Mobile View</StatsGridTitle>
            <StatsGridDescription>
                Stats stack vertically on mobile, 2 columns on larger screens.
            </StatsGridDescription>
            <StatsGridContainer>
                <StatsGridCard
                    stat={{
                        value: 10000000,
                        label: "Active Users",
                        icon: Users,
                        format: "compact",
                        accent: "blue",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 99.9,
                        label: "Uptime SLA",
                        icon: Shield,
                        format: "percentage",
                        suffix: "%",
                        accent: "emerald",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 2500000000,
                        label: "Revenue",
                        icon: DollarSign,
                        format: "currency",
                        accent: "amber",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 50000000,
                        label: "Downloads",
                        icon: Download,
                        format: "compact",
                        suffix: "+",
                        accent: "violet",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 4.9,
                        label: "App Rating",
                        icon: Star,
                        format: "raw",
                        decimals: 1,
                        accent: "purple",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 24,
                        label: "Support",
                        icon: Clock,
                        format: "raw",
                        suffix: "/7",
                        accent: "rose",
                    }}
                />
            </StatsGridContainer>
        </StatsGrid>
    ),
    name: "9.1 Responsive - Mobile",
};

export const TabletView: Story = {
    parameters: {
        viewport: {
            defaultViewport: "tablet",
        },
    },
    render: () => (
        <StatsGrid
            variant="light"
            columns={4}
            contentAlign="center"
            padding="lg"
            animated={true}
        >
            <StatsGridTitle>Tablet View</StatsGridTitle>
            <StatsGridDescription>
                2 columns on tablet screens, full 4 on desktop.
            </StatsGridDescription>
            <StatsGridContainer>
                <StatsGridCard
                    stat={{
                        value: 10000000,
                        label: "Active Users",
                        icon: Users,
                        format: "compact",
                        accent: "blue",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 99.9,
                        label: "Uptime SLA",
                        icon: Shield,
                        format: "percentage",
                        suffix: "%",
                        accent: "emerald",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 2500000000,
                        label: "Revenue",
                        icon: DollarSign,
                        format: "currency",
                        accent: "amber",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 50000000,
                        label: "Downloads",
                        icon: Download,
                        format: "compact",
                        suffix: "+",
                        accent: "violet",
                    }}
                />
            </StatsGridContainer>
        </StatsGrid>
    ),
    name: "9.2 Responsive - Tablet",
};



/* ============================================
   0. BASIC VARIANTS WITH DIFFERENT THEMES
============================================ */

// Light theme stories
export const CenteredStatsLight: Story = {
    render: () => (
        <StatsGrid
            variant="light"
            columns={4}
            contentAlign="center"
            padding="lg"
            animated={true}
            animationType="slide"
        >
            <StatsGridTitle>Key Performance Indicators</StatsGridTitle>
            <StatsGridDescription>
                Track our growth and success metrics in real-time. All numbers are updated daily.
            </StatsGridDescription>
            <StatsGridContainer>
                <StatsGridCard
                    stat={{
                        value: 10000000,
                        label: "Active Users",
                        subtext: "Growing 20% month over month",
                        icon: Users,
                        format: "compact",
                        accent: "blue",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 99.9,
                        label: "Uptime SLA",
                        subtext: "Enterprise-grade reliability",
                        icon: Shield,
                        format: "percentage",
                        suffix: "%",
                        accent: "emerald",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 2500000000,
                        label: "Revenue",
                        subtext: "Annual recurring revenue",
                        icon: DollarSign,
                        format: "currency",
                        accent: "amber",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 50000000,
                        label: "Downloads",
                        subtext: "Across all platforms",
                        icon: Download,
                        format: "compact",
                        suffix: "+",
                        accent: "violet",
                    }}
                />
            </StatsGridContainer>
        </StatsGrid>
    ),
    name: "0.1 Centered Stats - Light Theme",
};

/* ============================================
   0.2 Centered Stats - Dark Theme (Enhanced)
============================================ */
export const CenteredStatsDark: Story = {
    render: () => (
        <StatsGrid
            variant="dark"
            columns={4}
            contentAlign="center"
            padding="lg"
            animated={true}
            animationType="slide"
        >
            <StatsGridTitle>Performance Metrics</StatsGridTitle>
            <StatsGridDescription>
                Dark theme with optimized contrast for better visibility.
            </StatsGridDescription>
            <StatsGridContainer>
                <StatsGridCard
                    stat={{
                        value: 10000000,
                        label: "Active Users",
                        subtext: "Growing 20% month over month",
                        icon: Users,
                        format: "compact",
                        accent: "blue",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 99.9,
                        label: "Uptime SLA",
                        subtext: "Enterprise-grade reliability",
                        icon: Shield,
                        format: "percentage",
                        suffix: "%",
                        accent: "emerald",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 2500000000,
                        label: "Revenue",
                        subtext: "Annual recurring revenue",
                        icon: DollarSign,
                        format: "currency",
                        accent: "amber",
                    }}
                />
                <StatsGridCard
                    stat={{
                        value: 50000000,
                        label: "Downloads",
                        subtext: "Across all platforms",
                        icon: Download,
                        format: "compact",
                        suffix: "+",
                        accent: "violet",
                    }}
                />
            </StatsGridContainer>
        </StatsGrid>
    ),
    name: "0.2 Centered Stats - Dark Theme",
};

/* ============================================
   12. CUSTOM ICON COLORS SHOWCASE
============================================ */

export const CustomIconColorsLight: Story = {
    render: () => (
        <StatsGrid
            variant="light"
            columns={3}
            contentAlign="center"
            padding="lg"
            animated={true}
        >
            <StatsGridTitle>Custom Icon Colors - Light Theme</StatsGridTitle>
            <StatsGridDescription>
                Examples of custom icon colors using the new props.
            </StatsGridDescription>
            <StatsGridContainer>
                {/* Using built-in accent */}
                <div className="p-6 border rounded-lg bg-card">
                    <div className="flex items-center gap-4">
                        <StatIcon icon={Users} accent="blue" size="lg" />
                        <div>
                            <StatLabel>Built-in Blue</StatLabel>
                            <StatValue value={1000000} format="compact" />
                        </div>
                    </div>
                </div>

                {/* Custom solid colors */}
                <div className="p-6 border rounded-lg bg-card">
                    <div className="flex items-center gap-4">
                        <StatIcon
                            icon={DollarSign}
                            iconBg="bg-gradient-to-br from-purple-600 to-pink-600"
                            iconFg="text-white"
                            size="lg"
                            overrideAccent={true}
                        />
                        <div>
                            <StatLabel>Custom Gradient</StatLabel>
                            <StatValue value={2500000} format="currency" />
                        </div>
                    </div>
                </div>

                {/* Custom with different light/dark colors */}
                <div className="p-6 border rounded-lg bg-card">
                    <div className="flex items-center gap-4">
                        <StatIcon
                            icon={Star}
                            iconBg="bg-amber-100"
                            iconFg="text-amber-600"
                            darkIconBg="bg-purple-900/30"
                            darkIconFg="text-purple-400"
                            overrideAccent={true}
                        />
                        <div>
                            <StatLabel>Theme Aware</StatLabel>
                            <StatValue value={4.9} format="raw" decimals={1} />
                        </div>
                    </div>
                </div>

                {/* Outline style */}
                <div className="p-6 border rounded-lg bg-card">
                    <div className="flex items-center gap-4">
                        <StatIcon
                            icon={Heart}
                            iconBg="bg-transparent border-2 border-rose-300"
                            iconFg="text-rose-500"
                            darkIconBg="bg-transparent border-2 border-rose-800"
                            darkIconFg="text-rose-400"
                            overrideAccent={true}
                        />
                        <div>
                            <StatLabel>Outline Style</StatLabel>
                            <StatValue value={98.5} format="percentage" suffix="%" />
                        </div>
                    </div>
                </div>

                {/* Pastel colors */}
                <div className="p-6 border rounded-lg bg-card">
                    <div className="flex items-center gap-4">
                        <StatIcon
                            icon={Sparkles}
                            iconBg="bg-pink-100"
                            iconFg="text-pink-500"
                            darkIconBg="bg-pink-900/20"
                            darkIconFg="text-pink-300"
                            overrideAccent={true}
                        />
                        <div>
                            <StatLabel>Pastel Pink</StatLabel>
                            <StatValue value={50000} format="compact" />
                        </div>
                    </div>
                </div>

                {/* Earth tones */}
                <div className="p-6 border rounded-lg bg-card">
                    <div className="flex items-center gap-4">
                        <StatIcon
                            icon={Globe}
                            iconBg="bg-emerald-100"
                            iconFg="text-emerald-700"
                            darkIconBg="bg-emerald-900/30"
                            darkIconFg="text-emerald-300"
                            overrideAccent={true}
                        />
                        <div>
                            <StatLabel>Earth Tone</StatLabel>
                            <StatValue value={150} format="raw" />
                        </div>
                    </div>
                </div>
            </StatsGridContainer>
        </StatsGrid>
    ),
    name: "12.1 Custom Icons - Light Theme",
};

export const CustomIconColorsDark: Story = {
    render: () => (
        <div className="bg-gray-950">
            <StatsGrid
                variant="dark"
                columns={3}
                contentAlign="center"
                padding="lg"
                animated={true}
            >
                <StatsGridTitle>Custom Icon Colors - Dark Theme</StatsGridTitle>
                <StatsGridDescription>
                    Icons with custom colors that pop against dark backgrounds.
                </StatsGridDescription>
                <StatsGridContainer>
                    {/* Neon glow effect */}
                    <div className="p-6 border border-gray-800 rounded-lg bg-gray-900/50">
                        <div className="flex items-center gap-4">
                            <StatIcon
                                icon={Zap}
                                iconBg="bg-yellow-100"
                                iconFg="text-yellow-600"
                                darkIconBg="bg-yellow-500/20"
                                darkIconFg="text-yellow-400"
                                overrideAccent={true}
                            />
                            <div>
                                <StatLabel>Neon Yellow</StatLabel>
                                <StatValue value={99.9} format="percentage" suffix="%" />
                            </div>
                        </div>
                    </div>

                    {/* Cyberpunk style */}
                    <div className="p-6 border border-gray-800 rounded-lg bg-gray-900/50">
                        <div className="flex items-center gap-4">
                            <StatIcon
                                icon={Wand2}
                                iconBg="bg-purple-100"
                                iconFg="text-purple-600"
                                darkIconBg="bg-purple-500/20"
                                darkIconFg="text-purple-400"
                                overrideAccent={true}
                            />
                            <div>
                                <StatLabel>Cyberpunk</StatLabel>
                                <StatValue value={5000000} format="compact" />
                            </div>
                        </div>
                    </div>

                    {/* Electric blue */}
                    <div className="p-6 border border-gray-800 rounded-lg bg-gray-900/50">
                        <div className="flex items-center gap-4">
                            <StatIcon
                                icon={Activity}
                                iconBg="bg-blue-100"
                                iconFg="text-blue-600"
                                darkIconBg="bg-blue-500/20"
                                darkIconFg="text-blue-400"
                                overrideAccent={true}
                            />
                            <div>
                                <StatLabel>Electric Blue</StatLabel>
                                <StatValue value={1500000} format="compact" />
                            </div>
                        </div>
                    </div>

                    {/* Magenta glow */}
                    <div className="p-6 border border-gray-800 rounded-lg bg-gray-900/50">
                        <div className="flex items-center gap-4">
                            <StatIcon
                                icon={Crown}
                                iconBg="bg-pink-100"
                                iconFg="text-pink-600"
                                darkIconBg="bg-pink-500/20"
                                darkIconFg="text-pink-400"
                                overrideAccent={true}
                            />
                            <div>
                                <StatLabel>Magenta Glow</StatLabel>
                                <StatValue value={4.9} format="raw" decimals={1} />
                            </div>
                        </div>
                    </div>

                    {/* Cyan tech */}
                    <div className="p-6 border border-gray-800 rounded-lg bg-gray-900/50">
                        <div className="flex items-center gap-4">
                            <StatIcon
                                icon={Database}
                                iconBg="bg-cyan-100"
                                iconFg="text-cyan-600"
                                darkIconBg="bg-cyan-500/20"
                                darkIconFg="text-cyan-400"
                                overrideAccent={true}
                            />
                            <div>
                                <StatLabel>Cyan Tech</StatLabel>
                                <StatValue value={1000000} format="compact" suffix="GB" />
                            </div>
                        </div>
                    </div>

                    {/* Orange alert */}
                    <div className="p-6 border border-gray-800 rounded-lg bg-gray-900/50">
                        <div className="flex items-center gap-4">
                            <StatIcon
                                icon={Timer}
                                iconBg="bg-orange-100"
                                iconFg="text-orange-600"
                                darkIconBg="bg-orange-500/20"
                                darkIconFg="text-orange-400"
                                overrideAccent={true}
                            />
                            <div>
                                <StatLabel>Orange Alert</StatLabel>
                                <StatValue value={24} format="raw" suffix="ms" />
                            </div>
                        </div>
                    </div>
                </StatsGridContainer>
            </StatsGrid>
        </div>
    ),
    name: "12.2 Custom Icons - Dark Theme",
};

export const IconColorPalette: Story = {
    render: () => (
        <StatsGrid
            variant="light"
            columns={4}
            contentAlign="center"
            padding="lg"
            animated={true}
        >
            <StatsGridTitle>Icon Color Palette</StatsGridTitle>
            <StatsGridDescription>
                Different styling approaches for icons.
            </StatsGridDescription>
            <StatsGridContainer>
                {/* Solid colors */}
                <div className="p-4 border rounded-lg bg-card text-center">
                    <StatIcon
                        icon={Palette}
                        iconBg="bg-red-500"
                        iconFg="text-white"
                        size="lg"
                        overrideAccent={true}
                        className="mx-auto mb-2"
                    />
                    <StatLabel className="text-center">Solid Red</StatLabel>
                </div>

                {/* Gradient */}
                <div className="p-4 border rounded-lg bg-card text-center">
                    <StatIcon
                        icon={Brush}
                        iconBg="bg-gradient-to-br from-purple-500 to-pink-500"
                        iconFg="text-white"
                        size="lg"
                        overrideAccent={true}
                        className="mx-auto mb-2"
                    />
                    <StatLabel className="text-center">Gradient</StatLabel>
                </div>

                {/* Outline */}
                <div className="p-4 border rounded-lg bg-card text-center">
                    <StatIcon
                        icon={Sparkles}
                        iconBg="bg-transparent border-2 border-blue-300"
                        iconFg="text-blue-500"
                        darkIconBg="bg-transparent border-2 border-blue-700"
                        darkIconFg="text-blue-400"
                        overrideAccent={true}
                        size="lg"
                        className="mx-auto mb-2"
                    />
                    <StatLabel className="text-center">Outline</StatLabel>
                </div>

                {/* Pastel */}
                <div className="p-4 border rounded-lg bg-card text-center">
                    <StatIcon
                        icon={Wand2}
                        iconBg="bg-lavender-100"
                        iconFg="text-lavender-600"
                        darkIconBg="bg-lavender-900/30"
                        darkIconFg="text-lavender-400"
                        overrideAccent={true}
                        size="lg"
                        className="mx-auto mb-2"
                    />
                    <StatLabel className="text-center">Pastel</StatLabel>
                </div>

                {/* Metallic */}
                <div className="p-4 border rounded-lg bg-card text-center">
                    <StatIcon
                        icon={Award}
                        iconBg="bg-gradient-to-br from-amber-200 to-yellow-400"
                        iconFg="text-amber-900"
                        darkIconBg="bg-gradient-to-br from-amber-800 to-yellow-700"
                        darkIconFg="text-amber-200"
                        overrideAccent={true}
                        size="lg"
                        className="mx-auto mb-2"
                    />
                    <StatLabel className="text-center">Metallic</StatLabel>
                </div>

                {/* Glass morphism */}
                <div className="p-4 border rounded-lg bg-card text-center">
                    <StatIcon
                        icon={Eye}
                        iconBg="backdrop-blur-sm bg-white/30"
                        iconFg="text-gray-700"
                        darkIconBg="backdrop-blur-sm bg-white/10"
                        darkIconFg="text-gray-300"
                        overrideAccent={true}
                        size="lg"
                        className="mx-auto mb-2"
                    />
                    <StatLabel className="text-center">Glass</StatLabel>
                </div>

                {/* Dual tone */}
                <div className="p-4 border rounded-lg bg-card text-center">
                    <div className="relative mx-auto mb-2 w-12 h-12">
                        <div className="absolute inset-0 bg-blue-500 rounded-lg opacity-20"></div>
                        <StatIcon
                            icon={Target}
                            iconBg="bg-transparent"
                            iconFg="text-blue-600"
                            darkIconFg="text-blue-400"
                            overrideAccent={true}
                            size="lg"
                            className="relative"
                        />
                    </div>
                    <StatLabel className="text-center">Dual Tone</StatLabel>
                </div>

                {/* Rainbow */}
                <div className="p-4 border rounded-lg bg-card text-center">
                    <StatIcon
                        icon={Heart}
                        iconBg="bg-gradient-to-r from-red-400 via-purple-400 to-blue-400"
                        iconFg="text-white"
                        darkIconBg="bg-gradient-to-r from-red-600 via-purple-600 to-blue-600"
                        darkIconFg="text-white"
                        overrideAccent={true}
                        size="lg"
                        className="mx-auto mb-2"
                    />
                    <StatLabel className="text-center">Rainbow</StatLabel>
                </div>
            </StatsGridContainer>
        </StatsGrid>
    ),
    name: "12.3 Custom Icons - Color Palette",
};

export const RealWorldIconExamples: Story = {
    render: () => (
        <StatsGrid
            variant="light"
            columns={2}
            contentAlign="left"
            padding="lg"
            animated={true}
        >
            <StatsGridTitle>Real-World Examples</StatsGridTitle>
            <StatsGridDescription>
                Practical use cases with custom icon styling.
            </StatsGridDescription>
            <StatsGridContainer>
                {/* Social Media Dashboard */}
                <div className="p-6 border rounded-lg bg-card">
                    <h3 className="text-lg font-semibold mb-4">Social Media</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <StatIcon
                                icon={Users}
                                iconBg="bg-blue-100"
                                iconFg="text-blue-600"
                                darkIconBg="bg-blue-900/30"
                                darkIconFg="text-blue-400"
                                overrideAccent={true}
                            />
                            <div>
                                <StatLabel>Facebook</StatLabel>
                                <StatValue value={2500000} format="compact" />
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <StatIcon
                                icon={Heart}
                                iconBg="bg-pink-100"
                                iconFg="text-pink-600"
                                darkIconBg="bg-pink-900/30"
                                darkIconFg="text-pink-400"
                                overrideAccent={true}
                            />
                            <div>
                                <StatLabel>Instagram</StatLabel>
                                <StatValue value={1800000} format="compact" />
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <StatIcon
                                icon={Activity}
                                iconBg="bg-sky-100"
                                iconFg="text-sky-600"
                                darkIconBg="bg-sky-900/30"
                                darkIconFg="text-sky-400"
                                overrideAccent={true}
                            />
                            <div>
                                <StatLabel>Twitter</StatLabel>
                                <StatValue value={950000} format="compact" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Financial Dashboard */}
                <div className="p-6 border rounded-lg bg-card">
                    <h3 className="text-lg font-semibold mb-4">Financial</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <StatIcon
                                icon={DollarSign}
                                iconBg="bg-emerald-100"
                                iconFg="text-emerald-600"
                                darkIconBg="bg-emerald-900/30"
                                darkIconFg="text-emerald-400"
                                overrideAccent={true}
                            />
                            <div>
                                <StatLabel>Revenue</StatLabel>
                                <StatValue value={4500000} format="currency" />
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <StatIcon
                                icon={TrendingUp}
                                iconBg="bg-amber-100"
                                iconFg="text-amber-600"
                                darkIconBg="bg-amber-900/30"
                                darkIconFg="text-amber-400"
                                overrideAccent={true}
                            />
                            <div>
                                <StatLabel>Growth</StatLabel>
                                <StatValue value={23.5} format="percentage" suffix="%" />
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <StatIcon
                                icon={PieChart}
                                iconBg="bg-violet-100"
                                iconFg="text-violet-600"
                                darkIconBg="bg-violet-900/30"
                                darkIconFg="text-violet-400"
                                overrideAccent={true}
                            />
                            <div>
                                <StatLabel>ROI</StatLabel>
                                <StatValue value={18.2} format="percentage" suffix="%" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Health Dashboard */}
                <div className="p-6 border rounded-lg bg-card">
                    <h3 className="text-lg font-semibold mb-4">Health & Wellness</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <StatIcon
                                icon={HeartPulse}
                                iconBg="bg-rose-100"
                                iconFg="text-rose-600"
                                darkIconBg="bg-rose-900/30"
                                darkIconFg="text-rose-400"
                                overrideAccent={true}
                            />
                            <div>
                                <StatLabel>Heart Rate</StatLabel>
                                <StatValue value={72} format="raw" suffix="bpm" />
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <StatIcon
                                icon={Activity}
                                iconBg="bg-green-100"
                                iconFg="text-green-600"
                                darkIconBg="bg-green-900/30"
                                darkIconFg="text-green-400"
                                overrideAccent={true}
                            />
                            <div>
                                <StatLabel>Steps</StatLabel>
                                <StatValue value={8432} format="raw" />
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <StatIcon
                                icon={Timer}
                                iconBg="bg-blue-100"
                                iconFg="text-blue-600"
                                darkIconBg="bg-blue-900/30"
                                darkIconFg="text-blue-400"
                                overrideAccent={true}
                            />
                            <div>
                                <StatLabel>Sleep</StatLabel>
                                <StatValue value={7.5} format="raw" suffix="hrs" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* E-commerce Dashboard */}
                <div className="p-6 border rounded-lg bg-card">
                    <h3 className="text-lg font-semibold mb-4">E-commerce</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <StatIcon
                                icon={ShoppingCart}
                                iconBg="bg-orange-100"
                                iconFg="text-orange-600"
                                darkIconBg="bg-orange-900/30"
                                darkIconFg="text-orange-400"
                                overrideAccent={true}
                            />
                            <div>
                                <StatLabel>Orders</StatLabel>
                                <StatValue value={1250} format="raw" />
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <StatIcon
                                icon={Package}
                                iconBg="bg-indigo-100"
                                iconFg="text-indigo-600"
                                darkIconBg="bg-indigo-900/30"
                                darkIconFg="text-indigo-400"
                                overrideAccent={true}
                            />
                            <div>
                                <StatLabel>Products</StatLabel>
                                <StatValue value={3450} format="raw" />
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <StatIcon
                                icon={Star}
                                iconBg="bg-yellow-100"
                                iconFg="text-yellow-600"
                                darkIconBg="bg-yellow-900/30"
                                darkIconFg="text-yellow-400"
                                overrideAccent={true}
                            />
                            <div>
                                <StatLabel>Reviews</StatLabel>
                                <StatValue value={4.8} format="raw" decimals={1} />
                            </div>
                        </div>
                    </div>
                </div>
            </StatsGridContainer>
        </StatsGrid>
    ),
    name: "12.4 Custom Icons - Real World Examples",
};