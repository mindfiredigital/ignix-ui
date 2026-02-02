// ─────────────────────────────────────────────────────────────────────────────
// SignIn Component - Unified Login Form
// Fixed TypeScript errors with proper default animation config
// ─────────────────────────────────────────────────────────────────────────────

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../utils/cn";
import { Button } from "@ignix-ui/button";
import { AnimatedInput } from "@ignix-ui/input";
import {
    Eye,
    EyeOff,
    AlertCircle,
    Mail,
    Lock,
    Shield,
    LogIn,
    Loader2,
    Check,
    Star,
    Users,
    // Rocket,
    Zap,
    Globe,
    ShieldCheck,
    // Sparkles,
    // UserPlus
} from "lucide-react";

// Social Icons
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaMicrosoft } from "react-icons/fa";

// Types
export interface SignInProps {
    /** Layout type */
    type?: "centered" | "split";

    /** Form variant */
    variant?: VariantProps<typeof containerVariants>["variant"];

    /** Company/brand name */
    companyName?: string;

    /** Custom logo component */
    logo?: React.ReactNode;

    /** Form submission handler */
    onSubmit?: (data: SignInFormData) => void;

    /** Sign Up click handler */
    onSignUp?: () => void;

    /** Callback for Google sign-in */
    onGoogleSignIn?: () => void;

    /** Callback for GitHub sign-in */
    onGitHubSignIn?: () => void;

    /** Callback for Microsoft sign-in */
    onMicrosoftSignIn?: () => void;

    /** Sign Up link text */
    signUpText?: string;

    /** Loading state */
    loading?: boolean;

    /** Error message */
    error?: string;

    /** Show social login buttons */
    showSocialLogin?: boolean;

    /** Show forgot password link */
    showForgotPassword?: boolean;

    /** Show sign up link */
    showSignUpLink?: boolean;

    /** Additional className */
    className?: string;

    /** Split Layout Background Customization */
    splitBackground?: {
        /** Background gradient classes for left panel */
        gradient?: string;
        /** Text color for left panel */
        textColor?: string;
        /** Override company name color */
        companyNameColor?: string;
        /** Override description color */
        descriptionColor?: string;
        /** Custom left panel className */
        leftPanelClassName?: string;
        /** Background image URL */
        backgroundImage?: string;
        /** Overlay color for background image */
        overlayColor?: string;
        /** Custom right panel className */
        rightPanelClassName?: string;
    };

    /** Button Customization */
    buttonStyle?: {
        /** Background gradient classes for sign in button */
        gradient?: string;
        /** Hover gradient classes for sign in button */
        hoverGradient?: string;
        /** Text color for sign in button */
        textColor?: string;
        /** Button shadow classes */
        shadow?: string;
        /** Hover shadow classes */
        hoverShadow?: string;
        /** Custom button className */
        className?: string;
    };

    /** Left Panel Content Customization (Split Layout Only) */
    leftPanelContent?: {
        /** Custom title text */
        title?: string | React.ReactNode;
        /** Custom description text */
        description?: string | React.ReactNode;
        /** Custom subtitle text */
        subtitle?: string | React.ReactNode;
        /** Features/benefits list */
        features?: Array<{
            text: string;
            icon?: React.ReactNode;
            iconColor?: string;
            textClassName?: string;
        }>;
        /** Testimonials/customer quotes */
        testimonials?: Array<{
            quote: string;
            author: string;
            role?: string;
        }>;
        /** Statistics to display */
        statistics?: Array<{
            value: string;
            label: string;
            subtext?: string;
        }>;
        /** Custom content component (overrides all other content) */
        customContent?: React.ReactNode;
        /** Footer text */
        footerText?: string | React.ReactNode;
        /** Hide default logo and company name */
        hideBranding?: boolean;
        /** Additional className for content container */
        contentClassName?: string;
        /** Animation variants for content */
        animationConfig?: {
            titleDelay?: number;
            descriptionDelay?: number;
            featuresDelay?: number;
            staggerChildren?: number;
        };
        /** Layout options */
        layout?: {
            /** Content alignment */
            align?: "left" | "center" | "right";
            /** Content max width */
            maxWidth?: string;
            /** Enable/disable animations */
            animate?: boolean;
        };
    };
}

