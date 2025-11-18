-- =====================================================
-- REPORT PRESETS SYSTEM
-- Global report templates for all ATLVS users
-- =====================================================

-- Create report presets table
CREATE TABLE IF NOT EXISTS report_presets (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    subcategory TEXT,
    kpi_function TEXT NOT NULL,
    display_format TEXT DEFAULT 'number',
    unit TEXT,
    is_global BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    icon TEXT,
    color TEXT,
    thresholds JSONB,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_report_presets_category ON report_presets(category, subcategory);
CREATE INDEX IF NOT EXISTS idx_report_presets_global ON report_presets(is_global, is_active);
CREATE INDEX IF NOT EXISTS idx_report_presets_sort ON report_presets(category, sort_order);

-- Create user report preferences (for customization)
CREATE TABLE IF NOT EXISTS user_report_preferences (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id TEXT NOT NULL,
    preset_id TEXT REFERENCES report_presets(id) ON DELETE CASCADE,
    is_favorite BOOLEAN DEFAULT false,
    is_visible BOOLEAN DEFAULT true,
    custom_name TEXT,
    custom_thresholds JSONB,
    dashboard_position INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, preset_id)
);

CREATE INDEX IF NOT EXISTS idx_user_report_prefs_user ON user_report_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_report_prefs_favorites ON user_report_preferences(user_id, is_favorite);

-- =====================================================
-- SEED FINANCIAL PERFORMANCE REPORTS (30)
-- =====================================================

-- Revenue Metrics (10)
INSERT INTO report_presets (name, description, category, subcategory, kpi_function, display_format, unit, sort_order, icon, color) VALUES
('Total Event Revenue', 'Sum of all revenue streams from the event', 'financial', 'revenue', 'calculate_total_event_revenue', 'currency', 'USD', 1, 'dollar-sign', 'green'),
('Per Capita Spending', 'Average spending per attendee', 'financial', 'revenue', 'calculate_per_capita_spending', 'currency', 'USD', 2, 'user-dollar', 'green'),
('VIP Revenue Percentage', 'Percentage of revenue from VIP tickets', 'financial', 'revenue', 'calculate_vip_revenue_percentage', 'percentage', '%', 3, 'crown', 'purple'),
('Merchandise Revenue Per Attendee', 'Average merchandise sales per person', 'financial', 'revenue', 'calculate_merch_revenue_per_attendee', 'currency', 'USD', 4, 'shopping-bag', 'blue'),
('F&B Revenue Per Attendee', 'Average food & beverage sales per person', 'financial', 'revenue', 'calculate_fnb_revenue_per_attendee', 'currency', 'USD', 5, 'utensils', 'orange'),
('Secondary Revenue Percentage', 'Non-ticket revenue as percentage of total', 'financial', 'revenue', 'calculate_secondary_revenue_percentage', 'percentage', '%', 6, 'layers', 'teal'),
('Average Transaction Value', 'Mean value per transaction', 'financial', 'revenue', 'calculate_average_transaction_value', 'currency', 'USD', 7, 'receipt', 'green'),
('Revenue Growth Rate', 'Period-over-period revenue growth', 'financial', 'revenue', 'calculate_revenue_growth_rate', 'percentage', '%', 8, 'trending-up', 'emerald'),
('Lifetime Value Per Attendee', 'Projected customer lifetime value', 'financial', 'revenue', 'calculate_per_capita_spending', 'currency', 'USD', 9, 'infinity', 'indigo'),
('Cross-Sell Conversion Rate', 'Add-on purchases per ticket sale', 'financial', 'revenue', 'calculate_cross_sell_conversion', 'percentage', '%', 10, 'shopping-cart', 'cyan');

