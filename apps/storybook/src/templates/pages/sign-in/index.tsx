// ─────────────────────────────────────────────────────────────────────────────
// SignIn Component - Unified Login Form
// Clean design with logo, social login options, and exact layout from spec
// ─────────────────────────────────────────────────────────────────────────────

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../../utils/cn";
import { Button } from "../../../components/button";
import { AnimatedInput } from "../../../components/input";
import {
    Eye,
    EyeOff,
    AlertCircle,
    Mail,
    Lock,
    Shield,
    LogIn,
    Loader2,
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
}

export interface SignInFormData {
    email: string;
    password: string;
    rememberMe: boolean;
}

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
    loading = false,
    error = "",
    showSocialLogin = true,
    showForgotPassword = true,
    showSignUpLink = true,
    className,
}) => {
    const [formData, setFormData] = React.useState<SignInFormData>({
        email: '',
        password: '',
        rememberMe: false,
    });

    const [showPassword, setShowPassword] = React.useState(false);
    const [errors, setErrors] = React.useState<Record<string, string>>({});

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
            // Optionally, you can provide a fallback
            // window.location.href = '/signup';
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

    // Default logo if not provided
    const defaultLogo = (
        <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center",
            isDarkVariant
                ? "bg-blue-900/20"
                : "bg-blue-100"
        )}>
            <Shield className={cn(
                "w-7 h-7",
                isDarkVariant ? "text-blue-400" : "text-blue-600"
            )} />
        </div>
    );

    // Social login buttons configuration
    const socialButtons = [
        {
            id: 'google',
            icon: <FcGoogle className="w-5 h-5" />,
            label: 'Google',
            className: "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 cursor-pointer"
        },
        {
            id: 'github',
            icon: <FaGithub className="w-5 h-5" />,
            label: 'GitHub',
            className: "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 cursor-pointer"
        },
        {
            id: 'microsoft',
            icon: <FaMicrosoft className="w-5 h-5 text-[#00A4EF]" />,
            label: 'Microsoft',
            className: "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 cursor-pointer"
        },
    ];

    // Render Form Content
    const renderFormContent = () => (
        <motion.div
            className={cn(cardVariants({ variant, type }))}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Logo */}
            <div className="flex justify-center mb-6">
                {logo || defaultLogo}
            </div>

            {/* Title */}
            <div className="text-center mb-8">
                <h1 className={cn(
                    "text-2xl font-bold mb-2",
                    isDarkVariant ? "text-white" : "text-gray-900"
                )}>
                    Sign In to Your Account
                </h1>
                <p className={cn(
                    "text-sm",
                    isDarkVariant ? "text-gray-400" : "text-gray-600"
                )}>
                    Welcome back! Please enter your details
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
                            "text-sm",
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
                        "block text-sm font-medium",
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
                            // id="email"
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
                        <p id="email-error" className="mt-1 text-xs text-red-500">
                            {errors.email}
                        </p>
                    )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label htmlFor="password" className={cn(
                            "block text-sm font-medium",
                            isDarkVariant ? "text-gray-300" : "text-gray-700"
                        )}>
                            Password
                        </label>
                        {showForgotPassword && (
                            <button
                                type="button"
                                className={cn(
                                    "text-sm font-medium transition-colors cursor-pointer",
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
                            // id="password"
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
                        <p id="password-error" className="mt-1 text-xs text-red-500">
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
                            "ml-2 text-sm",
                            isDarkVariant
                                ? "text-gray-400 group-hover:text-gray-200"
                                : "text-gray-600 group-hover:text-gray-900"
                        )}>
                            Remember me
                        </span>
                    </label>
                </div>

                {/* Sign In Button */}
                <Button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
                    disabled={loading}
                    aria-label="Sign in to your account"
                >
                    {loading ? (
                        <span className="flex items-center justify-center">
                            <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                            Signing in...
                        </span>
                    ) : (
                        <span className="flex items-center justify-center gap-2">
                            <LogIn className="w-5 h-5" />
                            Sign In
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
                                    "px-2",
                                    isDarkVariant
                                        ? "bg-gray-800 text-gray-400"
                                        : "bg-white text-gray-500"
                                )}>
                                    OR
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
                                        "bg-white border-gray-300 hover:bg-gray-50 cursor-pointer", // All buttons white
                                        social.className
                                    )}
                                    aria-label={`Sign in with ${social.label}`}
                                >
                                    <span className="flex items-center justify-center">
                                        {social.icon}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Sign Up Link */}
                {showSignUpLink && (
                    <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
                        <p className={cn(
                            "text-sm",
                            isDarkVariant ? "text-gray-400" : "text-gray-600"
                        )}>
                            Don't have an account?{" "}
                            <button
                                type="button"
                                onClick={handleSignUpClick}
                                className={cn(
                                    "font-medium transition-colors cursor-pointer",
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
                {/* Sign Up Link (Now with proper callback) */}
                {/* {showSignUpLink && (
                    <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
                        <p className={cn(
                            "text-sm mb-2",
                            isDarkVariant ? "text-gray-400" : "text-gray-600"
                        )}>
                            {signUpText}
                        </p>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleSignUpClick}
                            className={cn(
                                "w-full py-2.5 border-2 font-medium rounded-lg transition-all duration-300",
                                "hover:shadow-md active:scale-95 cursor-pointer",
                                isDarkVariant
                                    ? "border-blue-500 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300"
                                    : "border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                            )}
                            aria-label="Create a new account"
                        >
                            <span className="flex items-center justify-center gap-2">
                                <UserPlus className="w-4 h-4" />
                                Create Account
                            </span>
                        </Button>
                    </div>
                )} */}
            </form>
        </motion.div>
    );

    // For split layout, we need to handle the info panel
    if (type === "split") {
        return (
            <div className={cn(containerVariants({ variant, type }), className)}>
                {/* Left Panel - Info (same as before) */}
                <div className={cn(
                    "flex-1 flex flex-col p-12 hidden lg:flex",
                    isDarkVariant
                        ? "bg-gradient-to-br from-gray-800 to-gray-900 text-white"
                        : "bg-gradient-to-br from-blue-600 to-blue-800 text-white"
                )}>
                    <div className="w-full h-full flex items-center justify-center">
                        <motion.div
                            className="relative z-10 flex flex-col items-center justify-between w-full"
                            initial="hidden"
                            animate="visible"
                        >
                            {/* Header */}
                            <motion.div
                                initial={{ x: -50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.6 }}
                            >
                                <div className="flex items-center gap-3 mb-8">
                                    {logo || defaultLogo}
                                    <span className="text-2xl font-bold">{companyName}</span>
                                </div>
                            </motion.div>

                            {/* Content */}
                            <div className="space-y-8">
                                <div className="space-y-6">
                                    <motion.h1
                                        className="text-5xl text-center font-bold leading-tight my-10"
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        Welcome Back<br />
                                        to {companyName}
                                    </motion.h1>
                                    <motion.p
                                        className="text-lg text-center text-white/90 max-w-md my-10"
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        Sign in to access your personalized dashboard and continue where you left off.
                                    </motion.p>
                                </div>
                            </div>

                            {/* Footer */}
                            <motion.div
                                className="text-sm text-white/70 mt-10"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                © 2024 {companyName}. All rights reserved.
                            </motion.div>
                        </motion.div>
                    </div>
                </div>

                {/* Right Panel - Form */}
                <div className="flex-1 flex items-center justify-center md:p-12">
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