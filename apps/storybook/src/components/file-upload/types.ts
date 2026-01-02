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


export interface UploadButtonProps {
    buttonText: string;
    buttonVariant: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost';
    files: FileWithPreview[];
    isUploading: boolean;
    disabled: boolean;
    onClick: () => void;
    onClearAll: () => void;
}


export interface FileListProps {
    files: FileWithPreview[];
    isUploading: boolean;
    onRemoveFile: (id: string) => void;
    onClearAll: () => void;
    imageAvatarShape?: 'circle' | 'square' | 'rounded' | 'hexagon' | 'diamond';
    imageAvatarSize?: 'xs' | 'sm' | 'md' | 'lg';
}

export interface FileItemProps {
    file: FileWithPreview;
    index: number;
    onRemove: (id: string) => void;
    imageAvatarShape?: 'circle' | 'square' | 'rounded' | 'hexagon' | 'diamond';
    imageAvatarSize?: 'xs' | 'sm' | 'md' | 'lg';
}

export interface ValidationErrorsProps {
    errors: string[];
}

export interface DropzoneProps {
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

export interface UseFileUploadProps {
    multiple?: boolean;
    maxFiles?: number;
    maxSize?: number;
    accept?: string;
    validateFile?: (file: File) => { isValid: boolean; error?: string };
    simulateUpload?: boolean;
    onFilesChange?: (files: File[]) => void;
}