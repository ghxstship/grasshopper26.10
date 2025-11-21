/**
 * ATLVS Advancing - UI Rebuild
 * Review and approve advancing requests
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { H1, H3, Body } from '@/components/ui-rebuild/atoms/Typography';
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
  title: string;
  category: string;
  status: string;
  submittedBy: { name: string };
  createdAt: string;
  priority: string;
}

export default function AtlvsAdvancingPage() {
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

        const response = await apiClient.get<{ requests: AdvancingRequest[] }>('/api/atlvs/advancing');
        if (response.data?.requests) {
          setRequests(response.data.requests);
        }
      } catch (error) {
        console.error('Failed to fetch requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const pending = requests.filter((r) => r.status === 'PENDING');
  const approved = requests.filter((r) => r.status === 'APPROVED');
  const rejected = requests.filter((r) => r.status === 'REJECTED');

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
          <H1 className="mb-4">Advancing Requests</H1>
          <Body className="text-gray-600">Review and approve production requests</Body>
        </div>

        <Tabs defaultValue="pending">
          <TabsList>
            <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
            <TabsTrigger value="approved">Approved ({approved.length})</TabsTrigger>
            <TabsTrigger value="rejected">Rejected ({rejected.length})</TabsTrigger>
            <TabsTrigger value="all">All ({requests.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            {pending.length === 0 ? (
              <Card>
                <CardContent className="py-24 text-center">
                  <H3 className="mb-4">No pending requests</H3>
                  <Body className="text-gray-600">All requests have been reviewed</Body>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {pending.map((request) => (
                  <Card key={request.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge variant="outline">{request.category}</Badge>
                            <Badge>{request.priority}</Badge>
                          </div>
                          <CardTitle>{request.title}</CardTitle>
                          <CardDescription>
                            Submitted by {request.submittedBy.name} • {new Date(request.createdAt).toLocaleDateString()}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardFooter className="flex gap-3">
                      <Link href={`/(rebuild)/atlvs/advancing/${request.id}`} className="flex-1">
                        <Button fullWidth>Review</Button>
                      </Link>
                      <Button variant="secondary">Assign</Button>
                    </CardFooter>
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
                        <Badge>APPROVED</Badge>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="rejected">
            {rejected.length === 0 ? (
              <Card>
                <CardContent className="py-24 text-center">
                  <Body className="text-gray-600">No rejected requests</Body>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {rejected.map((request) => (
                  <Card key={request.id} className="opacity-60">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{request.title}</CardTitle>
                          <CardDescription>{request.category}</CardDescription>
                        </div>
                        <Badge variant="ghost">REJECTED</Badge>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="all">
            <div className="space-y-4">
              {requests.map((request) => (
                <Card key={request.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{request.title}</CardTitle>
                        <CardDescription>{request.category}</CardDescription>
                      </div>
                      <Badge variant={request.status === 'APPROVED' ? 'default' : 'outline'}>
                        {request.status}
                      </Badge>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
}
