/**
 * Storage error classes and utilities
 */

export class StorageError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'StorageError';
  }
}

export class StorageUploadError extends StorageError {
  constructor(message: string, details?: unknown) {
    super(message, 'STORAGE_UPLOAD_ERROR', details);
    this.name = 'StorageUploadError';
  }
}

export class StorageDownloadError extends StorageError {
  constructor(message: string, details?: unknown) {
    super(message, 'STORAGE_DOWNLOAD_ERROR', details);
    this.name = 'StorageDownloadError';
  }
}

export class StorageDeleteError extends StorageError {
  constructor(message: string, details?: unknown) {
    super(message, 'STORAGE_DELETE_ERROR', details);
    this.name = 'StorageDeleteError';
  }
}

export class StorageValidationError extends StorageError {
  constructor(message: string, details?: unknown) {
    super(message, 'STORAGE_VALIDATION_ERROR', details);
    this.name = 'StorageValidationError';
  }
}

export class StorageQuotaError extends StorageError {
  constructor(message: string, details?: unknown) {
    super(message, 'STORAGE_QUOTA_ERROR', details);
    this.name = 'StorageQuotaError';
  }
}

export class StoragePermissionError extends StorageError {
  constructor(message: string, details?: unknown) {
    super(message, 'STORAGE_PERMISSION_ERROR', details);
    this.name = 'StoragePermissionError';
  }
}

export class StorageNotFoundError extends StorageError {
  constructor(message: string, details?: unknown) {
    super(message, 'STORAGE_NOT_FOUND_ERROR', details);
    this.name = 'StorageNotFoundError';
  }
}

/**
 * Check if error is a storage error
 */
export function isStorageError(error: unknown): error is StorageError {
  return error instanceof StorageError;
}

/**
 * Format storage error for API response
 */
export function formatStorageError(error: unknown): {
  code: string;
  message: string;
  details?: unknown;
} {
  if (isStorageError(error)) {
    return {
      code: error.code,
      message: error.message,
      details: error.details,
    };
  }

  if (error instanceof Error) {
    return {
      code: 'STORAGE_ERROR',
      message: error.message,
    };
  }

  return {
    code: 'UNKNOWN_ERROR',
    message: 'An unknown error occurred',
  };
}

/**
 * Handle Supabase storage errors
 */
export function handleSupabaseStorageError(error: {
  message: string;
  statusCode?: string;
}): StorageError {
  const message = error.message || 'Storage operation failed';
  const code = error.statusCode || 'STORAGE_ERROR';

  // Map common Supabase errors to specific error types
  if (message.includes('not found') || code === '404') {
    return new StorageNotFoundError(message);
  }

  if (message.includes('permission') || message.includes('unauthorized') || code === '403') {
    return new StoragePermissionError(message);
  }

  if (message.includes('quota') || message.includes('limit exceeded')) {
    return new StorageQuotaError(message);
  }

  if (message.includes('validation') || message.includes('invalid')) {
    return new StorageValidationError(message);
  }

  return new StorageError(message, code);
}
