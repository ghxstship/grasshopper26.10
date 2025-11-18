# Architecture Documentation

System architecture, design specifications, and platform overviews.

## 📚 Documents

### Core Architecture
- **`ARCHITECTURE.md`** - Complete system architecture overview
- **`THREE_PLATFORM_SUMMARY.md`** - GVTEWAY, COMPVSS, ATLVS platform details

### API & Integration
- **`API_DOCUMENTATION.md`** - REST API endpoint documentation

### Design System
- **`ATOMIC_DESIGN_SYSTEM.md`** - Atomic design specifications
- **`DESIGN_SYSTEM_EXAMPLES.md`** - Component implementation examples

## 🎯 Quick Reference

### Platform Overview
```
GVTEWAY (Consumer)    → Events, tickets, NFTs, social
COMPVSS (External)    → Production crew, advancing, operations
ATLVS (Internal)      → Project management, budgets, approvals
```

### Tech Stack
- **Frontend:** Next.js 14+, TypeScript, Tailwind CSS
- **Backend:** Supabase, Prisma, NextAuth.js v5
- **Database:** PostgreSQL (88 models)
- **Integrations:** Stripe, WalletConnect, Mapbox, N8N

### Database Schema
- **88 models** across 5 categories
- **150+ relationships** with foreign keys
- **100+ indexes** for performance
- **20+ enums** for type safety

---

**For implementation details, see:** `/docs/implementation/`
