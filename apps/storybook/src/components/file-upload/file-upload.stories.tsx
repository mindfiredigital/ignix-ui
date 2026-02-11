import type { Meta, StoryObj } from '@storybook/react-vite';
import { FileUpload } from './index';
import { useState } from 'react';

const meta = {
    title: 'Components/FileUpload',
    component: FileUpload,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'A file upload component supporting drag-and-drop, file validation, and file preview.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        mode: {
            control: { type: 'select' },
            options: ['button', 'dropzone', 'both'],
            description: 'Display mode',
        },
        multiple: {
            control: 'boolean',
            description: 'Allow multiple file selection',
        },
        maxFiles: {
            control: { type: 'number', min: 1, max: 20 },
            description: 'Maximum number of files allowed',
        },
        maxSize: {
            control: { type: 'number' },
            description: 'Maximum file size in bytes',
        },
        accept: {
            control: 'text',
            description: 'Accepted file types (MIME types or extensions)',
        },
        disabled: {
            control: 'boolean',
            description: 'Disable the component',
        },
        buttonVariant: {
            control: { type: 'select' },
            options: ['default', 'primary', 'secondary', 'outline', 'ghost'],
            description: 'Variant for the upload button',
        },
        onFilesChange: {
            action: 'files changed',
        },
        simulateUpload: {
            control: 'boolean',
            description: 'Show simulated upload progress',
        },
    },
    args: {
        onFilesChange: () => { /* no-op */ },
        mode: 'both',
        multiple: true,
        maxFiles: 5,
        maxSize: 10485760, // 10MB
        simulateUpload: false,
    },
} satisfies Meta<typeof FileUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

// Template for controlled component
const ControlledTemplate = (args: Parameters<typeof FileUpload>[0]) => {
    const [files, setFiles] = useState<File[]>([]);

    return (
        <div className="w-full max-w-3xl p-6">
            <FileUpload
                {...args}
                onFilesChange={setFiles}
            />
            <div className="mt-8">
                <h3 className="text-lg font-medium mb-4 text-slate-800 dark:text-white">Current Files:</h3>
                <p className="text-sm text-slate-600 dark:text-gray-400">
                    {files.length} file{files.length !== 1 ? 's' : ''} selected
                </p>
            </div>
        </div>
    );
};

// Container component for light/dark mode comparison
const ThemeComparisonContainer = ({ children }: { children: React.ReactNode }) => (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-white dark:bg-gray-900">
        {children}
    </div>
);

// Light Theme Stories
export const LightTheme: Story = {
    parameters: {
        backgrounds: { default: 'light' },
    },
    decorators: [
        (Story) => (
            <div className="p-8 bg-white min-h-screen">
                <Story />
            </div>
        ),
    ],
    args: {
        buttonText: 'Upload Files',
        dropzoneText: 'Drag & drop files here, or click to browse',
    },
};

export const LightThemeWithFiles: Story = {
    parameters: {
        backgrounds: { default: 'light' },
    },
    decorators: [
        (Story) => (
            <div className="p-8 bg-white min-h-screen">
                <Story />
            </div>
        ),
    ],
    render: ControlledTemplate,
    args: {
        buttonText: 'Upload Files',
        dropzoneText: 'Drag & drop files here',
        multiple: true,
        maxFiles: 3,
        simulateUpload: true,
    },
};

export const LightThemeSingleFile: Story = {
    parameters: {
        backgrounds: { default: 'light' },
    },
    decorators: [
        (Story) => (
            <div className="p-8 bg-white min-h-screen">
                <Story />
            </div>
        ),
    ],
    args: {
        multiple: false,
        buttonText: 'Upload Single File',
        dropzoneText: 'Drag & drop a file here, or click to browse',
        buttonVariant: 'primary',
    },
};

export const LightThemeButtonOnly: Story = {
    parameters: {
        backgrounds: { default: 'light' },
    },
    decorators: [
        (Story) => (
            <div className="p-8 bg-white min-h-screen">
                <Story />
            </div>
        ),
    ],
    args: {
        mode: 'button',
        buttonText: 'Select Files',
        buttonVariant: 'primary',
        simulateUpload: true,
    },
};

