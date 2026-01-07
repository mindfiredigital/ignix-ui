import React from 'react';
import { FileUpload } from '@site/src/components/UI/file-upload';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

const FileUploadFullDemo = () => {

    const handleFilesChange = () => {
        // Handle file changes here
    };

    const codeString = `
import { FileUpload } from '@mindfiredigital/ignix-ui';
import { useState } from 'react';

function FileUploadDemo() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleFilesChange = (newFiles: File[]) => {
    setFiles(newFiles);
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    
    setUploading(true);
    
    try {
      // Create FormData to send files to server
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });
      
      // Example: Upload to API endpoint
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        alert('Files uploaded successfully!');
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      alert('Upload failed: ' + error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <FileUpload
        onFilesChange={handleFilesChange}
        mode="both"
        multiple={true}
        maxFiles={5}
        maxSize={10 * 1024 * 1024}
        accept="image/*, .pdf, .doc, .docx, .txt, .xls, .xlsx"
        showFileList={true}
        buttonText="Upload Files"
        dropzoneText="Drag & drop files here, or click to browse"
        simulateUpload={true}
      />
      
    </div>
  );
}
`;

    return (
        <div className="space-y-8 mb-8">
            <Tabs>
                <TabItem value="preview" label="Preview" default>
                    <div className="p-6 border rounded-lg bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                        <div className="space-y-6">
                            <FileUpload
                                mode="both"
                                multiple={true}
                                maxFiles={5}
                                maxSize={10 * 1024 * 1024}
                                accept={"image/*, .pdf, .doc, .docx, .txt, .xls, .xlsx"}
                                showFileList={true}
                                disabled={false}
                                simulateUpload={true}
                                buttonText={"Upload Files"}
                                dropzoneText={"Drag & drop files here, or click to browse"}
                                onFilesChange={handleFilesChange}
                            />

                        </div>
                    </div>
                </TabItem>

                <TabItem value="code" label="Code">
                    <div className="p-6 border rounded-lg bg-slate-900/95 dark:bg-gray-900/95 backdrop-blur-sm">
                        <h4 className="text-sm font-medium text-slate-300 mb-3">Complete Usage Example</h4>
                        <CodeBlock language="tsx" className="text-sm !bg-transparent">
                            {codeString}
                        </CodeBlock>
                    </div>
                </TabItem>
            </Tabs>
        </div>
    );
};

const FileUploadMinimalDemo = () => {

    const handleFilesChange = () => {
        // Handle file changes here
    };

    const codeString = `
import { FileUpload } from '@mindfiredigital/ignix-ui';
import { useState } from 'react';

function MinimalUploadExample() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleFilesChange = (newFiles: File[]) => {
    setFiles(newFiles);
  };

  const handleUpload = async () => {
    // Example: Create FormData for upload
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    
    // Send to your backend
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    
    // Handle response...
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <FileUpload
        mode="button"
        multiple={true}
        buttonText="Choose Files"
        buttonVariant="primary"
        onFilesChange={handleFilesChange}
        className="w-full max-w-md"
      />

    </div>
  );
}
`;

    return (
        <div className="space-y-6">
            <Tabs>
                <TabItem value="preview" label="Preview" default>
                    <div className="p-6 border rounded-lg bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                        <div className="space-y-6">
                            {/* Minimal Upload Button */}
                            <div className="space-y-6">
                                <FileUpload
                                    mode="button"
                                    multiple={true}
                                    buttonText={"Choose Files"}
                                    buttonVariant="primary"
                                    disabled={false}
                                    onFilesChange={handleFilesChange}
                                    className="w-full max-w-md"
                                />
                            </div>
                        </div>
                    </div>
                </TabItem>

                <TabItem value="code" label="Code">
                    <div className="p-6 border rounded-lg bg-slate-900/95 dark:bg-gray-900/95 backdrop-blur-sm">
                        <h4 className="text-sm font-medium text-slate-700 dark:text-gray-300 mb-3">
                            Minimal Button Upload with File Handling
                        </h4>
                        <CodeBlock language="tsx" className="text-sm">
                            {codeString}
                        </CodeBlock>
                    </div>
                </TabItem>
            </Tabs >
        </div >
    );
};

export { FileUploadFullDemo, FileUploadMinimalDemo };