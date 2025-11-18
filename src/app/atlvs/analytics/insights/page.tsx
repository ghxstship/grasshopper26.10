'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { motion as _motion } from 'framer-motion';
import { Lightbulb, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { useAnalytics } from '@/lib/hooks/atlvs/useAnalytics';

interface Insight {
  id: string;
  title: string;
  description: string;
  impact: string;
  category: string;
}

export default function AnalyticsInsightsPage() {
  const { data: analyticsData, isLoading, error } = useAnalytics();
  
  const insights = analyticsData?.insights || [
    { id: '1', title: 'Budget Optimization Opportunity', description: 'Equipment costs 15% above industry average', impact: 'high', category: 'Budget' },
    { id: '2', title: 'Team Efficiency Trend', description: 'Task completion rate improved 12% this month', impact: 'positive', category: 'Team' },
    { id: '3', title: 'Resource Allocation', description: 'Stage crew underutilized by 23%', impact: 'medium', category: 'Resources' }
  ];

  if (isLoading) {
    return (
      <AtlvsLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-12 h-12 animate-spin text-atlvs-green-500" />
        </div>
      </AtlvsLayout>
    );
  }

  if (error) {
    return (
      <AtlvsLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
            <p className="text-gray-400">Failed to load insights</p>
          </div>
        </div>
      </AtlvsLayout>
    );
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-error-light text-error border-error-border';
      case 'positive': return 'bg-atlvs-green-500/20 text-atlvs-green-500 border-atlvs-green-500/50';
      case 'medium': return 'bg-warning-light text-warning border-warning-border';
      default: return 'bg-gray-500/20 text-gray-500 border-gray-500/50';
    }
  };

  return (
    <AtlvsLayout>
      <ContentLayout
        title="AI INSIGHTS"
        description="Intelligent recommendations and trends"
        variant="atlvs"
        breadcrumbs={[
          { label: 'Analytics', href: '/atlvs/analytics' },
          { label: 'Insights' }
        ]}
      >
        <div className="space-y-4" role="list" aria-label="AI insights and recommendations">
          {insights.map((insight: Insight) => (
            <Card key={insight.id} variant="atlvs" className="bg-gray-900/50" role="listitem">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-atlvs-green-500 to-atlvs-purple-500 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                    <Lightbulb className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-h5">{insight.title}</CardTitle>
                      <Badge variant="atlvs-outline" className={getImpactColor(insight.impact)} role="status" aria-label={`Impact level: ${insight.impact}`}>
                        {insight.impact}
                      </Badge>
                    </div>
                    <p className="text-gray-400 mb-3">{insight.description}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="atlvs-outline" className="bg-gray-700/50">
                        {insight.category}
                      </Badge>
                      <Button variant="atlvs" size="sm" aria-label={`View details for ${insight.title}`}>
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </ContentLayout>
    </AtlvsLayout>
  );
}
