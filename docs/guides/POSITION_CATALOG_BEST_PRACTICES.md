# Position Catalog Best Practices

## Overview

Best practices for using, maintaining, and extending the position cataloging system.

## Data Management

### 1. Position Code Standards

**Format:** `XXYY` where XX = Team, YY = Position within team

```typescript
// Good Examples
'4302' // FOH Engineer (Team 4300, Position 02)
'0101' // CEO (Team 0100, Position 01)
'8301' // Professional Athlete (Team 8300, Position 01)

// Bad Examples
'1'    // Too short, not hierarchical
'AUDIO-ENG' // Not numeric, hard to sort
'999999' // Too long, breaks hierarchy
```

**Rules:**
- Always use 4 digits
- First 2 digits = Team code
- Last 2 digits = Position within team
- Reserve X0 codes for leadership (e.g., 4300 = Audio Director)
- Use sequential numbering within teams

### 2. Naming Conventions

**Position Titles:**
```typescript
// Good
'Front of House Engineer'
'Director of Photography'
'Chief Executive Officer'

// Bad
'FOH Eng' // Too abbreviated
'DIRECTOR OF PHOTOGRAPHY' // All caps
'ceo' // All lowercase
```

**Alternate Names:**
```typescript
// Include common abbreviations and variations
alternateNames: [
  'FOH Engineer',
  'Front of House Audio Engineer',
  'House Engineer'
]
```

**Search Terms:**
```typescript
// Include related terms, skills, and synonyms
searchTerms: [
  'audio',
  'sound',
  'mixing',
  'live sound',
  'concert',
  'foh',
  'engineer'
]
```

### 3. Metadata Best Practices

**Required Fields:**
```typescript
{
  type: 'position', // Always required
  departmentCode: '4000',
  departmentName: 'Production',
  teamCode: '4300',
  teamName: 'Audio & Sound',
  positionCode: '4302',
  area: 'Technical', // Classification
  level: 'senior' // Hierarchy level
}
```

**Optional but Recommended:**
```typescript
{
  requiredCertifications: ['ETCP Audio'],
  requiredSkills: ['Live mixing', 'Digital consoles', 'RF coordination'],
  preferredSkills: ['Dante networking', 'System design'],
  reportsTo: ['4301'], // Audio Director
  canProgressTo: ['4301', '4304'], // Career path
  industryTags: ['live-events', 'concerts', 'broadcast']
}
```

**Avoid:**
```typescript
{
  // Don't store user-specific data
  currentSalary: 75000, // Use salary ranges instead
  assignedTo: 'user123', // Store in user table
  
  // Don't duplicate data
  categoryName: 'Teams & Positions', // Already in category table
  
  // Don't store computed values
  yearsExperience: 5, // This varies by user
}
```

## Query Optimization

### 1. Use Appropriate Indexes

**Fast Queries:**
```typescript
// ✅ Uses index on metadata->>'departmentCode'
await prisma.catalogItem.findMany({
  where: {
    metadata: { path: ['departmentCode'], equals: '4000' }
  }
});

// ✅ Uses index on slug
await prisma.catalogItem.findUnique({
  where: { slug: '4302' }
});

// ✅ Uses GIN index on search_terms
await prisma.catalogItem.findMany({
  where: {
    searchTerms: { hasSome: ['audio', 'engineer'] }
  }
});
```

**Slow Queries:**
```typescript
// ❌ Full table scan
await prisma.catalogItem.findMany({
  where: {
    metadata: { path: ['custom', 'field'], equals: 'value' }
  }
});

// ❌ LIKE on non-indexed field
await prisma.catalogItem.findMany({
  where: {
    description: { contains: 'audio' }
  }
});
```

### 2. Pagination Strategies

**Cursor-based (Recommended for large datasets):**
```typescript
async function getPositionsCursor(cursor?: string, limit = 50) {
  return await prisma.catalogItem.findMany({
    take: limit,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    where: { metadata: { path: ['type'], equals: 'position' } },
    orderBy: { order: 'asc' }
  });
}
```

