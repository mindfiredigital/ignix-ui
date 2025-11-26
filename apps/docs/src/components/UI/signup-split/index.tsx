// ─────────────────────────────────────────────────────────────────────────────
// SplitSignupForm Component - Split Layout
// Modern split layout with info panel and form side
// ─────────────────────────────────────────────────────────────────────────────

import * as React from "react";
import { motion } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../utils/cn";
import { Button } from "../button";
import { AnimatedInput } from "../input";
// import { Label } from "../../label";
// import { Checkbox } from "../../checkbox";
import {
    Eye,
    EyeOff,
    // UserPlus,
    // Mail,
    // Lock,
    // User,
    Shield,
    ArrowRight
} from "lucide-react";

// Types
export interface SplitSignupFormProps {
    /** Form variant */
    variant?: VariantProps<typeof containerVariants>["variant"];

    /** Company/brand name */
    companyName?: string;

    /** Company logo */
    logo?: React.ReactNode;

    /** Form submission handler */
    onSubmit?: (data: SignupFormData) => void;

    /** Loading state */
    loading?: boolean;

    /** Show login link */
    showLoginLink?: boolean;

    /** Additional className */
    className?: string;
}

export interface SignupFormData {
    firstName: string;
    lastName: string;
    email: string;
    confirmEmail: string;
    password: string;
    confirmPassword: string;
    acceptTerms: boolean;
}

// Variants
const containerVariants = cva("min-h-screen flex", {
    variants: {
        variant: {
            default: "bg-background",
            modern: "bg-slate-50 dark:bg-slate-900",
            gradient: "bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800",
            dark: "bg-gray-900",
        },
    },
    defaultVariants: {
        variant: "default",
    },
});

const panelVariants = cva("flex-1 flex flex-col p-12", {
    variants: {
        variant: {
            default: "bg-gradient-to-br from-blue-600 to-blue-800 text-white",
            modern: "bg-gradient-to-br from-slate-800 to-slate-900 text-white",
            gradient: "bg-gradient-to-br from-purple-600 to-blue-700 text-white",
            dark: "bg-gradient-to-br from-gray-800 to-gray-900 text-white",
        },
    },
    defaultVariants: {
        variant: "default",
    },
});

