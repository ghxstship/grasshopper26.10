# Performance Optimization Guide

**Complete guide to using the performance infrastructure in Grasshopper**

## Overview

The application has a comprehensive performance optimization system with:
- **Automatic caching** for API routes
- **Automatic pagination** for list endpoints
- **Performance monitoring** for all operations
- **Database indexes** for fast queries
- **React optimizations** for UI components

## Quick Start

### API Routes

#### Option 1: Automatic Performance (Recommended)
Use the middleware wrapper for automatic caching, monitoring, and compression:

```typescript
import { withPerformance } from '@/lib/api';

export const GET = withPerformance(async (request) => {
  // Your logic here
  const data = await fetchData();
  return NextResponse.json(data);
});
```

**What you get automatically:**
- ✅ Performance monitoring
- ✅ Automatic caching (if route matches patterns)
- ✅ Cache headers
- ✅ Slow query warnings

#### Option 2: Manual Control
For fine-grained control:

```typescript
import { measureAsync, withCache, addCacheHeaders } from '@/lib/performance';

export async function GET(request: NextRequest) {
  const data = await measureAsync(
    'my-operation',
    'api',
    async () => {
      return withCache(
        'my-cache-key',
        async () => {
          // Your expensive operation
          return await fetchData();
        },
        300 // TTL in seconds
      );
    }
  );

  const response = NextResponse.json(data);
  return addCacheHeaders(response, {
    maxAge: 60,
    sMaxAge: 300,
    staleWhileRevalidate: 600,
  });
}
```

### Pagination

#### Automatic Pagination
For list endpoints, use the pagination middleware:

```typescript
import { getPaginationParams, withPaginationResponse } from '@/lib/api';

export const GET = withPerformance(async (request) => {
  const { page, limit } = getPaginationParams(request);
  
  // Fetch paginated data
  const { data, total } = await fetchPaginatedData(page, limit);
  
  // Return with pagination metadata
  return withPaginationResponse(data, total, page, limit);
});
```

**Response format:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Database Queries

#### Use Optimized Selects
Reduce payload size by selecting only needed fields:

```typescript
import { selectFields } from '@/lib/performance';

const users = await prisma.user.findMany({
  select: selectFields.user, // Only id, email, name, role, avatar, createdAt
});
```

#### Prevent N+1 Queries
Use batch loading for related data:

```typescript
import { batchLoad } from '@/lib/performance';

const ordersWithUsers = await batchLoad(
  orders,
  'userId',
  async (userIds) => {
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
    });
    return new Map(users.map(u => [u.id, u]));
  }
);
```

#### Optimize Queries
Use query optimization helpers:

```typescript
import { createOptimizedWhere, createSearchQuery } from '@/lib/performance';

const where = {
  ...createOptimizedWhere(filters),
  ...createSearchQuery(searchTerm, ['name', 'description']),
};

const results = await prisma.event.findMany({ where });
```

### React Components

#### Memoize Expensive Components
Use React.memo for components that render frequently:

```typescript
import { memo, useMemo } from 'react';

const ExpensiveComponent = memo(({ data }: Props) => {
  const processedData = useMemo(() => {
    return data.map(item => expensiveTransform(item));
  }, [data]);

  return <div>{/* render */}</div>;
});
ExpensiveComponent.displayName = 'ExpensiveComponent';

export default ExpensiveComponent;
```

#### Lazy Load Heavy Components
Use dynamic imports for code splitting:

```typescript
import { LazyDataTable, LazyChart } from '@/lib/performance';

// Or create custom lazy component
import { createLazyComponent } from '@/lib/performance';

const LazyHeavyComponent = createLazyComponent(
  () => import('./HeavyComponent')
);
```

#### Virtual Scrolling
For large lists (1000+ items):

```typescript
import { VirtualScroll } from '@/lib/performance';

<VirtualScroll
  items={largeArray}
  itemHeight={50}
  containerHeight={600}
  renderItem={(item, index) => (
    <div key={index}>{item.name}</div>
  )}
/>
```

### Optimization Utilities

#### Debounce
Delay execution until user stops typing:

```typescript
import { debounce } from '@/lib/performance';

const handleSearch = debounce((query: string) => {
  performSearch(query);
}, 300);
```

#### Throttle
Limit execution frequency:

```typescript
import { throttle } from '@/lib/performance';

const handleScroll = throttle(() => {
  updateScrollPosition();
}, 100);
```

#### Memoize Functions
Cache expensive function results:

```typescript
import { memoize } from '@/lib/performance';

const expensiveCalculation = memoize((input: number) => {
  // Expensive operation
  return result;
});
```

