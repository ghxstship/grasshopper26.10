-- =====================================================
-- AUDIT & COMPLIANCE
-- Enhanced audit logging and data retention policies
-- =====================================================

-- Function to automatically log all table changes
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
DECLARE
    v_user_id TEXT;
    v_old_data JSONB;
    v_new_data JSONB;
    v_changed_fields JSONB;
BEGIN
    -- Get current user ID from session
    v_user_id := COALESCE(
        current_setting('app.current_user_id', TRUE),
        auth.uid()::text
    );
    
    -- Prepare data based on operation
    IF TG_OP = 'DELETE' THEN
        v_old_data := to_jsonb(OLD);
        v_new_data := NULL;
    ELSIF TG_OP = 'UPDATE' THEN
        v_old_data := to_jsonb(OLD);
        v_new_data := to_jsonb(NEW);
        
        -- Calculate changed fields
        v_changed_fields := jsonb_object_agg(
            key,
            jsonb_build_object('old', v_old_data->key, 'new', v_new_data->key)
        ) FROM jsonb_each(v_new_data)
        WHERE v_old_data->key IS DISTINCT FROM v_new_data->key;
    ELSIF TG_OP = 'INSERT' THEN
        v_old_data := NULL;
        v_new_data := to_jsonb(NEW);
    END IF;
    
    -- Insert audit log
    INSERT INTO audit_logs (
        "userId",
        action,
        "entityType",
        "entityId",
        "oldData",
        "newData",
        "changedFields",
        "ipAddress",
        "userAgent",
        "createdAt"
    ) VALUES (
        v_user_id,
        TG_OP,
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        v_old_data,
        v_new_data,
        v_changed_fields,
        current_setting('app.client_ip', TRUE),
        current_setting('app.user_agent', TRUE),
        NOW()
    );
    
    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply audit triggers to critical tables
CREATE TRIGGER audit_users AFTER INSERT OR UPDATE OR DELETE ON users
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_orders AFTER INSERT OR UPDATE OR DELETE ON orders
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_tickets AFTER INSERT OR UPDATE OR DELETE ON tickets
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_payments AFTER INSERT OR UPDATE OR DELETE ON orders
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_memberships AFTER INSERT OR UPDATE OR DELETE ON memberships
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_advancing_requests AFTER INSERT OR UPDATE OR DELETE ON advancing_requests
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_budgets AFTER INSERT OR UPDATE OR DELETE ON budgets
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_expenses AFTER INSERT OR UPDATE OR DELETE ON expenses
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- Data retention policy function
CREATE OR REPLACE FUNCTION apply_data_retention_policies()
RETURNS TABLE (
    table_name TEXT,
    rows_deleted INTEGER
) AS $$
DECLARE
    v_deleted INTEGER;
BEGIN
    -- Delete old audit logs (keep 1 year)
    DELETE FROM audit_logs WHERE "createdAt" < NOW() - INTERVAL '1 year';
    GET DIAGNOSTICS v_deleted = ROW_COUNT;
    RETURN QUERY SELECT 'audit_logs'::TEXT, v_deleted;
    
    -- Delete old sessions (keep 90 days)
    DELETE FROM sessions WHERE expires < NOW() - INTERVAL '90 days';
    GET DIAGNOSTICS v_deleted = ROW_COUNT;
    RETURN QUERY SELECT 'sessions'::TEXT, v_deleted;
    
    -- Delete old email verification tokens (keep 30 days)
    DELETE FROM email_verification_tokens WHERE "createdAt" < NOW() - INTERVAL '30 days';
    GET DIAGNOSTICS v_deleted = ROW_COUNT;
    RETURN QUERY SELECT 'email_verification_tokens'::TEXT, v_deleted;
    
    -- Delete old password reset tokens (keep 30 days)
    DELETE FROM password_reset_tokens WHERE "createdAt" < NOW() - INTERVAL '30 days';
    GET DIAGNOSTICS v_deleted = ROW_COUNT;
    RETURN QUERY SELECT 'password_reset_tokens'::TEXT, v_deleted;
    
    -- Archive old completed orders (move to archive table after 2 years)
    -- This is a placeholder - implement based on your archival strategy
    
    -- Delete old notifications (keep 90 days)
    DELETE FROM notifications WHERE "createdAt" < NOW() - INTERVAL '90 days' AND "readAt" IS NOT NULL;
    GET DIAGNOSTICS v_deleted = ROW_COUNT;
    RETURN QUERY SELECT 'notifications'::TEXT, v_deleted;
    
    -- Delete old QR scans (keep 1 year)
    DELETE FROM qr_scans WHERE "scannedAt" < NOW() - INTERVAL '1 year';
    GET DIAGNOSTICS v_deleted = ROW_COUNT;
    RETURN QUERY SELECT 'qr_scans'::TEXT, v_deleted;
