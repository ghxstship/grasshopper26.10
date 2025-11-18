-- ============================================================================
-- CATALOG SYSTEM TABLES CREATION
-- Creates missing catalog tables to align with Prisma schema
-- ============================================================================

BEGIN;

-- Create catalog_categories table
CREATE TABLE IF NOT EXISTS "catalog_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "catalog_categories_pkey" PRIMARY KEY ("id")
);

-- Create catalog_subcategories table
CREATE TABLE IF NOT EXISTS "catalog_subcategories" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "catalog_subcategories_pkey" PRIMARY KEY ("id")
);

-- Create catalog_items table
CREATE TABLE IF NOT EXISTS "catalog_items" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "subcategoryId" TEXT,
    
    -- Core fields
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "specifications" TEXT,
    
    -- Universal fields
    "standardUnit" TEXT NOT NULL,
    "alternateNames" TEXT[],
    
    -- Contextual fields
    "make" TEXT,
    "model" TEXT,
    "dimensions" TEXT,
    "weight" TEXT,
    "material" TEXT,
    "color" TEXT,
    "capacity" TEXT,
    "powerRequirements" TEXT,
    
    -- Metadata
    "searchTerms" TEXT[],
    "tags" TEXT[],
    
    -- Pricing & availability
    "typicalQuantity" INTEGER,
    "estimatedCost" TEXT,
    
    -- Relationships
    "accessories" JSONB,
    "relatedItems" JSONB,
    
    -- Management
    "isGlobal" BOOLEAN NOT NULL DEFAULT true,
    "organizationId" TEXT,
    
    -- Requirements & metadata
    "requiresCertification" BOOLEAN NOT NULL DEFAULT false,
    "requiresInsurance" BOOLEAN NOT NULL DEFAULT false,
    "leadTime" TEXT,
    "seasonalAvailability" TEXT[],
    "commonVendors" TEXT[],
    
    -- Status
    "active" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    
    -- Additional metadata
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "catalog_items_pkey" PRIMARY KEY ("id")
);

-- Create organization_catalog_toggles table
CREATE TABLE IF NOT EXISTS "organization_catalog_toggles" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "catalogItemId" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "customName" TEXT,
    "customCost" TEXT,
    "notes" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "organization_catalog_toggles_pkey" PRIMARY KEY ("id")
);

-- Create project_catalog_toggles table
CREATE TABLE IF NOT EXISTS "project_catalog_toggles" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "catalogItemId" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "customName" TEXT,
    "customCost" TEXT,
    "notes" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_catalog_toggles_pkey" PRIMARY KEY ("id")
);

-- Create team_catalog_toggles table
CREATE TABLE IF NOT EXISTS "team_catalog_toggles" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "catalogItemId" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "customName" TEXT,
    "customCost" TEXT,
    "notes" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "team_catalog_toggles_pkey" PRIMARY KEY ("id")
);

-- ============================================================================
-- UNIQUE CONSTRAINTS
-- ============================================================================

CREATE UNIQUE INDEX IF NOT EXISTS "catalog_categories_name_key" ON "catalog_categories"("name");
CREATE UNIQUE INDEX IF NOT EXISTS "catalog_categories_slug_key" ON "catalog_categories"("slug");
CREATE UNIQUE INDEX IF NOT EXISTS "catalog_subcategories_categoryId_slug_key" ON "catalog_subcategories"("categoryId", "slug");
CREATE UNIQUE INDEX IF NOT EXISTS "catalog_items_categoryId_slug_key" ON "catalog_items"("categoryId", "slug");
CREATE UNIQUE INDEX IF NOT EXISTS "organization_catalog_toggles_organizationId_catalogItemId_key" ON "organization_catalog_toggles"("organizationId", "catalogItemId");
CREATE UNIQUE INDEX IF NOT EXISTS "project_catalog_toggles_projectId_catalogItemId_key" ON "project_catalog_toggles"("projectId", "catalogItemId");
CREATE UNIQUE INDEX IF NOT EXISTS "team_catalog_toggles_teamId_catalogItemId_key" ON "team_catalog_toggles"("teamId", "catalogItemId");

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- catalog_categories indexes
CREATE INDEX IF NOT EXISTS "catalog_categories_slug_idx" ON "catalog_categories"("slug");
CREATE INDEX IF NOT EXISTS "catalog_categories_active_order_idx" ON "catalog_categories"("active", "order");

-- catalog_subcategories indexes
CREATE INDEX IF NOT EXISTS "catalog_subcategories_categoryId_idx" ON "catalog_subcategories"("categoryId");
CREATE INDEX IF NOT EXISTS "catalog_subcategories_active_order_idx" ON "catalog_subcategories"("active", "order");

-- catalog_items indexes
CREATE INDEX IF NOT EXISTS "catalog_items_categoryId_idx" ON "catalog_items"("categoryId");
CREATE INDEX IF NOT EXISTS "catalog_items_subcategoryId_idx" ON "catalog_items"("subcategoryId");
CREATE INDEX IF NOT EXISTS "catalog_items_organizationId_idx" ON "catalog_items"("organizationId");
CREATE INDEX IF NOT EXISTS "catalog_items_isGlobal_active_idx" ON "catalog_items"("isGlobal", "active");
CREATE INDEX IF NOT EXISTS "catalog_items_slug_idx" ON "catalog_items"("slug");

