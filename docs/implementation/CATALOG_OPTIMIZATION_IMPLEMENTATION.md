# Catalog Optimization Implementation Guide

## Overview

Step-by-step guide to implement the optimized, scalable position cataloging system.

## Current State

✅ **Completed**
- 600 positions across 68 teams in 11 departments
- Basic hierarchical structure (Department → Team → Position)
- JSONB metadata storage
- Basic indexes on category_id, subcategory_id
- Seed scripts for data population

## Optimization Roadmap

### Phase 1: Database Optimization (Immediate)

#### 1.1 Add Performance Indexes
```sql
-- Create migration: add_catalog_performance_indexes.sql

-- Full-text search indexes
CREATE INDEX IF NOT EXISTS idx_catalog_items_search_terms 
  ON catalog_items USING GIN(search_terms);

CREATE INDEX IF NOT EXISTS idx_catalog_items_tags 
  ON catalog_items USING GIN(tags);

CREATE INDEX IF NOT EXISTS idx_catalog_items_alternate_names 
  ON catalog_items USING GIN(alternate_names);

-- JSONB metadata indexes
CREATE INDEX IF NOT EXISTS idx_catalog_items_metadata_type 
  ON catalog_items((metadata->>'type'));

CREATE INDEX IF NOT EXISTS idx_catalog_items_metadata_level 
  ON catalog_items((metadata->>'level'));

CREATE INDEX IF NOT EXISTS idx_catalog_items_metadata_dept 
  ON catalog_items((metadata->>'departmentCode'));

CREATE INDEX IF NOT EXISTS idx_catalog_items_metadata_team 
  ON catalog_items((metadata->>'teamCode'));

CREATE INDEX IF NOT EXISTS idx_catalog_items_metadata_area 
  ON catalog_items((metadata->>'area'));

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_catalog_items_global_active_type 
  ON catalog_items(is_global, active, (metadata->>'type'));

CREATE INDEX IF NOT EXISTS idx_catalog_items_org_active 
  ON catalog_items(organization_id, active) 
  WHERE organization_id IS NOT NULL;
```

**Run:**
```bash
# Create migration file
cat > supabase/migrations/$(date +%Y%m%d%H%M%S)_add_catalog_performance_indexes.sql << 'EOF'
-- Add performance indexes
-- (paste SQL above)
EOF

# Apply migration
npx supabase db push
```

#### 1.2 Create Materialized View
```sql
-- Create migration: add_positions_materialized_view.sql

CREATE MATERIALIZED VIEW IF NOT EXISTS mv_positions_hierarchy AS
SELECT 
  ci.id,
  ci.name,
  ci.slug,
  ci.description,
  ci.metadata->>'departmentCode' as department_code,
  ci.metadata->>'departmentName' as department_name,
  ci.metadata->>'teamCode' as team_code,
  ci.metadata->>'teamName' as team_name,
  ci.metadata->>'positionCode' as position_code,
  ci.metadata->>'area' as area,
  ci.metadata->>'level' as level,
  ci.tags,
  ci.search_terms,
  ci.alternate_names,
  ci.requires_certification,
  ci.metadata->'requiredCertifications' as required_certifications,
  ci.is_global,
  ci.organization_id,
  ci.active,
  ci."order",
  ci.created_at,
  ci.updated_at
FROM catalog_items ci
WHERE ci.metadata->>'type' = 'position'
  AND ci.active = true;

-- Indexes on materialized view
CREATE INDEX idx_mv_positions_dept ON mv_positions_hierarchy(department_code);
CREATE INDEX idx_mv_positions_team ON mv_positions_hierarchy(team_code);
CREATE INDEX idx_mv_positions_level ON mv_positions_hierarchy(level);
CREATE INDEX idx_mv_positions_area ON mv_positions_hierarchy(area);
CREATE INDEX idx_mv_positions_code ON mv_positions_hierarchy(position_code);
CREATE INDEX idx_mv_positions_search ON mv_positions_hierarchy USING GIN(search_terms);

-- Function to refresh materialized view
CREATE OR REPLACE FUNCTION refresh_positions_hierarchy()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_positions_hierarchy;
END;
$$ LANGUAGE plpgsql;

-- Trigger to refresh on catalog_items changes (debounced)
CREATE OR REPLACE FUNCTION notify_positions_changed()
RETURNS trigger AS $$
BEGIN
  PERFORM pg_notify('positions_changed', '');
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_positions_changed
AFTER INSERT OR UPDATE OR DELETE ON catalog_items
FOR EACH STATEMENT
EXECUTE FUNCTION notify_positions_changed();
```

