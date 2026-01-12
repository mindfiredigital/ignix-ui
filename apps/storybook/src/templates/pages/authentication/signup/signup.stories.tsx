// signup/signup-form.stories.tsx

import React from "react";
import { type SignUpFormData, type SocialProvider } from "./types";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Users, Zap, Globe, BarChart, Award, Shield, Mail } from "lucide-react";
import { SignUp } from "./";

const meta: Meta<typeof SignUp> = {
    title: "Templates/Pages/Authentication/SignUp",
    component: SignUp,
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component:
                    "A unified registration form component with two compulsory centered layouts and multiple split layouts. Includes all required fields: First Name, Last Name, Email, Confirm Email (optional), Password with strength indicator, Confirm Password, Terms & Conditions, and optional CAPTCHA.",
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
        showSocialSignUp: {
            control: { type: "boolean" },
            description: "Show/hide social sign-up buttons.",
            defaultValue: false,
        },
        showLoginLink: {
            control: { type: "boolean" },
            description: "Show/hide login link.",
            defaultValue: true,
        },
        requireEmailConfirmation: {
            control: { type: "boolean" },
            description: "Whether to show and require email confirmation field.",
            defaultValue: true,
        },
        termsConfig: {
            description: "Terms & Conditions configuration",
            control: { type: "object" },
        },
        passwordStrength: {
            description: "Password strength configuration",
            control: { type: "object" },
        },
        captchaConfig: {
            description: "CAPTCHA configuration",
            control: { type: "object" },
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
        onLogin: {
            action: "login-clicked",
            description: "Callback function when user clicks login link.",
        },
        onGoogleSignUp: {
            action: "google-sign-up-clicked",
            description: "Callback function for Google sign-up.",
        },
        onGitHubSignUp: {
            action: "github-sign-up-clicked",
            description: "Callback function for GitHub sign-up.",
        },
        onMicrosoftSignUp: {
            action: "microsoft-sign-up-clicked",
            description: "Callback function for Microsoft sign-up.",
        },
        leftPanelContent: {
            description: "Customize the left panel content for split layout",
            control: { type: "object" },
            if: { arg: 'type', eq: 'split' },
        },
    },
};

export default meta;
type Story = StoryObj<typeof SignUp>;

// ============================================================================
// COMPULSORY CENTERED LAYOUTS (Exactly 2)
// ============================================================================

// 🎯 COMPULSORY: Default Centered Form
export const DefaultCentered: Story = {
    name: "Default (Centered)",
    parameters: {
        description: "Compulsory centered layout with default styling and green button",
    },
    args: {
        type: "centered",
        variant: "default",
        loading: false,
        error: "",
        showSocialSignUp: true,
        showLoginLink: true,
        requireEmailConfirmation: true,
        passwordStrength: {
            showStrengthMeter: true,
            minLength: 8,
            requireUppercase: true,
            requireLowercase: true,
            requireNumbers: true,
            requireSpecialChars: true,
        },
    },
};

// 🌙 COMPULSORY: Dark Centered Form
export const DarkCentered: Story = {
    name: "Dark (Centered)",
    parameters: {
        description: "Compulsory centered layout with dark theme and green button",
    },
    args: {
        type: "centered",
        variant: "dark",
        loading: false,
        error: "",
        showSocialSignUp: true,
        showLoginLink: true,
        requireEmailConfirmation: true,
        passwordStrength: {
            showStrengthMeter: true,
            minLength: 8,
            requireUppercase: true,
            requireLowercase: true,
            requireNumbers: true,
            requireSpecialChars: false,
        },
    },
};

// ============================================================================
// NEW: NO EMAIL CONFIRMATION STORIES
// ============================================================================

// 📧 Form Without Email Confirmation
export const NoEmailConfirmation: Story = {
    name: "Without Email Confirmation",
    parameters: {
        description: "Registration form without email confirmation field for simpler sign-up flow",
    },
    args: {
        ...DefaultCentered.args,
        requireEmailConfirmation: false,
    },
};

// 📧 Dark Theme Without Email Confirmation
export const DarkNoEmailConfirmation: Story = {
    name: "Dark - Without Email Confirmation",
    parameters: {
        description: "Dark theme registration form without email confirmation field",
    },
    args: {
        ...DarkCentered.args,
        requireEmailConfirmation: false,
    },
};

