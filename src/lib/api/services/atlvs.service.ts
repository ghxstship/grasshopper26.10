/**
 * ATLVS Service
 * Internal team platform for project management, tasks, and equipment
 */

import { apiClient } from '../client';
import type {
  Project,
  CreateProjectRequest,
  ProjectFilters,
  PaginatedResponse,
  Task,
  CreateTaskRequest,
  TaskFilters,
  Equipment,
  BookEquipmentRequest,
  BookEquipmentResponse,
  EquipmentFilters,
} from '../types';

export const atlvsService = {
  // ============================================================================
  // PROJECTS
  // ============================================================================

  /**
   * List projects
   */
  async listProjects(filters?: ProjectFilters): Promise<PaginatedResponse<Project>> {
    const response = await apiClient.get<PaginatedResponse<Project>>('/api/atlvs/projects', {
      params: filters as Record<string, string | number | boolean>,
    });
    return response.data!;
  },

  /**
   * Get single project
   */
  async getProject(id: string): Promise<Project> {
    const response = await apiClient.get<Project>(`/api/atlvs/projects/${id}`);
    return response.data!;
  },

  /**
   * Create new project
   */
  async createProject(data: CreateProjectRequest): Promise<Project> {
    const response = await apiClient.post<Project>('/api/atlvs/projects', data);
    return response.data!;
  },

  /**
   * Update project
   */
  async updateProject(id: string, data: Partial<CreateProjectRequest>): Promise<Project> {
    const response = await apiClient.put<Project>(`/api/atlvs/projects/${id}`, data);
    return response.data!;
  },

  /**
   * Delete project
   */
  async deleteProject(id: string): Promise<void> {
    await apiClient.delete(`/api/atlvs/projects/${id}`);
  },

  // ============================================================================
  // TASKS
  // ============================================================================

  /**
   * List tasks
   */
  async listTasks(filters?: TaskFilters): Promise<PaginatedResponse<Task>> {
    const response = await apiClient.get<PaginatedResponse<Task>>('/api/atlvs/tasks', {
      params: filters as Record<string, string | number | boolean>,
    });
    return response.data!;
  },

  /**
   * Get single task
   */
  async getTask(id: string): Promise<Task> {
    const response = await apiClient.get<Task>(`/api/atlvs/tasks/${id}`);
    return response.data!;
  },

  /**
   * Create new task
   */
  async createTask(data: CreateTaskRequest): Promise<Task> {
    const response = await apiClient.post<Task>('/api/atlvs/tasks', data);
    return response.data!;
  },

  /**
   * Update task
   */
  async updateTask(id: string, data: Partial<CreateTaskRequest>): Promise<Task> {
    const response = await apiClient.put<Task>(`/api/atlvs/tasks/${id}`, data);
    return response.data!;
  },

  /**
   * Delete task
   */
  async deleteTask(id: string): Promise<void> {
    await apiClient.delete(`/api/atlvs/tasks/${id}`);
  },

  // ============================================================================
  // EQUIPMENT
  // ============================================================================

  /**
   * List equipment
   */
  async listEquipment(filters?: EquipmentFilters): Promise<PaginatedResponse<Equipment>> {
    const response = await apiClient.get<PaginatedResponse<Equipment>>('/api/atlvs/equipment', {
      params: filters as Record<string, string | number | boolean>,
    });
    return response.data!;
  },

  /**
   * Get single equipment
   */
  async getEquipment(id: string): Promise<Equipment> {
    const response = await apiClient.get<Equipment>(`/api/atlvs/equipment/${id}`);
    return response.data!;
  },

  /**
   * Book equipment
   */
  async bookEquipment(id: string, data: BookEquipmentRequest): Promise<BookEquipmentResponse> {
    const response = await apiClient.post<BookEquipmentResponse>(`/api/atlvs/equipment/${id}/book`, data);
    return response.data!;
  },

  // ============================================================================
  // ANALYTICS & KPIs
  // ============================================================================

  /**
   * Get event KPIs
   */
  async getEventKPIs(eventId: string): Promise<unknown> {
    const response = await apiClient.get(`/api/atlvs/kpi/event/${eventId}`);
    return response.data!;
  },

  /**
   * Get financial KPIs
   */
  async getFinancialKPIs(eventId: string): Promise<unknown> {
    const response = await apiClient.get(`/api/atlvs/kpi/financial/${eventId}`);
    return response.data!;
  },

  /**
   * Get marketing KPIs
   */
  async getMarketingKPIs(eventId: string): Promise<unknown> {
    const response = await apiClient.get(`/api/atlvs/kpi/marketing/${eventId}`);
    return response.data!;
  },

  /**
   * Get operational KPIs
   */
  async getOperationalKPIs(projectId: string): Promise<unknown> {
    const response = await apiClient.get(`/api/atlvs/kpi/operational/${projectId}`);
    return response.data!;
  },

  /**
   * Get dashboard KPIs
   */
  async getDashboardKPIs(eventId: string): Promise<unknown> {
    const response = await apiClient.get(`/api/atlvs/kpi/dashboard/${eventId}`);
    return response.data!;
  },
};
