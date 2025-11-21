# Grasshopper26.10: Complete Application Overview

> **Built with GHXSTSHIP precision ⚓️**  
> **Last Updated:** November 20, 2025

---

## 🎯 Executive Summary

Grasshopper26.10 is an enterprise-grade, three-platform ecosystem for the complete event lifecycle.

### Key Metrics
- **3 Platforms**: Consumer, External Teams, Internal Production
- **205+ Pages**: Comprehensive feature coverage
- **88 Database Models**: Full-featured data architecture
- **145+ API Endpoints**: Complete backend infrastructure
- **50+ Features**: End-to-end event management
- **30+ Workflows**: Automated processes via N8N
- **Overall Completion**: ~30% (Foundation & Design Complete)

---

## 🏗️ Three-Platform Architecture

### Platform Flow
```
GVTEWAY (Consumer) → COMPVSS (External Teams) → ATLVS (Internal Production)
```

### GVTEWAY - Consumer Platform
**Brand**: Red (#FF0000), Yellow (#FFD700), Blue (#0066FF)  
**Personality**: Bold & Exciting  
**Audience**: Fans, attendees, members  
**Features**: Event discovery, ticketing, social, marketplace, NFTs, adventures, memberships

### COMPVSS - External Teams Platform
**Brand**: Cyan (#00FFFF), Teal (#00CED1), Indigo (#4B0082)  
**Personality**: Professional & Collaborative  
**Audience**: Crews, staff, media, partners, affiliates  
**Features**: Team onboarding, production advancing, day-of-show ops, QR codes, issues, expenses

### ATLVS - Internal Production Platform
**Brand**: Green (#00FF00), Orange (#FF8800), Purple (#8800FF)  
**Personality**: Powerful & Enterprise  
**Audience**: Event organizers, production managers  
**Features**: Project management, advancing approvals, budgets, assets, N8N automation

---

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js 16.0.3 (App Router, React 19.2.0, Server Components)
- **Language**: TypeScript 5+ (strict mode)
- **Styling**: Tailwind CSS 4 + GHXSTSHIP design system
- **Components**: Atomic Design (atoms → molecules → organisms → templates)
- **Animation**: Framer Motion 12.23.24
- **State**: Zustand 5.0.8
- **Forms**: React Hook Form 7.66.0 + Zod 4.1.12
- **Icons**: Lucide React 0.553.0

### Backend
- **Database**: PostgreSQL via Supabase
- **ORM**: Prisma 6.19.0
- **Auth**: NextAuth.js v5.0.0-beta.30
- **Payments**: Stripe 19.3.1 (Connect for multi-party)
- **Storage**: Supabase Storage + Cloudflare CDN
- **Cache**: Upstash Redis 1.35.6
- **Queue**: BullMQ 5.63.2

### Integrations
- **Wallets**: WalletConnect 2.23.0, Apple/Google Wallet
- **Blockchain**: Ethers.js 6.15.0 (Ethereum, Polygon)
- **Maps**: Mapbox GL 3.16.0
- **Email**: SendGrid 8.1.6, Resend 6.4.2
- **SMS**: Twilio 5.10.5
- **Automation**: N8N (self-hosted)
- **Real-time**: Socket.io 4.8.1, Supabase Realtime
- **Analytics**: PostHog 5.11.2
- **Monitoring**: Sentry 10.25.0
- **IPFS**: Pinata SDK 2.1.0

### Development & Testing
- **Testing**: Jest 30.2.0, Playwright 1.56.1, Testing Library
- **Linting**: ESLint 9 with Next.js config
- **Build**: Babel React Compiler 1.0.0

---

## 🎨 GHXSTSHIP Design System

### Design Philosophy
**Contemporary Minimal Pop Art Aesthetic** - Monochromatic base with strategic color gradients for platform branding.

### Core Principles
1. **Monochromatic Base**: Black (#000000), white (#FFFFFF), greyscale only
2. **Atomic Design**: Composable components from atoms to templates
3. **Typography-First**: Custom font hierarchy with responsive scaling
4. **Hard Shadows**: Geometric shadows (shadow-hard), not soft
5. **Platform Gradients**: Text-only gradients for brand identity

### Typography Hierarchy
- **ANTON**: Hero headlines and display text (H1)
- **BEBAS NEUE**: Section headers (H2-H6)
- **SHARE TECH**: Body copy and paragraphs
- **SHARE TECH MONO**: Metadata, labels, captions

### Component Library

#### Atoms (27 components)
Button, Input, Select, Textarea, Checkbox, Radio, Switch, Label, Card, Badge, Avatar, Separator, Spinner, Tooltip, IconButton, Typography components (HeroTitle, SectionHeader, BodyText, etc.)

#### Molecules (23 components)
FormField, SearchBar, Breadcrumb, Tabs, Accordion, Alert, Toast, Pagination, EmptyState, LoadingState

#### Organisms (22 components)
Sidebar, Navbar, Toolbar, ActionDrawer, ModalForm, FilterPanel, CommandPalette, DataTable, KanbanBoard, GanttChart

#### Templates (20 layouts)
DashboardLayout, ContentLayout, GvtewayLayout, CompvssLayout, AtlvsLayout, platform-specific page templates

---

## 🗄️ Database Architecture (88 Models)

### Shared Models (10)
User, Session, Account, DigitalWallet, CryptoWallet, Wallet, Credential, Organization, OrganizationMember, Role, Permission, AuditLog, NotificationPreferences, ApiKey, AnalyticsData, ImpersonationSession

### GVTEWAY Models (25)
**Events**: Event, EventCategory, Venue, Artist, EventArtist  
**Ticketing**: Ticket, TicketType, NFTTicket, WalletPass, Order, OrderItem, Invoice  
**Commerce**: Product, Cart, CartItem, Marketplace  
**Social**: SocialPost, SocialComment, SocialLike, Follow, Friendship  
**Adventures**: Adventure, AdventureBooking  
**Memberships**: Membership, MembershipTier, LoyaltyPoints  
**Engagement**: Wishlist, Alert, Notification

### COMPVSS Models (22)
**Team Management**: CompvssUser, CompvssTeam, CompvssRole, TeamMember  
**Production Advancing**: AdvancingRequest, AdvancingApprover, AdvancingResult  
**9 Submission Types**: AccessCredentials, SiteInfrastructure, SiteAssets, SiteUtilities, SiteVehicles, HeavyEquipment, TechnicalProduction, Hospitality, TravelLogistics  
**Operations**: DayOfShowTask, IssueReport, ExpenseReport, CheckIn  
**Business**: AffiliateProfile, ReferralLink, QRCode

### ATLVS Models (25)
**Projects**: Project, ProjectPhase, Milestone, Task, TaskDependency  
**Teams**: Team, TeamMember, Schedule, TimeEntry  
**Budgets**: Budget, BudgetCategory, Expense  
**Assets**: Equipment, EquipmentBooking, Vehicle, MaintenanceLog  
**Documents**: Document, DocumentVersion, DocumentShare, DocumentActivity, Contract  
**Vendors**: Vendor, VendorContract  
**Analytics**: Report, Dashboard, Widget

### N8N Models (8)
N8NInstance, N8NWorkflow, N8NExecution, N8NCredential, N8NTrigger, N8NWebhook, N8NNode, N8NTemplate

### Additional Models
**Opportunities**: Opportunity, OpportunityApplication, OpportunityCategory  
**Catalog**: CatalogCategory, CatalogSubcategory, CatalogItem  
**Toggles**: OrganizationCatalogToggle, ProjectCatalogToggle, TeamCatalogToggle  
**Tokens**: EmailVerificationToken, PasswordResetToken

### Key Database Features
- **150+ Relationships**: Foreign key constraints
- **100+ Indexes**: Optimized query performance
- **20+ Enums**: Type-safe enumerations
- **50+ JSON Fields**: Flexible schema
- **Row-Level Security**: Supabase RLS policies
- **Audit Logging**: Complete change tracking
- **Soft Deletes**: Recoverable data

---

## 📱 Platform Features Summary

### GVTEWAY (60+ pages)
1. **Event Discovery** (8): Listing, detail, search, filters, categories, map, calendar
2. **Smart Ticketing** (8): Purchase, transfer, sell, checkout, QR codes, wallet integration
3. **Universal Wallet** (7): Dashboard, NFTs, credentials, loyalty, Apple/Google passes
4. **Marketplace** (6): Products, cart, checkout, orders, vendor management
5. **Social Hub** (8): Feed, profiles, posts, comments, following, messaging, notifications
6. **Adventures** (6): Listings, VIP packages, meet & greets, tours, bookings
7. **Memberships** (5): Tiers, benefits, loyalty rewards, exclusive content
8. **Analytics** (4): Dashboard, event history, spending insights, recommendations
9. **Wishlist & Alerts** (2): Saved events, price/availability notifications

### COMPVSS (55+ pages)
1. **Team Onboarding** (5): Registration, profile, role assignment, verification
2. **Production Advancing** (15): 9 category submissions, dashboard, tracking, results
3. **Day-of-Show Operations** (6): Hub, check-in, tasks, schedule, map, contacts
4. **QR Management** (5): Hub, scan, generate, history, access control
5. **Issue Reporting** (5): Dashboard, create, track, assign, resolve
6. **Expense Reports** (6): Dashboard, submit, approve, reimburse, history
7. **Affiliate Management** (6): Dashboard, links, performance, commissions, payouts
8. **Referral System** (5): Dashboard, generate, track, rewards, leaderboard
9. **Credential Verification** (5): Vault, upload, verify, certifications, background checks

### ATLVS (80+ pages)
1. **Project Management** (9): List, create, detail, timeline, milestones, phases, files
2. **Task Management** (7): Kanban board, list, calendar, detail, time tracking
3. **Team Coordination** (8): Overview, members, roles, schedule, directory, availability
4. **Budget Tracking** (7): Overview, expenses, forecasting, variance, approvals, reports
5. **Asset Management** (7): Inventory, equipment, bookings, maintenance, vehicles, QR tracking
6. **Advancing Approvals** (9): Dashboard, queue, review, assign, results, analytics
7. **Document Hub** (7): Library, contracts, riders, permits, templates, versions
8. **N8N Automation** (9): Hub, workflows, editor, executions, templates, webhooks
9. **Vendor Management** (4): Directory, profiles, contracts, performance
10. **Analytics & Reporting** (7): Hub, project/budget/team analytics, custom reports

---

## 🔄 Production Advancing Workflow

### The Problem (Old Model)
```
GVTEWAY (Mixed Users) → Submit → ATLVS (Approve)
```
**Issue**: Consumers and vendors mixed together, unclear workflows

### The Solution (New Model)
```
COMPVSS (External Teams) → Submit → ATLVS (Internal) → Review → Approve → Assign → Notify
```

### 9 Advancing Categories

1. **Access & Credentials**
   - Badges, passes, parking permits
   - Security clearances
   - Credential types and levels

2. **Site Infrastructure**
   - Fencing, barriers, signage
   - Tents, structures, stages
   - Layout and site requirements

3. **Site Assets**
   - Tables, chairs, staging equipment
   - Decor, branding materials
   - General equipment needs

4. **Site Utilities**
   - Power, water, waste management
   - Internet, communications
   - HVAC requirements

5. **Site Vehicles**
   - Golf carts, shuttles
   - Forklifts, loaders
   - On-site transportation

6. **Heavy Equipment**
   - Cranes, lifts
   - Generators
   - Large machinery

7. **Technical Production**
   - Audio, video, lighting systems
   - Staging, rigging equipment
   - Broadcast and recording gear

8. **Hospitality**
   - Catering, beverages
   - Green rooms, lounges
   - Artist and VIP requirements

9. **Travel & Logistics**
   - Transportation arrangements
   - Accommodations
   - Shipping and freight

---

## 🤖 N8N Automation Integration

### Custom N8N Nodes (13+)

#### GVTEWAY Nodes
- **Event Trigger**: Fires on event creation/updates
- **Ticket Node**: Ticket operations and validation
- **Order Node**: Order processing and fulfillment
- **User Node**: User management and notifications
- **Credential Node**: Credential verification

#### ATLVS Nodes
- **Project Trigger**: Fires on project milestones
- **Task Node**: Task creation and assignment
- **Budget Node**: Budget tracking and alerts
- **Team Node**: Team coordination
- **Asset Node**: Asset management
- **Advancing Node**: Advancing request processing

#### Universal Nodes
- **Credential Node**: Cross-platform credential management
- **Cross-Platform Sync Node**: Data synchronization

### Workflow Templates (30+)
- Event creation automation
- Ticket sales notifications
- Order confirmation emails
- Advancing request routing
- Budget approval workflows
- Task assignment automation
- Team scheduling
- Report generation
- Data synchronization
- Payment processing
- Inventory updates
- And more...

---

## 🔐 Security & Compliance

### Authentication & Authorization
- **Multi-factor Authentication**: TOTP, SMS codes
- **OAuth Providers**: Google, Apple, GitHub
- **Web3 Wallets**: WalletConnect, MetaMask
- **JWT Tokens**: Secure, rotating tokens
- **Session Management**: Redis-backed sessions
- **Role-Based Access Control**: Fine-grained permissions

### Data Security
- **Row-Level Security (RLS)**: Supabase policies
- **Encryption at Rest**: Database encryption
- **Encryption in Transit**: TLS/SSL
- **API Rate Limiting**: DDoS protection
- **CSRF Protection**: Token-based
- **XSS Prevention**: Content sanitization
- **SQL Injection Prevention**: Parameterized queries

### Compliance
- **SOC 2 Ready**: Security controls in place
- **GDPR Compliant**: Data privacy measures
- **CCPA Ready**: California privacy compliance
- **PCI DSS**: Payment security via Stripe
- **Audit Logging**: Complete activity tracking
- **Data Retention**: Configurable policies

---

## 📊 Performance & Scalability

### Performance Targets
- **Uptime**: 99.9%
- **Page Load**: <2s (First Contentful Paint)
- **API Response**: <200ms (95th percentile)
- **Lighthouse Score**: 90+ (all metrics)
- **Core Web Vitals**: All green

### Optimization Strategies

#### Frontend
- Code splitting (route-based chunks)
- Image optimization (Next.js Image)
- Lazy loading (components and images)
- CDN (Cloudflare for static assets)
- Browser and service worker caching
- Gzip/Brotli compression

#### Backend
- Database indexing (100+ optimized indexes)
- Query optimization (Prisma)
- Redis caching (frequently accessed data)
- Connection pooling (Prisma)
- Background jobs (BullMQ for async)
- API rate limiting and throttling

#### Real-time
- WebSocket (Socket.io for live updates)
- Supabase Realtime (database subscriptions)
- Optimistic updates (instant UI feedback)

---

## 🚀 Deployment Architecture

### Infrastructure
- **Frontend**: Vercel (Next.js optimized)
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage + Cloudflare R2
- **Cache**: Upstash Redis (serverless)
- **N8N**: Self-hosted (Docker)

### Environments
- **Development**: Local development (`npm run dev`)
- **Staging**: Pre-production testing
- **Production**: Live environment

### CI/CD Pipeline
- **Version Control**: Git
- **CI**: GitHub Actions
- **Deployment**: Vercel automatic deployments
- **Database Migrations**: Prisma Migrate
- **Environment Variables**: Vercel environment management

### Monitoring & Observability
- **Error Tracking**: Sentry
- **Analytics**: PostHog
- **Logging**: Vercel logs
- **Uptime**: Vercel monitoring
- **Performance**: Vercel Analytics

---

## 📂 Project Structure

```
Grasshopper26.10/
├── src/
│   ├── app/                      # Next.js App Router (677 items)
│   │   ├── (gvteway)/           # GVTEWAY routes
│   │   ├── (compvss)/           # COMPVSS routes
│   │   ├── (atlvs)/             # ATLVS routes
│   │   └── api/                 # 145+ API endpoints
│   │
│   ├── components/              # Atomic design (104 items)
│   │   ├── atoms/              # 27 basic components
│   │   ├── molecules/          # 23 composite components
│   │   ├── organisms/          # 22 complex components
│   │   └── templates/          # 20 page layouts
│   │
│   ├── design-system/          # GHXSTSHIP design system
│   │
│   ├── lib/                    # Core libraries (574 items)
│   │   ├── services/           # 286 service modules
│   │   ├── integrations/       # External API integrations
│   │   ├── stores/             # Zustand state management
│   │   └── validations/        # Zod schemas
│   │
│   ├── hooks/                  # 80 custom React hooks
│   └── types/                  # TypeScript type definitions
│
├── prisma/
│   ├── schema.prisma           # 88 database models
│   ├── migrations/             # Database migrations
│   └── seeds/                  # Seed data
│
├── docs/                       # 136 documentation files
├── scripts/                    # 186 utility scripts
├── tests/                      # Unit, integration, E2E tests
├── n8n/                        # 55 workflow files
└── supabase/                   # 74 configuration files
```

---

## 🎯 Current Status

### ✅ Completed (30%)
- Foundation & setup (100%)
- Design system (100%)
- Core pages (100%)
- Documentation (100%)
- Database schema (100%)
- Component library (100%)

### 🚧 In Progress
- API implementation
- Authentication flows
- Feature development

### 📋 Pending
- GVTEWAY platform features
- COMPVSS platform features
- ATLVS platform features
- N8N integration
- Testing & QA
- Production deployment

---

## 👥 User Personas

### GVTEWAY Users
- **Concert Goer**: Discovers events, buys tickets
- **Festival Fan**: Follows artists, collects NFTs
- **VIP Member**: Exclusive access, premium experiences
- **Merchandise Buyer**: Shops official gear

### COMPVSS Users
- **Production Crew**: Submits advancing, tracks tasks
- **Event Staff**: Checks in, reports issues
- **Media**: Verifies credentials, uploads content
- **Sponsor Rep**: Manages activation, tracks ROI
- **Affiliate**: Generates referrals, earns commissions
- **Government Official**: Inspects, approves permits

### ATLVS Users
- **Event Producer**: Plans events, manages teams
- **Production Manager**: Approves advancing, assigns resources
- **Budget Manager**: Tracks expenses, approves purchases
- **Operations Director**: Monitors day-of-show, resolves issues
- **System Admin**: Manages users, configures workflows

---

## 🔗 Integration Ecosystem

### Payment Processing
- Stripe Connect (multi-party payments)
- Apple Pay, Google Pay
- Cryptocurrency (Web3 wallets)

### Communication
- SendGrid (transactional emails)
- Resend (marketing emails)
- Twilio (SMS notifications)
- Firebase (push notifications)
- Socket.io (real-time messaging)

### Storage & Media
- Supabase Storage (file storage)
- Cloudflare R2 (CDN storage)
- IPFS/Pinata (NFT metadata)
- Mapbox (maps and geocoding)

### Analytics & Monitoring
- PostHog (product analytics)
- Sentry (error tracking)
- Vercel Analytics (performance)
- Google Analytics (web analytics)

### Blockchain & Web3
- Ethereum (NFT minting)
- Polygon (low-cost transactions)
- WalletConnect (wallet integration)
- Ethers.js (blockchain interaction)

### Automation
- N8N (workflow automation)
- BullMQ (job queues)
- Prisma (database ORM)
- Supabase Realtime (live updates)

---

## 📚 Documentation

### Key Documents
- `README.md` - Project overview
- `SETUP_GUIDE.md` - Setup instructions
- `docs/architecture/ATOMIC_DESIGN_SYSTEM.md` - Component library
- `docs/architecture/THREE_PLATFORM_SUMMARY.md` - Platform details
- `docs/guides/MASTER_SITEMAP.md` - Complete sitemap
- `docs/GHXSTSHIP_DESIGN_SYSTEM.md` - Design system rules

### Documentation Structure
- **Architecture**: System design, patterns, decisions
- **Guides**: User guides, development workflows
- **API**: API documentation and reference
- **Sessions**: Development session notes

---

## 🔧 Development Commands

```bash
# Development
npm run dev                    # Start dev server
npm run build                  # Build for production
npm run start                  # Start production server

# Database
npm run db:generate            # Generate Prisma client
npm run db:push                # Push schema to database
npm run db:migrate             # Create migration
npm run db:seed                # Seed with test data
npm run db:studio              # Open Prisma Studio GUI
npm run db:reset               # Reset database

# Testing
npm run test                   # Run unit tests
npm run test:watch             # Watch mode
npm run test:coverage          # Coverage report
npm run test:e2e               # E2E tests (Playwright)
npm run test:e2e:ui            # E2E with UI
npm run test:all               # All tests

# Design System
npm run atomic:validate        # Validate atomic design
npm run design:enforce         # Enforce GHXSTSHIP rules
npm run design:check           # Check design violations

# Linting
npm run lint                   # Run ESLint
```

---

## 🎯 Success Metrics

### GVTEWAY
- Monthly active users
- Ticket sales volume
- NFT minting rate
- Social engagement
- Marketplace GMV

### COMPVSS
- Onboarding completion rate
- Advancing submission time
- Issue resolution time
- Affiliate conversion rate
- Day-of-show efficiency

### ATLVS
- Project completion rate
- Advancing approval time
- Budget variance
- Automation adoption
- Team productivity

---

## 🔗 Quick Links

- **Development**: http://localhost:3000
- **Database Studio**: `npm run db:studio`
- **Documentation**: `/docs` directory
- **Design System**: `/src/design-system`
- **Components**: `/src/components`
- **API Routes**: `/src/app/api`

---

**Built with GHXSTSHIP precision ⚓️**
