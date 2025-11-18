/**
 * API Key Management and Rotation
 * Secure API key generation, validation, and rotation
 */

import { randomBytes, createHash, timingSafeEqual } from 'crypto';
import { prisma } from '@/lib/prisma';

export interface ApiKey {
  id: string;
  userId: string;
  name: string;
  keyPrefix: string;
  keyHash: string;
  lastUsedAt?: Date;
  expiresAt?: Date;
  createdAt: Date;
  revokedAt?: Date;
}

/**
 * Generate a new API key
 * Format: gvt_live_xxxxxxxxxxxxxxxxxxxxx (production)
 *         gvt_test_xxxxxxxxxxxxxxxxxxxxx (development)
 */
export function generateApiKey(environment: 'live' | 'test' = 'live'): {
  key: string;
  prefix: string;
  hash: string;
} {
  // Generate 32 bytes of random data
  const randomData = randomBytes(32);
  const keySecret = randomData.toString('base64url');
  
  // Create key with prefix
  const prefix = `gvt_${environment}`;
  const key = `${prefix}_${keySecret}`;
  
  // Hash the key for storage
  const hash = hashApiKey(key);
  
  return {
    key,
    prefix,
    hash,
  };
}

/**
 * Hash an API key for secure storage
 */
export function hashApiKey(key: string): string {
  return createHash('sha256').update(key).digest('hex');
}

/**
 * Verify an API key against its hash (timing-safe comparison)
 */
export function verifyApiKey(key: string, hash: string): boolean {
  const keyHash = hashApiKey(key);
  const keyBuffer = Buffer.from(keyHash, 'hex');
  const hashBuffer = Buffer.from(hash, 'hex');
  
  if (keyBuffer.length !== hashBuffer.length) {
    return false;
  }
  
  return timingSafeEqual(keyBuffer, hashBuffer);
}

/**
 * Create a new API key for a user
 */
export async function createApiKey(
  userId: string,
  name: string,
  expiresInDays?: number
): Promise<{ key: string; apiKeyId: string }> {
  const environment = process.env.NODE_ENV === 'production' ? 'live' : 'test';
  const { key, prefix, hash } = generateApiKey(environment);
  
  const expiresAt = expiresInDays
    ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
    : undefined;
  
  const apiKey = await prisma.apiKey.create({
    data: {
      userId,
      name,
      keyPrefix: prefix,
      keyHash: hash,
      expiresAt,
    },
  });
  
  // Log the creation
  await prisma.auditLog.create({
    data: {
      userId,
      action: 'API_KEY_CREATED',
      entity: 'ApiKey',
      entityId: apiKey.id,
      metadata: {
        name,
        prefix,
        expiresAt,
      },
    },
  });
  
  return {
    key, // Return the plain key only once
    apiKeyId: apiKey.id,
  };
}

/**
 * Validate an API key and return user info
 */
export async function validateApiKey(key: string): Promise<{
  valid: boolean;
  userId?: string;
  apiKeyId?: string;
  error?: string;
}> {
  // Extract prefix
  const parts = key.split('_');
  if (parts.length < 3 || parts[0] !== 'gvt') {
    return { valid: false, error: 'Invalid API key format' };
  }
  
  const prefix = `${parts[0]}_${parts[1]}`;
  
  // Find keys with matching prefix
  const apiKeys = await prisma.apiKey.findMany({
    where: {
      keyPrefix: prefix,
      revokedAt: null,
    },
  });
  
  // Check each key (timing-safe)
  for (const apiKey of apiKeys) {
    if (verifyApiKey(key, apiKey.keyHash)) {
      // Check expiration
      if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
        return { valid: false, error: 'API key expired' };
      }
      
      // Update last used timestamp
      await prisma.apiKey.update({
        where: { id: apiKey.id },
        data: { lastUsedAt: new Date() },
      });
      
      return {
        valid: true,
        userId: apiKey.userId,
        apiKeyId: apiKey.id,
      };
    }
  }
  
  return { valid: false, error: 'Invalid API key' };
}

/**
 * Revoke an API key
 */
export async function revokeApiKey(apiKeyId: string, userId: string): Promise<void> {
  await prisma.apiKey.update({
    where: { id: apiKeyId },
    data: { revokedAt: new Date() },
  });
  
  // Log the revocation
  await prisma.auditLog.create({
    data: {
      userId,
      action: 'API_KEY_REVOKED',
      entity: 'ApiKey',
      entityId: apiKeyId,
    },
  });
}

/**
 * Rotate an API key (revoke old, create new)
 */
export async function rotateApiKey(
  apiKeyId: string,
  userId: string
): Promise<{ key: string; apiKeyId: string }> {
  // Get old key details
  const oldKey = await prisma.apiKey.findUnique({
    where: { id: apiKeyId },
  });
  
  if (!oldKey) {
    throw new Error('API key not found');
  }
  
  // Revoke old key
  await revokeApiKey(apiKeyId, userId);
  
  // Create new key with same name
  const newKey = await createApiKey(userId, oldKey.name);
  
  // Log the rotation
  await prisma.auditLog.create({
    data: {
      userId,
      action: 'API_KEY_ROTATED',
      entity: 'ApiKey',
      entityId: newKey.apiKeyId,
      metadata: {
        oldKeyId: apiKeyId,
        newKeyId: newKey.apiKeyId,
      },
    },
  });
  
  return newKey;
}

/**
 * List all API keys for a user (without revealing the actual keys)
 */
export async function listApiKeys(userId: string): Promise<ApiKey[]> {
  return prisma.apiKey.findMany({
    where: {
      userId,
      revokedAt: null,
    },
    orderBy: { createdAt: 'desc' },
  });
}

/**
 * Clean up expired API keys (run periodically)
 */
export async function cleanupExpiredApiKeys(): Promise<number> {
  const result = await prisma.apiKey.updateMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });
  
  return result.count;
}