export const LightThemeDropzoneOnly: Story = {
    parameters: {
        backgrounds: { default: 'light' },
    },
    decorators: [
        (Story) => (
            <div className="p-8 bg-white min-h-screen">
                <Story />
            </div>
        ),
    ],
    args: {
        mode: 'dropzone',
        dropzoneText: 'Drop your files here',
        buttonVariant: 'primary',
    },
};

export const LightThemeDisabled: Story = {
    parameters: {
        backgrounds: { default: 'light' },
    },
    decorators: [
        (Story) => (
            <div className="p-8 bg-white min-h-screen">
                <Story />
            </div>
        ),
    ],
    args: {
        disabled: true,
        buttonText: 'Upload Disabled',
        dropzoneText: 'Upload is currently disabled',
    },
};

// Dark Theme Stories
export const DarkTheme: Story = {
    parameters: {
        backgrounds: { default: 'dark' },
    },
    decorators: [
        (Story) => (
            <div className="p-8 bg-gray-900 min-h-screen">
                <Story />
            </div>
        ),
    ],
    args: {
        buttonText: 'Upload Files',
        dropzoneText: 'Drag & drop files here, or click to browse',
    },
};

export const DarkThemeWithFiles: Story = {
    parameters: {
        backgrounds: { default: 'dark' },
    },
    decorators: [
        (Story) => (
            <div className="p-8 bg-gray-900 min-h-screen">
                <Story />
            </div>
        ),
    ],
    render: ControlledTemplate,
    args: {
        buttonText: 'Upload Files',
        dropzoneText: 'Drag & drop files here',
        multiple: true,
        maxFiles: 3,
        simulateUpload: true,
    },
};

export const DarkThemeSingleFile: Story = {
    parameters: {
        backgrounds: { default: 'dark' },
    },
    decorators: [
        (Story) => (
            <div className="p-8 bg-gray-900 min-h-screen">
                <Story />
            </div>
        ),
    ],
    args: {
        multiple: false,
        buttonText: 'Upload Single File',
        dropzoneText: 'Drag & drop a file here, or click to browse',
        buttonVariant: 'primary',
    },
};

export const DarkThemeButtonOnly: Story = {
    parameters: {
        backgrounds: { default: 'dark' },
    },
    decorators: [
        (Story) => (
            <div className="p-8 bg-gray-900 min-h-screen">
                <Story />
            </div>
        ),
    ],
    args: {
        mode: 'button',
        buttonText: 'Select Files',
        buttonVariant: 'primary',
        simulateUpload: true,
    },
};

export const DarkThemeDropzoneOnly: Story = {
    parameters: {
        backgrounds: { default: 'dark' },
    },
    decorators: [
        (Story) => (
            <div className="p-8 bg-gray-900 min-h-screen">
                <Story />
            </div>
        ),
    ],
    args: {
        mode: 'dropzone',
        dropzoneText: 'Drop your files here',
        buttonVariant: 'primary',
    },
};

export const DarkThemeDisabled: Story = {
    parameters: {
        backgrounds: { default: 'dark' },
    },
    decorators: [
        (Story) => (
            <div className="p-8 bg-gray-900 min-h-screen">
                <Story />
            </div>
        ),
    ],
    args: {
        disabled: true,
        buttonText: 'Upload Disabled',
        dropzoneText: 'Upload is currently disabled',
    },
};

