-- =====================================================
-- REPORT PRESETS SYSTEM - CONTINUED
-- Marketing, Customer Experience, Safety, Sustainability, Technology
-- =====================================================

-- =====================================================
-- MARKETING & ENGAGEMENT REPORTS (35)
-- =====================================================

-- Digital Marketing (10)
INSERT INTO report_presets (name, description, category, subcategory, kpi_function, display_format, unit, sort_order, icon, color) VALUES
('Social Media Engagement Rate', 'Interactions per impression', 'marketing', 'digital', 'calculate_social_engagement_rate', 'percentage', '%', 301, 'heart', 'pink'),
('Brand Mention Velocity', 'Mentions per day during campaign', 'marketing', 'digital', 'calculate_brand_mention_velocity', 'number', 'per day', 302, 'trending-up', 'blue'),
('Marketing Cost Per Acquisition', 'Marketing spend per ticket sold', 'marketing', 'digital', 'calculate_marketing_cpa', 'currency', 'USD', 303, 'target', 'orange'),
('Website Conversion Rate', 'Purchases per website visit', 'marketing', 'digital', 'calculate_website_conversion_rate', 'percentage', '%', 304, 'mouse-pointer', 'green'),
('Landing Page Bounce Rate', 'Single-page sessions percentage', 'marketing', 'digital', 'calculate_website_conversion_rate', 'percentage', '%', 305, 'external-link', 'red'),
('Email Open Rate', 'Opened emails percentage', 'marketing', 'digital', 'calculate_email_ctr', 'percentage', '%', 306, 'mail-open', 'blue'),
('Email Campaign CTR', 'Click-through rate', 'marketing', 'digital', 'calculate_email_ctr', 'percentage', '%', 307, 'mouse-pointer', 'cyan'),
('Social Media Follower Growth', 'New followers per period', 'marketing', 'digital', 'calculate_social_engagement_rate', 'number', 'followers', 308, 'user-plus', 'purple'),
('Paid Ad ROAS', 'Return on ad spend', 'marketing', 'digital', 'calculate_roi', 'ratio', 'ratio', 309, 'dollar-sign', 'green'),
('Video View Completion Rate', 'Completed views percentage', 'marketing', 'digital', 'calculate_social_engagement_rate', 'percentage', '%', 310, 'video', 'indigo');

-- Audience Insights (10)
INSERT INTO report_presets (name, description, category, subcategory, kpi_function, display_format, unit, sort_order, icon, color) VALUES
('Audience Demographics Match', 'Target vs actual demographics', 'marketing', 'audience', 'calculate_attendance_rate', 'percentage', '%', 311, 'users', 'blue'),
('Geographic Reach Diversity', 'Number of regions represented', 'marketing', 'audience', 'calculate_attendance_rate', 'number', 'regions', 312, 'globe', 'teal'),
('Age Distribution Index', 'Attendee age breakdown', 'marketing', 'audience', 'calculate_attendance_rate', 'text', 'distribution', 313, 'bar-chart', 'purple'),
('Gender Distribution', 'Gender breakdown of attendees', 'marketing', 'audience', 'calculate_attendance_rate', 'text', 'distribution', 314, 'users', 'pink'),
('Income Bracket Distribution', 'Economic demographics', 'marketing', 'audience', 'calculate_attendance_rate', 'text', 'distribution', 315, 'dollar-sign', 'green'),
('Interest Affinity Score', 'Alignment with target interests', 'marketing', 'audience', 'calculate_attendance_rate', 'number', 'score', 316, 'heart', 'red'),
('Event Discovery Method', 'How attendees found event', 'marketing', 'audience', 'calculate_ticket_conversion_rate', 'text', 'method', 317, 'search', 'blue'),
('First-Time vs Repeat Ratio', 'New vs returning attendees', 'marketing', 'audience', 'calculate_repeat_attendee_rate', 'ratio', 'ratio', 318, 'repeat', 'cyan'),
('Friend Referral Rate', 'Referred tickets percentage', 'marketing', 'audience', 'calculate_friend_referral_rate', 'percentage', '%', 319, 'user-plus', 'orange'),
('Community Engagement Score', 'Local vs tourist attendance', 'marketing', 'audience', 'calculate_local_employment_percentage', 'percentage', '%', 320, 'map-pin', 'teal');

