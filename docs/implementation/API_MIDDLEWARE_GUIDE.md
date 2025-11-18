# API Middleware Implementation Guide

**Status:** ✅ Complete - Zero Tolerance Standards Met  
**Last Updated:** November 15, 2025

## Overview

This guide documents the centralized API middleware system for validation, rate limiting, error handling, and response standardization across all API routes.

---

## 1. Validation Middleware

### Location
`src/lib/api/middleware/validation.ts`

### Features
- ✅ Zod schema validation
- ✅ Request body validation
- ✅ Query parameter validation
- ✅ Route parameter validation
- ✅ Input sanitization
- ✅ Standardized error responses
- ✅ TypeScript type safety

### Usage Examples

#### Basic Body Validation

```typescript
import { validateBody, successResponse, errorResponse } from '@/lib/api/middleware/validation';
import { z } from 'zod';

const createEventSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(10).max(2000),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  price: z.number().positive(),
});

export async function POST(req: NextRequest) {
  // Validate request body
  const validation = await validateBody(req, createEventSchema);
  
  if (!validation.success) {
    return validation.response; // Returns formatted error
  }
  
  const data = validation.data; // Fully typed!
  
  // Process request...
  const event = await createEvent(data);
  
  return successResponse(event, 201);
}
```

#### Query Parameter Validation

```typescript
import { validateQuery, commonSchemas } from '@/lib/api/middleware/validation';

const searchSchema = z.object({
  ...commonSchemas.pagination,
  ...commonSchemas.search,
  category: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const validation = validateQuery(req, searchSchema);
  
  if (!validation.success) {
    return validation.response;
  }
  
  const { page, limit, q, category } = validation.data;
  
  // Fetch data with validated params
  const results = await searchEvents({ page, limit, q, category });
  
  return successResponse(results);
}
```

#### Route Parameter Validation

```typescript
import { validateParams, commonSchemas } from '@/lib/api/middleware/validation';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const validation = validateParams(params, commonSchemas.id);
  
  if (!validation.success) {
    return validation.response;
  }
  
  const { id } = validation.data;
  
  const event = await getEventById(id);
  
  if (!event) {
    return errorResponse('NOT_FOUND', 'Event not found', 404);
  }
  
  return successResponse(event);
}
```

#### Validation with Sanitization

```typescript
import { validateAndSanitize } from '@/lib/api/middleware/validation';

export async function POST(req: NextRequest) {
  // Validates AND sanitizes input (removes HTML, trims, etc.)
  const validation = await validateAndSanitize(req, createEventSchema);
  
  if (!validation.success) {
    return validation.response;
  }
  
  const data = validation.data; // Clean and validated!
  
  // Safe to use...
}
```

### Common Schemas

Pre-built schemas for common patterns:

```typescript
import { commonSchemas } from '@/lib/api/middleware/validation';

// UUID validation
commonSchemas.id // { id: uuid }

// Pagination
commonSchemas.pagination // { page: number, limit: number }

// Search
commonSchemas.search // { q: string, sort: 'asc'|'desc', sortBy: string }

// Date range
commonSchemas.dateRange // { startDate: datetime, endDate: datetime }
```

### Response Format

All API responses follow this standard format:

```typescript
{
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Array<{
      field: string;
      message: string;
    }>;
  };
  meta?: {
    timestamp: string;
    requestId?: string;
  };
}
```

---

## 2. Rate Limiting Middleware

### Location
`src/lib/api/middleware/rateLimit.ts`

### Features
- ✅ Token bucket algorithm
- ✅ Per-client rate limiting (IP + User Agent)
- ✅ Configurable time windows
- ✅ Automatic cleanup of expired entries
- ✅ Rate limit headers
- ✅ Retry-After header
- ✅ Multiple preset configurations

### Usage Examples

#### Basic Rate Limiting

```typescript
import { withRateLimit, rateLimitConfigs } from '@/lib/api/middleware/rateLimit';

export const POST = withRateLimit(
  rateLimitConfigs.standard, // 100 requests/minute
  async (req: NextRequest) => {
    // Your handler logic
    return successResponse({ message: 'Success' });
  }
);
```

#### Custom Rate Limit

```typescript
import { withRateLimit } from '@/lib/api/middleware/rateLimit';

export const POST = withRateLimit(
  {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 50, // 50 requests per minute
  },
  async (req: NextRequest) => {
    // Handler logic
  }
);
```

#### Auth Endpoints (Strict)

```typescript
import { withRateLimit, rateLimitConfigs } from '@/lib/api/middleware/rateLimit';

export const POST = withRateLimit(
  rateLimitConfigs.auth, // 5 requests per 15 minutes
  async (req: NextRequest) => {
    // Login logic
  }
);
```

### Preset Configurations

```typescript
rateLimitConfigs.strict    // 10 req/min
rateLimitConfigs.standard  // 100 req/min
rateLimitConfigs.lenient   // 1000 req/min
rateLimitConfigs.auth      // 5 req/15min
rateLimitConfigs.upload    // 10 req/hour
rateLimitConfigs.search    // 30 req/min
```

### Rate Limit Response

When limit is exceeded:

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later.",
    "retryAfter": 45
  }
}
```

Headers included:
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Requests remaining
- `X-RateLimit-Reset`: Reset timestamp
- `Retry-After`: Seconds until reset

---

## 3. Complete Route Example

### Combining All Middleware

```typescript
import { NextRequest } from 'next/server';
import {
  validateBody,
  validateParams,
  successResponse,
  errorResponse,
  commonSchemas,
} from '@/lib/api/middleware/validation';
import { withRateLimit, rateLimitConfigs } from '@/lib/api/middleware/rateLimit';
import { z } from 'zod';

