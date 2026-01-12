// components/FormContent.tsx
import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../../../utils/cn";
import { Button } from "../../button";
import { AnimatedInput } from "../../input";
import {
    Eye, EyeOff, Mail, Lock,
    User, UserPlus, Loader2
} from "lucide-react";
import { type FormContentProps } from "../types";
import { getInputClasses } from "../utils";
import { PasswordStrength } from "./PasswordStrength";
import { SocialSignUp } from "./SocialSignUp";
import { TermsCheckbox } from "./TermsCheckbox";
import { Captcha } from "./Captcha";
import { ErrorDisplay } from "./ErrorDisplay";

/**
 * Renders the main form content including all input fields, validation,
 * and submission logic for the SignUp component.
 * 
 * @component FormContent
 * @description The core form component that handles user input, validation,
 * and submission for the registration flow.
 * 
 * @param {FormContentProps} props - Component properties
 * @returns {React.ReactElement} The form content component
 */
const FormContent: React.FC<FormContentProps> = ({
    variant = 'default',
    type = 'centered',
    formData,
    errors,
    showPassword,
    showConfirmPassword,
    loading,
    error,
    showSocialSignUp,
    showLoginLink,
    loginText = "Already have an account?",
    requireEmailConfirmation = true,
    captchaConfig,
    passwordStrength,
    termsConfig,
    buttonStyle,
    logo,
    onLogin,
    onGoogleSignUp,
    onGitHubSignUp,
    onMicrosoftSignUp,
    handleInputChange,
    handleBlur,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    handleSubmit,
    captchaVerified,
    setCaptchaVerified,
    socialLoading,
    onSocialSignUp,
}) => {
    const isDarkVariant = variant === "dark";

    const getButtonStyles = () => {
        const defaultStyles = {
            gradient: "bg-gradient-to-r from-green-600 to-emerald-600",
            hoverGradient: "hover:from-green-700 hover:to-emerald-700",
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

    const defaultLogo = (
        <div className={cn(
            "w-16 h-16 rounded-xl flex items-center justify-center shadow-lg",
            isDarkVariant
                ? "bg-gradient-to-br from-green-900/20 to-emerald-800/10 border border-emerald-700/20"
                : "bg-gradient-to-br from-green-50 to-emerald-100 border border-emerald-200"
        )}>
            <UserPlus className={cn(
                "w-8 h-8",
                isDarkVariant ? "text-emerald-400" : "text-emerald-600"
            )} />
        </div>
    );

    const buttonStyles = getButtonStyles();

    return (
        <motion.div
            className={cn(
                "rounded-2xl shadow-2xl p-8 transition-all duration-300",
                variant === 'default' ? "bg-white" :
                    variant === 'modern' ? "bg-white/95 backdrop-blur-sm border border-slate-200" :
                        variant === 'glass' ? "bg-white/10 backdrop-blur-lg border border-white/20" :
                            "bg-gray-800",
                type === 'centered' ? "w-full max-w-md" : "w-full max-w-md bg-card rounded-xl"
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Logo */}
            <div className="flex justify-center mb-8">
                {logo || defaultLogo}
            </div>

            {/* Title */}
            <div className="text-center mb-10">
                <h1 className={cn(
                    "text-2xl md:text-3xl font-bold mb-3",
                    isDarkVariant ? "text-white" : "text-gray-900"
                )}>
                    Create Your Account
                </h1>
                <p className={cn(
                    "text-sm md:text-base",
                    isDarkVariant ? "text-gray-400" : "text-gray-600"
                )}>
                    Join our community and start your journey today
                </p>
            </div>

            {/* Error Message */}
            <ErrorDisplay error={error} isDarkVariant={isDarkVariant} />

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* First Name Field */}
                    <div className="space-y-2">
                        <label htmlFor="firstName" className={cn(
                            "block text-sm font-semibold",
                            isDarkVariant ? "text-gray-300" : "text-gray-700"
                        )}>
                            First Name
                        </label>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                <User className={cn(
                                    "w-5 h-5",
                                    isDarkVariant ? "text-gray-500" : "text-gray-400"
                                )} />
                            </div>
                            <AnimatedInput
                                variant="clean"
                                type="text"
                                value={formData.firstName}
                                onChange={(value: string) => handleInputChange('firstName', value)}
                                onBlur={() => handleBlur('firstName')}
                                placeholder="John"
                                inputClassName={cn(getInputClasses(variant!, !!errors.firstName), "pl-10")}
                                aria-label="First name"
                                aria-invalid={!!errors.firstName}
                                aria-describedby={errors.firstName ? "first-name-error" : undefined}
                            />
                        </div>
                        {errors.firstName && (
                            <p id="first-name-error" className="mt-1 text-xs font-medium text-red-500">
                                {errors.firstName}
                            </p>
                        )}
                    </div>

                    {/* Last Name Field */}
                    <div className="space-y-2">
                        <label htmlFor="lastName" className={cn(
                            "block text-sm font-semibold",
                            isDarkVariant ? "text-gray-300" : "text-gray-700"
                        )}>
                            Last Name
                        </label>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                <User className={cn(
                                    "w-5 h-5",
                                    isDarkVariant ? "text-gray-500" : "text-gray-400"
                                )} />
                            </div>
                            <AnimatedInput
                                variant="clean"
                                type="text"
                                value={formData.lastName}
                                onChange={(value: string) => handleInputChange('lastName', value)}
                                onBlur={() => handleBlur('lastName')}
                                placeholder="Doe"
                                inputClassName={cn(getInputClasses(variant!, !!errors.lastName), "pl-10")}
                                aria-label="Last name"
                                aria-invalid={!!errors.lastName}
                                aria-describedby={errors.lastName ? "last-name-error" : undefined}
                            />
                        </div>
                        {errors.lastName && (
                            <p id="last-name-error" className="mt-1 text-xs font-medium text-red-500">
                                {errors.lastName}
                            </p>
                        )}
                    </div>
                </div>

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
                            onBlur={() => handleBlur('email')}
                            placeholder="you@example.com"
                            inputClassName={cn(getInputClasses(variant!, !!errors.email), "pl-10")}
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

                {/* Confirm Email Field */}
                {requireEmailConfirmation && (
                    <div className="space-y-2">
                        <label htmlFor="confirmEmail" className={cn(
                            "block text-sm font-semibold",
                            isDarkVariant ? "text-gray-300" : "text-gray-700"
                        )}>
                            Confirm Email
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
                                value={formData.confirmEmail}
                                onChange={(value: string) => handleInputChange('confirmEmail', value)}
                                onBlur={() => handleBlur('confirmEmail')}
                                placeholder="you@example.com"
                                inputClassName={cn(getInputClasses(variant!, !!errors.confirmEmail), "pl-10")}
                                aria-label="Confirm email address"
                                aria-invalid={!!errors.confirmEmail}
                                aria-describedby={errors.confirmEmail ? "confirm-email-error" : undefined}
                            />
                        </div>
                        {errors.confirmEmail && (
                            <p id="confirm-email-error" className="mt-1 text-xs font-medium text-red-500">
                                {errors.confirmEmail}
                            </p>
                        )}
                    </div>
                )}

                {/* Password Field */}
                <div className="space-y-2">
                    <label htmlFor="password" className={cn(
                        "block text-sm font-semibold",
                        isDarkVariant ? "text-gray-300" : "text-gray-700"
                    )}>
                        Password
                    </label>
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
                            onBlur={() => handleBlur('password')}
                            placeholder="Create a strong password"
                            inputClassName={cn(getInputClasses(variant!, !!errors.password), "pl-10 pr-10")}
                            aria-label="Password"
                            aria-invalid={!!errors.password}
                            aria-describedby={errors.password ? "password-error" : undefined}
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
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
                    <PasswordStrength
                        password={formData.password}
                        passwordStrength={passwordStrength}
                        isDarkVariant={isDarkVariant}
                    />
                    {errors.password && (
                        <p id="password-error" className="mt-1 text-xs font-medium text-red-500">
                            {errors.password}
                        </p>
                    )}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                    <label htmlFor="confirmPassword" className={cn(
                        "block text-sm font-semibold",
                        isDarkVariant ? "text-gray-300" : "text-gray-700"
                    )}>
                        Confirm Password
                    </label>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2">
                            <Lock className={cn(
                                "w-5 h-5",
                                isDarkVariant ? "text-gray-500" : "text-gray-400"
                            )} />
                        </div>
                        <AnimatedInput
                            variant="clean"
                            type={showConfirmPassword ? "text" : "password"}
                            value={formData.confirmPassword}
                            onChange={(value: string) => handleInputChange('confirmPassword', value)}
                            onBlur={() => handleBlur('confirmPassword')}
                            placeholder="Confirm your password"
                            inputClassName={cn(getInputClasses(variant!, !!errors.confirmPassword), "pl-10 pr-10")}
                            aria-label="Confirm password"
                            aria-invalid={!!errors.confirmPassword}
                            aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
                        />
                        <button
                            type="button"
                            onClick={toggleConfirmPasswordVisibility}
                            className={cn(
                                "absolute right-3 top-1/2 -translate-y-1/2 transition-colors",
                                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded p-1",
                                isDarkVariant
                                    ? "text-gray-400 hover:text-gray-200"
                                    : "text-gray-500 hover:text-gray-700"
                            )}
                            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                            aria-controls="confirmPassword"
                        >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                    {errors.confirmPassword && (
                        <p id="confirm-password-error" className="mt-1 text-xs font-medium text-red-500">
                            {errors.confirmPassword}
                        </p>
                    )}
                </div>

                {/* Terms & Conditions */}
                <TermsCheckbox
                    acceptTerms={formData.acceptTerms}
                    onChange={(value) => handleInputChange('acceptTerms', value)}
                    error={errors.acceptTerms}
                    termsConfig={termsConfig}
                    isDarkVariant={isDarkVariant}
                />

                {/* CAPTCHA */}
                {captchaConfig?.enabled && (
                    <Captcha
                        captchaConfig={captchaConfig}
                        verified={captchaVerified}
                        onVerify={setCaptchaVerified}
                        error={errors.captcha}
                        isDarkVariant={isDarkVariant}
                    />
                )}

                {/* Sign Up Button */}
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
                    disabled={loading || !formData.acceptTerms || (captchaConfig?.enabled && !captchaVerified)}
                    aria-label="Create your account"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <Loader2 className="animate-spin h-5 w-5" />
                            <span className="font-semibold">Creating Account...</span>
                        </span>
                    ) : (
                        <span className="flex items-center justify-center gap-2">
                            <UserPlus className="w-5 h-5" />
                            <span className="font-semibold">Create Account</span>
                        </span>
                    )}
                </Button>

                {/* Social Sign Up Section */}
                {showSocialSignUp && (
                    <SocialSignUp
                        isDarkVariant={isDarkVariant}
                        onGoogleSignUp={onGoogleSignUp}
                        onGitHubSignUp={onGitHubSignUp}
                        onMicrosoftSignUp={onMicrosoftSignUp}
                        socialLoading={socialLoading}
                        onSocialSignUp={onSocialSignUp}
                    />
                )}

                {/* Login Link */}
                {showLoginLink && (
                    <div className="text-center pt-6 border-t border-gray-200 dark:border-gray-700">
                        <p className={cn(
                            "text-sm",
                            isDarkVariant ? "text-gray-400" : "text-gray-600"
                        )}>
                            {loginText}{" "}
                            <button
                                type="button"
                                onClick={onLogin}
                                className={cn(
                                    "font-semibold transition-colors cursor-pointer",
                                    isDarkVariant
                                        ? "text-blue-400 hover:text-blue-300"
                                        : "text-blue-600 hover:text-blue-700"
                                )}
                                aria-label="Sign in to your account"
                            >
                                Sign In
                            </button>
                        </p>
                    </div>
                )}
            </form>
        </motion.div>
    );
};

export { FormContent };