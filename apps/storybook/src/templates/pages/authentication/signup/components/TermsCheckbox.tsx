// components/TermsCheckbox.tsx
import React from "react";
import { cn } from "../../../../../../utils/cn";
import { type TermsCheckboxProps } from "../types";

/**
 * Terms and Conditions acceptance checkbox component with configurable
 * links and custom text. Provides accessible form controls for legal agreements.
 * 
 * @component TermsCheckbox
 * @description Handles acceptance of Terms & Conditions and Privacy Policy
 * with customizable links and validation error display.
 * 
 * @param {TermsCheckboxProps} props - Component properties
 * @param {boolean} props.acceptTerms - Whether terms are accepted
 * @param {Function} props.onChange - Change handler for terms acceptance
 * @param {string} [props.error] - Error message for terms validation
 * @param {Object} [props.termsConfig] - Terms & Conditions configuration
 * @param {boolean} props.isDarkVariant - Whether dark theme is active
 * 
 * @returns {React.ReactElement} Terms acceptance checkbox component
 * 
 * @example
 * // Basic usage
 * <TermsCheckbox
 *   acceptTerms={formData.acceptTerms}
 *   onChange={(value) => setFormData({...formData, acceptTerms: value})}
 *   isDarkVariant={false}
 * />
 * 
 * @example
 * // With custom configuration
 * <TermsCheckbox
 *   acceptTerms={formData.acceptTerms}
 *   onChange={handleTermsChange}
 *   error={errors.acceptTerms}
 *   termsConfig={{
 *     onTermsClick: () => window.open('/terms', '_blank'),
 *     onPrivacyClick: () => window.open('/privacy', '_blank'),
 *     termsText: "By signing up, you agree to our Terms of Service..."
 *   }}
 *   isDarkVariant={true}
 * />
 * 
 * @note Legal requirements:
 * - Always require explicit consent for terms acceptance
 * - Provide easy access to full terms and privacy policy
 * - Consider GDPR and other privacy regulations
 * - Store acceptance records for compliance
 */
const TermsCheckbox: React.FC<TermsCheckboxProps> = ({
    acceptTerms,
    onChange,
    error,
    termsConfig,
    isDarkVariant,
}) => {
    return (
        <div className="space-y-3 pt-2">
            <label className="flex items-start gap-3 cursor-pointer group">
                <input
                    type="checkbox"
                    id="acceptTerms"
                    checked={acceptTerms}
                    onChange={(e) => onChange(e.target.checked)}
                    className={cn(
                        "w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 transition-all duration-300 mt-1 flex-shrink-0",
                        isDarkVariant && "border-gray-600 bg-gray-700 focus:ring-blue-400",
                        error && "border-red-500"
                    )}
                    aria-label="Accept terms and conditions"
                    aria-invalid={!!error}
                />
                <div className="flex-1">
                    <span className={cn(
                        "text-sm",
                        isDarkVariant
                            ? "text-gray-400 group-hover:text-gray-200"
                            : "text-gray-600 group-hover:text-gray-900"
                    )}>
                        I agree to the{" "}
                        <button
                            type="button"
                            onClick={termsConfig?.onTermsClick}
                            className={cn(
                                "font-semibold transition-colors cursor-pointer",
                                isDarkVariant
                                    ? "text-blue-400 hover:text-blue-300"
                                    : "text-blue-600 hover:text-blue-700"
                            )}
                            aria-label="Read terms and conditions"
                        >
                            Terms & Conditions
                        </button>
                        {" "}and{" "}
                        <button
                            type="button"
                            onClick={termsConfig?.onPrivacyClick}
                            className={cn(
                                "font-semibold transition-colors cursor-pointer",
                                isDarkVariant
                                    ? "text-blue-400 hover:text-blue-300"
                                    : "text-blue-600 hover:text-blue-700"
                            )}
                            aria-label="Read privacy policy"
                        >
                            Privacy Policy
                        </button>
                    </span>
                    {termsConfig?.termsText && (
                        <div className="text-xs mt-1 opacity-75">
                            {termsConfig.termsText}
                        </div>
                    )}
                </div>
            </label>
            {error && (
                <p className="text-xs font-medium text-red-500">
                    {error}
                </p>
            )}
        </div>
    );
};

export { TermsCheckbox };