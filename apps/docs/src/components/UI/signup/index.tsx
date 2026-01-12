// SignUp.tsx
import * as React from "react";
import { cn } from "../../../utils/cn";
import { type SignUpProps } from "./types";
import { containerVariants } from "./variants";
import { useSignUpForm } from "./hooks/useSignUpForm";
import { LeftPanel } from "./components/LeftPanel";
import { FormContent } from "./components/FormContent";

/**
 * A comprehensive registration component with multiple layouts, themes, password
 * strength validation, CAPTCHA integration, and extensive content customization.
 * 
 * @component SignUp
 * @description Provides a complete, production-ready registration form with support
 * for comprehensive user registration flows. Includes all essential fields, password
 * strength validation, CAPTCHA integration, social sign-up options, and extensive
 * customization capabilities.
 * 
 * @example
 * // Basic usage
 * <SignUp
 *   type="centered"
 *   variant="default"
 *   companyName="MyApp"
 *   onSubmit={(data) => console.log(data)}
 * />
 * 
 * @example
 * // Enterprise registration with all features
 * <SignUp
 *   type="split"
 *   variant="dark"
 *   companyName="Acme Corp"
 *   passwordStrength={{
 *     minLength: 12,
 *     showStrengthMeter: true,
 *   }}
 *   captchaConfig={{ enabled: true }}
 *   onSubmit={handleRegistration}
 * />
 * 
 * @param {SignUpProps} props - Component properties
 * @param {SignUpType} [props.type="centered"] - Layout type (centered or split)
 * @param {SignUpVariant} [props.variant="default"] - Visual theme variant
 * @param {string} [props.companyName="YourBrand"] - Company/brand name
 * @param {React.ReactNode} [props.logo] - Custom logo component
 * @param {boolean} [props.requireEmailConfirmation=true] - Show confirm email field
 * @param {Function} [props.onSubmit] - Form submission handler
 * @param {Function} [props.onLogin] - Login click handler
 * @param {string} [props.loginText="Already have an account?"] - Login link text
 * @param {Function} [props.onGoogleSignUp] - Google sign-up callback
 * @param {Function} [props.onGitHubSignUp] - GitHub sign-up callback
 * @param {Function} [props.onMicrosoftSignUp] - Microsoft sign-up callback
 * @param {boolean} [props.loading=false] - Loading state for form submission
 * @param {string} [props.error=""] - Error message to display
 * @param {boolean} [props.showSocialSignUp=true] - Show social sign-up buttons
 * @param {boolean} [props.showLoginLink=true] - Show login link
 * @param {string} [props.className] - Additional CSS class name
 * @param {Object} [props.termsConfig] - Terms & Conditions configuration
 * @param {Object} [props.passwordStrength] - Password strength configuration
 * @param {Object} [props.captchaConfig] - CAPTCHA configuration
 * @param {Object} [props.splitBackground] - Split layout background customization
 * @param {Object} [props.buttonStyle] - Button styling customization
 * @param {Object} [props.leftPanelContent] - Left panel content customization (split layout only)
 * 
 * @returns {React.ReactElement} The SignUp component
 */
