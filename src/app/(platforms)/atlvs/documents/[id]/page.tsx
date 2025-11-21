/**
 * Document Details Page - UI Rebuild
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
import { useParams } from 'next/navigation';
import { Download, Eye, Edit } from 'lucide-react';

interface DocumentDetails {
  id: string;
  name: string;
  type: string;
  status: string;
  uploadedBy: string;
  uploadedAt: string;
  size: number;
  description: string;
  url: string;
}

export default function DocumentDetailsPage() {
  const [loading, setLoading] = React.useState(true);
  const [document, setDocument] = React.useState<DocumentDetails | null>(null);
  const params = useParams();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<DocumentDetails>(`/api/atlvs/documents/${params.id}`);
        if (response.data) setDocument(response.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

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
            <H1 className="mb-4">Document Details</H1>
            <Body className="text-gray-600">
              View and manage document information
            </Body>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost"><Eye className="w-4 h-4 mr-2" />Preview</Button>
            <Button variant="ghost"><Download className="w-4 h-4 mr-2" />Download</Button>
            <Button variant="atlvs"><Edit className="w-4 h-4 mr-2" />Edit</Button>
          </div>
        </div>

        {document && (
          <Card variant="atlvs">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{document.name}</CardTitle>
                  <CardDescription>Uploaded by {document.uploadedBy} on {new Date(document.uploadedAt).toLocaleDateString()}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge>{document.status}</Badge>
                  <Badge variant="outline">{document.type}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Body className="text-sm text-gray-600 mb-2">Description</Body>
                <Body>{document.description}</Body>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Body className="text-sm text-gray-600">File Size</Body>
                  <Body className="font-semibold">{(document.size / 1024 / 1024).toFixed(2)} MB</Body>
                </div>
                <div>
                  <Body className="text-sm text-gray-600">Document Type</Body>
                  <Body className="font-semibold">{document.type}</Body>
                </div>
                <div>
                  <Body className="text-sm text-gray-600">Status</Body>
                  <Body className="font-semibold">{document.status}</Body>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  );
}
