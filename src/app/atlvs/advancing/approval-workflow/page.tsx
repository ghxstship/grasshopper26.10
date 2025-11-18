'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { CheckCircle, XCircle, Clock, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { useMemo } from 'react';
import { useAdvancingRequests } from '@/lib/hooks/atlvs/useAdvancingRequestQuery';

interface ApprovalStep {
  id: string;
  step: number;
  approver: string;
  role: string;
  status: 'pending' | 'approved' | 'rejected';
  date?: string;
  comments?: string;
}

export default function ApprovalWorkflowPage() {
  const { data: requests, isLoading, error, refetch } = useAdvancingRequests();
  
  // Generate approval workflow steps from requests
  const approvalSteps: ApprovalStep[] = useMemo(() => {
    if (!requests || requests.length === 0) return [];
    
    // For demo: create workflow steps from first request
    const request = requests[0];
    const isApproved = request.status.toLowerCase() === 'approved';
    const isUnderReview = request.status.toLowerCase() === 'under-review';
    
    const steps: ApprovalStep[] = [
      { 
        id: '1', 
        step: 1, 
        approver: 'Production Manager', 
        role: 'Initial Review', 
        status: isApproved || isUnderReview ? 'approved' : 'pending',
        date: request.requestedAt,
        comments: 'Initial review completed'
      },
      { 
        id: '2', 
        step: 2, 
        approver: 'Technical Director', 
        role: 'Technical Review', 
        status: isApproved ? 'approved' : isUnderReview ? 'pending' : 'pending',
        date: isApproved ? request.requestedAt : undefined,
        comments: isApproved ? 'Technical requirements met' : undefined
      },
      { 
        id: '3', 
        step: 3, 
        approver: 'Finance Director', 
        role: 'Final Approval', 
        status: isApproved ? 'approved' : 'pending',
        date: isApproved ? request.requestedAt : undefined
      }
    ];
    
    return steps;
  }, [requests]);
  
  const progress = useMemo(() => {
    const approved = approvalSteps.filter(s => s.status === 'approved').length;
    const total = approvalSteps.length;
    const percentage = Math.round((approved / total) * 100);
    return { approved, total, percentage };
  }, [approvalSteps]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-6 h-6 text-success" />;
      case 'rejected': return <XCircle className="w-6 h-6 text-error" />;
      default: return <Clock className="w-6 h-6 text-warning" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-atlvs-green-500/20 text-atlvs-green-500 border-atlvs-green-500/50';
      case 'rejected': return 'bg-error-light text-error border-error-border';
      default: return 'bg-warning-light text-warning border-warning-border';
    }
  };

  return (
    <AtlvsLayout>
      <ContentLayout
        title="APPROVAL WORKFLOW"
        description="Track approval progress through workflow stages"
        variant="atlvs"
        breadcrumbs={[
          { label: 'Advancing', href: '/atlvs/advancing' },
          { label: 'Approval Workflow' }
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
                <h3 className="text-h6 font-bebas mb-2">Failed to Load Workflow</h3>
                <p className="text-gray-400 mb-4">{error.message}</p>
                <Button variant="atlvs" onClick={() => refetch()}>Try Again</Button>
              </div>
            </CardHeader>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card variant="atlvs" className="bg-gray-900/50">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-body-sm text-gray-400">Overall Progress</span>
                  <span className="text-body-sm">
                    {progress.approved} of {progress.total} approved ({progress.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-atlvs-green-500 to-atlvs-purple-500 h-3 rounded-full transition-all"
                    style={{ width: `${progress.percentage}%` }}
                  />
                </div>
              </CardHeader>
            </Card>

            <Card variant="atlvs" className="bg-gray-900/50">
              <CardHeader>
                <CardTitle className="mb-6">Approval Steps</CardTitle>
                <div className="relative">
                  {approvalSteps.map((step, index) => (
                    <div key={step.id} className="relative">
                      {index < approvalSteps.length - 1 && (
                        <div className="absolute left-6 top-12 w-0.5 h-full bg-gray-700" />
                      )}

                      <div className="relative flex gap-4 mb-6">
                        <div className="flex-shrink-0 z-10 bg-gray-900">
                          {getStatusIcon(step.status)}
                        </div>
                        <div className="flex-1 bg-gray-800/50 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-body-sm text-gray-400">Step {step.step}</span>
                                <Badge variant="atlvs-outline" className={getStatusColor(step.status)}>
                                  {step.status.charAt(0).toUpperCase() + step.status.slice(1)}
                                </Badge>
                              </div>
                              <div className="font-semibold">{step.approver}</div>
                              <div className="text-body-sm text-gray-400">{step.role}</div>
                            </div>
                            {step.date && (
                              <p className="text-caption text-gray-500">
                                Last updated: {new Date().toLocaleString()}
                              </p>
                            )}
                          </div>
                          {step.comments && (
                            <div className="mt-3 pt-3 border-t border-gray-700">
                              <div className="text-body-sm text-gray-300">{step.comments}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardHeader>
            </Card>

            {approvalSteps.some(s => s.status === 'pending') && (
              <Card variant="atlvs" className="bg-warning-light/10 border-warning-border">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-warning mb-1">Pending Approval</div>
                      <div className="text-body-sm text-gray-300">
                        Waiting for {approvalSteps.find((s: ApprovalStep) => s.status === 'pending')?.approver} to review and approve.
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            )}
          </div>
        )}
      </ContentLayout>
    </AtlvsLayout>
  );
}
