import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface Credential {
  id: string;
  userId: string;
  type: string;
  name: string;
  status: 'pending' | 'verified' | 'expired' | 'rejected';
  issuedDate?: string;
  expiryDate?: string;
  documentUrl?: string;
  verifiedAt?: string;
  verifiedBy?: string;
  notes?: string;
}

interface CredentialsParams {
  status?: string;
  type?: string;
}

export function useCredentials(params?: CredentialsParams) {
  return useQuery({
    queryKey: ['compvss', 'credentials', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.status) searchParams.append('status', params.status);
      if (params?.type) searchParams.append('type', params.type);
      
      const response = await fetch(`/api/compvss/credentials?${searchParams}`);
      if (!response.ok) throw new Error('Failed to fetch credentials');
      const data = await response.json();
      return {
        credentials: data.credentials as Credential[],
        total: data.total as number,
      };
    },
  });
}

export function useCredential(id?: string) {
  return useQuery({
    queryKey: ['compvss', 'credential', id],
    queryFn: async () => {
      if (!id) throw new Error('Credential ID required');
      const response = await fetch(`/api/compvss/credentials/${id}`);
      if (!response.ok) throw new Error('Failed to fetch credential');
      return response.json() as Promise<Credential>;
    },
    enabled: !!id,
  });
}

export function useVerifyCredential() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ credentialId, verified, notes }: { 
      credentialId: string; 
      verified: boolean;
      notes?: string;
    }) => {
      const response = await fetch(`/api/compvss/credentials/${credentialId}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verified, notes }),
      });
      if (!response.ok) throw new Error('Failed to verify credential');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['compvss', 'credentials'] });
    },
  });
}

export function useUploadCredential() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch('/api/compvss/credentials/upload', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to upload credential');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['compvss', 'credentials'] });
    },
  });
}
