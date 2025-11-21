/**
 * Spending Insights Page - UI Rebuild
 * Detailed spending analytics and trends
 */

'use client';

import * as React from 'react';
import { H1, H2, H3, Body, Caption, Display } from '@/components/ui-rebuild/atoms/Typography';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Select } from '@/components/ui-rebuild/atoms/Select';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';

interface SpendingData {
  totalSpent: number;
  avgPerMonth: number;
  avgPerEvent: number;
  byCategory: Record<string, number>;
  byMonth: Array<{ month: string; amount: number }>;
  currency: string;
}


export default function SpendingInsightsPage() {
  const [spending, setSpending] = React.useState<SpendingData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [timeRange, setTimeRange] = React.useState('12');

  React.useEffect(() => {  
    const fetchSpending = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<SpendingData>('/api/analytics/spending', {
          params: { months: timeRange },
        });
        if (response.data) {
          setSpending(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch spending data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpending();
  }, [timeRange]);

  const formatPrice = (price: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(price);
  };

  if (loading || !spending) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex justify-center items-center py-24">
          <Spinner size="xl" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <H1 className="mb-2">Spending Insights</H1>
            <Body className="text-gray-600">
              Track and analyze your entertainment spending
            </Body>
          </div>
          <Select
            options={[
              { value: '3', label: 'Last 3 months' },
              { value: '6', label: 'Last 6 months' },
              { value: '12', label: 'Last 12 months' },
              { value: 'all', label: 'All time' },
            ]}
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <Caption className="text-gray-500 mb-2">Total Spent</Caption>
              <Display as="div">{formatPrice(spending.totalSpent, spending.currency)}</Display>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Caption className="text-gray-500 mb-2">Avg per Month</Caption>
              <Display as="div">{formatPrice(spending.avgPerMonth, spending.currency)}</Display>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Caption className="text-gray-500 mb-2">Avg per Event</Caption>
              <Display as="div">{formatPrice(spending.avgPerEvent, spending.currency)}</Display>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Spending by Category</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(spending.byCategory).map(([category, amount]) => {
                const percentage = (amount / spending.totalSpent) * 100;
                return (
                  <div key={category}>
                    <div className="flex items-center justify-between mb-2">
                      <Body>{category}</Body>
                      <div className="text-right">
                        <H3>{formatPrice(amount, spending.currency)}</H3>
                        <Caption className="text-gray-500">{percentage.toFixed(1)}%</Caption>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-200 border border-black">
                      <div className="h-full bg-black" style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Spending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {spending.byMonth.map((month) => (
                  <div key={month.month} className="flex items-center justify-between py-2 border-b border-gray-200">
                    <Body>{month.month}</Body>
                    <H2>{formatPrice(month.amount, spending.currency)}</H2>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
