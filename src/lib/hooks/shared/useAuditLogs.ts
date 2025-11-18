import { useQuery } from '@tanstack/react-query';

interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  changes?: any;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

interface AuditLogFilters {
  userId?: string;
  action?: string;
  resource?: string;
  startDate?: string;
  endDate?: string;
}

export function useAuditLogs(filters?: AuditLogFilters) {
  return useQuery({
    queryKey: ['auditLogs', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.userId) params.append('userId', filters.userId);
      if (filters?.action) params.append('action', filters.action);
      if (filters?.resource) params.append('resource', filters.resource);
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);

      const response = await fetch(`/api/audit-logs?${params}`);
      if (!response.ok) throw new Error('Failed to fetch audit logs');
      return response.json() as Promise<AuditLog[]>;
    },
    staleTime: 30000,
  });
}

export function useEntityAuditLogs(resource: string, resourceId: string) {
  return useQuery({
    queryKey: ['auditLogs', resource, resourceId],
    queryFn: async () => {
      const response = await fetch(`/api/audit-logs/${resource}/${resourceId}`);
      if (!response.ok) throw new Error('Failed to fetch entity audit logs');
      return response.json() as Promise<AuditLog[]>;
    },
    enabled: !!resource && !!resourceId,
    staleTime: 30000,
  });
}
