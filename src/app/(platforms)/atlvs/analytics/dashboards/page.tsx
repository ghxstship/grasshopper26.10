'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { H2, BodyText } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { apiClient } from '@/lib/api/client';

export default function DashboardsPage() {
  const [dashboards, setDashboards] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchDashboards = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }
        const response = await apiClient.get<{ dashboards: any[] }>('/api/atlvs/analytics/dashboards');
        if (response.data?.dashboards) {
          setDashboards(response.data.dashboards);
        }
      } catch (error) {
        console.error('Failed to fetch dashboards:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboards();
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
      <H2>Dashboards</H2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {dashboards.map((dashboard) => (
          <Card key={dashboard.id} variant="atlvs">
            <CardHeader>
              <CardTitle>{dashboard.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <BodyText>{dashboard.description}</BodyText>
              <div className="mt-4">
                <Button variant="atlvs">View Dashboard</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
