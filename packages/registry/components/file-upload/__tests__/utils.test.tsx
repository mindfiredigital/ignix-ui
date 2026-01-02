import { describe, it, expect, vi } from 'vitest';
import {
    formatFileSize,
    isImageFile,
    getFileIcon,
    getIconContainerColor,
    createImagePreview,
    validateFile,
    generateFileId
} from '../utils';

// Mock FileReader
global.FileReader = vi.fn().mockImplementation(function () {
    this.readAsDataURL = vi.fn();
    this.onload = vi.fn();
    this.result = 'data:image/png;base64,mocked';
});

describe('File Upload Utilities', () => {
    describe('formatFileSize', () => {
        it('formats bytes correctly', () => {
            expect(formatFileSize(0)).toBe('0 Bytes');
            expect(formatFileSize(500)).toBe('500 Bytes');
            expect(formatFileSize(1024)).toBe('1 KB');
            expect(formatFileSize(1048576)).toBe('1 MB');
            expect(formatFileSize(1073741824)).toBe('1 GB');
            expect(formatFileSize(1536)).toBe('1.5 KB');
        });
    });

    describe('isImageFile', () => {
        it('identifies image files', () => {
            const imageFile = { type: 'image/png' } as File;
            const pdfFile = { type: 'application/pdf' } as File;
            const noTypeFile = {} as File;

            expect(isImageFile(imageFile)).toBe(true);
            expect(isImageFile(pdfFile)).toBe(false);
            expect(isImageFile(noTypeFile)).toBe(false);
        });

        it('handles null/undefined', () => {
            expect(isImageFile(null as any)).toBe(false);
            expect(isImageFile(undefined as any)).toBe(false);
        });
    });

    describe('getFileIcon', () => {
        it('identifies image files', () => {
            const imageFile = { type: 'image/png', name: 'test.png' } as File;
            expect(getFileIcon(imageFile)).toBe('image');
        });

        it('identifies PDF files by type', () => {
            const pdfByType = { type: 'application/pdf', name: 'document' } as File;
            expect(getFileIcon(pdfByType)).toBe('pdf');
        });

        it('identifies PDF files by extension', () => {
            const pdfByExt = { type: '', name: 'document.pdf' } as File;
            expect(getFileIcon(pdfByExt)).toBe('pdf');
        });

        it('identifies word documents', () => {
            const wordFile = { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', name: 'test.docx' } as File;
            expect(getFileIcon(wordFile)).toBe('word');
        });

        // it('identifies excel files', () => {
        //     const excelFile = { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', name: 'test.xlsx' } as File;
        //     expect(getFileIcon(excelFile)).toBe('excel');
        // });

        it('identifies video files', () => {
            const videoFile = { type: 'video/mp4', name: 'test.mp4' } as File;
            expect(getFileIcon(videoFile)).toBe('video');
        });

        it('identifies audio files', () => {
            const audioFile = { type: 'audio/mpeg', name: 'test.mp3' } as File;
            expect(getFileIcon(audioFile)).toBe('audio');
        });

        it('identifies archive files', () => {
            const zipFile = { type: 'application/zip', name: 'test.zip' } as File;
            expect(getFileIcon(zipFile)).toBe('archive');
        });

        it('identifies text files', () => {
            const txtFile = { type: 'text/plain', name: 'test.txt' } as File;
            expect(getFileIcon(txtFile)).toBe('text');
        });

        it('returns default for unknown files', () => {
            const unknownFile = { type: 'application/octet-stream', name: 'test.xyz' } as File;
            expect(getFileIcon(unknownFile)).toBe('file');
        });
    });

    describe('getIconContainerColor', () => {
        it('returns correct gradient classes for each file type', () => {
            const imageFile = { type: 'image/png' } as File;
            expect(getIconContainerColor(imageFile)).toContain('bg-gradient-to-br');

            const pdfFile = { type: 'application/pdf' } as File;
            expect(getIconContainerColor(pdfFile)).toContain('from-red-50');

            const defaultFile = { type: 'unknown' } as File;
            expect(getIconContainerColor(defaultFile)).toContain('from-slate-50');
        });
    });

    describe('createImagePreview', () => {
        it('creates a base64 preview from file', async () => {
            const mockFile = new File([''], 'test.png', { type: 'image/png' });

            const promise = createImagePreview(mockFile);

            // Trigger the onload event
            const fileReaderInstance = (FileReader as any).mock.instances[0];
            fileReaderInstance.onloadend();

            const result = await promise;
            expect(result).toBe('data:image/png;base64,mocked');
        });
    });

    describe('validateFile', () => {
        it('validates file size correctly', () => {
            const largeFile = {
                name: 'test.txt',
                size: 11 * 1024 * 1024, // 11MB
                type: 'text/plain'
            } as File;

            const result = validateFile(largeFile, 10 * 1024 * 1024, '*/*');
            expect(result.isValid).toBe(false);
            expect(result.error).toContain('File size exceeds');
        });

        it('validates accepted file types with wildcard', () => {
            const imageFile = {
                name: 'test.png',
                size: 1024,
                type: 'image/png'
            } as File;

            const result = validateFile(imageFile, 1024 * 1024, 'image/*');
            expect(result.isValid).toBe(true);
        });

        it('rejects file types not in accept list', () => {
            const pdfFile = {
                name: 'test.pdf',
                size: 1024,
                type: 'application/pdf'
            } as File;

            const result = validateFile(pdfFile, 1024 * 1024, 'image/*');
            expect(result.isValid).toBe(false);
            expect(result.error).toContain('File type not allowed');
        });

        it('validates by file extension', () => {
            const textFile = {
                name: 'test.txt',
                size: 1024,
                type: 'text/plain'
            } as File;

            const result = validateFile(textFile, 1024 * 1024, '.txt,.md');
            expect(result.isValid).toBe(true);
        });

        it('calls custom validation function', () => {
            const testFile = {
                name: 'test.txt',
                size: 1024,
                type: 'text/plain'
            } as File;

            const customValidate = vi.fn().mockReturnValue({
                isValid: false,
                error: 'Custom error'
            });

            const result = validateFile(testFile, 1024 * 1024, '*/*', customValidate);
            expect(customValidate).toHaveBeenCalledWith(testFile);
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Custom error');
        });

        it('returns valid for correct file', () => {
            const validFile = {
                name: 'test.png',
                size: 1024,
                type: 'image/png'
            } as File;

            const result = validateFile(validFile, 2048, 'image/*');
            expect(result.isValid).toBe(true);
            expect(result.error).toBeUndefined();
        });

        it('handles accept "*/*" for all files', () => {
            const anyFile = {
                name: 'test.xyz',
                size: 1024,
                type: 'application/octet-stream'
            } as File;

            const result = validateFile(anyFile, 2048, '*/*');
            expect(result.isValid).toBe(true);
        });
    });

    describe('generateFileId', () => {
        it('generates unique string IDs', () => {
            const id1 = generateFileId();
            const id2 = generateFileId();

            expect(typeof id1).toBe('string');
            expect(id1.length).toBeGreaterThan(0);
            expect(id1).not.toBe(id2);
        });
    });
});