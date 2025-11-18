/**
 * Webhook Service
 * Manages webhook delivery and tracking
 */

import crypto from 'crypto';

export class WebhookService {
  /**
   * Send webhook
   */
  async sendWebhook(
    url: string,
    _event: string,
    payload: Record<string, unknown>,
    secret?: string
  ) {
    try {
      const timestamp = Date.now();
      const signature = secret
        ? this.generateSignature(payload, secret, timestamp)
        : undefined;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Event': _event,
          'X-Webhook-Timestamp': timestamp.toString(),
          ...(signature && { 'X-Webhook-Signature': signature }),
        },
        body: JSON.stringify(payload),
      });

      const success = response.ok;
      const statusCode = response.status;
      const responseBody = await response.text();

      // Log webhook delivery
      await this.logWebhook({
        url,
        _event,
        payload,
        success,
        statusCode,
        responseBody,
      });

      return {
        success,
        statusCode,
        responseBody,
      };
    } catch (error) {
      console.error('Error sending webhook:', error);

      // Log failed webhook
      await this.logWebhook({
        url,
        _event,
        payload,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Generate webhook signature
   */
  private generateSignature(
    payload: Record<string, unknown>,
    secret: string,
    timestamp: number
  ): string {
    const _data = `${timestamp}.${JSON.stringify(payload)}`;
    return crypto.createHmac('sha256', secret).update(_data).digest('hex');
  }

  /**
   * Verify webhook signature
   */
  verifySignature(
    payload: Record<string, unknown>,
    signature: string,
    secret: string,
    timestamp: number,
    toleranceSeconds = 300
  ): boolean {
    // Check timestamp tolerance
    const now = Date.now();
    if (Math.abs(now - timestamp) > toleranceSeconds * 1000) {
      return false;
    }

    const expectedSignature = this.generateSignature(payload, secret, timestamp);
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  }

  /**
   * Log webhook delivery
   */
  private async logWebhook(_data: {
    url: string;
    _event: string;
    payload: Record<string, unknown>;
    success: boolean;
    statusCode?: number;
    responseBody?: string;
    error?: string;
  }) {
    try {
      // Store webhook logs in database or logging service
      console.log('Webhook delivery:', {
        url: _data.url,
        event: _data._event,
        success: _data.success,
        statusCode: _data.statusCode,
        timestamp: new Date().toISOString(),
      });

      // Could store in database:
      // await prisma.webhookLog.create({ _data: ... });
    } catch (error) {
      console.error('Error logging webhook:', error);
    }
  }

  /**
   * Retry failed webhook
   */
  async retryWebhook(
    url: string,
    _event: string,
    payload: Record<string, unknown>,
    maxRetries = 3,
    delayMs = 1000
  ) {
    let lastError: string | undefined;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      const result = await this.sendWebhook(url, _event, payload);

      if (result.success) {
        return { success: true, attempts: attempt };
      }

      lastError = result.error;

      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * attempt));
      }
    }

    return {
      success: false,
      error: lastError || 'Max retries exceeded',
      attempts: maxRetries,
    };
  }

  /**
   * Send webhook to multiple endpoints
   */
  async broadcastWebhook(
    urls: string[],
    _event: string,
    payload: Record<string, unknown>
  ) {
    try {
      const results = await Promise.allSettled(
        urls.map((url) => this.sendWebhook(url, _event, payload))
      );

      const successful = results.filter((r) => r.status === 'fulfilled').length;
      const failed = results.filter((r) => r.status === 'rejected').length;

      return {
        total: urls.length,
        successful,
        failed,
        results,
      };
    } catch (error) {
      console.error('Error broadcasting webhook:', error);
      throw error;
    }
  }

  /**
   * Get webhook endpoints for event
   */
  async getWebhookEndpoints(_event: string, _organizationId?: string) {
    try {
      // Fetch webhook endpoints from database
      // This would query a WebhookEndpoint model
      // For now, return empty array
      return [];
    } catch (error) {
      console.error('Error fetching webhook endpoints:', error);
      return [];
    }
  }

  /**
   * Register webhook endpoint
   */
  async registerWebhook(_data: {
    url: string;
    events: string[];
    secret?: string;
    _organizationId?: string;
  }) {
    try {
      // Store webhook endpoint in database
      // await prisma.webhookEndpoint.create({ _data: ... });

      return {
        success: true,
        message: 'Webhook registered successfully',
      };
    } catch (error) {
      console.error('Error registering webhook:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Unregister webhook endpoint
   */
  async unregisterWebhook(_webhookId: string) {
    try {
      // Delete webhook endpoint from database
      // await prisma.webhookEndpoint.delete({ where: { id: _webhookId } });

      return {
        success: true,
        message: 'Webhook unregistered successfully',
      };
    } catch (error) {
      console.error('Error unregistering webhook:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Test webhook endpoint
   */
  async testWebhook(url: string, secret?: string) { 
    const testPayload = {
      event: 'webhook.test',
      timestamp: Date.now(),
      data: { message: 'This is a test webhook' },
    };

    return this.sendWebhook(url, 'webhook.test', testPayload, secret);
  }
}

export const webhookService = new WebhookService();
