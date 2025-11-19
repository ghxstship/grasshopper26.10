'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { Play, Pause, Edit, Trash2, Clock, Zap, CheckCircle, XCircle, Activity } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { LoadingState } from '@/components/molecules/LoadingState';
import { EmptyState } from '@/components/molecules/EmptyState';
import { useWorkflow, useExecuteWorkflow } from '@/lib/hooks/atlvs/useAutomation';

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/atlvs/automation/[id]

// API: /api/atlvs/automation/:id
const API_ENDPOINT = '/api/atlvs/automation/:id';

export default function WorkflowDetailPage({ params }: { params: { id: string } }) {
  const { data: workflow, isLoading, error } = useWorkflow(params.id);
  const executeWorkflow = useExecuteWorkflow();

  if (isLoading) {
    return (
      <AtlvsLayout>
        <ContentLayout
          title="Loading..."
          description="Fetching workflow details"
          variant="atlvs"
          breadcrumbs={[
            { label: 'Automation', href: '/atlvs/automation' },
            { label: 'Loading...' }
          ]}
        >
          <LoadingState variant="atlvs" />
        </ContentLayout>
      </AtlvsLayout>
    );
  }

  if (error || !workflow) {
    return (
      <AtlvsLayout>
        <ContentLayout
          title="Error"
          description="Failed to load workflow"
          variant="atlvs"
          breadcrumbs={[
            { label: 'Automation', href: '/atlvs/automation' },
            { label: 'Error' }
          ]}
        >
          <EmptyState
            title="Workflow Not Found"
            message="The workflow you're looking for doesn't exist or you don't have permission to view it."
          />
        </ContentLayout>
      </AtlvsLayout>
    );
  }

  const handleExecute = () => {
    executeWorkflow.mutate(params.id);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-atlvs-green-500/20 text-atlvs-green-500 border-atlvs-green-500/50';
      case 'paused': return 'bg-warning-light text-warning border-warning-border';
      case 'error': return 'bg-error-light text-error border-error-border';
      default: return 'bg-grey-500/20 text-grey-500 border-grey-500/50';
    }
  };

  const getExecutionStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-atlvs-green-500';
      case 'failed': return 'text-error';
      case 'running': return 'text-info';
      default: return 'text-grey-500';
    }
  };

  return (
    <AtlvsLayout>
      <ContentLayout
        title={workflow.name}
        description={workflow.description}
        variant="atlvs"
        breadcrumbs={[
          { label: 'Automation', href: '/atlvs/automation' },
          { label: workflow.name }
        ]}
        actions={[
          workflow.status === 'active' ? {
            label: 'Pause',
            onClick: () => {},
            icon: <Pause className="w-4 h-4" />
          } : {
            label: 'Activate',
            onClick: () => {},
            icon: <Play className="w-4 h-4" />,
            variant: 'atlvs' as const
          },
          {
            label: 'Edit',
            onClick: () => {},
            icon: <Edit className="w-4 h-4" />
          }
        ]}
      >
        <div className="mb-6 flex items-center gap-2">
          <Badge variant="atlvs-outline" className={getStatusColor(workflow.status)}>
            <Activity className="w-3 h-3 mr-1" />
            {workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1)}
          </Badge>
          <Badge variant="atlvs-outline" className="bg-grey-700/50">
            {workflow.category}
          </Badge>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card variant="atlvs" className="bg-grey-900/50">
            <CardHeader>
              <div className="text-body-sm text-grey-400 mb-1">Total Executions</div>
              <div className="atlvs-text-gradient">
                {workflow.executions.total.toLocaleString()}
              </div>
            </CardHeader>
          </Card>

          <Card variant="atlvs" className="bg-grey-900/50">
            <CardHeader>
              <div className="text-body-sm text-grey-400 mb-1">Successful</div>
              <div className="text-atlvs-green-500">
                {workflow.executions.successful.toLocaleString()}
              </div>
            </CardHeader>
          </Card>

          <Card variant="atlvs" className="bg-grey-900/50">
            <CardHeader>
              <div className="text-body-sm text-grey-400 mb-1">Failed</div>
              <div className="text-error">
                {workflow.executions.failed}
              </div>
            </CardHeader>
          </Card>

          <Card variant="atlvs" className="bg-grey-900/50">
            <CardHeader>
              <div className="text-body-sm text-grey-400 mb-1">Success Rate</div>
              <div className="text-atlvs-green-500">
                {workflow.executions.successRate}%
              </div>
            </CardHeader>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Workflow Steps */}
            <Card variant="atlvs" className="bg-grey-900/50">
              <CardHeader>
                <CardTitle className="mb-6">Workflow Steps</CardTitle>
                <div className="space-y-4">
                  {workflow.steps?.map((step: any, index: number) => (
                    <div key={step.id} className="flex items-start gap-4">
                      <div className="relative">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${ step.type === 'trigger' ? 'bg-atlvs-purple-500' : 'bg-atlvs-green-500' }`}>
                          {index + 1}
                        </div>
                        {index < workflow.steps.length - 1 && (
                          <div className="absolute top-10 left-5 w-0.5 h-full bg-grey-700" />
                        )}
                      </div>
                      <div className="flex-1 pb-6">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <div className="font-medium mb-1">{step.name}</div>
                            <Badge variant="atlvs-outline" className="bg-grey-700/50 text-caption">
                              {step.type.charAt(0).toUpperCase() + step.type.slice(1)}
                            </Badge>
                          </div>
                          <Badge variant="atlvs-outline" className={getStatusColor(step.status)}>
                            {step.status.charAt(0).toUpperCase() + step.status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardHeader>
            </Card>

            {/* Recent Executions */}
            <Card variant="atlvs" className="bg-grey-900/50">
              <CardHeader>
                <CardTitle className="mb-6">Recent Executions</CardTitle>
                <div className="space-y-2">
                  {workflow.recentExecutions?.map((execution: any) => (
                    <div key={execution.id} className="flex items-center justify-between p-4 bg-grey-800/50 rounded-lg">
                      <div className="flex items-center gap-4">
                        {execution.status === 'success' ? (
                          <CheckCircle className={`w-5 h-5 ${getExecutionStatusColor(execution.status)}`} />
                        ) : (
                          <XCircle className={`w-5 h-5 ${getExecutionStatusColor(execution.status)}`} />
                        )}
                        <div>
                          <div className="font-medium">
                            {new Date(execution.time).toLocaleString()}
                          </div>
                          {execution.error && (
                            <div className="text-body-sm text-destructive">{execution.error}</div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-body-sm text-grey-400 flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {execution.duration}
                        </div>
                        <Badge
                          variant="atlvs-outline"
                          className={execution.status === 'success' 
                            ? 'bg-atlvs-green-500/20 text-atlvs-green-500' 
                            : 'bg-error-light text-error'
                          }
                        >
                          {execution.status.charAt(0).toUpperCase() + execution.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardHeader>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Workflow Info */}
            <Card variant="atlvs" className="bg-grey-900/50">
              <CardHeader>
                <CardTitle className="mb-4">Workflow Info</CardTitle>
                <div className="space-y-4">
                  <div>
                    <div className="text-body-sm text-grey-400 mb-1 flex items-center gap-1">
                      <Zap className="w-4 h-4" />
                      Trigger
                    </div>
                    <div className="font-medium">{workflow.trigger}</div>
                  </div>
                  <div>
                    <div className="text-body-sm text-grey-400 mb-1 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Last Run
                    </div>
                    <div className="font-medium">{new Date(workflow.lastRun).toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-body-sm text-grey-400 mb-1">Next Run</div>
                    <div className="font-medium">{new Date(workflow.nextRun).toLocaleString()}</div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Actions */}
            <Card variant="atlvs" className="bg-grey-900/50">
              <CardHeader>
                <CardTitle className="mb-4">Actions</CardTitle>
                <div className="space-y-2">
                  <Button 
                    variant="atlvs" 
                    size="sm" 
                    className="w-full"
                    onClick={handleExecute}
                    disabled={executeWorkflow.isPending}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {executeWorkflow.isPending ? 'Running...' : 'Run Now'}
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Workflow
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    Duplicate
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start text-error">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Workflow
                  </Button>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
      </ContentLayout>
    </AtlvsLayout>
  );
}
