'use client';


import React from 'react';
import { cn } from '../../../utils/cn';
import type { FileUploadProps } from './types';
import { useFileUpload } from './hooks/useFileUpload';
import Dropzone from './components/Dropzone';
import UploadButton from './components/UploadButton';
import FileList from './components/FileList';
import ValidationErrors from './components/ValidationErrors';

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
                    <UploadButton
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