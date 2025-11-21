/**
 * GVTEWAY Service
 * Consumer-facing platform for events, tickets, adventures, and memberships
 */

import { apiClient } from '../client';
import type {
  Event,
  CreateEventRequest,
  EventFilters,
  PaginatedResponse,
  Ticket,
  PurchaseTicketsRequest,
  PurchaseTicketsResponse,
  Adventure,
  BookAdventureRequest,
  BookAdventureResponse,
  SubscribeMembershipRequest,
  MembershipResponse,
} from '../types';

export const gvtewayService = {
  // ============================================================================
  // EVENTS
  // ============================================================================

  /**
   * List all events with filters
   */
  async listEvents(filters?: EventFilters): Promise<PaginatedResponse<Event>> {
    const response = await apiClient.get<PaginatedResponse<Event>>('/api/events', {
      params: filters as Record<string, string | number | boolean>,
    });
    return response.data!;
  },

  /**
   * Get single event by ID
   */
  async getEvent(id: string): Promise<Event> {
    const response = await apiClient.get<Event>(`/api/events/${id}`);
    return response.data!;
  },

  /**
   * Create new event (requires ORGANIZER role)
   */
  async createEvent(data: CreateEventRequest): Promise<Event> {
    const response = await apiClient.post<Event>('/api/events', data);
    return response.data!;
  },

  /**
   * Update event
   */
  async updateEvent(id: string, data: Partial<CreateEventRequest>): Promise<Event> {
    const response = await apiClient.put<Event>(`/api/events/${id}`, data);
    return response.data!;
  },

  /**
   * Delete event
   */
  async deleteEvent(id: string): Promise<void> {
    await apiClient.delete(`/api/events/${id}`);
  },

  // ============================================================================
  // TICKETS
  // ============================================================================

  /**
   * List user's tickets
   */
  async listTickets(): Promise<Ticket[]> {
    const response = await apiClient.get<{ tickets: Ticket[] }>('/api/tickets');
    return response.data!.tickets;
  },

  /**
   * Purchase tickets
   */
  async purchaseTickets(data: PurchaseTicketsRequest): Promise<PurchaseTicketsResponse> {
    const response = await apiClient.post<PurchaseTicketsResponse>('/api/tickets/purchase', data);
    return response.data!;
  },

  // ============================================================================
  // ADVENTURES
  // ============================================================================

  /**
   * List available adventures
   */
  async listAdventures(filters?: { category?: string; difficulty?: string }): Promise<Adventure[]> {
    const response = await apiClient.get<{ adventures: Adventure[] }>('/api/adventures', {
      params: filters as Record<string, string>,
    });
    return response.data!.adventures;
  },

  /**
   * Get single adventure
   */
  async getAdventure(id: string): Promise<Adventure> {
    const response = await apiClient.get<Adventure>(`/api/adventures/${id}`);
    return response.data!;
  },

  /**
   * Book an adventure
   */
  async bookAdventure(id: string, data: BookAdventureRequest): Promise<BookAdventureResponse> {
    const response = await apiClient.post<BookAdventureResponse>(`/api/adventures/${id}/book`, data);
    return response.data!;
  },

  // ============================================================================
  // MEMBERSHIPS
  // ============================================================================

  /**
   * Subscribe to membership
   */
  async subscribeMembership(data: SubscribeMembershipRequest): Promise<MembershipResponse> {
    const response = await apiClient.post<MembershipResponse>('/api/memberships/subscribe', data);
    return response.data!;
  },

  /**
   * Get current membership
   */
  async getCurrentMembership(): Promise<MembershipResponse | null> {
    const response = await apiClient.get<MembershipResponse>('/api/memberships/current');
    return response.data || null;
  },

  /**
   * Cancel membership
   */
  async cancelMembership(subscriptionId: string): Promise<void> {
    await apiClient.post(`/api/memberships/${subscriptionId}/cancel`);
  },
};
