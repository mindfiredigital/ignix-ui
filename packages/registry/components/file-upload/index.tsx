
'use client';

import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Sparkles, Loader2, FileText, File, FileImage, Video, Music, Archive, AlertCircle, CheckCircle, Trash2 } from 'lucide-react';
import { cn } from '../../../utils/cn';

// ============================================================================
// TYPES
// ============================================================================

export interface FileWithPreview {
    id: string;
    name: string;
    type: string;
    size: number;
    lastModified: number;
    preview?: string;
    error?: string;
    uploading?: boolean;
    uploadProgress?: number;
}

export interface FileUploadProps {
    /** Allow multiple file selection */
    multiple?: boolean;
    /** Maximum number of files allowed */
    maxFiles?: number;
    /** Maximum file size in bytes */
    maxSize?: number;
    /** Accepted file types (MIME types or extensions) */
    accept?: string;
    /** Callback when files are selected */
    onFilesChange?: (files: File[]) => void;
    /** Display mode: 'button', 'dropzone', or 'both' */
    mode?: 'button' | 'dropzone' | 'both';
    /** Custom upload button text */
    buttonText?: string;
    /** Custom dropzone text */
    dropzoneText?: string;
    /** Show file list */
    showFileList?: boolean;
    /** Disable the component */
    disabled?: boolean;
    /** Custom validation function */
    validateFile?: (file: File) => { isValid: boolean; error?: string };
    /** Custom className */
    className?: string;
    /** Variant for the upload button */
    buttonVariant?: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost';
    /** Show simulated upload progress */
    simulateUpload?: boolean;
    /** Avatar shape for image files */
    imageAvatarShape?: 'circle' | 'square' | 'rounded' | 'hexagon' | 'diamond';
    /** Avatar size for image files */
    imageAvatarSize?: 'xs' | 'sm' | 'md' | 'lg';
}

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Format file size from bytes to human readable string
 */
const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Check if a file is an image based on its MIME type
 */
const isImageFile = (file: File | FileWithPreview): boolean => {
    if (!file || typeof file.type !== 'string') return false;
    return file.type.startsWith('image/');
};

/**
 * Get the icon type for a file based on its type or extension
 */
const getFileIcon = (file: File | FileWithPreview): string => {
    if (!file) return 'File';

    const type = file.type || '';
    const name = (file.name || '').toLowerCase();

    if (type.startsWith('image/')) return 'image';
    if (type.includes('pdf') || name.endsWith('.pdf')) return 'pdf';
    if (type.includes('word') || type.includes('document') || name.endsWith('.doc') || name.endsWith('.docx')) return 'word';
    if (type.includes('excel') || type.includes('spreadsheet') || name.endsWith('.xls') || name.endsWith('.xlsx')) return 'excel';
    if (type.includes('video')) return 'video';
    if (type.includes('audio')) return 'audio';
    if (type.includes('zip') || type.includes('compressed') || name.endsWith('.zip') || name.endsWith('.rar') || name.endsWith('.7z')) return 'archive';
    if (name.endsWith('.txt') || name.endsWith('.rtf') || name.endsWith('.md')) return 'text';

    return 'file';
};

/**
 * Get display text for file type
 */
const getFileTypeText = (file: File | FileWithPreview): string => {
    const iconType = getFileIcon(file);
    const typeMap: Record<string, string> = {
        image: 'IMAGE',
        pdf: 'PDF',
        word: 'DOC',
        excel: 'EXCEL',
        video: 'VIDEO',
        audio: 'AUDIO',
        archive: 'ARCHIVE',
        text: 'TEXT',
        file: 'FILE'
    };
    return typeMap[iconType] || 'FILE';
};

/**
 * Get Tailwind CSS classes for file icon container based on file type
 */
const getIconContainerColor = (file: File | FileWithPreview): string => {
    const iconType = getFileIcon(file);
    const colorMap: Record<string, string> = {
        image: 'bg-gradient-to-br from-slate-100 to-slate-200 dark:from-indigo-900/20 dark:to-purple-900/20',
        pdf: 'bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20',
        word: 'bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
        excel: 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
        video: 'bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20',
        audio: 'bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20',
        archive: 'bg-gradient-to-br from-slate-100 to-slate-200 dark:from-gray-800/20 dark:to-gray-700/20',
        text: 'bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-800/20 dark:to-gray-900/20',
        file: 'bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-800/20 dark:to-gray-900/20'
    };
    return colorMap[iconType] || 'bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-800/20 dark:to-gray-900/20';
};

