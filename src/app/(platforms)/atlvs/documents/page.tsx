/**
 * ATLVS Documents - UI Rebuild
 */

'use client';

import * as React from 'react';
import { H1, H3, Body, Caption } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Badge } from '@/components/ui-rebuild/atoms/Badge';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui-rebuild/molecules/Tabs';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  uploadedBy: { name: string };
}

export default function AtlvsDocumentsPage() {
  const [documents, setDocuments] = React.useState<Document[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<{ documents: Document[] }>('/api/atlvs/documents');
        if (response.data?.documents) {
          setDocuments(response.data.documents);
        }
      } catch (error) {
        console.error('Failed to fetch documents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const contracts = documents.filter((d) => d.type === 'CONTRACT');
  const permits = documents.filter((d) => d.type === 'PERMIT');
  const insurance = documents.filter((d) => d.type === 'INSURANCE');

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex justify-center items-center py-24">
          <Spinner size="xl" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-12">
          <div>
            <H1 className="mb-2">Documents</H1>
            <Body className="text-gray-600">{documents.length} total documents</Body>
          </div>
          <Button>Upload Document</Button>
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All ({documents.length})</TabsTrigger>
            <TabsTrigger value="contracts">Contracts ({contracts.length})</TabsTrigger>
            <TabsTrigger value="permits">Permits ({permits.length})</TabsTrigger>
            <TabsTrigger value="insurance">Insurance ({insurance.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="space-y-4">
              {documents.map((doc) => (
                <Card key={doc.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">📄</div>
                        <div>
                          <H3 className="mb-1">{doc.name}</H3>
                          <Caption className="text-gray-500">
                            {formatFileSize(doc.size)} • Uploaded by {doc.uploadedBy.name} • {new Date(doc.uploadedAt).toLocaleDateString()}
                          </Caption>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{doc.type}</Badge>
                        <Button variant="ghost" size="sm">Download</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="contracts">
            <div className="space-y-4">
              {contracts.map((doc) => (
                <Card key={doc.id}>
                  <CardHeader>
                    <CardTitle>{doc.name}</CardTitle>
                    <CardDescription>{formatFileSize(doc.size)}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="permits">
            <div className="space-y-4">
              {permits.map((doc) => (
                <Card key={doc.id}>
                  <CardHeader>
                    <CardTitle>{doc.name}</CardTitle>
                    <CardDescription>{formatFileSize(doc.size)}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="insurance">
            <div className="space-y-4">
              {insurance.map((doc) => (
                <Card key={doc.id}>
                  <CardHeader>
                    <CardTitle>{doc.name}</CardTitle>
                    <CardDescription>{formatFileSize(doc.size)}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
}
