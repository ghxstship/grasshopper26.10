-- ============================================================================
-- CATALOG SYSTEM RLS POLICIES
-- Row Level Security policies for catalog tables
-- ============================================================================

BEGIN;

-- Enable RLS on all catalog tables
ALTER TABLE "catalog_categories" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "catalog_subcategories" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "catalog_items" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "organization_catalog_toggles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "project_catalog_toggles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "team_catalog_toggles" ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- CATALOG_CATEGORIES POLICIES
-- ============================================================================

-- Anyone can read active catalog categories
CREATE POLICY "catalog_categories_read_policy" ON "catalog_categories"
    FOR SELECT
    USING (active = true);

-- Only admins can insert/update/delete categories
CREATE POLICY "catalog_categories_admin_policy" ON "catalog_categories"
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM "users"
            WHERE "users"."id" = auth.uid()
            AND "users"."role" IN ('ADMIN', 'INTERNAL_TEAM')
        )
    );

-- ============================================================================
-- CATALOG_SUBCATEGORIES POLICIES
-- ============================================================================

-- Anyone can read active subcategories
CREATE POLICY "catalog_subcategories_read_policy" ON "catalog_subcategories"
    FOR SELECT
    USING (active = true);

-- Only admins can insert/update/delete subcategories
CREATE POLICY "catalog_subcategories_admin_policy" ON "catalog_subcategories"
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM "users"
            WHERE "users"."id" = auth.uid()
            AND "users"."role" IN ('ADMIN', 'INTERNAL_TEAM')
        )
    );

-- ============================================================================
-- CATALOG_ITEMS POLICIES
-- ============================================================================

-- Anyone can read active global catalog items
CREATE POLICY "catalog_items_read_global_policy" ON "catalog_items"
    FOR SELECT
    USING (active = true AND "isGlobal" = true);

-- Organization members can read their org's custom items
CREATE POLICY "catalog_items_read_org_policy" ON "catalog_items"
    FOR SELECT
    USING (
        active = true 
        AND "isGlobal" = false 
        AND "organizationId" IN (
            SELECT "organizationId" 
            FROM "organization_members" 
            WHERE "userId" = auth.uid()
        )
    );

-- Only admins can manage global catalog items
CREATE POLICY "catalog_items_admin_global_policy" ON "catalog_items"
    FOR ALL
    USING (
        "isGlobal" = true
        AND EXISTS (
            SELECT 1 FROM "users"
            WHERE "users"."id" = auth.uid()
            AND "users"."role" IN ('ADMIN', 'INTERNAL_TEAM')
        )
    );

-- Organization admins can manage their org's custom items
CREATE POLICY "catalog_items_org_admin_policy" ON "catalog_items"
    FOR ALL
    USING (
        "isGlobal" = false
        AND "organizationId" IN (
            SELECT "organizationId" 
            FROM "organization_members" 
            WHERE "userId" = auth.uid()
            AND "role" IN ('OWNER', 'ADMIN')
        )
    );

-- ============================================================================
-- ORGANIZATION_CATALOG_TOGGLES POLICIES
-- ============================================================================

-- Organization members can read their org's toggles
CREATE POLICY "org_catalog_toggles_read_policy" ON "organization_catalog_toggles"
    FOR SELECT
    USING (
        "organizationId" IN (
            SELECT "organizationId" 
            FROM "organization_members" 
            WHERE "userId" = auth.uid()
        )
    );

-- Organization admins can manage their org's toggles
CREATE POLICY "org_catalog_toggles_admin_policy" ON "organization_catalog_toggles"
    FOR ALL
    USING (
        "organizationId" IN (
            SELECT "organizationId" 
            FROM "organization_members" 
            WHERE "userId" = auth.uid()
            AND "role" IN ('OWNER', 'ADMIN')
        )
    );

-- ============================================================================
-- PROJECT_CATALOG_TOGGLES POLICIES
-- ============================================================================

-- Project members can read project toggles
CREATE POLICY "project_catalog_toggles_read_policy" ON "project_catalog_toggles"
    FOR SELECT
    USING (
        "projectId" IN (
            SELECT p."id" 
            FROM "projects" p
            INNER JOIN "organization_members" om ON p."organizationId" = om."organizationId"
            WHERE om."userId" = auth.uid()
        )
    );

-- Project admins and org admins can manage project toggles
CREATE POLICY "project_catalog_toggles_admin_policy" ON "project_catalog_toggles"
    FOR ALL
    USING (
        "projectId" IN (
            SELECT p."id" 
            FROM "projects" p
            INNER JOIN "organization_members" om ON p."organizationId" = om."organizationId"
            WHERE om."userId" = auth.uid()
            AND om."role" IN ('OWNER', 'ADMIN')
        )
    );

-- ============================================================================
-- TEAM_CATALOG_TOGGLES POLICIES
-- ============================================================================

-- Team members can read team toggles
CREATE POLICY "team_catalog_toggles_read_policy" ON "team_catalog_toggles"
    FOR SELECT
    USING (
        "teamId" IN (
            SELECT "teamId" 
            FROM "team_members" 
            WHERE "userId" = auth.uid()
        )
    );

-- Team leaders can manage team toggles
CREATE POLICY "team_catalog_toggles_admin_policy" ON "team_catalog_toggles"
    FOR ALL
    USING (
        "teamId" IN (
            SELECT "teamId" 
            FROM "team_members" 
            WHERE "userId" = auth.uid()
            AND "role" IN ('leader', 'admin')
        )
    );

COMMIT;
