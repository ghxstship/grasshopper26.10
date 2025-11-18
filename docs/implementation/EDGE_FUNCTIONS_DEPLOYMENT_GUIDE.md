# Edge Functions Deployment Guide

**Version:** 2.0.0  
**Last Updated:** November 16, 2025  
**Status:** Ready for Deployment (13 functions)

---

## Prerequisites

Before deploying Edge Functions, ensure you have:

- [x] Supabase project created
- [x] Supabase CLI installed (`npm install -g supabase`)
- [x] Deno installed (`curl -fsSL https://deno.land/install.sh | sh`)
- [x] GitHub repository with Actions enabled
- [x] All required environment variables configured

---

## Environment Variables

### Required Variables

Create a `.env.local` file in the project root:

```bash
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe
STRIPE_SECRET_KEY=sk_test_51...
STRIPE_WEBHOOK_SECRET=whsec_...

# SendGrid
SENDGRID_API_KEY=SG.xxx
FROM_EMAIL=noreply@gvteway.com

# PostHog
POSTHOG_API_KEY=phc_xxx
POSTHOG_HOST=https://app.posthog.com

# Alchemy (Web3)
ALCHEMY_API_KEY=xxx
ETHEREUM_NETWORK=mainnet

# Twilio (SMS)
TWILIO_ACCOUNT_SID=ACxxx
TWILIO_AUTH_TOKEN=xxx
TWILIO_PHONE_NUMBER=+1234567890

# Firebase Cloud Messaging (Push)
FCM_SERVER_KEY=xxx
```

### GitHub Secrets

Add these secrets to your GitHub repository:

1. Go to Settings → Secrets and variables → Actions
2. Add the following secrets:
   - `SUPABASE_ACCESS_TOKEN` - Get from Supabase dashboard
   - `SUPABASE_PROJECT_ID` - Your project reference ID

---

## Local Development

### 1. Start Supabase Locally

```bash
# Initialize Supabase
supabase init

# Start local Supabase
supabase start

# Link to your project
supabase link --project-ref your-project-id
```

### 2. Serve Edge Functions Locally

```bash
# Serve all functions
supabase functions serve --env-file .env.local

# Serve specific function
supabase functions serve auth-validator --env-file .env.local

# Serve with debug logs
supabase functions serve --debug
```

### 3. Test Locally

```bash
# Test auth-validator
curl http://localhost:54321/functions/v1/auth-validator \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test with POST data
curl -X POST http://localhost:54321/functions/v1/email-notification \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"to":"user@example.com","template":"welcome","data":{"name":"John"}}'
```

---

## Deployment

### Option 1: Manual Deployment

```bash
# Deploy all functions
supabase functions deploy

# Deploy specific function
supabase functions deploy auth-validator

# Deploy with environment variables
supabase secrets set STRIPE_SECRET_KEY=sk_test_...
supabase functions deploy
```

### Option 2: Automated Deployment (Recommended)

The GitHub Actions workflow automatically deploys on push to `main` or `staging` branches.

**Workflow file:** `.github/workflows/deploy-edge-functions.yml`

```yaml
# Triggers on:
# - Push to main/staging branches
# - Changes to supabase/functions/** files
# - Manual workflow dispatch
```

**To deploy:**

```bash
git add supabase/functions/
git commit -m "feat: update edge functions"
git push origin main
```

---

## Testing

### Unit Tests

```bash
# Run all tests
deno test --allow-all supabase/functions/_tests/

# Run specific test
deno test --allow-all supabase/functions/_tests/rate-limit_test.ts

# Run with coverage
deno test --allow-all --coverage=coverage supabase/functions/_tests/
deno coverage coverage
```

### Integration Tests

```bash
# Test against staging environment
export SUPABASE_URL=https://staging-project.supabase.co
export SUPABASE_ANON_KEY=your-staging-key

# Run integration tests
npm run test:edge-functions
```

### Manual Testing

Use the provided test scripts:

```bash
# Test auth-validator
./scripts/test-edge-functions.sh auth-validator

# Test with custom data
./scripts/test-edge-functions.sh email-notification '{"to":"test@example.com","template":"welcome","data":{"name":"Test"}}'
```

---

## Monitoring

### Supabase Dashboard

1. Navigate to **Edge Functions** in Supabase dashboard
2. View real-time logs and metrics
3. Monitor error rates and response times
4. Check invocation counts

### Sentry Integration

Error tracking is automatically configured:

```typescript
// Errors are automatically sent to Sentry
// View in: https://sentry.io/organizations/your-org/issues/
```

### PostHog Analytics

Track function usage:

```typescript
// Analytics events are sent to PostHog
// View in: https://app.posthog.com/project/your-project
```

---

## Troubleshooting

### Common Issues

#### 1. Function Not Found

**Error:** `Function not found: auth-validator`

**Solution:**
```bash
# Verify function is deployed
supabase functions list

# Redeploy if missing
supabase functions deploy auth-validator
```

#### 2. Environment Variables Not Set

**Error:** `Deno.env.get('STRIPE_SECRET_KEY') is undefined`

**Solution:**
```bash
# Set secrets in Supabase
supabase secrets set STRIPE_SECRET_KEY=sk_test_...

# Verify secrets
supabase secrets list
```

#### 3. CORS Errors

**Error:** `Access to fetch blocked by CORS policy`

**Solution:**
- Verify allowed origins in `_shared/cors.ts`
- Ensure preflight requests are handled
- Check request headers include proper origin

#### 4. Rate Limit Exceeded

