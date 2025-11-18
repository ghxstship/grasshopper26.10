import useSWR from 'swr';
import { useMutation } from '@tanstack/react-query';

export interface QRCode {
  id: string;
  code: string;
  type: string;
  data: Record<string, unknown>;
  scannedAt?: string;
  scannedBy?: string;
  createdAt: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useQRCodes(filters?: { type?: string; status?: string }) {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
  }

  const { data, error, mutate, isLoading } = useSWR(
    `/api/compvss/qr?${params}`,
    fetcher
  );

  return {
    qrCodes: data?.qrCodes,
    pagination: data?.pagination,
    isLoading,
    error,
    refetch: mutate,
  };
}

export function useGenerateQR() {
  return useMutation({
    mutationFn: async (data: { type: string; data: Record<string, unknown> }) => {
      const response = await fetch('/api/compvss/qr/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to generate QR code');
      return response.json();
    },
  });
}

export function useScanQR() {
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
  });
}
