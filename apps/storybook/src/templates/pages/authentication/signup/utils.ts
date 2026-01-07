// utils.ts
import { type PasswordStrength } from "./types";

/**
 * Checks the strength of a password based on configurable criteria
 * @function checkPasswordStrength
 * @param {string} password - The password to check
 * @param {Object} [config] - Configuration options for password validation
 * @param {number} [config.minLength=8] - Minimum password length
 * @param {boolean} [config.requireUppercase] - Require uppercase letters
 * @param {boolean} [config.requireLowercase] - Require lowercase letters
 * @param {boolean} [config.requireNumbers] - Require numbers
 * @param {boolean} [config.requireSpecialChars] - Require special characters
 * @returns {Object} Password strength assessment
 * @returns {PasswordStrength} result.strength - Strength level (weak/medium/strong)
 * @returns {number} result.score - Numerical score (0-100)
 * @returns {Array<{label: string, passed: boolean}>} result.checks - Individual requirement checks
 * 
 * @example
 * const result = checkPasswordStrength('Password123!', { minLength: 8 });
 * console.log(result.strength); // 'strong'
 * console.log(result.score); // 100
 */
export const checkPasswordStrength = (
    password: string,
    config?: {
        minLength?: number;
        requireUppercase?: boolean;
        requireLowercase?: boolean;
        requireNumbers?: boolean;
        requireSpecialChars?: boolean;
    }
): { strength: PasswordStrength; score: number; checks: Array<{ label: string; passed: boolean }> } => {
    const minLength = config?.minLength || 8;
    const checks: Array<{ label: string; passed: boolean; weight: number }> = [
        { label: `At least ${minLength} characters`, passed: password.length >= minLength, weight: 1 },
        { label: "Contains uppercase letter", passed: /[A-Z]/.test(password), weight: 0.5 },
        { label: "Contains lowercase letter", passed: /[a-z]/.test(password), weight: 0.5 },
        { label: "Contains number", passed: /\d/.test(password), weight: 0.5 },
        { label: "Contains special character", passed: /[!@#$%^&*(),.?":{}|<>]/.test(password), weight: 0.5 },
    ];

    // Filter checks based on config
    const filteredChecks = checks.filter((check, index) => {
        if (index === 0) return true; // Always check length
        if (index === 1 && config?.requireUppercase === false) return false;
        if (index === 2 && config?.requireLowercase === false) return false;
        if (index === 3 && config?.requireNumbers === false) return false;
        if (index === 4 && config?.requireSpecialChars === false) return false;
        return true;
    });

    const passedChecks = filteredChecks.filter(check => check.passed);
    const totalWeight = filteredChecks.reduce((sum, check) => sum + check.weight, 0);
    const passedWeight = passedChecks.reduce((sum, check) => sum + check.weight, 0);
    const score = totalWeight > 0 ? (passedWeight / totalWeight) * 100 : 0;

    let strength: PasswordStrength = 'weak';
    if (score >= 80) strength = 'strong';
    else if (score >= 50) strength = 'medium';

    return {
        strength,
        score,
        checks: filteredChecks.map(check => ({ label: check.label, passed: check.passed }))
    };
};

/**
 * Generates CSS classes for input fields based on variant and error state
 * @function getInputClasses
 * @param {SignUpVariant} variant - Visual theme variant
 * @param {boolean} hasError - Whether the input has validation errors
 * @returns {string} Combined CSS classes for the input field
 * 
 * @example
 * const classes = getInputClasses('dark', true);
 * // Returns: "w-full px-4 py-3 rounded-lg border transition-all duration-300 placeholder-gray-400 focus:ring-2 focus:border-transparent bg-gray-700 text-white border-gray-600 focus:ring-blue-500 border-red-500"
 */
export const getInputClasses = (
    variant: 'default' | 'modern' | 'glass' | 'dark',
    hasError: boolean
): string => {
    const baseStyles = "w-full px-4 py-3 rounded-lg border transition-all duration-300 placeholder-gray-400 focus:ring-2 focus:border-transparent";

    const variantStyles = {
        default: `bg-white text-gray-900 border-gray-300 focus:ring-blue-500 ${hasError ? "border-red-500" : ""}`,
        modern: `bg-white/80 backdrop-blur-sm text-gray-900 border-slate-200 focus:ring-blue-500 ${hasError ? "border-red-500" : ""}`,
        glass: `bg-white/5 backdrop-blur-md text-white border-white/10 focus:ring-blue-400 ${hasError ? "border-red-400" : ""}`,
        // dark: `bg-gray-700/50 text-white border-gray-600 focus:ring-emerald-500/20 focus:border-emerald-500 placeholder:text-gray-400 ${hasError ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" : ""}`
        dark: `bg-white text-wblack border-gray-600 focus:ring-emerald-500/20 focus:border-emerald-500 placeholder:text-gray-400 ${hasError ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" : ""}`
    };

    return `${baseStyles} ${variantStyles[variant] || variantStyles.default}`;
};