'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, Search, Filter, Mail, Phone, Clock, TrendingUp, Award,  } from 'lucide-react';
import Link from 'next/link';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { Select } from '@/components/atoms/Select';
import { Input } from '@/components/atoms/Input';
import { useTeams } from '@/lib/hooks/atlvs/useTeams';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  avatar: string;
  status: 'available' | 'busy' | 'away' | 'offline';
  projects: number;
  tasksCompleted: number;
  hoursThisWeek: number;
}

// Mock team members commented out - using real API data
/*
const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'Production Manager',
    department: 'Production',
    email: 'sarah.j@atlvs.com',
    phone: '+1 (555) 123-4567',
    avatar: 'SJ',
    status: 'available',
    projects: 3,
    tasksCompleted: 47,
    hoursThisWeek: 38
  },
  {
    id: '2',
    name: 'Mike Chen',
    role: 'Technical Director',
    department: 'Technical',
    email: 'mike.c@atlvs.com',
    phone: '+1 (555) 234-5678',
    avatar: 'MC',
    status: 'busy',
    projects: 2,
    tasksCompleted: 52,
    hoursThisWeek: 42
  },
  {
    id: '3',
    name: 'Alex Kim',
    role: 'Stage Manager',
    department: 'Operations',
    email: 'alex.k@atlvs.com',
    phone: '+1 (555) 345-6789',
    avatar: 'AK',
    status: 'available',
    projects: 4,
    tasksCompleted: 38,
    hoursThisWeek: 35
  },
  {
    id: '4',
    name: 'Jordan Lee',
    role: 'Logistics Coordinator',
    department: 'Logistics',
    email: 'jordan.l@atlvs.com',
    phone: '+1 (555) 456-7890',
    avatar: 'JL',
    status: 'away',
    projects: 2,
    tasksCompleted: 29,
    hoursThisWeek: 28
  },
  {
    id: '5',
    name: 'Taylor Rodriguez',
    role: 'Budget Manager',
    department: 'Finance',
    email: 'taylor.r@atlvs.com',
    phone: '+1 (555) 567-8901',
    avatar: 'TR',
    status: 'available',
    projects: 5,
    tasksCompleted: 61,
    hoursThisWeek: 40
  },
  {
    id: '6',
    name: 'Sam Patel',
    role: 'Audio Engineer',
    department: 'Technical',
    email: 'sam.p@atlvs.com',
    phone: '+1 (555) 678-9012',
    avatar: 'SP',
    status: 'busy',
    projects: 2,
    tasksCompleted: 31,
    hoursThisWeek: 35
  }
];
*/

interface TeamData {
  name?: string;
  members?: Array<{
    id: string;
    user?: { name?: string; email?: string; phone?: string };
    name?: string;
    role?: string;
  }>;
}

