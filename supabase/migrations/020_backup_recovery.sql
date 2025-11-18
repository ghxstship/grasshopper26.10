-- =====================================================
-- BACKUP & RECOVERY
-- Point-in-time recovery and backup management
-- =====================================================

-- Create backup metadata table
CREATE TABLE IF NOT EXISTS backup_metadata (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    backup_type TEXT NOT NULL CHECK (backup_type IN ('full', 'incremental', 'differential')),
    backup_status TEXT NOT NULL CHECK (backup_status IN ('in_progress', 'completed', 'failed')),
    backup_location TEXT,
    backup_size_bytes BIGINT,
    tables_included TEXT[],
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    error_message TEXT,
    metadata JSONB
);

CREATE INDEX IF NOT EXISTS idx_backup_metadata_status ON backup_metadata(backup_status, started_at);
CREATE INDEX IF NOT EXISTS idx_backup_metadata_type ON backup_metadata(backup_type, started_at);

-- Create change tracking table for incremental backups
CREATE TABLE IF NOT EXISTS change_tracking (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    table_name TEXT NOT NULL,
    record_id TEXT NOT NULL,
    operation TEXT NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),
    changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    changed_by TEXT,
    old_data JSONB,
    new_data JSONB
);

CREATE INDEX IF NOT EXISTS idx_change_tracking_table ON change_tracking(table_name, changed_at);
CREATE INDEX IF NOT EXISTS idx_change_tracking_record ON change_tracking(table_name, record_id, changed_at);

-- Function to track changes for backup
CREATE OR REPLACE FUNCTION track_changes()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO change_tracking (table_name, record_id, operation, changed_by, old_data, new_data)
    VALUES (
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        TG_OP,
        current_setting('app.current_user_id', TRUE),
        CASE WHEN TG_OP IN ('UPDATE', 'DELETE') THEN to_jsonb(OLD) ELSE NULL END,
        CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END
    );
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Function to create backup metadata record
CREATE OR REPLACE FUNCTION create_backup_record(
    p_backup_type TEXT,
    p_tables TEXT[] DEFAULT NULL
)
RETURNS TEXT AS $$
DECLARE
    v_backup_id TEXT;
BEGIN
    INSERT INTO backup_metadata (backup_type, backup_status, tables_included)
    VALUES (p_backup_type, 'in_progress', p_tables)
    RETURNING id INTO v_backup_id;
    
    RETURN v_backup_id;
END;
$$ LANGUAGE plpgsql;

-- Function to complete backup
CREATE OR REPLACE FUNCTION complete_backup(
    p_backup_id TEXT,
    p_location TEXT,
    p_size_bytes BIGINT
)
RETURNS void AS $$
BEGIN
    UPDATE backup_metadata
    SET backup_status = 'completed',
        completed_at = NOW(),
        backup_location = p_location,
        backup_size_bytes = p_size_bytes
    WHERE id = p_backup_id;
END;
$$ LANGUAGE plpgsql;

-- Function to fail backup
CREATE OR REPLACE FUNCTION fail_backup(
    p_backup_id TEXT,
    p_error TEXT
)
RETURNS void AS $$
BEGIN
    UPDATE backup_metadata
    SET backup_status = 'failed',
        completed_at = NOW(),
        error_message = p_error
    WHERE id = p_backup_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get database size