-- Toggle table indexes
CREATE INDEX IF NOT EXISTS "organization_catalog_toggles_organizationId_idx" ON "organization_catalog_toggles"("organizationId");
CREATE INDEX IF NOT EXISTS "organization_catalog_toggles_catalogItemId_idx" ON "organization_catalog_toggles"("catalogItemId");
CREATE INDEX IF NOT EXISTS "organization_catalog_toggles_enabled_idx" ON "organization_catalog_toggles"("enabled");

CREATE INDEX IF NOT EXISTS "project_catalog_toggles_projectId_idx" ON "project_catalog_toggles"("projectId");
CREATE INDEX IF NOT EXISTS "project_catalog_toggles_catalogItemId_idx" ON "project_catalog_toggles"("catalogItemId");
CREATE INDEX IF NOT EXISTS "project_catalog_toggles_enabled_idx" ON "project_catalog_toggles"("enabled");

CREATE INDEX IF NOT EXISTS "team_catalog_toggles_teamId_idx" ON "team_catalog_toggles"("teamId");
CREATE INDEX IF NOT EXISTS "team_catalog_toggles_catalogItemId_idx" ON "team_catalog_toggles"("catalogItemId");
CREATE INDEX IF NOT EXISTS "team_catalog_toggles_enabled_idx" ON "team_catalog_toggles"("enabled");

-- ============================================================================
-- FOREIGN KEY CONSTRAINTS
-- ============================================================================

-- catalog_subcategories foreign keys
ALTER TABLE "catalog_subcategories" 
    ADD CONSTRAINT "catalog_subcategories_categoryId_fkey" 
    FOREIGN KEY ("categoryId") REFERENCES "catalog_categories"("id") 
    ON DELETE CASCADE ON UPDATE CASCADE;

-- catalog_items foreign keys
ALTER TABLE "catalog_items" 
    ADD CONSTRAINT "catalog_items_categoryId_fkey" 
    FOREIGN KEY ("categoryId") REFERENCES "catalog_categories"("id") 
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "catalog_items" 
    ADD CONSTRAINT "catalog_items_subcategoryId_fkey" 
    FOREIGN KEY ("subcategoryId") REFERENCES "catalog_subcategories"("id") 
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "catalog_items" 
    ADD CONSTRAINT "catalog_items_organizationId_fkey" 
    FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") 
    ON DELETE CASCADE ON UPDATE CASCADE;

-- organization_catalog_toggles foreign keys
ALTER TABLE "organization_catalog_toggles" 
    ADD CONSTRAINT "organization_catalog_toggles_organizationId_fkey" 
    FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") 
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "organization_catalog_toggles" 
    ADD CONSTRAINT "organization_catalog_toggles_catalogItemId_fkey" 
    FOREIGN KEY ("catalogItemId") REFERENCES "catalog_items"("id") 
    ON DELETE CASCADE ON UPDATE CASCADE;

-- project_catalog_toggles foreign keys
ALTER TABLE "project_catalog_toggles" 
    ADD CONSTRAINT "project_catalog_toggles_projectId_fkey" 
    FOREIGN KEY ("projectId") REFERENCES "projects"("id") 
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "project_catalog_toggles" 
    ADD CONSTRAINT "project_catalog_toggles_catalogItemId_fkey" 
    FOREIGN KEY ("catalogItemId") REFERENCES "catalog_items"("id") 
    ON DELETE CASCADE ON UPDATE CASCADE;

-- team_catalog_toggles foreign keys
ALTER TABLE "team_catalog_toggles" 
    ADD CONSTRAINT "team_catalog_toggles_teamId_fkey" 
    FOREIGN KEY ("teamId") REFERENCES "teams"("id") 
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "team_catalog_toggles" 
    ADD CONSTRAINT "team_catalog_toggles_catalogItemId_fkey" 
    FOREIGN KEY ("catalogItemId") REFERENCES "catalog_items"("id") 
    ON DELETE CASCADE ON UPDATE CASCADE;

-- ============================================================================
-- TRIGGER FOR UPDATED_AT
-- ============================================================================

CREATE OR REPLACE FUNCTION update_catalog_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_catalog_categories_updated_at
    BEFORE UPDATE ON "catalog_categories"
    FOR EACH ROW
    EXECUTE FUNCTION update_catalog_updated_at();

CREATE TRIGGER update_catalog_subcategories_updated_at
    BEFORE UPDATE ON "catalog_subcategories"
    FOR EACH ROW
    EXECUTE FUNCTION update_catalog_updated_at();

CREATE TRIGGER update_catalog_items_updated_at
    BEFORE UPDATE ON "catalog_items"
    FOR EACH ROW
    EXECUTE FUNCTION update_catalog_updated_at();

CREATE TRIGGER update_organization_catalog_toggles_updated_at
    BEFORE UPDATE ON "organization_catalog_toggles"
    FOR EACH ROW
    EXECUTE FUNCTION update_catalog_updated_at();

CREATE TRIGGER update_project_catalog_toggles_updated_at
    BEFORE UPDATE ON "project_catalog_toggles"
    FOR EACH ROW
    EXECUTE FUNCTION update_catalog_updated_at();

CREATE TRIGGER update_team_catalog_toggles_updated_at
    BEFORE UPDATE ON "team_catalog_toggles"
    FOR EACH ROW
    EXECUTE FUNCTION update_catalog_updated_at();

COMMIT;
