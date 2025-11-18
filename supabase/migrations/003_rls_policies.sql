-- =====================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- Comprehensive security policies for all tables
-- =====================================================

-- Enable RLS on all tables
-- =====================================================

-- Shared tables
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Session" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Account" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "VerificationToken" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Wallet" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Credential" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Organization" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OrganizationMember" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Notification" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AuditLog" ENABLE ROW LEVEL SECURITY;

-- GVTEWAY tables
ALTER TABLE "Event" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "EventCategory" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Venue" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Artist" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "EventArtist" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Ticket" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TicketType" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Order" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OrderItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "NFTTicket" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Product" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CartItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Wishlist" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Membership" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "MembershipTier" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SocialPost" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SocialComment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SocialLike" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SocialFollow" ENABLE ROW LEVEL SECURITY;

-- COMPVSS tables
ALTER TABLE "Team" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TeamMember" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AdvancingRequest" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AccessCredentialRequest" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SiteInfrastructureRequest" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SiteAssetRequest" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SiteUtilityRequest" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SiteVehicleRequest" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "HeavyEquipmentRequest" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TechnicalProductionRequest" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "HospitalityRequest" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TravelLogisticsRequest" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "DayOfShowTask" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "IssueReport" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ExpenseReport" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "QRCode" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "QRScan" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Affiliate" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Referral" ENABLE ROW LEVEL SECURITY;

-- ATLVS tables
ALTER TABLE "Project" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ProjectMember" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Task" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TaskAssignment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TaskComment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Budget" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "BudgetCategory" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Expense" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Asset" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AssetBooking" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Document" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "DocumentVersion" ENABLE ROW LEVEL SECURITY;

-- N8N tables
ALTER TABLE "Workflow" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "WorkflowExecution" ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- USER POLICIES
-- =====================================================

-- Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON "User" FOR SELECT
  USING (auth.uid()::text = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON "User" FOR UPDATE
  USING (auth.uid()::text = id);

-- Admins can view all users
CREATE POLICY "Admins can view all users"
  ON "User" FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "User"
      WHERE id = auth.uid()::text
      AND role = 'ADMIN'
    )
  );

-- =====================================================
-- SESSION POLICIES
-- =====================================================

-- Users can view their own sessions
CREATE POLICY "Users can view own sessions"
  ON "Session" FOR SELECT
  USING (auth.uid()::text = "userId");

-- Users can delete their own sessions
CREATE POLICY "Users can delete own sessions"
  ON "Session" FOR DELETE
  USING (auth.uid()::text = "userId");

-- =====================================================
-- WALLET POLICIES
-- =====================================================

-- Users can view their own wallets
CREATE POLICY "Users can view own wallets"
  ON "Wallet" FOR SELECT
  USING (auth.uid()::text = "userId");

-- Users can update their own wallets
CREATE POLICY "Users can update own wallets"
  ON "Wallet" FOR UPDATE
  USING (auth.uid()::text = "userId");

-- Users can create their own wallets
CREATE POLICY "Users can create own wallets"
  ON "Wallet" FOR INSERT
  WITH CHECK (auth.uid()::text = "userId");

-- =====================================================
-- NOTIFICATION POLICIES
-- =====================================================

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications"
  ON "Notification" FOR SELECT
  USING (auth.uid()::text = "userId");

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
  ON "Notification" FOR UPDATE
  USING (auth.uid()::text = "userId");

-- Users can delete their own notifications
CREATE POLICY "Users can delete own notifications"
  ON "Notification" FOR DELETE
  USING (auth.uid()::text = "userId");

-- =====================================================
-- GVTEWAY EVENT POLICIES
-- =====================================================

-- Everyone can view published events
CREATE POLICY "Anyone can view published events"
  ON "Event" FOR SELECT
  USING (status = 'PUBLISHED');

-- Organizers can view their own events
CREATE POLICY "Organizers can view own events"
  ON "Event" FOR SELECT
  USING (
    auth.uid()::text = "organizerId"
    OR EXISTS (
      SELECT 1 FROM "User"
      WHERE id = auth.uid()::text
      AND role IN ('ADMIN', 'ORGANIZER')
    )
  );

-- Organizers can create events
CREATE POLICY "Organizers can create events"
  ON "Event" FOR INSERT
  WITH CHECK (
    auth.uid()::text = "organizerId"
    OR EXISTS (
      SELECT 1 FROM "User"
      WHERE id = auth.uid()::text
      AND role IN ('ADMIN', 'ORGANIZER')
    )
  );

