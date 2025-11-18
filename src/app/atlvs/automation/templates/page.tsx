'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { useWorkflows } from '@/lib/hooks/atlvs/useAutomation';
import { Loader2 } from 'lucide-react';
import { Zap, Copy } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  usageCount: number;
  uses: number;
}

export default function WorkflowTemplatesPage() {
  const { data: templates = [], isLoading } = useWorkflows({ type: 'template' });

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
        title="WORKFLOW TEMPLATES"
        description="Pre-built automation workflows"
        variant="atlvs"
        breadcrumbs={[
          { label: 'Automation', href: '/atlvs/automation' },
          { label: 'Templates' }
        ]}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {templates.map((template: WorkflowTemplate) => (
            <Card key={template.id} variant="atlvs" className="bg-gray-900/50">
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-atlvs-green-500 to-atlvs-purple-500 flex items-center justify-center">
                    <Zap className="w-6 h-6" />
                  </div>
                  <Badge variant="atlvs-outline" className="bg-gray-700/50">
                    {template.uses} uses
                  </Badge>
                </div>
                <CardTitle className="mb-2">{template.name}</CardTitle>
                <p className="text-body-sm text-gray-400 mb-4">{template.description}</p>
                <div className="flex items-center gap-2">
                  <Button variant="atlvs" size="sm" className="flex-1">
                    <Copy className="w-4 h-4 mr-2" />
                    Use Template
                  </Button>
                  <Button variant="ghost" size="sm">Preview</Button>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </ContentLayout>
    </AtlvsLayout>
  );
}
