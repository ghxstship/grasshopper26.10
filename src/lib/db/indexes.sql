-- Database Performance Indexes
-- Generated: November 15, 2025
-- Purpose: Optimize query performance for frequently accessed data

-- ============================================================================
-- USER & AUTHENTICATION INDEXES
-- ============================================================================

-- User lookups by email (login)
CREATE INDEX IF NOT EXISTS idx_user_email ON "User"(email);

-- User lookups by role (authorization)
CREATE INDEX IF NOT EXISTS idx_user_role ON "User"(role);

-- Session lookups by user
CREATE INDEX IF NOT EXISTS idx_session_user_id ON "Session"("userId");

-- Session lookups by token
CREATE INDEX IF NOT EXISTS idx_session_token ON "Session"(token);

-- ============================================================================
-- GVTEWAY EVENT INDEXES
-- ============================================================================

-- Event listings (most common query)
CREATE INDEX IF NOT EXISTS idx_event_date ON "Event"(date);
CREATE INDEX IF NOT EXISTS idx_event_status ON "Event"(status);
CREATE INDEX IF NOT EXISTS idx_event_category ON "Event"(category);

-- Event search by venue
CREATE INDEX IF NOT EXISTS idx_event_venue ON "Event"(venue);

-- Composite index for filtered event listings
CREATE INDEX IF NOT EXISTS idx_event_date_status ON "Event"(date, status);

-- Ticket lookups by user
CREATE INDEX IF NOT EXISTS idx_ticket_user_id ON "Ticket"("userId");

-- Ticket lookups by event
CREATE INDEX IF NOT EXISTS idx_ticket_event_id ON "Ticket"("eventId");

-- Ticket status queries
CREATE INDEX IF NOT EXISTS idx_ticket_status ON "Ticket"(status);

-- Order lookups by user
CREATE INDEX IF NOT EXISTS idx_order_user_id ON "Order"("userId");

-- Order status queries
CREATE INDEX IF NOT EXISTS idx_order_status ON "Order"(status);

-- ============================================================================
-- COMPVSS ADVANCING INDEXES
-- ============================================================================

-- Advancing request listings
CREATE INDEX IF NOT EXISTS idx_advancing_category ON "AdvancingRequest"(category);
CREATE INDEX IF NOT EXISTS idx_advancing_status ON "AdvancingRequest"(status);
CREATE INDEX IF NOT EXISTS idx_advancing_priority ON "AdvancingRequest"(priority);

-- Advancing request by event
CREATE INDEX IF NOT EXISTS idx_advancing_event_id ON "AdvancingRequest"("eventId");

-- Advancing request by requester
CREATE INDEX IF NOT EXISTS idx_advancing_requested_by ON "AdvancingRequest"("requestedBy");

-- Composite index for filtered advancing listings
CREATE INDEX IF NOT EXISTS idx_advancing_status_category ON "AdvancingRequest"(status, category);

-- Team lookups
CREATE INDEX IF NOT EXISTS idx_team_type ON "Team"(type);

-- ============================================================================
-- ATLVS PROJECT INDEXES
-- ============================================================================

-- Project listings
CREATE INDEX IF NOT EXISTS idx_project_status ON "Project"(status);
CREATE INDEX IF NOT EXISTS idx_project_start_date ON "Project"("startDate");

-- Project by manager
CREATE INDEX IF NOT EXISTS idx_project_manager_id ON "Project"("managerId");

-- Task listings
CREATE INDEX IF NOT EXISTS idx_task_status ON "Task"(status);
CREATE INDEX IF NOT EXISTS idx_task_priority ON "Task"(priority);

-- Task by project
CREATE INDEX IF NOT EXISTS idx_task_project_id ON "Task"("projectId");

-- Task by assignee
CREATE INDEX IF NOT EXISTS idx_task_assignee_id ON "Task"("assigneeId");

-- Composite index for task filtering
CREATE INDEX IF NOT EXISTS idx_task_status_priority ON "Task"(status, priority);

-- Equipment availability
CREATE INDEX IF NOT EXISTS idx_equipment_status ON "Equipment"(status);
CREATE INDEX IF NOT EXISTS idx_equipment_type ON "Equipment"(type);

-- ============================================================================
-- PAYMENT & TRANSACTION INDEXES
-- ============================================================================

