import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import FileList from '../../components/FileList';
import type { FileListProps, FileWithPreview } from '../../types';

// Mock dependencies
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
        button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
        span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
        li: ({ children, ...props }: any) => <li {...props}>{children}</li>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));

vi.mock('lucide-react', () => ({
    FileText: () => <div data-testid="file-text-icon">FileText</div>,
    File: () => <div data-testid="file-icon">File</div>,
    FileImage: () => <div data-testid="file-image-icon">FileImage</div>,
    Video: () => <div data-testid="video-icon">Video</div>,
    Music: () => <div data-testid="music-icon">Music</div>,
    Archive: () => <div data-testid="archive-icon">Archive</div>,
    AlertCircle: () => <div data-testid="alert-circle-icon">AlertCircle</div>,
    CheckCircle: () => <div data-testid="check-circle-icon">CheckCircle</div>,
    Loader2: () => <div data-testid="loader-icon">Loader2</div>,
    Trash2: () => <div data-testid="trash-icon">Trash2</div>,
}));

vi.mock('../../../typography', () => ({
    Typography: ({ children, variant, className, ...props }: any) => (
        <div data-testid={`typography-${variant}`} className={className} {...props}>
            {children}
        </div>
    ),
}));

vi.mock('../../../avatar', () => ({
    Avatar: ({ src, alt, size, shape, className }: any) => (
        <div
            data-testid="avatar"
            data-src={src}
            data-alt={alt}
            data-size={size}
            data-shape={shape}
            className={className}
        >
            Avatar: {alt}
        </div>
    ),
}));

vi.mock('../../../../utils/cn', () => ({
    cn: (...args: any[]) => args.filter(Boolean).join(' '),
}));

// Create mock functions that we can control
const mockFormatFileSize = vi.fn();
const mockIsImageFile = vi.fn();
const mockGetFileIcon = vi.fn();
const mockGetFileTypeText = vi.fn();
const mockGetIconContainerColor = vi.fn();

// IMPORTANT: Fix the import path - use the correct relative path from the component
vi.mock('../../utils/file-utils', () => ({
    formatFileSize: mockFormatFileSize,
    isImageFile: mockIsImageFile,
    getFileIcon: mockGetFileIcon,
    getFileTypeText: mockGetFileTypeText,
    getIconContainerColor: mockGetIconContainerColor,
}));