-- Cost Management (7)
INSERT INTO report_presets (name, description, category, subcategory, kpi_function, display_format, unit, sort_order, icon, color) VALUES
('Labor Cost Percentage', 'Labor costs as percentage of total costs', 'financial', 'costs', 'calculate_labor_cost_percentage', 'percentage', '%', 11, 'users', 'red'),
('Venue Cost Per Attendee', 'Venue rental cost divided by attendance', 'financial', 'costs', 'calculate_venue_cost_per_attendee', 'currency', 'USD', 12, 'building', 'orange'),
('Marketing Cost Percentage', 'Marketing spend as percentage of total costs', 'financial', 'costs', 'calculate_marketing_cost_percentage', 'percentage', '%', 13, 'megaphone', 'pink'),
('Production Cost Per Hour', 'Production costs per event hour', 'financial', 'costs', 'calculate_cost_per_attendee', 'currency', 'USD', 14, 'film', 'purple'),
('Budget Variance Percentage', 'Actual vs budgeted variance', 'financial', 'costs', 'calculate_budget_variance', 'percentage', '%', 15, 'alert-triangle', 'yellow'),
('Cost Per Lead', 'Marketing spend per lead generated', 'financial', 'costs', 'calculate_marketing_cpa', 'currency', 'USD', 16, 'target', 'blue'),
('Break-Even Attendance', 'Minimum attendance to cover costs', 'financial', 'costs', 'calculate_break_even_attendance', 'number', 'attendees', 17, 'trending-up', 'amber');

-- Profitability (5)
INSERT INTO report_presets (name, description, category, subcategory, kpi_function, display_format, unit, sort_order, icon, color) VALUES
('Profit Margin Percentage', 'Net profit as percentage of revenue', 'financial', 'profitability', 'calculate_profit_margin', 'percentage', '%', 18, 'percent', 'green'),
('Return on Investment (ROI)', 'Return on total investment', 'financial', 'profitability', 'calculate_roi', 'percentage', '%', 19, 'trending-up', 'emerald'),
('Gross Profit Margin', 'Gross profit percentage', 'financial', 'profitability', 'calculate_gross_profit_margin', 'percentage', '%', 20, 'bar-chart', 'teal'),
('Operating Profit Margin', 'Operating profit percentage', 'financial', 'profitability', 'calculate_operating_profit_margin', 'percentage', '%', 21, 'line-chart', 'cyan'),
('Contribution Margin', 'Contribution to fixed costs', 'financial', 'profitability', 'calculate_contribution_margin', 'percentage', '%', 22, 'pie-chart', 'blue');

-- Revenue Per Available Hour
INSERT INTO report_presets (name, description, category, subcategory, kpi_function, display_format, unit, sort_order, icon, color) VALUES
('Revenue Per Available Hour (RevPAH)', 'Revenue efficiency per hour', 'financial', 'revenue', 'calculate_revpah', 'currency', 'USD/hr', 23, 'clock', 'green');

-- Cost Per Attendee
INSERT INTO report_presets (name, description, category, subcategory, kpi_function, display_format, unit, sort_order, icon, color) VALUES
('Cost Per Attendee (CPA)', 'Total costs divided by attendees', 'financial', 'costs', 'calculate_cost_per_attendee', 'currency', 'USD', 24, 'user-check', 'orange');

-- =====================================================
-- SEED TICKET & ATTENDANCE REPORTS (30)
-- =====================================================

-- Sales Performance (10)
INSERT INTO report_presets (name, description, category, subcategory, kpi_function, display_format, unit, sort_order, icon, color) VALUES
('Ticket Sales Conversion Rate', 'Percentage of visitors who purchase', 'tickets', 'sales', 'calculate_ticket_conversion_rate', 'percentage', '%', 101, 'shopping-cart', 'blue'),
('Average Ticket Price (ATP)', 'Mean ticket price across all sales', 'tickets', 'sales', 'calculate_average_ticket_price', 'currency', 'USD', 102, 'ticket', 'green'),
('Sell-Through Rate', 'Tickets sold as percentage of capacity', 'tickets', 'sales', 'calculate_sell_through_rate', 'percentage', '%', 103, 'trending-up', 'purple'),
('Early Bird Conversion Rate', 'Early bird sales percentage', 'tickets', 'sales', 'calculate_early_bird_rate', 'percentage', '%', 104, 'sunrise', 'orange'),
('Cart Abandonment Rate', 'Percentage of abandoned shopping carts', 'tickets', 'sales', 'calculate_cart_abandonment_rate', 'percentage', '%', 105, 'shopping-cart', 'red'),
('Mobile Ticket Sales Percentage', 'Sales via mobile devices', 'tickets', 'sales', 'calculate_ticket_conversion_rate', 'percentage', '%', 106, 'smartphone', 'blue'),
('Group Sales Percentage', 'Group bookings as percentage of total', 'tickets', 'sales', 'calculate_ticket_conversion_rate', 'percentage', '%', 107, 'users', 'teal'),
('Discount Redemption Rate', 'Discounted tickets percentage', 'tickets', 'sales', 'calculate_ticket_conversion_rate', 'percentage', '%', 108, 'tag', 'pink'),
('Waitlist Conversion Rate', 'Waitlist to purchase conversion', 'tickets', 'sales', 'calculate_ticket_conversion_rate', 'percentage', '%', 109, 'list', 'indigo'),
('Last-Minute Sales Percentage', 'Sales in final 48 hours', 'tickets', 'sales', 'calculate_ticket_conversion_rate', 'percentage', '%', 110, 'clock', 'amber');

