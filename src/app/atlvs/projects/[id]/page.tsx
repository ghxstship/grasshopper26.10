'use client';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import { useParams } from 'next/navigation';
import { useState, useMemo } from 'react';
import { motion as _motion } from 'framer-motion';
import { Calendar, Users, DollarSign, FileText, Settings, MoreVertical, TrendingUp, Clock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { GanttChart } from '@/components/atlvs/GanttChart';
import { useProject, useProjectTimeline } from '@/lib/hooks/atlvs/useProjects';
import { BodyText, SectionHeader } from "@/components/atoms/Typography";

// Mock tasks removed - now using real data from useProjectTimeline
/*
const MOCK_TASKS_REMOVED: GanttTask[] = [
  {
    id: '1',
    name: 'Pre-Production',
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-03-01'),
    progress: 100,
    assignee: 'Production Team',
    expanded: true,
    subtasks: [
      {
        id: '1-1',
        name: 'Venue Selection',
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-01-30'),
        progress: 100,
        assignee: 'Sarah Johnson'
      },
      {
        id: '1-2',
        name: 'Budget Planning',
        startDate: new Date('2024-01-20'),
        endDate: new Date('2024-02-15'),
        progress: 100,
        assignee: 'Mike Chen'
      }
    ]
  },
  {
    id: '2',
    name: 'Production Phase',
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-06-30'),
    progress: 65,
    assignee: 'Production Team',
    expanded: true,
    subtasks: [
      {
        id: '2-1',
        name: 'Stage Design',
        startDate: new Date('2024-03-01'),
        endDate: new Date('2024-04-15'),
        progress: 80,
        assignee: 'Design Team'
      },
      {
        id: '2-2',
        name: 'Technical Setup',
        startDate: new Date('2024-04-01'),
        endDate: new Date('2024-06-15'),
        progress: 50,
        assignee: 'Tech Team'
      }
    ]
  },
  {
    id: '3',
    name: 'Event Execution',
    startDate: new Date('2024-07-01'),
    endDate: new Date('2024-07-20'),
    progress: 0,
    assignee: 'Operations Team'
  }
];
*/

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/atlvs/projects/[id]

// API: /api/atlvs/projects/:id
const API_ENDPOINT = '/api/atlvs/projects/:id';

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'budget' | 'team' | 'files'>('overview');
  
  const { data: _projectData, isLoading, error, refetch } = useProject(projectId);
  const { data: timelineData } = useProjectTimeline(projectId);
  
  // Transform timeline data to Gantt tasks
  const tasks = useMemo(() => {
    if (!timelineData?.tasks) return [];
    return timelineData.tasks.map((task: any) => ({
      id: task.id,
      name: task.name || task.title,
      startDate: new Date(task.startDate),
      endDate: new Date(task.endDate || task.dueDate),
      progress: task.progress || 0,
      assignee: task.assignee?.name || task.assignedTo?.name || 'Unassigned',
      subtasks: task.subtasks?.map((sub: any) => ({
        id: sub.id,
        name: sub.name || sub.title,
        startDate: new Date(sub.startDate),
        endDate: new Date(sub.endDate || sub.dueDate),
        progress: sub.progress || 0,
        assignee: sub.assignee?.name || 'Unassigned'
      }))
    }));
  }, [timelineData]);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'budget', label: 'Budget' },
    { id: 'team', label: 'Team' },
    { id: 'files', label: 'Files' }
  ];
  
  if (isLoading) {
    return (
      <AtlvsLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-atlvs-green-500" />
            <BodyText className="text-grey-400">Loading project...</BodyText>
          </div>
        </div>
      </AtlvsLayout>
    );
  }
  
  if (error) {
    return (
      <AtlvsLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
            <SectionHeader className="mb-2">Failed to Load Project</SectionHeader>
            <p className="text-grey-400 mb-4">{error.message}</p>
            <Button variant="atlvs" onClick={() => refetch()}>
              Try Again
            </Button>
          </div>
        </div>
      </AtlvsLayout>
    );
  }

  return (
    <AtlvsLayout>
      <ContentLayout
        title="SUMMER MUSIC FESTIVAL 2024"
        description={`Live Nation • Project #${params.id}`}
        variant="atlvs"
        showToolbar={true}
        breadcrumbs={[
          { label: 'Projects', href: '/atlvs/projects' },
          { label: 'Summer Music Festival 2024' }
        ]}
      >
        <div className="flex items-center gap-2 mb-6">
          <Badge variant="atlvs-outline" className="bg-atlvs-green-500 text-white border-0">
            Active
          </Badge>
          <Button variant="atlvs-outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button variant="ghost" size="sm" className="text-grey-400">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card variant="atlvs" className="bg-grey-900/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription className="text-grey-400 mb-1 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Progress
                  </CardDescription>
                  <CardTitle className="text-atlvs-green-500">
                    65%
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card variant="atlvs" className="bg-grey-900/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription className="text-grey-400 mb-1 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Tasks Complete
                  </CardDescription>
                  <CardTitle >
                    152/234
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card variant="atlvs" className="bg-grey-900/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription className="text-grey-400 mb-1 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Budget Used
                  </CardDescription>
                  <CardTitle >
                    $1.6M/$2.5M
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card variant="atlvs" className="bg-grey-900/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription className="text-grey-400 mb-1 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Days Remaining
                  </CardDescription>
                  <CardTitle >
                    45
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Tabs */}
        <div className="border-b border-grey-800 mb-8">
          <div className="flex gap-8">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                variant="ghost"
                className={`pb-4 rounded-none ${ activeTab === tab.id ? 'text-atlvs-green-500 border-b-2 border-atlvs-green-500' : 'text-grey-400 hover:text-grey-300' }`}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Description */}
                <Card variant="atlvs" className="bg-grey-900/50">
                  <CardHeader>
                    <CardTitle className="mb-4">Project Description</CardTitle>
                    <CardDescription className="text-grey-300">
                      A three-day outdoor music festival featuring 50+ artists across 4 stages. 
                      Expected attendance of 75,000 people per day. Full production including 
                      stage design, lighting, sound, video, and artist hospitality.
                    </CardDescription>
                  </CardHeader>
                </Card>

                {/* Recent Activity */}
                <Card variant="atlvs" className="bg-grey-900/50">
                  <CardHeader>
                    <CardTitle className="mb-4">Recent Activity</CardTitle>
                    <div className="space-y-4">
                      {[
                        { action: 'Stage design approved', user: 'Sarah Johnson', time: '2 hours ago', type: 'success' },
                        { action: 'Budget revision submitted', user: 'Mike Chen', time: '5 hours ago', type: 'info' },
                        { action: 'Vendor contract signed', user: 'Alex Kim', time: '1 day ago', type: 'success' },
                        { action: 'Issue reported: Sound system delay', user: 'Tech Team', time: '2 days ago', type: 'warning' }
                      ].map((activity, index) => (
                        <div key={index} className="flex items-start gap-3 pb-4 border-b border-grey-800 last:border-0">
                          <div className={`w-2 h-2 rounded-full mt-2 ${ activity.type === 'success' ? 'bg-atlvs-green-500' : activity.type === 'warning' ? 'bg-warning' : 'bg-info' }`} />
                          <div className="flex-1">
                            <p className="text-white">{activity.action}</p>
                            <p className="text-body-sm text-grey-400 mt-1">
                              {activity.user} • {activity.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardHeader>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Project Details */}
                <Card variant="atlvs" className="bg-grey-900/50">
                  <CardHeader>
                    <CardTitle className="mb-4">Project Details</CardTitle>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-body-sm">
                        <Calendar className="w-4 h-4 text-grey-400" />
                        <div>
                          <div className="text-grey-400">Start Date</div>
                          <div className="text-white">Jan 15, 2024</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-body-sm">
                        <Calendar className="w-4 h-4 text-grey-400" />
                        <div>
                          <div className="text-grey-400">End Date</div>
                          <div className="text-white">Jul 20, 2024</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-body-sm">
                        <Users className="w-4 h-4 text-grey-400" />
                        <div>
                          <div className="text-grey-400">Team Size</div>
                          <div className="text-white">45 members</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-body-sm">
                        <FileText className="w-4 h-4 text-grey-400" />
                        <div>
                          <div className="text-grey-400">Documents</div>
                          <div className="text-white">127 files</div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                {/* Key Milestones */}
                <Card variant="atlvs" className="bg-grey-900/50">
                  <CardHeader>
                    <CardTitle className="mb-4">Key Milestones</CardTitle>
                    <div className="space-y-3">
                      {[
                        { name: 'Venue Secured', date: 'Jan 30', completed: true },
                        { name: 'Artist Lineup Confirmed', date: 'Mar 15', completed: true },
                        { name: 'Ticket Sales Launch', date: 'Apr 1', completed: true },
                        { name: 'Production Setup', date: 'Jul 10', completed: false },
                        { name: 'Festival Weekend', date: 'Jul 18-20', completed: false }
                      ].map((milestone, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {milestone.completed ? (
                              <CheckCircle2 className="w-4 h-4 text-atlvs-green-500" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-grey-500" />
                            )}
                            <span className={`text-body-sm ${ milestone.completed ? 'text-white' : 'text-grey-400' }`}>
                              {milestone.name}
                            </span>
                          </div>
                          <span className="text-caption text-grey-500">{milestone.date}</span>
                        </div>
                      ))}
                    </div>
                  </CardHeader>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div>
              <GanttChart
                tasks={tasks}
                startDate={new Date('2024-01-01')}
                endDate={new Date('2024-08-01')}
              />
            </div>
          )}

          {activeTab === 'budget' && (
            <Card variant="atlvs" className="bg-grey-900/50">
              <CardHeader>
                <CardTitle>Budget tracking coming soon...</CardTitle>
              </CardHeader>
            </Card>
          )}

          {activeTab === 'team' && (
            <Card variant="atlvs" className="bg-grey-900/50">
              <CardHeader>
                <CardTitle>Team management coming soon...</CardTitle>
              </CardHeader>
            </Card>
          )}

          {activeTab === 'files' && (
            <Card variant="atlvs" className="bg-grey-900/50">
              <CardHeader>
                <CardTitle>File management coming soon...</CardTitle>
              </CardHeader>
            </Card>
          )}
        </div>
      </ContentLayout>
    </AtlvsLayout>
  );
}
