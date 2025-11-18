# API Enhancement Guide

**Quick Reference for Adding Rate Limiting, Validation, Transactions, and Retry Logic**

## Quick Start

### 1. Enhance API Routes

```typescript
// Before
export async function GET(request: NextRequest) {
  const data = await fetchData();
  return NextResponse.json(data);
}

// After - with rate limiting
import { withRateLimit } from '@/lib/api/route-enhancers';

export const GET = withRateLimit(async (request) => {
  const data = await fetchData();
  return NextResponse.json(data);
}, 'PUBLIC_READ');
```

### 2. Add Validation

```typescript
import { withValidation, CommonSchemas } from '@/lib/api/route-enhancers';
import { z } from 'zod';

export const POST = withValidation(async (request) => {
  const body = await request.json();
  // body is now validated
  return NextResponse.json({ success: true });
}, {
  body: z.object({
    name: z.string().min(1).max(100),
    email: z.string().email(),
  }),
  query: CommonSchemas.pagination,
});
```

### 3. Full Enhancement

```typescript
import { enhanceRoute, RateLimitPresets, CommonSchemas } from '@/lib/api/route-enhancers';

export const PUT = enhanceRoute(async (request, { params }) => {
  const body = await request.json();
  // Fully protected and validated
  return NextResponse.json({ success: true });
}, {
  rateLimit: 'WRITE',
  auth: true,
  validate: {
    params: CommonSchemas.id,
    body: z.object({ name: z.string() }),
  },
});
```

## Rate Limit Presets

| Preset | Window | Max Requests | Use Case |
|--------|--------|--------------|----------|
| `AUTH` | 15 min | 5 | Login, register, password reset |
| `PUBLIC_READ` | 1 min | 60 | Public API endpoints |
| `AUTH_READ` | 1 min | 120 | Authenticated read operations |
| `WRITE` | 1 min | 30 | Create, update, delete operations |
| `HEAVY` | 1 min | 10 | Expensive operations (exports, reports) |
| `DEFAULT` | 1 min | 100 | General purpose |

## Common Validation Schemas

```typescript
import { CommonSchemas } from '@/lib/api/route-enhancers';

// Pagination
CommonSchemas.pagination // { page, limit }

// ID parameter
CommonSchemas.id // { id: uuid }

// Search
CommonSchemas.search // { q: string }

// Date range
CommonSchemas.dateRange // { startDate?, endDate? }

// Sort
CommonSchemas.sort // { sortBy?, sortOrder: 'asc'|'desc' }
```

## Service Enhancement

### Add Retry Logic

```typescript
import { withRetry } from '@/lib/api/service-enhancers';

// External API call with retry
const data = await withRetry(async () => {
  return await externalAPI.getData();
}, {
  maxAttempts: 3,
  delayMs: 1000,
  backoffMultiplier: 2,
});
```

### Add Transactions

```typescript
import { withTransaction } from '@/lib/api/service-enhancers';

const result = await withTransaction(async (tx) => {
  const user = await tx.user.create({ data: userData });
  await tx.profile.create({ data: { userId: user.id } });
  return user;
});
```

### Circuit Breaker

```typescript
import { withCircuitBreaker } from '@/lib/api/service-enhancers';

const data = await withCircuitBreaker('stripe-api', async () => {
  return await stripe.charges.create(chargeData);
}, {
  failureThreshold: 5,
  resetTimeoutMs: 60000,
});
```

### Enhance Service Methods

```typescript
import { enhanceServiceMethod } from '@/lib/api/service-enhancers';

class UserService {
  createUser = enhanceServiceMethod(
    async (data: UserData) => {
      return await prisma.user.create({ data });
    },
    {
      transaction: true,
      retry: { maxAttempts: 3 },
      idempotency: {
        keyFn: (data) => `create-user:${data.email}`,
      },
    }
  );
}
```

## Bulk Enhancement Script

To quickly enhance all routes in a directory:

```bash
# Create a script to add rate limiting to all routes
find src/app/api -name "route.ts" -exec sed -i '' \
  '1i import { withRateLimit } from "@/lib/api/route-enhancers";\n' {} \;
```

## Routes Requiring Enhancement

### High Priority (Public Endpoints)

1. **Auth Routes** - Use `AUTH` preset
   - `/api/auth/login`
   - `/api/auth/register`
   - `/api/auth/forgot-password`
   - `/api/auth/reset-password`

2. **Public Read Routes** - Use `PUBLIC_READ` preset
   - `/api/gvteway/events` (GET)
   - `/api/gvteway/tickets` (GET)
   - `/api/gvteway/venues` (GET)

3. **Write Routes** - Use `WRITE` preset
   - All POST/PUT/DELETE endpoints

### Services Requiring Transactions

1. **User Management**
   - `createUser` - creates user + profile
   - `deleteUser` - deletes user + related data

2. **Order Processing**
   - `createOrder` - creates order + line items
   - `processPayment` - updates order + creates transaction

3. **Event Management**
   - `createEvent` - creates event + tickets + venue

### Services Requiring Retry Logic

1. **External APIs**
   - Stripe payment processing
   - Twilio SMS sending
   - Email service (SendGrid/Mailgun)
   - Storage uploads (S3/Supabase)

2. **Third-party Integrations**
   - QuickBooks sync
   - Calendar integrations
   - Social media posting

## Testing Enhanced Routes

```typescript
// Test rate limiting
describe('Rate Limited Route', () => {
  it('should reject after max requests', async () => {
    // Make max requests
    for (let i = 0; i < 5; i++) {
      await fetch('/api/auth/login', { method: 'POST' });
    }
    
    // Next request should be rate limited
    const response = await fetch('/api/auth/login', { method: 'POST' });
    expect(response.status).toBe(429);
  });
});

// Test validation
describe('Validated Route', () => {
  it('should reject invalid data', async () => {
    const response = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify({ email: 'invalid' }),
    });
    
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('Validation failed');
  });
});
```

## Migration Checklist

- [ ] Add rate limiting to 105 public routes
- [ ] Add validation schemas to 18 routes missing them
- [ ] Add transactions to 28 services
- [ ] Add retry logic to 15 external API calls
- [ ] Test all enhanced routes
- [ ] Update API documentation

## Performance Impact

- **Rate Limiting**: Minimal (<1ms overhead)
- **Validation**: ~2-5ms per request
- **Transactions**: Depends on operations
- **Retry Logic**: Only on failures
- **Circuit Breaker**: <1ms overhead

## Best Practices

1. **Always use rate limiting on public endpoints**
2. **Validate all user input**
3. **Use transactions for multi-step operations**
4. **Add retry logic for external APIs**
5. **Use circuit breakers for unreliable services**
6. **Log all enhancements for monitoring**

## Troubleshooting

**Rate limit too strict?**
- Adjust preset or create custom config
- Consider user-based rate limiting (not IP)

**Validation too strict?**
- Review schema requirements
- Add `.optional()` where appropriate

**Transaction deadlocks?**
- Reduce transaction scope
- Add proper indexes
- Use `SELECT FOR UPDATE` carefully

**Retry causing delays?**
- Reduce `maxAttempts`
- Adjust `delayMs` and `backoffMultiplier`
- Use circuit breaker to fail fast
