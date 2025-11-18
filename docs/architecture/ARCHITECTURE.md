# GVTEWAY + ATLVS: Architecture Documentation

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│  Next.js 14+ (App Router)                                       │
│  ├── GVTEWAY Routes (Consumer)                                  │
│  ├── ATLVS Routes (Production)                                  │
│  └── Shared Components (Atomic Design)                          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                           │
├─────────────────────────────────────────────────────────────────┤
│  API Routes (Next.js)                                           │
│  ├── Authentication (NextAuth.js)                               │
│  ├── GVTEWAY APIs (Events, Tickets, Commerce)                  │
│  ├── ATLVS APIs (Projects, Teams, Budgets)                     │
│  ├── Production Advancing APIs                                  │
│  └── N8N Integration APIs                                       │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                        DATA LAYER                                │
├─────────────────────────────────────────────────────────────────┤
│  Supabase (PostgreSQL)                                          │
│  ├── 70+ Database Models                                        │
│  ├── Row-Level Security (RLS)                                   │
│  ├── Real-time Subscriptions                                    │
│  └── Prisma ORM                                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    INTEGRATION LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│  ├── Stripe Connect (Payments)                                  │
│  ├── WalletConnect (Crypto Wallets)                            │
│  ├── Apple/Google Wallet (Digital Passes)                      │
│  ├── Mapbox (Maps & Location)                                  │
│  ├── N8N (Workflow Automation)                                 │
│  ├── SendGrid (Email)                                           │
│  ├── Twilio (SMS)                                               │
│  └── Socket.io (Real-time)                                      │
└─────────────────────────────────────────────────────────────────┘
```

## Design System Architecture

### Atomic Design Hierarchy

```
Atoms (Basic Building Blocks)
├── Button (GVTEWAY/ATLVS variants)
├── Input
├── Badge
├── Card
├── Typography
└── Icons

Molecules (Composite Components)
├── FormField (Input + Label + Error)
├── NavItem (Icon + Text + Badge)
├── FeatureCard (Icon + Title + Description)
└── StatDisplay (Number + Label)

Organisms (Complex Components)
├── Navigation (Logo + NavItems + Actions)
├── HeroSection (Title + Subtitle + CTAs)
├── FeatureGrid (Multiple FeatureCards)
└── EventCard (Image + Details + Actions)

Templates (Page Layouts)
├── GVTEWAYLayout (Consumer-focused)
├── ATLVSLayout (Production-focused)
└── DashboardLayout (Data-heavy)

Pages (Full Pages)
├── Home (Landing)
├── GVTEWAY (Platform Overview)
├── ATLVS (Platform Overview)
└── Feature Pages
```

## Database Architecture

### Multi-Tenancy Strategy

```sql
-- All tables include organization_id for RLS
CREATE POLICY "Users can only access their organization data"
ON events
FOR ALL
USING (organization_id = current_user_organization());
```

### Key Schema Groups

**1. Authentication & Users**
- User
- DigitalWallet
- CryptoWallet
- Credential

**2. GVTEWAY Platform**
- Organization
- Event
- Ticket
- Order
- WalletPass
- NFTTicket
- Adventure
- Store
- Product
- SocialPost

**3. ATLVS Platform**
- AtlvsOrganization
- Project
- Task
- Team
- Equipment
- Budget
- Expense
- Vendor

**4. N8N Integration**
- N8NInstance
- N8NWorkflow
- N8NExecution
- N8NCredential
- N8NTrigger

**5. Production Advancing**
- AdvancingRequest
- AdvancingApprover
- AdvancingResult
- 9 Category Submissions:
  - AccessSubmission
  - InfrastructureSubmission
  - AssetSubmission
  - UtilitySubmission
  - VehicleSubmission
  - EquipmentSubmission
  - TechnicalSubmission
  - HospitalitySubmission
  - TravelSubmission

## API Architecture

### RESTful API Structure

```
/api/
├── auth/
│   ├── [...nextauth]/route.ts
│   ├── register/route.ts
│   └── verify/route.ts
│
├── gvteway/
│   ├── events/
│   │   ├── route.ts (GET, POST)
│   │   └── [id]/route.ts (GET, PUT, DELETE)
│   ├── tickets/
│   ├── orders/
│   └── marketplace/
│
├── atlvs/
│   ├── projects/
│   ├── tasks/
│   ├── teams/
│   └── budgets/
│
├── advancing/
│   ├── requests/
│   ├── approvals/
│   └── results/
│
└── n8n/
    ├── workflows/
    ├── executions/
    └── webhooks/
