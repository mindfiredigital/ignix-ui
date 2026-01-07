import React from 'react';
import { motion } from 'framer-motion';
import { Upload, Sparkles, Loader2 } from 'lucide-react';
import { cn } from '../../../../utils/cn';
import type { DropzoneProps } from '../types';
import { formatFileSize } from '../utils';


/**
 * Dropzone component for file upload interface with drag-and-drop functionality
 * 
 * @component
 * @param {DropzoneProps} props - Component props
 * @param {boolean} props.dragActive - Indicates if drag is currently active
 * @param {boolean} props.isUploading - Indicates if files are currently being uploaded
 * @param {boolean} props.disabled - Disables the dropzone interaction
 * @param {string} props.dropzoneText - Custom text displayed in the dropzone
 * @param {string} props.accept - Accepted file types (MIME types or extensions)
 * @param {number} props.maxSize - Maximum file size in bytes
 * @param {boolean} props.multiple - Allow multiple file selection
 * @param {number} props.maxFiles - Maximum number of files allowed
 * @param {() => void} props.onClick - Click handler for the dropzone
 * @param {(e: React.DragEvent) => void} props.onDragEnter - Drag enter event handler
 * @param {(e: React.DragEvent) => void} props.onDragLeave - Drag leave event handler
 * @param {(e: React.DragEvent) => void} props.onDragOver - Drag over event handler
 * @param {(e: React.DragEvent) => void} props.onDrop - Drop event handler
 * 
 * @returns {JSX.Element} Dropzone component with interactive animations
 * 
 * @example
 * ```tsx
 * <Dropzone
 *   dragActive={isDragging}
 *   isUploading={false}
 *   disabled={false}
 *   dropzoneText="Drag & drop files here"
 *   accept="image/*"
 *   maxSize={5242880}
 *   multiple={true}
 *   maxFiles={10}
 *   onClick={handleClick}
 *   onDragEnter={handleDragEnter}
 *   onDragLeave={handleDragLeave}
 *   onDragOver={handleDragOver}
 *   onDrop={handleDrop}
 * />
 * ```
 */
const Dropzone: React.FC<DropzoneProps> = ({
    dragActive,
    isUploading,
    disabled,
    dropzoneText,
    accept,
    maxSize,
    multiple,
    maxFiles,
    onClick,
    onDragEnter,
    onDragLeave,
    onDragOver,
    onDrop
}) => {


    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onClick={onClick}
            className={cn(
                'relative rounded-2xl p-10 transition-all duration-500 cursor-pointer group',
                'border-3 border-dashed',
                dragActive
                    ? 'border-slate-400 dark:border-indigo-500 bg-gradient-to-br from-slate-50/50 to-slate-100/50 dark:from-indigo-900/30 dark:to-purple-900/30'
                    : 'border-slate-200 dark:border-gray-400',
                'hover:border-slate-300 dark:hover:border-indigo-600',
                'hover:shadow-2xl hover:shadow-slate-500/10 dark:hover:shadow-indigo-500/20',
                (disabled || isUploading) && 'opacity-50 cursor-not-allowed pointer-events-none'
            )}
            whileHover={!(disabled || isUploading) ? { scale: 1.005 } : {}}
            whileTap={!(disabled || isUploading) ? { scale: 0.995 } : {}}
            role="button"
            tabIndex={(disabled || isUploading) ? -1 : 0}
            aria-label="File drop zone"
        >
            <div className="absolute inset-0 overflow-hidden rounded-2xl">
                {dragActive && (
                    <>
                        {[...Array(5)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{
                                    opacity: [0, 1, 0],
                                    scale: [0, 1, 0],
                                    x: Math.random() * 400 - 200,
                                    y: Math.random() * 400 - 200,
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: i * 0.2,
                                    ease: "easeInOut"
                                }}
                                className="absolute w-2 h-2 bg-slate-400 dark:bg-indigo-400 rounded-full"
                                style={{ left: '50%', top: '50%' }}
                            />
                        ))}
                    </>
                )}
            </div>

            <motion.div
                animate={dragActive ? {
                    y: [0, -15, 0],
                    rotate: [0, 5, -5, 0]
                } : {}}
                transition={{
                    repeat: dragActive ? Infinity : 0,
                    duration: 1.5,
                    ease: "easeInOut"
                }}
                className="flex flex-col items-center justify-center text-center space-y-6"
            >
                <div className="relative">
                    <div className="w-24 h-24 rounded-2xl flex items-center justify-center border-1">
                        {isUploading ? (
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}>
                                <Loader2 className="w-10 h-10 text-white dark:text-slate-900" />
                            </motion.div>
                        ) : (
                            <Upload className={cn(
                                "w-10 h-10 transition-all duration-300",
                                dragActive
                                    ? 'text-white'
                                    : 'text-slate-400 group-hover:text-slate-600 dark:text-gray-600 dark:group-hover:text-indigo-400'
                            )} />
                        )}
                    </div>
                    {dragActive && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-2 -right-2">
                            <Sparkles className="w-6 h-6 text-slate-300 dark:text-amber-400" />
                        </motion.div>
                    )}
                </div>

                <div className="space-y-3 max-w-md">
                    <motion.h3
                        animate={dragActive ? { scale: 1.05 } : { scale: 1 }}
                        className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent"
                    >
                        {isUploading ? 'Uploading...' : dropzoneText}
                    </motion.h3>

                    <motion.p
                        initial={{ opacity: 0.8 }}
                        animate={{ opacity: dragActive ? 1 : 0.8 }}
                        className="text-slate-500 dark:text-gray-400 text-sm font-medium"
                    >
                        {accept !== '*/*' ? `Supports: ${accept}` : 'All file types supported'}
                        {maxSize && ` • Max size: ${formatFileSize(maxSize)}`}
                        {multiple && maxFiles > 1 && ` • Max files: ${maxFiles}`}
                    </motion.p>

                    {isUploading && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-sm font-medium text-slate-600 dark:text-indigo-400 flex items-center justify-center gap-2"
                        >
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Processing your files...
                        </motion.p>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Dropzone;