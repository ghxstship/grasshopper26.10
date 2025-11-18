import { z } from 'zod';

// Contract validation schemas
export const createContractSchema = z.object({
  title: z.string().min(2, 'Contract title must be at least 2 characters').max(200),
  description: z.string().max(2000).optional(),
  type: z.enum(['VENDOR', 'CLIENT', 'EMPLOYMENT', 'NDA', 'SERVICE', 'PARTNERSHIP', 'OTHER']),
  status: z.enum(['DRAFT', 'PENDING_REVIEW', 'PENDING_SIGNATURE', 'ACTIVE', 'EXPIRED', 'TERMINATED']),
  organizationId: z.string().uuid(),
  projectId: z.string().uuid().optional(),
  partyAName: z.string().max(200),
  partyAContact: z.string().email().optional(),
  partyBName: z.string().max(200),
  partyBContact: z.string().email().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  value: z.number().nonnegative().optional().nullable(),
  currency: z.string().length(3).optional().default('USD'),
  paymentTerms: z.string().max(1000).optional(),
  renewalTerms: z.string().max(1000).optional(),
  terminationClause: z.string().max(2000).optional(),
  documentUrl: z.string().url().optional(),
  signedDocumentUrl: z.string().url().optional(),
  createdBy: z.string().uuid(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export const updateContractSchema = z.object({
  title: z.string().min(2).max(200).optional(),
  description: z.string().max(2000).optional(),
  type: z.enum(['VENDOR', 'CLIENT', 'EMPLOYMENT', 'NDA', 'SERVICE', 'PARTNERSHIP', 'OTHER']).optional(),
  status: z.enum(['DRAFT', 'PENDING_REVIEW', 'PENDING_SIGNATURE', 'ACTIVE', 'EXPIRED', 'TERMINATED']).optional(),
  partyAName: z.string().max(200).optional(),
  partyAContact: z.string().email().optional(),
  partyBName: z.string().max(200).optional(),
  partyBContact: z.string().email().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  value: z.number().nonnegative().optional(),
  currency: z.string().length(3).optional(),
  paymentTerms: z.string().max(1000).optional(),
  renewalTerms: z.string().max(1000).optional(),
  terminationClause: z.string().max(2000).optional(),
  documentUrl: z.string().url().optional(),
  signedDocumentUrl: z.string().url().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export const contractMilestoneSchema = z.object({
  contractId: z.string().uuid(),
  title: z.string().min(2).max(200),
  description: z.string().max(1000).optional(),
  dueDate: z.string().datetime(),
  value: z.number().nonnegative().optional(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE']),
  deliverables: z.array(z.string()).optional(),
});

export const contractAmendmentSchema = z.object({
  contractId: z.string().uuid(),
  title: z.string().min(2).max(200),
  description: z.string().min(10).max(2000),
  effectiveDate: z.string().datetime(),
  documentUrl: z.string().url().optional(),
  createdBy: z.string().uuid(),
  approvedBy: z.string().uuid().optional(),
  approvedAt: z.string().datetime().optional(),
});

export const contractRenewalSchema = z.object({
  contractId: z.string().uuid(),
  newStartDate: z.string().datetime(),
  newEndDate: z.string().datetime(),
  newValue: z.number().nonnegative().optional(),
  changes: z.string().max(2000).optional(),
  approvedBy: z.string().uuid(),
});

export type CreateContractInput = z.infer<typeof createContractSchema>;
export type UpdateContractInput = z.infer<typeof updateContractSchema>;
export type ContractMilestoneInput = z.infer<typeof contractMilestoneSchema>;
export type ContractAmendmentInput = z.infer<typeof contractAmendmentSchema>;
export type ContractRenewalInput = z.infer<typeof contractRenewalSchema>;
