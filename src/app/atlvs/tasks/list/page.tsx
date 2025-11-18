'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';

import { useState } from 'react';
import { List, Plus, Search, Filter, Calendar, User, Flag, Loader2 } from 'lucide-react';
import { useTasks } from '@/lib/hooks/atlvs/useTasks';
import Link from 'next/link';
import { Input } from '@/components/atoms/Input';
import { Card, CardHeader } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { DataTable, DataTableColumn } from '@/components/atlvs/DataTable';

interface Task extends Record<string, unknown> {
  id: string;
  title: string;
  project: string;
  assignee: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'backlog' | 'todo' | 'in-progress' | 'review' | 'done';
  dueDate: string;
}

// Mock tasks commented out - using real API data
/*
const mockTasks: Task[] = [
  {
    id: 'TSK-001',
    title: 'Design main stage layout',
    project: 'Summer Music Festival',
    assignee: 'Mike Chen',
    priority: 'high',
    status: 'in-progress',
    dueDate: '2024-06-15'
  },
  {
    id: 'TSK-002',
    title: 'Book catering vendors',
    project: 'Corporate Conference',
    assignee: 'Alex Kim',
    priority: 'medium',
    status: 'todo',
    dueDate: '2024-06-20'
  },
  {
    id: 'TSK-003',
    title: 'Finalize artist contracts',
    project: 'Arena Concert Series',
    assignee: 'Sarah Johnson',
    priority: 'urgent',
    status: 'review',
    dueDate: '2024-06-10'
  },
  {
    id: 'TSK-004',
    title: 'Set up ticketing system',
    project: 'Summer Music Festival',
    assignee: 'Jordan Lee',
    priority: 'high',
    status: 'in-progress',
    dueDate: '2024-06-18'
  },
  {
    id: 'TSK-005',
    title: 'Create marketing materials',
    project: 'Arena Concert Series',
    assignee: 'Taylor Rodriguez',
    priority: 'medium',
    status: 'done',
    dueDate: '2024-06-05'
  }
];
*/

export default function TasksListPage() {
  const { data: tasksData, isLoading, error, refetch } = useTasks() as any;
  const tasks = tasksData?.tasks || [];
  const [searchQuery, setSearchQuery] = useState('');
  const [_statusFilter, _setStatusFilter] = useState<string>('all');
  const [_priorityFilter, _setPriorityFilter] = useState<string>('all');

  if (isLoading) {
    return (
      <AtlvsLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-atlvs-green-500" />
        </div>
      </AtlvsLayout>
    );
  }

  if (error) {
    return (
      <AtlvsLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-error mb-4">Failed to load tasks</p>
            <Button variant="atlvs" onClick={() => refetch()}>Try Again</Button>
          </div>
        </div>
      </AtlvsLayout>
    );
  }

  const displayTasks = tasks;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-error-light text-error border-error-border';
      case 'high': return 'bg-atlvs-orange-500/20 text-atlvs-orange-500 border-atlvs-orange-500/50';
      case 'medium': return 'bg-warning-light text-warning border-warning-border';
      case 'low': return 'bg-info-light text-info border-info-border';
      default: return 'bg-gray-500/20 text-gray-500 border-gray-500/50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done': return 'bg-atlvs-green-500/20 text-atlvs-green-500 border-atlvs-green-500/50';
      case 'in-progress': return 'bg-info-light text-info border-info-border';
      case 'review': return 'bg-atlvs-purple-500/20 text-atlvs-purple-500 border-atlvs-purple-500/50';
      case 'todo': return 'bg-warning-light text-warning border-warning-border';
      case 'backlog': return 'bg-gray-500/20 text-gray-500 border-gray-500/50';
      default: return 'bg-gray-500/20 text-gray-500 border-gray-500/50';
    }
  };

  const columns: DataTableColumn<Task>[] = [
    {
      key: 'id',
      header: 'ID',
      sortable: true,
      width: '100px'
    },
    {
      key: 'title',
      header: 'Task',
      sortable: true,
      render: (value) => (
        <span className="font-medium text-white">{value as string}</span>
      )
    },
    {
      key: 'project',
      header: 'Project',
      sortable: true,
      filterable: true
    },
    {
      key: 'assignee',
      header: 'Assignee',
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-400" />
          <span>{value as string}</span>
        </div>
      )
    },
    {
      key: 'priority',
      header: 'Priority',
      sortable: true,
      render: (value, row) => (
        <Badge variant="atlvs-outline" className={getPriorityColor(row.priority)}>
          <Flag className="w-3 h-3 mr-1" />
          {(value as string).charAt(0).toUpperCase() + (value as string).slice(1)}
        </Badge>
      )
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      filterable: true,
      render: (value, row) => (
        <Badge variant="atlvs-outline" className={getStatusColor(row.status)}>
          {(value as string).split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
        </Badge>
      )
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>{new Date(value as string).toLocaleDateString()}</span>
        </div>
      )
    }
  ];

  return (
    <AtlvsLayout>
      <ContentLayout
        title="TASKS LIST VIEW"
        description="Manage all tasks in a detailed list format"
        variant="atlvs"
        breadcrumbs={[
          { label: 'Tasks', href: '/atlvs/tasks' },
          { label: 'List View' }
        ]}
      >
        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
              <Input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                variant="atlvs"
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-gray-400">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Link href="/atlvs/tasks">
              <Button variant="ghost" size="sm" className="text-gray-400">
                <List className="w-4 h-4 mr-2" />
                Kanban View
              </Button>
            </Link>
            <Link href="/atlvs/tasks/new">
              <Button variant="atlvs" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New Task
              </Button>
            </Link>
          </div>
        </div>

        {/* Data Table */}
        <Card variant="atlvs" className="bg-gray-900/50">
          <CardHeader>
            <DataTable
              data={displayTasks}
              columns={columns}
              searchable={false}
              exportable={true}
            />
          </CardHeader>
        </Card>
      </ContentLayout>
    </AtlvsLayout>
  );
}
