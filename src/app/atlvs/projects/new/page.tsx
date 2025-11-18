'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Calendar, DollarSign, Users, FileText } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import { Textarea } from '@/components/atoms/Textarea';
import { FormField } from '@/components/molecules/FormField';
import { useCreateProject } from '@/lib/hooks/atlvs/useProjects';
import { useAuth } from '@/lib/hooks/auth/useAuth';

export default function NewProjectPage() {
  const router = useRouter();
  const { user } = useAuth();
  const createProject = useCreateProject();

  const [formData, setFormData] = useState({
    name: '',
    client: '',
    description: '',
    startDate: '',
    endDate: '',
    budget: '',
    _status: 'planning',
    priority: 'medium',
    category: 'event'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { _status, budget, ...projectData } = formData;
    createProject.mutate({
      ...projectData,
      organizationId: user?.id || '',
      slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
      priority: formData.priority.toUpperCase() as 'LOW' | 'MEDIUM' | 'HIGH',
      budget: parseFloat(budget) || 0
    }, {
      onSuccess: () => {
        router.push('/atlvs/projects');
      }
    });
  };

  return (
    <AtlvsLayout>
      <ContentLayout
        title="CREATE NEW PROJECT"
        description="Set up a new production project"
        variant="atlvs"
        breadcrumbs={[
          { label: 'Projects', href: '/atlvs/projects' },
          { label: 'New Project' }
        ]}
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Basic Information */}
            <Card variant="atlvs" className="bg-gray-900/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 mb-6">
                  <FileText className="w-5 h-5" />
                  Basic Information
                </CardTitle>
                <div className="space-y-4">
                  <FormField label="Project Name" required>
                    <Input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      variant="atlvs"
                      placeholder="Summer Music Festival 2024"
                    />
                  </FormField>

                  <FormField label="Client" required>
                    <Input
                      type="text"
                      required
                      value={formData.client}
                      onChange={(e) => setFormData({...formData, client: e.target.value})}
                      variant="atlvs"
                      placeholder="Live Nation Entertainment"
                    />
                  </FormField>

                  <FormField label="Description">
                    <Textarea
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      variant="atlvs"
                      placeholder="Describe the project scope and objectives..."
                    />
                  </FormField>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Category">
                      <Select
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        variant="atlvs"
                      >
                        <option value="event">Event</option>
                        <option value="concert">Concert</option>
                        <option value="festival">Festival</option>
                        <option value="corporate">Corporate</option>
                        <option value="sports">Sports</option>
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
                </div>
              </CardHeader>
            </Card>

            {/* Timeline */}
            <Card variant="atlvs" className="bg-gray-900/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 mb-6">
                  <Calendar className="w-5 h-5" />
                  Timeline
                </CardTitle>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Start Date" required>
                    <Input
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                      variant="atlvs"
                    />
                  </FormField>

                  <FormField label="End Date" required>
                    <Input
                      type="date"
                      required
                      value={formData.endDate}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                      variant="atlvs"
                    />
                  </FormField>
                </div>
              </CardHeader>
            </Card>

            {/* Budget */}
            <Card variant="atlvs" className="bg-gray-900/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 mb-6">
                  <DollarSign className="w-5 h-5" />
                  Budget
                </CardTitle>
                <FormField label="Total Budget" required>
                  <Input
                    type="number"
                    required
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                    variant="atlvs"
                    placeholder="500000"
                  />
                </FormField>
              </CardHeader>
            </Card>

            {/* Team */}
            <Card variant="atlvs" className="bg-gray-900/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 mb-6">
                  <Users className="w-5 h-5" />
                  Team Assignment
                </CardTitle>
                <FormField label="Project Manager">
                  <Select variant="atlvs">
                    <option value="">Select a team member...</option>
                    <option value="1">Sarah Johnson</option>
                    <option value="2">Mike Chen</option>
                    <option value="3">Alex Kim</option>
                  </Select>
                </FormField>
              </CardHeader>
            </Card>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4">
              <Link href="/atlvs/projects">
                <Button variant="ghost">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" variant="atlvs">
                <Save className="w-4 h-4 mr-2" />
                Create Project
              </Button>
            </div>
          </div>
        </form>
      </ContentLayout>
    </AtlvsLayout>
  );
}