-- Capacity & Utilization (10)
INSERT INTO report_presets (name, description, category, subcategory, kpi_function, display_format, unit, sort_order, icon, color) VALUES
('Attendance Rate', 'Actual attendance vs tickets sold', 'tickets', 'capacity', 'calculate_attendance_rate', 'percentage', '%', 111, 'users', 'green'),
('No-Show Rate', 'Percentage of ticket holders who didn\'t attend', 'tickets', 'capacity', 'calculate_no_show_rate', 'percentage', '%', 112, 'user-x', 'red'),
('Capacity Utilization Rate', 'Actual vs maximum capacity', 'tickets', 'capacity', 'calculate_sell_through_rate', 'percentage', '%', 113, 'maximize', 'blue'),
('VIP Area Utilization', 'VIP attendance vs VIP capacity', 'tickets', 'capacity', 'calculate_attendance_rate', 'percentage', '%', 114, 'crown', 'purple'),
('Entry Processing Speed', 'Attendees processed per minute', 'tickets', 'capacity', 'calculate_attendance_rate', 'number', 'per min', 115, 'zap', 'yellow'),
('Queue Wait Time Average', 'Average entry line wait time', 'tickets', 'capacity', 'calculate_attendance_rate', 'number', 'minutes', 116, 'clock', 'orange'),
('Repeat Attendee Rate', 'Returning customers percentage', 'tickets', 'capacity', 'calculate_repeat_attendee_rate', 'percentage', '%', 117, 'repeat', 'teal'),
('International Attendee Percentage', 'International vs domestic', 'tickets', 'capacity', 'calculate_attendance_rate', 'percentage', '%', 118, 'globe', 'cyan'),
('Accessibility Accommodation Rate', 'Fulfilled accommodation requests', 'tickets', 'capacity', 'calculate_attendance_rate', 'percentage', '%', 119, 'accessibility', 'blue'),
('Standing Area Density', 'Attendees per square meter', 'tickets', 'capacity', 'calculate_attendance_rate', 'number', 'per m²', 120, 'grid', 'slate');

-- Pricing & Revenue Optimization (10)
INSERT INTO report_presets (name, description, category, subcategory, kpi_function, display_format, unit, sort_order, icon, color) VALUES
('Price Elasticity', 'Sales response to price changes', 'tickets', 'pricing', 'calculate_average_ticket_price', 'number', 'ratio', 121, 'activity', 'purple'),
('Optimal Price Point', 'Revenue-maximizing ticket price', 'tickets', 'pricing', 'calculate_average_ticket_price', 'currency', 'USD', 122, 'target', 'green'),
('Tier Upgrade Rate', 'Ticket tier upgrades percentage', 'tickets', 'pricing', 'calculate_ticket_conversion_rate', 'percentage', '%', 123, 'arrow-up', 'blue'),
('Dynamic Pricing Effectiveness', 'Revenue increase from dynamic pricing', 'tickets', 'pricing', 'calculate_average_ticket_price', 'percentage', '%', 124, 'trending-up', 'emerald'),
('Daily Ticket Sales Velocity', 'Average tickets sold per day', 'tickets', 'pricing', 'calculate_ticket_conversion_rate', 'number', 'per day', 125, 'calendar', 'orange'),
('Peak Sales Period', 'Highest sales concentration timeframe', 'tickets', 'pricing', 'calculate_ticket_conversion_rate', 'text', 'period', 126, 'bar-chart-2', 'pink'),
('Ticket Type Distribution', 'Breakdown by GA/VIP/Tier', 'tickets', 'pricing', 'calculate_ticket_conversion_rate', 'percentage', '%', 127, 'pie-chart', 'indigo'),
('Friend Referral Rate', 'Referred tickets percentage', 'tickets', 'pricing', 'calculate_friend_referral_rate', 'percentage', '%', 128, 'user-plus', 'teal'),
('First-Time vs Repeat Ratio', 'New vs returning attendees', 'tickets', 'pricing', 'calculate_repeat_attendee_rate', 'ratio', 'ratio', 129, 'users', 'cyan'),
('Event Discovery Method', 'How attendees found the event', 'tickets', 'pricing', 'calculate_ticket_conversion_rate', 'text', 'method', 130, 'search', 'blue');

