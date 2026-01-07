// types.test.ts
import { describe, it, expect, vi } from "vitest";
import type {
    PasswordStrength,
    SocialProvider,
    SignUpVariant,
    SignUpType,
    SignUpFormData,
    SignUpProps,
    ValidationErrors,
    TouchedFields,
    FormContentProps,
    SocialProviderConfig,
    LeftPanelLayoutConfig
} from "../types";

describe("Type Definitions", () => {
    describe("Basic Types", () => {
        it("defines PasswordStrength type correctly", () => {
            const weak: PasswordStrength = 'weak';
            const medium: PasswordStrength = 'medium';
            const strong: PasswordStrength = 'strong';

            expect(weak).toBe('weak');
            expect(medium).toBe('medium');
            expect(strong).toBe('strong');
        });

        it("defines SocialProvider type correctly", () => {
            const google: SocialProvider = 'google';
            const github: SocialProvider = 'github';
            const microsoft: SocialProvider = 'microsoft';

            expect(google).toBe('google');
            expect(github).toBe('github');
            expect(microsoft).toBe('microsoft');
        });

        it("defines SignUpVariant type correctly", () => {
            const defaultVariant: SignUpVariant = 'default';
            const modern: SignUpVariant = 'modern';
            const glass: SignUpVariant = 'glass';
            const dark: SignUpVariant = 'dark';

            expect(defaultVariant).toBe('default');
            expect(modern).toBe('modern');
            expect(glass).toBe('glass');
            expect(dark).toBe('dark');
        });

        it("defines SignUpType type correctly", () => {
            const centered: SignUpType = 'centered';
            const split: SignUpType = 'split';

            expect(centered).toBe('centered');
            expect(split).toBe('split');
        });
    });

    describe("SignUpFormData Interface", () => {
        it("has all required properties", () => {
            const formData: SignUpFormData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                confirmEmail: 'john@example.com',
                password: 'Password123!',
                confirmPassword: 'Password123!',
                acceptTerms: true,
                captchaToken: 'abc123'
            };

            expect(formData.firstName).toBe('John');
            expect(formData.lastName).toBe('Doe');
            expect(formData.email).toBe('john@example.com');
            expect(formData.password).toBe('Password123!');
            expect(formData.acceptTerms).toBe(true);
            expect(formData.captchaToken).toBe('abc123');
        });

        it("makes captchaToken optional", () => {
            const formData: SignUpFormData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                confirmEmail: 'john@example.com',
                password: 'Password123!',
                confirmPassword: 'Password123!',
                acceptTerms: true
                // captchaToken is optional
            };

            expect(formData.captchaToken).toBeUndefined();
        });
    });

    describe("SignUpProps Interface", () => {
        it("has all optional properties", () => {
            const props: SignUpProps = {
                type: 'centered',
                variant: 'default',
                companyName: 'Test Corp',
                requireEmailConfirmation: true,
                onSubmit: vi.fn(),
                onLogin: vi.fn(),
                onGoogleSignUp: vi.fn(),
                onGitHubSignUp: vi.fn(),
                onMicrosoftSignUp: vi.fn(),
                loginText: 'Already registered?',
                loading: false,
                error: '',
                showSocialSignUp: true,
                showLoginLink: true,
                className: 'custom-class',
                termsConfig: {
                    termsUrl: '/terms',
                    privacyUrl: '/privacy'
                },
                passwordStrength: {
                    minLength: 10,
                    showStrengthMeter: true
                },
                captchaConfig: {
                    enabled: true,
                    siteKey: 'test-key'
                },
                splitBackground: {
                    gradient: 'bg-gradient-to-r from-blue-500 to-purple-500'
                },
                buttonStyle: {
                    className: 'custom-button'
                },
                leftPanelContent: {
                    title: 'Welcome',
                    features: [{ text: 'Feature 1' }]
                }
            };

            expect(props.type).toBe('centered');
            expect(props.companyName).toBe('Test Corp');
            expect(props.requireEmailConfirmation).toBe(true);
            expect(props.loading).toBe(false);
            expect(props.showSocialSignUp).toBe(true);
            expect(props.termsConfig?.termsUrl).toBe('/terms');
            expect(props.passwordStrength?.minLength).toBe(10);
            expect(props.captchaConfig?.enabled).toBe(true);
            expect(props.buttonStyle?.className).toBe('custom-button');
        });
    });

    describe("FormContentProps Interface", () => {
        it("has all required properties", () => {
            const props: FormContentProps = {
                variant: 'default',
                type: 'centered',
                formData: {
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john@example.com',
                    confirmEmail: 'john@example.com',
                    password: 'Password123!',
                    confirmPassword: 'Password123!',
                    acceptTerms: true
                },
                errors: {},
                showPassword: false,
                showConfirmPassword: false,
                loading: false,
                showSocialSignUp: true,
                showLoginLink: true,
                requireEmailConfirmation: true,
                captchaVerified: false,
                setCaptchaVerified: vi.fn(),
                handleInputChange: vi.fn(),
                handleBlur: vi.fn(),
                togglePasswordVisibility: vi.fn(),
                toggleConfirmPasswordVisibility: vi.fn(),
                handleSubmit: vi.fn(),
                isDarkVariant: false
            };

            expect(props.variant).toBe('default');
            expect(props.type).toBe('centered');
            expect(props.formData.firstName).toBe('John');
            expect(props.showSocialSignUp).toBe(true);
            expect(props.captchaVerified).toBe(false);
        });
    });

    describe("Other Interfaces", () => {
        it("defines ValidationErrors correctly", () => {
            const errors: ValidationErrors = {
                email: 'Email is required',
                password: 'Password must be at least 8 characters'
            };

            expect(errors.email).toBe('Email is required');
            expect(errors.password).toBe('Password must be at least 8 characters');
        });

        it("defines TouchedFields correctly", () => {
            const touched: TouchedFields = {
                email: true,
                password: false
            };

            expect(touched.email).toBe(true);
            expect(touched.password).toBe(false);
        });

        it("defines SocialProviderConfig correctly", () => {
            const config: SocialProviderConfig = {
                id: 'google',
                provider: 'google',
                icon: <div />,
                label: 'Google',
                onClick: vi.fn(),
                loading: false
            };

            expect(config.id).toBe('google');
            expect(config.provider).toBe('google');
            expect(config.label).toBe('Google');
            expect(config.loading).toBe(false);
        });

        it("defines LeftPanelLayoutConfig correctly", () => {
            const config: LeftPanelLayoutConfig = {
                align: 'center',
                maxWidth: 'max-w-2xl',
                animate: true
            };

            expect(config.align).toBe('center');
            expect(config.maxWidth).toBe('max-w-2xl');
            expect(config.animate).toBe(true);
        });
    });
});