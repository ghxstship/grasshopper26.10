# Position Catalog Architecture - Scalable & Future-Proof

## Overview

A comprehensive, scalable position cataloging system designed for:
- **Extensibility** - Easy to add new positions, teams, departments, industries
- **Performance** - Optimized queries with proper indexing
- **Flexibility** - Support for custom fields and organization-specific positions
- **Maintainability** - Clear structure and versioning
- **Integration** - Seamless integration with user management, permissions, and analytics

## System Architecture

### Core Data Model

```
CatalogCategory (Teams & Positions)
    ├── CatalogSubcategory (Departments)
    │   └── CatalogItem (Teams & Positions)
    │       ├── Global Positions (600+)
    │       └── Organization-Specific Positions
    └── Metadata Structure
        ├── Hierarchical Data
        ├── Classification Tags
        └── Extensible Fields
```

## Database Schema Design

### Primary Tables

#### 1. catalog_categories
```sql
CREATE TABLE catalog_categories (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  "order" INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_catalog_categories_slug ON catalog_categories(slug);
CREATE INDEX idx_catalog_categories_active_order ON catalog_categories(active, "order");
```

#### 2. catalog_subcategories (Departments)
```sql
CREATE TABLE catalog_subcategories (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL REFERENCES catalog_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  "order" INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(category_id, slug)
);

-- Indexes for performance
CREATE INDEX idx_catalog_subcategories_category ON catalog_subcategories(category_id);
CREATE INDEX idx_catalog_subcategories_active_order ON catalog_subcategories(active, "order");
CREATE INDEX idx_catalog_subcategories_slug ON catalog_subcategories(slug);
```

#### 3. catalog_items (Positions & Teams)
```sql
CREATE TABLE catalog_items (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL REFERENCES catalog_categories(id) ON DELETE CASCADE,
  subcategory_id TEXT REFERENCES catalog_subcategories(id) ON DELETE SET NULL,
  
  -- Core fields
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  specifications TEXT,
  
  -- Classification
  standard_unit TEXT NOT NULL, -- 'person', 'team', etc.
  alternate_names TEXT[],
  search_terms TEXT[],
  tags TEXT[],
  
  -- Scope
  is_global BOOLEAN DEFAULT true,
  organization_id TEXT REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Requirements
  requires_certification BOOLEAN DEFAULT false,
  requires_insurance BOOLEAN DEFAULT false,
  
  -- Status
  active BOOLEAN DEFAULT true,
  "order" INTEGER DEFAULT 0,
  
  -- Extensible metadata (JSONB for flexibility)
  metadata JSONB,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(category_id, slug)
);

-- Performance indexes
CREATE INDEX idx_catalog_items_category ON catalog_items(category_id);
CREATE INDEX idx_catalog_items_subcategory ON catalog_items(subcategory_id);
CREATE INDEX idx_catalog_items_organization ON catalog_items(organization_id);
CREATE INDEX idx_catalog_items_global_active ON catalog_items(is_global, active);
CREATE INDEX idx_catalog_items_slug ON catalog_items(slug);

-- Full-text search
CREATE INDEX idx_catalog_items_search_terms ON catalog_items USING GIN(search_terms);
CREATE INDEX idx_catalog_items_tags ON catalog_items USING GIN(tags);
CREATE INDEX idx_catalog_items_alternate_names ON catalog_items USING GIN(alternate_names);

-- JSONB indexes for metadata queries
CREATE INDEX idx_catalog_items_metadata ON catalog_items USING GIN(metadata);
CREATE INDEX idx_catalog_items_metadata_type ON catalog_items((metadata->>'type'));
CREATE INDEX idx_catalog_items_metadata_level ON catalog_items((metadata->>'level'));
CREATE INDEX idx_catalog_items_metadata_dept ON catalog_items((metadata->>'departmentCode'));
CREATE INDEX idx_catalog_items_metadata_team ON catalog_items((metadata->>'teamCode'));
CREATE INDEX idx_catalog_items_metadata_area ON catalog_items((metadata->>'area'));
```

## Metadata Structure (JSONB)

