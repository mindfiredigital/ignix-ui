// signin/signin-form.stories.tsx

import React from "react";
import { SignIn, type SocialProvider } from "./";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Users, Zap, Globe, BarChart, Award, Shield } from "lucide-react";

const meta: Meta<typeof SignIn> = {
    title: "Forms/SignIn",
    component: SignIn,
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component:
                    "A unified login form component with two compulsory centered layouts and multiple split layouts with customizable backgrounds and button colors.",
            },
        },
    },
    argTypes: {
        type: {
            control: { type: "radio" },
            options: ["centered", "split"],
            description: "Layout type - centered or split layout.",
            defaultValue: "centered",
        },
        variant: {
            control: { type: "select" },
            options: ["default", "modern", "glass", "dark"],
            description: "Visual theme variant for the form.",
            defaultValue: "default",
        },
        companyName: {
            control: { type: "text" },
            description: "Company/brand name displayed in split layout info panel.",
            if: { arg: 'type', eq: 'split' },
        },
        loading: {
            control: { type: "boolean" },
            description: "Loading state for form submission.",
        },
        error: {
            control: { type: "text" },
            description: "Error message to display above the form.",
        },
        showSocialLogin: {
            control: { type: "boolean" },
            description: "Show/hide social login buttons.",
            defaultValue: false,
        },
        showForgotPassword: {
            control: { type: "boolean" },
            description: "Show/hide forgot password link.",
            defaultValue: true,
        },
        showSignUpLink: {
            control: { type: "boolean" },
            description: "Show/hide sign up link.",
            defaultValue: true,
        },
        splitBackground: {
            description: "Background customization for split layout only",
            control: { type: "object" },
            if: { arg: 'type', eq: 'split' },
        },
        buttonStyle: {
            description: "Button style customization",
            control: { type: "object" },
        },
        onSubmit: {
            action: "submitted",
            description: "Callback function when form is submitted.",
        },
        onSignUp: {
            action: "sign-up-clicked",
            description: "Callback function when user clicks sign-up link.",
        },
        onGoogleSignIn: {
            action: "google-sign-in-clicked",
            description: "Callback function for Google sign-in.",
        },
        onGitHubSignIn: {
            action: "github-sign-in-clicked",
            description: "Callback function for GitHub sign-in.",
        },
        onMicrosoftSignIn: {
            action: "microsoft-sign-in-clicked",
            description: "Callback function for Microsoft sign-in.",
        },
        leftPanelContent: {
            description: "Customize the left panel content for split layout",
            control: { type: "object" },
            if: { arg: 'type', eq: 'split' },
        },
    },
};

export default meta;
type Story = StoryObj<typeof SignIn>;

// ============================================================================
// COMPULSORY CENTERED LAYOUTS (Exactly 2)
// ============================================================================

// 🎯 COMPULSORY: Default Centered Form
export const DefaultCentered: Story = {
    name: "Default (Centered)",
    parameters: {
        description: "Compulsory centered layout with default styling and blue button",
    },
    args: {
        type: "centered",
        variant: "default",
        loading: false,
        error: "",
        showSocialLogin: true,
        showForgotPassword: true,
        showSignUpLink: true,
    },
};

// 🌙 COMPULSORY: Dark Centered Form
export const DarkCentered: Story = {
    name: "Dark (Centered)",
    parameters: {
        description: "Compulsory centered layout with dark theme and blue button",
    },
    args: {
        type: "centered",
        variant: "dark",
        loading: false,
        error: "",
        showSocialLogin: true,
        showForgotPassword: true,
        showSignUpLink: true,
    },
};

// ============================================================================
// SPLIT LAYOUTS WITH CUSTOMIZABLE BACKGROUNDS AND BUTTONS
// ============================================================================

