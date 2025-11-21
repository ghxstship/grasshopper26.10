/**
 * Advancing Analytics Page - UI Rebuild
 * Analytics and metrics for advancing requests
 */

'use client';

import * as React from 'react';
import { H1, H3, Body, Display } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Badge } from '@/components/ui-rebuild/atoms/Badge';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';


interface AnalyticsData {
  totalRequests: number;
  approved: number;
  pending: number;
  rejected: number;
  averageProcessingTime: number;
  totalAmount: number;
}

export default function AnalyticsPage() {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<AnalyticsData | null>(null);


  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<AnalyticsData>('/api/atlvs/advancing/analytics');
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
          <H1 className="mb-4">Advancing Analytics</H1>
          <Body className="text-gray-600">
            Track and analyze advancing request metrics
          </Body>
        </div>

        {data && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card variant="atlvs">
                <CardContent className="pt-6 text-center">
                  <Body className="text-gray-600 mb-2">Total Requests</Body>
                  <Display as="div" className="text-4xl">{data.totalRequests}</Display>
                </CardContent>
              </Card>
              <Card variant="atlvs">
                <CardContent className="pt-6 text-center">
                  <Body className="text-gray-600 mb-2">Approved</Body>
                  <Display as="div" className="text-4xl text-green-600">{data.approved}</Display>
                </CardContent>
              </Card>
              <Card variant="atlvs">
                <CardContent className="pt-6 text-center">
                  <Body className="text-gray-600 mb-2">Pending</Body>
                  <Display as="div" className="text-4xl text-yellow-600">{data.pending}</Display>
                </CardContent>
              </Card>
              <Card variant="atlvs">
                <CardContent className="pt-6 text-center">
                  <Body className="text-gray-600 mb-2">Rejected</Body>
                  <Display as="div" className="text-4xl text-red-600">{data.rejected}</Display>
                </CardContent>
              </Card>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card variant="atlvs">
                <CardHeader>
                  <CardTitle>Processing Time</CardTitle>
                  <CardDescription>Average time to process requests</CardDescription>
                </CardHeader>
                <CardContent>
                  <H3>{data.averageProcessingTime} hours</H3>
                </CardContent>
              </Card>
              <Card variant="atlvs">
                <CardHeader>
                  <CardTitle>Total Amount</CardTitle>
                  <CardDescription>Total value of all requests</CardDescription>
                </CardHeader>
                <CardContent>
                  <H3>${data.totalAmount.toLocaleString()}</H3>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
