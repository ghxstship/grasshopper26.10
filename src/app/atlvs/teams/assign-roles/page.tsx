'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Users, Shield, Search, Filter, Loader2, AlertCircle } from 'lucide-react';
import { useTeams } from '@/lib/hooks/atlvs/useTeams';
import { Select } from '@/components/atoms/Select';
import { Input } from '@/components/atoms/Input';
import { Checkbox } from '@/components/atoms/Checkbox';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { BodyText } from "@/components/atoms/Typography";

interface _TeamMember {
  id: string;
  name: string;
  email: string;
  currentRole: string;
  department: string;
  avatar?: string;
}

interface _Role {
  id: string;
  name: string;
  color: string;
}

export default function RoleAssignmentPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [bulkRole, setBulkRole] = useState('');

  const { data, isLoading, error, refetch } = useTeams();
  const roles = (data as any)?.roles || [];
  const _teamMembers = (data as any)?.members || [];
  const queryClient = useQueryClient();

  const assignRoleMutation = useMutation({
    mutationFn: async (data: { memberIds: string[], roleId: string }) => {
      const response = await fetch('/api/atlvs/teams/assign-roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to assign roles');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      setSelectedMembers([]);
    },
  });

  if (isLoading) {
    return (
      <AtlvsLayout>
        <ContentLayout
          title="ROLE ASSIGNMENT"
          description="Loading..."
          breadcrumbs={[
            { label: 'Teams', href: '/atlvs/teams' },
            { label: 'Assign Roles' }
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
          title="ROLE ASSIGNMENT"
          description="Error loading data"
          breadcrumbs={[
            { label: 'Teams', href: '/atlvs/teams' },
            { label: 'Assign Roles' }
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

  const members: _TeamMember[] = [
    { id: '1', name: 'Sarah Johnson', email: 'sarah@atlvs.com', currentRole: 'Production Manager', department: 'Production' },
    { id: '2', name: 'Mike Chen', email: 'mike@atlvs.com', currentRole: 'Technical Director', department: 'Technical' },
    { id: '3', name: 'Emily Davis', email: 'emily@atlvs.com', currentRole: 'Team Member', department: 'Production' },
    { id: '4', name: 'James Wilson', email: 'james@atlvs.com', currentRole: 'Team Member', department: 'Logistics' },
    { id: '5', name: 'Lisa Anderson', email: 'lisa@atlvs.com', currentRole: 'Coordinator', department: 'Production' },
    { id: '6', name: 'David Brown', email: 'david@atlvs.com', currentRole: 'Specialist', department: 'Technical' }
  ];

  const departments = ['all', 'Production', 'Technical', 'Logistics', 'Creative'];

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || member.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const toggleMemberSelection = (memberId: string) => {
    setSelectedMembers(prev =>
      prev.includes(memberId) ? prev.filter(id => id !== memberId) : [...prev, memberId]
    );
  };

  const selectAll = () => {
    setSelectedMembers(filteredMembers.map(m => m.id));
  };

  const deselectAll = () => {
    setSelectedMembers([]);
  };

  const handleBulkAssignment = () => {
    if (bulkRole && selectedMembers.length > 0) {
      assignRoleMutation.mutate({ memberIds: selectedMembers, roleId: bulkRole });
      setBulkRole('');
    }
  };

  const getRoleColor = (roleName: string) => {
    const role = roles.find(r => r.name === roleName);
    const colors: Record<string, string> = {
      purple: 'bg-atlvs-purple-500/20 text-atlvs-purple-500',
      blue: 'bg-info/20 text-info',
      green: 'bg-atlvs-green-500/20 text-atlvs-green-500',
      yellow: 'bg-warning/20 text-warning',
      indigo: 'bg-indigo-500/20 text-indigo-400'
    };
    return colors[role?.color || 'green'];
  };

  return (
    <AtlvsLayout>
      <ContentLayout
        title="ROLE ASSIGNMENT"
        description="Assign and manage team member roles"
        variant="atlvs"
        breadcrumbs={[
          { label: 'Teams', href: '/atlvs/teams' },
          { label: 'Assign Roles' }
        ]}
      >

      {/* Filters and Search */}
      <Card variant="atlvs" className="bg-grey-900/50 mb-6">
        <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-grey-400 w-5 h-5 z-10" />
            <Input
              type="text"
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              variant="atlvs"
              className="pl-10"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-grey-400 w-5 h-5" />
            <Select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              variant="atlvs"
              className="pl-10"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>
                  {dept === 'all' ? 'All Departments' : dept}
                </option>
              ))}
            </Select>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={selectAll}
              variant="ghost"
              className="flex-1"
            >
              Select All
            </Button>
            <Button
              onClick={deselectAll}
              variant="ghost"
              className="flex-1"
            >
              Deselect All
            </Button>
          </div>
        </div>
        </CardContent>
      </Card>

      {/* Bulk Assignment */}
      {selectedMembers.length > 0 && (
        <Card variant="atlvs" className="bg-atlvs-green-500/10 border-atlvs-green-500/30 mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-atlvs-green-500" />
                <span className="font-medium text-white">
                {selectedMembers.length} member{selectedMembers.length !== 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Select
                value={bulkRole}
                onChange={(e) => setBulkRole(e.target.value)}
                variant="atlvs"
              >
                <option value="">Select role to assign...</option>
                {roles.map(role => (
                  <option key={role.id} value={role.id}>{role.name}</option>
                ))}
              </Select>
              <Button
                onClick={handleBulkAssignment}
                disabled={!bulkRole}
                variant="atlvs"
              >
                Assign Role
              </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Members List */}
      <div className="bg-white rounded-lg border border-grey-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-grey-50 border-b border-grey-200">
              <tr>
                <th className="px-6 py-3 text-left">
                  <Checkbox
                    checked={selectedMembers.length === filteredMembers.length && filteredMembers.length > 0}
                    onChange={(e) => e.target.checked ? selectAll() : deselectAll()}
                    variant="atlvs"
                  />
                </th>
                <th className="px-6 py-3 text-left text-caption text-grey-500 uppercaser">
                  Member
                </th>
                <th className="px-6 py-3 text-left text-caption text-grey-500 uppercaser">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-caption text-grey-500 uppercaser">
                  Current Role
                </th>
                <th className="px-6 py-3 text-left text-caption text-grey-500 uppercaser">
                  Assign New Role
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-grey-200">
              {filteredMembers.map(member => (
                <tr key={member.id} className="hover:bg-grey-50">
                  <td className="px-6 py-4">
                    <Checkbox
                      checked={selectedMembers.includes(member.id)}
                      onChange={() => toggleMemberSelection(member.id)}
                      variant="atlvs"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-medium text-grey-900">{member.name}</div>
                        <div className="text-body-sm text-grey-500">{member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-grey-100 text-grey-700 text-body-sm rounded">
                      {member.department}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-body-sm rounded ${getRoleColor(member.currentRole)}`}>
                      {member.currentRole}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Select
                      variant="atlvs"
                      className="text-body-sm"
                      defaultValue=""
                      onChange={(e) => {
                        if (e.target.value) {
                          assignRoleMutation.mutate({ memberIds: [member.id], roleId: e.target.value });
                        }
                      }}
                    >
                      <option value="">Change role...</option>
                      {roles.map(role => (
                        <option key={role.id} value={role.id}>{role.name}</option>
                      ))}
                    </Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredMembers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-grey-400 mx-auto mb-3" />
            <BodyText className="text-grey-500">No members found</BodyText>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-grey-200 p-4">
          <div className="text-body-sm text-grey-600 mb-1">Total Members</div>
          <div className="text-grey-900">{members.length}</div>
        </div>
        <div className="bg-white rounded-lg border border-grey-200 p-4">
          <div className="text-body-sm text-grey-600 mb-1">Filtered</div>
          <div className="text-grey-900">{filteredMembers.length}</div>
        </div>
        <div className="bg-white rounded-lg border border-grey-200 p-4">
          <div className="text-body-sm text-grey-600 mb-1">Selected</div>
          <div className="text-success">{selectedMembers.length}</div>
        </div>
        <div className="bg-white rounded-lg border border-grey-200 p-4">
          <div className="text-body-sm text-grey-600 mb-1">Roles Available</div>
          <div className="text-grey-900">{roles.length}</div>
        </div>
      </div>
      </ContentLayout>
    </AtlvsLayout>
  );
}