```

## State Management

### Zustand Stores

```typescript
// Global stores
- useAuthStore (user, session, tokens)
- useUIStore (theme, modals, toasts)
- useCartStore (shopping cart)

// GVTEWAY stores
- useEventStore (events, filters)
- useTicketStore (tickets, selections)

// ATLVS stores
- useProjectStore (projects, tasks)
- useTeamStore (teams, members)
```

## Real-time Architecture

### Supabase Realtime Channels

```typescript
// Event updates
supabase
  .channel('events')
  .on('postgres_changes', { 
    event: '*', 
    schema: 'public', 
    table: 'events' 
  }, handleEventChange)
  .subscribe()

// Task updates
supabase
  .channel('tasks')
  .on('postgres_changes', { 
    event: '*', 
    schema: 'public', 
    table: 'tasks' 
  }, handleTaskChange)
  .subscribe()
```

### Socket.io Events

```typescript
// Real-time collaboration
socket.on('project:update', handleProjectUpdate)
socket.on('task:assigned', handleTaskAssigned)
socket.on('budget:alert', handleBudgetAlert)
```

## Authentication Flow

```
User Login
    ↓
NextAuth.js
    ↓
Supabase Auth
    ↓
JWT Token
    ↓
Session Storage
    ↓
Protected Routes
```

### Wallet Authentication

```
Connect Wallet
    ↓
WalletConnect
    ↓
Sign Message
    ↓
Verify Signature
    ↓
Link to User Account
```

## Payment Flow

```
User Checkout
    ↓
Stripe Payment Intent
    ↓
Payment Processing
    ↓
Webhook Confirmation
    ↓
Order Creation
    ↓
Ticket Generation
    ↓
Wallet Pass Creation
```

## N8N Integration Flow

```
Event Trigger
    ↓
Webhook to N8N
    ↓
Workflow Execution
    ↓
Custom Node Processing
    ↓
External API Calls
    ↓
Result Callback
    ↓
Database Update
```

## Production Advancing Flow

```
GVTEWAY: Vendor Submission
    ↓
AdvancingRequest Created
    ↓
N8N Workflow Triggered
    ↓
ATLVS: Approval Queue
    ↓
Production Manager Review
    ↓
Resource Assignment
    ↓
AdvancingResult Created
    ↓
N8N Notification Workflow
    ↓
GVTEWAY: Dashboard Update
    ↓
Stakeholder Notifications
```

## Deployment Architecture

### Vercel (Frontend + API)
```
- Next.js Application
- Edge Functions
- Serverless Functions
- Static Assets (CDN)
```

### Supabase (Database + Auth + Storage)
```
- PostgreSQL Database
- Authentication Service
- File Storage
- Real-time Subscriptions
```

### N8N (Self-hosted)
```
- Docker Container
- PostgreSQL (shared or separate)
- Redis (queue management)
- Custom Nodes
```

### Cloudflare (CDN + Security)
```
- Global CDN
- DDoS Protection
- WAF Rules
- Rate Limiting
```

## Security Architecture

### Authentication
- JWT tokens with refresh rotation
- Multi-factor authentication (MFA)
- OAuth providers (Google, Apple, GitHub)
- Wallet-based authentication

### Authorization
- Role-based access control (RBAC)
- Row-level security (RLS)
- Organization-scoped data
- API key management

### Data Protection
- Encryption at rest (AES-256)
- Encryption in transit (TLS 1.3)
- Encrypted credentials
- Secure environment variables

### Compliance
- GDPR data handling
- CCPA compliance
- SOC 2 controls
- Audit logging

## Performance Optimization

### Frontend
- Server-side rendering (SSR)
- Static site generation (SSG)
- Image optimization (Next.js Image)
- Code splitting
- Lazy loading
- Service workers (PWA)

### Backend
- Database indexing
- Query optimization
- Connection pooling
- Redis caching
- CDN for static assets

### Monitoring
- Vercel Analytics
- Sentry error tracking
- PostHog product analytics
- Custom performance metrics

## Scalability Considerations

### Horizontal Scaling
- Serverless functions (auto-scale)
- Database read replicas
- CDN edge locations
- Load balancing

### Vertical Scaling
- Database connection limits
- Memory optimization
- CPU utilization
- Storage capacity

### Data Partitioning
- Organization-based sharding
- Time-based partitioning
- Geographic distribution

---

**Built with GHXSTSHIP precision ⚓️**
