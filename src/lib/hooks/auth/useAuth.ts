import { useSession } from 'next-auth/react';

export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
}

export function useAuth() {
  const { data: session, status } = useSession();
  
  return {
    user: session?.user as User | undefined,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    session,
  };
}
