/**
 * Performance Page - UI Rebuild
 */

'use client';

import * as React from 'react';
import { H1, Body, Caption, Display } from '@/components/ui-rebuild/atoms/Typography';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';

interface PerformanceMetrics {
  totalClicks: number;
  totalConversions: number;
  conversionRate: number;
  totalEarnings: number;
  topReferral: string;
}

export default function PerformancePage() {
  const [loading, setLoading] = React.useState(true);
  const [metrics, setMetrics] = React.useState<PerformanceMetrics | null>(null);

  React.useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<{ metrics: PerformanceMetrics }>('/api/compvss/affiliates/performance');
        if (response.data?.metrics) {
          setMetrics(response.data.metrics);
        }
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
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
        <div className="mb-8">
          <H1 className="mb-2">Performance Metrics</H1>
          <Body className="text-gray-600">Track your affiliate performance</Body>
        </div>

        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card variant="compvss">
              <CardContent className="p-6 text-center">
                <Caption className="text-gray-500 mb-2">Total Clicks</Caption>
                <Display as="div">{metrics.totalClicks}</Display>
              </CardContent>
            </Card>
            <Card variant="compvss">
              <CardContent className="p-6 text-center">
                <Caption className="text-gray-500 mb-2">Conversions</Caption>
                <Display as="div">{metrics.totalConversions}</Display>
              </CardContent>
            </Card>
            <Card variant="compvss">
              <CardContent className="p-6 text-center">
                <Caption className="text-gray-500 mb-2">Conversion Rate</Caption>
                <Display as="div">{metrics.conversionRate.toFixed(1)}%</Display>
              </CardContent>
            </Card>
            <Card variant="compvss">
              <CardContent className="p-6 text-center">
                <Caption className="text-gray-500 mb-2">Total Earnings</Caption>
                <Display as="div">${metrics.totalEarnings.toFixed(2)}</Display>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