-- Organizers can update their own events
CREATE POLICY "Organizers can update own events"
  ON "Event" FOR UPDATE
  USING (
    auth.uid()::text = "organizerId"
    OR EXISTS (
      SELECT 1 FROM "User"
      WHERE id = auth.uid()::text
      AND role = 'ADMIN'
    )
  );

-- Organizers can delete their own events
CREATE POLICY "Organizers can delete own events"
  ON "Event" FOR DELETE
  USING (
    auth.uid()::text = "organizerId"
    OR EXISTS (
      SELECT 1 FROM "User"
      WHERE id = auth.uid()::text
      AND role = 'ADMIN'
    )
  );

-- =====================================================
-- TICKET POLICIES
-- =====================================================

-- Users can view their own tickets
CREATE POLICY "Users can view own tickets"
  ON "Ticket" FOR SELECT
  USING (auth.uid()::text = "userId");

-- Users can update their own tickets (transfer)
CREATE POLICY "Users can update own tickets"
  ON "Ticket" FOR UPDATE
  USING (auth.uid()::text = "userId");

-- Organizers can view tickets for their events
CREATE POLICY "Organizers can view event tickets"
  ON "Ticket" FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "Event"
      WHERE "Event".id = "Ticket"."eventId"
      AND "Event"."organizerId" = auth.uid()::text
    )
  );

-- =====================================================
-- ORDER POLICIES
-- =====================================================

-- Users can view their own orders
CREATE POLICY "Users can view own orders"
  ON "Order" FOR SELECT
  USING (auth.uid()::text = "userId");

-- Users can create their own orders
CREATE POLICY "Users can create own orders"
  ON "Order" FOR INSERT
  WITH CHECK (auth.uid()::text = "userId");

-- Users can update their own orders
CREATE POLICY "Users can update own orders"
  ON "Order" FOR UPDATE
  USING (auth.uid()::text = "userId");

-- =====================================================
-- SOCIAL POLICIES
-- =====================================================

-- Everyone can view public posts
CREATE POLICY "Anyone can view public posts"
  ON "SocialPost" FOR SELECT
  USING (visibility = 'PUBLIC');

-- Users can view their own posts
CREATE POLICY "Users can view own posts"
  ON "SocialPost" FOR SELECT
  USING (auth.uid()::text = "userId");

-- Users can create posts
CREATE POLICY "Users can create posts"
  ON "SocialPost" FOR INSERT
  WITH CHECK (auth.uid()::text = "userId");

-- Users can update their own posts
CREATE POLICY "Users can update own posts"
  ON "SocialPost" FOR UPDATE
  USING (auth.uid()::text = "userId");

-- Users can delete their own posts
CREATE POLICY "Users can delete own posts"
  ON "SocialPost" FOR DELETE
  USING (auth.uid()::text = "userId");

-- Users can like posts
CREATE POLICY "Users can like posts"
  ON "SocialLike" FOR INSERT
  WITH CHECK (auth.uid()::text = "userId");

-- Users can unlike posts
CREATE POLICY "Users can unlike posts"
  ON "SocialLike" FOR DELETE
  USING (auth.uid()::text = "userId");

-- Users can follow other users
CREATE POLICY "Users can follow others"
  ON "SocialFollow" FOR INSERT
  WITH CHECK (auth.uid()::text = "followerId");

-- Users can unfollow other users
CREATE POLICY "Users can unfollow others"
  ON "SocialFollow" FOR DELETE
  USING (auth.uid()::text = "followerId");

-- =====================================================
-- COMPVSS TEAM POLICIES
-- =====================================================

-- Team members can view their teams
CREATE POLICY "Team members can view own teams"
  ON "Team" FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "TeamMember"
      WHERE "TeamMember"."teamId" = "Team".id
      AND "TeamMember"."userId" = auth.uid()::text
    )
  );

-- Team members can view team members
CREATE POLICY "Team members can view team members"
  ON "TeamMember" FOR SELECT
  USING (
    auth.uid()::text = "userId"
    OR EXISTS (
      SELECT 1 FROM "TeamMember" tm
      WHERE tm."teamId" = "TeamMember"."teamId"
      AND tm."userId" = auth.uid()::text
    )
  );

-- =====================================================
-- ADVANCING REQUEST POLICIES
-- =====================================================

