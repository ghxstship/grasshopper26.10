/**
 * User Data Hook
 * Fetches and caches current user data
 */

import useSWR from 'swr';
import { useAuth } from './useAuth';

export interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useUser() {
  const { isAuthenticated } = useAuth();

  const { data, error, mutate, isLoading } = useSWR<User>(
    isAuthenticated ? '/api/auth/me' : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000, // 1 minute
    }
  );

  const updateProfile = async (updates: Partial<User>) => {
    const response = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error('Failed to update profile');
    }

    const updated = await response.json();
    mutate(updated, false);
    return updated;
  };

  return {
    user: data,
    isLoading: isAuthenticated && isLoading,
    isError: error,
    mutate,
    updateProfile,
  };
}
