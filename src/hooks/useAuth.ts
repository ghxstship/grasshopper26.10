/**
 * useAuth Hook
 * Authentication state management
 */

'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api/client';

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        
        if (!token) {
          setLoading(false);
          return;
        }

        apiClient.setAuthToken(token);
        const response = await apiClient.get<User>('/api/profile');

        if (response.data) {
          setUser(response.data);
        }
      } catch (err) {
        setError('Failed to authenticate');
        localStorage.removeItem('auth_token');
        sessionStorage.removeItem('auth_token');
        apiClient.clearAuthToken();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string, rememberMe = false) => {
    try {
      setError(null);
      const response = await apiClient.post<{ token: string; user: User }>(
        '/api/auth/login',
        { email, password }
      );

      if (response.data) {
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('auth_token', response.data.token);
        apiClient.setAuthToken(response.data.token);
        setUser(response.data.user);
        return response.data;
      }
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'message' in err 
        ? (err.message as string)
        : 'Login failed';
      setError(message);
      throw err;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setError(null);
      const response = await apiClient.post<{ token: string; user: User }>(
        '/api/auth/register',
        { name, email, password }
      );

      if (response.data) {
        localStorage.setItem('auth_token', response.data.token);
        apiClient.setAuthToken(response.data.token);
        setUser(response.data.user);
        return response.data;
      }
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'message' in err 
        ? (err.message as string)
        : 'Registration failed';
      setError(message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await apiClient.post('/api/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('auth_token');
      sessionStorage.removeItem('auth_token');
      apiClient.clearAuthToken();
      setUser(null);
    }
  };

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };
}
