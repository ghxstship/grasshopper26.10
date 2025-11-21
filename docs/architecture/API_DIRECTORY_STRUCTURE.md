# API Directory Structure

## Current State Analysis

The `src/app/api/` directory currently contains 295 items with inconsistent organization. This document outlines the optimized structure.

## Optimized Structure

```
src/app/api/
├── (auth)/                    # Authentication & Authorization
│   ├── auth/
│   │   ├── login/
│   │   ├── register/
│   │   ├── logout/
│   │   ├── refresh/
│   │   ├── verify/
│   │   └── [...nextauth]/    # NextAuth catch-all
│   ├── account/
│   │   ├── profile/
│   │   ├── settings/
│   │   └── delete/
│   └── wallet/
│       ├── connect/
│       ├── disconnect/
│       └── sign/
│
├── (platforms)/               # Platform-specific APIs
│   ├── atlvs/
│   │   ├── advancing/
│   │   ├── projects/
│   │   ├── tasks/
│   │   ├── teams/
│   │   ├── budgets/
│   │   ├── vendors/
│   │   ├── documents/
│   │   ├── assets/
│   │   ├── analytics/
│   │   └── n8n/
│   │
│   ├── compvss/
│   │   ├── advancing/
│   │   ├── compensation/
│   │   ├── settlements/
│   │   ├── expenses/
│   │   ├── payroll/
│   │   ├── affiliates/
│   │   ├── credentials/
│   │   ├── day-of-show/
│   │   ├── issues/
│   │   └── reports/
│   │
│   └── gvteway/
│       ├── events/
│       ├── tickets/
│       ├── adventures/
│       ├── marketplace/
│       ├── memberships/
│       ├── cart/
│       ├── checkout/
│       └── social/
│
├── (shared)/                  # Shared across platforms
│   ├── analytics/
│   ├── notifications/
│   ├── search/
│   ├── upload/
│   ├── storage/
│   └── settings/
│
├── (integrations)/            # External integrations
│   ├── google-places/
│   ├── shopify/
│   ├── spotify/
│   ├── stripe/
│   ├── n8n/
│   └── webhooks/
│       ├── stripe/
│       ├── shopify/
│       └── n8n/
│
├── (admin)/                   # Admin-only endpoints
│   ├── users/
│   ├── organizations/
│   ├── system/
│   └── batch/
│
├── _middleware/               # Shared middleware
│   ├── auth.ts
│   ├── rateLimit.ts
│   ├── validation.ts
│   └── logging.ts
│
├── _utils/                    # Shared utilities
│   ├── response.ts
│   ├── error.ts
│   ├── validation.ts
│   └── database.ts
│
└── __tests__/                 # API tests
    ├── auth.test.ts
    ├── events.test.ts
    └── projects.test.ts
```

## Route Group Benefits

### `(auth)` - Authentication Routes
- Centralized auth logic
- Easy to apply auth middleware
- Clear security boundary

### `(platforms)` - Platform APIs
- Platform-specific business logic
- Independent scaling
- Clear ownership

### `(shared)` - Cross-platform APIs
- Reusable across platforms
- Consistent implementation
- Reduced duplication

### `(integrations)` - External Services
- Isolated third-party code
- Easy to mock for testing
- Clear integration points

### `(admin)` - Administrative APIs
- Extra security checks
- Audit logging
- Restricted access

## API Route Patterns

### Standard CRUD Pattern

```typescript
// src/app/api/(platforms)/gvteway/events/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/_middleware/auth';
import { validateRequest } from '@/app/_middleware/validation';
import { successResponse, errorResponse } from '@/app/_utils/response';

// GET /api/gvteway/events - List events
export async function GET(request: NextRequest) {
  try {
    const user = await auth(request);
    const { searchParams } = new URL(request.url);
    
    // Implementation
    const events = await getEvents(searchParams);
    
    return successResponse(events);
  } catch (error) {
    return errorResponse(error);
  }
}

// POST /api/gvteway/events - Create event
export async function POST(request: NextRequest) {
  try {
    const user = await auth(request);
    const body = await request.json();
    
    await validateRequest(body, eventSchema);
    
    const event = await createEvent(body, user.id);
    
    return successResponse(event, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
```

