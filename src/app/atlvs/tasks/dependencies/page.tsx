'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GitBranch, Trash2, AlertCircle, Loader2 } from 'lucide-react';
import { useTaskDependencies } from '@/lib/hooks/atlvs/useTasks';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Alert } from '@/components/molecules/Alert';

interface _TaskDependency {
  id: string;
  taskId: string;
  taskName: string;
  dependsOnId: string;
  dependsOnName: string;
  type: 'finish-to-start' | 'start-to-start';
  lag: number;
}

export default function TaskDependenciesPage() {
  const router = useRouter();
  const [_searchQuery, _setSearchQuery] = useState('');
  const { data: dependencies = [], isLoading, error, refetch } = useTaskDependencies();

  if (isLoading) {
    return (
      <AtlvsLayout>
        <ContentLayout
          title="TASK DEPENDENCIES"
          description="Loading dependencies..."
          variant="atlvs"
          showToolbar={false}
        >
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-atlvs-green-500" />
              <p className="text-gray-400">Loading task dependencies...</p>
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
          title="TASK DEPENDENCIES"
          description="Error loading dependencies"
          variant="atlvs"
          showToolbar={false}
        >
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
              <h2 className="text-xl font-bebas mb-2">Failed to Load Dependencies</h2>
              <p className="text-gray-400 mb-4">{error.message}</p>
              <Button variant="atlvs" onClick={() => refetch()}>
                Try Again
              </Button>
            </div>
          </div>
        </ContentLayout>
      </AtlvsLayout>
    );
  }

  return (
    <AtlvsLayout>
      <ContentLayout
        title="TASK DEPENDENCIES"
        description="Define task relationships and execution order"
        variant="atlvs"
        breadcrumbs={[
          { label: 'Tasks', href: '/atlvs/tasks' },
          { label: 'Dependencies' }
        ]}
        actions={[
          {
            label: 'Add Dependency',
            onClick: () => router.push('/atlvs/tasks/dependencies/add'),
            variant: 'atlvs' as const
          }
        ]}
      >
        <Card variant="atlvs" className="bg-gray-900/50">
          <CardHeader>
            <CardTitle className="mb-6">Dependency Chain</CardTitle>

            <div className="space-y-2">
              {dependencies.map(dep => (
                <div key={dep.id} className="p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors">
                  <div className="flex items-start gap-4">
                    <GitBranch className="w-5 h-5 text-gray-400 mt-1" />
                    <div className="flex-1">
                      <div className="font-semibold mb-1">{dep.taskName}</div>
                      <div className="text-sm text-gray-400">
                        Depends on: <span className="font-medium">{dep.dependsOnName}</span>
                        <span className="mx-2">•</span>
                        <span className="capitalize">{dep.type.replace(/-/g, ' ')}</span>
                        {dep.lag > 0 && (
                          <>
                            <span className="mx-2">•</span>
                            <span>{dep.lag} day lag</span>
                          </>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-error">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardHeader>
        </Card>

        <Alert variant="warning" className="mt-6">
          <AlertCircle className="w-5 h-5" />
          <div>
            <strong>Note:</strong> Circular dependencies are not allowed. Ensure your task chain flows in one direction.
          </div>
        </Alert>
      </ContentLayout>
    </AtlvsLayout>
  );
}