-- Team members can view advancing requests for their teams
CREATE POLICY "Team members can view team advancing requests"
  ON "AdvancingRequest" FOR SELECT
  USING (
    auth.uid()::text = "requesterId"
    OR EXISTS (
      SELECT 1 FROM "TeamMember"
      WHERE "TeamMember"."teamId" = "AdvancingRequest"."teamId"
      AND "TeamMember"."userId" = auth.uid()::text
    )
  );

-- Team members can create advancing requests
CREATE POLICY "Team members can create advancing requests"
  ON "AdvancingRequest" FOR INSERT
  WITH CHECK (auth.uid()::text = "requesterId");

-- Requesters can update their own requests
CREATE POLICY "Requesters can update own requests"
  ON "AdvancingRequest" FOR UPDATE
  USING (auth.uid()::text = "requesterId");

-- Production managers can update all requests
CREATE POLICY "Production managers can update all requests"
  ON "AdvancingRequest" FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM "User"
      WHERE id = auth.uid()::text
      AND role IN ('ADMIN', 'PRODUCTION_MANAGER')
    )
  );

-- =====================================================
-- ISSUE REPORT POLICIES
-- =====================================================

-- Team members can view issue reports for their teams
CREATE POLICY "Team members can view team issue reports"
  ON "IssueReport" FOR SELECT
  USING (
    auth.uid()::text = "reporterId"
    OR EXISTS (
      SELECT 1 FROM "TeamMember"
      WHERE "TeamMember"."teamId" = "IssueReport"."teamId"
      AND "TeamMember"."userId" = auth.uid()::text
    )
  );

-- Team members can create issue reports
CREATE POLICY "Team members can create issue reports"
  ON "IssueReport" FOR INSERT
  WITH CHECK (auth.uid()::text = "reporterId");

-- Reporters can update their own reports
CREATE POLICY "Reporters can update own reports"
  ON "IssueReport" FOR UPDATE
  USING (auth.uid()::text = "reporterId");

-- =====================================================
-- EXPENSE REPORT POLICIES
-- =====================================================

-- Team members can view their own expense reports
CREATE POLICY "Team members can view own expense reports"
  ON "ExpenseReport" FOR SELECT
  USING (auth.uid()::text = "userId");

-- Team members can create expense reports
CREATE POLICY "Team members can create expense reports"
  ON "ExpenseReport" FOR INSERT
  WITH CHECK (auth.uid()::text = "userId");

-- Users can update their own expense reports
CREATE POLICY "Users can update own expense reports"
  ON "ExpenseReport" FOR UPDATE
  USING (auth.uid()::text = "userId");

-- Managers can view all expense reports
CREATE POLICY "Managers can view all expense reports"
  ON "ExpenseReport" FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "User"
      WHERE id = auth.uid()::text
      AND role IN ('ADMIN', 'PRODUCTION_MANAGER')
    )
  );

-- =====================================================
-- ATLVS PROJECT POLICIES
-- =====================================================

-- Project members can view their projects
CREATE POLICY "Project members can view own projects"
  ON "Project" FOR SELECT
  USING (
    auth.uid()::text = "ownerId"
    OR EXISTS (
      SELECT 1 FROM "ProjectMember"
      WHERE "ProjectMember"."projectId" = "Project".id
      AND "ProjectMember"."userId" = auth.uid()::text
    )
  );

-- Users can create projects
CREATE POLICY "Users can create projects"
  ON "Project" FOR INSERT
  WITH CHECK (auth.uid()::text = "ownerId");

-- Project owners can update their projects
CREATE POLICY "Project owners can update own projects"
  ON "Project" FOR UPDATE
  USING (auth.uid()::text = "ownerId");

-- Project owners can delete their projects
CREATE POLICY "Project owners can delete own projects"
  ON "Project" FOR DELETE
  USING (auth.uid()::text = "ownerId");

-- =====================================================
-- TASK POLICIES
-- =====================================================

-- Project members can view tasks in their projects
CREATE POLICY "Project members can view project tasks"
  ON "Task" FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "Project"
      WHERE "Project".id = "Task"."projectId"
      AND (
        "Project"."ownerId" = auth.uid()::text
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
        "Project"."ownerId" = auth.uid()::text
        OR EXISTS (
          SELECT 1 FROM "ProjectMember"
          WHERE "ProjectMember"."projectId" = "Project".id
          AND "ProjectMember"."userId" = auth.uid()::text
        )
      )
    )
  );