const SignUp: React.FC<SignUpProps> = ({
    type = "centered",
    variant = "default",
    companyName = "YourBrand",
    logo,
    requireEmailConfirmation = true,
    onSubmit,
    onLogin,
    loginText = "Already have an account?",
    onGoogleSignUp,
    onGitHubSignUp,
    onMicrosoftSignUp,
    loading = false,
    error = "",
    showSocialSignUp = true,
    showLoginLink = true,
    className,
    termsConfig,
    passwordStrength,
    captchaConfig,
    splitBackground,
    buttonStyle,
    leftPanelContent,
}) => {
    const [socialLoading, setSocialLoading] = React.useState<'google' | 'github' | 'microsoft' | null>(null);

    const {
        formData,
        showPassword,
        showConfirmPassword,
        errors,
        // touched,
        captchaVerified,
        setCaptchaVerified,
        handleSubmit,
        handleInputChange,
        handleBlur,
        togglePasswordVisibility,
        toggleConfirmPasswordVisibility,
        // validateForm,
    } = useSignUpForm({
        requireEmailConfirmation,
        passwordStrength,
        captchaConfig,
        onSubmit,
    });

    const handleSocialSignUp = async (provider: 'google' | 'github' | 'microsoft') => {
        setSocialLoading(provider);

        try {
            switch (provider) {
                case 'google':
                    if (onGoogleSignUp) await onGoogleSignUp();
                    break;
                case 'github':
                    if (onGitHubSignUp) await onGitHubSignUp();
                    break;
                case 'microsoft':
                    if (onMicrosoftSignUp) await onMicrosoftSignUp();
                    break;
            }
        } catch (error) {
            // Handle error appropriately
        } finally {
            setTimeout(() => setSocialLoading(null), 500);
        }
    };

    const handleLoginClick = () => {
        if (onLogin) onLogin();
    };

    const isDarkVariant = variant === "dark";

    // For split layout
    if (type === "split") {
        return (
            <div className={cn(containerVariants({ variant, type }), className)}>
                {/* Left Panel - Info */}
                <LeftPanel
                    companyName={companyName}
                    logo={logo}
                    splitBackground={splitBackground}
                    leftPanelContent={leftPanelContent}
                    isDarkVariant={isDarkVariant}
                />

                {/* Right Panel - Form */}
                <div className={cn(
                    "flex-1 flex items-center justify-center p-6 md:p-8 lg:p-12",
                    splitBackground?.rightPanelClassName
                )}>
                    <FormContent
                        variant={variant}
                        type={type}
                        formData={formData}
                        errors={errors}
                        showPassword={showPassword}
                        showConfirmPassword={showConfirmPassword}
                        loading={loading}
                        error={error}
                        showSocialSignUp={showSocialSignUp}
                        showLoginLink={showLoginLink}
                        loginText={loginText}
                        requireEmailConfirmation={requireEmailConfirmation}
                        captchaConfig={captchaConfig}
                        passwordStrength={passwordStrength}
                        termsConfig={termsConfig}
                        buttonStyle={buttonStyle}
                        logo={logo}
                        onLogin={handleLoginClick}
                        onGoogleSignUp={onGoogleSignUp}
                        onGitHubSignUp={onGitHubSignUp}
                        onMicrosoftSignUp={onMicrosoftSignUp}
                        handleInputChange={handleInputChange}
                        handleBlur={handleBlur}
                        togglePasswordVisibility={togglePasswordVisibility}
                        toggleConfirmPasswordVisibility={toggleConfirmPasswordVisibility}
                        handleSubmit={handleSubmit}
                        captchaVerified={captchaVerified}
                        setCaptchaVerified={setCaptchaVerified}
                        socialLoading={socialLoading}
                        onSocialSignUp={handleSocialSignUp}
                    />
                </div>
            </div>
        );
    }

    // Centered layout
    return (
        <div className={cn(containerVariants({ variant, type }), className)}>
            <FormContent
                variant={variant}
                type={type}
                formData={formData}
                errors={errors}
                showPassword={showPassword}
                showConfirmPassword={showConfirmPassword}
                loading={loading}
                error={error}
                showSocialSignUp={showSocialSignUp}
                showLoginLink={showLoginLink}
                loginText={loginText}
                requireEmailConfirmation={requireEmailConfirmation}
                captchaConfig={captchaConfig}
                passwordStrength={passwordStrength}
                termsConfig={termsConfig}
                buttonStyle={buttonStyle}
                logo={logo}
                onLogin={handleLoginClick}
                onGoogleSignUp={onGoogleSignUp}
                onGitHubSignUp={onGitHubSignUp}
                onMicrosoftSignUp={onMicrosoftSignUp}
                handleInputChange={handleInputChange}
                handleBlur={handleBlur}
                togglePasswordVisibility={togglePasswordVisibility}
                toggleConfirmPasswordVisibility={toggleConfirmPasswordVisibility}
                handleSubmit={handleSubmit}
                captchaVerified={captchaVerified}
                setCaptchaVerified={setCaptchaVerified}
                socialLoading={socialLoading}
                onSocialSignUp={handleSocialSignUp}
            />
        </div>
    );
};

SignUp.displayName = "SignUp";

export { SignUp };