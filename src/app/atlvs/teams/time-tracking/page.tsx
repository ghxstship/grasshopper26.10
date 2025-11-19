'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { Clock, TrendingUp, Calendar, User, Loader2, AlertCircle } from 'lucide-react';
import { useTeams } from '@/lib/hooks/atlvs/useTeams';
import { Button } from '@/components/atoms/Button';
import { SectionHeader } from "@/components/atoms/Typography";

interface _TimeLog {

  id: string;
  memberName: string;
  project: string;
  task: string;
  date: string;
  hours: number;
}

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/atlvs/teams/time-tracking

export default function TeamTimeTrackingPage() {
  const { data, isLoading, error, refetch } = useTeams();
  const timeLogs = (data as any)?.timeLogs || [];

  if (isLoading) {
    return (
      <AtlvsLayout>
        <ContentLayout
          title="TEAM TIME TRACKING"
          description="Loading..."
          breadcrumbs={[
            { label: 'Teams', href: '/atlvs/teams' },
            { label: 'Time Tracking' }
          ]}
        >
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-12 h-12 animate-spin text-atlvs-green-500" />
          </div>
        </ContentLayout>
      </AtlvsLayout>
    );
  }

  if (error) {
    return (
      <AtlvsLayout>
        <ContentLayout
          title="TEAM TIME TRACKING"
          description="Error loading data"
          breadcrumbs={[
            { label: 'Teams', href: '/atlvs/teams' },
            { label: 'Time Tracking' }
          ]}
        >
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
              <Button variant="atlvs" onClick={() => refetch()}>Try Again</Button>
            </div>
          </div>
        </ContentLayout>
      </AtlvsLayout>
    );
  }

  const totalHoursToday = timeLogs.reduce((sum: number, log: any) => sum + (log.hours || 0), 0);
  const avgHoursPerMember = timeLogs.length > 0 ? totalHoursToday / new Set(timeLogs.map((l: any) => l.memberName)).size : 0;

  return (
    <AtlvsLayout>
      <ContentLayout
        title="TEAM TIME TRACKING"
        description="Monitor team hours and productivity"
        breadcrumbs={[
          { label: 'Teams', href: '/atlvs/teams' },
          { label: 'Time Tracking' }
        ]}
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-grey-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-body-sm text-grey-600 mb-1">Today Total</div>
              <div className="text-grey-900">{totalHoursToday}h</div>
            </div>
            <Clock className="w-8 h-8 text-info" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-grey-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-body-sm text-grey-600 mb-1">This Week</div>
              <div className="text-grey-900">142h</div>
            </div>
            <Calendar className="w-8 h-8 text-success" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-grey-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-body-sm text-grey-600 mb-1">Avg/Member</div>
              <div className="text-grey-900">{avgHoursPerMember.toFixed(1)}h</div>
            </div>
            <User className="w-8 h-8 text-atlvs-purple-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-grey-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-body-sm text-grey-600 mb-1">Trend</div>
              <div className="text-success">+12%</div>
            </div>
            <TrendingUp className="w-8 h-8 text-success" />
          </div>
        </div>
          </div>

          <div className="bg-white rounded-lg border border-grey-200">
        <div className="p-4 border-b border-grey-200">
          <SectionHeader className="text-grey-900">Recent Time Logs</SectionHeader>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-grey-50 border-b border-grey-200">
              <tr>
                <th className="px-4 py-3 text-left text-body-sm text-grey-900">Member</th>
                <th className="px-4 py-3 text-left text-body-sm text-grey-900">Project</th>
                <th className="px-4 py-3 text-left text-body-sm text-grey-900">Task</th>
                <th className="px-4 py-3 text-left text-body-sm text-grey-900">Date</th>
                <th className="px-4 py-3 text-right text-body-sm text-grey-900">Hours</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-grey-200">
              {timeLogs.map(log => (
                <tr key={log.id} className="hover:bg-grey-50">
                  <td className="px-4 py-3 text-body-sm text-grey-900">{log.memberName}</td>
                  <td className="px-4 py-3 text-body-sm text-grey-600">{log.project}</td>
                  <td className="px-4 py-3 text-body-sm text-grey-600">{log.task}</td>
                  <td className="px-4 py-3 text-body-sm text-grey-600">
                    {new Date(log.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-body-sm text-grey-900 text-right">
                    {log.hours}h
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
          </div>
        </div>
      </ContentLayout>
    </AtlvsLayout>
  );
}