### Phase 2: API Layer (Week 1)

#### 2.1 Create Position Service
```typescript
// src/lib/services/position-catalog.service.ts

import { PrismaClient } from '@prisma/client';

export interface PositionFilters {
  departmentCode?: string;
  teamCode?: string;
  level?: string;
  area?: string;
  search?: string;
  organizationId?: string;
  includeGlobal?: boolean;
  requiresCertification?: boolean;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  cursor?: string;
}

export class PositionCatalogService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Get positions with filters and pagination
   */
  async getPositions(
    filters: PositionFilters = {},
    pagination: PaginationOptions = {}
  ) {
    const {
      departmentCode,
      teamCode,
      level,
      area,
      search,
      organizationId,
      includeGlobal = true,
      requiresCertification
    } = filters;

    const { page = 1, limit = 50, cursor } = pagination;

    const where: any = {
      metadata: { path: ['type'], equals: 'position' },
      active: true
    };

    // Scope filter
    if (organizationId) {
      where.OR = includeGlobal
        ? [{ isGlobal: true }, { organizationId }]
        : [{ organizationId }];
    } else {
      where.isGlobal = true;
    }

    // Hierarchical filters
    if (departmentCode) {
      where.metadata = {
        ...where.metadata,
        path: ['departmentCode'],
        equals: departmentCode
      };
    }

    if (teamCode) {
      where.metadata = {
        ...where.metadata,
        path: ['teamCode'],
        equals: teamCode
      };
    }

    if (level) {
      where.metadata = {
        ...where.metadata,
        path: ['level'],
        equals: level
      };
    }

    if (area) {
      where.metadata = {
        ...where.metadata,
        path: ['area'],
        equals: area
      };
    }

    // Certification filter
    if (requiresCertification !== undefined) {
      where.requiresCertification = requiresCertification;
    }

    // Search filter
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { searchTerms: { hasSome: [search.toLowerCase()] } },
        { tags: { hasSome: [search.toLowerCase()] } }
      ];
    }

    // Execute query
    const positions = await this.prisma.catalogItem.findMany({
      where,
      take: limit,
      skip: cursor ? 1 : (page - 1) * limit,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { order: 'asc' },
      include: {
        subcategory: true,
        category: true
      }
    });

    const total = await this.prisma.catalogItem.count({ where });

    return {
      data: positions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
        nextCursor: positions[positions.length - 1]?.id
      }
    };
  }

  /**
   * Get position by code
   */
  async getPositionByCode(code: string) {
    return this.prisma.catalogItem.findFirst({
      where: {
        slug: code,
        metadata: { path: ['type'], equals: 'position' },
        active: true
      },
      include: {
        subcategory: true,
        category: true
      }
    });
  }

  /**
   * Get career progression options
   */
  async getCareerProgression(positionCode: string) {
    const position = await this.getPositionByCode(positionCode);
    if (!position) return [];

    const canProgressTo = position.metadata?.canProgressTo || [];
    
    if (canProgressTo.length === 0) return [];

    return this.prisma.catalogItem.findMany({
      where: {
        slug: { in: canProgressTo },
        active: true
      }
    });
  }

  /**
   * Get reporting structure
   */
  async getReportsTo(positionCode: string) {
    const position = await this.getPositionByCode(positionCode);
    if (!position) return [];

    const reportsTo = position.metadata?.reportsTo || [];
    
    if (reportsTo.length === 0) return [];

    return this.prisma.catalogItem.findMany({
      where: {
        slug: { in: reportsTo },
        active: true
      }
    });
  }

  /**
   * Search positions with full-text search
   */
  async searchPositions(query: string, options: PaginationOptions = {}) {
    const { page = 1, limit = 20 } = options;

    // Use materialized view for better performance
    const results = await this.prisma.$queryRaw`
      SELECT * FROM mv_positions_hierarchy
      WHERE 
        search_terms @@ to_tsquery('english', ${query})
        OR name ILIKE ${'%' + query + '%'}
      ORDER BY 
        ts_rank(to_tsvector('english', name), to_tsquery('english', ${query})) DESC
      LIMIT ${limit}
      OFFSET ${(page - 1) * limit}
    `;

    return results;
  }

  /**
   * Get positions by department
   */
  async getPositionsByDepartment(departmentCode: string) {
    return this.prisma.$queryRaw`
      SELECT * FROM mv_positions_hierarchy
      WHERE department_code = ${departmentCode}
      ORDER BY team_code, level DESC
    `;
  }

  /**
   * Get positions by team
   */
  async getPositionsByTeam(teamCode: string) {
    return this.prisma.$queryRaw`
      SELECT * FROM mv_positions_hierarchy
      WHERE team_code = ${teamCode}
      ORDER BY level DESC, name ASC
    `;
  }

  /**
   * Get all departments
   */
  async getDepartments() {
    return this.prisma.catalogSubcategory.findMany({
      where: {
        category: { slug: 'teams-positions' },
        active: true
      },
      orderBy: { order: 'asc' }
    });
  }

  /**
   * Get teams in department
   */
  async getTeamsInDepartment(departmentCode: string) {
    return this.prisma.catalogItem.findMany({
      where: {
        subcategory: { slug: departmentCode },
        metadata: { path: ['type'], equals: 'team' },
        active: true
      },
      orderBy: { order: 'asc' }
    });
  }
}

// Export singleton instance
export const positionCatalogService = new PositionCatalogService(
  new PrismaClient()
);
```

