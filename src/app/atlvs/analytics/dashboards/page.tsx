'use client';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import { useState as _useState } from 'react';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { Plus, BarChart3, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle } from '@/components/atoms/Card';
import { useToast } from '@/lib/hooks/useToast';
import { useDashboards, useCreateDashboard } from '@/lib/hooks/atlvs/useDashboards';

export default function DashboardsPage() {
  const { addToast } = useToast();
  const { data: dashboards, isLoading, error, refetch } = useDashboards();
  const createDashboard = useCreateDashboard();
  
  const handleCreateDashboard = async () => {
    try {
      await createDashboard.mutateAsync({ name: 'New Dashboard', widgets: [] });
      addToast({
        title: 'Success',
        description: 'Dashboard created successfully',
        variant: 'success',
      });
    } catch {
      addToast({
        title: 'Error',
        description: 'Failed to create dashboard',
        variant: 'error',
      });
    }
  };
  
  const handleRetry = () => {
    refetch();
  };

  return (
    <AtlvsLayout>
      <ContentLayout
        title="DASHBOARDS"
        description="Custom analytics dashboards"
        variant="atlvs"
        breadcrumbs={[
          { label: 'Analytics', href: '/atlvs/analytics' },
          { label: 'Dashboards' }
        ]}
        primaryAction={{
          label: createDashboard.isPending ? 'Creating...' : 'Create Dashboard',
          onClick: handleCreateDashboard,
          icon: createDashboard.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />,
          variant: 'atlvs',
          disabled: createDashboard.isPending
        }}
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
                <h3 className="text-h6 font-bebas mb-2">Failed to Load Dashboards</h3>
                <p className="text-gray-400 mb-4">{error.message}</p>
                <Button variant="atlvs" onClick={handleRetry}>Try Again</Button>
              </div>
            </CardHeader>
          </Card>
        ) : !dashboards || dashboards.length === 0 ? (
          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <div className="text-center py-12">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-500 opacity-50" />
                <h3 className="text-h6 font-bebas mb-2">No Dashboards Yet</h3>
                <p className="text-gray-400 mb-4">Create your first dashboard to get started</p>
                <Button variant="atlvs" onClick={handleCreateDashboard} disabled={createDashboard.isPending}>
                  {createDashboard.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                  Create Dashboard
                </Button>
              </div>
            </CardHeader>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(dashboards || []).map((dashboard: any) => (
            <Card key={dashboard.id} variant="atlvs" className="bg-gray-900/50 cursor-pointer hover:bg-gray-900 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-atlvs-green-500 to-atlvs-purple-500 flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <CardTitle className="mb-2">{dashboard.name}</CardTitle>
                <div className="text-body-sm text-gray-400 mb-4">
                  {dashboard.widgets} widgets • Updated {dashboard.lastUpdated}
                </div>
                <Button variant="atlvs" size="sm" className="w-full">
                  View Dashboard
                </Button>
              </CardHeader>
            </Card>
          ))}
          </div>
        )}
      </ContentLayout>
    </AtlvsLayout>
  );
}
