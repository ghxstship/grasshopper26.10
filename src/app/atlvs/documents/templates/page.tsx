'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { useState } from 'react';
import { FileText, Copy, Edit, Download, Plus, Search, Star,  } from 'lucide-react';
import { useDocuments } from '@/lib/hooks/atlvs/useDocuments';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { BodyText } from "@/components/atoms/Typography";

interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  usageCount: number;
  lastUsed: string;
  isFavorite: boolean;
}

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/atlvs/documents/templates

export default function TemplatesPage() {  
  const { documents: documentsData,  } = useDocuments('template');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const templates: Template[] = (documentsData as any) || [
    { id: '1', name: 'Standard Production Contract', category: 'Contracts', description: 'General production agreement template', usageCount: 45, lastUsed: '2025-11-12', isFavorite: true },
    { id: '2', name: 'Technical Rider Template', category: 'Riders', description: 'Standard technical requirements document', usageCount: 32, lastUsed: '2025-11-10', isFavorite: true },
    { id: '3', name: 'Budget Proposal', category: 'Financial', description: 'Project budget breakdown template', usageCount: 28, lastUsed: '2025-11-08', isFavorite: false },
    { id: '4', name: 'Venue Agreement', category: 'Contracts', description: 'Venue rental and usage agreement', usageCount: 23, lastUsed: '2025-11-05', isFavorite: false },
    { id: '5', name: 'Hospitality Rider', category: 'Riders', description: 'Catering and hospitality requirements', usageCount: 19, lastUsed: '2025-11-03', isFavorite: false },
    { id: '6', name: 'Crew Call Sheet', category: 'Operations', description: 'Daily crew schedule and contact info', usageCount: 67, lastUsed: '2025-11-14', isFavorite: true }
  ];

  const categories = ['all', ...Array.from(new Set(templates.map(t => t.category)))];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Contracts: 'bg-info-light text-info border-info-border',
      Riders: 'bg-atlvs-purple-500/20 text-atlvs-purple-500 border-atlvs-purple-500/50',
      Financial: 'bg-atlvs-green-500/20 text-atlvs-green-500 border-atlvs-green-500/50',
      Operations: 'bg-atlvs-orange-500/20 text-atlvs-orange-500 border-atlvs-orange-500/50'
    };
    return colors[category] || 'bg-grey-500/20 text-grey-500 border-grey-500/50';
  };

  return (
    <AtlvsLayout>
      <ContentLayout
        title="DOCUMENT TEMPLATES"
        description="Reusable templates for common documents"
        variant="atlvs"
        breadcrumbs={[
          { label: 'Documents', href: '/atlvs/documents' },
          { label: 'Templates' }
        ]}
      >
        {/* Toolbar */}
        <div className="flex justify-end mb-6">
          <Button variant="atlvs" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Create Template
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-grey-400" />
              <Input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                variant="atlvs"
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'atlvs' : 'ghost'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {filteredTemplates.map(template => (
            <Card key={template.id} variant="atlvs" className="bg-grey-900/50 hover:bg-grey-900 transition-all">
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-6 h-6 text-grey-400" />
                    {template.isFavorite && (
                      <Star className="w-5 h-5 text-warning fill-yellow-500" />
                    )}
                  </div>
                  <Badge variant="atlvs-outline" className={getCategoryColor(template.category)}>
                    {template.category}
                  </Badge>
                </div>

                <CardTitle className="text-white mb-2">{template.name}</CardTitle>
                <p className="text-body-sm text-grey-400 mb-4">{template.description}</p>

                <div className="flex items-center justify-between text-body-sm text-grey-400 mb-4 pb-4 border-b border-grey-700">
                  <span>Used {template.usageCount} times</span>
                  <span>Last: {template.lastUsed}</span>
                </div>

                <div className="flex gap-2">
                  <Button variant="atlvs" size="sm" className="flex-1">
                    <Copy className="w-4 h-4 mr-1" />
                    Use
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <Card variant="atlvs" className="bg-grey-900/50 p-12 text-center">
            <FileText className="w-12 h-12 text-grey-400 mx-auto mb-3" />
            <BodyText className="text-grey-400">No templates found</BodyText>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card variant="atlvs" className="bg-grey-900/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription className="text-grey-400 mb-1">Total Templates</CardDescription>
                  <CardTitle >{templates.length}</CardTitle>
                </div>
                <div className="p-3 bg-atlvs-green-500/10 rounded-xl">
                  <FileText className="w-6 h-6 text-atlvs-green-500" />
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card variant="atlvs" className="bg-grey-900/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription className="text-grey-400 mb-1">Favorites</CardDescription>
                  <CardTitle >
                    {templates.filter(t => t.isFavorite).length}
                  </CardTitle>
                </div>
                <div className="p-3 bg-warning/10 rounded-xl">
                  <Star className="w-6 h-6 text-warning" />
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card variant="atlvs" className="bg-grey-900/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription className="text-grey-400 mb-1">Total Uses</CardDescription>
                  <CardTitle >
                    {templates.reduce((sum, t) => sum + t.usageCount, 0)}
                  </CardTitle>
                </div>
                <div className="p-3 bg-info/10 rounded-xl">
                  <Copy className="w-6 h-6 text-info" />
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card variant="atlvs" className="bg-grey-900/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription className="text-grey-400 mb-1">Categories</CardDescription>
                  <CardTitle >{categories.length - 1}</CardTitle>
                </div>
                <div className="p-3 bg-accent/100/10 rounded-xl">
                  <FileText className="w-6 h-6 text-atlvs-purple-500" />
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
      </ContentLayout>
    </AtlvsLayout>
  );
}
