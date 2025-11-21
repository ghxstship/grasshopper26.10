import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api/client';

interface Organization {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
}

export function useOrganization(organizationId?: string) {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!organizationId) return;

    const fetchOrganization = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }
        const response = await apiClient.get<Organization>(`/api/organizations/${organizationId}`);
        if (response.data) {
          setOrganization(response.data);
        }
      } catch (err) {
        setError('Failed to fetch organization');
        console.error('Failed to fetch organization:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganization();
  }, [organizationId]);

  return { organization, loading, error };
}
