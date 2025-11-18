# Supabase Edge Functions

This directory contains all Edge Functions for the GVTEWAY/COMPVSS/ATLVS platform. Edge Functions run on Deno runtime at the edge, providing low-latency responses globally.

## 📁 Directory Structure

```
supabase/functions/
├── _shared/              # Shared utilities and middleware
│   ├── auth.ts          # Authentication utilities
│   ├── cors.ts          # CORS configuration
│   ├── rate-limit.ts    # Rate limiting
│   └── response.ts      # Standardized responses
├── _tests/              # Test files
├── analytics-tracker/   # Analytics events
├── auth-validator/      # JWT validation
├── cache-manager/       # Edge caching
├── email-notification/  # Email sending
├── export/              # CSV/Excel/PDF exports
├── geolocation/         # Geolocation services
├── image-optimizer/     # Image optimization
├── push-notification/   # FCM push notifications
├── qr-generator/        # QR code generation
├── scheduler/           # Cron job handler
├── sms-notification/    # Twilio SMS sending
├── stripe-webhook/      # Stripe webhook handler
├── web3-validator/      # Blockchain validation
└── deno.json           # Deno configuration
```

## 🚀 Deployed Edge Functions

### 1. **auth-validator**
- **Purpose:** Validates JWT tokens and returns user information
- **Endpoint:** `https://<project-ref>.supabase.co/functions/v1/auth-validator`
- **Rate Limit:** 60 requests/minute per IP
- **Authentication:** Required

### 2. **stripe-webhook**
- **Purpose:** Processes Stripe webhook events
- **Endpoint:** `https://<project-ref>.supabase.co/functions/v1/stripe-webhook`
- **Rate Limit:** None (webhook)
- **Authentication:** Stripe signature verification

### 3. **image-optimizer**
- **Purpose:** Optimizes and transforms images on-the-fly
- **Endpoint:** `https://<project-ref>.supabase.co/functions/v1/image-optimizer`
- **Rate Limit:** 100 requests/minute per IP
- **Parameters:**
  - `url`: Image URL
  - `w`: Width (optional)
  - `h`: Height (optional)
  - `q`: Quality 1-100 (default: 80)
  - `f`: Format (webp, jpeg, png, avif)

### 4. **geolocation**
- **Purpose:** Returns user geolocation and nearby events
- **Endpoint:** `https://<project-ref>.supabase.co/functions/v1/geolocation`
- **Rate Limit:** 30 requests/minute per IP
- **Authentication:** Optional

### 5. **email-notification**
- **Purpose:** Sends transactional emails via SendGrid
- **Endpoint:** `https://<project-ref>.supabase.co/functions/v1/email-notification`
- **Rate Limit:** 10 requests/minute per user
- **Authentication:** Required

### 6. **cache-manager**
- **Purpose:** Manages edge caching for frequently accessed data
- **Endpoint:** `https://<project-ref>.supabase.co/functions/v1/cache-manager`
- **Rate Limit:** 100 requests/minute per IP
- **Authentication:** Required for write operations
- **Actions:** get, set, invalidate, warm, stats

### 7. **qr-generator**
- **Purpose:** Generates QR codes for tickets and check-ins
- **Endpoint:** `https://<project-ref>.supabase.co/functions/v1/qr-generator`
- **Rate Limit:** 50 requests/minute per user
- **Authentication:** Required

### 8. **analytics-tracker**
- **Purpose:** Tracks user events and sends to PostHog
- **Endpoint:** `https://<project-ref>.supabase.co/functions/v1/analytics-tracker`
- **Rate Limit:** 200 requests/minute per IP
- **Authentication:** Optional

### 9. **web3-validator**
- **Purpose:** Validates blockchain transactions and signatures
- **Endpoint:** `https://<project-ref>.supabase.co/functions/v1/web3-validator`
- **Rate Limit:** 30 requests/minute per IP
- **Authentication:** Optional

### 10. **sms-notification**
- **Purpose:** Sends SMS messages via Twilio with template support
- **Endpoint:** `https://<project-ref>.supabase.co/functions/v1/sms-notification`
- **Rate Limit:** 10 requests/minute per user
- **Authentication:** Required
- **Templates:** ticket-confirmation, event-reminder, order-update, verification-code, password-reset

