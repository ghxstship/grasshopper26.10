'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { useWorkflows } from '@/lib/hooks/atlvs/useAutomation';
import { Loader2 } from 'lucide-react';
import { Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/atlvs/automation/monitoring

export default function AutomationMonitoringPage() {
  const { data: _workflowsData, isLoading } = useWorkflows();
  
  if (isLoading) {
    return (
      <AtlvsLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-12 h-12 animate-spin text-atlvs-green-500" />
        </div>
      </AtlvsLayout>
    );
  }

  const alerts = [
    { id: '1', workflow: 'Budget Alert', type: 'warning', message: 'High execution time detected', time: '5 mins ago' },
    { id: '2', workflow: 'Task Assignment', type: 'error', message: 'Failed to connect to API', time: '15 mins ago' },
    { id: '3', workflow: 'Document Approval', type: 'info', message: 'Workflow completed successfully', time: '1 hour ago' }
  ];

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'error': return 'bg-error-light text-error border-error-border';
      case 'warning': return 'bg-warning-light text-warning border-warning-border';
      case 'info': return 'bg-info-light text-info border-info-border';
      default: return 'bg-grey-500/20 text-grey-500 border-grey-500/50';
    }
  };

  return (
    <AtlvsLayout>
      <ContentLayout
        title="WORKFLOW MONITORING"
        description="Real-time workflow health and alerts"
        variant="atlvs"
        breadcrumbs={[
          { label: 'Automation', href: '/atlvs/automation' },
          { label: 'Monitoring' }
        ]}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6" role="region" aria-label="Monitoring statistics">
          <Card variant="atlvs" className="bg-grey-900/50">
            <CardHeader>
              <div className="text-body-sm text-grey-400 mb-1">Active Workflows</div>
              <div className="atlvs-text-gradient">12</div>
            </CardHeader>
          </Card>
          <Card variant="atlvs" className="bg-grey-900/50">
            <CardHeader>
              <div className="text-body-sm text-grey-400 mb-1">Healthy</div>
              <div className="text-atlvs-green-500" aria-label="10 healthy _workflows">10</div>
            </CardHeader>
          </Card>
          <Card variant="atlvs" className="bg-grey-900/50">
            <CardHeader>
              <div className="text-body-sm text-grey-400 mb-1">Warnings</div>
              <div className="text-warning" aria-label="1 warning">1</div>
            </CardHeader>
          </Card>
          <Card variant="atlvs" className="bg-grey-900/50">
            <CardHeader>
              <div className="text-body-sm text-grey-400 mb-1">Errors</div>
              <div className="text-error" aria-label="1 error">1</div>
            </CardHeader>
          </Card>
        </div>

        <Card variant="atlvs" className="bg-grey-900/50">
          <CardHeader>
            <CardTitle className="mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5" aria-hidden="true" />
              Recent Alerts
            </CardTitle>
            <div className="space-y-3" role="list" aria-label="Recent monitoring alerts">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-4 bg-grey-800/50 rounded-lg" role="listitem">
                  <div className="flex items-center gap-4 flex-1">
                    {alert.type === 'error' && <AlertTriangle className="w-5 h-5 text-error" />}
                    {alert.type === 'warning' && <AlertTriangle className="w-5 h-5 text-warning" />}
                    {alert.type === 'info' && <CheckCircle className="w-5 h-5 text-info" />}
                    <div className="flex-1">
                      <div className="font-medium mb-1">{alert.workflow}</div>
                      <div className="text-body-sm text-grey-400">{alert.message}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-body-sm text-grey-400">{alert.time}</span>
                    <Badge variant="atlvs-outline" className={getAlertColor(alert.type)}>
                      {alert.type}
                    </Badge>
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
