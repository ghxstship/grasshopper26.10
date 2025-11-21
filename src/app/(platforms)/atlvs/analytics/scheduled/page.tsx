/**
 * Scheduled Reports Page - UI Rebuild
 */

'use client';

import * as React from 'react';
import { H1, Body } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui-rebuild/atoms/Card';
import { Badge } from '@/components/ui-rebuild/atoms/Badge';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';


interface ScheduledReport {
  id: string;
  name: string;
  frequency: string;
  nextRun: string;
  recipients: string[];
  active: boolean;
}

export default function ScheduledReportsPage() {
  const [loading, setLoading] = React.useState(true);
  const [reports, setReports] = React.useState<ScheduledReport[]>([]);


  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<{ reports: ScheduledReport[] }>('/api/atlvs/analytics/scheduled');
        if (response.data?.reports) {
          setReports(response.data.reports);
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
          <H1 className="mb-4">Scheduled Reports</H1>
          <Body className="text-gray-600">
            Scheduled Reports page content
          </Body>
        </div>

        <div className="mb-6">
          <Button variant="atlvs">Schedule New Report</Button>
        </div>
        <div className="space-y-4">
          {reports.map((report) => (
            <Card key={report.id} variant="atlvs">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{report.name}</CardTitle>
                    <CardDescription>{report.frequency}</CardDescription>
                  </div>
                  <Badge variant={report.active ? 'default' : 'ghost'}>
                    {report.active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <Body className="text-sm">Next run: {new Date(report.nextRun).toLocaleString()}</Body>
                <Body className="text-sm text-gray-600">Recipients: {report.recipients.join(', ')}</Body>
              </CardContent>
              <CardFooter className="flex gap-3">
                <Button variant="atlvs" size="sm">Edit Schedule</Button>
                <Button variant="ghost" size="sm">{report.active ? 'Pause' : 'Activate'}</Button>
                <Button variant="ghost" size="sm">Delete</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
