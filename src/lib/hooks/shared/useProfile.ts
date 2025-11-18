/**
 * React Query hooks for User Profile
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await fetch('/api/profile');
      if (!response.ok) throw new Error('Failed to fetch profile');
      return response.json();
    },
    staleTime: 1000 * 60 * 10,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update profile');
      return response.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile'] }),
  });
}

export function useUploadAvatar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/profile/avatar', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to upload avatar');
      return response.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile'] }),
  });
}