-- Brand & Experience (10)
INSERT INTO report_presets (name, description, category, subcategory, kpi_function, display_format, unit, sort_order, icon, color) VALUES
('Net Promoter Score (NPS)', 'Promoters minus detractors', 'marketing', 'brand', 'calculate_nps', 'number', 'score', 321, 'thumbs-up', 'green'),
('Brand Awareness Lift', 'Pre vs post-event recognition', 'marketing', 'brand', 'calculate_social_engagement_rate', 'percentage', '%', 322, 'trending-up', 'blue'),
('Brand Sentiment Score', 'Positive mentions percentage', 'marketing', 'brand', 'calculate_social_engagement_rate', 'percentage', '%', 323, 'smile', 'yellow'),
('User-Generated Content Volume', 'Fan posts/photos/videos count', 'marketing', 'brand', 'calculate_ugc_volume', 'number', 'posts', 324, 'camera', 'purple'),
('Hashtag Performance', 'Unique hashtag uses', 'marketing', 'brand', 'calculate_social_engagement_rate', 'number', 'uses', 325, 'hash', 'pink'),
('Media Impressions', 'Total PR and media reach', 'marketing', 'brand', 'calculate_social_engagement_rate', 'number', 'impressions', 326, 'tv', 'indigo'),
('Press Mention Sentiment', 'Positive coverage percentage', 'marketing', 'brand', 'calculate_social_engagement_rate', 'percentage', '%', 327, 'newspaper', 'blue'),
('Partnership Brand Lift', 'Sponsor brand awareness increase', 'marketing', 'brand', 'calculate_social_engagement_rate', 'percentage', '%', 328, 'handshake', 'teal'),
('Event FOMO Factor', 'Waitlist size + social demand', 'marketing', 'brand', 'calculate_ticket_conversion_rate', 'number', 'score', 329, 'fire', 'red'),
('Post-Event Engagement Duration', 'Days of continued engagement', 'marketing', 'brand', 'calculate_social_engagement_rate', 'number', 'days', 330, 'calendar', 'cyan');

-- Content & Campaigns (5)
INSERT INTO report_presets (name, description, category, subcategory, kpi_function, display_format, unit, sort_order, icon, color) VALUES
('Content Engagement Rate', 'Interactions per reach', 'marketing', 'content', 'calculate_social_engagement_rate', 'percentage', '%', 331, 'activity', 'blue'),
('Organic Search Traffic Percentage', 'Organic vs total traffic', 'marketing', 'content', 'calculate_website_conversion_rate', 'percentage', '%', 332, 'search', 'green'),
('Email List Growth Rate', 'New subscribers percentage', 'marketing', 'content', 'calculate_email_ctr', 'percentage', '%', 333, 'mail', 'purple'),
('Influencer Campaign ROI', 'Revenue attributed vs spend', 'marketing', 'content', 'calculate_roi', 'percentage', '%', 334, 'star', 'yellow'),
('Content Virality Coefficient', 'Shares per original post', 'marketing', 'content', 'calculate_social_engagement_rate', 'ratio', 'ratio', 335, 'share-2', 'pink');

-- =====================================================
-- CUSTOMER EXPERIENCE & SATISFACTION REPORTS (25)
-- =====================================================

