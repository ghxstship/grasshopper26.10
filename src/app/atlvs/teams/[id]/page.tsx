'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Calendar, Briefcase, Award, TrendingUp } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { LoadingState } from '@/components/molecules/LoadingState';
import { EmptyState } from '@/components/molecules/EmptyState';
import { useTeam } from '@/lib/hooks/atlvs/useTeams';

export default function TeamMemberDetailPage({ params }: { params: { id: string } }) {
  const { data: member, isLoading, error } = useTeam(params.id);

  if (isLoading) {
    return (
      <AtlvsLayout>
        <ContentLayout
          title="Loading..."
          description="Fetching team member details"
          variant="atlvs"
          breadcrumbs={[
            { label: 'Team', href: '/atlvs/teams' },
            { label: 'Loading...' }
          ]}
        >
          <LoadingState variant="atlvs" />
        </ContentLayout>
      </AtlvsLayout>
    );
  }

  if (error || !member) {
    return (
      <AtlvsLayout>
        <ContentLayout
          title="Error"
          description="Failed to load team member"
          variant="atlvs"
          breadcrumbs={[
            { label: 'Team', href: '/atlvs/teams' },
            { label: 'Error' }
          ]}
        >
          <EmptyState
            title="Team Member Not Found"
            message="The team member you're looking for doesn't exist or you don't have permission to view them."
          />
        </ContentLayout>
      </AtlvsLayout>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-atlvs-green-500/20 text-atlvs-green-500 border-atlvs-green-500/50';
      case 'busy': return 'bg-warning-light text-warning border-warning-border';
      case 'away': return 'bg-atlvs-orange-500/20 text-atlvs-orange-500 border-atlvs-orange-500/50';
      case 'offline': return 'bg-gray-500/20 text-gray-500 border-gray-500/50';
      default: return 'bg-gray-500/20 text-gray-500 border-gray-500/50';
    }
  };

  return (
    <AtlvsLayout>
      <ContentLayout
        title={member.name}
        description={`${member.role} • ${member.department}`}
        variant="atlvs"
        breadcrumbs={[
          { label: 'Team', href: '/atlvs/teams' },
          { label: member.name }
        ]}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-start gap-6 mb-8">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-atlvs-green-500 to-atlvs-purple-500 flex items-center justify-center font-bebas text-h2">
                {member.name.split(' ').map(n => n[0]).join('')}
              </div>

              {/* Info */}
              <div className="flex-1">
                <h1 className="text-h1 font-bebas mb-2 atlvs-text-gradient">
                  {member.name}
                </h1>
                <p className="text-h5 text-gray-400 font-oswald mb-4">
                  {member.role} • {member.department}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="atlvs-outline" className={getStatusColor(member.status)}>
                    {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                  </Badge>
                  {member.skills.slice(0, 3).map((skill) => (
                    <Badge key={skill} variant="atlvs-outline" className="bg-gray-700/50">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button variant="atlvs" size="sm">
                  <Mail className="w-4 h-4 mr-2" />
                  Message
                </Button>
              </div>
            </div>
          </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <Card variant="atlvs" className="bg-gray-900/50">
              <CardHeader>
                <CardTitle className="mb-4">About</CardTitle>
                <p className="text-gray-300">{member.bio}</p>
              </CardHeader>
            </Card>

            {/* Performance Stats */}
            <Card variant="atlvs" className="bg-gray-900/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 mb-6">
                  <TrendingUp className="w-5 h-5" />
                  Performance Stats
                </CardTitle>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                    <div className="text-h3 font-bebas atlvs-text-gradient mb-1">
                      {member.stats.projectsCompleted}
                    </div>
                    <div className="text-body-sm text-gray-400">Projects</div>
                  </div>
                  <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                    <div className="text-h3 font-bebas atlvs-text-gradient mb-1">
                      {member.stats.tasksCompleted}
                    </div>
                    <div className="text-body-sm text-gray-400">Tasks</div>
                  </div>
                  <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                    <div className="text-h3 font-bebas atlvs-text-gradient mb-1">
                      {member.stats.hoursLogged}
                    </div>
                    <div className="text-body-sm text-gray-400">Hours</div>
                  </div>
                  <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                    <div className="text-h3 font-bebas atlvs-text-gradient mb-1">
                      {member.stats.avgRating}
                    </div>
                    <div className="text-body-sm text-gray-400">Rating</div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Current Projects */}
            <Card variant="atlvs" className="bg-gray-900/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 mb-6">
                  <Briefcase className="w-5 h-5" />
                  Current Projects ({member.currentProjects.length})
                </CardTitle>
                <div className="space-y-4">
                  {member.currentProjects.map((project) => (
                    <div key={project.id} className="p-4 bg-gray-800/50 rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="font-medium mb-1">{project.name}</div>
                          <div className="text-body-sm text-gray-400">{project.role}</div>
                        </div>
                        <Badge variant="atlvs-outline" className="bg-gray-700/50">
                          {project.progress}%
                        </Badge>
                      </div>
                      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-atlvs-green-500 to-atlvs-purple-500"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardHeader>
            </Card>

            {/* Recent Activity */}
            <Card variant="atlvs" className="bg-gray-900/50">
              <CardHeader>
                <CardTitle className="mb-6">Recent Activity</CardTitle>
                <div className="space-y-3">
                  {member.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-atlvs-green-500 mt-2" />
                      <div className="flex-1">
                        <div className="text-gray-300">
                          <span className="text-white">{activity.action}</span>
                          {' '}{activity.item}
                        </div>
                        <div className="text-body-sm text-gray-500">{activity.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardHeader>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card variant="atlvs" className="bg-gray-900/50">
              <CardHeader>
                <CardTitle className="mb-4">Contact Information</CardTitle>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-body-sm text-gray-400 mb-1">Email</div>
                      <a href={`mailto:${member.email}`} className="text-atlvs-green-500 hover:underline">
                        {member.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-body-sm text-gray-400 mb-1">Phone</div>
                      <a href={`tel:${member.phone}`} className="text-white hover:text-atlvs-green-500">
                        {member.phone}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-body-sm text-gray-400 mb-1">Location</div>
                      <div className="text-white">{member.location}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-body-sm text-gray-400 mb-1">Joined</div>
                      <div className="text-white">{new Date(member.joinDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Skills */}
            <Card variant="atlvs" className="bg-gray-900/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 mb-4">
                  <Award className="w-5 h-5" />
                  Skills
                </CardTitle>
                <div className="flex flex-wrap gap-2">
                  {member.skills.map((skill) => (
                    <Badge key={skill} variant="atlvs-outline" className="bg-gray-700/50">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
      </ContentLayout>
    </AtlvsLayout>
  );
}
