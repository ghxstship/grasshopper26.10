/**
 * Asset Details Page - UI Rebuild
 */

'use client';

import * as React from 'react';
import { H1, Body, Label } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Badge } from '@/components/ui-rebuild/atoms/Badge';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';
import { useParams } from 'next/navigation';

interface Asset {
  id: string;
  name: string;
  type: string;
  status: 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE';
  location: string;
  assignedTo?: string;
  lastMaintenance: string;
  nextMaintenance: string;
}

export default function AssetDetailsPage() {
  const [loading, setLoading] = React.useState(true);
  const [asset, setAsset] = React.useState<Asset | null>(null);
  const params = useParams();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<Asset>(`/api/atlvs/assets/${params.id}`);
        if (response.data) {
          setAsset(response.data);
        }
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
        <div className="mb-12">
          <H1 className="mb-4">{asset?.name || 'Asset Details'}</H1>
          <Body className="text-gray-600">
            Asset information and management
          </Body>
        </div>

        {asset && (
          <>
            <Card variant="atlvs" className="mb-6">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle>Asset Information</CardTitle>
                  <Badge variant={asset.status === 'AVAILABLE' ? 'default' : asset.status === 'IN_USE' ? 'outline' : 'ghost'}>
                    {asset.status.replace('_', ' ')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Type</Label>
                    <Body>{asset.type}</Body>
                  </div>
                  <div>
                    <Label>Location</Label>
                    <Body>{asset.location}</Body>
                  </div>
                  {asset.assignedTo && (
                    <div>
                      <Label>Assigned To</Label>
                      <Body>{asset.assignedTo}</Body>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card variant="atlvs">
              <CardHeader>
                <CardTitle>Maintenance Schedule</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label>Last Maintenance</Label>
                  <Body>{new Date(asset.lastMaintenance).toLocaleDateString()}</Body>
                </div>
                <div>
                  <Label>Next Maintenance</Label>
                  <Body>{new Date(asset.nextMaintenance).toLocaleDateString()}</Body>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
