// hooks/useSignUpForm.ts
import { useState, useCallback } from "react";
import { type SignUpFormData,type  ValidationErrors,type TouchedFields, type UseSignUpFormProps, type UseSignUpFormReturn } from "../types";


/**
 * Custom React hook for managing SignUp form state and validation
 * @function useSignUpForm
 * @param {UseSignUpFormProps} props - Hook configuration options
 * @returns {UseSignUpFormReturn} Form state and handlers
 * 
 * @example
 * const {
 *   formData,
 *   errors,
 *   handleSubmit,
 *   handleInputChange
 * } = useSignUpForm({
 *   requireEmailConfirmation: true,
 *   passwordStrength: { minLength: 8 },
 *   onSubmit: (data) => console.log(data)
 * });
 */
export const useSignUpForm = ({
    requireEmailConfirmation = true,
    passwordStrength,
    captchaConfig,
    onSubmit
}: UseSignUpFormProps): UseSignUpFormReturn => {
    const [formData, setFormData] = useState<SignUpFormData>({
        firstName: '',
        lastName: '',
        email: '',
        confirmEmail: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false,
        captchaToken: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [touched, setTouched] = useState<TouchedFields>({});
    const [captchaVerified, setCaptchaVerified] = useState(false);

    const validateForm = useCallback((): boolean => {
        const newErrors: ValidationErrors = {};

        // First Name validation
        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        } else if (formData.firstName.length < 2) {
            newErrors.firstName = 'First name must be at least 2 characters';
        }

        // Last Name validation
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        } else if (formData.lastName.length < 2) {
            newErrors.lastName = 'Last name must be at least 2 characters';
        }

        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        // Confirm Email validation (only if required)
        if (requireEmailConfirmation && formData.email !== formData.confirmEmail) {
            newErrors.confirmEmail = 'Emails do not match';
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < (passwordStrength?.minLength || 8)) {
            newErrors.password = `Password must be at least ${passwordStrength?.minLength || 8} characters`;
        } else if (passwordStrength?.requireUppercase && !/[A-Z]/.test(formData.password)) {
            newErrors.password = 'Password must contain at least one uppercase letter';
        } else if (passwordStrength?.requireLowercase && !/[a-z]/.test(formData.password)) {
            newErrors.password = 'Password must contain at least one lowercase letter';
        } else if (passwordStrength?.requireNumbers && !/\d/.test(formData.password)) {
            newErrors.password = 'Password must contain at least one number';
        } else if (passwordStrength?.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
            newErrors.password = 'Password must contain at least one special character';
        }

        // Confirm Password validation
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        // Terms acceptance validation
        if (!formData.acceptTerms) {
            newErrors.acceptTerms = 'You must accept the terms and conditions';
        }

        // CAPTCHA validation if enabled
        if (captchaConfig?.enabled && !captchaVerified) {
            newErrors.captcha = 'Please complete the CAPTCHA verification';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData, requireEmailConfirmation, passwordStrength, captchaConfig, captchaVerified]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Mark all fields as touched for validation
        const allTouched: TouchedFields = {};
        Object.keys(formData).forEach(key => {
            allTouched[key] = true;
        });
        setTouched(allTouched);

        if (!validateForm()) return;

        if (onSubmit) {
            onSubmit(formData);
        }
    };

    const handleInputChange = (field: keyof SignUpFormData, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleBlur = useCallback((field: keyof SignUpFormData) => {
        setTouched(prev => ({ ...prev, [field]: true }));

        // Validate specific field on blur
        const newErrors = { ...errors };

        switch (field) {
            case 'email':
                if (!formData.email.trim()) {
                    newErrors.email = 'Email is required';
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                    newErrors.email = 'Please enter a valid email';
                } else {
                    delete newErrors.email;
                }
                break;

            case 'confirmEmail':
                if (formData.email !== formData.confirmEmail) {
                    newErrors.confirmEmail = 'Emails do not match';
                } else {
                    delete newErrors.confirmEmail;
                }
                break;

            case 'password':
                if (!formData.password) {
                    newErrors.password = 'Password is required';
                } else if (formData.password.length < (passwordStrength?.minLength || 8)) {
                    newErrors.password = `Password must be at least ${passwordStrength?.minLength || 8} characters`;
                } else {
                    delete newErrors.password;
                }
                break;

            case 'confirmPassword':
                if (formData.password !== formData.confirmPassword) {
                    newErrors.confirmPassword = 'Passwords do not match';
                } else {
                    delete newErrors.confirmPassword;
                }
                break;
        }

        setErrors(newErrors);
    }, [errors, formData, passwordStrength]);

    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

    return {
        formData,
        showPassword,
        showConfirmPassword,
        errors,
        touched,
        captchaVerified,
        setCaptchaVerified,
        handleSubmit,
        handleInputChange,
        handleBlur,
        togglePasswordVisibility,
        toggleConfirmPasswordVisibility,
        validateForm,
    };
};