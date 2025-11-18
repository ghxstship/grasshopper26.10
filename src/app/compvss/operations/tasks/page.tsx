'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { CompvssLayout } from '@/components/templates/CompvssLayout';

import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { AlertCircle, Clock, Flag, Loader2, Plus, User } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { useCompvssTasks, CompvssTask } from '@/lib/hooks/compvss/useTasks';

export default function TaskManagementPage() {
  const breadcrumbs = [
    { label: 'Dashboard', href: '/compvss/dashboard' },
    { label: 'Operations', href: '/compvss/operations/hub' },
    { label: 'Tasks', href: '/compvss/operations/tasks' },
  ];

  const [showAddTask, setShowAddTask] = useState(false);
  
  const { data: tasksData, isLoading, error, refetch } = useCompvssTasks();

  const tasksByStatus = useMemo(() => {
    const tasks = tasksData?.tasks || [];
    const pending = tasks.filter((t: CompvssTask) => t.status === 'pending');
    const inProgress = tasks.filter((t: CompvssTask) => t.status === 'in_progress');
    const completed = tasks.filter((t: CompvssTask) => t.status === 'completed');
    
    return {
      todo: pending,
      'in-progress': inProgress,
      completed: completed,
    };
  }, [tasksData]);

  if (isLoading) {
    return (
      <CompvssLayout breadcrumbs={breadcrumbs}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-compvss-cyan-500" />
            <p className="text-gray-400">Loading tasks...</p>
          </div>
        </div>
      </CompvssLayout>
    );
  }

  if (error) {
    return (
      <CompvssLayout breadcrumbs={breadcrumbs}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
            <h2 className="text-xl font-bebas mb-2">Failed to Load Tasks</h2>
            <p className="text-gray-400 mb-4">{error.message || 'An error occurred'}</p>
            <Button variant="compvss" onClick={() => refetch()}>
              Try Again
            </Button>
          </div>
        </div>
      </CompvssLayout>
    );
  }

  const getPriorityColor = (priority: CompvssTask['priority']) => {
    const colors = {
      low: 'text-gray-500',
      medium: 'text-warning',
      high: 'text-atlvs-orange-500',
      urgent: 'text-error',
    };
    return colors[priority];
  };

  const getStatusBadge = (status: CompvssTask['status']) => {
    const config = {
      'pending': { variant: 'default' as const, label: 'To Do' },
      'in-progress': { variant: 'warning' as const, label: 'In Progress' },
      'completed': { variant: 'success' as const, label: 'Completed' },
      'cancelled': { variant: 'default' as const, label: 'Cancelled' },
    };
    return <Badge variant={config[status].variant}>{config[status].label}</Badge>;
  };

  return (
    <CompvssLayout breadcrumbs={breadcrumbs}>
      <div className="min-h-screen bg-black text-white px-4 sm:px-6 lg:px-8 py-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,255,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-8">
              <div>
                <Link href="/compvss/operations/dashboard">
                  <h1 className="compvss-text-gradient text-4xl font-anton mb-2 cursor-pointer">
                    Task Management
                  </h1>
                </Link>
                <p className="text-gray-400 font-oswald">
                  Day-of-show task coordination
                </p>
              </div>
              <Button variant="compvss" onClick={() => setShowAddTask(!showAddTask)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </div>

            {/* Task Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <Card variant="compvss" className="bg-gray-900/80 border-compvss-cyan-500/20">
                <CardContent className="pt-6 text-center">
                  <p className="text-3xl font-bebas text-gray-400">{tasksByStatus.todo.length}</p>
                  <p className="text-sm text-gray-500 font-oswald">To Do</p>
                </CardContent>
              </Card>
              <Card variant="compvss" className="bg-warning/10 border-yellow-500/30">
                <CardContent className="pt-6 text-center">
                  <p className="text-3xl font-bebas text-warning">{tasksByStatus['in-progress'].length}</p>
                  <p className="text-sm text-gray-400 font-oswald">In Progress</p>
                </CardContent>
              </Card>
              <Card variant="compvss" className="bg-green-500/10 border-green-500/30">
                <CardContent className="pt-6 text-center">
                  <p className="text-3xl font-bebas text-success">{tasksByStatus.completed.length}</p>
                  <p className="text-sm text-gray-400 font-oswald">Completed</p>
                </CardContent>
              </Card>
            </div>

            {/* Kanban Board */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
                <div key={status}>
                  <Card variant="compvss" className="bg-gray-900/80 backdrop-blur-sm border-2 border-compvss-cyan-500/20 mb-3">
                    <CardHeader>
                      <CardTitle className="text-white capitalize flex items-center justify-between">
                        <span>{status.replace('-', ' ')}</span>
                        <Badge variant="default">{statusTasks.length}</Badge>
                      </CardTitle>
                    </CardHeader>
                  </Card>

                  <div className="space-y-3">
                    {statusTasks.map((task: CompvssTask) => (
                      <Card key={task.id} variant="compvss" className="bg-gray-900/80 backdrop-blur-sm border-2 border-compvss-cyan-500/20 hover:border-compvss-cyan-500/40 transition-all cursor-pointer">
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-oswald text-white text-sm">{task.title}</h3>
                            <Flag className={`w-4 h-4 ${getPriorityColor(task.priority)}`} />
                          </div>
                          <p className="text-xs text-gray-400 font-share-tech mb-3">
                            {task.description || 'No description'}
                          </p>
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1 text-gray-500 font-share-tech">
                              <User className="w-3 h-3" />
                              <span>{task.assignee || 'Unassigned'}</span>
                            </div>
                            {task.dueDate && (
                              <div className="flex items-center gap-1 text-gray-500 font-share-tech">
                                <Clock className="w-3 h-3" />
                                <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <Badge variant="default" className="text-xs">{task.category}</Badge>
                            {getStatusBadge(task.status)}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </CompvssLayout>
  );
}
