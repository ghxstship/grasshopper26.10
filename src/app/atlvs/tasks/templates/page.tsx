'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { useState } from 'react';
import { FileText, Plus, Copy, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { SearchBar } from '@/components/molecules/SearchBar';
import { useTaskTemplates } from '@/lib/hooks/atlvs/useTasks';

export default function TaskTemplatesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: templates = [], isLoading, error, refetch } = useTaskTemplates();

  if (isLoading) {
    return (
      <AtlvsLayout>
        <ContentLayout
          title="TASK TEMPLATES"
          description="Loading templates..."
          variant="atlvs"
          showToolbar={false}
        >
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-atlvs-green-500" />
              <p className="text-gray-400">Loading task templates...</p>
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
          title="TASK TEMPLATES"
          description="Error loading templates"
          variant="atlvs"
          showToolbar={false}
        >
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
              <h2 className="text-xl font-bebas mb-2">Failed to Load Templates</h2>
              <p className="text-gray-400 mb-4">{error.message}</p>
              <Button variant="atlvs" onClick={() => refetch()}>Try Again</Button>
            </div>
          </div>
        </ContentLayout>
      </AtlvsLayout>
    );
  }

  const filteredTemplates = templates.filter((template: any) =>
    template.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AtlvsLayout>
      <ContentLayout
        title="TASK TEMPLATES"
        description="Reusable task lists for common workflows"
        variant="atlvs"
        breadcrumbs={[
          { label: 'Tasks', href: '/atlvs/tasks' },
          { label: 'Templates' }
        ]}
      >
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search templates..."
          variant="atlvs"
          className="mb-6"
        />

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template: any) => (
            <Card key={template.id} variant="atlvs" className="bg-gray-900/50 hover:bg-gray-900/70 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-atlvs-green-500/20 rounded-lg">
                    <FileText className="w-6 h-6 text-atlvs-green-500" />
                  </div>
                  <Badge variant="atlvs-outline" className="bg-gray-700/50">
                    {template.category}
                  </Badge>
                </div>

                <CardTitle className="mb-2">{template.name}</CardTitle>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{template.description}</p>

                <div className="space-y-2 mb-4 text-sm text-gray-400">
                  <div>{template.tasksCount} tasks</div>
                  <div>Est. {template.estimatedDuration}</div>
                  <div>Used {template.usageCount} times</div>
                </div>

                <Button variant="atlvs" className="w-full">
                  <Copy className="w-4 h-4 mr-2" />
                  Use Template
                </Button>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Create Button */}
        <div className="fixed bottom-8 right-8">
          <Button variant="atlvs" size="lg" className="rounded-full shadow-lg">
            <Plus className="w-5 h-5 mr-2" />
            Create Template
          </Button>
        </div>
      </ContentLayout>
    </AtlvsLayout>
  );
}
