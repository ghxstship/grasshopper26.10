import { useQuery } from '@tanstack/react-query';

interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  role: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

interface UserFilters {
  role?: string;
  status?: string;
  search?: string;
}

export function useUsers(filters?: UserFilters) {
  return useQuery({
    queryKey: ['users', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.role) params.append('role', filters.role);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.search) params.append('search', filters.search);

      const response = await fetch(`/api/users?${params}`);
      if (!response.ok) throw new Error('Failed to fetch users');
      return response.json() as Promise<User[]>;
    },
    staleTime: 30000,
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: async () => {
      const response = await fetch(`/api/users/${id}`);
      if (!response.ok) throw new Error('Failed to fetch user');
      return response.json() as Promise<User>;
    },
    enabled: !!id,
    staleTime: 30000,
  });
}
