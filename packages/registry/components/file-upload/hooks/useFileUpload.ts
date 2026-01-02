import { useState, useCallback, useRef } from 'react';
import { type FileWithPreview, type UseFileUploadProps } from '../types';
import { 
    createImagePreview, 
    validateFile, 
    isImageFile, 
    generateFileId,
} from '../utils';

/**
 * Custom React hook for managing file upload state and operations
 * 
 * @param {UseFileUploadProps} props - Hook configuration
 * @returns {{
 *   files: FileWithPreview[],
 *   dragActive: boolean,
 *   validationErrors: string[],
 *   isUploading: boolean,
 *   fileInputRef: React.RefObject<HTMLInputElement>,
 *   handleDrag: (e: React.DragEvent) => void,
 *   handleDrop: (e: React.DragEvent) => void,
 *   handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
 *   handleFiles: (files: FileList | File[]) => Promise<void>,
 *   removeFile: (id: string) => void,
 *   clearAll: () => void,
 *   handleButtonClick: () => void,
 *   setDragActive: React.Dispatch<React.SetStateAction<boolean>>,
 *   setValidationErrors: React.Dispatch<React.SetStateAction<string[]>>
 * }}
 * 
 * @example
 * ```tsx
 * const {
 *   files,
 *   dragActive,
 *   validationErrors,
 *   isUploading,
 *   fileInputRef,
 *   handleDrag,
 *   handleDrop,
 *   handleChange,
 *   handleFiles,
 *   removeFile,
 *   clearAll,
 *   handleButtonClick
 * } = useFileUpload({
 *   multiple: true,
 *   maxFiles: 5,
 *   maxSize: 5242880, // 5MB
 *   accept: 'image/*',
 *   simulateUpload: true,
 *   onFilesChange: (files) => console.log('Files changed:', files)
 * });
 * ```
 */
export const useFileUpload = ({
    multiple = false,
    maxFiles = 10,
    maxSize = 10 * 1024 * 1024,
    accept = '*/*',
    validateFile: customValidate,
    simulateUpload = false,
    onFilesChange
}: UseFileUploadProps) => {

    const [files, setFiles] = useState<FileWithPreview[]>([]);
    const [originalFiles, setOriginalFiles] = useState<File[]>([]); // Store original File objects
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

    /**
     * Main function to handle file selection and validation
     * 
     * @param {FileList | File[]} selectedFiles - Files to process
     * @returns {Promise<void>}
     */
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
        const validOriginalFiles: File[] = []; // Store original File objects

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
                
                validOriginalFiles.push(file); // Store the original File
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
            
            // Pass the actual File objects to the callback
            onFilesChange?.(updatedOriginalFiles);

            if (simulateUpload) {
                setIsUploading(true);
                validFiles.forEach(file => simulateUploadProgress(file.id));
                setTimeout(() => setIsUploading(false), 3000);
            }
        }
    }, [files, originalFiles, multiple, maxFiles, maxSize, accept, customValidate, simulateUpload, simulateUploadProgress, onFilesChange]);

    /**
     * Handles drag events for the dropzone
     * 
     * @param {React.DragEvent} e - Drag event
     */
    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(e.type === 'dragenter' || e.type === 'dragover');
    }, []);

        /**
     * Handles drop events for the dropzone
     * 
     * @param {React.DragEvent} e - Drop event
     */
    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files?.length > 0) handleFiles(e.dataTransfer.files);
    }, [handleFiles]);

        /**
     * Handles file input change events
     * 
     * @param {React.ChangeEvent<HTMLInputElement>} e - Change event
     */

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        const target = e.target as HTMLInputElement;
        const files = target.files;
    
        if (files && files.length > 0) {
            handleFiles(files);
            target.value = ''; // Reset the input
        }
    }, [handleFiles]);

        /**
     * Validates the current file state
     * 
     * @param {FileWithPreview[]} currentFiles - Files to validate
     * @returns {string[]} Array of validation error messages
     */
// Add this helper function
    const validateState = useCallback((currentFiles: FileWithPreview[]) => {
        const errors: string[] = [];
        
        // Check max files
        if (multiple && currentFiles.length > maxFiles) {
            errors.push(`Maximum ${maxFiles} files allowed`);
        }
        
        // Check each file's validation (if needed)
        // You can add individual file validation here if necessary
        
        return errors;
    }, [multiple, maxFiles]);

        /**
     * Removes a specific file by ID
     * 
     * @param {string} id - ID of the file to remove
     */// Update the removeFile function
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
        
        // Revalidate the entire state
        const newErrors = validateState(updatedFiles);
        setValidationErrors(newErrors);
    }, [files, originalFiles, validateState, onFilesChange]);

        /**
     * Clears all files and resets state
     */
    const clearAll = useCallback(() => {
        setFiles([]);
        setOriginalFiles([]);
        setValidationErrors([]); // This already clears errors
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