/**
 * Create a base64 image preview from a File object
 */
const createImagePreview = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

/**
 * Validate a file against size, type, and custom validation rules
 */
const validateFile = (
    file: File,
    maxSize: number,
    accept: string,
    customValidate?: (file: File) => { isValid: boolean; error?: string }
): { isValid: boolean; error?: string } => {
    if (maxSize && file.size > maxSize) {
        return {
            isValid: false,
            error: `File size exceeds maximum allowed size of ${formatFileSize(maxSize)}`,
        };
    }

    if (accept && accept !== '*/*') {
        const acceptedTypes = accept.split(',').map(type => type.trim());
        const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
        const fileType = file.type.toLowerCase();

        const isAccepted = acceptedTypes.some(type => {
            if (type.startsWith('.')) return fileExtension === type.toLowerCase();
            if (type.includes('/*')) {
                const mainType = type.split('/*')[0];
                return fileType.startsWith(mainType);
            }
            return fileType === type.toLowerCase();
        });

        if (!isAccepted) {
            return {
                isValid: false,
                error: `File type not allowed. Accepted: ${accept}`,
            };
        }
    }

    if (customValidate) return customValidate(file);

    return { isValid: true };
};

/**
 * Generate a unique ID for a file
 */
const generateFileId = (): string => {
    return Math.random().toString(36).substring(2, 9);
};

// ============================================================================
// CONSTANTS
// ============================================================================

const COLOR_PALETTE = {
    primary: {
        light: 'bg-gradient-to-r from-slate-700 to-slate-800',
        dark: 'bg-gradient-to-r from-indigo-600 to-purple-600',
        hover: 'hover:from-slate-800 hover:to-slate-900 hover:dark:from-indigo-700 hover:dark:to-purple-700',
        border: 'border-slate-300 dark:border-indigo-700',
        text: 'text-white',
        glow: 'shadow-lg shadow-slate-500/20 dark:shadow-indigo-700/30',
    },
    success: {
        light: 'bg-emerald-500',
        dark: 'bg-emerald-600',
        text: 'text-emerald-600 dark:text-emerald-400',
        bg: 'bg-emerald-50 dark:bg-emerald-900/20',
        border: 'border-emerald-200 dark:border-emerald-700',
    },
    error: {
        light: 'bg-rose-500',
        dark: 'bg-rose-600',
        text: 'text-rose-600 dark:text-rose-400',
        bg: 'bg-rose-50 dark:bg-rose-900/20',
        border: 'border-rose-200 dark:border-rose-700',
    },
    warning: {
        light: 'bg-amber-500',
        dark: 'bg-amber-600',
        text: 'text-amber-600 dark:text-amber-400',
        bg: 'bg-amber-50 dark:bg-amber-900/20',
        border: 'border-amber-200 dark:border-amber-700',
    },
    neutral: {
        light: 'bg-slate-100',
        dark: 'bg-gray-800',
        text: 'text-slate-700 dark:text-gray-300',
        bg: 'bg-slate-50 dark:bg-gray-900/50',
        border: 'border-slate-200 dark:border-gray-700',
        hover: 'hover:border-slate-300 dark:hover:border-gray-600',
    }
} as const;

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

interface DropzoneProps {
    dragActive: boolean;
    isUploading: boolean;
    disabled: boolean;
    dropzoneText: string;
    accept: string;
    maxSize: number;
    multiple: boolean;
    maxFiles: number;
    onClick: () => void;
    onDragEnter: (e: React.DragEvent) => void;
    onDragLeave: (e: React.DragEvent) => void;
    onDragOver: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
}

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

interface UploadButtonProps {
    buttonText: string;
    buttonVariant: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost';
    files: FileWithPreview[];
    isUploading: boolean;
    disabled: boolean;
    onClick: () => void;
    onClearAll: () => void;
}

// Simple Button component (since the actual Button component is imported)
const SimpleButton: React.FC<{
    variant: UploadButtonProps['buttonVariant'];
    onClick: () => void;
    disabled: boolean;
    children: React.ReactNode;
    className?: string;
}> = ({ onClick, disabled, children, className }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={cn(
                "relative overflow-hidden group",
                "px-8 py-3 rounded-xl font-semibold",
                "bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900",
                "dark:from-indigo-600 dark:to-purple-600 dark:hover:from-indigo-700 dark:hover:to-purple-700",
                "text-white shadow-lg shadow-slate-500/25 hover:shadow-slate-500/40",
                "dark:shadow-indigo-500/25 dark:hover:shadow-indigo-500/40",
                "transition-all duration-300 transform hover:-translate-y-0.5",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
                className
            )}
        >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <span className="relative flex items-center gap-3">
                {children}
            </span>
        </button>
    );
};