-- Experience Quality (10)
INSERT INTO report_presets (name, description, category, subcategory, kpi_function, display_format, unit, sort_order, icon, color) VALUES
('Overall Satisfaction Score', 'Average rating 1-10 scale', 'customer', 'experience', 'calculate_satisfaction_score', 'number', 'score', 401, 'star', 'yellow'),
('Likelihood to Recommend', 'Would recommend percentage', 'customer', 'experience', 'calculate_nps', 'percentage', '%', 402, 'thumbs-up', 'green'),
('Experience vs Expectation Gap', 'Actual vs expected rating', 'customer', 'experience', 'calculate_satisfaction_score', 'number', 'gap', 403, 'trending-up', 'blue'),
('Venue Experience Rating', 'Venue-specific satisfaction', 'customer', 'experience', 'calculate_satisfaction_score', 'number', 'score', 404, 'building', 'purple'),
('Sound Quality Rating', 'Audio experience satisfaction', 'customer', 'experience', 'calculate_satisfaction_score', 'number', 'score', 405, 'volume-2', 'cyan'),
('Visual Production Rating', 'Lighting, screens, effects', 'customer', 'experience', 'calculate_satisfaction_score', 'number', 'score', 406, 'eye', 'indigo'),
('F&B Service Quality', 'Food and beverage satisfaction', 'customer', 'experience', 'calculate_satisfaction_score', 'number', 'score', 407, 'utensils', 'orange'),
('Restroom Cleanliness Score', 'Facilities rating', 'customer', 'experience', 'calculate_satisfaction_score', 'number', 'score', 408, 'droplet', 'blue'),
('Parking Experience Rating', 'Parking convenience', 'customer', 'experience', 'calculate_satisfaction_score', 'number', 'score', 409, 'car', 'teal'),
('Accessibility Experience Score', 'ADA compliance satisfaction', 'customer', 'experience', 'calculate_satisfaction_score', 'number', 'score', 410, 'accessibility', 'green');

-- Customer Service (10)
INSERT INTO report_presets (name, description, category, subcategory, kpi_function, display_format, unit, sort_order, icon, color) VALUES
('Support Ticket Resolution Time', 'Average hours to resolve', 'customer', 'service', 'calculate_vendor_response_time', 'number', 'hours', 411, 'clock', 'blue'),
('First Contact Resolution Rate', 'Resolved on first contact', 'customer', 'service', 'calculate_timeline_adherence', 'percentage', '%', 412, 'check-circle', 'green'),
('Customer Complaint Rate', 'Complaints per attendee', 'customer', 'service', 'calculate_refund_request_rate', 'percentage', '%', 413, 'alert-circle', 'red'),
('Refund Request Rate', 'Refund requests percentage', 'customer', 'service', 'calculate_refund_request_rate', 'percentage', '%', 414, 'dollar-sign', 'orange'),
('Support Satisfaction Score', 'Customer service rating', 'customer', 'service', 'calculate_satisfaction_score', 'number', 'score', 415, 'smile', 'yellow'),
('Live Chat Response Time', 'Average seconds to respond', 'customer', 'service', 'calculate_vendor_response_time', 'number', 'seconds', 416, 'message-circle', 'cyan'),
('Self-Service Success Rate', 'Self-resolved inquiries', 'customer', 'service', 'calculate_timeline_adherence', 'percentage', '%', 417, 'book-open', 'purple'),
('Escalation Rate', 'Escalated issues percentage', 'customer', 'service', 'calculate_refund_request_rate', 'percentage', '%', 418, 'arrow-up', 'red'),
('Follow-Up Completion Rate', 'Follow-ups completed', 'customer', 'service', 'calculate_timeline_adherence', 'percentage', '%', 419, 'check-square', 'teal'),
('Service Recovery Success Rate', 'Satisfied after complaint', 'customer', 'service', 'calculate_satisfaction_score', 'percentage', '%', 420, 'heart', 'pink');

