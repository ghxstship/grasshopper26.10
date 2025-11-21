import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface RegisterData {
  email: string;
  password: string;
  name: string;
  role?: 'CONSUMER' | 'EXTERNAL_TEAM' | 'INTERNAL_TEAM';
}

interface RegisterResponse {
  success: boolean;
  data?: {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
    };
    message: string;
  };
  error?: {
    code: string;
    message: string;
  };
}

export function useRegister() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result: RegisterResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || 'Registration failed');
      }

      // Redirect to verification page
      router.push('/auth/verify-email?email=' + encodeURIComponent(data.email));
      
      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    register,
    isLoading,
    error,
  };
}