## Cache Configuration

### Default Cache TTLs

```typescript
CACHE_TTL = {
  SHORT: 60,      // 1 minute
  MEDIUM: 300,    // 5 minutes
  LONG: 3600,     // 1 hour
  DAY: 86400,     // 24 hours
}
```

### Route-Specific Caching

The performance middleware automatically caches routes based on patterns:

| Route Pattern | TTL | Use Case |
|--------------|-----|----------|
| `/api/*/kpi/*` | 5 min | Analytics/KPI data |
| `/api/*/analytics/*` | 5 min | Analytics dashboards |
| `/api/events` | 1 min | Event listings |
| `/api/tickets` | 1 min | Ticket listings |
| `/api/venues` | 1 hour | Static reference data |
| `/api/categories` | 1 hour | Static reference data |

### Manual Cache Invalidation

```typescript
import { invalidateCache, CACHE_PREFIX } from '@/lib/performance';

// Invalidate specific item
await invalidateCache(CACHE_PREFIX.EVENT, eventId);

// Invalidate all events
await invalidateCache(CACHE_PREFIX.EVENT);
```

## Database Indexes

### Available Indexes

The application has 60+ database indexes across 3 migrations:

- **005_performance_indexes.sql**: Core indexes (Users, Events, Tickets, Orders, Products, Social)
- **011_advanced_indexes.sql**: Composite and partial indexes
- **048_performance_indexes.sql**: COMPVSS, ATLVS, full-text search indexes

### Using Full-Text Search

```typescript
// Full-text search is available on:
// - events (name, description)
// - users (name, email)
// - projects (name, description)

const results = await prisma.$queryRaw`
  SELECT * FROM events
  WHERE to_tsvector('english', name || ' ' || description) 
  @@ to_tsquery('english', ${searchTerm})
`;
```

## Performance Monitoring

### View Performance Metrics

```typescript
import { getMetrics, generateReport } from '@/lib/performance';

// Get all metrics
const metrics = getMetrics();

// Generate performance report
const report = generateReport();
console.log(report);
// {
//   totalMetrics: 150,
//   averages: { api: 45ms, database: 12ms, render: 8ms },
//   slowest: [...],
//   warnings: 3
// }
```

### Custom Metrics

```typescript
import { measureAsync, logMetric } from '@/lib/performance';

// Measure async operation
const result = await measureAsync(
  'custom-operation',
  'custom',
  async () => {
    return await doSomething();
  }
);

// Log custom metric
logMetric({
  name: 'user-action',
  type: 'custom',
  duration: 100,
  timestamp: Date.now(),
  metadata: { userId: '123' },
});
```

## Best Practices

### DO ✅
- Use `withPerformance` wrapper for all API routes
- Use pagination for list endpoints (>20 items)
- Memoize expensive React components
- Use database indexes for filtered/sorted queries
- Lazy load heavy components (charts, maps, editors)
- Use virtual scrolling for large lists (>100 items)
- Debounce user input handlers
- Cache static/reference data with long TTL

### DON'T ❌
- Don't cache mutation endpoints (POST/PUT/DELETE)
- Don't cache user-specific data without user ID in cache key
- Don't use useMemo/useCallback for cheap operations
- Don't lazy load critical above-the-fold components
- Don't skip pagination on unbounded queries
- Don't ignore slow query warnings

## Troubleshooting

### Slow API Routes
1. Check performance monitoring logs
2. Verify database indexes are being used
3. Check for N+1 query problems
4. Add caching if appropriate
5. Optimize database queries

### High Memory Usage
1. Check for memory leaks in memoization
2. Verify cache TTLs are appropriate
3. Use virtual scrolling for large lists
4. Lazy load heavy components

### Cache Issues
1. Verify cache keys are unique
2. Check TTL configuration
3. Ensure cache invalidation on updates
4. Check Redis connection

## Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| API Response Time | <200ms | ✅ Optimized |
| Database Query Time | <100ms | ✅ Indexed |
| Page Load Time | <2s | ✅ Optimized |
| First Contentful Paint | <1.5s | ✅ Optimized |
| Time to Interactive | <3s | ✅ Optimized |

## Additional Resources

- [Next.js Performance Docs](https://nextjs.org/docs/app/building-your-application/optimizing)
- [React Performance Optimization](https://react.dev/learn/render-and-commit)
- [PostgreSQL Index Optimization](https://www.postgresql.org/docs/current/indexes.html)
- [Redis Caching Best Practices](https://redis.io/docs/manual/patterns/)

---

**Last Updated:** November 16, 2025  
**Maintained By:** Development Team