#### 2.2 Create API Routes
```typescript
// src/app/api/catalog/positions/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { positionCatalogService } from '@/lib/services/position-catalog.service';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const filters = {
      departmentCode: searchParams.get('departmentCode') || undefined,
      teamCode: searchParams.get('teamCode') || undefined,
      level: searchParams.get('level') || undefined,
      area: searchParams.get('area') || undefined,
      search: searchParams.get('search') || undefined,
      organizationId: searchParams.get('organizationId') || undefined,
      includeGlobal: searchParams.get('includeGlobal') !== 'false',
      requiresCertification: searchParams.get('requiresCertification') === 'true' ? true : undefined
    };

    const pagination = {
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '50'),
      cursor: searchParams.get('cursor') || undefined
    };

    const result = await positionCatalogService.getPositions(filters, pagination);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching positions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch positions' },
      { status: 500 }
    );
  }
}
```

```typescript
// src/app/api/catalog/positions/[code]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { positionCatalogService } from '@/lib/services/position-catalog.service';

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const position = await positionCatalogService.getPositionByCode(params.code);

    if (!position) {
      return NextResponse.json(
        { error: 'Position not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(position);
  } catch (error) {
    console.error('Error fetching position:', error);
    return NextResponse.json(
      { error: 'Failed to fetch position' },
      { status: 500 }
    );
  }
}
```

### Phase 3: Caching Layer (Week 2)