// 🎯 Split Layout - Default with Custom Button
// export const DefaultSplit: Story = {
//     name: "Split Layout - Default",
//     parameters: {
//         description: "Split layout with default background and custom purple button",
//     },
//     args: {
//         type: "split",
//         variant: "default",
//         companyName: "YourBrand",
//         loading: false,
//         error: "",
//         showSocialLogin: true,
//         showForgotPassword: true,
//         showSignUpLink: true,
//         // buttonStyle: {
//         //     gradient: "bg-gradient-to-r from-purple-600 to-purple-700",
//         //     hoverGradient: "hover:from-purple-700 hover:to-purple-800",
//         //     shadow: "shadow-lg shadow-purple-200",
//         //     hoverShadow: "hover:shadow-xl hover:shadow-purple-300",
//         // },
//     },
// };

// 🌙 Split Layout - Dark Version (Original)
export const DarkSplit: Story = {
    name: "Split Layout - Dark",
    parameters: {
        description: "Original dark split layout with dark theme and blue button",
    },
    args: {
        type: "split",
        variant: "dark",
        companyName: "DarkMode Inc",
        loading: false,
        error: "",
        showSocialLogin: true,
        showForgotPassword: true,
        showSignUpLink: true,
        // Dark split layout has its own gradient from the component
        buttonStyle: {
            gradient: "bg-gradient-to-r from-blue-600 to-blue-700",
            hoverGradient: "hover:from-blue-700 hover:to-blue-800",
            shadow: "shadow-lg shadow-blue-900/30",
            hoverShadow: "hover:shadow-xl hover:shadow-blue-900/50",
        },
    },
};

// 🌈 Split Layout - Purple Pink with Matching Button
export const PurplePinkSplit: Story = {
    name: "Split Layout - Purple Pink",
    parameters: {
        description: "Split layout with purple-pink gradient and matching button",
    },
    args: {
        type: "split",
        variant: "default",
        companyName: "GradientApp",
        loading: false,
        error: "",
        showSocialLogin: true,
        showForgotPassword: true,
        showSignUpLink: true,
        splitBackground: {
            gradient: "bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600",
            textColor: "text-white",
            companyNameColor: "text-yellow-300",
            descriptionColor: "text-purple-100",
        },
        buttonStyle: {
            gradient: "bg-gradient-to-r from-pink-600 to-rose-600",
            hoverGradient: "hover:from-pink-700 hover:to-rose-700",
            shadow: "shadow-lg shadow-pink-200",
            hoverShadow: "hover:shadow-xl hover:shadow-pink-300",
        },
    },
};

// 🍃 Split Layout - Nature Theme with Green Button
export const NatureSplit: Story = {
    name: "Split Layout - Nature",
    parameters: {
        description: "Split layout with nature theme and green button",
    },
    args: {
        type: "split",
        variant: "modern",
        companyName: "EcoSystem",
        loading: false,
        error: "",
        showSocialLogin: true,
        showForgotPassword: true,
        showSignUpLink: true,
        splitBackground: {
            gradient: "bg-gradient-to-br from-emerald-700 via-teal-600 to-cyan-600",
            textColor: "text-white",
            companyNameColor: "text-emerald-200",
            descriptionColor: "text-teal-100",
        },
        buttonStyle: {
            gradient: "bg-gradient-to-r from-emerald-600 to-teal-600",
            hoverGradient: "hover:from-emerald-700 hover:to-teal-700",
            shadow: "shadow-lg shadow-emerald-200",
            hoverShadow: "hover:shadow-xl hover:shadow-emerald-300",
        },
    },
};

// 🔥 Split Layout - Fire Theme with Orange Button
export const FireSplit: Story = {
    name: "Split Layout - Fire Theme",
    parameters: {
        description: "Split layout with fiery background and orange button",
    },
    args: {
        type: "split",
        variant: "dark",
        companyName: "FireBrand",
        loading: false,
        error: "",
        showSocialLogin: true,
        showForgotPassword: true,
        showSignUpLink: true,
        splitBackground: {
            gradient: "bg-gradient-to-br from-red-700 via-orange-600 to-yellow-600",
            textColor: "text-white",
            companyNameColor: "text-yellow-300",
            descriptionColor: "text-red-100",
        },
        buttonStyle: {
            gradient: "bg-gradient-to-r from-orange-600 to-red-600",
            hoverGradient: "hover:from-orange-700 hover:to-red-700",
            shadow: "shadow-lg shadow-orange-200",
            hoverShadow: "hover:shadow-xl hover:shadow-orange-300",
        },
    },
};

