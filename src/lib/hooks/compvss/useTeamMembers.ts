import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  status: 'active' | 'on-break' | 'inactive' | 'pending';
  department?: string;
  organization?: string;
  avatar?: string;
  joinedAt?: string;
}

export interface TeamStats {
  total: number;
  active: number;
  onBreak: number;
  inactive: number;
}

export function useTeamMembers() {
  return useQuery({
    queryKey: ['compvss', 'team', 'members'],
    queryFn: async () => {
      const response = await fetch('/api/compvss/team/members');
      if (!response.ok) throw new Error('Failed to fetch team members');
      const data = await response.json();
      return {
        members: data.members as TeamMember[],
        stats: data.stats as TeamStats,
      };
    },
  });
}

export function useTeamMember(id?: string) {
  return useQuery({
    queryKey: ['compvss', 'team', 'member', id],
    queryFn: async () => {
      if (!id) throw new Error('Member ID required');
      const response = await fetch(`/api/compvss/team/members/${id}`);
      if (!response.ok) throw new Error('Failed to fetch team member');
      return response.json() as Promise<TeamMember>;
    },
    enabled: !!id,
  });
}

export function useUpdateTeamMember() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<TeamMember> }) => {
      const response = await fetch(`/api/compvss/team/members/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update team member');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['compvss', 'team'] });
    },
  });
}

export function useTeamRoles() {
  return useQuery({
    queryKey: ['compvss', 'team', 'roles'],
    queryFn: async () => {
      const response = await fetch('/api/compvss/team/roles');
      if (!response.ok) throw new Error('Failed to fetch team roles');
      return response.json();
    },
    staleTime: 1000 * 60 * 10,
  });
}

export function useTeamAvailability() {
  return useQuery({
    queryKey: ['compvss', 'team', 'availability'],
    queryFn: async () => {
      const response = await fetch('/api/compvss/team/availability');
      if (!response.ok) throw new Error('Failed to fetch team availability');
      return response.json();
    },
    staleTime: 1000 * 60 * 5,
  });
}
