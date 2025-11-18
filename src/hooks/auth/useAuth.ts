/**
 * Authentication Hook
 * Manages authentication state and operations
 */

import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  image?: string;
  role: string;
}

export interface UseAuthReturn {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    name: string;
  }) => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const { data: session, status } = useSession();
  const router = useRouter();

  const login = useCallback(
    async (credentials: { email: string; password: string }) => {
      const result = await signIn('credentials', {
        ...credentials,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      router.refresh();
    },
    [router]
  );

  const logout = useCallback(async () => {
    await signOut({ redirect: false });
    router.push('/');
  }, [router]);

  const register = useCallback(
    async (data: { email: string; password: string; name: string }) => {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }

      // Auto-login after registration
      await login({ email: data.email, password: data.password });
    },
    [login]
  );

  return {
    user: session?.user as AuthUser | null,
    isAuthenticated: !!session,
    isLoading: status === 'loading',
    login,
    logout,
    register,
  };
}
