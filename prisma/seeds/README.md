# Database Seeds

This directory contains seed scripts for populating the database with initial and reference data.

## Available Seeds

### Organizational Hierarchy
**File:** `seed-organizational-catalog.ts`  
**Command:** `npm run db:seed:org`

Seeds the catalog system with a comprehensive organizational hierarchy including:
- 10 Departments (Executive, Creative, Marketing, Talent, Production, Operations, Experience, Hospitality, Entertainment, Technology)
- 40+ Teams organized by department
- 200+ Positions with levels, certifications, and metadata

**Data Structure:** `organizational-hierarchy.ts`

This provides a standardized structure for team organization, reporting, and analytics across all applications (GVTEWAY, COMPVSS, ATLVS).

## Running Seeds

### Individual Seeds
```bash
# Seed organizational hierarchy
npm run db:seed:org
```

### All Seeds
```bash
# Run main seed file (if configured)
npm run db:seed
```

## Seed Data Structure

### Organizational Hierarchy

The organizational hierarchy follows a three-tier structure:

```
Department (0000-9000)
  └── Team (0100-9400)
        └── Position (0101-9404)
```

Each level includes:
- **Unique code** for identification
- **Name** and description
- **Metadata** for filtering and analytics
- **Search terms** for flexible querying

### Position Metadata

Positions include:
- **Level:** entry, mid, senior, lead, manager, director, executive
- **Certifications:** Required certifications (e.g., ETCP Rigging, CDL)
- **Alternate names:** Common variations (e.g., "FOH Engineer", "CEO")
- **Responsibilities:** Typical job duties

## Integration

### Catalog System

All organizational data is stored in the global catalog system:
- **CatalogCategory:** "Teams & Positions"
- **CatalogSubcategory:** Departments
- **CatalogItem:** Teams and Positions

### Usage in Applications

```typescript
// Query positions by department
const productionPositions = await prisma.catalogItem.findMany({
  where: {
    metadata: {
      path: ['departmentCode'],
      equals: '4000'
    }
  }
});

// Query by team
const audioTeam = await prisma.catalogItem.findMany({
  where: {
    metadata: {
      path: ['teamCode'],
      equals: '4300'
    }
  }
});

// Query by level
const seniorPositions = await prisma.catalogItem.findMany({
  where: {
    metadata: {
      path: ['level'],
      equals: 'senior'
    }
  }
});
```

## Documentation

- **Full Guide:** `/docs/guides/ORGANIZATIONAL_HIERARCHY_GUIDE.md`
- **Quick Reference:** `/docs/guides/ORGANIZATIONAL_HIERARCHY_QUICK_REFERENCE.md`

## Adding New Seeds

1. Create a new seed file in this directory
2. Import necessary types and utilities
3. Implement seed logic with proper error handling
4. Add script to `package.json`
5. Document in this README

### Template

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedMyData() {
  console.log('🌱 Seeding my data...\n');
  
  try {
    // Seed logic here
    
    console.log('✨ Seed completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding:', error);
    throw error;
  }
}

async function main() {
  try {
    await seedMyData();
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
```

## Best Practices

1. **Idempotent Seeds** - Use `upsert` instead of `create` to allow re-running
2. **Error Handling** - Wrap in try/catch and provide clear error messages
3. **Logging** - Log progress and summary statistics
4. **Transactions** - Use transactions for related data
5. **Validation** - Validate data before insertion
6. **Documentation** - Document what each seed does and when to use it
