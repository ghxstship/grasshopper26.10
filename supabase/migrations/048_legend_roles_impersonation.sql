-- Migration: Add Legend Roles and Impersonation System
-- Description: Adds Legend roles to UserRole enum and creates impersonation tables
-- Date: 2025-11-16

-- Add Legend roles to UserRole enum
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'LEGEND_SUPER_ADMIN';
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'LEGEND_ADMIN';
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'LEGEND_DEVELOPER';
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'LEGEND_COLLABORATOR';
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'LEGEND_SUPPORT';
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'LEGEND_INCOGNITO';

-- Create impersonation_sessions table
CREATE TABLE IF NOT EXISTS "impersonation_sessions" (
  "id" TEXT PRIMARY KEY,
  "impersonatorId" TEXT NOT NULL,
  "targetUserId" TEXT NOT NULL,
  "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "endedAt" TIMESTAMP(3),
  "expiresAt" TIMESTAMP(3),
  "reason" TEXT,
  "ipAddress" TEXT,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT "impersonation_sessions_impersonatorId_fkey" 
    FOREIGN KEY ("impersonatorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "impersonation_sessions_targetUserId_fkey" 
    FOREIGN KEY ("targetUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create indexes for impersonation_sessions
CREATE INDEX IF NOT EXISTS "impersonation_sessions_impersonatorId_idx" ON "impersonation_sessions"("impersonatorId");
CREATE INDEX IF NOT EXISTS "impersonation_sessions_targetUserId_idx" ON "impersonation_sessions"("targetUserId");
CREATE INDEX IF NOT EXISTS "impersonation_sessions_startedAt_idx" ON "impersonation_sessions"("startedAt");
CREATE INDEX IF NOT EXISTS "impersonation_sessions_endedAt_idx" ON "impersonation_sessions"("endedAt");

-- Create impersonation_permissions table
CREATE TABLE IF NOT EXISTS "impersonation_permissions" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "grantedToId" TEXT NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT "impersonation_permissions_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "impersonation_permissions_grantedToId_fkey" 
    FOREIGN KEY ("grantedToId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "impersonation_permissions_userId_grantedToId_key" 
    UNIQUE ("userId", "grantedToId")
);

-- Create indexes for impersonation_permissions
CREATE INDEX IF NOT EXISTS "impersonation_permissions_userId_idx" ON "impersonation_permissions"("userId");
CREATE INDEX IF NOT EXISTS "impersonation_permissions_grantedToId_idx" ON "impersonation_permissions"("grantedToId");
CREATE INDEX IF NOT EXISTS "impersonation_permissions_expiresAt_idx" ON "impersonation_permissions"("expiresAt");

-- Enable RLS on impersonation tables
ALTER TABLE "impersonation_sessions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "impersonation_permissions" ENABLE ROW LEVEL SECURITY;

-- RLS Policies for impersonation_sessions
-- Legend roles can view all sessions
CREATE POLICY "legend_view_all_sessions" ON "impersonation_sessions"
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "users"
      WHERE "users"."id" = auth.uid()
      AND "users"."role" IN (
        'LEGEND_SUPER_ADMIN',
        'LEGEND_ADMIN',
        'LEGEND_DEVELOPER',
        'LEGEND_COLLABORATOR',
        'LEGEND_SUPPORT',
        'LEGEND_INCOGNITO'
      )
    )
  );

-- Users can view their own impersonation sessions (as target or impersonator)
CREATE POLICY "users_view_own_sessions" ON "impersonation_sessions"
  FOR SELECT
  USING (
    "impersonatorId" = auth.uid() OR "targetUserId" = auth.uid()
  );

-- Only Legend roles can create sessions
CREATE POLICY "legend_create_sessions" ON "impersonation_sessions"
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "users"
      WHERE "users"."id" = auth.uid()
      AND "users"."role" IN (
        'LEGEND_SUPER_ADMIN',
        'LEGEND_ADMIN',
        'LEGEND_DEVELOPER',
        'LEGEND_SUPPORT',
        'LEGEND_INCOGNITO'
      )
      AND "users"."email" LIKE '%@ghxstship.pro'
    )
  );

-- Only Legend roles can update sessions
CREATE POLICY "legend_update_sessions" ON "impersonation_sessions"
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM "users"
      WHERE "users"."id" = auth.uid()
      AND "users"."role" IN (
        'LEGEND_SUPER_ADMIN',
        'LEGEND_ADMIN',
        'LEGEND_DEVELOPER',
        'LEGEND_SUPPORT',
        'LEGEND_INCOGNITO'
      )
    )
  );

-- RLS Policies for impersonation_permissions
-- Users can view permissions they granted or received
CREATE POLICY "users_view_own_permissions" ON "impersonation_permissions"
  FOR SELECT
  USING (
    "userId" = auth.uid() OR "grantedToId" = auth.uid()
  );

-- Users can grant permissions
CREATE POLICY "users_grant_permissions" ON "impersonation_permissions"
  FOR INSERT
  WITH CHECK ("userId" = auth.uid());

-- Users can revoke permissions they granted
CREATE POLICY "users_revoke_permissions" ON "impersonation_permissions"
  FOR DELETE
  USING ("userId" = auth.uid());

-- Legend roles can view all permissions
CREATE POLICY "legend_view_all_permissions" ON "impersonation_permissions"
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "users"
      WHERE "users"."id" = auth.uid()
      AND "users"."role" IN (
        'LEGEND_SUPER_ADMIN',
        'LEGEND_ADMIN',
        'LEGEND_DEVELOPER',
        'LEGEND_SUPPORT',
        'LEGEND_INCOGNITO'
      )
    )
  );

-- Create function to automatically end expired sessions
CREATE OR REPLACE FUNCTION end_expired_impersonation_sessions()
RETURNS void AS $$
BEGIN
  UPDATE "impersonation_sessions"
  SET "endedAt" = CURRENT_TIMESTAMP
  WHERE "endedAt" IS NULL
    AND "expiresAt" IS NOT NULL
    AND "expiresAt" < CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updatedAt timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_impersonation_sessions_updated_at
  BEFORE UPDATE ON "impersonation_sessions"
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_impersonation_permissions_updated_at
  BEFORE UPDATE ON "impersonation_permissions"
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comment to tables
COMMENT ON TABLE "impersonation_sessions" IS 'Tracks user impersonation sessions for Legend roles';
COMMENT ON TABLE "impersonation_permissions" IS 'Stores user-granted impersonation permissions';
