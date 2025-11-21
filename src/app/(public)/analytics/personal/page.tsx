/**
 * Personal Analytics Page - UI Rebuild
 * User activity and spending analytics
 */

'use client';

import * as React from 'react';
import { Hero, H2, H3, Body, Caption } from '@/components/ui-rebuild/atoms/Typography';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Badge } from '@/components/ui-rebuild/atoms/Badge';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';
import { TrendingUp, Calendar, DollarSign, Ticket, Award, BarChart3 } from 'lucide-react';

interface Analytics {
  summary: {
    totalSpent: number;
    eventsAttended: number;
    ticketsOwned: number;
    loyaltyPoints: number;
  };
  recentActivity: Array<{
    id: string;
    type: string;
    event: string;
    date: string;
    amount: number;
  }>;
  topCategories: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
  monthlySpending: Array<{
    month: string;
    amount: number;
  }>;
}

export default function PersonalAnalyticsPage() {
  const [analytics, setAnalytics] = React.useState<Analytics | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get<{ data: Analytics }>('/api/analytics/personal');
        if (response.data?.data) {
          setAnalytics(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
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
            <Hero>PERSONAL ANALYTICS</Hero>
            <Body className="max-w-2xl mx-auto text-gray-700 text-xl">
              Track your event activity, spending patterns, and engagement insights.
            </Body>
          </div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Total Spent</CardTitle>
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <H2 className="text-3xl">${analytics?.summary?.totalSpent.toLocaleString() || 0}</H2>
                <Caption className="text-gray-600 mt-2">Lifetime spending</Caption>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Events Attended</CardTitle>
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <H2 className="text-3xl">{analytics?.summary?.eventsAttended || 0}</H2>
                <Caption className="text-gray-600 mt-2">Total events</Caption>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Tickets Owned</CardTitle>
                  <Ticket className="w-5 h-5 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent>
                <H2 className="text-3xl">{analytics?.summary?.ticketsOwned || 0}</H2>
                <Caption className="text-gray-600 mt-2">Active tickets</Caption>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Loyalty Points</CardTitle>
                  <Award className="w-5 h-5 text-yellow-600" />
                </div>
              </CardHeader>
              <CardContent>
                <H2 className="text-3xl">{analytics?.summary?.loyaltyPoints.toLocaleString() || 0}</H2>
                <Caption className="text-gray-600 mt-2">Reward points</Caption>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Detailed Analytics */}
      <section className="py-12 bg-gray-50 border-t-4 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Categories */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  <CardTitle>Top Categories</CardTitle>
                </div>
                <CardDescription>Your favorite event types</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analytics?.topCategories?.map((category, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <Body className="font-medium">{category.category}</Body>
                      <Caption className="text-gray-600">{category.count} events</Caption>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-black h-2 rounded-full transition-all"
                        style={{ width: `${category.percentage}%` }}
                      />
                    </div>
                  </div>
                )) || (
                  <Body className="text-gray-600 text-center py-8">No category data available</Body>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  <CardTitle>Recent Activity</CardTitle>
                </div>
                <CardDescription>Your latest transactions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analytics?.recentActivity?.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between pb-4 border-b-2 border-gray-100 last:border-0">
                    <div className="flex-1">
                      <Body className="font-medium">{activity.event}</Body>
                      <Caption className="text-gray-600">
                        {activity.type} • {new Date(activity.date).toLocaleDateString()}
                      </Caption>
                    </div>
                    <Body className="font-bold">${activity.amount}</Body>
                  </div>
                )) || (
                  <Body className="text-gray-600 text-center py-8">No recent activity</Body>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Monthly Spending Chart */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Spending Trend</CardTitle>
              <CardDescription>Your spending over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              {analytics?.monthlySpending && analytics.monthlySpending.length > 0 ? (
                <div className="space-y-4">
                  {analytics.monthlySpending.map((month, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <Caption className="text-gray-600">{month.month}</Caption>
                        <Body className="font-bold">${month.amount.toLocaleString()}</Body>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all"
                          style={{ 
                            width: `${(month.amount / Math.max(...analytics.monthlySpending.map(m => m.amount))) * 100}%` 
                          }}
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

      <Footer />
    </div>
  );
}
