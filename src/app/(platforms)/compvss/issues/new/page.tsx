/**
 * Report Issue Page - UI Rebuild
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


export default function ReportIssuePage() {
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

        const response = await apiClient.get('/api/compvss/issues/categories');
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
          <H1 className="mb-4">Report Issue</H1>
          <Body className="text-gray-600">
            Report Issue page content
          </Body>
        </div>

        <Card variant="compvss">
          <CardHeader>
            <CardTitle>Report New Issue</CardTitle>
            <CardDescription>Describe the problem</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div><Body className="font-medium mb-2">Title</Body><input type="text" className="w-full border rounded p-2" /></div>
              <div><Body className="font-medium mb-2">Category</Body><select className="w-full border rounded p-2">{data?.categories && data.categories.map((cat: string) => <option key={cat}>{cat}</option>)}</select></div>
              <div><Body className="font-medium mb-2">Priority</Body><select className="w-full border rounded p-2"><option>Low</option><option>Medium</option><option>High</option></select></div>
              <div><Body className="font-medium mb-2">Description</Body><textarea className="w-full border rounded p-2" rows={4} /></div>
              <Button variant="compvss" className="w-full">Submit Issue</Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
