'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { motion } from 'framer-motion';
import { History, Download, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { useAdvancingRequests } from '@/lib/hooks/atlvs/useAdvancingRequestQuery';
import { useState } from 'react';
import Link from 'next/link';

interface AdvancingRequest {
  id: string;
  status: string;
  title?: string;
  project?: string;
  requestedAt?: string;
  [key: string]: unknown;
}

export default function AdvancingHistoryPage() {
  const { data: requests, isLoading, error, refetch } = useAdvancingRequests();
  const [isExporting, setIsExporting] = useState(false);
  
  // Filter to show only completed/closed requests
  const typedRequests = (requests as AdvancingRequest[]) || [];
  const history = typedRequests.filter((r: AdvancingRequest) => 
    r.status === 'approved' || r.status === 'rejected'
  );
  
  const handleExport = async () => {
    setIsExporting(true);
    try {
      // TODO: Implement actual export
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Exporting history...', history);
    } finally {
      setIsExporting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-atlvs-green-500/20 text-atlvs-green-500 border-atlvs-green-500/50';
      case 'pending': return 'bg-warning-light text-warning border-warning-border';
      case 'rejected': return 'bg-error-light text-error border-error-border';
      default: return 'bg-gray-500/20 text-gray-500 border-gray-500/50';
    }
  };

  return (
    <AtlvsLayout>
      <ContentLayout
        title="REQUEST HISTORY"
        description="View past advancing requests"
        variant="atlvs"
        breadcrumbs={[
          { label: 'Advancing', href: '/atlvs/advancing' },
          { label: 'History' }
        ]}
        primaryAction={{
          label: 'Export History',
          onClick: handleExport,
          icon: isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />,
          variant: 'atlvs',
          disabled: isExporting || history.length === 0
        }}
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
                <h3 className="text-lg font-bebas mb-2">Failed to Load History</h3>
                <p className="text-gray-400 mb-4">{error.message}</p>
                <Button variant="atlvs" onClick={() => refetch()}>Try Again</Button>
              </div>
            </CardHeader>
          </Card>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card variant="atlvs" className="bg-gray-900/50">
              <CardHeader>
                <CardTitle className="mb-6 flex items-center gap-2">
                  <History className="w-5 h-5" aria-hidden="true" />
                  Past Requests ({history.length})
                </CardTitle>
                {history.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <History className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No completed requests yet</p>
                  </div>
                ) : (
                  <div className="space-y-3" role="list" aria-label="Past advancing requests">
                    {history.map((item: AdvancingRequest) => (
                      <Link key={item.id} href={`/atlvs/advancing/${item.id}`}>
                        <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer" role="listitem">
                          <div className="flex-1">
                            <div className="font-medium mb-1">{item.title}</div>
                            <div className="text-sm text-gray-400">{item.project} • {item.requestedAt ? new Date(item.requestedAt).toLocaleDateString() : 'N/A'}</div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant="atlvs-outline" className={getStatusColor(item.status)} role="status" aria-label={`Status: ${item.status}`}>
                              {item.status}
                            </Badge>
                          </div>
                        </div>
                      </Link>
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
