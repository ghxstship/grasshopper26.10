'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Users, Plus, X,  } from 'lucide-react';
import { useTeams } from '@/lib/hooks/atlvs/useTeams';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import { Textarea } from '@/components/atoms/Textarea';
import { FormField } from '@/components/molecules/FormField';
import { Button } from '@/components/atoms/Button';

export default function CreateTeamPage() { 
  const router = useRouter();
  const queryClient = useQueryClient();
  const [teamName, setTeamName] = useState('');
  const [department, setDepartment] = useState('');
  const [description, setDescription] = useState('');
  const [members, setMembers] = useState<string[]>([]);
  const [newMember, setNewMember] = useState('');

  const { data,  } = useTeams();
  const departments = (data as any)?.departments || ['Production', 'Technical', 'Operations', 'Artist Relations', 'Logistics', 'Finance'];

  const createTeamMutation = useMutation({
    mutationFn: async (data: { name: string; department: string; description: string; members: string[] }) => {
      const response = await fetch('/api/atlvs/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create team');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      router.push('/atlvs/teams');
    },
  });

  const addMember = () => {
    if (newMember && !members.includes(newMember)) {
      setMembers([...members, newMember]);
      setNewMember('');
    }
  };

  const removeMember = (member: string) => {
    setMembers(members.filter(m => m !== member));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTeamMutation.mutate({ name: teamName, department, description, members });
  };

  return (
    <AtlvsLayout>
      <ContentLayout
        title="CREATE NEW TEAM"
        description="Set up a new team for your project"
        breadcrumbs={[
          { label: 'Teams', href: '/atlvs/teams' },
          { label: 'Create' }
        ]}
      >
        <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-grey-200 p-6 space-y-6">
        {/* Team Name */}
        <FormField label="Team Name" required>
          <Input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="e.g., Stage Crew Alpha"
            variant="atlvs"
            required
          />
        </FormField>

        {/* Department */}
        <FormField label="Department" required>
          <Select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            variant="atlvs"
            required
          >
            <option value="">Select department</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </Select>
        </FormField>

        {/* Description */}
        <FormField label="Description">
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the team's responsibilities..."
            rows={4}
            variant="atlvs"
          />
        </FormField>

        {/* Team Members */}
        <FormField label="Team Members">
          <div className="flex gap-2 mb-3">
            <Input
              type="email"
              value={newMember}
              onChange={(e) => setNewMember(e.target.value)}
              placeholder="Enter email address"
              variant="atlvs"
            />
            <Button
              type="button"
              onClick={addMember}
              variant="atlvs"
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add
            </Button>
          </div>

          {/* Members List */}
          {members.length > 0 && (
            <div className="space-y-2">
              {members.map(member => (
                <div key={member} className="flex items-center justify-between p-3 bg-grey-50 rounded-lg">
                  <span className="text-grey-900">{member}</span>
                  <Button
                    type="button"
                    onClick={() => removeMember(member)}
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive-foreground"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </FormField>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-grey-200">
          <Button
            type="button"
            variant="ghost"
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="atlvs"
            className="flex-1 flex items-center justify-center gap-2"
          >
            <Users className="w-4 h-4" />
            Create Team
          </Button>
        </div>
        </form>
      </ContentLayout>
    </AtlvsLayout>
  );
}
