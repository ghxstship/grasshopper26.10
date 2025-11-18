'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { CompvssLayout } from '@/components/templates/CompvssLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { motion } from 'framer-motion';
import { AlertCircle, Filter, Loader2, Mail, Phone, Search, Users2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { Input } from '@/components/atoms/Input';
import { useTeamMembers, TeamMember } from '@/lib/hooks/compvss/useTeamMembers';
import { useMemo, useState } from 'react';

export default function TeamDirectoryPage() {
  const [searchQuery, _setSearchQuery] = useState('');
  const { data: teamData, isLoading, error, refetch } = useTeamMembers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const members = teamData?.members || [];
  const _stats = teamData?.stats;

  const filteredMembers = useMemo(() => {
    if (!searchQuery) return members;
    const query = searchQuery.toLowerCase();
    return members.filter((member: TeamMember) =>
      member.name.toLowerCase().includes(query) ||
      member.role.toLowerCase().includes(query) ||
      member.email.toLowerCase().includes(query)
    );
  }, [members, searchQuery]);

  if (isLoading) {
    return (
      <CompvssLayout>
        <ContentLayout
          title="Team Directory"
          description="View and manage team members"
          variant="compvss"
          showToolbar={false}
          
        >
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-compvss-cyan-500" />
              <p className="text-gray-400">Loading team members...</p>
            </div>
          </div>
        </ContentLayout>
      </CompvssLayout>
    );
  }

  if (error) {
    return (
      <CompvssLayout>
        <ContentLayout
          title="Team Directory"
          description="View and manage team members"
          variant="compvss"
          showToolbar={false}
          
        >
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
              <h2 className="text-h5 font-bebas mb-2">Failed to Load Team</h2>
              <p className="text-gray-400 mb-4">{error.message || 'An error occurred'}</p>
              <Button variant="compvss" onClick={() => refetch()}>
                Try Again
              </Button>
            </div>
          </div>
        </ContentLayout>
      </CompvssLayout>
    );
  }

  const _getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="compvss" className="bg-success-light text-success border-success/30">Active</Badge>;
      case 'on-break':
        return <Badge variant="compvss-outline" className="border-warning/30 text-warning">On Break</Badge>;
      case 'inactive':
        return <Badge variant="compvss-outline" className="border-gray-500/30 text-gray-400">Inactive</Badge>;
      case 'pending':
        return <Badge variant="compvss-outline" className="border-info/30 text-info">Pending</Badge>;
      default:
        return <Badge variant="compvss-outline">{status}</Badge>;
    }
  };

  return (
    <CompvssLayout>
      <ContentLayout
        title="Team Directory"
        description="Connect with other team members"
        variant="compvss"
        showToolbar={true}
        
        actions={[
          {
            label: 'Filter',
            icon: <Filter className="w-4 h-4" />,
            onClick: () => {},
            variant: 'outline'
          }
        ]}
      >
        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search by name, role, or organization..."
              className="pl-12 bg-gray-900/50 border-compvss-cyan-500/30 h-12 text-h6"
            />
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card variant="compvss" className="bg-gray-900/50">
            <CardContent className="pt-6">
              <div className="text-h3 font-bebas text-white mb-1">48</div>
              <div className="text-body-sm text-gray-400 font-oswald">Total Members</div>
            </CardContent>
          </Card>
          <Card variant="compvss" className="bg-gray-900/50">
            <CardContent className="pt-6">
              <div className="text-h3 font-bebas text-success mb-1">42</div>
              <div className="text-body-sm text-gray-400 font-oswald">Active</div>
            </CardContent>
          </Card>
          <Card variant="compvss" className="bg-gray-900/50">
            <CardContent className="pt-6">
              <div className="text-h3 font-bebas text-warning mb-1">4</div>
              <div className="text-body-sm text-gray-400 font-oswald">On Break</div>
            </CardContent>
          </Card>
          <Card variant="compvss" className="bg-gray-900/50">
            <CardContent className="pt-6">
              <div className="text-h3 font-bebas text-info mb-1">12</div>
              <div className="text-body-sm text-gray-400 font-oswald">Organizations</div>
            </CardContent>
          </Card>
        </div>

        {/* Team Members Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card variant="compvss" className="bg-gray-900/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users2 className="w-5 h-5 text-compvss-cyan-500" />
                Team Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {filteredMembers.map((member: TeamMember, index: number) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link href={`/compvss/team/profile/${member.id}`}>
                      <div className="p-4 rounded-lg bg-black/50 border border-compvss-cyan-500/20 hover:border-compvss-cyan-500/40 transition-all cursor-pointer">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-compvss-cyan-500 to-compvss-teal-500 flex items-center justify-center font-bebas text-black text-h6">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <h3 className="font-oswald text-white text-h6">{member.name}</h3>
                              <p className="text-body-sm text-gray-400 font-share-tech">{member.role}</p>
                              <p className="text-gray-400 text-body-sm">{(member as any).organization || 'N/A'}</p>
                            </div>
                          </div>
                          <Badge 
                            variant={member.status === 'active' ? 'compvss' : 'compvss-outline'}
                            className={member.status === 'active' ? 'bg-success-light text-success border-success/30' : ''}
                          >
                            {member.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-6 text-body-sm text-gray-400 font-share-tech">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span>{member.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            <span>{member.phone}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </ContentLayout>
    </CompvssLayout>
  );
}
