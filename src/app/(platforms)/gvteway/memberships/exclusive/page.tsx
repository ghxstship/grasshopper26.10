/**
 * Exclusive Content Page - UI Rebuild
 * Members-only exclusive content and experiences
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { H1, H3, Body, Caption } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui-rebuild/atoms/Card';
import { Badge } from '@/components/ui-rebuild/atoms/Badge';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui-rebuild/molecules/Tabs';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';

interface ExclusiveContent {
  id: string;
  title: string;
  description: string;
  type: 'VIDEO' | 'ARTICLE' | 'EVENT' | 'OFFER';
  tier: string;
  imageUrl?: string;
  releaseDate: string;
}

export default function ExclusiveContentPage() {
  const [content, setContent] = React.useState<ExclusiveContent[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [hasAccess, setHasAccess] = React.useState(true);

  React.useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<{ content: ExclusiveContent[]; hasAccess: boolean }>('/api/memberships/exclusive');
        if (response.data) {
          setContent(response.data.content || []);
          setHasAccess(response.data.hasAccess);
        }
      } catch (error) {
        console.error('Failed to fetch exclusive content:', error);
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex justify-center items-center py-24">
          <Spinner size="xl" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card>
            <CardContent className="py-24 text-center">
              <H3 className="mb-4">Members Only</H3>
              <Body className="mb-8 text-gray-600">
                This content is exclusive to our members. Join today to unlock access.
              </Body>
              <Link href="/memberships">
                <Button>View Memberships</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const groupedContent = content.reduce((acc, item) => {
    if (!acc[item.type]) acc[item.type] = [];
    acc[item.type].push(item);
    return acc;
  }, {} as Record<string, ExclusiveContent[]>);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <H1 className="mb-4">Exclusive Content</H1>
          <Body className="text-gray-600">
            Premium content available only to our members
          </Body>
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Content</TabsTrigger>
            <TabsTrigger value="VIDEO">Videos</TabsTrigger>
            <TabsTrigger value="ARTICLE">Articles</TabsTrigger>
            <TabsTrigger value="EVENT">Events</TabsTrigger>
            <TabsTrigger value="OFFER">Offers</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {content.map((item) => (
                <Card key={item.id}>
                  {item.imageUrl && (
                    <div className="aspect-video bg-gray-200 border-b-2 border-black">
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge>{item.type}</Badge>
                      <Badge variant="ghost">{item.tier}</Badge>
                    </div>
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Caption className="text-gray-500">
                      Released {new Date(item.releaseDate).toLocaleDateString()}
                    </Caption>
                  </CardContent>
                  <CardFooter>
                    <Button fullWidth>View Content</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          {Object.entries(groupedContent).map(([type, items]) => (
            <TabsContent key={type} value={type} className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {items.map((item) => (
                  <Card key={item.id}>
                    <CardHeader>
                      <CardTitle>{item.title}</CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <Button fullWidth>View Content</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}