#### 3.1 Redis Cache Implementation
```typescript
// src/lib/cache/position-cache.ts

import { Redis } from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export class PositionCache {
  private readonly TTL = 3600; // 1 hour
  private readonly PREFIX = 'position:';

  async get<T>(key: string): Promise<T | null> {
    const cached = await redis.get(this.PREFIX + key);
    return cached ? JSON.parse(cached) : null;
  }

  async set(key: string, value: any, ttl: number = this.TTL): Promise<void> {
    await redis.setex(
      this.PREFIX + key,
      ttl,
      JSON.stringify(value)
    );
  }

  async invalidate(key: string): Promise<void> {
    await redis.del(this.PREFIX + key);
  }

  async invalidatePattern(pattern: string): Promise<void> {
    const keys = await redis.keys(this.PREFIX + pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  }
}

export const positionCache = new PositionCache();
```

#### 3.2 Update Service with Caching
```typescript
// Update position-catalog.service.ts

async getPositionByCode(code: string) {
  // Check cache first
  const cacheKey = `code:${code}`;
  const cached = await positionCache.get(cacheKey);
  
  if (cached) {
    return cached;
  }

  // Fetch from database
  const position = await this.prisma.catalogItem.findFirst({
    where: {
      slug: code,
      metadata: { path: ['type'], equals: 'position' },
      active: true
    },
    include: {
      subcategory: true,
      category: true
    }
  });

  // Cache result
  if (position) {
    await positionCache.set(cacheKey, position);
  }

  return position;
}
```

### Phase 4: Monitoring & Analytics (Week 3)

#### 4.1 Add Analytics Tracking
```typescript
// src/lib/analytics/position-analytics.ts

export interface PositionAnalytics {
  positionCode: string;
  views: number;
  searches: number;
  assignments: number;
  lastViewed: Date;
}

export async function trackPositionView(positionCode: string) {
  // Track in analytics system
  await analytics.track('position_viewed', {
    positionCode,
    timestamp: new Date()
  });
}

export async function getPopularPositions(limit: number = 10) {
  // Query analytics for most viewed positions
  return analytics.query({
    event: 'position_viewed',
    groupBy: 'positionCode',
    orderBy: 'count DESC',
    limit
  });
}
```

#### 4.2 Health Check Endpoint
```typescript
// src/app/api/catalog/health/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [totalPositions, activePositions, departments, teams] = await Promise.all([
      prisma.catalogItem.count({
        where: { metadata: { path: ['type'], equals: 'position' } }
      }),
      prisma.catalogItem.count({
        where: { 
          metadata: { path: ['type'], equals: 'position' },
          active: true
        }
      }),
      prisma.catalogSubcategory.count({
        where: { active: true }
      }),
      prisma.catalogItem.count({
        where: { 
          metadata: { path: ['type'], equals: 'team' },
          active: true
        }
      })
    ]);

    return NextResponse.json({
      status: 'healthy',
      metrics: {
        totalPositions,
        activePositions,
        departments,
        teams
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { status: 'unhealthy', error: error.message },
      { status: 500 }
    );
  }
}
```

### Phase 5: Advanced Features (Week 4)

#### 5.1 Career Progression System
```typescript
// Update seed data to include career paths
// Example: Add to position metadata
{
  code: '4302',
  title: 'FOH Engineer',
  level: 'senior',
  area: 'Technical',
  // Add career progression
  metadata: {
    reportsTo: ['4301'], // Audio Director
    canProgressTo: ['4301', '4304'], // Audio Director, System Engineer
  }
}
```

#### 5.2 Skill Gap Analysis
```typescript
// src/lib/services/career-path.service.ts

export class CareerPathService {
  async analyzeSkillGap(userId: string, targetPositionCode: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { skills: true }
    });

    const targetPosition = await positionCatalogService.getPositionByCode(
      targetPositionCode
    );

    const userSkills = user.skills.map(s => s.name);
    const requiredSkills = targetPosition.metadata?.requiredSkills || [];

    const missingSkills = requiredSkills.filter(
      skill => !userSkills.includes(skill)
    );

    return {
      currentPosition: user.positionCode,
      targetPosition: targetPositionCode,
      matchPercentage: ((requiredSkills.length - missingSkills.length) / requiredSkills.length) * 100,
      missingSkills,
      recommendations: await this.getTrainingRecommendations(missingSkills)
    };
  }
}
```

