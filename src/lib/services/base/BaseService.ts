/**
 * Base Service Class
 * Provides common functionality for all service classes
 * - Error handling
 * - Logging
 * - Validation
 * - Audit logging
 */

import { prisma } from '@/lib/prisma';
import { AuditService } from '../shared/AuditService';

export interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: ServiceError;
}

export interface ServiceError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  statusCode?: number;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export abstract class BaseService {
  protected prisma = prisma;
  protected auditService: AuditService;

  constructor() {
    this.auditService = new AuditService();
  }

  /**
   * Wrap async operations with error handling
   */
  protected async execute<T>(
    operation: () => Promise<T>,
    context?: string
  ): Promise<ServiceResult<T>> {
    try {
      const data = await operation();
      return { success: true, data };
    } catch (error) {
      return this.handleError(error, context);
    }
  }

  /**
   * Handle errors and convert to ServiceError
   */
  protected handleError(error: unknown, context?: string): ServiceResult<never> {
    console.error(`[${this.constructor.name}] Error${context ? ` in ${context}` : ''}:`, error);

    let serviceError: ServiceError;

    // Type guard for Prisma errors
    const isPrismaError = (err: unknown): err is { code: string; meta?: unknown } => {
      return typeof err === 'object' && err !== null && 'code' in err;
    };

    // Type guard for named errors
    const isNamedError = (err: unknown): err is { name: string; message?: string; details?: unknown } => {
      return typeof err === 'object' && err !== null && 'name' in err;
    };

    // Type guard for Error objects
    const isError = (err: unknown): err is Error => {
      return err instanceof Error;
    };

    if (isPrismaError(error) && error.code === 'P2002') {
      // Prisma unique constraint violation
      serviceError = {
        code: 'DUPLICATE_ENTRY',
        message: 'A record with this information already exists',
        details: error.meta as Record<string, unknown>,
        statusCode: 409,
      };
    } else if (isPrismaError(error) && error.code === 'P2025') {
      // Prisma record not found
      serviceError = {
        code: 'NOT_FOUND',
        message: 'The requested resource was not found',
        details: error.meta as Record<string, unknown>,
        statusCode: 404,
      };
    } else if (isPrismaError(error) && error.code === 'P2003') {
      // Prisma foreign key constraint violation
      serviceError = {
        code: 'INVALID_REFERENCE',
        message: 'Referenced resource does not exist',
        details: error.meta as Record<string, unknown>,
        statusCode: 400,
      };
    } else if (isNamedError(error) && error.name === 'ValidationError') {
      serviceError = {
        code: 'VALIDATION_ERROR',
        message: error.message || 'Validation failed',
        details: error.details as Record<string, unknown>,
        statusCode: 400,
      };
    } else if (isNamedError(error) && error.name === 'UnauthorizedError') {
      serviceError = {
        code: 'UNAUTHORIZED',
        message: error.message || 'Unauthorized access',
        statusCode: 401,
      };
    } else if (isNamedError(error) && error.name === 'ForbiddenError') {
      serviceError = {
        code: 'FORBIDDEN',
        message: error.message || 'Access forbidden',
        statusCode: 403,
      };
    } else {
      serviceError = {
        code: 'INTERNAL_ERROR',
        message: isError(error) ? error.message : 'An unexpected error occurred',
        details: process.env.NODE_ENV === 'development' && isError(error) ? { stack: error.stack } : undefined,
        statusCode: 500,
      };
    }

    return { success: false, error: serviceError };
  }

  /**
   * Validate required fields
   */
  protected validateRequired(data: Record<string, unknown>, fields: string[]): void {
    const missing = fields.filter(field => !data[field]);
    if (missing.length > 0) {
      throw {
        name: 'ValidationError',
        message: `Missing required fields: ${missing.join(', ')}`,
        details: { missing },
      };
    }
  }

  /**
   * Check if user has permission
   */
  protected async checkPermission(
    userId: string,
    resource: string,
    action: string
  ): Promise<boolean> {
    // Import PermissionService dynamically to avoid circular dependencies
    const { PermissionService } = await import('../shared/PermissionService');
    const permissionService = new PermissionService();
    
    try {
      const result = await permissionService.hasResourcePermission(userId, resource, action);
      return result.success && result.data === true;
    } catch (error) {
      console.error('Permission check failed:', error);
      // Fail closed - deny access on error
      return false;
    }
  }

  /**
   * Log audit trail
   */
  protected async logAudit(
    userId: string | undefined,
    action: string,
    entity: string,
    entityId?: string,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    await this.auditService.log({
      userId,
      action,
      entity,
      entityId,
      metadata,
    });
  }

  /**
   * Build pagination parameters
   */
  protected buildPagination(options?: PaginationOptions) {
    const page = Math.max(1, options?.page || 1);
    const limit = Math.min(100, Math.max(1, options?.limit || 20));
    const skip = (page - 1) * limit;

    return { page, limit, skip };
  }

  /**
   * Build paginated result
   */
  protected buildPaginatedResult<T>(
    data: T[],
    total: number,
    options?: PaginationOptions
  ): PaginatedResult<T> {
    const { page, limit } = this.buildPagination(options);
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore: page < totalPages,
      },
    };
  }

  /**
   * Generate unique slug from string
   */
  protected generateSlug(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  /**
   * Generate unique ID
   */
  protected generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Return success result
   */
  protected success<T>(data: T): ServiceResult<T> {
    return { success: true, data };
  }

  /**
   * Return error result
   */
  protected error(message: string, details?: unknown): ServiceResult<never> {
    return {
      success: false,
      error: {
        code: 'SERVICE_ERROR',
        message,
        details: details as Record<string, unknown>,
        statusCode: 400,
      },
    };
  }
}
