-- =====================================================
-- ADVANCED ANALYTICS
-- Window functions, CTEs, and complex aggregations
-- =====================================================

-- Revenue analytics with running totals
CREATE OR REPLACE VIEW revenue_analytics AS
WITH daily_revenue AS (
    SELECT 
        DATE("createdAt") as date,
        SUM(total) as daily_total,
        COUNT(*) as order_count
    FROM orders
    WHERE status = 'COMPLETED'
    GROUP BY DATE("createdAt")
)
SELECT 
    date,
    daily_total,
    order_count,
    SUM(daily_total) OVER (ORDER BY date) as cumulative_revenue,
    AVG(daily_total) OVER (ORDER BY date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) as seven_day_avg,
    LAG(daily_total, 1) OVER (ORDER BY date) as previous_day,
    ((daily_total - LAG(daily_total, 1) OVER (ORDER BY date)) / NULLIF(LAG(daily_total, 1) OVER (ORDER BY date), 0)) * 100 as day_over_day_change
FROM daily_revenue
ORDER BY date DESC;

-- User cohort analysis
CREATE OR REPLACE VIEW user_cohorts AS
WITH user_cohorts AS (
    SELECT 
        u.id,
        DATE_TRUNC('month', u."createdAt") as cohort_month,
        DATE_TRUNC('month', o."createdAt") as order_month
    FROM users u
    LEFT JOIN orders o ON o."userId" = u.id
    WHERE o.status = 'COMPLETED'
),
cohort_sizes AS (
    SELECT 
        cohort_month,
        COUNT(DISTINCT id) as cohort_size
    FROM user_cohorts
    GROUP BY cohort_month
)
SELECT 
    uc.cohort_month,
    uc.order_month,
    COUNT(DISTINCT uc.id) as active_users,
    cs.cohort_size,
    ROUND((COUNT(DISTINCT uc.id)::DECIMAL / cs.cohort_size) * 100, 2) as retention_rate,
    EXTRACT(MONTH FROM AGE(uc.order_month, uc.cohort_month)) as months_since_signup
FROM user_cohorts uc
JOIN cohort_sizes cs ON cs.cohort_month = uc.cohort_month
GROUP BY uc.cohort_month, uc.order_month, cs.cohort_size
ORDER BY uc.cohort_month DESC, uc.order_month;

-- Event performance ranking
CREATE OR REPLACE VIEW event_performance_ranking AS
SELECT 
    e.id,
    e.title,
    e."organizationId",
    COUNT(DISTINCT t.id) as tickets_sold,
    COALESCE(SUM(o.total), 0) as revenue,
    COUNT(DISTINCT t."userId") as unique_attendees,
    DENSE_RANK() OVER (PARTITION BY e."organizationId" ORDER BY COALESCE(SUM(o.total), 0) DESC) as revenue_rank,
    PERCENT_RANK() OVER (PARTITION BY e."organizationId" ORDER BY COUNT(DISTINCT t.id)) as ticket_percentile,
    AVG(COALESCE(SUM(o.total), 0)) OVER (PARTITION BY e."organizationId") as org_avg_revenue
FROM events e
LEFT JOIN tickets t ON t."eventId" = e.id
LEFT JOIN orders o ON o."eventId" = e.id AND o.status = 'COMPLETED'
GROUP BY e.id, e.title, e."organizationId";

-- Product sales velocity
CREATE OR REPLACE VIEW product_sales_velocity AS
WITH product_sales AS (
    SELECT 
        p.id,
        p.name,
        DATE_TRUNC('week', oi."createdAt") as week,
        SUM(oi.quantity) as units_sold,
        SUM(oi.price * oi.quantity) as revenue
    FROM products p
    LEFT JOIN order_items oi ON oi."productId" = p.id
    GROUP BY p.id, p.name, DATE_TRUNC('week', oi."createdAt")
)
SELECT 
    id,
    name,
    week,
    units_sold,
    revenue,
    LAG(units_sold, 1) OVER (PARTITION BY id ORDER BY week) as prev_week_units,
    LAG(units_sold, 4) OVER (PARTITION BY id ORDER BY week) as four_weeks_ago_units,
    AVG(units_sold) OVER (PARTITION BY id ORDER BY week ROWS BETWEEN 3 PRECEDING AND CURRENT ROW) as four_week_avg,
    CASE 
        WHEN LAG(units_sold, 1) OVER (PARTITION BY id ORDER BY week) > 0 
        THEN ((units_sold - LAG(units_sold, 1) OVER (PARTITION BY id ORDER BY week))::DECIMAL / LAG(units_sold, 1) OVER (PARTITION BY id ORDER BY week)) * 100
        ELSE NULL
    END as week_over_week_growth
FROM product_sales
ORDER BY id, week DESC;

