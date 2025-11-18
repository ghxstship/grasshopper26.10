/**
 * Transaction Utilities
 * Provides transaction support for Prisma operations
 */

import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

/**
 * Execute operations within a transaction
 * Automatically rolls back on error
 */
export async function withTransaction<T>(
  callback: (tx: Prisma.TransactionClient) => Promise<T>,
  options?: {
    maxWait?: number; // Max time to wait for transaction (ms)
    timeout?: number; // Max time transaction can run (ms)
    isolationLevel?: Prisma.TransactionIsolationLevel;
  }
): Promise<T> {
  try {
    return await prisma.$transaction(callback, {
      maxWait: options?.maxWait || 5000, // 5 seconds default
      timeout: options?.timeout || 10000, // 10 seconds default
      isolationLevel: options?.isolationLevel,
    });
  } catch (error) {
    console.error('Transaction failed:', error);
    throw error;
  }
}

/**
 * Execute multiple operations in a transaction
 * Returns results array in same order as operations
 */
export async function executeInTransaction<T extends unknown[]>(
  operations: Array<(tx: Prisma.TransactionClient) => Promise<unknown>>,
  options?: {
    maxWait?: number;
    timeout?: number;
    isolationLevel?: Prisma.TransactionIsolationLevel;
  }
): Promise<T> {
  return withTransaction(async (tx) => {
    const results: unknown[] = [];
    for (const operation of operations) {
      const result = await operation(tx);
      results.push(result);
    }
    return results as T;
  }, options);
}

/**
 * Retry a transaction on specific errors
 */
export async function retryTransaction<T>(
  callback: (tx: Prisma.TransactionClient) => Promise<T>,
  options?: {
    maxRetries?: number;
    retryDelay?: number;
    retryOn?: string[]; // Error codes to retry on
    maxWait?: number;
    timeout?: number;
    isolationLevel?: Prisma.TransactionIsolationLevel;
  }
): Promise<T> {
  const maxRetries = options?.maxRetries || 3;
  const retryDelay = options?.retryDelay || 1000;
  const retryOn = options?.retryOn || ['P2034', 'P2028']; // Deadlock and timeout errors

  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await withTransaction(callback, {
        maxWait: options?.maxWait,
        timeout: options?.timeout,
        isolationLevel: options?.isolationLevel,
      });
    } catch (error) {
      lastError = error as Error;

      // Check if error is retryable
      const errorCode = (error as { code?: string }).code;
      const shouldRetry = errorCode && retryOn.includes(errorCode);

      if (!shouldRetry || attempt === maxRetries) {
        throw error;
      }

      // Wait before retry with exponential backoff
      const delay = retryDelay * Math.pow(2, attempt);
      await new Promise((resolve) => setTimeout(resolve, delay));
      
      console.log(`Retrying transaction (attempt ${attempt + 1}/${maxRetries})`);
    }
  }

  throw lastError;
}

/**
 * Nested transaction helper
 * Checks if already in a transaction context
 */
export async function withNestedTransaction<T>(
  txOrPrisma: Prisma.TransactionClient | typeof prisma,
  callback: (tx: Prisma.TransactionClient) => Promise<T>,
  options?: {
    maxWait?: number;
    timeout?: number;
    isolationLevel?: Prisma.TransactionIsolationLevel;
  }
): Promise<T> {
  // Check if already in transaction
  const isTransaction = '$transaction' in txOrPrisma;

  if (isTransaction) {
    // Already in transaction, just execute callback
    return callback(txOrPrisma as Prisma.TransactionClient);
  }

  // Not in transaction, create new one
  return withTransaction(callback, options);
}

/**
 * Batch operations with transaction support
 * Splits large batches into smaller chunks
 */
export async function batchInTransaction<T, R>(
  items: T[],
  operation: (item: T, tx: Prisma.TransactionClient) => Promise<R>,
  options?: {
    batchSize?: number;
    maxWait?: number;
    timeout?: number;
    isolationLevel?: Prisma.TransactionIsolationLevel;
  }
): Promise<R[]> {
  const batchSize = options?.batchSize || 100;
  const results: R[] = [];

  // Process in batches
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    
    const batchResults = await withTransaction(async (tx) => {
      const promises = batch.map((item) => operation(item, tx));
      return Promise.all(promises);
    }, options);

    results.push(...batchResults);
  }

  return results;
}

/**
 * Conditional transaction wrapper
 * Only uses transaction if condition is met
 */
export async function conditionalTransaction<T>(
  callback: (client: Prisma.TransactionClient | typeof prisma) => Promise<T>,
  useTransaction: boolean,
  options?: {
    maxWait?: number;
    timeout?: number;
    isolationLevel?: Prisma.TransactionIsolationLevel;
  }
): Promise<T> {
  if (useTransaction) {
    return withTransaction(callback, options);
  }
  return callback(prisma);
}

/**
 * Transaction with savepoint support
 * Allows partial rollback within a transaction
 */
export async function withSavepoint<T>(
  tx: Prisma.TransactionClient,
  savepointName: string,
  callback: () => Promise<T>
): Promise<T> {
  try {
    // Create savepoint
    await tx.$executeRawUnsafe(`SAVEPOINT ${savepointName}`);
    
    // Execute callback
    const result = await callback();
    
    // Release savepoint
    await tx.$executeRawUnsafe(`RELEASE SAVEPOINT ${savepointName}`);
    
    return result;
  } catch (error) {
    // Rollback to savepoint
    await tx.$executeRawUnsafe(`ROLLBACK TO SAVEPOINT ${savepointName}`);
    throw error;
  }
}

/**
 * Common transaction patterns
 */
export const transactionPatterns = {
  /**
   * Create with related records
   */
  async createWithRelated<TMain, TRelated>(
    mainOperation: (tx: Prisma.TransactionClient) => Promise<TMain>,
    relatedOperations: Array<(tx: Prisma.TransactionClient, main: TMain) => Promise<TRelated>>
  ): Promise<{ main: TMain; related: TRelated[] }> {
    return withTransaction(async (tx) => {
      const main = await mainOperation(tx);
      const related = await Promise.all(
        relatedOperations.map((op) => op(tx, main))
      );
      return { main, related };
    });
  },

  /**
   * Update with audit log
   */
  async updateWithAudit<T>(
    updateOperation: (tx: Prisma.TransactionClient) => Promise<T>,
    auditData: {
      userId: string;
      action: string;
      entityType: string;
      entityId: string;
      changes?: Record<string, unknown>;
    }
  ): Promise<T> {
    return withTransaction(async (tx) => {
      const result = await updateOperation(tx);
      
      await tx.auditLog.create({
        data: {
          userId: auditData.userId,
          action: auditData.action,
          entity: auditData.entityType,
          entityId: auditData.entityId,
          ...(auditData.changes && { metadata: auditData.changes as any }),
        },
      });

      return result;
    });
  },

  /**
   * Delete with cascade
   */
  async deleteWithCascade<T>(
    mainDelete: (tx: Prisma.TransactionClient) => Promise<T>,
    cascadeDeletes: Array<(tx: Prisma.TransactionClient) => Promise<unknown>>
  ): Promise<T> {
    return withTransaction(async (tx) => {
      // Delete related records first
      await Promise.all(cascadeDeletes.map((op) => op(tx)));
      
      // Delete main record
      return mainDelete(tx);
    });
  },
};