**Error:** `429 Too Many Requests`

**Solution:**
- Wait for rate limit window to reset
- Use authenticated requests for higher limits
- Contact support for limit increases

#### 5. Timeout Errors

**Error:** `Function execution timed out`

**Solution:**
- Optimize function code
- Reduce external API calls
- Implement caching
- Consider breaking into smaller functions

---

## Performance Optimization

### 1. Caching

Use the cache-manager Edge Function:

```typescript
// Cache frequently accessed data
await fetch('https://your-project.supabase.co/functions/v1/cache-manager?action=set&key=events', {
  method: 'POST',
  body: JSON.stringify({ data: events }),
});

// Retrieve cached data
const response = await fetch('https://your-project.supabase.co/functions/v1/cache-manager?action=get&key=events');
```

### 2. Rate Limiting

Adjust rate limits based on usage:

```typescript
// In your Edge Function
const rateLimit = checkRateLimit(identifier, {
  maxRequests: 100,  // Increase for higher traffic
  windowMs: 60000,   // 1 minute window
});
```

### 3. Connection Pooling

Reuse database connections:

```typescript
// Use Supabase client singleton
const supabase = createClient(url, key);
```

---

## Security Best Practices

### 1. API Key Management

- ✅ Never commit API keys to git
- ✅ Use GitHub Secrets for CI/CD
- ✅ Rotate keys regularly
- ✅ Use service role key only in Edge Functions

### 2. Input Validation

- ✅ Validate all request parameters
- ✅ Sanitize user input
- ✅ Check data types and formats
- ✅ Implement size limits

### 3. Authentication

- ✅ Require authentication for sensitive endpoints
- ✅ Verify JWT tokens
- ✅ Check user permissions
- ✅ Implement role-based access control

### 4. Rate Limiting

- ✅ Implement per-user rate limiting
- ✅ Add per-IP rate limiting
- ✅ Monitor for abuse
- ✅ Implement exponential backoff

---

## Rollback Procedure

If deployment causes issues:

### 1. Quick Rollback

```bash
# Redeploy previous version
git checkout HEAD~1 supabase/functions/
supabase functions deploy
```

### 2. Full Rollback

```bash
# Revert to specific commit
git revert <commit-hash>
git push origin main
```

### 3. Emergency Disable

```bash
# Disable specific function
supabase functions delete auth-validator

# Redeploy when fixed
supabase functions deploy auth-validator
```

---

## Scaling Considerations

### Current Limits

- **Concurrent executions:** 100 per function
- **Execution time:** 30 seconds max
- **Memory:** 512 MB per function
- **Request size:** 6 MB max

### Scaling Strategies

1. **Horizontal Scaling:** Functions automatically scale
2. **Caching:** Implement aggressive caching
3. **Async Processing:** Use queues for long tasks
4. **CDN:** Use CDN for static assets

---

## Maintenance

### Regular Tasks

#### Weekly
- [ ] Review error logs
- [ ] Check performance metrics
- [ ] Monitor rate limit usage
- [ ] Review security alerts

#### Monthly
- [ ] Update dependencies
- [ ] Rotate API keys
- [ ] Review and optimize slow functions
- [ ] Update documentation

#### Quarterly
- [ ] Security audit
- [ ] Performance benchmarking
- [ ] Cost analysis
- [ ] Capacity planning

---

## Support

### Resources

- **Supabase Docs:** https://supabase.com/docs/guides/functions
- **Deno Manual:** https://deno.land/manual
- **GitHub Issues:** https://github.com/your-org/your-repo/issues

### Contact

- **Technical Support:** support@gvteway.com
- **Emergency:** emergency@gvteway.com
- **Slack:** #edge-functions

---

## Appendix

### A. Function Endpoints

| Function | Endpoint | Method | Auth Required |
|----------|----------|--------|---------------|
| auth-validator | `/functions/v1/auth-validator` | GET | Yes |
| stripe-webhook | `/functions/v1/stripe-webhook` | POST | No (signature) |
| image-optimizer | `/functions/v1/image-optimizer` | GET | No |
| geolocation | `/functions/v1/geolocation` | GET | No |
| email-notification | `/functions/v1/email-notification` | POST | Yes |
| cache-manager | `/functions/v1/cache-manager` | GET/POST | Conditional |
| qr-generator | `/functions/v1/qr-generator` | GET | Yes |
| analytics-tracker | `/functions/v1/analytics-tracker` | POST | No |
| web3-validator | `/functions/v1/web3-validator` | POST | No |

### B. Rate Limits

| Function | Limit | Window |
|----------|-------|--------|
| auth-validator | 60 req | 1 min |
| stripe-webhook | Unlimited | - |
| image-optimizer | 100 req | 1 min |
| geolocation | 30 req | 1 min |
| email-notification | 10 req | 1 min |
| cache-manager | 100 req | 1 min |
| qr-generator | 50 req | 1 min |
| analytics-tracker | 200 req | 1 min |
| web3-validator | 30 req | 1 min |

### C. Response Codes

| Code | Meaning | Action |
|------|---------|--------|
| 200 | Success | Continue |
| 400 | Bad Request | Check request parameters |
| 401 | Unauthorized | Provide valid token |
| 403 | Forbidden | Check permissions |
| 429 | Rate Limited | Wait and retry |
| 500 | Server Error | Check logs, contact support |

---

**Deployment Status:** ✅ Production Ready  
**Last Deployed:** November 15, 2025  
**Next Review:** December 15, 2025
