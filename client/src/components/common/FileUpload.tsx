import React, { useState, useRef } from 'react';
import {
  Upload,
  X,
  File,
  Image,
  Video,
  Music,
  FileText,
  Loader2,
} from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (files: FileInfo[]) => void;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number; // in MB
  allowedTypes?: string[];
  uploadContext?: 'chat' | 'profile' | 'marketplace' | 'general';
  uploadedBy?: string;
  relatedId?: string;
}

interface FileInfo {
  id: string;
  fileName: string;
  originalName: string;
  fileType: string;
  fileSize: string;
  downloadUrl: string;
  mimeType: string;
  status: 'uploading' | 'completed' | 'failed';
  progress?: number;
  error?: string;
  previewUrl?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  multiple = true, // Changed to true for WhatsApp-like behavior
  maxFiles = 10,
  maxSize = 100, // Increased to 100MB for larger files
  allowedTypes = [], // Empty array means accept all file types
  uploadContext = 'chat', // Changed default to chat
  uploadedBy = 'user',
  relatedId,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<FileInfo[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <Image className='w-4 h-4' />;
    if (mimeType.startsWith('video/')) return <Video className='w-4 h-4' />;
    if (mimeType.startsWith('audio/')) return <Music className='w-4 h-4' />;
    if (mimeType === 'application/pdf' || mimeType.includes('document'))
      return <FileText className='w-4 h-4' />;
    return <File className='w-4 h-4' />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    // Only check file size and count, accept all file types
    if (file.size > maxSize * 1024 * 1024) {
      return `File size exceeds ${maxSize}MB limit`;
    }
    if (selectedFiles.length >= maxFiles) {
      return `Maximum ${maxFiles} files allowed`;
    }
    return null;
  };

  const uploadFile = async (file: File): Promise<FileInfo> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('uploadedBy', uploadedBy);
    formData.append('uploadContext', uploadContext);
    if (relatedId) {
      formData.append('relatedId', relatedId);
    }

    const response = await fetch('/api/files/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const result = await response.json();
    return {
      ...result.file,
      status: 'completed' as const,
      progress: 100,
    };
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    const newFiles: FileInfo[] = [];

    for (const file of files) {
      const error = validateFile(file);
      if (error) {
        const failedFile = {
          id: Date.now().toString() + Math.random(),
          fileName: file.name,
          originalName: file.name,
          fileType: file.type.split('/')[1] || 'unknown',
          fileSize: formatFileSize(file.size),
          downloadUrl: '',
          mimeType: file.type,
          status: 'failed' as const,
          error,
        };
        newFiles.push(failedFile);
        continue;
      }

      const tempFile: FileInfo = {
        id: Date.now().toString() + Math.random(),
        fileName: file.name,
        originalName: file.name,
        fileType: file.type.split('/')[1] || 'unknown',
        fileSize: formatFileSize(file.size),
        downloadUrl: '',
        mimeType: file.type,
        status: 'uploading' as const,
        progress: 0,
        previewUrl: URL.createObjectURL(file),
      };

      newFiles.push(tempFile);
      setSelectedFiles((prev) => [...prev, tempFile]);

      try {
        const uploadedFile = await uploadFile(file);
        const completedFile = {
          ...uploadedFile,
          status: 'completed' as const,
          progress: 100,
          previewUrl: tempFile.previewUrl,
        };
        setSelectedFiles((prev) =>
          prev.map((f) => (f.id === tempFile.id ? completedFile : f))
        );
        // Update the file in newFiles array
        const fileIndex = newFiles.findIndex((f) => f.id === tempFile.id);
        if (fileIndex !== -1) {
          newFiles[fileIndex] = completedFile;
        }
      } catch (error) {
        const failedFile = {
          ...tempFile,
          status: 'failed' as const,
          error: 'Upload failed',
        };
        setSelectedFiles((prev) =>
          prev.map((f) => (f.id === tempFile.id ? failedFile : f))
        );
        // Update the file in newFiles array
        const fileIndex = newFiles.findIndex((f) => f.id === tempFile.id);
        if (fileIndex !== -1) {
          newFiles[fileIndex] = failedFile;
        }
      }
    }

    setIsUploading(false);
    // Call onFileSelect with all files (including failed ones) so the parent can handle them
    onFileSelect(newFiles);
  };

  const removeFile = (fileId: string) => {
    setSelectedFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    if (files.length > 0) {
      const input = fileInputRef.current;
      if (input) {
        input.files = event.dataTransfer.files;
        handleFileSelect({
          target: { files: event.dataTransfer.files },
        } as any);
      }
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  return (
    <div className='w-full'>
      {/* File Upload Area */}
      <div
        className={`border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center transition-colors ${
          isUploading
            ? 'border-ajira-primary bg-ajira-primary/5'
            : 'hover:border-ajira-primary hover:bg-gray-50 dark:hover:bg-gray-700'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <Upload className='w-8 h-8 mx-auto mb-2 text-gray-400' />
        <p className='text-sm text-gray-600 dark:text-gray-400 mb-2'>
          Drop files here or click to upload
        </p>
        <p className='text-xs text-gray-500 dark:text-gray-500 mb-4'>
          Max {maxSize}MB per file • All file types supported
        </p>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className='px-4 py-2 bg-ajira-primary text-white rounded-lg hover:bg-ajira-primary/90 transition-colors disabled:opacity-50'
        >
          {isUploading ? (
            <>
              <Loader2 className='w-4 h-4 mr-2 animate-spin' />
              Uploading...
            </>
          ) : (
            'Choose Files'
          )}
        </button>
        <input
          ref={fileInputRef}
          type='file'
          multiple={multiple}
          accept='*/*' // Accept all file types
          onChange={handleFileSelect}
          className='hidden'
        />
      </div>

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className='mt-4 space-y-2'>
          {selectedFiles.map((file) => (
            <div
              key={file.id}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                file.status === 'completed'
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                  : file.status === 'failed'
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                    : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
              }`}
            >
              <div className='flex items-center space-x-3'>
                {getFileIcon(file.mimeType)}
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-medium text-gray-900 dark:text-white truncate'>
                    {file.originalName}
                  </p>
                  <p className='text-xs text-gray-500 dark:text-gray-400'>
                    {file.fileSize} • {file.fileType.toUpperCase()}
                  </p>
                  {file.error && (
                    <p className='text-xs text-red-600 dark:text-red-400'>
                      {file.error}
                    </p>
                  )}
                </div>
              </div>

              <div className='flex items-center space-x-2'>
                {file.status === 'uploading' && (
                  <div className='flex items-center space-x-1'>
                    <Loader2 className='w-3 h-3 animate-spin' />
                    <span className='text-xs text-gray-500'>
                      {file.progress || 0}%
                    </span>
                  </div>
                )}
                <button
                  onClick={() => removeFile(file.id)}
                  className='text-gray-400 hover:text-red-500 transition-colors'
                >
                  <X className='w-4 h-4' />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
