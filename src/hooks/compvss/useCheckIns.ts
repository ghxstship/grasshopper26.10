import useSWR from 'swr';
import { useMutation } from '@tanstack/react-query';

export interface CheckIn {
  id: string;
  userId: string;
  userName: string;
  location: string;
  checkInTime: string;
  checkOutTime?: string;
  notes?: string;
  qrCode?: string;
}

export interface CheckInStats {
  totalCheckIns: number;
  activeNow: number;
  byLocation: Record<string, number>;
  byDate: Record<string, number>;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useCheckIns(filters?: { location?: string; date?: string }) {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
  }

  const { data, error, mutate, isLoading } = useSWR(
    `/api/compvss/checkin/history?${params}`,
    fetcher
  );

  return {
    checkIns: data?.checkIns,
    pagination: data?.pagination,
    isLoading,
    error,
    refetch: mutate,
  };
}

export function useCheckInStats() {
  const { data, error, mutate, isLoading } = useSWR<CheckInStats>(
    '/api/compvss/checkin/stats',
    fetcher
  );

  return {
    stats: data,
    isLoading,
    error,
    refetch: mutate,
  };
}

export function useCreateCheckIn() {
  return useMutation({
    mutationFn: async (data: { location: string; notes?: string; qrCode?: string }) => {
      const response = await fetch('/api/compvss/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to check in');
      return response.json();
    },
  });
}
