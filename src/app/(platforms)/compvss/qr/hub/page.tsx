/**
 * QR Hub Page - UI Rebuild
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


export default function QRHubPage() {
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

        const response = await apiClient.get('/api/compvss/qr/stats');
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
          <H1 className="mb-4">QR Hub</H1>
          <Body className="text-gray-600">
            QR Hub page content
          </Body>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card variant="compvss"><CardContent className="p-6"><Body className="text-sm text-gray-500">Total Scans</Body><Body className="text-2xl font-bold">{data?.totalScans || 0}</Body></CardContent></Card>
          <Card variant="compvss"><CardContent className="p-6"><Body className="text-sm text-gray-500">Generated</Body><Body className="text-2xl font-bold">{data?.generated || 0}</Body></CardContent></Card>
          <Card variant="compvss"><CardContent className="p-6"><Body className="text-sm text-gray-500">Active</Body><Body className="text-2xl font-bold">{data?.active || 0}</Body></CardContent></Card>
          <Card variant="compvss"><CardContent className="p-6"><Body className="text-sm text-gray-500">Access Points</Body><Body className="text-2xl font-bold">{data?.accessPoints || 0}</Body></CardContent></Card>
        </div>
        <Card variant="compvss">
          <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <Button variant="compvss" className="w-full">Scan QR Code</Button>
            <Button variant="secondary" className="w-full">Generate New Code</Button>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
