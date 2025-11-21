/**
 * User API Service
 * Centralized user-related API calls
 */

import { apiClient } from '../client';

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  bio?: string;
  role: string;
  createdAt: string;
}

export interface UpdateProfileRequest {
  name?: string;
  bio?: string;
  image?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export const userService = {
  /**
   * Get current user profile
   */
  async getProfile() {
    const response = await apiClient.get<User>('/api/profile');
    return response.data;
  },

  /**
   * Update user profile
   */
  async updateProfile(data: UpdateProfileRequest) {
    const response = await apiClient.put<User>('/api/profile', data);
    return response.data;
  },

  /**
   * Change password
   */
  async changePassword(data: ChangePasswordRequest) {
    const response = await apiClient.post('/api/profile/password', data);
    return response.data;
  },

  /**
   * Upload profile image
   */
  async uploadImage(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<{ url: string }>('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Delete account
   */
  async deleteAccount() {
    const response = await apiClient.delete('/api/profile');
    return response.data;
  },
};
