-- =====================================================
-- CACHING LAYER
-- Database-level caching for frequently accessed data
-- =====================================================

-- Create cache table for query results
CREATE TABLE IF NOT EXISTS query_cache (
    cache_key TEXT PRIMARY KEY,
    cache_value JSONB NOT NULL,
    cache_tags TEXT[],
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    accessed_count INTEGER DEFAULT 0,
    last_accessed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_query_cache_expires ON query_cache(expires_at);
CREATE INDEX IF NOT EXISTS idx_query_cache_tags ON query_cache USING GIN(cache_tags);

-- Function to get cached value
CREATE OR REPLACE FUNCTION get_cache(p_key TEXT)
RETURNS JSONB AS $$
DECLARE
    v_value JSONB;
BEGIN
    SELECT cache_value INTO v_value
    FROM query_cache
    WHERE cache_key = p_key
    AND expires_at > NOW();
    
    IF FOUND THEN
        -- Update access stats
        UPDATE query_cache
        SET accessed_count = accessed_count + 1,
            last_accessed_at = NOW()
        WHERE cache_key = p_key;
    END IF;
    
    RETURN v_value;
END;
$$ LANGUAGE plpgsql;

-- Function to set cache value
CREATE OR REPLACE FUNCTION set_cache(
    p_key TEXT,
    p_value JSONB,
    p_ttl_seconds INTEGER DEFAULT 3600,
    p_tags TEXT[] DEFAULT ARRAY[]::TEXT[]
)
RETURNS void AS $$
BEGIN
    INSERT INTO query_cache (cache_key, cache_value, cache_tags, expires_at)
    VALUES (p_key, p_value, p_tags, NOW() + (p_ttl_seconds || ' seconds')::INTERVAL)
    ON CONFLICT (cache_key) 
    DO UPDATE SET 
        cache_value = EXCLUDED.cache_value,
        cache_tags = EXCLUDED.cache_tags,
        expires_at = EXCLUDED.expires_at,
        created_at = NOW(),
        accessed_count = 0;
END;
$$ LANGUAGE plpgsql;

-- Function to invalidate cache by key
CREATE OR REPLACE FUNCTION invalidate_cache(p_key TEXT)
RETURNS void AS $$
BEGIN
    DELETE FROM query_cache WHERE cache_key = p_key;
END;
$$ LANGUAGE plpgsql;

-- Function to invalidate cache by tags
CREATE OR REPLACE FUNCTION invalidate_cache_by_tags(p_tags TEXT[])
RETURNS INTEGER AS $$
DECLARE
    v_deleted INTEGER;
BEGIN
    DELETE FROM query_cache
    WHERE cache_tags && p_tags;
    
    GET DIAGNOSTICS v_deleted = ROW_COUNT;
    RETURN v_deleted;
END;
$$ LANGUAGE plpgsql;

-- Function to clean expired cache entries
CREATE OR REPLACE FUNCTION cleanup_expired_cache()
RETURNS INTEGER AS $$
DECLARE
    v_deleted INTEGER;
BEGIN
    DELETE FROM query_cache WHERE expires_at < NOW();
    GET DIAGNOSTICS v_deleted = ROW_COUNT;
    RETURN v_deleted;
END;
$$ LANGUAGE plpgsql;

-- Create session cache table for user sessions
CREATE TABLE IF NOT EXISTS session_cache (
    session_id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    session_data JSONB NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_session_cache_user ON session_cache(user_id);
CREATE INDEX IF NOT EXISTS idx_session_cache_expires ON session_cache(expires_at);

-- Function to get session
CREATE OR REPLACE FUNCTION get_session(p_session_id TEXT)
RETURNS JSONB AS $$
DECLARE
    v_data JSONB;
BEGIN
    SELECT session_data INTO v_data
    FROM session_cache
    WHERE session_id = p_session_id
    AND expires_at > NOW();
    
    IF FOUND THEN
        UPDATE session_cache
        SET updated_at = NOW()
        WHERE session_id = p_session_id;
    END IF;
    
    RETURN v_data;
END;
$$ LANGUAGE plpgsql;

-- Function to set session
CREATE OR REPLACE FUNCTION set_session(
    p_session_id TEXT,
    p_user_id TEXT,
    p_data JSONB,
    p_ttl_seconds INTEGER DEFAULT 86400
)
RETURNS void AS $$
BEGIN
    INSERT INTO session_cache (session_id, user_id, session_data, expires_at)
    VALUES (p_session_id, p_user_id, p_data, NOW() + (p_ttl_seconds || ' seconds')::INTERVAL)
    ON CONFLICT (session_id)
    DO UPDATE SET
        session_data = EXCLUDED.session_data,
        expires_at = EXCLUDED.expires_at,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to delete session
CREATE OR REPLACE FUNCTION delete_session(p_session_id TEXT)
RETURNS void AS $$
BEGIN
    DELETE FROM session_cache WHERE session_id = p_session_id;
END;
$$ LANGUAGE plpgsql;

-- Function to cleanup expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
    v_deleted INTEGER;
BEGIN
    DELETE FROM session_cache WHERE expires_at < NOW();
    GET DIAGNOSTICS v_deleted = ROW_COUNT;
    RETURN v_deleted;
END;
$$ LANGUAGE plpgsql;

-- Cache statistics view
CREATE OR REPLACE VIEW cache_statistics AS
SELECT 
    COUNT(*) as total_entries,
    COUNT(*) FILTER (WHERE expires_at > NOW()) as active_entries,
    COUNT(*) FILTER (WHERE expires_at <= NOW()) as expired_entries,
    SUM(accessed_count) as total_accesses,
    AVG(accessed_count) as avg_accesses_per_entry,
    pg_size_pretty(pg_total_relation_size('query_cache')) as cache_size
FROM query_cache;

-- Popular cache keys view
CREATE OR REPLACE VIEW popular_cache_keys AS
SELECT 
    cache_key,
    accessed_count,
    last_accessed_at,
    expires_at,
    EXTRACT(EPOCH FROM (expires_at - NOW())) as seconds_until_expiry
FROM query_cache
WHERE expires_at > NOW()
ORDER BY accessed_count DESC
LIMIT 100;

-- Auto-invalidate cache on data changes
CREATE OR REPLACE FUNCTION auto_invalidate_cache()
RETURNS TRIGGER AS $$
BEGIN
    -- Invalidate relevant cache entries based on table
    IF TG_TABLE_NAME = 'events' THEN
        PERFORM invalidate_cache_by_tags(ARRAY['events', 'event:' || COALESCE(NEW.id, OLD.id)]);
    ELSIF TG_TABLE_NAME = 'tickets' THEN
        PERFORM invalidate_cache_by_tags(ARRAY['tickets', 'event:' || COALESCE(NEW."eventId", OLD."eventId")]);
    ELSIF TG_TABLE_NAME = 'orders' THEN
        PERFORM invalidate_cache_by_tags(ARRAY['orders', 'user:' || COALESCE(NEW."userId", OLD."userId")]);
    ELSIF TG_TABLE_NAME = 'products' THEN
        PERFORM invalidate_cache_by_tags(ARRAY['products', 'product:' || COALESCE(NEW.id, OLD.id)]);
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Apply cache invalidation triggers
CREATE TRIGGER events_cache_invalidation
    AFTER INSERT OR UPDATE OR DELETE ON events
    FOR EACH ROW EXECUTE FUNCTION auto_invalidate_cache();

CREATE TRIGGER tickets_cache_invalidation
    AFTER INSERT OR UPDATE OR DELETE ON tickets
    FOR EACH ROW EXECUTE FUNCTION auto_invalidate_cache();

CREATE TRIGGER orders_cache_invalidation
    AFTER INSERT OR UPDATE OR DELETE ON orders
    FOR EACH ROW EXECUTE FUNCTION auto_invalidate_cache();

CREATE TRIGGER products_cache_invalidation
    AFTER INSERT OR UPDATE OR DELETE ON products
    FOR EACH ROW EXECUTE FUNCTION auto_invalidate_cache();

-- Schedule cache cleanup (requires pg_cron)
-- Uncomment if pg_cron is available:
-- SELECT cron.schedule('cleanup-cache', '*/15 * * * *', 'SELECT cleanup_expired_cache(), cleanup_expired_sessions()');
