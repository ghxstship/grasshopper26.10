'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { Shield, Edit, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/atoms/Button';
import { useTeamRoles } from '@/lib/hooks/atlvs/useTeams';

export default function TeamRolesPage() {
  const router = useRouter();
  const [_searchQuery, _setSearchQuery] = useState('');
  const { data: roles = [], isLoading, error, refetch } = useTeamRoles();

  if (isLoading) {
    return (
      <AtlvsLayout>
        <ContentLayout
          title="TEAM ROLES"
          description="Loading roles..."
          variant="atlvs"
          breadcrumbs={[
            { label: 'Teams', href: '/atlvs/teams' },
            { label: 'Roles' }
          ]}
        >
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-atlvs-green-500" />
              <p className="text-gray-400">Loading team roles...</p>
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
          title="TEAM ROLES"
          description="Error loading roles"
          variant="atlvs"
          breadcrumbs={[
            { label: 'Teams', href: '/atlvs/teams' },
            { label: 'Roles' }
          ]}
        >
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
              <h2 className="text-h5 font-bebas mb-2">Failed to Load Roles</h2>
              <p className="text-gray-400 mb-4">{error.message}</p>
              <Button variant="atlvs" onClick={() => refetch()}>Try Again</Button>
            </div>
          </div>
        </ContentLayout>
      </AtlvsLayout>
    );
  }

  const _mockRoles = [
    {
      id: '1',
      name: 'Production Manager',
      description: 'Full access to all production features and team management',
      permissions: ['manage_projects', 'manage_team', 'manage_budget', 'approve_expenses'],
      memberCount: 3,
      color: 'purple'
    },
    {
      id: '2',
      name: 'Technical Director',
      description: 'Manage technical aspects, equipment, and stage operations',
      permissions: ['manage_assets', 'view_projects', 'create_tasks'],
      memberCount: 5,
      color: 'blue'
    },
    {
      id: '3',
      name: 'Team Member',
      description: 'Standard access to assigned tasks and projects',
      permissions: ['view_projects', 'update_tasks', 'log_time'],
      memberCount: 24,
      color: 'green'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      purple: 'bg-accent/20 text-accent border-accent',
      blue: 'bg-info-light text-info-foreground border-info-border',
      green: 'bg-success-light text-success-foreground border-success-border'
    };
    return colors[color] || colors.green;
  };

  return (
    <AtlvsLayout>
      <ContentLayout
        title="TEAM ROLES"
        description="Manage roles and permissions for your team"
        breadcrumbs={[
          { label: 'Teams', href: '/atlvs/teams' },
          { label: 'Roles' }
        ]}
        actions={[
          {
            label: 'Create Role',
            onClick: () => router.push('/atlvs/teams/roles/create'),
            variant: 'atlvs' as const
          }
        ]}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map(role => (
          <div key={role.id} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-lg ${getColorClasses(role.color)}`}>
                <Shield className="w-6 h-6" />
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-error hover:bg-destructive/10">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <h3 className="text-h6 text-gray-900 mb-2">{role.name}</h3>
            <p className="text-body-sm text-gray-600 mb-4">{role.description}</p>

            <div className="mb-4">
              <div className="text-body-sm text-gray-700 mb-2">Permissions:</div>
              <div className="flex flex-wrap gap-2">
                {role.permissions.map(perm => (
                  <span key={perm} className="px-2 py-1 bg-gray-100 text-gray-700 text-caption rounded">
                    {perm.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <span className="text-body-sm text-gray-600">{role.memberCount} members</span>
            </div>
          </div>
        ))}
        </div>
      </ContentLayout>
    </AtlvsLayout>
  );
}
