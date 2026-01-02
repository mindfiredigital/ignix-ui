import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { cn } from '../../../../utils/cn';
import { Typography } from '../../typography';
import { COLOR_PALETTE } from '../constants';
import type { ValidationErrorsProps } from '../types';


/**
 * ValidationErrors component displays file upload validation errors in a styled container
 * with smooth animations for entry and exit.
 * 
 * @component
 * @param {ValidationErrorsProps} props - Component props
 * @param {string[]} props.errors - Array of error messages to display
 * 
 * @returns {JSX.Element | null} Error display component or null if no errors
 * 
 * @example
 * ```tsx
 * <ValidationErrors errors={validationErrors} />
 * ```
 * 
 * @remarks
 * This component uses Framer Motion for smooth height and opacity transitions.
 * It automatically hides itself when the errors array is empty.
 */
const ValidationErrors: React.FC<ValidationErrorsProps> = ({ errors }) => {
    if (errors.length === 0) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={cn(
                    "rounded-xl p-5",
                    COLOR_PALETTE.error.bg,
                    COLOR_PALETTE.error.border,
                    "border"
                )}
            >
                <div className="flex items-start gap-3">
                    <AlertCircle className="w-6 h-6 text-rose-500 flex-shrink-0 mt-0.5" />
                    <div className="space-y-2">
                        <Typography variant="h6" color="error" weight="semibold">
                            Upload Issues Found
                        </Typography>
                        <ul className="space-y-1.5">
                            {
                                errors.length > 0 && (
                                    <>
                                        {errors.map((error, index) => (
                                            <motion.li
                                                key={index}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="text-sm text-rose-700 dark:text-rose-400 flex items-center gap-2"
                                            >
                                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                                {error}
                                            </motion.li>
                                        ))}
                                    </>
                                )
                            }

                        </ul>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ValidationErrors;