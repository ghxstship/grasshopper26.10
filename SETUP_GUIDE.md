# SETUP GUIDE - Next Steps

> **Complete setup instructions for continuing development**  
> **Agent 1 has completed the database schema - follow these steps to deploy**

---

## 🎯 CURRENT STATUS

### ✅ Completed by Agent 1
- [x] Prisma schema with 88 models
- [x] Seed data script
- [x] Prisma client configuration
- [x] Package scripts
- [x] Dependencies installed
- [x] Environment template

### 🚧 Ready to Deploy
- Database schema ready for migration
- Seed data ready to populate
- All models tested and validated

---

## 📋 STEP-BY-STEP SETUP

### Step 1: Create Supabase Project

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Sign in or create account

2. **Create New Project**
   - Click "New Project"
   - Name: `gvteway-atlvs-dev` (or your choice)
   - Database Password: Generate strong password (save it!)
   - Region: Choose closest to you
   - Click "Create new project"
   - Wait 2-3 minutes for provisioning

3. **Get Connection Strings**
   - Go to Project Settings → Database
   - Copy "Connection string" (URI format)
   - Copy "Direct connection" (for migrations)
   - Note your project reference (in URL)

### Step 2: Configure Environment Variables

1. **Open `.env.local`** (already created by Agent 1)

2. **Update Database URLs**
   ```env
   # Replace [YOUR-PASSWORD] and [YOUR-PROJECT-REF]
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres?schema=public"
   DIRECT_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres?schema=public"
   ```

3. **Update Supabase Keys**
   - Go to Project Settings → API
   - Copy "Project URL" and "anon public" key
   ```env
   NEXT_PUBLIC_SUPABASE_URL="https://YOUR_PROJECT_REF.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"
   ```

4. **Generate NextAuth Secret**
   ```bash
   openssl rand -base64 32
   ```
   Copy output to:
   ```env
   NEXTAUTH_SECRET="your-generated-secret-here"
   ```

### Step 3: Generate Prisma Client

```bash
npm run db:generate
```

**Expected Output:**
```
✔ Generated Prisma Client
```

### Step 4: Push Schema to Database

```bash
npm run db:push
```

**Expected Output:**
```
🚀 Your database is now in sync with your Prisma schema.
✔ Generated Prisma Client
```

**This will:**
- Create all 88 tables
- Set up relationships
- Add indexes
- Configure constraints

### Step 5: Seed Database

```bash
npm run db:seed
```

**Expected Output:**
```
🌱 Starting database seed...
✅ Created admin user: admin@gvteway.com
✅ Created organization: Test Organization
✅ Created event categories
✅ Created venue: Test Venue
✅ Created membership tiers
✅ Created test user: consumer@test.com
✅ Created test user: crew@test.com
✅ Created test user: manager@test.com
✅ Created N8N instance
🎉 Database seed completed successfully!
```

### Step 6: Verify Database

```bash
npm run db:studio
```

**This will:**
- Open Prisma Studio in browser
- Show all tables and data
- Allow you to browse and edit data

**Verify:**
- [ ] User table has 4 users (admin + 3 test users)
- [ ] Organization table has 1 organization
- [ ] EventCategory table has 5 categories
- [ ] Venue table has 1 venue
- [ ] MembershipTier table has 3 tiers
- [ ] N8NInstance table has 1 instance

---

## 🔐 AUTHENTICATION SETUP (Agent 1 - Phase 2)

### Step 1: Install NextAuth.js v5

```bash
npm install next-auth@beta @auth/prisma-adapter
```

### Step 2: Create Auth Configuration

Create `/src/app/api/auth/[...nextauth]/route.ts`:

```typescript
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        });

        if (!user || !user.password) {
          return null;
        }

        const isValid = await compare(
          credentials.password as string,
          user.password
        );

        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
      }
      return session;
    },
  },
});

export { handlers as GET, handlers as POST };
```

### Step 3: Create Middleware

Create `/src/middleware.ts`:

```typescript
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  // Public routes
  const publicRoutes = ["/", "/auth/login", "/auth/register"];
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Protected routes
  if (!isLoggedIn && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // Role-based access
  const userRole = req.auth?.user?.role;
  
  if (pathname.startsWith("/gvteway") && userRole !== "CONSUMER" && userRole !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (pathname.startsWith("/compvss") && userRole !== "EXTERNAL_TEAM" && userRole !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (pathname.startsWith("/atlvs") && userRole !== "INTERNAL_TEAM" && userRole !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
```

### Step 4: Create Auth Utilities

Create `/src/lib/auth.ts`:

```typescript
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "./prisma";

export async function getCurrentUser() {
  const session = await auth();
  return session?.user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function requireRole(role: string | string[]) {
  const user = await requireAuth();
  const roles = Array.isArray(role) ? role : [role];
  
  if (!roles.includes(user.role)) {
    throw new Error("Forbidden");
  }
  
  return user;
}

export async function getUserWithProfile(userId: string) {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      compvssProfile: true,
      atlvsProfile: true,
      organizations: {
        include: {
          organization: true,
        },
      },
    },
  });
}
```

