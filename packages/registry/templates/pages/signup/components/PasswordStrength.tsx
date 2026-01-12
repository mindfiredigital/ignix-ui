// components/PasswordStrength.tsx
import React from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { cn } from "../../../../utils/cn";
import { checkPasswordStrength } from "../utils";
import { type PasswordStrengthProps } from "../types";



/**
 * Visual password strength indicator component that displays
 * password requirements and strength level.
 * 
 * @component PasswordStrength
 * @description Shows a visual indicator of password strength
 * including a strength bar and individual requirement checks.
 * 
 * @param {PasswordStrengthProps} props - Component properties
 * @param {string} props.password - Current password value
 * @param {Object} [props.passwordStrength] - Password strength configuration
 * @param {boolean} props.isDarkVariant - Whether dark theme is active
 * 
 * @returns {React.ReactElement | null} Password strength indicator or null if not shown
 * 
 * @example
 * <PasswordStrength
 *   password="MyPassword123!"
 *   passwordStrength={{ showStrengthMeter: true }}
 *   isDarkVariant={false}
 * />
 */
const PasswordStrength: React.FC<PasswordStrengthProps> = ({
    password,
    passwordStrength,
    // isDarkVariant,
}) => {
    if (!passwordStrength?.showStrengthMeter || !password) return null;

    const { strength, score, checks } = checkPasswordStrength(password, passwordStrength);

    const strengthColors = {
        weak: {
            bg: "bg-red-500",
            text: "text-red-500",
            border: "border-red-500",
        },
        medium: {
            bg: "bg-yellow-500",
            text: "text-yellow-500",
            border: "border-yellow-500",
        },
        strong: {
            bg: "bg-green-500",
            text: "text-green-500",
            border: "border-green-500",
        },
    };

    const strengthLabels = passwordStrength?.strengthLabels || {
        weak: "Weak",
        medium: "Medium",
        strong: "Strong",
    };

    const currentStrength = strengthColors[strength];

    return (
        <div className="mt-2 space-y-2">
            <div className="flex items-center justify-between">
                <span className={cn("text-sm font-medium", currentStrength.text)}>
                    Password strength: {strengthLabels[strength]}
                </span>
                <span className="text-xs text-gray-500">{Math.round(score)}%</span>
            </div>

            {/* Strength bar */}
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                    className={cn("h-full transition-all duration-300", currentStrength.bg)}
                    style={{ width: `${score}%` }}
                />
            </div>

            {/* Password requirements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                {checks.map((check, index) => (
                    <div key={index} className="flex items-center gap-2">
                        {check.passed ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                            <XCircle className="w-4 h-4 text-gray-400" />
                        )}
                        <span className={cn(
                            "text-xs",
                            check.passed
                                ? "text-green-600 dark:text-green-400"
                                : "text-gray-500 dark:text-gray-400"
                        )}>
                            {check.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export { PasswordStrength };