/**
 * Document Library Page - UI Rebuild
 */

'use client';

import * as React from 'react';
import { H1, Body } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { Badge } from '@/components/ui-rebuild/atoms/Badge';
import { apiClient } from '@/lib/api/client';
import { FileText } from 'lucide-react';

interface LibraryDocument {
  id: string;
  name: string;
  category: string;
  size: number;
  uploadedBy: string;
  uploadedAt: string;
}

export default function DocumentLibraryPage() {
  const [loading, setLoading] = React.useState(true);
  const [documents, setDocuments] = React.useState<LibraryDocument[]>([]);


  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }
        const response = await apiClient.get<{ documents: LibraryDocument[] }>('/api/atlvs/documents/library');
        if (response.data?.documents) setDocuments(response.data.documents);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar variant="atlvs" />
        <div className="flex justify-center items-center py-24">
          <Spinner size="xl" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar variant="atlvs" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12 flex items-center justify-between">
          <div>
            <H1 className="mb-4">Document Library</H1>
            <Body className="text-gray-600">
              Centralized repository for all production documents
            </Body>
          </div>
          <Button variant="atlvs">Upload File</Button>
        </div>

        <div className="space-y-4">
          {documents.map((doc) => (
            <Card key={doc.id} variant="atlvs">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 mt-1" />
                  <div className="flex-1">
                    <CardTitle>{doc.name}</CardTitle>
                    <CardDescription>
                      {doc.category} • {(doc.size / 1024 / 1024).toFixed(2)} MB • Uploaded by {doc.uploadedBy}
                    </CardDescription>
                  </div>
                  <Body className="text-sm text-gray-600">
                    {new Date(doc.uploadedAt).toLocaleDateString()}
                  </Body>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