**Offset-based (Good for small datasets):**
```typescript
async function getPositionsPage(page = 1, limit = 50) {
  return await prisma.catalogItem.findMany({
    take: limit,
    skip: (page - 1) * limit,
    where: { metadata: { path: ['type'], equals: 'position' } },
    orderBy: { order: 'asc' }
  });
}
```

### 3. Caching Strategies

**Cache frequently accessed positions:**
```typescript
// Cache individual positions
const cacheKey = `position:${code}`;
const cached = await redis.get(cacheKey);

if (!cached) {
  const position = await fetchPosition(code);
  await redis.setex(cacheKey, 3600, JSON.stringify(position));
}
```

**Cache search results:**
```typescript
// Cache search results with query hash
const cacheKey = `search:${hashQuery(filters)}`;
const cached = await redis.get(cacheKey);

if (!cached) {
  const results = await searchPositions(filters);
  await redis.setex(cacheKey, 600, JSON.stringify(results)); // 10 min TTL
}
```

**Invalidate cache on updates:**
```typescript
// Invalidate related caches when position changes
await redis.del(`position:${code}`);
await redis.del(`team:${teamCode}:positions`);
await redis.del(`dept:${deptCode}:positions`);
```

## Adding New Positions

### 1. Planning

**Before adding positions:**
- [ ] Identify correct department and team
- [ ] Determine appropriate position code
- [ ] Define level and area classification
- [ ] List required certifications and skills
- [ ] Identify reporting structure
- [ ] Document career progression paths

### 2. Implementation

**Add to hierarchy file:**
```typescript
// prisma/seeds/organizational-hierarchy-expanded.ts

{
  code: '4320', // New position code
  title: 'Broadcast Audio Engineer',
  level: 'senior',
  area: 'Technical',
  description: 'Manages audio for broadcast productions',
  alternateNames: ['Broadcast Engineer', 'TV Audio Engineer'],
  requiredCertifications: ['Broadcast Engineering Certification'],
  typicalResponsibilities: [
    'Mix audio for live broadcasts',
    'Maintain broadcast audio equipment',
    'Coordinate with production team'
  ]
}
```

**Run seed script:**
```bash
npm run db:seed:org:expanded
```

**Verify:**
```bash
# Check in Prisma Studio
npm run db:studio

# Or query via API
curl http://localhost:3000/api/catalog/positions/4320
```

### 3. Testing

```typescript
// Test the new position
describe('New Position: Broadcast Audio Engineer', () => {
  it('should be retrievable by code', async () => {
    const position = await positionCatalogService.getPositionByCode('4320');
    expect(position).toBeDefined();
    expect(position.name).toBe('Broadcast Audio Engineer');
  });

  it('should appear in Audio & Sound team', async () => {
    const teamPositions = await positionCatalogService.getPositionsByTeam('4300');
    expect(teamPositions.some(p => p.position_code === '4320')).toBe(true);
  });
});
```

## Multi-Tenancy

### 1. Global vs Organization-Specific

**Global Positions (Default):**
```typescript
{
  isGlobal: true,
  organizationId: null,
  // Available to all organizations
}
```

**Organization-Specific:**
```typescript
{
  isGlobal: false,
  organizationId: 'org_123',
  // Only available to org_123
}
```

**Query for both:**
```typescript
// Get positions for an organization (global + org-specific)
await prisma.catalogItem.findMany({
  where: {
    OR: [
      { isGlobal: true },
      { organizationId: orgId }
    ],
    active: true
  }
});
```

### 2. Organization Customization

**Override global position:**
```typescript
// Create organization-specific toggle
await prisma.organizationCatalogToggle.create({
  data: {
    organizationId: 'org_123',
    catalogItemId: 'position_4302',
    enabled: true,
    customName: 'Lead Audio Engineer', // Custom title
    customMetadata: {
      salaryRange: { min: 80000, max: 120000 },
      additionalRequirements: ['Union membership']
    }
  }
});
```

