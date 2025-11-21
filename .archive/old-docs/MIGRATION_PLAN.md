# Complete UI Migration Plan

## Strategy
Systematically rebuild each legacy page in `/src/app/(rebuild)/` using new UI components, then delete legacy files.

## Migration Priority

### Phase 1: Core Root Files (CRITICAL)
- [ ] `/src/app/page.tsx` → `/src/app/(rebuild)/page.tsx` ✅ DONE
- [ ] `/src/app/layout.tsx` → Update to use rebuild routes
- [ ] `/src/app/not-found.tsx` → Rebuild with new UI
- [ ] `/src/app/providers.tsx` → Keep (shared)

### Phase 2: Authentication (HIGH PRIORITY)
- [ ] `/src/app/auth/login` → `/src/app/(rebuild)/auth/login` ✅ DONE
- [ ] `/src/app/auth/[...nextauth]` → Keep (API route)
- [ ] `/src/app/auth/me` → Keep (API route)
- [ ] `/src/app/auth/session` → Keep (API route)
- [ ] `/src/app/auth/refresh-token` → Keep (API route)

### Phase 3: GVTEWAY Consumer Platform (HIGH PRIORITY)
- [ ] `/src/app/events` → `/src/app/(rebuild)/events` ✅ DONE
- [ ] `/src/app/events/[id]` → `/src/app/(rebuild)/events/[id]` ✅ DONE
- [ ] `/src/app/adventures` → `/src/app/(rebuild)/adventures` ✅ DONE
- [ ] `/src/app/memberships` → `/src/app/(rebuild)/memberships` ✅ DONE
- [ ] `/src/app/marketplace` → `/src/app/(rebuild)/marketplace` ✅ DONE
- [ ] `/src/app/tickets` → Rebuild
- [ ] `/src/app/orders` → Rebuild
- [ ] `/src/app/cart` → Rebuild
- [ ] `/src/app/checkout` → Rebuild
- [ ] `/src/app/profile` → `/src/app/(rebuild)/profile` ✅ DONE
- [ ] `/src/app/wishlists` → Rebuild
- [ ] `/src/app/social` → Rebuild
- [ ] `/src/app/artists` → Rebuild
- [ ] `/src/app/venues` → Rebuild
- [ ] `/src/app/destinations` → Rebuild

### Phase 4: COMPVSS Team Platform (MEDIUM PRIORITY)
- [ ] `/src/app/compvss` → Rebuild all subpages
- [ ] `/src/app/opportunities` → Rebuild

### Phase 5: ATLVS Internal Platform (MEDIUM PRIORITY)
- [ ] `/src/app/atlvs` → Rebuild all subpages

### Phase 6: Supporting Features (LOW PRIORITY)
- [ ] `/src/app/notifications` → Rebuild
- [ ] `/src/app/alerts` → Rebuild
- [ ] `/src/app/search` → Rebuild
- [ ] `/src/app/organizations` → Rebuild
- [ ] `/src/app/wallet` → Rebuild
- [ ] `/src/app/nft` → Rebuild

### Phase 7: Integrations (KEEP AS-IS)
- [ ] `/src/app/api` → Keep (all API routes)
- [ ] `/src/app/webhooks` → Keep (API routes)
- [ ] `/src/app/integrations` → Keep (API routes)
- [ ] `/src/app/shopify` → Keep (API routes)
- [ ] `/src/app/spotify` → Keep (API routes)
- [ ] `/src/app/google-places` → Keep (API routes)
- [ ] `/src/app/n8n` → Keep (API routes)
- [ ] `/src/app/upload` → Keep (API route)
- [ ] `/src/app/batch` → Keep (API route)
- [ ] `/src/app/sync` → Keep (API route)
- [ ] `/src/app/test` → Keep (test routes)
- [ ] `/src/app/placeholder` → Keep (utility)

## Execution Rules
1. Rebuild page with new UI components
2. Test functionality
3. Delete legacy file
4. Update any internal links
5. Move to next page

## Current Status
- ✅ 10 pages rebuilt
- ⏳ ~30+ pages remaining
- 🔄 Starting systematic migration
