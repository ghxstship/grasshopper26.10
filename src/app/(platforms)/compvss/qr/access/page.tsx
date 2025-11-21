/**
 * Access Control Page - UI Rebuild
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


export default function AccessControlPage() {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<any>(null);


  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get('/api/compvss/qr/access-control');
        setData(response.data);
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
        <div className="mb-12">
          <H1 className="mb-4">Access Control</H1>
          <Body className="text-gray-600">
            Access Control page content
          </Body>
        </div>

        <Card variant="compvss">
          <CardHeader>
            <CardTitle>Access Control</CardTitle>
            <CardDescription>QR-based access management</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data?.accessPoints && data.accessPoints.map((point: any) => (
                <div key={point.id} className="flex items-center justify-between p-4 border rounded">
                  <div>
                    <Body className="font-medium">{point.name}</Body>
                    <Body className="text-sm text-gray-500">{point.location}</Body>
                  </div>
                  <Body className={point.hasAccess ? 'text-green-600' : 'text-red-600'}>
                    {point.hasAccess ? '✓ Access' : '✗ No Access'}
                  </Body>
                </div>
              ))}
              {(!data?.accessPoints || data.accessPoints.length === 0) && (
                <Body className="text-gray-500 text-center py-8">No access points configured</Body>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
