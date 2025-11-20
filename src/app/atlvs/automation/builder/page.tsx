'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { Plus, Play, Loader2 } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle } from '@/components/atoms/Card';
import { useAutomation } from '@/lib/hooks/atlvs/useAutomation';

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/atlvs/automation/builder

export default function WorkflowBuilderPage() {
  const { data: automationData, isLoading } = useAutomation();
  
  if (isLoading) {
    return (
      <AtlvsLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-12 h-12 animate-spin text-atlvs-green-500" />
        </div>
      </AtlvsLayout>
    );
  }
  
  return (
    <AtlvsLayout>
      <ContentLayout
        title="WORKFLOW BUILDER"
        description="Visual workflow editor"
        variant="atlvs"
        breadcrumbs={[
          { label: 'Automation', href: '/atlvs/automation' },
          { label: 'Builder' }
        ]}
        actions={[
          {
            label: 'Test',
            onClick: () => {},
            icon: <Play className="w-4 h-4" />
          },
          {
            label: 'Save Workflow',
            onClick: () => {},
            variant: 'atlvs' as const
          }
        ]}
      >
        <div className="grid grid-cols-4 gap-6">
          <Card variant="atlvs" className="bg-grey-900/50 col-span-1">
            <CardHeader>
              <CardTitle className="mb-4">Nodes</CardTitle>
              <div className="space-y-2">
                {['Trigger', 'Action', 'Condition', 'Loop', 'Delay'].map((node) => (
                  <div key={node} className="p-3 bg-grey-800/50 rounded-lg cursor-pointer hover:bg-grey-800 transition-colors">
                    <div className="font-medium text-body-sm">{node}</div>
                  </div>
                ))}
              </div>
              <Button variant="atlvs" size="sm" className="w-full mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Add Node
              </Button>
            </CardHeader>
          </Card>

          <Card variant="atlvs" className="bg-grey-900/50 col-span-3">
            <CardHeader>
              <CardTitle className="mb-4">Canvas</CardTitle>
              <div className="h-[600px] bg-grey-800/30 rounded-lg border-2 border-dashed border-grey-700 flex items-center justify-center">
                <div className="text-center text-grey-400">
                  <div className="mb-4">🔧</div>
                  <div >Drag nodes here to build your workflow</div>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
      </ContentLayout>
    </AtlvsLayout>
  );
}
