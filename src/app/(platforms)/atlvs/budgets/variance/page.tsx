/**
 * Variance Analysis Page - UI Rebuild
 */

'use client';

import * as React from 'react';
import { H1, Body } from '@/components/ui-rebuild/atoms/Typography';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';

interface VarianceItem {
  id: string;
  category: string;
  budgeted: number;
  actual: number;
  variance: number;
  variancePercent: number;
}

export default function VarianceAnalysisPage() {
  const [loading, setLoading] = React.useState(true);
  const [variances, setVariances] = React.useState<VarianceItem[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<{ variances: VarianceItem[] }>('/api/atlvs/budgets/variance');
        if (response.data?.variances) setVariances(response.data.variances);
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
          <H1 className="mb-4">Variance Analysis</H1>
          <Body className="text-gray-600">
            Budget vs actual spending analysis by category
          </Body>
        </div>

        <Card variant="atlvs">
          <CardHeader>
            <CardTitle>Budget Variance by Category</CardTitle>
            <CardDescription>Comparison of budgeted vs actual spending</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {variances.map((item) => (
                <div key={item.id} className="border-b border-gray-200 pb-4 last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <Body className="font-semibold">{item.category}</Body>
                    <Body className={`font-semibold ${item.variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {item.variancePercent > 0 ? '+' : ''}{item.variancePercent}%
                    </Body>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <Body className="text-gray-600">Budgeted</Body>
                      <Body className="font-medium">${item.budgeted.toLocaleString()}</Body>
                    </div>
                    <div>
                      <Body className="text-gray-600">Actual</Body>
                      <Body className="font-medium">${item.actual.toLocaleString()}</Body>
                    </div>
                    <div>
                      <Body className="text-gray-600">Variance</Body>
                      <Body className={`font-medium ${item.variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${Math.abs(item.variance).toLocaleString()}
                      </Body>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