// ❄️ Split Layout - Cool Theme with Blue Button
export const CoolSplit: Story = {
    name: "Split Layout - Cool Theme",
    parameters: {
        description: "Split layout with cool background and cyan button",
    },
    args: {
        type: "split",
        variant: "glass",
        companyName: "FrostTech",
        loading: false,
        error: "",
        showSocialLogin: true,
        showForgotPassword: true,
        showSignUpLink: true,
        splitBackground: {
            gradient: "bg-gradient-to-br from-cyan-700 via-blue-600 to-indigo-700",
            textColor: "text-white",
            companyNameColor: "text-cyan-300",
            descriptionColor: "text-blue-100",
        },
        buttonStyle: {
            gradient: "bg-gradient-to-r from-cyan-600 to-blue-600",
            hoverGradient: "hover:from-cyan-700 hover:to-blue-700",
            shadow: "shadow-lg shadow-cyan-200",
            hoverShadow: "hover:shadow-xl hover:shadow-cyan-300",
            textColor: "text-white",
        },
    },
};

// 🎨 Split Layout - Gradient Match Example
export const GradientMatchSplit: Story = {
    name: "Split Layout - Gradient Match",
    parameters: {
        description: "Split layout with perfectly matched background and button gradients",
    },
    args: {
        type: "split",
        variant: "modern",
        companyName: "GradientMatch",
        loading: false,
        error: "",
        showSocialLogin: true,
        showForgotPassword: true,
        showSignUpLink: true,
        splitBackground: {
            gradient: "bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600",
            textColor: "text-white",
            companyNameColor: "text-purple-200",
            descriptionColor: "text-pink-100",
        },
        buttonStyle: {
            gradient: "bg-gradient-to-r from-indigo-600 to-pink-600",
            hoverGradient: "hover:from-indigo-700 hover:to-pink-700",
            shadow: "shadow-lg shadow-indigo-200",
            hoverShadow: "hover:shadow-xl hover:shadow-pink-300",
            className: "animate-pulse-subtle",
        },
    },
};

// 🖼️ Split Layout - Image Background with Custom Button
export const ImageBackgroundSplit: Story = {
    name: "Split Layout - Image Background",
    parameters: {
        description: "Split layout with background image and custom button",
    },
    args: {
        type: "split",
        variant: "modern",
        companyName: "PhotoSpace",
        loading: false,
        error: "",
        showSocialLogin: true,
        showForgotPassword: true,
        showSignUpLink: true,
        splitBackground: {
            backgroundImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
            overlayColor: "rgba(0, 0, 0, 0.6)",
            textColor: "text-white",
            companyNameColor: "text-blue-300",
            descriptionColor: "text-gray-200",
        },
        // buttonStyle: {
        //     gradient: "bg-gradient-to-r from-blue-500 to-teal-500",
        //     hoverGradient: "hover:from-blue-600 hover:to-teal-600",
        //     shadow: "shadow-lg shadow-blue-200",
        //     hoverShadow: "hover:shadow-xl hover:shadow-teal-300",
        // },
    },
};

// ============================================================================
// BUTTON CUSTOMIZATION EXAMPLES
// ============================================================================

// 🔴 Red Button Example
export const RedButtonCentered: Story = {
    name: "Red Button (Centered)",
    parameters: {
        description: "Centered layout with custom red button",
    },
    args: {
        ...DefaultCentered.args,
        buttonStyle: {
            gradient: "bg-gradient-to-r from-red-600 to-red-700",
            hoverGradient: "hover:from-red-700 hover:to-red-800",
            shadow: "shadow-lg shadow-red-200",
            hoverShadow: "hover:shadow-xl hover:shadow-red-300",
        },
    },
};

