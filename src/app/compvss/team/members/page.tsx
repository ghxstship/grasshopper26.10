'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { CompvssLayout } from '@/components/templates/CompvssLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { motion } from 'framer-motion';
import { AlertCircle, Filter, Loader2, Mail, Phone, Search, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import { Button } from '@/components/atoms/Button';
import { Card, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { Input } from '@/components/atoms/Input';
import { useTeamMembers, TeamMember } from '@/lib/hooks/compvss/useTeamMembers';
import { BodyText, SectionHeader } from "@/components/atoms/Typography";

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/compvss/team/members

export default function TeamMembersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data, isLoading, error, refetch } = useTeamMembers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const members = data?.members || [];
  const apiStats = data?.stats;

  const filteredMembers = useMemo(() => {
    if (!searchQuery.trim()) return members;
    const query = searchQuery.toLowerCase();
    return members.filter((member: TeamMember) =>
      member.name.toLowerCase().includes(query) ||
      member.email.toLowerCase().includes(query) ||
      member.role.toLowerCase().includes(query)
    );
  }, [members, searchQuery]);

  const teamStats = useMemo(() => {
    if (apiStats) {
      return [
        { label: 'Total Members', value: apiStats.total?.toString() || '0' },
        { label: 'Active', value: apiStats.active?.toString() || '0' },
        { label: 'On Break', value: apiStats.onBreak?.toString() || '0' },
        { label: 'Inactive', value: apiStats.inactive?.toString() || '0' },
      ];
    }
    
    const total = members.length;
    const active = members.filter((m: TeamMember) => m.status === 'active').length;
    const onBreak = members.filter((m: TeamMember) => m.status === 'on-break').length;
    const inactive = members.filter((m: TeamMember) => m.status === 'inactive').length;
    
    return [
      { label: 'Total Members', value: total.toString() },
      { label: 'Active', value: active.toString() },
      { label: 'On Break', value: onBreak.toString() },
      { label: 'Inactive', value: inactive.toString() },
    ];
  }, [members, apiStats]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="compvss" className="bg-success-light text-success border-success/30">Active</Badge>;
      case 'on-break':
        return <Badge variant="compvss-outline" className="border-warning/30 text-warning">On Break</Badge>;
      case 'inactive':
        return <Badge variant="compvss-outline" className="border-grey-500/30 text-grey-400">Inactive</Badge>;
      case 'pending':
        return <Badge variant="compvss-outline" className="border-info/30 text-info">Pending</Badge>;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <CompvssLayout>
        <ContentLayout
          title="Team Members"
          description="Manage your team roster"
          variant="compvss"
          showToolbar={false}
          
        >
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-compvss-cyan-500" />
              <BodyText className="text-grey-400">Loading team members...</BodyText>
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
          title="Team Members"
          description="Manage your team roster"
          variant="compvss"
          showToolbar={false}
          
        >
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
              <SectionHeader className="mb-2">Failed to Load Team Members</SectionHeader>
              <p className="text-grey-400 mb-4">{error.message || 'An error occurred'}</p>
              <Button variant="compvss" onClick={() => refetch()}>
                Try Again
              </Button>
            </div>
          </div>
        </ContentLayout>
      </CompvssLayout>
    );
  }

  return (
    <CompvssLayout>
      <ContentLayout
        title="Team Members"
        description="Manage your team roster"
        variant="compvss"
        showToolbar={true}
        
        actions={[
          {
            label: 'Filter',
            icon: <Filter className="w-4 h-4" />,
            onClick: () => {},
            variant: 'outline'
          },
          {
            label: 'Invite Member',
            icon: <UserPlus className="w-5 h-5" />,
            onClick: () => window.location.href = '/compvss/auth/invite',
            variant: 'compvss'
          }
        ]}
      >
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {teamStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card variant="compvss" className="bg-grey-900/50">
                <CardContent className="pt-6 text-center">
                  <div className="text-white mb-1">{stat.value}</div>
                  <div className="text-body-sm text-grey-400">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-grey-400" />
            <Input
              placeholder="Search members by name, role, or email..."
              className="pl-12 bg-grey-900/50 border-compvss-cyan-500/30 h-12"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </motion.div>

        {/* Members Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredMembers.map((member: TeamMember, index: number) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <Link href={`/compvss/team/profile/${member.id}`}>
                <Card variant="compvss" className="bg-grey-900/50 hover:bg-grey-900/70 transition-all cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-compvss-cyan-500 to-compvss-teal-500 flex items-center justify-center text-black flex-shrink-0">
                        {member.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-white truncate">{member.name}</h3>
                          {getStatusBadge(member.status)}
                        </div>
                        <p className="text-body-sm text-grey-400 mb-3">{member.role}</p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-caption text-grey-500 -tech">
                            <Mail className="w-3 h-3" />
                            <span className="truncate">{member.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-caption text-grey-500 -tech">
                            <Phone className="w-3 h-3" />
                            <span>{member.phone}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </ContentLayout>
    </CompvssLayout>
  );
}