export interface SignInFormData {
    email: string;
    password: string;
    rememberMe: boolean;
}

// Social Provider Type
export type SocialProvider = 'google' | 'github' | 'microsoft';

// Layout Variants
const containerVariants = cva("", {
    variants: {
        variant: {
            default: "",
            modern: "",
            glass: "",
            dark: "",
        },
        type: {
            centered: "min-h-screen flex items-center justify-center p-4",
            split: "min-h-screen flex",
        },
    },
    compoundVariants: [
        {
            type: "centered",
            variant: "default",
            className: "bg-gradient-to-br from-blue-50 to-cyan-50",
        },
        {
            type: "centered",
            variant: "modern",
            className: "bg-gradient-to-br from-slate-50 to-slate-100",
        },
        {
            type: "centered",
            variant: "glass",
            className: "bg-gradient-to-br from-primary/10 to-secondary/10",
        },
        {
            type: "centered",
            variant: "dark",
            className: "bg-gradient-to-br from-gray-900 to-gray-800",
        },
        {
            type: "split",
            variant: "default",
            className: "bg-background",
        },
        {
            type: "split",
            variant: "modern",
            className: "bg-slate-50 dark:bg-slate-900",
        },
        {
            type: "split",
            variant: "glass",
            className: "bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800",
        },
        {
            type: "split",
            variant: "dark",
            className: "bg-gray-900",
        },
    ],
    defaultVariants: {
        type: "centered",
        variant: "default",
    },
});

// Card Variants
const cardVariants = cva("rounded-2xl shadow-2xl p-8 transition-all duration-300", {
    variants: {
        variant: {
            default: "bg-white",
            modern: "bg-white/95 backdrop-blur-sm border border-slate-200",
            glass: "bg-white/10 backdrop-blur-lg border border-white/20",
            dark: "bg-gray-800",
        },
        type: {
            centered: "w-full max-w-md",
            split: "w-full max-w-md bg-card rounded-xl",
        },
    },
    compoundVariants: [
        {
            type: "split",
            variant: "default",
            className: "bg-white",
        },
        {
            type: "split",
            variant: "modern",
            className: "bg-white/95 backdrop-blur-sm dark:bg-slate-900/95",
        },
        {
            type: "split",
            variant: "dark",
            className: "bg-gray-900",
        },
    ],
    defaultVariants: {
        type: "centered",
        variant: "default",
    },
});

// Default features for left panel
const DEFAULT_FEATURES = [
    {
        text: "Enterprise-grade security & encryption",
        icon: <ShieldCheck className="w-5 h-5" />,
        iconColor: "text-blue-400",
        textClassName: "font-semibold text-white/95",
    },
    {
        text: "Lightning-fast performance",
        icon: <Zap className="w-5 h-5" />,
        iconColor: "text-yellow-400",
        textClassName: "font-semibold text-white/95",
    },
    {
        text: "Seamless team collaboration",
        icon: <Users className="w-5 h-5" />,
        iconColor: "text-green-400",
        textClassName: "font-semibold text-white/95",
    },
    {
        text: "Global availability",
        icon: <Globe className="w-5 h-5" />,
        iconColor: "text-purple-400",
        textClassName: "font-semibold text-white/95",
    },
];

// Default animation configuration
const DEFAULT_ANIMATION_CONFIG = {
    titleDelay: 0.2,
    descriptionDelay: 0.3,
    featuresDelay: 0.4,
    staggerChildren: 0.1
};