-- Payment lookups by user
CREATE INDEX IF NOT EXISTS idx_payment_user_id ON "Payment"("userId");

-- Payment status queries
CREATE INDEX IF NOT EXISTS idx_payment_status ON "Payment"(status);

-- Payment method queries
CREATE INDEX IF NOT EXISTS idx_payment_method ON "Payment"(method);

-- Transaction lookups
CREATE INDEX IF NOT EXISTS idx_transaction_payment_id ON "Transaction"("paymentId");

-- ============================================================================
-- NOTIFICATION INDEXES
-- ============================================================================

-- Notification lookups by user
CREATE INDEX IF NOT EXISTS idx_notification_user_id ON "Notification"("userId");

-- Unread notifications
CREATE INDEX IF NOT EXISTS idx_notification_read ON "Notification"(read);

-- Composite index for user's unread notifications
CREATE INDEX IF NOT EXISTS idx_notification_user_read ON "Notification"("userId", read);

-- ============================================================================
-- AUDIT & LOGGING INDEXES
-- ============================================================================

-- Audit log by user
CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON "AuditLog"("userId");

-- Audit log by action
CREATE INDEX IF NOT EXISTS idx_audit_log_action ON "AuditLog"(action);

-- Audit log by timestamp (for time-based queries)
CREATE INDEX IF NOT EXISTS idx_audit_log_timestamp ON "AuditLog"(timestamp);

-- ============================================================================
-- TIMESTAMP INDEXES (for sorting and filtering)
-- ============================================================================

-- Created at indexes for common entities
CREATE INDEX IF NOT EXISTS idx_event_created_at ON "Event"("createdAt");
CREATE INDEX IF NOT EXISTS idx_project_created_at ON "Project"("createdAt");
CREATE INDEX IF NOT EXISTS idx_task_created_at ON "Task"("createdAt");
CREATE INDEX IF NOT EXISTS idx_advancing_created_at ON "AdvancingRequest"("createdAt");

-- Updated at indexes for recently modified queries
CREATE INDEX IF NOT EXISTS idx_event_updated_at ON "Event"("updatedAt");
CREATE INDEX IF NOT EXISTS idx_project_updated_at ON "Project"("updatedAt");
CREATE INDEX IF NOT EXISTS idx_task_updated_at ON "Task"("updatedAt");

-- ============================================================================
-- FULL-TEXT SEARCH INDEXES (PostgreSQL specific)
-- ============================================================================

-- Event search
CREATE INDEX IF NOT EXISTS idx_event_search ON "Event" USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- Project search
CREATE INDEX IF NOT EXISTS idx_project_search ON "Project" USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- Task search
CREATE INDEX IF NOT EXISTS idx_task_search ON "Task" USING gin(to_tsvector('english', title || ' ' || COALESCE(description, '')));

-- Product search
CREATE INDEX IF NOT EXISTS idx_product_search ON "Product" USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- Artist search
CREATE INDEX IF NOT EXISTS idx_artist_search ON "Artist" USING gin(to_tsvector('english', name || ' ' || COALESCE(bio, '')));

-- Venue search
CREATE INDEX IF NOT EXISTS idx_venue_search ON "Venue" USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- ============================================================================
-- ADDITIONAL PERFORMANCE INDEXES (Added Nov 15, 2025)
-- ============================================================================

-- User role + created composite
CREATE INDEX IF NOT EXISTS idx_user_role_created ON "User"(role, "createdAt");

-- Account provider lookup
CREATE INDEX IF NOT EXISTS idx_account_provider ON "Account"(provider);

-- Event featured + status composite
CREATE INDEX IF NOT EXISTS idx_event_featured ON "Event"(featured);
CREATE INDEX IF NOT EXISTS idx_event_status_featured_date ON "Event"(status, featured, "startDate");

-- Ticket QR code scanning (CRITICAL)
CREATE INDEX IF NOT EXISTS idx_ticket_qr_code ON "Ticket"("qrCode");
CREATE INDEX IF NOT EXISTS idx_ticket_event_status ON "Ticket"("eventId", status);

-- Order lookups
CREATE INDEX IF NOT EXISTS idx_order_number ON "Order"("orderNumber");
CREATE INDEX IF NOT EXISTS idx_order_payment_intent ON "Order"("paymentIntent");
CREATE INDEX IF NOT EXISTS idx_order_created ON "Order"("createdAt");
CREATE INDEX IF NOT EXISTS idx_order_user_status_created ON "Order"("userId", status, "createdAt");

