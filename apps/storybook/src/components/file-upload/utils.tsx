import { type FileWithPreview } from './types';

/**
 * Format file size from bytes to human readable string
 * 
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size (e.g., "2.5 MB")
 */
export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Check if a file is an image based on its MIME type
 * 
 * @param {File | FileWithPreview} file - File to check
 * @returns {boolean} True if file is an image
 */
export const isImageFile = (file: File | FileWithPreview): boolean => {
    if (!file || typeof file.type !== 'string') return false;
    return file.type.startsWith('image/');
};

/**
 * Get the icon type for a file based on its type or extension
 * 
 * @param {File | FileWithPreview} file - File to get icon for
 * @returns {string} Icon type identifier
 */
export const getFileIcon = (file: File | FileWithPreview): string => {
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
 * 
 * @param {File | FileWithPreview} file - File to get type text for
 * @returns {string} File type display text
 */
export const getFileTypeText = (file: File | FileWithPreview): string => {
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
 * 
 * @param {File | FileWithPreview} file - File to get color for
 * @returns {string} Tailwind CSS gradient classes
 */
export const getIconContainerColor = (file: File | FileWithPreview): string => {
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
 * 
 * @param {File} file - Image file to create preview for
 * @returns {Promise<string>} Promise resolving to base64 data URL
 */
export const createImagePreview = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

/**
 * Validate a file against size, type, and custom validation rules
 * 
 * @param {File} file - File to validate
 * @param {number} maxSize - Maximum allowed file size in bytes
 * @param {string} accept - Accepted file types (MIME types or extensions)
 * @param {(file: File) => { isValid: boolean; error?: string }} [customValidate] - Custom validation function
 * @returns {{ isValid: boolean; error?: string }} Validation result
 */
export const validateFile = (
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
 * 
 * @returns {string} Randomly generated file ID
 */
export const generateFileId = (): string => {
    return Math.random().toString(36).substring(2, 9);
};