-- =====================================================
-- MATERIALIZED VIEWS
-- Pre-computed views for expensive analytics queries
-- =====================================================

-- Event analytics summary
CREATE MATERIALIZED VIEW IF NOT EXISTS event_analytics AS
SELECT 
    e.id,
    e.title,
    e."organizationId",
    e.status,
    e."startDate",
    COUNT(DISTINCT t.id) as total_tickets,
    COUNT(DISTINCT t.id) FILTER (WHERE t.status = 'VALID') as valid_tickets,
    COUNT(DISTINCT t.id) FILTER (WHERE t.status = 'USED') as used_tickets,
    COUNT(DISTINCT o.id) as total_orders,
    COALESCE(SUM(o.total), 0) as total_revenue,
    COUNT(DISTINCT t."userId") as unique_attendees,
    COUNT(DISTINCT sp.id) as social_posts,
    COUNT(DISTINCT sp.id) FILTER (WHERE sp."createdAt" > NOW() - INTERVAL '7 days') as recent_posts
FROM events e
LEFT JOIN tickets t ON t."eventId" = e.id
LEFT JOIN orders o ON o."eventId" = e.id AND o.status = 'COMPLETED'
LEFT JOIN social_posts sp ON sp."eventId" = e.id
GROUP BY e.id, e.title, e."organizationId", e.status, e."startDate";

CREATE INDEX ON event_analytics("organizationId");
CREATE INDEX ON event_analytics(status);
CREATE INDEX ON event_analytics("startDate");

-- User engagement summary
CREATE MATERIALIZED VIEW IF NOT EXISTS user_engagement AS
SELECT 
    u.id,
    u.email,
    u.name,
    u.role,
    COUNT(DISTINCT t.id) as tickets_purchased,
    COUNT(DISTINCT o.id) as orders_placed,
    COALESCE(SUM(o.total), 0) as total_spent,
    COUNT(DISTINCT sp.id) as posts_created,
    COUNT(DISTINCT sc.id) as comments_made,
    COUNT(DISTINCT sl.id) as likes_given,
    COUNT(DISTINCT f1.id) as following_count,
    COUNT(DISTINCT f2.id) as followers_count,
    MAX(t."createdAt") as last_ticket_purchase,
    MAX(sp."createdAt") as last_post_date
FROM users u
LEFT JOIN tickets t ON t."userId" = u.id
LEFT JOIN orders o ON o."userId" = u.id
LEFT JOIN social_posts sp ON sp."userId" = u.id
LEFT JOIN social_comments sc ON sc."userId" = u.id
LEFT JOIN social_likes sl ON sl."userId" = u.id
LEFT JOIN follows f1 ON f1."followerId" = u.id
LEFT JOIN follows f2 ON f2."followingId" = u.id
GROUP BY u.id, u.email, u.name, u.role;

CREATE INDEX ON user_engagement(role);
CREATE INDEX ON user_engagement(total_spent DESC);
CREATE INDEX ON user_engagement(last_ticket_purchase DESC);

-- Organization performance summary
CREATE MATERIALIZED VIEW IF NOT EXISTS organization_performance AS
SELECT 
    o.id,
    o.name,
    COUNT(DISTINCT e.id) as total_events,
    COUNT(DISTINCT e.id) FILTER (WHERE e.status = 'PUBLISHED') as published_events,
    COUNT(DISTINCT e.id) FILTER (WHERE e.status = 'COMPLETED') as completed_events,
    COUNT(DISTINCT t.id) as total_tickets_sold,
    COALESCE(SUM(ord.total), 0) as total_revenue,
    COUNT(DISTINCT p.id) as total_projects,
    COUNT(DISTINCT om.id) as member_count,
    MAX(e."createdAt") as last_event_created
FROM organizations o
LEFT JOIN events e ON e."organizationId" = o.id
LEFT JOIN tickets t ON t."eventId" = e.id
LEFT JOIN orders ord ON ord."eventId" = e.id AND ord.status = 'COMPLETED'
LEFT JOIN projects p ON p."organizationId" = o.id
LEFT JOIN organization_members om ON om."organizationId" = o.id
GROUP BY o.id, o.name;

CREATE INDEX ON organization_performance(total_revenue DESC);
CREATE INDEX ON organization_performance(total_events DESC);

-- Product sales summary
CREATE MATERIALIZED VIEW IF NOT EXISTS product_sales AS
SELECT 
    p.id,
    p.name,
    p.category,
    p.price,
    p.stock,
    COUNT(DISTINCT ci.id) as times_added_to_cart,
    COUNT(DISTINCT oi.id) as times_ordered,
    COALESCE(SUM(oi.quantity), 0) as total_quantity_sold,
    COALESCE(SUM(oi.price * oi.quantity), 0) as total_revenue,
    AVG(oi.price) as average_sale_price,
    MAX(oi."createdAt") as last_sold_date
FROM products p
LEFT JOIN cart_items ci ON ci."productId" = p.id
LEFT JOIN order_items oi ON oi."productId" = p.id
GROUP BY p.id, p.name, p.category, p.price, p.stock;

CREATE INDEX ON product_sales(category);
CREATE INDEX ON product_sales(total_revenue DESC);
CREATE INDEX ON product_sales(total_quantity_sold DESC);

-- Project budget tracking
CREATE MATERIALIZED VIEW IF NOT EXISTS project_budget_tracking AS
SELECT 
    p.id,
    p.name,
    p."organizationId",
    p.status,
    COUNT(DISTINCT b.id) as budget_count,
    COALESCE(SUM(b.allocated), 0) as total_allocated,
    COALESCE(SUM(b.spent), 0) as total_spent,
    COALESCE(SUM(b.allocated - b.spent), 0) as remaining_budget,
    COUNT(DISTINCT e.id) as expense_count,
    COUNT(DISTINCT e.id) FILTER (WHERE e.status = 'PENDING') as pending_expenses,
    COUNT(DISTINCT e.id) FILTER (WHERE e.status = 'APPROVED') as approved_expenses
FROM projects p
LEFT JOIN budgets b ON b."projectId" = p.id
LEFT JOIN expenses e ON e."budgetId" = b.id
GROUP BY p.id, p.name, p."organizationId", p.status;

CREATE INDEX ON project_budget_tracking("organizationId");
CREATE INDEX ON project_budget_tracking(status);

-- Refresh function for all materialized views
CREATE OR REPLACE FUNCTION refresh_all_materialized_views()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY event_analytics;
    REFRESH MATERIALIZED VIEW CONCURRENTLY user_engagement;
    REFRESH MATERIALIZED VIEW CONCURRENTLY organization_performance;
    REFRESH MATERIALIZED VIEW CONCURRENTLY product_sales;
    REFRESH MATERIALIZED VIEW CONCURRENTLY project_budget_tracking;
END;
$$ LANGUAGE plpgsql;

-- Schedule automatic refresh (requires pg_cron extension)
-- Uncomment if pg_cron is available:
-- SELECT cron.schedule('refresh-analytics', '0 * * * *', 'SELECT refresh_all_materialized_views()');
