/**
 * Shared types for third-party integrations
 */

export interface IntegrationConfig {
  enabled: boolean;
  apiKey?: string;
  apiSecret?: string;
  webhookSecret?: string;
  environment: 'development' | 'staging' | 'production';
}

export interface IntegrationResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface WebhookPayload {
  id: string;
  type: string;
  data: any;
  timestamp: string;
  signature?: string;
}

export interface EmailPayload {
  to: string | string[];
  from?: string;
  subject: string;
  html?: string;
  text?: string;
  templateId?: string;
  dynamicData?: Record<string, any>;
  attachments?: Array<{
    filename: string;
    content: string | Buffer;
    type?: string;
  }>;
}

export interface SMSPayload {
  to: string;
  from?: string;
  body: string;
  mediaUrls?: string[];
}

export interface StorageUploadOptions {
  bucket: string;
  path: string;
  file: File | Buffer;
  contentType?: string;
  cacheControl?: string;
  upsert?: boolean;
}

export interface StorageDownloadOptions {
  bucket: string;
  path: string;
  transform?: {
    width?: number;
    height?: number;
    quality?: number;
  };
}