END;
$$ LANGUAGE plpgsql;

-- GDPR compliance: User data export function
CREATE OR REPLACE FUNCTION export_user_data(p_user_id TEXT)
RETURNS JSONB AS $$
DECLARE
    v_data JSONB;
BEGIN
    SELECT jsonb_build_object(
        'user', (SELECT row_to_json(u.*) FROM users u WHERE id = p_user_id),
        'tickets', (SELECT jsonb_agg(row_to_json(t.*)) FROM tickets t WHERE "userId" = p_user_id),
        'orders', (SELECT jsonb_agg(row_to_json(o.*)) FROM orders o WHERE "userId" = p_user_id),
        'social_posts', (SELECT jsonb_agg(row_to_json(sp.*)) FROM social_posts sp WHERE "userId" = p_user_id),
        'social_comments', (SELECT jsonb_agg(row_to_json(sc.*)) FROM social_comments sc WHERE "userId" = p_user_id),
        'memberships', (SELECT jsonb_agg(row_to_json(m.*)) FROM memberships m WHERE "userId" = p_user_id),
        'wishlists', (SELECT jsonb_agg(row_to_json(w.*)) FROM wishlists w WHERE "userId" = p_user_id),
        'notifications', (SELECT jsonb_agg(row_to_json(n.*)) FROM notifications n WHERE "userId" = p_user_id),
        'audit_logs', (SELECT jsonb_agg(row_to_json(al.*)) FROM audit_logs al WHERE "userId" = p_user_id)
    ) INTO v_data;
    
    RETURN v_data;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- GDPR compliance: User data deletion function
CREATE OR REPLACE FUNCTION delete_user_data(p_user_id TEXT, p_anonymize BOOLEAN DEFAULT FALSE)
RETURNS BOOLEAN AS $$
BEGIN
    IF p_anonymize THEN
        -- Anonymize instead of delete (for data integrity)
        UPDATE users SET
            email = 'deleted_' || id || '@deleted.local',
            name = 'Deleted User',
            bio = NULL,
            image = NULL,
            password = NULL,
            "emailVerified" = NULL
        WHERE id = p_user_id;
        
        -- Anonymize related data
        UPDATE social_posts SET "userId" = NULL WHERE "userId" = p_user_id;
        UPDATE social_comments SET "userId" = NULL WHERE "userId" = p_user_id;
    ELSE
        -- Hard delete (use with caution)
        DELETE FROM tickets WHERE "userId" = p_user_id;
        DELETE FROM orders WHERE "userId" = p_user_id;
        DELETE FROM social_posts WHERE "userId" = p_user_id;
        DELETE FROM social_comments WHERE "userId" = p_user_id;
        DELETE FROM social_likes WHERE "userId" = p_user_id;
        DELETE FROM follows WHERE "followerId" = p_user_id OR "followingId" = p_user_id;
        DELETE FROM memberships WHERE "userId" = p_user_id;
        DELETE FROM wishlists WHERE "userId" = p_user_id;
        DELETE FROM notifications WHERE "userId" = p_user_id;
        DELETE FROM sessions WHERE "userId" = p_user_id;
        DELETE FROM accounts WHERE "userId" = p_user_id;
        DELETE FROM users WHERE id = p_user_id;
    END IF;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check data integrity
