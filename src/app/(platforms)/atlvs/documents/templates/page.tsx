/**
 * Templates Page - UI Rebuild
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

interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  usageCount: number;
  lastUsed: string;
}

export default function TemplatesPage() {
  const [loading, setLoading] = React.useState(true);
  const [templates, setTemplates] = React.useState<Template[]>([]);


  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<{ templates: Template[] }>('/api/atlvs/documents/templates');
        if (response.data?.templates) setTemplates(response.data.templates);
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
            <H1 className="mb-4">Document Templates</H1>
            <Body className="text-gray-600">
              Reusable templates for contracts, forms, and documents
            </Body>
          </div>
          <Button variant="atlvs">Create Template</Button>
        </div>

        <div className="space-y-4">
          {templates.map((template) => (
            <Card key={template.id} variant="atlvs">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 mt-1" />
                  <div className="flex-1">
                    <CardTitle>{template.name}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </div>
                  <Badge variant="outline">{template.category}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <Body className="text-sm">Used {template.usageCount} times</Body>
                  <Body className="text-sm">•</Body>
                  <Body className="text-sm">Last used {new Date(template.lastUsed).toLocaleDateString()}</Body>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
