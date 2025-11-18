import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface DocumentVersion {
  id: string;
  version: number | string;
  uploadedBy: string;
  uploadedDate: string;
  changeNotes?: string;
  author?: string;
  date?: string;
  changes?: string;
}

export interface SharedPerson {
  id: string;
  name: string;
  email: string;
  permission: 'view' | 'edit' | 'admin';
  role?: string;
  access?: string;
}

export interface ActivityItem {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details?: string;
  time?: string;
}

export interface Document {
  id: string;
  name: string;
  description?: string;
  category?: string;
  type: 'contract' | 'rider' | 'permit' | 'invoice' | 'other';
  fileType: 'pdf' | 'docx' | 'xlsx' | 'jpg' | 'png';
  size: string;
  uploadedBy: string;
  uploadedDate: string;
  project: string;
  projectId?: string;
  version: number;
  versions?: DocumentVersion[];
  tags: string[];
  url?: string;
  metadata?: Record<string, unknown>;
  status?: string;
  cost?: number;
  expiryDate?: string;
  sharedWith?: SharedPerson[];
  activity?: ActivityItem[];
  lastModified?: string;
  updatedAt?: string;
}

export interface CreateDocumentInput {
  name: string;
  type: Document['type'];
  fileType: Document['fileType'];
  projectId: string;
  file: File;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

export interface UpdateDocumentInput {
  id: string;
  name?: string;
  type?: Document['type'];
  tags?: string[];
  metadata?: Record<string, unknown>;
}

/**
 * Hook for managing documents
 */
export function useDocuments(projectId?: string) {
  const queryClient = useQueryClient();

  // Fetch all documents or documents for a specific project
  const { data: documents = [], isLoading, error, refetch } = useQuery<Document[]>({
    queryKey: ['documents', projectId],
    queryFn: async () => {
      const url = projectId 
        ? `/api/atlvs/documents?projectId=${projectId}`
        : '/api/atlvs/documents';
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch documents');
      return response.json();
    },
  });

  // Create document mutation
  const createDocument = useMutation({
    mutationFn: async (input: CreateDocumentInput) => {
      const formData = new FormData();
      formData.append('file', input.file);
      formData.append('name', input.name);
      formData.append('type', input.type);
      formData.append('fileType', input.fileType);
      formData.append('projectId', input.projectId);
      if (input.tags) formData.append('tags', JSON.stringify(input.tags));
      if (input.metadata) formData.append('metadata', JSON.stringify(input.metadata));

      const response = await fetch('/api/atlvs/documents', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to create document');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });

  // Update document mutation
  const updateDocument = useMutation({
    mutationFn: async (input: UpdateDocumentInput) => {
      const response = await fetch(`/api/atlvs/documents/${input.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      if (!response.ok) throw new Error('Failed to update document');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });

  // Delete document mutation
  const deleteDocument = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/atlvs/documents/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete document');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });

  // Download document
  const downloadDocument = async (id: string) => {
    const response = await fetch(`/api/atlvs/documents/${id}/download`);
    if (!response.ok) throw new Error('Failed to download document');
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = documents.find(d => d.id === id)?.name || 'document';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return {
    documents,
    isLoading,
    error,
    refetch,
    createDocument: createDocument.mutate,
    updateDocument: updateDocument.mutate,
    deleteDocument: deleteDocument.mutate,
    downloadDocument,
    isCreating: createDocument.isPending,
    isUpdating: updateDocument.isPending,
    isDeleting: deleteDocument.isPending,
  };
}

/**
 * Hook for fetching a single document
 */
export function useDocument(id: string) {
  return useQuery<Document>({
    queryKey: ['documents', id],
    queryFn: async () => {
      const response = await fetch(`/api/atlvs/documents/${id}`);
      if (!response.ok) throw new Error('Failed to fetch document');
      return response.json();
    },
    enabled: !!id,
  });
}
