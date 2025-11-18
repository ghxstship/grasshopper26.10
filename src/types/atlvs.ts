/**
 * Shared TypeScript types for ATLVS module
 */

export interface AdvancingRequest {
  id: string;
  status: string;
  type?: string;
  title?: string;
  description?: string;
  project?: string;
  priority?: string;
  requestedAt?: string;
  requestedBy?: string;
  dueDate?: string;
  [key: string]: unknown;
}

export interface DataSource {
  id: string;
  name: string;
  type?: string;
  status?: string;
  lastSync?: string;
  recordCount?: number;
  [key: string]: unknown;
}

export interface Asset {
  id: string;
  name: string;
  type?: string;
  status?: string;
  location?: string;
  assignedTo?: string;
  [key: string]: unknown;
}

export interface Budget {
  id: string;
  name: string;
  amount?: number;
  spent?: number;
  category?: string;
  status?: string;
  [key: string]: unknown;
}

export interface Document {
  id: string;
  title: string;
  type?: string;
  status?: string;
  version?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface Project {
  id: string;
  name: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
  [key: string]: unknown;
}

export interface Automation {
  id: string;
  name: string;
  type?: string;
  status?: string;
  lastRun?: string;
  [key: string]: unknown;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  assignedTo?: string;
  dueDate?: string;
  project?: string;
  [key: string]: unknown;
}

export interface Team {
  id: string;
  name: string;
  members?: number;
  role?: string;
  status?: string;
  [key: string]: unknown;
}

export interface Expense {
  id: string;
  amount: number;
  category?: string;
  description?: string;
  status?: string;
  date?: string;
  [key: string]: unknown;
}

export interface Phase {
  id: string;
  name: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  progress?: number;
  [key: string]: unknown;
}
