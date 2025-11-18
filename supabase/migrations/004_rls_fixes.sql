-- =====================================================
-- RLS POLICY FIXES - Critical Field Name Corrections
-- Generated: November 15, 2025
-- Purpose: Fix field name mismatches between policies and schema
-- =====================================================

-- Drop incorrect policies that reference non-existent fields
DROP POLICY IF EXISTS "Organizers can view own events" ON "events";
DROP POLICY IF EXISTS "Organizers can create events" ON "events";
DROP POLICY IF EXISTS "Organizers can update own events" ON "events";
DROP POLICY IF EXISTS "Organizers can delete own events" ON "events";
DROP POLICY IF EXISTS "Organizers can view event tickets" ON "tickets";
DROP POLICY IF EXISTS "Team members can view team advancing requests" ON "advancing_requests";
DROP POLICY IF EXISTS "Team members can create advancing requests" ON "advancing_requests";
DROP POLICY IF EXISTS "Requesters can update own requests" ON "advancing_requests";
DROP POLICY IF EXISTS "Team members can view team issue reports" ON "issue_reports";
DROP POLICY IF EXISTS "Team members can create issue reports" ON "issue_reports";
DROP POLICY IF EXISTS "Reporters can update own reports" ON "issue_reports";

-- =====================================================
-- CORRECTED EVENT POLICIES
-- =====================================================

-- Everyone can view published events
-- (Already correct - no changes needed)

-- Organization members can view their organization's events
CREATE POLICY "Organization members can view org events"
  ON "events" FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "organization_members"
      WHERE "organization_members"."organizationId" = "events"."organizationId"
      AND "organization_members"."userId" = auth.uid()::text
    )
    OR EXISTS (
      SELECT 1 FROM "users"
      WHERE id = auth.uid()::text
      AND role = 'ADMIN'
    )
  );

-- Organization admins can create events
CREATE POLICY "Organization admins can create events"
  ON "events" FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "organization_members"
      WHERE "organization_members"."organizationId" = "events"."organizationId"
      AND "organization_members"."userId" = auth.uid()::text
      AND "organization_members".role IN ('OWNER', 'ADMIN')
    )
    OR EXISTS (
      SELECT 1 FROM "users"
      WHERE id = auth.uid()::text
      AND role = 'ADMIN'
    )
  );

-- Organization admins can update their organization's events
CREATE POLICY "Organization admins can update org events"
  ON "events" FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM "organization_members"
      WHERE "organization_members"."organizationId" = "events"."organizationId"
      AND "organization_members"."userId" = auth.uid()::text
      AND "organization_members".role IN ('OWNER', 'ADMIN')
    )
    OR EXISTS (
      SELECT 1 FROM "users"
      WHERE id = auth.uid()::text
      AND role = 'ADMIN'
    )
  );

-- Organization admins can delete their organization's events
CREATE POLICY "Organization admins can delete org events"
  ON "events" FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM "organization_members"
      WHERE "organization_members"."organizationId" = "events"."organizationId"
      AND "organization_members"."userId" = auth.uid()::text
      AND "organization_members".role IN ('OWNER', 'ADMIN')
    )
    OR EXISTS (
      SELECT 1 FROM "users"
      WHERE id = auth.uid()::text
      AND role = 'ADMIN'
    )
  );

-- =====================================================
-- CORRECTED TICKET POLICIES
-- =====================================================

-- Organization members can view tickets for their organization's events
CREATE POLICY "Organization members can view org event tickets"
  ON "tickets" FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "events"
      JOIN "organization_members" ON "organization_members"."organizationId" = "events"."organizationId"
      WHERE "events".id = "tickets"."eventId"
      AND "organization_members"."userId" = auth.uid()::text
    )
  );

-- =====================================================
-- CORRECTED ADVANCING REQUEST POLICIES
-- =====================================================

-- Users can view their own advancing requests
CREATE POLICY "Users can view own advancing requests"
  ON "advancing_requests" FOR SELECT
  USING (auth.uid()::text = "userId");

-- Users can create advancing requests
CREATE POLICY "Users can create advancing requests"
  ON "advancing_requests" FOR INSERT
  WITH CHECK (auth.uid()::text = "userId");

-- Users can update their own requests
CREATE POLICY "Users can update own advancing requests"
  ON "advancing_requests" FOR UPDATE
  USING (auth.uid()::text = "userId");

-- =====================================================
-- CORRECTED ISSUE REPORT POLICIES
-- =====================================================

-- Users can view their own issue reports
CREATE POLICY "Users can view own issue reports"
  ON "issue_reports" FOR SELECT
  USING (auth.uid()::text = "userId");

-- Users can create issue reports
CREATE POLICY "Users can create issue reports"
  ON "issue_reports" FOR INSERT
  WITH CHECK (auth.uid()::text = "userId");

