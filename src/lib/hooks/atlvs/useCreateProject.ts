import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectData: any) => {
      const response = await fetch('/api/atlvs/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create project');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['atlvs', 'projects'] });
    },
  });
}
