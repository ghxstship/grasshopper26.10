'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, List, Calendar as CalendarIcon, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { useTasks } from '@/lib/hooks/atlvs/useTasks';

export default function TasksCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Fetch tasks from API
  const { data: tasksResponse, isLoading, isError, refetch } = useTasks() as any;

  // Group tasks by date
  const tasksByDate = useMemo(() => {
    if (!tasksResponse?.tasks) return {};
    
    const grouped: Record<string, any[]> = {};
    tasksResponse.tasks.forEach((task: any) => {
      if (!task.dueDate) return;
      
      const date = new Date(task.dueDate);
      const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(task);
    });
    
    return grouped;
  }, [tasksResponse]);

  // Get today's tasks
  const todaysTasks = useMemo(() => {
    const today = new Date();
    const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    return tasksByDate[todayKey] || [];
  }, [tasksByDate]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const { firstDay, daysInMonth } = getDaysInMonth(currentDate);

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getDateKey = (day: number) => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    return `${year}-${month}-${dayStr}`;
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-error';
      case 'high': return 'bg-warning-light0';
      case 'medium': return 'bg-warning';
      case 'low': return 'bg-info';
      default: return 'bg-gray-500';
    }
  };

  return (
    <AtlvsLayout>
      <ContentLayout
        title="TASKS CALENDAR"
        description="View and manage tasks in calendar format"
        variant="atlvs"
        breadcrumbs={[
          { label: 'Tasks', href: '/atlvs/tasks' },
          { label: 'Calendar' }
        ]}
      >
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={previousMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="text-h4 font-bebas">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </div>
            <Button variant="ghost" size="sm" onClick={nextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/atlvs/tasks/list">
              <Button variant="ghost" size="sm" className="text-gray-400">
                <List className="w-4 h-4 mr-2" />
                List View
              </Button>
            </Link>
            <Link href="/atlvs/tasks">
              <Button variant="ghost" size="sm" className="text-gray-400">
                <CalendarIcon className="w-4 h-4 mr-2" />
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

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-atlvs-green-500" />
          </div>
        )}

        {/* Error State */}
        {isError && (
          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
                <h3 className="text-h6 font-bebas mb-2">Failed to Load Tasks</h3>
                <p className="text-gray-400 mb-4">Unable to fetch calendar data</p>
                <Button variant="atlvs" onClick={() => refetch()}>Try Again</Button>
              </div>
            </CardHeader>
          </Card>
        )}

        {/* Calendar */}
        {!isLoading && !isError && (
        <Card variant="atlvs" className="bg-gray-900/50">
          <CardHeader>
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center font-oswald text-gray-400 text-body-sm py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Empty cells for days before month starts */}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}

              {/* Days of the month */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dateKey = getDateKey(day);
                const tasks = tasksByDate[dateKey] || [];
                const isTodayDate = isToday(day);

                return (
                  <motion.div
                    key={day}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.01 }}
                    className={`aspect-square p-2 rounded-lg border transition-colors cursor-pointer ${
                      isTodayDate
                        ? 'bg-atlvs-green-500/10 border-atlvs-green-500'
                        : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex flex-col h-full">
                      <div className={`text-body-sm mb-1 ${isTodayDate ? 'text-atlvs-green-500' : 'text-gray-300'}`}>
                        {day}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        {tasks.slice(0, 3).map((task: any) => (
                          <Link key={task.id} href={`/atlvs/tasks/${task.id}`}>
                            <div
                              className="mb-1 text-caption truncate bg-gray-900/50 rounded px-1 py-0.5 flex items-center gap-1 hover:bg-gray-900 transition-colors"
                            >
                              <div className={`w-1.5 h-1.5 rounded-full ${getPriorityColor(task.priority)}`} />
                              <span className="truncate">{task.title}</span>
                            </div>
                          </Link>
                        ))}
                        {tasks.length > 3 && (
                          <div className="text-caption text-gray-500">+{tasks.length - 3} more</div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardHeader>
        </Card>
        )}

        {/* Today's Tasks */}
        {!isLoading && !isError && todaysTasks.length > 0 && (
        <div className="mt-6">
          <h2 className="text-h4 font-bebas mb-4 atlvs-text-gradient">TODAY&apos;S TASKS</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {todaysTasks.map((task: any) => (
              <Link key={task.id} href={`/atlvs/tasks/${task.id}`}>
                <Card variant="atlvs" className="bg-gray-900/50 hover:bg-gray-900/70 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="atlvs-outline" className={`${getPriorityColor(task.priority)}/20 text-white`}>
                        {task.priority.toUpperCase()}
                      </Badge>
                      {task.dueDate && (
                        <span className="text-body-sm text-gray-400">
                          {new Date(task.dueDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                    <div className="font-medium">{task.title}</div>
                    {task.description && (
                      <p className="text-body-sm text-gray-400 mt-2 line-clamp-2">{task.description}</p>
                    )}
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>
        )}
      </ContentLayout>
    </AtlvsLayout>
  );
}
