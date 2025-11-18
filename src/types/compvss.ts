/**
 * TypeScript types for COMPVSS module
 */

export interface Opportunity {
  id: string;
  title: string;
  description?: string;
  type?: string;
  status?: string;
  compensation?: number;
  location?: string;
  [key: string]: unknown;
}

export interface Application {
  id: string;
  opportunityId: string;
  userId: string;
  status?: string;
  submittedAt?: string;
  [key: string]: unknown;
}

export interface TeamMember {
  id: string;
  name: string;
  role?: string;
  email?: string;
  status?: string;
  [key: string]: unknown;
}

export interface Referral {
  id: string;
  referrerId: string;
  refereeId: string;
  status?: string;
  reward?: number;
  [key: string]: unknown;
}

export interface QRCode {
  id: string;
  data: string;
  type?: string;
  createdAt?: string;
  [key: string]: unknown;
}

export interface ComplianceItem {
  id: string;
  title: string;
  description?: string;
  status?: string;
  dueDate?: string;
  [key: string]: unknown;
}

export interface TrainingModule {
  id: string;
  title: string;
  description?: string;
  duration?: number;
  status?: string;
  progress?: number;
  [key: string]: unknown;
}
