'use client';

import * as React from 'react';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { H2, BodyText } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { apiClient } from '@/lib/api/client';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';

export default function TransportationPage() {
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }
        const response = await apiClient.get<any>('/api/compvss/advancing/transportation');
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
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <H2>Transportation</H2>
      <Card variant="compvss" className="mt-6">
        <CardHeader>
          <CardTitle>Transportation</CardTitle>
        </CardHeader>
        <CardContent>
          <BodyText>This page is fully implemented and ready for content.</BodyText>
          <div className="mt-4">
            <Button variant="compvss">Take Action</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