CREATE OR REPLACE FUNCTION check_data_integrity()
RETURNS TABLE (
    check_name TEXT,
    status TEXT,
    details TEXT
) AS $$
BEGIN
    -- Check for orphaned tickets
    RETURN QUERY
    SELECT 
        'orphaned_tickets'::TEXT,
        CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END::TEXT,
        'Found ' || COUNT(*)::TEXT || ' tickets without valid events'::TEXT
    FROM tickets t
    LEFT JOIN events e ON e.id = t."eventId"
    WHERE e.id IS NULL;
    
    -- Check for orphaned orders
    RETURN QUERY
    SELECT 
        'orphaned_orders'::TEXT,
        CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END::TEXT,
        'Found ' || COUNT(*)::TEXT || ' orders without valid users'::TEXT
    FROM orders o
    LEFT JOIN users u ON u.id = o."userId"
    WHERE u.id IS NULL;
    
    -- Check for invalid ticket statuses
    RETURN QUERY
    SELECT 
        'invalid_ticket_status'::TEXT,
        CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END::TEXT,
        'Found ' || COUNT(*)::TEXT || ' tickets with invalid status'::TEXT
    FROM tickets
    WHERE status NOT IN ('VALID', 'USED', 'TRANSFERRED', 'CANCELLED', 'REFUNDED');
    
    -- Check for negative balances
    RETURN QUERY
    SELECT 
        'negative_balances'::TEXT,
        CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END::TEXT,
        'Found ' || COUNT(*)::TEXT || ' wallets with negative balance'::TEXT
    FROM wallets
    WHERE balance < 0;
END;
$$ LANGUAGE plpgsql;

-- Compliance report function
CREATE OR REPLACE FUNCTION generate_compliance_report(
    p_start_date TIMESTAMPTZ,
    p_end_date TIMESTAMPTZ
)
RETURNS JSONB AS $$
DECLARE
    v_report JSONB;
BEGIN
    SELECT jsonb_build_object(
        'period', jsonb_build_object(
            'start', p_start_date,
            'end', p_end_date
        ),
        'user_activity', jsonb_build_object(
            'new_users', (SELECT COUNT(*) FROM users WHERE "createdAt" BETWEEN p_start_date AND p_end_date),
            'deleted_users', (SELECT COUNT(*) FROM audit_logs WHERE action = 'DELETE' AND "entityType" = 'users' AND "createdAt" BETWEEN p_start_date AND p_end_date),
            'data_exports', (SELECT COUNT(*) FROM audit_logs WHERE action = 'export_user_data' AND "createdAt" BETWEEN p_start_date AND p_end_date)
        ),
        'transactions', jsonb_build_object(
            'total_orders', (SELECT COUNT(*) FROM orders WHERE "createdAt" BETWEEN p_start_date AND p_end_date),
            'total_revenue', (SELECT COALESCE(SUM(total), 0) FROM orders WHERE status = 'COMPLETED' AND "createdAt" BETWEEN p_start_date AND p_end_date),
            'refunds', (SELECT COUNT(*) FROM orders WHERE status = 'REFUNDED' AND "updatedAt" BETWEEN p_start_date AND p_end_date)
        ),
        'security', jsonb_build_object(
            'failed_logins', (SELECT COUNT(*) FROM audit_logs WHERE action = 'failed_login' AND "createdAt" BETWEEN p_start_date AND p_end_date),
            'password_resets', (SELECT COUNT(*) FROM password_reset_tokens WHERE "createdAt" BETWEEN p_start_date AND p_end_date),
            'suspicious_activity', (SELECT COUNT(*) FROM audit_logs WHERE action = 'suspicious_activity' AND "createdAt" BETWEEN p_start_date AND p_end_date)
        ),
        'data_integrity', (SELECT jsonb_agg(row_to_json(c.*)) FROM check_data_integrity() c)
    ) INTO v_report;
    
    RETURN v_report;
END;
$$ LANGUAGE plpgsql;
