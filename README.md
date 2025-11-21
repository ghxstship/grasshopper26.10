# GVTEWAY + COMPVSS + ATLVS: Universal Event Ecosystem

> **Built with GHXSTSHIP precision ⚓️**

A comprehensive, enterprise-grade three-platform ecosystem connecting consumers, external teams, and internal production management.

## 🚀 CURRENT STATUS: Phase 2 - Database Complete (50%)

**Agent 1 Progress:** Database schema and foundation ✅  
**Next Steps:** Supabase setup and authentication implementation

📖 **Quick Start:** See [docs/guides/SETUP_GUIDE.md](./docs/guides/SETUP_GUIDE.md) for deployment instructions  
📚 **Documentation:** See [docs/](./docs/) for all documentation  
🏗️ **Architecture:** See [docs/architecture/](./docs/architecture/) for system design  
📋 **API Reference:** See [docs/api/](./docs/api/) for API documentation

## 🎯 Project Overview

### GVTEWAY (Consumer Platform)
Consumer-facing membership experiences platform for:
- Event discovery & ticketing
- NFT & digital wallet integration
- Social engagement & commerce
- Adventures & VIP experiences
- Universal credentialing

### COMPVSS (External Teams Platform)
Professional platform for external collaborators and day-of-show operations:
- Production crew onboarding
- Production advancing submissions (9 categories)
- Day-of-show operations & dashboards
- QR code management & scanning
- Affiliate & referral management
- Issue reporting & expense tracking

### ATLVS (Internal Production Platform)
B2B event production management platform for internal teams:
- Project & team management
- Budget & asset tracking
- Production advancing approvals
- Native N8N workflow automation
- Real-time collaboration

## 🎨 Design System

### Typography
- **Title/H1**: Anton
- **H2-H6**: Bebas Neue
- **Subtitle**: Oswald
- **Body**: Share Tech
- **Mono**: Share Tech Mono

### Color Palette

**GVTEWAY (Primary Accents)**
- Red: `#FF0000`
- Yellow: `#FFD700`
- Blue: `#0066FF`

**COMPVSS (Tertiary Accents)**
- Cyan: `#00FFFF`
- Teal: `#00CED1`
- Indigo: `#4B0082`

**ATLVS (Secondary Accents)**
- Green: `#00FF00`
- Orange: `#FF8800`
- Purple: `#8800FF`

**Base**: Black/White + Grayscale

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js 14+ (App Router, Server Components)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + Custom Design System
- **Components**: Atomic Design (shadcn/ui inspired)
- **Animation**: Framer Motion
- **State**: Zustand
- **Forms**: React Hook Form + Zod

### Backend
- **Database**: Supabase (PostgreSQL)
- **ORM**: Prisma
- **Auth**: NextAuth.js v5
- **Payments**: Stripe Connect
- **Storage**: Supabase Storage + Cloudflare CDN

### Integrations
- **Wallets**: WalletConnect, Apple Wallet, Google Wallet
- **Maps**: Mapbox
- **Automation**: N8N (self-hosted)
- **Real-time**: Socket.io, Supabase Realtime

## 🗄️ Database Schema

**112 Models Across 6 Categories:**

- **Shared (14):** User, Session, Wallets, Credentials, Organizations, Roles, AuditLog, NotificationPreferences
- **Global Catalog (6):** CatalogCategory, CatalogSubcategory, CatalogItem, OrganizationCatalogToggle, ProjectCatalogToggle, TeamCatalogToggle
- **GVTEWAY (25):** Events, Tickets, NFTs, Social, Marketplace, Adventures
- **COMPVSS (22):** Teams, Advancing (9 types), Day-of-Show, QR Codes
- **ATLVS (25):** Projects, Tasks, Budgets, Assets, Documents, Teams
- **N8N (8):** Workflows, Executions, Triggers, Templates

**Key Features:**
- 150+ relationships with foreign keys
- 100+ indexes for performance
- 20+ enums for type safety
- 50+ JSON fields for flexibility
- Full audit logging

**Database Commands:**
```bash
npm run db:generate    # Generate Prisma client
npm run db:push        # Push schema to database
npm run db:migrate     # Create migration
npm run db:seed        # Seed with test data
npm run db:studio      # Open Prisma Studio GUI
npm run db:reset       # Reset database
```

## 📦 Installation

