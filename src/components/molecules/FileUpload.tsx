'use client';

import { useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import { Upload, File, Image as ImageIcon, FileText, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useFileUpload } from '@/hooks/useFileUpload';
import { Card } from '@/components/atoms/Card';
import { BodyTextSmall, Caption } from '@/components/atoms/Typography';

export interface FileUploadProps {
  accept?: string;
  maxSize?: number; // in bytes
  maxFiles?: number;
  multiple?: boolean;
  onUploadComplete?: (urls: string[]) => void;
  onUploadError?: (error: Error) => void;
  variant?: 'gvteway' | 'compvss' | 'atlvs';
  showPreview?: boolean;
}

interface UploadedFile {
  file: File;
  preview?: string;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  url?: string;
  error?: string;
}

export function FileUpload({
  accept,
  maxSize = 10 * 1024 * 1024, // 10MB default
  maxFiles = 5,
  multiple = true,
  onUploadComplete,
  onUploadError,
  variant = 'gvteway',
  showPreview = true,
}: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { upload, isUploading: isUploading } = useFileUpload({
    bucket: 'gvteway-attachments',
    folder: 'uploads',
  });

  // Get file icon based on type
  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon className="w-5 h-5" />;
    } else if (file.type.includes('pdf') || file.type.includes('document')) {
      return <FileText className="w-5 h-5" />;
    }
    return <File className="w-5 h-5" />;
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Validate file - wrapped in useCallback to prevent recreation
  const validateFile = useCallback((file: File): string | null => {
    if (maxSize && file.size > maxSize) {
      return `File size exceeds ${formatFileSize(maxSize)}`;
    }

    if (accept) {
      const acceptedTypes = accept.split(',').map(t => t.trim());
      const fileType = file.type;
      const fileExt = '.' + file.name.split('.').pop();

      const isAccepted = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return fileExt === type;
        }
        if (type.endsWith('/*')) {
          return fileType.startsWith(type.replace('/*', ''));
        }
        return fileType === type;
      });

      if (!isAccepted) {
        return `File type not accepted. Accepted types: ${accept}`;
      }
    }

    return null;
  }, [maxSize, accept]);

  // Handle file selection
  const handleFiles = useCallback(async (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const fileArray = Array.from(selectedFiles);

    // Check max files limit
    if (files.length + fileArray.length > maxFiles) {
      const error = new Error(`Maximum ${maxFiles} files allowed`);
      if (onUploadError) onUploadError(error);
      return;
    }

    // Process each file
    const newFiles: UploadedFile[] = [];

    for (const file of fileArray) {
      const error = validateFile(file);

      if (error) {
        newFiles.push({
          file,
          progress: 0,
          status: 'error',
          error,
        });
        continue;
      }

      // Create preview for images
      let preview: string | undefined;
      if (file.type.startsWith('image/') && showPreview) {
        preview = URL.createObjectURL(file);
      }

      newFiles.push({
        file,
        preview,
        progress: 0,
        status: 'pending',
      });
    }

    setFiles(prev => [...prev, ...newFiles]);

    // Upload files
    for (let i = 0; i < newFiles.length; i++) {
      const uploadedFile = newFiles[i];
      if (uploadedFile.status === 'error') continue;

      try {
        // Update status to uploading
        setFiles(prev => prev.map((f, idx) =>
          f.file === uploadedFile.file
            ? { ...f, status: 'uploading' as const }
            : f
        ));

        // Upload file
        const result = await upload(uploadedFile.file);

        // Update with success
        setFiles(prev => prev.map(f =>
          f.file === uploadedFile.file
            ? { ...f, status: 'success' as const, url: result.url, progress: 100 }
            : f
        ));
      } catch (error) {
        // Update with error
        setFiles(prev => prev.map(f =>
          f.file === uploadedFile.file
            ? { ...f, status: 'error' as const, error: error instanceof Error ? error.message : 'Upload failed' }
            : f
        ));

        if (onUploadError && error instanceof Error) {
          onUploadError(error);
        }
      }
    }

    // Call completion handler with successful uploads
    const successfulUploads = files.filter(f => f.status === 'success' && f.url).map(f => f.url!);
    if (successfulUploads.length > 0 && onUploadComplete) {
      onUploadComplete(successfulUploads);
    }
  }, [files, maxFiles, upload, onUploadComplete, onUploadError, showPreview, validateFile]);

  // Handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  // Remove file
  const _removeFile = useCallback((file: File) => {
    setFiles(prev => {
      const updated = prev.filter(f => f.file !== file);
      // Revoke preview URL
      const removed = prev.find(f => f.file === file);
      if (removed?.preview) {
        URL.revokeObjectURL(removed.preview);
      }
      return updated;
    });
  }, []);

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${isDragging ? 'border-info bg-info-light0/10' : 'border-grey-700 hover:border-grey-600 bg-grey-900/50' }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-3">
          <div className={`p-4 rounded-full ${ variant === 'gvteway' ? 'bg-gvteway-red-500/10' : variant === 'compvss' ? 'bg-compvss-cyan-500/10' : 'bg-atlvs-purple-500/10' }`}>
            <Upload className={`w-8 h-8 ${ variant === 'gvteway' ? 'text-gvteway-red-500' : variant === 'compvss' ? 'text-compvss-cyan-500' : 'text-atlvs-purple-500' }`} />
          </div>

          <div>
            <p className="text-white mb-1">
              {isDragging ? 'Drop files here' : 'Click to upload or drag and drop'}
            </p>
            <BodyTextSmall className="text-grey-400">
              {accept || 'Any file type'} • Max {formatFileSize(maxSize)} • Up to {maxFiles} files
            </BodyTextSmall>
          </div>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((uploadedFile, index) => (
            <Card key={index} className="p-4 bg-grey-900/50 border-grey-700">
              <div className="flex items-center gap-4">
                {/* Preview or Icon */}
                <div className="flex-shrink-0">
                  {uploadedFile.preview ? (
                    <Image src={uploadedFile.preview}
                      alt={uploadedFile.file.name}
                      className="w-12 h-12 object-cover rounded" width={500} height={500} />
                  ) : (
                    <div className="w-12 h-12 flex items-center justify-center bg-grey-800 rounded">
                      {getFileIcon(uploadedFile.file)}
                    </div>
                  )}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <BodyTextSmall className="text-white truncate">
                    {uploadedFile.file.name}
                  </BodyTextSmall>
                  <Caption className="text-grey-400">
                    {formatFileSize(uploadedFile.file.size)}
                  </Caption>

                  {/* Progress Bar */}
                  {uploadedFile.status === 'uploading' && (
                    <div className="mt-2 w-full bg-grey-800 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all ${ variant === 'gvteway' ? 'bg-gvteway-red-500' : variant === 'compvss' ? 'bg-compvss-cyan-500' : 'bg-atlvs-purple-500' }`}
                        style={{ width: `${uploadedFile.progress}%` }}
                      />
                    </div>
                  )}

                  {/* Error Message */}
                  {uploadedFile.status === 'error' && uploadedFile.error && (
                    <Caption className="text-destructive mt-1">{uploadedFile.error}</Caption>
                  )}
                </div>

                {/* Status Icon */}
                <div className="flex-shrink-0">
                  {uploadedFile.status === 'uploading' && (
                    <Loader2 className="w-5 h-5 text-info animate-spin" />
                  )}
                  {uploadedFile.status === 'success' && (
                    <CheckCircle className="w-5 h-5 text-success" />
                  )}
                  {uploadedFile.status === 'error' && (
                    <AlertCircle className="w-5 h-5 text-destructive" />
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
