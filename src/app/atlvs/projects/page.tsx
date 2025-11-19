'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Grid, List, Calendar, Users, DollarSign, TrendingUp, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { Input } from '@/components/atoms/Input';
import { useProjects } from '@/lib/hooks/atlvs/useProjects';

interface Project {
  id: string;
  name: string;
  client: string;
  status: 'planning' | 'active' | 'on-hold' | 'completed';
  progress: number;
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  team: number;
  tasks: { total: number; completed: number };
}

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/atlvs/projects

export default function ProjectsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch projects with React Query
  const { data: projects = [], isLoading, error, refetch } = useProjects();

  const filteredProjects = useMemo(() => 
    projects.filter((p: Project) => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [searchQuery, projects]
  );

  const stats = useMemo(() => ({
    total: projects.length,
    active: projects.filter((p: Project) => p.status === 'active').length,
    totalBudget: projects.reduce((sum: number, p: Project) => sum + p.budget, 0),
    totalTeam: projects.reduce((sum: number, p: Project) => sum + p.team, 0)
  }), [projects]);

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'active': return 'bg-atlvs-green-500';
      case 'planning': return 'bg-info';
      case 'on-hold': return 'bg-warning';
      case 'completed': return 'bg-grey-500';
    }
  };

  const getStatusLabel = (status: Project['status']) => {
    return status.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Loading state
  if (isLoading) {
    return (
      <AtlvsLayout>
        <ContentLayout
          title="PROJECTS"
          description="Loading projects..."
          variant="atlvs"
          showToolbar={false}
        >
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-atlvs-purple-500" />
          </div>
        </ContentLayout>
      </AtlvsLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <AtlvsLayout>
        <ContentLayout
          title="PROJECTS"
          description="Error loading projects"
          variant="atlvs"
          showToolbar={false}
        >
          <Card variant="atlvs" className="bg-grey-900/50">
            <CardHeader>
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-error mx-auto mb-4" />
                <p className="text-grey-400 mb-4">
                  {error instanceof Error ? error.message : 'Failed to load projects'}
                </p>
                <Button variant="atlvs" onClick={() => refetch()}>
                  Try Again
                </Button>
              </div>
            </CardHeader>
          </Card>
        </ContentLayout>
      </AtlvsLayout>
    );
  }

  return (
    <AtlvsLayout>
      <ContentLayout
        title="PROJECTS"
        description="Manage and track all your event production projects"
        variant="atlvs"
        showToolbar={false}
      >
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8" role="region" aria-label="Project statistics">
          <Card variant="atlvs" className="bg-grey-900/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription className="text-grey-400 mb-1">
                    Total Projects
                  </CardDescription>
                  <CardTitle  aria-label={`${stats.total} total projects`}>
                    {stats.total}
                  </CardTitle>
                </div>
                <div className="p-3 bg-atlvs-green-500/10 rounded-xl" aria-hidden="true">
                  <Grid className="w-6 h-6 text-atlvs-green-500" aria-hidden="true" />
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card variant="atlvs" className="bg-grey-900/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription className="text-grey-400 mb-1">
                    Active Projects
                  </CardDescription>
                  <CardTitle  aria-label={`${stats.active} active projects`}>
                    {stats.active}
                  </CardTitle>
                </div>
                <div className="p-3 bg-info/10 rounded-xl" aria-hidden="true">
                  <TrendingUp className="w-6 h-6 text-info" aria-hidden="true" />
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card variant="atlvs" className="bg-grey-900/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription className="text-grey-400 mb-1">
                    Total Budget
                  </CardDescription>
                  <CardTitle  aria-label={`${formatCurrency(stats.totalBudget)} total budget`}>
                    {formatCurrency(stats.totalBudget)}
                  </CardTitle>
                </div>
                <div className="p-3 bg-accent/100/10 rounded-xl" aria-hidden="true">
                  <DollarSign className="w-6 h-6 text-atlvs-purple-500" aria-hidden="true" />
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card variant="atlvs" className="bg-grey-900/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription className="text-grey-400 mb-1">
                    Team Members
                  </CardDescription>
                  <CardTitle >
                    {stats.totalTeam}
                  </CardTitle>
                </div>
                <div className="p-3 bg-warning-light0/10 rounded-xl">
                  <Users className="w-6 h-6 text-atlvs-orange-500" />
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-grey-400 z-10" />
              <Input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                variant="atlvs"
                className="pl-10"
              />
            </div>
            <Button variant="ghost" size="sm" className="text-grey-400">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Button
                onClick={() => setViewMode('grid')}
                variant={viewMode === 'grid' ? 'atlvs' : 'ghost'}
                size="sm"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => setViewMode('list')}
                variant={viewMode === 'list' ? 'atlvs' : 'ghost'}
                size="sm"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
            <Link href="/atlvs/projects/new">
              <Button variant="atlvs" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </Link>
          </div>
        </div>

        {/* Projects Grid */}
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredProjects.map((project: Project, index: number) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/atlvs/projects/${project.id}`}>
                <Card 
                  variant="atlvs" 
                  className="bg-grey-900/50 hover:bg-grey-900 transition-all cursor-pointer h-full"
                >
                  <CardHeader>
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <CardTitle className="text-white mb-1">
                          {project.name}
                        </CardTitle>
                        <CardDescription className="text-grey-400">
                          {project.client}
                        </CardDescription>
                      </div>
                      <Badge 
                        variant="atlvs-outline"
                        className={`${getStatusColor(project.status)} text-white border-0`}
                      >
                        {getStatusLabel(project.status)}
                      </Badge>
                    </div>

                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-caption text-grey-400">Progress</span>
                        <span className="text-caption text-white">{project.progress}%</span>
                      </div>
                      <div className="h-2 bg-grey-800 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-atlvs-green-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${project.progress}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                        />
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-caption text-grey-400 mb-1">Budget</div>
                        <div className="text-body-sm text-white">
                          {formatCurrency(project.budget)}
                        </div>
                      </div>
                      <div>
                        <div className="text-caption text-grey-400 mb-1">Spent</div>
                        <div className="text-body-sm text-white">
                          {formatCurrency(project.spent)}
                        </div>
                      </div>
                    </div>

                    {/* Meta */}
                    <div className="flex items-center justify-between text-caption text-grey-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(project.endDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{project.team} members</span>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </ContentLayout>
    </AtlvsLayout>
  );
}