const UploadButtonComponent: React.FC<UploadButtonProps> = ({
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
                <SimpleButton
                    variant={buttonVariant}
                    onClick={onClick}
                    disabled={disabled || isUploading}
                >
                    {isUploading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.3 }}>
                            <Upload className="w-5 h-5" />
                        </motion.div>
                    )}
                    {isUploading ? 'Uploading...' : buttonText}
                </SimpleButton>

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
                <button
                    onClick={onClearAll}
                    disabled={isUploading}
                    className="text-slate-600 hover:text-rose-600 dark:text-gray-400 dark:hover:text-rose-400 font-medium transition-colors disabled:opacity-50 flex items-center"
                >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All
                </button>
            )}
        </motion.div>
    );
};

interface ValidationErrorsProps {
    errors: string[];
}

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
                        <h6 className="text-lg font-semibold text-rose-600 dark:text-rose-400">
                            Upload Issues Found
                        </h6>
                        <ul className="space-y-1.5">
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
                        </ul>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

interface FileListProps {
    files: FileWithPreview[];
    isUploading: boolean;
    onRemoveFile: (id: string) => void;
    onClearAll: () => void;
    imageAvatarShape?: 'circle' | 'square' | 'rounded' | 'hexagon' | 'diamond';
    imageAvatarSize?: 'xs' | 'sm' | 'md' | 'lg';
}

