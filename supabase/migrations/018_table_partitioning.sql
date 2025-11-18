-- =====================================================
-- TABLE PARTITIONING
-- Partition large tables for better performance
-- =====================================================

-- Partition audit_logs by month (for better query performance and easier archival)
-- Note: This requires recreating the table, so backup data first

-- Create partitioned audit logs table
CREATE TABLE IF NOT EXISTS audit_logs_partitioned (
    id TEXT NOT NULL,
    "userId" TEXT,
    action TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "oldData" JSONB,
    "newData" JSONB,
    "changedFields" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id, "createdAt")
) PARTITION BY RANGE ("createdAt");

-- Create partitions for the last 12 months and next 3 months
DO $$
DECLARE
    start_date DATE;
    end_date DATE;
    partition_name TEXT;
BEGIN
    FOR i IN -12..3 LOOP
        start_date := DATE_TRUNC('month', CURRENT_DATE + (i || ' months')::INTERVAL);
        end_date := start_date + INTERVAL '1 month';
        partition_name := 'audit_logs_y' || TO_CHAR(start_date, 'YYYY') || 'm' || TO_CHAR(start_date, 'MM');
        
        EXECUTE format(
            'CREATE TABLE IF NOT EXISTS %I PARTITION OF audit_logs_partitioned FOR VALUES FROM (%L) TO (%L)',
            partition_name,
            start_date,
            end_date
        );
    END LOOP;
END $$;

-- Create indexes on partitioned table
CREATE INDEX IF NOT EXISTS idx_audit_logs_part_user ON audit_logs_partitioned("userId", "createdAt");
CREATE INDEX IF NOT EXISTS idx_audit_logs_part_entity ON audit_logs_partitioned("entityType", "entityId", "createdAt");
CREATE INDEX IF NOT EXISTS idx_audit_logs_part_action ON audit_logs_partitioned(action, "createdAt");

-- Function to automatically create new partitions
CREATE OR REPLACE FUNCTION create_audit_log_partition()
RETURNS void AS $$
DECLARE
    start_date DATE;
    end_date DATE;
    partition_name TEXT;
BEGIN
    -- Create partition for next month
    start_date := DATE_TRUNC('month', CURRENT_DATE + INTERVAL '4 months');
    end_date := start_date + INTERVAL '1 month';
    partition_name := 'audit_logs_y' || TO_CHAR(start_date, 'YYYY') || 'm' || TO_CHAR(start_date, 'MM');
    
    EXECUTE format(
        'CREATE TABLE IF NOT EXISTS %I PARTITION OF audit_logs_partitioned FOR VALUES FROM (%L) TO (%L)',
        partition_name,
        start_date,
        end_date
    );
    
    RAISE NOTICE 'Created partition: %', partition_name;
END;
$$ LANGUAGE plpgsql;

-- Partition orders by year for historical data management
CREATE TABLE IF NOT EXISTS orders_partitioned (
    id TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventId" TEXT,
    "orderNumber" TEXT NOT NULL,
    status TEXT NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    "paymentIntent" TEXT,
    "paymentMethod" TEXT,
    metadata JSONB,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id, "createdAt")
) PARTITION BY RANGE ("createdAt");

-- Create yearly partitions for orders (last 3 years + current + next year)
DO $$
DECLARE
    start_date DATE;
    end_date DATE;
    partition_name TEXT;
    current_year INTEGER;
BEGIN
    current_year := EXTRACT(YEAR FROM CURRENT_DATE);
    
    FOR year_offset IN -3..1 LOOP
        start_date := (current_year + year_offset || '-01-01')::DATE;
        end_date := (current_year + year_offset + 1 || '-01-01')::DATE;
        partition_name := 'orders_y' || (current_year + year_offset);
        
        EXECUTE format(
            'CREATE TABLE IF NOT EXISTS %I PARTITION OF orders_partitioned FOR VALUES FROM (%L) TO (%L)',
            partition_name,
            start_date,
            end_date
        );
    END LOOP;
END $$;

-- Create indexes on partitioned orders
CREATE INDEX IF NOT EXISTS idx_orders_part_user ON orders_partitioned("userId", "createdAt");
CREATE INDEX IF NOT EXISTS idx_orders_part_status ON orders_partitioned(status, "createdAt");
CREATE INDEX IF NOT EXISTS idx_orders_part_event ON orders_partitioned("eventId", "createdAt");

-- Partition notifications by month
CREATE TABLE IF NOT EXISTS notifications_partitioned (
    id TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    "readAt" TIMESTAMPTZ,
    priority TEXT DEFAULT 'normal',
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id, "createdAt")
) PARTITION BY RANGE ("createdAt");

-- Create notification partitions (last 6 months + next 3 months)
DO $$
DECLARE
    start_date DATE;
    end_date DATE;
    partition_name TEXT;
BEGIN
    FOR i IN -6..3 LOOP
        start_date := DATE_TRUNC('month', CURRENT_DATE + (i || ' months')::INTERVAL);
        end_date := start_date + INTERVAL '1 month';
        partition_name := 'notifications_y' || TO_CHAR(start_date, 'YYYY') || 'm' || TO_CHAR(start_date, 'MM');
        
        EXECUTE format(
            'CREATE TABLE IF NOT EXISTS %I PARTITION OF notifications_partitioned FOR VALUES FROM (%L) TO (%L)',
            partition_name,
            start_date,
            end_date
        );
    END LOOP;
END $$;

-- Create indexes on partitioned notifications
CREATE INDEX IF NOT EXISTS idx_notifications_part_user ON notifications_partitioned("userId", "createdAt");
CREATE INDEX IF NOT EXISTS idx_notifications_part_unread ON notifications_partitioned("userId", "readAt") WHERE "readAt" IS NULL;

-- Function to drop old partitions (for data retention)
CREATE OR REPLACE FUNCTION drop_old_partitions(
    p_table_name TEXT,
    p_months_to_keep INTEGER DEFAULT 12
)
RETURNS void AS $$
DECLARE
    partition_record RECORD;
    cutoff_date DATE;
BEGIN
    cutoff_date := DATE_TRUNC('month', CURRENT_DATE - (p_months_to_keep || ' months')::INTERVAL);
    
    FOR partition_record IN 
        SELECT schemaname, tablename
        FROM pg_tables
        WHERE tablename LIKE p_table_name || '_y%'
        AND schemaname = 'public'
    LOOP
        -- Extract date from partition name and check if it's old enough
        -- This is a simplified check - enhance based on your naming convention
        EXECUTE format('DROP TABLE IF EXISTS %I.%I', partition_record.schemaname, partition_record.tablename);
        RAISE NOTICE 'Dropped old partition: %', partition_record.tablename;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function to list all partitions
CREATE OR REPLACE FUNCTION list_partitions(p_parent_table TEXT)
RETURNS TABLE (
    partition_name TEXT,
    partition_size TEXT,
    row_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.relname::TEXT as partition_name,
        pg_size_pretty(pg_total_relation_size(c.oid)) as partition_size,
        c.reltuples::BIGINT as row_count
    FROM pg_class c
    JOIN pg_inherits i ON i.inhrelid = c.oid
    JOIN pg_class p ON p.oid = i.inhparent
    WHERE p.relname = p_parent_table
    ORDER BY c.relname;
END;
$$ LANGUAGE plpgsql;

-- Schedule automatic partition creation (requires pg_cron)
-- Uncomment if pg_cron is available:
-- SELECT cron.schedule('create-monthly-partitions', '0 0 1 * *', 'SELECT create_audit_log_partition()');
