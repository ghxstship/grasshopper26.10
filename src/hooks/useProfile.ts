/**
 * Profile Management Hook
 * Handles user profile updates across all platforms
 */

import useSWR from 'swr';
import { useState } from 'react';
import { fetcher } from '@/lib/api/client';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  bio?: string;
  location?: string;
  website?: string;
  instagram?: string;
  twitter?: string;
  interests?: string[];
  phone?: string;
  role?: string;
  department?: string;
  timezone?: string;
  avatar?: string;
}

export function useProfile() {
  const { data, error, mutate } = useSWR<UserProfile>('/api/profile', fetcher);
  const [isUpdating, setIsUpdating] = useState(false);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    setIsUpdating(true);
    try {
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
      return { success: true, data: updated };
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Update failed' 
      };
    } finally {
      setIsUpdating(false);
    }
  };

  const uploadAvatar = async (file: File) => {
    setIsUpdating(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload avatar');
      }

      const { url } = await response.json();
      await updateProfile({ avatar: url });
      return { success: true, url };
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Upload failed' 
      };
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    profile: data,
    isLoading: !error && !data,
    isError: error,
    isUpdating,
    updateProfile,
    uploadAvatar,
    mutate,
  };
}
