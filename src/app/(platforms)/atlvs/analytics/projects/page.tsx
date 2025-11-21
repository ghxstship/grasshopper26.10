/**
 * Project Analytics Page - UI Rebuild
 */

'use client';

import * as React from 'react';
import { H1, Body, Display } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Badge } from '@/components/ui-rebuild/atoms/Badge';
import Link from 'next/link';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';


interface Project {
  id: string;
  name: string;
  status: 'ON_TRACK' | 'AT_RISK' | 'DELAYED';
  completion: number;
  budget: number;
  spent: number;
}

export default function ProjectAnalyticsPage() {
  const [loading, setLoading] = React.useState(true);
  const [projects, setProjects] = React.useState<Project[]>([]);


  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<{ projects: Project[] }>('/api/atlvs/analytics/projects');
        if (response.data?.projects) {
          setProjects(response.data.projects);
        }
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
        <div className="mb-12">
          <H1 className="mb-4">Project Analytics</H1>
          <Body className="text-gray-600">
            Project Analytics page content
          </Body>
        </div>

        <div className="space-y-4">
          {projects.map((project) => (
            <Link key={project.id} href={`/atlvs/projects/${project.id}`}>
              <Card variant="atlvs" className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{project.name}</CardTitle>
                      <CardDescription>{project.completion}% Complete</CardDescription>
                    </div>
                    <Badge variant={project.status === 'ON_TRACK' ? 'default' : project.status === 'AT_RISK' ? 'outline' : 'ghost'}>
                      {project.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Body className="text-sm text-gray-600">Budget</Body>
                      <Body className="font-semibold">${project.budget.toLocaleString()}</Body>
                    </div>
                    <div>
                      <Body className="text-sm text-gray-600">Spent</Body>
                      <Body className="font-semibold">${project.spent.toLocaleString()}</Body>
                    </div>
                  </div>
                  <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: `${project.completion}%` }} />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
