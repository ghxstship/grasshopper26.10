/**
 * Affiliate Links Page - UI Rebuild
 */

'use client';

import * as React from 'react';
import { H1, Body, Caption } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Input } from '@/components/ui-rebuild/atoms/Input';
import { Badge } from '@/components/ui-rebuild/atoms/Badge';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';

interface AffiliateLink {
  id: string;
  url: string;
  code: string;
  clicks: number;
  conversions: number;
  createdAt: string;
}

export default function AffiliateLinksPage() {
  const [loading, setLoading] = React.useState(true);
  const [links, setLinks] = React.useState<AffiliateLink[]>([]);

  React.useEffect(() => {
    const fetchLinks = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<{ links: AffiliateLink[] }>('/api/compvss/affiliates/links');
        if (response.data?.links) {
          setLinks(response.data.links);
        }
      } catch (error) {
        console.error('Failed to fetch links:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, []);

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
  };

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
          <H1 className="mb-2">Affiliate Links</H1>
          <Body className="text-gray-600">Manage and track your affiliate links</Body>
        </div>

        <div className="space-y-4">
          {links.map((link) => (
            <Card key={link.id} variant="compvss">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <CardTitle>Link #{link.code}</CardTitle>
                  <Badge>Active</Badge>
                </div>
                <CardDescription>Created: {new Date(link.createdAt).toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input value={link.url} readOnly className="flex-1" />
                  <Button variant="compvss" onClick={() => copyToClipboard(link.url)}>Copy</Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Caption className="text-gray-500">Clicks</Caption>
                    <Body className="font-medium">{link.clicks}</Body>
                  </div>
                  <div>
                    <Caption className="text-gray-500">Conversions</Caption>
                    <Body className="font-medium">{link.conversions}</Body>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {links.length === 0 && (
            <Card variant="compvss">
              <CardContent className="p-12 text-center">
                <Body className="text-gray-500">No affiliate links yet</Body>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
