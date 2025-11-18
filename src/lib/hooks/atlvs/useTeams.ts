/**
 * React Query hooks for ATLVS Teams
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useTeams(filters = {}) {
  return useQuery({
    queryKey: ['teams', filters],
    queryFn: async () => {
      const params = new URLSearchParams(Object.entries(filters).filter(([, v]) => v != null).map(([k, v]) => [k, String(v)]));
      const response = await fetch(`/api/atlvs/teams?${params}`);
      if (!response.ok) throw new Error('Failed to fetch teams');
      return response.json();
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useTeam(id: string | undefined) {
  return useQuery({
    queryKey: ['team', id],
    queryFn: async () => {
      if (!id) throw new Error('Team ID required');
      const response = await fetch(`/api/atlvs/teams/${id}`);
      if (!response.ok) throw new Error('Failed to fetch team');
      return response.json();
    },
    enabled: !!id,
  });
}

export function useCreateTeam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const response = await fetch('/api/atlvs/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create team');
      return response.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['teams'] }),
  });
}

export function useUpdateTeam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Record<string, unknown> }) => {
      const response = await fetch(`/api/atlvs/teams/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update team');
      return response.json();
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      queryClient.invalidateQueries({ queryKey: ['team', id] });
    },
  });
}

/**
 * Hook to fetch team members
 */
export function useTeamMembers(teamId?: string) {
  return useQuery({
    queryKey: ['teamMembers', teamId],
    queryFn: async () => {
      const url = teamId 
        ? `/api/atlvs/teams/${teamId}/members`
        : '/api/atlvs/teams/members';
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch team members');
      }
      
      return response.json();
    },
  });
}

/**
 * Hook to fetch team roles
 */
export function useTeamRoles(teamId?: string) {
  return useQuery({
    queryKey: ['teamRoles', teamId],
    queryFn: async () => {
      const url = teamId 
        ? `/api/atlvs/teams/${teamId}/roles`
        : '/api/atlvs/teams/roles';
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch team roles');
      }
      
      return response.json();
    },
  });
}
