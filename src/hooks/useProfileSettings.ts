import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api/client';

interface ProfileSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
  theme: 'light' | 'dark' | 'auto';
  language: string;
}

export function useProfileSettings() {
  const [settings, setSettings] = useState<ProfileSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }
        // Try both endpoints
        const response = await apiClient.get<ProfileSettings>('/api/profile/settings').catch(() => 
          apiClient.get<ProfileSettings>('/api/settings/profile')
        );
        if (response.data) {
          setSettings(response.data);
        }
      } catch (err) {
        setError('Failed to fetch settings');
        console.error('Failed to fetch settings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const updateSettings = async (newSettings: Partial<ProfileSettings>) => {
    try {
      const response = await apiClient.put<ProfileSettings>('/api/profile/settings', newSettings);
      if (response.data) {
        setSettings(response.data);
      }
    } catch (err) {
      console.error('Failed to update settings:', err);
      throw err;
    }
  };

  return { settings, loading, error, updateSettings };
}
