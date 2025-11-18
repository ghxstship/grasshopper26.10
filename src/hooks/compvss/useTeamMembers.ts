import useSWR from 'swr';
import { useMutation } from '@tanstack/react-query';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  organization?: string;
  status: 'active' | 'on-break' | 'inactive' | 'pending';
  avatar?: string;
  skills?: string[];
  availability?: {
    start: string;
    end: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface TeamStats {
  total: number;
  active: number;
  onBreak: number;
  inactive: number;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useTeamMembers(filters?: { status?: string; role?: string }) {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
  }

  const { data, error, mutate, isLoading } = useSWR(
    `/api/compvss/team?${params}`,
    fetcher
  );

  return {
    members: data?.members,
    stats: data?.stats,
    pagination: data?.pagination,
    isLoading,
    error,
    refetch: mutate,
  };
}

export function useTeamMember(memberId?: string) {
  const { data, error, mutate, isLoading } = useSWR(
    memberId ? `/api/compvss/team/${memberId}` : null,
    fetcher
  );

  return {
    member: data,
    isLoading,
    error,
    refetch: mutate,
  };
}

export function useUpdateTeamMember() {
  return useMutation({
    mutationFn: async ({ memberId, data }: { memberId: string; data: Partial<TeamMember> }) => {
      const response = await fetch(`/api/compvss/team/${memberId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update team member');
      return response.json();
    },
  });
}

export function useInviteTeamMember() {
  return useMutation({
    mutationFn: async (data: { email: string; role: string; name?: string }) => {
      const response = await fetch('/api/compvss/team/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to invite team member');
      return response.json();
    },
  });
}
