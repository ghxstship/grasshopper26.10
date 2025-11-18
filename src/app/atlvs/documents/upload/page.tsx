'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { useState } from 'react';
import { Upload, File, X, CheckCircle,  } from 'lucide-react';
import { useDocuments } from '@/lib/hooks/atlvs/useDocuments';
import { Card, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Button } from '@/components/atoms/Button';
import { Select } from '@/components/atoms/Select';
import { Input } from '@/components/atoms/Input';
import { FormField } from '@/components/molecules/FormField';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'complete' | 'error';
  progress: number;
}

export default function DocumentUploadPage() { 
  const [files, _setFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const {  } = useDocuments();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    // Handle file drop
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <AtlvsLayout>
      <ContentLayout
        title="UPLOAD DOCUMENTS"
        description="Upload contracts, riders, permits, and other documents"
        variant="atlvs"
        breadcrumbs={[
          { label: 'Documents', href: '/atlvs/documents' },
          { label: 'Upload' }
        ]}
      >

        {/* Upload Area */}
        <Card
          variant="atlvs"
          className={`border-2 border-dashed p-12 text-center transition-colors ${
            dragActive ? 'border-atlvs-green-500 bg-atlvs-green-500/10' : 'border-gray-700 bg-gray-900/50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">
            Drop files here or click to browse
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            Supports PDF, DOC, DOCX, XLS, XLSX (max 50MB)
          </p>
          <Button variant="atlvs" size="sm">
            Select Files
          </Button>
        </Card>

        {/* File List */}
        {files.length > 0 && (
          <Card variant="atlvs" className="mt-6 bg-gray-900/50">
            <CardHeader>
              <CardTitle className="mb-4">Uploading Files</CardTitle>
              <div className="space-y-4">
                {files.map(file => (
                  <div key={file.id} className="flex items-start gap-4 p-4 bg-gray-800/50 rounded-lg">
                    <File className="w-10 h-10 text-gray-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-white truncate">{file.name}</div>
                          <div className="text-sm text-gray-400">{formatFileSize(file.size)}</div>
                        </div>
                        {file.status === 'complete' ? (
                          <CheckCircle className="w-5 h-5 text-atlvs-green-500 flex-shrink-0" />
                        ) : (
                          <Button variant="ghost" size="sm">
                            <X className="w-5 h-5" />
                          </Button>
                        )}
                      </div>
                      {file.status === 'uploading' && (
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-atlvs-green-500 h-2 rounded-full transition-all"
                            style={{ width: `${file.progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardHeader>
          </Card>
        )}

        {/* Document Type Selection */}
        <Card variant="atlvs" className="mt-6 bg-gray-900/50">
          <CardHeader>
            <CardTitle className="mb-4">Document Details</CardTitle>
            <div className="space-y-4">
              <FormField label="Document Type">
                <Select variant="atlvs">
                  <option>Contract</option>
                  <option>Rider</option>
                  <option>Permit</option>
                  <option>Insurance</option>
                  <option>Other</option>
                </Select>
              </FormField>
              <FormField label="Tags (optional)">
                <Input
                  type="text"
                  placeholder="Add tags separated by commas"
                  variant="atlvs"
                />
              </FormField>
            </div>
          </CardHeader>
        </Card>
      </ContentLayout>
    </AtlvsLayout>
  );
}