### Position Metadata Schema
```typescript
interface PositionMetadata {
  // Type classification
  type: 'position' | 'team';
  
  // Hierarchical structure
  departmentCode: string;        // e.g., '4000'
  departmentName: string;        // e.g., 'Production'
  teamCode: string;              // e.g., '4300'
  teamName: string;              // e.g., 'Audio & Sound'
  positionCode: string;          // e.g., '4302'
  
  // Classification
  area: string;                  // e.g., 'Technical', 'Creative', 'Administrative'
  level: 'entry' | 'mid' | 'senior' | 'lead' | 'manager' | 'director' | 'executive';
  
  // Requirements
  requiredCertifications: string[];
  typicalResponsibilities: string[];
  
  // Compensation (optional)
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
  };
  
  // Skills & competencies
  requiredSkills?: string[];
  preferredSkills?: string[];
  
  // Career path
  reportsTo?: string[];          // Position codes
  canProgressTo?: string[];      // Position codes
  
  // Industry-specific
  industryTags?: string[];       // e.g., ['film', 'broadcast', 'live-events']
  
  // Custom fields (extensible)
  custom?: Record<string, any>;
  
  // Versioning
  version?: string;
  effectiveDate?: string;
  deprecatedDate?: string;
}
```

### Team Metadata Schema
```typescript
interface TeamMetadata {
  type: 'team';
  departmentCode: string;
  departmentName: string;
  teamCode: string;
  
  // Team characteristics
  size?: {
    min: number;
    max: number;
  };
  
  // Reporting structure
  reportsTo?: string;            // Team code
  
  // Custom fields
  custom?: Record<string, any>;
}
```

## Scalability Features

### 1. Hierarchical Codes
```
Department: 0000-9999 (4 digits)
Team:       XX00-XX99 (2 additional digits)
Position:   XXXX (4 digits total)

Examples:
- 4000 = Production Department
- 4300 = Audio & Sound Team
- 4302 = FOH Engineer Position
```

**Benefits:**
- Easy to add new departments (10000, 11000, etc.)
- 100 teams per department
- 100 positions per team
- Hierarchical queries using string prefix matching

### 2. Versioning System
```typescript
interface PositionVersion {
  version: string;              // e.g., '1.0', '2.0'
  effectiveDate: string;        // ISO date
  deprecatedDate?: string;      // ISO date
  changes: string[];            // Change log
}

// Store in metadata.versionHistory
metadata: {
  version: '2.0',
  effectiveDate: '2025-01-01',
  versionHistory: [
    {
      version: '1.0',
      effectiveDate: '2024-01-01',
      deprecatedDate: '2024-12-31',
      changes: ['Initial version']
    }
  ]
}
```

### 3. Multi-Tenancy Support
```typescript
// Global positions (available to all)
is_global: true
organization_id: null

// Organization-specific positions
is_global: false
organization_id: 'org_123'

// Query logic
WHERE (is_global = true OR organization_id = $orgId)
  AND active = true
```

### 4. Toggle System
```sql
-- Organization-level toggles
CREATE TABLE organization_catalog_toggles (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  catalog_item_id TEXT NOT NULL,
  enabled BOOLEAN DEFAULT true,
  custom_name TEXT,
  custom_metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(organization_id, catalog_item_id)
);

-- Project-level toggles
CREATE TABLE project_catalog_toggles (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  catalog_item_id TEXT NOT NULL,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(project_id, catalog_item_id)
);

-- Team-level toggles
CREATE TABLE team_catalog_toggles (
  id TEXT PRIMARY KEY,
  team_id TEXT NOT NULL,
  catalog_item_id TEXT NOT NULL,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(team_id, catalog_item_id)
);
```

## Query Optimization

### 1. Materialized Views for Common Queries
```sql
-- All positions with full hierarchy
CREATE MATERIALIZED VIEW mv_positions_hierarchy AS
SELECT 
  ci.id,
  ci.name,
  ci.slug,
  ci.metadata->>'departmentCode' as department_code,
  ci.metadata->>'departmentName' as department_name,
  ci.metadata->>'teamCode' as team_code,
  ci.metadata->>'teamName' as team_name,
  ci.metadata->>'area' as area,
  ci.metadata->>'level' as level,
  ci.tags,
  ci.search_terms,
  ci.requires_certification,
  ci.active
FROM catalog_items ci
WHERE ci.metadata->>'type' = 'position'
  AND ci.active = true;

CREATE INDEX idx_mv_positions_dept ON mv_positions_hierarchy(department_code);
CREATE INDEX idx_mv_positions_team ON mv_positions_hierarchy(team_code);
CREATE INDEX idx_mv_positions_level ON mv_positions_hierarchy(level);
CREATE INDEX idx_mv_positions_area ON mv_positions_hierarchy(area);

-- Refresh strategy
REFRESH MATERIALIZED VIEW CONCURRENTLY mv_positions_hierarchy;
```