-- Project members can update tasks
CREATE POLICY "Project members can update tasks"
  ON "Task" FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM "Project"
      WHERE "Project".id = "Task"."projectId"
      AND (
        "Project"."ownerId" = auth.uid()::text
        OR EXISTS (
          SELECT 1 FROM "ProjectMember"
          WHERE "ProjectMember"."projectId" = "Project".id
          AND "ProjectMember"."userId" = auth.uid()::text
        )
      )
    )
  );

-- =====================================================
-- BUDGET POLICIES
-- =====================================================

-- Project members can view project budgets
CREATE POLICY "Project members can view project budgets"
  ON "Budget" FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "Project"
      WHERE "Project".id = "Budget"."projectId"
      AND (
        "Project"."ownerId" = auth.uid()::text
        OR EXISTS (
          SELECT 1 FROM "ProjectMember"
          WHERE "ProjectMember"."projectId" = "Project".id
          AND "ProjectMember"."userId" = auth.uid()::text
        )
      )
    )
  );

-- Project owners can create budgets
CREATE POLICY "Project owners can create budgets"
  ON "Budget" FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "Project"
      WHERE "Project".id = "Budget"."projectId"
      AND "Project"."ownerId" = auth.uid()::text
    )
  );

-- Project owners can update budgets
CREATE POLICY "Project owners can update budgets"
  ON "Budget" FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM "Project"
      WHERE "Project".id = "Budget"."projectId"
      AND "Project"."ownerId" = auth.uid()::text
    )
  );

-- =====================================================
-- DOCUMENT POLICIES
-- =====================================================

-- Project members can view project documents
CREATE POLICY "Project members can view project documents"
  ON "Document" FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "Project"
      WHERE "Project".id = "Document"."projectId"
      AND (
        "Project"."ownerId" = auth.uid()::text
        OR EXISTS (
          SELECT 1 FROM "ProjectMember"
          WHERE "ProjectMember"."projectId" = "Project".id
          AND "ProjectMember"."userId" = auth.uid()::text
        )
      )
    )
  );

-- Project members can upload documents
CREATE POLICY "Project members can upload documents"
  ON "Document" FOR INSERT
  WITH CHECK (
    auth.uid()::text = "uploadedBy"
    AND EXISTS (
      SELECT 1 FROM "Project"
      WHERE "Project".id = "Document"."projectId"
      AND (
        "Project"."ownerId" = auth.uid()::text
        OR EXISTS (
          SELECT 1 FROM "ProjectMember"
          WHERE "ProjectMember"."projectId" = "Project".id
          AND "ProjectMember"."userId" = auth.uid()::text
        )
      )
    )
  );

-- Document uploaders can update their documents
CREATE POLICY "Document uploaders can update own documents"
  ON "Document" FOR UPDATE
  USING (auth.uid()::text = "uploadedBy");

-- =====================================================
-- WORKFLOW POLICIES
-- =====================================================

-- Users can view their own workflows
CREATE POLICY "Users can view own workflows"
  ON "Workflow" FOR SELECT
  USING (auth.uid()::text = "createdBy");

-- Users can create workflows
CREATE POLICY "Users can create workflows"
  ON "Workflow" FOR INSERT
  WITH CHECK (auth.uid()::text = "createdBy");

-- Users can update their own workflows
CREATE POLICY "Users can update own workflows"
  ON "Workflow" FOR UPDATE
  USING (auth.uid()::text = "createdBy");

-- Users can delete their own workflows
CREATE POLICY "Users can delete own workflows"
  ON "Workflow" FOR DELETE
  USING (auth.uid()::text = "createdBy");

-- Admins can view all workflows
CREATE POLICY "Admins can view all workflows"
  ON "Workflow" FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "User"
      WHERE id = auth.uid()::text
      AND role = 'ADMIN'
    )
  );

-- =====================================================
-- AUDIT LOG POLICIES
-- =====================================================

-- Users can view their own audit logs
CREATE POLICY "Users can view own audit logs"
  ON "AuditLog" FOR SELECT
  USING (auth.uid()::text = "userId");

-- Admins can view all audit logs
CREATE POLICY "Admins can view all audit logs"
  ON "AuditLog" FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "User"
      WHERE id = auth.uid()::text
      AND role = 'ADMIN'
    )
  );

-- System can insert audit logs
CREATE POLICY "System can insert audit logs"
  ON "AuditLog" FOR INSERT
  WITH CHECK (true);
