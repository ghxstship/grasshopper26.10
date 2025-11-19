'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { useWorkflowLogs } from '@/lib/hooks/atlvs/useAutomation';
import { Loader2 } from 'lucide-react';
import { FileText, Download } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';

interface WorkflowLog {
  id: string;
  level: string;
  time: string;
  workflow: string;
  message: string;
}

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/atlvs/automation/logs

export default function WorkflowLogsPage() {
  const { data: logs = [] as WorkflowLog[], isLoading } = useWorkflowLogs(undefined);

  if (isLoading) {
    return (
      <AtlvsLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-12 h-12 animate-spin text-atlvs-green-500" />
        </div>
      </AtlvsLayout>
    );
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'bg-error-light text-error border-error-border';
      case 'warning': return 'bg-warning-light text-warning border-warning-border';
      case 'info': return 'bg-info-light text-info border-info-border';
      default: return 'bg-grey-500/20 text-grey-500 border-grey-500/50';
    }
  };

  return (
    <AtlvsLayout>
      <ContentLayout
        title="WORKFLOW LOGS"
        description="Execution logs and debugging"
        variant="atlvs"
        breadcrumbs={[
          { label: 'Automation', href: '/atlvs/automation' },
          { label: 'Logs' }
        ]}
        actions={[
          {
            label: 'Export Logs',
            onClick: () => {},
            icon: <Download className="w-4 h-4" />,
            variant: 'atlvs' as const
          }
        ]}
      >

        <Card variant="atlvs" className="bg-grey-900/50">
          <CardHeader>
            <CardTitle className="mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Recent Logs
            </CardTitle>
            <div className="space-y-3" role="list" aria-label="Workflow logs">
              {logs.map((log: WorkflowLog) => (
                <div key={log.id} className="flex items-start gap-4 p-4 bg-grey-800/50 rounded-lg font-mono text-body-sm" role="listitem">
                  <Badge variant="atlvs-outline" className={getLevelColor(log.level)} role="status" aria-label={`Log level: ${log.level}`}>
                    {log.level.toUpperCase()}
                  </Badge>
                  <div className="flex-1">
                    <div className="text-grey-400 mb-1">{log.time}</div>
                    <div className="text-white mb-1">[{log.workflow}]</div>
                    <div className="text-grey-300">{log.message}</div>
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
