import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface UserSettings {
  id: string;
  userId: string;
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
  twoFactorEnabled: boolean;
  privacySettings: {
    profileVisibility: 'public' | 'private' | 'friends';
    showEmail: boolean;
    showPhone: boolean;
    showLocation: boolean;
  };
  updatedAt: Date;
}

export function useSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const response = await fetch('/api/profile/settings');
      if (!response.ok) throw new Error('Failed to fetch settings');
      return response.json() as Promise<UserSettings>;
    },
    staleTime: 30000,
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<UserSettings>) => {
      const response = await fetch('/api/profile/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update settings');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });
}
