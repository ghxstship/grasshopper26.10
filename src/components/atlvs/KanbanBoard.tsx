'use client';

import { useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import { GripVertical, Plus, MoreVertical, Calendar, User } from 'lucide-react';
import { Card } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { BodyTextSmall, Caption, SubsectionHeader } from "@/components/atoms/Typography";

export interface KanbanTask {
  id: string;
  title: string;
  description?: string;
  assignee?: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  tags?: string[];
}

export interface KanbanColumn {
  id: string;
  title: string;
  tasks: KanbanTask[];
  color?: string;
}

interface KanbanBoardProps {
  columns: KanbanColumn[];
  onTaskMove?: (taskId: string, fromColumn: string, toColumn: string) => void;
  onTaskClick?: (task: KanbanTask) => void;
  onAddTask?: (columnId: string) => void;
}

export function KanbanBoard({ columns, onTaskMove: _onTaskMove, onTaskClick, onAddTask }: KanbanBoardProps) {
  const [boardColumns, setBoardColumns] = useState(columns);

  const handleReorder = (columnId: string, newOrder: KanbanTask[]) => {
    setBoardColumns(prev =>
      prev.map(col =>
        col.id === columnId ? { ...col, tasks: newOrder } : col
      )
    );
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'urgent': return 'bg-error';
      case 'high': return 'bg-atlvs-orange-500';
      case 'medium': return 'bg-warning';
      case 'low': return 'bg-info';
      default: return 'bg-grey-500';
    }
  };

  return (
    <div className="flex gap-6 overflow-x-auto pb-4">
      {boardColumns.map((column) => (
        <div
          key={column.id}
          className="flex-shrink-0 w-80"
        >
          {/* Column Header */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${column.color || 'bg-atlvs-green-500'}`}
              />
              <SubsectionHeader className="text-white">
                {column.title}
              </SubsectionHeader>
              <Badge variant="atlvs-outline">
                <Caption>{column.tasks.length}</Caption>
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAddTask?.(column.id)}
              className="text-grey-400 hover:text-white"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Tasks */}
          <Reorder.Group
            axis="y"
            values={column.tasks}
            onReorder={(newOrder) => handleReorder(column.id, newOrder)}
            className="space-y-3 min-h-[200px]"
          >
            {column.tasks.map((task) => (
              <Reorder.Item
                key={task.id}
                value={task}
                className="cursor-grab active:cursor-grabbing"
              >
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => onTaskClick?.(task)}
                >
                  <Card
                    variant="atlvs"
                    className="p-4 bg-grey-900/50 backdrop-blur-sm border-atlvs-green-500/20 hover:border-atlvs-green-500/50 transition-all"
                  >
                    {/* Task Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-2 flex-1">
                        <GripVertical className="w-4 h-4 text-grey-500 mt-1 flex-shrink-0" />
                        <BodyTextSmall className="text-white font-medium">
                          {task.title}
                        </BodyTextSmall>
                      </div>
                      <Button variant="ghost" size="sm" className="h-auto p-0">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Task Description */}
                    {task.description && (
                      <Caption className="text-grey-400 mb-3 line-clamp-2">
                        {task.description}
                      </Caption>
                    )}

                    {/* Task Meta */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {task.priority && (
                          <div
                            className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`}
                            title={task.priority}
                          />
                        )}
                        {task.assignee && (
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3 text-grey-400" />
                            <Caption className="text-grey-400">{task.assignee}</Caption>
                          </div>
                        )}
                      </div>
                      {task.dueDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-grey-400" />
                          <Caption className="text-grey-400">{task.dueDate}</Caption>
                        </div>
                      )}
                    </div>

                    {/* Task Tags */}
                    {task.tags && task.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {task.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="atlvs-outline"
                          >
                            <Caption>{tag}</Caption>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </Card>
                </motion.div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>
      ))}
    </div>
  );
}