// 🟢 Green Button Example
export const GreenButtonCentered: Story = {
    name: "Green Button (Centered)",
    parameters: {
        description: "Centered layout with custom green button",
    },
    args: {
        ...DefaultCentered.args,
        buttonStyle: {
            gradient: "bg-gradient-to-r from-green-600 to-green-700",
            hoverGradient: "hover:from-green-700 hover:to-green-800",
            shadow: "shadow-lg shadow-green-200",
            hoverShadow: "hover:shadow-xl hover:shadow-green-300",
        },
    },
};

// 🟣 Purple Button Example
export const PurpleButtonCentered: Story = {
    name: "Purple Button (Centered)",
    parameters: {
        description: "Centered layout with custom purple button",
    },
    args: {
        ...DefaultCentered.args,
        buttonStyle: {
            gradient: "bg-gradient-to-r from-purple-600 to-purple-700",
            hoverGradient: "hover:from-purple-700 hover:to-purple-800",
            shadow: "shadow-lg shadow-purple-200",
            hoverShadow: "hover:shadow-xl hover:shadow-purple-300",
        },
    },
};

// ============================================================================
// ADDITIONAL FUNCTIONALITY STORIES
// ============================================================================

// Loading State Example
export const WithLoadingState: Story = {
    name: "With Loading State",
    args: {
        ...DefaultCentered.args,
        loading: true,
        error: "",
    },
};

// Error State Example
export const WithErrorState: Story = {
    name: "With Error State",
    args: {
        ...DefaultCentered.args,
        loading: false,
        error: "Invalid email or password. Please try again.",
    },
};

// Interactive Social Login
export const InteractiveSocialLogin: Story = {
    name: "Interactive Social Login",
    render: function Render(args) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [socialLoading, setSocialLoading] = React.useState<SocialProvider | null>(null);

        const handleSocialLogin = (provider: SocialProvider) => {
            setSocialLoading(provider);
            setTimeout(() => {
                setSocialLoading(null);
                console.log(`${provider} sign-in completed`);
            }, 2000);
        };

        return (
            <SignIn
                {...args}
                onGoogleSignIn={() => handleSocialLogin('google')}
                onGitHubSignIn={() => handleSocialLogin('github')}
                onMicrosoftSignIn={() => handleSocialLogin('microsoft')}
            />
        );
    },
    args: {
        ...DefaultCentered.args,
        type: "split",
        companyName: "InteractiveApp",
        splitBackground: {
            gradient: "bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600",
            textColor: "text-white",
            companyNameColor: "text-violet-200",
            descriptionColor: "text-purple-100",
        },
        buttonStyle: {
            gradient: "bg-gradient-to-r from-fuchsia-600 to-purple-600",
            hoverGradient: "hover:from-fuchsia-700 hover:to-purple-700",
            shadow: "shadow-lg shadow-fuchsia-200",
            hoverShadow: "hover:shadow-xl hover:shadow-purple-300",
        },
    },
};


// ============================================================================
// SPLIT LAYOUTS WITH CUSTOMIZABLE LEFT PANEL
// ============================================================================

// 🎯 Split Layout - Default with Custom Features
export const DefaultSplit: Story = {
    name: "Split Layout - Default",
    parameters: {
        description: "Split layout with default background and custom features list",
    },
    args: {
        type: "split",
        variant: "default",
        companyName: "YourBrand",
        loading: false,
        error: "",
        showSocialLogin: true,
        showForgotPassword: true,
        showSignUpLink: true,
        leftPanelContent: {
            title: "Welcome Back to Your Workspace",
            description: "Access your personalized dashboard with all your projects and team collaboration tools.",
            features: [
                {
                    text: "Secure enterprise-grade encryption",
                    icon: <Shield className="w-5 h-5" />,
                    iconColor: "text-blue-400",
                },
                {
                    text: "Real-time team collaboration",
                    icon: <Users className="w-5 h-5" />,
                    iconColor: "text-green-400",
                },
                {
                    text: "Lightning fast performance",
                    icon: <Zap className="w-5 h-5" />,
                    iconColor: "text-yellow-400",
                },
                {
                    text: "Global data centers",
                    icon: <Globe className="w-5 h-5" />,
                    iconColor: "text-purple-400",
                },
            ],
        },
    },
};

