import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import UploadButton from '../../components/UploadButton';
import type { UploadButtonProps } from '../../types';

// Mock dependencies
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
        span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    },
}));

vi.mock('lucide-react', () => ({
    Upload: () => <div data-testid="upload-icon">Upload</div>,
    Trash2: () => <div data-testid="trash-icon">Trash2</div>,
    Loader2: () => <div data-testid="loader-icon">Loader2</div>,
}));

vi.mock('../../../button', () => ({
    Button: ({ children, onClick, disabled, variant, className, type = 'button', ...props }: any) => (
        <button
            data-testid={`button-${variant || 'default'}`}
            onClick={onClick}
            disabled={disabled}
            data-variant={variant}
            className={className}
            type={type}
            {...props}
        >
            {children}
        </button>
    ),
}));

vi.mock('../../../../utils/cn', () => ({
    cn: (...args: any[]) => args.filter(Boolean).join(' '),
}));

describe('UploadButton Component', () => {
    const mockFiles = [
        { id: '1', name: 'test1.txt', size: 1024, type: 'text/plain', lastModified: Date.now() },
        { id: '2', name: 'test2.txt', size: 2048, type: 'text/plain', lastModified: Date.now() },
    ];

    const defaultProps: UploadButtonProps = {
        buttonText: 'Upload Files',
        buttonVariant: 'primary',
        files: mockFiles,
        isUploading: false,
        disabled: false,
        onClick: vi.fn(),
        onClearAll: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders with button text', () => {
        render(<UploadButton {...defaultProps} />);

        expect(screen.getByText('Upload Files')).toBeInTheDocument();
        expect(screen.getByTestId('upload-icon')).toBeInTheDocument();
    });

    it('shows uploading text when isUploading is true', () => {
        render(<UploadButton {...defaultProps} isUploading={true} />);

        expect(screen.getByText('Uploading...')).toBeInTheDocument();
        // Use getAllByTestId since there are multiple loader icons when uploading
        const loaderIcons = screen.getAllByTestId('loader-icon');
        expect(loaderIcons.length).toBeGreaterThan(0);
    });

    it('shows file count', () => {
        render(<UploadButton {...defaultProps} />);

        expect(screen.getByText('2 selected')).toBeInTheDocument();
    });

    it('shows uploading badge when isUploading is true', () => {
        render(<UploadButton {...defaultProps} isUploading={true} />);

        expect(screen.getByText('Uploading')).toBeInTheDocument();
    });

    it('shows clear all button when files exist', () => {
        render(<UploadButton {...defaultProps} />);

        expect(screen.getByText('Clear All')).toBeInTheDocument();
        expect(screen.getByTestId('trash-icon')).toBeInTheDocument();
    });

    it('does not show clear all button when no files', () => {
        render(<UploadButton {...defaultProps} files={[]} />);

        expect(screen.queryByText('Clear All')).not.toBeInTheDocument();
    });

    it('calls onClick when upload button is clicked', () => {
        const onClick = vi.fn();
        render(<UploadButton {...defaultProps} onClick={onClick} />);

        fireEvent.click(screen.getByText('Upload Files'));
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('calls onClearAll when clear all button is clicked', () => {
        const onClearAll = vi.fn();
        render(<UploadButton {...defaultProps} onClearAll={onClearAll} />);

        fireEvent.click(screen.getByText('Clear All'));
        expect(onClearAll).toHaveBeenCalledTimes(1);
    });

    it('disables upload button when disabled prop is true', () => {
        render(<UploadButton {...defaultProps} disabled={true} />);

        const uploadButton = screen.getByText('Upload Files').closest('button');
        expect(uploadButton).toBeDisabled();
    });

    it('disables upload button when isUploading is true', () => {
        render(<UploadButton {...defaultProps} isUploading={true} />);

        const uploadButton = screen.getByText('Uploading...').closest('button');
        expect(uploadButton).toBeDisabled();
    });

    it('disables clear all button when isUploading is true', () => {
        render(<UploadButton {...defaultProps} isUploading={true} />);

        const clearAllButton = screen.getByText('Clear All');
        expect(clearAllButton).toBeDisabled();
    });

    it('applies correct button variant', () => {
        render(<UploadButton {...defaultProps} buttonVariant="secondary" />);

        // Get the upload button by its variant
        const uploadButton = screen.getByTestId('button-secondary');
        expect(uploadButton).toHaveAttribute('data-variant', 'secondary');

        // The clear all button should still have ghost variant
        const clearAllButton = screen.getByTestId('button-ghost');
        expect(clearAllButton).toHaveAttribute('data-variant', 'ghost');
    });

    it('renders correctly with no files', () => {
        render(<UploadButton {...defaultProps} files={[]} />);

        expect(screen.getByText('Upload Files')).toBeInTheDocument();
        expect(screen.getByText('0 selected')).toBeInTheDocument();
        expect(screen.queryByText('Clear All')).not.toBeInTheDocument();
    });

    it('has correct button type', () => {
        render(<UploadButton {...defaultProps} />);

        // Check both buttons have type="button"
        const uploadButton = screen.getByTestId('button-primary');
        const clearAllButton = screen.getByTestId('button-ghost');

        expect(uploadButton).toHaveAttribute('type', 'button');
        expect(clearAllButton).toHaveAttribute('type', 'button');
    });

    it('applies custom className to button', () => {
        render(<UploadButton {...defaultProps} />);

        const uploadButton = screen.getByTestId('button-primary');
        expect(uploadButton.className).toContain('relative overflow-hidden group');
    });
});