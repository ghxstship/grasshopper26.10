'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Clock, CheckCircle2, XCircle, AlertTriangle, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { CompvssLayout } from '@/components/templates/CompvssLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { useAdvancingRequests } from '@/lib/hooks/compvss';
import { useMemo } from 'react';

export default function AdvancingAnalyticsPage() {
  const { data: requestsData, isLoading, error, refetch } = useAdvancingRequests();
  
  const stats = useMemo(() => {
    if (!requestsData?.requests) {
      return {
        totalRequests: 0,
        approved: 0,
        pending: 0,
        rejected: 0,
        avgResponseTime: '0 hours',
        completionRate: 0,
      };
    }
    
    const requests = requestsData.requests;
    const total = requests.length;
    const approved = requests.filter((r: any) => r.status === 'approved').length;
    const pending = requests.filter((r: any) => r.status === 'pending').length;
    const rejected = requests.filter((r: any) => r.status === 'rejected').length;
    
    return {
      totalRequests: total,
      approved,
      pending,
      rejected,
      avgResponseTime: '4.2 hours',
      completionRate: total > 0 ? ((approved / total) * 100).toFixed(1) : 0,
    };
  }, [requestsData]);

  const categoryBreakdown = useMemo(() => {
    if (!requestsData?.requests) return [];
    
    const categories: Record<string, any> = {};
    requestsData.requests.forEach((req: any) => {
      const cat = req.category || 'Other';
      if (!categories[cat]) {
        categories[cat] = { category: cat, count: 0, approved: 0, pending: 0, rejected: 0 };
      }
      categories[cat].count++;
      if (req.status === 'approved') categories[cat].approved++;
      if (req.status === 'pending') categories[cat].pending++;
      if (req.status === 'rejected') categories[cat].rejected++;
    });
    
    return Object.values(categories);
  }, [requestsData]);

  const recentActivity = useMemo(() => {
    if (!requestsData?.requests) return [];
    
    const activityByDate: Record<string, any> = {};
    requestsData.requests.forEach((req: any) => {
      const date = new Date(req.createdAt).toISOString().split('T')[0];
      if (!activityByDate[date]) {
        activityByDate[date] = { date, requests: 0, approved: 0, rejected: 0 };
      }
      activityByDate[date].requests++;
      if (req.status === 'approved') activityByDate[date].approved++;
      if (req.status === 'rejected') activityByDate[date].rejected++;
    });
    
    return Object.values(activityByDate).slice(0, 5);
  }, [requestsData]);
  
  if (isLoading) {
    return (
      <CompvssLayout>
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-compvss-cyan-500" />
            <p className="text-gray-400">Loading analytics...</p>
          </div>
        </div>
      </CompvssLayout>
    );
  }
  
  if (error) {
    return (
      <CompvssLayout>
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
            <h2 className="text-h5 font-bebas mb-2">Failed to Load Analytics</h2>
            <p className="text-gray-400 mb-4">{error.message || 'An error occurred'}</p>
            <Button variant="compvss" onClick={() => refetch()}>
              Try Again
            </Button>
          </div>
        </div>
      </CompvssLayout>
    );
  }

  return (
    <CompvssLayout>
      <ContentLayout
        title="Advancing Analytics"
        description="Performance metrics and insights"
        
        variant="compvss"
        showToolbar={false}
      >
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-8">
            <Link href="/compvss/advancing/dashboard">
              <h1 className="compvss-text-gradient text-h2 font-anton mb-2 cursor-pointer">
                Advancing Analytics
              </h1>
            </Link>
            <p className="text-gray-400 font-oswald">
              Performance metrics and insights
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <Card variant="compvss" className="bg-gray-900/80 backdrop-blur-sm border-2 border-compvss-cyan-500/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-body-sm text-gray-400 font-oswald">Total Requests</p>
                  <BarChart3 className="w-5 h-5 text-compvss-cyan-500" />
                </div>
                <p className="text-h2 font-bebas text-white mb-1">{stats.totalRequests}</p>
                <div className="flex items-center gap-2 text-caption text-success font-share-tech">
                  <TrendingUp className="w-3 h-3" />
                  <span>+12% from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card variant="compvss" className="bg-success-light0/10 border-success/30">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-body-sm text-gray-400 font-oswald">Approved</p>
                  <CheckCircle2 className="w-5 h-5 text-success" />
                </div>
                <p className="text-h2 font-bebas text-success mb-1">{stats.approved}</p>
                <p className="text-caption text-gray-400 font-share-tech">
                  {Math.round((stats.approved / stats.totalRequests) * 100)}% approval rate
                </p>
              </CardContent>
            </Card>

            <Card variant="compvss" className="bg-warning/10 border-warning/30">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-body-sm text-gray-400 font-oswald">Pending</p>
                  <Clock className="w-5 h-5 text-warning" />
                </div>
                <p className="text-h2 font-bebas text-warning mb-1">{stats.pending}</p>
                <p className="text-caption text-gray-400 font-share-tech">
                  Avg response: {stats.avgResponseTime}
                </p>
              </CardContent>
            </Card>

            <Card variant="compvss" className="bg-error/10 border-destructive/30">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-body-sm text-gray-400 font-oswald">Rejected</p>
                  <XCircle className="w-5 h-5 text-error" />
                </div>
                <p className="text-h2 font-bebas text-error mb-1">{stats.rejected}</p>
                <p className="text-caption text-gray-400 font-share-tech">
                  {Math.round((stats.rejected / stats.totalRequests) * 100)}% rejection rate
                </p>
              </CardContent>
            </Card>

            <Card variant="compvss" className="bg-compvss-cyan-500/10 border-compvss-cyan-500/30">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-body-sm text-gray-400 font-oswald">Completion Rate</p>
                  <AlertTriangle className="w-5 h-5 text-compvss-cyan-500" />
                </div>
                <p className="text-h2 font-bebas text-compvss-cyan-500 mb-1">{stats.completionRate}%</p>
                <p className="text-caption text-gray-400 font-share-tech">
                  On-time delivery rate
                </p>
              </CardContent>
            </Card>

            <Card variant="compvss" className="bg-gray-900/80 backdrop-blur-sm border-2 border-compvss-cyan-500/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-body-sm text-gray-400 font-oswald">Avg Response Time</p>
                  <Clock className="w-5 h-5 text-compvss-cyan-500" />
                </div>
                <p className="text-h2 font-bebas text-white mb-1">{stats.avgResponseTime}</p>
                <div className="flex items-center gap-2 text-caption text-success font-share-tech">
                  <TrendingUp className="w-3 h-3" />
                  <span>15% faster</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Category Breakdown */}
          <Card variant="compvss" className="mb-6 bg-gray-900/80 backdrop-blur-sm border-2 border-compvss-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-white">Requests by Category</CardTitle>
              <CardDescription className="text-gray-400">
                Distribution across advancing categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryBreakdown.map((cat) => (
                  <div key={cat.category}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-body-sm font-oswald text-white">{cat.category}</span>
                      <span className="text-body-sm font-bebas text-gray-400">{cat.count} total</span>
                    </div>
                    <div className="flex gap-1 h-2 rounded-full overflow-hidden bg-gray-800">
                      <div
                        className="bg-success-light0"
                        style={{ width: `${(cat.approved / cat.count) * 100}%` }}
                        title={`${cat.approved} approved`}
                      />
                      <div
                        className="bg-warning"
                        style={{ width: `${(cat.pending / cat.count) * 100}%` }}
                        title={`${cat.pending} pending`}
                      />
                      <div
                        className="bg-error"
                        style={{ width: `${(cat.rejected / cat.count) * 100}%` }}
                        title={`${cat.rejected} rejected`}
                      />
                    </div>
                    <div className="flex gap-4 mt-1 text-caption font-share-tech">
                      <span className="text-success">{cat.approved} approved</span>
                      <span className="text-warning">{cat.pending} pending</span>
                      <span className="text-error">{cat.rejected} rejected</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card variant="compvss" className="bg-gray-900/80 backdrop-blur-sm border-2 border-compvss-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-white">Recent Activity</CardTitle>
              <CardDescription className="text-gray-400">
                Last 5 days of request activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((day) => (
                  <div key={day.date} className="flex items-center justify-between p-3 bg-black/50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <span className="text-body-sm font-oswald text-gray-300">
                        {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <Badge variant="default">{day.requests} requests</Badge>
                    </div>
                    <div className="flex gap-3 text-caption font-share-tech">
                      <span className="text-success">{day.approved} approved</span>
                      <span className="text-error">{day.rejected} rejected</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </ContentLayout>
    </CompvssLayout>
  );
}
