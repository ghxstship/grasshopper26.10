-- =====================================================
-- KPI METRICS - EXTENDED CATEGORIES
-- Ticket/Attendance, Operational, Marketing, Customer Experience, Safety, Sustainability, Technology
-- =====================================================

-- =====================================================
-- TICKET & ATTENDANCE ANALYTICS
-- =====================================================

-- No-Show Rate
CREATE OR REPLACE FUNCTION calculate_no_show_rate(p_event_id TEXT)
RETURNS DECIMAL AS $$
DECLARE
    v_no_shows INTEGER;
    v_tickets_sold INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_tickets_sold
    FROM tickets WHERE "eventId" = p_event_id;
    
    SELECT COUNT(*) INTO v_no_shows
    FROM tickets WHERE "eventId" = p_event_id AND status = 'VALID';
    
    RETURN CASE WHEN v_tickets_sold > 0 THEN (v_no_shows::DECIMAL / v_tickets_sold) * 100 ELSE 0 END;
END;
$$ LANGUAGE plpgsql;

-- Cart Abandonment Rate
CREATE OR REPLACE FUNCTION calculate_cart_abandonment_rate(p_event_id TEXT)
RETURNS DECIMAL AS $$
DECLARE
    v_abandoned_carts INTEGER;
    v_total_carts INTEGER;
BEGIN
    SELECT COUNT(DISTINCT c.id) INTO v_total_carts
    FROM carts c
    INNER JOIN cart_items ci ON ci."cartId" = c.id
    WHERE ci.metadata->>'eventId' = p_event_id;
    
    SELECT COUNT(DISTINCT c.id) INTO v_abandoned_carts
    FROM carts c
    INNER JOIN cart_items ci ON ci."cartId" = c.id
    LEFT JOIN orders o ON o."userId" = c."userId"
    WHERE ci.metadata->>'eventId' = p_event_id
    AND o.id IS NULL;
    
    RETURN CASE WHEN v_total_carts > 0 THEN (v_abandoned_carts::DECIMAL / v_total_carts) * 100 ELSE 0 END;
END;
$$ LANGUAGE plpgsql;

-- Repeat Attendee Rate
CREATE OR REPLACE FUNCTION calculate_repeat_attendee_rate(p_organization_id TEXT)
RETURNS DECIMAL AS $$
DECLARE
    v_repeat_attendees INTEGER;
    v_total_attendees INTEGER;
BEGIN
    SELECT COUNT(DISTINCT t."userId") INTO v_total_attendees
    FROM tickets t
    INNER JOIN events e ON e.id = t."eventId"
    WHERE e."organizationId" = p_organization_id;
    
    SELECT COUNT(DISTINCT t."userId") INTO v_repeat_attendees
    FROM tickets t
    INNER JOIN events e ON e.id = t."eventId"
    WHERE e."organizationId" = p_organization_id
    GROUP BY t."userId"
    HAVING COUNT(DISTINCT t."eventId") > 1;
    
    RETURN CASE WHEN v_total_attendees > 0 THEN (v_repeat_attendees::DECIMAL / v_total_attendees) * 100 ELSE 0 END;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- OPERATIONAL EXCELLENCE
-- =====================================================

-- Project Timeline Adherence
CREATE OR REPLACE FUNCTION calculate_timeline_adherence(p_project_id TEXT)
RETURNS DECIMAL AS $$
DECLARE
    v_on_time INTEGER;
    v_total INTEGER;
BEGIN
    SELECT 
        COUNT(*) FILTER (WHERE "completedAt" <= "dueDate"),
        COUNT(*)
    INTO v_on_time, v_total
    FROM tasks
    WHERE "projectId" = p_project_id AND status = 'COMPLETED';
    
    RETURN CASE WHEN v_total > 0 THEN (v_on_time::DECIMAL / v_total) * 100 ELSE 0 END;
END;
$$ LANGUAGE plpgsql;

-- Staff Utilization Rate
CREATE OR REPLACE FUNCTION calculate_staff_utilization(p_project_id TEXT)
RETURNS DECIMAL AS $$
DECLARE
    v_billable_hours DECIMAL;
    v_total_hours DECIMAL;
