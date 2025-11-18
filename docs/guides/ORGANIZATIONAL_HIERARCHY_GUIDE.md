# Organizational Hierarchy Guide

## Overview

The organizational hierarchy catalog provides a standardized structure for teams and positions across all applications (GVTEWAY, COMPVSS, ATLVS). This enables consistent team organization, reporting, and analytics.

## Structure

### Three-Tier Hierarchy

1. **Departments** (10 total) - Top-level organizational divisions
2. **Teams** (40+ total) - Functional groups within departments  
3. **Positions** (200+ total) - Individual roles within teams

### Department Codes

| Code | Department | Description |
|------|------------|-------------|
| 0000 | Executive | C-suite and executive leadership |
| 1000 | Creative | Creative design, content, and production |
| 2000 | Marketing | Marketing, advertising, and promotions |
| 3000 | Talent | Artist relations, booking, and talent management |
| 4000 | Production | Event production, technical, and stage management |
| 5000 | Operations | Site operations, logistics, and infrastructure |
| 6000 | Experience | Guest services, accessibility, and customer experience |
| 7000 | Hospitality | Food & beverage, catering, and VIP services |
| 8000 | Entertainment | Performers, talent, and entertainment programming |
| 9000 | Technology | IT, software development, and technical infrastructure |

## Position Levels

Positions are categorized by seniority level:

- **entry** - Entry-level positions, minimal experience required
- **mid** - Mid-level positions, 2-5 years experience
- **senior** - Senior positions, 5+ years experience
- **lead** - Team leads, technical leadership
- **manager** - People managers, department oversight
- **director** - Directors, strategic leadership
- **executive** - C-suite and executive leadership

## Usage

### Seeding the Database

Run the seed script to populate the catalog:

```bash
npx ts-node prisma/seeds/seed-organizational-catalog.ts
```

### Querying Teams & Positions

```typescript
// Get all departments
const departments = await prisma.catalogSubcategory.findMany({
  where: {
    category: {
      slug: 'teams-positions'
    }
  },
  orderBy: { order: 'asc' }
});

// Get all teams in a department
const teams = await prisma.catalogItem.findMany({
  where: {
    subcategory: {
      slug: '4000' // Production department
    },
    metadata: {
      path: ['type'],
      equals: 'team'
    }
  }
});

// Get all positions in a team
const positions = await prisma.catalogItem.findMany({
  where: {
    metadata: {
      path: ['teamCode'],
      equals: '4300' // Audio team
    }
  },
  orderBy: { order: 'asc' }
});

// Search for positions by title
const audioEngineers = await prisma.catalogItem.findMany({
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

### Filtering by Level

```typescript
// Get all senior-level positions
const seniorPositions = await prisma.catalogItem.findMany({
  where: {
    metadata: {
      path: ['level'],
      equals: 'senior'
    }
  }
});

// Get all positions requiring certifications
const certifiedPositions = await prisma.catalogItem.findMany({
  where: {
    requiresCertification: true
  }
});
```

## Integration with Applications

### GVTEWAY
- Consumer-facing roles (Guest Services, Box Office, etc.)
- Event staff assignments
- Volunteer management

### COMPVSS
- External team organization
- Vendor/contractor roles
- Production crew assignments

### ATLVS
- Internal team structure
- Project team assignments
- Resource allocation

## Analytics & Reporting

The hierarchical structure enables powerful analytics:

### Department-Level Metrics
- Headcount by department
- Budget allocation
- Performance metrics

### Team-Level Metrics
- Team composition
- Skill distribution
- Capacity planning

### Position-Level Metrics
- Role distribution
- Certification compliance
- Compensation analysis

## Customization

### Organization-Specific Positions

Organizations can add custom positions while maintaining the standard hierarchy:

```typescript
await prisma.catalogItem.create({
  data: {
    categoryId: teamsCategoryId,
    subcategoryId: departmentId,
    name: 'Custom Position Title',
    slug: 'custom-position-code',
    standardUnit: 'person',
    isGlobal: false, // Organization-specific
    organizationId: 'org-id',
    metadata: {
      type: 'position',
      level: 'mid',
      // ... other metadata
    }
  }
});
```

### Team Toggles

Organizations can enable/disable specific teams:

```typescript
await prisma.organizationCatalogToggle.create({
  data: {
    organizationId: 'org-id',
    catalogItemId: 'team-item-id',
    enabled: true,
    customName: 'Our Custom Team Name'
  }
});
```

## Best Practices

1. **Use Standard Codes** - Always reference positions by their code (e.g., '4301' for Audio Director)
2. **Leverage Search Terms** - Utilize alternate names and search terms for flexible matching
3. **Check Certifications** - Validate required certifications before assignments
4. **Maintain Hierarchy** - Keep the department → team → position structure intact
5. **Document Custom Roles** - Clearly document any organization-specific positions

## Example Workflows

### Assigning a User to a Position

```typescript
// Update user's COMPVSS profile with position
await prisma.compvssUser.update({
  where: { userId: 'user-id' },
  data: {
    position: '4302', // FOH Engineer
    department: '4000', // Production
    teamId: 'audio-team-id'
  }
});
```

### Building a Team Roster

```typescript
// Get all users in Audio team
const audioTeam = await prisma.compvssUser.findMany({
  where: {
    department: '4000',
    position: {
      startsWith: '43' // All Audio positions
    }
  },
  include: {
    user: true
  }
});
```

### Reporting by Department

```typescript
// Get headcount by department
const headcount = await prisma.compvssUser.groupBy({
  by: ['department'],
  _count: true,
  orderBy: {
    department: 'asc'
  }
});
```

## Future Enhancements

- **Skills Matrix** - Map required skills to positions
- **Career Paths** - Define progression paths between positions
- **Compensation Bands** - Associate salary ranges with positions
- **Training Requirements** - Link training modules to positions
- **Performance Metrics** - Define KPIs for each position
