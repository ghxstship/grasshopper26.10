'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, XCircle, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { useAdvancingRequests } from '@/lib/hooks/atlvs/useAdvancingRequestQuery';
import { useMemo } from 'react';
import { BodyText, SubsectionHeader } from "@/components/atoms/Typography";

interface AdvancingRequest {
  id: string;
  status: string;
  title?: string;
  description?: string;
  project?: string;
  requestedAt?: string;
  [key: string]: unknown;
}

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/atlvs/advancing/results

export default function AdvancingResultsPage() {
  const { data: requests, isLoading, error, refetch } = useAdvancingRequests();
  
  const metrics = useMemo(() => {
    if (!requests) return { approved: 0, pending: 0, rejected: 0 };
    
    const typedRequests = requests as AdvancingRequest[];
    return {
      approved: typedRequests.filter((r: AdvancingRequest) => r.status === 'approved').length,
      pending: typedRequests.filter((r: AdvancingRequest) => r.status === 'pending' || r.status === 'under-review').length,
      rejected: typedRequests.filter((r: AdvancingRequest) => r.status === 'rejected').length
    };
  }, [requests]);
  
  const results = requests?.slice(0, 10) || [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-5 h-5 text-atlvs-green-500" />;
      case 'pending': return <Clock className="w-5 h-5 text-warning" />;
      case 'rejected': return <XCircle className="w-5 h-5 text-error" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-atlvs-green-500/20 text-atlvs-green-500 border-atlvs-green-500/50';
      case 'pending': return 'bg-warning-light text-warning border-warning-border';
      case 'rejected': return 'bg-error-light text-error border-error-border';
      default: return 'bg-grey-500/20 text-grey-500 border-grey-500/50';
    }
  };

  return (
    <AtlvsLayout>
      <ContentLayout
        title="RESULTS DASHBOARD"
        description="Track advancing request outcomes"
        breadcrumbs={[
          { label: 'Advancing', href: '/atlvs/advancing' },
          { label: 'Results' }
        ]}
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-atlvs-green-500" />
          </div>
        ) : error ? (
          <Card variant="atlvs" className="bg-grey-900/50">
            <CardHeader>
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
                <SubsectionHeader className="mb-2">Failed to Load Results</SubsectionHeader>
                <p className="text-grey-400 mb-4">{error.message}</p>
                <Button variant="atlvs" onClick={() => refetch()}>Try Again</Button>
              </div>
            </CardHeader>
          </Card>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card variant="atlvs" className="bg-grey-900/50">
                <CardHeader>
                  <div className="text-body-sm text-grey-400 mb-1">Approved</div>
                  <div className="text-atlvs-green-500">{metrics.approved}</div>
                </CardHeader>
              </Card>
              <Card variant="atlvs" className="bg-grey-900/50">
                <CardHeader>
                  <div className="text-body-sm text-grey-400 mb-1">Pending</div>
                  <div className="text-warning">{metrics.pending}</div>
                </CardHeader>
              </Card>
              <Card variant="atlvs" className="bg-grey-900/50">
                <CardHeader>
                  <div className="text-body-sm text-grey-400 mb-1">Rejected</div>
                  <div className="text-error">{metrics.rejected}</div>
                </CardHeader>
              </Card>
            </div>

            <Card variant="atlvs" className="bg-grey-900/50">
              <CardHeader>
                <CardTitle className="mb-6">Recent Results</CardTitle>
                {results.length === 0 ? (
                  <div className="text-center py-12 text-grey-400">
                    <CheckCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <BodyText >No results yet</BodyText>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {results.map((result: AdvancingRequest) => (
                      <div key={result.id} className="flex items-center justify-between p-4 bg-grey-800/50 rounded-lg">
                        <div className="flex items-center gap-4 flex-1">
                          {getStatusIcon(result.status)}
                          <div className="flex-1">
                            <div className="font-medium mb-1">{result.title}</div>
                            <div className="text-body-sm text-grey-400">{result.description || 'No notes'}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-body-sm text-grey-400">{result.requestedAt ? new Date(result.requestedAt).toLocaleDateString() : 'N/A'}</div>
                          <Badge variant="atlvs-outline" className={getStatusColor(result.status)}>
                            {result.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardHeader>
            </Card>
          </motion.div>
        )}
      </ContentLayout>
    </AtlvsLayout>
  );
}
