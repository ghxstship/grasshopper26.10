/**
 * Site Assets Advancing Page - UI Rebuild
 * Manage site asset requests (furniture, signage, equipment)
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
import { apiClient } from '@/lib/api/client';

interface AssetRequest {
  id: string;
  requestNumber: string;
  assetType: string;
  description: string;
  status: string;
  quantity: number;
  deliveryDate: string;
}

export default function SiteAssetsPage() {
  const [loading, setLoading] = React.useState(true);
  const [requests, setRequests] = React.useState<AssetRequest[]>([]);

  React.useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<{ requests: AssetRequest[] }>('/api/compvss/advancing/site-assets');
        if (response.data?.requests) {
          setRequests(response.data.requests);
        }
      } catch (error) {
        console.error('Failed to fetch asset requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

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
        <div className="flex items-center justify-between mb-8">
          <div>
            <H1 className="mb-2">Site Assets</H1>
            <Body className="text-gray-600">Furniture, signage, and equipment requests</Body>
          </div>
          <Link href="/compvss/advancing/new?type=site-assets">
            <Button variant="compvss">New Asset Request</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((request) => (
            <Link key={request.id} href={`/compvss/advancing/requests/${request.id}`}>
              <Card className="hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge>{request.status}</Badge>
                    <Caption className="text-gray-500">{request.requestNumber}</Caption>
                  </div>
                  <CardTitle className="capitalize">{request.assetType}</CardTitle>
                  <CardDescription>{request.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <Caption className="text-gray-500">Quantity:</Caption>
                      <Caption className="font-medium">{request.quantity}</Caption>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <Caption className="text-gray-500">Delivery:</Caption>
                      <Caption className="font-medium">{new Date(request.deliveryDate).toLocaleDateString()}</Caption>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}

          {requests.length === 0 && (
            <Card variant="compvss" className="col-span-full">
              <CardContent className="p-12 text-center">
                <Body className="text-gray-500 mb-4">No asset requests yet</Body>
                <Link href="/compvss/advancing/new?type=site-assets">
                  <Button variant="compvss">Create First Request</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