### 2. Optimized Query Patterns
```typescript
// Get all positions in a department
const positions = await prisma.$queryRaw`
  SELECT * FROM mv_positions_hierarchy
  WHERE department_code = ${deptCode}
  ORDER BY team_code, level DESC
`;

// Search positions by skill
const positions = await prisma.catalogItem.findMany({
  where: {
    OR: [
      { searchTerms: { hasSome: [searchTerm] } },
      { tags: { hasSome: [searchTerm] } },
      { name: { contains: searchTerm, mode: 'insensitive' } }
    ],
    metadata: { path: ['type'], equals: 'position' },
    active: true
  }
});

// Get career progression path
const careerPath = await prisma.$queryRaw`
  SELECT * FROM catalog_items
  WHERE metadata @> jsonb_build_object('canProgressTo', jsonb_build_array(${positionCode}))
`;
```

## API Layer Design

### RESTful Endpoints
```typescript
// Position Catalog API
GET    /api/catalog/positions                    // List all positions
GET    /api/catalog/positions/:code              // Get position details
GET    /api/catalog/positions/search             // Search positions
GET    /api/catalog/departments                  // List departments
GET    /api/catalog/departments/:code/teams      // Teams in department
GET    /api/catalog/departments/:code/positions  // Positions in department
GET    /api/catalog/teams/:code/positions        // Positions in team

// Filtering & Pagination
GET    /api/catalog/positions?level=senior&area=Technical&page=1&limit=50

// Organization-specific
GET    /api/catalog/positions?orgId=123&includeGlobal=true

// Career paths
GET    /api/catalog/positions/:code/progression  // Career progression options
GET    /api/catalog/positions/:code/reports-to   // Reporting structure
```

### GraphQL Schema
```graphql
type Position {
  id: ID!
  code: String!
  name: String!
  description: String
  level: PositionLevel!
  area: String!
  department: Department!
  team: Team!
  requiredCertifications: [String!]!
  requiredSkills: [String!]!
  salaryRange: SalaryRange
  careerProgression: [Position!]!
  reportsTo: [Position!]!
}

type Query {
  positions(
    departmentCode: String
    teamCode: String
    level: PositionLevel
    area: String
    search: String
    organizationId: ID
    includeGlobal: Boolean = true
    page: Int = 1
    limit: Int = 50
  ): PositionConnection!
  
  position(code: String!): Position
  
  careerPath(
    fromCode: String!
    toCode: String
  ): [Position!]!
}
```

## Extensibility Patterns

### 1. Plugin System for Custom Fields
```typescript
interface CatalogPlugin {
  name: string;
  version: string;
  
  // Extend metadata schema
  extendMetadata?: (metadata: any) => any;
  
  // Custom validation
  validate?: (item: CatalogItem) => ValidationResult;
  
  // Custom queries
  queries?: Record<string, Function>;
}

// Example: Compensation plugin
const compensationPlugin: CatalogPlugin = {
  name: 'compensation',
  version: '1.0',
  extendMetadata: (metadata) => ({
    ...metadata,
    compensation: {
      salaryRange: { min: 0, max: 0, currency: 'USD' },
      benefits: [],
      bonusStructure: null
    }
  })
};
```

### 2. Industry-Specific Extensions
```typescript
// Film industry extension
interface FilmPositionMetadata extends PositionMetadata {
  unionAffiliation?: string[];    // e.g., ['IATSE', 'DGA']
  dayRate?: number;
  overtimeRules?: string;
  travelRequirements?: string;
}

// Sports industry extension
interface SportsPositionMetadata extends PositionMetadata {
  sportSpecific?: string[];       // e.g., ['baseball', 'football']
  seasonalAvailability?: string[];
  gameDay?: boolean;
}
```

