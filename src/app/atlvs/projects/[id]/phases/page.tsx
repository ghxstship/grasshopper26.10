'use client';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import { useState as _useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Edit, Trash2, Calendar, CheckCircle, Clock, Loader2, AlertCircle } from 'lucide-react';
import { useProjectPhases } from '@/lib/hooks/atlvs/useProjects';
import Link from 'next/link';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { BodyText, HeroTitle, SectionHeader } from "@/components/atoms/Typography";

interface _Phase {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'delayed';
  progress: number;
  tasks: number;
  completedTasks: number;
}

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/atlvs/projects/[id]/phases

export default function ProjectPhasesPage({ params }: { params: { id: string } }) {
  const { data: phases = [], isLoading, error, refetch } = useProjectPhases(params.id);

  if (isLoading) {
    return (
      <AtlvsLayout>
        <ContentLayout
          title="PROJECT PHASES"
          description="Loading phases..."
          variant="atlvs"
          showToolbar={false}
        >
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-atlvs-green-500" />
              <BodyText className="text-grey-400">Loading project phases...</BodyText>
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
          title="PROJECT PHASES"
          description="Error loading phases"
          variant="atlvs"
          showToolbar={false}
        >
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
              <SectionHeader className="mb-2">Failed to Load Phases</SectionHeader>
              <p className="text-grey-400 mb-4">{error.message}</p>
              <Button variant="atlvs" onClick={() => refetch()}>
                Try Again
              </Button>
            </div>
          </div>
        </ContentLayout>
      </AtlvsLayout>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-atlvs-green-500/20 text-atlvs-green-500 border-atlvs-green-500/50';
      case 'in-progress': return 'bg-info-light text-info border-info-border';
      case 'delayed': return 'bg-error-light text-error border-error-border';
      case 'not-started': return 'bg-grey-500/20 text-grey-500 border-grey-500/50';
      default: return 'bg-grey-500/20 text-grey-500 border-grey-500/50';
    }
  };

  return (
    <AtlvsLayout>
      <ContentLayout
        title="PROJECT PHASES"
        description="Manage project timeline and phases"
        variant="atlvs"
        breadcrumbs={[
          { label: 'Projects', href: '/atlvs/projects' },
          { label: 'Project Details', href: `/atlvs/projects/${params.id}` },
          { label: 'Phases', href: `/atlvs/projects/${params.id}/phases` }
        ]}
      >
        <div className="min-h-screen bg-black text-white p-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <Link href={`/atlvs/projects/${params.id}`}>
                <Button variant="ghost" size="sm" className="mb-4">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Project
                </Button>
              </Link>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <HeroTitle className="mb-2 atlvs-text-gradient">
                      PROJECT PHASES
                    </HeroTitle>
                    <BodyText className="text-grey-400">
                      Manage project phases and milestones
                    </BodyText>
                  </div>
                  <Button variant="atlvs">
                    <Plus className="w-4 h-4 mr-2" />
                    Add _Phase
                  </Button>
                </div>
              </motion.div>
            </div>

        {/* Timeline Overview */}
        <Card variant="atlvs" className="bg-grey-900/50 mb-6">
          <CardHeader>
            <CardTitle className="mb-6">Timeline Overview</CardTitle>
            <div className="relative">
              {/* Timeline Bar */}
              <div className="h-2 bg-grey-800 rounded-full overflow-hidden mb-8">
                <div className="h-full bg-gradient-to-r from-atlvs-green-500 to-atlvs-purple-500 w-2/5" />
              </div>

              {/* _Phase Markers */}
              <div className="flex justify-between text-body-sm">
                {phases.map((phase) => (
                  <div key={phase.id} className="text-center flex-1">
                    <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${ phase.status === 'completed' ? 'bg-atlvs-green-500' : phase.status === 'in-progress' ? 'bg-info' : 'bg-grey-600' }`} />
                    <div className="text-grey-400">{phase.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Phases List */}
        <div className="space-y-4">
          {phases.map((phase, index) => (
            <motion.div
              key={phase.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card variant="atlvs" className="bg-grey-900/50">
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${ phase.status === 'completed' ? 'bg-atlvs-green-500' : phase.status === 'in-progress' ? 'bg-info' : 'bg-grey-700' }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 >{phase.name}</h3>
                          <Badge variant="atlvs-outline" className={getStatusColor(phase.status)}>
                            {phase.status === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                            {phase.status === 'in-progress' && <Clock className="w-3 h-3 mr-1" />}
                            {phase.status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-body-sm text-grey-400 mb-4">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(phase.startDate).toLocaleDateString()} - {new Date(phase.endDate).toLocaleDateString()}
                          </span>
                          <span>•</span>
                          <span>{phase.completedTasks}/{phase.tasks} tasks completed</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-body-sm">
                            <span className="text-grey-400">Progress</span>
                            <span className="font-medium">{phase.progress}%</span>
                          </div>
                          <div className="w-full h-2 bg-grey-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all ${ phase.status === 'completed' ? 'bg-atlvs-green-500' : phase.status === 'in-progress' ? 'bg-info' : 'bg-grey-600' }`}
                              style={{ width: `${phase.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-error">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
      </ContentLayout>
    </AtlvsLayout>
  );
}
