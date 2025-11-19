'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { SubsectionHeader } from "@/components/atoms/Typography";

export interface GanttTask {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  progress: number;
  assignee?: string;
  dependencies?: string[];
  subtasks?: GanttTask[];
  expanded?: boolean;
}

interface GanttChartProps {
  tasks: GanttTask[];
  startDate: Date;
  endDate: Date;
  onTaskClick?: (task: GanttTask) => void;
}

export function GanttChart({ tasks, startDate, endDate, onTaskClick }: GanttChartProps) {
  const timelineMonths = useMemo(() => {
    const months: Date[] = [];
    const current = new Date(startDate);
    while (current <= endDate) {
      months.push(new Date(current));
      current.setMonth(current.getMonth() + 1);
    }
    return months;
  }, [startDate, endDate]);

  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  const getTaskPosition = (task: GanttTask) => {
    const taskStart = Math.max(task.startDate.getTime(), startDate.getTime());
    const taskEnd = Math.min(task.endDate.getTime(), endDate.getTime());
    
    const left = ((taskStart - startDate.getTime()) / (1000 * 60 * 60 * 24) / totalDays) * 100;
    const width = ((taskEnd - taskStart) / (1000 * 60 * 60 * 24) / totalDays) * 100;
    
    return { left: `${left}%`, width: `${width}%` };
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'bg-success';
    if (progress >= 75) return 'bg-info';
    if (progress >= 50) return 'bg-warning';
    if (progress >= 25) return 'bg-atlvs-orange-500';
    return 'bg-error';
  };

  const renderTask = (task: GanttTask, level: number = 0) => {
    const position = getTaskPosition(task);
    const hasSubtasks = task.subtasks && task.subtasks.length > 0;

    return (
      <div key={task.id}>
        {/* Task Row */}
        <div className="flex border-b border-grey-800 hover:bg-grey-900/50 transition-colors">
          {/* Task Info Column */}
          <div className="w-80 flex-shrink-0 p-4 border-r border-grey-800">
            <div 
              className="flex items-center gap-2"
              style={{ paddingLeft: `${level * 20}px` }}
            >
              {hasSubtasks && (
                <Button variant="ghost" size="sm" className="h-auto p-0">
                  {task.expanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </Button>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-body-sm text-white truncate">
                  {task.name}
                </div>
                {task.assignee && (
                  <div className="text-caption text-grey-400 mt-1">
                    {task.assignee}
                  </div>
                )}
              </div>
              <Badge variant="atlvs-outline" className="text-caption">
                {task.progress}%
              </Badge>
            </div>
          </div>

          {/* Timeline Column */}
          <div className="flex-1 relative p-4">
            <motion.div
              className="relative h-8 rounded-lg overflow-hidden bg-grey-800/50 cursor-pointer"
              style={position}
              onClick={() => onTaskClick?.(task)}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              {/* Progress Bar */}
              <div
                className={`absolute inset-0 ${getProgressColor(task.progress)} opacity-80`}
                style={{ width: `${task.progress}%` }}
              />
              
              {/* Task Label */}
              <div className="absolute inset-0 flex items-center px-3">
                <span className="text-caption text-white truncate">
                  {task.name}
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Subtasks */}
        {hasSubtasks && task.expanded && task.subtasks?.map(subtask => 
          renderTask(subtask, level + 1)
        )}
      </div>
    );
  };

  return (
    <div className="bg-black rounded-xl border border-grey-800 overflow-hidden">
      {/* Header */}
      <div className="flex border-b border-grey-800 bg-grey-900/50">
        {/* Task Header */}
        <div className="w-80 flex-shrink-0 p-4 border-r border-grey-800">
          <SubsectionHeader className="text-white">TASKS</SubsectionHeader>
        </div>

        {/* Timeline Header */}
        <div className="flex-1 flex">
          {timelineMonths.map((month, index) => (
            <div
              key={index}
              className="flex-1 p-4 border-r border-grey-800 last:border-r-0"
            >
              <div className="text-body-sm text-grey-400">
                {month.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tasks */}
      <div className="overflow-y-auto max-h-[600px]">
        {tasks.map(task => renderTask(task))}
      </div>
    </div>
  );
}
