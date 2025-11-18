'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { motion } from 'framer-motion';
import { Mail, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { Select } from '@/components/atoms/Select';
import { useTeams } from '@/lib/hooks/atlvs/useTeams';

export default function TeamSettingsPage() {
  const { data: members = [], isLoading, error, refetch } = useTeams();

  if (isLoading) {
    return (
      <AtlvsLayout>
        <ContentLayout
          title="TEAM SETTINGS"
          description="Loading team members..."
          breadcrumbs={[
            { label: 'Settings', href: '/atlvs/settings' },
            { label: 'Team' }
          ]}
        >
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-atlvs-green-500" />
              <p className="text-gray-400">Loading team settings...</p>
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
          title="TEAM SETTINGS"
          description="Error loading team"
          breadcrumbs={[
            { label: 'Settings', href: '/atlvs/settings' },
            { label: 'Team' }
          ]}
        >
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
              <h2 className="text-xl font-bebas mb-2">Failed to Load Team Settings</h2>
              <p className="text-gray-400 mb-4">{error.message}</p>
              <Button variant="atlvs" onClick={() => refetch()}>Try Again</Button>
            </div>
          </div>
        </ContentLayout>
      </AtlvsLayout>
    );
  }

  return (
    <AtlvsLayout>
      <ContentLayout
        title="TEAM SETTINGS"
        description="Manage team members and permissions"
        breadcrumbs={[
          { label: 'Settings', href: '/atlvs/settings' },
          { label: 'Team' }
        ]}
        actions={[
          {
            label: 'Invite Member',
            onClick: () => console.log('Invite Member'),
            variant: 'atlvs' as const
          }
        ]}
      >
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <div className="text-sm text-gray-400 mb-1">Total Members</div>
              <div className="text-3xl font-bebas atlvs-text-gradient">24</div>
            </CardHeader>
          </Card>
          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <div className="text-sm text-gray-400 mb-1">Active</div>
              <div className="text-3xl font-bebas text-atlvs-green-500">21</div>
            </CardHeader>
          </Card>
          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <div className="text-sm text-gray-400 mb-1">Pending</div>
              <div className="text-3xl font-bebas text-warning">3</div>
            </CardHeader>
          </Card>
          </div>

          <Card variant="atlvs" className="bg-gray-900/50">
          <CardHeader>
            <CardTitle className="mb-6">Team Members</CardTitle>
            <div className="space-y-3">
              {members.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-atlvs-green-500 to-atlvs-purple-500 flex items-center justify-center font-bebas text-xl">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium mb-1">{member.name}</div>
                      <div className="text-sm text-gray-400 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {member.email}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="atlvs-outline"
                      className={member.status === 'active' ? 'bg-atlvs-green-500/20 text-atlvs-green-500 border-atlvs-green-500/50' : 'bg-warning-light text-warning border-warning-border'}
                    >
                      {member.status}
                    </Badge>
                    <Select variant="atlvs" className="px-3 py-1 text-sm">
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                      <option value="member">Member</option>
                    </Select>
                    <Button variant="ghost" size="sm" className="text-error">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardHeader>
          </Card>

          <Card variant="atlvs" className="bg-gray-900/50">
          <CardHeader>
            <CardTitle className="mb-6">Pending Invitations</CardTitle>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                <div>
                  <div className="font-medium mb-1">taylor@example.com</div>
                  <div className="text-sm text-gray-400">Invited 2 days ago • Role: Member</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">Resend</Button>
                  <Button variant="ghost" size="sm" className="text-error">Cancel</Button>
                </div>
              </div>
            </div>
          </CardHeader>
          </Card>
        </motion.div>
      </ContentLayout>
    </AtlvsLayout>
  );
}
