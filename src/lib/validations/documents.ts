import { z } from 'zod';

// Document validation schemas
export const createDocumentSchema = z.object({
  title: z.string().min(2, 'Document title must be at least 2 characters').max(200),
  description: z.string().max(1000).optional(),
  type: z.enum(['CONTRACT', 'INVOICE', 'REPORT', 'POLICY', 'MANUAL', 'FORM', 'CERTIFICATE', 'OTHER']),
  category: z.string().max(50).optional(),
  fileUrl: z.string().url(),
  fileName: z.string().max(255),
  fileSize: z.number().int().positive(),
  mimeType: z.string().max(100),
  organizationId: z.string().uuid(),
  projectId: z.string().uuid().optional(),
  uploadedBy: z.string().uuid(),
  version: z.string().max(20).optional().default('1.0'),
  tags: z.array(z.string().max(50)).optional(),
  isConfidential: z.boolean().optional().default(false),
  expiryDate: z.string().datetime().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export const updateDocumentSchema = z.object({
  title: z.string().min(2).max(200).optional(),
  description: z.string().max(1000).optional(),
  type: z.enum(['CONTRACT', 'INVOICE', 'REPORT', 'POLICY', 'MANUAL', 'FORM', 'CERTIFICATE', 'OTHER']).optional(),
  category: z.string().max(50).optional(),
  version: z.string().max(20).optional(),
  tags: z.array(z.string().max(50)).optional(),
  isConfidential: z.boolean().optional(),
  expiryDate: z.string().datetime().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export const documentVersionSchema = z.object({
  documentId: z.string().uuid(),
  version: z.string().max(20),
  fileUrl: z.string().url(),
  fileName: z.string().max(255),
  fileSize: z.number().int().positive(),
  uploadedBy: z.string().uuid(),
  changeNotes: z.string().max(1000).optional(),
});

export const documentShareSchema = z.object({
  documentId: z.string().uuid(),
  sharedWith: z.array(z.string().uuid()).min(1, 'Must share with at least one user'),
  permissions: z.enum(['VIEW', 'EDIT', 'ADMIN']),
  expiresAt: z.string().datetime().optional(),
  message: z.string().max(500).optional(),
});

export const documentAccessLogSchema = z.object({
  documentId: z.string().uuid(),
  userId: z.string().uuid(),
  action: z.enum(['VIEW', 'DOWNLOAD', 'EDIT', 'DELETE', 'SHARE']),
  ipAddress: z.string().max(45).optional(),
  userAgent: z.string().max(500).optional(),
});

export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;
export type UpdateDocumentInput = z.infer<typeof updateDocumentSchema>;
export type DocumentVersionInput = z.infer<typeof documentVersionSchema>;
export type DocumentShareInput = z.infer<typeof documentShareSchema>;
export type DocumentAccessLogInput = z.infer<typeof documentAccessLogSchema>;
