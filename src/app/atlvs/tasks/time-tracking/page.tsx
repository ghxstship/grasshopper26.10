'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';

import { useState } from 'react';
import { Play, Pause, Clock, Calendar, TrendingUp,  } from 'lucide-react';
import { useTimeEntries } from '@/lib/hooks/atlvs/useTimeEntries';
import { Button } from '@/components/atoms/Button';
import { SectionHeader } from "@/components/atoms/Typography";

interface TimeEntry {
  id: string;
  taskName: string;
  date: string;
  duration: number; // minutes
  status: 'running' | 'paused' | 'completed';
}

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/atlvs/tasks/time-tracking

export default function TimeTrackingPage() {  
  const { data: timeEntriesData,  } = useTimeEntries();
  const [_activeTimer, _setActiveTimer] = useState<string | null>(null);

  const timeEntries: TimeEntry[] = (timeEntriesData as any) || [
    { id: '1', taskName: 'Stage setup coordination', date: '2025-11-14', duration: 145, status: 'completed' },
    { id: '2', taskName: 'Vendor communication', date: '2025-11-14', duration: 32, status: 'running' },
    { id: '3', taskName: 'Budget review', date: '2025-11-13', duration: 90, status: 'completed' }
  ];

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const totalToday = timeEntries
    .filter(e => e.date === '2025-11-14')
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-grey-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-body-sm text-grey-600 mb-1">Today&apos;s Total</div>
              <div className="text-grey-900">{formatDuration(totalToday)}</div>
            </div>
            <Clock className="w-8 h-8 text-info" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-grey-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-body-sm text-grey-600 mb-1">This Week</div>
              <div className="text-grey-900">28h 45m</div>
            </div>
            <Calendar className="w-8 h-8 text-success" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-grey-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-body-sm text-grey-600 mb-1">Avg Per Day</div>
              <div className="text-grey-900">5h 45m</div>
            </div>
            <TrendingUp className="w-8 h-8 text-atlvs-purple-500" />
          </div>
        </div>
      </div>

      {/* Time Entries */}
      <div className="bg-white rounded-lg border border-grey-200">
        <div className="p-4 border-b border-grey-200">
          <SectionHeader className="text-grey-900">Recent Entries</SectionHeader>
        </div>
        <div className="divide-y divide-grey-200">
          {timeEntries.map(entry => (
            <div key={entry.id} className="p-4 hover:bg-grey-50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-semibold text-grey-900 mb-1">{entry.taskName}</div>
                  <div className="text-body-sm text-grey-600">{new Date(entry.date).toLocaleDateString()}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-semibold text-grey-900">{formatDuration(entry.duration)}</div>
                    {entry.status === 'running' && (
                      <div className="text-caption text-success">Running</div>
                    )}
                  </div>
                  {entry.status === 'running' ? (
                    <Button variant="ghost" size="sm" className="p-2 bg-destructive/20 text-destructive hover:bg-destructive/30">
                      <Pause className="w-5 h-5" />
                    </Button>
                  ) : (
                    <Button variant="ghost" size="sm" className="p-2 bg-success-light text-success hover:bg-success/30">
                      <Play className="w-5 h-5" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      </ContentLayout>
    </AtlvsLayout>
  );
}