BEGIN
    SELECT 
        COALESCE(SUM(hours) FILTER (WHERE billable = true), 0),
        COALESCE(SUM(hours), 0)
    INTO v_billable_hours, v_total_hours
    FROM time_entries te
    INNER JOIN tasks t ON t.id = te."taskId"
    WHERE t."projectId" = p_project_id;
    
    RETURN CASE WHEN v_total_hours > 0 THEN (v_billable_hours / v_total_hours) * 100 ELSE 0 END;
END;
$$ LANGUAGE plpgsql;

-- Vendor Reliability Score
CREATE OR REPLACE FUNCTION calculate_vendor_reliability(p_event_id TEXT)
RETURNS DECIMAL AS $$
DECLARE
    v_on_time_deliveries INTEGER;
    v_total_deliveries INTEGER;
BEGIN
    SELECT 
        COUNT(*) FILTER (WHERE status = 'APPROVED' AND "updatedAt" <= "dueDate"),
        COUNT(*)
    INTO v_on_time_deliveries, v_total_deliveries
    FROM advancing_requests
    WHERE "eventId" = p_event_id;
    
    RETURN CASE WHEN v_total_deliveries > 0 THEN (v_on_time_deliveries::DECIMAL / v_total_deliveries) * 100 ELSE 0 END;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- MARKETING & AUDIENCE ENGAGEMENT
-- =====================================================

-- Website Conversion Rate (requires analytics integration)
CREATE OR REPLACE FUNCTION calculate_website_conversion_rate(p_event_id TEXT)
RETURNS DECIMAL AS $$
BEGIN
    -- Placeholder - would integrate with Google Analytics or similar
    RETURN 0;
END;
$$ LANGUAGE plpgsql;

-- Friend Referral Rate
CREATE OR REPLACE FUNCTION calculate_friend_referral_rate(p_event_id TEXT)
RETURNS DECIMAL AS $$
DECLARE
    v_referred_tickets INTEGER;
    v_total_tickets INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_referred_tickets
    FROM tickets t
    WHERE t."eventId" = p_event_id
    AND t.metadata->>'referralCode' IS NOT NULL;
    
    SELECT COUNT(*) INTO v_total_tickets
    FROM tickets WHERE "eventId" = p_event_id;
    
    RETURN CASE WHEN v_total_tickets > 0 THEN (v_referred_tickets::DECIMAL / v_total_tickets) * 100 ELSE 0 END;
END;
$$ LANGUAGE plpgsql;

-- User-Generated Content Volume
CREATE OR REPLACE FUNCTION calculate_ugc_volume(p_event_id TEXT)
RETURNS INTEGER AS $$
BEGIN
    RETURN (
        SELECT COUNT(*)
        FROM social_posts
        WHERE "eventId" = p_event_id
    );
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- CUSTOMER EXPERIENCE & SATISFACTION
-- =====================================================

-- Overall Satisfaction Score (requires survey data)
CREATE OR REPLACE FUNCTION calculate_satisfaction_score(p_event_id TEXT)
RETURNS DECIMAL AS $$
BEGIN
    -- Placeholder - would calculate from post-event surveys
    RETURN 0;
END;
$$ LANGUAGE plpgsql;

-- Refund Request Rate
CREATE OR REPLACE FUNCTION calculate_refund_request_rate(p_event_id TEXT)
RETURNS DECIMAL AS $$
DECLARE
    v_refund_requests INTEGER;
    v_total_sales INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_refund_requests
    FROM tickets WHERE "eventId" = p_event_id AND status = 'REFUNDED';
    
    SELECT COUNT(*) INTO v_total_sales
    FROM tickets WHERE "eventId" = p_event_id;
    
    RETURN CASE WHEN v_total_sales > 0 THEN (v_refund_requests::DECIMAL / v_total_sales) * 100 ELSE 0 END;
END;
$$ LANGUAGE plpgsql;

-- Customer Churn Rate
CREATE OR REPLACE FUNCTION calculate_customer_churn_rate(p_organization_id TEXT, p_period_months INTEGER DEFAULT 12)
RETURNS DECIMAL AS $$
DECLARE
    v_lost_customers INTEGER;
    v_total_customers INTEGER;