// Define schema
const updateEventSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(10).max(2000).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

// PATCH /api/events/[id]
export const PATCH = withRateLimit(
  rateLimitConfigs.standard,
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    // 1. Validate route params
    const paramValidation = validateParams(params, commonSchemas.id);
    if (!paramValidation.success) {
      return paramValidation.response;
    }

    // 2. Validate request body
    const bodyValidation = await validateBody(req, updateEventSchema);
    if (!bodyValidation.success) {
      return bodyValidation.response;
    }

    const { id } = paramValidation.data;
    const updates = bodyValidation.data;

    // 3. Check authentication (if needed)
    // const session = await getSession(req);
    // if (!session) {
    //   return errorResponse('UNAUTHORIZED', 'Authentication required', 401);
    // }

    // 4. Business logic
    try {
      const event = await updateEvent(id, updates);
      
      if (!event) {
        return errorResponse('NOT_FOUND', 'Event not found', 404);
      }

      return successResponse(event);
    } catch (error) {
      console.error('Update event error:', error);
      return errorResponse(
        'INTERNAL_ERROR',
        'Failed to update event',
        500
      );
    }
  }
);
```

---

## 4. Error Handling Best Practices

### Standard Error Codes

```typescript
// Client errors (4xx)
'VALIDATION_ERROR'      // 400 - Invalid input
'UNAUTHORIZED'          // 401 - Not authenticated
'FORBIDDEN'             // 403 - Not authorized
'NOT_FOUND'             // 404 - Resource not found
'CONFLICT'              // 409 - Resource conflict
'RATE_LIMIT_EXCEEDED'   // 429 - Too many requests

// Server errors (5xx)
'INTERNAL_ERROR'        // 500 - Server error
'SERVICE_UNAVAILABLE'   // 503 - Service down
```

### Error Response Example

```typescript
try {
  // Business logic
} catch (error) {
  if (error instanceof PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return errorResponse('CONFLICT', 'Resource already exists', 409);
    }
  }
  
  console.error('Unexpected error:', error);
  return errorResponse('INTERNAL_ERROR', 'An unexpected error occurred', 500);
}
```

---

## 5. Testing

### Unit Tests

```typescript
import { validateBody, formatZodErrors } from '@/lib/api/middleware/validation';
import { z } from 'zod';

describe('validateBody', () => {
  it('should validate correct input', async () => {
    const schema = z.object({ name: z.string() });
    const req = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({ name: 'Test' }),
    });
    
    const result = await validateBody(req as any, schema);
    
    expect(result.success).toBe(true);
    expect(result.data).toEqual({ name: 'Test' });
  });
  
  it('should reject invalid input', async () => {
    const schema = z.object({ name: z.string() });
    const req = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({ name: 123 }),
    });
    
    const result = await validateBody(req as any, schema);
    
    expect(result.success).toBe(false);
  });
});
```

---

## 6. Migration Guide

### Before (Old Pattern)

```typescript
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Manual validation
    if (!body.title || body.title.length < 1) {
      return NextResponse.json({ error: 'Invalid title' }, { status: 400 });
    }
    
    // Process...
    
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
```

### After (New Pattern)

```typescript
import { validateBody, successResponse, errorResponse } from '@/lib/api/middleware/validation';
import { withRateLimit, rateLimitConfigs } from '@/lib/api/middleware/rateLimit';
import { z } from 'zod';

const schema = z.object({
  title: z.string().min(1).max(200),
});

export const POST = withRateLimit(
  rateLimitConfigs.standard,
  async (req: NextRequest) => {
    const validation = await validateBody(req, schema);
    
    if (!validation.success) {
      return validation.response;
    }
    
    try {
      const result = await processData(validation.data);
      return successResponse(result);
    } catch (error) {
      return errorResponse('INTERNAL_ERROR', 'Processing failed', 500);
    }
  }
);
```

---

## 7. Security Considerations

### Input Sanitization

✅ **Automatic HTML removal** - Prevents XSS  
✅ **String trimming** - Removes whitespace  
✅ **Length limits** - Prevents DoS  
✅ **Type validation** - Prevents injection  

### Rate Limiting

✅ **Per-client limits** - Prevents abuse  
✅ **Configurable windows** - Flexible protection  
✅ **Automatic cleanup** - Memory efficient  

### Error Messages

✅ **No sensitive data** - Safe error messages  
✅ **Consistent format** - Predictable responses  
✅ **Detailed validation** - Helpful for clients  

---

## 8. Performance

### Validation
- **Fast** - Zod is highly optimized
- **Type-safe** - No runtime overhead
- **Cached** - Schemas compiled once

### Rate Limiting
- **In-memory** - Fast lookups
- **Automatic cleanup** - No memory leaks
- **Scalable** - Use Redis in production

---

## 9. Production Recommendations

### Rate Limiting
- Use Redis for distributed rate limiting
- Adjust limits based on load testing
- Monitor rate limit hits

### Validation
- Log validation failures for monitoring
- Add custom error messages for UX
- Version your schemas

### Error Handling
- Integrate with Sentry for error tracking
- Add request IDs for tracing
- Monitor error rates

---

## Summary

✅ **Validation Middleware** - Complete with Zod schemas  
✅ **Rate Limiting** - Token bucket with presets  
✅ **Error Handling** - Standardized responses  
✅ **Input Sanitization** - XSS protection  
✅ **Type Safety** - Full TypeScript support  
✅ **Documentation** - Complete usage guide  

**Zero Tolerance Standard: MET ✅**
