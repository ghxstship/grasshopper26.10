/**
 * Submit Expenses Page - UI Rebuild
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


export default function SubmitExpensesPage() {
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

        const response = await apiClient.get('/api/compvss/expenses/categories');
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
          <H1 className="mb-4">Submit Expenses</H1>
          <Body className="text-gray-600">
            Submit Expenses page content
          </Body>
        </div>

        <Card variant="compvss">
          <CardHeader>
            <CardTitle>Submit Expense Report</CardTitle>
            <CardDescription>Upload receipts and details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div><Body className="font-medium mb-2">Select Category</Body><select className="w-full border rounded p-2">{data?.categories && data.categories.map((cat: string) => <option key={cat}>{cat}</option>)}</select></div>
              <div><Body className="font-medium mb-2">Upload Receipt</Body><input type="file" className="w-full" /></div>
              <div><Body className="font-medium mb-2">Amount</Body><input type="number" className="w-full border rounded p-2" /></div>
              <Button variant="compvss" className="w-full">Submit for Approval</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
