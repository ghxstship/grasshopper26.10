/**
 * React Query hooks for ATLVS Projects
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProjectStatus, Priority } from '@prisma/client';

export interface ProjectFilters {
  organizationId?: string;
  status?: ProjectStatus;
  priority?: Priority;
  createdBy?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateProjectData {
  organizationId: string;
  name: string;
  slug: string;
  description?: string;
  priority?: Priority;
  startDate?: string;
  endDate?: string;
  budget?: number;
  metadata?: Record<string, unknown>;
}

export interface UpdateProjectData {
  name?: string;
  description?: string;
  status?: ProjectStatus;
  priority?: Priority;
  startDate?: string;
  endDate?: string;
  budget?: number;
  metadata?: Record<string, unknown>;
}

/**
 * Hook to fetch list of projects
 */
export function useProjects(filters: ProjectFilters = {}) {
  return useQuery({
    queryKey: ['projects', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      
      if (filters.organizationId) params.append('organizationId', filters.organizationId);
      if (filters.status) params.append('status', filters.status);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.createdBy) params.append('createdBy', filters.createdBy);
      if (filters.search) params.append('search', filters.search);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());

      const response = await fetch(`/api/atlvs/projects?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      
      return response.json();
    },
  });
}

/**
 * Hook to fetch a single project by ID
 */
export function useProject(id: string) {
  return useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      const response = await fetch(`/api/atlvs/projects/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch project');
      }
      
      return response.json();
    },
    enabled: !!id,
  });
}

/**
 * Hook to fetch project timeline
 */
export function useProjectTimeline(id: string) {
  return useQuery({
    queryKey: ['project-timeline', id],
    queryFn: async () => {
      const response = await fetch(`/api/atlvs/projects/${id}/timeline`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch project timeline');
      }
      
      return response.json();
    },
    enabled: !!id,
  });
}

/**
 * Hook to fetch project budget
 */
export function useProjectBudget(id: string) {
  return useQuery({
    queryKey: ['project-budget', id],
    queryFn: async () => {
      const response = await fetch(`/api/atlvs/projects/${id}/budget`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch project budget');
      }
      
      return response.json();
    },
    enabled: !!id,
  });
}

/**
 * Hook to fetch project team
 */
export function useProjectTeam(id: string) {
  return useQuery({
    queryKey: ['project-team', id],
    queryFn: async () => {
      const response = await fetch(`/api/atlvs/projects/${id}/team`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch project team');
      }
      
      return response.json();
    },
    enabled: !!id,
  });
}

/**
 * Hook to fetch project analytics
 */
export function useProjectAnalytics(id: string) {
  return useQuery({
    queryKey: ['project-analytics', id],
    queryFn: async () => {
      const response = await fetch(`/api/atlvs/projects/${id}/analytics`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch project analytics');
      }
      
      return response.json();
    },
    enabled: !!id,
  });
}

/**
 * Hook to create a new project
 */
export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateProjectData) => {
      const response = await fetch('/api/atlvs/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create project');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

/**
 * Hook to update a project
 */
export function useUpdateProject(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProjectData) => {
      const response = await fetch(`/api/atlvs/projects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update project');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', id] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

/**
 * Hook to delete a project
 */
export function useDeleteProject(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/atlvs/projects/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete project');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

/**
 * Hook to fetch project phases
 */
export function useProjectPhases(projectId: string) {
  return useQuery({
    queryKey: ['projectPhases', projectId],
    queryFn: async () => {
      const response = await fetch(`/api/atlvs/projects/${projectId}/phases`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch project phases');
      }
      
      return response.json();
    },
    enabled: !!projectId,
  });
}

/**
 * Hook to fetch project templates
 */
export function useProjectTemplates() {
  return useQuery({
    queryKey: ['atlvs', 'project-templates'],
    queryFn: async () => {
      const response = await fetch('/api/atlvs/projects/templates');
      if (!response.ok) throw new Error('Failed to fetch project templates');
      return response.json();
    },
    staleTime: 1000 * 60 * 10,
  });
}
