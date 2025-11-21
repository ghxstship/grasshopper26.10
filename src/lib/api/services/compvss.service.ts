/**
 * COMPVSS Service
 * External team platform for advancing, QR codes, and team management
 */

import { apiClient } from '../client';
import type {
  AdvancingRequest,
  CreateAdvancingRequest,
  ApproveAdvancingRequest,
  AdvancingFilters,
  PaginatedResponse,
  QRCode,
  GenerateQRCodeRequest,
  ScanQRCodeRequest,
  ScanQRCodeResponse,
  Team,
} from '../types';

export const compvssService = {
  // ============================================================================
  // ADVANCING
  // ============================================================================

  /**
   * List advancing requests
   */
  async listAdvancingRequests(filters?: AdvancingFilters): Promise<PaginatedResponse<AdvancingRequest>> {
    const response = await apiClient.get<PaginatedResponse<AdvancingRequest>>('/api/atlvs/advancing', {
      params: filters as Record<string, string | number | boolean>,
    });
    return response.data!;
  },

  /**
   * Get single advancing request
   */
  async getAdvancingRequest(id: string): Promise<AdvancingRequest> {
    const response = await apiClient.get<AdvancingRequest>(`/api/atlvs/advancing/${id}`);
    return response.data!;
  },

  /**
   * Create new advancing request
   */
  async createAdvancingRequest(data: CreateAdvancingRequest): Promise<AdvancingRequest> {
    const response = await apiClient.post<AdvancingRequest>('/api/atlvs/advancing', data);
    return response.data!;
  },

  /**
   * Approve advancing request
   */
  async approveAdvancingRequest(id: string, data?: ApproveAdvancingRequest): Promise<AdvancingRequest> {
    const response = await apiClient.post<AdvancingRequest>(`/api/atlvs/advancing/${id}/approve`, data);
    return response.data!;
  },

  /**
   * Reject advancing request
   */
  async rejectAdvancingRequest(id: string, data?: ApproveAdvancingRequest): Promise<AdvancingRequest> {
    const response = await apiClient.post<AdvancingRequest>(`/api/atlvs/advancing/${id}/reject`, data);
    return response.data!;
  },

  /**
   * Update advancing request status
   */
  async updateAdvancingStatus(id: string, status: string): Promise<AdvancingRequest> {
    const response = await apiClient.patch<AdvancingRequest>(`/api/atlvs/advancing/${id}/status`, { status });
    return response.data!;
  },

  /**
   * Get advancing comments
   */
  async getAdvancingComments(id: string): Promise<unknown[]> {
    const response = await apiClient.get<{ comments: unknown[] }>(`/api/atlvs/advancing/${id}/comments`);
    return response.data!.comments;
  },

  /**
   * Add comment to advancing request
   */
  async addAdvancingComment(id: string, comment: string): Promise<unknown> {
    const response = await apiClient.post(`/api/atlvs/advancing/${id}/comments`, { comment });
    return response.data!;
  },

  // ============================================================================
  // QR CODES
  // ============================================================================

  /**
   * Generate QR code
   */
  async generateQRCode(data: GenerateQRCodeRequest): Promise<QRCode> {
    const response = await apiClient.post<QRCode>('/api/compvss/qr/generate', data);
    return response.data!;
  },

  /**
   * Scan and validate QR code
   */
  async scanQRCode(data: ScanQRCodeRequest): Promise<ScanQRCodeResponse> {
    const response = await apiClient.post<ScanQRCodeResponse>('/api/compvss/qr/scan', data);
    return response.data!;
  },

  /**
   * List QR codes
   */
  async listQRCodes(): Promise<QRCode[]> {
    const response = await apiClient.get<{ qrCodes: QRCode[] }>('/api/compvss/qr');
    return response.data!.qrCodes;
  },

  /**
   * Revoke QR code
   */
  async revokeQRCode(id: string): Promise<void> {
    await apiClient.post(`/api/compvss/qr/${id}/revoke`);
  },

  // ============================================================================
  // TEAMS
  // ============================================================================

  /**
   * List teams
   */
  async listTeams(): Promise<Team[]> {
    const response = await apiClient.get<{ teams: Team[] }>('/api/compvss/teams');
    return response.data!.teams;
  },

  /**
   * Get single team
   */
  async getTeam(id: string): Promise<Team> {
    const response = await apiClient.get<Team>(`/api/compvss/teams/${id}`);
    return response.data!;
  },

  /**
   * Create team
   */
  async createTeam(data: { name: string; type: string }): Promise<Team> {
    const response = await apiClient.post<Team>('/api/compvss/teams', data);
    return response.data!;
  },
};