-- Loyalty & Retention (5)
INSERT INTO report_presets (name, description, category, subcategory, kpi_function, display_format, unit, sort_order, icon, color) VALUES
('Repeat Purchase Rate', 'Repeat buyers percentage', 'customer', 'loyalty', 'calculate_repeat_attendee_rate', 'percentage', '%', 421, 'repeat', 'green'),
('Customer Churn Rate', 'Lost customers percentage', 'customer', 'loyalty', 'calculate_customer_churn_rate', 'percentage', '%', 422, 'user-minus', 'red'),
('Membership Renewal Rate', 'Renewals percentage', 'customer', 'loyalty', 'calculate_repeat_attendee_rate', 'percentage', '%', 423, 'refresh-cw', 'blue'),
('Loyalty Program Participation', 'Members percentage', 'customer', 'loyalty', 'calculate_repeat_attendee_rate', 'percentage', '%', 424, 'award', 'purple'),
('Average Time Between Purchases', 'Days between attendance', 'customer', 'loyalty', 'calculate_customer_churn_rate', 'number', 'days', 425, 'calendar', 'cyan');

-- =====================================================
-- SAFETY, RISK & COMPLIANCE REPORTS (20)
-- =====================================================

-- Safety Metrics (10)
INSERT INTO report_presets (name, description, category, subcategory, kpi_function, display_format, unit, sort_order, icon, color) VALUES
('Incident-Free Event Percentage', 'No-incident events', 'safety', 'metrics', 'calculate_incident_free_percentage', 'percentage', '%', 501, 'shield-check', 'green'),
('Security Incident Rate', 'Incidents per attendee', 'safety', 'metrics', 'calculate_security_incident_rate', 'percentage', '%', 502, 'alert-triangle', 'red'),
('Medical Emergency Response Time', 'Average minutes to respond', 'safety', 'metrics', 'calculate_vendor_response_time', 'number', 'minutes', 503, 'activity', 'orange'),
('Safety Training Completion', 'Trained staff percentage', 'safety', 'metrics', 'calculate_staff_utilization', 'percentage', '%', 504, 'book-open', 'blue'),
('First Aid Station Utilization', 'Visits per attendee', 'safety', 'metrics', 'calculate_security_incident_rate', 'percentage', '%', 505, 'heart-pulse', 'pink'),
('Crowd Density Safety Score', 'Peak density vs safe limits', 'safety', 'metrics', 'calculate_attendance_rate', 'number', 'score', 506, 'users', 'yellow'),
('Security Staff-to-Attendee Ratio', 'Security per attendee', 'safety', 'metrics', 'calculate_staff_to_attendee_ratio', 'ratio', 'ratio', 507, 'shield', 'purple'),
('Lost and Found Recovery Rate', 'Items returned percentage', 'safety', 'metrics', 'calculate_attendance_rate', 'percentage', '%', 508, 'package', 'teal'),
('Emergency Exit Accessibility Score', 'Compliant exits', 'safety', 'metrics', 'calculate_attendance_rate', 'percentage', '%', 509, 'door-open', 'green'),
('Evacuation Drill Completion Rate', 'Drills completed', 'safety', 'metrics', 'calculate_timeline_adherence', 'percentage', '%', 510, 'alert-circle', 'amber');

-- Risk Management (10)
INSERT INTO report_presets (name, description, category, subcategory, kpi_function, display_format, unit, sort_order, icon, color) VALUES
('Insurance Claim Frequency', 'Claims per event', 'safety', 'risk', 'calculate_incident_free_percentage', 'number', 'claims', 511, 'file-text', 'orange'),
('Contract Dispute Rate', 'Disputes per contract', 'safety', 'risk', 'calculate_vendor_reliability', 'percentage', '%', 512, 'alert-triangle', 'red'),
('Weather Contingency Activation', 'Backup plan implementations', 'safety', 'risk', 'calculate_timeline_adherence', 'number', 'times', 513, 'cloud-rain', 'blue'),
('Payment Fraud Detection Rate', 'Caught fraud percentage', 'safety', 'risk', 'calculate_attendance_rate', 'percentage', '%', 514, 'shield-alert', 'red'),
('Data Breach Incidents', 'Breaches per year', 'safety', 'risk', 'calculate_security_incident_rate', 'number', 'incidents', 515, 'lock', 'red'),
('Legal Compliance Score', 'Passed audits percentage', 'safety', 'risk', 'calculate_timeline_adherence', 'percentage', '%', 516, 'scale', 'green'),
('Permit Approval Success Rate', 'Approved permits', 'safety', 'risk', 'calculate_timeline_adherence', 'percentage', '%', 517, 'file-check', 'blue'),
('Alcohol Service Compliance', 'ID checks percentage', 'safety', 'risk', 'calculate_attendance_rate', 'percentage', '%', 518, 'beer', 'amber'),
('Cybersecurity Incident Rate', 'Security breaches', 'safety', 'risk', 'calculate_security_incident_rate', 'number', 'incidents', 519, 'shield-off', 'red'),
('Force Majeure Event Impact', 'Revenue lost to unforeseen', 'safety', 'risk', 'calculate_profit_margin', 'currency', 'USD', 520, 'alert-octagon', 'orange');

