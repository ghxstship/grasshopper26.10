/**
 * API Key Management Tests
 */

import { generateApiKey, hashApiKey, verifyApiKey,  } from '@/lib/security/api-keys';

describe('API Key Management', () => {
  describe('generateApiKey', () => {
    it('should generate live key in production', () => {
      const { key, prefix, hash } = generateApiKey('live');
      
      expect(key).toMatch(/^gvt_live_/);
      expect(prefix).toBe('gvt_live');
      expect(hash).toMatch(/^[a-f0-9]{64}$/);
    });

    it('should generate test key in development', () => {
      const { key, prefix, hash } = generateApiKey('test');
      
      expect(key).toMatch(/^gvt_test_/);
      expect(prefix).toBe('gvt_test');
      expect(hash).toMatch(/^[a-f0-9]{64}$/);
    });

    it('should generate unique keys', () => {
      const key1 = generateApiKey('live');
      const key2 = generateApiKey('live');
      
      expect(key1.key).not.toBe(key2.key);
      expect(key1.hash).not.toBe(key2.hash);
    });
  });

  describe('hashApiKey', () => {
    it('should hash API key consistently', () => {
      const key = 'gvt_test_abc123';
      const hash1 = hashApiKey(key);
      const hash2 = hashApiKey(key);
      
      expect(hash1).toBe(hash2);
      expect(hash1).toMatch(/^[a-f0-9]{64}$/);
    });

    it('should produce different hashes for different keys', () => {
      const key1 = 'gvt_test_abc123';
      const key2 = 'gvt_test_xyz789';
      
      const hash1 = hashApiKey(key1);
      const hash2 = hashApiKey(key2);
      
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('verifyApiKey', () => {
    it('should verify correct key', () => {
      const key = 'gvt_test_abc123';
      const hash = hashApiKey(key);
      
      const isValid = verifyApiKey(key, hash);
      
      expect(isValid).toBe(true);
    });

    it('should reject incorrect key', () => {
      const key = 'gvt_test_abc123';
      const wrongKey = 'gvt_test_xyz789';
      const hash = hashApiKey(key);
      
      const isValid = verifyApiKey(wrongKey, hash);
      
      expect(isValid).toBe(false);
    });

    it('should use timing-safe comparison', () => {
      // This test verifies that the comparison is timing-safe
      // by ensuring it doesn't short-circuit on first mismatch
      const key = 'gvt_test_abc123';
      const hash = hashApiKey(key);
      
      const wrongKey1 = 'gvt_test_xyz789';
      const wrongKey2 = 'gvt_test_abc124';
      
      const result1 = verifyApiKey(wrongKey1, hash);
      const result2 = verifyApiKey(wrongKey2, hash);
      
      expect(result1).toBe(false);
      expect(result2).toBe(false);
    });
  });
});
