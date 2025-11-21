import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/useToast';

export interface UserSettings {
  id: string;
  userId: string;
  organizationName: string;
  timezone: string;
  language: string;
  dateFormat: string;
  currency: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  theme: 'light' | 'dark' | 'auto';
  twoFactorEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export function useSettings() {
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings, isLoading, error } = useQuery<UserSettings>({
    queryKey: ['settings'],
    queryFn: async () => {
      const response = await fetch('/api/atlvs/settings');
      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }
      return response.json();
    },
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (updates: Partial<UserSettings>) => {
      const response = await fetch('/api/atlvs/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        throw new Error('Failed to update settings');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      addToast({
        title: 'Settings Updated',
        message: 'Your settings have been saved successfully',
        description: 'Your settings have been saved successfully',
        type: 'success',
      });
    },
    onError: (error: Error) => {
      addToast({
        title: 'Update Failed',
        message: error.message,
        description: error.message,
        type: 'error',
      });
    },
  });

  return {
    settings,
    isLoading,
    error,
    updateSettings: updateSettingsMutation.mutate,
    isUpdating: updateSettingsMutation.isPending,
  };
}
