/**
 * Approved Requests Page - UI Rebuild
 */

'use client';

import * as React from 'react';
import { H1, H3, Body } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Badge } from '@/components/ui-rebuild/atoms/Badge';
import Link from 'next/link';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';


interface Request {
  id: string;
  requestNumber: string;
  requester: string;
  amount: number;
  approvedDate: string;
  approvedBy: string;
}

export default function ApprovedRequestsPage() {
  const [loading, setLoading] = React.useState(true);
  const [requests, setRequests] = React.useState<Request[]>([]);


  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<{ requests: Request[] }>('/api/atlvs/advancing/approved');
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
          <H1 className="mb-4">Approved Requests</H1>
          <Body className="text-gray-600">
            Approved Requests page content
          </Body>
        </div>

        {requests.length === 0 ? (
          <Card variant="atlvs">
            <CardContent className="py-24 text-center">
              <H3 className="mb-4">No approved requests</H3>
              <Body className="text-gray-600">Approved requests will appear here</Body>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <Link key={request.id} href={`/atlvs/advancing/${request.id}`}>
                <Card variant="atlvs" className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>Request #{request.requestNumber}</CardTitle>
                        <CardDescription>{request.requester}</CardDescription>
                      </div>
                      <Badge className="bg-green-600 text-white">Approved</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Body className="text-sm text-gray-600">Amount</Body>
                        <Body className="font-semibold">${request.amount.toLocaleString()}</Body>
                      </div>
                      <div>
                        <Body className="text-sm text-gray-600">Approved By</Body>
                        <Body className="font-semibold">{request.approvedBy}</Body>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
