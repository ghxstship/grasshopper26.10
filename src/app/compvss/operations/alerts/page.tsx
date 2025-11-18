'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { CompvssLayout } from '@/components/templates/CompvssLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { motion } from 'framer-motion';
import { AlertTriangle, Bell, CheckCircle2, Loader2, AlertCircle as AlertCircleIcon } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { useAlerts, Alert } from '@/lib/hooks/compvss/useAlerts';

export default function OperationsAlertsPage() {
  const { data, isLoading, error, refetch } = useAlerts({ status: 'active' });
  const alerts = data?.alerts || [];

  if (isLoading) {
    return (
      <CompvssLayout>
        <ContentLayout
          title="Operations Alerts"
          description="Monitor and manage system alerts"
          variant="compvss"
          showToolbar={false}
          breadcrumbs={[
            { label: 'Operations', href: '/compvss/operations/hub' },
            { label: 'Alerts' }
          ]}
        >
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-compvss-cyan-500" />
              <p className="text-gray-400">Loading alerts...</p>
            </div>
          </div>
        </ContentLayout>
      </CompvssLayout>
    );
  }

  if (error) {
    return (
      <CompvssLayout>
        <ContentLayout
          title="Operations Alerts"
          description="Monitor and manage system alerts"
          variant="compvss"
          showToolbar={false}
          breadcrumbs={[
            { label: 'Operations', href: '/compvss/operations/hub' },
            { label: 'Alerts' }
          ]}
        >
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertCircleIcon className="w-12 h-12 mx-auto mb-4 text-error" />
              <h2 className="text-xl font-bebas mb-2">Failed to Load Alerts</h2>
              <p className="text-gray-400 mb-4">{error.message || 'An error occurred'}</p>
              <Button variant="compvss" onClick={() => refetch()}>
                Try Again
              </Button>
            </div>
          </div>
        </ContentLayout>
      </CompvssLayout>
    );
  }

  return (
    <CompvssLayout>
      <ContentLayout
        title="Operations Alerts"
        description="Monitor and manage system alerts"
        variant="compvss"
        showToolbar={false}
        breadcrumbs={[
          { label: 'Operations', href: '/compvss/operations/hub' },
          { label: 'Alerts' }
        ]}
      >
        <Card variant="compvss" className="bg-gray-900/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-compvss-cyan-500" />
              Active Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert: Alert, index: number) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-lg bg-black/50 border border-compvss-cyan-500/20"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1">
                      <AlertTriangle className={`w-5 h-5 flex-shrink-0 ${alert.severity === 'warning' ? 'text-warning' : 'text-info'}`} />
                      <div>
                        <h3 className="font-oswald text-white mb-1">{alert.title}</h3>
                        <p className="text-sm text-gray-400 font-share-tech">{alert.time}</p>
                      </div>
                    </div>
                    <Badge 
                      variant="compvss" 
                      className={alert.severity === 'warning' ? 'bg-warning-light text-warning' : 'bg-info-light text-info'}
                    >
                      {alert.severity}
                    </Badge>
                  </div>
                  {alert.status === 'active' && (
                    <Button variant="compvss-outline" size="sm" className="w-full">
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Acknowledge
                    </Button>
                  )}
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </ContentLayout>
    </CompvssLayout>
  );
}