CREATE OR REPLACE FUNCTION get_database_size()
RETURNS TABLE (
    database_name TEXT,
    size_bytes BIGINT,
    size_pretty TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        current_database()::TEXT,
        pg_database_size(current_database()),
        pg_size_pretty(pg_database_size(current_database()));
END;
$$ LANGUAGE plpgsql;

-- Function to get table sizes
CREATE OR REPLACE FUNCTION get_table_sizes()
RETURNS TABLE (
    schema_name TEXT,
    table_name TEXT,
    row_count BIGINT,
    total_size_bytes BIGINT,
    total_size_pretty TEXT,
    table_size_bytes BIGINT,
    indexes_size_bytes BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        schemaname::TEXT,
        tablename::TEXT,
        n_live_tup as row_count,
        pg_total_relation_size(schemaname || '.' || tablename)::BIGINT,
        pg_size_pretty(pg_total_relation_size(schemaname || '.' || tablename)),
        pg_relation_size(schemaname || '.' || tablename)::BIGINT,
        pg_indexes_size(schemaname || '.' || tablename)::BIGINT
    FROM pg_stat_user_tables
    ORDER BY pg_total_relation_size(schemaname || '.' || tablename) DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to estimate backup size
CREATE OR REPLACE FUNCTION estimate_backup_size(p_tables TEXT[] DEFAULT NULL)
RETURNS BIGINT AS $$
DECLARE
    v_total_size BIGINT := 0;
BEGIN
    IF p_tables IS NULL THEN
        -- Full backup
        SELECT pg_database_size(current_database()) INTO v_total_size;
    ELSE
        -- Specific tables
        SELECT SUM(pg_total_relation_size(table_name))
        INTO v_total_size
        FROM unnest(p_tables) AS table_name;
    END IF;
    
    RETURN v_total_size;
END;
$$ LANGUAGE plpgsql;

-- Function to cleanup old change tracking records
CREATE OR REPLACE FUNCTION cleanup_change_tracking(p_days_to_keep INTEGER DEFAULT 30)
RETURNS INTEGER AS $$
DECLARE
    v_deleted INTEGER;
BEGIN
    DELETE FROM change_tracking
    WHERE changed_at < NOW() - (p_days_to_keep || ' days')::INTERVAL;
    
    GET DIAGNOSTICS v_deleted = ROW_COUNT;
    RETURN v_deleted;
END;
$$ LANGUAGE plpgsql;

-- Function to get backup history
CREATE OR REPLACE FUNCTION get_backup_history(p_limit INTEGER DEFAULT 50)
RETURNS TABLE (
    id TEXT,
    backup_type TEXT,
    backup_status TEXT,
    backup_size_pretty TEXT,
    duration_seconds INTEGER,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        bm.id,
        bm.backup_type,
        bm.backup_status,
        pg_size_pretty(bm.backup_size_bytes),
        EXTRACT(EPOCH FROM (bm.completed_at - bm.started_at))::INTEGER,
        bm.started_at,
        bm.completed_at
    FROM backup_metadata bm
    ORDER BY bm.started_at DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Function to verify backup integrity
CREATE OR REPLACE FUNCTION verify_backup_integrity(p_backup_id TEXT)
RETURNS TABLE (
    check_name TEXT,
    status TEXT,
    details TEXT
) AS $$
DECLARE
    v_backup RECORD;
BEGIN
    SELECT * INTO v_backup FROM backup_metadata WHERE id = p_backup_id;
    
    IF NOT FOUND THEN
        RETURN QUERY SELECT 'backup_exists'::TEXT, 'FAIL'::TEXT, 'Backup record not found'::TEXT;
        RETURN;
    END IF;
    
    -- Check backup status
    RETURN QUERY SELECT 
        'backup_status'::TEXT,
        CASE WHEN v_backup.backup_status = 'completed' THEN 'PASS' ELSE 'FAIL' END::TEXT,
        'Backup status: ' || v_backup.backup_status::TEXT;
    
    -- Check backup size
    RETURN QUERY SELECT 
        'backup_size'::TEXT,
        CASE WHEN v_backup.backup_size_bytes > 0 THEN 'PASS' ELSE 'FAIL' END::TEXT,
        'Backup size: ' || pg_size_pretty(v_backup.backup_size_bytes)::TEXT;
    
    -- Check backup location
    RETURN QUERY SELECT 
        'backup_location'::TEXT,
        CASE WHEN v_backup.backup_location IS NOT NULL THEN 'PASS' ELSE 'FAIL' END::TEXT,
        'Location: ' || COALESCE(v_backup.backup_location, 'Not specified')::TEXT;
END;
$$ LANGUAGE plpgsql;

-- Create snapshot table for point-in-time recovery
CREATE TABLE IF NOT EXISTS database_snapshots (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    snapshot_name TEXT NOT NULL UNIQUE,
    description TEXT,
    snapshot_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    tables_snapshot JSONB NOT NULL,
    created_by TEXT,
    metadata JSONB
);

CREATE INDEX IF NOT EXISTS idx_snapshots_time ON database_snapshots(snapshot_time);

-- Function to create snapshot metadata
CREATE OR REPLACE FUNCTION create_snapshot(
    p_snapshot_name TEXT,
    p_description TEXT DEFAULT NULL
)
RETURNS TEXT AS $$
DECLARE
    v_snapshot_id TEXT;
    v_tables_data JSONB;
BEGIN
    -- Collect table row counts
    SELECT jsonb_object_agg(
        tablename,
        jsonb_build_object(
            'row_count', n_live_tup,
            'size_bytes', pg_total_relation_size(schemaname || '.' || tablename)
        )
    ) INTO v_tables_data
    FROM pg_stat_user_tables;
    
    INSERT INTO database_snapshots (snapshot_name, description, tables_snapshot, created_by)
    VALUES (p_snapshot_name, p_description, v_tables_data, current_setting('app.current_user_id', TRUE))
    RETURNING id INTO v_snapshot_id;
    
    RETURN v_snapshot_id;
END;
$$ LANGUAGE plpgsql;

-- Backup statistics view
CREATE OR REPLACE VIEW backup_statistics AS
SELECT 
    backup_type,
    COUNT(*) as total_backups,
    COUNT(*) FILTER (WHERE backup_status = 'completed') as successful_backups,
    COUNT(*) FILTER (WHERE backup_status = 'failed') as failed_backups,
    AVG(backup_size_bytes) FILTER (WHERE backup_status = 'completed') as avg_backup_size,
    pg_size_pretty(AVG(backup_size_bytes) FILTER (WHERE backup_status = 'completed')::BIGINT) as avg_backup_size_pretty,
    AVG(EXTRACT(EPOCH FROM (completed_at - started_at))) FILTER (WHERE backup_status = 'completed') as avg_duration_seconds,
    MAX(started_at) as last_backup_time
FROM backup_metadata
GROUP BY backup_type;
