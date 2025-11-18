'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { useState } from 'react';
import { useAnalytics } from '@/lib/hooks/atlvs/useAnalytics';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { Card, CardHeader, CardTitle } from '@/components/atoms/Card';
import { DollarSign, Users, TrendingUp, Target, Activity, Shield, Leaf, Smartphone } from 'lucide-react';

export default function KPIsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const { data: analyticsData } = useAnalytics();

  const categories = [
    { value: 'all', label: 'All Metrics', icon: Activity },
    { value: 'financial', label: 'Financial', icon: DollarSign },
    { value: 'tickets', label: 'Tickets & Attendance', icon: Users },
    { value: 'operational', label: 'Operational', icon: TrendingUp },
    { value: 'marketing', label: 'Marketing', icon: Target },
    { value: 'customer', label: 'Customer Experience', icon: Users },
    { value: 'safety', label: 'Safety & Compliance', icon: Shield },
    { value: 'sustainability', label: 'Sustainability', icon: Leaf },
    { value: 'technology', label: 'Technology', icon: Smartphone },
  ];

  // Mock KPI data until API returns proper metrics
  const mockKPIs = {
    all: [
      { title: 'Total Revenue', value: 2400000, format: 'currency' as const },
      { title: 'Profit Margin', value: 18.5, format: 'percentage' as const },
      { title: 'ROI', value: 24.3, format: 'percentage' as const },
      { title: 'Active Projects', value: analyticsData?.length || 0, format: 'number' as const },
    ],
    financial: [
      { title: 'Total Revenue', value: 2400000, format: 'currency' as const },
      { title: 'Profit Margin', value: 18.5, format: 'percentage' as const },
      { title: 'ROI', value: 24.3, format: 'percentage' as const },
    ],
    operational: [
      { title: 'Task Completion Rate', value: 87, format: 'percentage' as const },
      { title: 'On-Time Delivery', value: 92, format: 'percentage' as const },
    ],
  };

  const getMetricsForCategory = (category: string) => {
    return mockKPIs[category as keyof typeof mockKPIs] || mockKPIs.all;
  };

  return (
    <AtlvsLayout>
      <ContentLayout
        title="KEY PERFORMANCE INDICATORS"
        description="Track critical metrics across all categories"
        variant="atlvs"
        breadcrumbs={[
          { label: 'Analytics', href: '/atlvs/analytics' },
          { label: 'KPIs' }
        ]}
      >
        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategory === cat.value
                    ? 'bg-atlvs-green-500 text-black'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                <Icon className="h-4 w-4" />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {getMetricsForCategory(selectedCategory).map((metric, index) => (
            <Card key={index} variant="atlvs" className="bg-gray-900/50">
              <CardHeader>
                <CardTitle className="text-sm text-gray-400 mb-2">{metric.title}</CardTitle>
                <div className="text-2xl font-bebas text-white">
                  {metric.format === 'currency' && '$'}
                  {metric.format === 'currency' ? (metric.value / 1000000).toFixed(1) + 'M' : metric.value.toLocaleString()}
                  {metric.format === 'percentage' && '%'}
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card variant="atlvs" className="bg-gradient-to-br from-atlvs-green-500/20 to-atlvs-green-600/20 border-atlvs-green-500/30">
            <CardHeader>
              <CardTitle className="text-sm text-gray-400">Total Revenue</CardTitle>
              <div className="text-3xl font-bebas text-atlvs-green-500 mt-2">
                $2.4M
              </div>
            </CardHeader>
          </Card>
          
          <Card variant="atlvs" className="bg-gradient-to-br from-info/20 to-info/20 border-info/30">
            <CardHeader>
              <CardTitle className="text-sm text-gray-400">Active Projects</CardTitle>
              <div className="text-3xl font-bebas text-info mt-2">
                {analyticsData?.length || 0}
              </div>
            </CardHeader>
          </Card>
          
          <Card variant="atlvs" className="bg-gradient-to-br from-atlvs-purple-500/20 to-atlvs-purple-600/20 border-atlvs-purple-500/30">
            <CardHeader>
              <CardTitle className="text-sm text-gray-400">ROI</CardTitle>
              <div className="text-3xl font-bebas text-atlvs-purple-500 mt-2">
                24.3%
              </div>
            </CardHeader>
          </Card>
        </div>
      </ContentLayout>
    </AtlvsLayout>
  );
}
