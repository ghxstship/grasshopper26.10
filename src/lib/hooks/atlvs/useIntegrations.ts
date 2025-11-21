import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/useToast';

export interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  connected: boolean;
  href: string;
  status?: 'active' | 'inactive' | 'error';
  lastSync?: string;
  settings?: Record<string, unknown>;
}

export function useIntegrations() {
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  const { data: integrations, isLoading, error, refetch } = useQuery<Integration[]>({
    queryKey: ['integrations'],
    queryFn: async () => {
      const response = await fetch('/api/atlvs/integrations');
      if (!response.ok) {
        throw new Error('Failed to fetch integrations');
      }
      return response.json();
    },
  });

  const connectMutation = useMutation({
    mutationFn: async (integrationId: string) => {
      const response = await fetch(`/api/atlvs/integrations/${integrationId}/connect`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to connect integration');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
      addToast({
        title: 'Integration Connected',
        message: 'Successfully connected the integration',
        description: 'Successfully connected the integration',
        type: 'success',
      });
    },
    onError: (error: Error) => {
      addToast({
        title: 'Connection Failed',
        message: error.message,
        description: error.message,
        type: 'error',
      });
    },
  });

  const disconnectMutation = useMutation({
    mutationFn: async (integrationId: string) => {
      const response = await fetch(`/api/atlvs/integrations/${integrationId}/disconnect`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to disconnect integration');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
      addToast({
        title: 'Integration Disconnected',
        message: 'Successfully disconnected the integration',
        description: 'Successfully disconnected the integration',
        type: 'success',
      });
    },
    onError: (error: Error) => {
      addToast({
        title: 'Disconnection Failed',
        message: error.message,
        description: error.message,
        type: 'error',
      });
    },
  });

  return {
    integrations: integrations || [],
    isLoading,
    error,
    refetch,
    connect: connectMutation.mutate,
    disconnect: disconnectMutation.mutate,
    isConnecting: connectMutation.isPending,
    isDisconnecting: disconnectMutation.isPending,
  };
}
