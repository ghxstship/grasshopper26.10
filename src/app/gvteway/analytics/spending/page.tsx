/**
 * GVTEWAY Spending Insights Page
 * Agent 2.5: Reverse Order Implementation - Module 8
 */

'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { GvtewayLayout } from '@/components/gvteway/shared/GvtewayLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { TrendingUp, TrendingDown, DollarSign, PieChart, Loader2, AlertCircle } from 'lucide-react';
import { useSpendingAnalytics } from '@/lib/hooks/gvteway/useAnalytics';

export default function SpendingInsightsPage() {
  const currentYear = new Date().getFullYear();
  const { data: analytics, isLoading, error, refetch } = useSpendingAnalytics(currentYear);

  if (isLoading) {
    return (
      <GvtewayLayout>
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-gvteway-red-500" />
            <p className="text-gray-400">Loading spending insights...</p>
          </div>
        </div>
      </GvtewayLayout>
    );
  }

  if (error) {
    return (
      <GvtewayLayout>
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
            <h2 className="text-xl font-bebas mb-2">Failed to Load Analytics</h2>
            <p className="text-gray-400 mb-4">{error.message}</p>
            <Button variant="gvteway" onClick={() => refetch()}>
              Try Again
            </Button>
          </div>
        </div>
      </GvtewayLayout>
    );
  }

  if (!analytics) return null;

  const { total, yearOverYearChange, thisMonth, lastMonth, average, categories, insights } = analytics;

  return (
    <GvtewayLayout>
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Spending Insights</h1>
          <p className="text-gray-400">Track your event spending and trends</p>
        </div>

        {/* Total Spending */}
        <Card className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 border-blue-500/30">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-2">Total Spending (2024)</p>
                <p className="text-5xl font-bold text-white">${total.toLocaleString()}</p>
                <div className="flex items-center gap-2 mt-3">
                  <Badge className={yearOverYearChange >= 0 ? "bg-green-500/20 text-green-400 border-green-500/50" : "bg-red-500/20 text-red-400 border-red-500/50"}>
                    {yearOverYearChange >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                    {yearOverYearChange >= 0 ? '+' : ''}{yearOverYearChange}% from last year
                  </Badge>
                </div>
              </div>
              <div className="w-24 h-24 bg-info/20 rounded-full flex items-center justify-center">
                <DollarSign className="w-12 h-12 text-info" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white text-lg">This Month</CardTitle>
              <CardDescription>January 2024</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">${thisMonth.amount}</p>
              <p className="text-sm text-gray-400 mt-2">{thisMonth.eventsAttended} events attended</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white text-lg">Last Month</CardTitle>
              <CardDescription>December 2023</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">${lastMonth.amount}</p>
              <p className="text-sm text-gray-400 mt-2">{lastMonth.eventsAttended} events attended</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white text-lg">Average/Month</CardTitle>
              <CardDescription>2024 Average</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">${average.amount}</p>
              <p className="text-sm text-gray-400 mt-2">{average.eventsPerMonth} events/month</p>
            </CardContent>
          </Card>
        </div>

        {/* Category Breakdown */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Spending by Category
            </CardTitle>
            <CardDescription>Where your money goes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {categories.map((category) => (
              <div key={category.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-white font-medium">{category.name}</span>
                    {category.trend === 'up' && (
                      <TrendingUp className="w-4 h-4 text-green-400" />
                    )}
                    {category.trend === 'down' && (
                      <TrendingDown className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">${category.amount}</p>
                    <p className="text-sm text-gray-400">{category.percentage}%</p>
                  </div>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                    style={{ width: `${category.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Insights */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Smart Insights</CardTitle>
            <CardDescription>Personalized spending recommendations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {insights.map((insight, index) => (
              <div 
                key={index}
                className={`p-4 rounded-lg ${
                  insight.type === 'tip' ? 'bg-info/10 border border-blue-500/30' :
                  insight.type === 'achievement' ? 'bg-green-500/10 border border-green-500/30' :
                  'bg-purple-500/10 border border-purple-500/30'
                }`}
              >
                <p className={`font-medium mb-1 ${
                  insight.type === 'tip' ? 'text-info' :
                  insight.type === 'achievement' ? 'text-green-400' :
                  'text-atlvs-purple-500'
                }`}>
                  {insight.type === 'tip' ? '💡' : insight.type === 'achievement' ? '✨' : '📊'} {insight.title}
                </p>
                <p className="text-gray-300 text-sm">{insight.message}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
    </GvtewayLayout>
  );
}
