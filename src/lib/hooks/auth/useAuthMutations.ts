/**
 * React Query hooks for Authentication mutations
 */

import { useMutation } from '@tanstack/react-query';

interface RegisterData {
  name: string;
  email: string;
  password: string;
  metadata?: Record<string, unknown>;
}

interface ResendVerificationData {
  email: string;
}

export function useRegister() {
  return useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Registration failed');
      }
      
      return response.json();
    },
  });
}

export function useResendVerification() {
  return useMutation({
    mutationFn: async (data: ResendVerificationData) => {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to resend verification email');
      }
      
      return response.json();
    },
  });
}