const FileList: React.FC<FileListProps> = ({
    files,
    isUploading,
    onRemoveFile,
    onClearAll,
    imageAvatarShape = 'circle',
    imageAvatarSize = 'md'
}) => {
    const getIconComponent = (file: FileWithPreview) => {
        const iconType = getFileIcon(file);
        switch (iconType) {
            case 'image': return <FileImage className="w-6 h-6 text-slate-600" />;
            case 'pdf': return <FileText className="w-6 h-6 text-red-500" />;
            case 'word': return <FileText className="w-6 h-6 text-blue-500" />;
            case 'excel': return <FileText className="w-6 h-6 text-green-500" />;
            case 'video': return <Video className="w-6 h-6 text-orange-500" />;
            case 'audio': return <Music className="w-6 h-6 text-purple-500" />;
            case 'archive': return <Archive className="w-6 h-6 text-slate-500" />;
            case 'text': return <FileText className="w-6 h-6 text-slate-600" />;
            default: return <File className="w-6 h-6 text-slate-500" />;
        }
    };

    // Simple Avatar component
    const Avatar: React.FC<{
        size: string;
        shape: string;
        src?: string;
        alt: string;
        className?: string;
        onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
    }> = ({ size, shape, src, alt, className, onError }) => {
        const sizeMap = {
            xs: 'w-8 h-8',
            sm: 'w-10 h-10',
            md: 'w-12 h-12',
            lg: 'w-16 h-16'
        };

        const shapeMap = {
            circle: 'rounded-full',
            square: 'rounded-none',
            rounded: 'rounded-lg',
            hexagon: 'clip-hexagon',
            diamond: 'rotate-45 overflow-hidden'
        };

        return (
            <div className={cn(
                sizeMap[size],
                shapeMap[shape],
                "overflow-hidden",
                className
            )}>
                {src && (
                    <img
                        src={src}
                        alt={alt}
                        className="w-full h-full object-cover"
                        onError={onError}
                    />
                )}
            </div>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <h4 className="text-xl font-semibold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                        Selected Files
                    </h4>
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="px-2 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-slate-100 to-slate-200 dark:from-indigo-900/30 dark:to-purple-900/30 text-slate-700 dark:text-indigo-300"
                    >
                        {files.length} file{files.length !== 1 ? 's' : ''}
                    </motion.span>
                </div>
                {files.length > 0 && (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onClearAll}
                        disabled={isUploading}
                        className="text-sm font-medium text-slate-500 hover:text-rose-600 dark:text-gray-400 dark:hover:text-rose-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Clear All
                    </motion.button>
                )}
            </div>

            <div className="grid gap-3">
                <AnimatePresence>
                    {files.map((file, index) => {
                        const isImage = isImageFile(file);
                        const showAvatar = isImage && file.preview;

                        return (
                            <motion.div
                                key={file.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ delay: index * 0.05 }}
                                className={cn(
                                    'group relative p-4 rounded-xl border-2 transition-all duration-300',
                                    'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm',
                                    'border-slate-100 dark:border-gray-700',
                                    'hover:border-slate-300 dark:hover:border-indigo-600',
                                    'hover:shadow-lg hover:shadow-slate-100/50 dark:hover:shadow-indigo-900/20',
                                    file.error && 'border-rose-200 dark:border-rose-700',
                                    file.uploading && 'border-amber-200 dark:border-amber-600'
                                )}
                            >
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-slate-500/0 via-slate-500/0 to-slate-500/0 group-hover:from-slate-500/5 group-hover:via-slate-500/5 group-hover:to-slate-500/5 transition-all duration-500" />

                                <div className="relative flex items-center gap-4">
                                    <motion.div whileHover={{ rotate: 5, scale: 1.1 }} className="relative">
                                        {showAvatar ? (
                                            <>
                                                <div className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full z-10">
                                                    IMAGE
                                                </div>
                                                <Avatar
                                                    size={imageAvatarSize}
                                                    shape={imageAvatarShape}
                                                    src={file.preview}
                                                    alt={file.name}
                                                    className={cn(
                                                        "ring-2 ring-white dark:ring-gray-800 shadow-md",
                                                        file.uploading && "opacity-80"
                                                    )}
                                                    onError={(e) => {
                                                        e.currentTarget.style.border = '2px solid red';
                                                    }}
                                                />
                                            </>
                                        ) : (
                                            <div className={cn(
                                                "w-14 h-14 rounded-xl flex items-center justify-center",
                                                getIconContainerColor(file),
                                                file.uploading && 'opacity-80'
                                            )}>
                                                {getIconComponent(file)}
                                            </div>
                                        )}
                                        {file.uploading && (
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                                className={cn(
                                                    "absolute -inset-1 border-2 border-amber-200 dark:border-amber-600",
                                                    showAvatar ? 'rounded-full' : 'rounded-xl'
                                                )}
                                            />
                                        )}
                                    </motion.div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="text-slate-800 dark:text-gray-100 truncate font-medium">
                                                {file.name}
                                            </div>
                                            {file.error ? (
                                                <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                                            ) : file.uploading ? (
                                                <Loader2 className="w-4 h-4 text-amber-500 animate-spin flex-shrink-0" />
                                            ) : (
                                                <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                            )}
                                        </div>

                                        <div className="flex items-center gap-3 mt-1.5">
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-gray-300">
                                                {formatFileSize(file.size)}
                                            </span>
                                            <span className="text-xs text-slate-500 dark:text-gray-400">
                                                {getFileTypeText(file)}
                                            </span>
                                            {isImage && (
                                                <span className="text-xs text-slate-500 dark:text-gray-400">
                                                    Image
                                                </span>
                                            )}
                                        </div>

                                        {file.uploading && (
                                            <div className="mt-3 space-y-1">
                                                <div className="flex justify-between text-xs">
                                                    <span className="font-medium text-amber-600 dark:text-amber-400">
                                                        Uploading
                                                    </span>
                                                    <span className="text-amber-600 dark:text-amber-400">
                                                        {Math.round(file.uploadProgress || 0)}%
                                                    </span>
                                                </div>
                                                <div className="h-2 bg-gradient-to-r from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-800/30 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${file.uploadProgress || 0}%` }}
                                                        transition={{ type: "spring", stiffness: 100 }}
                                                        className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {file.error && (
                                            <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mt-2">
                                                <span className="text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                                                    <AlertCircle className="w-4 h-4" />
                                                    {file.error}
                                                </span>
                                            </motion.div>
                                        )}
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => onRemoveFile(file.id)}
                                        disabled={file.uploading}
                                        className={cn(
                                            'p-2 rounded-lg transition-all duration-200',
                                            'text-slate-400 hover:text-rose-600 dark:text-gray-500 dark:hover:text-rose-400',
                                            'hover:bg-rose-50 dark:hover:bg-rose-900/20',
                                            'opacity-0 group-hover:opacity-100 focus:opacity-100',
                                            file.uploading && 'opacity-50 cursor-not-allowed'
                                        )}
                                        aria-label={`Remove ${file.name}`}
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </motion.button>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

// ============================================================================
// CUSTOM HOOK
// ============================================================================

interface UseFileUploadProps {
    multiple?: boolean;
    maxFiles?: number;
    maxSize?: number;
    accept?: string;
    validateFile?: (file: File) => { isValid: boolean; error?: string };
    simulateUpload?: boolean;
    onFilesChange?: (files: File[]) => void;
}

const useFileUpload = ({
    multiple = false,
    maxFiles = 10,
    maxSize = 10 * 1024 * 1024,
    accept = '*/*',
    validateFile: customValidate,
    simulateUpload = false,
    onFilesChange
}: UseFileUploadProps) => {
    const [files, setFiles] = useState<FileWithPreview[]>([]);
    const [originalFiles, setOriginalFiles] = useState<File[]>([]);
    const [dragActive, setDragActive] = useState(false);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const simulateUploadProgress = useCallback((fileId: string) => {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 20;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setFiles(prev => prev.map(f =>
                    f.id === fileId ? { ...f, uploading: false, uploadProgress: 100 } : f
                ));
            } else {
                setFiles(prev => prev.map(f =>
                    f.id === fileId ? { ...f, uploading: true, uploadProgress: Math.min(progress, 99) } : f
                ));
            }
        }, 200);
        return () => clearInterval(interval);
    }, []);

    const handleFiles = useCallback(async (selectedFiles: FileList | File[]) => {
        const fileArray = Array.from(selectedFiles);
        const newValidationErrors: string[] = [];

        if (!multiple && fileArray.length > 1) {
            newValidationErrors.push('Only single file upload is allowed');
        }

        if (multiple && files.length + fileArray.length > maxFiles) {
            newValidationErrors.push(`Maximum ${maxFiles} files allowed`);
        }

        const validFiles: FileWithPreview[] = [];
        const validOriginalFiles: File[] = [];

        for (const file of fileArray) {
            const validation = validateFile(file, maxSize, accept, customValidate);

            if (validation.isValid) {
                const fileId = generateFileId();
                let preview: string | undefined;

                if (isImageFile(file)) {
                    try {
                        preview = await createImagePreview(file);
                    } catch (error) {
                        console.error('Failed to create preview:', error);
                    }
                }

                validFiles.push({
                    id: fileId,
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    lastModified: file.lastModified,
                    preview,
                    uploading: simulateUpload,
                    uploadProgress: simulateUpload ? 0 : undefined,
                });

                validOriginalFiles.push(file);
            } else {
                newValidationErrors.push(`${file.name}: ${validation.error}`);
            }
        }

        setValidationErrors(newValidationErrors);

        if (validFiles.length > 0) {
            const updatedFiles = multiple ? [...files, ...validFiles] : validFiles;
            const updatedOriginalFiles = multiple ? [...originalFiles, ...validOriginalFiles] : validOriginalFiles;

            setFiles(updatedFiles);
            setOriginalFiles(updatedOriginalFiles);

            onFilesChange?.(updatedOriginalFiles);

            if (simulateUpload) {
                setIsUploading(true);
                validFiles.forEach(file => simulateUploadProgress(file.id));
                setTimeout(() => setIsUploading(false), 3000);
            }
        }
    }, [files, originalFiles, multiple, maxFiles, maxSize, accept, customValidate, simulateUpload, simulateUploadProgress, onFilesChange]);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(e.type === 'dragenter' || e.type === 'dragover');
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files?.length > 0) handleFiles(e.dataTransfer.files);
    }, [handleFiles]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const target = e.target as HTMLInputElement;
        const files = target.files;

        if (files && files.length > 0) {
            handleFiles(files);
            target.value = '';
        }
    }, [handleFiles]);

    const validateState = useCallback((currentFiles: FileWithPreview[]) => {
        const errors: string[] = [];

        if (multiple && currentFiles.length > maxFiles) {
            errors.push(`Maximum ${maxFiles} files allowed`);
        }

        return errors;
    }, [multiple, maxFiles]);

    const removeFile = useCallback((id: string) => {
        const fileIndex = files.findIndex(file => file.id === id);
        const updatedFiles = files.filter(file => file.id !== id);
        const updatedOriginalFiles = [...originalFiles];

        if (fileIndex !== -1) {
            updatedOriginalFiles.splice(fileIndex, 1);
        }

        setFiles(updatedFiles);
        setOriginalFiles(updatedOriginalFiles);
        onFilesChange?.(updatedOriginalFiles);

        const newErrors = validateState(updatedFiles);
        setValidationErrors(newErrors);
    }, [files, originalFiles, validateState, onFilesChange]);

    const clearAll = useCallback(() => {
        setFiles([]);
        setOriginalFiles([]);
        setValidationErrors([]);
        setIsUploading(false);
        onFilesChange?.([]);
    }, [onFilesChange]);

    const handleButtonClick = useCallback(() => {
        if (fileInputRef.current) fileInputRef.current.click();
    }, []);

    return {
        files,
        dragActive,
        validationErrors,
        isUploading,
        fileInputRef,
        handleDrag,
        handleDrop,
        handleChange,
        handleFiles,
        removeFile,
        clearAll,
        handleButtonClick,
        setDragActive,
        setValidationErrors
    };
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * FileUpload component provides a comprehensive file upload interface with drag-and-drop support,
 * file validation, progress tracking, and visual feedback.
 * 
 * @param {FileUploadProps} props - Component properties
 * @returns {JSX.Element} File upload component with interactive interface
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <FileUpload onFilesChange={(files) => console.log('Selected files:', files)} />
 * 
 * // Advanced usage with custom configuration
 * <FileUpload
 *   multiple={true}
 *   maxFiles={5}
 *   maxSize={5242880} // 5MB
 *   accept="image/*, .pdf, .doc, .docx"
 *   mode="both"
 *   buttonText="Choose Files"
 *   dropzoneText="Drop images or documents here"
 *   showFileList={true}
 *   buttonVariant="primary"
 *   simulateUpload={true}
 *   imageAvatarShape="rounded"
 *   imageAvatarSize="lg"
 *   onFilesChange={(files) => handleFileUpload(files)}
 *   validateFile={(file) => {
 *     if (file.name.includes('virus')) {
 *       return { isValid: false, error: 'Suspicious file name' };
 *     }
 *     return { isValid: true };
 *   }}
 * />
 * ```
 */
export const FileUpload: React.FC<FileUploadProps> = ({
    multiple = false,
    maxFiles = 10,
    maxSize = 10 * 1024 * 1024,
    accept = '*/*',
    onFilesChange,
    mode = 'both',
    buttonText = 'Upload Files',
    dropzoneText = 'Drag & drop files here or click to browse',
    showFileList = true,
    disabled = false,
    validateFile,
    className,
    buttonVariant = 'primary',
    simulateUpload = false,
    imageAvatarShape = 'circle',
    imageAvatarSize = 'md',
}) => {
    const {
        files,
        dragActive,
        validationErrors,
        isUploading,
        fileInputRef,
        handleDrag,
        handleDrop,
        handleChange,
        handleButtonClick,
        removeFile,
        clearAll
    } = useFileUpload({
        multiple,
        maxFiles,
        maxSize,
        accept,
        validateFile,
        simulateUpload,
        onFilesChange
    });

    return (
        <div className={cn('w-full', className)}>
            <input
                ref={fileInputRef}
                type="file"
                multiple={multiple}
                accept={accept}
                onChange={handleChange}
                className="hidden"
                disabled={disabled || isUploading}
                aria-label="File input"
            />

            <div className="space-y-6">
                {(mode === 'dropzone' || mode === 'both') && (
                    <Dropzone
                        dragActive={dragActive}
                        isUploading={isUploading}
                        disabled={disabled}
                        dropzoneText={dropzoneText}
                        accept={accept}
                        maxSize={maxSize}
                        multiple={multiple}
                        maxFiles={maxFiles}
                        onClick={handleButtonClick}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    />
                )}

                {(mode === 'button' || mode === 'both') && (
                    <UploadButtonComponent
                        buttonText={buttonText}
                        buttonVariant={buttonVariant}
                        files={files}
                        isUploading={isUploading}
                        disabled={disabled}
                        onClick={handleButtonClick}
                        onClearAll={clearAll}
                    />
                )}

                <ValidationErrors errors={validationErrors} />

                {showFileList && files.length > 0 && (
                    <FileList
                        files={files}
                        isUploading={isUploading}
                        onRemoveFile={removeFile}
                        onClearAll={clearAll}
                        imageAvatarShape={imageAvatarShape}
                        imageAvatarSize={imageAvatarSize}
                    />
                )}
            </div>
        </div>
    );
};

export default FileUpload;