```bash
# Clone the repository
git clone <repository-url>
cd Grasshopper26.10

# Install dependencies
npm install

# Set up environment variables
cp .env.local .env.local
# Edit .env.local with your Supabase credentials

# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed database with test data
npm run db:seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

**📖 For detailed setup instructions, see [docs/guides/SETUP_GUIDE.md](./docs/guides/SETUP_GUIDE.md)**

## 🏗️ Project Structure

```
├── .archive/              # Historical reports and old documentation
│   ├── build-logs/       # Build and lint logs
│   ├── old-docs/         # Archived documentation
│   ├── old-scripts/      # Deprecated scripts
│   └── reports/          # Historical validation reports
├── .github/              # GitHub workflows and CI/CD
├── contracts/            # Smart contracts (Solidity)
├── docs/                 # Current documentation
│   ├── api/             # API documentation and OpenAPI specs
│   ├── architecture/    # System architecture and design docs
│   └── guides/          # Setup and user guides
├── e2e/                  # End-to-end tests (Playwright)
├── n8n/                  # N8N workflow automation
├── prisma/               # Database schema and migrations
├── public/               # Static assets
├── scripts/              # Build and utility scripts
├── src/                  # Application source code
│   ├── app/             # Next.js App Router
│   │   ├── (gvteway)/  # GVTEWAY platform routes
│   │   ├── (compvss)/  # COMPVSS platform routes
│   │   ├── (atlvs)/    # ATLVS platform routes
│   │   └── api/        # API routes
│   ├── components/      # React components (Atomic Design)
│   │   ├── atoms/      # Basic building blocks
│   │   ├── molecules/  # Composite components
│   │   ├── organisms/  # Complex components
│   │   └── templates/  # Page templates
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions
│   ├── store/           # Zustand stores
│   └── types/           # TypeScript types
├── supabase/             # Supabase functions and migrations
└── tests/                # Unit and integration tests
```

## 🎨 Atomic Design System

### Atoms
- Button (GVTEWAY/ATLVS variants)
- Input
- Badge
- Card
- Typography components

### Molecules
- Form fields
- Navigation items
- Feature cards
- Stat displays

### Organisms
- Navigation bars
- Hero sections
- Feature grids
- Forms

## 🗄️ Database Schema

**70+ Models** covering:
- User authentication & profiles
- Events & ticketing
- Projects & tasks
- Teams & resources
- Budgets & expenses
- N8N workflows
- Production advancing (9 categories)

## 🔐 Environment Variables

```env
# Database
DATABASE_URL=
DIRECT_URL=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Auth
NEXTAUTH_URL=
NEXTAUTH_SECRET=

# Stripe
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Mapbox
NEXT_PUBLIC_MAPBOX_TOKEN=

# N8N
N8N_URL=
N8N_API_KEY=
```

## 📱 Features

### GVTEWAY (9 Modules)
1. Event Discovery
2. Smart Ticketing
3. Marketplace
4. Social Hub
5. Adventures
6. Universal Wallet
7. Memberships
8. Analytics
9. Wishlist & Alerts

### COMPVSS (9 Core Features)
1. Team Onboarding
2. Production Advancing Submissions
3. Day-of-Show Operations
4. QR Code Management
5. Issue Reporting
6. Expense Reports
7. Affiliate Management
8. Referral System
9. Credential Verification

### ATLVS (6 Core + N8N)
1. Project Management
2. Team Coordination
3. Budget Tracking
4. Asset Management
5. Production Advancing Approvals
6. Document Hub
7. N8N Automation

### Production Advancing (9 Categories - COMPVSS to ATLVS)
1. Access & Credentials
2. Site Infrastructure
3. Site Assets
4. Site Utilities
5. Site Vehicles
6. Heavy Equipment
7. Technical Production
8. Hospitality
9. Travel & Logistics

## 🚢 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

### Docker
```bash
docker build -t grasshopper .
docker run -p 3000:3000 grasshopper
```

## 📊 Performance Targets

- **Uptime**: 99.9%
- **Page Load**: <2s
- **API Response**: <200ms
- **Lighthouse Score**: 90+

## 🔒 Security

- SOC 2 Ready
- GDPR Compliant
- CCPA Ready
- Row-Level Security (RLS)
- Encrypted credentials
- Rate limiting
- Audit logging

## 🤝 Contributing

This is an enterprise project. Contributions should follow:
- Atomic design principles
- TypeScript strict mode
- Mobile-first responsive design
- Accessibility standards (WCAG 2.1)

## 📄 License

Proprietary - All rights reserved

## 🙏 Acknowledgments

- Design inspiration: browserbase.com, posh.vip, tixr.com
- Built with industry best practices
- Enterprise-grade architecture

---

**Built with GHXSTSHIP precision ⚓️**
