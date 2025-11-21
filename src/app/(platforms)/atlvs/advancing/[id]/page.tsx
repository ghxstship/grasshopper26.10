/**
 * Request Details Page - UI Rebuild
 */

'use client';

import * as React from 'react';
import { H1, Body } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';
import { useParams } from 'next/navigation';

export default function RequestDetailsPage() {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<any>(null);
  const params = useParams();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get(`/api/atlvs/advancing/${params.id}`);
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
  }, [params.id]);

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
          <H1 className="mb-4">Request Details</H1>
          <Body className="text-gray-600">
            Request Details page content
          </Body>
        </div>

        {data ? (
          <>
            <Card variant="atlvs" className="mb-6">
              <CardHeader>
                <CardTitle>Request #{data.requestNumber}</CardTitle>
                <CardDescription>Status: {data.status}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Body className="font-semibold mb-2">Requester</Body>
                  <Body>{data.requester}</Body>
                </div>
                <div>
                  <Body className="font-semibold mb-2">Amount</Body>
                  <Body>${data.amount?.toLocaleString()}</Body>
                </div>
                <div>
                  <Body className="font-semibold mb-2">Description</Body>
                  <Body>{data.description}</Body>
                </div>
              </CardContent>
            </Card>
            <div className="flex gap-3">
              <Button variant="atlvs">Approve</Button>
              <Button variant="secondary">Reject</Button>
              <Button variant="ghost">Request Changes</Button>
            </div>
          </>
        ) : (
          <Card variant="atlvs">
            <CardContent className="py-12 text-center">
              <Body>Request not found</Body>
            </CardContent>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  );
}