const formCardVariants = cva(
    "w-full max-w-md bg-card rounded-xl shadow-2xl p-8",
    {
        variants: {
            variant: {
                default: "bg-white",
                modern: "bg-white/95 backdrop-blur-sm dark:bg-slate-900/95 ",
                gradient: "bg-white/95 backdrop-blur-sm dark:bg-gray-900/95",
                dark: "bg-gray-900 ",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

// Text color variants for different themes
const headingVariants = cva("font-bold", {
    variants: {
        variant: {
            default: "text-gray-900",
            modern: "text-gray-900 dark:text-white",
            gradient: "text-gray-900 dark:text-white",
            dark: "text-white",
        },
    },
    defaultVariants: {
        variant: "default",
    },
});

const subheadingVariants = cva("", {
    variants: {
        variant: {
            default: "text-gray-600",
            modern: "text-gray-600 dark:text-gray-300",
            gradient: "text-gray-600 dark:text-gray-300",
            dark: "text-gray-300",
        },
    },
    defaultVariants: {
        variant: "default",
    },
});

const labelVariants = cva("block text-sm font-medium", {
    variants: {
        variant: {
            default: "text-gray-900",
            modern: "text-gray-700 dark:text-gray-200",
            gradient: "text-gray-700 dark:text-gray-200",
            dark: "text-gray-200",
        },
    },
    defaultVariants: {
        variant: "default",
    },
});

// Password Strength Types and Utilities (same as centered version)
type PasswordStrength = 'weak' | 'fair' | 'good' | 'strong';

interface PasswordStrengthResult {
    strength: PasswordStrength;
    score: number;
}

const calculatePasswordStrength = (password: string): PasswordStrengthResult => {
    let score = 0;

    if (!password) return { strength: 'weak', score: 0 };

    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[^a-zA-Z0-9]/.test(password)) score += 1;

    const strength: PasswordStrength =
        score <= 2 ? 'weak' :
            score === 3 ? 'fair' :
                score === 4 ? 'good' : 'strong';

    return { strength, score };
};

const getStrengthColor = (strength: PasswordStrength): string => {
    switch (strength) {
        case 'weak': return 'bg-red-500';
        case 'fair': return 'bg-orange-500';
        case 'good': return 'bg-yellow-500';
        case 'strong': return 'bg-green-500';
    }
};

const getStrengthText = (strength: PasswordStrength): string => {
    switch (strength) {
        case 'weak': return 'Weak';
        case 'fair': return 'Fair';
        case 'good': return 'Good';
        case 'strong': return 'Strong';
    }
};

// Password Strength Indicator Component
interface PasswordStrengthIndicatorProps {
    password: string;
    className?: string;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
    password,
    className
}) => {
    const strength = calculatePasswordStrength(password);

    if (!password) return null;

    return (
        <div className={cn("mt-2 space-y-2", className)}>
            <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Password strength:</span>
                <span className={cn(
                    "text-xs font-medium",
                    strength.strength === 'weak' ? 'text-red-500' :
                        strength.strength === 'fair' ? 'text-orange-500' :
                            strength.strength === 'good' ? 'text-yellow-500' : 'text-green-500'
                )}>
                    {getStrengthText(strength.strength)}
                </span>
            </div>
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((level) => (
                    <div
                        key={level}
                        className={cn(
                            "h-1 flex-1 rounded-full transition-all duration-300",
                            level <= strength.score
                                ? getStrengthColor(strength.strength)
                                : 'bg-gray-200 dark:bg-gray-600'
                        )}
                    />
                ))}
            </div>
        </div>
    );
};

/* ──────────────────────────────────────────────────────────────
   Component
────────────────────────────────────────────────────────────── */
const SplitSignupForm: React.FC<SplitSignupFormProps> = ({
    variant = "default",
    companyName = "YourBrand",
    logo,
    onSubmit,
    loading = false,
    showLoginLink = true,
    className,
}) => {
    const [formData, setFormData] = React.useState<SignupFormData>({
        firstName: "",
        lastName: "",
        email: "",
        confirmEmail: "",
        password: "",
        confirmPassword: "",
        acceptTerms: false,
    });

    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
    const [errors, setErrors] = React.useState<Record<string, string>>({});

    // const passwordStrength = calculatePasswordStrength(formData.password);

    // Fixed Animation variants with proper Framer Motion types
    const containerAnimation = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemAnimation = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    const slideInAnimation = {
        hidden: { x: -50, opacity: 0 },
        visible: {
            x: 0,
            opacity: 1,
            transition: {
                duration: 0.6,
                ease: "easeOut" as const
            }
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = "First name is required";
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = "Last name is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email";
        }

        if (formData.email !== formData.confirmEmail) {
            newErrors.confirmEmail = "Emails do not match";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        if (!formData.acceptTerms) {
            newErrors.acceptTerms = "You must accept the terms and conditions";
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

    const handleInputChange = (field: keyof SignupFormData, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const getInputClasses = (hasError: boolean) =>
        cn(
            "w-full px-4 py-3 rounded-lg border bg-background text-foreground",
            "placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent",
            "transition-all duration-300 input-focus",
            hasError
                ? "border-destructive"
                : "border-border"
        );

    // Info panel features
    // const features = [
    //     {
    //         icon: Shield,
    //         title: "Secure & Private",
    //         description: "Your data is encrypted and protected"
    //     },
    //     {
    //         icon: UserPlus,
    //         title: "Easy Setup",
    //         description: "Get started in less than 2 minutes"
    //     },
    //     {
    //         icon: Lock,
    //         title: "Enterprise Grade",
    //         description: "Trusted by thousands of companies"
    //     }
    // ];

    return (
        <div className={cn(containerVariants({ variant }), className)}>
            {/* Left Panel - Info */}
            <div className={cn(panelVariants({ variant }), "hidden lg:flex")}>
                {/* <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div> */}
                <div className="w-full h-full flex items-center justify-center">
                    <motion.div
                        className="relative z-10 flex flex-col items-center justify-between w-full"
                        initial="hidden"
                        animate="visible"
                        variants={containerAnimation}
                    >
                        {/* Header */}
                        <motion.div variants={slideInAnimation}>
                            <div className="flex items-center gap-3 mb-8">
                                {logo || (
                                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                        <Shield className="w-6 h-6" />
                                    </div>
                                )}
                                <span className="text-2xl font-bold">{companyName}</span>
                            </div>
                        </motion.div>

                        {/* Content */}
                        <motion.div
                            className="space-y-8"
                            variants={slideInAnimation}
                        >
                            <div className="space-y-6">
                                <motion.h1
                                    className="text-5xl text-center font-bold leading-tight my-10"
                                    variants={itemAnimation}
                                >
                                    Join thousands of<br />
                                    happy users today
                                </motion.h1>
                                <motion.p
                                    className="text-lg text-center text-white/90 max-w-md my-10"
                                    variants={itemAnimation}
                                >
                                    Create your account and unlock powerful features designed to help you succeed.
                                    Fast, secure, and always improving.
                                </motion.p>
                            </div>

                            {/* <motion.div
                                className="pt-8 space-y-6"
                                variants={containerAnimation}
                            >
                                {features.map((feature, index) => (
                                    <motion.div
                                        key={feature.title}
                                        className="flex items-center gap-4"
                                        variants={itemAnimation}
                                        custom={index}
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                                            <feature.icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-white">{feature.title}</h3>
                                            <p className="text-sm text-white/80">{feature.description}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div> */}
                        </motion.div>

                        {/* Footer */}
                        <motion.div
                            className="text-sm text-white/70 mt-10"
                            variants={slideInAnimation}
                        >
                            © 2024 {companyName}. All rights reserved.
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="flex-1 flex items-center justify-center md:p-12">
                <motion.div
                    className={cn(formCardVariants({ variant }), "w-full max-w-md")}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    {/* Mobile Header */}
                    <div className="lg:hidden flex items-center gap-3 mb-8 pb-6 border-b border-border">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-foreground">{companyName}</span>
                    </div>

                    <motion.div
                        className="space-y-8"
                        variants={containerAnimation}
                        initial="hidden"
                        animate="visible"
                    >
                        {/* Header */}
                        <motion.div
                            className="text-center space-y-2"
                            variants={itemAnimation}
                        >
                            <h2 className={cn("text-3xl font-bold text-foreground", headingVariants({ variant }))}>Create Account</h2>
                            <p className={cn("text-muted-foreground", subheadingVariants({ variant }))}>
                                Sign up to get started with your journey
                            </p>
                        </motion.div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name Fields */}
                            <motion.div
                                className="grid grid-cols-2 gap-4"
                                variants={containerAnimation}
                            >
                                <motion.div className="space-y-2" variants={itemAnimation}>
                                    <label htmlFor="firstName" className={cn(labelVariants({ variant }))}>First Name</label>
                                    <AnimatedInput
                                        // id="firstName"
                                        variant="clean"
                                        value={formData.firstName}
                                        onChange={(value: string) => handleInputChange('firstName', value)}
                                        // placeholder="John"
                                        inputClassName={getInputClasses(!!errors.firstName)}
                                    />
                                    {errors.firstName && (
                                        <p className="text-xs text-destructive animate-fade-in">{errors.firstName}</p>
                                    )}
                                </motion.div>

                                <motion.div className="space-y-2" variants={itemAnimation}>
                                    <label htmlFor="lastName" className={cn(labelVariants({ variant }))}>Last Name</label>
                                    <AnimatedInput
                                        // id="lastName"
                                        variant="clean"
                                        value={formData.lastName}
                                        onChange={(value: string) => handleInputChange('lastName', value)}
                                        // placeholder="Doe"
                                        inputClassName={getInputClasses(!!errors.lastName)}
                                    />
                                    {errors.lastName && (
                                        <p className="text-xs text-destructive animate-fade-in">{errors.lastName}</p>
                                    )}
                                </motion.div>
                            </motion.div>

                            {/* Email Fields */}
                            <motion.div className="space-y-2" variants={itemAnimation}>
                                <label htmlFor="email" className={cn(labelVariants({ variant }))} >
                                    {/* <Mail className="h-4 w-4" /> */}
                                    Email
                                </label>
                                <AnimatedInput
                                    // id="email"
                                    variant="clean"
                                    type="email"
                                    value={formData.email}
                                    onChange={(value: string) => handleInputChange('email', value)}
                                    // placeholder="john@example.com"
                                    inputClassName={getInputClasses(!!errors.email)}
                                />
                                {errors.email && (
                                    <p className="text-xs text-destructive animate-fade-in">{errors.email}</p>
                                )}
                            </motion.div>

                            <motion.div className="space-y-2" variants={itemAnimation}>
                                <label htmlFor="confirmEmail" className={cn(labelVariants({ variant }))}>Confirm Email</label>
                                <AnimatedInput
                                    // id="confirmEmail"
                                    variant="clean"
                                    type="email"
                                    value={formData.confirmEmail}
                                    onChange={(value: string) => handleInputChange('confirmEmail', value)}
                                    // placeholder="john@example.com"
                                    inputClassName={getInputClasses(!!errors.confirmEmail)}
                                />
                                {errors.confirmEmail && (
                                    <p className="text-xs text-destructive animate-fade-in">{errors.confirmEmail}</p>
                                )}
                            </motion.div>

                            {/* Password Fields */}
                            <motion.div className="space-y-2" variants={itemAnimation}>
                                <label htmlFor="password" className={cn(labelVariants({ variant }))}>
                                    {/* <Lock className="h-4 w-4" /> */}
                                    Password
                                </label>
                                <div className="relative">
                                    <AnimatedInput
                                        // id="password"
                                        variant="clean"
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={(value: string) => handleInputChange('password', value)}
                                        // placeholder="••••••••"
                                        inputClassName={cn(getInputClasses(!!errors.password), "pr-10")}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-xs text-destructive animate-fade-in">{errors.password}</p>
                                )}
                                <PasswordStrengthIndicator password={formData.password} />
                            </motion.div>

                            <motion.div className="space-y-2" variants={itemAnimation}>
                                <label htmlFor="confirmPassword" className={cn(labelVariants({ variant }))}>Confirm Password</label>
                                <div className="relative">
                                    <AnimatedInput
                                        // id="confirmPassword"
                                        variant="clean"
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={formData.confirmPassword}
                                        onChange={(value: string) => handleInputChange('confirmPassword', value)}
                                        // placeholder="••••••••"
                                        inputClassName={cn(getInputClasses(!!errors.confirmPassword), "pr-10")}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-xs text-destructive animate-fade-in">{errors.confirmPassword}</p>
                                )}
                            </motion.div>

                            {/* Terms & Conditions */}
                            <motion.div className="space-y-2" variants={itemAnimation}>
                                <div className="flex items-start gap-3">
                                    <input
                                        type="checkbox"
                                        id="acceptTerms"
                                        checked={formData.acceptTerms}
                                        onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                                        className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 transition-all duration-300"
                                    />
                                    <label
                                        htmlFor="acceptTerms"
                                        // className=""
                                        className={cn("text-sm font-normal leading-normal cursor-pointer", labelVariants({ variant }))}
                                    >
                                        I agree to the{" "}
                                        <a href="#" className="text-gray-500 hover:underline font-medium">
                                            Terms & Conditions
                                        </a>{" "}
                                        and{" "}
                                        <a href="#" className="text-gray-500 hover:underline font-medium">
                                            Privacy Policy
                                        </a>
                                    </label>
                                </div>
                                {errors.acceptTerms && (
                                    <p className="text-xs text-destructive animate-fade-in">{errors.acceptTerms}</p>
                                )}
                            </motion.div>

                            {/* Submit Button */}
                            <motion.div variants={itemAnimation}>
                                <Button
                                    type="submit"
                                    className="w-full"
                                    size="lg"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Creating account...
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center gap-2">
                                            Create Account
                                            <ArrowRight className="w-4 h-4" />
                                        </span>
                                    )}
                                </Button>
                            </motion.div>

                            {/* Login Link */}
                            {showLoginLink && (
                                <motion.div variants={itemAnimation}>
                                    <p className="text-center text-sm text-muted-foreground">
                                        Already have an account?{" "}
                                        <a href="#" className="text-primary font-medium hover:underline">
                                            Log in
                                        </a>
                                    </p>
                                </motion.div>
                            )}
                        </form>
                    </motion.div>
                </motion.div>
            </div >
        </div >
    );
};

SplitSignupForm.displayName = "SplitSignupForm";

export { SplitSignupForm };