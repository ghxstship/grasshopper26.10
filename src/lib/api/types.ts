/**
 * API Type Definitions
 * Comprehensive types for all API endpoints
 */

// ============================================================================
// SHARED TYPES
// ============================================================================

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export type UserRole =
  | 'LEGEND_SUPER_ADMIN'
  | 'LEGEND_ADMIN'
  | 'LEGEND_DEVELOPER'
  | 'LEGEND_COLLABORATOR'
  | 'LEGEND_SUPPORT'
  | 'LEGEND_INCOGNITO'
  | 'CONSUMER'
  | 'EXTERNAL_TEAM'
  | 'INTERNAL_TEAM'
  | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// AUTH TYPES
// ============================================================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// ============================================================================
// GVTEWAY TYPES
// ============================================================================

export type EventCategory = 'MUSIC' | 'SPORTS' | 'ARTS' | 'FOOD' | 'TECH' | 'OTHER';
export type EventStatus = 'UPCOMING' | 'ONGOING' | 'PAST' | 'CANCELLED';

export interface Event {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  venue: string;
  category: EventCategory;
  status: EventStatus;
  imageUrl: string;
  ticketsAvailable: number;
  organizer?: {
    id: string;
    name: string;
  };
}

export interface CreateEventRequest {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  venue: string;
  category: EventCategory;
  ticketsAvailable: number;
  imageUrl?: string;
}

export interface EventFilters extends PaginationParams {
  category?: EventCategory;
  status?: EventStatus;
  search?: string;
}

export type TicketType = 'GENERAL' | 'VIP' | 'BACKSTAGE';
export type TicketStatus = 'ACTIVE' | 'USED' | 'CANCELLED';

export interface Ticket {
  id: string;
  type: TicketType;
  status: TicketStatus;
  qrCode: string;
  event: {
    id: string;
    name: string;
    startDate: string;
  };
}

export interface PurchaseTicketsRequest {
  eventId: string;
  ticketType: TicketType;
  quantity: number;
  paymentMethodId: string;
}

export interface PurchaseTicketsResponse {
  orderId: string;
  tickets: Ticket[];
  total: number;
}

export type AdventureDifficulty = 'EASY' | 'MODERATE' | 'HARD' | 'EXPERT';
export type AdventureCategory = 'OUTDOOR' | 'INDOOR' | 'WATER' | 'AIR' | 'EXTREME';

export interface Adventure {
  id: string;
  name: string;
  description: string;
  category: AdventureCategory;
  difficulty: AdventureDifficulty;
  duration: number;
  price: number;
  imageUrl: string;
}

export interface BookAdventureRequest {
  date: string;
  participants: number;
}

export interface BookAdventureResponse {
  bookingId: string;
  status: 'CONFIRMED' | 'PENDING';
  totalPrice: number;
}

export type MembershipTier = 'BASIC' | 'PREMIUM' | 'ELITE';

export interface SubscribeMembershipRequest {
  tier: MembershipTier;
  paymentMethodId: string;
}

export interface MembershipResponse {
  subscriptionId: string;
  tier: MembershipTier;
  status: 'ACTIVE' | 'CANCELLED' | 'EXPIRED';
  nextBillingDate: string;
}

// ============================================================================
// COMPVSS TYPES
// ============================================================================

export type AdvancingCategory = 'TECHNICAL' | 'LOGISTICS' | 'PRODUCTION' | 'HOSPITALITY';
export type AdvancingStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'IN_PROGRESS';
export type AdvancingPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface AdvancingRequest {
  id: string;
  category: AdvancingCategory;
  status: AdvancingStatus;
  priority?: AdvancingPriority;
  submittedBy: {
    id: string;
    name: string;
    email?: string;
  };
  submittedAt: string;
  details: {
    description: string;
    [key: string]: unknown;
  };
  approvers?: Array<{
    id: string;
    name: string;
    status: AdvancingStatus;
  }>;
}

export interface CreateAdvancingRequest {
  category: AdvancingCategory;
  description: string;
  priority: AdvancingPriority;
  eventId: string;
  details?: Record<string, unknown>;
}

export interface ApproveAdvancingRequest {
  comment?: string;
}

export interface AdvancingFilters extends PaginationParams {
  status?: AdvancingStatus;
  category?: AdvancingCategory;
}

export type QRCodeType = 'ACCESS' | 'TICKET' | 'CREDENTIAL';
export type QRCodeStatus = 'ACTIVE' | 'EXPIRED' | 'REVOKED';

export interface QRCode {
  id: string;
  qrCodeUrl: string;
  code: string;
  type: QRCodeType;
  status: QRCodeStatus;
  name?: string;
  zone?: string;
  scansRemaining?: number;
}

export interface GenerateQRCodeRequest {
  type: QRCodeType;
  name: string;
  description?: string;
  validFrom: string;
  validUntil: string;
  maxScans?: number;
  zone?: string;
}

export interface ScanQRCodeRequest {
  code: string;
}

export interface ScanQRCodeResponse {
  valid: boolean;
  qrCode?: QRCode;
}

export type TeamType = 'PRODUCTION' | 'TECHNICAL' | 'SECURITY' | 'HOSPITALITY';

export interface Team {
  id: string;
  name: string;
  type: TeamType;
  memberCount: number;
}

// ============================================================================
// ATLVS TYPES
// ============================================================================

export type ProjectStatus = 'PLANNING' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  startDate: string;
  endDate: string;
  progress: number;
  teamSize: number;
  budget?: number;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  budget?: number;
}

export interface ProjectFilters extends PaginationParams {
  status?: ProjectStatus;
}

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: {
    id: string;
    name: string;
  };
  dueDate: string;
  projectId?: string;
}

export interface CreateTaskRequest {
  projectId: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  assigneeId?: string;
  dueDate: string;
}

export interface TaskFilters extends PaginationParams {
  projectId?: string;
  assigneeId?: string;
  status?: TaskStatus;
}

export type EquipmentType = 'AUDIO' | 'VIDEO' | 'LIGHTING' | 'STAGING' | 'OTHER';
export type EquipmentStatus = 'AVAILABLE' | 'BOOKED' | 'MAINTENANCE' | 'RETIRED';

export interface Equipment {
  id: string;
  name: string;
  type: EquipmentType;
  status: EquipmentStatus;
  location: string;
}

export interface BookEquipmentRequest {
  startDate: string;
  endDate: string;
  projectId: string;
}

export interface BookEquipmentResponse {
  bookingId: string;
  status: 'CONFIRMED' | 'PENDING';
  equipment: {
    id: string;
    name: string;
  };
}

export interface EquipmentFilters extends PaginationParams {
  status?: EquipmentStatus;
  type?: EquipmentType;
}

// ============================================================================
// COMMON TYPES
// ============================================================================

export interface UploadFileResponse {
  url: string;
  fileId: string;
  size: number;
  mimeType: string;
}

export type SearchEntityType = 'EVENT' | 'PROJECT' | 'TASK' | 'USER';

export interface SearchResult {
  type: SearchEntityType;
  id: string;
  title: string;
  description: string;
  url: string;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
}

export interface SearchParams {
  q: string;
  type?: SearchEntityType;
}
