import useSWR from 'swr';
import { useMutation } from '@tanstack/react-query';

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  reportedBy: string;
  assignedTo?: string;
  createdAt: string;
  resolvedAt?: string;
  location?: string;
  attachments?: string[];
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useIssues(filters?: { status?: string; priority?: string; category?: string }) {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
  }

  const { data, error, mutate, isLoading } = useSWR(
    `/api/compvss/issues?${params}`,
    fetcher
  );

  return {
    issues: data?.issues,
    pagination: data?.pagination,
    isLoading,
    error,
    refetch: mutate,
  };
}

export function useIssue(issueId?: string) {
  const { data, error, mutate, isLoading } = useSWR(
    issueId ? `/api/compvss/issues/${issueId}` : null,
    fetcher
  );

  return {
    issue: data,
    isLoading,
    error,
    refetch: mutate,
  };
}

export function useCreateIssue() {
  return useMutation({
    mutationFn: async (data: Omit<Issue, 'id' | 'createdAt' | 'reportedBy'>) => {
      const response = await fetch('/api/compvss/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create issue');
      return response.json();
    },
  });
}

export function useResolveIssue() {
  return useMutation({
    mutationFn: async ({ issueId, resolution }: { issueId: string; resolution: string }) => {
      const response = await fetch(`/api/compvss/issues/${issueId}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resolution }),
      });
      if (!response.ok) throw new Error('Failed to resolve issue');
      return response.json();
    },
  });
}
