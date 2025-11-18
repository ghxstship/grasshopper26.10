-- =====================================================
-- KPI METRICS - FINANCIAL ANALYTICS (25 Additional KPIs)
-- Revenue, Cost Management, and Profitability Metrics
-- =====================================================

-- =====================================================
-- REVENUE METRICS
-- =====================================================

-- Per Capita Spending
CREATE OR REPLACE FUNCTION calculate_per_capita_spending(p_event_id TEXT)
RETURNS DECIMAL AS $$
DECLARE
    v_total_revenue DECIMAL;
    v_attendees INTEGER;
BEGIN
    v_total_revenue := calculate_total_event_revenue(p_event_id);
    
    SELECT COUNT(*) INTO v_attendees
    FROM tickets WHERE "eventId" = p_event_id AND status = 'USED';
    
    RETURN CASE WHEN v_attendees > 0 THEN v_total_revenue / v_attendees ELSE 0 END;
END;
$$ LANGUAGE plpgsql;

-- VIP Revenue Percentage
CREATE OR REPLACE FUNCTION calculate_vip_revenue_percentage(p_event_id TEXT)
RETURNS DECIMAL AS $$
DECLARE
    v_vip_revenue DECIMAL;
    v_total_revenue DECIMAL;
BEGIN
    SELECT COALESCE(SUM(oi.price * oi.quantity), 0) INTO v_vip_revenue
    FROM order_items oi
    INNER JOIN tickets t ON t."orderId" = oi."orderId"
    INNER JOIN ticket_types tt ON tt.id = t."ticketTypeId"
    WHERE t."eventId" = p_event_id
    AND tt.name ILIKE '%VIP%';
    
    v_total_revenue := calculate_total_event_revenue(p_event_id);
    
    RETURN CASE WHEN v_total_revenue > 0 THEN (v_vip_revenue / v_total_revenue) * 100 ELSE 0 END;
END;
$$ LANGUAGE plpgsql;

-- Merchandise Revenue Per Attendee
CREATE OR REPLACE FUNCTION calculate_merch_revenue_per_attendee(p_event_id TEXT)
RETURNS DECIMAL AS $$
DECLARE
    v_merch_revenue DECIMAL;
    v_attendees INTEGER;
BEGIN
    SELECT COALESCE(SUM(oi.price * oi.quantity), 0) INTO v_merch_revenue
    FROM order_items oi
    INNER JOIN products p ON p.id = oi."productId"
    WHERE p.category = 'merchandise'
    AND oi."orderId" IN (
        SELECT id FROM orders WHERE "eventId" = p_event_id
    );
    
    SELECT COUNT(*) INTO v_attendees
    FROM tickets WHERE "eventId" = p_event_id AND status = 'USED';
    
    RETURN CASE WHEN v_attendees > 0 THEN v_merch_revenue / v_attendees ELSE 0 END;
END;
$$ LANGUAGE plpgsql;

-- F&B Revenue Per Attendee
CREATE OR REPLACE FUNCTION calculate_fnb_revenue_per_attendee(p_event_id TEXT)
RETURNS DECIMAL AS $$
DECLARE
    v_fnb_revenue DECIMAL;
    v_attendees INTEGER;
BEGIN
    SELECT COALESCE(SUM(oi.price * oi.quantity), 0) INTO v_fnb_revenue
    FROM order_items oi
    INNER JOIN products p ON p.id = oi."productId"
    WHERE p.category IN ('food', 'beverage', 'f&b')
    AND oi."orderId" IN (
        SELECT id FROM orders WHERE "eventId" = p_event_id
    );
    
    SELECT COUNT(*) INTO v_attendees
    FROM tickets WHERE "eventId" = p_event_id AND status = 'USED';
    
    RETURN CASE WHEN v_attendees > 0 THEN v_fnb_revenue / v_attendees ELSE 0 END;
END;
$$ LANGUAGE plpgsql;

