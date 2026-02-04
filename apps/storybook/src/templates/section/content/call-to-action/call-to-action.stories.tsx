import type { Meta, StoryObj } from "@storybook/react-vite";
import {
    CTABanner,
    CTABannerHeading,
    CTABannerSubheading,
    CTABannerActions,
    CTABannerButton,
    CTABannerContent,
    CTABannerImage
} from ".";
import { Calendar, Zap, Star } from "lucide-react";
import { motion } from 'framer-motion';

const meta: Meta<typeof CTABanner> = {
    title: "Templates/Section/Content/CTA Banner",
    component: CTABanner,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component:
                    "A full-width Call-to-Action banner component with multiple layout variants, themes, and configurations.",
            },
        },
    },
    argTypes: {
        variant: {
            control: "select",
            options: ["default", "primary", "secondary", "accent", "muted", "gradient", "glass", "dark", "light"],
            description: "Visual variant of the banner",
            table: {
                defaultValue: { summary: "default" },
            },
        },
        layout: {
            control: "select",
            options: ["centered", "split", "compact"],
            description: "Layout arrangement",
            table: {
                defaultValue: { summary: "centered" },
            },
        },
        contentAlign: {
            control: "select",
            options: ["left", "center", "right"],
            description: "Content alignment within the banner",
            table: {
                defaultValue: { summary: "center" },
            },
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
type Story = StoryObj<typeof CTABanner>;

// -------------------------------------
// STORIES WITH NEW API
// -------------------------------------

// 1. Light Theme - Centered Content
export const LightThemeCentered: Story = {
    render: () => (
        <CTABanner
            variant="light"
            layout="centered"
            contentAlign="center"
            padding="lg"
            animate={true}
        >
            <CTABannerHeading>Let's Get In Touch</CTABannerHeading>
            <CTABannerSubheading>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                nostrud exercitation ullamco laboris.
            </CTABannerSubheading>
            <CTABannerActions>
                <CTABannerButton
                    label="Book a Call"
                    variant="primary"
                    icon={Calendar}
                />
                <CTABannerButton
                    label="Explore"
                    variant="outline"
                />
            </CTABannerActions>
        </CTABanner>
    ),
    name: "1. Light Theme - Centered",
};

// 2. Dark Theme - Centered Content
export const DarkThemeCentered: Story = {
    render: () => (
        <CTABanner
            variant="dark"
            layout="centered"
            contentAlign="center"
            padding="lg"
            animate={true}
        >
            <CTABannerHeading>Let's Get In Touch</CTABannerHeading>
            <CTABannerSubheading>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                nostrud exercitation ullamco laboris.
            </CTABannerSubheading>
            <CTABannerActions>
                <CTABannerButton
                    label="Book a Call"
                    variant="primary"
                    icon={Calendar}
                />
                <CTABannerButton
                    label="Explore"
                    variant="outline"
                />
            </CTABannerActions>
        </CTABanner>
    ),
    name: "2. Dark Theme - Centered",
};

// 3. Split Layout Example
export const SplitLayout: Story = {
    args: {
        variant: "dark"
    },

    render: () => (
        <CTABanner
            variant="light"
            layout="split"
            contentAlign="left"
            imagePosition="right"
            padding="xl"
        >
            <CTABannerContent>
                <CTABannerHeading>Connect With Our Team</CTABannerHeading>
                <CTABannerSubheading>
                    Our experts are ready to help you achieve your goals. Schedule a personalized
                    consultation today to discuss your specific needs and challenges.
                </CTABannerSubheading>
                <CTABannerActions>
                    <CTABannerButton
                        label="Schedule Now"
                        variant="primary"
                        icon={Calendar}
                    />
                    <CTABannerButton
                        label="Contact Us"
                        variant="outline"
                    />
                </CTABannerActions>
            </CTABannerContent>
            <CTABannerImage
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                alt="Team collaboration"
                className="h-[420px] lg:h-[480px]"
            />
        </CTABanner>
    ),

    name: "3. Split Layout"
};

// Add this with your other stories, after the "2. Dark Theme - Centered" story:

// 3. Dark Theme - Split Layout
export const DarkThemeSplitLayout: Story = {
    render: () => (
        <CTABanner
            variant="dark"
            layout="split"
            contentAlign="left"
            imagePosition="right"
            padding="xl"
            animate={true}
            imageVariant="dark"
        >
            <CTABannerContent>
                <CTABannerHeading>Connect With Our Team</CTABannerHeading>
                <CTABannerSubheading>
                    Our experts are ready to help you achieve your goals. Schedule a personalized
                    consultation today to discuss your specific needs and challenges.
                </CTABannerSubheading>
                <CTABannerActions>
                    <CTABannerButton
                        label="Schedule Now"
                        variant="primary"
                        icon={Calendar}
                    />
                    <CTABannerButton
                        label="Contact Us"
                        variant="outline"
                    />
                </CTABannerActions>
            </CTABannerContent>

            <CTABannerImage
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                alt="Team collaboration"
                className="h-[420px] lg:h-[480px]"
            />
        </CTABanner>
    ),
    name: "4. Dark Theme - Split Layout",
};

// 4. Custom Content Example
export const CustomContent: Story = {
    render: () => (
        <CTABanner
            variant="light"
            padding="xl"
            contentAlign="center"
        >
            <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
                    <Star className="w-4 h-4" />
                    <span className="text-sm font-medium">New Feature Available</span>
                </div>
                <CTABannerHeading>Discover What's New</CTABannerHeading>
                <CTABannerSubheading>
                    We've just launched exciting new features designed to boost your productivity.
                    Try them out today and see the difference!
                </CTABannerSubheading>
                <CTABannerActions>
                    <CTABannerButton
                        label="Try Now"
                        variant="primary"
                        icon={Zap}
                    />
                    <CTABannerButton
                        label="Watch Demo"
                        variant="outline"
                    />
                </CTABannerActions>
            </div>
        </CTABanner>
    ),
    name: "5. Custom Content",
};

// 5. Compact Layout
export const CompactLayout: Story = {
    args: {
        variant: "dark"
    },

    render: () => (
        <CTABanner
            variant="default"
            layout="compact"
            padding="md"
        >
            <CTABannerHeading>Ready to Get Started?</CTABannerHeading>
            <CTABannerSubheading>
                Start your free trial today. No credit card required.
            </CTABannerSubheading>
            <CTABannerActions>
                <CTABannerButton
                    label="Start Free Trial"
                    variant="primary"
                    size="lg"
                />
            </CTABannerActions>
        </CTABanner>
    ),

    name: "6. Compact Layout"
};

// 6. Centered Content with Background Image
export const CenteredWithBackgroundImage: Story = {
    render: () => (
        <CTABanner
            variant="dark"
            layout="centered"
            contentAlign="center"
            backgroundType="image"
            backgroundImage="https://images.unsplash.com/photo-1663427929868-3941f957bb36?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            padding="2xl"
            animate={true}
        // animationType="slide"
        >
            {/* Optional decorative element */}
            <div className="absolute inset-0 bg-black/40" />

            <div className="relative z-10">
                <CTABannerHeading className="text-white">
                    Experience Excellence
                </CTABannerHeading>

                <CTABannerSubheading className="text-gray-200 max-w-2xl">
                    Join our community of innovators and thought leaders shaping the future of technology.
                    Discover how our platform can transform your digital experience.
                </CTABannerSubheading>

                <CTABannerActions>
                    <CTABannerButton
                        label="Get Started"
                        variant="primary"
                        icon={Zap}
                        className="bg-white text-gray-900 hover:bg-gray-100 border-0"
                    />
                    <CTABannerButton
                        label="Watch Demo"
                        variant="outline"
                        className="border-white text-white hover:bg-white/10"
                    />
                </CTABannerActions>

                {/* Optional additional info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-300"
                >
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span>No credit card required</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span>14-day free trial</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span>24/7 support</span>
                    </div>
                </motion.div>
            </div>
        </CTABanner>
    ),
    name: "7. Centered with Background Image",
};

// 7. Minimal with Background Image
export const MinimalBackgroundImage: Story = {
    render: () => (
        <CTABanner
            variant="glass"
            layout="centered"
            contentAlign="center"
            backgroundType="image"
            backgroundImage="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3"
            padding="xl"
            animate={true}
        >
            <div className="relative z-10 backdrop-blur-sm bg-white/10 rounded-2xl p-8 md:p-12">
                <CTABannerHeading className="text-white">
                    Elevate Your Vision
                </CTABannerHeading>

                <CTABannerSubheading className="text-gray-100">
                    Transform ideas into reality with our cutting-edge platform
                </CTABannerSubheading>

                <CTABannerActions>
                    <CTABannerButton
                        label="Start Building"
                        variant="primary"
                        className="bg-white text-gray-900 hover:bg-gray-100"
                    />
                </CTABannerActions>
            </div>
        </CTABanner>
    ),
    name: "8. Minimal with Background Image",
};

// 8. Gradient Overlay Background
export const GradientOverlayBackground: Story = {
    render: () => (
        <CTABanner
            variant="default"
            layout="centered"
            contentAlign="center"
            backgroundType="image"
            backgroundImage="https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3"
            padding="2xl"
        >
            {/* Gradient overlay */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.8) 0%, rgba(139, 92, 246, 0.8) 100%)',
                }}
            />

            <div className="relative z-10">
                <CTABannerHeading className="text-white">
                    Ready to Transform?
                </CTABannerHeading>

                <CTABannerSubheading className="text-gray-100 max-w-xl">
                    Take the first step towards innovation. Our team is here to guide you every step of the way.
                </CTABannerSubheading>

                <CTABannerActions>
                    <CTABannerButton
                        label="Schedule Consultation"
                        variant="primary"
                        icon={Calendar}
                        className="bg-white text-blue-600 hover:bg-gray-100"
                    />
                    <CTABannerButton
                        label="View Case Studies"
                        variant="outline"
                        className="border-white text-white hover:bg-white/20"
                    />
                </CTABannerActions>
            </div>
        </CTABanner>
    ),
    name: "9. Gradient Overlay Background",
};