### Dynamic Route Pattern

```typescript
// src/app/api/(platforms)/gvteway/events/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

// GET /api/gvteway/events/:id - Get event
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const event = await getEvent(params.id);
  return successResponse(event);
}

// PATCH /api/gvteway/events/:id - Update event
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const event = await updateEvent(params.id, body);
  return successResponse(event);
}

// DELETE /api/gvteway/events/:id - Delete event
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await deleteEvent(params.id);
  return successResponse({ message: 'Event deleted' });
}
```

## Middleware Pattern

```typescript
// src/app/_middleware/auth.ts
import { NextRequest } from 'next/server';
import { verify } from 'jsonwebtoken';

export async function auth(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  
  if (!token) {
    throw new Error('Unauthorized');
  }
  
  const user = verify(token, process.env.JWT_SECRET!);
  return user;
}

// src/app/_middleware/rateLimit.ts
export async function rateLimit(request: NextRequest) {
  // Implementation
}
```

## Response Utilities

```typescript
// src/app/_utils/response.ts
import { NextResponse } from 'next/server';

export function successResponse(data: any, status = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  );
}

export function errorResponse(error: any, status = 500) {
  return NextResponse.json(
    {
      success: false,
      error: error.message || 'Internal server error',
    },
    { status }
  );
}
```

## Migration Strategy

### Phase 1: Create New Structure
1. Create route group directories
2. Set up middleware and utilities
3. Create response helpers

### Phase 2: Move Routes
1. Start with auth routes (highest priority)
2. Move platform routes
3. Move shared routes
4. Move integrations

### Phase 3: Update Clients
1. Update frontend API calls
2. Update tests
3. Update documentation

### Phase 4: Cleanup
1. Remove old routes
2. Update imports
3. Verify all endpoints

## Best Practices

### 1. Consistent Error Handling
```typescript
try {
  // Logic
} catch (error) {
  if (error instanceof ValidationError) {
    return errorResponse(error, 400);
  }
  if (error instanceof AuthError) {
    return errorResponse(error, 401);
  }
  return errorResponse(error, 500);
}
```

### 2. Request Validation
```typescript
import { z } from 'zod';

const eventSchema = z.object({
  title: z.string().min(1).max(200),
  date: z.string().datetime(),
  venue: z.string(),
});

await validateRequest(body, eventSchema);
```

### 3. Response Pagination
```typescript
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  
  const { items, total } = await getEvents({ page, limit });
  
  return successResponse({
    items,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
}
```

### 4. Rate Limiting
```typescript
import { rateLimit } from '@/app/_middleware/rateLimit';

export async function POST(request: NextRequest) {
  await rateLimit(request); // Throws if rate limit exceeded
  // ... rest of logic
}
```

### 5. Caching
```typescript
export async function GET(request: NextRequest) {
  const events = await getEvents();
  
  return NextResponse.json(events, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
    },
  });
}
```

## Testing Strategy

```typescript
// src/app/api/__tests__/events.test.ts
import { GET, POST } from '../(platforms)/gvteway/events/route';
import { NextRequest } from 'next/server';

describe('Events API', () => {
  it('should list events', async () => {
    const request = new NextRequest('http://localhost/api/gvteway/events');
    const response = await GET(request);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
  });
  
  it('should create event', async () => {
    const request = new NextRequest('http://localhost/api/gvteway/events', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Test Event',
        date: '2025-01-01T00:00:00Z',
        venue: 'Test Venue',
      }),
    });
    
    const response = await POST(request);
    const data = await response.json();
    
    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
  });
});
```

## Performance Optimizations

1. **Database Connection Pooling**: Reuse connections
2. **Caching**: Use Redis for frequently accessed data
3. **Lazy Loading**: Load heavy dependencies only when needed
4. **Streaming**: Use streaming for large responses
5. **Compression**: Enable gzip/brotli compression

## Security Checklist

- [ ] Authentication on all protected routes
- [ ] Input validation on all endpoints
- [ ] Rate limiting on public endpoints
- [ ] CORS configuration
- [ ] SQL injection prevention
- [ ] XSS prevention
- [ ] CSRF protection
- [ ] Secure headers
- [ ] API key rotation
- [ ] Audit logging
