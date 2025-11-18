'use client';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';
export const dynamicParams = true;

import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';

import { useState } from 'react';
import { Play, Pause, Clock, Calendar, TrendingUp, Loader2, AlertCircle } from 'lucide-react';
import { useTimeEntries } from '@/lib/hooks/atlvs/useTasks';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';

interface TimeEntry {
  id: string;
  task: string;
  project: string;
  duration: number;
  date: string;
  status: 'running' | 'paused' | 'completed';
}

export default function TimeTrackingPage() {
  const { data: entries = [], isLoading, error, refetch } = useTimeEntries();
  const [activeTimer] = useState<string | null>(entries.find((e: TimeEntry) => e.status === 'running')?.id || null);

  if (isLoading) {
    return (
      <AtlvsLayout>
        <ContentLayout
          title="TIME TRACKING"
          description="Loading time entries..."
          variant="atlvs"
          showToolbar={false}
        >
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-atlvs-green-500" />
              <p className="text-gray-400">Loading time tracking data...</p>
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
          title="TIME TRACKING"
          description="Error loading time entries"
          variant="atlvs"
          showToolbar={false}
        >
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
              <h2 className="text-h5 font-bebas mb-2">Failed to Load Time Entries</h2>
              <p className="text-gray-400 mb-4">{error.message}</p>
              <Button variant="atlvs" onClick={() => refetch()}>
                Try Again
              </Button>
            </div>
          </div>
        </ContentLayout>
      </AtlvsLayout>
    );
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const totalToday = entries
    .filter(e => e.date === '2024-06-12')
    .reduce((sum, e) => sum + e.duration, 0);

  return (
    <AtlvsLayout>
      <ContentLayout
        title="TIME TRACKING"
        description="Track time spent on tasks and projects"
        variant="atlvs"
        breadcrumbs={[
          { label: 'Tasks', href: '/atlvs/tasks' },
          { label: 'Time Tracking' }
        ]}
      >

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <div className="text-body-sm text-gray-400">Today</div>
                <Clock className="w-5 h-5 text-gray-400" />
              </div>
              <div className="text-h3 font-bebas atlvs-text-gradient">
                {formatDuration(totalToday)}
              </div>
            </CardHeader>
          </Card>

          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <div className="text-body-sm text-gray-400">This Week</div>
                <Calendar className="w-5 h-5 text-gray-400" />
              </div>
              <div className="text-h3 font-bebas text-atlvs-green-500">
                32h 45m
              </div>
            </CardHeader>
          </Card>

          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <div className="text-body-sm text-gray-400">This Month</div>
                <TrendingUp className="w-5 h-5 text-gray-400" />
              </div>
              <div className="text-h3 font-bebas text-atlvs-purple-500">
                142h 30m
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Active Timer */}
        {activeTimer && (
          <Card variant="atlvs" className="bg-gradient-to-r from-atlvs-green-500/10 to-atlvs-purple-500/10 border-atlvs-green-500/50 mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-body-sm text-gray-400 mb-1">Currently Tracking</div>
                  <div className="text-h4 font-bebas mb-1">Design stage layout</div>
                  <div className="text-body-sm text-gray-400">Summer Music Festival</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-h2 font-bebas atlvs-text-gradient">
                    {formatDuration(7200)}
                  </div>
                  <Button variant="ghost" size="sm">
                    <Pause className="w-4 h-4 mr-2" />
                    Pause
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        )}

        {/* Time Entries */}
        <Card variant="atlvs" className="bg-gray-900/50">
          <CardHeader>
            <div className="flex items-center justify-between mb-6">
              <CardTitle>Time Entries</CardTitle>
              <Button variant="atlvs" size="sm">
                <Play className="w-4 h-4 mr-2" />
                Start Timer
              </Button>
            </div>
            <div className="space-y-2">
              {entries.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors">
                  <div className="flex items-center gap-4 flex-1">
                    {entry.status === 'running' ? (
                      <div className="w-3 h-3 rounded-full bg-atlvs-green-500 animate-pulse" />
                    ) : (
                      <div className="w-3 h-3 rounded-full bg-gray-600" />
                    )}
                    <div className="flex-1">
                      <div className="font-medium mb-1">{entry.task}</div>
                      <div className="text-body-sm text-gray-400">{entry.project}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-medium">{formatDuration(entry.duration)}</div>
                      <div className="text-body-sm text-gray-400">{new Date(entry.date).toLocaleDateString()}</div>
                    </div>
                    <Badge
                      variant="atlvs-outline"
                      className={entry.status === 'running' 
                        ? 'bg-atlvs-green-500/20 text-atlvs-green-500' 
                        : 'bg-gray-700/50'
                      }
                    >
                      {entry.status === 'running' ? 'Running' : 'Completed'}
                    </Badge>
                    {entry.status === 'running' && (
                      <Button variant="ghost" size="sm">
                        <Pause className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardHeader>
        </Card>
      </ContentLayout>
    </AtlvsLayout>
  );
}
