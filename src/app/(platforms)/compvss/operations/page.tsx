/**
 * COMPVSS Operations Hub - UI Rebuild
 * Day-of-show operations
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

export default function CompvssOperationsPage() {
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
        const response = await apiClient.get<any>('/api/compvss/operations');
        if (response.data) {
          setData(response.data.operations || response.data);
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

  const operations = [
    { title: 'Check-In', description: 'Scan QR and check in', href: '/(rebuild)/compvss/operations/checkin', icon: '✓' },
    { title: 'Tasks', description: 'View and manage tasks', href: '/(rebuild)/compvss/operations/tasks', icon: '📋' },
    { title: 'Schedule', description: 'View event schedule', href: '/(rebuild)/compvss/operations/schedule', icon: '📅' },
    { title: 'Site Map', description: 'View venue layout', href: '/(rebuild)/compvss/operations/map', icon: '🗺️' },
    { title: 'Contacts', description: 'Team directory', href: '/(rebuild)/compvss/operations/contacts', icon: '📞' },
    { title: 'Report Issue', description: 'Report problems', href: '/(rebuild)/compvss/issues/new', icon: '⚠️' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <H1 className="mb-4">Day-of-Show Operations</H1>
          <Body className="text-gray-600">Real-time operations management</Body>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {operations.map((op) => (
            <Link key={op.title} href={op.href}>
              <Card className="h-full hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all cursor-pointer">
                <CardHeader>
                  <div className="text-5xl mb-4">{op.icon}</div>
                  <CardTitle>{op.title}</CardTitle>
                  <CardDescription>{op.description}</CardDescription>
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