### 11. **push-notification**
- **Purpose:** Sends push notifications via Firebase Cloud Messaging (FCM)
- **Endpoint:** `https://<project-ref>.supabase.co/functions/v1/push-notification`
- **Rate Limit:** 20 requests/minute per user
- **Authentication:** Required
- **Features:** Multi-device support, badge management, delivery tracking

### 12. **scheduler**
- **Purpose:** Executes scheduled tasks and cron jobs
- **Endpoint:** `https://<project-ref>.supabase.co/functions/v1/scheduler`
- **Rate Limit:** None (internal use)
- **Authentication:** Required (service role)
- **Job Types:** event_reminder, ticket_expiry, report_generation, data_cleanup, subscription_renewal

### 13. **export**
- **Purpose:** Exports data in CSV, Excel (XLSX), or PDF formats
- **Endpoint:** `https://<project-ref>.supabase.co/functions/v1/export`
- **Rate Limit:** 5 requests/minute per user
- **Authentication:** Required
- **Formats:** CSV, XLSX, PDF
- **Export Types:** orders, tickets, events, users, analytics, advancing, expenses

## 🛠️ Development

### Prerequisites
- [Deno](https://deno.land/) v1.x or later
- [Supabase CLI](https://supabase.com/docs/guides/cli)

### Local Development

```bash
# Start a specific function locally
supabase functions serve auth-validator --env-file .env.local

# Start all functions
supabase functions serve --env-file .env.local
```

### Testing

```bash
# Run all tests
deno test --allow-all supabase/functions/_tests/

# Run specific test
deno test --allow-all supabase/functions/_tests/auth-validator_test.ts

# Run with coverage
deno test --allow-all --coverage=coverage supabase/functions/_tests/
```

### Deployment

```bash
# Deploy all functions
supabase functions deploy

# Deploy specific function
supabase functions deploy auth-validator

# Deploy with environment variables
supabase functions deploy --env-file .env.production
```

## 🔐 Environment Variables

Required environment variables for Edge Functions:

```bash
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# SendGrid
SENDGRID_API_KEY=SG...
FROM_EMAIL=noreply@gvteway.com

# PostHog
POSTHOG_API_KEY=phc_...
POSTHOG_HOST=https://app.posthog.com

# Twilio
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# Firebase Cloud Messaging
FCM_SERVER_KEY=your-fcm-server-key

# Alchemy (Web3)
ALCHEMY_API_KEY=your-alchemy-key
ETHEREUM_NETWORK=mainnet
```

## 📊 Monitoring

Edge Functions are monitored via:
- **Supabase Dashboard:** Real-time logs and metrics
- **Sentry:** Error tracking and performance monitoring
- **PostHog:** Analytics and usage tracking

## 🔒 Security

- All functions implement rate limiting
- CORS headers configured for allowed origins
- Authentication required for sensitive operations
- Input validation on all endpoints
- Webhook signature verification

## 📝 Adding New Edge Functions

1. Create new directory: `supabase/functions/your-function/`
2. Add `index.ts` with function logic
3. Import shared utilities from `_shared/`
4. Add tests in `_tests/your-function_test.ts`
5. Update this README
6. Deploy: `supabase functions deploy your-function`

## 🐛 Troubleshooting

### Function not responding
- Check Supabase dashboard logs
- Verify environment variables are set
- Ensure function is deployed: `supabase functions list`

### Rate limit errors
- Adjust rate limit in function code
- Use authenticated requests for higher limits

### CORS errors
- Verify allowed origins in `_shared/cors.ts`
- Check request headers include proper origin

## 📚 Resources

- [Supabase Edge Functions Docs](https://supabase.com/docs/guides/functions)
- [Deno Manual](https://deno.land/manual)
- [Deno Standard Library](https://deno.land/std)

## ✅ Status

**All Edge Functions: 100% Complete**

- ✅ 13 Edge Functions deployed
- ✅ Shared utilities implemented
- ✅ Rate limiting configured
- ✅ CORS configured
- ✅ Authentication integrated
- ✅ Tests written
- ✅ CI/CD pipeline configured
- ✅ Documentation complete

**New Functions Added (November 16, 2025):**
- ✅ sms-notification - Twilio SMS with templates
- ✅ push-notification - FCM push notifications
- ✅ scheduler - Cron job handler
- ✅ export - CSV/Excel/PDF exports

Last Updated: November 16, 2025
