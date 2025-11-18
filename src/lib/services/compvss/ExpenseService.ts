/**
 * COMPVSS Expense Service
 * Handles expense reporting and reimbursement for external teams
 */

import { BaseService, ServiceResult, PaginationOptions, PaginatedResult } from '../base/BaseService';
import { Prisma, ExpenseStatus } from '@prisma/client';
import { NotificationService } from '../shared/NotificationService';

export interface CreateExpenseInput {
  userId: string;
  title: string;
  description?: string;
  amount: number;
  currency?: string;
  category: string;
  date: Date;
  receiptUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateExpenseInput {
  title?: string;
  description?: string;
  amount?: number;
  category?: string;
  date?: Date;
  receiptUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface ExpenseFilters {
  userId?: string;
  status?: ExpenseStatus;
  category?: string;
  dateFrom?: Date;
  dateTo?: Date;
  approvedBy?: string;
}

export class ExpenseService extends BaseService {
  private notificationService: NotificationService;

  constructor() {
    super();
    this.notificationService = new NotificationService();
  }

  /**
   * Create expense report
   */
  async create(input: CreateExpenseInput): Promise<ServiceResult<unknown>> {
    return this.execute(async () => {
      this.validateRequired(input as unknown as Record<string, unknown>, [
        'userId',
        'title',
        'amount',
        'category',
        'date',
      ]);

      if (input.amount <= 0) {
        throw {
          name: 'ValidationError',
          message: 'Amount must be greater than 0',
        };
      }

      const expense = await this.prisma.expenseReport.create({
        data: {
          userId: input.userId,
          title: input.title,
          description: input.description,
          amount: input.amount,
          currency: input.currency || 'USD',
          category: input.category,
          date: input.date,
          receiptUrl: input.receiptUrl,
          status: ExpenseStatus.PENDING,
          metadata: input.metadata as Prisma.InputJsonValue,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      });

      await this.logAudit(input.userId, 'CREATE', 'ExpenseReport', expense.id, {
        title: input.title,
        amount: input.amount,
      });

      return expense;
    }, 'create');
  }

  /**
   * Get expense by ID
   */
  async getById(id: string, userId?: string): Promise<ServiceResult<unknown>> {
    return this.execute(async () => {
      const expense = await this.prisma.expenseReport.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      });

      if (!expense) {
        throw {
          name: 'NotFoundError',
          message: 'Expense report not found',
        };
      }

      // Check permission if userId provided
      if (userId && expense.userId !== userId) {
        const hasPermission = await this.checkPermission(userId, 'ExpenseReport', 'read');
        if (!hasPermission) {
          throw {
            name: 'ForbiddenError',
            message: 'You do not have permission to view this expense',
          };
        }
      }

      return expense;
    }, 'getById');
  }

  /**
   * List expenses with filters and pagination
   */
  async list(
    filters?: ExpenseFilters,
    pagination?: PaginationOptions
  ): Promise<ServiceResult<PaginatedResult<unknown>>> {
    return this.execute(async () => {
      const { skip, limit } = this.buildPagination(pagination);

      const where: Prisma.ExpenseReportWhereInput = {};

      if (filters?.userId) where.userId = filters.userId;
      if (filters?.status) where.status = filters.status;
      if (filters?.category) where.category = filters.category;
      if (filters?.approvedBy) where.approvedBy = filters.approvedBy;

      if (filters?.dateFrom || filters?.dateTo) {
        where.date = {
          ...(filters.dateFrom && { gte: filters.dateFrom }),
          ...(filters.dateTo && { lte: filters.dateTo }),
        };
      }

      const [expenses, total] = await Promise.all([
        this.prisma.expenseReport.findMany({
          where,
          skip,
          take: limit,
          orderBy: { date: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        }),
        this.prisma.expenseReport.count({ where }),
      ]);

      return this.buildPaginatedResult(expenses, total, pagination);
    }, 'list');
  }

  /**
   * Update expense
   */
  async update(
    id: string,
    input: UpdateExpenseInput,
    userId: string
  ): Promise<ServiceResult<unknown>> {
    return this.execute(async () => {
      const existing = await this.prisma.expenseReport.findUnique({
        where: { id },
      });

      if (!existing) {
        throw {
          name: 'NotFoundError',
          message: 'Expense report not found',
        };
      }

      if (existing.userId !== userId) {
        throw {
          name: 'ForbiddenError',
          message: 'You do not have permission to update this expense',
        };
      }

      if (existing.status !== ExpenseStatus.PENDING) {
        throw {
          name: 'ValidationError',
          message: 'Only pending expenses can be updated',
        };
      }

      if (input.amount !== undefined && input.amount <= 0) {
        throw {
          name: 'ValidationError',
          message: 'Amount must be greater than 0',
        };
      }

      const expense = await this.prisma.expenseReport.update({
        where: { id },
        data: {
          title: input.title,
          description: input.description,
          amount: input.amount,
          category: input.category,
          date: input.date,
          receiptUrl: input.receiptUrl,
          metadata: input.metadata as Prisma.InputJsonValue,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      });

      await this.logAudit(userId, 'UPDATE', 'ExpenseReport', id, {
        changes: input,
      });

      return expense;
    }, 'update');
  }

  /**
   * Delete expense
   */
  async delete(id: string, userId: string): Promise<ServiceResult<void>> {
    return this.execute(async () => {
      const existing = await this.prisma.expenseReport.findUnique({
        where: { id },
      });

      if (!existing) {
        throw {
          name: 'NotFoundError',
          message: 'Expense report not found',
        };
      }

      if (existing.userId !== userId) {
        throw {
          name: 'ForbiddenError',
          message: 'You do not have permission to delete this expense',
        };
      }

      if (existing.status !== ExpenseStatus.PENDING) {
        throw {
          name: 'ValidationError',
          message: 'Only pending expenses can be deleted',
        };
      }

      await this.prisma.expenseReport.delete({
        where: { id },
      });

      await this.logAudit(userId, 'DELETE', 'ExpenseReport', id);
    }, 'delete');
  }

  /**
   * Approve expense
   */
  async approve(id: string, approvedBy: string): Promise<ServiceResult<unknown>> {
    return this.execute(async () => {
      const hasPermission = await this.checkPermission(approvedBy, 'ExpenseReport', 'approve');
      if (!hasPermission) {
        throw {
          name: 'ForbiddenError',
          message: 'You do not have permission to approve expenses',
        };
      }

      const expense = await this.prisma.expenseReport.update({
        where: { id },
        data: {
          status: ExpenseStatus.APPROVED,
          approvedBy,
          approvedAt: new Date(),
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      await this.logAudit(approvedBy, 'APPROVE', 'ExpenseReport', id);

      await this.notificationService.create({
        userId: expense.userId,
        title: 'Expense Approved',
        message: `Your expense "${expense.title}" has been approved`,
        type: 'EXPENSE_APPROVED',
        actionUrl: `/compvss/expenses/${id}`,
      });

      return expense;
    }, 'approve');
  }

  /**
   * Reject expense
   */
  async reject(id: string, rejectedBy: string, reason?: string): Promise<ServiceResult<unknown>> {
    return this.execute(async () => {
      const hasPermission = await this.checkPermission(rejectedBy, 'ExpenseReport', 'approve');
      if (!hasPermission) {
        throw {
          name: 'ForbiddenError',
          message: 'You do not have permission to reject expenses',
        };
      }

      const expense = await this.prisma.expenseReport.update({
        where: { id },
        data: {
          status: ExpenseStatus.REJECTED,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      await this.logAudit(rejectedBy, 'REJECT', 'ExpenseReport', id, { reason });

      await this.notificationService.create({
        userId: expense.userId,
        title: 'Expense Rejected',
        message: `Your expense "${expense.title}" has been rejected${reason ? `: ${reason}` : ''}`,
        type: 'EXPENSE_REJECTED',
        actionUrl: `/compvss/expenses/${id}`,
      });

      return expense;
    }, 'reject');
  }

  /**
   * Mark as reimbursed
   */
  async markReimbursed(id: string, reimbursedBy: string): Promise<ServiceResult<unknown>> {
    return this.execute(async () => {
      const expense = await this.prisma.expenseReport.update({
        where: { id },
        data: {
          status: ExpenseStatus.REIMBURSED,
          reimbursedAt: new Date(),
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      await this.logAudit(reimbursedBy, 'REIMBURSE', 'ExpenseReport', id);

      await this.notificationService.create({
        userId: expense.userId,
        title: 'Expense Reimbursed',
        message: `Your expense "${expense.title}" has been reimbursed`,
        type: 'EXPENSE_REIMBURSED',
        actionUrl: `/compvss/expenses/${id}`,
      });

      return expense;
    }, 'markReimbursed');
  }

  /**
   * Get expense statistics
   */
  async getStatistics(filters?: ExpenseFilters): Promise<ServiceResult<unknown>> {
    return this.execute(async () => {
      const where: Prisma.ExpenseReportWhereInput = {};

      if (filters?.userId) where.userId = filters.userId;
      if (filters?.category) where.category = filters.category;
      if (filters?.status) where.status = filters.status;

      const [total, byStatus, byCategory, totalAmount] = await Promise.all([
        this.prisma.expenseReport.count({ where }),
        this.prisma.expenseReport.groupBy({
          by: ['status'],
          where,
          _count: true,
        }),
        this.prisma.expenseReport.groupBy({
          by: ['category'],
          where,
          _count: true,
          _sum: {
            amount: true,
          },
        }),
        this.prisma.expenseReport.aggregate({
          where,
          _sum: {
            amount: true,
          },
        }),
      ]);

      return {
        total,
        byStatus,
        byCategory,
        totalAmount: totalAmount._sum.amount || 0,
      };
    }, 'getStatistics');
  }
}
