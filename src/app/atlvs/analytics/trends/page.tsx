'use client';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { TrendingUp, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/atoms/Card';
import { useAnalytics } from '@/lib/hooks/atlvs/useAnalytics';

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/atlvs/analytics/trends

export default function TrendsPage() {
  const { data: _analyticsData, isLoading } = useAnalytics();
  
  if (isLoading) {
    return (
      <AtlvsLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-12 h-12 animate-spin text-atlvs-green-500" />
        </div>
      </AtlvsLayout>
    );
  }
  
  return (
    <AtlvsLayout>
      <ContentLayout
        title="TRENDS & FORECASTING"
        description="Predictive analytics and _trends"
        variant="atlvs"
        breadcrumbs={[
          { label: 'Analytics', href: '/atlvs/analytics' },
          { label: 'Trends' }
        ]}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6" role="region" aria-label="Trend statistics">
          <Card variant="atlvs" className="bg-grey-900/50">
            <CardHeader>
              <div className="text-body-sm text-grey-400 mb-1">Project Growth</div>
              <div className="atlvs-text-gradient" aria-label="Project growth up 18 percent versus last month">+18%</div>
              <div className="flex items-center gap-1 text-body-sm text-atlvs-green-500 mt-2" aria-hidden="true">
                <TrendingUp className="w-4 h-4" aria-hidden="true" />
                <span>vs last month</span>
              </div>
            </CardHeader>
          </Card>
          <Card variant="atlvs" className="bg-grey-900/50">
            <CardHeader>
              <div className="text-body-sm text-grey-400 mb-1">Team Efficiency</div>
              <div className="text-atlvs-green-500" aria-label="Team efficiency up 12 percent, improving">+12%</div>
              <div className="flex items-center gap-1 text-body-sm text-atlvs-green-500 mt-2" aria-hidden="true">
                <TrendingUp className="w-4 h-4" aria-hidden="true" />
                <span>improving</span>
              </div>
            </CardHeader>
          </Card>
          <Card variant="atlvs" className="bg-grey-900/50">
            <CardHeader>
              <div className="text-body-sm text-grey-400 mb-1">Budget Variance</div>
              <div className="text-atlvs-purple-500" aria-label="Budget variance down 5 percent, under budget">-5%</div>
              <div className="flex items-center gap-1 text-body-sm text-atlvs-green-500 mt-2" aria-hidden="true">
                <TrendingUp className="w-4 h-4" aria-hidden="true" />
                <span>under budget</span>
              </div>
            </CardHeader>
          </Card>
        </div>

        <Card variant="atlvs" className="bg-grey-900/50">
          <CardHeader>
            <CardTitle className="mb-6">Trend Analysis</CardTitle>
            <div className="h-64 flex items-center justify-center text-grey-400">
              Chart Placeholder - Trend Visualization
            </div>
          </CardHeader>
        </Card>
      </ContentLayout>
    </AtlvsLayout>
  );
}
