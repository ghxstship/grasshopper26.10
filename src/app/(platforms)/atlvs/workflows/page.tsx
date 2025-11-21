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
import { Workflow, Play, Pause } from 'lucide-react';

interface WorkflowItem {
  id: string;
  name: string;
  description: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ERROR';
  lastRun: string;
  executions: number;
}

export default function WorkflowsPage() {
  const [loading, setLoading] = React.useState(true);
  const [workflows, setWorkflows] = React.useState<WorkflowItem[]>([]);
  const router = useRouter();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<{ workflows: WorkflowItem[] }>('/api/atlvs/workflows');
        if (response.data?.workflows) setWorkflows(response.data.workflows);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
            <H1 className="mb-4">N8N Workflows</H1>
            <Body className="text-gray-600">
              Automate production tasks and processes
            </Body>
          </div>
          <Button variant="atlvs" onClick={() => router.push('/atlvs/n8n/new')}>Create Workflow</Button>
        </div>

        <div className="space-y-4">
          {workflows.map((workflow) => (
            <Card 
              key={workflow.id} 
              variant="atlvs"
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => router.push(`/atlvs/n8n/${workflow.id}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Workflow className="w-5 h-5 mt-1" />
                    <div>
                      <CardTitle>{workflow.name}</CardTitle>
                      <CardDescription>{workflow.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={workflow.status === 'ACTIVE' ? 'default' : 'outline'}>
                      {workflow.status}
                    </Badge>
                    {workflow.status === 'ACTIVE' ? (
                      <Pause className="w-4 h-4 text-gray-600" />
                    ) : (
                      <Play className="w-4 h-4 text-gray-600" />
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <Body className="text-sm">{workflow.executions} executions</Body>
                  <Body className="text-sm">•</Body>
                  <Body className="text-sm">Last run: {new Date(workflow.lastRun).toLocaleDateString()}</Body>
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