/**
 * Request Signing Tests
 */

import { signRequest, verifyRequestSignature, generateSignatureHeaders, requireSignedRequest, signWebhook, verifyWebhookSignature, generateNonce, checkAndUseNonce,  } from '@/lib/security/request-signing';

describe('Request Signing', () => {
  const secret = 'test-secret-key';
  const method = 'POST';
  const path = '/api/test';
  const body = { data: 'test' };

  describe('signRequest', () => {
    it('should generate valid signature', () => {
      const timestamp = Date.now();
      const signature = signRequest(method, path, body, timestamp, secret);
      
      expect(signature).toMatch(/^v1=[a-f0-9]{64}$/);
    });

    it('should generate different signatures for different inputs', () => {
      const timestamp = Date.now();
      const sig1 = signRequest(method, path, body, timestamp, secret);
      const sig2 = signRequest(method, path, { data: 'different' }, timestamp, secret);
      
      expect(sig1).not.toBe(sig2);
    });

    it('should generate same signature for same inputs', () => {
      const timestamp = Date.now();
      const sig1 = signRequest(method, path, body, timestamp, secret);
      const sig2 = signRequest(method, path, body, timestamp, secret);
      
      expect(sig1).toBe(sig2);
    });
  });

  describe('verifyRequestSignature', () => {
    it('should verify valid signature', () => {
      const timestamp = Date.now();
      const signature = signRequest(method, path, body, timestamp, secret);
      
      const result = verifyRequestSignature(method, path, body, timestamp, signature, secret);
      
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject invalid signature', () => {
      const timestamp = Date.now();
      const signature = 'v1=invalid';
      
      const result = verifyRequestSignature(method, path, body, timestamp, signature, secret);
      
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should reject old timestamp', () => {
      const oldTimestamp = Date.now() - (10 * 60 * 1000); // 10 minutes ago
      const signature = signRequest(method, path, body, oldTimestamp, secret);
      
      const result = verifyRequestSignature(method, path, body, oldTimestamp, signature, secret);
      
      expect(result.valid).toBe(false);
      expect(result.error).toContain('timestamp');
    });

    it('should reject future timestamp', () => {
      const futureTimestamp = Date.now() + (10 * 60 * 1000); // 10 minutes future
      const signature = signRequest(method, path, body, futureTimestamp, secret);
      
      const result = verifyRequestSignature(method, path, body, futureTimestamp, signature, secret);
      
      expect(result.valid).toBe(false);
      expect(result.error).toContain('timestamp');
    });
  });

  describe('generateSignatureHeaders', () => {
    it('should generate valid headers', () => {
      const headers = generateSignatureHeaders(method, path, body, secret);
      
      expect(headers).toHaveProperty('X-Signature');
      expect(headers).toHaveProperty('X-Timestamp');
      expect(headers['X-Signature']).toMatch(/^v1=[a-f0-9]{64}$/);
      expect(parseInt(headers['X-Timestamp'])).toBeGreaterThan(0);
    });
  });

  describe('requireSignedRequest', () => {
    it('should accept valid signed request', () => {
      const headers = generateSignatureHeaders(method, path, body, secret);
      
      const result = requireSignedRequest(method, path, body, headers, secret);
      
      expect(result.valid).toBe(true);
    });

    it('should reject missing signature', () => {
      const headers = { 'X-Timestamp': Date.now().toString() };
      
      const result = requireSignedRequest(method, path, body, headers, secret);
      
      expect(result.valid).toBe(false);
      expect(result.error).toContain('X-Signature');
    });

    it('should reject missing timestamp', () => {
      const headers = { 'X-Signature': 'v1=test' };
      
      const result = requireSignedRequest(method, path, body, headers, secret);
      
      expect(result.valid).toBe(false);
      expect(result.error).toContain('X-Timestamp');
    });
  });

  describe('Webhook Signing', () => {
    const payload = { event: 'test', data: { id: 123 } };

    describe('signWebhook', () => {
      it('should generate webhook signature', () => {
        const result = signWebhook(payload, secret);
        
        expect(result.signature).toMatch(/^t=\d+,v1=[a-f0-9]{64}$/);
        expect(result.timestamp).toBeGreaterThan(0);
      });
    });

    describe('verifyWebhookSignature', () => {
      it('should verify valid webhook signature', () => {
        const { signature } = signWebhook(payload, secret);
        const payloadString = JSON.stringify(payload);
        
        const result = verifyWebhookSignature(payloadString, signature, secret);
        
        expect(result.valid).toBe(true);
      });

      it('should reject invalid webhook signature', () => {
        const signature = 't=123456,v1=invalid';
        const payloadString = JSON.stringify(payload);
        
        const result = verifyWebhookSignature(payloadString, signature, secret);
        
        expect(result.valid).toBe(false);
      });

      it('should reject old webhook', () => {
        const oldTimestamp = Date.now() - (10 * 60 * 1000);
        const signature = `t=${oldTimestamp},v1=test`;
        const payloadString = JSON.stringify(payload);
        
        const result = verifyWebhookSignature(payloadString, signature, secret);
        
        expect(result.valid).toBe(false);
        expect(result.error).toContain('timestamp');
      });
    });
  });

  describe('Nonce Management', () => {
    describe('generateNonce', () => {
      it('should generate unique nonces', () => {
        const nonce1 = generateNonce();
        const nonce2 = generateNonce();
        
        expect(nonce1).not.toBe(nonce2);
        expect(nonce1).toMatch(/^[a-f0-9]{64}$/);
      });
    });

    describe('checkAndUseNonce', () => {
      it('should accept new nonce', () => {
        const nonce = generateNonce();
        const result = checkAndUseNonce(nonce);
        
        expect(result.valid).toBe(true);
      });

      it('should reject reused nonce', () => {
        const nonce = generateNonce();
        checkAndUseNonce(nonce);
        
        const result = checkAndUseNonce(nonce);
        
        expect(result.valid).toBe(false);
        expect(result.error).toContain('replay attack');
      });
    });
  });
});
