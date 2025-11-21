/**
 * Request Details Page - UI Rebuild
 * View detailed information about a specific advancing request
 */

'use client';

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { H1, Body, Caption } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Badge } from '@/components/ui-rebuild/atoms/Badge';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Separator } from '@/components/ui-rebuild/atoms/Separator';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { Alert } from '@/components/ui-rebuild/molecules/Alert';
import { apiClient } from '@/lib/api/client';

interface RequestDetails {
  id: string;
  requestNumber: string;
  type: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  quantity: number;
  deadline?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  submittedBy: {
    name: string;
    email: string;
  };
  assignedTo?: {
    name: string;
    email: string;
  };
  history: Array<{
    id: string;
    action: string;
    timestamp: string;
    user: string;
    notes?: string;
  }>;
}

export default function RequestDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = React.useState(true);
  const [request, setRequest] = React.useState<RequestDetails | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchRequest = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<{ request: RequestDetails }>(
          `/api/compvss/advancing/requests/${params.id}`
        );
        if (response.data?.request) {
          setRequest(response.data.request);
        }
      } catch (err) {
        console.error('Failed to fetch request:', err);
        setError('Failed to load request details');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchRequest();
    }
  }, [params.id]);

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

  if (error || !request) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar variant="compvss" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Alert variant="error" className="mb-6">
            {error || 'Request not found'}
          </Alert>
          <Button variant="secondary" onClick={() => router.back()}>
            Go Back
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar variant="compvss" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Badge>{request.status}</Badge>
            <Badge>{request.priority}</Badge>
            <Caption className="text-gray-500">{request.requestNumber}</Caption>
          </div>
          <H1 className="mb-2">{request.title}</H1>
          <Body className="text-gray-600 capitalize">{request.type.replace(/-/g, ' ')}</Body>
        </div>

        <div className="space-y-6">
          <Card variant="compvss">
            <CardHeader>
              <CardTitle>Request Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Caption className="font-medium mb-1">Description</Caption>
                <Body>{request.description}</Body>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Caption className="font-medium mb-1">Quantity</Caption>
                  <Body>{request.quantity}</Body>
                </div>
                {request.deadline && (
                  <div>
                    <Caption className="font-medium mb-1">Deadline</Caption>
                    <Body>{new Date(request.deadline).toLocaleDateString()}</Body>
                  </div>
                )}
              </div>

              {request.notes && (
                <>
                  <Separator />
                  <div>
                    <Caption className="font-medium mb-1">Additional Notes</Caption>
                    <Body>{request.notes}</Body>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card variant="compvss">
            <CardHeader>
              <CardTitle>Request Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Caption className="font-medium mb-1">Submitted By</Caption>
                <Body>{request.submittedBy.name}</Body>
                <Caption className="text-gray-500">{request.submittedBy.email}</Caption>
              </div>

              {request.assignedTo && (
                <>
                  <Separator />
                  <div>
                    <Caption className="font-medium mb-1">Assigned To</Caption>
                    <Body>{request.assignedTo.name}</Body>
                    <Caption className="text-gray-500">{request.assignedTo.email}</Caption>
                  </div>
                </>
              )}

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Caption className="font-medium mb-1">Created</Caption>
                  <Body>{new Date(request.createdAt).toLocaleDateString()}</Body>
                </div>
                <div>
                  <Caption className="font-medium mb-1">Last Updated</Caption>
                  <Body>{new Date(request.updatedAt).toLocaleDateString()}</Body>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="compvss">
            <CardHeader>
              <CardTitle>Request History</CardTitle>
              <CardDescription>{request.history.length} updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {request.history.map((entry, index) => (
                  <div key={entry.id}>
                    {index > 0 && <Separator className="my-4" />}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Body className="font-medium">{entry.action}</Body>
                        <Caption className="text-gray-500">
                          {entry.user} • {new Date(entry.timestamp).toLocaleString()}
                        </Caption>
                        {entry.notes && (
                          <Body className="mt-2 text-gray-600">{entry.notes}</Body>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button variant="secondary" onClick={() => router.back()} className="flex-1">
              Back to Requests
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
