import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Organization {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  website?: string;
  type: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export function useOrganizations() {
  return useQuery({
    queryKey: ['organizations'],
    queryFn: async () => {
      const response = await fetch('/api/organizations');
      if (!response.ok) throw new Error('Failed to fetch organizations');
      return response.json() as Promise<Organization[]>;
    },
    staleTime: 30000,
  });
}

export function useOrganization(id: string) {
  return useQuery({
    queryKey: ['organizations', id],
    queryFn: async () => {
      const response = await fetch(`/api/organizations/${id}`);
      if (!response.ok) throw new Error('Failed to fetch organization');
      return response.json() as Promise<Organization>;
    },
    enabled: !!id,
    staleTime: 30000,
  });
}

export function useCreateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Organization>) => {
      const response = await fetch('/api/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create organization');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
    },
  });
}

export function useUpdateOrganization(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Organization>) => {
      const response = await fetch(`/api/organizations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update organization');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      queryClient.invalidateQueries({ queryKey: ['organizations', id] });
    },
  });
}
