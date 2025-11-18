# Organizational Catalog Implementation

## Overview

A comprehensive hierarchical catalog of teams and positions has been created for standardized team organization, reporting, and analytics across all applications (GVTEWAY, COMPVSS, ATLVS).

## Implementation Status

### ✅ Completed

1. **Data Structure** - `prisma/seeds/organizational-hierarchy.ts`
   - 10 Departments (0000-9000)
   - 40+ Teams organized by department
   - 200+ Positions with metadata
   - Position levels, certifications, and alternate names

2. **Seed Script** - `prisma/seeds/seed-organizational-catalog.ts`
   - Idempotent upsert operations
   - Comprehensive logging
   - Error handling
   - Summary statistics

3. **Documentation**
   - Full guide: `docs/guides/ORGANIZATIONAL_HIERARCHY_GUIDE.md`
   - Quick reference: `docs/guides/ORGANIZATIONAL_HIERARCHY_QUICK_REFERENCE.md`
   - Seeds README: `prisma/seeds/README.md`

4. **NPM Script** - Added to `package.json`
   - `npm run db:seed:org` - Run organizational hierarchy seed

### ⏳ Pending

1. **Database Migration**
   - Catalog tables exist in schema but need migration
   - Run: `npx prisma migrate dev --name add_catalog_system`
   - Requires database to be running

2. **Seed Execution**
   - Run after migration: `npm run db:seed:org`
   - Will populate catalog with all departments, teams, and positions

3. **Integration Testing**
   - Test querying departments, teams, positions
   - Validate metadata structure
   - Test search functionality

## Department Structure

### 0000 - Executive
C-suite and executive leadership (1 team, 9 positions)

### 1000 - Creative
Creative design, content, and production (3 teams, 18 positions)
- Creative Direction
- Content Production
- Brand & Identity

### 2000 - Marketing
Marketing, advertising, and promotions (4 teams, 22 positions)
- Marketing Strategy
- Digital Marketing
- Public Relations
- Sponsorship

### 3000 - Talent
Artist relations, booking, and talent management (2 teams, 8 positions)
- Talent Buying
- Artist Relations

### 4000 - Production
Event production, technical, and stage management (6 teams, 28 positions)
- Production Management
- Stage Management
- Audio
- Lighting
- Video
- Rigging

### 5000 - Operations
Site operations, logistics, and infrastructure (4 teams, 18 positions)
- Site Operations
- Logistics
- Transportation
- Facilities

### 6000 - Experience
Guest services, accessibility, and customer experience (3 teams, 13 positions)
- Guest Experience
- Accessibility Services
- Ticketing & Box Office

### 7000 - Hospitality
Food & beverage, catering, and VIP services (2 teams, 12 positions)
- Food & Beverage
- VIP Services

### 8000 - Entertainment
Performers, talent, and entertainment programming (2 teams, 10 positions)
- Entertainment Programming
- Performers

### 9000 - Technology
IT, software development, and technical infrastructure (4 teams, 21 positions)
- Engineering
- Product
- IT Operations
- Data & Analytics

## Total Counts

- **Departments:** 10
- **Teams:** 40
- **Positions:** 200+
- **Positions with Certifications:** 8

## Key Features

### Hierarchical Structure
```
Department (Code: 0000-9000)
  └── Team (Code: 0100-9400)
        └── Position (Code: 0101-9404)
```

### Position Metadata
- **Level:** entry, mid, senior, lead, manager, director, executive
- **Certifications:** Required certifications (ETCP, CDL, ServSafe, etc.)
- **Alternate Names:** Common variations (FOH, CEO, LD, etc.)
- **Search Terms:** Optimized for flexible querying

### Catalog Integration
- Stored in global catalog system
- Category: "Teams & Positions"
- Subcategories: Departments
- Items: Teams and Positions
- Supports organization/project/team-level toggles

## Usage Examples

### Query All Departments
```typescript
const departments = await prisma.catalogSubcategory.findMany({
  where: {
    category: { slug: 'teams-positions' }
  },
  orderBy: { order: 'asc' }
});
```

### Get Production Department Teams
```typescript
const productionTeams = await prisma.catalogItem.findMany({
  where: {
    subcategory: { slug: '4000' },
    metadata: {
      path: ['type'],
      equals: 'team'
    }
  }
});
```

### Find Audio Positions
```typescript
const audioPositions = await prisma.catalogItem.findMany({
  where: {
    metadata: {
      path: ['teamCode'],
      equals: '4300'
    }
  },
  orderBy: { order: 'asc' }
});
```

### Search for Engineers
```typescript
const engineers = await prisma.catalogItem.findMany({
  where: {
    OR: [
      { name: { contains: 'Engineer', mode: 'insensitive' } },
      { searchTerms: { has: 'engineer' } }
    ],
    metadata: {
      path: ['type'],
      equals: 'position'
    }
  }
});
```

### Get Certified Positions
```typescript
const certifiedPositions = await prisma.catalogItem.findMany({
  where: {
    requiresCertification: true
  }
});
```

## Next Steps

### 1. Database Setup
```bash
# Start database (if using Supabase local)
supabase start

# Or ensure your PostgreSQL database is running
```

### 2. Run Migration
```bash
# Create migration for catalog tables
npx prisma migrate dev --name add_catalog_system

# Or push schema directly (dev only)
npx prisma db push
```

### 3. Generate Prisma Client
```bash
npm run db:generate
```

### 4. Run Seed
```bash
npm run db:seed:org
```

### 5. Verify Data
```bash
# Open Prisma Studio
npm run db:studio

# Navigate to:
# - catalog_categories (should have "Teams & Positions")
# - catalog_subcategories (should have 10 departments)
# - catalog_items (should have 240+ items)
```

## Integration Points

### COMPVSS
Update `CompvssUser` model to use position codes:
```typescript
await prisma.compvssUser.update({
  where: { userId },
  data: {
    position: '4302', // FOH Engineer
    department: '4000', // Production
    teamId: audioTeamId
  }
});
```

### ATLVS
Use for project team assignments:
```typescript
await prisma.teamMember.create({
  data: {
    teamId,
    userId,
    role: '9104', // Senior Software Engineer
    department: '9000' // Technology
  }
});
```

### Analytics
Department-level reporting:
```typescript
const headcount = await prisma.compvssUser.groupBy({
  by: ['department'],
  _count: true,
  orderBy: { department: 'asc' }
});
```

## Benefits

1. **Standardization** - Consistent team/position structure across all apps
2. **Flexibility** - Organizations can customize while maintaining standards
3. **Searchability** - Multiple search terms and alternate names
4. **Analytics** - Hierarchical structure enables powerful reporting
5. **Compliance** - Track certification requirements
6. **Scalability** - Easy to add new departments/teams/positions

## Future Enhancements

- Skills matrix mapping
- Career progression paths
- Compensation bands
- Training requirements
- Performance KPIs
- Org chart visualization
- Role-based permissions mapping
