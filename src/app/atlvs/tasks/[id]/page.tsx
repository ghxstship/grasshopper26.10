'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';

import { motion } from 'framer-motion';
import { Clock, User, Flag, Tag, MessageSquare, Paperclip, CheckSquare, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { Textarea } from '@/components/atoms/Textarea';
import { Checkbox } from '@/components/atoms/Checkbox';
import { useTask } from '@/lib/hooks/atlvs/useTasks';

export default function TaskDetailPage({ params }: { params: { id: string } }) {
  const { data: task, isLoading, error, refetch } = useTask(params.id) as any;
  
  if (isLoading) {
    return (
      <AtlvsLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-atlvs-green-500" />
            <p className="text-gray-400">Loading task...</p>
          </div>
        </div>
      </AtlvsLayout>
    );
  }
  
  if (error || !task) {
    return (
      <AtlvsLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
            <h2 className="text-xl font-bebas mb-2">Failed to Load Task</h2>
            <p className="text-gray-400 mb-4">{error?.message || 'Task not found'}</p>
            <Button variant="atlvs" onClick={() => refetch()}>
              Try Again
            </Button>
          </div>
        </div>
      </AtlvsLayout>
    );
  }

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
      default: return 'bg-gray-500/20 text-gray-500 border-gray-500/50';
    }
  };

  return (
    <AtlvsLayout>
      <ContentLayout
        title={task.title}
        description={`Task ID: ${task.id}`}
        variant="atlvs"
        breadcrumbs={[
          { label: 'Tasks', href: '/atlvs/tasks' },
          { label: task.title }
        ]}
      >
        {/* Status Badges */}
        <div className="flex items-center gap-2 flex-wrap mb-6">
          <Badge variant="atlvs-outline" className={getStatusColor(task.status)}>
            {task.status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
          </Badge>
          <Badge variant="atlvs-outline" className={getPriorityColor(task.priority)}>
            <Flag className="w-3 h-3 mr-1" />
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </Badge>
          {task.tags.map((tag) => (
            <Badge key={tag} variant="atlvs-outline" className="bg-gray-700/50">
              <Tag className="w-3 h-3 mr-1" />
              {tag}
            </Badge>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card variant="atlvs" className="bg-gray-900/50">
              <CardHeader>
                <CardTitle className="mb-4">Description</CardTitle>
                <p className="text-gray-300 leading-relaxed">{task.description}</p>
              </CardHeader>
            </Card>

            {/* Progress */}
            <Card variant="atlvs" className="bg-gray-900/50">
              <CardHeader>
                <CardTitle className="mb-4">Progress</CardTitle>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Completion</span>
                    <span className="font-medium">{task.progress}%</span>
                  </div>
                  <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${task.progress}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-atlvs-green-500 to-atlvs-purple-500"
                    />
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Checklist */}
            <Card variant="atlvs" className="bg-gray-900/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 mb-4">
                  <CheckSquare className="w-5 h-5" />
                  Checklist ({task.checklist.filter(i => i.completed).length}/{task.checklist.length})
                </CardTitle>
                <div className="space-y-2">
                  {task.checklist.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg"
                    >
                      <Checkbox
                        checked={item.completed}
                        readOnly
                        variant="atlvs"
                      />
                      <span className={item.completed ? 'line-through text-gray-500' : 'text-gray-300'}>
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </CardHeader>
            </Card>

            {/* Comments */}
            <Card variant="atlvs" className="bg-gray-900/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 mb-4">
                  <MessageSquare className="w-5 h-5" />
                  Comments ({task.comments.length})
                </CardTitle>
                <div className="space-y-4">
                  {task.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-atlvs-green-500 to-atlvs-purple-500 flex items-center justify-center font-bebas text-lg">
                        {comment.author.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{comment.author}</span>
                          <span className="text-sm text-gray-500">{comment.time}</span>
                        </div>
                        <p className="text-gray-300">{comment.text}</p>
                      </div>
                    </div>
                  ))}
                  <div className="pt-4 border-t border-gray-800">
                    <Textarea
                      placeholder="Add a comment..."
                      rows={3}
                      variant="atlvs"
                    />
                    <div className="flex justify-end mt-2">
                      <Button variant="atlvs" size="sm">
                        Post Comment
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Details */}
            <Card variant="atlvs" className="bg-gray-900/50">
              <CardHeader>
                <CardTitle className="mb-4">Details</CardTitle>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Project</div>
                    <div className="font-medium">{task.project}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1 flex items-center gap-1">
                      <User className="w-4 h-4" />
                      Assignee
                    </div>
                    <div className="font-medium">{task.assignee}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Due Date
                    </div>
                    <div className="font-medium">{new Date(task.dueDate).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Created</div>
                    <div className="font-medium">{new Date(task.created).toLocaleDateString()}</div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Attachments */}
            <Card variant="atlvs" className="bg-gray-900/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 mb-4">
                  <Paperclip className="w-5 h-5" />
                  Attachments ({task.attachments.length})
                </CardTitle>
                <div className="space-y-2">
                  {task.attachments.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{file.name}</div>
                        <div className="text-sm text-gray-400">{file.size}</div>
                      </div>
                    </div>
                  ))}
                  <Button variant="ghost" size="sm" className="w-full mt-2">
                    <Paperclip className="w-4 h-4 mr-2" />
                    Add Attachment
                  </Button>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
      </ContentLayout>
    </AtlvsLayout>
  );
}