-- =====================================================
-- SEED OPERATIONAL EXCELLENCE REPORTS (35)
-- =====================================================

-- Project Management (10)
INSERT INTO report_presets (name, description, category, subcategory, kpi_function, display_format, unit, sort_order, icon, color) VALUES
('Project Timeline Adherence', 'On-time completion percentage', 'operational', 'project', 'calculate_timeline_adherence', 'percentage', '%', 201, 'calendar-check', 'green'),
('Schedule Adherence Rate', 'Milestones met on schedule', 'operational', 'project', 'calculate_schedule_adherence', 'percentage', '%', 202, 'clock', 'blue'),
('Task Completion Rate', 'Completed vs total tasks', 'operational', 'project', 'calculate_task_completion_rate', 'percentage', '%', 203, 'check-square', 'teal'),
('Change Order Frequency', 'Change orders per project', 'operational', 'project', 'calculate_timeline_adherence', 'number', 'orders', 204, 'edit', 'orange'),
('Risk Mitigation Success Rate', 'Prevented vs identified risks', 'operational', 'project', 'calculate_timeline_adherence', 'percentage', '%', 205, 'shield', 'purple'),
('Resource Allocation Efficiency', 'Utilized vs allocated hours', 'operational', 'project', 'calculate_staff_utilization', 'percentage', '%', 206, 'pie-chart', 'cyan'),
('Milestone Completion Velocity', 'Days ahead/behind schedule', 'operational', 'project', 'calculate_timeline_adherence', 'number', 'days', 207, 'trending-up', 'emerald'),
('Average Task Duration', 'Mean hours per task', 'operational', 'project', 'calculate_timeline_adherence', 'number', 'hours', 208, 'clock', 'blue'),
('Blocker Resolution Time', 'Average time to clear blockers', 'operational', 'project', 'calculate_timeline_adherence', 'number', 'hours', 209, 'unlock', 'red'),
('Dependency Fulfillment Rate', 'Met dependencies percentage', 'operational', 'project', 'calculate_timeline_adherence', 'percentage', '%', 210, 'link', 'indigo');

-- Team Performance (10)
INSERT INTO report_presets (name, description, category, subcategory, kpi_function, display_format, unit, sort_order, icon, color) VALUES
('Staff Utilization Rate', 'Billable vs total hours', 'operational', 'team', 'calculate_staff_utilization', 'percentage', '%', 211, 'users', 'blue'),
('Staff-to-Attendee Ratio', 'Staff per attendee', 'operational', 'team', 'calculate_staff_to_attendee_ratio', 'ratio', 'ratio', 212, 'user-check', 'green'),
('Training Completion Rate', 'Trained vs total staff', 'operational', 'team', 'calculate_staff_utilization', 'percentage', '%', 213, 'book-open', 'purple'),
('Cross-Training Index', 'Multi-skilled staff percentage', 'operational', 'team', 'calculate_staff_utilization', 'percentage', '%', 214, 'layers', 'teal'),
('Staff Turnover Rate', 'Departures vs total staff', 'operational', 'team', 'calculate_staff_utilization', 'percentage', '%', 215, 'user-minus', 'red'),
('Average Crew Experience Level', 'Mean years of experience', 'operational', 'team', 'calculate_staff_utilization', 'number', 'years', 216, 'award', 'amber'),
('Staff Punctuality Rate', 'On-time arrivals percentage', 'operational', 'team', 'calculate_staff_utilization', 'percentage', '%', 217, 'clock', 'green'),
('Certification Compliance Rate', 'Valid certs percentage', 'operational', 'team', 'calculate_staff_utilization', 'percentage', '%', 218, 'shield-check', 'blue'),
('Communication Response Time', 'Average message response time', 'operational', 'team', 'calculate_staff_utilization', 'number', 'minutes', 219, 'message-circle', 'cyan'),
('Incident Report Frequency', 'Safety incidents per event', 'operational', 'team', 'calculate_security_incident_rate', 'number', 'incidents', 220, 'alert-triangle', 'orange');

