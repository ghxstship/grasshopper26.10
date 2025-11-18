'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { motion } from 'framer-motion';
import { TrendingUp, Award, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Button } from '@/components/atoms/Button';
import { useTeams } from '@/lib/hooks/atlvs/useTeams';

export default function TeamPerformancePage() {
  const { data: members = [], isLoading, error, refetch } = useTeams();

  if (isLoading) {
    return (
      <AtlvsLayout>
        <ContentLayout
          title="TEAM PERFORMANCE"
          description="Loading performance..."
          breadcrumbs={[
            { label: 'Teams', href: '/atlvs/teams' },
            { label: 'Performance' }
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
          title="TEAM PERFORMANCE"
          description="Error loading performance"
          breadcrumbs={[
            { label: 'Teams', href: '/atlvs/teams' },
            { label: 'Performance' }
          ]}
        >
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
              <p className="text-gray-400 mb-4">{error.message}</p>
              <Button variant="atlvs" onClick={() => refetch()}>Try Again</Button>
            </div>
          </div>
        </ContentLayout>
      </AtlvsLayout>
    );
  }

  const typedMembers = members as any[];

  return (
    <AtlvsLayout>
      <ContentLayout
        title="TEAM PERFORMANCE"
        description="Track team metrics and productivity"
        breadcrumbs={[
          { label: 'Teams', href: '/atlvs/teams' },
          { label: 'Performance' }
        ]}
      >
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <div className="text-sm text-gray-400 mb-1">Avg Efficiency</div>
              <div className="text-3xl font-bebas atlvs-text-gradient">91%</div>
              <div className="flex items-center gap-1 text-sm text-atlvs-green-500 mt-2">
                <TrendingUp className="w-4 h-4" />
                <span>+5%</span>
              </div>
            </CardHeader>
          </Card>
          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <div className="text-sm text-gray-400 mb-1">Tasks Completed</div>
              <div className="text-3xl font-bebas text-atlvs-green-500">125</div>
            </CardHeader>
          </Card>
          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <div className="text-sm text-gray-400 mb-1">Avg Rating</div>
              <div className="text-3xl font-bebas text-atlvs-purple-500">4.7</div>
            </CardHeader>
          </Card>
          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <div className="text-sm text-gray-400 mb-1">Active Members</div>
              <div className="text-3xl font-bebas text-info">24</div>
            </CardHeader>
          </Card>
        </div>

        <Card variant="atlvs" className="bg-gray-900/50">
          <CardHeader>
            <CardTitle className="mb-6 flex items-center gap-2">
              <Award className="w-5 h-5" />
              Top Performers
            </CardTitle>
            <div className="space-y-3">
              {typedMembers.map((member: any, index: number) => (
                <div key={member.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-atlvs-green-500 to-atlvs-purple-500 flex items-center justify-center font-bebas text-xl">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium mb-1">{member.name}</div>
                      <div className="text-sm text-gray-400">
                        {member.tasksCompleted} tasks • {member.efficiency}% efficiency
                      </div>
                    </div>
                  </div>
                  <div className="text-2xl font-bebas atlvs-text-gradient">
                    {member.rating} ⭐
                  </div>
                </div>
              ))}
            </div>
          </CardHeader>
        </Card>
        </motion.div>
      </ContentLayout>
    </AtlvsLayout>
  );
}