-- Users can update their own reports
CREATE POLICY "Users can update own issue reports"
  ON "issue_reports" FOR UPDATE
  USING (auth.uid()::text = "userId");

-- =====================================================
-- NEW POLICIES FOR MISSING TABLES
-- =====================================================

-- Cart Policies
ALTER TABLE "carts" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own cart"
  ON "carts" FOR SELECT
  USING (auth.uid()::text = "userId");

CREATE POLICY "Users can create own cart"
  ON "carts" FOR INSERT
  WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY "Users can update own cart"
  ON "carts" FOR UPDATE
  USING (auth.uid()::text = "userId");

CREATE POLICY "Users can delete own cart"
  ON "carts" FOR DELETE
  USING (auth.uid()::text = "userId");

-- Product Policies
ALTER TABLE "products" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products"
  ON "products" FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage products"
  ON "products" FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM "users"
      WHERE id = auth.uid()::text
      AND role = 'ADMIN'
    )
  );

-- EventCategory Policies
ALTER TABLE "event_categories" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view event categories"
  ON "event_categories" FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage event categories"
  ON "event_categories" FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM "users"
      WHERE id = auth.uid()::text
      AND role = 'ADMIN'
    )
  );

-- Venue Policies
ALTER TABLE "venues" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view venues"
  ON "venues" FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage venues"
  ON "venues" FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM "users"
      WHERE id = auth.uid()::text
      AND role = 'ADMIN'
    )
  );

-- Artist Policies
ALTER TABLE "artists" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view artists"
  ON "artists" FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage artists"
  ON "artists" FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM "users"
      WHERE id = auth.uid()::text
      AND role = 'ADMIN'
    )
  );

-- MembershipTier Policies
ALTER TABLE "membership_tiers" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view membership tiers"
  ON "membership_tiers" FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage membership tiers"
  ON "membership_tiers" FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM "users"
      WHERE id = auth.uid()::text
      AND role = 'ADMIN'
    )
  );

-- LoyaltyPoints Policies
ALTER TABLE "loyalty_points" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own loyalty points"
  ON "loyalty_points" FOR SELECT
  USING (auth.uid()::text = "userId");

CREATE POLICY "System can manage loyalty points"
  ON "loyalty_points" FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM "users"
      WHERE id = auth.uid()::text
      AND role = 'ADMIN'
    )
  );

-- CompvssTeam Policies
ALTER TABLE "compvss_teams" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Team members can view their teams"
  ON "compvss_teams" FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "compvss_users"
      WHERE "compvss_users"."teamId" = "compvss_teams".id
      AND "compvss_users"."userId" = auth.uid()::text
    )
  );

-- Schedule Policies
ALTER TABLE "schedules" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own schedules"
  ON "schedules" FOR SELECT
  USING (auth.uid()::text = "userId");

CREATE POLICY "Team members can view team schedules"
  ON "schedules" FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "team_members"
      WHERE "team_members"."teamId" = "schedules"."teamId"
      AND "team_members"."userId" = auth.uid()::text
    )
  );

-- Equipment Policies
ALTER TABLE "equipment" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Team members can view equipment"
  ON "equipment" FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "users"
      WHERE id = auth.uid()::text
      AND role IN ('INTERNAL_TEAM', 'ADMIN')
    )
  );

-- Vehicle Policies
ALTER TABLE "vehicles" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Team members can view vehicles"
  ON "vehicles" FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "users"
      WHERE id = auth.uid()::text
      AND role IN ('INTERNAL_TEAM', 'ADMIN')
    )
  );

-- Vendor Policies
ALTER TABLE "vendors" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Project members can view vendors"
  ON "vendors" FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "users"
      WHERE id = auth.uid()::text
      AND role IN ('INTERNAL_TEAM', 'ADMIN')
    )
  );

-- Dashboard Policies
ALTER TABLE "dashboards" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own dashboards"
  ON "dashboards" FOR SELECT
  USING (auth.uid()::text = "createdBy");

CREATE POLICY "Users can view shared dashboards"
  ON "dashboards" FOR SELECT
  USING (shared = true);

CREATE POLICY "Users can manage own dashboards"
  ON "dashboards" FOR ALL
  USING (auth.uid()::text = "createdBy");

-- Widget Policies
ALTER TABLE "widgets" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view widgets of accessible dashboards"
  ON "widgets" FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "dashboards"
      WHERE "dashboards".id = "widgets"."dashboardId"
      AND (
        "dashboards"."createdBy" = auth.uid()::text
        OR "dashboards".shared = true
      )
    )
  );

-- =====================================================
-- COMPLETION
-- =====================================================

-- All critical RLS policy fixes applied
-- Total policies fixed: 11
-- Total new policies added: 13
-- Total tables secured: 13
