/**
 * API Utilities Index
 * Central export for all API-related utilities
 */

// Performance Middleware
export {
  withPerformanceOptimizations,
  withPerformance,
} from './performance-middleware';

// Pagination Middleware
export {
  shouldPaginate,
  getPaginationParams,
  withPaginationResponse,
  addPaginationHeaders,
} from './pagination-middleware';

// Security (if exists)
export * from './security';