-- Secondary Revenue Percentage (non-ticket revenue)
CREATE OR REPLACE FUNCTION calculate_secondary_revenue_percentage(p_event_id TEXT)
RETURNS DECIMAL AS $$
DECLARE
    v_ticket_revenue DECIMAL;
    v_total_revenue DECIMAL;
    v_secondary_revenue DECIMAL;
BEGIN
    -- Ticket revenue
    SELECT COALESCE(SUM(oi.price * oi.quantity), 0) INTO v_ticket_revenue
    FROM order_items oi
    INNER JOIN tickets t ON t."orderId" = oi."orderId"
    WHERE t."eventId" = p_event_id;
    
    v_total_revenue := calculate_total_event_revenue(p_event_id);
    v_secondary_revenue := v_total_revenue - v_ticket_revenue;
    
    RETURN CASE WHEN v_total_revenue > 0 THEN (v_secondary_revenue / v_total_revenue) * 100 ELSE 0 END;
END;
$$ LANGUAGE plpgsql;

-- Average Transaction Value
CREATE OR REPLACE FUNCTION calculate_average_transaction_value(p_event_id TEXT)
RETURNS DECIMAL AS $$
DECLARE
    v_total_revenue DECIMAL;
    v_transaction_count INTEGER;
BEGIN
    v_total_revenue := calculate_total_event_revenue(p_event_id);
    
    SELECT COUNT(*) INTO v_transaction_count
    FROM orders WHERE "eventId" = p_event_id AND status = 'COMPLETED';
    
    RETURN CASE WHEN v_transaction_count > 0 THEN v_total_revenue / v_transaction_count ELSE 0 END;
END;
$$ LANGUAGE plpgsql;

-- Revenue Growth Rate (requires historical data)
CREATE OR REPLACE FUNCTION calculate_revenue_growth_rate(p_event_id TEXT, p_previous_event_id TEXT)
RETURNS DECIMAL AS $$
DECLARE
    v_current_revenue DECIMAL;
    v_previous_revenue DECIMAL;
BEGIN
    v_current_revenue := calculate_total_event_revenue(p_event_id);
    v_previous_revenue := calculate_total_event_revenue(p_previous_event_id);
    
    RETURN CASE WHEN v_previous_revenue > 0 
        THEN ((v_current_revenue - v_previous_revenue) / v_previous_revenue) * 100 
        ELSE 0 END;
END;
$$ LANGUAGE plpgsql;

-- Cross-Sell Conversion Rate
CREATE OR REPLACE FUNCTION calculate_cross_sell_conversion(p_event_id TEXT)
RETURNS DECIMAL AS $$
DECLARE
    v_addon_purchases INTEGER;
    v_ticket_sales INTEGER;
BEGIN
    -- Count orders with more than just tickets
    SELECT COUNT(DISTINCT o.id) INTO v_addon_purchases
    FROM orders o
    INNER JOIN order_items oi ON oi."orderId" = o.id
    INNER JOIN products p ON p.id = oi."productId"
    WHERE o."eventId" = p_event_id
    AND p.category != 'ticket';
    
    SELECT COUNT(*) INTO v_ticket_sales
    FROM tickets WHERE "eventId" = p_event_id;
    
    RETURN CASE WHEN v_ticket_sales > 0 THEN (v_addon_purchases::DECIMAL / v_ticket_sales) * 100 ELSE 0 END;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- COST MANAGEMENT
-- =====================================================

-- Labor Cost Percentage
CREATE OR REPLACE FUNCTION calculate_labor_cost_percentage(p_event_id TEXT)
RETURNS DECIMAL AS $$
DECLARE
    v_labor_costs DECIMAL;
    v_total_costs DECIMAL;
BEGIN
    SELECT COALESCE(SUM(e.amount), 0) INTO v_labor_costs
    FROM expenses e
    INNER JOIN budgets b ON b.id = e."budgetId"
    INNER JOIN projects p ON p.id = b."projectId"
    WHERE p."eventId" = p_event_id
    AND (e.category ILIKE '%labor%' OR e.category ILIKE '%staff%' OR e.category ILIKE '%payroll%');
    
    SELECT COALESCE(SUM(e.amount), 0) INTO v_total_costs
    FROM expenses e
    INNER JOIN budgets b ON b.id = e."budgetId"
    INNER JOIN projects p ON p.id = b."projectId"
    WHERE p."eventId" = p_event_id;
    
    RETURN CASE WHEN v_total_costs > 0 THEN (v_labor_costs / v_total_costs) * 100 ELSE 0 END;
