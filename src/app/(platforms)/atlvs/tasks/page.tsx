'use client';

import * as React from 'react';
import { H1, Body } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Badge } from '@/components/ui-rebuild/atoms/Badge';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';
import { useRouter } from 'next/navigation';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  assignedTo: string;
  dueDate: string;
  projectName: string;
}

export default function TasksPage() {
  const [loading, setLoading] = React.useState(true);
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const router = useRouter();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<{ tasks: Task[] }>('/api/atlvs/tasks');
        if (response.data?.tasks) setTasks(response.data.tasks);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'URGENT': return 'bg-red-100 text-red-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LOW': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar variant="atlvs" />
        <div className="flex justify-center items-center py-24">
          <Spinner size="xl" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar variant="atlvs" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12 flex items-center justify-between">
          <div>
            <H1 className="mb-4">Tasks</H1>
            <Body className="text-gray-600">
              Assign and track production tasks
            </Body>
          </div>
          <Button variant="atlvs">Create Task</Button>
        </div>

        <div className="space-y-4">
          {tasks.map((task) => (
            <Card 
              key={task.id} 
              variant="atlvs"
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => router.push(`/atlvs/tasks/${task.id}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={task.status === 'COMPLETED' ? 'default' : 'outline'}>
                        {task.status.replace('_', ' ')}
                      </Badge>
                      <Body className={`text-xs px-2 py-1 rounded ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </Body>
                    </div>
                    <CardTitle>{task.title}</CardTitle>
                    <CardDescription>{task.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Body className="text-sm text-gray-600">Project</Body>
                    <Body className="font-semibold">{task.projectName}</Body>
                  </div>
                  <div>
                    <Body className="text-sm text-gray-600">Assigned To</Body>
                    <Body className="font-semibold">{task.assignedTo}</Body>
                  </div>
                  <div>
                    <Body className="text-sm text-gray-600">Due Date</Body>
                    <Body className="font-semibold">{new Date(task.dueDate).toLocaleDateString()}</Body>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}