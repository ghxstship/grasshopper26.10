/**
 * Common Service
 * Shared utilities for file upload, search, etc.
 */

import { apiClient } from '../client';
import type { UploadFileResponse, SearchParams, SearchResponse } from '../types';

export const commonService = {
  /**
   * Upload file
   */
  async uploadFile(file: File): Promise<UploadFileResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('File upload failed');
    }

    return response.json();
  },

  /**
   * Global search
   */
  async search(params: SearchParams): Promise<SearchResponse> {
    const response = await apiClient.get<SearchResponse>('/api/search', {
      params: params as unknown as Record<string, string>,
    });
    return response.data!;
  },
};