END;
$$ LANGUAGE plpgsql;

-- Venue Cost Per Attendee
CREATE OR REPLACE FUNCTION calculate_venue_cost_per_attendee(p_event_id TEXT)
RETURNS DECIMAL AS $$
DECLARE
    v_venue_cost DECIMAL;
    v_attendees INTEGER;
BEGIN
    SELECT COALESCE(SUM(e.amount), 0) INTO v_venue_cost
    FROM expenses e
    INNER JOIN budgets b ON b.id = e."budgetId"
    INNER JOIN projects p ON p.id = b."projectId"
    WHERE p."eventId" = p_event_id
    AND e.category ILIKE '%venue%';
    
    SELECT COUNT(*) INTO v_attendees
    FROM tickets WHERE "eventId" = p_event_id AND status = 'USED';
    
    RETURN CASE WHEN v_attendees > 0 THEN v_venue_cost / v_attendees ELSE 0 END;
END;
$$ LANGUAGE plpgsql;

-- Marketing Cost Percentage
CREATE OR REPLACE FUNCTION calculate_marketing_cost_percentage(p_event_id TEXT)
RETURNS DECIMAL AS $$
DECLARE
    v_marketing_costs DECIMAL;
    v_total_costs DECIMAL;
BEGIN
    SELECT COALESCE(SUM(e.amount), 0) INTO v_marketing_costs
    FROM expenses e
    INNER JOIN budgets b ON b.id = e."budgetId"
    INNER JOIN projects p ON p.id = b."projectId"
    WHERE p."eventId" = p_event_id
    AND e.category ILIKE '%marketing%';
    
    SELECT COALESCE(SUM(e.amount), 0) INTO v_total_costs
    FROM expenses e
    INNER JOIN budgets b ON b.id = e."budgetId"
    INNER JOIN projects p ON p.id = b."projectId"
    WHERE p."eventId" = p_event_id;
    
    RETURN CASE WHEN v_total_costs > 0 THEN (v_marketing_costs / v_total_costs) * 100 ELSE 0 END;
END;
$$ LANGUAGE plpgsql;

-- Budget Variance Percentage
CREATE OR REPLACE FUNCTION calculate_budget_variance(p_project_id TEXT)
RETURNS DECIMAL AS $$
DECLARE
    v_budgeted DECIMAL;
    v_actual DECIMAL;
BEGIN
    SELECT COALESCE(SUM(allocated), 0) INTO v_budgeted
    FROM budgets WHERE "projectId" = p_project_id;
    
    SELECT COALESCE(SUM(spent), 0) INTO v_actual
    FROM budgets WHERE "projectId" = p_project_id;
    
    RETURN CASE WHEN v_budgeted > 0 THEN ((v_actual - v_budgeted) / v_budgeted) * 100 ELSE 0 END;
END;
$$ LANGUAGE plpgsql;

-- Break-Even Attendance
CREATE OR REPLACE FUNCTION calculate_break_even_attendance(p_event_id TEXT)
RETURNS INTEGER AS $$
DECLARE
    v_fixed_costs DECIMAL;
    v_avg_ticket_price DECIMAL;
    v_variable_cost_per_attendee DECIMAL := 10; -- Estimate, should be configurable
BEGIN
    SELECT COALESCE(SUM(e.amount), 0) INTO v_fixed_costs
    FROM expenses e
    INNER JOIN budgets b ON b.id = e."budgetId"
    INNER JOIN projects p ON p.id = b."projectId"
    WHERE p."eventId" = p_event_id;
    
    v_avg_ticket_price := calculate_average_ticket_price(p_event_id);
    
    RETURN CASE 
        WHEN (v_avg_ticket_price - v_variable_cost_per_attendee) > 0 
        THEN CEIL(v_fixed_costs / (v_avg_ticket_price - v_variable_cost_per_attendee))
        ELSE 0 
    END;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- PROFITABILITY
