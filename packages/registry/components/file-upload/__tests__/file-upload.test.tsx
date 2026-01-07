import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { FileUpload } from '../index';
import type { FileUploadProps } from '../types';

// Mock all dependencies with simple inline implementations
vi.mock('../components/Dropzone', () => ({
    default: vi.fn(({ dropzoneText, dragActive, disabled }: any) => (
        <div
            data-testid="dropzone"
            data-dragactive={dragActive}
            data-disabled={disabled}
        >
            {dropzoneText}
        </div>
    ))
}));

vi.mock('../components/UploadButton', () => ({
    default: vi.fn(({ buttonText, buttonVariant, files, disabled }: any) => (
        <div
            data-testid="upload-button"
            data-filecount={files.length}
            data-disabled={disabled}
            data-buttonvariant={buttonVariant}
        >
            {buttonText}
        </div>
    ))
}));

vi.mock('../components/FileList', () => ({
    default: vi.fn(({ files, imageAvatarShape, imageAvatarSize }: any) => (
        files.length > 0 ? (
            <div
                data-testid="file-list"
                data-filecount={files.length}
                data-avatarshape={imageAvatarShape}
                data-avatarsize={imageAvatarSize}
            >
                FileList Component
            </div>
        ) : null
    ))
}));

vi.mock('../components/ValidationErrors', () => ({
    default: vi.fn(({ errors }: any) => (
        errors && errors.length > 0 ? (
            <div data-testid="validation-errors">
                {errors.length} errors
            </div>
        ) : null
    ))
}));

// Mock useFileUpload with a simple implementation
let mockUseFileUploadReturn: any = {
    files: [],
    dragActive: false,
    validationErrors: [],
    isUploading: false,
    fileInputRef: { current: null },
    handleDrag: vi.fn(),
    handleDrop: vi.fn(),
    handleChange: vi.fn(),
    handleButtonClick: vi.fn(),
    removeFile: vi.fn(),
    clearAll: vi.fn()
};

vi.mock('../hooks/useFileUpload', () => ({
    useFileUpload: vi.fn(() => mockUseFileUploadReturn)
}));

vi.mock('../../../../utils/cn', () => ({
    cn: (...args: any[]) => args.filter(Boolean).join(' ')
}));

