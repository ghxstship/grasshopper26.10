-- =====================================================
-- ENHANCED ROW-LEVEL SECURITY (RLS) POLICIES
-- Additional security policies for platform-specific access
-- =====================================================

-- =====================================================
-- ATLVS PROJECT POLICIES (Enhanced)
-- =====================================================

-- Project members can view projects they're assigned to
CREATE POLICY "Project members can view assigned projects"
  ON "Project" FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "ProjectMember"
      WHERE "ProjectMember"."projectId" = "Project".id
      AND "ProjectMember"."userId" = auth.uid()::text
    )
    OR "createdById" = auth.uid()::text
    OR EXISTS (
      SELECT 1 FROM "User"
      WHERE id = auth.uid()::text
      AND role IN ('ADMIN', 'SUPER_ADMIN')
    )
  );

-- Only internal team can create projects
CREATE POLICY "Internal team can create projects"
  ON "Project" FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "User"
      WHERE id = auth.uid()::text
      AND role IN ('INTERNAL_TEAM', 'ADMIN', 'SUPER_ADMIN')
    )
  );

-- Project creators and admins can update projects
CREATE POLICY "Project creators can update projects"
  ON "Project" FOR UPDATE
  USING (
    "createdById" = auth.uid()::text
    OR EXISTS (
      SELECT 1 FROM "User"
      WHERE id = auth.uid()::text
      AND role IN ('ADMIN', 'SUPER_ADMIN')
    )
  );

-- =====================================================
-- ATLVS TASK POLICIES (Enhanced)
-- =====================================================

-- Task assignees can view their tasks
CREATE POLICY "Users can view assigned tasks"
  ON "Task" FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "TaskAssignment"
      WHERE "TaskAssignment"."taskId" = "Task".id
      AND "TaskAssignment"."userId" = auth.uid()::text
    )
    OR "createdById" = auth.uid()::text
    OR EXISTS (
      SELECT 1 FROM "Project"
      WHERE "Project".id = "Task"."projectId"
      AND (
        "Project"."createdById" = auth.uid()::text
        OR EXISTS (
          SELECT 1 FROM "ProjectMember"
          WHERE "ProjectMember"."projectId" = "Project".id
          AND "ProjectMember"."userId" = auth.uid()::text
        )
      )
    )
  );

-- Project members can create tasks
CREATE POLICY "Project members can create tasks"
  ON "Task" FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "Project"
      WHERE "Project".id = "Task"."projectId"
      AND (
        "Project"."createdById" = auth.uid()::text
        OR EXISTS (
          SELECT 1 FROM "ProjectMember"
          WHERE "ProjectMember"."projectId" = "Project".id
          AND "ProjectMember"."userId" = auth.uid()::text
        )
      )
    )
  );

-- =====================================================
-- ATLVS BUDGET POLICIES (Enhanced)
-- =====================================================

-- Only project members can view budgets
CREATE POLICY "Project members can view budgets"
  ON "Budget" FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "Project"
      WHERE "Project".id = "Budget"."projectId"
      AND (
        "Project"."createdById" = auth.uid()::text
        OR EXISTS (
          SELECT 1 FROM "ProjectMember"
          WHERE "ProjectMember"."projectId" = "Project".id
          AND "ProjectMember"."userId" = auth.uid()::text
        )
      )
    )
    OR EXISTS (
      SELECT 1 FROM "User"
      WHERE id = auth.uid()::text
      AND role IN ('ADMIN', 'SUPER_ADMIN')
    )
  );

-- Only internal team with budget permissions can manage budgets
CREATE POLICY "Authorized users can manage budgets"
  ON "Budget" FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM "User"
      WHERE id = auth.uid()::text
      AND role IN ('INTERNAL_TEAM', 'ADMIN', 'SUPER_ADMIN')
    )
  );

-- =====================================================
-- COMPVSS ADVANCING REQUEST POLICIES (Enhanced)
-- =====================================================

-- External team can view their own requests
CREATE POLICY "External team can view own advancing requests"
  ON "AdvancingRequest" FOR SELECT
  USING (
    "requestedById" = auth.uid()::text
    OR EXISTS (
      SELECT 1 FROM "User"
      WHERE id = auth.uid()::text
      AND role IN ('INTERNAL_TEAM', 'ADMIN', 'SUPER_ADMIN')
    )
  );