BEGIN
    -- Customers who attended events more than p_period_months ago but not recently
    SELECT COUNT(DISTINCT t."userId") INTO v_lost_customers
    FROM tickets t
    INNER JOIN events e ON e.id = t."eventId"
    WHERE e."organizationId" = p_organization_id
    AND t."createdAt" < NOW() - (p_period_months || ' months')::INTERVAL
    AND t."userId" NOT IN (
        SELECT DISTINCT t2."userId"
        FROM tickets t2
        INNER JOIN events e2 ON e2.id = t2."eventId"
        WHERE e2."organizationId" = p_organization_id
        AND t2."createdAt" >= NOW() - (p_period_months || ' months')::INTERVAL
    );
    
    SELECT COUNT(DISTINCT t."userId") INTO v_total_customers
    FROM tickets t
    INNER JOIN events e ON e.id = t."eventId"
    WHERE e."organizationId" = p_organization_id;
    
    RETURN CASE WHEN v_total_customers > 0 THEN (v_lost_customers::DECIMAL / v_total_customers) * 100 ELSE 0 END;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- SAFETY, RISK & COMPLIANCE
-- =====================================================

-- Incident-Free Event Percentage
CREATE OR REPLACE FUNCTION calculate_incident_free_percentage(p_organization_id TEXT)
RETURNS DECIMAL AS $$
DECLARE
    v_incident_free INTEGER;
    v_total_events INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_total_events
    FROM events WHERE "organizationId" = p_organization_id AND status = 'COMPLETED';
    
    SELECT COUNT(*) INTO v_incident_free
    FROM events e
    WHERE e."organizationId" = p_organization_id
    AND e.status = 'COMPLETED'
    AND NOT EXISTS (
        SELECT 1 FROM issue_reports ir
        INNER JOIN projects p ON p."eventId" = e.id
        WHERE ir.category = 'safety'
    );
    
    RETURN CASE WHEN v_total_events > 0 THEN (v_incident_free::DECIMAL / v_total_events) * 100 ELSE 0 END;
END;
$$ LANGUAGE plpgsql;

-- Security Incident Rate
CREATE OR REPLACE FUNCTION calculate_security_incident_rate(p_event_id TEXT)
RETURNS DECIMAL AS $$
DECLARE
    v_incidents INTEGER;
    v_attendees INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_incidents
    FROM issue_reports ir
    INNER JOIN projects p ON p."eventId" = p_event_id
    WHERE ir.category = 'security';
    
    SELECT COUNT(*) INTO v_attendees
    FROM tickets WHERE "eventId" = p_event_id AND status = 'USED';
    
    RETURN CASE WHEN v_attendees > 0 THEN (v_incidents::DECIMAL / v_attendees) * 100 ELSE 0 END;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- SUSTAINABILITY & SOCIAL IMPACT
-- =====================================================

-- Waste Diversion Rate (requires tracking data)
CREATE OR REPLACE FUNCTION calculate_waste_diversion_rate(p_event_id TEXT)
RETURNS DECIMAL AS $$
BEGIN
    -- Placeholder - would calculate from waste management data
    RETURN 0;
END;
$$ LANGUAGE plpgsql;

-- Local Employment Percentage
CREATE OR REPLACE FUNCTION calculate_local_employment_percentage(p_event_id TEXT)
RETURNS DECIMAL AS $$
DECLARE
    v_local_staff INTEGER;
    v_total_staff INTEGER;
BEGIN
    SELECT COUNT(DISTINCT tm."userId") INTO v_total_staff
    FROM team_members tm
    INNER JOIN teams t ON t.id = tm."teamId"
    INNER JOIN projects p ON p.id = t."projectId"
    WHERE p."eventId" = p_event_id;
    
    -- Assuming metadata tracks local status
    SELECT COUNT(DISTINCT tm."userId") INTO v_local_staff
    FROM team_members tm
    INNER JOIN teams t ON t.id = tm."teamId"
    INNER JOIN projects p ON p.id = t."projectId"
    WHERE p."eventId" = p_event_id
    AND tm.metadata->>'isLocal' = 'true';
    
    RETURN CASE WHEN v_total_staff > 0 THEN (v_local_staff::DECIMAL / v_total_staff) * 100 ELSE 0 END;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TECHNOLOGY & INNOVATION
