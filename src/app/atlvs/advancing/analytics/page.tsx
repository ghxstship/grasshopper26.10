'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { motion } from 'framer-motion';
import { TrendingUp, BarChart3, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Button } from '@/components/atoms/Button';
import { useAdvancingRequests } from '@/lib/hooks/atlvs/useAdvancingRequestQuery';
import { useMemo } from 'react';

interface AdvancingRequest {
  id: string;
  status: string;
  [key: string]: unknown;
}

export default function AdvancingAnalyticsPage() {
  const { data: requests, isLoading, error, refetch } = useAdvancingRequests();
  
  const metrics = useMemo(() => {
    if (!requests || requests.length === 0) {
      return {
        total: 0,
        approvalRate: 0,
        avgResponseTime: '0h',
        active: 0,
        growth: 0
      };
    }
    
    const typedRequests = requests as AdvancingRequest[];
    const approved = typedRequests.filter((r: AdvancingRequest) => r.status === 'approved').length;
    const active = typedRequests.filter((r: AdvancingRequest) => r.status === 'pending' || r.status === 'under-review').length;
    const approvalRate = Math.round((approved / requests.length) * 100);
    
    return {
      total: requests.length,
      approvalRate,
      avgResponseTime: '2.4h', // TODO: Calculate from actual data
      active,
      growth: 12 // TODO: Calculate from historical data
    };
  }, [requests]);
  
  return (
    <AtlvsLayout>
      <ContentLayout
        title="ADVANCING ANALYTICS"
        description="Performance metrics and insights"
        breadcrumbs={[
          { label: 'Advancing', href: '/atlvs/advancing' },
          { label: 'Analytics' }
        ]}
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-atlvs-green-500" />
          </div>
        ) : error ? (
          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
                <h3 className="text-h6 font-bebas mb-2">Failed to Load Analytics</h3>
                <p className="text-gray-400 mb-4">{error.message}</p>
                <Button variant="atlvs" onClick={() => refetch()}>Try Again</Button>
              </div>
            </CardHeader>
          </Card>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6" role="region" aria-label="Advancing analytics statistics">
              <Card variant="atlvs" className="bg-gray-900/50">
                <CardHeader>
                  <div className="text-body-sm text-gray-400 mb-1">Total Requests</div>
                  <div className="text-h3 font-bebas atlvs-text-gradient" aria-label={`${metrics.total} total requests, up ${metrics.growth} percent`}>{metrics.total}</div>
                  <div className="flex items-center gap-1 text-body-sm text-atlvs-green-500 mt-2" aria-hidden="true">
                    <TrendingUp className="w-4 h-4" aria-hidden="true" />
                    <span>+{metrics.growth}%</span>
                  </div>
                </CardHeader>
              </Card>
              <Card variant="atlvs" className="bg-gray-900/50">
                <CardHeader>
                  <div className="text-body-sm text-gray-400 mb-1">Approval Rate</div>
                  <div className="text-h3 font-bebas text-atlvs-green-500" aria-label={`${metrics.approvalRate} percent approval rate, up 5 percent`}>{metrics.approvalRate}%</div>
                  <div className="flex items-center gap-1 text-body-sm text-atlvs-green-500 mt-2" aria-hidden="true">
                    <TrendingUp className="w-4 h-4" aria-hidden="true" />
                    <span>+5%</span>
                  </div>
                </CardHeader>
              </Card>
              <Card variant="atlvs" className="bg-gray-900/50">
                <CardHeader>
                  <div className="text-body-sm text-gray-400 mb-1">Avg Response Time</div>
                  <div className="text-h3 font-bebas text-atlvs-purple-500" aria-label={`${metrics.avgResponseTime} average response time, down 15 percent`}>{metrics.avgResponseTime}</div>
                  <div className="flex items-center gap-1 text-body-sm text-atlvs-green-500 mt-2" aria-hidden="true">
                    <TrendingUp className="w-4 h-4" aria-hidden="true" />
                    <span>-15%</span>
                  </div>
                </CardHeader>
              </Card>
              <Card variant="atlvs" className="bg-gray-900/50">
                <CardHeader>
                  <div className="text-body-sm text-gray-400 mb-1">Active Requests</div>
                  <div className="text-h3 font-bebas text-info" aria-label={`${metrics.active} active requests`}>{metrics.active}</div>
                </CardHeader>
              </Card>
            </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <CardTitle className="mb-6 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" aria-hidden="true" />
                Requests by Category
              </CardTitle>
              <div className="h-64 flex items-center justify-center text-gray-400">
                Chart Placeholder
              </div>
            </CardHeader>
          </Card>

          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <CardTitle className="mb-6">Status Distribution</CardTitle>
              <div className="h-64 flex items-center justify-center text-gray-400">
                Chart Placeholder
              </div>
            </CardHeader>
          </Card>
            </div>
          </motion.div>
        )}
      </ContentLayout>
    </AtlvsLayout>
  );
}