### 3. Custom Position Types
```typescript
// Allow organizations to create custom position types
interface CustomPositionType {
  organizationId: string;
  basePositionCode: string;       // Inherit from global position
  customizations: {
    name?: string;
    description?: string;
    additionalRequirements?: string[];
    customMetadata?: Record<string, any>;
  };
}
```

## Migration & Versioning Strategy

### 1. Schema Migrations
```typescript
// migrations/add_position_versioning.ts
export async function up(prisma: PrismaClient) {
  // Add version fields to existing positions
  await prisma.$executeRaw`
    UPDATE catalog_items
    SET metadata = jsonb_set(
      metadata,
      '{version}',
      '"1.0"'
    )
    WHERE metadata->>'type' = 'position'
      AND metadata->>'version' IS NULL
  `;
}
```

### 2. Data Versioning
```typescript
// Version control for position changes
interface PositionChangeLog {
  positionCode: string;
  version: string;
  changes: {
    field: string;
    oldValue: any;
    newValue: any;
    reason: string;
  }[];
  changedBy: string;
  changedAt: string;
}

// Store in separate audit table
CREATE TABLE catalog_change_log (
  id TEXT PRIMARY KEY,
  catalog_item_id TEXT NOT NULL,
  version TEXT NOT NULL,
  changes JSONB NOT NULL,
  changed_by TEXT NOT NULL,
  changed_at TIMESTAMP DEFAULT NOW()
);
```

## Performance Optimization

### 1. Caching Strategy
```typescript
// Redis cache for frequently accessed positions
const cacheKey = `position:${code}`;
const cached = await redis.get(cacheKey);

if (cached) {
  return JSON.parse(cached);
}

const position = await prisma.catalogItem.findUnique({
  where: { slug: code }
});

await redis.setex(cacheKey, 3600, JSON.stringify(position));
```

### 2. Batch Operations
```typescript
// Bulk insert positions
async function bulkInsertPositions(positions: Position[]) {
  const batchSize = 100;
  
  for (let i = 0; i < positions.length; i += batchSize) {
    const batch = positions.slice(i, i + batchSize);
    await prisma.catalogItem.createMany({
      data: batch,
      skipDuplicates: true
    });
  }
}
```

### 3. Query Result Pagination
```typescript
interface PaginationOptions {
  page: number;
  limit: number;
  cursor?: string;
}

async function getPaginatedPositions(options: PaginationOptions) {
  const { page, limit, cursor } = options;
  
  // Cursor-based pagination for better performance
  const positions = await prisma.catalogItem.findMany({
    where: { metadata: { path: ['type'], equals: 'position' } },
    take: limit,
    skip: cursor ? 1 : (page - 1) * limit,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { order: 'asc' }
  });
  
  return {
    data: positions,
    nextCursor: positions[positions.length - 1]?.id,
    hasMore: positions.length === limit
  };
}
```

## Integration Points

### 1. User Management
```typescript
// Link users to positions
interface UserPosition {
  userId: string;
  positionCode: string;
  departmentCode: string;
  teamCode: string;
  startDate: string;
  endDate?: string;
  isPrimary: boolean;
}

// Query users by position
const audioEngineers = await prisma.user.findMany({
  where: {
    positions: {
      some: {
        positionCode: '4302', // FOH Engineer
        endDate: null
      }
    }
  }
});
```

### 2. Permissions System
```typescript
// Role-based access control
interface PositionPermissions {
  positionCode: string;
  permissions: {
    resource: string;
    actions: ('create' | 'read' | 'update' | 'delete')[];
  }[];
}

// Check if user's position has permission
async function hasPermission(
  userId: string,
  resource: string,
  action: string
): Promise<boolean> {
  const userPosition = await getUserPrimaryPosition(userId);
  const permissions = await getPositionPermissions(userPosition.code);
  
  return permissions.some(p => 
    p.resource === resource && p.actions.includes(action)
  );
}
```

### 3. Analytics & Reporting
```typescript
// Position analytics
interface PositionAnalytics {
  positionCode: string;
  metrics: {
    totalAssigned: number;
    avgTenure: number;
    turnoverRate: number;
    avgSalary: number;
    certificationCompliance: number;
  };
}

// Generate org chart
async function generateOrgChart(organizationId: string) {
  const positions = await prisma.catalogItem.findMany({
    where: {
      OR: [
        { isGlobal: true },
        { organizationId }
      ],
      metadata: { path: ['type'], equals: 'position' }
    }
  });
  
  // Build hierarchical structure
  return buildHierarchy(positions);
}
```

