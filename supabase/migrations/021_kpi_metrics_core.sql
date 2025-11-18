-- =====================================================
-- KPI METRICS - CORE 20 METRICS
-- Foundation for comprehensive KPI tracking and analytics
-- =====================================================

-- Create KPI metrics table for storing calculated metrics
CREATE TABLE IF NOT EXISTS kpi_metrics (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    metric_name TEXT NOT NULL,
    metric_category TEXT NOT NULL,
    metric_value DECIMAL(15, 4),
    metric_unit TEXT,
    event_id TEXT,
    organization_id TEXT,
    project_id TEXT,
    period_start TIMESTAMPTZ,
    period_end TIMESTAMPTZ,
    calculation_time TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_kpi_metrics_name ON kpi_metrics(metric_name, calculation_time);
CREATE INDEX IF NOT EXISTS idx_kpi_metrics_event ON kpi_metrics(event_id, metric_name);
CREATE INDEX IF NOT EXISTS idx_kpi_metrics_org ON kpi_metrics(organization_id, metric_name);
CREATE INDEX IF NOT EXISTS idx_kpi_metrics_category ON kpi_metrics(metric_category, calculation_time);
CREATE INDEX IF NOT EXISTS idx_kpi_metrics_period ON kpi_metrics(period_start, period_end);

-- =====================================================
-- FINANCIAL PERFORMANCE KPIs (1-5)
-- =====================================================

-- 1. Total Event Revenue
CREATE OR REPLACE FUNCTION calculate_total_event_revenue(p_event_id TEXT)
RETURNS DECIMAL AS $$
DECLARE
    v_revenue DECIMAL;
BEGIN
    SELECT COALESCE(
        SUM(o.total),
        0
    ) INTO v_revenue
    FROM orders o
    WHERE o."eventId" = p_event_id
    AND o.status = 'COMPLETED';
    
    RETURN v_revenue;
END;
$$ LANGUAGE plpgsql;

-- 2. Cost Per Attendee (CPA)
CREATE OR REPLACE FUNCTION calculate_cost_per_attendee(p_event_id TEXT)
RETURNS DECIMAL AS $$
DECLARE
    v_total_costs DECIMAL;
    v_attendees INTEGER;
BEGIN
    -- Get total costs from budgets/expenses
    SELECT COALESCE(SUM(e.amount), 0) INTO v_total_costs
    FROM expenses e
    INNER JOIN budgets b ON b.id = e."budgetId"
    INNER JOIN projects p ON p.id = b."projectId"
    WHERE p."eventId" = p_event_id
    AND e.status = 'APPROVED';
    
    -- Get actual attendees (tickets used)
    SELECT COUNT(*) INTO v_attendees
    FROM tickets t
    WHERE t."eventId" = p_event_id
    AND t.status = 'USED';
    
    IF v_attendees = 0 THEN
        RETURN 0;
    END IF;
    
    RETURN v_total_costs / v_attendees;
END;
$$ LANGUAGE plpgsql;

-- 3. Profit Margin Percentage
CREATE OR REPLACE FUNCTION calculate_profit_margin(p_event_id TEXT)
RETURNS DECIMAL AS $$
DECLARE
    v_revenue DECIMAL;
    v_costs DECIMAL;
BEGIN
    v_revenue := calculate_total_event_revenue(p_event_id);
    
    SELECT COALESCE(SUM(e.amount), 0) INTO v_costs
    FROM expenses e
    INNER JOIN budgets b ON b.id = e."budgetId"
    INNER JOIN projects p ON p.id = b."projectId"
    WHERE p."eventId" = p_event_id
    AND e.status = 'APPROVED';
    
    IF v_revenue = 0 THEN
        RETURN 0;
    END IF;
    
    RETURN ((v_revenue - v_costs) / v_revenue) * 100;
END;
$$ LANGUAGE plpgsql;

-- 4. Revenue Per Available Hour (RevPAH)
CREATE OR REPLACE FUNCTION calculate_revpah(p_event_id TEXT)
RETURNS DECIMAL AS $$
DECLARE
    v_revenue DECIMAL;
    v_duration_hours DECIMAL;
BEGIN
    v_revenue := calculate_total_event_revenue(p_event_id);
    
    SELECT EXTRACT(EPOCH FROM (e."endDate" - e."startDate")) / 3600 INTO v_duration_hours
    FROM events e
    WHERE e.id = p_event_id;
    
    IF v_duration_hours = 0 THEN
        RETURN 0;
    END IF;
    
    RETURN v_revenue / v_duration_hours;
END;
$$ LANGUAGE plpgsql;

-- 5. Return on Investment (ROI)
CREATE OR REPLACE FUNCTION calculate_roi(p_event_id TEXT)
RETURNS DECIMAL AS $$
DECLARE
    v_revenue DECIMAL;
    v_investment DECIMAL;
    v_net_profit DECIMAL;
BEGIN
    v_revenue := calculate_total_event_revenue(p_event_id);
    
    SELECT COALESCE(SUM(e.amount), 0) INTO v_investment
    FROM expenses e
    INNER JOIN budgets b ON b.id = e."budgetId"
    INNER JOIN projects p ON p.id = b."projectId"
    WHERE p."eventId" = p_event_id
    AND e.status = 'APPROVED';
    
    v_net_profit := v_revenue - v_investment;
    
    IF v_investment = 0 THEN
        RETURN 0;
    END IF;
    
    RETURN (v_net_profit / v_investment) * 100;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TICKET & ATTENDANCE METRICS (6-10)
-- =====================================================

-- 6. Ticket Sales Conversion Rate
CREATE OR REPLACE FUNCTION calculate_ticket_conversion_rate(p_event_id TEXT)
RETURNS DECIMAL AS $$
DECLARE
    v_tickets_sold INTEGER;
    v_total_visits INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_tickets_sold
    FROM tickets t
    WHERE t."eventId" = p_event_id;
    
    -- Estimate visits from analytics or use a tracking table
    -- For now, using cart items as proxy for visits
    SELECT COUNT(DISTINCT ci."cartId") INTO v_total_visits
    FROM cart_items ci
    INNER JOIN carts c ON c.id = ci."cartId"
    INNER JOIN tickets t ON t."eventId" = p_event_id;
    
    IF v_total_visits = 0 THEN
        RETURN 0;
    END IF;
    
    RETURN (v_tickets_sold::DECIMAL / v_total_visits) * 100;
END;
$$ LANGUAGE plpgsql;

-- 7. Attendance Rate
CREATE OR REPLACE FUNCTION calculate_attendance_rate(p_event_id TEXT)
RETURNS DECIMAL AS $$
DECLARE
    v_actual_attendees INTEGER;
    v_tickets_sold INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_actual_attendees
    FROM tickets t
    WHERE t."eventId" = p_event_id
    AND t.status = 'USED';
    
    SELECT COUNT(*) INTO v_tickets_sold
    FROM tickets t
    WHERE t."eventId" = p_event_id;
    
    IF v_tickets_sold = 0 THEN
        RETURN 0;
    END IF;
    
    RETURN (v_actual_attendees::DECIMAL / v_tickets_sold) * 100;
END;
$$ LANGUAGE plpgsql;

-- 8. Average Ticket Price (ATP)
CREATE OR REPLACE FUNCTION calculate_average_ticket_price(p_event_id TEXT)
RETURNS DECIMAL AS $$
DECLARE
    v_total_revenue DECIMAL;
    v_tickets_sold INTEGER;
BEGIN
    SELECT COALESCE(SUM(oi.price), 0) INTO v_total_revenue
    FROM order_items oi
    INNER JOIN tickets t ON t."orderId" = oi."orderId"
    WHERE t."eventId" = p_event_id;
    
    SELECT COUNT(*) INTO v_tickets_sold
    FROM tickets t
    WHERE t."eventId" = p_event_id;
    
    IF v_tickets_sold = 0 THEN
        RETURN 0;
    END IF;
    
    RETURN v_total_revenue / v_tickets_sold;
END;
$$ LANGUAGE plpgsql;

-- 9. Sell-Through Rate
CREATE OR REPLACE FUNCTION calculate_sell_through_rate(p_event_id TEXT)
RETURNS DECIMAL AS $$
DECLARE
    v_tickets_sold INTEGER;
    v_capacity INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_tickets_sold
    FROM tickets t
    WHERE t."eventId" = p_event_id;
    
    SELECT capacity INTO v_capacity
    FROM events e
    WHERE e.id = p_event_id;
    
    IF v_capacity = 0 OR v_capacity IS NULL THEN
        RETURN 0;
    END IF;
    
    RETURN (v_tickets_sold::DECIMAL / v_capacity) * 100;
END;
$$ LANGUAGE plpgsql;

-- 10. Early Bird Conversion Rate
CREATE OR REPLACE FUNCTION calculate_early_bird_rate(p_event_id TEXT)
RETURNS DECIMAL AS $$
DECLARE
    v_early_bird_sales INTEGER;
    v_capacity INTEGER;
BEGIN
    -- Assuming early bird tickets have specific metadata or created before a certain date
    SELECT COUNT(*) INTO v_early_bird_sales
    FROM tickets t
    WHERE t."eventId" = p_event_id
    AND t."createdAt" < (
        SELECT e."startDate" - INTERVAL '30 days'
        FROM events e
        WHERE e.id = p_event_id
    );
    
    SELECT capacity INTO v_capacity
    FROM events e
    WHERE e.id = p_event_id;
    
    IF v_capacity = 0 OR v_capacity IS NULL THEN
        RETURN 0;
    END IF;
    
    RETURN (v_early_bird_sales::DECIMAL / v_capacity) * 100;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- OPERATIONAL EFFICIENCY (11-15)
-- =====================================================

-- 11. Staff-to-Attendee Ratio
CREATE OR REPLACE FUNCTION calculate_staff_to_attendee_ratio(p_event_id TEXT)
RETURNS DECIMAL AS $$
DECLARE
    v_staff_count INTEGER;
    v_attendees INTEGER;
BEGIN
    -- Get staff from team members assigned to event project
    SELECT COUNT(DISTINCT tm."userId") INTO v_staff_count
    FROM team_members tm
    INNER JOIN teams t ON t.id = tm."teamId"
    INNER JOIN projects p ON p.id = t."projectId"
    WHERE p."eventId" = p_event_id;
    
    SELECT COUNT(*) INTO v_attendees
    FROM tickets t
    WHERE t."eventId" = p_event_id
    AND t.status = 'USED';
    
    IF v_attendees = 0 THEN
        RETURN 0;
    END IF;
    
    RETURN v_staff_count::DECIMAL / v_attendees;
END;
$$ LANGUAGE plpgsql;

-- 12. Setup Time Efficiency
CREATE OR REPLACE FUNCTION calculate_setup_time_efficiency(p_project_id TEXT)
RETURNS DECIMAL AS $$
DECLARE
    v_planned_hours DECIMAL;
    v_actual_hours DECIMAL;
BEGIN
    -- Get planned setup time from project timeline
    SELECT COALESCE(
        SUM(EXTRACT(EPOCH FROM (t."dueDate" - t."createdAt")) / 3600),
        0
    ) INTO v_planned_hours
    FROM tasks t
    WHERE t."projectId" = p_project_id
    AND t.title ILIKE '%setup%';
    
    -- Get actual time from time entries
    SELECT COALESCE(SUM(te.hours), 0) INTO v_actual_hours
    FROM time_entries te
    INNER JOIN tasks t ON t.id = te."taskId"
    WHERE t."projectId" = p_project_id
    AND t.title ILIKE '%setup%';
    
    IF v_actual_hours = 0 THEN
        RETURN 0;
    END IF;
    
    RETURN (v_planned_hours / v_actual_hours) * 100;
END;
$$ LANGUAGE plpgsql;

-- 13. Vendor Response Time (average days)
CREATE OR REPLACE FUNCTION calculate_vendor_response_time(p_event_id TEXT)
RETURNS DECIMAL AS $$
DECLARE
    v_avg_response_days DECIMAL;
BEGIN
    -- Calculate from advancing requests
    SELECT AVG(EXTRACT(DAY FROM (ar."updatedAt" - ar."createdAt")))
    INTO v_avg_response_days
    FROM advancing_requests ar
    WHERE ar."eventId" = p_event_id
    AND ar.status IN ('APPROVED', 'COMPLETED');
    
    RETURN COALESCE(v_avg_response_days, 0);
END;
$$ LANGUAGE plpgsql;

-- 14. Schedule Adherence Rate
CREATE OR REPLACE FUNCTION calculate_schedule_adherence(p_project_id TEXT)
RETURNS DECIMAL AS $$
DECLARE
    v_on_time_milestones INTEGER;
    v_total_milestones INTEGER;
BEGIN
    SELECT 
        COUNT(*) FILTER (WHERE t."completedAt" <= t."dueDate"),
        COUNT(*)
    INTO v_on_time_milestones, v_total_milestones
    FROM tasks t
    WHERE t."projectId" = p_project_id
    AND t.status = 'COMPLETED'
    AND t."dueDate" IS NOT NULL;
    
    IF v_total_milestones = 0 THEN
        RETURN 0;
    END IF;
    
    RETURN (v_on_time_milestones::DECIMAL / v_total_milestones) * 100;
END;
$$ LANGUAGE plpgsql;

-- 15. Task Completion Rate
CREATE OR REPLACE FUNCTION calculate_task_completion_rate(p_project_id TEXT)
RETURNS DECIMAL AS $$
DECLARE
    v_completed_tasks INTEGER;
    v_total_tasks INTEGER;
BEGIN
    SELECT 
        COUNT(*) FILTER (WHERE status = 'COMPLETED'),
        COUNT(*)
    INTO v_completed_tasks, v_total_tasks
    FROM tasks t
    WHERE t."projectId" = p_project_id;
    
    IF v_total_tasks = 0 THEN
        RETURN 0;
    END IF;
    
    RETURN (v_completed_tasks::DECIMAL / v_total_tasks) * 100;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- MARKETING & ENGAGEMENT (16-20)
-- =====================================================

-- 16. Social Media Engagement Rate
CREATE OR REPLACE FUNCTION calculate_social_engagement_rate(p_event_id TEXT)
RETURNS DECIMAL AS $$
DECLARE
    v_interactions INTEGER;
    v_impressions INTEGER;
BEGIN
    SELECT 
        COUNT(sl.id) + COUNT(sc.id),
        COUNT(DISTINCT sp."userId")
    INTO v_interactions, v_impressions
    FROM social_posts sp
    LEFT JOIN social_likes sl ON sl."postId" = sp.id
    LEFT JOIN social_comments sc ON sc."postId" = sp.id
    WHERE sp."eventId" = p_event_id;
    
    IF v_impressions = 0 THEN
        RETURN 0;
    END IF;
    
    RETURN (v_interactions::DECIMAL / v_impressions) * 100;
END;
$$ LANGUAGE plpgsql;

-- 17. Email Campaign CTR (placeholder - requires email tracking)
CREATE OR REPLACE FUNCTION calculate_email_ctr(p_event_id TEXT)
RETURNS DECIMAL AS $$
BEGIN
    -- This would integrate with email service (SendGrid, etc.)
    -- Placeholder returning 0
    RETURN 0;
END;
$$ LANGUAGE plpgsql;

-- 18. Net Promoter Score (NPS) - requires survey data
CREATE OR REPLACE FUNCTION calculate_nps(p_event_id TEXT)
RETURNS DECIMAL AS $$
BEGIN
    -- This would calculate from survey responses
    -- Placeholder returning 0
    RETURN 0;
END;
$$ LANGUAGE plpgsql;

-- 19. Brand Mention Velocity
CREATE OR REPLACE FUNCTION calculate_brand_mention_velocity(p_event_id TEXT)
RETURNS DECIMAL AS $$
DECLARE
    v_mentions_per_day DECIMAL;
    v_campaign_days INTEGER;
BEGIN
    SELECT 
        COUNT(*),
        EXTRACT(DAY FROM (MAX(sp."createdAt") - MIN(sp."createdAt")))
    INTO v_mentions_per_day, v_campaign_days
    FROM social_posts sp
    WHERE sp."eventId" = p_event_id;
    
    IF v_campaign_days = 0 THEN
        RETURN v_mentions_per_day;
    END IF;
    
    RETURN v_mentions_per_day / v_campaign_days;
END;
$$ LANGUAGE plpgsql;

-- 20. Marketing Cost Per Acquisition
CREATE OR REPLACE FUNCTION calculate_marketing_cpa(p_event_id TEXT)
RETURNS DECIMAL AS $$
DECLARE
    v_marketing_spend DECIMAL;
    v_tickets_sold INTEGER;
BEGIN
    -- Get marketing expenses
    SELECT COALESCE(SUM(e.amount), 0) INTO v_marketing_spend
    FROM expenses e
    INNER JOIN budgets b ON b.id = e."budgetId"
    INNER JOIN projects p ON p.id = b."projectId"
    WHERE p."eventId" = p_event_id
    AND e.category ILIKE '%marketing%';
    
    SELECT COUNT(*) INTO v_tickets_sold
    FROM tickets t
    WHERE t."eventId" = p_event_id;
    
    IF v_tickets_sold = 0 THEN
        RETURN 0;
    END IF;
    
    RETURN v_marketing_spend / v_tickets_sold;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- BATCH CALCULATION FUNCTION
-- =====================================================

CREATE OR REPLACE FUNCTION calculate_all_core_kpis(p_event_id TEXT)
RETURNS TABLE (
    metric_name TEXT,
    metric_value DECIMAL,
    metric_unit TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 'Total Event Revenue'::TEXT, calculate_total_event_revenue(p_event_id), 'USD'::TEXT
    UNION ALL SELECT 'Cost Per Attendee', calculate_cost_per_attendee(p_event_id), 'USD'
    UNION ALL SELECT 'Profit Margin', calculate_profit_margin(p_event_id), '%'
    UNION ALL SELECT 'Revenue Per Hour', calculate_revpah(p_event_id), 'USD/hr'
    UNION ALL SELECT 'ROI', calculate_roi(p_event_id), '%'
    UNION ALL SELECT 'Ticket Conversion Rate', calculate_ticket_conversion_rate(p_event_id), '%'
    UNION ALL SELECT 'Attendance Rate', calculate_attendance_rate(p_event_id), '%'
    UNION ALL SELECT 'Average Ticket Price', calculate_average_ticket_price(p_event_id), 'USD'
    UNION ALL SELECT 'Sell-Through Rate', calculate_sell_through_rate(p_event_id), '%'
    UNION ALL SELECT 'Early Bird Rate', calculate_early_bird_rate(p_event_id), '%'
    UNION ALL SELECT 'Social Engagement Rate', calculate_social_engagement_rate(p_event_id), '%'
    UNION ALL SELECT 'Brand Mention Velocity', calculate_brand_mention_velocity(p_event_id), 'mentions/day'
    UNION ALL SELECT 'Marketing CPA', calculate_marketing_cpa(p_event_id), 'USD';
END;
$$ LANGUAGE plpgsql;

-- Create materialized view for KPI dashboard
CREATE MATERIALIZED VIEW IF NOT EXISTS kpi_dashboard AS
SELECT 
    e.id as event_id,
    e.title as event_name,
    e."organizationId",
    calculate_total_event_revenue(e.id) as total_revenue,
    calculate_profit_margin(e.id) as profit_margin,
    calculate_roi(e.id) as roi,
    calculate_attendance_rate(e.id) as attendance_rate,
    calculate_sell_through_rate(e.id) as sell_through_rate,
    calculate_social_engagement_rate(e.id) as social_engagement,
    NOW() as last_updated
FROM events e
WHERE e.status IN ('PUBLISHED', 'LIVE', 'COMPLETED');

CREATE INDEX IF NOT EXISTS idx_kpi_dashboard_event ON kpi_dashboard(event_id);
CREATE INDEX IF NOT EXISTS idx_kpi_dashboard_org ON kpi_dashboard("organizationId");

-- Function to refresh KPI dashboard
CREATE OR REPLACE FUNCTION refresh_kpi_dashboard()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY kpi_dashboard;
END;
$$ LANGUAGE plpgsql;
