import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import useFileUpload from '../useFileUpload';
import type { FileUploadOptions } from '../../types';

// Create mock functions outside the vi.mock
const mockValidateFile = vi.fn();
const mockIsImageFile = vi.fn();
const mockGenerateFileId = vi.fn();
const mockCreateImagePreview = vi.fn();

// Mock the utility modules
vi.mock('../../utils/file-validation', () => ({
    validateFile: mockValidateFile,
    isImageFile: mockIsImageFile,
    generateFileId: mockGenerateFileId,
}));

vi.mock('../../utils/image-preview', () => ({
    createImagePreview: mockCreateImagePreview,
}));

// Mock HTMLInputElement methods
Object.defineProperty(global, 'File', {
    writable: true,
    value: vi.fn().mockImplementation((parts, filename, options) => ({
        name: filename,
        size: options?.size || 1024,
        type: options?.type || 'text/plain',
        lastModified: Date.now(),
        arrayBuffer: vi.fn(),
        slice: vi.fn(),
        stream: vi.fn(),
        text: vi.fn(),
    })),
});

// Mock URL.createObjectURL
global.URL.createObjectURL = vi.fn(() => 'mock-url');

// Mock URL.revokeObjectURL
global.URL.revokeObjectURL = vi.fn();

describe('useFileUpload Hook', () => {
    const defaultOptions: FileUploadOptions = {
        accept: 'image/*',
        maxSize: 1024 * 1024 * 10, // 10MB
        maxFiles: 5,
        multiple: true,
        simulateUpload: false,
    };

    const createMockFile = (name: string, size: number, type: string) => {
        return new File(['test'], name, { type, size });
    };

    beforeEach(() => {
        vi.clearAllMocks();
        mockValidateFile.mockReturnValue({ isValid: true, errors: [] });
        mockIsImageFile.mockReturnValue(false);
        mockGenerateFileId.mockReturnValue('mock-id');
        mockCreateImagePreview.mockResolvedValue('mock-preview-url');
    });

    it('returns initial state', () => {
        const { result } = renderHook(() => useFileUpload(defaultOptions));

        expect(result.current.files).toEqual([]);
        expect(result.current.dragActive).toBe(false);
        expect(result.current.isUploading).toBe(false);
        expect(result.current.validationErrors).toEqual([]);
        expect(result.current.fileInputRef.current).toBeNull();
        expect(typeof result.current.handleFiles).toBe('function');
        expect(typeof result.current.handleDrag).toBe('function');
        expect(typeof result.current.handleDrop).toBe('function');
        expect(typeof result.current.handleChange).toBe('function');
        expect(typeof result.current.removeFile).toBe('function');
        expect(typeof result.current.clearAll).toBe('function');
        expect(typeof result.current.handleButtonClick).toBe('function');
    });

    it('handleFiles - adds single file when multiple is false', async () => {
        const options = { ...defaultOptions, multiple: false };
        const { result } = renderHook(() => useFileUpload(options));

        const mockFile = createMockFile('test.jpg', 1024, 'image/jpeg');

        await act(async () => {
            await result.current.handleFiles([mockFile]);
        });

        expect(result.current.files).toHaveLength(1);
        expect(mockValidateFile).toHaveBeenCalledWith(mockFile, options);
    });

    it('handleFiles - adds multiple files when multiple is true', async () => {
        const { result } = renderHook(() => useFileUpload(defaultOptions));

        const mockFiles = [
            createMockFile('test1.jpg', 1024, 'image/jpeg'),
            createMockFile('test2.jpg', 2048, 'image/jpeg'),
        ];

        await act(async () => {
            await result.current.handleFiles(mockFiles);
        });

        expect(result.current.files).toHaveLength(2);
        expect(mockValidateFile).toHaveBeenCalledTimes(2);
    });

    it('handleFiles - validates files before adding', async () => {
        const { result } = renderHook(() => useFileUpload(defaultOptions));

        const mockFile = createMockFile('test.jpg', 1024, 'image/jpeg');
        const validationError = { isValid: false, errors: ['File too large'] };

        mockValidateFile.mockReturnValueOnce(validationError);

        await act(async () => {
            await result.current.handleFiles([mockFile]);
        });

        expect(result.current.files).toHaveLength(0);
        expect(result.current.validationErrors).toEqual(['File too large']);
    });

    it('handleFiles - rejects when single file upload and multiple files selected', async () => {
        const options = { ...defaultOptions, multiple: false };
        const { result } = renderHook(() => useFileUpload(options));

        const mockFiles = [
            createMockFile('test1.jpg', 1024, 'image/jpeg'),
            createMockFile('test2.jpg', 2048, 'image/jpeg'),
        ];

        await act(async () => {
            await result.current.handleFiles(mockFiles);
        });

        expect(result.current.files).toHaveLength(0);
        expect(result.current.validationErrors).toContain('Only one file can be uploaded at a time');
    });

    it('handleFiles - rejects when exceeding maxFiles', async () => {
        const options = { ...defaultOptions, maxFiles: 1 };
        const { result } = renderHook(() => useFileUpload(options));

        const mockFiles = [
            createMockFile('test1.jpg', 1024, 'image/jpeg'),
            createMockFile('test2.jpg', 2048, 'image/jpeg'),
        ];

        await act(async () => {
            await result.current.handleFiles(mockFiles);
        });

        expect(result.current.files).toHaveLength(0);
        expect(result.current.validationErrors).toContain(`Maximum ${options.maxFiles} files allowed`);
    });

    it('handleFiles - creates preview for image files', async () => {
        mockIsImageFile.mockReturnValue(true);
        const { result } = renderHook(() => useFileUpload(defaultOptions));

        const mockFile = createMockFile('test.jpg', 1024, 'image/jpeg');

        await act(async () => {
            await result.current.handleFiles([mockFile]);
        });

        expect(mockCreateImagePreview).toHaveBeenCalledWith(mockFile);
        expect(result.current.files[0].preview).toBe('mock-preview-url');
    });

    it('handleFiles - simulates upload progress when simulateUpload is true', async () => {
        const options = { ...defaultOptions, simulateUpload: true };
        const { result } = renderHook(() => useFileUpload(options));

        const mockFile = createMockFile('test.jpg', 1024, 'image/jpeg');

        await act(async () => {
            await result.current.handleFiles([mockFile]);
        });

        // Upload should complete
        expect(result.current.isUploading).toBe(false);
        expect(result.current.files[0].uploadProgress).toBe(100);
    });

    it('handleDrag - sets dragActive based on event type', () => {
        const { result } = renderHook(() => useFileUpload(defaultOptions));

        const dragEnterEvent = {
            type: 'dragenter',
            preventDefault: vi.fn(),
            stopPropagation: vi.fn(),
        } as unknown as DragEvent;

        const dragLeaveEvent = {
            type: 'dragleave',
            preventDefault: vi.fn(),
            stopPropagation: vi.fn(),
        } as unknown as DragEvent;

        act(() => {
            result.current.handleDrag(dragEnterEvent);
        });

        expect(result.current.dragActive).toBe(true);

        act(() => {
            result.current.handleDrag(dragLeaveEvent);
        });

        expect(result.current.dragActive).toBe(false);
    });

    it('handleDrop - handles file drop and calls handleFiles', async () => {
        const { result } = renderHook(() => useFileUpload(defaultOptions));

        const mockFile = createMockFile('test.jpg', 1024, 'image/jpeg');
        const dataTransfer = {
            files: [mockFile],
            items: [
                {
                    kind: 'file',
                    getAsFile: () => mockFile,
                },
            ],
        };

        const dropEvent = {
            type: 'drop',
            preventDefault: vi.fn(),
            stopPropagation: vi.fn(),
            dataTransfer,
        } as unknown as DragEvent;

        await act(async () => {
            result.current.handleDrop(dropEvent);
        });

        expect(dropEvent.preventDefault).toHaveBeenCalled();
        expect(dropEvent.stopPropagation).toHaveBeenCalled();
        expect(result.current.dragActive).toBe(false);
    });

    it('handleChange - handles file input change', async () => {
        const { result } = renderHook(() => useFileUpload(defaultOptions));

        const mockFile = createMockFile('test.jpg', 1024, 'image/jpeg');
        const inputElement = {
            files: [mockFile],
        } as unknown as HTMLInputElement;

        const changeEvent = {
            target: inputElement,
        } as React.ChangeEvent<HTMLInputElement>;

        await act(async () => {
            result.current.handleChange(changeEvent);
        });

        expect(result.current.files).toHaveLength(1);
    });

    it('removeFile - removes a specific file by id', async () => {
        const { result } = renderHook(() => useFileUpload(defaultOptions));

        const mockFile = createMockFile('test.jpg', 1024, 'image/jpeg');

        await act(async () => {
            await result.current.handleFiles([mockFile]);
        });

        expect(result.current.files).toHaveLength(1);

        act(() => {
            result.current.removeFile('mock-id');
        });

        expect(result.current.files).toHaveLength(0);
    });

    it('clearAll - clears all files and resets state', async () => {
        const { result } = renderHook(() => useFileUpload(defaultOptions));

        const mockFiles = [
            createMockFile('test1.jpg', 1024, 'image/jpeg'),
            createMockFile('test2.jpg', 2048, 'image/jpeg'),
        ];

        await act(async () => {
            await result.current.handleFiles(mockFiles);
        });

        expect(result.current.files).toHaveLength(2);

        act(() => {
            result.current.clearAll();
        });

        expect(result.current.files).toHaveLength(0);
        expect(result.current.validationErrors).toHaveLength(0);
    });

    it('handleButtonClick - triggers file input click', () => {
        const { result } = renderHook(() => useFileUpload(defaultOptions));

        const mockClick = vi.fn();
        result.current.fileInputRef.current = {
            click: mockClick,
        } as unknown as HTMLInputElement;

        act(() => {
            result.current.handleButtonClick();
        });

        expect(mockClick).toHaveBeenCalled();
    });

    it('handleButtonClick - does nothing if file input ref is null', () => {
        const { result } = renderHook(() => useFileUpload(defaultOptions));

        // Ensure ref is null
        result.current.fileInputRef.current = null;

        act(() => {
            result.current.handleButtonClick();
        });

        // Should not throw any error
        expect(result.current.fileInputRef.current).toBeNull();
    });
});