-- User lifetime value calculation
CREATE OR REPLACE FUNCTION calculate_user_ltv(p_user_id TEXT)
RETURNS TABLE (
    user_id TEXT,
    total_orders INTEGER,
    total_spent DECIMAL,
    avg_order_value DECIMAL,
    first_order_date TIMESTAMPTZ,
    last_order_date TIMESTAMPTZ,
    customer_lifetime_days INTEGER,
    predicted_ltv DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    WITH user_orders AS (
        SELECT 
            o."userId",
            COUNT(*) as order_count,
            SUM(o.total) as total_revenue,
            AVG(o.total) as avg_order,
            MIN(o."createdAt") as first_order,
            MAX(o."createdAt") as last_order,
            EXTRACT(DAY FROM MAX(o."createdAt") - MIN(o."createdAt")) as lifetime_days
        FROM orders o
        WHERE o."userId" = p_user_id
        AND o.status = 'COMPLETED'
        GROUP BY o."userId"
    )
    SELECT 
        uo."userId",
        uo.order_count::INTEGER,
        uo.total_revenue,
        uo.avg_order,
        uo.first_order,
        uo.last_order,
        uo.lifetime_days::INTEGER,
        -- Simple LTV prediction: avg_order * (lifetime_days / 365) * 2
        (uo.avg_order * (uo.lifetime_days / 365.0) * 2)::DECIMAL as predicted_ltv
    FROM user_orders uo;
END;
$$ LANGUAGE plpgsql;

-- Funnel analysis
CREATE OR REPLACE VIEW conversion_funnel AS
WITH funnel_steps AS (
    SELECT 
        COUNT(DISTINCT u.id) as total_users,
        COUNT(DISTINCT CASE WHEN ci.id IS NOT NULL THEN u.id END) as users_with_cart,
        COUNT(DISTINCT CASE WHEN o.id IS NOT NULL THEN u.id END) as users_with_orders,
        COUNT(DISTINCT CASE WHEN o.status = 'COMPLETED' THEN u.id END) as users_completed_purchase,
        COUNT(DISTINCT CASE WHEN t.id IS NOT NULL THEN u.id END) as users_with_tickets
    FROM users u
    LEFT JOIN cart_items ci ON ci."cartId" IN (SELECT id FROM carts WHERE "userId" = u.id)
    LEFT JOIN orders o ON o."userId" = u.id
    LEFT JOIN tickets t ON t."userId" = u.id
)
SELECT 
    'Total Users' as step,
    total_users as count,
    100.0 as conversion_rate,
    0.0 as drop_off_rate
FROM funnel_steps
UNION ALL
SELECT 
    'Added to Cart',
    users_with_cart,
    (users_with_cart::DECIMAL / NULLIF(total_users, 0)) * 100,
    ((total_users - users_with_cart)::DECIMAL / NULLIF(total_users, 0)) * 100
FROM funnel_steps
UNION ALL
SELECT 
    'Started Checkout',
    users_with_orders,
    (users_with_orders::DECIMAL / NULLIF(total_users, 0)) * 100,
    ((users_with_cart - users_with_orders)::DECIMAL / NULLIF(users_with_cart, 0)) * 100
FROM funnel_steps
UNION ALL
SELECT 
    'Completed Purchase',
    users_completed_purchase,
    (users_completed_purchase::DECIMAL / NULLIF(total_users, 0)) * 100,
    ((users_with_orders - users_completed_purchase)::DECIMAL / NULLIF(users_with_orders, 0)) * 100
FROM funnel_steps
UNION ALL
SELECT 
    'Received Tickets',
    users_with_tickets,
    (users_with_tickets::DECIMAL / NULLIF(total_users, 0)) * 100,
    ((users_completed_purchase - users_with_tickets)::DECIMAL / NULLIF(users_completed_purchase, 0)) * 100
FROM funnel_steps;

-- Time series forecasting helper
CREATE OR REPLACE FUNCTION generate_date_series(
    start_date DATE,
    end_date DATE
)
RETURNS TABLE (date DATE) AS $$
BEGIN
    RETURN QUERY
    SELECT generate_series(start_date, end_date, '1 day'::interval)::DATE;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- RFM (Recency, Frequency, Monetary) Analysis
CREATE OR REPLACE VIEW rfm_analysis AS
WITH user_metrics AS (
    SELECT 
        o."userId",
        MAX(o."createdAt") as last_order_date,
        COUNT(*) as order_frequency,
        SUM(o.total) as monetary_value
    FROM orders o
    WHERE o.status = 'COMPLETED'
    GROUP BY o."userId"
),
rfm_scores AS (
    SELECT 
        "userId",
        last_order_date,
        order_frequency,
        monetary_value,
        NTILE(5) OVER (ORDER BY last_order_date DESC) as recency_score,
        NTILE(5) OVER (ORDER BY order_frequency) as frequency_score,
        NTILE(5) OVER (ORDER BY monetary_value) as monetary_score
    FROM user_metrics
)
SELECT 
    "userId",
    last_order_date,
    order_frequency,
    monetary_value,
    recency_score,
    frequency_score,
    monetary_score,
    (recency_score + frequency_score + monetary_score) as rfm_total,
    CASE 
        WHEN recency_score >= 4 AND frequency_score >= 4 AND monetary_score >= 4 THEN 'Champions'
        WHEN recency_score >= 3 AND frequency_score >= 3 THEN 'Loyal Customers'
        WHEN recency_score >= 4 THEN 'Recent Customers'
        WHEN frequency_score >= 4 THEN 'Frequent Buyers'
        WHEN monetary_score >= 4 THEN 'Big Spenders'
        WHEN recency_score <= 2 AND frequency_score <= 2 THEN 'At Risk'
        WHEN recency_score <= 2 THEN 'Needs Attention'
        ELSE 'Regular'
    END as customer_segment
FROM rfm_scores;
