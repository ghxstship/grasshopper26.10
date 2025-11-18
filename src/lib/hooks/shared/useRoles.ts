import { useQuery } from '@tanstack/react-query';

interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}

export function useRoles() {
  return useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const response = await fetch('/api/roles');
      if (!response.ok) throw new Error('Failed to fetch roles');
      return response.json() as Promise<Role[]>;
    },
    staleTime: 60000,
  });
}

export function useRole(id: string) {
  return useQuery({
    queryKey: ['roles', id],
    queryFn: async () => {
      const response = await fetch(`/api/roles/${id}`);
      if (!response.ok) throw new Error('Failed to fetch role');
      return response.json() as Promise<Role>;
    },
    enabled: !!id,
    staleTime: 60000,
  });
}
