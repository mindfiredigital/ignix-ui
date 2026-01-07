// components/ErrorDisplay.tsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../../../utils/cn";
import { AlertCircle } from "lucide-react";
import type { ErrorDisplayProps } from "../types";

/**
 * Animated error display component for showing form validation errors
 * or API error messages with smooth transitions.
 * 
 * @component ErrorDisplay
 * @description Displays error messages with appropriate styling and animations.
 * Uses Framer Motion for smooth enter/exit animations and provides
 * accessible error messaging.
 * 
 * @param {ErrorDisplayProps} props - Component properties
 * @param {string} [props.error] - Error message to display
 * @param {boolean} props.isDarkVariant - Whether dark theme is active
 * 
 * @returns {React.ReactElement | null} Error display component or null if no error
 * 
 * @example
 * <ErrorDisplay 
 *   error="Invalid email address"
 *   isDarkVariant={true}
 * />
 * 
 * @example
 * // With conditional rendering
 * {apiError && <ErrorDisplay error={apiError} isDarkVariant={isDarkVariant} />}
 */
const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, isDarkVariant }) => {
    if (!error) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className={cn(
                    "mb-6 p-4 rounded-lg border flex items-start",
                    isDarkVariant
                        ? "bg-red-900/20 border-red-800"
                        : "bg-red-50 border-red-200"
                )}
            >
                <AlertCircle className={cn(
                    "w-5 h-5 mr-2 mt-0.5 flex-shrink-0",
                    isDarkVariant ? "text-red-400" : "text-red-600"
                )} />
                <span className={cn(
                    "text-sm font-medium",
                    isDarkVariant ? "text-red-300" : "text-red-700"
                )}>
                    {error}
                </span>
            </motion.div>
        </AnimatePresence>
    );
};

export { ErrorDisplay };