describe('FileUpload - Main Component', () => {
    const defaultProps: FileUploadProps = {
        onFilesChange: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();

        // Reset the mock return value
        mockUseFileUploadReturn = {
            files: [],
            dragActive: false,
            validationErrors: [],
            isUploading: false,
            fileInputRef: { current: null },
            handleDrag: vi.fn(),
            handleDrop: vi.fn(),
            handleChange: vi.fn(),
            handleButtonClick: vi.fn(),
            removeFile: vi.fn(),
            clearAll: vi.fn()
        };
    });

    it('renders with default props', () => {
        render(<FileUpload {...defaultProps} />);

        expect(screen.getByTestId('dropzone')).toBeInTheDocument();
        expect(screen.getByTestId('upload-button')).toBeInTheDocument();
        expect(screen.getByTestId('dropzone')).toHaveTextContent('Drag & drop files here or click to browse');
    });

    it('renders only button when mode="button"', () => {
        render(<FileUpload {...defaultProps} mode="button" />);

        expect(screen.getByTestId('upload-button')).toBeInTheDocument();
        expect(screen.queryByTestId('dropzone')).not.toBeInTheDocument();
    });

    it('renders only dropzone when mode="dropzone"', () => {
        render(<FileUpload {...defaultProps} mode="dropzone" />);

        expect(screen.getByTestId('dropzone')).toBeInTheDocument();
        expect(screen.queryByTestId('upload-button')).not.toBeInTheDocument();
    });

    it('renders both when mode="both"', () => {
        render(<FileUpload {...defaultProps} mode="both" />);

        expect(screen.getByTestId('dropzone')).toBeInTheDocument();
        expect(screen.getByTestId('upload-button')).toBeInTheDocument();
    });

    it('passes disabled prop to child components', () => {
        render(<FileUpload {...defaultProps} disabled={true} />);

        expect(screen.getByTestId('dropzone')).toHaveAttribute('data-disabled', 'true');
        expect(screen.getByTestId('upload-button')).toHaveAttribute('data-disabled', 'true');
    });

    it('passes buttonVariant to UploadButton', () => {
        render(<FileUpload {...defaultProps} buttonVariant="secondary" />);

        expect(screen.getByTestId('upload-button')).toHaveAttribute('data-buttonvariant', 'secondary');
    });

    it('passes dropzoneText to Dropzone', () => {
        render(<FileUpload {...defaultProps} dropzoneText="Custom Dropzone Text" />);

        expect(screen.getByTestId('dropzone')).toHaveTextContent('Custom Dropzone Text');
    });

    it('shows file list when showFileList is true and files exist', () => {
        mockUseFileUploadReturn.files = [{
            id: '1',
            name: 'test.txt',
            size: 1024,
            type: 'text/plain',
            lastModified: Date.now()
        }];

        render(<FileUpload {...defaultProps} showFileList={true} />);

        expect(screen.getByTestId('file-list')).toBeInTheDocument();
        expect(screen.getByTestId('file-list')).toHaveAttribute('data-filecount', '1');
    });

    it('hides file list when showFileList is false', () => {
        mockUseFileUploadReturn.files = [{
            id: '1',
            name: 'test.txt',
            size: 1024,
            type: 'text/plain',
            lastModified: Date.now()
        }];

        render(<FileUpload {...defaultProps} showFileList={false} />);

        expect(screen.queryByTestId('file-list')).not.toBeInTheDocument();
    });

    it('does not show file list when no files', () => {
        render(<FileUpload {...defaultProps} showFileList={true} />);

        expect(screen.queryByTestId('file-list')).not.toBeInTheDocument();
    });

    it('renders hidden file input', () => {
        render(<FileUpload {...defaultProps} />);

        const fileInput = screen.getByLabelText('File input');
        expect(fileInput).toHaveAttribute('type', 'file');
        expect(fileInput).toHaveClass('hidden');
    });

    it('passes accept prop to file input', () => {
        render(<FileUpload {...defaultProps} accept="image/*" />);

        const fileInput = screen.getByLabelText('File input');
        expect(fileInput).toHaveAttribute('accept', 'image/*');
    });

    it('passes multiple prop to file input', () => {
        render(<FileUpload {...defaultProps} multiple={true} />);

        const fileInput = screen.getByLabelText('File input');
        expect(fileInput).toHaveAttribute('multiple');
    });

    it('disables file input when uploading', () => {
        mockUseFileUploadReturn.isUploading = true;

        render(<FileUpload {...defaultProps} disabled={false} />);

        const fileInput = screen.getByLabelText('File input');
        expect(fileInput).toBeDisabled();
    });

    it('shows validation errors when they exist', () => {
        mockUseFileUploadReturn.validationErrors = ['File too large', 'Invalid file type'];

        render(<FileUpload {...defaultProps} />);

        expect(screen.getByTestId('validation-errors')).toBeInTheDocument();
        expect(screen.getByTestId('validation-errors')).toHaveTextContent('2 errors');
    });

    it('does not show validation errors when array is empty', () => {
        render(<FileUpload {...defaultProps} />);

        expect(screen.queryByTestId('validation-errors')).not.toBeInTheDocument();
    });

    it('handles custom button text', () => {
        render(<FileUpload {...defaultProps} buttonText="Choose Files" />);

        expect(screen.getByTestId('upload-button')).toHaveTextContent('Choose Files');
    });

    it('shows upload button with files count', () => {
        mockUseFileUploadReturn.files = [
            { id: '1', name: 'test1.txt', size: 1024, type: 'text/plain', lastModified: Date.now() },
            { id: '2', name: 'test2.txt', size: 2048, type: 'text/plain', lastModified: Date.now() }
        ];

        render(<FileUpload {...defaultProps} />);

        expect(screen.getByTestId('upload-button')).toHaveAttribute('data-filecount', '2');
    });

    it('applies custom className', () => {
        render(<FileUpload {...defaultProps} className="custom-class" />);

        const dropzone = screen.getByTestId('dropzone');
        const container = dropzone.parentElement?.parentElement;
        expect(container).toHaveClass('custom-class');
    });

});