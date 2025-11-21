import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api/client';

interface SocialProfile {
  username: string;
  displayName: string;
  bio?: string;
  avatar?: string;
  followers: number;
  following: number;
}

interface Friend {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
}

export function useSocialProfile(username?: string) {
  const [profile, setProfile] = useState<SocialProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }
        const response = await apiClient.get<SocialProfile>(`/api/social/profile/${username}`);
        if (response.data) {
          setProfile(response.data);
        }
      } catch (err) {
        setError('Failed to fetch profile');
        console.error('Failed to fetch profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  return { profile, loading, error };
}

export function useFriends() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }
        const response = await apiClient.get<{ friends: Friend[] }>('/api/social/friends');
        if (response.data?.friends) {
          setFriends(response.data.friends);
        }
      } catch (err) {
        setError('Failed to fetch friends');
        console.error('Failed to fetch friends:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  return { friends, loading, error };
}
