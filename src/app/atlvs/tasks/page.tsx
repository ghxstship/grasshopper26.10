'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { useState, useMemo } from 'react';
import { Plus, Filter, Grid, List, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/atoms/Card';
import { KanbanBoard, KanbanColumn } from '@/components/atlvs/KanbanBoard';
import { useTasks } from '@/lib/hooks/atlvs/useTasks';

export default function TasksPage() {
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const { data: tasks, isLoading, error, refetch } = useTasks();
  
  const columns: KanbanColumn[] = useMemo(() => {
    if (!tasks) return [];
    
    return [
      {
        id: 'backlog',
        title: 'Backlog',
        color: 'bg-gray-500',
        tasks: tasks.filter((t: any) => t.status === 'backlog').map((t: any) => ({
          id: t.id,
          title: t.title,
          description: t.description || '',
          assignee: t.assignedTo?.name || 'Unassigned',
          dueDate: t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '',
          priority: t.priority || 'medium',
          tags: t.tags || []
        }))
      },
      {
        id: 'todo',
        title: 'To Do',
        color: 'bg-info',
        tasks: tasks.filter((t: any) => t.status === 'todo').map((t: any) => ({
          id: t.id,
          title: t.title,
          description: t.description || '',
          assignee: t.assignedTo?.name || 'Unassigned',
          dueDate: t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '',
          priority: t.priority || 'medium',
          tags: t.tags || []
        }))
      },
      {
        id: 'in-progress',
        title: 'In Progress',
        color: 'bg-warning',
        tasks: tasks.filter((t: any) => t.status === 'in-progress').map((t: any) => ({
          id: t.id,
          title: t.title,
          description: t.description || '',
          assignee: t.assignedTo?.name || 'Unassigned',
          dueDate: t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '',
          priority: t.priority || 'medium',
          tags: t.tags || []
        }))
      },
      {
        id: 'done',
        title: 'Done',
        color: 'bg-atlvs-green-500',
        tasks: tasks.filter((t: any) => t.status === 'done').map((t: any) => ({
          id: t.id,
          title: t.title,
          description: t.description || '',
          assignee: t.assignedTo?.name || 'Unassigned',
          dueDate: t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '',
          priority: t.priority || 'medium',
          tags: t.tags || []
        }))
      }
    ];
  }, [tasks]);
  
  if (isLoading) {
    return (
      <AtlvsLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-atlvs-green-500" />
            <p className="text-gray-400">Loading tasks...</p>
          </div>
        </div>
      </AtlvsLayout>
    );
  }
  
  if (error) {
    return (
      <AtlvsLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
            <h2 className="text-xl font-bebas mb-2">Failed to Load Tasks</h2>
            <p className="text-gray-400 mb-4">{error.message}</p>
            <Button variant="atlvs" onClick={() => refetch()}>
              Try Again
            </Button>
          </div>
        </div>
      </AtlvsLayout>
    );
  }

  return (
    <AtlvsLayout>
      <ContentLayout
        title="TASKS"
        description="Manage and track all project tasks"
        variant="atlvs"
        showToolbar={false}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8" role="region" aria-label="Task statistics">
          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <CardDescription className="text-gray-400 mb-1">
                Total Tasks
              </CardDescription>
              <CardTitle className="text-3xl font-bebas" aria-label={`${tasks?.length || 0} total tasks`}>
                {tasks?.length || 0}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <div className="flex items-center justify-between mb-6" role="toolbar" aria-label="Task management controls">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-gray-400" aria-label="Open filter options">
              <Filter className="w-4 h-4 mr-2" aria-hidden="true" />
              Filter
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 p-1 bg-gray-900 rounded-lg" role="group" aria-label="View mode selection">
              <Button
                onClick={() => setViewMode('kanban')}
                variant={viewMode === 'kanban' ? 'atlvs' : 'ghost'}
                size="sm"
                className="p-2"
                aria-pressed={viewMode === 'kanban'}
                aria-label="Kanban board view"
              >
                <Grid className="w-4 h-4" aria-hidden="true" />
              </Button>
              <Button
                onClick={() => setViewMode('list')}
                variant={viewMode === 'list' ? 'atlvs' : 'ghost'}
                size="sm"
                className="p-2"
                aria-pressed={viewMode === 'list'}
                aria-label="List view"
              >
                <List className="w-4 h-4" aria-hidden="true" />
              </Button>
            </div>
            <Link href="/atlvs/tasks/new">
              <Button variant="atlvs" size="sm" aria-label="Create new task">
                <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
                New Task
              </Button>
            </Link>
          </div>
        </div>

        {viewMode === 'kanban' && (
          <KanbanBoard columns={columns} />
        )}

        {viewMode === 'list' && (
          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <CardTitle>List view coming soon...</CardTitle>
            </CardHeader>
          </Card>
        )}
      </ContentLayout>
    </AtlvsLayout>
  );
}