-- =====================================================

-- Platform Uptime Percentage (requires monitoring data)
CREATE OR REPLACE FUNCTION calculate_platform_uptime()
RETURNS DECIMAL AS $$
BEGIN
    -- Placeholder - would integrate with uptime monitoring service
    RETURN 99.9;
END;
$$ LANGUAGE plpgsql;

-- Mobile App Download Rate
CREATE OR REPLACE FUNCTION calculate_app_download_rate(p_event_id TEXT)
RETURNS DECIMAL AS $$
BEGIN
    -- Placeholder - would integrate with app analytics
    RETURN 0;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- COMPREHENSIVE KPI DASHBOARD VIEW
-- =====================================================

CREATE OR REPLACE VIEW comprehensive_kpi_dashboard AS
SELECT 
    e.id as event_id,
    e.title as event_name,
    e."organizationId",
    e.status,
    
    -- Financial
    calculate_total_event_revenue(e.id) as total_revenue,
    calculate_profit_margin(e.id) as profit_margin,
    calculate_roi(e.id) as roi,
    calculate_per_capita_spending(e.id) as per_capita_spending,
    
    -- Tickets & Attendance
    calculate_attendance_rate(e.id) as attendance_rate,
    calculate_sell_through_rate(e.id) as sell_through_rate,
    calculate_no_show_rate(e.id) as no_show_rate,
    calculate_cart_abandonment_rate(e.id) as cart_abandonment_rate,
    
    -- Marketing
    calculate_social_engagement_rate(e.id) as social_engagement_rate,
    calculate_friend_referral_rate(e.id) as referral_rate,
    calculate_ugc_volume(e.id) as ugc_volume,
    
    -- Customer Experience
    calculate_refund_request_rate(e.id) as refund_rate,
    
    -- Safety
    calculate_security_incident_rate(e.id) as security_incident_rate,
    
    NOW() as last_updated
FROM events e
WHERE e.status IN ('PUBLISHED', 'LIVE', 'COMPLETED');

CREATE INDEX IF NOT EXISTS idx_comprehensive_kpi_event ON comprehensive_kpi_dashboard(event_id);
CREATE INDEX IF NOT EXISTS idx_comprehensive_kpi_org ON comprehensive_kpi_dashboard("organizationId");

-- Function to calculate all KPIs for an event
CREATE OR REPLACE FUNCTION calculate_all_kpis_for_event(p_event_id TEXT)
RETURNS JSONB AS $$
DECLARE
    v_result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'financial', jsonb_build_object(
            'total_revenue', calculate_total_event_revenue(p_event_id),
            'profit_margin', calculate_profit_margin(p_event_id),
            'roi', calculate_roi(p_event_id),
            'per_capita_spending', calculate_per_capita_spending(p_event_id),
            'gross_profit_margin', calculate_gross_profit_margin(p_event_id)
        ),
        'tickets', jsonb_build_object(
            'attendance_rate', calculate_attendance_rate(p_event_id),
            'sell_through_rate', calculate_sell_through_rate(p_event_id),
            'no_show_rate', calculate_no_show_rate(p_event_id),
            'cart_abandonment', calculate_cart_abandonment_rate(p_event_id),
            'avg_ticket_price', calculate_average_ticket_price(p_event_id)
        ),
        'marketing', jsonb_build_object(
            'social_engagement', calculate_social_engagement_rate(p_event_id),
            'referral_rate', calculate_friend_referral_rate(p_event_id),
            'ugc_volume', calculate_ugc_volume(p_event_id),
            'marketing_cpa', calculate_marketing_cpa(p_event_id)
        ),
        'customer_experience', jsonb_build_object(
            'refund_rate', calculate_refund_request_rate(p_event_id)
        ),
        'safety', jsonb_build_object(
            'security_incident_rate', calculate_security_incident_rate(p_event_id)
        )
    ) INTO v_result;
    
    RETURN v_result;
END;
$$ LANGUAGE plpgsql;
