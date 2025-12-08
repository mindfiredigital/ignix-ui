// ─────────────────────────────────────────────────────────────────────────────
// SignupForm Component - Centered Layout
// Modern signup form with theme support, password strength, and animations
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
    Check,
} from "lucide-react";

// Types
export interface SignupFormProps {
    /** Form variant */
    variant?: VariantProps<typeof formVariants>["variant"];

    /** Show theme toggle */
    showThemeToggle?: boolean;

    /** Form submission handler */
    onSubmit?: (data: SignupFormData) => void;

    /** Loading state */
    loading?: boolean;

    /** Success state */
    success?: boolean;

    /** Custom success message */
    successMessage?: string;

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

// Form Variants
const formVariants = cva(
    "min-h-screen flex items-center justify-center p-4 transition-colors duration-500",
    {
        variants: {
            variant: {
                default: "bg-gradient-to-br from-blue-50 to-cyan-50", // Remove dark: classes for default
                modern: "bg-gradient-to-br from-slate-50 to-slate-100",
                glass: "bg-gradient-to-br from-primary/10 to-secondary/10",
                dark: "bg-gradient-to-br from-gray-900 to-gray-800",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

const cardVariants = cva(
    "w-full max-w-md rounded-2xl shadow-2xl p-8 transition-all duration-300",
    {
        variants: {
            variant: {
                default: "bg-white", // Remove dark: class for default
                modern: "bg-white/95 backdrop-blur-sm border border-slate-200",
                glass: "bg-white/10 backdrop-blur-lg border border-white/20",
                dark: "bg-gray-800", // Remove border for dark variant
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

// Password Strength Types
type PasswordStrength = 'weak' | 'fair' | 'good' | 'strong';

interface PasswordStrengthResult {
    strength: PasswordStrength;
    score: number;
}

// Password Strength Utilities
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

/* ──────────────────────────────────────────────────────────────
   Component
────────────────────────────────────────────────────────────── */
const CenteredSignupForm: React.FC<SignupFormProps> = ({
    variant = "default",
    // showThemeToggle = true, 
    onSubmit,
    loading = false,
    success = false,
    successMessage = "Account created successfully! Please check your email.",
    className,
}) => {
    const [formData, setFormData] = React.useState<SignupFormData>({
        firstName: '',
        lastName: '',
        email: '',
        confirmEmail: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false,
    });

    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
    const [errors, setErrors] = React.useState<Record<string, string>>({});
    // const [isDark, setIsDark] = React.useState(false);

    const passwordStrength = calculatePasswordStrength(formData.password);

    // Animation variants
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

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (formData.email !== formData.confirmEmail) {
            newErrors.confirmEmail = 'Emails do not match';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!formData.acceptTerms) {
            newErrors.acceptTerms = 'You must accept the terms and conditions';
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
    const getInputClasses = (hasError: boolean, variant: string) => {
        // Base styles for all variants
        const baseStyles = "w-full px-4 py-3 rounded-lg border transition-all duration-300 placeholder-gray-400 focus:ring-2 focus:border-transparent";

        // Variant-specific styles
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
                "bg-white text-gray-900 border-gray-300 focus:ring-blue-500", // Whitish background for dark variant
                hasError && "border-red-500"
            )
        };

        return cn(baseStyles, variantStyles[variant as keyof typeof variantStyles]);
    };

    return (
        <div className={cn(formVariants({ variant }), className)}>
            <motion.div
                className={cn(cardVariants({ variant }))}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <motion.div className="text-center mb-8" variants={containerAnimation} initial="hidden" animate="visible">
                    <motion.h1
                        className={cn(
                            "text-3xl font-bold mb-2",
                            variant === "dark" ? "text-white" : "text-gray-900"
                        )}
                        variants={itemAnimation}
                    >
                        Create Account
                    </motion.h1>
                    <motion.p
                        className={cn(
                            variant === "dark" ? "text-gray-400" : "text-gray-600"
                        )}
                        variants={itemAnimation}
                    >
                        Join us today and get started
                    </motion.p>
                </motion.div>
                <AnimatePresence>
                    {success && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className={cn(
                                "mb-6 p-4 rounded-lg border",
                                variant === "dark"
                                    ? "bg-green-900/20 border-green-800"
                                    : "bg-green-50 border-green-200"
                            )}
                        >
                            <div className={cn(
                                "flex items-center text-sm",
                                variant === "dark" ? "text-green-400" : "text-green-800"
                            )}>
                                <Check className="w-5 h-5 mr-2" />
                                <span>{successMessage}</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <motion.div
                        className="grid grid-cols-2 gap-4"
                        variants={containerAnimation}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div variants={itemAnimation}>
                            <label htmlFor="firstName" className={cn(
                                "block text-sm font-medium  mb-2",
                                variant === "dark" ? "text-gray-300" : "text-gray-700"
                            )}>
                                First Name
                            </label>
                            <AnimatedInput
                                // id="firstName"
                                variant="clean"
                                type="text"
                                value={formData.firstName}
                                onChange={(value: string) => handleInputChange('firstName', value)}
                                placeholder="John"
                                inputClassName={getInputClasses(!!errors.firstName, variant as string)}
                            />
                            {errors.firstName && (
                                <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>
                            )}
                        </motion.div>

                        <motion.div variants={itemAnimation}>

                            <label htmlFor="lastName" className={cn(
                                "block text-sm font-medium  mb-2",
                                variant === "dark" ? "text-gray-300" : "text-gray-700"
                            )}>
                                Last Name
                            </label>
                            <AnimatedInput
                                // id="lastName"
                                variant="clean"
                                type="text"
                                value={formData.lastName}
                                onChange={(value: string) => handleInputChange('lastName', value)}
                                placeholder="Doe"
                                inputClassName={getInputClasses(!!errors.lastName, variant as string)}
                            />
                            {errors.lastName && (
                                <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>
                            )}
                        </motion.div>
                    </motion.div>

                    <motion.div variants={itemAnimation}>
                        <label htmlFor="email" className={cn(
                            "block text-sm font-medium mb-2",
                            variant === "dark" ? "text-gray-300" : "text-gray-700"
                        )}>
                            Email
                        </label>
                        <AnimatedInput
                            // id="email"
                            variant="clean"
                            type="email"
                            value={formData.email}
                            onChange={(value: string) => handleInputChange('email', value)}
                            placeholder="john.doe@example.com"
                            inputClassName={getInputClasses(!!errors.email, variant as string)}
                        />
                        {errors.email && (
                            <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                        )}
                    </motion.div>

                    <motion.div variants={itemAnimation}>

                        <label htmlFor="confirmEmail" className={cn(
                            "block text-sm font-medium  mb-2",
                            variant === "dark" ? "text-gray-300" : "text-gray-700"
                        )}>
                            Confirm Email
                        </label>
                        <AnimatedInput
                            // id="confirmEmail"
                            variant="clean"
                            type="email"
                            value={formData.confirmEmail}
                            onChange={(value: string) => handleInputChange('confirmEmail', value)}
                            placeholder="john.doe@example.com"
                            inputClassName={getInputClasses(!!errors.confirmEmail, variant as string)}
                        />
                        {errors.confirmEmail && (
                            <p className="mt-1 text-xs text-red-500">{errors.confirmEmail}</p>
                        )}
                    </motion.div>

                    <motion.div variants={itemAnimation}>

                        <label htmlFor="password" className={cn(
                            "block text-sm font-medium  mb-2",
                            variant === "dark" ? "text-gray-300" : "text-gray-700"
                        )}>
                            Password
                        </label>
                        <div className="relative">
                            <AnimatedInput
                                // id="password"
                                variant="clean"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={(value: string) => handleInputChange('password', value)}
                                placeholder="Enter your password"
                                inputClassName={cn(getInputClasses(!!errors.password, variant as string), "pr-12")}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className={cn(
                                    "absolute right-3 top-1/2 -translate-y-1/2 transition-colors",
                                    variant === "dark"
                                        ? "text-gray-400 hover:text-gray-200"
                                        : "text-gray-500 hover:text-gray-700"
                                )}
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        {formData.password && (
                            <div className="mt-2">
                                <div className="flex items-center justify-between mb-1">
                                    <span className={cn(
                                        "text-xs text-gray-600",
                                        variant === "dark" && "text-gray-400"
                                    )}>
                                        Password strength:
                                    </span>
                                    <span className={cn(
                                        "text-xs font-medium",
                                        passwordStrength.strength === 'weak' ? 'text-red-500' :
                                            passwordStrength.strength === 'fair' ? 'text-orange-500' :
                                                passwordStrength.strength === 'good' ? 'text-yellow-500' : 'text-green-500'
                                    )}>
                                        {getStrengthText(passwordStrength.strength)}
                                    </span>
                                </div>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((level) => (
                                        <div
                                            key={level}
                                            className={cn(
                                                "h-1 flex-1 rounded-full transition-all duration-300",
                                                level <= passwordStrength.score
                                                    ? getStrengthColor(passwordStrength.strength)
                                                    : cn(
                                                        "bg-gray-200",
                                                        variant === "dark" && "bg-gray-600"
                                                    )
                                            )}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                        {errors.password && (
                            <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                        )}
                    </motion.div>

                    <motion.div variants={itemAnimation}>

                        <label htmlFor="confirmPassword" className={cn(
                            "block text-sm font-medium  mb-2",
                            variant === "dark" ? "text-gray-300" : "text-gray-700"
                        )}>
                            Confirm Password
                        </label>
                        <div className="relative">
                            <AnimatedInput
                                // id="confirmPassword"
                                variant="clean"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={formData.confirmPassword}
                                onChange={(value: string) => handleInputChange('confirmPassword', value)}
                                placeholder="Confirm your password"
                                inputClassName={cn(getInputClasses(!!errors.confirmPassword, variant as string), "pr-12")}
                            />

                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className={cn(
                                    "absolute right-3 top-1/2 -translate-y-1/2 transition-colors",
                                    variant === "dark"
                                        ? "text-gray-400 hover:text-gray-200"
                                        : "text-gray-500 hover:text-gray-700"
                                )}
                            >
                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
                        )}
                    </motion.div>
                    <motion.div variants={itemAnimation}>
                        <label className="flex items-start cursor-pointer group">
                            <input
                                type="checkbox"
                                id="acceptTerms"
                                checked={formData.acceptTerms}
                                onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                                className={cn(
                                    "mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 transition-all duration-300",
                                    variant === "dark" && "border-gray-600 bg-gray-700 focus:ring-blue-400"
                                )}
                            />
                            <span className={cn(
                                "ml-3 text-sm text-gray-600 group-hover:text-gray-900 transition-colors",
                                variant === "dark" && "text-gray-400 group-hover:text-gray-200"
                            )}>
                                I agree to the{' '}
                                <a href="#" className={cn(
                                    "text-blue-600 hover:underline font-medium transition-colors",
                                    variant === "dark" && "text-blue-400"
                                )}>
                                    Terms and Conditions
                                </a>{' '}
                                and{' '}
                                <a href="#" className={cn(
                                    "text-blue-600 hover:underline font-medium transition-colors",
                                    variant === "dark" && "text-blue-400"
                                )}>
                                    Privacy Policy
                                </a>
                            </span>
                        </label>
                        {errors.acceptTerms && (
                            <p className="mt-1 text-xs text-red-500">{errors.acceptTerms}</p>
                        )}
                    </motion.div>

                    <motion.div variants={itemAnimation}>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
                                'Create Account'
                            )}
                        </Button>
                    </motion.div>
                </form>

                <motion.div className="mt-6 text-center" variants={itemAnimation}>
                    <p className={cn(
                        "text-sm text-gray-600",
                        variant === "dark" && "text-gray-400"
                    )}>
                        Already have an account?{' '}
                        <a href="#" className={cn(
                            "text-blue-600 hover:underline font-medium transition-colors",
                            variant === "dark" && "text-blue-400"
                        )}>
                            Sign in
                        </a>
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
};

CenteredSignupForm.displayName = "CenteredSignupForm";

export { CenteredSignupForm };