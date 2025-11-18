/**
 * Performance Utilities Index
 * Central export for all performance optimization utilities
 */

// Caching
export {
  getCached,
  setCached,
  deleteCached,
  deleteCachedPattern,
  withCache,
  invalidateCache,
  warmCache,
  getCacheStats,
  CACHE_TTL,
  CACHE_PREFIX,
} from './cache';

// Compression
export {
  compressResponse,
  addCacheHeaders,
} from './compression';

// Pagination
export {
  parsePaginationParams,
  calculatePagination,
  createPaginatedResponse,
  calculateSkip,
  PAGINATION_DEFAULTS,
  type PaginationParams,
  type PaginationResult,
} from './pagination';

// Query Optimization
export {
  selectFields,
  batchLoad,
  createOptimizedWhere,
  createSearchQuery,
  optimizeInclude,
  createCursorQuery,
} from './query-optimization';

// Monitoring
export {
  startTimer,
  measureAsync,
  measureSync,
  logMetric,
  getMetrics,
  getMetricsByType,
  getAverageDuration,
  getSlowestMetrics,
  clearMetrics,
  generateReport,
  useRenderMetric,
  type MetricType,
  type PerformanceMetric,
} from './monitoring';

// Optimization Utilities
export {
  debounce,
  throttle,
  memoize,
  memoizeWithTTL,
  lazyLoad,
  batchAsync,
  retryWithBackoff,
  AsyncQueue,
  chunk,
  sleep,
  withTimeout,
  singleton,
  deepClone,
} from './optimization';

// React Optimization
export {
  createLazyComponent,
  LazyModal,
  LazyCommandPalette,
} from './lazy-loading';

export {
  VirtualScroll,
  useVirtualScroll,
} from './virtual-scroll';

export {
  deepEqual,
  createMemoComponent,
  useMemoizedArray,
  useMemoizedFilter,
  useMemoizedSort,
  useMemoizedGroup,
} from './memoization';
