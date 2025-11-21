/**
 * COMPVSS QR Hub - UI Rebuild
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { H1, Body } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';

export default function CompvssQRPage() {
  const [data, setData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }
        const response = await apiClient.get<any>('/api/compvss/qr/hub');
        if (response.data) {
          setData(response.data.qrData || response.data);
        }
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
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  const features = [
    { title: 'Scan QR Code', description: 'Scan codes for access control', href: '/(rebuild)/compvss/qr/scan', icon: '📱' },
    { title: 'Generate QR', description: 'Create new QR codes', href: '/(rebuild)/compvss/qr/generate', icon: '⚡' },
    { title: 'Scan History', description: 'View scan history', href: '/(rebuild)/compvss/qr/history', icon: '📜' },
    { title: 'Access Control', description: 'Manage access permissions', href: '/(rebuild)/compvss/qr/access', icon: '🔐' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <H1 className="mb-4">QR Code Hub</H1>
          <Body className="text-gray-600">Scan and manage QR codes</Body>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature) => (
            <Link key={feature.title} href={feature.href}>
              <Card className="h-full hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all cursor-pointer">
                <CardHeader>
                  <div className="text-5xl mb-4">{feature.icon}</div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="secondary" fullWidth>Open →</Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
