/**
 * ATLVS N8N Automation Hub - UI Rebuild
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

export default function AtlvsN8NPage() {
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }
        const response = await apiClient.get<any>('/api/atlvs/n8n');
        if (response.data) {
          setData(response.data);
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

  const modules = [
    { title: 'Workflows', description: 'Manage automation workflows', href: '/(rebuild)/atlvs/n8n/workflows', icon: '⚙️' },
    { title: 'Executions', description: 'View execution history', href: '/(rebuild)/atlvs/n8n/executions', icon: '📊' },
    { title: 'Templates', description: 'Browse workflow templates', href: '/(rebuild)/atlvs/n8n/templates', icon: '📋' },
    { title: 'Credentials', description: 'Manage API credentials', href: '/(rebuild)/atlvs/n8n/credentials', icon: '🔐' },
    { title: 'Webhooks', description: 'Configure webhooks', href: '/(rebuild)/atlvs/n8n/webhooks', icon: '🔗' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-12">
          <div>
            <H1 className="mb-2">Automation Hub</H1>
            <Body className="text-gray-600">N8N workflow automation</Body>
          </div>
          <Link href="/(rebuild)/atlvs/n8n/new">
            <Button>Create Workflow</Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => (
            <Link key={module.title} href={module.href}>
              <Card className="h-full hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all cursor-pointer">
                <CardHeader>
                  <div className="text-5xl mb-4">{module.icon}</div>
                  <CardTitle>{module.title}</CardTitle>
                  <CardDescription>{module.description}</CardDescription>
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