// ============================================================================
// SPLIT LAYOUTS WITH CUSTOMIZABLE BACKGROUNDS AND BUTTONS
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
        showSocialSignUp: true,
        showLoginLink: true,
        requireEmailConfirmation: true,
        passwordStrength: {
            showStrengthMeter: true,
            minLength: 8,
            requireUppercase: true,
            requireLowercase: true,
            requireNumbers: true,
            requireSpecialChars: true,
        },
        leftPanelContent: {
            title: "Join Our Growing Community",
            description: "Create your account to access exclusive features and join thousands of satisfied users.",
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

// 🌙 Split Layout - Dark Version
export const DarkSplit: Story = {
    name: "Split Layout - Dark",
    parameters: {
        description: "Dark split layout with dark theme and green button",
    },
    args: {
        type: "split",
        variant: "dark",
        companyName: "DarkMode Inc",
        loading: false,
        error: "",
        showSocialSignUp: true,
        showLoginLink: true,
        requireEmailConfirmation: true,
        buttonStyle: {
            gradient: "bg-gradient-to-r from-emerald-600 to-green-600",
            hoverGradient: "hover:from-emerald-700 hover:to-green-700",
            shadow: "shadow-lg shadow-emerald-900/30",
            hoverShadow: "hover:shadow-xl hover:shadow-emerald-900/50",
        },
        passwordStrength: {
            showStrengthMeter: true,
            minLength: 10,
            requireUppercase: true,
            requireLowercase: true,
            requireNumbers: true,
            requireSpecialChars: true,
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
        showSocialSignUp: true,
        showLoginLink: true,
        requireEmailConfirmation: true,
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
        passwordStrength: {
            showStrengthMeter: true,
            minLength: 8,
            requireUppercase: true,
            requireLowercase: true,
            requireNumbers: true,
            requireSpecialChars: false,
        },
    },
};

// 📧 Split Layout - No Email Confirmation
export const SplitNoEmailConfirmation: Story = {
    name: "Split Layout - No Email Confirmation",
    parameters: {
        description: "Split layout registration form without email confirmation for faster sign-up",
    },
    args: {
        type: "split",
        variant: "default",
        companyName: "QuickSignUp",
        loading: false,
        error: "",
        showSocialSignUp: true,
        showLoginLink: true,
        requireEmailConfirmation: false,
        splitBackground: {
            gradient: "bg-gradient-to-br from-blue-600 to-cyan-600",
        },
        passwordStrength: {
            showStrengthMeter: true,
            minLength: 8,
            requireUppercase: true,
            requireLowercase: true,
            requireNumbers: true,
            requireSpecialChars: true,
        },
        leftPanelContent: {
            title: "Quick Registration",
            description: "Create your account in seconds. No email confirmation required.",
            features: [
                {
                    text: "Faster sign-up process",
                    icon: <Zap className="w-5 h-5" />,
                },
                {
                    text: "Instant access to features",
                    icon: "⚡",
                },
                {
                    text: "Email verification optional",
                    icon: <Mail className="w-5 h-5" />,
                },
            ],
        },
    },
};

// ============================================================================
// FUNCTIONALITY DEMONSTRATION STORIES
// ============================================================================

// Password Strength Examples
export const PasswordStrengthDemo: Story = {
    name: "Password Strength Demo",
    parameters: {
        description: "Demonstrates password strength indicator with different configurations",
    },
    args: {
        ...DefaultCentered.args,
        requireEmailConfirmation: true,
        passwordStrength: {
            showStrengthMeter: true,
            minLength: 8,
            requireUppercase: true,
            requireLowercase: true,
            requireNumbers: true,
            requireSpecialChars: true,
            strengthLabels: {
                weak: "Too Weak",
                medium: "Could be Stronger",
                strong: "Strong Password",
            },
        },
    },
};

// With CAPTCHA Integration
export const WithCaptcha: Story = {
    name: "With CAPTCHA Integration",
    parameters: {
        description: "Registration form with CAPTCHA verification enabled",
    },
    args: {
        ...DefaultCentered.args,
        requireEmailConfirmation: true,
        captchaConfig: {
            enabled: true,
            siteKey: "demo-site-key",
            theme: "light",
            size: "normal",
        },
    },
};

// Simple Sign-up Flow (No Email Confirmation + Minimal Requirements)
export const SimpleSignUpFlow: Story = {
    name: "Simple Sign-up Flow",
    parameters: {
        description: "Minimal sign-up form for quick registration",
    },
    args: {
        ...DefaultCentered.args,
        requireEmailConfirmation: false,
        showSocialSignUp: false,
        passwordStrength: {
            showStrengthMeter: false,
            minLength: 6,
            requireUppercase: false,
            requireLowercase: true,
            requireNumbers: false,
            requireSpecialChars: false,
        },
        termsConfig: {
            termsText: "By creating an account, you agree to our Terms & Conditions",
        },
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
        requireEmailConfirmation: true,
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
        requireEmailConfirmation: true,
        buttonStyle: {
            gradient: "bg-gradient-to-r from-green-600 to-emerald-700",
            hoverGradient: "hover:from-green-700 hover:to-emerald-800",
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
        requireEmailConfirmation: true,
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
        requireEmailConfirmation: true,
        loading: true,
        error: "",
    },
};

// Error State Example
export const WithErrorState: Story = {
    name: "With Error State",
    args: {
        ...DefaultCentered.args,
        requireEmailConfirmation: true,
        loading: false,
        error: "Email already exists. Please try a different email or sign in.",
    },
};

// Interactive Social Sign Up
export const InteractiveSocialSignUp: Story = {
    name: "Interactive Social Sign Up",
    render: function Render(args) {
        const [socialLoading, setSocialLoading] = React.useState<SocialProvider | null>(null);

        const handleSocialSignUp = (provider: SocialProvider) => {
            setSocialLoading(provider);
            setTimeout(() => {
                setSocialLoading(null);
            }, 2000);
        };

        return (
            <SignUp
                {...args}
                loading={socialLoading !== null}
                onGoogleSignUp={() => handleSocialSignUp('google')}
                onGitHubSignUp={() => handleSocialSignUp('github')}
                onMicrosoftSignUp={() => handleSocialSignUp('microsoft')}
            />
        );
    },
    args: {
        ...DefaultCentered.args,
        type: "split",
        companyName: "InteractiveApp",
        requireEmailConfirmation: true,
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
        showSocialSignUp: true,
        showLoginLink: true,
        requireEmailConfirmation: true,
        splitBackground: {
            gradient: "bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-700",
        },
        passwordStrength: {
            showStrengthMeter: true,
            minLength: 8,
            requireUppercase: true,
            requireLowercase: true,
            requireNumbers: true,
            requireSpecialChars: true,
        },
        leftPanelContent: {
            title: "Join 50,000+ Professionals",
            description: "Create your account and join our growing community of professionals.",
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
        showSocialSignUp: false,
        showLoginLink: true,
        requireEmailConfirmation: false,
        splitBackground: {
            gradient: "bg-gradient-to-br from-teal-700 via-cyan-700 to-blue-700",
        },
        passwordStrength: {
            showStrengthMeter: true,
            minLength: 8,
            requireUppercase: true,
            requireLowercase: true,
            requireNumbers: true,
            requireSpecialChars: false,
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
            ],
            footerText: "Join companies that trust us with their most important work.",
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
        showSocialSignUp: true,
        showLoginLink: true,
        requireEmailConfirmation: true,
        splitBackground: {
            gradient: "bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950",
        },
        passwordStrength: {
            showStrengthMeter: true,
            minLength: 12,
            requireUppercase: true,
            requireLowercase: true,
            requireNumbers: true,
            requireSpecialChars: true,
        },
        captchaConfig: {
            enabled: true,
            siteKey: "enterprise-site-key",
            theme: "dark",
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
        showSocialSignUp: true,
        showLoginLink: true,
        requireEmailConfirmation: false,
        splitBackground: {
            gradient: "bg-gradient-to-br from-blue-600 to-purple-600",
        },
        passwordStrength: {
            showStrengthMeter: true,
            minLength: 8,
            requireUppercase: true,
            requireLowercase: true,
            requireNumbers: true,
            requireSpecialChars: false,
        },
        leftPanelContent: {
            title: "Start Your Learning Journey",
            description: "Create your account to access thousands of courses, track your progress, and connect with instructors and peers.",
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

// Complete Form Validation Demo
export const FormValidationDemo: Story = {
    name: "Form Validation Demo",
    render: function Render(args) {
        const [loading, setLoading] = React.useState(false);
        const [error, setError] = React.useState("");

        const handleSubmit = (data: SignUpFormData) => {
            setLoading(true);
            setError("");

            // Simulate API call
            setTimeout(() => {
                if (Math.random() > 0.5) {
                    setError("Email already exists. Please try a different email.");
                } else {
                    alert(`Account created successfully!\n\nName: ${data.firstName} ${data.lastName}\nEmail: ${data.email}`);
                }
                setLoading(false);
            }, 1500);
        };

        return (
            <SignUp
                {...args}
                loading={loading}
                error={error}
                onSubmit={handleSubmit}
            />
        );
    },
    args: {
        ...DefaultCentered.args,
        requireEmailConfirmation: true,
        passwordStrength: {
            showStrengthMeter: true,
            minLength: 8,
            requireUppercase: true,
            requireLowercase: true,
            requireNumbers: true,
            requireSpecialChars: true,
        },
        termsConfig: {
            onTermsClick: () => alert("Terms & Conditions clicked"),
            onPrivacyClick: () => alert("Privacy Policy clicked"),
        },
    },
};

// Form Validation Demo Without Email Confirmation
export const FormValidationNoEmailConfirm: Story = {
    name: "Form Validation - No Email Confirm",
    render: function Render(args) {
        const [loading, setLoading] = React.useState(false);
        const [error, setError] = React.useState("");
        const handleSubmit = (data: SignUpFormData) => {
            setLoading(true);
            setError("");

            // Simulate API call
            setTimeout(() => {
                if (Math.random() > 0.5) {
                    setError("Email already exists. Please try a different email.");
                } else {
                    alert(`Account created successfully!\n\nName: ${data.firstName} ${data.lastName}\nEmail: ${data.email}`);
                }
                setLoading(false);
            }, 1500);
        };

        return (
            <SignUp
                {...args}
                loading={loading}
                error={error}
                onSubmit={handleSubmit}
            />
        );
    },
    args: {
        ...DefaultCentered.args,
        requireEmailConfirmation: false,
        passwordStrength: {
            showStrengthMeter: true,
            minLength: 6,
            requireUppercase: false,
            requireLowercase: true,
            requireNumbers: false,
            requireSpecialChars: false,
        },
    },
};