describe('FileList Component', () => {
    const mockFiles: FileWithPreview[] = [
        {
            id: '1',
            name: 'document.pdf',
            type: 'application/pdf',
            size: 1024 * 1024, // 1MB
            lastModified: Date.now(),
            preview: undefined,
            uploading: false,
            uploadProgress: undefined,
        },
        {
            id: '2',
            name: 'image.png',
            type: 'image/png',
            size: 2048 * 1024, // 2MB
            lastModified: Date.now(),
            preview: 'data:image/png;base64,mocked',
            uploading: true,
            uploadProgress: 50,
        },
        {
            id: '3',
            name: 'error.txt',
            type: 'text/plain',
            size: 512,
            lastModified: Date.now(),
            preview: undefined,
            uploading: false,
            uploadProgress: undefined,
            error: 'File type not allowed',
        },
    ];

    const defaultProps: FileListProps = {
        files: mockFiles,
        isUploading: false,
        onRemoveFile: vi.fn(),
        onClearAll: vi.fn(),
        imageAvatarShape: 'circle',
        imageAvatarSize: 'md',
    };

    beforeEach(() => {
        vi.clearAllMocks();

        // Setup default mock implementations
        mockFormatFileSize.mockImplementation((bytes) => {
            if (bytes === 1024 * 1024) return '1 MB';
            if (bytes === 2048 * 1024) return '2 MB';
            if (bytes === 512) return '512 B';
            return `${bytes} B`;
        });

        mockIsImageFile.mockImplementation((file) => {
            if (file.name === 'image.png') return true;
            return false;
        });

        mockGetFileIcon.mockImplementation((file) => {
            if (file.name === 'document.pdf') return 'FileText';
            if (file.name === 'image.png') return 'FileImage';
            if (file.name === 'error.txt') return 'AlertCircle';
            return 'File';
        });

        mockGetFileTypeText.mockImplementation((file) => {
            if (file.name === 'document.pdf') return 'PDF';
            if (file.name === 'image.png') return 'IMAGE';
            return 'FILE';
        });

        mockGetIconContainerColor.mockReturnValue('bg-gradient-to-br from-slate-50 to-slate-100');
    });

    it('renders with files', () => {
        render(<FileList {...defaultProps} />);

        expect(screen.getByText('Selected Files')).toBeInTheDocument();
        expect(screen.getByText('3 files')).toBeInTheDocument();
    });

    it('shows clear all button when files exist', () => {
        render(<FileList {...defaultProps} />);

        expect(screen.getByText('Clear All')).toBeInTheDocument();
    });

    it('does not show clear all button when no files', () => {
        render(<FileList {...defaultProps} files={[]} />);

        expect(screen.queryByText('Clear All')).not.toBeInTheDocument();
    });

    it('calls onClearAll when clear all button is clicked', () => {
        const onClearAll = vi.fn();
        render(<FileList {...defaultProps} onClearAll={onClearAll} />);

        fireEvent.click(screen.getByText('Clear All'));
        expect(onClearAll).toHaveBeenCalledTimes(1);
    });

    it('calls onRemoveFile when remove button is clicked', () => {
        const onRemoveFile = vi.fn();
        render(<FileList {...defaultProps} onRemoveFile={onRemoveFile} />);

        // Find all remove buttons (parent of trash icon)
        const removeButtons = screen.getAllByTestId('trash-icon').map(el => el.parentElement);
        fireEvent.click(removeButtons[0]!);

        expect(onRemoveFile).toHaveBeenCalledWith('1');
    });

    it('disables clear all button when isUploading is true', () => {
        render(<FileList {...defaultProps} isUploading={true} />);

        const clearAllButton = screen.getByText('Clear All');
        expect(clearAllButton).toBeDisabled();
    });

    it('renders empty state when no files', () => {
        render(<FileList {...defaultProps} files={[]} />);

        expect(screen.queryByText('Selected Files')).toBeInTheDocument();
        expect(screen.queryByText('3 files')).not.toBeInTheDocument();
    });

    it('shows avatar for image files with preview', () => {
        // Set up specific mock for this test
        mockIsImageFile.mockImplementation((file) => file.name === 'image.png');

        render(<FileList {...defaultProps} />);

        // Use getAllByTestId since there might be multiple avatars or none
        const avatars = screen.getAllByTestId('avatar');
        expect(avatars.length).toBeGreaterThan(0);

        // Find the avatar for the image file
        const imageAvatar = avatars.find(avatar =>
            avatar.getAttribute('data-alt')?.includes('image.png')
        );
        expect(imageAvatar).toBeInTheDocument();
        expect(imageAvatar).toHaveAttribute('data-src', 'data:image/png;base64,mocked');
    });

    it('shows icon container for non-image files', () => {
        render(<FileList {...defaultProps} />);

        // Use getAllByTestId since there are multiple file-text icons
        const fileIcons = screen.getAllByTestId('file-text-icon');
        expect(fileIcons.length).toBeGreaterThan(0);
    });

    it('shows upload progress for uploading files', () => {
        render(<FileList {...defaultProps} />);

        expect(screen.getByText('Uploading')).toBeInTheDocument();
        expect(screen.getByText('50%')).toBeInTheDocument();
    });

    it('shows error message for files with errors', () => {
        render(<FileList {...defaultProps} />);

        expect(screen.getByText('File type not allowed')).toBeInTheDocument();

        // Use getAllByTestId since there might be multiple alert icons
        const alertIcons = screen.getAllByTestId('alert-circle-icon');
        expect(alertIcons.length).toBeGreaterThan(0);
    });

    it('shows check circle for successful files', () => {
        render(<FileList {...defaultProps} />);

        const checkCircles = screen.getAllByTestId('check-circle-icon');
        expect(checkCircles).toHaveLength(1); // Only document.pdf is successful
    });

    it('shows loader for uploading files', () => {
        render(<FileList {...defaultProps} />);

        const loaders = screen.getAllByTestId('loader-icon');
        expect(loaders).toHaveLength(1); // Only image.png is uploading
    });

    it('passes imageAvatarShape and imageAvatarSize to Avatar', () => {
        mockIsImageFile.mockImplementation((file) => file.name === 'image.png');

        render(
            <FileList
                {...defaultProps}
                imageAvatarShape="square"
                imageAvatarSize="lg"
            />
        );

        const avatars = screen.getAllByTestId('avatar');
        const imageAvatar = avatars.find(avatar =>
            avatar.getAttribute('data-alt')?.includes('image.png')
        );

        expect(imageAvatar).toHaveAttribute('data-shape', 'square');
        expect(imageAvatar).toHaveAttribute('data-size', 'lg');
    });

    it('disables remove button when file is uploading', () => {
        render(<FileList {...defaultProps} />);

        // All remove buttons
        const removeButtons = screen.getAllByTestId('trash-icon');
        // The second file is uploading, so its parent button should have disabled styling
        const uploadingFileRemoveButton = removeButtons[1].parentElement;
        expect(uploadingFileRemoveButton).toHaveAttribute('disabled');
    });
});