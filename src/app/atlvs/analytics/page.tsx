'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, Users, Download, Filter, BarChart3, PieChart, LineChart, Loader2, AlertCircle } from 'lucide-react';
import { useAnalytics } from '@/lib/hooks/atlvs/useAnalytics';
import { useTeams } from '@/lib/hooks/atlvs/useTeams';
import { useGenerateReport } from '@/lib/hooks/atlvs/useReports';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { Select } from '@/components/atoms/Select';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  
  // Data fetching
  const { data: dashboards, isLoading: metricsLoading, error: metricsError } = useAnalytics();
  const { data: teams, isLoading: teamLoading } = useTeams();
  const exportMutation = useGenerateReport();
  const handleExport = () => {
    exportMutation.mutate({ name: `Analytics Report ${timeRange}`, type: 'project', format: 'pdf' });
  };

  // Format stats from API data (using mock data until API returns proper metrics)
  const stats = [
    {
      label: 'Total Revenue',
      value: '$2.4M',
      change: '+12.5%',
      trend: 'up' as const,
      icon: DollarSign,
      color: 'text-atlvs-green-500'
    },
    {
      label: 'Active Projects',
      value: (dashboards?.length || 0).toString(),
      change: '+3',
      trend: 'up' as const,
      icon: BarChart3,
      color: 'text-info'
    },
    {
      label: 'Team Members',
      value: (teams?.length || 0).toString(),
      change: '+2',
      trend: 'up' as const,
      icon: Users,
      color: 'text-atlvs-purple-500'
    },
    {
      label: 'Budget Utilization',
      value: '78%',
      change: '+5%',
      trend: 'up' as const,
      icon: PieChart,
      color: 'text-atlvs-orange-500'
    }
  ];
  
  // Loading state
  if (metricsLoading) {
    return (
      <AtlvsLayout>
        <ContentLayout
          title="ANALYTICS & REPORTS"
          description="Track performance metrics and generate insights"
          variant="atlvs"
          showToolbar={false}
        >
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-atlvs-green-500" />
          </div>
        </ContentLayout>
      </AtlvsLayout>
    );
  }
  
  // Error state
  if (metricsError) {
    return (
      <AtlvsLayout>
        <ContentLayout
          title="ANALYTICS & REPORTS"
          description="Track performance metrics and generate insights"
          variant="atlvs"
          showToolbar={false}
        >
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <AlertCircle className="w-12 h-12 text-error" />
            <p className="text-gray-400">Failed to load analytics data</p>
            <Button variant="atlvs" size="sm" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </ContentLayout>
      </AtlvsLayout>
    );
  }

  return (
    <AtlvsLayout>
      <ContentLayout
        title="ANALYTICS & REPORTS"
        description="Track performance metrics and generate insights"
        variant="atlvs"
        showToolbar={false}
      >
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-8" role="toolbar" aria-label="Analytics controls">
          <div className="flex items-center gap-4">
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as '7d' | '30d' | '90d' | '1y')}
              variant="atlvs"
              aria-label="Select time range for analytics"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="1y">Last Year</option>
            </Select>
            <Button variant="ghost" size="sm" className="text-gray-400" aria-label="Open filter options">
              <Filter className="w-4 h-4 mr-2" aria-hidden="true" />
              Filter
            </Button>
          </div>
          <Button 
            variant="atlvs" 
            size="sm"
            onClick={handleExport}
            disabled={exportMutation.isPending}
            aria-label={exportMutation.isPending ? "Exporting report" : "Export analytics report"}
          >
            {exportMutation.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
            ) : (
              <Download className="w-4 h-4 mr-2" aria-hidden="true" />
            )}
            Export Report
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8" role="region" aria-label="Analytics statistics">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card variant="atlvs" className="bg-gray-900/50">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <CardDescription className="text-gray-400">
                      {stat.label}
                    </CardDescription>
                    <div className={`p-2 bg-gray-800 rounded-lg ${stat.color}`} aria-hidden="true">
                      <stat.icon className="w-4 h-4" aria-hidden="true" />
                    </div>
                  </div>
                  <CardTitle className="text-3xl font-bebas" aria-label={`${stat.label}: ${stat.value}, ${stat.change} ${stat.trend === 'up' ? 'increase' : 'decrease'} versus last period`}>
                    {stat.value}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-2" aria-hidden="true">
                    {stat.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-atlvs-green-500" aria-hidden="true" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-error" aria-hidden="true" />
                    )}
                    <span className={`text-sm ${stat.trend === 'up' ? 'text-atlvs-green-500' : 'text-error'}`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-400">vs last period</span>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Chart */}
          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <CardTitle>Revenue Trend</CardTitle>
                  <CardDescription className="text-gray-400">
                    Monthly revenue over time
                  </CardDescription>
                </div>
                <LineChart className="w-5 h-5 text-atlvs-green-500" />
              </div>
              <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-800 rounded-lg">
                <p className="text-gray-500 font-oswald">Chart visualization coming soon</p>
              </div>
            </CardHeader>
          </Card>

          {/* Project Distribution */}
          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <CardTitle>Project Distribution</CardTitle>
                  <CardDescription className="text-gray-400">
                    Projects by status
                  </CardDescription>
                </div>
                <PieChart className="w-5 h-5 text-info" />
              </div>
              <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-800 rounded-lg">
                <p className="text-gray-500 font-oswald">Chart visualization coming soon</p>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Performance Metrics */}
        <Card variant="atlvs" className="bg-gray-900/50 mb-8">
          <CardHeader>
            <CardTitle className="mb-4">Team Performance</CardTitle>
            <div className="space-y-4">
              {teamLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-atlvs-green-500" />
                </div>
              ) : teams && teams.length > 0 ? (
                teams.map((team: any, index: number) => (
                <div key={team.id || index} className="p-4 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-oswald text-white">{team.name}</h4>
                      <p className="text-sm text-gray-400">{team.memberCount || 0} members</p>
                    </div>
                    <Badge variant="atlvs-outline">
                      Active
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Task Completion</div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-atlvs-green-500"
                          style={{ width: '75%' }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Budget Efficiency</div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-info"
                          style={{ width: '82%' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  No team performance data available
                </div>
              )}
            </div>
          </CardHeader>
        </Card>

        {/* Quick Reports */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Project Summary', description: 'Overview of all active projects', icon: BarChart3 },
            { title: 'Budget Analysis', description: 'Spending patterns and forecasts', icon: DollarSign },
            { title: 'Team Utilization', description: 'Resource allocation and capacity', icon: Users }
          ].map((report, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card variant="atlvs" className="bg-gray-900/50 hover:bg-gray-900 transition-all cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 bg-atlvs-green-500/10 rounded-lg">
                      <report.icon className="w-5 h-5 text-atlvs-green-500" />
                    </div>
                    <CardTitle className="text-lg">{report.title}</CardTitle>
                  </div>
                  <CardDescription className="text-gray-400">
                    {report.description}
                  </CardDescription>
                  <Button variant="ghost" size="sm" className="mt-4 text-atlvs-green-500">
                    Generate Report →
                  </Button>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </ContentLayout>
    </AtlvsLayout>
  );
}