**Disable global position:**
```typescript
// Disable a global position for specific org
await prisma.organizationCatalogToggle.create({
  data: {
    organizationId: 'org_123',
    catalogItemId: 'position_4302',
    enabled: false // Hide this position
  }
});
```

## Versioning & Changes

### 1. Version Control

**Track changes:**
```typescript
// When updating a position
const currentVersion = position.metadata?.version || '1.0';
const newVersion = incrementVersion(currentVersion);

await prisma.catalogItem.update({
  where: { id: position.id },
  data: {
    metadata: {
      ...position.metadata,
      version: newVersion,
      versionHistory: [
        ...(position.metadata?.versionHistory || []),
        {
          version: currentVersion,
          effectiveDate: position.metadata?.effectiveDate,
          deprecatedDate: new Date().toISOString(),
          changes: ['Updated required certifications']
        }
      ],
      effectiveDate: new Date().toISOString()
    }
  }
});
```

### 2. Deprecation

**Mark position as deprecated:**
```typescript
await prisma.catalogItem.update({
  where: { slug: '4302' },
  data: {
    active: false,
    metadata: {
      ...metadata,
      deprecatedDate: new Date().toISOString(),
      deprecationReason: 'Replaced by position 4320',
      replacedBy: '4320'
    }
  }
});
```

**Handle deprecated positions:**
```typescript
// Warn users about deprecated positions
if (position.metadata?.deprecatedDate) {
  console.warn(`Position ${position.code} is deprecated`);
  
  if (position.metadata?.replacedBy) {
    const replacement = await getPositionByCode(position.metadata.replacedBy);
    console.log(`Use ${replacement.name} instead`);
  }
}
```

## Security & Permissions

### 1. Access Control

**Check permissions:**
```typescript
async function canViewPosition(userId: string, positionCode: string) {
  const user = await getUser(userId);
  const position = await getPositionByCode(positionCode);
  
  // Global positions are viewable by all
  if (position.isGlobal) return true;
  
  // Check if user's org matches position's org
  return user.organizationId === position.organizationId;
}
```

**Restrict sensitive data:**
```typescript
// Remove sensitive data for non-privileged users
function sanitizePosition(position: Position, userRole: string) {
  if (userRole !== 'admin') {
    delete position.metadata?.salaryRange;
    delete position.metadata?.internalNotes;
  }
  return position;
}
```

### 2. Audit Logging

**Log position access:**
```typescript
await auditLog.create({
  action: 'position_viewed',
  userId,
  resourceType: 'position',
  resourceId: positionCode,
  metadata: {
    timestamp: new Date(),
    ipAddress: req.ip
  }
});
```

**Log position changes:**
```typescript
await auditLog.create({
  action: 'position_updated',
  userId,
  resourceType: 'position',
  resourceId: positionCode,
  changes: {
    before: oldData,
    after: newData
  }
});
```

## Performance Monitoring

### 1. Track Query Performance

```typescript
// Measure query time
const start = Date.now();
const positions = await getPositions(filters);
const duration = Date.now() - start;

if (duration > 100) {
  console.warn(`Slow query: ${duration}ms`, { filters });
}

// Log to monitoring service
metrics.histogram('position_query_duration', duration, {
  filters: JSON.stringify(filters)
});
```

### 2. Monitor Cache Hit Rates

```typescript
// Track cache performance
const cacheKey = `position:${code}`;
const cached = await redis.get(cacheKey);

if (cached) {
  metrics.increment('cache.hit', { resource: 'position' });
  return JSON.parse(cached);
} else {
  metrics.increment('cache.miss', { resource: 'position' });
  // Fetch from database
}
```

### 3. Set Up Alerts

```typescript
// Alert on high error rates
if (errorRate > 0.01) { // > 1%
  alert.send({
    severity: 'high',
    message: 'Position catalog error rate exceeded threshold',
    errorRate
  });
}

// Alert on slow queries
if (avgQueryTime > 200) { // > 200ms
  alert.send({
    severity: 'medium',
    message: 'Position catalog queries are slow',
    avgQueryTime
  });
}
```

