'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { Zap, Plus, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { useAutomation } from '@/lib/hooks/atlvs/useAutomation';

interface Trigger {
  id: string;
  name: string;
  type: string;
  event: string;
  workflow: string;
  workflows: number;
  status: string;
  lastTriggered?: string;
}

export default function WorkflowTriggersPage() {
  const { data, isLoading, error, refetch } = useAutomation({ type: 'triggers' });
  const triggers: Trigger[] = (data as { triggers?: Trigger[] })?.triggers || [];

  if (isLoading) {
    return (
      <AtlvsLayout>
        <ContentLayout
          title="EVENT TRIGGERS"
          description="Loading triggers..."
          variant="atlvs"
          breadcrumbs={[
            { label: 'Automation', href: '/atlvs/automation' },
            { label: 'Triggers' }
          ]}
        >
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-atlvs-green-500" />
              <p className="text-gray-400">Loading triggers...</p>
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
          title="EVENT TRIGGERS"
          description="Error loading triggers"
          variant="atlvs"
          breadcrumbs={[
            { label: 'Automation', href: '/atlvs/automation' },
            { label: 'Triggers' }
          ]}
        >
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
              <h2 className="text-h5 font-bebas mb-2">Failed to Load Triggers</h2>
              <p className="text-gray-400 mb-4">{error.message}</p>
              <Button variant="atlvs" onClick={() => refetch()}>Try Again</Button>
            </div>
          </div>
        </ContentLayout>
      </AtlvsLayout>
    );
  }

  const mockTriggers = [
    { id: '1', name: 'Project Created', event: 'project.created', workflows: 3, status: 'active' },
    { id: '2', name: 'Budget Exceeded', event: 'budget.exceeded', workflows: 2, status: 'active' },
    { id: '3', name: 'Task Completed', event: 'task.completed', workflows: 5, status: 'active' },
    { id: '4', name: 'Document Uploaded', event: 'document.uploaded', workflows: 1, status: 'inactive' }
  ];

  const _displayTriggers = triggers.length > 0 ? triggers : mockTriggers;

  return (
    <AtlvsLayout>
      <ContentLayout
        title="EVENT TRIGGERS"
        description="Configure workflow triggers"
        variant="atlvs"
        breadcrumbs={[
          { label: 'Automation', href: '/atlvs/automation' },
          { label: 'Triggers' }
        ]}
        actions={[
          {
            label: 'Add Trigger',
            onClick: () => {},
            icon: <Plus className="w-4 h-4" />,
            variant: 'atlvs' as const
          }
        ]}
      >

        <Card variant="atlvs" className="bg-gray-900/50">
          <CardHeader>
            <CardTitle className="mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Active Triggers
            </CardTitle>
            <div className="space-y-3">
              {triggers.map((trigger) => (
                <div key={trigger.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium mb-1">{trigger.name}</div>
                    <div className="text-body-sm text-gray-400">
                      <code className="px-2 py-1 bg-gray-900 rounded text-caption">{trigger.event}</code>
                      <span className="ml-3">{trigger.workflows} workflow{trigger.workflows !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="atlvs-outline"
                      className={trigger.status === 'active' ? 'bg-atlvs-green-500/20 text-atlvs-green-500 border-atlvs-green-500/50' : 'bg-gray-500/20 text-gray-500 border-gray-500/50'}
                    >
                      {trigger.status}
                    </Badge>
                    <Button variant="ghost" size="sm">Edit</Button>
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