// Theme Comparison Stories
export const ThemeComparison: Story = {
    render: () => (
        <ThemeComparisonContainer>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-6xl">
                {/* Light Theme Column */}
                <div className="space-y-8">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Light Theme</h2>
                        <p className="text-slate-600">Default light mode appearance</p>
                    </div>

                    <div className="p-6 bg-white rounded-2xl shadow-lg border border-slate-200">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">Default Upload</h3>
                        <FileUpload
                            mode="both"
                            buttonText="Upload Files"
                            dropzoneText="Drag & drop files here"
                            multiple={true}
                        />
                    </div>

                    <div className="p-6 bg-white rounded-2xl shadow-lg border border-slate-200">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">With Simulated Upload</h3>
                        <FileUpload
                            mode="both"
                            buttonText="Upload with Progress"
                            dropzoneText="Files will show upload progress"
                            multiple={true}
                            simulateUpload={true}
                        />
                    </div>

                    <div className="p-6 bg-white rounded-2xl shadow-lg border border-slate-200">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">Button Only</h3>
                        <FileUpload
                            mode="button"
                            buttonText="Select Files"
                            buttonVariant="primary"
                        />
                    </div>
                </div>

                {/* Dark Theme Column */}
                <div className="space-y-8">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-white mb-2">Dark Theme</h2>
                        <p className="text-gray-400">Dark mode appearance</p>
                    </div>

                    <div className="p-6 bg-gray-900 rounded-2xl shadow-lg border border-gray-800">
                        <h3 className="text-lg font-semibold text-white mb-4">Default Upload</h3>
                        <FileUpload
                            mode="both"
                            buttonText="Upload Files"
                            dropzoneText="Drag & drop files here"
                            multiple={true}
                        />
                    </div>

                    <div className="p-6 bg-gray-900 rounded-2xl shadow-lg border border-gray-800">
                        <h3 className="text-lg font-semibold text-white mb-4">With Simulated Upload</h3>
                        <FileUpload
                            mode="both"
                            buttonText="Upload with Progress"
                            dropzoneText="Files will show upload progress"
                            multiple={true}
                            simulateUpload={true}
                        />
                    </div>

                    <div className="p-6 bg-gray-900 rounded-2xl shadow-lg border border-gray-800">
                        <h3 className="text-lg font-semibold text-white mb-4">Button Only</h3>
                        <FileUpload
                            mode="button"
                            buttonText="Select Files"
                            buttonVariant="primary"
                        />
                    </div>
                </div>
            </div>
        </ThemeComparisonContainer>
    ),
};

// Additional Stories
export const SingleFile: Story = {
    args: {
        multiple: false,
        buttonText: 'Upload File',
        dropzoneText: 'Drag & drop a file here, or click to browse',
    },
};

export const ImagesOnly: Story = {
    args: {
        accept: 'image/*',
        buttonText: 'Upload Images',
        dropzoneText: 'Drag & drop images here, or click to browse',
        maxSize: 5 * 1024 * 1024, // 5MB
    },
};

export const DocumentsOnly: Story = {
    args: {
        accept: '.pdf,.doc,.docx,.txt',
        buttonText: 'Upload Documents',
        dropzoneText: 'Drag & drop documents here (PDF, DOC, TXT)',
        maxFiles: 3,
    },
};

export const WithFileSizeLimit: Story = {
    args: {
        maxSize: 1024 * 1024, // 1MB
        buttonText: 'Upload Small Files',
        dropzoneText: 'Files must be smaller than 1MB',
    },
};

export const CustomValidation: Story = {
    args: {
        validateFile: (file) => {
            // Custom validation: only accept files with "report" in the name
            if (!file.name.toLowerCase().includes('report')) {
                return {
                    isValid: false,
                    error: 'File name must contain "report"',
                };
            }
            return { isValid: true };
        },
        buttonText: 'Upload Report',
        dropzoneText: 'Only files with "report" in the name are accepted',
    },
};

// Responsive examples
export const ResponsiveExamples: Story = {
    render: () => (
        <div className="space-y-8 w-full max-w-7xl p-6 bg-white dark:bg-gray-900">
            <div>
                <h3 className="text-lg font-medium mb-4 text-slate-800 dark:text-white">Mobile (Small)</h3>
                <div className="max-w-sm mx-auto p-4 border border-slate-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                    <FileUpload
                        mode="both"
                        multiple={true}
                        buttonText="Upload"
                        dropzoneText="Drag & drop files"
                    />
                </div>
            </div>

            <div>
                <h3 className="text-lg font-medium mb-4 text-slate-800 dark:text-white">Tablet (Medium)</h3>
                <div className="max-w-2xl mx-auto p-6 border border-slate-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                    <FileUpload
                        mode="both"
                        multiple={true}
                        buttonText="Upload Files"
                        dropzoneText="Drag & drop files here, or click to browse"
                    />
                </div>
            </div>

            <div>
                <h3 className="text-lg font-medium mb-4 text-slate-800 dark:text-white">Desktop (Large)</h3>
                <div className="max-w-4xl mx-auto p-8 border border-slate-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                    <FileUpload
                        mode="both"
                        multiple={true}
                        buttonText="Choose Files to Upload"
                        dropzoneText="Drag & drop your files here, or click the button to browse your computer"
                    />
                </div>
            </div>
        </div>
    ),
};

// Controlled example
export const Controlled: Story = {
    render: ControlledTemplate,
    args: {
        multiple: true,
        maxFiles: 4,
    },
};
