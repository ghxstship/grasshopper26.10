/**
 * GVTEWAY Spending Insights Page
 * Agent 2.5: Reverse Order Implementation - Module 8
 */

'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { GvtewayLayout } from '@/components/templates/GvtewayLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { TrendingUp, TrendingDown, DollarSign, PieChart, Loader2, AlertCircle } from 'lucide-react';
import { useSpendingAnalytics } from '@/lib/hooks/gvteway/useAnalytics';
import { BodyText, HeroTitle, SectionHeader } from "@/components/atoms/Typography";

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/gvteway/analytics/spending

export default function SpendingInsightsPage() {
  const currentYear = new Date().getFullYear();
  const { data: analytics, isLoading, error, refetch } = useSpendingAnalytics(currentYear);

  if (isLoading) {
    return (
      <GvtewayLayout>
        <div className="min-h-screen bg-gradient-to-br from-black via-grey-900 to-black flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-gvteway-red-500" />
            <BodyText className="text-grey-400">Loading spending insights...</BodyText>
          </div>
        </div>
      </GvtewayLayout>
    );
  }

  if (error) {
    return (
      <GvtewayLayout>
        <div className="min-h-screen bg-gradient-to-br from-black via-grey-900 to-black flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
            <SectionHeader className="mb-2">Failed to Load Analytics</SectionHeader>
            <p className="text-grey-400 mb-4">{error.message}</p>
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
    <div className="min-h-screen bg-gradient-to-br from-black via-grey-900 to-black p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <HeroTitle className="text-white mb-2">Spending Insights</HeroTitle>
          <BodyText className="text-grey-400">Track your event spending and trends</BodyText>
        </div>

        {/* Total Spending */}
        <Card className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 border-info/30">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <BodyText className="text-grey-400 text-body-sm mb-2">Total Spending (2024)</BodyText>
                <p className="text-white">${total.toLocaleString()}</p>
                <div className="flex items-center gap-2 mt-3">
                  <Badge className={yearOverYearChange >= 0 ? "bg-success-light0/20 text-success border-success/50" : "bg-destructive/100/20 text-destructive border-destructive/50"}>
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
          <Card className="bg-grey-900/50 border-grey-800">
            <CardHeader>
              <CardTitle className="text-white">This Month</CardTitle>
              <CardDescription>January 2024</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-white">${thisMonth.amount}</p>
              <p className="text-body-sm text-grey-400 mt-2">{thisMonth.eventsAttended} events attended</p>
            </CardContent>
          </Card>

          <Card className="bg-grey-900/50 border-grey-800">
            <CardHeader>
              <CardTitle className="text-white">Last Month</CardTitle>
              <CardDescription>December 2023</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-white">${lastMonth.amount}</p>
              <p className="text-body-sm text-grey-400 mt-2">{lastMonth.eventsAttended} events attended</p>
            </CardContent>
          </Card>

          <Card className="bg-grey-900/50 border-grey-800">
            <CardHeader>
              <CardTitle className="text-white">Average/Month</CardTitle>
              <CardDescription>2024 Average</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-white">${average.amount}</p>
              <p className="text-body-sm text-grey-400 mt-2">{average.eventsPerMonth} events/month</p>
            </CardContent>
          </Card>
        </div>

        {/* Category Breakdown */}
        <Card className="bg-grey-900/50 border-grey-800">
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
                    <span className="text-white">{category.name}</span>
                    {category.trend === 'up' && (
                      <TrendingUp className="w-4 h-4 text-success" />
                    )}
                    {category.trend === 'down' && (
                      <TrendingDown className="w-4 h-4 text-destructive" />
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-white">${category.amount}</p>
                    <p className="text-body-sm text-grey-400">{category.percentage}%</p>
                  </div>
                </div>
                <div className="w-full bg-grey-800 rounded-full h-2">
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
        <Card className="bg-grey-900/50 border-grey-800">
          <CardHeader>
            <CardTitle className="text-white">Smart Insights</CardTitle>
            <CardDescription>Personalized spending recommendations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {insights.map((insight, index) => (
              <div 
                key={index}
                className={`p-4 rounded-lg ${ insight.type === 'tip' ? 'bg-info/10 border border-info/30' : insight.type === 'achievement' ? 'bg-success-light0/10 border border-success/30' : 'bg-accent/100/10 border border-accent/30' }`}
              >
                <p className={`font-medium mb-1 ${ insight.type === 'tip' ? 'text-info' : insight.type === 'achievement' ? 'text-success' : 'text-atlvs-purple-500' }`}>
                  {insight.type === 'tip' ? '💡' : insight.type === 'achievement' ? '✨' : '📊'} {insight.title}
                </p>
                <p className="text-grey-300 text-body-sm">{insight.message}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
    </GvtewayLayout>
  );
}
