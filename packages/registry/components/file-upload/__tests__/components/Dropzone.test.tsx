import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import Dropzone from '../../components/Dropzone';
import type { DropzoneProps } from '../../types';

// Mock framer-motion
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
        h3: ({ children, ...props }: any) => <h3 {...props}>{children}</h3>,
        p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
        span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    },
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
    Upload: () => <div data-testid="upload-icon">Upload Icon</div>,
    Sparkles: () => <div data-testid="sparkles-icon">Sparkles Icon</div>,
    Loader2: () => <div data-testid="loader-icon">Loader2 Icon</div>,
}));

// Mock utils
vi.mock('../utils', () => ({
    formatFileSize: vi.fn((bytes) => {
        if (bytes >= 1024 * 1024) return `${bytes / (1024 * 1024)} MB`;
        if (bytes >= 1024) return `${bytes / 1024} KB`;
        return `${bytes} Bytes`;
    }),
}));

vi.mock('../../../../utils/cn', () => ({
    cn: (...args: any[]) => args.filter(Boolean).join(' '),
}));

describe('Dropzone Component', () => {
    const defaultProps: DropzoneProps = {
        dragActive: false,
        isUploading: false,
        disabled: false,
        dropzoneText: 'Drag & drop files here or click to browse',
        accept: '*/*',
        maxSize: 10 * 1024 * 1024,
        multiple: true,
        maxFiles: 10,
        onClick: vi.fn(),
        onDragEnter: vi.fn(),
        onDragLeave: vi.fn(),
        onDragOver: vi.fn(),
        onDrop: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders with default props', () => {
        render(<Dropzone {...defaultProps} />);

        expect(screen.getByRole('button')).toBeInTheDocument();
        expect(screen.getByText('Drag & drop files here or click to browse')).toBeInTheDocument();
        expect(screen.getByTestId('upload-icon')).toBeInTheDocument();
    });

    it('shows upload text when not uploading', () => {
        render(<Dropzone {...defaultProps} />);

        expect(screen.getByText('Drag & drop files here or click to browse')).toBeInTheDocument();
        expect(screen.queryByText('Uploading...')).not.toBeInTheDocument();
    });

    // it('shows uploading text when isUploading is true', () => {
    //     render(<Dropzone {...defaultProps} isUploading={true} />);

    //     expect(screen.getByText('Uploading...')).toBeInTheDocument();
    //     expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
    // });

    it('shows sparkles icon when dragActive is true', () => {
        render(<Dropzone {...defaultProps} dragActive={true} />);

        expect(screen.getByTestId('sparkles-icon')).toBeInTheDocument();
    });

    it('applies correct classes when dragActive', () => {
        render(<Dropzone {...defaultProps} dragActive={true} />);

        const dropzone = screen.getByRole('button');
        expect(dropzone.className).toContain('border-slate-400');
    });

    it('applies disabled styles when disabled', () => {
        render(<Dropzone {...defaultProps} disabled={true} />);

        const dropzone = screen.getByRole('button');
        expect(dropzone.className).toContain('opacity-50');
        expect(dropzone.className).toContain('cursor-not-allowed');
    });

    it('applies disabled styles when uploading', () => {
        render(<Dropzone {...defaultProps} isUploading={true} />);

        const dropzone = screen.getByRole('button');
        expect(dropzone.className).toContain('pointer-events-none');
    });

    it('calls onClick when clicked', () => {
        const handleClick = vi.fn();
        render(<Dropzone {...defaultProps} onClick={handleClick} />);

        fireEvent.click(screen.getByRole('button'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('calls drag event handlers', () => {
        const onDragEnter = vi.fn();
        const onDragLeave = vi.fn();
        const onDragOver = vi.fn();
        const onDrop = vi.fn();

        render(
            <Dropzone
                {...defaultProps}
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
                onDragOver={onDragOver}
                onDrop={onDrop}
            />
        );

        const dropzone = screen.getByRole('button');

        fireEvent.dragEnter(dropzone);
        expect(onDragEnter).toHaveBeenCalledTimes(1);

        fireEvent.dragLeave(dropzone);
        expect(onDragLeave).toHaveBeenCalledTimes(1);

        fireEvent.dragOver(dropzone);
        expect(onDragOver).toHaveBeenCalledTimes(1);

        fireEvent.drop(dropzone);
        expect(onDrop).toHaveBeenCalledTimes(1);
    });

    it('shows max size information', () => {
        render(<Dropzone {...defaultProps} maxSize={5242880} />);

        expect(screen.getByText(/Max size:/)).toBeInTheDocument();
    });

    it('shows max files information when multiple is true', () => {
        render(<Dropzone {...defaultProps} multiple={true} maxFiles={5} />);

        expect(screen.getByText(/Max files: 5/)).toBeInTheDocument();
    });

    it('has correct accessibility attributes when disabled', () => {
        render(<Dropzone {...defaultProps} disabled={true} />);

        const dropzone = screen.getByRole('button');
        expect(dropzone).toHaveAttribute('tabIndex', '-1');
    });

    it('has correct accessibility attributes when enabled', () => {
        render(<Dropzone {...defaultProps} disabled={false} />);

        const dropzone = screen.getByRole('button');
        expect(dropzone).toHaveAttribute('tabIndex', '0');
    });

    it('has correct aria-label', () => {
        render(<Dropzone {...defaultProps} />);

        const dropzone = screen.getByRole('button');
        expect(dropzone).toHaveAttribute('aria-label', 'File drop zone');
    });

    it('shows processing message when uploading', () => {
        render(<Dropzone {...defaultProps} isUploading={true} />);

        expect(screen.getByText('Processing your files...')).toBeInTheDocument();
    });
});