import { useState, useCallback } from 'react';
import { apiClient } from '@/lib/api/client';

interface CheckinData {
  userId: string;
  eventId: string;
  timestamp: string;
  location?: string;
}

export function useOperationsCheckin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const performCheckin = useCallback(async (data: CheckinData) => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      if (token) {
        apiClient.setAuthToken(token);
      }
      const response = await apiClient.post('/api/compvss/operations/checkin', data);
      return response.data;
    } catch (err) {
      setError('Failed to perform check-in');
      console.error('Failed to perform check-in:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { performCheckin, loading, error };
}
