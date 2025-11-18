import { z } from 'zod';

// ============================================
// OPERATIONS & CHECKLIST SCHEMAS
// ============================================

export const checklistItemSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  category: z.enum(['SETUP', 'SAFETY', 'EQUIPMENT', 'STAFFING', 'LOGISTICS', 'OTHER']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  assignedTo: z.string().uuid().optional(),
  dueTime: z.string().datetime().optional(),
  completed: z.boolean().default(false),
});

export const createChecklistSchema = z.object({
  eventId: z.string().uuid(),
  items: z.array(checklistItemSchema),
});

// ============================================
// QR CODE SCHEMAS
// ============================================

export const qrCodeTypeSchema = z.enum([
  'ACCESS',
  'MEAL_VOUCHER',
  'EQUIPMENT',
  'CREDENTIAL',
  'PARKING',
  'OTHER',
]);

export const generateQRCodeSchema = z.object({
  type: qrCodeTypeSchema,
  userId: z.string().uuid(),
  eventId: z.string().uuid(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  expiresAt: z.string().datetime().optional(),
  maxScans: z.number().int().positive().optional(),
});

export const scanQRCodeSchema = z.object({
  code: z.string().min(1),
  scannedBy: z.string().uuid(),
  location: z.string().optional(),
});

// ============================================
// ISSUE REPORTING SCHEMAS
// ============================================

export const issueSeveritySchema = z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']);
export const issueStatusSchema = z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']);

export const createIssueSchema = z.object({
  eventId: z.string().uuid(),
  title: z.string().min(1).max(200),
  description: z.string().min(1),
  severity: issueSeveritySchema,
  category: z.string(),
  location: z.string().optional(),
  reportedBy: z.string().uuid(),
  attachments: z.array(z.string().url()).optional(),
});

export const updateIssueSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(1).optional(),
  severity: issueSeveritySchema.optional(),
  status: issueStatusSchema.optional(),
  assignedTo: z.string().uuid().optional(),
  resolution: z.string().optional(),
});

// ============================================
// EXPENSE SCHEMAS
// ============================================

export const expenseStatusSchema = z.enum(['DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED', 'PAID']);
export const expenseCategorySchema = z.enum([
  'TRAVEL',
  'ACCOMMODATION',
  'MEALS',
  'EQUIPMENT',
  'SUPPLIES',
  'SERVICES',
  'OTHER',
]);

export const createExpenseSchema = z.object({
  eventId: z.string().uuid(),
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  category: expenseCategorySchema,
  amount: z.number().positive(),
  currency: z.string().length(3).default('USD'),
  date: z.string().datetime(),
  submittedBy: z.string().uuid(),
  receipts: z.array(z.string().url()).optional(),
});

export const updateExpenseSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  category: expenseCategorySchema.optional(),
  amount: z.number().positive().optional(),
  status: expenseStatusSchema.optional(),
  approvedBy: z.string().uuid().optional(),
  approvalNotes: z.string().optional(),
});

// ============================================
// AFFILIATE SCHEMAS
// ============================================

export const createAffiliateSchema = z.object({
  userId: z.string().uuid(),
  code: z.string().min(3).max(50),
  commissionRate: z.number().min(0).max(100),
  tier: z.enum(['BRONZE', 'SILVER', 'GOLD', 'PLATINUM']).default('BRONZE'),
});

export const affiliateStatsSchema = z.object({
  affiliateId: z.string().uuid(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

// ============================================
// REFERRAL SCHEMAS
// ============================================

export const createReferralSchema = z.object({
  referrerId: z.string().uuid(),
  referredEmail: z.string().email(),
  referredName: z.string().min(1),
  eventId: z.string().uuid().optional(),
});

export const referralStatusSchema = z.enum(['PENDING', 'ACCEPTED', 'COMPLETED', 'EXPIRED']);

// Export types
export type ChecklistItem = z.infer<typeof checklistItemSchema>;
export type CreateChecklist = z.infer<typeof createChecklistSchema>;
export type QRCodeType = z.infer<typeof qrCodeTypeSchema>;
export type GenerateQRCode = z.infer<typeof generateQRCodeSchema>;
export type ScanQRCode = z.infer<typeof scanQRCodeSchema>;
export type IssueSeverity = z.infer<typeof issueSeveritySchema>;
export type IssueStatus = z.infer<typeof issueStatusSchema>;
export type CreateIssue = z.infer<typeof createIssueSchema>;
export type UpdateIssue = z.infer<typeof updateIssueSchema>;
export type ExpenseStatus = z.infer<typeof expenseStatusSchema>;
export type ExpenseCategory = z.infer<typeof expenseCategorySchema>;
export type CreateExpense = z.infer<typeof createExpenseSchema>;
export type UpdateExpense = z.infer<typeof updateExpenseSchema>;
export type CreateAffiliate = z.infer<typeof createAffiliateSchema>;
export type CreateReferral = z.infer<typeof createReferralSchema>;
export type ReferralStatus = z.infer<typeof referralStatusSchema>;