export default function TeamsPage() {
  const { data: teams = [], isLoading: _isLoading, error: _error, refetch: _refetch } = useTeams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');

  const departments = ['All Departments', 'Production', 'Technical', 'Creative', 'Operations', 'Marketing'];

  const getStatusColor = (status: TeamMember['status']) => {
    switch (status) {
      case 'available': return 'bg-atlvs-green-500';
      case 'busy': return 'bg-error';
      case 'away': return 'bg-warning';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const teamMembers = useMemo(() => {
    if (!teams || teams.length === 0) return [];
    
    return (teams as TeamData[]).flatMap((team) => 
      (team.members || []).map((member): TeamMember => ({
        id: member.id,
        name: member.user?.name || member.name || 'Unknown',
        role: member.role || 'Team Member',
        department: team.name || 'General',
        email: member.user?.email || '',
        phone: member.user?.phone || '',
        avatar: (member.user?.name || member.name || 'U').substring(0, 2).toUpperCase(),
        status: 'available',
        projects: 0,
        tasksCompleted: 0,
        hoursThisWeek: 0,
      }))
    );
  }, [teams]);

  const filteredMembers = teamMembers.filter((member: TeamMember) => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = selectedDepartment === 'All Departments' || member.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const totalMembers = teamMembers.length;
  const availableMembers = teamMembers.filter((m: TeamMember) => m.status === 'available').length;
  const totalHours = teamMembers.reduce((sum: number, m: TeamMember) => sum + m.hoursThisWeek, 0);
  const avgTasksCompleted = totalMembers > 0 ? Math.round(teamMembers.reduce((sum: number, m: TeamMember) => sum + m.tasksCompleted, 0) / totalMembers) : 0;

  return (
    <AtlvsLayout>
      <ContentLayout
        title="TEAM COORDINATION"
        description="Manage team members, schedules, and performance"
        variant="atlvs"
        showToolbar={false}
      >
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8" role="region" aria-label="Team statistics">
          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription className="text-gray-400 mb-1">
                    Total Members
                  </CardDescription>
                  <CardTitle className="text-3xl font-bebas" aria-label={`${totalMembers} total team members`}>
                    {totalMembers}
                  </CardTitle>
                </div>
                <div className="p-3 bg-info/10 rounded-xl" aria-hidden="true">
                  <Users className="w-6 h-6 text-info" aria-hidden="true" />
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription className="text-gray-400 mb-1">
                    Available Now
                  </CardDescription>
                  <CardTitle className="text-3xl font-bebas text-atlvs-green-500" aria-label={`${availableMembers} members available now`}>
                    {availableMembers}
                  </CardTitle>
                </div>
                <div className="p-3 bg-atlvs-green-500/10 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-atlvs-green-500" />
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription className="text-gray-400 mb-1">
                    Hours This Week
                  </CardDescription>
                  <CardTitle className="text-3xl font-bebas">
                    {totalHours}
                  </CardTitle>
                </div>
                <div className="p-3 bg-purple-500/10 rounded-xl">
                  <Clock className="w-6 h-6 text-atlvs-purple-500" />
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription className="text-gray-400 mb-1">
                    Avg Tasks Done
                  </CardDescription>
                  <CardTitle className="text-3xl font-bebas">
                    {avgTasksCompleted}
                  </CardTitle>
                </div>
                <div className="p-3 bg-orange-500/10 rounded-xl">
                  <Award className="w-6 h-6 text-atlvs-orange-500" />
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
              <Input
                type="text"
                placeholder="Search team members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                variant="atlvs"
                className="pl-10"
              />
            </div>
          </div>

          <Select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            variant="atlvs"
          >
            {departments.map((dept: string) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </Select>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-gray-400">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
            <Link href="/atlvs/teams/new">
              <Button variant="atlvs" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Member
              </Button>
            </Link>
          </div>
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member: TeamMember, index: number) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={`/atlvs/teams/${member.id}`}>
                <Card 
                  variant="atlvs" 
                  className="bg-gray-900/50 hover:bg-gray-900 transition-all cursor-pointer h-full"
                >
                  <CardHeader>
                    {/* Avatar and Status */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-atlvs-green-500 to-atlvs-purple-500 flex items-center justify-center font-bebas text-lg">
                            {member.avatar}
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-900 ${getStatusColor(member.status)}`} />
                        </div>
                        <div>
                          <CardTitle className="text-white text-lg">
                            {member.name}
                          </CardTitle>
                          <CardDescription className="text-gray-400 text-sm">
                            {member.role}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant="atlvs-outline" className="text-xs">
                        {member.department}
                      </Badge>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Mail className="w-3 h-3" />
                        <span className="truncate">{member.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Phone className="w-3 h-3" />
                        <span>{member.phone}</span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-800">
                      <div>
                        <div className="text-xs text-gray-400 mb-1">Projects</div>
                        <div className="text-lg font-bebas text-white">{member.projects}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 mb-1">Tasks</div>
                        <div className="text-lg font-bebas text-white">{member.tasksCompleted}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 mb-1">Hours</div>
                        <div className="text-lg font-bebas text-white">{member.hoursThisWeek}</div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </ContentLayout>
    </AtlvsLayout>
  );
}
