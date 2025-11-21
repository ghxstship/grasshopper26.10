/**
 * Advancing Analytics Page - UI Rebuild
 */

'use client';

import * as React from 'react';
import { H1, Body, Display } from '@/components/ui-rebuild/atoms/Typography';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';

interface AdvancingMetrics {
  totalRequests: number;
  approved: number;
  pending: number;
  rejected: number;
  averageProcessingTime: number;
}

export default function AdvancingAnalyticsPage() {
  const [loading, setLoading] = React.useState(true);
  const [metrics, setMetrics] = React.useState<AdvancingMetrics | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<AdvancingMetrics>('/api/atlvs/analytics/advancing');
        if (response.data) setMetrics(response.data);
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
            Performance metrics and insights for advancing requests
          </Body>
        </div>

        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card variant="atlvs">
              <CardContent className="pt-6 text-center">
                <Body className="text-gray-600 mb-2">Total Requests</Body>
                <Display as="div" className="text-4xl">{metrics.totalRequests}</Display>
              </CardContent>
            </Card>
            <Card variant="atlvs">
              <CardContent className="pt-6 text-center">
                <Body className="text-gray-600 mb-2">Approved</Body>
                <Display as="div" className="text-4xl text-green-600">{metrics.approved}</Display>
              </CardContent>
            </Card>
            <Card variant="atlvs">
              <CardContent className="pt-6 text-center">
                <Body className="text-gray-600 mb-2">Pending</Body>
                <Display as="div" className="text-4xl text-yellow-600">{metrics.pending}</Display>
              </CardContent>
            </Card>
            <Card variant="atlvs">
              <CardContent className="pt-6 text-center">
                <Body className="text-gray-600 mb-2">Avg Processing Time</Body>
                <Display as="div" className="text-4xl">{metrics.averageProcessingTime}h</Display>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