-- =====================================================

-- Gross Profit Margin
CREATE OR REPLACE FUNCTION calculate_gross_profit_margin(p_event_id TEXT)
RETURNS DECIMAL AS $$
DECLARE
    v_revenue DECIMAL;
    v_cogs DECIMAL;
BEGIN
    v_revenue := calculate_total_event_revenue(p_event_id);
    
    -- COGS = direct costs (venue, production, etc.)
    SELECT COALESCE(SUM(e.amount), 0) INTO v_cogs
    FROM expenses e
    INNER JOIN budgets b ON b.id = e."budgetId"
    INNER JOIN projects p ON p.id = b."projectId"
    WHERE p."eventId" = p_event_id
    AND e.category IN ('venue', 'production', 'equipment', 'materials');
    
    RETURN CASE WHEN v_revenue > 0 THEN ((v_revenue - v_cogs) / v_revenue) * 100 ELSE 0 END;
END;
$$ LANGUAGE plpgsql;

-- Operating Profit Margin
CREATE OR REPLACE FUNCTION calculate_operating_profit_margin(p_event_id TEXT)
RETURNS DECIMAL AS $$
DECLARE
    v_revenue DECIMAL;
    v_operating_expenses DECIMAL;
BEGIN
    v_revenue := calculate_total_event_revenue(p_event_id);
    
    SELECT COALESCE(SUM(e.amount), 0) INTO v_operating_expenses
    FROM expenses e
    INNER JOIN budgets b ON b.id = e."budgetId"
    INNER JOIN projects p ON p.id = b."projectId"
    WHERE p."eventId" = p_event_id;
    
    RETURN CASE WHEN v_revenue > 0 THEN ((v_revenue - v_operating_expenses) / v_revenue) * 100 ELSE 0 END;
END;
$$ LANGUAGE plpgsql;

-- Contribution Margin
CREATE OR REPLACE FUNCTION calculate_contribution_margin(p_event_id TEXT)
RETURNS DECIMAL AS $$
DECLARE
    v_revenue DECIMAL;
    v_variable_costs DECIMAL;
BEGIN
    v_revenue := calculate_total_event_revenue(p_event_id);
    
    -- Variable costs = costs that scale with attendance
    SELECT COALESCE(SUM(e.amount), 0) INTO v_variable_costs
    FROM expenses e
    INNER JOIN budgets b ON b.id = e."budgetId"
    INNER JOIN projects p ON p.id = b."projectId"
    WHERE p."eventId" = p_event_id
    AND e.category IN ('catering', 'merchandise_cost', 'materials', 'supplies');
    
    RETURN CASE WHEN v_revenue > 0 THEN ((v_revenue - v_variable_costs) / v_revenue) * 100 ELSE 0 END;
END;
$$ LANGUAGE plpgsql;

-- Create comprehensive financial KPI view
CREATE OR REPLACE VIEW financial_kpis AS
SELECT 
    e.id as event_id,
    e.title as event_name,
    calculate_total_event_revenue(e.id) as total_revenue,
    calculate_per_capita_spending(e.id) as per_capita_spending,
    calculate_vip_revenue_percentage(e.id) as vip_revenue_pct,
    calculate_secondary_revenue_percentage(e.id) as secondary_revenue_pct,
    calculate_average_transaction_value(e.id) as avg_transaction_value,
    calculate_labor_cost_percentage(e.id) as labor_cost_pct,
    calculate_marketing_cost_percentage(e.id) as marketing_cost_pct,
    calculate_gross_profit_margin(e.id) as gross_profit_margin,
    calculate_operating_profit_margin(e.id) as operating_profit_margin,
    calculate_contribution_margin(e.id) as contribution_margin,
    calculate_break_even_attendance(e.id) as break_even_attendance
FROM events e
WHERE e.status IN ('PUBLISHED', 'LIVE', 'COMPLETED');
