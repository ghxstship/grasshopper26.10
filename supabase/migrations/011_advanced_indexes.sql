-- =====================================================
-- ADVANCED INDEXES
-- Specialized indexes for complex queries
-- =====================================================

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_events_org_status_date ON events("organizationId", status, "startDate");
CREATE INDEX IF NOT EXISTS idx_tickets_user_event_status ON tickets("userId", "eventId", status);
CREATE INDEX IF NOT EXISTS idx_orders_user_status_date ON orders("userId", status, "createdAt" DESC);

-- Partial indexes for active/published content
CREATE INDEX IF NOT EXISTS idx_events_published ON events("startDate") WHERE status = 'PUBLISHED';
CREATE INDEX IF NOT EXISTS idx_events_upcoming ON events("startDate") WHERE status = 'PUBLISHED' AND "startDate" > NOW();
CREATE INDEX IF NOT EXISTS idx_memberships_active ON memberships("userId", "tierId") WHERE status = 'ACTIVE';
CREATE INDEX IF NOT EXISTS idx_tickets_valid ON tickets("eventId", "userId") WHERE status = 'VALID';

-- Trigram indexes for fuzzy search (requires pg_trgm extension)
CREATE INDEX IF NOT EXISTS idx_events_title_trgm ON events USING gin(title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_users_name_trgm ON users USING gin(name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_artists_name_trgm ON artists USING gin(name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_venues_name_trgm ON venues USING gin(name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_products_name_trgm ON products USING gin(name gin_trgm_ops);

-- JSONB indexes for metadata queries
CREATE INDEX IF NOT EXISTS idx_events_metadata ON events USING gin(metadata);
CREATE INDEX IF NOT EXISTS idx_tickets_metadata ON tickets USING gin(metadata);
CREATE INDEX IF NOT EXISTS idx_orders_metadata ON orders USING gin(metadata);
CREATE INDEX IF NOT EXISTS idx_advancing_metadata ON advancing_requests USING gin(metadata);

-- Expression indexes for computed values
CREATE INDEX IF NOT EXISTS idx_events_date_range ON events USING gist(tsrange("startDate", "endDate"));
CREATE INDEX IF NOT EXISTS idx_memberships_active_period ON memberships USING gist(tsrange("startDate", "endDate"));
CREATE INDEX IF NOT EXISTS idx_asset_bookings_period ON asset_bookings USING gist(tsrange("startDate", "endDate"));

-- Covering indexes for common queries (include frequently accessed columns)
CREATE INDEX IF NOT EXISTS idx_tickets_event_user_cover ON tickets("eventId", "userId") INCLUDE (status, "qrCode", "createdAt");
CREATE INDEX IF NOT EXISTS idx_orders_user_cover ON orders("userId") INCLUDE (status, total, "createdAt");

-- Hash indexes for exact equality lookups
CREATE INDEX IF NOT EXISTS idx_tickets_qr_hash ON tickets USING hash("qrCode");
CREATE INDEX IF NOT EXISTS idx_referral_code_hash ON referral_links USING hash(code);

-- Descending indexes for recent-first queries
CREATE INDEX IF NOT EXISTS idx_notifications_user_recent ON notifications("userId", "createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_social_posts_recent ON social_posts("createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_recent ON audit_logs("createdAt" DESC);

-- Multi-column indexes for filtering and sorting
CREATE INDEX IF NOT EXISTS idx_tasks_project_status_priority ON tasks("projectId", status, priority, "dueDate");
CREATE INDEX IF NOT EXISTS idx_expenses_budget_status_date ON expenses("budgetId", status, "createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_advancing_event_status_priority ON advancing_requests("eventId", status, priority, "dueDate");

-- Indexes for analytics queries
CREATE INDEX IF NOT EXISTS idx_orders_date_status_total ON orders("createdAt", status) INCLUDE (total);
CREATE INDEX IF NOT EXISTS idx_tickets_event_date ON tickets("eventId", "createdAt");
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_date ON wallet_transactions("walletId", "createdAt" DESC);

-- Unique partial indexes for business constraints
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_active_membership ON memberships("userId", "tierId") WHERE status = 'ACTIVE';
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_primary_wallet ON crypto_wallets("userId") WHERE "isPrimary" = true;
