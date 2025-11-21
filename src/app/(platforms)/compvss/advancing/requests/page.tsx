/**
 * My Requests Page - UI Rebuild
 * View and manage all advancing requests
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { H1, Body, Caption } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Badge } from '@/components/ui-rebuild/atoms/Badge';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui-rebuild/molecules/Tabs';
import { apiClient } from '@/lib/api/client';

interface Request {
  id: string;
  requestNumber: string;
  type: string;
  title: string;
  status: string;
  priority: string;
  createdAt: string;
  deadline?: string;
}

export default function MyRequestsPage() {
  const [loading, setLoading] = React.useState(true);
  const [requests, setRequests] = React.useState<Request[]>([]);

  React.useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<{ requests: Request[] }>('/api/compvss/advancing/requests');
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

  const pendingRequests = requests.filter((r) => r.status === 'PENDING' || r.status === 'IN_REVIEW');
  const approvedRequests = requests.filter((r) => r.status === 'APPROVED');
  const completedRequests = requests.filter((r) => r.status === 'COMPLETED');

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'default';
      case 'IN_REVIEW':
        return 'default';
      case 'APPROVED':
        return 'default';
      case 'COMPLETED':
        return 'ghost';
      case 'REJECTED':
        return 'ghost';
      default:
        return 'default';
    }
  };

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'default';
      case 'high':
        return 'default';
      default:
        return 'ghost';
    }
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

  const RequestCard = ({ request }: { request: Request }) => (
    <Link href={`/compvss/advancing/requests/${request.id}`}>
      <Card className="hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all cursor-pointer">
        <CardHeader>
          <div className="flex items-start justify-between mb-2">
            <div className="flex gap-2">
              <Badge variant={getStatusVariant(request.status)}>{request.status}</Badge>
              <Badge variant={getPriorityVariant(request.priority)}>{request.priority}</Badge>
            </div>
            <Caption className="text-gray-500">{request.requestNumber}</Caption>
          </div>
          <CardTitle>{request.title}</CardTitle>
          <CardDescription className="capitalize">{request.type.replace(/-/g, ' ')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-sm">
            <Caption className="text-gray-500">
              Created: {new Date(request.createdAt).toLocaleDateString()}
            </Caption>
            {request.deadline && (
              <Caption className="text-gray-500">
                Due: {new Date(request.deadline).toLocaleDateString()}
              </Caption>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );

  return (
    <div className="min-h-screen bg-white">
      <Navbar variant="compvss" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <H1 className="mb-2">My Requests</H1>
            <Body className="text-gray-600">{requests.length} total requests</Body>
          </div>
          <Link href="/compvss/advancing/new">
            <Button variant="compvss">New Request</Button>
          </Link>
        </div>

        <Tabs defaultValue="pending">
          <TabsList>
            <TabsTrigger value="pending">Pending ({pendingRequests.length})</TabsTrigger>
            <TabsTrigger value="approved">Approved ({approvedRequests.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedRequests.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pendingRequests.map((request) => (
                <RequestCard key={request.id} request={request} />
              ))}
              {pendingRequests.length === 0 && (
                <Card variant="compvss">
                  <CardContent className="p-12 text-center">
                    <Body className="text-gray-500">No pending requests</Body>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="approved">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {approvedRequests.map((request) => (
                <RequestCard key={request.id} request={request} />
              ))}
              {approvedRequests.length === 0 && (
                <Card variant="compvss">
                  <CardContent className="p-12 text-center">
                    <Body className="text-gray-500">No approved requests</Body>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="completed">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {completedRequests.map((request) => (
                <RequestCard key={request.id} request={request} />
              ))}
              {completedRequests.length === 0 && (
                <Card variant="compvss">
                  <CardContent className="p-12 text-center">
                    <Body className="text-gray-500">No completed requests</Body>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}
