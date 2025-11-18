/**
 * Validation schemas for Budgets
 */

import { z } from 'zod';
import { ExpenseStatus } from '@prisma/client';

export const createBudgetSchema = z.object({
  projectId: z.string().cuid().optional(),
  name: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  amount: z.number().positive(),
  currency: z.string().length(3).default('USD'),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  metadata: z.record(z.string(), z.unknown()).optional(),
}).refine((data) => new Date(data.endDate) > new Date(data.startDate), {
  message: 'End date must be after start date',
  path: ['endDate'],
});

export const updateBudgetSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  amount: z.number().positive().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const createBudgetCategorySchema = z.object({
  name: z.string().min(1).max(100),
  allocated: z.number().positive(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const createExpenseSchema = z.object({
  budgetId: z.string().cuid().optional(),
  category: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  amount: z.number().positive(),
  currency: z.string().length(3).default('USD'),
  date: z.string().datetime(),
  vendor: z.string().max(200).optional(),
  receiptUrl: z.string().url().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const updateExpenseSchema = z.object({
  category: z.string().min(1).max(100).optional(),
  description: z.string().min(1).max(500).optional(),
  amount: z.number().positive().optional(),
  date: z.string().datetime().optional(),
  vendor: z.string().max(200).optional(),
  receiptUrl: z.string().url().optional(),
  status: z.nativeEnum(ExpenseStatus).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const approveExpenseSchema = z.object({
  approved: z.boolean(),
  comments: z.string().max(1000).optional(),
});

export const budgetFiltersSchema = z.object({
  projectId: z.string().cuid().optional(),
  search: z.string().optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(100).optional(),
});

export const expenseFiltersSchema = z.object({
  budgetId: z.string().cuid().optional(),
  category: z.string().optional(),
  status: z.nativeEnum(ExpenseStatus).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(100).optional(),
});

export type CreateBudgetInput = z.infer<typeof createBudgetSchema>;
export type UpdateBudgetInput = z.infer<typeof updateBudgetSchema>;
export type CreateBudgetCategoryInput = z.infer<typeof createBudgetCategorySchema>;
export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;
export type ApproveExpenseInput = z.infer<typeof approveExpenseSchema>;
export type BudgetFiltersInput = z.infer<typeof budgetFiltersSchema>;
export type ExpenseFiltersInput = z.infer<typeof expenseFiltersSchema>;
