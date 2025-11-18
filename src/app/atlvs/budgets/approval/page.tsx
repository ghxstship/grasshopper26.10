'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { useBudgets } from '@/lib/hooks/atlvs/useBudgets';

export default function BudgetApprovalPage() {
  const { data, isLoading, error, refetch } = useBudgets({ status: 'pending_approval' });
  const requests = data?.requests || [];

  if (isLoading) {
    return (
      <AtlvsLayout>
        <ContentLayout
          title="APPROVAL WORKFLOW"
          description="Loading approval requests..."
          breadcrumbs={[
            { label: 'Budgets', href: '/atlvs/budgets' },
            { label: 'Approval' }
          ]}
        >
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-atlvs-green-500" />
              <p className="text-gray-400">Loading approval requests...</p>
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
          title="APPROVAL WORKFLOW"
          description="Error loading requests"
          breadcrumbs={[
            { label: 'Budgets', href: '/atlvs/budgets' },
            { label: 'Approval' }
          ]}
        >
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
              <h2 className="text-xl font-bebas mb-2">Failed to Load Approval Requests</h2>
              <p className="text-gray-400 mb-4">{error.message}</p>
              <Button variant="atlvs" onClick={() => refetch()}>Try Again</Button>
            </div>
          </div>
        </ContentLayout>
      </AtlvsLayout>
    );
  }

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
      default: return 'bg-gray-500/20 text-gray-500 border-gray-500/50';
    }
  };

  return (
    <AtlvsLayout>
      <ContentLayout
        title="APPROVAL WORKFLOW"
        description="Review and approve budget requests"
        breadcrumbs={[
          { label: 'Budgets', href: '/atlvs/budgets' },
          { label: 'Approval' }
        ]}
      >
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <div className="text-sm text-gray-400 mb-1">Pending</div>
              <div className="text-3xl font-bebas text-warning">5</div>
            </CardHeader>
          </Card>
          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <div className="text-sm text-gray-400 mb-1">Approved</div>
              <div className="text-3xl font-bebas text-atlvs-green-500">18</div>
            </CardHeader>
          </Card>
          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <div className="text-sm text-gray-400 mb-1">Rejected</div>
              <div className="text-3xl font-bebas text-error">3</div>
            </CardHeader>
          </Card>
        </div>

        <Card variant="atlvs" className="bg-gray-900/50">
          <CardHeader>
            <CardTitle className="mb-6">Approval Requests</CardTitle>
            <div className="space-y-3">
              {requests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-4 flex-1">
                    {getStatusIcon(request.status)}
                    <div className="flex-1">
                      <div className="font-medium mb-1">{request.item}</div>
                      <div className="text-sm text-gray-400">
                        Requested by {request.requester} • {request.date}
                      </div>
                    </div>
                    <div className="text-2xl font-bebas atlvs-text-gradient">
                      ${request.amount.toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <Badge variant="atlvs-outline" className={getStatusColor(request.status)}>
                      {request.status}
                    </Badge>
                    {request.status === 'pending' && (
                      <>
                        <Button variant="atlvs" size="sm">Approve</Button>
                        <Button variant="ghost" size="sm" className="text-error">Reject</Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardHeader>
        </Card>
        </motion.div>
      </ContentLayout>
    </AtlvsLayout>
  );
}
