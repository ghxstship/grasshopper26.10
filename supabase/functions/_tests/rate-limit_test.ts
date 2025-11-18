/**
 * Tests for Rate Limiting Utility
 */

import { assertEquals } from 'https://deno.land/std@0.168.0/testing/asserts.ts';
import { checkRateLimit } from '../_shared/rate-limit.ts';

Deno.test('Rate Limit - First Request Allowed', () => {
  const result = checkRateLimit('test-user-1', { maxRequests: 10, windowMs: 60000 });
  
  assertEquals(result.allowed, true);
  assertEquals(result.remaining, 9);
});

Deno.test('Rate Limit - Exceeds Limit', () => {
  const identifier = 'test-user-2';
  const config = { maxRequests: 3, windowMs: 60000 };

  // Make 3 requests
  for (let i = 0; i < 3; i++) {
    checkRateLimit(identifier, config);
  }

  // 4th request should be denied
  const result = checkRateLimit(identifier, config);
  assertEquals(result.allowed, false);
  assertEquals(result.remaining, 0);
});

Deno.test('Rate Limit - Window Reset', async () => {
  const identifier = 'test-user-3';
  const config = { maxRequests: 2, windowMs: 100 }; // 100ms window

  // Use up the limit
  checkRateLimit(identifier, config);
  checkRateLimit(identifier, config);

  // Wait for window to expire
  await new Promise((resolve) => setTimeout(resolve, 150));

  // Should be allowed again
  const result = checkRateLimit(identifier, config);
  assertEquals(result.allowed, true);
});
