/**
 * Budget Details Page - UI Rebuild
 */

'use client';

import * as React from 'react';
import { H1, Body, Display, Label } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';
import { useParams } from 'next/navigation';

interface Budget {
  id: string;
  name: string;
  total: number;
  spent: number;
  remaining: number;
  startDate: string;
  endDate: string;
}

export default function BudgetDetailsPage() {
  const [loading, setLoading] = React.useState(true);
  const [budget, setBudget] = React.useState<Budget | null>(null);
  const params = useParams();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<Budget>(`/api/atlvs/budgets/${params.id}`);
        if (response.data) setBudget(response.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

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
          <H1 className="mb-4">Budget Details</H1>
          <Body className="text-gray-600">
            Budget Details page content
          </Body>
        </div>

        {budget && (
          <>
            <Card variant="atlvs" className="mb-6">
              <CardHeader>
                <CardTitle>{budget.name}</CardTitle>
                <CardDescription>{new Date(budget.startDate).toLocaleDateString()} - {new Date(budget.endDate).toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Total Budget</Label>
                    <Display as="div" className="text-2xl">${budget.total.toLocaleString()}</Display>
                  </div>
                  <div>
                    <Label>Spent</Label>
                    <Display as="div" className="text-2xl text-red-600">${budget.spent.toLocaleString()}</Display>
                  </div>
                  <div>
                    <Label>Remaining</Label>
                    <Display as="div" className="text-2xl text-green-600">${budget.remaining.toLocaleString()}</Display>
                  </div>
                </div>
                <div>
                  <Body className="text-sm text-gray-600 mb-2">Budget Utilization: {Math.round((budget.spent / budget.total) * 100)}%</Body>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div className="bg-green-600 h-4 rounded-full" style={{ width: `${(budget.spent / budget.total) * 100}%` }} />
                  </div>
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
