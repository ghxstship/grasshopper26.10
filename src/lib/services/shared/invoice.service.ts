import { prisma } from '@/lib/prisma';
import { Prisma, InvoiceStatus } from '@prisma/client';
import { BaseService } from '../base/BaseService';

export class InvoiceService extends BaseService {
  /**
   * Create a new invoice
   */
  static async create(data: {
    userId: string;
    orderId?: string;
    subtotal: number;
    tax?: number;
    discount?: number;
    total: number;
    currency?: string;
    dueDate?: Date;
    notes?: string;
    items: Array<{
      description: string;
      quantity: number;
      unitPrice: number;
      amount: number;
    }>;
  }) {
    const invoiceNumber = await this.generateInvoiceNumber();

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        userId: data.userId,
        orderId: data.orderId,
        status: InvoiceStatus.DRAFT,
        subtotal: data.subtotal,
        tax: data.tax || 0,
        discount: data.discount || 0,
        total: data.total,
        currency: data.currency || 'USD',
        dueDate: data.dueDate,
        notes: data.notes,
        items: {
          create: data.items,
        },
      },
      include: {
        items: true,
        user: true,
        order: true,
      },
    });

    return invoice;
  }

  /**
   * Get invoice by ID
   */
  static async getById(invoiceId: string) {
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        items: true,
        user: true,
        order: true,
      },
    });

    if (!invoice) {
      throw new Error('Invoice not found');
    }

    return invoice;
  }

  /**
   * Get invoice by invoice number
   */
  static async getByInvoiceNumber(invoiceNumber: string) {
    const invoice = await prisma.invoice.findUnique({
      where: { invoiceNumber },
      include: {
        items: true,
        user: true,
        order: true,
      },
    });

    if (!invoice) {
      throw new Error('Invoice not found');
    }

    return invoice;
  }

  /**
   * List invoices with filters
   */
  static async list(filters: {
    userId?: string;
    status?: InvoiceStatus;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
  }) {
    const where: Prisma.InvoiceWhereInput = {};

    if (filters.userId) {
      where.userId = filters.userId;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.startDate || filters.endDate) {
      where.issueDate = {};
      if (filters.startDate) {
        where.issueDate.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.issueDate.lte = filters.endDate;
      }
    }

    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        include: {
          items: true,
          user: true,
          order: true,
        },
        orderBy: { issueDate: 'desc' },
        skip,
        take: limit,
      }),
      prisma.invoice.count({ where }),
    ]);

    return {
      invoices,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Update invoice status
   */
  static async updateStatus(
    invoiceId: string,
    status: InvoiceStatus,
    paidDate?: Date
  ) {
    const invoice = await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        status,
        ...(status === InvoiceStatus.PAID && paidDate && { paidDate }),
      },
      include: {
        items: true,
        user: true,
        order: true,
      },
    });

    return invoice;
  }

  /**
   * Mark invoice as sent
   */
  static async markAsSent(invoiceId: string) {
    return this.updateStatus(invoiceId, InvoiceStatus.SENT);
  }

  /**
   * Mark invoice as paid
   */
  static async markAsPaid(invoiceId: string, paidDate?: Date) {
    return this.updateStatus(
      invoiceId,
      InvoiceStatus.PAID,
      paidDate || new Date()
    );
  }

  /**
   * Cancel invoice
   */
  static async cancel(invoiceId: string) {
    return this.updateStatus(invoiceId, InvoiceStatus.CANCELLED);
  }

  /**
   * Generate unique invoice number
   */
  private static async generateInvoiceNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    
    // Get count of invoices this month
    const count = await prisma.invoice.count({
      where: {
        invoiceNumber: {
          startsWith: `INV-${year}${month}`,
        },
      },
    });

    const sequence = String(count + 1).padStart(4, '0');
    return `INV-${year}${month}-${sequence}`;
  }

  /**
   * Get invoice statistics
   */
  static async getStatistics(filters: {
    userId?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const where: Prisma.InvoiceWhereInput = {};

    if (filters.userId) {
      where.userId = filters.userId;
    }

    if (filters.startDate || filters.endDate) {
      where.issueDate = {};
      if (filters.startDate) {
        where.issueDate.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.issueDate.lte = filters.endDate;
      }
    }

    const [
      totalInvoices,
      draftInvoices,
      sentInvoices,
      paidInvoices,
      overdueInvoices,
    ] = await Promise.all([
      prisma.invoice.count({ where }),
      prisma.invoice.count({ where: { ...where, status: InvoiceStatus.DRAFT } }),
      prisma.invoice.count({ where: { ...where, status: InvoiceStatus.SENT } }),
      prisma.invoice.count({ where: { ...where, status: InvoiceStatus.PAID } }),
      prisma.invoice.count({ where: { ...where, status: InvoiceStatus.OVERDUE } }),
    ]);

    const totalRevenue = await prisma.invoice.aggregate({
      where: { ...where, status: InvoiceStatus.PAID },
      _sum: { total: true },
    });

    const pendingRevenue = await prisma.invoice.aggregate({
      where: {
        ...where,
        status: { in: [InvoiceStatus.SENT, InvoiceStatus.OVERDUE] },
      },
      _sum: { total: true },
    });

    return {
      totalInvoices,
      draftInvoices,
      sentInvoices,
      paidInvoices,
      overdueInvoices,
      totalRevenue: totalRevenue._sum.total || 0,
      pendingRevenue: pendingRevenue._sum.total || 0,
    };
  }
}
