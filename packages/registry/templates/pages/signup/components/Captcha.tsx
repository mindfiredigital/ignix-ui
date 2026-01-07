// components/Captcha.tsx
import React from "react";
import { cn } from "../../../../utils/cn";
import { Shield } from "lucide-react";
import { type CaptchaProps } from "../types";


/**
 * CAPTCHA verification component that provides security verification
 * for form submissions. This is a placeholder implementation that should
 * be integrated with a real CAPTCHA service like reCAPTCHA or hCaptcha.
 * 
 * @component Captcha
 * @description Provides security verification to prevent automated form submissions.
 * In production, this should be replaced with actual CAPTCHA service integration.
 * 
 * @param {CaptchaProps} props - Component properties
 * @param {Object} [props.captchaConfig] - CAPTCHA configuration options
 * @param {boolean} props.verified - Whether CAPTCHA is verified
 * @param {Function} props.onVerify - Handler for CAPTCHA verification
 * @param {string} [props.error] - Error message for CAPTCHA validation
 * @param {boolean} props.isDarkVariant - Whether dark theme is active
 * 
 * @returns {React.ReactElement | null} CAPTCHA component or null if disabled
 * 
 * @example
 * // Basic usage
 * <Captcha
 *   verified={captchaVerified}
 *   onVerify={setCaptchaVerified}
 *   isDarkVariant={false}
 * />
 * 
 * @example
 * // With configuration
 * <Captcha
 *   captchaConfig={{
 *     enabled: true,
 *     siteKey: "your-site-key",
 *     type: "checkbox"
 *   }}
 *   verified={captchaVerified}
 *   onVerify={setCaptchaVerified}
 *   error={errors.captcha}
 *   isDarkVariant={true}
 * />
 * 
 * @note This is a placeholder implementation. In production, integrate with:
 * - Google reCAPTCHA: https://developers.google.com/recaptcha
 * - hCaptcha: https://www.hcaptcha.com/
 * - Cloudflare Turnstile: https://www.cloudflare.com/products/turnstile/
 */
const Captcha: React.FC<CaptchaProps> = ({
    captchaConfig,
    verified,
    onVerify,
    error,
    isDarkVariant,
}) => {

    // Don't render if CAPTCHA is not enabled
    if (!captchaConfig?.enabled) return null;

    return (
        <div className="space-y-2">
            <div className={cn(
                "p-4 rounded-lg border",
                isDarkVariant
                    ? "bg-gray-800/50 border-gray-700"
                    : "bg-gray-50 border-gray-200"
            )}>
                <div className="flex items-center gap-2 mb-3">
                    <Shield className={cn(
                        "w-5 h-5",
                        isDarkVariant ? "text-gray-400" : "text-gray-500"
                    )} />
                    <span className={cn(
                        "text-sm font-semibold",
                        isDarkVariant ? "text-gray-300" : "text-gray-700"
                    )}>
                        Security Verification
                    </span>
                </div>
                <div className="flex justify-center">
                    <div className={cn(
                        "p-4 rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-3",
                        isDarkVariant
                            ? "border-gray-700 bg-gray-900/50"
                            : "border-gray-300 bg-white"
                    )}>
                        <div className="text-center">
                            <div className={cn(
                                "text-sm mb-2",
                                isDarkVariant ? "text-gray-400" : "text-gray-600"
                            )}>
                                {verified ? "✓ Verified" : "Complete the CAPTCHA"}
                            </div>
                            <button
                                type="button"
                                onClick={() => onVerify(!verified)}
                                className={cn(
                                    "px-4 py-2 rounded-md text-sm font-medium transition-all duration-300",
                                    verified
                                        ? "bg-green-100 text-green-700 border border-green-200"
                                        : "bg-blue-100 text-blue-700 border border-blue-200 hover:bg-blue-200"
                                )}
                            >
                                {verified ? "Verified ✓" : "Click to Verify"}
                            </button>
                        </div>
                        <div className={cn(
                            "text-xs text-center",
                            isDarkVariant ? "text-gray-500" : "text-gray-500"
                        )}>
                            This helps prevent spam
                        </div>
                    </div>
                </div>
            </div>
            {error && (
                <p className="text-xs font-medium text-red-500">
                    {error}
                </p>
            )}
        </div>
    );
};

export { Captcha };