-- External team can create advancing requests
CREATE POLICY "External team can create advancing requests"
  ON "AdvancingRequest" FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "User"
      WHERE id = auth.uid()::text
      AND role IN ('EXTERNAL_TEAM', 'ADMIN', 'SUPER_ADMIN')
    )
  );

-- Only internal team can approve/reject requests
CREATE POLICY "Internal team can update advancing requests"
  ON "AdvancingRequest" FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM "User"
      WHERE id = auth.uid()::text
      AND role IN ('INTERNAL_TEAM', 'ADMIN', 'SUPER_ADMIN')
    )
  );

-- =====================================================
-- COMPVSS TEAM POLICIES (Enhanced)
-- =====================================================

-- Team members can view their teams
CREATE POLICY "Team members can view their teams"
  ON "Team" FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "TeamMember"
      WHERE "TeamMember"."teamId" = "Team".id
      AND "TeamMember"."userId" = auth.uid()::text
    )
    OR "createdById" = auth.uid()::text
    OR EXISTS (
      SELECT 1 FROM "User"
      WHERE id = auth.uid()::text
      AND role IN ('ADMIN', 'SUPER_ADMIN')
    )
  );

-- =====================================================
-- ASSET POLICIES (Enhanced)
-- =====================================================

-- Project members can view project assets
CREATE POLICY "Project members can view assets"
  ON "Asset" FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "Project"
      WHERE "Project".id = "Asset"."projectId"
      AND (
        "Project"."createdById" = auth.uid()::text
        OR EXISTS (
          SELECT 1 FROM "ProjectMember"
          WHERE "ProjectMember"."projectId" = "Project".id
          AND "ProjectMember"."userId" = auth.uid()::text
        )
      )
    )
    OR EXISTS (
      SELECT 1 FROM "User"
      WHERE id = auth.uid()::text
      AND role IN ('ADMIN', 'SUPER_ADMIN')
    )
  );

-- Internal team can manage assets
CREATE POLICY "Internal team can manage assets"
  ON "Asset" FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM "User"
      WHERE id = auth.uid()::text
      AND role IN ('INTERNAL_TEAM', 'ADMIN', 'SUPER_ADMIN')
    )
  );

-- =====================================================
-- DOCUMENT POLICIES (Enhanced)
-- =====================================================

-- Project members can view project documents
CREATE POLICY "Project members can view documents"
  ON "Document" FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "Project"
      WHERE "Project".id = "Document"."projectId"
      AND (
        "Project"."createdById" = auth.uid()::text
        OR EXISTS (
          SELECT 1 FROM "ProjectMember"
          WHERE "ProjectMember"."projectId" = "Project".id
          AND "ProjectMember"."userId" = auth.uid()::text
        )
      )
    )
    OR "uploadedById" = auth.uid()::text
    OR EXISTS (
      SELECT 1 FROM "User"
      WHERE id = auth.uid()::text
      AND role IN ('ADMIN', 'SUPER_ADMIN')
    )
  );

-- Project members can upload documents
CREATE POLICY "Project members can upload documents"
  ON "Document" FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "Project"
      WHERE "Project".id = "Document"."projectId"
      AND (
        "Project"."createdById" = auth.uid()::text
        OR EXISTS (
          SELECT 1 FROM "ProjectMember"
          WHERE "ProjectMember"."projectId" = "Project".id
          AND "ProjectMember"."userId" = auth.uid()::text
        )
      )
    )
  );

-- =====================================================
-- AUDIT LOG POLICIES
-- =====================================================

-- Users can view their own audit logs
CREATE POLICY "Users can view own audit logs"
  ON "AuditLog" FOR SELECT
  USING (
    "userId" = auth.uid()::text
    OR EXISTS (
      SELECT 1 FROM "User"
      WHERE id = auth.uid()::text
      AND role IN ('ADMIN', 'SUPER_ADMIN')
    )
  );

-- System can create audit logs
CREATE POLICY "System can create audit logs"
  ON "AuditLog" FOR INSERT
  WITH CHECK (true);

-- =====================================================
-- ORGANIZATION MEMBER POLICIES
-- =====================================================

-- Organization members can view their organization
CREATE POLICY "Organization members can view their org"
  ON "OrganizationMember" FOR SELECT
  USING (
    "userId" = auth.uid()::text
    OR EXISTS (
      SELECT 1 FROM "OrganizationMember" AS om
      WHERE om."organizationId" = "OrganizationMember"."organizationId"
      AND om."userId" = auth.uid()::text
      AND om.role IN ('OWNER', 'ADMIN')
    )
  );
