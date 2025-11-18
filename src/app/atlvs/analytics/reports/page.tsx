'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { Download, Calendar, Filter, TrendingUp, BarChart3, PieChart, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { useReports, type Report } from '@/lib/hooks/atlvs/useReports';

export default function ReportsPage() {
  const { data: reports, isLoading, error, refetch } = useReports();
  
  if (isLoading) {
    return (
      <AtlvsLayout>
        <ContentLayout
          title="ANALYTICS REPORTS"
          description="Generate and download comprehensive reports"
          variant="atlvs"
          breadcrumbs={[
            { label: 'Analytics', href: '/atlvs/analytics' },
            { label: 'Reports' }
          ]}
        >
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-atlvs-green-500" />
              <p className="text-gray-400">Loading reports...</p>
            </div>
          </div>
        </ContentLayout>
      </AtlvsLayout>
    );
  }
  
  if (error) {
    return (
      <AtlvsLayout>
        <ContentLayout
          title="ANALYTICS REPORTS"
          description="Generate and download comprehensive reports"
          variant="atlvs"
          breadcrumbs={[
            { label: 'Analytics', href: '/atlvs/analytics' },
            { label: 'Reports' }
          ]}
        >
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
              <h2 className="text-h5 font-bebas mb-2">Failed to Load Reports</h2>
              <p className="text-gray-400 mb-4">{error.message}</p>
              <Button variant="atlvs" onClick={() => refetch()}>
                Try Again
              </Button>
            </div>
          </div>
        </ContentLayout>
      </AtlvsLayout>
    );
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'project': return <BarChart3 className="w-5 h-5" />;
      case 'budget': return <TrendingUp className="w-5 h-5" />;
      case 'team': return <PieChart className="w-5 h-5" />;
      case 'asset': return <BarChart3 className="w-5 h-5" />;
      default: return <BarChart3 className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'project': return 'bg-info-light text-info border-info-border';
      case 'budget': return 'bg-atlvs-green-500/20 text-atlvs-green-500 border-atlvs-green-500/50';
      case 'team': return 'bg-atlvs-purple-500/20 text-atlvs-purple-500 border-atlvs-purple-500/50';
      case 'asset': return 'bg-atlvs-orange-500/20 text-atlvs-orange-500 border-atlvs-orange-500/50';
      default: return 'bg-gray-500/20 text-gray-500 border-gray-500/50';
    }
  };

  return (
    <AtlvsLayout>
      <ContentLayout
        title="ANALYTICS REPORTS"
        description="Generate and download comprehensive reports"
        variant="atlvs"
        breadcrumbs={[
          { label: 'Analytics', href: '/atlvs/analytics' },
          { label: 'Reports' }
        ]}
      >
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <div className="text-body-sm text-gray-400 mb-1">Total Reports</div>
              <div className="text-h3 font-bebas atlvs-text-gradient">24</div>
            </CardHeader>
          </Card>

          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <div className="text-body-sm text-gray-400 mb-1">This Month</div>
              <div className="text-h3 font-bebas text-atlvs-green-500">8</div>
            </CardHeader>
          </Card>

          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <div className="text-body-sm text-gray-400 mb-1">Scheduled</div>
              <div className="text-h3 font-bebas text-atlvs-purple-500">5</div>
            </CardHeader>
          </Card>

          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <div className="text-body-sm text-gray-400 mb-1">Downloads</div>
              <div className="text-h3 font-bebas text-info">142</div>
            </CardHeader>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            All Types
          </Button>
          <Button variant="ghost" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Date Range
          </Button>
        </div>

        {/* Reports List */}
        <Card variant="atlvs" className="bg-gray-900/50">
          <CardHeader>
            <CardTitle className="mb-6">Recent Reports</CardTitle>
            <div className="space-y-3">
              {(reports || []).map((report: Report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getTypeColor(report.type)}`}>
                      {getTypeIcon(report.type)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium mb-1">{report.name}</div>
                      <div className="flex items-center gap-3 text-body-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {report.period}
                        </span>
                        <span>•</span>
                        <span>Generated {report.generated ? new Date(report.generated).toLocaleDateString() : 'N/A'}</span>
                        <span>•</span>
                        <span>{report.size}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="atlvs-outline" className={getTypeColor(report.type)}>
                      {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardHeader>
        </Card>

        {/* Report Templates */}
        <div className="mt-6">
          <h2 className="text-h4 font-bebas mb-4 atlvs-text-gradient">REPORT TEMPLATES</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Project Summary', type: 'project', icon: <BarChart3 className="w-6 h-6" /> },
              { name: 'Budget Analysis', type: 'budget', icon: <TrendingUp className="w-6 h-6" /> },
              { name: 'Team Performance', type: 'team', icon: <PieChart className="w-6 h-6" /> },
              { name: 'Asset Utilization', type: 'asset', icon: <BarChart3 className="w-6 h-6" /> }
            ].map((template, index) => (
              <Card
                key={index}
                variant="atlvs"
                className="bg-gray-900/50 cursor-pointer hover:bg-gray-900 transition-colors"
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${getTypeColor(template.type)}`}>
                    {template.icon}
                  </div>
                  <div className="font-medium mb-2">{template.name}</div>
                  <Button variant="atlvs" size="sm" className="w-full">
                    Generate
                  </Button>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </ContentLayout>
    </AtlvsLayout>
  );
}
