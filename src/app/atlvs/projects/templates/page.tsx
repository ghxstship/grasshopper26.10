'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { useState } from 'react';
import { Plus, Search, Folder, Clock, Users, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Card, CardContent } from '@/components/atoms/Card';
import { Input } from '@/components/atoms/Input';
import { Badge } from '@/components/atoms/Badge';
import { Select } from '@/components/atoms/Select';
import { useProjectTemplates } from '@/lib/hooks/atlvs/useProjects';

export default function ProjectTemplatesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { data: templates = [], isLoading, error, refetch } = useProjectTemplates();

  if (isLoading) {
    return (
      <AtlvsLayout>
        <ContentLayout
          title="PROJECT TEMPLATES"
          description="Loading templates..."
          variant="atlvs"
          showToolbar={false}
        >
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-atlvs-green-500" />
              <p className="text-gray-400">Loading project templates...</p>
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
          title="PROJECT TEMPLATES"
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

  const categories = ['all', 'Festival', 'Corporate', 'Tour', 'Conference', 'Exhibition'];

  const filteredTemplates = templates.filter((template: any) => {
    const matchesSearch = template.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <AtlvsLayout>
      <ContentLayout
        title="PROJECT TEMPLATES"
        description="Start new projects faster with pre-configured templates"
        variant="atlvs"
        breadcrumbs={[
          { label: 'Projects', href: '/atlvs/projects' },
          { label: 'Templates' }
        ]}
        actions={[
          {
            label: 'Create Template',
            icon: <Plus className="w-4 h-4" />,
            onClick: () => {},
            variant: 'atlvs'
          }
        ]}
      >
        {/* Search and Filters */}
        <div className="mb-6 flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-900/50 border-purple-500/30 text-white"
            />
          </div>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            variant="atlvs"
            className="border-purple-500/30 focus:border-purple-500"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </Select>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map(template => (
            <Card key={template.id} variant="atlvs" className="bg-gray-900/50 hover:bg-gray-900/70 transition-all">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-purple-500/10 rounded-lg">
                    <Folder className="w-6 h-6 text-atlvs-purple-500" />
                  </div>
                  <Badge variant="atlvs">
                    {template.category}
                  </Badge>
                </div>

                <h3 className="text-lg font-oswald text-white mb-2">{template.name}</h3>
                <p className="text-gray-400 text-sm font-share-tech mb-4 line-clamp-2">{template.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-400 font-share-tech">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{template.duration} timeline</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-400 font-share-tech">
                    <Users className="w-4 h-4 mr-2" />
                    <span>{template.teamSize} team members</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-400 font-share-tech">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <span>{template.tasksCount} tasks included</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                  <span className="text-sm text-gray-500 font-share-tech">Used {template.usageCount} times</span>
                  <Button variant="atlvs" size="sm">
                    Use Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <Folder className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 font-share-tech">No templates found matching your criteria</p>
          </div>
        )}
      </ContentLayout>
    </AtlvsLayout>
  );
}
