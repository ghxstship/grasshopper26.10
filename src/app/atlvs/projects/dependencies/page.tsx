'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { GitBranch, AlertTriangle, CheckCircle, Clock, Loader2 } from 'lucide-react';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { Button } from '@/components/atoms/Button';
import { useProjects } from '@/lib/hooks/atlvs/useProjects';

interface Dependency {
  id: string;
  from: string;
  to: string;
  type: string;
  status: string;
  taskName: string;
  dependsOn: string;
  lag: number;
}

export default function ProjectDependenciesPage() {
  const { isLoading, error, refetch } = useProjects({});
  const dependencies: Dependency[] = [];

  if (isLoading) {
    return (
      <AtlvsLayout>
        <ContentLayout
          title="PROJECT DEPENDENCIES"
          description="Loading dependencies..."
          variant="atlvs"
          breadcrumbs={[
            { label: 'Projects', href: '/atlvs/projects' },
            { label: 'Dependencies' }
          ]}
        >
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-atlvs-green-500" />
              <p className="text-gray-400">Loading project dependencies...</p>
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
          title="PROJECT DEPENDENCIES"
          description="Error loading dependencies"
          variant="atlvs"
          breadcrumbs={[
            { label: 'Projects', href: '/atlvs/projects' },
            { label: 'Dependencies' }
          ]}
        >
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-error" />
              <h2 className="text-h5 font-bebas mb-2">Failed to Load Dependencies</h2>
              <p className="text-gray-400 mb-4">{error.message}</p>
              <Button variant="atlvs" onClick={() => refetch()}>Try Again</Button>
            </div>
          </div>
        </ContentLayout>
      </AtlvsLayout>
    );
  }

  const _mockDependencies = [
    {
      id: '1',
      taskName: 'Stage Construction',
      dependsOn: 'Venue Permits Approved',
      type: 'finish-to-start',
      status: 'ready',
      lag: 0
    },
    {
      id: '2',
      taskName: 'Sound System Installation',
      dependsOn: 'Stage Construction',
      type: 'finish-to-start',
      status: 'blocked',
      lag: 2
    },
    {
      id: '3',
      taskName: 'Lighting Setup',
      dependsOn: 'Stage Construction',
      type: 'finish-to-start',
      status: 'blocked',
      lag: 1
    },
    {
      id: '4',
      taskName: 'Artist Sound Check',
      dependsOn: 'Sound System Installation',
      type: 'finish-to-start',
      status: 'blocked',
      lag: 0
    }
  ];

  const getStatusColor = (status: Dependency['status']) => {
    switch (status) {
      case 'completed': return 'text-success bg-success-light';
      case 'ready': return 'text-info bg-info-light';
      case 'blocked': return 'text-error bg-destructive/20';
    }
  };

  const getStatusIcon = (status: Dependency['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5" />;
      case 'ready': return <Clock className="w-5 h-5" />;
      case 'blocked': return <AlertTriangle className="w-5 h-5" />;
    }
  };

  return (
    <AtlvsLayout>
      <ContentLayout
        title="PROJECT DEPENDENCIES"
        description="View and manage task dependencies"
        variant="atlvs"
        breadcrumbs={[
          { label: 'Projects', href: '/atlvs/projects' },
          { label: 'Dependencies', href: '/atlvs/projects/dependencies' }
        ]}
      >
        <div className="p-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-h3 text-gray-900 mb-2">Task Dependencies</h1>
            <p className="text-gray-600">Manage task relationships and execution order</p>
          </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-body-sm text-gray-600 mb-1">Total Dependencies</div>
              <div className="text-h4 text-gray-900">{dependencies.length}</div>
            </div>
            <GitBranch className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-body-sm text-gray-600 mb-1">Blocked Tasks</div>
              <div className="text-h4 text-error">
                {dependencies.filter(d => d.status === 'blocked').length}
              </div>
            </div>
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-body-sm text-gray-600 mb-1">Ready to Start</div>
              <div className="text-h4 text-info">
                {dependencies.filter(d => d.status === 'ready').length}
              </div>
            </div>
            <CheckCircle className="w-8 h-8 text-info" />
          </div>
        </div>
      </div>

      {/* Dependencies List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-h6 text-gray-900">Dependency Chain</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {dependencies.map(dep => (
            <div key={dep.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg ${getStatusColor(dep.status)}`}>
                  {getStatusIcon(dep.status)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900">{dep.taskName}</h3>
                    <span className={`px-2 py-1 rounded text-caption ${getStatusColor(dep.status)}`}>
                      {dep.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-body-sm text-gray-600">
                    <span>Depends on:</span>
                    <span className="font-medium text-gray-900">{dep.dependsOn}</span>
                    <span className="text-gray-400">•</span>
                    <span className="capitalize">{dep.type.replace(/-/g, ' ')}</span>
                    {dep.lag > 0 && (
                      <>
                        <span className="text-gray-400">•</span>
                        <span>{dep.lag} day lag</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dependency Types Legend */}
      <div className="mt-6 bg-info-light rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Dependency Types</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-body-sm">
          <div>
            <div className="font-medium text-gray-900 mb-1">Finish-to-Start</div>
            <div className="text-gray-600">Task B starts when Task A finishes</div>
          </div>
          <div>
            <div className="font-medium text-gray-900 mb-1">Start-to-Start</div>
            <div className="text-gray-600">Task B starts when Task A starts</div>
          </div>
          <div>
            <div className="font-medium text-gray-900 mb-1">Finish-to-Finish</div>
            <div className="text-gray-600">Task B finishes when Task A finishes</div>
          </div>
        </div>
      </div>
    </div>
      </ContentLayout>
    </AtlvsLayout>
  );
}
