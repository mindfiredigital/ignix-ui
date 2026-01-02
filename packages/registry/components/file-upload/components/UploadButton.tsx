import React from 'react';
import { motion } from 'framer-motion';
import { Upload, Trash2, Loader2 } from 'lucide-react';
import { cn } from '../../../../utils/cn';
import { Button } from '../../button';
import { type UploadButtonProps } from '../types';

/**
 * UploadButton component provides the main file upload interface with a primary action button,
 * file count display, and clear all functionality.
 * 
 * @component
 * @param {UploadButtonProps} props - Component props
 * @param {string} props.buttonText - Text to display on the upload button
 * @param {'default' | 'primary' | 'secondary' | 'outline' | 'ghost'} props.buttonVariant - Visual variant of the button
 * @param {FileWithPreview[]} props.files - Array of currently selected files
 * @param {boolean} props.isUploading - Indicates if files are currently being uploaded
 * @param {boolean} props.disabled - Disables the upload button interaction
 * @param {() => void} props.onClick - Click handler for the upload button
 * @param {() => void} props.onClearAll - Callback to clear all selected files
 * 
 * @returns {JSX.Element} Upload button interface with file count and clear functionality
 * 
 * @example
 * ```tsx
 * <UploadButton
 *   buttonText="Choose Files"
 *   buttonVariant="primary"
 *   files={selectedFiles}
 *   isUploading={false}
 *   disabled={false}
 *   onClick={handleFileSelect}
 *   onClearAll={handleClearAll}
 * />
 * ```
 */
const UploadButton: React.FC<UploadButtonProps> = ({
    buttonText,
    buttonVariant,
    files,
    isUploading,
    disabled,
    onClick,
    onClearAll
}) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xlr from-white to-slate-50 dark:from-gray-900 dark:to-gray-800 border border-slate-100 dark:border-gray-800 rounded-2xl"
        >
            <div className="flex flex-wrap items-center gap-4">
                <Button
                    variant={buttonVariant}
                    onClick={onClick}
                    disabled={disabled || isUploading}
                    className={cn(
                        "relative overflow-hidden group",
                        "px-8 py-3 rounded-xl font-semibold",
                        "bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900",
                        "dark:from-indigo-600 dark:to-purple-600 dark:hover:from-indigo-700 dark:hover:to-purple-700",
                        "text-white shadow-lg shadow-slate-500/25 hover:shadow-slate-500/40",
                        "dark:shadow-indigo-500/25 dark:hover:shadow-indigo-500/40",
                        "transition-all duration-300 transform hover:-translate-y-0.5",
                        "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    )}
                >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    <span className="relative flex items-center gap-3">
                        {isUploading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.3 }}>
                                <Upload className="w-5 h-5" />
                            </motion.div>
                        )}
                        {isUploading ? 'Uploading...' : buttonText}
                    </span>
                </Button>

                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium px-3 py-1.5 rounded-full border border-slate-700 from-slate-100 to-slate-200 dark:from-gray-800 dark:to-gray-700 text-slate-700 dark:text-gray-500">
                        {files.length} selected
                    </span>
                    {isUploading && (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-sm font-medium px-3 py-1.5 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-800/30 text-amber-700 dark:text-amber-300 flex items-center gap-1.5"
                        >
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            Uploading
                        </motion.span>
                    )}
                </div>
            </div>

            {files.length > 0 && (
                <Button
                    variant="ghost"
                    onClick={onClearAll}
                    disabled={isUploading}
                    className="text-slate-600 hover:text-rose-600 dark:text-gray-400 dark:hover:text-rose-400 font-medium transition-colors disabled:opacity-50"
                >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All
                </Button>
            )}
        </motion.div>
    );
};

export default UploadButton;