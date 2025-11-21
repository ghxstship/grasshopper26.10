/**
 * Reimbursements Page - UI Rebuild
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


export default function ReimbursementsPage() {
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

        const response = await apiClient.get('/api/compvss/expenses/reimbursements');
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
          <H1 className="mb-4">Reimbursements</H1>
          <Body className="text-gray-600">
            Reimbursements page content
          </Body>
        </div>

        <div className="space-y-4">
          {data?.reimbursements && data.reimbursements.map((item: any) => (
            <Card key={item.id} variant="compvss">
              <CardHeader>
                <CardTitle>${item.amount}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Body className="text-sm">Status: <span className="capitalize">{item.status}</span></Body>
                {item.processedDate && <Body className="text-sm">Processed: {new Date(item.processedDate).toLocaleDateString()}</Body>}
              </CardContent>
            </Card>
          ))}
          {(!data?.reimbursements || data.reimbursements.length === 0) && (
            <Card variant="compvss"><CardContent className="p-12 text-center"><Body className="text-gray-500">No reimbursements</Body></CardContent></Card>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
