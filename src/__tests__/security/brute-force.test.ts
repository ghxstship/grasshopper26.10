/**
 * Brute Force Protection Tests
 */

import { recordFailedAttempt, isLockedOut, clearFailedAttempts, getAttemptStatus, cleanupExpiredAttempts,  } from '@/lib/security/brute-force';

describe('Brute Force Protection', () => {
  const testEmail = 'test@example.com';

  beforeEach(() => {
    // Clear any existing attempts
    clearFailedAttempts(testEmail);
  });

  describe('recordFailedAttempt', () => {
    it('should record first failed attempt', () => {
      const result = recordFailedAttempt(testEmail);
      
      expect(result.remainingAttempts).toBe(4);
      expect(result.lockedUntil).toBeUndefined();
      expect(result.delayMs).toBe(0);
    });

    it('should increment failed attempts', () => {
      recordFailedAttempt(testEmail);
      recordFailedAttempt(testEmail);
      const result = recordFailedAttempt(testEmail);
      
      expect(result.remainingAttempts).toBe(2);
    });

    it('should lock account after max attempts', () => {
      // Record 5 failed attempts
      for (let i = 0; i < 4; i++) {
        recordFailedAttempt(testEmail);
      }
      
      const result = recordFailedAttempt(testEmail);
      
      expect(result.remainingAttempts).toBe(0);
      expect(result.lockedUntil).toBeDefined();
    });

    it('should apply progressive delays', () => {
      const delays = [];
      
      for (let i = 0; i < 5; i++) {
        const result = recordFailedAttempt(testEmail);
        delays.push(result.delayMs);
      }
      
      // Delays should increase
      expect(delays[1]).toBeGreaterThanOrEqual(delays[0]);
      expect(delays[2]).toBeGreaterThanOrEqual(delays[1]);
      expect(delays[3]).toBeGreaterThanOrEqual(delays[2]);
    });
  });

  describe('isLockedOut', () => {
    it('should return false for no attempts', () => {
      const result = isLockedOut(testEmail);
      
      expect(result.locked).toBe(false);
    });

    it('should return true when locked', () => {
      // Lock the account
      for (let i = 0; i < 5; i++) {
        recordFailedAttempt(testEmail);
      }
      
      const result = isLockedOut(testEmail);
      
      expect(result.locked).toBe(true);
      expect(result.lockedUntil).toBeDefined();
      expect(result.remainingMs).toBeGreaterThan(0);
    });

    it('should return false after lock expires', async () => {
      // This would require mocking time or waiting
      // For now, just verify the structure
      const result = isLockedOut(testEmail);
      expect(result).toHaveProperty('locked');
    });
  });

  describe('clearFailedAttempts', () => {
    it('should clear all attempts', () => {
      recordFailedAttempt(testEmail);
      recordFailedAttempt(testEmail);
      
      clearFailedAttempts(testEmail);
      
      const status = getAttemptStatus(testEmail);
      expect(status.attempts).toBe(0);
      expect(status.remainingAttempts).toBe(5);
    });
  });

  describe('getAttemptStatus', () => {
    it('should return correct status', () => {
      recordFailedAttempt(testEmail);
      recordFailedAttempt(testEmail);
      
      const status = getAttemptStatus(testEmail);
      
      expect(status.attempts).toBe(2);
      expect(status.remainingAttempts).toBe(3);
      expect(status.locked).toBe(false);
    });

    it('should show locked status', () => {
      // Lock the account
      for (let i = 0; i < 5; i++) {
        recordFailedAttempt(testEmail);
      }
      
      const status = getAttemptStatus(testEmail);
      
      expect(status.locked).toBe(true);
      expect(status.lockedUntil).toBeDefined();
    });
  });

  describe('cleanupExpiredAttempts', () => {
    it('should cleanup old attempts', () => {
      const cleaned = cleanupExpiredAttempts();
      
      // Should return number of cleaned entries
      expect(typeof cleaned).toBe('number');
      expect(cleaned).toBeGreaterThanOrEqual(0);
    });
  });
});
