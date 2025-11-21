/**
 * Budget Analytics Page - UI Rebuild
 */

'use client';

import * as React from 'react';
import { H1, H3, Body, Display } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';


interface BudgetData {
  totalBudget: number;
  spent: number;
  remaining: number;
  variance: number;
  topProjects: Array<{
    name: string;
    budget: number;
    spent: number;
  }>;
}

export default function BudgetAnalyticsPage() {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<BudgetData | null>(null);


  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<BudgetData>('/api/atlvs/analytics/budgets');
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
          <H1 className="mb-4">Budget Analytics</H1>
          <Body className="text-gray-600">
            Budget Analytics page content
          </Body>
        </div>

        {data && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card variant="atlvs">
                <CardContent className="pt-6 text-center">
                  <Body className="text-gray-600 mb-2">Total Budget</Body>
                  <Display as="div" className="text-3xl">${data.totalBudget.toLocaleString()}</Display>
                </CardContent>
              </Card>
              <Card variant="atlvs">
                <CardContent className="pt-6 text-center">
                  <Body className="text-gray-600 mb-2">Spent</Body>
                  <Display as="div" className="text-3xl text-red-600">${data.spent.toLocaleString()}</Display>
                </CardContent>
              </Card>
              <Card variant="atlvs">
                <CardContent className="pt-6 text-center">
                  <Body className="text-gray-600 mb-2">Remaining</Body>
                  <Display as="div" className="text-3xl text-green-600">${data.remaining.toLocaleString()}</Display>
                </CardContent>
              </Card>
              <Card variant="atlvs">
                <CardContent className="pt-6 text-center">
                  <Body className="text-gray-600 mb-2">Variance</Body>
                  <Display as="div" className="text-3xl">{data.variance}%</Display>
                </CardContent>
              </Card>
            </div>
            <Card variant="atlvs">
              <CardHeader>
                <CardTitle>Top Projects by Budget</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.topProjects.map((project, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 border-2 border-black">
                      <Body className="font-semibold">{project.name}</Body>
                      <div className="text-right">
                        <Body className="font-semibold">${project.spent.toLocaleString()} / ${project.budget.toLocaleString()}</Body>
                        <Body className="text-sm text-gray-600">
                          {Math.round((project.spent / project.budget) * 100)}% utilized
                        </Body>
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