-- =====================================================
-- SUSTAINABILITY & SOCIAL IMPACT REPORTS (15)
-- =====================================================

-- Environmental Impact (8)
INSERT INTO report_presets (name, description, category, subcategory, kpi_function, display_format, unit, sort_order, icon, color) VALUES
('Carbon Footprint Per Attendee', 'Total CO2 per person', 'sustainability', 'environmental', 'calculate_per_capita_spending', 'number', 'kg CO2', 601, 'cloud', 'green'),
('Waste Diversion Rate', 'Recycled/composted percentage', 'sustainability', 'environmental', 'calculate_waste_diversion_rate', 'percentage', '%', 602, 'recycle', 'teal'),
('Energy Consumption Per Hour', 'kWh used per hour', 'sustainability', 'environmental', 'calculate_revpah', 'number', 'kWh', 603, 'zap', 'yellow'),
('Water Usage Per Attendee', 'Gallons used per person', 'sustainability', 'environmental', 'calculate_per_capita_spending', 'number', 'gallons', 604, 'droplet', 'blue'),
('Sustainable Vendor Percentage', 'Eco-certified vendors', 'sustainability', 'environmental', 'calculate_local_employment_percentage', 'percentage', '%', 605, 'leaf', 'green'),
('Public Transportation Usage', 'Attendees using transit', 'sustainability', 'environmental', 'calculate_attendance_rate', 'percentage', '%', 606, 'bus', 'cyan'),
('Reusable Material Percentage', 'Reusable items', 'sustainability', 'environmental', 'calculate_attendance_rate', 'percentage', '%', 607, 'refresh-cw', 'emerald'),
('Local Sourcing Percentage', 'Local suppliers', 'sustainability', 'environmental', 'calculate_local_employment_percentage', 'percentage', '%', 608, 'map-pin', 'teal');

-- Social Impact (7)
INSERT INTO report_presets (name, description, category, subcategory, kpi_function, display_format, unit, sort_order, icon, color) VALUES
('Local Employment Percentage', 'Local hires', 'sustainability', 'social', 'calculate_local_employment_percentage', 'percentage', '%', 609, 'users', 'blue'),
('Charitable Contribution Amount', 'Donations made or raised', 'sustainability', 'social', 'calculate_total_event_revenue', 'currency', 'USD', 610, 'heart', 'pink'),
('Community Partnership Count', 'Active collaborations', 'sustainability', 'social', 'calculate_ugc_volume', 'number', 'partners', 611, 'handshake', 'purple'),
('Diversity & Inclusion Score', 'Workforce diversity metrics', 'sustainability', 'social', 'calculate_staff_utilization', 'number', 'score', 612, 'users', 'rainbow'),
('Accessibility Compliance Rate', 'ADA requirements met', 'sustainability', 'social', 'calculate_timeline_adherence', 'percentage', '%', 613, 'accessibility', 'blue'),
('Economic Impact Multiplier', 'Local economic activity', 'sustainability', 'social', 'calculate_roi', 'ratio', 'multiplier', 614, 'trending-up', 'green'),
('Social Equity Ticket Program', 'Discounted tickets for underserved', 'sustainability', 'social', 'calculate_ticket_conversion_rate', 'number', 'tickets', 615, 'ticket', 'teal');