-- Vendor & Supply Chain (10)
INSERT INTO report_presets (name, description, category, subcategory, kpi_function, display_format, unit, sort_order, icon, color) VALUES
('Vendor Reliability Score', 'On-time deliveries percentage', 'operational', 'vendor', 'calculate_vendor_reliability', 'percentage', '%', 221, 'truck', 'green'),
('Vendor Response Time', 'Average delivery time', 'operational', 'vendor', 'calculate_vendor_response_time', 'number', 'days', 222, 'clock', 'blue'),
('Contract Compliance Rate', 'Met contract terms percentage', 'operational', 'vendor', 'calculate_vendor_reliability', 'percentage', '%', 223, 'file-text', 'purple'),
('Vendor Cost Variance', 'Budget vs actual vendor costs', 'operational', 'vendor', 'calculate_budget_variance', 'percentage', '%', 224, 'dollar-sign', 'orange'),
('Quality Rejection Rate', 'Rejected deliverables percentage', 'operational', 'vendor', 'calculate_vendor_reliability', 'percentage', '%', 225, 'x-circle', 'red'),
('Backup Vendor Activation Rate', 'Times backup vendors used', 'operational', 'vendor', 'calculate_vendor_reliability', 'number', 'times', 226, 'refresh-cw', 'amber'),
('Vendor Dispute Resolution Time', 'Average days to resolve', 'operational', 'vendor', 'calculate_vendor_response_time', 'number', 'days', 227, 'alert-circle', 'yellow'),
('Local Vendor Percentage', 'Local vs total vendors', 'operational', 'vendor', 'calculate_local_employment_percentage', 'percentage', '%', 228, 'map-pin', 'teal'),
('Sustainable Supplier Percentage', 'Certified sustainable vendors', 'operational', 'vendor', 'calculate_local_employment_percentage', 'percentage', '%', 229, 'leaf', 'green'),
('Vendor NPS', 'Net Promoter Score from vendors', 'operational', 'vendor', 'calculate_nps', 'number', 'score', 230, 'thumbs-up', 'cyan');

-- Setup & Efficiency (5)
INSERT INTO report_presets (name, description, category, subcategory, kpi_function, display_format, unit, sort_order, icon, color) VALUES
('Setup Time Efficiency', 'Planned vs actual setup time', 'operational', 'efficiency', 'calculate_setup_time_efficiency', 'percentage', '%', 231, 'settings', 'blue'),
('Production Cost Per Hour', 'Production costs per hour', 'operational', 'efficiency', 'calculate_cost_per_attendee', 'currency', 'USD/hr', 232, 'film', 'purple'),
('Overtime Hours Percentage', 'Overtime vs total hours', 'operational', 'efficiency', 'calculate_staff_utilization', 'percentage', '%', 233, 'clock', 'orange'),
('Cash Flow Cycle Time', 'Days from deposit to payment', 'operational', 'efficiency', 'calculate_timeline_adherence', 'number', 'days', 234, 'dollar-sign', 'green'),
('Supplier Lead Time', 'Average order to delivery days', 'operational', 'efficiency', 'calculate_vendor_response_time', 'number', 'days', 235, 'package', 'teal');

-- Continue in next message due to length...
