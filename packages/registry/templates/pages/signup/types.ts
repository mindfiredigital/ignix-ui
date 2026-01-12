

export type PasswordStrength = 'weak' | 'medium' | 'strong';
export type SocialProvider = 'google' | 'github' | 'microsoft';
export type SignUpVariant = 'default' | 'modern' | 'glass' | 'dark';
export type SignUpType = 'centered' | 'split';

export interface SignUpFormData {
    firstName: string;
    lastName: string;
    email: string;
    confirmEmail: string;
    password: string;
    confirmPassword: string;
    acceptTerms: boolean;
    captchaToken?: string;
}

export interface SignUpProps {
    /** Layout type */
    type?: SignUpType;

    /** Form variant */
    variant?: SignUpVariant;

    /** Company/brand name */
    companyName?: string;

    /** Custom logo component */
    logo?: React.ReactNode;

    /** Whether to show confirm email field */
    requireEmailConfirmation?: boolean;

    /** Form submission handler */
    onSubmit?: (data: SignUpFormData) => void;

    /** Login click handler */
    onLogin?: () => void;

    /** Callback for Google sign-up */
    onGoogleSignUp?: () => void;

    /** Callback for GitHub sign-up */
    onGitHubSignUp?: () => void;

    /** Callback for Microsoft sign-up */
    onMicrosoftSignUp?: () => void;

    /** Login link text */
    loginText?: string;

    /** Loading state */
    loading?: boolean;

    /** Error message */
    error?: string;

    /** Show social sign-up buttons */
    showSocialSignUp?: boolean;

    /** Show login link */
    showLoginLink?: boolean;

    /** Additional className */
    className?: string;

    /** Terms & Conditions configuration */
    termsConfig?: {
        /** Terms & Conditions URL */
        termsUrl?: string;
        /** Privacy Policy URL */
        privacyUrl?: string;
        /** Custom terms text */
        termsText?: string | React.ReactNode;
        /** Custom privacy text */
        privacyText?: string | React.ReactNode;
        /** Callback when terms link is clicked */
        onTermsClick?: () => void;
        /** Callback when privacy link is clicked */
        onPrivacyClick?: () => void;
    };

    /** Password strength configuration */
    passwordStrength?: {
        /** Minimum password length */
        minLength?: number;
        /** Require uppercase letters */
        requireUppercase?: boolean;
        /** Require lowercase letters */
        requireLowercase?: boolean;
        /** Require numbers */
        requireNumbers?: boolean;
        /** Require special characters */
        requireSpecialChars?: boolean;
        /** Show strength meter */
        showStrengthMeter?: boolean;
        /** Custom strength labels */
        strengthLabels?: {
            weak: string;
            medium: string;
            strong: string;
        };
    };

