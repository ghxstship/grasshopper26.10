'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, User, Flag, Tag } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import { Textarea } from '@/components/atoms/Textarea';
import { FormField } from '@/components/molecules/FormField';
import { useCreateTask } from '@/lib/hooks/atlvs/useCreateTask';
import { useAuth } from '@/lib/hooks/auth/useAuth';

export default function NewTaskPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { mutate: createTask, isPending: isLoading, error } = useCreateTask();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project: '',
    assignee: '',
    priority: 'medium',
    status: 'todo',
    dueDate: '',
    tags: [] as string[]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('You must be logged in to create a task');
      return;
    }

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        projectId: formData.project,
        assigneeId: formData.assignee || undefined,
        priority: formData.priority.toUpperCase(),
        status: formData.status.toUpperCase(),
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined,
      };

      await createTask(payload);
      alert('Task created successfully!');
      router.push('/atlvs/tasks');
    } catch (err) {
      console.error('Task creation error:', err);
      alert(error?.message || 'Failed to create task');
    }
  };

  return (
    <AtlvsLayout>
      <ContentLayout
        title="CREATE NEW TASK"
        description="Add a new task to your workflow"
        variant="atlvs"
        breadcrumbs={[
          { label: 'Tasks', href: '/atlvs/tasks' },
          { label: 'New Task' }
        ]}
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Task Details */}
            <Card variant="atlvs" className="bg-gray-900/50">
              <CardHeader>
                <CardTitle className="mb-6">Task Details</CardTitle>
                <div className="space-y-4">
                  <FormField label="Task Title" required>
                    <Input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      variant="atlvs"
                      placeholder="Design stage layout for main performance"
                    />
                  </FormField>

                  <FormField label="Description">
                    <Textarea
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      variant="atlvs"
                      placeholder="Provide detailed task description..."
                    />
                  </FormField>

                  <FormField label="Project" required>
                    <Select
                      required
                      value={formData.project}
                      onChange={(e) => setFormData({...formData, project: e.target.value})}
                      variant="atlvs"
                    >
                      <option value="">Select a project...</option>
                      <option value="1">Summer Music Festival</option>
                      <option value="2">Arena Concert Series</option>
                      <option value="3">Corporate Conference</option>
                    </Select>
                  </FormField>
                </div>
              </CardHeader>
            </Card>

            {/* Assignment */}
            <Card variant="atlvs" className="bg-gray-900/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 mb-6">
                  <User className="w-5 h-5" />
                  Assignment
                </CardTitle>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Assignee">
                    <Select
                      value={formData.assignee}
                      onChange={(e) => setFormData({...formData, assignee: e.target.value})}
                      variant="atlvs"
                    >
                      <option value="">Unassigned</option>
                      <option value="1">Sarah Johnson</option>
                      <option value="2">Mike Chen</option>
                      <option value="3">Alex Kim</option>
                    </Select>
                  </FormField>

                  <FormField label="Due Date">
                    <Input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                      variant="atlvs"
                    />
                  </FormField>
                </div>
              </CardHeader>
            </Card>

            {/* Status & Priority */}
            <Card variant="atlvs" className="bg-gray-900/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 mb-6">
                  <Flag className="w-5 h-5" />
                  Status & Priority
                </CardTitle>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Status">
                    <Select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      variant="atlvs"
                    >
                      <option value="backlog">Backlog</option>
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="review">Review</option>
                      <option value="done">Done</option>
                    </Select>
                  </FormField>

                  <FormField label="Priority">
                    <Select
                      value={formData.priority}
                      onChange={(e) => setFormData({...formData, priority: e.target.value})}
                      variant="atlvs"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </Select>
                  </FormField>
                </div>
              </CardHeader>
            </Card>

            {/* Tags */}
            <Card variant="atlvs" className="bg-gray-900/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 mb-6">
                  <Tag className="w-5 h-5" />
                  Tags
                </CardTitle>
                <FormField label="Add tags to categorize this task" hint="Suggested: Technical, Design, Logistics, Budget, Safety">
                  <Input
                    type="text"
                    variant="atlvs"
                    placeholder="Type and press Enter to add tags..."
                  />
                </FormField>
              </CardHeader>
            </Card>

            {error && (
              <div className="p-4 bg-destructive/100/10 border border-destructive/30 rounded-lg">
                <p className="text-destructive text-body-sm">{error.message}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-4">
              <Link href="/atlvs/tasks">
                <Button variant="ghost">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" variant="atlvs" disabled={isLoading}>
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? 'Creating...' : 'Create Task'}
              </Button>
            </div>
          </div>
        </form>
      </ContentLayout>
    </AtlvsLayout>
  );
}