## Future-Proofing Strategies

### 1. API Versioning
```typescript
// Version API endpoints
app.use('/api/v1/catalog', catalogRouterV1);
app.use('/api/v2/catalog', catalogRouterV2);

// Deprecation warnings
app.use('/api/v1/*', (req, res, next) => {
  res.setHeader('X-API-Deprecated', 'true');
  res.setHeader('X-API-Sunset', '2026-01-01');
  next();
});
```

### 2. Feature Flags
```typescript
// Enable/disable features
interface CatalogFeatureFlags {
  enableCareerProgression: boolean;
  enableSalaryData: boolean;
  enableCustomPositions: boolean;
  enableAIRecommendations: boolean;
}

// Check feature availability
if (featureFlags.enableCareerProgression) {
  // Show career progression UI
}
```

### 3. Internationalization
```typescript
// Multi-language support
interface PositionTranslation {
  positionCode: string;
  locale: string;
  name: string;
  description: string;
  metadata: Record<string, any>;
}

// Store translations
CREATE TABLE catalog_translations (
  id TEXT PRIMARY KEY,
  catalog_item_id TEXT NOT NULL,
  locale TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  metadata JSONB,
  UNIQUE(catalog_item_id, locale)
);
```

### 4. AI/ML Integration
```typescript
// Position recommendations
interface PositionRecommendation {
  userId: string;
  recommendedPositions: {
    positionCode: string;
    score: number;
    reasons: string[];
  }[];
}

// Skill gap analysis
async function analyzeSkillGap(
  userId: string,
  targetPositionCode: string
) {
  const userSkills = await getUserSkills(userId);
  const requiredSkills = await getPositionRequiredSkills(targetPositionCode);
  
  return {
    missingSkills: difference(requiredSkills, userSkills),
    matchPercentage: calculateMatch(userSkills, requiredSkills)
  };
}
```

## Monitoring & Maintenance

### 1. Health Checks
```typescript
// System health monitoring
async function checkCatalogHealth() {
  return {
    totalPositions: await prisma.catalogItem.count({
      where: { metadata: { path: ['type'], equals: 'position' } }
    }),
    activePositions: await prisma.catalogItem.count({
      where: { 
        metadata: { path: ['type'], equals: 'position' },
        active: true
      }
    }),
    lastUpdated: await getLastUpdateTime(),
    cacheHitRate: await getCacheMetrics()
  };
}
```

### 2. Data Quality Checks
```typescript
// Validate data integrity
async function validateCatalogIntegrity() {
  const issues = [];
  
  // Check for orphaned positions
  const orphaned = await prisma.catalogItem.findMany({
    where: {
      subcategoryId: { not: null },
      subcategory: null
    }
  });
  
  if (orphaned.length > 0) {
    issues.push(`Found ${orphaned.length} orphaned positions`);
  }
  
  // Check for duplicate codes
  const duplicates = await findDuplicateCodes();
  if (duplicates.length > 0) {
    issues.push(`Found ${duplicates.length} duplicate position codes`);
  }
  
  return issues;
}
```

## Summary

### Key Features
✅ **Scalable** - Hierarchical codes support unlimited growth
✅ **Flexible** - JSONB metadata for extensibility
✅ **Performant** - Optimized indexes and materialized views
✅ **Multi-tenant** - Global + organization-specific positions
✅ **Versioned** - Track changes over time
✅ **Searchable** - Full-text search with GIN indexes
✅ **Integrated** - Seamless integration with users, permissions, analytics
✅ **Future-proof** - Plugin system, feature flags, API versioning

### Capacity
- **Departments**: 10,000+ (4-digit codes)
- **Teams**: 100 per department
- **Positions**: 100 per team
- **Total Capacity**: 100M+ positions

### Performance Targets
- Position lookup: < 10ms
- Search query: < 100ms
- Bulk operations: 1000+ positions/second
- Cache hit rate: > 90%

**The system is designed to scale from 600 positions to millions while maintaining performance and flexibility.**