// 📊 Split Layout - With Statistics
export const WithStatistics: Story = {
    name: "Split Layout - With Statistics",
    parameters: {
        description: "Split layout showing statistics about the platform",
    },
    args: {
        type: "split",
        variant: "modern",
        companyName: "DataInsights",
        loading: false,
        error: "",
        showSocialLogin: true,
        showForgotPassword: true,
        showSignUpLink: true,
        splitBackground: {
            gradient: "bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-700",
        },
        leftPanelContent: {
            title: "Join 50,000+ Professionals",
            description: "Our platform helps teams collaborate and achieve more together.",
            subtitle: "Trusted by industry leaders worldwide",
            statistics: [
                {
                    value: "50K+",
                    label: "Active Users",
                },
                {
                    value: "98%",
                    label: "Satisfaction",
                },
                {
                    value: "24/7",
                    label: "Support",
                },
            ],
            features: [
                {
                    text: "99.9% Uptime SLA",
                    icon: <BarChart className="w-5 h-5" />,
                },
                {
                    text: "GDPR & SOC2 Compliant",
                    icon: <Shield className="w-5 h-5" />,
                },
                {
                    text: "Award-winning Platform",
                    icon: <Award className="w-5 h-5" />,
                },
            ],
        },
    },
};

// 💬 Split Layout - With Testimonials
export const WithTestimonials: Story = {
    name: "Split Layout - With Testimonials",
    parameters: {
        description: "Split layout featuring customer testimonials",
    },
    args: {
        type: "split",
        variant: "glass",
        companyName: "CustomerFirst",
        loading: false,
        error: "",
        showSocialLogin: false,
        showForgotPassword: true,
        showSignUpLink: true,
        splitBackground: {
            gradient: "bg-gradient-to-br from-teal-700 via-cyan-700 to-blue-700",
        },
        leftPanelContent: {
            title: "Join Happy Customers",
            description: "See what our customers have to say about their experience.",
            testimonials: [
                {
                    quote: "This platform transformed how our team collaborates. Productivity increased by 40% in just two months!",
                    author: "Sarah Chen",
                    role: "CTO, TechCorp",
                },
                // {
                //     quote: "The security features give us peace of mind while the intuitive interface makes onboarding a breeze.",
                //     author: "Marcus Johnson",
                //     role: "Security Lead, FinancePro",
                // },

            ],
            footerText: "Join companies that trust us with their most important work.",
        },
    },
};

// 🎨 Split Layout - Completely Custom Content
export const FullyCustomized: Story = {
    name: "Split Layout - Fully Customized",
    parameters: {
        description: "Split layout with completely custom left panel content",
    },
    args: {
        type: "split",
        variant: "dark",
        companyName: "InnovateCo",
        loading: false,
        error: "",
        showSocialLogin: true,
        showForgotPassword: true,
        showSignUpLink: true,
        splitBackground: {
            gradient: "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900",
        },
        leftPanelContent: {
            hideBranding: true,
            customContent: (
                <div className="w-full h-full flex flex-col items-center justify-center p-12">
                    <div className="text-center space-y-8">
                        <div className="space-y-4">
                            <div className="text-6xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                                Welcome Back
                            </div>
                            <div className="text-2xl text-gray-300">
                                To the Future of Work
                            </div>
                        </div>

                        <div className="max-w-lg mx-auto space-y-6">
                            <div className="text-lg text-gray-400">
                                Experience the next generation of team collaboration.
                                Powered by AI and designed for humans.
                            </div>

                            <div className="grid grid-cols-2 gap-6 pt-8">
                                <div className="bg-white/5 p-4 rounded-lg backdrop-blur-sm">
                                    <div className="text-3xl font-bold text-cyan-400">10x</div>
                                    <div className="text-sm text-gray-400">Faster Onboarding</div>
                                </div>
                                <div className="bg-white/5 p-4 rounded-lg backdrop-blur-sm">
                                    <div className="text-3xl font-bold text-blue-400">24/7</div>
                                    <div className="text-sm text-gray-400">AI Assistance</div>
                                </div>
                            </div>

                            <div className="pt-8">
                                <div className="text-sm text-gray-500">
                                    Trusted by forward-thinking teams at:
                                </div>
                                <div className="flex justify-center gap-8 mt-4 text-gray-400">
                                    <div>Google</div>
                                    <div>•</div>
                                    <div>Microsoft</div>
                                    <div>•</div>
                                    <div>Amazon</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ),
        },
    },
};

