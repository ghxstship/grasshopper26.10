import useSWR from 'swr';
import { useMutation } from '@tanstack/react-query';

export interface Credential {
  id: string;
  type: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  status: 'verified' | 'pending' | 'expired' | 'expiring';
  file?: string;
  userId?: string;
  createdAt: string;
  updatedAt: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useCredentials(filters?: { status?: string; type?: string }) {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
  }

  const { data, error, mutate, isLoading } = useSWR(
    `/api/compvss/credentials?${params}`,
    fetcher
  );

  return {
    credentials: data?.credentials,
    stats: data?.stats,
    pagination: data?.pagination,
    isLoading,
    error,
    refetch: mutate,
  };
}

export function useCredential(credentialId?: string) {
  const { data, error, mutate, isLoading } = useSWR(
    credentialId ? `/api/compvss/credentials/${credentialId}` : null,
    fetcher
  );

  return {
    credential: data,
    isLoading,
    error,
    refetch: mutate,
  };
}

export function useUploadCredential() {
  return useMutation({
    mutationFn: async (data: FormData) => {
      const response = await fetch('/api/compvss/credentials/upload', {
        method: 'POST',
        body: data,
      });
      if (!response.ok) throw new Error('Failed to upload credential');
      return response.json();
    },
  });
}

export function useVerifyCredential() {
  return useMutation({
    mutationFn: async ({ credentialId, verified }: { credentialId: string; verified: boolean }) => {
      const response = await fetch(`/api/compvss/credentials/${credentialId}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verified }),
      });
      if (!response.ok) throw new Error('Failed to verify credential');
      return response.json();
    },
  });
}
