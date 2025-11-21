/**
 * Background Checks Page - UI Rebuild
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


export default function BackgroundChecksPage() {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<any>(null);


  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get('/api/compvss/credentials/background');
        setData(response.data);
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
        <div className="mb-12">
          <H1 className="mb-4">Background Checks</H1>
          <Body className="text-gray-600">
            Background Checks page content
          </Body>
        </div>

        <Card variant="compvss">
          <CardHeader>
            <CardTitle>Background Check Status</CardTitle>
            <CardDescription>{data?.status || 'Not started'}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Body className="font-medium">Status:</Body>
                <Body className="capitalize">{data?.status || 'pending'}</Body>
              </div>
              {data?.submittedDate && (
                <div>
                  <Body className="font-medium">Submitted:</Body>
                  <Body>{new Date(data.submittedDate).toLocaleDateString()}</Body>
                </div>
              )}
              {data?.completedDate && (
                <div>
                  <Body className="font-medium">Completed:</Body>
                  <Body>{new Date(data.completedDate).toLocaleDateString()}</Body>
                </div>
              )}
              {!data?.submittedDate && (
                <Button variant="compvss">Start Background Check</Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
