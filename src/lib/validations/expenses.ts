import { z } from 'zod';

// Expense creation schema
export const createExpenseSchema = z.object({
  projectId: z.string().uuid('Invalid project ID').optional(),
  budgetId: z.string().uuid('Invalid budget ID').optional(),
  category: z.enum([
    'travel',
    'accommodation',
    'meals',
    'equipment',
    'supplies',
    'services',
    'labor',
    'transportation',
    'permits',
    'insurance',
    'other'
  ]),
  description: z.string().min(3, 'Description must be at least 3 characters').max(500),
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().length(3, 'Currency must be 3 characters (e.g., USD)').default('USD'),
  date: z.string().datetime(),
  vendor: z.string().min(2).max(100).optional(),
  receiptUrl: z.string().url('Invalid receipt URL').optional(),
  paymentMethod: z.enum(['cash', 'credit_card', 'debit_card', 'bank_transfer', 'check', 'other']),
  reimbursable: z.boolean().default(false),
  notes: z.string().max(1000).optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

// Expense update schema
export const updateExpenseSchema = createExpenseSchema.partial();

// Expense approval schema
export const approveExpenseSchema = z.object({
  expenseId: z.string().uuid('Invalid expense ID'),
  approved: z.boolean(),
  approverNotes: z.string().max(500).optional(),
  adjustedAmount: z.number().positive().optional(),
});

// Expense reimbursement schema
export const reimburseExpenseSchema = z.object({
  expenseId: z.string().uuid('Invalid expense ID'),
  reimbursementMethod: z.enum(['bank_transfer', 'paypal', 'check', 'cash']),
  reimbursementDate: z.string().datetime(),
  reference: z.string().min(1).max(100),
  notes: z.string().max(500).optional(),
});

// Expense report query schema
export const expenseReportQuerySchema = z.object({
  projectId: z.string().uuid().optional(),
  budgetId: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
  category: z.string().optional(),
  status: z.enum(['pending', 'approved', 'rejected', 'reimbursed']).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  minAmount: z.number().positive().optional(),
  maxAmount: z.number().positive().optional(),
});

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;
export type ApproveExpenseInput = z.infer<typeof approveExpenseSchema>;
export type ReimburseExpenseInput = z.infer<typeof reimburseExpenseSchema>;
export type ExpenseReportQuery = z.infer<typeof expenseReportQuerySchema>;
