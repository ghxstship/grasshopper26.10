/**
 * Spending Analytics Page - UI Rebuild
 * Detailed spending insights and breakdown
 */

'use client';

import * as React from 'react';
import { Hero, H2, H3, Body, Caption } from '@/components/ui-rebuild/atoms/Typography';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';
import { DollarSign, TrendingUp, TrendingDown, PieChart, Calendar } from 'lucide-react';

interface SpendingData {
  totalSpent: number;
  averagePerEvent: number;
  highestSpend: { event: string; amount: number; date: string };
  categoryBreakdown: Array<{
    category: string;
    amount: number;
    percentage: number;
    count: number;
  }>;
  monthlyTrend: Array<{
    month: string;
    amount: number;
    change: number;
  }>;
  comparisonToPrevious: {
    amount: number;
    percentage: number;
    trend: 'up' | 'down' | 'stable';
  };
}

export default function SpendingAnalyticsPage() {
  const [spending, setSpending] = React.useState<SpendingData | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchSpending = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get<{ data: SpendingData }>('/api/analytics/spending');
        if (response.data?.data) {
          setSpending(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch spending data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpending();
  }, []);

  if (loading) {
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

      {/* Hero Section */}
      <section className="border-b-4 border-black bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center space-y-6">
            <Hero>SPENDING INSIGHTS</Hero>
            <Body className="max-w-2xl mx-auto text-gray-700 text-xl">
              Understand your event spending patterns and make informed decisions.
            </Body>
          </div>
        </div>
      </section>

      {/* Overview Stats */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Total Spent</CardTitle>
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <H2 className="text-4xl">${spending?.totalSpent.toLocaleString() || 0}</H2>
                <Caption className="text-gray-600 mt-2">All-time spending</Caption>
                {spending?.comparisonToPrevious && (
                  <div className="flex items-center gap-2 mt-3">
                    {spending.comparisonToPrevious.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-red-600" />
                    ) : spending.comparisonToPrevious.trend === 'down' ? (
                      <TrendingDown className="w-4 h-4 text-green-600" />
                    ) : null}
                    <Caption className={spending.comparisonToPrevious.trend === 'up' ? 'text-red-600' : 'text-green-600'}>
                      {spending.comparisonToPrevious.percentage}% vs last period
                    </Caption>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Average Per Event</CardTitle>
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <H2 className="text-4xl">${spending?.averagePerEvent.toFixed(2) || 0}</H2>
                <Caption className="text-gray-600 mt-2">Per event average</Caption>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Highest Spend</CardTitle>
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent>
                <H2 className="text-4xl">${spending?.highestSpend?.amount.toLocaleString() || 0}</H2>
                <Caption className="text-gray-600 mt-2">
                  {spending?.highestSpend?.event || 'N/A'}
                </Caption>
                {spending?.highestSpend?.date && (
                  <Caption className="text-gray-500 mt-1">
                    {new Date(spending.highestSpend.date).toLocaleDateString()}
                  </Caption>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Category Breakdown */}
      <section className="py-12 bg-gray-50 border-t-4 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                <CardTitle>Spending by Category</CardTitle>
              </div>
              <CardDescription>Where your money goes</CardDescription>
            </CardHeader>
            <CardContent>
              {spending?.categoryBreakdown && spending.categoryBreakdown.length > 0 ? (
                <div className="space-y-6">
                  {spending.categoryBreakdown.map((category, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex-1">
                          <Body className="font-medium">{category.category}</Body>
                          <Caption className="text-gray-600">{category.count} events</Caption>
                        </div>
                        <div className="text-right">
                          <Body className="font-bold">${category.amount.toLocaleString()}</Body>
                          <Caption className="text-gray-600">{category.percentage}%</Caption>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all"
                          style={{ width: `${category.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Body className="text-gray-600 text-center py-12">No spending data available</Body>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Monthly Trend */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Spending Trend</CardTitle>
              <CardDescription>Your spending over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              {spending?.monthlyTrend && spending.monthlyTrend.length > 0 ? (
                <div className="space-y-4">
                  {spending.monthlyTrend.map((month, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <Caption className="text-gray-600 font-medium">{month.month}</Caption>
                        <div className="flex items-center gap-3">
                          <Body className="font-bold">${month.amount.toLocaleString()}</Body>
                          {month.change !== 0 && (
                            <div className="flex items-center gap-1">
                              {month.change > 0 ? (
                                <TrendingUp className="w-3 h-3 text-red-600" />
                              ) : (
                                <TrendingDown className="w-3 h-3 text-green-600" />
                              )}
                              <Caption className={month.change > 0 ? 'text-red-600' : 'text-green-600'}>
                                {Math.abs(month.change)}%
                              </Caption>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-black h-2 rounded-full transition-all"
                          style={{ 
                            width: `${(month.amount / Math.max(...spending.monthlyTrend.map(m => m.amount))) * 100}%` 
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Body className="text-gray-600 text-center py-12">No monthly data available</Body>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Tips Section */}
      <section className="border-t-4 border-black bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <H2 className="mb-4">Smart Spending Tips</H2>
            <Body className="max-w-2xl mx-auto text-gray-600">
              Make the most of your event budget with these insights.
            </Body>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-6xl mb-4">💰</div>
                <H3 className="mb-3">Set Budgets</H3>
                <Body className="text-gray-600">
                  Track your spending and set monthly budgets to stay on target.
                </Body>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-6xl mb-4">🎟️</div>
                <H3 className="mb-3">Early Bird Savings</H3>
                <Body className="text-gray-600">
                  Buy tickets early to get the best prices and avoid price increases.
                </Body>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-6xl mb-4">⭐</div>
                <H3 className="mb-3">Membership Benefits</H3>
                <Body className="text-gray-600">
                  Upgrade to premium for exclusive discounts and member pricing.
                </Body>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