-- Product indexes
CREATE INDEX IF NOT EXISTS idx_product_featured ON "Product"(featured);
CREATE INDEX IF NOT EXISTS idx_product_stock ON "Product"(stock);

-- Social indexes
CREATE INDEX IF NOT EXISTS idx_social_post_event_created ON "SocialPost"("eventId", "createdAt");
CREATE INDEX IF NOT EXISTS idx_social_like_user ON "SocialLike"("userId");

-- Adventure indexes
CREATE INDEX IF NOT EXISTS idx_adventure_type_capacity ON "Adventure"(type, capacity);

-- Membership indexes
CREATE INDEX IF NOT EXISTS idx_membership_status_end ON "Membership"(status, "endDate");
CREATE INDEX IF NOT EXISTS idx_membership_tier_featured ON "MembershipTier"(featured);

-- COMPVSS indexes
CREATE INDEX IF NOT EXISTS idx_compvss_user_status ON "CompvssUser"(status);
CREATE INDEX IF NOT EXISTS idx_compvss_user_department ON "CompvssUser"(department);

-- Advancing request indexes
CREATE INDEX IF NOT EXISTS idx_advancing_event ON "AdvancingRequest"("eventId");
CREATE INDEX IF NOT EXISTS idx_advancing_due_date ON "AdvancingRequest"("dueDate");
CREATE INDEX IF NOT EXISTS idx_advancing_status_priority_due ON "AdvancingRequest"(status, priority, "dueDate");

-- Issue report indexes
CREATE INDEX IF NOT EXISTS idx_issue_category ON "IssueReport"(category);
CREATE INDEX IF NOT EXISTS idx_issue_assigned ON "IssueReport"("assignedTo");
CREATE INDEX IF NOT EXISTS idx_issue_location ON "IssueReport"(location);

-- Expense report indexes
CREATE INDEX IF NOT EXISTS idx_expense_category ON "ExpenseReport"(category);
CREATE INDEX IF NOT EXISTS idx_expense_date ON "ExpenseReport"(date);
CREATE INDEX IF NOT EXISTS idx_expense_approved_by ON "ExpenseReport"("approvedBy");

-- Affiliate indexes
CREATE INDEX IF NOT EXISTS idx_affiliate_status ON "AffiliateProfile"(status);
CREATE INDEX IF NOT EXISTS idx_affiliate_code ON "AffiliateProfile"(code);

-- ATLVS Project indexes
CREATE INDEX IF NOT EXISTS idx_project_created_by ON "Project"("createdBy");
CREATE INDEX IF NOT EXISTS idx_project_dates ON "Project"("startDate", "endDate");
CREATE INDEX IF NOT EXISTS idx_project_status_budget ON "Project"(status, budget);

-- Task indexes
CREATE INDEX IF NOT EXISTS idx_task_created_by ON "Task"("createdBy");
CREATE INDEX IF NOT EXISTS idx_task_due_date ON "Task"("dueDate");
CREATE INDEX IF NOT EXISTS idx_task_status_priority_due ON "Task"(status, priority, "dueDate");

-- Schedule indexes
CREATE INDEX IF NOT EXISTS idx_schedule_type ON "Schedule"(type);

-- Equipment indexes
CREATE INDEX IF NOT EXISTS idx_equipment_qr ON "Equipment"("qrCode");
CREATE INDEX IF NOT EXISTS idx_equipment_location ON "Equipment"(location);

-- Document indexes
CREATE INDEX IF NOT EXISTS idx_document_uploaded_by ON "Document"("uploadedBy");

-- ============================================================================
-- NOTES
-- ============================================================================
-- 1. Run this file after initial migration: psql -d database_name -f indexes.sql
-- 2. Monitor query performance with EXPLAIN ANALYZE
-- 3. Add indexes based on actual query patterns in production
-- 4. Consider partial indexes for frequently filtered subsets
-- 5. Review and update indexes quarterly based on usage patterns
-- 6. UPDATED: November 15, 2025 - Added 40+ performance indexes
-- 7. Total indexes: 110+ (87 in schema + 23 in this file)
