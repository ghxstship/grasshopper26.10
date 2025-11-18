'use client';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, Users, CheckSquare, Loader2, AlertCircle } from 'lucide-react';
import { useTasks } from '@/lib/hooks/atlvs/useTasks';
import { useTeamMembers } from '@/lib/hooks/atlvs/useTeams';
import Link from 'next/link';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { Checkbox } from '@/components/atoms/Checkbox';

interface _Task {
  id: string;
  title: string;
  project: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

interface _TeamMember {
  id: string;
  name: string;
  role: string;
  currentTasks: number;
}

export default function BulkAssignPage() {
  const { data: tasks = [], isLoading: tasksLoading, error: tasksError, refetch: refetchTasks } = useTasks();
  const { data: teamMembers = [], isLoading: membersLoading, error: membersError, refetch: refetchMembers } = useTeamMembers();
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [selectedMember, setSelectedMember] = useState('');

  const isLoading = tasksLoading || membersLoading;
  const error = tasksError || membersError;
  const queryClient = useQueryClient();

  const assignTasksMutation = useMutation({
    mutationFn: async (data: { taskIds: string[], memberId: string }) => {
      const response = await fetch('/api/atlvs/tasks/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to assign tasks');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setSelectedTasks([]);
      setSelectedMember('');
    },
  });

  if (isLoading) {
    return (
      <AtlvsLayout>
        <ContentLayout
          title="BULK TASK ASSIGNMENT"
          description="Loading..."
          variant="atlvs"
          showToolbar={false}
        >
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-atlvs-green-500" />
              <p className="text-gray-400">Loading tasks and team members...</p>
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
          title="BULK TASK ASSIGNMENT"
          description="Error loading data"
          variant="atlvs"
          showToolbar={false}
        >
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
              <h2 className="text-xl font-bebas mb-2">Failed to Load Data</h2>
              <p className="text-gray-400 mb-4">{error.message}</p>
              <Button variant="atlvs" onClick={() => { refetchTasks(); refetchMembers(); }}>
                Try Again
              </Button>
            </div>
          </div>
        </ContentLayout>
      </AtlvsLayout>
    );
  }

  const toggleTask = (taskId: string) => {
    setSelectedTasks(prev =>
      prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleAssign = () => {
    if (selectedTasks.length > 0 && selectedMember) {
      assignTasksMutation.mutate({ taskIds: selectedTasks, memberId: selectedMember });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-error-light text-error border-error-border';
      case 'high': return 'bg-atlvs-orange-500/20 text-atlvs-orange-500 border-atlvs-orange-500/50';
      case 'medium': return 'bg-warning-light text-warning border-warning-border';
      case 'low': return 'bg-info-light text-info border-info-border';
      default: return 'bg-gray-500/20 text-gray-500 border-gray-500/50';
    }
  };

  return (
    <AtlvsLayout>
      <ContentLayout
        title="BULK TASK ASSIGNMENT"
        description="Assign multiple tasks to team members at once"
        variant="atlvs"
        breadcrumbs={[
          { label: 'Tasks', href: '/atlvs/tasks' },
          { label: 'Bulk Assign' }
        ]}
      >

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* _Task Selection */}
          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <div className="flex items-center justify-between mb-6">
                <CardTitle className="flex items-center gap-2">
                  <CheckSquare className="w-5 h-5" />
                  Select Tasks ({selectedTasks.length})
                </CardTitle>
                {selectedTasks.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedTasks([])}
                  >
                    Clear All
                  </Button>
                )}
              </div>
              <div className="space-y-2">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-center gap-4 p-4 rounded-lg transition-colors ${
                      selectedTasks.includes(task.id)
                        ? 'bg-atlvs-green-500/10 border border-atlvs-green-500/50'
                        : 'bg-gray-800/50 border border-transparent hover:bg-gray-800'
                    }`}
                  >
                    <Checkbox
                      checked={selectedTasks.includes(task.id)}
                      onChange={() => toggleTask(task.id)}
                      variant="atlvs"
                    />
                    <div className="flex-1">
                      <div className="font-medium mb-1">{task.title}</div>
                      <div className="text-sm text-gray-400">{task.project}</div>
                    </div>
                    <Badge variant="atlvs-outline" className={getPriorityColor(task.priority)}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardHeader>
          </Card>

          {/* Team Member Selection */}
          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 mb-6">
                <Users className="w-5 h-5" />
                Assign To
              </CardTitle>
              <div className="space-y-2 mb-6">
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-colors ${
                      selectedMember === member.id
                        ? 'bg-atlvs-purple-500/10 border border-atlvs-purple-500/50'
                        : 'bg-gray-800/50 border border-transparent hover:bg-gray-800'
                    }`}
                    onClick={() => setSelectedMember(member.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedMember === member.id 
                          ? 'border-atlvs-purple-500 bg-atlvs-purple-500' 
                          : 'border-gray-600 bg-transparent'
                      }`}>
                        {selectedMember === member.id && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-atlvs-green-500 to-atlvs-purple-500 flex items-center justify-center font-bebas">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-gray-400">{member.role}</div>
                      </div>
                    </div>
                    <Badge variant="atlvs-outline" className="bg-gray-700/50">
                      {member.currentTasks} tasks
                    </Badge>
                  </div>
                ))}
              </div>

              {/* Assignment Summary */}
              {selectedTasks.length > 0 && selectedMember && (
                <div className="p-4 bg-atlvs-green-500/10 border border-atlvs-green-500/50 rounded-lg mb-4">
                  <div className="text-sm text-gray-400 mb-1">Assignment Summary</div>
                  <div className="font-medium">
                    Assigning {selectedTasks.length} task{selectedTasks.length !== 1 ? 's' : ''} to{' '}
                    {teamMembers.find(m => m.id === selectedMember)?.name}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Link href="/atlvs/tasks" className="flex-1">
                  <Button variant="ghost" className="w-full">
                    Cancel
                  </Button>
                </Link>
                <Button
                  variant="atlvs"
                  className="flex-1"
                  onClick={handleAssign}
                  disabled={selectedTasks.length === 0 || !selectedMember}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Assign Tasks
                </Button>
              </div>
            </CardHeader>
          </Card>
        </div>
      </ContentLayout>
    </AtlvsLayout>
  );
}
