// hooks/useSignUpForm.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useSignUpForm } from "../../hooks/useSignUpForm";
import type { UseSignUpFormProps } from "../../types";

describe("useSignUpForm Hook", () => {
    const mockOnSubmit = vi.fn();
    const defaultProps: UseSignUpFormProps = {
        onSubmit: mockOnSubmit
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("initializes with default values", () => {
        const { result } = renderHook(() => useSignUpForm(defaultProps));

        expect(result.current.formData).toEqual({
            firstName: '',
            lastName: '',
            email: '',
            confirmEmail: '',
            password: '',
            confirmPassword: '',
            acceptTerms: false,
            captchaToken: ''
        });

        expect(result.current.showPassword).toBe(false);
        expect(result.current.showConfirmPassword).toBe(false);
        expect(result.current.errors).toEqual({});
        expect(result.current.touched).toEqual({});
        expect(result.current.captchaVerified).toBe(false);
    });

    it("handles input changes", () => {
        const { result } = renderHook(() => useSignUpForm(defaultProps));

        act(() => {
            result.current.handleInputChange('firstName', 'John');
        });

        expect(result.current.formData.firstName).toBe('John');

        act(() => {
            result.current.handleInputChange('email', 'john@example.com');
        });

        expect(result.current.formData.email).toBe('john@example.com');

        act(() => {
            result.current.handleInputChange('acceptTerms', true);
        });

        expect(result.current.formData.acceptTerms).toBe(true);
    });

    it("toggles password visibility", () => {
        const { result } = renderHook(() => useSignUpForm(defaultProps));

        expect(result.current.showPassword).toBe(false);

        act(() => {
            result.current.togglePasswordVisibility();
        });

        expect(result.current.showPassword).toBe(true);

        act(() => {
            result.current.togglePasswordVisibility();
        });

        expect(result.current.showPassword).toBe(false);
    });

    it("toggles confirm password visibility", () => {
        const { result } = renderHook(() => useSignUpForm(defaultProps));

        expect(result.current.showConfirmPassword).toBe(false);

        act(() => {
            result.current.toggleConfirmPasswordVisibility();
        });

        expect(result.current.showConfirmPassword).toBe(true);

        act(() => {
            result.current.toggleConfirmPasswordVisibility();
        });

        expect(result.current.showConfirmPassword).toBe(false);
    });

    it("validates required fields", () => {
        const { result } = renderHook(() => useSignUpForm(defaultProps));

        act(() => {
            result.current.validateForm();
        });

        expect(result.current.errors).toEqual({
            firstName: 'First name is required',
            lastName: 'Last name is required',
            email: 'Email is required',
            password: 'Password is required',
            acceptTerms: 'You must accept the terms and conditions'
        });
    });

    it("validates email format", () => {
        const { result } = renderHook(() => useSignUpForm(defaultProps));

        act(() => {
            result.current.handleInputChange('email', 'invalid-email');
        });

        act(() => {
            result.current.validateForm();
        });

        expect(result.current.errors.email).toBe('Please enter a valid email');
    });

    it("validates password minimum length", () => {
        const { result } = renderHook(() => useSignUpForm(defaultProps));

        act(() => {
            result.current.handleInputChange('password', 'short');
        });

        act(() => {
            result.current.validateForm();
        });

        expect(result.current.errors.password).toBe('Password must be at least 8 characters');
    });

    it("validates with custom password strength config", () => {
        const props: UseSignUpFormProps = {
            ...defaultProps,
            passwordStrength: {
                minLength: 10,
                requireUppercase: true,
                requireNumbers: true
            }
        };

        const { result } = renderHook(() => useSignUpForm(props));

        act(() => {
            result.current.handleInputChange('password', 'lowercase');
        });

        act(() => {
            result.current.validateForm();
        });

        expect(result.current.errors.password).toBe('Password must be at least 10 characters');
    });

    it("validates email confirmation when required", () => {
        const props: UseSignUpFormProps = {
            ...defaultProps,
            requireEmailConfirmation: true
        };

        const { result } = renderHook(() => useSignUpForm(props));

        act(() => {
            result.current.handleInputChange('email', 'john@example.com');
            result.current.handleInputChange('confirmEmail', 'different@example.com');
        });

        act(() => {
            result.current.validateForm();
        });

        expect(result.current.errors.confirmEmail).toBe('Emails do not match');
    });

    it("does not validate email confirmation when not required", () => {
        const props: UseSignUpFormProps = {
            ...defaultProps,
            requireEmailConfirmation: false
        };

        const { result } = renderHook(() => useSignUpForm(props));

        act(() => {
            result.current.handleInputChange('email', 'john@example.com');
            result.current.handleInputChange('confirmEmail', 'different@example.com');
        });

        act(() => {
            result.current.validateForm();
        });

        expect(result.current.errors.confirmEmail).toBeUndefined();
    });

    it("validates CAPTCHA when enabled", () => {
        const props: UseSignUpFormProps = {
            ...defaultProps,
            captchaConfig: {
                enabled: true
            }
        };

        const { result } = renderHook(() => useSignUpForm(props));

        act(() => {
            result.current.validateForm();
        });

        expect(result.current.errors.captcha).toBe('Please complete the CAPTCHA verification');
    });

    it("clears errors on input change", () => {
        const { result } = renderHook(() => useSignUpForm(defaultProps));

        act(() => {
            result.current.validateForm();
        });

        expect(result.current.errors.firstName).toBe('First name is required');

        act(() => {
            result.current.handleInputChange('firstName', 'John');
        });

        expect(result.current.errors.firstName).toBeUndefined();
    });

    it("marks fields as touched on blur", () => {
        const { result } = renderHook(() => useSignUpForm(defaultProps));

        act(() => {
            result.current.handleBlur('email');
        });

        expect(result.current.touched.email).toBe(true);
    });

    it("calls onSubmit when form is valid", async () => {
        const { result } = renderHook(() => useSignUpForm(defaultProps));

        const event = {
            preventDefault: vi.fn()
        } as unknown as React.FormEvent;

        act(() => {
            // Fill valid form data
            result.current.handleInputChange('firstName', 'John');
            result.current.handleInputChange('lastName', 'Doe');
            result.current.handleInputChange('email', 'john@example.com');
            result.current.handleInputChange('confirmEmail', 'john@example.com');
            result.current.handleInputChange('password', 'Password123!');
            result.current.handleInputChange('confirmPassword', 'Password123!');
            result.current.handleInputChange('acceptTerms', true);
        });

        act(() => {
            result.current.handleSubmit(event);
        });

        await waitFor(() => {
            expect(event.preventDefault).toHaveBeenCalled();
            expect(mockOnSubmit).toHaveBeenCalledWith({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                confirmEmail: 'john@example.com',
                password: 'Password123!',
                confirmPassword: 'Password123!',
                acceptTerms: true,
                captchaToken: ''
            });
        });
    });

    it("does not call onSubmit when form is invalid", () => {
        const { result } = renderHook(() => useSignUpForm(defaultProps));

        const event = {
            preventDefault: vi.fn()
        } as unknown as React.FormEvent;

        act(() => {
            result.current.handleSubmit(event);
        });

        expect(event.preventDefault).toHaveBeenCalled();
        expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it("marks all fields as touched on submit", () => {
        const { result } = renderHook(() => useSignUpForm(defaultProps));

        const event = {
            preventDefault: vi.fn()
        } as unknown as React.FormEvent;

        act(() => {
            result.current.handleSubmit(event);
        });

        expect(result.current.touched).toEqual({
            firstName: true,
            lastName: true,
            email: true,
            confirmEmail: true,
            password: true,
            confirmPassword: true,
            acceptTerms: true,
            captchaToken: true
        });
    });

    it("handles setCaptchaVerified", () => {
        const { result } = renderHook(() => useSignUpForm(defaultProps));

        act(() => {
            result.current.setCaptchaVerified(true);
        });

        expect(result.current.captchaVerified).toBe(true);

        act(() => {
            result.current.setCaptchaVerified(false);
        });

        expect(result.current.captchaVerified).toBe(false);
    });
});