## Testing Strategy

### Unit Tests
```typescript
// __tests__/services/position-catalog.service.test.ts

describe('PositionCatalogService', () => {
  it('should fetch positions with filters', async () => {
    const result = await positionCatalogService.getPositions({
      departmentCode: '4000',
      level: 'senior'
    });

    expect(result.data).toBeDefined();
    expect(result.data.every(p => p.metadata.departmentCode === '4000')).toBe(true);
    expect(result.data.every(p => p.metadata.level === 'senior')).toBe(true);
  });

  it('should handle pagination correctly', async () => {
    const page1 = await positionCatalogService.getPositions({}, { page: 1, limit: 10 });
    const page2 = await positionCatalogService.getPositions({}, { page: 2, limit: 10 });

    expect(page1.data).toHaveLength(10);
    expect(page2.data).toHaveLength(10);
    expect(page1.data[0].id).not.toBe(page2.data[0].id);
  });
});
```

### Integration Tests
```typescript
// __tests__/api/catalog/positions.test.ts

describe('GET /api/catalog/positions', () => {
  it('should return positions with filters', async () => {
    const response = await fetch('/api/catalog/positions?level=director&limit=5');
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data).toHaveLength(5);
    expect(data.pagination).toBeDefined();
  });
});
```

### Performance Tests
```typescript
// __tests__/performance/catalog.perf.test.ts

describe('Position Catalog Performance', () => {
  it('should fetch position by code in < 10ms', async () => {
    const start = Date.now();
    await positionCatalogService.getPositionByCode('4302');
    const duration = Date.now() - start;

    expect(duration).toBeLessThan(10);
  });

  it('should handle 100 concurrent requests', async () => {
    const requests = Array(100).fill(null).map(() =>
      positionCatalogService.getPositions({}, { limit: 50 })
    );

    const start = Date.now();
    await Promise.all(requests);
    const duration = Date.now() - start;

    expect(duration).toBeLessThan(5000); // < 5 seconds
  });
});
```

## Deployment Checklist

### Pre-Deployment
- [ ] Run all database migrations
- [ ] Create materialized views
- [ ] Add all performance indexes
- [ ] Test API endpoints
- [ ] Configure Redis cache
- [ ] Set up monitoring

### Deployment
- [ ] Deploy database changes
- [ ] Deploy API changes
- [ ] Refresh materialized views
- [ ] Warm up cache
- [ ] Monitor performance

### Post-Deployment
- [ ] Verify all endpoints working
- [ ] Check cache hit rates
- [ ] Monitor query performance
- [ ] Review error logs
- [ ] Update documentation

## Maintenance Tasks

### Daily
- Monitor API performance
- Check error rates
- Review cache hit rates

### Weekly
- Refresh materialized views
- Review slow queries
- Update documentation

### Monthly
- Analyze usage patterns
- Optimize indexes
- Review and update positions
- Clean up deprecated data

## Success Metrics

### Performance
- Position lookup: < 10ms (Target: 5ms)
- Search query: < 100ms (Target: 50ms)
- API response time: < 200ms (Target: 100ms)
- Cache hit rate: > 90% (Target: 95%)

### Scalability
- Support 10,000+ concurrent users
- Handle 1M+ positions
- Process 1000+ requests/second

### Reliability
- 99.9% uptime
- < 0.1% error rate
- Zero data loss

## Next Steps

1. **Implement Phase 1** - Database optimization (1-2 days)
2. **Implement Phase 2** - API layer (3-5 days)
3. **Implement Phase 3** - Caching (2-3 days)
4. **Implement Phase 4** - Monitoring (2-3 days)
5. **Implement Phase 5** - Advanced features (5-7 days)

**Total Timeline: 3-4 weeks for complete implementation**
