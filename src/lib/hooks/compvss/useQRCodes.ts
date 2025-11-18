import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface QRCode {
  id: string;
  code: string;
  type: string;
  data: unknown;
  expiresAt?: Date;
  scannedAt?: Date;
  scannedBy?: string;
  createdAt: Date;
  updatedAt: Date;
  // Zone-specific properties for access control
  name?: string;
  accessLevel?: string;
  activeUsers?: number;
  capacity?: number;
  // Scan-specific properties
  status?: string;
  time?: string;
}

interface QRCodeFilters {
  type?: string;
  status?: string;
  search?: string;
}

export function useQRCodes(filters?: QRCodeFilters) {
  return useQuery({
    queryKey: ['qrcodes', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.type) params.append('type', filters.type);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.search) params.append('search', filters.search);

      const response = await fetch(`/api/compvss/qr?${params}`);
      if (!response.ok) throw new Error('Failed to fetch QR codes');
      return response.json() as Promise<QRCode[]>;
    },
    staleTime: 30000,
  });
}

export function useQRCode(id: string) {
  return useQuery({
    queryKey: ['qrcodes', id],
    queryFn: async () => {
      const response = await fetch(`/api/compvss/qr/${id}`);
      if (!response.ok) throw new Error('Failed to fetch QR code');
      return response.json() as Promise<QRCode>;
    },
    enabled: !!id,
    staleTime: 30000,
  });
}

export function useGenerateQRCode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { type: string; data: unknown; expiresAt?: Date }) => {
      const response = await fetch('/api/compvss/qr/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to generate QR code');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qrcodes'] });
    },
  });
}

export function useScanQRCode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (code: string) => {
      const response = await fetch('/api/compvss/qr/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      if (!response.ok) throw new Error('Failed to scan QR code');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qrcodes'] });
    },
  });
}

// Backward compatibility aliases
export { useGenerateQRCode as useGenerateQR };
export { useScanQRCode as useScanQR };
