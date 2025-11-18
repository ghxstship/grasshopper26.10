-- =====================================================
-- PERFORMANCE INDEXES
-- Additional indexes for query optimization
-- =====================================================

-- User indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role_created ON users(role, "createdAt");

-- Session indexes
CREATE INDEX IF NOT EXISTS idx_sessions_user_expires ON sessions("userId", expires);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions("sessionToken");

-- Event indexes
CREATE INDEX IF NOT EXISTS idx_events_status_date ON events(status, "startDate");
CREATE INDEX IF NOT EXISTS idx_events_venue ON events("venueId");
CREATE INDEX IF NOT EXISTS idx_events_organization ON events("organizationId");
CREATE INDEX IF NOT EXISTS idx_events_category ON events("categoryId");
CREATE INDEX IF NOT EXISTS idx_events_featured ON events("isFeatured", "startDate") WHERE "isFeatured" = true;

-- Ticket indexes
CREATE INDEX IF NOT EXISTS idx_tickets_user ON tickets("userId");
CREATE INDEX IF NOT EXISTS idx_tickets_event ON tickets("eventId");
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_qr ON tickets("qrCode");
CREATE INDEX IF NOT EXISTS idx_tickets_order ON tickets("orderId");

-- Order indexes
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders("userId");
CREATE INDEX IF NOT EXISTS idx_orders_status_created ON orders(status, "createdAt");
CREATE INDEX IF NOT EXISTS idx_orders_event ON orders("eventId");

-- Product indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products("isFeatured") WHERE "isFeatured" = true;
CREATE INDEX IF NOT EXISTS idx_products_stock ON products(stock);

-- Cart indexes
CREATE INDEX IF NOT EXISTS idx_carts_user ON carts("userId");
CREATE INDEX IF NOT EXISTS idx_cart_items_cart ON cart_items("cartId");
CREATE INDEX IF NOT EXISTS idx_cart_items_product ON cart_items("productId");

-- Social indexes
CREATE INDEX IF NOT EXISTS idx_social_posts_user ON social_posts("userId");
CREATE INDEX IF NOT EXISTS idx_social_posts_created ON social_posts("createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_social_comments_post ON social_comments("postId");
CREATE INDEX IF NOT EXISTS idx_social_comments_user ON social_comments("userId");
CREATE INDEX IF NOT EXISTS idx_social_likes_post ON social_likes("postId");
CREATE INDEX IF NOT EXISTS idx_social_likes_user ON social_likes("userId");
CREATE INDEX IF NOT EXISTS idx_follows_follower ON follows("followerId");
CREATE INDEX IF NOT EXISTS idx_follows_following ON follows("followingId");

-- Membership indexes
CREATE INDEX IF NOT EXISTS idx_memberships_user ON memberships("userId");
CREATE INDEX IF NOT EXISTS idx_memberships_tier ON memberships("tierId");
CREATE INDEX IF NOT EXISTS idx_memberships_status ON memberships(status);
CREATE INDEX IF NOT EXISTS idx_memberships_expires ON memberships("expiresAt");

-- Notification indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications("userId");
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications("readAt");
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications("createdAt" DESC);

-- Advancing Request indexes
CREATE INDEX IF NOT EXISTS idx_advancing_user ON advancing_requests("userId");
CREATE INDEX IF NOT EXISTS idx_advancing_status ON advancing_requests(status);
CREATE INDEX IF NOT EXISTS idx_advancing_category ON advancing_requests(category);
CREATE INDEX IF NOT EXISTS idx_advancing_event ON advancing_requests("eventId");
CREATE INDEX IF NOT EXISTS idx_advancing_assigned ON advancing_requests("assignedToId");

-- Project indexes
CREATE INDEX IF NOT EXISTS idx_projects_organization ON projects("organizationId");
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_created_by ON projects("createdById");
CREATE INDEX IF NOT EXISTS idx_projects_dates ON projects("startDate", "endDate");

-- Task indexes
CREATE INDEX IF NOT EXISTS idx_tasks_project ON tasks("projectId");
CREATE INDEX IF NOT EXISTS idx_tasks_assignee ON tasks("assigneeId");
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks("dueDate");

-- Budget indexes
CREATE INDEX IF NOT EXISTS idx_budgets_project ON budgets("projectId");
CREATE INDEX IF NOT EXISTS idx_budgets_category ON budgets("categoryId");
CREATE INDEX IF NOT EXISTS idx_expenses_budget ON expenses("budgetId");
CREATE INDEX IF NOT EXISTS idx_expenses_status ON expenses(status);

-- Asset indexes
CREATE INDEX IF NOT EXISTS idx_assets_organization ON assets("organizationId");
CREATE INDEX IF NOT EXISTS idx_assets_status ON assets(status);
CREATE INDEX IF NOT EXISTS idx_asset_bookings_asset ON asset_bookings("assetId");
CREATE INDEX IF NOT EXISTS idx_asset_bookings_dates ON asset_bookings("startDate", "endDate");

-- Document indexes
CREATE INDEX IF NOT EXISTS idx_documents_project ON documents("projectId");
CREATE INDEX IF NOT EXISTS idx_documents_uploaded_by ON documents("uploadedById");
CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(type);

-- Affiliate indexes
CREATE INDEX IF NOT EXISTS idx_affiliates_user ON affiliate_profiles("userId");
CREATE INDEX IF NOT EXISTS idx_affiliates_status ON affiliate_profiles(status);
CREATE INDEX IF NOT EXISTS idx_referrals_affiliate ON referral_links("affiliateId");
CREATE INDEX IF NOT EXISTS idx_referrals_code ON referral_links(code);

-- QR Code indexes
CREATE INDEX IF NOT EXISTS idx_qr_codes_user ON qr_codes("userId");
CREATE INDEX IF NOT EXISTS idx_qr_codes_event ON qr_codes("eventId");
CREATE INDEX IF NOT EXISTS idx_qr_codes_type ON qr_codes(type);
CREATE INDEX IF NOT EXISTS idx_qr_scans_code ON qr_scans("qrCodeId");

-- Audit Log indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs("userId");
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs("entityType", "entityId");
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs("createdAt" DESC);

-- Wallet indexes
CREATE INDEX IF NOT EXISTS idx_wallets_user ON wallets("userId");
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_wallet ON wallet_transactions("walletId");
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_created ON wallet_transactions("createdAt" DESC);

-- Opportunity indexes
CREATE INDEX IF NOT EXISTS idx_opportunities_organization ON opportunities("organizationId");
CREATE INDEX IF NOT EXISTS idx_opportunities_category ON opportunities(category);
CREATE INDEX IF NOT EXISTS idx_opportunities_status ON opportunities(status);
CREATE INDEX IF NOT EXISTS idx_opportunity_applications_opportunity ON opportunity_applications("opportunityId");
CREATE INDEX IF NOT EXISTS idx_opportunity_applications_user ON opportunity_applications("userId");
CREATE INDEX IF NOT EXISTS idx_opportunity_applications_status ON opportunity_applications(status);
