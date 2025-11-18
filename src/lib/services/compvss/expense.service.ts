/**
 * COMPVSS Expense Service
 */

import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { AuditService } from '../shared/audit.service';

export class CompvssExpenseService {
  static async getAll(params: {
    organizationId?: string;
    teamId?: string;
    userId?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const { organizationId, teamId, userId, status, page = 1, limit = 20 } = params;

    const where: Prisma.ExpenseReportWhereInput = {
      ...(organizationId && { organizationId }),
      ...(teamId && { teamId }),
      ...(userId && { userId }),
      ...(status && { status: status as any }),
    };

    const [expenses, total] = await Promise.all([
      prisma.expenseReport.findMany({
        where,
        include: {
          organization: {
            select: {
              id: true,
              name: true,
            },
          },
          team: {
            select: {
              id: true,
              name: true,
            },
          },
          submittedBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          date: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.expenseReport.count({ where }),
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

  static async getById(id: string) {
    const expense = await prisma.expenseReport.findUnique({
      where: { id },
      include: {
        organization: true,
        team: true,
        submittedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        approver: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!expense) {
      throw new Error('Expense not found');
    }

    return expense;
  }

  static async create(data: {
    organizationId: string;
    teamId?: string;
    title: string;
    amount: number;
    description: string;
    category: string;
    date: Date;
    receiptUrl?: string;
    submittedBy: string;
  }) {
    const expense = await prisma.expenseReport.create({
      data: {
        userId: data.submittedBy,
        submittedById: data.submittedBy,
        organizationId: data.organizationId,
        teamId: data.teamId,
        title: data.title,
        amount: data.amount,
        description: data.description,
        category: data.category,
        date: data.date,
        receiptUrl: data.receiptUrl,
        status: 'PENDING',
      },
    });

    await AuditService.log({
      userId: data.submittedBy,
      action: 'CREATE',
      entity: 'CompvssExpense',
      entityId: expense.id,
      metadata: { amount: data.amount, category: data.category },
    });

    return expense;
  }

  static async approve(id: string, approvedBy: string) {
    const approved = await prisma.expenseReport.update({
      where: { id },
      data: {
        status: 'APPROVED',
        approvedById: approvedBy,
        approvedAt: new Date(),
      },
    });

    await AuditService.log({
      userId: approvedBy,
      action: 'APPROVE',
      entity: 'CompvssExpense',
      entityId: id,
    });

    return approved;
  }

  static async reject(id: string, rejectedBy: string, reason: string) {
    const rejected = await prisma.expenseReport.update({
      where: { id },
      data: {
        status: 'REJECTED',
        metadata: { rejectionReason: reason },
      },
    });

    await AuditService.log({
      userId: rejectedBy,
      action: 'REJECT',
      entity: 'CompvssExpense',
      entityId: id,
      metadata: { reason },
    });

    return rejected;
  }

  static async delete(id: string, userId: string) {
    await prisma.expenseReport.delete({
      where: { id },
    });

    await AuditService.log({
      userId,
      action: 'DELETE',
      entity: 'CompvssExpense',
      entityId: id,
    });

    return { success: true };
  }
}
