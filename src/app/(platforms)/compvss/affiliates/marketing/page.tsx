/**
 * Marketing Materials Page - UI Rebuild
 */

'use client';

import * as React from 'react';
import { H1, Body, Caption } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';

interface MarketingMaterial {
  id: string;
  title: string;
  type: string;
  url: string;
  downloadCount: number;
}

export default function MarketingMaterialsPage() {
  const [loading, setLoading] = React.useState(true);
  const [materials, setMaterials] = React.useState<MarketingMaterial[]>([]);

  React.useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<{ materials: MarketingMaterial[] }>('/api/compvss/affiliates/marketing');
        if (response.data?.materials) {
          setMaterials(response.data.materials);
        }
      } catch (error) {
        console.error('Failed to fetch materials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, []);

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
          <H1 className="mb-2">Marketing Materials</H1>
          <Body className="text-gray-600">Download marketing assets for promotion</Body>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {materials.map((material) => (
            <Card key={material.id} variant="compvss">
              <CardHeader>
                <CardTitle>{material.title}</CardTitle>
                <CardDescription className="capitalize">{material.type}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Caption className="text-gray-500">{material.downloadCount} downloads</Caption>
                  <Button variant="compvss" onClick={() => window.open(material.url, '_blank')}>Download</Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {materials.length === 0 && (
            <Card variant="compvss" className="col-span-full">
              <CardContent className="p-12 text-center">
                <Body className="text-gray-500">No marketing materials available</Body>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