## Common Patterns

### 1. Building Org Charts

```typescript
async function buildOrgChart(organizationId: string) {
  // Get all positions for org
  const positions = await getPositions({
    organizationId,
    includeGlobal: true
  });

  // Build hierarchy based on reportsTo
  const hierarchy = {};
  
  for (const position of positions) {
    const reportsTo = position.metadata?.reportsTo || [];
    
    for (const supervisorCode of reportsTo) {
      if (!hierarchy[supervisorCode]) {
        hierarchy[supervisorCode] = [];
      }
      hierarchy[supervisorCode].push(position);
    }
  }

  return hierarchy;
}
```

### 2. Career Path Visualization

```typescript
async function getCareerPathGraph(startCode: string, maxDepth = 3) {
  const visited = new Set();
  const graph = { nodes: [], edges: [] };

  async function traverse(code: string, depth: number) {
    if (depth > maxDepth || visited.has(code)) return;
    
    visited.add(code);
    const position = await getPositionByCode(code);
    
    graph.nodes.push({
      id: code,
      label: position.name,
      level: position.metadata.level
    });

    const nextPositions = position.metadata?.canProgressTo || [];
    
    for (const nextCode of nextPositions) {
      graph.edges.push({ from: code, to: nextCode });
      await traverse(nextCode, depth + 1);
    }
  }

  await traverse(startCode, 0);
  return graph;
}
```

### 3. Position Recommendations

```typescript
async function recommendPositions(userId: string) {
  const user = await getUser(userId);
  const currentPosition = await getPositionByCode(user.positionCode);
  
  // Get positions user can progress to
  const progressionOptions = await getCareerProgression(user.positionCode);
  
  // Get similar positions in same area
  const similarPositions = await getPositions({
    area: currentPosition.metadata.area,
    level: currentPosition.metadata.level
  });

  // Score and rank recommendations
  const recommendations = [
    ...progressionOptions.map(p => ({ ...p, score: 1.0, reason: 'Career progression' })),
    ...similarPositions.map(p => ({ ...p, score: 0.7, reason: 'Similar role' }))
  ];

  return recommendations
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}
```

## Troubleshooting

### Common Issues

**Issue: Position not found**
```typescript
// Check if position exists
const position = await prisma.catalogItem.findFirst({
  where: { slug: code }
});

if (!position) {
  console.log('Position does not exist');
} else if (!position.active) {
  console.log('Position is inactive');
} else if (position.metadata?.type !== 'position') {
  console.log('Item is not a position (might be a team)');
}
```

**Issue: Slow queries**
```sql
-- Check if indexes exist
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'catalog_items';

-- Analyze query performance
EXPLAIN ANALYZE
SELECT * FROM catalog_items
WHERE metadata->>'departmentCode' = '4000';
```

**Issue: Cache inconsistency**
```typescript
// Force cache refresh
await redis.del(`position:${code}`);
const fresh = await getPositionByCode(code);

// Or clear all position caches
await redis.del(await redis.keys('position:*'));
```

## Maintenance Checklist

### Daily
- [ ] Monitor error rates
- [ ] Check cache hit rates
- [ ] Review slow query logs

### Weekly
- [ ] Refresh materialized views
- [ ] Review and optimize slow queries
- [ ] Check data integrity

### Monthly
- [ ] Analyze usage patterns
- [ ] Update position data as needed
- [ ] Review and update documentation
- [ ] Clean up deprecated positions

### Quarterly
- [ ] Performance audit
- [ ] Security review
- [ ] Capacity planning
- [ ] User feedback review

## Summary

✅ **Do:**
- Use consistent naming conventions
- Include comprehensive metadata
- Leverage indexes for performance
- Cache frequently accessed data
- Version control changes
- Monitor performance
- Document customizations

❌ **Don't:**
- Store user-specific data in positions
- Create duplicate positions
- Skip required metadata fields
- Ignore performance metrics
- Make breaking changes without versioning
- Delete positions (mark inactive instead)
- Hardcode position codes in application logic
