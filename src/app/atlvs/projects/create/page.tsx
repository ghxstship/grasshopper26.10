'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { FolderPlus, Save, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/atoms/Card';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import { Textarea } from '@/components/atoms/Textarea';
import { FormField } from '@/components/molecules/FormField';
import { useCreateProject } from '@/lib/hooks/atlvs/useCreateProject';
import { useAuth } from '@/lib/hooks/auth/useAuth';

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/atlvs/projects/create

export default function CreateProjectPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { mutate: createProject, isPending: isLoading, error } = useCreateProject();
  
  const [formData, setFormData] = useState({
    name: '',
    client: '',
    venue: '',
    startDate: '',
    endDate: '',
    budget: '',
    projectManager: '',
    description: '',
    type: 'concert',
    status: 'planning',
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('You must be logged in to create a project');
      return;
    }

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        budget: parseFloat(formData.budget) || 0,
        organizationId: '00000000-0000-0000-0000-000000000000',
        status: formData.status,
        type: formData.type,
        client: formData.client,
        venue: formData.venue,
        projectManager: formData.projectManager,
      };

      await createProject(payload);
      alert('Project created successfully!');
      router.push('/atlvs/projects');
    } catch (err) {
      console.error('Project creation error:', err);
      alert(error?.message || 'Failed to create project');
    }
  };

  return (
    <AtlvsLayout>
      <ContentLayout
        title="CREATE NEW PROJECT"
        description="Set up a new production project"
        variant="atlvs"
        breadcrumbs={[
          { label: 'Projects', href: '/atlvs/projects' },
          { label: 'Create' }
        ]}
        actions={[
          {
            label: 'Cancel',
            icon: <X className="w-4 h-4" />,
            onClick: () => router.back(),
            variant: 'outline'
          }
        ]}
      >
        <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-grey-900/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-atlvs-purple-500" />
                Project Details
              </CardTitle>
              <CardDescription className="text-grey-400">
                Enter the basic information for your new project
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Project Name */}
                <FormField label="Project Name" required>
                  <Input
                    id="name"
                    type="text"
                    placeholder="e.g., Summer Music Festival 2025"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    variant="atlvs"
                    required
                  />
                </FormField>

                {/* Client and Venue */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="Client" required>
                    <Input
                      id="client"
                      type="text"
                      placeholder="Client name"
                      value={formData.client}
                      onChange={(e) => handleChange('client', e.target.value)}
                      variant="atlvs"
                      required
                    />
                  </FormField>
                  <FormField label="Venue" required>
                    <Input
                      id="venue"
                      type="text"
                      placeholder="Venue name"
                      value={formData.venue}
                      onChange={(e) => handleChange('venue', e.target.value)}
                      variant="atlvs"
                      required
                    />
                  </FormField>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="Start Date" required>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleChange('startDate', e.target.value)}
                      variant="atlvs"
                      required
                    />
                  </FormField>
                  <FormField label="End Date" required>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => handleChange('endDate', e.target.value)}
                      variant="atlvs"
                      required
                    />
                  </FormField>
                </div>

                {/* Budget and PM */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="Budget" required>
                    <Input
                      id="budget"
                      type="number"
                      placeholder="0.00"
                      value={formData.budget}
                      onChange={(e) => handleChange('budget', e.target.value)}
                      variant="atlvs"
                      required
                    />
                  </FormField>
                  <FormField label="Project Manager" required>
                    <Select
                      id="projectManager"
                      value={formData.projectManager}
                      onChange={(e) => handleChange('projectManager', e.target.value)}
                      variant="atlvs"
                      required
                    >
                      <option value="">Select PM</option>
                      <option value="john-smith">John Smith</option>
                      <option value="sarah-johnson">Sarah Johnson</option>
                      <option value="mike-chen">Mike Chen</option>
                    </Select>
                  </FormField>
                </div>

                {/* Type and Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="Project Type" required>
                    <Select
                      id="type"
                      value={formData.type}
                      onChange={(e) => handleChange('type', e.target.value)}
                      variant="atlvs"
                      required
                    >
                      <option value="concert">Concert</option>
                      <option value="festival">Festival</option>
                      <option value="corporate">Corporate Event</option>
                      <option value="conference">Conference</option>
                      <option value="sports">Sports Event</option>
                      <option value="other">Other</option>
                    </Select>
                  </FormField>
                  <FormField label="Initial Status" required>
                    <Select
                      id="status"
                      value={formData.status}
                      onChange={(e) => handleChange('status', e.target.value)}
                      variant="atlvs"
                      required
                    >
                      <option value="planning">Planning</option>
                      <option value="in_progress">In Progress</option>
                      <option value="on_hold">On Hold</option>
                    </Select>
                  </FormField>
                </div>

                {/* Description */}
                <FormField label="Description">
                  <Textarea
                    id="description"
                    rows={4}
                    placeholder="Project description and notes..."
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    variant="atlvs"
                  />
                </FormField>

                {error && (
                  <div className="p-4 bg-destructive/100/10 border border-destructive/30 rounded-lg">
                    <p className="text-destructive text-body-sm">{error.message}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    variant="default"
                    size="lg"
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                    disabled={isLoading}
                  >
                    <Save className="w-5 h-5 mr-2" />
                    {isLoading ? 'Creating...' : 'Create Project'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={() => router.back()}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
        </div>
      </ContentLayout>
    </AtlvsLayout>
  );
}
