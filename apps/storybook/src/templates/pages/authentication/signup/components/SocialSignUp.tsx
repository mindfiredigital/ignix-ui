// components/SocialSignUp.tsx
import React from "react";
import { cn } from "../../../../../../utils/cn";
import { Loader2 } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaMicrosoft } from "react-icons/fa";
import type { SocialProviderConfig, SocialSignUpProps } from "../types";

/**
 * Social authentication component that provides buttons for signing up
 * with third-party providers like Google, GitHub, and Microsoft.
 * 
 * @component SocialSignUp
 * @description Renders social authentication buttons with loading states
 * and proper accessibility attributes. Supports Google, GitHub, and Microsoft OAuth.
 * 
 * @param {SocialSignUpProps} props - Component properties
 * @param {boolean} props.isDarkVariant - Whether dark theme is active
 * @param {Function} [props.onGoogleSignUp] - Google sign-up handler
 * @param {Function} [props.onGitHubSignUp] - GitHub sign-up handler
 * @param {Function} [props.onMicrosoftSignUp] - Microsoft sign-up handler
 * @param {string} [props.socialLoading] - Current loading provider
 * @param {Function} [props.onSocialSignUp] - Unified social sign-up handler
 * 
 * @returns {React.ReactElement} Social sign-up buttons component
 * 
 * @example
 * // Basic usage with individual handlers
 * <SocialSignUp
 *   isDarkVariant={false}
 *   onGoogleSignUp={handleGoogleSignUp}
 *   onGitHubSignUp={handleGitHubSignUp}
 *   onMicrosoftSignUp={handleMicrosoftSignUp}
 * />
 * 
 * @example
 * // Using unified handler
 * <SocialSignUp
 *   isDarkVariant={true}
 *   onSocialSignUp={(provider) => handleSocialSignUp(provider)}
 *   socialLoading={socialLoading}
 * />
 * 
 * @note For production use, you'll need to:
 * 1. Set up OAuth applications with each provider
 * 2. Implement proper authentication flows
 * 3. Handle errors and loading states
 * 4. Comply with each provider's terms of service
 */
const SocialSignUp: React.FC<SocialSignUpProps> = ({
    isDarkVariant,
    onGoogleSignUp,
    onGitHubSignUp,
    onMicrosoftSignUp,
    socialLoading,
    onSocialSignUp,
}) => {
    const socialButtons: SocialProviderConfig[] = [
        {
            id: 'google',
            provider: 'google' as const,
            icon: <FcGoogle className="w-5 h-5" />,
            label: 'Google',
            onClick: () => onSocialSignUp ? onSocialSignUp('google') : onGoogleSignUp?.(),
            loading: socialLoading === 'google',
        },
        {
            id: 'github',
            provider: 'github' as const,
            icon: <FaGithub className="w-5 h-5" />,
            label: 'GitHub',
            onClick: () => onSocialSignUp ? onSocialSignUp('github') : onGitHubSignUp?.(),
            loading: socialLoading === 'github',
        },
        {
            id: 'microsoft',
            provider: 'microsoft' as const,
            icon: <FaMicrosoft className="w-5 h-5 text-[#00A4EF]" />,
            label: 'Microsoft',
            onClick: () => onSocialSignUp ? onSocialSignUp('microsoft') : onMicrosoftSignUp?.(),
            loading: socialLoading === 'microsoft',
        },
    ];

    return (
        <div className="space-y-4">
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className={cn(
                        "w-full border-t",
                        isDarkVariant ? "border-gray-700" : "border-gray-300"
                    )}></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className={cn(
                        "px-3 text-xs font-semibold uppercase tracking-wider",
                        isDarkVariant
                            ? "bg-gray-800 text-gray-400"
                            : "bg-white text-gray-500"
                    )}>
                        Or sign up with
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
                {socialButtons.map((social) => (
                    <button
                        key={social.id}
                        type="button"
                        className={cn(
                            "w-full inline-flex justify-center items-center py-2.5 px-4 border rounded-lg text-sm font-medium transition-all duration-300",
                            "hover:shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50",
                            "bg-white border-gray-300 hover:bg-gray-50 cursor-pointer",
                            social.loading && "opacity-50 cursor-wait"
                        )}
                        onClick={social.onClick}
                        disabled={social.loading}
                        aria-label={`Sign up with ${social.label}`}
                    >
                        {social.loading ? (
                            <Loader2 className="animate-spin w-5 h-5" />
                        ) : (
                            social.icon
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

export { SocialSignUp };