-- =====================================================
-- TECHNOLOGY & INNOVATION REPORTS (10)
-- =====================================================

INSERT INTO report_presets (name, description, category, subcategory, kpi_function, display_format, unit, sort_order, icon, color) VALUES
('Platform Uptime Percentage', 'Available time percentage', 'technology', 'platform', 'calculate_platform_uptime', 'percentage', '%', 701, 'server', 'green'),
('Mobile App Download Rate', 'Downloads per attendee', 'technology', 'platform', 'calculate_app_download_rate', 'percentage', '%', 702, 'smartphone', 'blue'),
('Platform Active User Rate', 'Active vs registered users', 'technology', 'platform', 'calculate_attendance_rate', 'percentage', '%', 703, 'users', 'purple'),
('Feature Adoption Rate', 'Feature users percentage', 'technology', 'platform', 'calculate_ticket_conversion_rate', 'percentage', '%', 704, 'toggle-right', 'cyan'),
('API Response Time', 'Average milliseconds', 'technology', 'platform', 'calculate_vendor_response_time', 'number', 'ms', 705, 'activity', 'yellow'),
('Data Processing Accuracy', 'Correct records percentage', 'technology', 'platform', 'calculate_timeline_adherence', 'percentage', '%', 706, 'check-circle', 'green'),
('Integration Success Rate', 'Successful syncs', 'technology', 'platform', 'calculate_timeline_adherence', 'percentage', '%', 707, 'link', 'teal'),
('User Error Rate', 'Errors per action', 'technology', 'platform', 'calculate_security_incident_rate', 'percentage', '%', 708, 'alert-circle', 'red'),
('Technology Cost Per Attendee', 'Tech spend per person', 'technology', 'platform', 'calculate_cost_per_attendee', 'currency', 'USD', 709, 'cpu', 'blue'),
('Innovation ROI', 'Revenue from new tech', 'technology', 'platform', 'calculate_roi', 'percentage', '%', 710, 'trending-up', 'emerald');

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function to get all report presets by category
CREATE OR REPLACE FUNCTION get_report_presets_by_category(p_category TEXT)
RETURNS TABLE (
    id TEXT,
    name TEXT,
    description TEXT,
    subcategory TEXT,
    kpi_function TEXT,
    display_format TEXT,
    unit TEXT,
    icon TEXT,
    color TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        rp.id,
        rp.name,
        rp.description,
        rp.subcategory,
        rp.kpi_function,
        rp.display_format,
        rp.unit,
        rp.icon,
        rp.color
    FROM report_presets rp
    WHERE rp.category = p_category
    AND rp.is_global = true
    AND rp.is_active = true
    ORDER BY rp.sort_order;
END;
$$ LANGUAGE plpgsql;

-- Function to get user's favorite reports
CREATE OR REPLACE FUNCTION get_user_favorite_reports(p_user_id TEXT)
RETURNS TABLE (
    preset_id TEXT,
    preset_name TEXT,
    category TEXT,
    kpi_function TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        rp.id,
        COALESCE(urp.custom_name, rp.name),
        rp.category,
        rp.kpi_function
    FROM user_report_preferences urp
    INNER JOIN report_presets rp ON rp.id = urp.preset_id
    WHERE urp.user_id = p_user_id
    AND urp.is_favorite = true
    AND urp.is_visible = true
    ORDER BY urp.dashboard_position NULLS LAST;
END;
$$ LANGUAGE plpgsql;

-- Function to get all categories with report counts
CREATE OR REPLACE FUNCTION get_report_categories_summary()
RETURNS TABLE (
    category TEXT,
    report_count BIGINT,
    subcategories TEXT[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        rp.category,
        COUNT(*),
        ARRAY_AGG(DISTINCT rp.subcategory ORDER BY rp.subcategory)
    FROM report_presets rp
    WHERE rp.is_global = true
    AND rp.is_active = true
    GROUP BY rp.category
    ORDER BY rp.category;
END;
$$ LANGUAGE plpgsql;