// 🏢 Split Layout - Enterprise Focus
export const EnterpriseEdition: Story = {
    name: "Split Layout - Enterprise Edition",
    parameters: {
        description: "Split layout designed for enterprise users",
    },
    args: {
        type: "split",
        variant: "modern",
        companyName: "EnterprisePro",
        loading: false,
        error: "",
        showSocialLogin: true,
        showForgotPassword: true,
        showSignUpLink: true,
        splitBackground: {
            gradient: "bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950",
        },
        leftPanelContent: {
            title: "Enterprise-Grade Security & Scale",
            description: "Built for organizations that demand the highest levels of security, compliance, and performance.",
            features: [
                {
                    text: "Single Sign-On (SSO) Integration",
                    icon: <Shield className="w-5 h-5" />,
                    iconColor: "text-blue-500",
                },
                {
                    text: "SOC 2 Type II Compliant",
                    icon: <Shield className="w-5 h-5" />,
                    iconColor: "text-green-500",
                },
                {
                    text: "Custom Role-Based Access Control",
                    icon: <Users className="w-5 h-5" />,
                    iconColor: "text-purple-500",
                },
                {
                    text: "Audit Logs & Compliance Reporting",
                    icon: <BarChart className="w-5 h-5" />,
                    iconColor: "text-amber-500",
                },
                {
                    text: "99.99% Uptime Guarantee",
                    icon: <Zap className="w-5 h-5" />,
                    iconColor: "text-red-500",
                },
                {
                    text: "Dedicated Support & SLAs",
                    icon: <Globe className="w-5 h-5" />,
                    iconColor: "text-cyan-500",
                },
            ],
            subtitle: "Trusted by Fortune 500 companies",
            footerText: "Contact sales for enterprise pricing and custom deployments.",
        },
        buttonStyle: {
            gradient: "bg-gradient-to-r from-slate-700 to-slate-800",
            hoverGradient: "hover:from-slate-800 hover:to-slate-900",
            shadow: "shadow-lg shadow-slate-900/30",
            hoverShadow: "hover:shadow-xl hover:shadow-slate-900/50",
        },
    },
};

// 🎓 Split Layout - Educational Platform
export const EducationalPlatform: Story = {
    name: "Split Layout - Educational Platform",
    parameters: {
        description: "Split layout for an educational or learning platform",
    },
    args: {
        type: "split",
        variant: "default",
        companyName: "LearnHub",
        loading: false,
        error: "",
        showSocialLogin: true,
        showForgotPassword: true,
        showSignUpLink: true,
        splitBackground: {
            gradient: "bg-gradient-to-br from-blue-600 to-purple-600",
        },
        leftPanelContent: {
            title: "Continue Your Learning Journey",
            description: "Access thousands of courses, track your progress, and connect with instructors and peers.",
            statistics: [
                {
                    value: "10K+",
                    label: "Courses",
                },
                {
                    value: "500K+",
                    label: "Students",
                },
                {
                    value: "95%",
                    label: "Completion Rate",
                },
            ],
            features: [
                {
                    text: "Personalized learning paths",
                    icon: "🎯",
                },
                {
                    text: "Interactive coding exercises",
                    icon: "💻",
                },
                {
                    text: "Certifications & badges",
                    icon: "🏆",
                },
                {
                    text: "Live Q&A sessions",
                    icon: "🎤",
                },
            ],
            footerText: "Start learning today. No credit card required for free courses.",
        },
        buttonStyle: {
            gradient: "bg-gradient-to-r from-purple-600 to-blue-600",
            hoverGradient: "hover:from-purple-700 hover:to-blue-700",
            shadow: "shadow-lg shadow-purple-200",
            hoverShadow: "hover:shadow-xl hover:shadow-purple-300",
        },
    },
};