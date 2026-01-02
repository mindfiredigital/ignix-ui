import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type FileListProps, type FileWithPreview } from '../types';
import { Typography } from '../../typography';
import { formatFileSize, isImageFile, getFileIcon, getFileTypeText, getIconContainerColor } from '../utils';
import { FileText, File, FileImage, Video, Music, Archive, AlertCircle, CheckCircle, Loader2, Trash2 } from 'lucide-react';
import { cn } from '../../../../utils/cn';
import { Avatar } from '../../avatar';

/**
 * FileList component displays a list of uploaded files with detailed information,
 * progress indicators, and removal functionality.
 * 
 * @component
 * @param {FileListProps} props - Component props
 * @param {FileWithPreview[]} props.files - Array of files to display
 * @param {boolean} props.isUploading - Indicates if overall upload is in progress
 * @param {(id: string) => void} props.onRemoveFile - Callback when a file is removed
 * @param {() => void} props.onClearAll - Callback when all files are cleared
 * @param {'circle' | 'square' | 'rounded' | 'hexagon' | 'diamond'} [props.imageAvatarShape='circle'] - Shape for image avatars
 * @param {'xs' | 'sm' | 'md' | 'lg'} [props.imageAvatarSize='md'] - Size for image avatars
 * 
 * @returns {JSX.Element} File list component with animated file items
 * 
 * @example
 * ```tsx
 * <FileList
 *   files={uploadedFiles}
 *   isUploading={false}
 *   onRemoveFile={handleRemoveFile}
 *   onClearAll={handleClearAll}
 *   imageAvatarShape="rounded"
 *   imageAvatarSize="lg"
 * />
 * ```
 */
const FileList: React.FC<FileListProps> = ({
    files,
    isUploading,
    onRemoveFile,
    onClearAll,
    imageAvatarShape = 'circle',
    imageAvatarSize = 'md'
}) => {

    /**
     * Returns the appropriate icon component based on file type
     * 
     * @param {FileWithPreview} file - The file to determine icon for
     * @returns {JSX.Element} Icon component with appropriate styling
     */
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

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Typography variant="h4" weight="semibold" className="bg-gradient-to-r from-slate-800 to-slate-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                        Selected Files
                    </Typography>
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
                                            <Typography
                                                variant="body"
                                                weight="medium"
                                                className="text-slate-800 dark:text-gray-100 truncate"
                                                truncate
                                            >
                                                {file.name}
                                            </Typography>
                                            {file.error ? (
                                                <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                                            ) : file.uploading ? (
                                                <Loader2 className="w-4 h-4 text-amber-500 animate-spin flex-shrink-0" />
                                            ) : (
                                                <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                            )}
                                        </div>

                                        <div className="flex items-center gap-3 mt-1.5">
                                            <Typography
                                                variant="caption"
                                                className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-gray-300"
                                            >
                                                {formatFileSize(file.size)}
                                            </Typography>
                                            <Typography variant="caption" color="muted">
                                                {getFileTypeText(file)}
                                            </Typography>
                                            {isImage && (
                                                <Typography variant="caption" color="muted">
                                                    Image
                                                </Typography>
                                            )}
                                        </div>

                                        {file.uploading && (
                                            <div className="mt-3 space-y-1">
                                                <div className="flex justify-between text-xs">
                                                    <Typography variant="caption" color="warning" weight="medium">
                                                        Uploading
                                                    </Typography>
                                                    <Typography variant="caption" color="warning">
                                                        {Math.round(file.uploadProgress || 0)}%
                                                    </Typography>
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
                                                <Typography variant="caption" color="error" className="flex items-center gap-1.5">
                                                    <AlertCircle className="w-4 h-4" />
                                                    {file.error}
                                                </Typography>
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

export default FileList;