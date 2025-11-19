'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { Play, CheckCircle, XCircle, Clock, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { useWorkflows } from '@/lib/hooks/atlvs/useAutomation';
import { useMemo } from 'react';
import { BodyText, SectionHeader } from "@/components/atoms/Typography";

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/atlvs/automation/executions

export default function WorkflowExecutionsPage() {
  const { data: workflows, isLoading, error, refetch } = useWorkflows();
  
  const stats = useMemo(() => {
    if (!workflows) return { total: 0, successRate: 0, avgDuration: '0s', active: 0 };
    
    const totalExecutions = workflows.reduce((sum: number, w: any) => sum + (w.executions || 0), 0);
    const successRate = workflows.length > 0 
      ? Math.round(workflows.reduce((sum: number, w: any) => sum + (w.successRate || 0), 0) / workflows.length)
      : 0;
    
    return {
      total: totalExecutions,
      successRate,
      avgDuration: '1.8s',
      active: workflows.filter((w: any) => w.status === 'active').length
    };
  }, [workflows]);
  
  // Mock executions for now - would come from workflow execution logs
  const executions = [
    { id: '1', workflow: 'Project Creation', status: 'success', duration: '2.3s', time: '5 mins ago' },
    { id: '2', workflow: 'Budget Alert', status: 'success', duration: '1.1s', time: '15 mins ago' },
    { id: '3', workflow: 'Task Assignment', status: 'running', duration: '...', time: 'Now' },
    { id: '4', workflow: 'Document Approval', status: 'failed', duration: '0.8s', time: '1 hour ago' }
  ];
  
  if (isLoading) {
    return (
      <AtlvsLayout>
        <ContentLayout
          title="WORKFLOW EXECUTIONS"
          description="Monitor workflow runs and performance"
          variant="atlvs"
          breadcrumbs={[
            { label: 'Automation', href: '/atlvs/automation' },
            { label: 'Executions' }
          ]}
        >
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-atlvs-green-500" />
              <BodyText className="text-grey-400">Loading executions...</BodyText>
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
          title="WORKFLOW EXECUTIONS"
          description="Monitor workflow runs and performance"
          variant="atlvs"
          breadcrumbs={[
            { label: 'Automation', href: '/atlvs/automation' },
            { label: 'Executions' }
          ]}
        >
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
              <SectionHeader className="mb-2">Failed to Load Executions</SectionHeader>
              <p className="text-grey-400 mb-4">{error.message}</p>
              <Button variant="atlvs" onClick={() => refetch()}>
                Try Again
              </Button>
            </div>
          </div>
        </ContentLayout>
      </AtlvsLayout>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-5 h-5 text-atlvs-green-500" />;
      case 'running': return <Play className="w-5 h-5 text-info" />;
      case 'failed': return <XCircle className="w-5 h-5 text-error" />;
      default: return <Clock className="w-5 h-5 text-grey-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-atlvs-green-500/20 text-atlvs-green-500 border-atlvs-green-500/50';
      case 'running': return 'bg-info-light text-info border-info-border';
      case 'failed': return 'bg-error-light text-error border-error-border';
      default: return 'bg-grey-500/20 text-grey-500 border-grey-500/50';
    }
  };

  return (
    <AtlvsLayout>
      <ContentLayout
        title="WORKFLOW EXECUTIONS"
        description="Monitor workflow runs and performance"
        variant="atlvs"
        breadcrumbs={[
          { label: 'Automation', href: '/atlvs/automation' },
          { label: 'Executions' }
        ]}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6" role="region" aria-label="Workflow execution statistics">
          <Card variant="atlvs" className="bg-grey-900/50">
            <CardHeader>
              <div className="text-body-sm text-grey-400 mb-1">Total Runs</div>
              <div className="atlvs-text-gradient" aria-label={`${stats.total.toLocaleString()} total workflow runs`}>{stats.total.toLocaleString()}</div>
            </CardHeader>
          </Card>
          <Card variant="atlvs" className="bg-grey-900/50">
            <CardHeader>
              <div className="text-body-sm text-grey-400 mb-1">Success Rate</div>
              <div className="text-atlvs-green-500" aria-label={`${stats.successRate} percent success rate`}>{stats.successRate}%</div>
            </CardHeader>
          </Card>
          <Card variant="atlvs" className="bg-grey-900/50">
            <CardHeader>
              <div className="text-body-sm text-grey-400 mb-1">Avg Duration</div>
              <div className="text-atlvs-purple-500" aria-label={`${stats.avgDuration} average duration`}>{stats.avgDuration}</div>
            </CardHeader>
          </Card>
          <Card variant="atlvs" className="bg-grey-900/50">
            <CardHeader>
              <div className="text-body-sm text-grey-400 mb-1">Active Now</div>
              <div className="text-info" aria-label="3 workflows active now">3</div>
            </CardHeader>
          </Card>
        </div>

        <Card variant="atlvs" className="bg-grey-900/50">
          <CardHeader>
            <CardTitle className="mb-6">Recent Executions</CardTitle>
            <div className="space-y-3" role="list" aria-label="Recent workflow executions">
              {executions.map((execution) => (
                <div key={execution.id} className="flex items-center justify-between p-4 bg-grey-800/50 rounded-lg" role="listitem">
                  <div className="flex items-center gap-4 flex-1">
                    {getStatusIcon(execution.status)}
                    <div className="flex-1">
                      <div className="font-medium mb-1">{execution.workflow}</div>
                      <div className="text-body-sm text-grey-400">Duration: {execution.duration} • {execution.time}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="atlvs-outline" className={getStatusColor(execution.status)}>
                      {execution.status}
                    </Badge>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardHeader>
        </Card>
      </ContentLayout>
    </AtlvsLayout>
  );
}
