'use client';

import * as React from 'react';
import { H1, Body } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Badge } from '@/components/ui-rebuild/atoms/Badge';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';
import { useRouter } from 'next/navigation';
import { FileText, Shield, FileCheck, FileEdit, FolderOpen } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: 'CONTRACT' | 'PERMIT' | 'INSURANCE' | 'RIDER' | 'TEMPLATE' | 'OTHER';
  status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'EXPIRED';
  uploadedAt: string;
  expiresAt?: string;
}

export default function DocumentsPage() {
  const [loading, setLoading] = React.useState(true);
  const [documents, setDocuments] = React.useState<Document[]>([]);
  const router = useRouter();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<{ documents: Document[] }>('/api/atlvs/documents');
        if (response.data?.documents) setDocuments(response.data.documents);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getDocumentIcon = (type: Document['type']) => {
    switch (type) {
      case 'CONTRACT': return <FileText className="w-5 h-5" />;
      case 'PERMIT': return <FileCheck className="w-5 h-5" />;
      case 'INSURANCE': return <Shield className="w-5 h-5" />;
      case 'RIDER': return <FileEdit className="w-5 h-5" />;
      case 'TEMPLATE': return <FolderOpen className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

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
              Manage contracts, permits, insurance, and production documents
            </Body>
          </div>
          <Button variant="atlvs">Upload Document</Button>
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card variant="atlvs" className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/atlvs/documents/contracts')}>
            <CardContent className="pt-6">
              <FileText className="w-8 h-8 mb-4 text-green-600" />
              <CardTitle className="mb-2">Contracts</CardTitle>
              <Body className="text-gray-600">Vendor and talent contracts</Body>
            </CardContent>
          </Card>
          
          <Card variant="atlvs" className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/atlvs/documents/permits')}>
            <CardContent className="pt-6">
              <FileCheck className="w-8 h-8 mb-4 text-blue-600" />
              <CardTitle className="mb-2">Permits</CardTitle>
              <Body className="text-gray-600">Location and filming permits</Body>
            </CardContent>
          </Card>
          
          <Card variant="atlvs" className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/atlvs/documents/insurance')}>
            <CardContent className="pt-6">
              <Shield className="w-8 h-8 mb-4 text-purple-600" />
              <CardTitle className="mb-2">Insurance</CardTitle>
              <Body className="text-gray-600">Insurance certificates</Body>
            </CardContent>
          </Card>
        </div>

        {/* Recent Documents */}
        <div className="mb-6">
          <H1 className="text-2xl mb-4">Recent Documents</H1>
        </div>

        <div className="space-y-4">
          {documents.map((doc) => (
            <Card 
              key={doc.id} 
              variant="atlvs"
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => router.push(`/atlvs/documents/${doc.id}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {getDocumentIcon(doc.type)}
                    <div>
                      <CardTitle>{doc.name}</CardTitle>
                      <CardDescription>
                        Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                        {doc.expiresAt && ` • Expires ${new Date(doc.expiresAt).toLocaleDateString()}`}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={doc.status === 'APPROVED' ? 'default' : 'outline'}>
                      {doc.status}
                    </Badge>
                    <Badge variant="outline">{doc.type}</Badge>
                  </div>
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