    /** CAPTCHA configuration */
    captchaConfig?: {
        /** Whether CAPTCHA is enabled */
        enabled?: boolean;
        /** Site key for reCAPTCHA */
        siteKey?: string;
        /** CAPTCHA type */
        type?: "checkbox" | "invisible" | "score";
        /** CAPTCHA theme */
        theme?: "light" | "dark";
        /** CAPTCHA size */
        size?: "normal" | "compact";
        /** Callback when CAPTCHA is verified */
        onVerify?: (token: string) => void;
        /** Callback when CAPTCHA expires */
        onExpire?: () => void;
        /** Callback when CAPTCHA errors */
        onError?: (error: Error | string) => void;
    };

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
        /** Background gradient classes for sign up button */
        gradient?: string;
        /** Hover gradient classes for sign up button */
        hoverGradient?: string;
        /** Text color for sign up button */
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

export interface ValidationErrors {
    [key: string]: string;
}

export interface TouchedFields {
    [key: string]: boolean;
}

export interface UseSignUpFormProps {
    requireEmailConfirmation?: boolean;
    passwordStrength?: SignUpProps['passwordStrength'];
    captchaConfig?: SignUpProps['captchaConfig'];
    onSubmit?: (data: SignUpFormData) => void;
}

export interface UseSignUpFormReturn {
    /** Current form data */
    formData: SignUpFormData;
    /** Whether password is visible */
    showPassword: boolean;
    /** Whether confirm password is visible */
    showConfirmPassword: boolean;
    /** Validation errors */
    errors: ValidationErrors;
    /** Touched fields */
    touched: TouchedFields;
    /** CAPTCHA verification status */
    captchaVerified: boolean;
    /** Set CAPTCHA verification status */
    setCaptchaVerified: (verified: boolean) => void;
    /** Form submission handler */
    handleSubmit: (e: React.FormEvent) => void;
    /** Input change handler */
    handleInputChange: (field: keyof SignUpFormData, value: string | boolean) => void;
    /** Field blur handler */
    handleBlur: (field: keyof SignUpFormData) => void;
    /** Toggle password visibility */
    togglePasswordVisibility: () => void;
    /** Toggle confirm password visibility */
    toggleConfirmPasswordVisibility: () => void;
    /** Validate form function */
    validateForm: () => boolean;
}


export interface FormContentProps {
    variant: SignUpProps['variant'];
    type: SignUpProps['type'];
    formData: SignUpFormData;
    errors: Record<string, string>;
    showPassword: boolean;
    showConfirmPassword: boolean;
    loading: boolean;
    error?: string;
    showSocialSignUp: boolean;
    showLoginLink: boolean;
    loginText?: string;
    requireEmailConfirmation: boolean;
    captchaConfig?: SignUpProps['captchaConfig'];
    passwordStrength?: SignUpProps['passwordStrength'];
    termsConfig?: SignUpProps['termsConfig'];
    buttonStyle?: SignUpProps['buttonStyle'];
    logo?: React.ReactNode;
    onLogin?: () => void;
    onGoogleSignUp?: () => void;
    onGitHubSignUp?: () => void;
    onMicrosoftSignUp?: () => void;
    handleInputChange: (field: keyof SignUpFormData, value: string | boolean) => void;
    handleBlur: (field: keyof SignUpFormData) => void;
    togglePasswordVisibility: () => void;
    toggleConfirmPasswordVisibility: () => void;
    handleSubmit: (e: React.FormEvent) => void;
    captchaVerified: boolean;
    setCaptchaVerified: (verified: boolean) => void;
    socialLoading?: string | null;
    onSocialSignUp?: (provider: 'google' | 'github' | 'microsoft') => void;
}

export interface PasswordStrengthProps {
    password: string;
    passwordStrength?: SignUpProps['passwordStrength'];
    isDarkVariant: boolean;
}

export interface SocialSignUpProps {
    isDarkVariant: boolean;
    onGoogleSignUp?: () => void;
    onGitHubSignUp?: () => void;
    onMicrosoftSignUp?: () => void;
    socialLoading?: string | null;
    onSocialSignUp?: (provider: 'google' | 'github' | 'microsoft') => void;
}

export interface TermsCheckboxProps {
    acceptTerms: boolean;
    onChange: (value: boolean) => void;
    error?: string;
    termsConfig?: SignUpProps['termsConfig'];
    isDarkVariant: boolean;
}

export interface LeftPanelProps {
    companyName?: string;
    logo?: React.ReactNode;
    splitBackground?: SignUpProps['splitBackground'];
    leftPanelContent?: SignUpProps['leftPanelContent'];
    isDarkVariant: boolean;
}

export interface ErrorDisplayProps {
    error?: string;
    isDarkVariant: boolean;
}


export interface CaptchaProps {
    captchaConfig?: SignUpProps['captchaConfig'];
    verified: boolean;
    onVerify: (verified: boolean) => void;
    error?: string;
    isDarkVariant: boolean;
}

export interface SocialProviderConfig {
    /** Unique identifier for the provider */
    id: string;
    /** Provider type */
    provider: 'google' | 'github' | 'microsoft';
    /** Icon component for the provider */
    icon: React.ReactNode;
    /** Display label for the provider */
    label: string;
    /** Click handler for the provider */
    onClick: () => void;
    /** Loading state for the provider */
    loading: boolean;
}

export interface LeftPanelLayoutConfig {
    /** Content alignment */
    align: "left" | "center" | "right";
    /** Maximum content width */
    maxWidth: string;
    /** Whether animations are enabled */
    animate: boolean;
}