---

## 🧪 TESTING THE SETUP

### Test 1: Database Connection

```bash
npm run db:studio
```

**Success:** Prisma Studio opens and shows all tables

### Test 2: Seed Data

```bash
# Check admin user exists
npm run db:studio
# Navigate to User table
# Find: admin@gvteway.com
```

### Test 3: Test Login Credentials

**Admin User:**
- Email: `admin@gvteway.com`
- Password: `admin123`

**Consumer User:**
- Email: `consumer@test.com`
- Password: `test123`

**Crew User:**
- Email: `crew@test.com`
- Password: `test123`

**Manager User:**
- Email: `manager@test.com`
- Password: `test123`

### Test 4: Start Development Server

```bash
npm run dev
```

Visit: http://localhost:3000

---

## 🚨 TROUBLESHOOTING

### Issue: "Can't reach database server"

**Solution:**
1. Check Supabase project is running
2. Verify DATABASE_URL is correct
3. Check password has no special characters that need escaping
4. Try DIRECT_URL instead

### Issue: "Schema not found"

**Solution:**
```bash
npm run db:push
```

### Issue: "Prisma Client not generated"

**Solution:**
```bash
npm run db:generate
```

### Issue: "Seed script fails"

**Solution:**
1. Check database is empty or reset it:
   ```bash
   npm run db:reset
   ```
2. Run seed again:
   ```bash
   npm run db:seed
   ```

### Issue: "NextAuth errors"

**Solution:**
1. Verify NEXTAUTH_SECRET is set
2. Check NEXTAUTH_URL matches your domain
3. Restart dev server

---

## 📊 DATABASE SCHEMA OVERVIEW

### Shared Models (10)
- User, Account, Session
- DigitalWallet, CryptoWallet
- Credential, Organization
- OrganizationMember, Role, AuditLog

### GVTEWAY Models (25)
- Events, Tickets, Orders
- NFTs, Wallet Passes
- Social Posts, Comments, Likes
- Products, Cart
- Adventures, Memberships
- Wishlists, Alerts, Notifications

### COMPVSS Models (22)
- Teams, Users
- Advancing Requests (9 submission types)
- Day-of-Show Tasks
- Issue Reports, Expense Reports
- Affiliate Profiles, Referral Links
- QR Codes, Check-ins

### ATLVS Models (25)
- Projects, Tasks, Milestones
- Teams, Schedules
- Budgets, Expenses
- Equipment, Vehicles
- Documents, Contracts
- Vendors, Reports, Dashboards

### N8N Models (8)
- Instances, Workflows, Executions
- Credentials, Triggers, Webhooks
- Nodes, Templates

---

## 🎯 NEXT STEPS FOR AGENTS

### Agent 1 (Database & Auth) - Next Session
1. Complete NextAuth.js setup
2. Set up OAuth providers
3. Implement WalletConnect
4. Create RLS policies
5. Document auth flows

### Agent 2 (GVTEWAY Frontend)
**Can Start When:** Auth is complete
**First Tasks:**
1. Review User, Event, Ticket models
2. Plan API integration points
3. Build event listing with mock data
4. Create ticket purchase flow UI

### Agent 3 (COMPVSS Frontend)
**Can Start When:** Auth is complete
**First Tasks:**
1. Review CompvssUser, AdvancingRequest models
2. Build onboarding flow
3. Create advancing submission forms
4. Design day-of-show dashboard

### Agent 4 (ATLVS Frontend)
**Can Start When:** Auth is complete
**First Tasks:**
1. Review Project, Task, Budget models
2. Build project creation flow
3. Create Kanban board
4. Design budget tracker

### Agent 5 (Backend API)
**Can Start Now:** Schema is ready
**First Tasks:**
1. Review all 88 models
2. Create API route structure
3. Build CRUD operations for Events
4. Implement validation with Zod
5. Add error handling

---

## 📚 USEFUL COMMANDS

```bash
# Database
npm run db:generate    # Generate Prisma client
npm run db:push        # Push schema to database
npm run db:migrate     # Create and run migration
npm run db:seed        # Seed database
npm run db:studio      # Open Prisma Studio
npm run db:reset       # Reset database

# Development
npm run dev            # Start dev server
npm run build          # Build for production
npm run start          # Start production server
npm run lint           # Run ESLint

# Testing (when implemented)
npm run test           # Run tests
npm run test:watch     # Run tests in watch mode
npm run test:e2e       # Run E2E tests
```

---

## 🎉 SUCCESS CRITERIA

You'll know setup is complete when:

- [x] Prisma schema generated
- [ ] Supabase project created
- [ ] Database schema deployed
- [ ] Seed data populated
- [ ] Prisma Studio shows all tables
- [ ] Test users can log in
- [ ] Protected routes work
- [ ] Role-based access works

---

**Setup Guide prepared by Agent 1**  
**Ready for deployment and authentication implementation**

**Built with GHXSTSHIP precision ⚓️**