/* ──────────────────────────────────────────────────────────────
   Main Component
────────────────────────────────────────────────────────────── */
const SignIn: React.FC<SignInProps> = ({
    type = "centered",
    variant = "default",
    companyName = "YourBrand",
    logo,
    onSubmit,
    onSignUp,
    // signUpText = "Don't have an account?",
    onGoogleSignIn,
    onGitHubSignIn,
    onMicrosoftSignIn,
    loading = false,
    error = "",
    showSocialLogin = true,
    showForgotPassword = true,
    showSignUpLink = true,
    className,
    splitBackground,
    buttonStyle,
    leftPanelContent,
}) => {
    const [formData, setFormData] = React.useState<SignInFormData>({
        email: '',
        password: '',
        rememberMe: false,
    });

    const [showPassword, setShowPassword] = React.useState(false);
    const [errors, setErrors] = React.useState<Record<string, string>>({});
    const [socialLoading, setSocialLoading] = React.useState<SocialProvider | null>(null);

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        if (onSubmit) {
            onSubmit(formData);
        }
    };

    const handleSignUpClick = () => {
        if (onSignUp) {
            onSignUp();
        } else {
            console.warn('SignUp callback not provided. Implement navigation to sign-up page.');
        }
    };

    const handleSocialSignIn = async (provider: SocialProvider) => {
        setSocialLoading(provider);

        try {
            switch (provider) {
                case 'google':
                    if (onGoogleSignIn) {
                        await onGoogleSignIn();
                    } else {
                        console.warn(`onGoogleSignIn callback not implemented.`);
                    }
                    break;
                case 'github':
                    if (onGitHubSignIn) {
                        await onGitHubSignIn();
                    } else {
                        console.warn(`onGitHubSignIn callback not implemented.`);
                    }
                    break;
                case 'microsoft':
                    if (onMicrosoftSignIn) {
                        await onMicrosoftSignIn();
                    } else {
                        console.warn(`onMicrosoftSignIn callback not implemented.`);
                    }
                    break;
                default:
                    console.warn(`Unsupported social provider: ${provider}`);
            }
        } catch (error) {
            console.error(`Social sign-in failed for ${provider}:`, error);
        } finally {
            setTimeout(() => setSocialLoading(null), 500);
        }
    };

    const handleInputChange = (field: keyof SignInFormData, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const getInputClasses = (hasError: boolean) => {
        const baseStyles = "w-full px-4 py-3 rounded-lg border transition-all duration-300 placeholder-gray-400 focus:ring-2 focus:border-transparent";

        const variantStyles = {
            default: cn(
                "bg-white text-gray-900 border-gray-300 focus:ring-blue-500",
                hasError && "border-red-500"
            ),
            modern: cn(
                "bg-white/80 backdrop-blur-sm text-gray-900 border-slate-200 focus:ring-blue-500",
                hasError && "border-red-500"
            ),
            glass: cn(
                "bg-white/5 backdrop-blur-md text-white border-white/10 focus:ring-blue-400",
                hasError && "border-red-400"
            ),
            dark: cn(
                "bg-gray-700 text-white border-gray-600 focus:ring-blue-500",
                hasError && "border-red-500"
            )
        };

        return cn(baseStyles, variantStyles[variant as keyof typeof variantStyles] || variantStyles.default);
    };

    const isDarkVariant = variant === "dark";

    // Default button styles
    const getButtonStyles = () => {
        const defaultStyles = {
            gradient: "bg-gradient-to-r from-blue-600 to-blue-700",
            hoverGradient: "hover:from-blue-700 hover:to-blue-800",
            textColor: "text-white",
            shadow: "shadow-lg",
            hoverShadow: "hover:shadow-xl",
            className: ""
        };

        return {
            gradient: buttonStyle?.gradient || defaultStyles.gradient,
            hoverGradient: buttonStyle?.hoverGradient || defaultStyles.hoverGradient,
            textColor: buttonStyle?.textColor || defaultStyles.textColor,
            shadow: buttonStyle?.shadow || defaultStyles.shadow,
            hoverShadow: buttonStyle?.hoverShadow || defaultStyles.hoverShadow,
            className: buttonStyle?.className || defaultStyles.className
        };
    };

    // Default logo if not provided
    const defaultLogo = (
        <div className={cn(
            "w-14 h-14 rounded-xl flex items-center justify-center shadow-lg",
            isDarkVariant
                ? "bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-700/30"
                : "bg-gradient-to-br from-blue-100 to-blue-50 border border-blue-200"
        )}>
            <Shield className={cn(
                "w-8 h-8",
                isDarkVariant
                    ? "text-blue-400 drop-shadow"
                    : "text-blue-600"
            )} />
        </div>
    );

    // Social login buttons configuration
    const socialButtons = [
        {
            id: 'google',
            provider: 'google' as SocialProvider,
            icon: <FcGoogle className="w-5 h-5" />,
            label: 'Google',
            onClick: () => handleSocialSignIn('google'),
            loading: socialLoading === 'google',
        },
        {
            id: 'github',
            provider: 'github' as SocialProvider,
            icon: <FaGithub className="w-5 h-5" />,
            label: 'GitHub',
            onClick: () => handleSocialSignIn('github'),
            loading: socialLoading === 'github',
        },
        {
            id: 'microsoft',
            provider: 'microsoft' as SocialProvider,
            icon: <FaMicrosoft className="w-5 h-5 text-[#00A4EF]" />,
            label: 'Microsoft',
            onClick: () => handleSocialSignIn('microsoft'),
            loading: socialLoading === 'microsoft',
        },
    ];

    // Get left panel content configuration
    const getLeftPanelContent = () => {
        const {
            title,
            description,
            subtitle,
            features,
            testimonials,
            statistics,
            customContent,
            footerText,
            hideBranding = false,
            contentClassName,
            layout = {
                align: "center",
                maxWidth: "max-w-2xl",
                animate: true
            },
            animationConfig = DEFAULT_ANIMATION_CONFIG
        } = leftPanelContent || {};

        // Merge provided animation config with defaults
        const mergedAnimationConfig = {
            ...DEFAULT_ANIMATION_CONFIG,
            ...animationConfig
        };

        const alignClass = {
            left: "items-start text-left",
            center: "items-center text-center",
            right: "items-end text-right"
        }[layout.align || "center"];

        // Use provided content or defaults
        const panelTitle = title || (
            <div className="space-y-4">
                <div className="text-5xl font-bold leading-tight tracking-tight">
                    Welcome Back
                </div>
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    to {companyName}
                </div>
            </div>
        );

        const panelDescription = description || (
            <p className="text-lg leading-relaxed">
                Sign in to access your personalized dashboard and continue where you left off.
                Your work is waiting for you.
            </p>
        );

        const panelFeatures = features || DEFAULT_FEATURES;

        return {
            panelTitle,
            panelDescription,
            subtitle,
            panelFeatures,
            testimonials,
            statistics,
            customContent,
            footerText,
            hideBranding,
            contentClassName,
            mergedAnimationConfig,
            layout,
            alignClass,
            maxWidth: layout.maxWidth || "max-w-2xl",
            shouldAnimate: layout.animate !== false,
        };
    };

    // Get split layout styles
    const getSplitLayoutStyles = () => {
        const defaultGradient = isDarkVariant
            ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
            : "bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800";

        const defaultTextColor = "text-white";
        const defaultCompanyNameColor = "text-white";
        const defaultDescriptionColor = "text-white/90";

        // Custom gradient or background image
        const backgroundStyle = splitBackground?.backgroundImage
            ? {
                backgroundImage: `url(${splitBackground.backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }
            : {};

        // Overlay for background image
        const overlayStyle = splitBackground?.backgroundImage && splitBackground?.overlayColor
            ? {
                backgroundColor: splitBackground.overlayColor,
            }
            : {};

        return {
            leftPanelClasses: cn(
                "flex-1 flex flex-col p-8 md:p-12 lg:p-16 hidden lg:flex relative",
                splitBackground?.gradient || defaultGradient,
                splitBackground?.leftPanelClassName
            ),
            textColor: splitBackground?.textColor || defaultTextColor,
            companyNameColor: splitBackground?.companyNameColor || defaultCompanyNameColor,
            descriptionColor: splitBackground?.descriptionColor || defaultDescriptionColor,
            backgroundStyle,
            overlayStyle,
            rightPanelClasses: cn(
                "flex-1 flex items-center justify-center p-6 md:p-8 lg:p-12",
                splitBackground?.rightPanelClassName
            ),
        };
    };

    // Render Left Panel Content
    const renderLeftPanelContent = () => {
        const {
            panelTitle,
            panelDescription,
            subtitle,
            panelFeatures,
            testimonials,
            statistics,
            customContent,
            footerText,
            hideBranding,
            contentClassName,
            mergedAnimationConfig,
            layout,
            alignClass,
            maxWidth,
            shouldAnimate,
        } = getLeftPanelContent();

        const splitStyles = getSplitLayoutStyles();

        // If custom content is provided, render it
        if (customContent) {
            return customContent;
        }

        const MotionDiv = shouldAnimate ? motion.div : "div";

        return (
            <div className={cn("w-full h-full flex items-center justify-center relative z-10", contentClassName)}>
                <div className={cn(
                    "relative z-10 flex flex-col w-full",
                    alignClass,
                    maxWidth
                )}>
                    {/* Branding Section */}
                    {!hideBranding && (
                        <MotionDiv
                            {...(shouldAnimate ? {
                                initial: { x: -50, opacity: 0 },
                                animate: { x: 0, opacity: 1 },
                                transition: { duration: 0.6 }
                            } : {})}
                            className={cn(
                                "flex items-center gap-4 mb-12",
                                layout.align === "left" ? "justify-start" :
                                    layout.align === "right" ? "justify-end" : "justify-center"
                            )}
                        >
                            {logo || defaultLogo}
                            <span className={cn(
                                "text-2xl md:text-3xl font-bold tracking-tight",
                                splitStyles.companyNameColor
                            )}>
                                {companyName}
                            </span>
                        </MotionDiv>
                    )}

                    {/* Main Content */}
                    <div className="space-y-10">
                        {/* Title Section */}
                        <MotionDiv
                            {...(shouldAnimate ? {
                                initial: { y: 30, opacity: 0 },
                                animate: { y: 0, opacity: 1 },
                                transition: { delay: mergedAnimationConfig.titleDelay, duration: 0.6 }
                            } : {})}
                            className="space-y-6"
                        >
                            <div className={cn("space-y-4", splitStyles.textColor)}>
                                {panelTitle}
                            </div>

                            {/* Subtitle */}
                            {subtitle && (
                                <div className={cn(
                                    "text-xl md:text-2xl font-semibold leading-relaxed",
                                    splitStyles.descriptionColor
                                )}>
                                    {subtitle}
                                </div>
                            )}

                            {/* Description */}
                            <div className={cn(
                                "text-base md:text-lg leading-relaxed",
                                splitStyles.descriptionColor
                            )}>
                                {panelDescription}
                            </div>
                        </MotionDiv>

                        {/* Features List */}
                        {panelFeatures.length > 0 && (
                            <MotionDiv
                                {...(shouldAnimate ? {
                                    initial: { opacity: 0, y: 20 },
                                    animate: { opacity: 1, y: 0 },
                                    transition: { delay: mergedAnimationConfig.featuresDelay, duration: 0.5 }
                                } : {})}
                                className={cn(
                                    "space-y-4",
                                    layout.align === "center" && "mx-auto",
                                    panelFeatures.length > 4 ? "grid grid-cols-1 md:grid-cols-2 gap-4" : ""
                                )}
                            >
                                {panelFeatures.map((feature, index) => (
                                    <MotionDiv
                                        key={index}
                                        {...(shouldAnimate ? {
                                            initial: { x: -20, opacity: 0 },
                                            animate: { x: 0, opacity: 1 },
                                            transition: {
                                                delay: mergedAnimationConfig.featuresDelay + (index * mergedAnimationConfig.staggerChildren),
                                                duration: 0.4
                                            }
                                        } : {})}
                                        className="flex items-start gap-3 group"
                                    >
                                        <div className={cn(
                                            "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5",
                                            "transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3",
                                            "shadow-md",
                                            feature.iconColor || "bg-white/20"
                                        )}>
                                            {feature.icon || <Check className="w-5 h-5 text-white" />}
                                        </div>
                                        <span className={cn(
                                            "text-base leading-tight pt-1",
                                            feature.textClassName || "font-semibold text-white/95"
                                        )}>
                                            {feature.text}
                                        </span>
                                    </MotionDiv>
                                ))}
                            </MotionDiv>
                        )}

                        {/* Statistics */}
                        {statistics && statistics.length > 0 && (
                            <MotionDiv
                                {...(shouldAnimate ? {
                                    initial: { opacity: 0, y: 20 },
                                    animate: { opacity: 1, y: 0 },
                                    transition: { delay: mergedAnimationConfig.featuresDelay + 0.2, duration: 0.5 }
                                } : {})}
                                className={cn(
                                    "grid grid-cols-2 md:grid-cols-3 gap-6 pt-6 border-t border-white/10",
                                    layout.align === "center" && "mx-auto"
                                )}
                            >
                                {statistics.map((stat, index) => (
                                    <MotionDiv
                                        key={index}
                                        {...(shouldAnimate ? {
                                            initial: { scale: 0.8, opacity: 0 },
                                            animate: { scale: 1, opacity: 1 },
                                            transition: {
                                                delay: mergedAnimationConfig.featuresDelay + 0.3 + (index * 0.1),
                                                duration: 0.4
                                            }
                                        } : {})}
                                        className="text-center space-y-1"
                                    >
                                        <div className={cn(
                                            "text-3xl md:text-4xl font-bold tracking-tight",
                                            splitStyles.companyNameColor
                                        )}>
                                            {stat.value}
                                        </div>
                                        <div className={cn(
                                            "text-sm font-semibold uppercase tracking-wider",
                                            splitStyles.descriptionColor
                                        )}>
                                            {stat.label}
                                        </div>
                                        {stat.subtext && (
                                            <div className={cn(
                                                "text-xs opacity-80",
                                                splitStyles.descriptionColor
                                            )}>
                                                {stat.subtext}
                                            </div>
                                        )}
                                    </MotionDiv>
                                ))}
                            </MotionDiv>
                        )}

                        {/* Testimonials */}
                        {testimonials && testimonials.length > 0 && (
                            <MotionDiv
                                {...(shouldAnimate ? {
                                    initial: { opacity: 0, y: 20 },
                                    animate: { opacity: 1, y: 0 },
                                    transition: { delay: mergedAnimationConfig.featuresDelay + 0.4, duration: 0.5 }
                                } : {})}
                                className={cn(
                                    "pt-8",
                                    layout.align === "center" && "mx-auto"
                                )}
                            >
                                <div className="space-y-6">
                                    <div className={cn(
                                        "text-sm font-semibold uppercase tracking-wider mb-4",
                                        splitStyles.descriptionColor
                                    )}>
                                        Trusted by Industry Leaders
                                    </div>
                                    {testimonials.map((testimonial, index) => (
                                        <MotionDiv
                                            key={index}
                                            {...(shouldAnimate ? {
                                                initial: { opacity: 0, x: -20 },
                                                animate: { opacity: 1, x: 0 },
                                                transition: {
                                                    delay: mergedAnimationConfig.featuresDelay + 0.5 + (index * 0.1),
                                                    duration: 0.4
                                                }
                                            } : {})}
                                            className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/10"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="flex-shrink-0 mt-1">
                                                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                                                </div>
                                                <div>
                                                    <p className={cn(
                                                        "text-sm md:text-base leading-relaxed italic",
                                                        splitStyles.descriptionColor
                                                    )}>
                                                        "{testimonial.quote}"
                                                    </p>
                                                    <div className={cn(
                                                        "text-sm mt-4 flex flex-col sm:flex-row sm:items-center gap-1",
                                                        splitStyles.descriptionColor
                                                    )}>
                                                        <span className="font-semibold">{testimonial.author}</span>
                                                        {testimonial.role && (
                                                            <>
                                                                <span className="hidden sm:inline mx-2 opacity-50">•</span>
                                                                <span className="opacity-75">{testimonial.role}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </MotionDiv>
                                    ))}
                                </div>
                            </MotionDiv>
                        )}
                    </div>

                    {/* Footer */}
                    {footerText !== null && (
                        <MotionDiv
                            {...(shouldAnimate ? {
                                initial: { y: 20, opacity: 0 },
                                animate: { y: 0, opacity: 1 },
                                transition: { delay: mergedAnimationConfig.featuresDelay + 0.6, duration: 0.5 }
                            } : {})}
                            className={cn(
                                "mt-12 pt-8 border-t border-white/10",
                                splitStyles.descriptionColor
                            )}
                        >
                            {footerText || (
                                <div className="text-sm">
                                    <span className="font-semibold">© 2024 {companyName}</span>
                                    <span className="opacity-70 ml-2">• All rights reserved</span>
                                </div>
                            )}
                        </MotionDiv>
                    )}
                </div>
            </div>
        );
    };

    // Render Form Content
    const renderFormContent = () => {
        const buttonStyles = getButtonStyles();

        return (
            <motion.div
                className={cn(cardVariants({ variant, type }))}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <div className={cn(
                        "w-16 h-16 rounded-xl flex items-center justify-center",
                        "shadow-lg",
                        isDarkVariant
                            ? "bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-700/20"
                            : "bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200"
                    )}>
                        {logo || (
                            <Shield className={cn(
                                "w-8 h-8",
                                isDarkVariant ? "text-blue-400" : "text-blue-600"
                            )} />
                        )}
                    </div>
                </div>

                {/* Title */}
                <div className="text-center mb-10">
                    <h1 className={cn(
                        "text-2xl md:text-3xl font-bold mb-3",
                        isDarkVariant ? "text-white" : "text-gray-900"
                    )}>
                        Sign In to Your Account
                    </h1>
                    <p className={cn(
                        "text-sm md:text-base",
                        isDarkVariant ? "text-gray-400" : "text-gray-600"
                    )}>
                        Welcome back! Please enter your details to continue
                    </p>
                </div>

                {/* Error Message */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className={cn(
                                "mb-6 p-4 rounded-lg border flex items-start",
                                isDarkVariant
                                    ? "bg-red-900/20 border-red-800"
                                    : "bg-red-50 border-red-200"
                            )}
                        >
                            <AlertCircle className={cn(
                                "w-5 h-5 mr-2 mt-0.5 flex-shrink-0",
                                isDarkVariant ? "text-red-400" : "text-red-600"
                            )} />
                            <span className={cn(
                                "text-sm font-medium",
                                isDarkVariant ? "text-red-300" : "text-red-700"
                            )}>
                                {error}
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email Field */}
                    <div className="space-y-2">
                        <label htmlFor="email" className={cn(
                            "block text-sm font-semibold",
                            isDarkVariant ? "text-gray-300" : "text-gray-700"
                        )}>
                            Email Address
                        </label>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                <Mail className={cn(
                                    "w-5 h-5",
                                    isDarkVariant ? "text-gray-500" : "text-gray-400"
                                )} />
                            </div>
                            <AnimatedInput
                                variant="clean"
                                type="email"
                                value={formData.email}
                                onChange={(value: string) => handleInputChange('email', value)}
                                placeholder="you@example.com"
                                inputClassName={cn(getInputClasses(!!errors.email), "pl-10")}
                                aria-label="Email address"
                                aria-invalid={!!errors.email}
                                aria-describedby={errors.email ? "email-error" : undefined}
                            />
                        </div>
                        {errors.email && (
                            <p id="email-error" className="mt-1 text-xs font-medium text-red-500">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label htmlFor="password" className={cn(
                                "block text-sm font-semibold",
                                isDarkVariant ? "text-gray-300" : "text-gray-700"
                            )}>
                                Password
                            </label>
                            {showForgotPassword && (
                                <button
                                    type="button"
                                    className={cn(
                                        "text-sm font-semibold transition-colors cursor-pointer",
                                        isDarkVariant
                                            ? "text-blue-400 hover:text-blue-300"
                                            : "text-blue-600 hover:text-blue-700"
                                    )}
                                    aria-label="Reset your password"
                                >
                                    Forgot Password?
                                </button>
                            )}
                        </div>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                <Lock className={cn(
                                    "w-5 h-5",
                                    isDarkVariant ? "text-gray-500" : "text-gray-400"
                                )} />
                            </div>
                            <AnimatedInput
                                variant="clean"
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={(value: string) => handleInputChange('password', value)}
                                placeholder="Enter your password"
                                inputClassName={cn(getInputClasses(!!errors.password), "pl-10 pr-10")}
                                aria-label="Password"
                                aria-invalid={!!errors.password}
                                aria-describedby={errors.password ? "password-error" : undefined}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className={cn(
                                    "absolute right-3 top-1/2 -translate-y-1/2 transition-colors",
                                    "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded p-1",
                                    isDarkVariant
                                        ? "text-gray-400 hover:text-gray-200"
                                        : "text-gray-500 hover:text-gray-700"
                                )}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                aria-controls="password"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {errors.password && (
                            <p id="password-error" className="mt-1 text-xs font-medium text-red-500">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    {/* Remember Me & Forgot Password Row */}
                    <div className="flex items-center justify-between">
                        <label className="flex items-center cursor-pointer group">
                            <input
                                type="checkbox"
                                id="rememberMe"
                                checked={formData.rememberMe}
                                onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                                className={cn(
                                    "w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 transition-all duration-300",
                                    isDarkVariant && "border-gray-600 bg-gray-700 focus:ring-blue-400"
                                )}
                                aria-label="Remember me for 30 days"
                            />
                            <span className={cn(
                                "ml-2 text-sm font-medium",
                                isDarkVariant
                                    ? "text-gray-400 group-hover:text-gray-200"
                                    : "text-gray-600 group-hover:text-gray-900"
                            )}>
                                Remember me
                            </span>
                        </label>
                    </div>

                    {/* Sign In Button - Now customizable */}
                    <Button
                        type="submit"
                        className={cn(
                            "w-full py-3.5 font-semibold rounded-lg transform hover:scale-[1.02] active:scale-[0.98]",
                            "transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none cursor-pointer",
                            "shadow-lg",
                            buttonStyles.gradient,
                            buttonStyles.hoverGradient,
                            buttonStyles.shadow,
                            buttonStyles.hoverShadow,
                            buttonStyles.textColor,
                            buttonStyles.className
                        )}
                        disabled={loading}
                        aria-label="Sign in to your account"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <Loader2 className="animate-spin h-5 w-5" />
                                <span className="font-semibold">Signing in...</span>
                            </span>
                        ) : (
                            <span className="flex items-center justify-center gap-2">
                                <LogIn className="w-5 h-5" />
                                <span className="font-semibold">Sign In</span>
                            </span>
                        )}
                    </Button>

                    {/* Social Login Section */}
                    {showSocialLogin && (
                        <div className="space-y-4">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className={cn(
                                        "w-full border-t",
                                        isDarkVariant ? "border-gray-700" : "border-gray-300"
                                    )}></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className={cn(
                                        "px-3 text-xs font-semibold uppercase tracking-wider",
                                        isDarkVariant
                                            ? "bg-gray-800 text-gray-400"
                                            : "bg-white text-gray-500"
                                    )}>
                                        Or continue with
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                {socialButtons.map((social) => (
                                    <button
                                        key={social.id}
                                        type="button"
                                        className={cn(
                                            "w-full inline-flex justify-center items-center py-2.5 px-4 border rounded-lg text-sm font-medium transition-all duration-300",
                                            "hover:shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50",
                                            "bg-white border-gray-300 hover:bg-gray-50 cursor-pointer",
                                            social.loading && "opacity-50 cursor-wait"
                                        )}
                                        onClick={social.onClick}
                                        disabled={social.loading}
                                        aria-label={`Sign in with ${social.label}`}
                                    >
                                        {social.loading ? (
                                            <Loader2 className="animate-spin w-5 h-5" />
                                        ) : (
                                            social.icon
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Sign Up Link */}
                    {showSignUpLink && (
                        <div className="text-center pt-6 border-t border-gray-200 dark:border-gray-700">
                            <p className={cn(
                                "text-sm",
                                isDarkVariant ? "text-gray-400" : "text-gray-600"
                            )}>
                                Don't have an account?{" "}
                                <button
                                    type="button"
                                    onClick={handleSignUpClick}
                                    className={cn(
                                        "font-semibold transition-colors cursor-pointer",
                                        isDarkVariant
                                            ? "text-blue-400 hover:text-blue-300"
                                            : "text-blue-600 hover:text-blue-700"
                                    )}
                                    aria-label="Create a new account"
                                >
                                    Sign Up
                                </button>
                            </p>
                        </div>
                    )}
                </form>
            </motion.div>
        );
    };

    // For split layout, we need to handle the info panel
    if (type === "split") {
        const splitStyles = getSplitLayoutStyles();

        return (
            <div className={cn(containerVariants({ variant, type }), className)}>
                {/* Left Panel - Info */}
                <div
                    className={splitStyles.leftPanelClasses}
                    style={splitStyles.backgroundStyle}
                >
                    {/* Overlay for background image */}
                    {splitStyles.backgroundStyle.backgroundImage && (
                        <div
                            className="absolute inset-0"
                            style={splitStyles.overlayStyle}
                        />
                    )}

                    {renderLeftPanelContent()}
                </div>

                {/* Right Panel - Form */}
                <div className={splitStyles.rightPanelClasses}>
                    {renderFormContent()}
                </div>
            </div>
        );
    }

    // Centered layout
    return (
        <div className={cn(containerVariants({ variant, type }), className)}>
            {renderFormContent()}
        </div>
    );
};

SignIn.displayName = "SignIn";

export { SignIn };