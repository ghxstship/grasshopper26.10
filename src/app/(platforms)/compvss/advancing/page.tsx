/**
 * COMPVSS Advancing Dashboard - UI Rebuild
 * Production advancing requests
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

interface AdvancingRequest {
  id: string;
  category: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  title: string;
}

export default function CompvssAdvancingPage() {
  const [requests, setRequests] = React.useState<AdvancingRequest[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<{ requests: AdvancingRequest[] }>('/api/compvss/advancing');
        if (response.data?.requests) {
          setRequests(response.data.requests);
        }
      } catch (error) {
        console.error('Failed to fetch advancing requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const categories = [
    { name: 'Access & Credentials', icon: '🔑', href: '/(rebuild)/compvss/advancing/access-credentials' },
    { name: 'Site Infrastructure', icon: '🏗️', href: '/(rebuild)/compvss/advancing/site-infrastructure' },
    { name: 'Site Assets', icon: '📦', href: '/(rebuild)/compvss/advancing/site-assets' },
    { name: 'Site Utilities', icon: '⚡', href: '/(rebuild)/compvss/advancing/site-utilities' },
    { name: 'Site Vehicles', icon: '🚗', href: '/(rebuild)/compvss/advancing/site-vehicles' },
    { name: 'Heavy Equipment', icon: '🚜', href: '/(rebuild)/compvss/advancing/heavy-equipment' },
    { name: 'Technical Production', icon: '🎛️', href: '/(rebuild)/compvss/advancing/technical-production' },
    { name: 'Hospitality', icon: '🍽️', href: '/(rebuild)/compvss/advancing/hospitality' },
    { name: 'Travel & Logistics', icon: '✈️', href: '/(rebuild)/compvss/advancing/travel-logistics' },
  ];

  const pending = requests.filter((r) => r.status === 'PENDING');
  const approved = requests.filter((r) => r.status === 'APPROVED');
  const completed = requests.filter((r) => r.status === 'COMPLETED');

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

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <H1 className="mb-4">Production Advancing</H1>
          <Body className="text-gray-600">
            Submit and track production advancing requests
          </Body>
        </div>

        <div className="mb-12">
          <H3 className="mb-6">Request Categories</H3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link key={category.name} href={category.href}>
                <Card className="hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all cursor-pointer">
                  <CardHeader>
                    <div className="text-4xl mb-3">{category.icon}</div>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All ({requests.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
            <TabsTrigger value="approved">Approved ({approved.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completed.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {requests.length === 0 ? (
              <Card>
                <CardContent className="py-24 text-center">
                  <H3 className="mb-4">No requests yet</H3>
                  <Body className="text-gray-600">
                    Start by creating a new advancing request
                  </Body>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {requests.map((request) => (
                  <Card key={request.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{request.title}</CardTitle>
                          <CardDescription>
                            {request.category} • {new Date(request.createdAt).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <Badge variant={request.status === 'APPROVED' ? 'default' : 'outline'}>
                          {request.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardFooter>
                      <Link href={`/(rebuild)/compvss/advancing/${request.id}`} className="w-full">
                        <Button variant="secondary" fullWidth>View Details</Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="pending">
            {pending.length === 0 ? (
              <Card>
                <CardContent className="py-24 text-center">
                  <Body className="text-gray-600">No pending requests</Body>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {pending.map((request) => (
                  <Card key={request.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{request.title}</CardTitle>
                          <CardDescription>{request.category}</CardDescription>
                        </div>
                        <Badge variant="outline">{request.status}</Badge>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="approved">
            {approved.length === 0 ? (
              <Card>
                <CardContent className="py-24 text-center">
                  <Body className="text-gray-600">No approved requests</Body>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {approved.map((request) => (
                  <Card key={request.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{request.title}</CardTitle>
                          <CardDescription>{request.category}</CardDescription>
                        </div>
                        <Badge>{request.status}</Badge>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed">
            {completed.length === 0 ? (
              <Card>
                <CardContent className="py-24 text-center">
                  <Body className="text-gray-600">No completed requests</Body>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {completed.map((request) => (
                  <Card key={request.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{request.title}</CardTitle>
                          <CardDescription>{request.category}</CardDescription>
                        </div>
                        <Badge variant="ghost">{request.status}</Badge>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}
