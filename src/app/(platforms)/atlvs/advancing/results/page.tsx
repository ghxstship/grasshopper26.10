/**
 * Advancing Results Page - UI Rebuild
 * View processing results and outcomes
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


interface ResultsData {
  totalProcessed: number;
  approved: number;
  rejected: number;
  averageAmount: number;
  recentResults: Array<{
    id: string;
    requestNumber: string;
    outcome: 'APPROVED' | 'REJECTED';
    amount: number;
    processedDate: string;
  }>;
}

export default function ResultsPage() {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<ResultsData | null>(null);


  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<ResultsData>('/api/atlvs/advancing/results');
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
          <H1 className="mb-4">Processing Results</H1>
          <Body className="text-gray-600">
            View outcomes and results of processed requests
          </Body>
        </div>

        {data && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card variant="atlvs">
                <CardContent className="pt-6 text-center">
                  <Body className="text-gray-600 mb-2">Total Processed</Body>
                  <Display as="div" className="text-4xl">{data.totalProcessed}</Display>
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
                  <Body className="text-gray-600 mb-2">Rejected</Body>
                  <Display as="div" className="text-4xl text-red-600">{data.rejected}</Display>
                </CardContent>
              </Card>
            </div>
            
            <Card variant="atlvs" className="mb-8">
              <CardHeader>
                <CardTitle>Average Request Amount</CardTitle>
              </CardHeader>
              <CardContent>
                <H3>${data.averageAmount.toLocaleString()}</H3>
              </CardContent>
            </Card>

            <Card variant="atlvs">
              <CardHeader>
                <CardTitle>Recent Results</CardTitle>
                <CardDescription>Latest processed requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.recentResults.map((result) => (
                    <div key={result.id} className="flex items-center justify-between p-4 border-2 border-black">
                      <div>
                        <Body className="font-semibold">Request #{result.requestNumber}</Body>
                        <Body className="text-sm text-gray-600">
                          {new Date(result.processedDate).toLocaleDateString()}
                        </Body>
                      </div>
                      <div className="flex items-center gap-4">
                        <Body className="font-semibold">${result.amount.toLocaleString()}</Body>
                        <Badge className={result.outcome === 'APPROVED' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}>
                          {result.outcome}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
