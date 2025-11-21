/**
 * Review Request Page - UI Rebuild
 */

'use client';

import * as React from 'react';
import { H1, Body, Label } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui-rebuild/atoms/Card';
import { Badge } from '@/components/ui-rebuild/atoms/Badge';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';


interface ReviewRequest {
  id: string;
  requestNumber: string;
  requester: string;
  amount: number;
  description: string;
  status: string;
  documents: Array<{ name: string; url: string }>;
}

export default function ReviewRequestPage() {
  const [loading, setLoading] = React.useState(true);
  const [requests, setRequests] = React.useState<ReviewRequest[]>([]);
  const [reviewing, setReviewing] = React.useState<string | null>(null);


  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<{ requests: ReviewRequest[] }>('/api/atlvs/advancing/review');
        if (response.data?.requests) {
          setRequests(response.data.requests);
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
      <div className="min-h-screen bg-white">
        <Navbar variant="atlvs" />
        <div className="flex justify-center items-center py-24">
          <Spinner size="xl" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar variant="atlvs" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <H1 className="mb-4">Review Request</H1>
          <Body className="text-gray-600">
            Review Request page content
          </Body>
        </div>

        <div className="space-y-6">
          {requests.map((request) => (
            <Card key={request.id} variant="atlvs">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>Request #{request.requestNumber}</CardTitle>
                    <CardDescription>{request.requester}</CardDescription>
                  </div>
                  <Badge>{request.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Amount</Label>
                  <Body className="font-semibold">${request.amount.toLocaleString()}</Body>
                </div>
                <div>
                  <Label>Description</Label>
                  <Body>{request.description}</Body>
                </div>
                {request.documents.length > 0 && (
                  <div>
                    <Label>Documents</Label>
                    <div className="space-y-2 mt-2">
                      {request.documents.map((doc, idx) => (
                        <a key={idx} href={doc.url} className="block text-sm text-blue-600 hover:underline">
                          {doc.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex gap-3">
                <Button
                  variant="atlvs"
                  disabled={reviewing === request.id}
                  loading={reviewing === request.id}
                >
                  Approve
                </Button>
                <Button variant="secondary">Request Changes</Button>
                <Button variant="ghost">Reject</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
