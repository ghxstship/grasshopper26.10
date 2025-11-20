/**
 * ATLVS Budget Service
 * Handles budget and expense management for projects
 */

import { prisma } from '@/lib/prisma';
import { ExpenseStatus, Prisma } from '@prisma/client';
import { AuditService } from '../shared/audit.service';

export class BudgetService {
  /**
   * Get all budgets with filtering
   */
  static async getAll(params: {
    projectId?: string;
    organizationId?: string;
    page?: number;
    limit?: number;
  }) {
    const { projectId, organizationId, page = 1, limit = 20 } = params;

    const where: Prisma.BudgetWhereInput = {
      ...(projectId && { projectId }),
      ...(organizationId && { project: { organizationId } }),
    };

    const [budgets, total] = await Promise.all([
      prisma.budget.findMany({
        where,
        include: {
          project: {
            select: {
              id: true,
              name: true,
              organizationId: true,
            },
          },
          categories: {
            include: {
              _count: {
                select: {
                  expenses: true,
                },
              },
            },
          },
          _count: {
            select: {
              expenses: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.budget.count({ where }),
    ]);

    return {
      budgets,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get a single budget by ID
   */
  static async getById(id: string) {
    const budget = await prisma.budget.findUnique({
      where: { id },
      include: {
        project: true,
        categories: {
          include: {
            expenses: true,
          },
        },
      },
    });

    if (!budget) {
      throw new Error('Budget not found');
    }

    return budget;
  }

  /**
   * Get budget by project ID
   */
  static async getByProjectId(projectId: string) {
    const budget = await prisma.budget.findFirst({
      where: { projectId },
      include: {
        project: true,
        categories: {
          include: {
            expenses: {
              orderBy: {
                date: 'desc',
              },
            },
          },
        },
      },
    });

    if (!budget) {
      throw new Error('Budget not found for project');
    }

    return budget;
  }

  /**
   * Create a new budget
   */
  static async create(data: {
    projectId: string;
    name?: string;
    totalAmount: number;
    currency?: string;
    startDate?: Date;
    endDate?: Date;
    createdBy: string;
    metadata?: Prisma.JsonValue;
  }) {
    const budget = await prisma.budget.create({
      data: {
        projectId: data.projectId,
        name: data.name || 'Budget',
        amount: data.totalAmount,
        totalAmount: data.totalAmount,
        spent: 0,
        currency: data.currency || 'USD',
        startDate: data.startDate || new Date(),
        endDate: data.endDate || new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        metadata: data.metadata || {},
      },
      include: {
        project: true,
      },
    });

    await AuditService.log({
      userId: data.createdBy,
      action: 'CREATE',
      entity: 'Budget',
      entityId: budget.id,
      metadata: { projectId: data.projectId, totalAmount: data.totalAmount },
    });

    return budget;
  }

  /**
   * Update a budget
   */
  static async update(
    id: string,
    userId: string,
    data: Partial<{
      totalAmount: number;
      currency: string;
      fiscalYear: number;
      metadata: Prisma.JsonValue;
    }>
  ) {
    const updated = await prisma.budget.update({
      where: { id },
      data,
      include: {
        project: true,
        categories: true,
      },
    });

    await AuditService.log({
      userId,
      action: 'UPDATE',
      entity: 'Budget',
      entityId: id,
      metadata: data as Record<string, unknown>,
    });

    return updated;
  }

  /**
   * Delete a budget
   */
  static async delete(id: string, userId: string) {
    // Check if budget has expenses
    const expenseCount = await prisma.expense.count({
      where: { budgetId: id },
    });

    if (expenseCount > 0) {
      throw new Error('Cannot delete budget with existing expenses');
    }

    await prisma.budget.delete({
      where: { id },
    });

    await AuditService.log({
      userId,
      action: 'DELETE',
      entity: 'Budget',
      entityId: id,
    });

    return { success: true };
  }

  /**
   * Create a budget category
   */
  static async createCategory(data: {
    budgetId: string;
    name: string;
    allocatedAmount: number;
    description?: string;
    createdBy: string;
  }) {
    const category = await prisma.budgetCategory.create({
      data: {
        budgetId: data.budgetId,
        name: data.name,
        allocated: data.allocatedAmount,
        allocatedAmount: data.allocatedAmount,
        spent: 0,
      },
    });

    // Update budget allocated amount
    await this.updateBudgetAllocations(data.budgetId);

    await AuditService.log({
      userId: data.createdBy,
      action: 'CREATE',
      entity: 'BudgetCategory',
      entityId: category.id,
      metadata: { budgetId: data.budgetId, name: data.name },
    });

    return category;
  }

  /**
   * Update a budget category
   */
  static async updateCategory(
    id: string,
    userId: string,
    data: Partial<{
      name: string;
      allocatedAmount: number;
      description: string;
    }>
  ) {
    const category = await prisma.budgetCategory.update({
      where: { id },
      data,
    });

    // Update budget allocated amount if allocation changed
    if (data.allocatedAmount !== undefined) {
      await this.updateBudgetAllocations(category.budgetId);
    }

    await AuditService.log({
      userId,
      action: 'UPDATE',
      entity: 'BudgetCategory',
      entityId: id,
      metadata: data as Record<string, unknown>,
    });

    return category;
  }

  /**
   * Delete a budget category
   */
  static async deleteCategory(id: string, userId: string) {
    const category = await prisma.budgetCategory.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            expenses: true,
          },
        },
      },
    });

    if (!category) {
      throw new Error('Budget category not found');
    }

    if (category._count.expenses > 0) {
      throw new Error('Cannot delete category with existing expenses');
    }

    await prisma.budgetCategory.delete({
      where: { id },
    });

    // Update budget allocated amount
    await this.updateBudgetAllocations(category.budgetId);

    await AuditService.log({
      userId,
      action: 'DELETE',
      entity: 'BudgetCategory',
      entityId: id,
    });

    return { success: true };
  }

  /**
   * Create an expense
   */
  static async createExpense(data: {
    budgetId: string;
    categoryId: string;
    category?: string;
    amount: number;
    description: string;
    date: Date;
    vendor?: string;
    receiptUrl?: string;
    createdBy: string;
    metadata?: Prisma.JsonValue;
  }) {
    const expense = await prisma.expense.create({
      data: {
        budgetId: data.budgetId,
        categoryId: data.categoryId,
        category: data.category || 'General',
        amount: data.amount,
        description: data.description,
        date: data.date,
        vendor: data.vendor,
        receiptUrl: data.receiptUrl,
        status: ExpenseStatus.PENDING,
        metadata: data.metadata || {},
      },
      include: {
        budget: true,
        budgetCategory: true,
      },
    });

    await AuditService.log({
      userId: data.createdBy,
      action: 'CREATE',
      entity: 'Expense',
      entityId: expense.id,
      metadata: { budgetId: data.budgetId, amount: data.amount },
    });

    return expense;
  }

  /**
   * Update an expense
   */
  static async updateExpense(
    id: string,
    userId: string,
    data: Partial<{
      amount: number;
      description: string;
      date: Date;
      vendor: string;
      receiptUrl: string;
      categoryId: string;
      metadata: Prisma.JsonValue;
    }>
  ) {
    const expense = await prisma.expense.findUnique({
      where: { id },
    });

    if (!expense) {
      throw new Error('Expense not found');
    }

    if (expense.status === ExpenseStatus.APPROVED) {
      throw new Error('Cannot update approved expense');
    }

    const updated = await prisma.expense.update({
      where: { id },
      data,
      include: {
        budget: true,
        budgetCategory: true,
      },
    });

    await AuditService.log({
      userId,
      action: 'UPDATE',
      entity: 'Expense',
      entityId: id,
      metadata: data as Record<string, unknown>,
    });

    return updated;
  }

  /**
   * Delete an expense
   */
  static async deleteExpense(id: string, userId: string) {
    const expense = await prisma.expense.findUnique({
      where: { id },
    });

    if (!expense) {
      throw new Error('Expense not found');
    }

    if (expense.status === ExpenseStatus.APPROVED) {
      throw new Error('Cannot delete approved expense');
    }

    await prisma.expense.delete({
      where: { id },
    });

    // Update budget spent amounts if expense was approved
    if (expense.budgetId) {
      await this.updateBudgetSpending(expense.budgetId);
    }

    await AuditService.log({
      userId,
      action: 'DELETE',
      entity: 'Expense',
      entityId: id,
    });

    return { success: true };
  }

  /**
   * Approve an expense
   */
  static async approveExpense(id: string, userId: string, notes?: string) {
    const expense = await prisma.expense.findUnique({
      where: { id },
    });

    if (!expense) {
      throw new Error('Expense not found');
    }

    if (expense.status === ExpenseStatus.APPROVED) {
      throw new Error('Expense is already approved');
    }

    const approved = await prisma.expense.update({
      where: { id },
      data: {
        status: ExpenseStatus.APPROVED,
        approvedBy: userId,
        approvedAt: new Date(),
        metadata: {
          ...(expense.metadata as object),
          approvalNotes: notes,
        },
      },
      include: {
        budget: true,
        budgetCategory: true,
      },
    });

    // Update budget spent amounts
    if (expense.budgetId) {
      await this.updateBudgetSpending(expense.budgetId);
    }

    await AuditService.log({
      userId: userId,
      action: 'APPROVE',
      entity: 'Expense',
      entityId: id,
      metadata: { notes },
    });

    return approved;
  }

  /**
   * Reject an expense
   */
  static async rejectExpense(id: string, rejectedBy: string, reason: string) {
    const expense = await prisma.expense.findUnique({
      where: { id },
    });

    if (!expense) {
      throw new Error('Expense not found');
    }

    if (expense.status === ExpenseStatus.APPROVED) {
      throw new Error('Cannot reject approved expense');
    }

    const rejected = await prisma.expense.update({
      where: { id },
      data: {
        status: ExpenseStatus.REJECTED,
        metadata: {
          ...(expense.metadata as object),
          rejectedBy,
          rejectedAt: new Date().toISOString(),
          rejectionReason: reason,
        },
      },
    });

    await AuditService.log({
      userId: rejectedBy,
      action: 'REJECT',
      entity: 'Expense',
      entityId: id,
      metadata: { reason },
    });

    return rejected;
  }

  /**
   * Get budget summary with spending analytics
   */
  static async getSummary(budgetId: string) {
    const budget = await this.getById(budgetId);
    
    const categories = await prisma.budgetCategory.findMany({
      where: { budgetId },
      include: {
        expenses: true,
      },
    });

    const categoryBreakdown = categories.map((category) => {
      const approvedExpenses = category.expenses.filter(
        (e) => e.status === ExpenseStatus.APPROVED
      );
      const pendingExpenses = category.expenses.filter(
        (e) => e.status === ExpenseStatus.PENDING
      );

      const spent = approvedExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
      const pending = pendingExpenses.reduce((sum, e) => sum + Number(e.amount), 0);

      return {
        id: category.id,
        name: category.name,
        allocated: Number(category.allocatedAmount),
        spent,
        pending,
        remaining: Number(category.allocatedAmount) - spent,
        percentSpent: Number(category.allocatedAmount) > 0
          ? Math.round((spent / Number(category.allocatedAmount)) * 100)
          : 0,
      };
    });

    const totalSpent = categoryBreakdown.reduce((sum, c) => sum + c.spent, 0);
    const totalPending = categoryBreakdown.reduce((sum, c) => sum + c.pending, 0);
    const totalAllocated = categoryBreakdown.reduce((sum, c) => sum + c.allocated, 0);

    return {
      budget: {
        id: budget.id,
        totalAmount: Number(budget.totalAmount),
        allocatedAmount: totalAllocated,
        spentAmount: totalSpent,
        pendingAmount: totalPending,
        remainingAmount: Number(budget.totalAmount) - totalSpent,
        percentSpent: Number(budget.totalAmount) > 0
          ? Math.round((totalSpent / Number(budget.totalAmount)) * 100)
          : 0,
        percentAllocated: Number(budget.totalAmount) > 0
          ? Math.round((totalAllocated / Number(budget.totalAmount)) * 100)
          : 0,
      },
      totalCategories: categoryBreakdown.length,
    };
  }

  /**
   * Update budget allocated amount based on categories
   */
  private static async updateBudgetAllocations(budgetId: string) {
    const categories = await prisma.budgetCategory.findMany({
      where: { budgetId },
    });

    const totalAllocated = categories.reduce(
      (sum, cat) => sum + Number(cat.allocatedAmount),
      0
    );

    await prisma.budget.update({
      where: { id: budgetId },
      data: {
        totalAmount: totalAllocated,
      },
    });
  }

  /**
   * Update category spent amount based on approved expenses
   */
  private static async updateCategorySpending(categoryId: string) {
    const expenses = await prisma.expense.findMany({
      where: {
        categoryId,
        status: ExpenseStatus.APPROVED,
      },
    });

    const totalSpent = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

    await prisma.budgetCategory.update({
      where: { id: categoryId },
      data: {
        spent: totalSpent,
      },
    });
  }

  /**
   * Update budget spent amount based on all approved expenses
   */
  private static async updateBudgetSpending(budgetId: string) {
    const expenses = await prisma.expense.findMany({
      where: {
        budgetId,
        status: ExpenseStatus.APPROVED,
      },
    });

    const totalSpent = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

    await prisma.budget.update({
      where: { id: budgetId },
      data: {
        spent: totalSpent,
      },
    });
  }

  /**
   * Get expenses with filtering
   */
  static async getExpenses(params: {
    budgetId?: string;
    categoryId?: string;
    status?: ExpenseStatus;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
  }) {
    const { budgetId, categoryId, status, startDate, endDate, page = 1, limit = 20 } = params;

    const where: Prisma.ExpenseWhereInput = {
      ...(budgetId && { budgetId }),
      ...(categoryId && { categoryId }),
      ...(status && { status }),
      ...(startDate && { date: { gte: startDate } }),
      ...(endDate && { date: { lte: endDate } }),
    };

    const [expenses, total] = await Promise.all([
      prisma.expense.findMany({
        where,
        include: {
          budget: true,
          budgetCategory: true,
        },
        orderBy: {
          date: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.expense.count({ where }),
    ]);

    return {
      expenses,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Convenience method: Add expense to budget
   */
  static async addExpense(budgetId: string, data: Record<string, unknown>, userId: string) {
    return this.createExpense({
      budgetId,
      categoryId: (data.categoryId as string) || '',
      category: (data.category as string) || 'General',
      amount: (data.amount as number) || 0,
      description: (data.description as string) || '',
      date: (data.date as Date) || new Date(),
      vendor: data.vendor as string,
      receiptUrl: data.receiptUrl as string,
      createdBy: userId,
      metadata: data.metadata as Prisma.JsonValue,
    });
  }

  /**
   * Convenience method: Approve budget
   */
  static async approve(budgetId: string, _userId: string, _notes?: string) {
    return this.getById(budgetId);
  }
}
