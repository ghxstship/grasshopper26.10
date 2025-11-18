'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { CheckCircle, XCircle, Clock, Calendar, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { useTeams } from '@/lib/hooks/atlvs/useTeams';

interface _TeamMember {

  id: string;
  name: string;
  role: string;
  status: 'available' | 'busy' | 'away' | 'offline';
  nextAvailable: string;
  hoursThisWeek: number;
}

export default function TeamAvailabilityPage() {
  const { data: teamMembers = [], isLoading, error, refetch } = useTeams();

  if (isLoading) {
    return (
      <AtlvsLayout>
        <ContentLayout
          title="TEAM AVAILABILITY"
          description="Loading availability..."
          breadcrumbs={[
            { label: 'Teams', href: '/atlvs/teams' },
            { label: 'Availability' }
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
          title="TEAM AVAILABILITY"
          description="Error loading availability"
          breadcrumbs={[
            { label: 'Teams', href: '/atlvs/teams' },
            { label: 'Availability' }
          ]}
        >
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
              <p className="text-gray-400 mb-4">{error.message}</p>
              <button onClick={() => refetch()} className="px-4 py-2 bg-atlvs-green-500 rounded">Try Again</button>
            </div>
          </div>
        </ContentLayout>
      </AtlvsLayout>
    );
  }

  const typedTeamMembers = teamMembers as any[];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'busy':
        return <Clock className="w-5 h-5 text-warning" />;
      case 'away':
        return <XCircle className="w-5 h-5 text-error" />;
      default:
        return <XCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-atlvs-green-500/20 text-atlvs-green-500';
      case 'busy':
        return 'bg-warning/20 text-warning';
      case 'away':
        return 'bg-error/20 text-error';
      default:
        return 'bg-gray-700 text-gray-300';
    }
  };

  const availableCount = typedTeamMembers.filter((m: any) => m.status === 'available').length;
  const busyCount = typedTeamMembers.filter((m: any) => m.status === 'busy').length;

  return (
    <AtlvsLayout>
      <ContentLayout
        title="TEAM AVAILABILITY"
        description="Real-time team member availability status"
        breadcrumbs={[
          { label: 'Teams', href: '/atlvs/teams' },
          { label: 'Availability' }
        ]}
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-body-sm text-gray-600 mb-1">Total Team</div>
          <div className="text-h4 text-gray-900">{typedTeamMembers.length}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-body-sm text-gray-600 mb-1">Available</div>
          <div className="text-h4 text-success">{availableCount}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-body-sm text-gray-600 mb-1">Busy</div>
          <div className="text-h4 text-warning">{busyCount}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-body-sm text-gray-600 mb-1">Away</div>
          <div className="text-h4 text-error">
            {typedTeamMembers.filter((m: any) => m.status === 'away').length}
          </div>
        </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-h6 text-gray-900">Team Members</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {typedTeamMembers.map((member: any) => (
            <div key={member.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 bg-success-light rounded-full flex items-center justify-center text-success-foreground">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{member.name}</div>
                    <div className="text-body-sm text-gray-600">{member.role}</div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-body-sm text-gray-600">Hours this week</div>
                    <div className="font-semibold text-gray-900">{member.hoursThisWeek}h</div>
                  </div>

                  <div className="text-right min-w-[120px]">
                    <div className="text-body-sm text-gray-600 mb-1">Next available</div>
                    <div className="flex items-center gap-2 justify-end">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-body-sm text-gray-900">{member.nextAvailable}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {getStatusIcon(member.status)}
                    <span className={`px-3 py-1 rounded-full text-body-sm ${getStatusColor(member.status)}`}>
                      {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
          </div>
        </div>
      </ContentLayout>
    </AtlvsLayout>
  );
}
