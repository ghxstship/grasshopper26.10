/**
 * Upload Credentials Page - UI Rebuild
 */

'use client';

import * as React from 'react';
import { H1, Body } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';


interface Document {
  id: string;
  name: string;
  type: string;
  uploadedDate: string;
  status: string;
}

export default function UploadCredentialsPage() {
  const [loading, setLoading] = React.useState(true);
  const [documents, setDocuments] = React.useState<Document[]>([]);
  const [uploading, setUploading] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<{ documents: Document[] }>('/api/compvss/credentials/documents');
        if (response.data?.documents) {
          setDocuments(response.data.documents);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      await apiClient.post('/api/compvss/credentials/upload', formData);
      window.location.reload();
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar variant="compvss" />
        <div className="flex justify-center items-center py-24">
          <Spinner size="xl" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar variant="compvss" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <H1 className="mb-2">Upload Credentials</H1>
          <Body className="text-gray-600">Upload and manage your credential documents</Body>
        </div>

        <Card variant="compvss" className="mb-6">
          <CardHeader>
            <CardTitle>Upload Document</CardTitle>
          </CardHeader>
          <CardContent>
            <input type="file" onChange={handleFileUpload} disabled={uploading} className="block w-full text-sm" />
            {uploading && <Body className="mt-2">Uploading...</Body>}
          </CardContent>
        </Card>

        <div className="space-y-4">
          {documents.map((doc) => (
            <Card key={doc.id} variant="compvss">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Body className="font-medium">{doc.name}</Body>
                    <Body className="text-sm text-gray-500">{doc.type} • {new Date(doc.uploadedDate).toLocaleDateString()}</Body>
                  </div>
                  <Body className="text-sm">{doc.status}</Body>
                </div>
              </CardContent>
            </Card>
          ))}
          {documents.length === 0 && (
            <Card variant="compvss">
              <CardContent className="p-12 text-center">
                <Body className="text-gray-500">No documents uploaded yet</Body>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
