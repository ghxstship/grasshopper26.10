'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { useState } from 'react';
import { ChevronRight, Calendar, CheckCircle, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { usePhases } from '@/lib/hooks/atlvs/usePhases';

interface Phase {
  id: string;
  name: string;
  status: 'completed' | 'active' | 'upcoming' | 'delayed';
  startDate: string;
  endDate: string;
  progress: number;
  tasks?: number;
  completedTasks?: number;
  tasksCompleted?: number;
  tasksTotal?: number;
  budget?: number;
  budgetUsed?: number;
}

export default function ProjectPhasesPage() {
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);
  const { data: phases = [] as Phase[], isLoading, error, refetch } = usePhases();

  if (isLoading) {
    return (
      <AtlvsLayout>
        <ContentLayout
          title="PROJECT PHASES"
          description="Loading phases..."
          variant="atlvs"
          breadcrumbs={[
            { label: 'Projects', href: '/atlvs/projects' },
            { label: 'Phases' }
          ]}
        >
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-atlvs-green-500" />
              <p className="text-gray-400">Loading project phases...</p>
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
          breadcrumbs={[
            { label: 'Projects', href: '/atlvs/projects' },
            { label: 'Phases' }
          ]}
        >
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
              <h2 className="text-h5 font-bebas mb-2">Failed to Load Phases</h2>
              <p className="text-gray-400 mb-4">{error.message}</p>
              <Button variant="atlvs" onClick={() => refetch()}>Try Again</Button>
            </div>
          </div>
        </ContentLayout>
      </AtlvsLayout>
    );
  }

  const _mockPhases = [
    {
      id: '1',
      name: 'Pre-Production',
      status: 'completed',
      startDate: '2025-01-01',
      endDate: '2025-02-15',
      progress: 100,
      tasksCompleted: 45,
      tasksTotal: 45,
      budget: 50000,
      budgetUsed: 48500
    },
    {
      id: '2',
      name: 'Production Setup',
      status: 'active',
      startDate: '2025-02-16',
      endDate: '2025-03-30',
      progress: 65,
      tasksCompleted: 32,
      tasksTotal: 50,
      budget: 120000,
      budgetUsed: 75000
    },
    {
      id: '3',
      name: 'Event Execution',
      status: 'upcoming',
      startDate: '2025-04-01',
      endDate: '2025-04-05',
      progress: 0,
      tasksCompleted: 0,
      tasksTotal: 78,
      budget: 200000,
      budgetUsed: 0
    },
    {
      id: '4',
      name: 'Post-Event Wrap',
      status: 'upcoming',
      startDate: '2025-04-06',
      endDate: '2025-04-20',
      progress: 0,
      tasksCompleted: 0,
      tasksTotal: 25,
      budget: 30000,
      budgetUsed: 0
    }
  ];

  const _getStatusColor = (status: Phase['status']) => {
    switch (status) {
      case 'completed': return 'bg-success-light text-success-foreground';
      case 'active': return 'bg-info-light text-info-foreground';
      case 'delayed': return 'bg-destructive/20 text-destructive-foreground';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Phase['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-success" />;
      case 'active': return <Clock className="w-5 h-5 text-info" />;
      case 'delayed': return <AlertCircle className="w-5 h-5 text-error" />;
      default: return <Calendar className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <AtlvsLayout>
      <ContentLayout
        title="PROJECT PHASES"
        description="Track progress through each phase of your project"
        variant="atlvs"
        breadcrumbs={[
          { label: 'Projects', href: '/atlvs/projects' },
          { label: 'Phases' }
        ]}
      >
        {/* Timeline View */}
        <Card variant="atlvs" className="bg-gray-900/50 mb-6">
          <CardContent className="pt-6">
            <h2 className="text-h6 font-oswald text-white mb-4">Phase Timeline</h2>
        <div className="relative">
          {phases.map((phase, index) => (
            <div key={phase.id} className="relative">
              {/* Connector Line */}
              {index < phases.length - 1 && (
                <div className="absolute left-6 top-12 w-0.5 h-full bg-gray-700" />
              )}

              {/* Phase Card */}
              <div
                className={`mb-6 flex items-start gap-4 cursor-pointer ${
                  selectedPhase === phase.id ? 'bg-accent/100/10' : ''
                } p-4 rounded-lg transition-colors hover:bg-gray-800/50`}
                onClick={() => setSelectedPhase(phase.id)}
              >
                {/* Icon */}
                <div className="flex-shrink-0 z-10 bg-gray-900">
                  {getStatusIcon(phase.status)}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="text-h6 font-oswald text-white">{phase.name}</h3>
                      <p className="text-body-sm text-gray-400 font-share-tech">
                        {new Date(phase.startDate).toLocaleDateString()} - {new Date(phase.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="atlvs">
                      {phase.status.charAt(0).toUpperCase() + phase.status.slice(1)}
                    </Badge>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-body-sm text-gray-400 font-share-tech mb-1">
                      <span>Progress</span>
                      <span>{phase.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full transition-all"
                        style={{ width: `${phase.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 text-body-sm font-share-tech">
                    <div>
                      <span className="text-gray-400">Tasks: </span>
                      <span className="font-medium text-white">
                        {phase.tasksCompleted}/{phase.tasksTotal}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Budget: </span>
                      <span className="font-medium text-white">
                        ${phase.budgetUsed.toLocaleString()} / ${phase.budget.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-gray-600" />
              </div>
            </div>
          ))}
          </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card variant="atlvs" className="bg-gray-900/50">
            <CardContent className="pt-6">
              <div className="text-body-sm text-gray-400 font-share-tech mb-1">Total Phases</div>
              <div className="text-h4 font-bebas text-white">{phases.length}</div>
            </CardContent>
          </Card>
          <Card variant="atlvs" className="bg-gray-900/50">
            <CardContent className="pt-6">
              <div className="text-body-sm text-gray-400 font-share-tech mb-1">Completed</div>
              <div className="text-h4 font-bebas text-success">
                {phases.filter(p => p.status === 'completed').length}
              </div>
            </CardContent>
          </Card>
          <Card variant="atlvs" className="bg-gray-900/50">
            <CardContent className="pt-6">
              <div className="text-body-sm text-gray-400 font-share-tech mb-1">Active</div>
              <div className="text-h4 font-bebas text-info">
                {phases.filter(p => p.status === 'active').length}
              </div>
            </CardContent>
          </Card>
          <Card variant="atlvs" className="bg-gray-900/50">
            <CardContent className="pt-6">
              <div className="text-body-sm text-gray-400 font-share-tech mb-1">Upcoming</div>
              <div className="text-h4 font-bebas text-gray-400">
                {phases.filter(p => p.status === 'upcoming').length}
              </div>
            </CardContent>
          </Card>
        </div>
      </ContentLayout>
    </AtlvsLayout>
  );
}
