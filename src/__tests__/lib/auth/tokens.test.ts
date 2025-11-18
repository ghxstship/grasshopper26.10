/**
 * Unit Tests - Token Utilities
 * Tests token generation, verification, and hashing functions
 */

import { generateToken, generateVerificationToken, generatePasswordResetToken, generateVerificationCode, isTokenExpired, generateApiKey, hashToken, verifyTokenHash,  } from '@/lib/auth/tokens'

describe('Token Utilities', () => {
  describe('generateToken', () => {
    it('generates a token with default length', () => {
      const token = generateToken()
      expect(token).toBeDefined()
      expect(typeof token).toBe('string')
      expect(token.length).toBe(64) // 32 bytes = 64 hex characters
    })

    it('generates a token with custom length', () => {
      const token = generateToken(16)
      expect(token.length).toBe(32) // 16 bytes = 32 hex characters
    })

    it('generates unique tokens', () => {
      const token1 = generateToken()
      const token2 = generateToken()
      expect(token1).not.toBe(token2)
    })

    it('generates only hexadecimal characters', () => {
      const token = generateToken()
      expect(token).toMatch(/^[0-9a-f]+$/)
    })
  })

  describe('generateVerificationToken', () => {
    it('generates a verification token with expiry', () => {
      const result = generateVerificationToken()
      
      expect(result).toHaveProperty('token')
      expect(result).toHaveProperty('expires')
      expect(typeof result.token).toBe('string')
      expect(result.expires).toBeInstanceOf(Date)
    })

    it('sets expiry to 24 hours from now', () => {
      const result = generateVerificationToken()
      const now = new Date()
      const expectedExpiry = new Date(now.getTime() + 24 * 60 * 60 * 1000)
      
      // Allow 1 second tolerance for test execution time
      const diff = Math.abs(result.expires.getTime() - expectedExpiry.getTime())
      expect(diff).toBeLessThan(1000)
    })

    it('generates unique tokens each time', () => {
      const result1 = generateVerificationToken()
      const result2 = generateVerificationToken()
      expect(result1.token).not.toBe(result2.token)
    })
  })

  describe('generatePasswordResetToken', () => {
    it('generates a password reset token with expiry', () => {
      const result = generatePasswordResetToken()
      
      expect(result).toHaveProperty('token')
      expect(result).toHaveProperty('expires')
      expect(typeof result.token).toBe('string')
      expect(result.expires).toBeInstanceOf(Date)
    })

    it('sets expiry to 1 hour from now', () => {
      const result = generatePasswordResetToken()
      const now = new Date()
      const expectedExpiry = new Date(now.getTime() + 60 * 60 * 1000)
      
      // Allow 1 second tolerance
      const diff = Math.abs(result.expires.getTime() - expectedExpiry.getTime())
      expect(diff).toBeLessThan(1000)
    })

    it('generates unique tokens each time', () => {
      const result1 = generatePasswordResetToken()
      const result2 = generatePasswordResetToken()
      expect(result1.token).not.toBe(result2.token)
    })
  })

  describe('generateVerificationCode', () => {
    it('generates a 6-digit code', () => {
      const code = generateVerificationCode()
      expect(code).toMatch(/^\d{6}$/)
    })

    it('generates codes within valid range', () => {
      const code = generateVerificationCode()
      const numCode = parseInt(code, 10)
      expect(numCode).toBeGreaterThanOrEqual(100000)
      expect(numCode).toBeLessThanOrEqual(999999)
    })

    it('generates different codes', () => {
      const codes = new Set()
      for (let i = 0; i < 100; i++) {
        codes.add(generateVerificationCode())
      }
      // Should have generated mostly unique codes
      expect(codes.size).toBeGreaterThan(90)
    })
  })

  describe('isTokenExpired', () => {
    it('returns false for future date', () => {
      const futureDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now
      expect(isTokenExpired(futureDate)).toBe(false)
    })

    it('returns true for past date', () => {
      const pastDate = new Date(Date.now() - 60 * 60 * 1000) // 1 hour ago
      expect(isTokenExpired(pastDate)).toBe(true)
    })

    it('returns true for current time (edge case)', () => {
      const now = new Date()
      // Small delay to ensure it's in the past
      setTimeout(() => {
        expect(isTokenExpired(now)).toBe(true)
      }, 10)
    })
  })

  describe('generateApiKey', () => {
    it('generates an API key with default prefix', () => {
      const apiKey = generateApiKey()
      expect(apiKey).toMatch(/^gvt_[0-9a-f]{48}$/)
    })

    it('generates an API key with custom prefix', () => {
      const apiKey = generateApiKey('test')
      expect(apiKey).toMatch(/^test_[0-9a-f]{48}$/)
    })

    it('generates unique API keys', () => {
      const key1 = generateApiKey()
      const key2 = generateApiKey()
      expect(key1).not.toBe(key2)
    })

    it('includes prefix and token separated by underscore', () => {
      const apiKey = generateApiKey('custom')
      const parts = apiKey.split('_')
      expect(parts).toHaveLength(2)
      expect(parts[0]).toBe('custom')
      expect(parts[1]).toMatch(/^[0-9a-f]{48}$/)
    })
  })

  describe('hashToken', () => {
    it('generates a hash for a token', () => {
      const token = 'test-token-123'
      const hash = hashToken(token)
      
      expect(hash).toBeDefined()
      expect(typeof hash).toBe('string')
      expect(hash.length).toBe(64) // SHA-256 produces 64 hex characters
    })

    it('generates consistent hash for same token', () => {
      const token = 'test-token-123'
      const hash1 = hashToken(token)
      const hash2 = hashToken(token)
      expect(hash1).toBe(hash2)
    })

    it('generates different hashes for different tokens', () => {
      const hash1 = hashToken('token1')
      const hash2 = hashToken('token2')
      expect(hash1).not.toBe(hash2)
    })

    it('generates only hexadecimal characters', () => {
      const hash = hashToken('test-token')
      expect(hash).toMatch(/^[0-9a-f]{64}$/)
    })
  })

  describe('verifyTokenHash', () => {
    it('returns true for matching token and hash', () => {
      const token = 'test-token-123'
      const hash = hashToken(token)
      expect(verifyTokenHash(token, hash)).toBe(true)
    })

    it('returns false for non-matching token and hash', () => {
      const token = 'test-token-123'
      const hash = hashToken('different-token')
      expect(verifyTokenHash(token, hash)).toBe(false)
    })

    it('is case-sensitive', () => {
      const token = 'TestToken'
      const hash = hashToken(token)
      expect(verifyTokenHash('testtoken', hash)).toBe(false)
    })

    it('handles empty strings', () => {
      const hash = hashToken('')
      expect(verifyTokenHash('', hash)).toBe(true)
      expect(verifyTokenHash('non-empty', hash)).toBe(false)
    })
  })

  describe('Integration Tests', () => {
    it('verification token workflow', () => {
      // Generate verification token
      const { token, expires } = generateVerificationToken()
      
      // Hash it for storage
      const hash = hashToken(token)
      
      // Verify token is not expired
      expect(isTokenExpired(expires)).toBe(false)
      
      // Verify token matches hash
      expect(verifyTokenHash(token, hash)).toBe(true)
      
      // Wrong token should not match
      expect(verifyTokenHash('wrong-token', hash)).toBe(false)
    })

    it('password reset token workflow', () => {
      // Generate reset token
      const { token, expires } = generatePasswordResetToken()
      
      // Hash it for storage
      const hash = hashToken(token)
      
      // Verify token is not expired
      expect(isTokenExpired(expires)).toBe(false)
      
      // Verify token matches hash
      expect(verifyTokenHash(token, hash)).toBe(true)
    })

    it('API key generation and verification', () => {
      // Generate API key
      const apiKey = generateApiKey('prod')
      
      // Hash it for storage
      const hash = hashToken(apiKey)
      
      // Verify API key matches hash
      expect(verifyTokenHash(apiKey, hash)).toBe(true)
      
      // Different API key should not match
      const otherKey = generateApiKey('prod')
      expect(verifyTokenHash(otherKey, hash)).toBe(false)
    })
  })
})
