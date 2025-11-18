import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface StoredFile {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  bucket: string;
  path: string;
  uploadedBy: string;
  createdAt: Date;
}

interface FileFilters {
  bucket?: string;
  type?: string;
  search?: string;
}

export function useFiles(filters?: FileFilters) {
  return useQuery({
    queryKey: ['files', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.bucket) params.append('bucket', filters.bucket);
      if (filters?.type) params.append('type', filters.type);
      if (filters?.search) params.append('search', filters.search);

      const response = await fetch(`/api/files?${params}`);
      if (!response.ok) throw new Error('Failed to fetch files');
      return response.json() as Promise<StoredFile[]>;
    },
    staleTime: 30000,
  });
}

export function useUploadFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { file: File; bucket: string; path?: string }) => {
      const formData = new FormData();
      formData.append('file', data.file as Blob, data.file.name);
      formData.append('bucket', data.bucket);
      if (data.path) formData.append('path', data.path);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to upload file');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  });
}

export function useDeleteFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/upload/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete file');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  });
}
