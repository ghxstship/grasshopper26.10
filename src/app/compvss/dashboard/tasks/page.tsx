'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { CompvssLayout } from '@/components/templates/CompvssLayout';
import { useCompvssTasks } from '@/lib/hooks/compvss/useOperations';
import { Loader2 } from 'lucide-react';

import { motion } from 'framer-motion';
import { CheckSquare, Plus, Filter, Calendar } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { BodyText, HeroTitle } from "@/components/atoms/Typography";

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/compvss/dashboard/tasks

export default function TasksDashboardPage() {
  const { data: tasksData, isLoading } = useCompvssTasks();
  const _tasks = tasksData?.tasks || [];

  if (isLoading) {
    return (
      <CompvssLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-12 h-12 animate-spin text-compvss-purple-500" />
        </div>
      </CompvssLayout>
    );
  }

  const _breadcrumbs = [
    { label: 'Dashboard', href: '/compvss/dashboard' },
    { label: 'Tasks', href: '/compvss/dashboard/tasks' },
  ];

  return (
    <CompvssLayout>
      <TasksContent />
    </CompvssLayout>
  );
}

function TasksContent() {
  const stats = [
    { label: 'My Tasks', value: '12' },
    { label: 'In Progress', value: '5' },
    { label: 'Completed Today', value: '8' },
    { label: 'Overdue', value: '2' },
  ];

  const _tasks = [
    {
      id: 1,
      title: 'Setup main stage lighting',
      project: 'Summer Music Festival',
      priority: 'high',
      status: 'in_progress',
      dueDate: 'Today, 5:00 PM',
      assignee: 'You',
    },
    {
      id: 2,
      title: 'Test audio system',
      project: 'Summer Music Festival',
      priority: 'high',
      status: 'in_progress',
      dueDate: 'Today, 6:00 PM',
      assignee: 'You',
    },
    {
      id: 3,
      title: 'Prepare backstage area',
      project: 'Summer Music Festival',
      priority: 'medium',
      status: 'todo',
      dueDate: 'Tomorrow, 2:00 PM',
      assignee: 'You',
    },
    {
      id: 4,
      title: 'Final sound check',
      project: 'Summer Music Festival',
      priority: 'critical',
      status: 'overdue',
      dueDate: 'Yesterday, 4:00 PM',
      assignee: 'You',
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-error-light text-error border-destructive/30';
      case 'high':
        return 'bg-warning-light0/20 text-atlvs-orange-500 border-warning/30';
      case 'medium':
        return 'bg-warning-light text-warning border-warning/30';
      case 'low':
        return 'bg-success-light text-success border-success/30';
      default:
        return 'bg-grey-500/20 text-grey-500 border-grey-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success-light text-success border-success/30';
      case 'in_progress':
        return 'bg-info-light text-info border-info/30';
      case 'overdue':
        return 'bg-error-light text-error border-destructive/30';
      default:
        return 'bg-grey-500/20 text-grey-500 border-grey-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-grey-800 bg-gradient-to-r from-black via-grey-950 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <HeroTitle className="compvss-text-gradient">My Tasks</HeroTitle>
              <BodyText className="text-grey-400 mt-1">Manage your assigned _tasks</BodyText>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="compvss-ghost" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Link href="/compvss/operations/_tasks/new">
                <Button variant="compvss" size="lg">
                  <Plus className="w-5 h-5 mr-2" />
                  New Task
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card variant="compvss" className="bg-grey-900/50">
                <CardContent className="pt-6 text-center">
                  <div className="text-white mb-1">{stat.value}</div>
                  <div className="text-body-sm text-grey-400">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Tasks List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card variant="compvss" className="bg-grey-900/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-compvss-cyan-500" />
                Active Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {_tasks.map((task: any, index: number) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <Link href={`/compvss/operations/_tasks/${task.id}`}>
                      <div className="p-4 rounded-lg bg-black/50 border border-compvss-cyan-500/20 hover:border-compvss-cyan-500/40 transition-all cursor-pointer">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="compvss-outline" className={getPriorityColor(task.priority)}>
                                {task.priority}
                              </Badge>
                              <Badge variant="compvss-outline" className={getStatusColor(task.status)}>
                                {task.status.replace('_', ' ')}
                              </Badge>
                            </div>
                            <h3 className="text-white mb-1">{task.title}</h3>
                            <p className="text-body-sm text-grey-400 -tech mb-2">
                              {task.project}
                            </p>
                            <div className="flex items-center gap-4 text-caption text-grey-500 -tech">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {task.dueDate}
                              </span>
                              <span>Assigned to: {task.assignee}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
